import Link from "next/link";
import FrameTimeline from "./FrameTimeline";
import HighlightedText from "./HighlightedText";
import ScoreScale from "./ScoreScale";
import { VERDICT } from "@/lib/labels";
import type { DetectionResult, Highlight } from "@/lib/types";

export interface Source { kind: "image" | "audio" | "video" | "text"; url?: string; text?: string }

const prettyKey = (k: string) => k.replace(/_/g, " ");

export default function ResultView({ result, source }: { result: DetectionResult; source: Source | null }) {
  const v = VERDICT[result.verdict];
  const d = result.details;
  const isStub = result.model_version.startsWith("stub");
  const scalar = Object.entries(d).filter(([, val]) => typeof val === "number" || typeof val === "string");

  return (
    <section className="result" data-tone={v.tone} aria-live="polite">
      {isStub && <p className="mock">Mock result. No model is running yet, so this is not a real analysis.</p>}

      {result.id && <p className="case mono">Case {result.id}</p>}
      <h2 className="verdict">{v.label}</h2>
      <p className="score-line">Model score {result.score.toFixed(2)} of 1. Scores above 0.5 lean toward the first reading.</p>
      <ScoreScale score={result.score} modality={result.modality} />

      {result.warnings.length > 0 && (
        <ul className="warnings">{result.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
      )}

      {result.modality === "image" && (
        <div className="pair">
          {source?.url && <figure><img src={source.url} alt="The image you uploaded" /><figcaption>Your image</figcaption></figure>}
          {result.explanation_image
            ? <figure><img src={result.explanation_image} alt="Heatmap of regions that influenced the score" /><figcaption>Regions that influenced the score</figcaption></figure>
            : <p className="empty">No heatmap for this image. See the notes above.</p>}
        </div>
      )}

      {result.modality === "audio" && (
        <div>
          {source?.url && <audio controls src={source.url} className="audio" />}
          {result.explanation_image
            ? <figure><img src={result.explanation_image} alt="Spectrogram with regions that influenced the score" /><figcaption>Spectrogram. Warm colours mark influential regions.</figcaption></figure>
            : <p className="empty">No spectrogram available for this clip.</p>}
        </div>
      )}

      {result.modality === "video" && (
        <div>
          {source?.url && <video controls src={source.url} className="video" />}
          <FrameTimeline scores={(d.frame_scores as number[]) ?? []} />
        </div>
      )}

      {result.modality === "text" && source?.text && (
        <HighlightedText text={source.text} highlights={(d.highlights as Highlight[]) ?? []} />
      )}

      {result.explanation_text && <p className="explain">{result.explanation_text}</p>}

      {scalar.length > 0 && (
        <dl className="details">
          {scalar.map(([k, val]) => (
            <div key={k}><dt>{prettyKey(k)}</dt><dd>{typeof val === "number" ? val.toFixed(2) : String(val)}</dd></div>
          ))}
        </dl>
      )}

      <p className="disclaimer">{result.disclaimer}</p>
      <p className="meta">Processed in {Math.round(result.processing_ms)} ms. Model version {result.model_version}.{result.id && source && <> <Link href={`/history/${result.id}`}>Saved to history</Link>.</>}</p>
    </section>
  );
}
