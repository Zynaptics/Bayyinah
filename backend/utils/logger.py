"""CSV experiment logger. Use from every training notebook, from day one."""
import csv
import os
from datetime import datetime

LOG_FILE = os.getenv("TRAIN_LOG", "logs/training_runs.csv")
FIELDS = ["timestamp", "model", "dataset", "split", "epoch", "seed", "train_loss", "val_loss",
          "accuracy", "precision", "recall", "f1", "auc_roc", "fpr", "eer", "notes"]


def log_run(model: str, dataset: str, epoch: int, metrics: dict, split: str = "val",
            seed: int = 42, notes: str = "") -> None:
    os.makedirs(os.path.dirname(LOG_FILE) or ".", exist_ok=True)
    row = {"timestamp": datetime.now().isoformat(timespec="seconds"), "model": model,
           "dataset": dataset, "split": split, "epoch": epoch, "seed": seed,
           "notes": notes, **metrics}
    new_file = not os.path.exists(LOG_FILE)
    with open(LOG_FILE, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore")
        if new_file:
            writer.writeheader()
        writer.writerow(row)
