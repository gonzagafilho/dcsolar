import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function sign(payloadB64: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const user = String(body.user || "");
  const pass = String(body.pass || "");

  const ADMIN_USER = process.env.ADMIN_USER || "";
  const ADMIN_PASS = process.env.ADMIN_PASS || "";
  const SECRET = process.env.ADMIN_SESSION_SECRET || "";

  if (!ADMIN_USER || !ADMIN_PASS || !SECRET) {
    return NextResponse.json({ ok: false, message: "Admin não configurado" }, { status: 500 });
  }

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return NextResponse.json({ ok: false, message: "Credenciais inválidas" }, { status: 401 });
  }

  // sessão 7 dias
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const payload = Buffer.from(JSON.stringify({ exp }), "utf8").toString("base64url");
  const sig = sign(payload, SECRET);
  const token = `${payload}.${sig}`;

  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
