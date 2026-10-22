"""Stores a summary of every check in SQLite. Uploaded files are never stored.

Text checks store only a label like "Pasted text (240 characters)". The full result JSON
(scores, warnings, explanation image) is stored so a past result can be reopened.
"""
import json
import os
import re
import sqlite3
import uuid
from contextlib import closing
from datetime import datetime, timezone
from typing import Optional

from schemas import DetectionResult

FLAGGED = ("AI_GENERATED", "FLAGGED", "SYNTHETIC", "DEEPFAKE")
_COLS = "id, created_at, modality, verdict, score, label, model_version, processing_ms"


def _conn() -> sqlite3.Connection:
    path = os.getenv("BAYYINAH_DB", "data/bayyinah.db")
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    c = sqlite3.connect(path)
    c.row_factory = sqlite3.Row
    c.execute("""CREATE TABLE IF NOT EXISTS checks(
        id TEXT PRIMARY KEY, created_at TEXT NOT NULL, modality TEXT NOT NULL,
        verdict TEXT NOT NULL, score REAL NOT NULL, label TEXT NOT NULL,
        model_version TEXT NOT NULL, processing_ms REAL NOT NULL, result TEXT NOT NULL)""")
    return c


def _clean_label(name: Optional[str]) -> str:
    base = os.path.basename((name or "").replace("\\", "/"))
    base = re.sub(r"[\x00-\x1f\x7f]", "", base).strip()
    return (base[:80] or "Unnamed file")


def record(result: DetectionResult, label: Optional[str]) -> DetectionResult:
    result.id = uuid.uuid4().hex[:12]
    with closing(_conn()) as c, c:
        c.execute("INSERT INTO checks VALUES (?,?,?,?,?,?,?,?,?)", (
            result.id, datetime.now(timezone.utc).isoformat(timespec="seconds"),
            result.modality, result.verdict, result.score, _clean_label(label),
            result.model_version, result.processing_ms, result.model_dump_json()))
    return result


def list_checks(limit: int = 50, modality: Optional[str] = None) -> list[dict]:
    q, args = f"SELECT {_COLS} FROM checks", []
    if modality:
        q += " WHERE modality=?"
        args.append(modality)
    q += " ORDER BY created_at DESC, rowid DESC LIMIT ?"
    args.append(max(1, min(limit, 200)))
    with closing(_conn()) as c:
        return [dict(r) for r in c.execute(q, args)]


def get(check_id: str) -> Optional[dict]:
    with closing(_conn()) as c:
        r = c.execute("SELECT * FROM checks WHERE id=?", (check_id,)).fetchone()
    if not r:
        return None
    return {"created_at": r["created_at"], "label": r["label"], "result": json.loads(r["result"])}


def delete(check_id: str) -> bool:
    with closing(_conn()) as c, c:
        return c.execute("DELETE FROM checks WHERE id=?", (check_id,)).rowcount > 0


def clear() -> int:
    with closing(_conn()) as c, c:
        return c.execute("DELETE FROM checks").rowcount


def stats() -> dict:
    with closing(_conn()) as c:
        rows = c.execute("SELECT modality, verdict, processing_ms FROM checks").fetchall()
    by: dict[str, dict] = {}
    for r in rows:
        m = by.setdefault(r["modality"], {"total": 0, "flagged": 0})
        m["total"] += 1
        m["flagged"] += r["verdict"] in FLAGGED
    total = len(rows)
    flagged = sum(m["flagged"] for m in by.values())
    return {
        "total": total, "flagged": flagged,
        "avg_ms": round(sum(r["processing_ms"] for r in rows) / total, 1) if total else None,
        "by_modality": by,
    }
