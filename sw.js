/**
 * ShoreSquad Service Worker
 * Provides offline functionality and caching for PWA
 */

const CACHE_NAME = 'shoresquad-v1.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('ShoreSquad SW: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ShoreSquad SW: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('ShoreSquad SW: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('ShoreSquad SW: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('ShoreSquad SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName.startsWith('shoresquad-') && cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('ShoreSquad SW: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('ShoreSquad SW: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except for our CDN resources)
  const url = new URL(request.url);
  const isExternal = url.origin !== self.location.origin;
  const isAllowedExternal = STATIC_CACHE_URLS.some(staticUrl => request.url.includes(staticUrl));
  
  if (isExternal && !isAllowedExternal) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('ShoreSquad SW: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then(response => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            // Add to cache for future requests
            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('ShoreSquad SW: Caching new resource', request.url);
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('ShoreSquad SW: Fetch failed', request.url, error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // For other requests, return a simple offline response
            return new Response('Offline - Please check your connection', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('ShoreSquad SW: Background sync triggered', event.tag);
  
  if (event.tag === 'event-signup') {
    event.waitUntil(handleEventSignup());
  }
  
  if (event.tag === 'newsletter-signup') {
    event.waitUntil(handleNewsletterSignup());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('ShoreSquad SW: Push message received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  
  const title = data.title || 'ShoreSquad';
  const options = {
    body: data.body || 'New beach cleanup event available!',
    icon: '/assets/icon-192x192.png',
    badge: '/assets/icon-72x72.png',
    tag: 'shoresquad-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Event',
        icon: '/assets/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/assets/action-dismiss.png'
      }
    ],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('ShoreSquad SW: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app to the events section
    event.waitUntil(
      clients.openWindow('/#events')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification (already done above)
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for background sync
async function handleEventSignup() {
  try {
    // Get pending signups from IndexedDB
    const pendingSignups = await getPendingEventSignups();
    
    for (const signup of pendingSignups) {
      try {
        // Attempt to sync with server
        const response = await fetch('/api/events/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signup)
        });
        
        if (response.ok) {
          // Remove from pending list
          await removePendingEventSignup(signup.id);
          console.log('ShoreSquad SW: Event signup synced', signup.id);
        }
      } catch (error) {
        console.error('ShoreSquad SW: Failed to sync event signup', error);
      }
    }
  } catch (error) {
    console.error('ShoreSquad SW: Background sync failed', error);
  }
}

async function handleNewsletterSignup() {
  try {
    // Get pending newsletter signups from IndexedDB
    const pendingSignups = await getPendingNewsletterSignups();
    
    for (const signup of pendingSignups) {
      try {
        // Attempt to sync with server
        const response = await fetch('/api/newsletter/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signup)
        });
        
        if (response.ok) {
          // Remove from pending list
          await removePendingNewsletterSignup(signup.id);
          console.log('ShoreSquad SW: Newsletter signup synced', signup.id);
        }
      } catch (error) {
        console.error('ShoreSquad SW: Failed to sync newsletter signup', error);
      }
    }
  } catch (error) {
    console.error('ShoreSquad SW: Newsletter sync failed', error);
  }
}

// IndexedDB helpers (simplified for demo)
async function getPendingEventSignups() {
  // In a real app, this would interact with IndexedDB
  return [];
}

async function removePendingEventSignup(id) {
  // In a real app, this would remove from IndexedDB
  console.log('Removing pending event signup:', id);
}

async function getPendingNewsletterSignups() {
  // In a real app, this would interact with IndexedDB
  return [];
}

async function removePendingNewsletterSignup(id) {
  // In a real app, this would remove from IndexedDB
  console.log('Removing pending newsletter signup:', id);
}

console.log('ShoreSquad SW: Service Worker loaded');
