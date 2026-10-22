import Link from "next/link";
import LocalTime from "./LocalTime";
import MiniScale from "./MiniScale";
import VerdictChip from "./VerdictChip";
import { MODALITY_LABEL, VERDICT } from "@/lib/labels";
import type { HistoryRow } from "@/lib/types";

export default function HistoryTable({ rows }: { rows: HistoryRow[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Case</th><th>Time</th><th>Type</th><th>Item</th><th>Result</th><th>Score</th><th>Model</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="mono muted">{r.id.slice(0, 6)}</td>
              <td><LocalTime iso={r.created_at} /></td>
              <td>{MODALITY_LABEL[r.modality]}</td>
              <td className="item"><Link href={`/history/${r.id}`}>{r.label}</Link></td>
              <td><VerdictChip verdict={r.verdict} /></td>
              <td><MiniScale score={r.score} tone={VERDICT[r.verdict].tone} /></td>
              <td className="mono muted">{r.model_version}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
