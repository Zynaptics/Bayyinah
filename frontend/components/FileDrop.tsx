"use client";
import { useRef, useState } from "react";
import { LIMITS } from "@/lib/limits";
import type { Modality } from "@/lib/types";

type FileModality = Exclude<Modality, "text">;

export default function FileDrop({ modality, file, onFile, disabled }: {
  modality: FileModality; file: File | null; onFile: (f: File | null) => void; disabled: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const rules = LIMITS[modality];

  return (
    <div
      className="drop"
      data-over={over}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault(); setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f && !disabled) onFile(f);
      }}
    >
      <input
        ref={input}
        type="file"
        accept={rules.accept}
        hidden
        onChange={(e) => { onFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
      />
      {file ? (
        <p className="drop-name">
          <strong>{file.name}</strong> ({(file.size / 1048576).toFixed(2)} MB){" "}
          <button type="button" className="linklike" disabled={disabled} onClick={() => onFile(null)}>Remove</button>
        </p>
      ) : (
        <p>Drop a {modality} file here, or{" "}
          <button type="button" className="linklike" disabled={disabled} onClick={() => input.current?.click()}>
            choose a file
          </button>.
        </p>
      )}
      <p className="hint">{rules.hint}</p>
    </div>
  );
}
