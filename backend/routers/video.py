import time
from fastapi import APIRouter, File, UploadFile

import stubs
import history
from config import MODEL_VERSIONS
from schemas import DetectionResult
from utils.files import read_upload

router = APIRouter()


@router.post("/video", response_model=DetectionResult)
async def detect_video(file: UploadFile = File(...)):
    t0 = time.perf_counter()
    await read_upload(file, "video")
    fake = stubs.hint(file.filename) != "good"
    scores = stubs.FRAME_SCORES_BAD if fake else stubs.FRAME_SCORES_GOOD
    # STUB. Week 14 (only if the Week 13 gate passes): frame extraction + image models + aggregation.
    result = DetectionResult(
        modality="video",
        verdict="DEEPFAKE" if fake else "LIKELY_REAL",
        score=0.74 if fake else 0.10,
        details={
            "frame_scores": scores,
            "pct_frames_flagged": round(sum(s > 0.5 for s in scores) / len(scores), 2),
            "audio_verdict": "SYNTHETIC" if fake else "GENUINE",
            "audio_score": 0.66 if fake else 0.08,
        },
        explanation_text="Each bar is one sampled frame. Taller bars mean the frame scored as more likely fake.",
        warnings=[],
        processing_ms=round((time.perf_counter() - t0) * 1000, 1),
        model_version=MODEL_VERSIONS["video"],
    )
    return history.record(result, file.filename)
