import os

APP_VERSION = "0.1.0"
MODEL_VERSION = "stub-0.1"
# Set a real version string here when a real model replaces a stub. "stub..." means mock.
MODEL_VERSIONS = {"image": "stub-0.1", "text": "stub-0.1", "audio": "stub-0.1", "video": "stub-0.1"}

MODEL_INFO = {
    "image": {"title": "Image authenticity",
              "planned": "Xception on face crops and EfficientNet-B4 or ResNet-50 on general images, fused by logistic regression, with Grad-CAM heatmaps.",
              "enabled": True},
    "text": {"title": "Text misinformation patterns",
             "planned": "RoBERTa-base for English and XLM-RoBERTa-base for Urdu and Roman Urdu, with SHAP word attribution.",
             "enabled": True},
    "audio": {"title": "Synthetic voice",
              "planned": "Log-mel spectrogram CNN with Grad-CAM, compared against a two-GMM baseline.",
              "enabled": True},
    "video": {"title": "Video deepfake",
              "planned": "Per-frame image scoring with aggregation. Starts only if the Week 13 gate passes.",
              "enabled": False},
}
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

MB = 1024 * 1024

# Keep in sync with frontend/lib/limits.ts
LIMITS = {
    "image": {
        "max_bytes": 10 * MB,
        "types": {"image/jpeg", "image/png", "image/webp"},
        "exts": {".jpg", ".jpeg", ".png", ".webp"},
    },
    "audio": {
        "max_bytes": 20 * MB,
        "types": {"audio/wav", "audio/x-wav", "audio/mpeg", "audio/mp4", "audio/x-m4a",
                  "audio/ogg", "audio/flac", "audio/x-flac"},
        "exts": {".wav", ".mp3", ".m4a", ".ogg", ".flac"},
    },
    "video": {
        "max_bytes": 100 * MB,
        "types": {"video/mp4", "video/quicktime", "video/webm"},
        "exts": {".mp4", ".mov", ".webm"},
    },
}

TEXT_MIN_CHARS = 20
TEXT_MAX_CHARS = 5000

DISCLAIMER = (
    "This is a model score, not proof. Missing metadata or an unusual writing style "
    "does not establish that content is fake, and a text check cannot confirm whether "
    "a claim is true."
)
