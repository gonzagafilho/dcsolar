import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const base = process.env.API_BASE_URL || "";
  const key = process.env.API_KEY || "";

  if (!base) {
    return NextResponse.json(
      { ok: false, message: "API_BASE_URL ausente" },
      { status: 500 }
    );
  }

  if (!key) {
    return NextResponse.json(
      { ok: false, message: "API_KEY ausente no .env.local do site" },
      { status: 500 }
    );
  }

  if (!id) {
    return NextResponse.json({ ok: false, message: "ID ausente" }, { status: 400 });
  }

  const r = await fetch(`${base}/leads/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-key": key,
    },
    cache: "no-store",
  }).catch(() => null);

  if (!r) {
    return NextResponse.json(
      { ok: false, message: "Falha ao conectar na API" },
      { status: 502 }
    );
  }

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
