import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import HistoryTable from "@/components/HistoryTable";
import { ENABLED } from "@/lib/limits";
import { MODALITY_LABEL } from "@/lib/labels";
import { backend } from "@/lib/server";
import type { HistoryRow, Modality } from "@/lib/types";

export const dynamic = "force-dynamic";
const TYPES: Modality[] = ["image", "text", "audio", "video"];

export default async function History({ searchParams }: { searchParams: { type?: string } }) {
  const type = TYPES.includes(searchParams.type as Modality) ? (searchParams.type as Modality) : undefined;
  const { data, error } = await backend<{ items: HistoryRow[] }>(`/api/history?limit=100${type ? `&modality=${type}` : ""}`);
  const rows = data?.items ?? [];

  return (
    <main className="page">
      <header className="page-head">
        <div>
          <h1 className="page-title">History</h1>
          <p className="sub">Results of past checks. The files themselves were not kept.</p>
        </div>
        {rows.length > 0 && !type && <DeleteButton label="Clear history" />}
      </header>

      <nav className="filters" aria-label="Filter by type">
        <Link href="/history" aria-current={!type ? "page" : undefined}>All</Link>
        {TYPES.filter((t) => ENABLED[t]).map((t) => (
          <Link key={t} href={`/history?type=${t}`} aria-current={type === t ? "page" : undefined}>{MODALITY_LABEL[t]}</Link>
        ))}
      </nav>

      {error && <p role="alert" className="error">{error}</p>}
      {!error && rows.length === 0 && (
        <div className="empty-state">
          <p>{type ? `No ${MODALITY_LABEL[type].toLowerCase()} checks yet.` : "No checks yet."}</p>
          <Link href="/verify" className="btn">Run a check</Link>
        </div>
      )}
      {rows.length > 0 && <HistoryTable rows={rows} />}
    </main>
  );
}
