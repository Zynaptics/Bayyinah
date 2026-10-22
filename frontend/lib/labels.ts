import type { Modality, Verdict } from "./types";

export const MODALITY_LABEL: Record<Modality, string> = {
  image: "Image", text: "Text", audio: "Audio", video: "Video",
};

// tone: "alert" = the model leans fake, "ok" = the model leans real
export const VERDICT: Record<Verdict, { label: string; tone: "alert" | "ok" }> = {
  AI_GENERATED: { label: "Likely AI-generated", tone: "alert" },
  LIKELY_REAL: { label: "Likely real", tone: "ok" },
  FLAGGED: { label: "Misinformation patterns flagged", tone: "alert" },
  NOT_FLAGGED: { label: "No misinformation patterns flagged", tone: "ok" },
  SYNTHETIC: { label: "Likely synthetic voice", tone: "alert" },
  GENUINE: { label: "Likely genuine voice", tone: "ok" },
  DEEPFAKE: { label: "Likely deepfake", tone: "alert" },
};

export const SCALE_ENDS: Record<Modality, [string, string]> = {
  image: ["Looks real", "Looks AI-generated"],
  text: ["Not flagged", "Flagged"],
  audio: ["Genuine", "Synthetic"],
  video: ["Real", "Deepfake"],
};
