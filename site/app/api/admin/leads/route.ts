import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.API_BASE_URL || "";
  const key = process.env.API_KEY || "";

  if (!base) {
    return NextResponse.json({ ok: false, message: "API_BASE_URL ausente" }, { status: 500 });
  }

  if (!key) {
    return NextResponse.json({ ok: false, message: "API_KEY ausente no .env.local do site" }, { status: 500 });
  }

  const r = await fetch(`${base}/leads`, {
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": key,
    },
    cache: "no-store",
  }).catch(() => null);

  if (!r) {
    return NextResponse.json({ ok: false, message: "Falha ao conectar na API" }, { status: 502 });
  }

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

