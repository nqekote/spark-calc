import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'spark-install-dismissed'

/**
 * PWA Install Prompt — shows a banner encouraging users to install.
 * Only appears if:
 *  - Not already installed (standalone mode)
 *  - Not previously dismissed
 *  - Browser supports beforeinstallprompt OR is iOS Safari
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY) === '1' }
    catch { return false }
  })

  // Already installed as PWA
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true

  // Detect iOS Safari (no beforeinstallprompt support)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Don't show if installed, dismissed, or no install path
  if (isStandalone || dismissed) return null
  if (!deferredPrompt && !isIOS) return null

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else if (isIOS) {
      setShowIOSGuide(true)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    try { localStorage.setItem(DISMISS_KEY, '1') }
    catch { /* ignore */ }
  }

  return (
    <div style={{
      margin: '0 16px 16px',
      padding: '14px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--primary)',
      borderRadius: 'var(--radius)',
      display: 'flex', flexDirection: 'column', gap: 10,
      animation: 'searchFadeIn 250ms ease',
    }}>
      <style>{`
        @keyframes searchFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* App icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #FF6B2C, #D4510F)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x={4} y={5} width={16} height={14} rx={2} />
            <circle cx={9} cy={5} r={1.5} fill="#000" />
            <circle cx={15} cy={5} r={1.5} fill="#000" />
            <circle cx={9} cy={19} r={1.5} fill="#000" />
            <circle cx={15} cy={19} r={1.5} fill="#000" />
            <path d="M10 10 L14 10 L14 15 Q14 17 12 17 Q10 17 10 15 L10 14" strokeWidth={2.5} />
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 14, fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: 'var(--text)',
          }}>
            Install JBox
          </div>
          <div style={{
            fontSize: 12, color: 'var(--text-secondary)',
            fontFamily: 'var(--font-display)',
          }}>
            Works offline, launches from home screen
          </div>
        </div>

        {/* Dismiss X */}
        <button onClick={handleDismiss} aria-label="Dismiss" style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--surface-hover)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer', flexShrink: 0,
        }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
            stroke="var(--text-tertiary)" strokeWidth={3} strokeLinecap="round">
            <line x1={18} y1={6} x2={6} y2={18} />
            <line x1={6} y1={6} x2={18} y2={18} />
          </svg>
        </button>
      </div>

      {/* iOS guide */}
      {showIOSGuide && isIOS && (
        <div style={{
          fontSize: 13, color: 'var(--text-secondary)',
          fontFamily: 'var(--font-display)',
          padding: '10px 12px',
          background: 'var(--surface-elevated)',
          borderRadius: 'var(--radius-sm)',
          lineHeight: 1.6,
        }}>
          Tap the <strong style={{ color: 'var(--text)' }}>Share</strong> button at the bottom of Safari, then tap <strong style={{ color: 'var(--text)' }}>Add to Home Screen</strong>.
        </div>
      )}

      {/* Install button */}
      {!showIOSGuide && (
        <button onClick={handleInstall} style={{
          padding: '10px 20px', fontSize: 14, fontWeight: 600,
          fontFamily: 'var(--font-display)',
          background: 'var(--primary)',
          border: 'none', borderRadius: 'var(--radius)',
          color: '#000', cursor: 'pointer',
          width: '100%', minHeight: 44,
        }}>
          {isIOS ? 'How to Install' : 'Install App'}
        </button>
      )}
    </div>
  )
}
