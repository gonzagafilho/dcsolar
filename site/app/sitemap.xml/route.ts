export async function GET() {
  const baseUrl = "https://dcinfinitysolar.com.br";

  const pages = [
    "",
    "#empresa",
    "#solucoes",
    "#projetos",
    "#servicos",
    "#suporte",
  ];

  const urls = pages
    .map((p) => {
      const loc = p.startsWith("#") ? `${baseUrl}/${p}` : `${baseUrl}/${p}`;
      return `
  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === "" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
