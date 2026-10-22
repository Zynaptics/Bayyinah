from typing import Optional
from fastapi import APIRouter

import history
from config import LIMITS, MODEL_INFO, MODEL_VERSIONS, TEXT_MAX_CHARS, TEXT_MIN_CHARS
from errors import AppError

router = APIRouter()


@router.get("/history")
async def list_history(modality: Optional[str] = None, limit: int = 50):
    if modality and modality not in MODEL_INFO:
        raise AppError(422, "INVALID_REQUEST", "Unknown check type.")
    return {"items": history.list_checks(limit, modality)}


@router.get("/history/{check_id}")
async def get_history(check_id: str):
    row = history.get(check_id)
    if not row:
        raise AppError(404, "NOT_FOUND", "That check no longer exists.")
    return row


@router.delete("/history/{check_id}")
async def delete_history(check_id: str):
    if not history.delete(check_id):
        raise AppError(404, "NOT_FOUND", "That check no longer exists.")
    return {"deleted": 1}


@router.delete("/history")
async def clear_history():
    return {"deleted": history.clear()}


@router.get("/stats")
async def get_stats():
    return history.stats()


@router.get("/models")
async def get_models():
    out = []
    for key, info in MODEL_INFO.items():
        version = MODEL_VERSIONS[key]
        if key == "text":
            accepts = f"Text, {TEXT_MIN_CHARS} to {TEXT_MAX_CHARS} characters"
        else:
            rules = LIMITS[key]
            accepts = ", ".join(sorted(e.lstrip(".").upper() for e in rules["exts"])) + f", up to {rules['max_bytes'] // (1024 * 1024)} MB"
        out.append({
            "modality": key, "title": info["title"], "planned": info["planned"], "accepts": accepts,
            "version": version,
            "status": "off" if not info["enabled"] else ("mock" if version.startswith("stub") else "live"),
            "evaluation": None,   # filled in after the evaluation weeks; the UI shows "Not evaluated yet"
        })
    return {"items": out}
