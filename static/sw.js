self.addEventListener("fetch", (event) => {
  let url = new URL(event.request.url);
  let method = event.request.method;

  if (method.toLowerCase() !== "get") return;

  if (
    url.pathname.endsWith("jpeg") ||
    url.pathname.endsWith("jpg") ||
    url.pathname.endsWith("png") ||
    // url.pathname.endsWith("mp3") ||
    // url.pathname.endsWith("m4a") ||
    url.host.startsWith("kind-cod-19.deno.dev")
  ) {
    event.respondWith(
      caches.open("assets").then(async (cache) => {
        const cacheResponse = await cache.match(event.request);
        if (cacheResponse) return cacheResponse;
        const fetchResponse = await fetch(event.request);
        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      }),
    );
  }
  return;
});
