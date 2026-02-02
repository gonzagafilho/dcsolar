import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dcinfinitysolar.com.br"),
  title: {
    default: "DC Infinity Solar | Energia Solar em todo o Brasil",
    template: "%s | DC Infinity Solar",
  },
  description:
    "Venda, projetos, instalação e manutenção de sistemas solares on-grid, off-grid e bombeamento. Atendimento em todo o Brasil. Solicite orçamento no WhatsApp.",
  applicationName: "DC Infinity Solar",
  keywords: [
    "energia solar",
    "placas solares",
    "sistema fotovoltaico",
    "on-grid",
    "off-grid",
    "bombeamento solar",
    "instalação de energia solar",
    "manutenção energia solar",
    "energia solar Brasil",
  ],
  alternates: {
    canonical: "https://dcinfinitysolar.com.br/",
  },
  openGraph: {
    type: "website",
    url: "https://dcinfinitysolar.com.br/",
    title: "DC Infinity Solar | Energia Solar em todo o Brasil",
    description:
      "Venda, projetos, instalação e manutenção de sistemas solares on-grid, off-grid e bombeamento. Atendimento em todo o Brasil.",
    siteName: "DC Infinity Solar",
    locale: "pt_BR",
    images: [
      {
        url: "/images/projetos/hero-solar.jpg",
        width: 1200,
        height: 630,
        alt: "Energia Solar - DC Infinity Solar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DC Infinity Solar | Energia Solar em todo o Brasil",
    description:
      "Venda, projetos, instalação e manutenção de sistemas solares on-grid, off-grid e bombeamento. Atendimento em todo o Brasil.",
    images: ["/images/projetos/hero-solar.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DC Infinity Solar",
    url: "https://dcinfinitysolar.com.br",
    image: "https://dcinfinitysolar.com.br/images/projetos/hero-solar.jpg",
    description:
      "Venda, projetos, instalação e manutenção de sistemas solares on-grid, off-grid e bombeamento. Atendimento em todo o Brasil.",
    areaServed: "BR",
    sameAs: ["https://wa.me/5561999656269"],
  };

  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

