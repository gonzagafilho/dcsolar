import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // validação básica
    const name = String(body?.name || "").trim();
    const phone = String(body?.phone || "").replace(/\D/g, "");
    const city = String(body?.city || "").trim();
    const consumption = String(body?.consumption || "").replace(/[^\d]/g, "");
    const systemType = String(body?.systemType || "On-grid");

    if (!name || phone.length < 10 || !city || !consumption) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    // Chama sua API real
    const apiBase = process.env.DCSOLAR_API_BASE || "https://api.dcinfinitysolar.com.br";
    const res = await fetch(`${apiBase}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, city, consumption, systemType })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ message: "Upstream error", data }, { status: 502 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
