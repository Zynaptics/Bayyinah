# Bayyinah

Multi-modal media authenticity checker (image, text, audio; video as an extension), with
Urdu and Roman Urdu text support and visual explanations. Solo FYP, 16 weeks.

Current state: **Week 1 scaffold with dashboard.** Pages: Overview (real counts from your checks),
New check, History (reopen or delete past results), Models (status of each check). The backend
returns fixed mock results for now (the UI shows a MOCK badge) and stores a summary of each check
in SQLite (`backend/data/`, git-ignored). Uploaded files are never stored. Real models replace the stubs one
module at a time without changing the UI.

## Run it (two terminals)

Backend (Python 3.11+):

    cd backend
    python -m venv venv
    venv\Scripts\activate          # Windows.  macOS/Linux: source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload      # http://localhost:8000/docs

Frontend (Node 20+):

    cd frontend
    npm install
    copy .env.example .env.local   # macOS/Linux: cp .env.example .env.local
    npm run dev                    # http://localhost:3000

Themes: **Night** (jet black, cerulean blue, neon rose) and **Ice** (ice silver, deep aubergine, marigold). The top-bar button switches; the first load follows your system setting. Colours are CSS variables at the top of `frontend/app/globals.css`.

Tests: `cd backend && pytest`. Typecheck: `cd frontend && npm run typecheck`.
Everything in Docker: `docker compose up --build`.

## Try the unhappy paths (stubs only)

- Image/audio/video file name containing `real` or `genuine` returns the "good" verdict.
- A file name containing `noface` returns a null heatmap plus a warning.
- Text starting with `real:` returns NOT_FLAGGED.
- Upload a PDF as an image, a file over the size limit, or text under 20 characters.
- Stop the backend and run a check to see the BACKEND_UNREACHABLE message.

## Layout

    backend/    FastAPI. routers/ one file per modality, schemas.py = the contract
    frontend/   Next.js 14. app/api/detect/[modality] proxies to the backend (server-side BACKEND_URL)
    docs/       API_CONTRACT.md, supervisor_email.md
    scripts/    check_hardware.py
    datasets/   git-ignored; README explains layout and the 0_real / 1_fake naming rule
    splits/     commit the official FaceForensics++ split files here
    notebooks/  Colab/Jupyter experiments (image, text, audio)

## Replacing a stub with a real model

| When | Replace | Keep unchanged |
|---|---|---|
| Weeks 4-6 | the body of `backend/routers/image.py` | request/response shape, UI |
| Weeks 7-10 | `backend/routers/text.py` | same |
| Weeks 11-13 | `backend/routers/audio.py` | same |
| Week 14 (only if gate passes) | `backend/routers/video.py`; set `ENABLED.video = true` in `frontend/lib/limits.ts` | same |

Set `MODEL_VERSION` to the real model name so the MOCK badge disappears. Install
`requirements-ml.txt` when you start the first real model, then pin versions.
Delete `backend/stubs.py` at the end.

## Rules to keep (from the plan review)

- Name image class folders `0_real` and `1_fake` (class 1 = fake everywhere).
- Use the official FF++ split files; never split by frame. Keep a cross-dataset holdout (Celeb-DF) untouched until final evaluation.
- Handle class imbalance (FF++ about 1:4, ASVspoof about 1:10) with weighted loss or sampling.
- Fit ensemble weights on validation data with logistic regression; treat EXIF as a weak signal (messaging apps strip it).
- The browser never calls the backend directly. Never put user file names in file paths.
- Roman Urdu cannot be detected by langdetect; Week 6 adds a classifier.
- No voice cloning of public figures. Log every training run with `backend/utils/logger.py`.
