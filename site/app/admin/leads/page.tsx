"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  _id: string;
  name?: string;
  phone?: string;
  city?: string;
  systemType?: string;
  consumption?: string;
  message?: string;
  source?: string;
  status?: "novo" | "em_contato" | "fechado" | string;
  createdAt?: string;
  updatedAt?: string;
};

function toCSV(rows: Lead[]) {
  const header = [
    "id",
    "name",
    "phone",
    "city",
    "systemType",
    "consumption",
    "status",
    "source",
    "createdAt",
    "message",
  ];

  const esc = (v: any) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const lines = [header.join(",")];

  for (const r of rows) {
    lines.push(
      [
        r._id || "",
        r.name || "",
        r.phone || "",
        r.city || "",
        r.systemType || "",
        r.consumption || "",
        r.status || "",
        r.source || "",
        r.createdAt || "",
        r.message || "",
      ]
        .map(esc)
        .join(",")
    );
  }

  return lines.join("\n");
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

function waLink(phone?: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/55${digits}`;
}

export default function AdminLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [q, setQ] = useState("");

  // status editável por linha
  const [statusDraft, setStatusDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"todos" | "novo" | "em_contato" | "fechado">("todos");
  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/leads", { cache: "no-store" });
    const data = await r.json().catch(() => ({}));

    const list: Lead[] = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.leads)
      ? (data as any).leads
      : [];

    setLeads(list);

    // inicializa drafts com status atual
    const map: Record<string, string> = {};
    for (const l of list) map[l._id] = String(l.status || "novo");
    setStatusDraft(map);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
  const novo = leads.filter((l) => (l.status || "novo") === "novo").length;
  const em_contato = leads.filter((l) => l.status === "em_contato").length;
  const fechado = leads.filter((l) => l.status === "fechado").length;
  return {
    total: leads.length,
    novo,
    em_contato,
    fechado,
  };
}, [leads]);

const filtered = useMemo(() => {
  const s = q.trim().toLowerCase();

  // 1) filtro por status
  let list = leads;
  if (statusFilter !== "todos") {
    list = list.filter((l) => (l.status || "novo") === statusFilter);
  }

  // 2) busca
  if (s) {
    list = list.filter((l) =>
      [l.name, l.phone, l.city, l.systemType, l.consumption, l.message, l.status, l.source].some(
        (v) => String(v || "").toLowerCase().includes(s)
      )
    );
  }

  // 3) ordenar por mais recente
  list = [...list].sort((a, b) => {
    const da = a.createdAt ? Date.parse(a.createdAt) : 0;
    const db = b.createdAt ? Date.parse(b.createdAt) : 0;
    return db - da; // desc
  });

  return list;
}, [leads, q, statusFilter]);


  function exportCSV() {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function saveStatus(id: string) {
    const newStatus = statusDraft[id] || "novo";
    setSaving((p) => ({ ...p, [id]: true }));

    const r = await fetch(`/api/admin/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setSaving((p) => ({ ...p, [id]: false }));

    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setToast(j?.message || "Erro ao salvar status");
      setTimeout(() => setToast(null), 2500);
      return;
    }

    // atualiza local sem reload
    const j = await r.json().catch(() => ({}));
    const updated: Lead | undefined = (j as any)?.lead;

    setLeads((prev) =>
      prev.map((l) => (l._id === id ? { ...l, status: updated?.status ?? newStatus, updatedAt: updated?.updatedAt ?? l.updatedAt } : l))
    );

    setToast("Status salvo ✅");
    setTimeout(() => setToast(null), 1800);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="mt-1 text-white/70">
              Lista de contatos do site (buscar, WhatsApp, exportar, status).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={load}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
            >
              Atualizar
            </button>
            <button
              onClick={exportCSV}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
            >
              Exportar CSV
            </button>
            <button
              onClick={logout}
              className="rounded-xl bg-red-500/90 px-4 py-2 font-semibold text-white hover:opacity-90"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Busca */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, telefone, cidade, sistema, consumo, status..."
            className="w-full max-w-2xl rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
          />
          <button
            onClick={() => setQ("")}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
          >
            Limpar
          </button>
          <div className="text-sm text-white/70">
            {loading ? "Carregando..." : `${filtered.length} lead(s)`}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
            {toast}
          </div>
        )}
        
        {/* Filtros por status */}
<div className="mt-4 flex flex-wrap gap-2">
  <button
    onClick={() => setStatusFilter("todos")}
    className={`rounded-xl border px-4 py-2 text-sm ${
      statusFilter === "todos"
        ? "border-yellow-400 bg-yellow-400 text-black"
        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
    }`}
  >
    Todos ({stats.total})
  </button>

  <button
    onClick={() => setStatusFilter("novo")}
    className={`rounded-xl border px-4 py-2 text-sm ${
      statusFilter === "novo"
        ? "border-yellow-400 bg-yellow-400 text-black"
        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
    }`}
  >
    Novo ({stats.novo})
  </button>

  <button
    onClick={() => setStatusFilter("em_contato")}
    className={`rounded-xl border px-4 py-2 text-sm ${
      statusFilter === "em_contato"
        ? "border-yellow-400 bg-yellow-400 text-black"
        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
    }`}
  >
    Em contato ({stats.em_contato})
  </button>

  <button
    onClick={() => setStatusFilter("fechado")}
    className={`rounded-xl border px-4 py-2 text-sm ${
      statusFilter === "fechado"
        ? "border-yellow-400 bg-yellow-400 text-black"
        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
    }`}
  >
    Fechado ({stats.fechado})
  </button>
</div>

        {/* Tabela */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-12 gap-2 bg-white/5 px-4 py-3 text-sm text-white/70">
            <div className="col-span-3">Cliente</div>
            <div className="col-span-2">Cidade</div>
            <div className="col-span-2">Sistema</div>
            <div className="col-span-1">Consumo</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Ações</div>
          </div>

          {loading ? (
            <div className="p-6 text-white/70">Carregando leads...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-white/70">Nenhum lead encontrado.</div>
          ) : (
            filtered.map((l) => {
              const wa = waLink(l.phone);
              const id = l._id;

              return (
                <div
                  key={id}
                  className="grid grid-cols-12 gap-2 border-t border-white/10 px-4 py-4"
                >
                  {/* Cliente */}
                  <div className="col-span-3">
                    <div className="font-semibold">{l.name || "—"}</div>
                    <div className="text-sm text-white/80">{l.phone || "—"}</div>
                    <div className="mt-1 text-xs text-white/60">
                      Criado: {fmtDate(l.createdAt)}
                      {l.updatedAt ? ` • Atualizado: ${fmtDate(l.updatedAt)}` : ""}
                    </div>
                  </div>

                  {/* Cidade */}
                  <div className="col-span-2 text-sm text-white/80">
                    {l.city?.trim() ? l.city : "—"}
                  </div>

                  {/* Sistema */}
                  <div className="col-span-2 text-sm text-white/80">
                    {l.systemType || "—"}
                  </div>

                  {/* Consumo */}
                  <div className="col-span-1 text-sm text-white/80">
                    {l.consumption ? `${l.consumption} kWh` : "—"}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
 
                    <div className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                       <span
                         className={`mr-2 inline-block h-2 w-2 rounded-full ${
                           (statusDraft[id] || "novo") === "novo"
                             ? "bg-yellow-400"
                             : (statusDraft[id] || "novo") === "em_contato"
                             ? "bg-blue-400"
                             : "bg-green-400"
                         }`}
                       />
                       <span className="text-white/80">{statusDraft[id] || "novo"}</span>
                    </div>
                    <select
                      value={statusDraft[id] || "novo"}
                      onChange={(e) =>
                        setStatusDraft((p) => ({ ...p, [id]: e.target.value }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
                    >
                      <option value="novo">novo</option>
                      <option value="em_contato">em_contato</option>
                      <option value="fechado">fechado</option>
                    </select>
                    {l.message ? (
                      <div className="mt-2 text-xs text-white/60 line-clamp-2">
                        {l.message}
                      </div>
                    ) : null}
                  </div>

                  {/* Ações */}
                  <div className="col-span-2 flex items-start justify-end gap-2">
                    <button
                      onClick={() => saveStatus(id)}
                      disabled={!!saving[id]}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
                    >
                      {saving[id] ? "Salvando..." : "Salvar"}
                    </button>

                    {wa ? (
                      <a
                        href={wa}
                        target="_blank"
                        className="rounded-xl bg-yellow-400 px-3 py-2 text-sm font-semibold text-black hover:opacity-90"
                      >
                        WhatsApp
                      </a>
                    ) : (
                      <span className="px-3 py-2 text-xs text-white/50">Sem tel.</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

