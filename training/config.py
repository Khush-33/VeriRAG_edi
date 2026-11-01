from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent

def _resolve_dataset_path():
    candidates = [
        REPO_ROOT / 'datasets' / 'ragtruth' / 'ragtruth_dataset.json',
        BASE_DIR / 'datasets' / 'ragtruth' / 'ragtruth_dataset.json',
        Path('datasets/ragtruth/ragtruth_dataset.json'),
        Path('../datasets/ragtruth/ragtruth_dataset.json'),
        Path('/content/verirag/datasets/ragtruth/ragtruth_dataset.json'),
        Path('/content/datasets/ragtruth/ragtruth_dataset.json'),
    ]
    for p in candidates:
        if p.exists():
            return p
    return REPO_ROOT / 'datasets' / 'ragtruth' / 'ragtruth_dataset.json'

class TrainConfig:
    # Model Configuration
    BASE_MODEL_NAME = "microsoft/deberta-v3-small"
    OUTPUT_DIR = REPO_ROOT / 'saved_models' / 'deberta-v3-ragtruth-finetuned'
    LOGGING_DIR = REPO_ROOT / 'logs'
    SEED = 42

    # Dataset Configuration
    DATASET_PATH = _resolve_dataset_path()
    MAX_SEQ_LENGTH = 512
    NUM_CLASSES = 4  # ENTAILED (SUPPORTED), PARTIAL, CONTRADICTED, UNSUPPORTED
    BATCH_SIZE = 8
    EVAL_BATCH_SIZE = 8
    CLASS_WEIGHTS = [1.0, 1.5, 3.0, 2.0]  # Higher penalty for Contradictions & Unsupported

    # Optimization
    LEARNING_RATE = 2e-5
    WEIGHT_DECAY = 0.01
    WARMUP_RATIO = 0.1
    MAX_GRAD_NORM = 1.0
    NUM_EPOCHS = 5
    GRADIENT_ACCUMULATION_STEPS = 4

    # Early Stopping
    EARLY_STOPPING_PATIENCE = 3
    METRIC_FOR_BEST_MODEL = "f1_macro"
    GREATER_IS_BETTER = True

label2id = {
    "SUPPORTED": 0,
    "PARTIALLY_SUPPORTED": 1,
    "CONTRADICTED": 2,
    "UNSUPPORTED": 3
}

id2label = {v: k for k, v in label2id.items()}
