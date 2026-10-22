"""Fixed fake outputs used until real models replace them. Delete this file at the end."""
import base64
import math


def _data_url(svg: str) -> str:
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()


def heatmap_stub() -> str:
    return _data_url(
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>"
        "<defs><radialGradient id='a'><stop offset='0' stop-color='#d00' stop-opacity='.85'/>"
        "<stop offset='1' stop-color='#d00' stop-opacity='0'/></radialGradient>"
        "<radialGradient id='b'><stop offset='0' stop-color='#f90' stop-opacity='.8'/>"
        "<stop offset='1' stop-color='#f90' stop-opacity='0'/></radialGradient></defs>"
        "<rect width='400' height='300' fill='#3a4a55'/>"
        "<ellipse cx='150' cy='120' rx='90' ry='70' fill='url(#a)'/>"
        "<ellipse cx='260' cy='190' rx='80' ry='60' fill='url(#b)'/>"
        "<text x='200' y='288' text-anchor='middle' fill='#fff' font-size='14' "
        "font-family='sans-serif'>Mock heatmap</text></svg>")


def spectrogram_stub() -> str:
    cells = []
    for x in range(48):
        for y in range(20):
            v = (math.sin(x / 5) + math.cos(y / 3) + 2) / 4
            hot = 1 if (x in range(20, 30) and y in range(2, 8)) else 0
            color = f"hsl({210 - 210 * hot}, 60%, {20 + 50 * v:.0f}%)"
            cells.append(f"<rect x='{x * 8}' y='{y * 12}' width='8' height='12' fill='{color}'/>")
    return _data_url("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 240'>"
                     + "".join(cells) + "</svg>")


def hint(name: str) -> str:
    """Scenario hint from a file name: 'good', 'noface' or 'bad'."""
    n = (name or "").lower()
    if "noface" in n:
        return "noface"
    if "real" in n or "genuine" in n:
        return "good"
    return "bad"


FRAME_SCORES_BAD = [0.31, 0.42, 0.55, 0.71, 0.83, 0.88, 0.79, 0.86, 0.91, 0.74, 0.62, 0.58]
FRAME_SCORES_GOOD = [0.08, 0.12, 0.05, 0.1, 0.15, 0.09, 0.11, 0.07, 0.13, 0.06, 0.1, 0.08]
