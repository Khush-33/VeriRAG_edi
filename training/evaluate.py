import time
import torch
import numpy as np
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support, accuracy_score
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from config import TrainConfig, id2label, label2id
from dataset import RAGTruthDataset, load_and_split_ragtruth

def evaluate_models():
    print("=========================================================")
    print(" VeriRAG: Benchmark Evaluation - Baseline vs Fine-Tuned")
    print("=========================================================")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Device] Evaluation running on: {device}")

    _, _, test_samples = load_and_split_ragtruth(TrainConfig.DATASET_PATH)

    # 1. Baseline Pretrained Model (Generic DeBERTa-v3)
    print("\n[Baseline Model] Evaluating Pretrained Base Model...")
    baseline_tokenizer = AutoTokenizer.from_pretrained(TrainConfig.BASE_MODEL_NAME)
    baseline_model = AutoModelForSequenceClassification.from_pretrained(
        TrainConfig.BASE_MODEL_NAME,
        num_labels=TrainConfig.NUM_CLASSES
    ).to(device)

    # 2. Fine-Tuned Model (RAGTruth Fine-Tuned)
    fine_tuned_dir = TrainConfig.OUTPUT_DIR
    print(f"\n[Fine-Tuned Model] Loading Fine-Tuned Checkpoint from {fine_tuned_dir}...")
    try:
        ft_tokenizer = AutoTokenizer.from_pretrained(fine_tuned_dir)
        ft_model = AutoModelForSequenceClassification.from_pretrained(fine_tuned_dir).to(device)
    except Exception as e:
        print(f"[Notice] Fine-tuned checkpoint not loaded ({e}). Using base model as proxy reference.")
        ft_tokenizer = baseline_tokenizer
        ft_model = baseline_model

    test_ds = RAGTruthDataset(test_samples, ft_tokenizer, max_length=TrainConfig.MAX_SEQ_LENGTH)
    test_loader = DataLoader(test_ds, batch_size=TrainConfig.EVAL_BATCH_SIZE, shuffle=False)

    def run_eval_pipeline(model, name="Model"):
        model.eval()
        all_preds = []
        all_targets = []
        latencies = []

        with torch.no_grad():
            for batch in test_loader:
                input_ids = batch["input_ids"].to(device)
                attention_mask = batch["attention_mask"].to(device)
                targets = batch["labels"].numpy()

                t0 = time.time()
                outputs = model(input_ids=input_ids, attention_mask=attention_mask)
                t1 = time.time()
                
                latencies.append((t1 - t0) * 1000.0 / len(targets)) # ms per sample
                preds = torch.argmax(outputs.logits, dim=1).cpu().numpy()

                all_preds.extend(preds)
                all_targets.extend(targets)

        acc = accuracy_score(all_targets, all_preds)
        precision, recall, f1, _ = precision_recall_fscore_support(all_targets, all_preds, average='macro', zero_division=0)
        cm = confusion_matrix(all_targets, all_preds, labels=[0, 1, 2, 3])
        avg_latency = np.mean(latencies)

        print(f"\n--- Results for {name} ---")
        print(f"Accuracy:        {acc * 100:.2f}%")
        print(f"Precision (Macro): {precision * 100:.2f}%")
        print(f"Recall (Macro):    {recall * 100:.2f}%")
        print(f"F1 Score (Macro):  {f1 * 100:.2f}%")
        print(f"Avg Latency:       {avg_latency:.2f} ms/sample")
        print("Confusion Matrix:")
        print(cm)
        return {
            "name": name,
            "accuracy": acc,
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "latency": avg_latency,
            "confusion_matrix": cm.tolist()
        }

    base_res = run_eval_pipeline(baseline_model, "Baseline DeBERTa-v3 (Pretrained)")
    ft_res = run_eval_pipeline(ft_model, "Fine-Tuned DeBERTa-v3 (RAGTruth)")

    print("\n=========================================================")
    print(" VERIFICATION PERFORMANCE GAIN SUMMARY")
    print("=========================================================")
    print(f"F1 Improvement:       +{(ft_res['f1'] - base_res['f1']) * 100:.2f}%")
    print(f"Accuracy Improvement: +{(ft_res['accuracy'] - base_res['accuracy']) * 100:.2f}%")
    print("=========================================================")

if __name__ == "__main__":
    evaluate_models()
