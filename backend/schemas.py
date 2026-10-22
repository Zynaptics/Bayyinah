from typing import Any, Literal, Optional
from pydantic import BaseModel, Field

from config import DISCLAIMER

Modality = Literal["image", "text", "audio", "video"]
Verdict = Literal[
    "AI_GENERATED", "LIKELY_REAL",   # image
    "FLAGGED", "NOT_FLAGGED",        # text
    "SYNTHETIC", "GENUINE",          # audio
    "DEEPFAKE",                      # video (LIKELY_REAL shared with image)
]


class TextPayload(BaseModel):
    text: str


class DetectionResult(BaseModel):
    id: Optional[str] = None               # set when the check is stored in history
    modality: Modality
    verdict: Verdict
    score: float = Field(ge=0, le=1)          # probability of the "bad" class
    details: dict[str, Any] = Field(default_factory=dict)
    explanation_image: Optional[str] = None   # data URL or null
    explanation_text: Optional[str] = None
    warnings: list[str] = Field(default_factory=list)
    processing_ms: float
    model_version: str
    disclaimer: str = DISCLAIMER


class ErrorResult(BaseModel):
    error: str
    code: str
