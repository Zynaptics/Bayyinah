import type { Modality } from "./types";

const MB = 1024 * 1024;

// Keep in sync with backend/config.py
export const LIMITS: Record<Exclude<Modality, "text">, { maxBytes: number; accept: string; exts: string[]; hint: string }> = {
  image: { maxBytes: 10 * MB, accept: "image/jpeg,image/png,image/webp", exts: [".jpg", ".jpeg", ".png", ".webp"], hint: "JPEG, PNG or WebP, up to 10 MB" },
  audio: { maxBytes: 20 * MB, accept: "audio/wav,audio/mpeg,audio/mp4,audio/ogg,audio/flac,.m4a", exts: [".wav", ".mp3", ".m4a", ".ogg", ".flac"], hint: "WAV, MP3, M4A, OGG or FLAC, up to 20 MB" },
  video: { maxBytes: 100 * MB, accept: "video/mp4,video/quicktime,video/webm", exts: [".mp4", ".mov", ".webm"], hint: "MP4, MOV or WebM, up to 100 MB" },
};

export const TEXT_MIN = 20;
export const TEXT_MAX = 5000;

// Flip video to true only after the Week 13 gate passes.
export const ENABLED: Record<Modality, boolean> = { image: true, text: true, audio: true, video: false };
