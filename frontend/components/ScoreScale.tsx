import { SCALE_ENDS } from "@/lib/labels";
import type { Modality } from "@/lib/types";

/** Measuring scale: 0 to 1, the 0.5 decision line, and the model score marked on it. */
export default function ScoreScale({ score, modality }: { score: number; modality: Modality }) {
  const pct = Math.min(100, Math.max(0, score * 100));
  const [left, right] = SCALE_ENDS[modality];
  return (
    <figure className="scale" aria-label={`Model score ${score.toFixed(2)} out of 1`}>
      <div className="scale-track">
        <span className="band" />
        {Array.from({ length: 21 }, (_, i) => (
          <span key={i} className={i % 10 === 0 ? "tick t-major" : i % 5 === 0 ? "tick t-mid" : "tick"} style={{ left: `${i * 5}%` }} />
        ))}
        <span className="marker" style={{ left: `${pct}%` }}><b className="mono">{score.toFixed(2)}</b></span>
      </div>
      <div className="scale-nums mono"><span>0</span><span>0.5</span><span>1</span></div>
      <figcaption className="scale-ends"><span>{left}</span><span>{right}</span></figcaption>
    </figure>
  );
}
