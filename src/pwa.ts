/* ------------------------------------------------------------------ */
/*  PWA Service Worker Registration & Auto-Update                      */
/*  Ensures the app auto-refreshes when a new build is deployed,       */
/*  even on mobile where the PWA stays open in standalone mode.        */
/* ------------------------------------------------------------------ */
import { registerSW } from 'virtual:pwa-register'

const UPDATE_INTERVAL_MS = 10 * 60 * 1000 // check every 10 minutes

registerSW({
  immediate: true,

  onRegisteredSW(_swUrl, registration) {
    if (!registration) return

    // Periodic update check (catches deploys while app sits idle)
    setInterval(() => { registration.update() }, UPDATE_INTERVAL_MS)

    // Check when app comes back to foreground (most important for mobile)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update()
      }
    })
  },

  onNeedRefresh() {
    console.log('[PWA] New content available — update pending...')
  },

  onOfflineReady() {
    console.log('[PWA] App ready for offline use')
  },
})

// Auto-reload when the new SW activates and takes control.
// This is what actually swaps the old cached page for the new build.
let refreshing = false
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (refreshing) return
  refreshing = true
  console.log('[PWA] New version active — reloading...')
  window.location.reload()
})
