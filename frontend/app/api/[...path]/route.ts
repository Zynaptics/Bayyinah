import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";
const ALLOWED = new Set(["detect", "history", "stats", "models"]);

type Ctx = { params: { path: string[] } };

// The browser only ever calls these routes. The backend address stays on the server.
async function forward(req: NextRequest, { params }: Ctx, method: "GET" | "POST" | "DELETE") {
  if (!ALLOWED.has(params.path[0])) {
    return NextResponse.json({ error: "Not found.", code: "NOT_FOUND" }, { status: 404 });
  }
  try {
    const init: RequestInit = { method, cache: "no-store" };
    if (method === "POST") {
      const type = req.headers.get("content-type") ?? "";
      if (type.includes("multipart/form-data")) init.body = await req.formData();
      else { init.headers = { "content-type": "application/json" }; init.body = await req.text(); }
    }
    const url = `${BACKEND}/api/${params.path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;
    const res = await fetch(url, init);
    return new NextResponse(await res.text(), { status: res.status, headers: { "content-type": "application/json" } });
  } catch {
    return NextResponse.json(
      { error: "The analysis service is not reachable. Start the backend and try again.", code: "BACKEND_UNREACHABLE" },
      { status: 502 },
    );
  }
}

export const GET = (req: NextRequest, ctx: Ctx) => forward(req, ctx, "GET");
export const POST = (req: NextRequest, ctx: Ctx) => forward(req, ctx, "POST");
export const DELETE = (req: NextRequest, ctx: Ctx) => forward(req, ctx, "DELETE");
