import re
import time
from fastapi import APIRouter

import stubs
import history
from config import MODEL_VERSIONS, TEXT_MAX_CHARS, TEXT_MIN_CHARS
from errors import AppError
from schemas import DetectionResult, TextPayload

router = APIRouter()


def script_language(text: str) -> str:
    """Script check only. Roman Urdu vs English needs a classifier (Week 6): langdetect
    cannot recognise Roman Urdu."""
    letters = [c for c in text if c.isalpha()]
    if not letters:
        return "unknown"
    arabic = sum(1 for c in letters if "\u0600" <= c <= "\u06ff" or "\u0750" <= c <= "\u077f"
                 or "\ufb50" <= c <= "\ufdff" or "\ufe70" <= c <= "\ufeff")
    return "urdu" if arabic / len(letters) > 0.3 else "latin"


@router.post("/text", response_model=DetectionResult)
async def detect_text(payload: dict):
    t0 = time.perf_counter()
    text = payload.get("text") if isinstance(payload, dict) else None
    if not isinstance(text, str):
        raise AppError(422, "INVALID_REQUEST", "Send JSON like {\"text\": \"...\"}.")
    text = text.strip()
    if len(text) < TEXT_MIN_CHARS:
        raise AppError(422, "TEXT_TOO_SHORT", f"Enter at least {TEXT_MIN_CHARS} characters.")
    if len(text) > TEXT_MAX_CHARS:
        raise AppError(422, "TEXT_TOO_LONG", f"Text is longer than {TEXT_MAX_CHARS} characters.")

    flagged = not text.lower().startswith("real:")
    words = []
    for w in re.findall(r"\w+", text):
        if len(w) >= 5 and w.lower() not in (x.lower() for x in words):
            words.append(w)
    # STUB. Week 6-9: language routing + RoBERTa / XLM-R + SHAP attribution.
    highlights = [{"token": w, "influence": round(0.4 - i * 0.07, 2)} for i, w in enumerate(words[:5])]
    lang = script_language(text)
    result = DetectionResult(
        modality="text",
        verdict="FLAGGED" if flagged else "NOT_FLAGGED",
        score=0.78 if flagged else 0.14,
        details={"language_detected": lang, "pipeline_used": "stub", "highlights": highlights},
        explanation_text="Highlighted words influenced the score. They are not claims that were checked.",
        warnings=[],
        processing_ms=round((time.perf_counter() - t0) * 1000, 1),
        model_version=MODEL_VERSIONS["text"],
    )
    return history.record(result, f"Pasted text ({len(text)} characters)")
