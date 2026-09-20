import json
import math
import time
from pathlib import Path

import torch
import torch.nn as nn
from sklearn.metrics import f1_score
from torch.utils.data import DataLoader
from transformers import AutoTokenizer, AutoModelForSequenceClassification, get_linear_schedule_with_warmup

from config import TrainConfig, label2id, id2label
from dataset import RAGTruthDataset, load_and_split_ragtruth


def set_seed(seed: int) -> None:
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False


def save_training_args(output_dir: Path) -> None:
    training_args = {
        key: str(value) if isinstance(value, Path) else value
        for key, value in TrainConfig.__dict__.items()
        if key.isupper()
    }
    training_args_path = output_dir / 'training_args.json'
    training_args_path.write_text(json.dumps(training_args, indent=2), encoding='utf-8')


def train_model() -> None:
    print("=========================================================")
    print(" VeriRAG: DeBERTa-v3 Cross-Encoder Fine-Tuning Pipeline")
    print("=========================================================")

    set_seed(TrainConfig.SEED)

    output_dir = Path(TrainConfig.OUTPUT_DIR)
    logging_dir = Path(TrainConfig.LOGGING_DIR)
    output_dir.mkdir(parents=True, exist_ok=True)
    logging_dir.mkdir(parents=True, exist_ok=True)

    print(f"[1/5] Loading Base Model & Tokenizer: {TrainConfig.BASE_MODEL_NAME}")
    tokenizer = AutoTokenizer.from_pretrained(TrainConfig.BASE_MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(
        TrainConfig.BASE_MODEL_NAME,
        num_labels=TrainConfig.NUM_CLASSES,
        id2label=id2label,
        label2id=label2id
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Device] Running on: {device}")
    model.to(device)

    print(f"[2/5] Loading and Parsing RAGTruth Dataset...")
    train_samples, val_samples, _ = load_and_split_ragtruth(TrainConfig.DATASET_PATH)

    train_ds = RAGTruthDataset(train_samples, tokenizer, max_length=TrainConfig.MAX_SEQ_LENGTH)
    val_ds = RAGTruthDataset(val_samples, tokenizer, max_length=TrainConfig.MAX_SEQ_LENGTH)

    train_loader = DataLoader(train_ds, batch_size=TrainConfig.BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=TrainConfig.EVAL_BATCH_SIZE, shuffle=False)

    class_weights = torch.tensor(TrainConfig.CLASS_WEIGHTS, dtype=torch.float).to(device)
    criterion = nn.CrossEntropyLoss(weight=class_weights)

    optimizer = torch.optim.AdamW(model.parameters(), lr=TrainConfig.LEARNING_RATE, weight_decay=TrainConfig.WEIGHT_DECAY)
    effective_steps = math.ceil(len(train_loader) / TrainConfig.GRADIENT_ACCUMULATION_STEPS)
    total_steps = effective_steps * TrainConfig.NUM_EPOCHS
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=int(total_steps * TrainConfig.WARMUP_RATIO),
        num_training_steps=total_steps
    )

    print(f"[3/5] Starting Fine-Tuning across {TrainConfig.NUM_EPOCHS} Epochs ({total_steps} optimizer steps)...")

    best_val_metric = float('-inf') if TrainConfig.GREATER_IS_BETTER else float('inf')
    no_improve_epochs = 0
    start_time = time.time()

    for epoch in range(1, TrainConfig.NUM_EPOCHS + 1):
        model.train()
        total_train_loss = 0.0

        optimizer.zero_grad()
        for step, batch in enumerate(train_loader, start=1):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            loss = criterion(outputs.logits, labels)
            loss = loss / TrainConfig.GRADIENT_ACCUMULATION_STEPS
            loss.backward()
            total_train_loss += loss.item() * TrainConfig.GRADIENT_ACCUMULATION_STEPS

            if step % TrainConfig.GRADIENT_ACCUMULATION_STEPS == 0 or step == len(train_loader):
                torch.nn.utils.clip_grad_norm_(model.parameters(), TrainConfig.MAX_GRAD_NORM)
                optimizer.step()
                scheduler.step()
                optimizer.zero_grad()

        avg_train_loss = total_train_loss / len(train_loader)

        model.eval()
        val_labels = []
        val_preds = []
        total_val_loss = 0.0

        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch["input_ids"].to(device)
                attention_mask = batch["attention_mask"].to(device)
                labels = batch["labels"].to(device)

                outputs = model(input_ids=input_ids, attention_mask=attention_mask)
                loss = criterion(outputs.logits, labels)
                total_val_loss += loss.item()

                preds = torch.argmax(outputs.logits, dim=1)
                val_labels.extend(labels.cpu().tolist())
                val_preds.extend(preds.cpu().tolist())

        avg_val_loss = total_val_loss / len(val_loader)
        val_f1 = f1_score(val_labels, val_preds, average='macro')

        print(
            f"Epoch {epoch}/{TrainConfig.NUM_EPOCHS} "
            f"| Train Loss: {avg_train_loss:.4f} "
            f"| Val Loss: {avg_val_loss:.4f} "
            f"| Val F1 Macro: {val_f1:.4f}"
        )

        improved = val_f1 > best_val_metric if TrainConfig.GREATER_IS_BETTER else val_f1 < best_val_metric
        if improved:
            best_val_metric = val_f1
            no_improve_epochs = 0
            print(f" --> New best Macro F1: {best_val_metric:.4f}. Saving checkpoint to {output_dir}")
            model.save_pretrained(output_dir)
            tokenizer.save_pretrained(output_dir)
            save_training_args(output_dir)
        else:
            no_improve_epochs += 1
            print(f" --> No improvement for {no_improve_epochs}/{TrainConfig.EARLY_STOPPING_PATIENCE} epochs.")

        if no_improve_epochs >= TrainConfig.EARLY_STOPPING_PATIENCE:
            print(f"[Early Stopping] Stopping after {epoch} epochs with no Macro F1 improvement.")
            break

    elapsed = time.time() - start_time
    print(f"[4/5] Training Completed in {elapsed:.2f} seconds.")
    print(f"[5/5] Best Model Checkpoint Persisted at {output_dir}")


if __name__ == "__main__":
    train_model()
