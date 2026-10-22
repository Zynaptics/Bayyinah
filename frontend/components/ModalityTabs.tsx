"use client";
import { ENABLED } from "@/lib/limits";
import { MODALITY_LABEL } from "@/lib/labels";
import type { Modality } from "@/lib/types";

const ORDER: Modality[] = ["image", "text", "audio", "video"];

export default function ModalityTabs({ value, onChange }: { value: Modality; onChange: (m: Modality) => void }) {
  return (
    <div role="tablist" aria-label="What do you want to check?" className="tabs">
      {ORDER.map((m, i) => (
        <button
          key={m}
          role="tab"
          id={`tab-${m}`}
          aria-selected={value === m}
          aria-controls="panel"
          disabled={!ENABLED[m]}
          title={ENABLED[m] ? undefined : "Video checks are not available yet"}
          className="tab"
          onClick={() => onChange(m)}
        >
          <span className="idx">{String(i + 1).padStart(2, "0")}</span> {MODALITY_LABEL[m]}
          {!ENABLED[m] && <span className="tab-note"> (not yet available)</span>}
        </button>
      ))}
    </div>
  );
}
