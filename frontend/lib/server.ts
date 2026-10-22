// Server-side data access for pages. Uses the same backend as the proxy; never runs in the browser.
const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function backend<T>(path: string): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${BACKEND}${path}`, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { data: null, error: body?.error ?? `The service returned an error (${res.status}).` };
    }
    return { data: (await res.json()) as T, error: null };
  } catch {
    return { data: null, error: "The analysis service is not reachable. Start the backend and refresh." };
  }
}
