export default function FrameTimeline({ scores }: { scores: number[] }) {
  if (!scores.length) return null;
  const w = 24, gap = 6, h = 120;
  const width = scores.length * (w + gap);
  return (
    <div className="timeline" role="img" aria-label="Score for each sampled frame">
      <svg viewBox={`0 0 ${width} ${h + 18}`} width="100%" preserveAspectRatio="xMinYMid meet">
        <line x1="0" x2={width} y1={h / 2} y2={h / 2} stroke="var(--line)" strokeDasharray="3 3" />
        {scores.map((s, i) => (
          <g key={i}>
            <rect x={i * (w + gap)} y={h - s * h} width={w} height={s * h}
                  fill={s > 0.5 ? "var(--flag)" : "var(--accent)"} rx="2" />
            <text x={i * (w + gap) + w / 2} y={h + 14} textAnchor="middle" fontSize="10" fill="var(--muted)">{i + 1}</text>
          </g>
        ))}
      </svg>
      <p className="hint">Frame number along the bottom. The dashed line is the 0.5 decision point.</p>
    </div>
  );
}
