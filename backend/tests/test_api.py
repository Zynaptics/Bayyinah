import io
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)
PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 64


def post_file(path, name, ctype, data):
    return client.post(f"/api/detect/{path}", files={"file": (name, io.BytesIO(data), ctype)})


def test_health():
    assert client.get("/health").json()["status"] == "ok"


def test_image_ok():
    r = post_file("image", "photo.png", "image/png", PNG)
    assert r.status_code == 200
    body = r.json()
    assert body["verdict"] == "AI_GENERATED" and body["explanation_image"]
    assert body["model_version"].startswith("stub")


def test_image_real_hint_and_noface():
    assert post_file("image", "real_photo.png", "image/png", PNG).json()["verdict"] == "LIKELY_REAL"
    body = post_file("image", "noface.png", "image/png", PNG).json()
    assert body["explanation_image"] is None and body["warnings"]


def test_image_wrong_type():
    r = post_file("image", "doc.pdf", "application/pdf", b"%PDF")
    assert r.status_code == 415 and r.json()["code"] == "UNSUPPORTED_FORMAT"


def test_image_fake_content():
    r = post_file("image", "x.png", "image/png", b"not an image at all")
    assert r.status_code == 422 and r.json()["code"] == "INVALID_FILE"


def test_image_too_large():
    r = post_file("image", "big.png", "image/png", PNG + b"\x00" * (10 * 1024 * 1024))
    assert r.status_code == 413 and r.json()["code"] == "FILE_TOO_LARGE"


def test_missing_file():
    r = client.post("/api/detect/image")
    assert r.status_code == 422 and r.json()["code"] == "INVALID_REQUEST"


def test_text_ok_and_errors():
    r = client.post("/api/detect/text", json={"text": "This shocking story about the election is completely invented."})
    assert r.status_code == 200 and r.json()["verdict"] == "FLAGGED"
    assert client.post("/api/detect/text", json={"text": "short"}).json()["code"] == "TEXT_TOO_SHORT"
    assert client.post("/api/detect/text", json={"text": "x" * 5001}).json()["code"] == "TEXT_TOO_LONG"
    assert client.post("/api/detect/text", json={"nope": 1}).json()["code"] == "INVALID_REQUEST"


def test_text_urdu_script():
    r = client.post("/api/detect/text", json={"text": "یہ خبر بالکل جھوٹی ہے اور اسے آگے نہ بھیجیں"})
    assert r.json()["details"]["language_detected"] == "urdu"


def test_audio_and_video():
    a = post_file("audio", "clip.wav", "audio/wav", b"RIFF" + b"\x00" * 100)
    assert a.status_code == 200 and a.json()["verdict"] == "SYNTHETIC"
    v = post_file("video", "clip.mp4", "video/mp4", b"\x00" * 100)
    assert v.status_code == 200 and len(v.json()["details"]["frame_scores"]) > 0


def test_history_stats_models_delete():
    import history
    history.clear()
    post_file("image", "../../etc/photo.png", "image/png", PNG)
    client.post("/api/detect/text", json={"text": "real: The ministry confirmed the schedule on Monday."})
    items = client.get("/api/history").json()["items"]
    assert len(items) == 2
    assert items[1]["label"] == "photo.png"                      # path stripped
    assert client.get("/api/history?modality=text").json()["items"][0]["label"].startswith("Pasted text")
    one = client.get(f"/api/history/{items[0]['id']}").json()
    assert one["result"]["id"] == items[0]["id"]
    s = client.get("/api/stats").json()
    assert s["total"] == 2 and s["flagged"] == 1 and s["by_modality"]["image"]["flagged"] == 1
    models = {m["modality"]: m for m in client.get("/api/models").json()["items"]}
    assert models["image"]["status"] == "mock" and models["video"]["status"] == "off"
    assert client.delete(f"/api/history/{items[0]['id']}").json() == {"deleted": 1}
    assert client.get(f"/api/history/{items[0]['id']}").status_code == 404
    assert client.delete("/api/history").json() == {"deleted": 1}
