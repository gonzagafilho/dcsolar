// app/energia-solar-on-grid/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Energia Solar On-Grid",
  description:
    "Energia solar on-grid: conectada à rede, economia na conta de luz e projeto completo. Solicite orçamento com a DC Infinity Solar.",
  alternates: {
    canonical: "https://dcinfinitysolar.com.br/energia-solar-on-grid",
  },
  openGraph: {
    type: "website",
    url: "https://dcinfinitysolar.com.br/energia-solar-on-grid",
    title: "Energia Solar On-Grid | DC Infinity Solar",
    description:
      "Entenda como funciona o sistema on-grid (conectado à rede), benefícios, custos e como solicitar seu orçamento.",
    images: [
      {
        url: "/images/projetos/hero-solar.jpg",
        width: 1200,
        height: 630,
        alt: "Energia Solar On-Grid - DC Infinity Solar",
      },
    ],
    locale: "pt_BR",
    siteName: "DC Infinity Solar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Energia Solar On-Grid | DC Infinity Solar",
    description:
      "Sistema conectado à rede para reduzir sua conta de energia. Projeto, instalação e suporte.",
    images: ["/images/projetos/hero-solar.jpg"],
  },
};

export default function EnergiaSolarOnGridPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Energia Solar On-Grid",
    serviceType: "Sistema fotovoltaico on-grid (conectado à rede)",
    provider: {
      "@type": "LocalBusiness",
      name: "DC Infinity Solar",
      url: "https://dcinfinitysolar.com.br",
    },
    areaServed: "BR",
    description:
      "Sistema solar conectado à rede elétrica para gerar economia na conta de luz. Projeto, instalação e manutenção.",
    url: "https://dcinfinitysolar.com.br/energia-solar-on-grid",
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
          {/* fundo com degradê para manter leve */}
          <div className="h-full w-full bg-gradient-to-b from-yellow-500/20 via-black to-black" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="text-sm text-white/70">
            DC Infinity Solar • Energia Solar em todo o Brasil
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            Energia Solar <span className="text-yellow-400">On-Grid</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Sistema conectado à rede elétrica para reduzir a conta de luz com
            segurança, alta eficiência e excelente custo-benefício.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://wa.me/5561999656269?text=Olá!%20Quero%20orçamento%20de%20Energia%20Solar%20On-Grid."
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
              <p className="mt-1 text-xl font-semibold">Economia imediata</p>
              <p className="mt-2 text-white/80">
                Reduz drasticamente a conta de energia e aumenta o valor do imóvel.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Modelo</p>
              <p className="mt-1 text-xl font-semibold">Conectado à rede</p>
              <p className="mt-2 text-white/80">
                Geração durante o dia e compensação na fatura conforme regras da sua concessionária.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">Entrega</p>
              <p className="mt-1 text-xl font-semibold">Projeto + instalação</p>
              <p className="mt-2 text-white/80">
                Dimensionamento, homologação e instalação profissional com suporte.
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
              No sistema <strong>on-grid</strong>, as placas solares geram energia
              durante o dia. Essa energia é usada no imóvel e o excedente vai para a rede
              (dependendo das regras da sua concessionária), gerando créditos que podem
              abater o consumo em outros horários.
            </p>

            <h3 className="mt-8 text-xl font-semibold">Principais componentes</h3>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
              <li>Módulos fotovoltaicos (placas solares)</li>
              <li>Inversor on-grid (converte energia para uso na rede)</li>
              <li>Estrutura de fixação (telhado/solo)</li>
              <li>Proteções elétricas e cabeamento</li>
              <li>Projeto e homologação junto à concessionária</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold md:text-3xl">Para quem é ideal?</h2>
            <ul className="mt-4 space-y-3 text-white/80">
              <li>✅ Casas e comércios com consumo de energia constante</li>
              <li>✅ Quem quer reduzir a fatura sem usar baterias</li>
              <li>✅ Empresas buscando previsibilidade e economia mensal</li>
              <li>✅ Propriedades com boa incidência solar</li>
            </ul>

            <div className="mt-8 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-5">
              <p className="text-sm text-yellow-200">Importante</p>
              <p className="mt-2 text-white/85">
                O sistema on-grid depende da rede elétrica: em caso de falta de energia na rua,
                o inversor desliga por segurança. Se você precisa autonomia, considere off-grid
                ou híbrido.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold md:text-3xl">Passo a passo do seu projeto</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["Análise do consumo", "Coletamos sua fatura e entendemos o objetivo de economia."],
              ["Dimensionamento", "Calculamos o tamanho ideal do sistema para seu perfil."],
              ["Proposta", "Você recebe uma proposta clara com equipamentos e prazos."],
              ["Homologação", "Entrada do processo junto à concessionária (quando aplicável)."],
              ["Instalação", "Equipe especializada instala com segurança e padrão técnico."],
              ["Pós-venda", "Suporte, monitoramento e manutenção quando necessário."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-xl border border-white/10 bg-black/20 p-5">
                <p className="text-lg font-semibold">{t}</p>
                <p className="mt-2 text-white/80">{d}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <h3 className="text-xl font-bold">Quer um orçamento agora?</h3>
            <p className="mt-1 text-white/80">
              Chame no WhatsApp e mande sua fatura de energia para dimensionarmos.
            </p>
          </div>
          <a
            href="https://wa.me/5561999656269?text=Olá!%20Quero%20um%20orçamento%20On-Grid.%20Vou%20enviar%20minha%20fatura."
            className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Falar com especialista
          </a>
        </div>
      </section>
    </main>
  );
}

