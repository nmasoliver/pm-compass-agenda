// PM Compass Agenda: guarda l'app al mòbil perquè s'obri ràpid i sense cobertura.
// Les dades (OneDrive) no es guarden aquí: les gestiona l'app.
const CACHE = 'pmc-agenda-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Microsoft i OneDrive: sempre per xarxa
  // primer la xarxa (versió nova de l'app), si no n'hi ha, la còpia guardada
  e.respondWith(fetch(e.request).then(r => { if (r.ok && !u.search) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
