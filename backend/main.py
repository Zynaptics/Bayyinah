from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import ALLOWED_ORIGINS, APP_VERSION, MODEL_VERSION
from errors import AppError
from routers import audio, image, meta, text, video

app = FastAPI(title="Bayyinah Detection API", version=APP_VERSION)

# The browser talks to Next.js, which proxies here, so CORS is only a safety net.
app.add_middleware(CORSMiddleware, allow_origins=ALLOWED_ORIGINS,
                   allow_methods=["POST", "GET", "DELETE"], allow_headers=["*"])

for r in (image, text, audio, video):
    app.include_router(r.router, prefix="/api/detect")
app.include_router(meta.router, prefix="/api")


@app.exception_handler(AppError)
async def app_error_handler(_: Request, exc: AppError):
    return JSONResponse(status_code=exc.status, content={"error": exc.message, "code": exc.code})


@app.exception_handler(RequestValidationError)
async def validation_handler(_: Request, __: RequestValidationError):
    return JSONResponse(status_code=422, content={
        "error": "The request was missing a file or had the wrong shape.", "code": "INVALID_REQUEST"})


@app.get("/health")
async def health():
    return {"status": "ok", "version": APP_VERSION, "model_version": MODEL_VERSION,
            "models_loaded": False}
