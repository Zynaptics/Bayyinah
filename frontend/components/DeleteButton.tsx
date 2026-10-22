"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id, label }: { id?: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    const msg = id ? "Delete this check from history?" : "Delete all checks from history? This cannot be undone.";
    if (!window.confirm(msg)) return;
    setBusy(true); setError(null);
    try {
      const res = await fetch(id ? `/api/history/${id}` : "/api/history", { method: "DELETE" });
      if (!res.ok) throw new Error();
      if (id) router.push("/history"); else router.refresh();
    } catch {
      setError("Could not delete. Check that the backend is running.");
    } finally { setBusy(false); }
  }

  return (
    <span>
      <button type="button" className="btn danger" onClick={run} disabled={busy}>{busy ? "Deleting…" : label}</button>
      {error && <span role="alert" className="inline-error"> {error}</span>}
    </span>
  );
}
