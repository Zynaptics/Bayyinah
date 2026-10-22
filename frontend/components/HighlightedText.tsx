import type { Highlight } from "@/lib/types";

const clean = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** Marks the words the model weighted most. Works for Urdu script (dir="auto"). */
export default function HighlightedText({ text, highlights }: { text: string; highlights: Highlight[] }) {
  const weights = new Map(highlights.map((h) => [clean(h.token), h.influence]));
  const parts = text.split(/(\s+)/);
  return (
    <p className="highlighted" dir="auto">
      {parts.map((part, i) => {
        const w = weights.get(clean(part));
        return w !== undefined && clean(part) !== ""
          ? <mark key={i} title={`Influence ${w.toFixed(2)}`}>{part}</mark>
          : <span key={i}>{part}</span>;
      })}
    </p>
  );
}
