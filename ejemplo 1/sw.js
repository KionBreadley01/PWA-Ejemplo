// Plantilla de Service Worker

const CACHE_NAME = "Mi-PWA-cache-v1";
const urlsToCache = [
   "index.html",
   "manifest.json",
   "icons/icon_192x192.png",
   "icons/icon_512x512.png",
   "icons/icon_96x96.png",
   "icons/icon_180x180.png"
];

// Instalar Service Worker y cachear archivos
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// Activar Service Worker y limpiar caches viejos
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});

// Interceptar peticiones y responder desde cache o red
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(
                () => caches.match(`${BASE_PATH}/offline.html`));
        })
    );
});

// Notificaciones push (opcional)
self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin datos";
    event.waitUntil(
        self.registration.showNotification("Mi PWA", { body: data })
    );
});