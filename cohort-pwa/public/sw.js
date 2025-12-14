const CACHE_NAME = 'metallic-fox-v1'
const RUNTIME_CACHE = 'metallic-fox-runtime'

// Inject manifest placeholder for Workbox
const MANIFEST = self.__WB_MANIFEST || []

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const assets = MANIFEST.map((entry) => entry.url || entry)
      return cache.addAll(assets).catch(() => {
        // Continue if some assets fail
        return Promise.resolve()
      })
    }).then(() => {
      self.skipWaiting()
    })
  )
})

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      self.clients.claim()
    })
  )
})

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Cache-first strategy for static assets
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response
        }

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response
          }

          const responseClone = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        }).catch(() => {
          // Return cached version or offline page
          return caches.match(request)
        })
      })
    )
  }
})

// Handle background sync (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-count') {
    event.waitUntil(Promise.resolve())
  }
})
