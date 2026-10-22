"use client";
import { useEffect, useState } from "react";
import FileDrop from "@/components/FileDrop";
import ModalityTabs from "@/components/ModalityTabs";
import ResultView, { Source } from "@/components/ResultView";
import { runCheck } from "@/lib/api";
import { TEXT_MAX } from "@/lib/limits";
import { validateFile, validateText } from "@/lib/validate";
import type { DetectionResult, Modality } from "@/lib/types";

type Status = "idle" | "loading" | "done" | "error";

export default function VerifyPage() {
  const [modality, setModality] = useState<Modality>("image");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [source, setSource] = useState<Source | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  function reset() { setStatus("idle"); setError(null); setResult(null); setSource(null); }

  function switchTab(m: Modality) { setModality(m); setFile(null); setPreviewUrl(null); reset(); }

  function pickFile(f: File | null) {
    reset();
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    if (f && modality !== "text") {
      const problem = validateFile(modality, f);
      if (problem) { setStatus("error"); setError(problem); }
    }
  }

  async function submit() {
    const problem = modality === "text" ? validateText(text) : file ? validateFile(modality, file) : "Choose a file first.";
    if (problem) { setStatus("error"); setError(problem); return; }
    setStatus("loading"); setError(null); setResult(null);
    try {
      const res = await runCheck(modality, modality === "text" ? text.trim() : (file as File));
      setSource(modality === "text" ? { kind: "text", text: text.trim() } : { kind: modality, url: previewUrl ?? undefined });
      setResult(res);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setStatus("error");
    }
  }

  const busy = status === "loading";

  return (
    <main className="page">
      <header className="page-head"><div><h1 className="page-title">New check</h1><p className="sub">Choose what you want to check. Files are analysed and discarded; only the result is kept in history.</p></div></header>
      <ModalityTabs value={modality} onChange={switchTab} />

      <div id="panel" role="tabpanel" aria-labelledby={`tab-${modality}`} className="panel">
        {modality === "text" ? (
          <div>
            <label htmlFor="text-in" className="field-label">Paste the text you want to check (English, Urdu or Roman Urdu)</label>
            <textarea
              id="text-in" dir="auto" rows={8} value={text} disabled={busy}
              onChange={(e) => { setText(e.target.value); reset(); }}
              placeholder="Paste a message, post or article excerpt"
            />
            <p className="hint">{text.trim().length} / {TEXT_MAX} characters</p>
          </div>
        ) : (
          <FileDrop modality={modality} file={file} onFile={pickFile} disabled={busy} />
        )}

        <div className="actions">
          <button className="primary" onClick={submit} disabled={busy}>{busy ? "Checking…" : "Run check"}</button>
        </div>

        {status === "error" && error && <p role="alert" className="error">{error}</p>}
        {busy && <p className="hint" role="status">Analysing. Large files can take a while.</p>}
      </div>

      {status === "done" && result && <ResultView result={result} source={source} />}
    </main>
  );
}
