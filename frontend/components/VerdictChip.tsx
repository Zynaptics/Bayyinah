import { VERDICT } from "@/lib/labels";
import type { Verdict } from "@/lib/types";

export default function VerdictChip({ verdict }: { verdict: Verdict }) {
  const v = VERDICT[verdict];
  return <span className="chip" data-tone={v.tone}>{v.label}</span>;
}
