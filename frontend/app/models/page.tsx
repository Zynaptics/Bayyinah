import { backend } from "@/lib/server";
import type { ModelInfo } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS = { mock: "Mock", live: "Live", off: "Not enabled" } as const;

export default async function Models() {
  const { data, error } = await backend<{ items: ModelInfo[] }>("/api/models");
  const items = data?.items ?? [];
  return (
    <main className="page">
      <header className="page-head">
        <div>
          <h1 className="page-title">Models</h1>
          <p className="sub">What each check does, what it accepts, and whether a real model is connected.</p>
        </div>
      </header>
      {error && <p role="alert" className="error">{error}</p>}
      {items.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Check</th><th>Status</th><th>Version</th><th>Planned approach</th><th>Accepts</th><th>Evaluation</th></tr></thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.modality}>
                  <td className="item"><strong>{m.title}</strong></td>
                  <td><span className="chip" data-tone={m.status === "live" ? "ok" : m.status === "mock" ? "warn" : "none"}>{STATUS[m.status]}</span></td>
                  <td className="muted">{m.version}</td>
                  <td className="wrap">{m.planned}</td>
                  <td className="wrap muted">{m.accepts}</td>
                  <td className="muted">{m.evaluation ? Object.entries(m.evaluation).map(([k, v]) => `${k} ${v}`).join(", ") : "Not evaluated yet"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="sub note">Evaluation results are added after the image, text and audio evaluations. Until then, no accuracy is claimed.</p>
    </main>
  );
}
