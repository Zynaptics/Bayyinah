/** Compact 0 to 1 ruler for tables. The marker colour follows the verdict tone. */
export default function MiniScale({ score, tone }: { score: number; tone: "alert" | "ok" }) {
  const pct = Math.min(100, Math.max(0, score * 100));
  return (
    <span className="mini-wrap">
      <span className="mini" data-tone={tone} role="img" aria-label={`Score ${score.toFixed(2)} out of 1`}>
        <i style={{ left: `${pct}%` }} />
      </span>
      <span className="mono">{score.toFixed(2)}</span>
    </span>
  );
}
