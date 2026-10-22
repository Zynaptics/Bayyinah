import time
from fastapi import APIRouter, File, UploadFile

import stubs
import history
from config import MODEL_VERSIONS
from schemas import DetectionResult
from utils.files import read_upload

router = APIRouter()


@router.post("/image", response_model=DetectionResult)
async def detect_image(file: UploadFile = File(...)):
    t0 = time.perf_counter()
    await read_upload(file, "image")
    case = stubs.hint(file.filename)
    # STUB. Week 4-6: replace with face crop + ensemble + Grad-CAM.
    fake = case != "good"
    result = DetectionResult(
        modality="image",
        verdict="AI_GENERATED" if fake else "LIKELY_REAL",
        score=0.87 if fake else 0.12,
        details={"xception": 0.91, "resnet50": 0.84, "efficientnet_b4": 0.82, "exif_signal": "none"},
        explanation_image=None if case == "noface" else stubs.heatmap_stub(),
        explanation_text="Highlighted regions are the areas the model weighted most.",
        warnings=["No face detected; heatmap unavailable."] if case == "noface" else [],
        processing_ms=round((time.perf_counter() - t0) * 1000, 1),
        model_version=MODEL_VERSIONS["image"],
    )
    return history.record(result, file.filename)
