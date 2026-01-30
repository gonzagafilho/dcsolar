"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const whatsapp = "5561999656269"; // ajuste se quiser
  const waLink = useMemo(() => {
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      "Olá! Quero um orçamento de energia solar. Pode me ajudar?"
    )}`;
  }, [whatsapp]);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    systemType: "On-grid",
    consumption: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function submitLead() {
    setNotice(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Erro ao enviar");
      }

      setNotice({ type: "ok", text: "✅ Orçamento enviado! Em breve entraremos em contato." });
      setForm({
        name: "",
        phone: "",
        city: "",
        systemType: "On-grid",
        consumption: "",
        message: "",
      });
    } catch (err: any) {
      setNotice({ type: "err", text: `❌ ${err?.message || "Falha ao enviar"}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-3 text-sm text-white/70 flex flex-wrap gap-3 justify-between">
          <div>Atendimento em todo o Brasil • Projetos • Instalação • Manutenção</div>
          <div className="flex gap-4">
            <a className="hover:text-white" href={waLink} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="hover:text-white" href="#contato">
              Contato
            </a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.45),transparent_55%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.35),transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-6 py-20 relative">
          <div className="max-w-3xl">
            <p className="text-white/70 text-sm tracking-wide">
              DC SOLAR • Energia solar on-grid, off-grid e bombeamento
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-tight">
              Energia Solar Completa:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                venda, instalação e manutenção
              </span>
            </h1>
            <p className="mt-6 text-white/75 text-lg leading-relaxed">
              Projetos dimensionados, homologação, instalação profissional e suporte pós-venda.
              Soluções para residências, comércios, indústrias e áreas rurais — em todo o Brasil.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#orcamento"
                className="inline-flex items-center justify-center rounded-xl bg-white text-black px-5 py-3 font-medium hover:opacity-90"
              >
                Pedir orçamento agora
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-medium hover:bg-white/10"
              >
                Falar no WhatsApp
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {[
                ["Projeto + Homologação", "Concessionária"],
                ["Instalação Profissional", "Equipe técnica"],
                ["Manutenção", "Preventiva e corretiva"],
                ["Bombeamento Solar", "Poço e irrigação"],
              ].map(([t, s]) => (
                <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-medium">{t}</div>
                  <div className="text-white/60 mt-1">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUÇÕES */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Soluções</h2>
        <p className="mt-3 text-white/70 max-w-3xl">
          Escolha o tipo ideal para sua necessidade. Se não souber, a gente dimensiona para você.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "On-grid",
              desc: "Conectado à rede elétrica. Reduz sua conta de luz com ótimo custo-benefício. Inclui projeto e homologação.",
              tag: "Residencial • Comercial • Industrial",
            },
            {
              title: "Off-grid",
              desc: "Autonomia com baterias. Ideal para áreas remotas, sítios e locais sem rede confiável.",
              tag: "Autonomia • Baterias",
            },
            {
              title: "Bombeamento Solar",
              desc: "Bombeamento para poço, irrigação e reserva. Dimensionado por vazão e altura manométrica.",
              tag: "Poço • Irrigação • Fazenda",
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <span className="text-xs rounded-full border border-white/15 px-3 py-1 text-white/70">
                  {c.tag}
                </span>
              </div>
              <p className="mt-4 text-white/70 leading-relaxed">{c.desc}</p>
              <a href="#orcamento" className="mt-6 inline-flex text-sm font-medium hover:underline">
                Quero orçamento →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">Serviços</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              ["Venda de equipamentos", "Módulos, inversores, estruturas e acessórios homologados."],
              ["Instalação completa", "Equipe técnica, normas, segurança e acabamento profissional."],
              ["Manutenção e limpeza", "Preventiva/corretiva, inspeção, testes e limpeza técnica."],
              ["Projetos e engenharia", "Dimensionamento, ART (quando aplicável) e homologação."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="font-semibold">{t}</div>
                <p className="mt-3 text-white/70 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Como funciona</h2>
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          {[
            ["1) Diagnóstico", "Analisamos consumo (kWh ou R$) e objetivo."],
            ["2) Projeto", "Dimensionamos e enviamos proposta detalhada."],
            ["3) Instalação", "Instalação profissional e organização do sistema."],
            ["4) Suporte", "Acompanhamento, manutenção e monitoramento."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold">{t}</div>
              <p className="mt-3 text-white/70 text-sm">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ORÇAMENTO */}
      <section id="orcamento" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">Pedir orçamento</h2>
          <p className="mt-3 text-white/70 max-w-3xl">
            Preencha os dados abaixo. Ao enviar, salvamos no nosso sistema e retornamos o contato.
          </p>

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70">Nome</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/25"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70">WhatsApp</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/25"
                    placeholder="(DDD) 9xxxx-xxxx"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70">Cidade/UF</label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/25"
                    placeholder="Ex: Brasília/DF"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70">Tipo de sistema</label>
                  <select
                    value={form.systemType}
                    onChange={(e) => setForm({ ...form, systemType: e.target.value })}
                    className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/25"
                  >
                    <option>On-grid</option>
                    <option>Off-grid</option>
                    <option>Híbrido</option>
                    <option>Bombeamento Solar</option>
                    <option>Manutenção</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/70">Consumo mensal (opcional)</label>
                <input
                  value={form.consumption}
                  onChange={(e) => setForm({ ...form, consumption: e.target.value })}
                  className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/25"
                  placeholder="Ex: 450 kWh ou R$ 380"
                />
              </div>

              <div>
                <label className="text-sm text-white/70">Mensagem</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/25 min-h-[110px]"
                  placeholder="Conte rapidamente o que você precisa"
                />
              </div>

              {notice && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm border ${
                    notice.type === "ok"
                      ? "border-green-500/30 bg-green-500/10 text-green-200"
                      : "border-red-500/30 bg-red-500/10 text-red-200"
                  }`}
                >
                  {notice.text}
                </div>
              )}

              <button
                type="button"
                onClick={submitLead}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-5 py-3 hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar orçamento"}
              </button>

              <p className="text-xs text-white/50">
                Ao enviar, você concorda com nossa Política de Privacidade (LGPD).
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold">Atendimento e confiança</h3>
              <ul className="mt-4 space-y-3 text-white/70">
                <li>• Atendimento em todo o território brasileiro</li>
                <li>• Equipamentos homologados e projeto dimensionado</li>
                <li>• Instalação segura e organizada</li>
                <li>• Suporte e manutenção</li>
              </ul>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm text-white/70">Contato rápido</div>
                <div className="mt-2 flex flex-col gap-2">
                  <a className="hover:underline" href={waLink} target="_blank" rel="noreferrer">
                    WhatsApp: (61) 99965-6269
                  </a>
                  <a className="hover:underline" href="#contato">
                    E-mail: contato@SEU-DOMINIO.com.br
                  </a>
                </div>
              </div>

              <div className="mt-8 text-sm text-white/60">
                <div className="font-medium text-white/80">Dados da empresa</div>
                <div className="mt-2">
                  Razão Social: <span className="text-white/80">[preencher]</span>
                </div>
                <div>
                  CNPJ: <span className="text-white/80">[preencher]</span>
                </div>
                <div>
                  Endereço: <span className="text-white/80">[preencher]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Perguntas frequentes</h2>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {[
            [
              "Energia solar funciona em dias nublados?",
              "Sim. A geração reduz, mas o sistema continua produzindo energia.",
            ],
            [
              "Precisa de homologação?",
              "Para on-grid, sim. Nós cuidamos do projeto e do processo junto à concessionária.",
            ],
            [
              "Qual a diferença entre on-grid e off-grid?",
              "On-grid é conectado à rede. Off-grid usa baterias para autonomia.",
            ],
            [
              "Vocês atendem todo o Brasil?",
              "Sim. Avaliamos seu projeto e direcionamos o atendimento conforme a sua região.",
            ],
          ].map(([q, a]) => (
            <div key={q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold">{q}</div>
              <p className="mt-3 text-white/70 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTATO + RODAPÉ */}
      <footer id="contato" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 md:items-start md:justify-between">
            <div>
              <div className="text-lg font-semibold">DC SOLAR</div>
              <p className="mt-3 text-white/70 max-w-md">
                Soluções completas em energia solar: on-grid, off-grid e bombeamento. Venda de equipamentos,
                instalação, manutenção e projetos.
              </p>
            </div>

            <div className="text-sm text-white/70 space-y-2">
              <div className="font-medium text-white/80">Contato</div>
              <a className="block hover:underline" href={waLink} target="_blank" rel="noreferrer">
                WhatsApp: (61) 99965-6269
              </a>
              <div>E-mail: contato@SEU-DOMINIO.com.br</div>
              <div>Endereço: [preencher]</div>
              <div>CNPJ: [preencher]</div>
            </div>
          </div>

          <div className="mt-10 text-xs text-white/40">
            © {new Date().getFullYear()} DC SOLAR. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 rounded-full bg-white text-black px-5 py-3 font-semibold shadow-lg hover:opacity-90"
      >
        WhatsApp
      </a>
    </main>
  );
}
