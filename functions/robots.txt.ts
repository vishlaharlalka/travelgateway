export function onRequest() {
  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Sitemap: https://travelgateway.in/sitemap.xml",
      "",
    ].join("\n"),
    {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    }
  );
}
