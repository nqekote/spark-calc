import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { allFeatures, categoryAccents, categoryBgs, type Feature } from '../data/features'
import ToolIcon from './icons/ToolIcon'

/**
 * Global Search — floating action button + full-screen search overlay.
 * Available on every page. Renders in AppShell so it's always mounted.
 */
export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Hide FAB on home page (home has its own search)
  const isHome = location.pathname === '/' || location.pathname === ''

  // Filter features by query (title, subtitle, category, keywords)
  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allFeatures.filter(f =>
      f.title.toLowerCase().includes(q) ||
      (f.subtitle && f.subtitle.toLowerCase().includes(q)) ||
      f.category.toLowerCase().includes(q) ||
      (f.keywords && f.keywords.toLowerCase().includes(q))
    )
  }, [query])

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (open) {
      // Small delay lets the overlay transition start
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Close on route change
  useEffect(() => {
    setOpen(false)
    setQuery('')
  }, [location.pathname])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const handleSelect = useCallback((f: Feature) => {
    navigate(f.to)
    setOpen(false)
    setQuery('')
  }, [navigate])

  return (
    <>
      {/* ── Floating Search Button ── */}
      {!isHome && !open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Search tools"
          style={{
            position: 'fixed',
            bottom: `calc(68px + env(safe-area-inset-bottom, 8px))`,
            right: 16, zIndex: 90,
            width: 52, height: 52,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B2C, #D4510F)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(255, 107, 44, 0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 150ms ease, box-shadow 150ms ease',
          }}
          onPointerDown={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)'
          }}
          onPointerUp={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
          }}
          onPointerLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
          }}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
            stroke="#000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
        </button>
      )}

      {/* ── Full-screen Search Overlay ── */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'var(--bg)',
            display: 'flex', flexDirection: 'column',
            animation: 'searchFadeIn 180ms ease forwards',
          }}
        >
          <style>{`
            @keyframes searchFadeIn {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .gs-row { transition: background 100ms ease; }
            .gs-row:active { background: var(--surface-hover) !important; }
          `}</style>

          {/* ── Top bar ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
            borderBottom: '1px solid var(--divider)',
            background: 'var(--surface)',
          }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
              stroke="var(--text-tertiary)" strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}>
              <circle cx={11} cy={11} r={8} />
              <line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>

            <input
              ref={inputRef}
              type="text"
              placeholder={`Search ${allFeatures.length} tools…`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1, fontSize: 16,
                background: 'transparent', border: 'none',
                color: 'var(--text)',
                fontFamily: 'var(--font-display)',
                outline: 'none',
                minHeight: 44,
              }}
            />

            <button onClick={() => { setOpen(false); setQuery('') }} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--surface-hover)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer', flexShrink: 0,
            }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                stroke="var(--text-secondary)" strokeWidth={3} strokeLinecap="round">
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
          </div>

          {/* ── Results ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 32px' }}>
            {query.trim() === '' && (
              <div style={{
                padding: '48px 16px', textAlign: 'center',
                color: 'var(--text-tertiary)', fontSize: 14,
                fontFamily: 'var(--font-display)',
              }}>
                Type to search calculators, references, and tools
              </div>
            )}

            {query.trim() !== '' && results.length === 0 && (
              <div style={{
                padding: '48px 16px', textAlign: 'center',
                color: 'var(--text-tertiary)', fontSize: 14,
                fontFamily: 'var(--font-display)',
              }}>
                No tools match &ldquo;{query}&rdquo;
              </div>
            )}

            {results.length > 0 && (
              <>
                <div style={{
                  fontSize: 12, fontWeight: 500,
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-display)',
                  padding: '8px 2px 12px',
                }}>
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </div>

                <div style={{ display: 'grid', gap: 6 }}>
                  {results.map((f, i) => (
                    <button
                      key={f.to}
                      className="gs-row"
                      onClick={() => handleSelect(f)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px',
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--divider)',
                        textDecoration: 'none',
                        minHeight: 56, width: '100%',
                        cursor: 'pointer', textAlign: 'left',
                        animation: `searchFadeIn 180ms ease ${Math.min(i, 8) * 25}ms both`,
                      }}
                    >
                      <span style={{
                        width: 36, height: 36,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        background: categoryBgs[f.category] || 'var(--primary-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: categoryAccents[f.category] || 'var(--primary)',
                      }}>
                        <ToolIcon name={f.icon} size={18} />
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 15, fontWeight: 600, color: 'var(--text)',
                          fontFamily: 'var(--font-display)',
                        }}>{f.title}</div>
                        <div style={{
                          fontSize: 12, color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-display)',
                        }}>{f.subtitle}</div>
                      </div>

                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: categoryAccents[f.category] || 'var(--primary)',
                        background: categoryBgs[f.category] || 'var(--primary-subtle)',
                        padding: '3px 8px', borderRadius: 'var(--radius-full)',
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.2px',
                        flexShrink: 0,
                      }}>
                        {f.category}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
