/* Notice — service worker (PWA). Estratégias:
 * - Navegação (HTML): network-first; guarda as últimas páginas abertas para ler offline.
 * - /_next/static (arquivos com hash): cache-first.
 * - API GET de notícias/CVEs (notice.muttercorp.com.br): network-first com fallback ao cache.
 * - Imagens: stale-while-revalidate com limite.
 */
const VERSION = "v2";
const PAGES = `notice-pages-${VERSION}`;
const STATIC = `notice-static-${VERSION}`;
const API = `notice-api-${VERSION}`;
const IMAGES = `notice-img-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icon-192.png", "/logo-128.png", "/favicon.png"];
const API_ORIGIN = "https://notice.muttercorp.com.br";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("notice-") && ![PAGES, STATIC, API, IMAGES].includes(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) {
    if (new URL(keys[i].url).pathname === OFFLINE_URL) continue;
    await cache.delete(keys[i]);
  }
}

async function networkFirst(request, cacheName, max, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok && res.type !== "opaqueredirect") {
      await cache.delete(request);
      await cache.put(request, res.clone());
      trim(cacheName, max);
    }
    return res;
  } catch (err) {
    const cached = await cache.match(request, { ignoreVary: true });
    if (cached) return cached;
    if (fallbackUrl) {
      const fb = await cache.match(fallbackUrl);
      if (fb) return fb;
    }
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate" && url.origin === self.location.origin) {
    if (url.pathname.startsWith("/admin")) return;
    event.respondWith(networkFirst(request, PAGES, 40, OFFLINE_URL));
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(STATIC).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      }),
    );
    return;
  }

  if (
    url.origin === API_ORIGIN &&
    (url.pathname.startsWith("/articles") ||
      url.pathname.startsWith("/vulnerabilities") ||
      url.pathname.startsWith("/sources"))
  ) {
    event.respondWith(networkFirst(request, API, 120));
    return;
  }

  if (request.destination === "image") {
    event.respondWith(
      caches.open(IMAGES).then(async (cache) => {
        const hit = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res.ok || res.type === "opaque") {
              cache.put(request, res.clone());
              trim(IMAGES, 150);
            }
            return res;
          })
          .catch(() => hit);
        return hit || network;
      }),
    );
  }
});
