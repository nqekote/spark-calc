import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'

/* ── colour accents per category ── */
const catMeta: Record<string, { accent: string; bg: string; icon: string }> = {
  Calculators: { accent: '#ffd700', bg: 'rgba(255,215,0,0.08)', icon: '⚡' },
  'Wire & Cable': { accent: '#4fc3f7', bg: 'rgba(79,195,247,0.08)', icon: '🔌' },
  'Motors & Drives': { accent: '#66bb6a', bg: 'rgba(102,187,106,0.08)', icon: '⚙' },
  Safety: { accent: '#ef5350', bg: 'rgba(239,83,80,0.08)', icon: '🛡' },
  Reference: { accent: '#ab47bc', bg: 'rgba(171,71,188,0.08)', icon: '📖' },
  Mining: { accent: '#ff9800', bg: 'rgba(255,152,0,0.08)', icon: '⛏' },
  'Installation Guides': { accent: '#26c6da', bg: 'rgba(38,198,218,0.08)', icon: '🔧' },
  Tools: { accent: '#78909c', bg: 'rgba(120,144,156,0.08)', icon: '🧰' },
}

/* ── all features ── */
interface Feature {
  to: string
  title: string
  icon: string
  category: string
  subtitle?: string
}

const allFeatures: Feature[] = [
  // ── Calculators ──
  { to: '/electrical/ohms-law', title: "Ohm's Law", icon: 'Ω', category: 'Calculators', subtitle: 'V, I, R' },
  { to: '/electrical/power', title: 'Power Calc', icon: '⚡', category: 'Calculators', subtitle: 'Watts & VA' },
  { to: '/electrical/voltage-drop', title: 'Voltage Drop', icon: '↓', category: 'Calculators', subtitle: 'Wire loss' },
  { to: '/electrical/power-factor', title: 'Power Factor', icon: '∼', category: 'Calculators', subtitle: 'PF correction' },
  { to: '/electrical/short-circuit', title: 'Short Circuit', icon: '💥', category: 'Calculators', subtitle: 'Fault current' },
  { to: '/electrical/lighting', title: 'Lighting', icon: '💡', category: 'Calculators', subtitle: 'Lux & lumens' },
  { to: '/electrical/transformer-sizing', title: 'Transformer', icon: '⎔', category: 'Calculators', subtitle: 'kVA sizing' },
  { to: '/electrical/disconnect', title: 'Disconnect', icon: '⎓', category: 'Calculators', subtitle: 'HP-rated switch' },
  { to: '/electrical/generator', title: 'Generator', icon: '⚡', category: 'Calculators', subtitle: 'Backup power' },
  { to: '/reference/box-fill', title: 'Box Fill', icon: '▣', category: 'Calculators', subtitle: 'Junction box' },
  { to: '/reference/residential', title: 'Residential', icon: '⌂', category: 'Calculators', subtitle: 'Demand load' },
  { to: '/electrical/oc-coordination', title: 'OC Coordination', icon: '📊', category: 'Calculators', subtitle: 'Selectivity' },

  // ── Wire & Cable ──
  { to: '/wire/ampacity', title: 'Ampacity', icon: 'ᴬ', category: 'Wire & Cable', subtitle: 'Wire tables' },
  { to: '/wire/sizing', title: 'Wire Sizing', icon: '⌸', category: 'Wire & Cable', subtitle: 'Conductor sizing' },
  { to: '/wire/grounding', title: 'Grounding', icon: '⏚', category: 'Wire & Cable', subtitle: 'Table 17' },
  { to: '/wire/cable-types', title: 'Cable Types', icon: '🔌', category: 'Wire & Cable', subtitle: 'NMD, TECK, AC90' },
  { to: '/wire/teck-cable', title: 'TECK90 Guide', icon: '🔩', category: 'Wire & Cable', subtitle: 'Specs & glands' },
  { to: '/wire/ocp-transformer', title: 'Transformer OCP', icon: '⍗', category: 'Wire & Cable', subtitle: 'Protection' },
  { to: '/wire/ocp-feeder', title: 'Feeder OCP', icon: '⎓', category: 'Wire & Cable', subtitle: 'Protection' },
  { to: '/wire/torque-specs', title: 'Torque Specs', icon: '🔧', category: 'Wire & Cable', subtitle: 'Termination' },
  { to: '/conduit/raceway-spacing', title: 'Raceway Spacing', icon: '⎓', category: 'Wire & Cable', subtitle: 'Support dist.' },
  { to: '/conduit/burial-depths', title: 'Burial Depths', icon: '⬇', category: 'Wire & Cable', subtitle: 'Min. cover' },
  { to: '/conduit/cable-tray', title: 'Cable Tray', icon: '▤', category: 'Wire & Cable', subtitle: 'Tray fill' },
  { to: '/conduit/fill', title: 'Conduit Fill', icon: '◎', category: 'Wire & Cable', subtitle: 'Fill calculations' },
  { to: '/conduit/bending', title: 'EMT Bending', icon: '⌒', category: 'Wire & Cable', subtitle: 'Offsets & saddles' },

  // ── Motors & Drives ──
  { to: '/motors/flc', title: 'Motor FLC', icon: '⚙', category: 'Motors & Drives', subtitle: 'Current tables' },
  { to: '/motors/branch', title: 'Motor Branch', icon: '⑂', category: 'Motors & Drives', subtitle: 'Circuit sizing' },
  { to: '/motors/ocp', title: 'Motor OCP', icon: '⛔', category: 'Motors & Drives', subtitle: 'Protection' },
  { to: '/motors/starters', title: 'Motor Starters', icon: '▶', category: 'Motors & Drives', subtitle: 'DOL, Y/Δ, VFD' },
  { to: '/motors/vfd', title: 'VFD Reference', icon: '∿', category: 'Motors & Drives', subtitle: 'Params & faults' },
  { to: '/motors/medium-voltage', title: 'Medium Voltage', icon: '⚡', category: 'Motors & Drives', subtitle: 'MV systems' },

  // ── Safety ──
  { to: '/safety/arc-flash', title: 'Arc Flash', icon: '⚡', category: 'Safety', subtitle: 'PPE & boundaries' },
  { to: '/safety/loto', title: 'Lockout/Tagout', icon: '🔒', category: 'Safety', subtitle: 'LOTO procedures' },
  { to: '/mining/safety', title: 'Mining Safety', icon: '⚠️', category: 'Safety', subtitle: 'PPE, grounding' },
  { to: '/mining/hazardous-areas', title: 'Hazardous Areas', icon: '💨', category: 'Safety', subtitle: 'Zone classify' },
  { to: '/safety/training', title: 'CSA Z462', icon: '🎓', category: 'Safety', subtitle: 'Safety training' },

  // ── Reference ──
  { to: '/reference/formulas', title: 'Formulas', icon: '📝', category: 'Reference', subtitle: 'Cheat sheet' },
  { to: '/reference/cec', title: 'CEC Tables', icon: '📖', category: 'Reference', subtitle: 'Code reference' },
  { to: '/reference/code-requirements', title: 'CEC by Task', icon: '📜', category: 'Reference', subtitle: 'Rules by job' },
  { to: '/reference/electrical-symbols', title: 'Symbols', icon: '🔌', category: 'Reference', subtitle: 'Schematics' },
  { to: '/reference/unit-converter', title: 'Converter', icon: '🔄', category: 'Reference', subtitle: 'AWG↔mm²' },
  { to: '/reference/troubleshooting', title: 'Troubleshoot', icon: '🔍', category: 'Reference', subtitle: 'Fault finding' },
  { to: '/reference/multimeter', title: 'Multimeter', icon: '📏', category: 'Reference', subtitle: 'Usage guide' },
  { to: '/reference/control-circuits', title: 'Control Circuits', icon: '⭡', category: 'Reference', subtitle: 'Schematics' },
  { to: '/reference/plc-basics', title: 'PLC Basics', icon: '🧠', category: 'Reference', subtitle: 'Ladder logic' },
  { to: '/reference/instrumentation', title: 'Instrumentation', icon: '📡', category: 'Reference', subtitle: '4-20mA, HART' },
  { to: '/reference/power-quality', title: 'Power Quality', icon: '📈', category: 'Reference', subtitle: 'Harmonics/THD' },
  { to: '/electrical/gfci-afci', title: 'GFCI / AFCI', icon: '🛡', category: 'Reference', subtitle: 'Protection' },
  { to: '/reference/battery-ups', title: 'Battery & UPS', icon: '🔋', category: 'Reference', subtitle: 'UPS systems' },
  { to: '/reference/solar-renewable', title: 'Solar & PV', icon: '☀', category: 'Reference', subtitle: 'PV systems' },
  { to: '/reference/emergency-power', title: 'Emergency Power', icon: '🚨', category: 'Reference', subtitle: 'ATS & gensets' },

  // ── Installation Guides ──
  { to: '/reference/grounding-systems', title: 'Grounding Systems', icon: '⏚', category: 'Installation Guides', subtitle: 'HRG, testing' },
  { to: '/reference/fire-alarm', title: 'Fire Alarm', icon: '🔔', category: 'Installation Guides', subtitle: 'Wiring & inspect' },
  { to: '/reference/wiring-methods', title: 'Wiring Methods', icon: '🔧', category: 'Installation Guides', subtitle: 'EMT, TECK, burial' },
  { to: '/reference/conductor-properties', title: 'Conductors', icon: '🧵', category: 'Installation Guides', subtitle: 'AWG, derating' },
  { to: '/reference/industrial-comms', title: 'Industrial Comms', icon: '📡', category: 'Installation Guides', subtitle: 'Modbus, Ethernet' },

  // ── Mining ──
  { to: '/mining/power', title: 'Mine Power', icon: '⛏', category: 'Mining', subtitle: 'Equipment & volts' },
  { to: '/mining/cable-tray', title: 'Mine Cable Tray', icon: '▤', category: 'Mining', subtitle: 'TECK90 tray fill' },

  // ── Tools ──
  { to: '/materials', title: 'Material Lists', icon: '📋', category: 'Tools', subtitle: 'Job tracking' },
  { to: '/tools/panel-schedule', title: 'Panel Schedule', icon: '📊', category: 'Tools', subtitle: 'Panel builder' },
  { to: '/tools/hour-tracker', title: 'Hour Tracker', icon: '⏱', category: 'Tools', subtitle: 'Apprentice hrs' },
  { to: '/tools/exam-prep', title: 'Exam Prep', icon: '🎓', category: 'Tools', subtitle: 'CEC flashcards' },
]

/* ── "favourites" shown prominently ── */
const spotlightRoutes = [
  '/wire/teck-cable',
  '/safety/loto',
  '/reference/code-requirements',
  '/motors/vfd',
  '/reference/troubleshooting',
  '/safety/arc-flash',
]

/* ── category order for the browse grid ── */
const categoryOrder = [
  'Calculators',
  'Wire & Cable',
  'Motors & Drives',
  'Safety',
  'Reference',
  'Installation Guides',
  'Mining',
  'Tools',
]

/* ═══════════════════════════════════════════ */
export default function HomePage() {
  const [search, setSearch] = useState('')
  const [expandedCat, setExpandedCat] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return allFeatures
    const q = search.toLowerCase()
    return allFeatures.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q))
    )
  }, [search])

  const spotlight = useMemo(
    () => allFeatures.filter(c => spotlightRoutes.includes(c.to)),
    []
  )

  const grouped = useMemo(() => {
    const map = new Map<string, Feature[]>()
    for (const f of filtered) {
      const list = map.get(f.category) || []
      list.push(f)
      map.set(f.category, list)
    }
    return map
  }, [filtered])

  const isSearching = search.trim().length > 0

  return (
    <>
      <Header />
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(255,215,0,0.15); }
          50% { box-shadow: 0 0 24px rgba(255,215,0,0.35); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .cat-card:active { transform: scale(0.97); }
        .feat-row:active { background: var(--surface-hover) !important; }
      `}</style>

      <div style={{ padding: '0 16px 32px' }}>

        {/* ─── Hero Banner ─── */}
        {!isSearching && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,215,0,0.03) 100%)',
            borderRadius: 16,
            padding: '24px 20px',
            marginTop: 12,
            marginBottom: 20,
            border: '1px solid rgba(255,215,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative bolt */}
            <svg width={80} height={80} viewBox="0 0 24 24" fill="rgba(255,215,0,0.06)"
              style={{ position: 'absolute', right: -8, top: -8 }}>
              <path d="M13 2L4 14h7l-2 8 11-14h-7l4-6z" />
            </svg>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(255,215,0,0.3)',
                flexShrink: 0,
              }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="#000">
                  <path d="M13 2L4 14h7l-2 8 11-14h-7l4-6z" />
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: 24, fontWeight: 800, color: 'var(--primary)',
                  letterSpacing: -0.5, lineHeight: 1.1,
                }}>
                  SparkCalc
                </div>
                <div style={{
                  fontSize: 13, color: 'var(--text-secondary)', marginTop: 3,
                  lineHeight: 1.3,
                }}>
                  Ontario Electrical & Mining Reference
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div style={{
              display: 'flex', gap: 0, marginTop: 16,
              borderRadius: 10, overflow: 'hidden',
              border: '1px solid var(--divider)',
            }}>
              {[
                { n: allFeatures.length.toString(), l: 'Features' },
                { n: '8', l: 'Categories' },
                { n: '2024', l: 'CEC' },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: 'center', padding: '10px 0',
                  background: 'var(--surface)',
                  borderRight: i < 2 ? '1px solid var(--divider)' : 'none',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Search Bar ─── */}
        <div style={{ position: 'relative', marginBottom: isSearching ? 16 : 20 }}>
          <svg
            width={18} height={18} viewBox="0 0 24 24"
            fill="none" stroke="var(--text-secondary)" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
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
              padding: '14px 40px 14px 44px',
              fontSize: 16, borderRadius: 14,
              border: '1px solid var(--input-border)',
              background: 'var(--input-bg)',
              color: 'var(--text)',
              outline: 'none',
              minHeight: 56,
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--primary)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--input-border)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--divider)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
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
              fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
              marginBottom: 10, paddingLeft: 2,
            }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>

            {filtered.length === 0 && (
              <div style={{
                padding: '40px 16px', textAlign: 'center',
                color: 'var(--text-secondary)', fontSize: 15,
              }}>
                No tools match &ldquo;{search}&rdquo;
              </div>
            )}

            <div style={{ display: 'grid', gap: 6 }}>
              {filtered.map(f => (
                <Link key={f.to} to={f.to} className="feat-row" style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  background: 'var(--surface)',
                  borderRadius: 10,
                  border: '1px solid var(--divider)',
                  textDecoration: 'none', minHeight: 56,
                  transition: 'background .15s, transform .1s',
                }}>
                  <span style={{
                    fontSize: 22, width: 36, height: 36, textAlign: 'center',
                    lineHeight: '36px', flexShrink: 0,
                    background: catMeta[f.category]?.bg || 'rgba(255,215,0,0.08)',
                    borderRadius: 8,
                  }}>
                    {f.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.subtitle}</div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: catMeta[f.category]?.accent || 'var(--primary)',
                    background: catMeta[f.category]?.bg || 'rgba(255,215,0,0.08)',
                    padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap',
                  }}>
                    {f.category}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Spotlight (quick access) ─── */}
        {!isSearching && (
          <section style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <h2 style={{
                fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)',
                textTransform: 'uppercase', letterSpacing: 0.8,
              }}>
                ⚡ Quick Access
              </h2>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
            }}>
              {spotlight.map(f => {
                const meta = catMeta[f.category] || catMeta.Calculators
                return (
                  <Link key={f.to} to={f.to} className="cat-card" style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 6, padding: '16px 6px 14px',
                    background: 'var(--surface)',
                    borderRadius: 14,
                    border: '1px solid var(--divider)',
                    textDecoration: 'none', minHeight: 80,
                    transition: 'transform .15s, box-shadow .15s',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 3, background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
                      opacity: 0.6,
                    }} />
                    <span style={{
                      fontSize: 26, width: 42, height: 42,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: meta.bg, borderRadius: 10,
                    }}>
                      {f.icon}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
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
            <h2 style={{
              fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)',
              textTransform: 'uppercase', letterSpacing: 0.8,
              marginBottom: 12,
            }}>
              Browse by Category
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {categoryOrder.map(cat => {
                const meta = catMeta[cat] || catMeta.Calculators
                const count = allFeatures.filter(f => f.category === cat).length
                return (
                  <button key={cat} className="cat-card" onClick={() =>
                    setExpandedCat(expandedCat === cat ? null : cat)
                  } style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '16px 14px 14px',
                    background: expandedCat === cat ? meta.bg : 'var(--surface)',
                    borderRadius: 14,
                    border: `1px solid ${expandedCat === cat ? meta.accent + '40' : 'var(--divider)'}`,
                    textDecoration: 'none', minHeight: 80,
                    transition: 'transform .15s, border-color .2s, background .2s',
                    textAlign: 'left', width: '100%',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 3, background: meta.accent,
                      opacity: expandedCat === cat ? 0.8 : 0.3,
                      transition: 'opacity .2s',
                    }} />
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%',
                    }}>
                      <span style={{ fontSize: 22 }}>{meta.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 14, fontWeight: 700, color: 'var(--text)',
                          lineHeight: 1.2,
                        }}>
                          {cat}
                        </div>
                        <div style={{
                          fontSize: 11, color: meta.accent, fontWeight: 600, marginTop: 2,
                        }}>
                          {count} tool{count !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-secondary)" strokeWidth={2.5} strokeLinecap="round"
                        style={{
                          transition: 'transform .2s',
                          transform: expandedCat === cat ? 'rotate(90deg)' : 'rotate(0)',
                        }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* ─── Expanded Category Items ─── */}
            {expandedCat && grouped.has(expandedCat) && (
              <div style={{
                marginTop: -14, marginBottom: 20,
                animation: 'fadeIn .2s ease',
              }}>
                <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }`}</style>
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: catMeta[expandedCat]?.accent || 'var(--primary)',
                  marginBottom: 10, paddingLeft: 2,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>{catMeta[expandedCat]?.icon}</span>
                  {expandedCat}
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  {(grouped.get(expandedCat) || []).map(f => {
                    const meta = catMeta[f.category] || catMeta.Calculators
                    return (
                      <Link key={f.to} to={f.to} className="feat-row" style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px',
                        background: 'var(--surface)',
                        borderRadius: 10,
                        border: '1px solid var(--divider)',
                        borderLeft: `3px solid ${meta.accent}`,
                        textDecoration: 'none', minHeight: 56,
                        transition: 'background .15s',
                      }}>
                        <span style={{
                          fontSize: 20, width: 34, height: 34,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: meta.bg, borderRadius: 8, flexShrink: 0,
                        }}>
                          {f.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{f.title}</div>
                          {f.subtitle && (
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{f.subtitle}</div>
                          )}
                        </div>
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
                          stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ─── All Tools flat list ─── */}
            <h2 style={{
              fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)',
              textTransform: 'uppercase', letterSpacing: 0.8,
              marginBottom: 12, marginTop: 8,
            }}>
              All {allFeatures.length} Tools
            </h2>
            {categoryOrder.map(cat => {
              const items = allFeatures.filter(f => f.category === cat)
              if (items.length === 0) return null
              const meta = catMeta[cat] || catMeta.Calculators
              return (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <h3 style={{
                    fontSize: 12, fontWeight: 700,
                    color: meta.accent,
                    marginBottom: 6, paddingLeft: 4,
                    display: 'flex', alignItems: 'center', gap: 6,
                    textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>
                    <span style={{ fontSize: 14 }}>{meta.icon}</span>
                    {cat}
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)',
                      background: 'var(--surface)', padding: '1px 6px', borderRadius: 4,
                      marginLeft: 4,
                    }}>
                      {items.length}
                    </span>
                  </h3>
                  <div style={{ display: 'grid', gap: 4 }}>
                    {items.map(f => (
                      <Link key={f.to} to={f.to} className="feat-row" style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px',
                        background: 'var(--surface)',
                        borderRadius: 8,
                        border: '1px solid var(--divider)',
                        textDecoration: 'none', minHeight: 48,
                        transition: 'background .15s',
                      }}>
                        <span style={{
                          fontSize: 16, width: 28, textAlign: 'center', flexShrink: 0,
                        }}>
                          {f.icon}
                        </span>
                        <span style={{
                          fontSize: 14, fontWeight: 500, color: 'var(--text)', flex: 1,
                        }}>
                          {f.title}
                        </span>
                        <span style={{
                          fontSize: 11, color: 'var(--text-secondary)', flexShrink: 0,
                        }}>
                          {f.subtitle}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )}
      </div>
    </>
  )
}
