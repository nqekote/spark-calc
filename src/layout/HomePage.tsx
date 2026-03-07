import { useState, useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import InstallPrompt from '../components/InstallPrompt'
import ToolIcon from '../components/icons/ToolIcon'
import { useRecentlyUsed } from '../core/hooks/useRecentlyUsed'
import { useFavorites } from '../core/hooks/useFavorites'
import {
  allFeatures, categoryOrder,
  type Feature,
} from '../data/features'

/* ═══════════════════════════════════════════
   Design tokens per category (SVG icons)
   ═══════════════════════════════════════════ */
const catMeta: Record<string, { accent: string; bg: string; icon: ReactNode }> = {
  Calculators: {
    accent: 'var(--accent-calc)', bg: 'rgba(255,107,44,0.06)',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M13 2L4 14h7l-2 8 11-14h-7z"/></svg>,
  },
  'Wire & Cable': {
    accent: 'var(--accent-wire)', bg: 'rgba(59,130,246,0.06)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="100%" height="100%"><circle cx="12" cy="12" r="9.5"/><circle cx="9" cy="10" r="2.5" fill="currentColor" opacity="0.25"/><circle cx="15" cy="10" r="2.5" fill="currentColor" opacity="0.25"/><circle cx="12" cy="15.5" r="2.5" fill="currentColor" opacity="0.25"/></svg>,
  },
  'Motors & Drives': {
    accent: 'var(--accent-motor)', bg: 'rgba(16,185,129,0.06)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="100%" height="100%"><circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="4"/><path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5"/></svg>,
  },
  Safety: {
    accent: 'var(--accent-safety)', bg: 'rgba(244,63,94,0.06)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" opacity="0.1"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  },
  Reference: {
    accent: 'var(--accent-ref)', bg: 'rgba(168,85,247,0.06)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  },
  Mining: {
    accent: 'var(--accent-mining)', bg: 'rgba(245,158,11,0.06)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M3 20l6-12 4 6 4-8 4 14" fill="currentColor" opacity="0.1"/><path d="M3 20l6-12 4 6 4-8 4 14"/></svg>,
  },
  Tools: {
    accent: 'var(--accent-tools)', bg: 'rgba(99,102,241,0.06)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><rect x="5" y="2" width="14" height="20" rx="2"/><rect x="8" y="5" width="8" height="5" rx="1"/><circle cx="12" cy="16" r="2.5"/></svg>,
  },
}

/* ═══════════════════════════════════════════
   Category → route mapping
   ═══════════════════════════════════════════ */
const categoryRoutes: Record<string, string> = {
  Calculators: '/electrical',
  'Wire & Cable': '/wire',
  'Motors & Drives': '/motors',
  Safety: '/safety',
  Reference: '/reference',
  Mining: '/mining',
  Tools: '/tools',
}

/* Categories shown on home page (exclude Installation Guides — no dedicated route) */
const homeCategories = categoryOrder.filter(c => c !== 'Installation Guides')

/* ═══════════════════════════════════════════ */
export default function HomePage() {
  const [search, setSearch] = useState('')
  const { recent } = useRecentlyUsed()
  const { favorites } = useFavorites()

  const favoriteFeatures = useMemo(
    () => favorites
      .map(path => allFeatures.find(f => f.to === path))
      .filter((f): f is Feature => f !== undefined),
    [favorites]
  )

  const recentFeatures = useMemo(
    () => recent
      .map(path => allFeatures.find(f => f.to === path))
      .filter((f): f is Feature => f !== undefined),
    [recent]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return allFeatures
    const q = search.toLowerCase()
    return allFeatures.filter(
      c => c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        (c.keywords && c.keywords.toLowerCase().includes(q))
    )
  }, [search])

  const isSearching = search.trim().length > 0

  return (
    <>
      <Header />
      <style>{`
        .home-card { transition: transform 80ms ease, background 150ms ease; }
        .home-card:active { transform: scale(0.97); }
        .feat-row { transition: background 120ms ease, transform 60ms ease; }
        .feat-row:active { background: var(--surface-hover) !important; transform: scale(0.985); }
        .cat-card { transition: transform 80ms ease, border-color 200ms ease, background 200ms ease; }
        .cat-card:active { transform: scale(0.97); }
      `}</style>

      <div style={{ padding: '0 16px 32px' }}>

        {/* ─── Hero ─── */}
        {!isSearching && (
          <div className="animate-in" style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 24px 20px',
            marginTop: 12, marginBottom: 24,
            background: 'var(--surface)',
            border: '1px solid var(--divider)',
            overflow: 'hidden',
          }}>
            {/* Circuit board pattern bg */}
            <svg width="100%" height="100%" style={{
              position: 'absolute', inset: 0, opacity: 0.03,
            }} viewBox="0 0 200 200">
              <defs>
                <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20h15M25 20h15M20 0v15M20 25v15" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                  <circle cx="20" cy="20" r="2" fill="currentColor"/>
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#circuit)" />
            </svg>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Logo */}
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'linear-gradient(135deg, #FF6B2C, #D4510F)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(255, 107, 44, 0.3)',
                flexShrink: 0,
              }}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <rect x={4} y={5} width={16} height={14} rx={2} />
                  <circle cx={9} cy={5} r={1.5} fill="#000" />
                  <circle cx={15} cy={5} r={1.5} fill="#000" />
                  <circle cx={9} cy={19} r={1.5} fill="#000" />
                  <circle cx={15} cy={19} r={1.5} fill="#000" />
                  <path d="M10 10 L14 10 L14 15 Q14 17 12 17 Q10 17 10 15 L10 14" strokeWidth={2.2} />
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: 22, fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--primary)',
                  letterSpacing: '-0.5px', lineHeight: 1.1,
                }}>
                  JBox
                </div>
                <div style={{
                  fontSize: 13, color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400, marginTop: 2,
                }}>
                  Ontario Electrical &amp; Mining Reference
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Install Prompt ─── */}
        {!isSearching && <InstallPrompt />}

        {/* ─── Search ─── */}
        <div style={{
          position: 'relative',
          marginBottom: isSearching ? 16 : 24,
        }}>
          <svg
            width={18} height={18} viewBox="0 0 24 24"
            fill="none" stroke="var(--text-tertiary)" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="text"
            placeholder={`Search ${allFeatures.length} tools...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '14px 44px 14px 48px',
              fontSize: 15, borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
              outline: 'none',
              minHeight: 52,
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--primary)'
              e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--divider)'
              e.target.style.boxShadow = 'none'
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              width: 28, height: 28, borderRadius: 'var(--radius-full)',
              background: 'var(--surface-hover)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                stroke="var(--text-secondary)" strokeWidth={3} strokeLinecap="round">
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
          )}
        </div>

        {/* ─── Search Results ─── */}
        {isSearching && (
          <section>
            <div style={{
              fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-display)',
              marginBottom: 12, paddingLeft: 2,
            }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>

            {filtered.length === 0 && (
              <div style={{
                padding: '48px 16px', textAlign: 'center',
                color: 'var(--text-tertiary)', fontSize: 15,
                fontFamily: 'var(--font-display)',
              }}>
                No tools match &ldquo;{search}&rdquo;
              </div>
            )}

            <div style={{ display: 'grid', gap: 6 }}>
              {filtered.map((f, i) => (
                <Link key={f.to} to={f.to} className="feat-row animate-in" style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--divider)',
                  textDecoration: 'none', minHeight: 56,
                  animationDelay: `${Math.min(i, 8) * 25}ms`,
                }}>
                  <span style={{
                    width: 36, height: 36, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: catMeta[f.category]?.bg || 'var(--primary-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: catMeta[f.category]?.accent || 'var(--primary)',
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
                    color: catMeta[f.category]?.accent || 'var(--primary)',
                    background: catMeta[f.category]?.bg || 'var(--primary-subtle)',
                    padding: '3px 8px', borderRadius: 'var(--radius-full)',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.2px',
                  }}>
                    {f.category}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Favorites ─── */}
        {!isSearching && favoriteFeatures.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <SectionLabel>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="var(--primary)" stroke="var(--primary)" strokeWidth={2}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Favorites
              </span>
            </SectionLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            }}>
              {favoriteFeatures.map((f, i) => {
                const meta = catMeta[f.category] || catMeta.Calculators
                return (
                  <Link key={f.to} to={f.to} className="home-card animate-in" style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '18px 8px 16px',
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--divider)',
                    textDecoration: 'none', minHeight: 88,
                    position: 'relative', overflow: 'hidden',
                    animationDelay: `${i * 40}ms`,
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 2,
                      background: `linear-gradient(90deg, transparent, var(--primary), transparent)`,
                      opacity: 0.7,
                    }} />
                    <span style={{
                      width: 40, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: meta.bg, borderRadius: 10,
                      color: meta.accent,
                    }}>
                      <ToolIcon name={f.icon} size={22} />
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)', textAlign: 'center',
                      lineHeight: 1.2,
                    }}>
                      {f.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ─── Recently Used ─── */}
        {!isSearching && recentFeatures.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <SectionLabel>Recently Used</SectionLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            }}>
              {recentFeatures.map((f, i) => {
                const meta = catMeta[f.category] || catMeta.Calculators
                return (
                  <Link key={f.to} to={f.to} className="home-card animate-in" style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '18px 8px 16px',
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--divider)',
                    textDecoration: 'none', minHeight: 88,
                    position: 'relative', overflow: 'hidden',
                    animationDelay: `${i * 40}ms`,
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
                      opacity: 0.5,
                    }} />
                    <span style={{
                      width: 40, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: meta.bg, borderRadius: 10,
                      color: meta.accent,
                    }}>
                      <ToolIcon name={f.icon} size={22} />
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text)', textAlign: 'center',
                      lineHeight: 1.2,
                    }}>
                      {f.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ─── Browse by Category ─── */}
        {!isSearching && (
          <section>
            <SectionLabel>Browse</SectionLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            }}>
              {homeCategories.map((cat, i) => {
                const meta = catMeta[cat] || catMeta.Calculators
                const count = allFeatures.filter(f => f.category === cat).length
                const route = categoryRoutes[cat]
                if (!route) return null
                return (
                  <Link key={cat} to={route} className="cat-card animate-in" style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '16px 14px 14px',
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--divider)',
                    textDecoration: 'none', minHeight: 80,
                    position: 'relative', overflow: 'hidden',
                    animationDelay: `${i * 30}ms`,
                  }}>
                    {/* Top accent bar */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 3, background: meta.accent,
                      opacity: 0.7,
                    }} />
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%',
                    }}>
                      <div style={{
                        width: 28, height: 28, color: meta.accent,
                        flexShrink: 0, display: 'inline-flex',
                      }}>
                        {meta.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 14, fontWeight: 700,
                          fontFamily: 'var(--font-display)',
                          color: 'var(--text)', lineHeight: 1.2,
                        }}>
                          {cat}
                        </div>
                        <div style={{
                          fontSize: 12, fontWeight: 500,
                          fontFamily: 'var(--font-mono)',
                          color: meta.accent, marginTop: 3,
                        }}>
                          {count} {count === 1 ? 'tool' : 'tools'}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

/* ── Reusable section label ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 11, fontWeight: 700,
      fontFamily: 'var(--font-display)',
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase', letterSpacing: '1px',
      marginBottom: 12,
      paddingLeft: 2,
    }}>
      {children}
    </h2>
  )
}
