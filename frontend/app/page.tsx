import Link from "next/link";
import HistoryTable from "@/components/HistoryTable";
import { MODALITY_LABEL } from "@/lib/labels";
import { backend } from "@/lib/server";
import type { HistoryRow, ModelInfo, Modality, Stats } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Overview() {
  const [stats, recent, models] = await Promise.all([
    backend<Stats>("/api/stats"),
    backend<{ items: HistoryRow[] }>("/api/history?limit=8"),
    backend<{ items: ModelInfo[] }>("/api/models"),
  ]);

  if (stats.error || !stats.data) {
    return (
      <main className="page">
        <h1 className="page-title">Overview</h1>
        <p role="alert" className="error">{stats.error}</p>
      </main>
    );
  }

  const s = stats.data;
  const rows = recent.data?.items ?? [];
  const list = models.data?.items ?? [];
  const live = list.filter((m) => m.status === "live").length;
  const enabled = list.filter((m) => m.status !== "off").length;
  const anyMock = list.some((m) => m.status === "mock");
  const order: Modality[] = ["image", "text", "audio", "video"];

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="caption">Checks run on this installation</p>
          <p className="hero-num">{s.total}</p>
          <p className="caption">Uploaded files are discarded. Only results are kept.</p>
          <p className="hero-cta"><Link href="/verify" className="primary linkbtn">New check</Link></p>
        </div>
        <dl className="hero-stats">
          <div><dt>Flagged</dt><dd className="mono">{s.flagged}{s.total ? <small> {Math.round((s.flagged / s.total) * 100)}%</small> : null}</dd></div>
          <div><dt>Average processing time</dt><dd className="mono">{s.avg_ms === null ? "none yet" : `${Math.round(s.avg_ms)} ms`}</dd></div>
          <div><dt>Models live</dt><dd className="mono">{live}<small> of {enabled}</small></dd></div>
        </dl>
      </section>

      {anyMock && (
        <p className="notice">
          {live === 0 ? "No real model is connected yet." : "Some models are still mock."} Mock models return fixed results,
          so scores here are not real analyses. See <Link href="/models">Models</Link>.
        </p>
      )}

      <section>
        <div className="section-head">
          <h2>Recent checks</h2>
          {rows.length > 0 && <Link href="/history">View all</Link>}
        </div>
        {rows.length === 0
          ? <div className="empty-state"><p>No checks yet.</p><Link href="/verify" className="btn">Run your first check</Link></div>
          : <HistoryTable rows={rows} />}
      </section>

      {s.total > 0 && (
        <section>
          <h2>By type</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Type</th><th className="num">Checks</th><th className="num">Flagged</th><th>Flagged share</th></tr></thead>
              <tbody>
                {order.filter((m) => s.by_modality[m]).map((m) => {
                  const b = s.by_modality[m]!;
                  const pct = Math.round((b.flagged / b.total) * 100);
                  return (
                    <tr key={m}>
                      <td>{MODALITY_LABEL[m]}</td>
                      <td className="num">{b.total}</td>
                      <td className="num">{b.flagged}</td>
                      <td><div className="bar" role="img" aria-label={`${pct}% flagged`}><span style={{ width: `${pct}%` }} /></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
