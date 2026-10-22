import os
from fastapi import UploadFile

from config import LIMITS
from errors import AppError

CHUNK = 1024 * 1024


def _sniff_image(head: bytes) -> bool:
    return (head.startswith(b"\xff\xd8\xff")                       # JPEG
            or head.startswith(b"\x89PNG\r\n\x1a\n")                # PNG
            or (head[:4] == b"RIFF" and head[8:12] == b"WEBP"))     # WEBP


async def read_upload(file: UploadFile, modality: str) -> bytes:
    """Validate type, extension and size (streamed), return the bytes.

    Never use file.filename in a filesystem path. When real models need a temp file,
    write it as f"{uuid4()}{ext}" with an allow-listed extension.
    """
    rules = LIMITS[modality]
    ext = os.path.splitext(file.filename or "")[1].lower()
    if file.content_type not in rules["types"] or ext not in rules["exts"]:
        allowed = ", ".join(sorted(e.lstrip(".") for e in rules["exts"]))
        raise AppError(415, "UNSUPPORTED_FORMAT", f"Unsupported file type. Use one of: {allowed}.")

    data = bytearray()
    while chunk := await file.read(CHUNK):
        data.extend(chunk)
        if len(data) > rules["max_bytes"]:
            mb = rules["max_bytes"] // (1024 * 1024)
            raise AppError(413, "FILE_TOO_LARGE", f"File is larger than the {mb} MB limit.")
    if not data:
        raise AppError(422, "INVALID_FILE", "The file is empty.")
    if modality == "image" and not _sniff_image(bytes(data[:16])):
        raise AppError(422, "INVALID_FILE", "The file content is not a valid JPEG, PNG or WebP image.")
    return bytes(data)
