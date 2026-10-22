# API contract

All endpoints live under `/api/detect/{modality}` on the backend and are reached by
the browser through the Next.js proxy at the same path. Upload field name is `file`.

| Modality | Request | Limits |
|---|---|---|
| image | multipart `file` | jpeg/png/webp, 10 MB |
| text  | JSON `{"text": "..."}` | 20 to 5000 characters |
| audio | multipart `file` | wav/mp3/m4a/ogg/flac, 20 MB |
| video | multipart `file` | mp4/mov/webm, 100 MB |

## Success: DetectionResult

```json
{
  "modality": "image",
  "verdict": "AI_GENERATED",
  "score": 0.87,
  "details": {"xception": 0.91, "resnet50": 0.84, "efficientnet_b4": 0.82},
  "explanation_image": "data:image/jpeg;base64,... or null",
  "explanation_text": "string or null",
  "warnings": ["No face detected; heatmap unavailable"],
  "processing_ms": 312.4,
  "model_version": "stub-0.1",
  "disclaimer": "..."
}
```

Verdicts: image `AI_GENERATED | LIKELY_REAL`, text `FLAGGED | NOT_FLAGGED`,
audio `SYNTHETIC | GENUINE`, video `DEEPFAKE | LIKELY_REAL`.
`score` is always the model's probability for the "bad" class (fake / flagged /
synthetic). It is a model score, not proof.

`details` by modality (stub shapes; real models keep the same keys):
- image: per-model scores, `exif_signal`
- text: `language_detected`, `pipeline_used`, `highlights: [{token, influence}]`
- audio: `duration_s`
- video: `frame_scores: number[]`, `pct_frames_flagged`, `audio_verdict`, `audio_score`

`explanation_image` is always a data URL (or null), so the UI never guesses a mime type.
`model_version` starting with `stub` makes the UI show a MOCK badge.

## Errors (non-2xx)

```json
{"error": "Human-readable message", "code": "FILE_TOO_LARGE"}
```

Codes: `UNSUPPORTED_FORMAT` (415), `FILE_TOO_LARGE` (413), `INVALID_FILE` (422),
`TEXT_TOO_SHORT` / `TEXT_TOO_LONG` (422), `INVALID_REQUEST` (422),
`BACKEND_UNREACHABLE` (502, from the Next.js proxy).

## Stub hints (only while model_version is stub)
- File name contains `real` or `genuine` -> the "good" verdict.
- File name contains `noface` -> null explanation + warning (tests the unhappy path).
- Text starting with `real:` -> NOT_FLAGGED.
