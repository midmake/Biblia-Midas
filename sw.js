var SHELL_CACHE = "vereda-biblia-shell-v9";
var CHAPTER_CACHE = "vereda-biblia-chapters-v9";
var APP_SHELL = [
  "./",
  "./index.html",
  "./404.html",
  "./manifest.webmanifest",
  "./assets/styles.css?v=8",
  "./assets/app.js?v=8",
  "./assets/bible-data.js",
  "./assets/midas-logo.png?v=5",
  "./assets/midas-wordmark.png?v=5",
  "./assets/share-card.png?v=1",
  "./assets/icon.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== SHELL_CACHE && key !== CHAPTER_CACHE;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;

  var url = new URL(request.url);

  if (url.hostname === "bible-api.com" || url.hostname === "cdn.jsdelivr.net") {
    event.respondWith(
      caches.open(CHAPTER_CACHE).then(function (cache) {
        return cache.match(request).then(function (cached) {
          if (cached) return cached;
          return fetch(request).then(function (response) {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(SHELL_CACHE).then(function (cache) {
            cache.put("./index.html", copy);
          });
          return response;
        })
        .catch(function () {
          return caches.match("./index.html");
        })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        return cached || fetch(request).then(function (response) {
          if (response.ok) {
            caches.open(SHELL_CACHE).then(function (cache) {
              cache.put(request, response.clone());
            });
          }
          return response;
        });
      })
    );
  }
});
