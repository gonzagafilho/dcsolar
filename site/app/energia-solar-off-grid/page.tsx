import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Energia Solar Off-Grid",
  description:
    "Energia solar off-grid (com baterias): autonomia, energia em locais sem rede e segurança contra quedas. Solicite orçamento com a DC Infinity Solar.",
  alternates: {
    canonical: "https://dcinfinitysolar.com.br/energia-solar-off-grid",
  },
  openGraph: {
    type: "website",
    url: "https://dcinfinitysolar.com.br/energia-solar-off-grid",
    title: "Energia Solar Off-Grid | DC Infinity Solar",
    description:
      "Sistema com baterias para autonomia e energia onde não há rede. Projeto, instalação e suporte.",
    images: [
      {
        url: "/images/projetos/hero-solar.jpg",
        width: 1200,
        height: 630,
        alt: "Energia Solar Off-Grid - DC Infinity Solar",
      },
    ],
    locale: "pt_BR",
    siteName: "DC Infinity Solar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Energia Solar Off-Grid | DC Infinity Solar",
    description:
      "Sistema com baterias para autonomia e energia onde não há rede. Projeto e instalação.",
    images: ["/images/projetos/hero-solar.jpg"],
  },
};

export default function EnergiaSolarOffGridPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Energia Solar Off-Grid",
    serviceType: "Sistema fotovoltaico off-grid (com baterias)",
    provider: {
      "@type": "LocalBusiness",
      name: "DC Infinity Solar",
      url: "https://dcinfinitysolar.com.br",
    },
    areaServed: "BR",
    description:
      "Sistema solar com baterias para autonomia em locais sem rede ou com instabilidade. Projeto, instalação e manutenção.",
    url: "https://dcinfinitysolar.com.br/energia-solar-off-grid",
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <div className="h-full w-full bg-gradient-to-b from-yellow-500/20 via-black to-black" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="text-sm text-white/70">
            DC Infinity Solar • Energia Solar em todo o Brasil
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            Energia Solar <span className="text-yellow-400">Off-Grid</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Energia com autonomia: sistema com baterias para locais sem rede, áreas rurais,
            fazendas, sítios e para quem precisa de segurança contra quedas de energia.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://wa.me/5561999656269?text=Olá!%20Quero%20orçamento%20de%20Energia%20Solar%20Off-Grid%20(com%20baterias)."
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
              <p className="text-sm text-white/70">Benefício</p>
              <p className="mt-1 text-xl font-semibold">Autonomia</p>
              <p className="mt-2 text-white/80">
                Energia mesmo onde não existe rede elétrica ou quando a rede falha.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Diferencial</p>
              <p className="mt-1 text-xl font-semibold">Baterias</p>
              <p className="mt-2 text-white/80">
                Armazenamento para uso à noite e em períodos de baixa geração.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Entrega</p>
              <p className="mt-1 text-xl font-semibold">Projeto completo</p>
              <p className="mt-2 text-white/80">
                Dimensionamento correto para sua carga, autonomia e segurança.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Como funciona</h2>
            <p className="mt-4 text-white/80">
              No sistema <strong>off-grid</strong>, as placas solares carregam um banco de baterias
              através de um controlador/inversor. A energia armazenada é usada quando não há sol,
              como à noite, e garante funcionamento mesmo sem rede elétrica.
            </p>

            <h3 className="mt-8 text-xl font-semibold">Componentes principais</h3>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
              <li>Módulos fotovoltaicos (placas)</li>
              <li>Inversor/Controlador (conforme o projeto)</li>
              <li>Banco de baterias (autonomia)</li>
              <li>Estruturas, cabeamento e proteções</li>
              <li>Projeto e instalação profissional</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold md:text-3xl">Quando vale a pena?</h2>
            <ul className="mt-4 space-y-3 text-white/80">
              <li>✅ Propriedades sem rede (rural, sítio, fazenda)</li>
              <li>✅ Locais com muitas quedas de energia</li>
              <li>✅ Necessidade de autonomia (câmeras, internet, iluminação)</li>
              <li>✅ Sistemas críticos (bombas, refrigeração, etc.)</li>
            </ul>

            <div className="mt-8 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-5">
              <p className="text-sm text-yellow-200">Dica</p>
              <p className="mt-2 text-white/85">
                Off-grid exige dimensionamento bem feito (carga + autonomia). Envie sua lista
                de equipamentos e horas de uso para fazermos o cálculo correto.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <h3 className="text-xl font-bold">Quer autonomia de verdade?</h3>
            <p className="mt-1 text-white/80">
              Chame no WhatsApp e diga onde será instalado e quais equipamentos você quer alimentar.
            </p>
          </div>
          <a
            href="https://wa.me/5561999656269?text=Olá!%20Quero%20um%20orçamento%20Off-Grid.%20Vou%20enviar%20minha%20lista%20de%20cargas."
            className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Falar com especialista
          </a>
        </div>
      </section>
    </main>
  );
}

