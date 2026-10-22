import { LIMITS, TEXT_MAX, TEXT_MIN } from "./limits";
import type { Modality } from "./types";

export function validateFile(modality: Exclude<Modality, "text">, file: File): string | null {
  const rules = LIMITS[modality];
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!rules.exts.includes(ext)) return `This file type is not supported. Use ${rules.hint}.`;
  if (file.size === 0) return "This file is empty.";
  if (file.size > rules.maxBytes) {
    return `This file is ${(file.size / 1048576).toFixed(1)} MB. The limit is ${rules.maxBytes / 1048576} MB.`;
  }
  return null;
}

export function validateText(text: string): string | null {
  const n = text.trim().length;
  if (n < TEXT_MIN) return `Enter at least ${TEXT_MIN} characters (currently ${n}).`;
  if (n > TEXT_MAX) return `Text is ${n} characters. The limit is ${TEXT_MAX}.`;
  return null;
}
