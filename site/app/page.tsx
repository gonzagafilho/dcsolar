"use client";

import { useState } from "react";

type ProjetoSelecionado = {
  src: string;
  title: string;
  desc: string;
  type: "Residencial" | "Comercial" | "Bombeamento" | "Manutenção";
};

export default function Home() {
  const whatsapp = "5561999656269";

const waLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
  "Olá! Quero um orçamento de energia solar. Pode me ajudar?"
)}`;

const [loading, setLoading] = useState(false);
const [notice, setNotice] =
  useState<{ type: "ok" | "err"; text: string } | null>(null);
const [filtroProjetos, setFiltroProjetos] = useState<
  "Todos" | "Residencial" | "Comercial" | "Bombeamento" | "Manutenção"
>("Todos");

const [projetoSelecionado, setProjetoSelecionado] =
  useState<ProjetoSelecionado | null>(null);
const projetos = [
  { src: "/images/projetos/res-01.jpg", title: "Projeto Residencial", desc: "Sistema on-grid com instalação e homologação.", type: "Residencial" as const },
  { src: "/images/projetos/res-02.jpg", title: "Residencial • Telhado", desc: "Organização, acabamento e alto padrão.", type: "Residencial" as const },
  { src: "/images/projetos/res-03.jpg", title: "Residencial • Economia", desc: "Dimensionamento para reduzir a conta de energia.", type: "Residencial" as const },

  { src: "/images/projetos/com-01.jpg", title: "Projeto Comercial", desc: "Solução para comércio com foco em retorno.", type: "Comercial" as const },
  { src: "/images/projetos/com-02.jpg", title: "Comercial • Alta Demanda", desc: "Projeto dimensionado para consumo elevado.", type: "Comercial" as const },

  { src: "/images/projetos/bom-01.jpg", title: "Bombeamento Solar", desc: "Poço/irrigação com eficiência e baixo custo.", type: "Bombeamento" as const },
  { src: "/images/projetos/bom-02.jpg", title: "Bombeamento • Área Rural", desc: "Solução para fazenda e áreas remotas.", type: "Bombeamento" as const },

  { src: "/images/projetos/man-01.jpg", title: "Manutenção Preventiva", desc: "Revisão e inspeção para manter alta geração.", type: "Manutenção" as const },
  { src: "/images/projetos/man-02.jpg", title: "Manutenção e Limpeza", desc: "Limpeza técnica e testes de desempenho.", type: "Manutenção" as const },
];
const projetosFiltrados =
  filtroProjetos === "Todos" ? projetos : projetos.filter((p) => p.type === filtroProjetos);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    systemType: "On-grid",
    consumption: "",
    message: "",
  });

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
     {/* TOP BAR (novo) */}
     <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
       <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-4">
         {/* Logo (texto por enquanto) */}
         <a href="#topo" className="flex items-center gap-3">
           <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500" />
           <div className="leading-tight">
             <div className="font-semibold text-white">DC SOLAR</div>
             <div className="text-xs text-white/60">Energia Solar • Brasil</div>
           </div>
         </a>

         {/* Menu */}
         <nav className="hidden md:flex items-center gap-5 text-sm text-white/70">
           <a className="hover:text-white" href="#empresa">Empresa</a>
           <div className="relative group">
  <a className="hover:text-white" href="#solucoes">
    Soluções
  </a>

  <div className="invisible absolute left-0 top-full z-50 mt-3 w-72 rounded-2xl border border-white/10 bg-black/95 p-2 opacity-0 shadow-lg backdrop-blur transition-all group-hover:visible group-hover:opacity-100">
    <a
      className="block rounded-xl px-4 py-3 text-white/85 hover:bg-white/10 hover:text-white"
      href="/energia-solar-on-grid"
    >
      <div className="font-semibold">Energia Solar On-Grid</div>
      <div className="text-sm text-white/70">Conectado à rede, economia na conta.</div>
    </a>

    <a
      className="block rounded-xl px-4 py-3 text-white/85 hover:bg-white/10 hover:text-white"
      href="/energia-solar-off-grid"
    >
      <div className="font-semibold">Energia Solar Off-Grid</div>
      <div className="text-sm text-white/70">Com baterias, autonomia total.</div>
    </a>

    <a
      className="block rounded-xl px-4 py-3 text-white/85 hover:bg-white/10 hover:text-white"
      href="/bombeamento-solar"
    >
      <div className="font-semibold">Bombeamento Solar</div>
      <div className="text-sm text-white/70">Poço, irrigação e água na zona rural.</div>
    </a>
  </div>
</div>

           <a className="hover:text-white" href="#projetos">Projetos</a>
           <a className="hover:text-white" href="#servicos">Serviços</a>
           <a className="hover:text-white" href="#suporte">Suporte</a>
         </nav>

         {/* Ações */}
         <div className="flex items-center gap-3">
           <a
             className="hidden sm:inline-flex text-sm text-white/70 hover:text-white"
             href={waLink}
             target="_blank"
             rel="noreferrer"
           >
             WhatsApp
           </a>

           <a
             href="#orcamento"
             className="inline-flex items-center justify-center rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90"
           >
             Pedir orçamento
           </a>
         </div>
       </div>
      </header> 

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center">
        <img
          src="/images/projetos/hero-solar.jpg"
          alt="Instalação de energia solar"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

         <div className="relative z-10 mx-auto max-w-6xl px-6 text-white">
           <p className="text-sm text-white/70">
             DC SOLAR • Energia solar em todo o Brasil
            </p>

             <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
               Energia Solar que{" "}
              <span className="text-yellow-400">gera economia</span>{" "}
                e valor para o seu imóvel
              </h1>

               <p className="mt-6 max-w-2xl text-lg text-white/80">
                 Venda, projetos, instalação e manutenção de sistemas solares
                 on-grid, off-grid e bombeamento.
                </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
               <a
                 href="#orcamento"
                 className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90"
               >
                Solicitar orçamento
              </a>
              <a
                href="https://wa.me/5561999656269"
                target="_blank"
                className="border border-white/40 px-6 py-3 rounded-xl"
              >
               WhatsApp
              </a>
            </div>
           </div>
       </section>
       {/* EMPRESA */}
       <section id="empresa" className="mx-auto max-w-6xl px-6 py-16">
         <div className="grid lg:grid-cols-2 gap-10 items-start">
           <div>
             <h2 className="text-2xl md:text-3xl font-semibold">Sobre a DC SOLAR</h2>
             <p className="mt-4 text-white/70 leading-relaxed">
               Atuamos com soluções completas em energia solar: projetos, venda de equipamentos,
               instalação profissional e manutenção. Atendimento em todo o Brasil, com dimensionamento
               sob medida para residências, comércios, indústrias e área rural.
             </p>

             <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
               {[
                 ["Projeto e homologação", "Acompanhamento com concessionária"],
                 ["Equipe especializada", "Instalação segura e organizada"],
                 ["Pós-venda", "Suporte e manutenção"],
                 ["Soluções completas", "On-grid, off-grid e bombeamento"],
                ].map(([t, s]) => (
                  <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="font-medium">{t}</div>
                    <div className="text-white/60 mt-1">{s}</div>
                  </div>
                ))}
               </div>

               <div className="mt-8 flex gap-3">
                 <a
                   href="#orcamento"
                   className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-3 font-semibold hover:opacity-90"
                 >
                   Simular orçamento
                 </a>
                 <a
                   href={waLink}
                   target="_blank"
                   rel="noreferrer"
                   className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10"
                 >
                   Tirar dúvidas no WhatsApp
                 </a>
               </div>
             </div>

             <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
               <img
                 src="/images/projetos/equipe.jpg"
                 alt="Equipe DC SOLAR"
                 className="w-full h-[420px] object-cover"
               />
             </div>
           </div>
          </section>
      {/* SOLUÇÕES */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
  <a
    href="/energia-solar-on-grid"
    className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
  >
    <p className="text-sm text-white/70">Solução</p>
    <h3 className="mt-1 text-xl font-semibold">Energia Solar On-Grid</h3>
    <p className="mt-2 text-white/80">
      Sistema conectado à rede para reduzir sua conta de luz com ótimo custo-benefício.
    </p>
    <p className="mt-4 font-semibold text-yellow-300">Ver detalhes →</p>
  </a>

  <a
    href="/energia-solar-off-grid"
    className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
  >
    <p className="text-sm text-white/70">Solução</p>
    <h3 className="mt-1 text-xl font-semibold">Energia Solar Off-Grid</h3>
    <p className="mt-2 text-white/80">
      Sistema com baterias para autonomia em áreas rurais, sítios e locais sem rede.
    </p>
    <p className="mt-4 font-semibold text-yellow-300">Ver detalhes →</p>
  </a>

  <a
    href="/bombeamento-solar"
    className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
  >
    <p className="text-sm text-white/70">Solução</p>
    <h3 className="mt-1 text-xl font-semibold">Bombeamento Solar</h3>
    <p className="mt-2 text-white/80">
      Bombeamento de água para poço, irrigação, reservatórios e abastecimento rural.
    </p>
    <p className="mt-4 font-semibold text-yellow-300">Ver detalhes →</p>
  </a>
</div>

      <section id="solucoes" className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold">Projetos de Energia Solar</h2>
          <p className="mt-3 text-white/70">
            Alguns exemplos de soluções entregues aos nossos clientes.
           </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { img: "/images/projetos/res-01.jpg", title: "Residencial" },
              { img: "/images/projetos/com-01.jpg", title: "Comercial" },
              { img: "/images/projetos/bom-01.jpg", title: "Bombeamento Solar" },
             ].map((p) => (
               <div
                 key={p.title}
                 className="rounded-2xl overflow-hidden border border-white/10"
              >
                 <img src={p.img} className="h-56 w-full object-cover" />
                 <div className="p-5 bg-black/80">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-white/60 mt-1">
                    Projeto completo com instalação profissional.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* PROJETOS (Galeria dinâmica) */}
      <section id="projetos" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">Projetos de Energia Solar</h2>
              <p className="mt-3 text-white/70 max-w-3xl">
                Galeria com exemplos de projetos entregues: instalação profissional, organização e
                acabamento. Clique em uma foto para ver em destaque.
              </p>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 text-sm">
              {["Todos", "Residencial", "Comercial", "Bombeamento", "Manutenção"].map((t) => (
                <button
                  key={t}
                  type="button"
                   onClick={() => setFiltroProjetos(t as any)}
                   className={`rounded-full px-4 py-2 border transition ${
                   filtroProjetos === t
                     ? "bg-white text-black border-white"
                     : "border-white/15 text-white/70 hover:bg-white/10"
                 }`}
                >
                 {t}
                </button>
            ))}
          </div>
        </div>

         {/* GRID */}
         <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {projetosFiltrados.map((p) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setProjetoSelecionado(p)}
                className="text-left rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
             >
                <img src={p.src} alt={p.title} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="text-xs rounded-full border border-white/15 px-3 py-1 text-white/70">
                    {p.type}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/70">{p.desc}</p>
              </div>
            </button>
           ))}
        </div>

         {/* MODAL */}
         {projetoSelecionado && (
           <div
             className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
             onClick={() => setProjetoSelecionado(null)}
           >
            <div
              className="w-full max-w-4xl rounded-3xl overflow-hidden border border-white/10 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={projetoSelecionado.src}
                  alt={projetoSelecionado.title}
                  className="w-full max-h-[70vh] object-cover"
                />
                <button
                  type="button"
                  onClick={() => setProjetoSelecionado(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/60 border border-white/15 px-4 py-2 text-sm hover:bg-black/80"
                >
                  Fechar ✕
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div>
                    <div className="text-xs text-white/60">Categoria</div>
                    <div className="mt-1 inline-flex text-xs rounded-full border border-white/15 px-3 py-1 text-white/80">
                      {projetoSelecionado.type}
                    </div>

                     <h3 className="mt-3 text-xl font-semibold">{projetoSelecionado.title}</h3>
                     <p className="mt-2 text-white/70">{projetoSelecionado.desc}</p>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[240px]">
                    <a
                       href="#orcamento"
                       className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-3 font-semibold hover:opacity-90 text-center"
                       onClick={() => setProjetoSelecionado(null)}
                    >
                       Pedir orçamento
                    </a>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-white/15 px-5 py-3 hover:bg-white/10 text-center"
                    >
                      Falar no WhatsApp
                    </a>
                    <div className="text-xs text-white/50">
                      Atendimento em todo o Brasil • Instalação • Manutenção
                    </div>
                   </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* SERVIÇOS */}
      <section id="servicos" className="border-t border-white/10">
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
      {/* SUPORTE */}
      <section id="suporte" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">Suporte</h2>
          <p className="mt-3 text-white/70 max-w-3xl">
             Precisa de ajuda com seu sistema? Atendimento para manutenção, limpeza técnica,
             falhas de geração, inversor, monitoramento e revisão preventiva.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold">Suporte WhatsApp</div>
              <p className="mt-3 text-white/70 text-sm">
                 Atendimento rápido para tirar dúvidas, solicitar visita e suporte técnico.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex text-sm font-medium hover:underline"
              >
                Chamar no WhatsApp →
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold">Abrir chamado</div>
              <p className="mt-3 text-white/70 text-sm">
                Informe seu nome, cidade e o problema no formulário de orçamento e selecione “Manutenção”.
              </p>
              <a href="#orcamento" className="mt-5 inline-flex text-sm font-medium hover:underline">
                Ir para o formulário →
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold">Horário de atendimento</div>
              <p className="mt-3 text-white/70 text-sm">
                Segunda a sexta: 08h às 18h <br />
                Sábado: 08h às 12h
              </p>
              <p className="mt-4 text-white/60 text-sm">
                Emergências: atendimento via WhatsApp.
              </p>
            </div>
          </div>
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
