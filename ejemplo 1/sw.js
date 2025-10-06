// plantilla de servie worker

const { cache } = require("react");

// 1. el nombre del servicio y los archvios a cachear 

const CACHE_NAME=   "Mi-PWA-cache-v1";
const BASE_PATH = "/PWA-Ejemplo";
const urlsToCache = [
   `${BASE_PATH}/index.html`,
   `${BASE_PATH}/manifest.json`,
   `${BASE_PATH}/offline.html`,
   `${BASE_PATH}/icons/icon-192x192.png`,
   `${BASE_PATH}/icons/icon-512x512.png`,
];

// 2. install  -> el evento que se ejecuta al instalar el swe
//Se dispara la primera vez que se registra el service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache.addAll(urlsToCache))
    );

});

// 3. Activate ->  este evento se ejecuta al activarse 
// debe limpiar caches vieja

//se dispara cuando SW se activa ( esta en ejecticion ) )

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
            .map(key=> caches.delete(key))
            )
        )
    );
}
)
// fetch -> intercepta las peticiones de la pwa,
// Interceptar cada peticion de cada pagina de la PWA 
//Busca primera en cache 
//Si el recuros no esta, se va a la red
//Si falla todo, muestrada la ventana OfflineAudioCompletionEvent.html

self.addEventListener("fetch", event => {
    event.respondwith(
      caches.match(event.request).then(response=> {
        return response || fetch(event.request).catch(
            ()=> catches.match("offline.html")); 
      })  
    );
});

self.addEventListener("push" , event => {
    const data = event.data ? event.data.text() : "notificacion sin datis";
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotification("Mi PWA", { body:data})
    );
})  ;


//opcional :
//SINC => Sincornizando en segundo plano 
//MAnejo de eventos de APIs que el navegador sporta
           
