/* ------------------------------------------------------------------ */
/*  PWA Service Worker Registration & Auto-Update                      */
/*                                                                     */
/*  Three layers of update detection:                                  */
/*  1. updateViaCache:'none' — bypasses browser HTTP cache for SW      */
/*  2. registration.update() — triggers byte-for-byte SW check         */
/*  3. version.txt check — bypasses GitHub Pages CDN via query param   */
/*     If a version mismatch is found and the normal SW lifecycle      */
/*     doesn't reload within 3s, we nuke all caches and force reload.  */
/* ------------------------------------------------------------------ */

declare const __BUILD_HASH__: string

const CHECK_INTERVAL = 5 * 60 * 1000 // periodic safety net (5 min)
const BASE = import.meta.env.BASE_URL

/* ── Version file check (bypasses CDN cache via unique query param) ── */
async function getRemoteVersion(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}version.txt?_=${Date.now()}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.text()).trim()
  } catch {
    return null
  }
}

/**
 * Check for updates via both SW lifecycle AND version file.
 * If version.txt shows a newer deploy but the SW update doesn't
 * complete within 3 seconds, force-clear caches and reload.
 */
async function checkForUpdate(registration: ServiceWorkerRegistration) {
  // 1. Tell the browser to check for a new SW (bypasses HTTP cache via updateViaCache:'none')
  registration.update().catch(() => {})

  // 2. Also check version.txt as defense-in-depth
  const remote = await getRemoteVersion()
  if (!remote || remote === __BUILD_HASH__) return // no update or fetch failed

  console.log('[PWA] Version mismatch:', __BUILD_HASH__, '→', remote)

  // Give the normal SW update path 3 seconds to complete and reload
  await new Promise(r => setTimeout(r, 3000))

  // If we're still here, the normal path didn't reload.
  // Nuclear option: clear all caches and hard-reload.
  console.log('[PWA] Forcing cache clear and reload...')
  const keys = await caches.keys()
  await Promise.all(keys.map(k => caches.delete(k)))
  window.location.reload()
}

/* ── Register the Service Worker ── */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(`${BASE}sw.js`, {
      scope: BASE,
      updateViaCache: 'none', // <-- bypasses HTTP cache for SW fetches
    })
    .then(registration => {
      console.log('[PWA] Service worker registered')

      // Check for updates when app returns to foreground (critical for mobile PWA)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkForUpdate(registration)
        }
      })

      // Periodic safety net for long foreground sessions
      setInterval(() => {
        if (document.visibilityState === 'visible') {
          checkForUpdate(registration)
        }
      }, CHECK_INTERVAL)
    })
    .catch(err => console.warn('[PWA] Registration failed:', err))

  // Auto-reload when the new SW activates and takes control
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    console.log('[PWA] New version active — reloading...')
    window.location.reload()
  })
}
