export async function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: https://dcinfinitysolar.com.br/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
