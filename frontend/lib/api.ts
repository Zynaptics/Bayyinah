import type { ApiError, DetectionResult, Modality } from "./types";

export class CheckError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

/** Sends a file (image/audio/video) or a string (text) through the Next.js proxy. */
export async function runCheck(modality: Modality, input: File | string): Promise<DetectionResult> {
  let res: Response;
  try {
    if (typeof input === "string") {
      res = await fetch(`/api/detect/${modality}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
    } else {
      const form = new FormData();
      form.append("file", input);
      res = await fetch(`/api/detect/${modality}`, { method: "POST", body: form });
    }
  } catch {
    throw new CheckError("Could not reach the server. Check your connection and try again.", "NETWORK");
  }
  const data = (await res.json().catch(() => null)) as (DetectionResult & Partial<ApiError>) | null;
  if (!res.ok || !data) {
    throw new CheckError(data?.error ?? "Something went wrong. Try again.", data?.code ?? "UNKNOWN");
  }
  return data;
}
