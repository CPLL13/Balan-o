// Balanço — service worker (abre 100% offline após a primeira visita)
// IMPORTANTE: ao atualizar o index.html no futuro, mude a versão abaixo (v1 → v2 → v3…)
const C = 'balanco-v1';

self.addEventListener('install', e => e.waitUntil(
  caches.open(C).then(c => c.add('./')).then(() => self.skipWaiting())
));

self.addEventListener('activate', e => e.waitUntil(
  caches.keys()
    .then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(n => {
      const cp = n.clone();
      caches.open(C).then(c => c.put(e.request, cp));
      return n;
    }).catch(() => caches.match('./')))
  );
});
