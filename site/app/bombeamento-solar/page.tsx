import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bombeamento Solar",
  description:
    "Bombeamento solar para poço, irrigação e água na zona rural. Reduza custos com energia e tenha autonomia. Solicite orçamento com a DC Infinity Solar.",
  alternates: {
    canonical: "https://dcinfinitysolar.com.br/bombeamento-solar",
  },
  openGraph: {
    type: "website",
    url: "https://dcinfinitysolar.com.br/bombeamento-solar",
    title: "Bombeamento Solar | DC Infinity Solar",
    description:
      "Solução para bombeamento de água com energia solar: poço, irrigação, reservatórios e abastecimento rural.",
    images: [
      {
        url: "/images/projetos/hero-solar.jpg",
        width: 1200,
        height: 630,
        alt: "Bombeamento Solar - DC Infinity Solar",
      },
    ],
    locale: "pt_BR",
    siteName: "DC Infinity Solar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bombeamento Solar | DC Infinity Solar",
    description:
      "Bombeamento de água com energia solar para poço, irrigação e reservatórios. Projeto e instalação.",
    images: ["/images/projetos/hero-solar.jpg"],
  },
};

export default function BombeamentoSolarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bombeamento Solar",
    serviceType: "Bombeamento de água com energia solar",
    provider: {
      "@type": "LocalBusiness",
      name: "DC Infinity Solar",
      url: "https://dcinfinitysolar.com.br",
    },
    areaServed: "BR",
    description:
      "Solução de bombeamento de água com energia solar para poço, irrigação, reservatórios e abastecimento rural. Projeto e instalação.",
    url: "https://dcinfinitysolar.com.br/bombeamento-solar",
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <div className="h-full w-full bg-gradient-to-b from-yellow-500/20 via-black to-black" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="text-sm text-white/70">
            DC Infinity Solar • Energia Solar em todo o Brasil
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            <span className="text-yellow-400">Bombeamento</span> Solar
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Bombeie água com energia solar para poço, irrigação, reservatórios e
            abastecimento rural — reduzindo custos e aumentando a autonomia.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://wa.me/5561999656269?text=Olá!%20Quero%20orçamento%20de%20Bombeamento%20Solar%20(água%2Fpoço%2Firrigação)."
              className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black hover:opacity-90"
            >
              Solicitar orçamento no WhatsApp
            </a>
            <a
              href="/#projetos"
              className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Ver projetos
            </a>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Aplicação</p>
              <p className="mt-1 text-xl font-semibold">Poço e irrigação</p>
              <p className="mt-2 text-white/80">
                Ideal para zonas rurais, fazendas e sítios com necessidade diária de água.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Benefício</p>
              <p className="mt-1 text-xl font-semibold">Menos custo</p>
              <p className="mt-2 text-white/80">
                Redução de gastos com energia elétrica, diesel ou geradores.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Entrega</p>
              <p className="mt-1 text-xl font-semibold">Projeto completo</p>
              <p className="mt-2 text-white/80">
                Dimensionamento conforme vazão, altura manométrica e distância.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Como funciona</h2>
            <p className="mt-4 text-white/80">
              No <strong>bombeamento solar</strong>, as placas fotovoltaicas alimentam a bomba
              (direto em corrente contínua ou via inversor), usando a energia do sol para
              puxar água do poço e levar até reservatórios, caixas d’água ou sistemas de irrigação.
            </p>

            <h3 className="mt-8 text-xl font-semibold">Onde é mais usado</h3>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
              <li>Poço artesiano / poço semiartesiano</li>
              <li>Irrigação (gotejamento, aspersão, pivô pequeno)</li>
              <li>Abastecimento de reservatório e caixa d’água</li>
              <li>Piscicultura e dessedentação animal</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold md:text-3xl">O que precisamos pra calcular</h2>
            <p className="mt-4 text-white/80">
              Para dimensionar corretamente, precisamos dessas informações:
            </p>

            <ul className="mt-4 space-y-3 text-white/80">
              <li>✅ Profundidade do poço / nível dinâmico</li>
              <li>✅ Distância até o reservatório/ponto de uso</li>
              <li>✅ Altura (desnível) total</li>
              <li>✅ Vazão desejada (litros/hora ou m³/dia)</li>
              <li>✅ Tipo de uso (irrigação, animais, casa, etc.)</li>
            </ul>

            <div className="mt-8 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-5">
              <p className="text-sm text-yellow-200">Dica prática</p>
              <p className="mt-2 text-white/85">
                Se você não souber todos os dados, a gente te orienta. Pode mandar foto da bomba
                atual, do poço e do local no WhatsApp.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold md:text-3xl">Vantagens do bombeamento solar</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["Economia", "Reduz gastos com energia ou combustível para bombear água."],
              ["Autonomia", "Funciona com o sol — ideal para áreas remotas."],
              ["Baixa manutenção", "Sistema robusto, com pouca manutenção quando bem dimensionado."],
              ["Escalável", "Pode começar menor e aumentar conforme sua necessidade."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-white/10 bg-black/20 p-5">
                <p className="text-lg font-semibold">{t}</p>
                <p className="mt-2 text-white/80">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <h3 className="text-xl font-bold">Quer um orçamento de bombeamento solar?</h3>
            <p className="mt-1 text-white/80">
              Chame no WhatsApp e envie as medidas/vazão. Se não souber, mande fotos que a gente te orienta.
            </p>
          </div>
          <a
            href="https://wa.me/5561999656269?text=Olá!%20Quero%20um%20orçamento%20de%20Bombeamento%20Solar.%20Vou%20enviar%20as%20informações%20do%20poço."
            className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Falar com especialista
          </a>
        </div>
      </section>
    </main>
  );
}
