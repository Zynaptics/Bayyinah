"""Run: python scripts/check_hardware.py   (record the output in docs/environment.md)"""
import os, platform, shutil, subprocess, sys

print("OS:        ", platform.platform())
print("Python:    ", sys.version.split()[0])
print("CPU cores: ", os.cpu_count())
try:
    import psutil
    print("RAM (GB):  ", round(psutil.virtual_memory().total / 1e9, 1))
except ImportError:
    print("RAM:        install psutil (pip install psutil) or check Task Manager")
total, used, free = shutil.disk_usage(".")
print("Disk free (GB):", round(free / 1e9, 1))
try:
    out = subprocess.run(
        ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"],
        capture_output=True, text=True, timeout=10)
    print("NVIDIA GPU:", out.stdout.strip() or "none reported")
except Exception:
    print("NVIDIA GPU: nvidia-smi not found (no usable NVIDIA GPU; use Colab)")
for tool in ("git", "node", "npm", "docker", "ffmpeg"):
    print(f"{tool}:".ljust(11), shutil.which(tool) or "NOT FOUND")
