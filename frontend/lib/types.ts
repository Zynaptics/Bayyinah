export type Modality = "image" | "text" | "audio" | "video";

export type Verdict =
  | "AI_GENERATED" | "LIKELY_REAL"
  | "FLAGGED" | "NOT_FLAGGED"
  | "SYNTHETIC" | "GENUINE"
  | "DEEPFAKE";

export interface Highlight { token: string; influence: number }

export interface DetectionResult {
  id: string | null;
  modality: Modality;
  verdict: Verdict;
  score: number;                 // probability of the "bad" class, 0 to 1
  details: Record<string, unknown>;
  explanation_image: string | null;   // data URL
  explanation_text: string | null;
  warnings: string[];
  processing_ms: number;
  model_version: string;
  disclaimer: string;
}

export interface ApiError { error: string; code: string }

export interface HistoryRow {
  id: string; created_at: string; modality: Modality; verdict: Verdict;
  score: number; label: string; model_version: string; processing_ms: number;
}
export interface Stats {
  total: number; flagged: number; avg_ms: number | null;
  by_modality: Partial<Record<Modality, { total: number; flagged: number }>>;
}
export interface ModelInfo {
  modality: Modality; title: string; planned: string; accepts: string; version: string;
  status: "mock" | "live" | "off"; evaluation: Record<string, number> | null;
}
