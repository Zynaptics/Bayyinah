import time
from fastapi import APIRouter, File, UploadFile

import stubs
import history
from config import MODEL_VERSIONS
from schemas import DetectionResult
from utils.files import read_upload

router = APIRouter()


@router.post("/audio", response_model=DetectionResult)
async def detect_audio(file: UploadFile = File(...)):
    t0 = time.perf_counter()
    await read_upload(file, "audio")
    fake = stubs.hint(file.filename) != "good"
    # STUB. Week 10-12: log-mel spectrogram + CNN + Grad-CAM.
    result = DetectionResult(
        modality="audio",
        verdict="SYNTHETIC" if fake else "GENUINE",
        score=0.81 if fake else 0.09,
        details={"duration_s": 4.0},
        explanation_image=stubs.spectrogram_stub(),
        explanation_text="Warm colours mark the time-frequency regions that most influenced the score.",
        warnings=["Only the first 4 seconds were analysed."],
        processing_ms=round((time.perf_counter() - t0) * 1000, 1),
        model_version=MODEL_VERSIONS["audio"],
    )
    return history.record(result, file.filename)
