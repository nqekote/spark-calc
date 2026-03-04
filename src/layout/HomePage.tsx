import { useState, useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'

/* ═══════════════════════════════════════════
   Design tokens per category
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
  'Installation Guides': {
    accent: 'var(--accent-install)', bg: 'rgba(6,182,212,0.06)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 00-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 007.94-7.94l-3.76 3.76z"/></svg>,
  },
  Tools: {
    accent: 'var(--accent-tools)', bg: 'rgba(99,102,241,0.06)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><rect x="5" y="2" width="14" height="20" rx="2"/><rect x="8" y="5" width="8" height="5" rx="1"/><circle cx="12" cy="16" r="2.5"/></svg>,
  },
}

/* ═══════════════════════════════════════════
   Feature catalogue
   ═══════════════════════════════════════════ */
interface Feature { to: string; title: string; icon: string; category: string; subtitle?: string }

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
  { to: '/electrical/transformer-loading', title: 'Xfmr Loading', icon: '🔥', category: 'Calculators', subtitle: 'Loading & life' },
  { to: '/electrical/ground-fault', title: 'Ground Fault', icon: '⏚', category: 'Calculators', subtitle: 'GF & NGR calc' },

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
  { to: '/conduit/fill', title: 'Conduit Fill', icon: '◎', category: 'Wire & Cable', subtitle: 'Fill calcs' },
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
  { to: '/reference/protective-relays', title: 'Protective Relays', icon: '⚡', category: 'Reference', subtitle: 'ANSI & settings' },
  { to: '/reference/switchgear', title: 'Switchgear', icon: '🔧', category: 'Reference', subtitle: 'MV/LV types' },
  { to: '/reference/portable-substation', title: 'Portable Subs', icon: '⎔', category: 'Reference', subtitle: 'Install & maint.' },

  // ── Installation Guides ──
  { to: '/reference/grounding-systems', title: 'Grounding Systems', icon: '⏚', category: 'Installation Guides', subtitle: 'HRG, testing' },
  { to: '/reference/fire-alarm', title: 'Fire Alarm', icon: '🔔', category: 'Installation Guides', subtitle: 'Wiring & inspect' },
  { to: '/reference/wiring-methods', title: 'Wiring Methods', icon: '🔧', category: 'Installation Guides', subtitle: 'EMT, TECK, burial' },
  { to: '/reference/conductor-properties', title: 'Conductors', icon: '🧵', category: 'Installation Guides', subtitle: 'AWG, derating' },
  { to: '/reference/industrial-comms', title: 'Industrial Comms', icon: '📡', category: 'Installation Guides', subtitle: 'Modbus, Ethernet' },
  { to: '/reference/testing-guide', title: 'Hi-Pot & Megger', icon: '📏', category: 'Installation Guides', subtitle: 'IR, PI, hi-pot' },

  // ── Mining ──
  { to: '/mining/power', title: 'Mine Power', icon: '⛏', category: 'Mining', subtitle: 'Equipment & volts' },
  { to: '/mining/cable-tray', title: 'Mine Cable Tray', icon: '▤', category: 'Mining', subtitle: 'TECK90 tray fill' },

  // ── Tools ──
  { to: '/materials', title: 'Material Lists', icon: '📋', category: 'Tools', subtitle: 'Job tracking' },
  { to: '/tools/panel-schedule', title: 'Panel Schedule', icon: '📊', category: 'Tools', subtitle: 'Panel builder' },
  { to: '/tools/hour-tracker', title: 'Hour Tracker', icon: '⏱', category: 'Tools', subtitle: 'Apprentice hrs' },
  { to: '/tools/exam-prep', title: 'Exam Prep', icon: '🎓', category: 'Tools', subtitle: 'CEC flashcards' },
  { to: '/tools/single-line', title: 'Single-Line', icon: '─', category: 'Tools', subtitle: 'Diagram builder' },
]

/* Quick access pinned routes */
const spotlightRoutes = [
  '/wire/teck-cable',
  '/safety/loto',
  '/reference/code-requirements',
  '/motors/vfd',
  '/reference/troubleshooting',
  '/safety/arc-flash',
]

const categoryOrder = [
  'Calculators', 'Wire & Cable', 'Motors & Drives', 'Safety',
  'Reference', 'Installation Guides', 'Mining', 'Tools',
]

/* ═══════════════════════════════════════════ */
export default function HomePage() {
  const [search, setSearch] = useState('')
  const [expandedCat, setExpandedCat] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return allFeatures
    const q = search.toLowerCase()
    return allFeatures.filter(
      c => c.title.toLowerCase().includes(q) ||
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
        .home-card { transition: transform 80ms ease, background 150ms ease; }
        .home-card:active { transform: scale(0.97); }
        .feat-row { transition: background 120ms ease, transform 60ms ease; }
        .feat-row:active { background: var(--surface-hover) !important; transform: scale(0.985); }
        .cat-btn { transition: transform 80ms ease, border-color 200ms ease, background 200ms ease; }
        .cat-btn:active { transform: scale(0.97); }
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
                <svg width={24} height={24} viewBox="0 0 24 24" fill="#000">
                  <path d="M13 2L4 14h7l-2 8 11-14h-7l4-6z" />
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: 22, fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--primary)',
                  letterSpacing: '-0.5px', lineHeight: 1.1,
                }}>
                  SparkCalc
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

            {/* Stats */}
            <div style={{
              display: 'flex', gap: 1, marginTop: 20,
              borderRadius: 'var(--radius)', overflow: 'hidden',
              border: '1px solid var(--divider)',
            }}>
              {[
                { n: allFeatures.length.toString(), l: 'Tools' },
                { n: categoryOrder.length.toString(), l: 'Categories' },
                { n: '2024', l: 'CEC' },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: 'center', padding: '12px 0',
                  background: 'var(--surface-elevated)',
                }}>
                  <div style={{
                    fontSize: 18, fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--primary)',
                    letterSpacing: '-0.5px',
                  }}>{s.n}</div>
                  <div style={{
                    fontSize: 10, color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.8px', marginTop: 2,
                  }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                    fontSize: 20, width: 36, height: 36, textAlign: 'center',
                    lineHeight: '36px', flexShrink: 0,
                    background: catMeta[f.category]?.bg || 'var(--primary-subtle)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    {f.icon}
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

        {/* ─── Quick Access ─── */}
        {!isSearching && (
          <section style={{ marginBottom: 28 }}>
            <SectionLabel>Quick Access</SectionLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            }}>
              {spotlight.map((f, i) => {
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
                    {/* Top accent line */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
                      opacity: 0.5,
                    }} />
                    <span style={{
                      fontSize: 24, width: 40, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: meta.bg, borderRadius: 10,
                    }}>
                      {f.icon}
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
            <SectionLabel>Browse by Category</SectionLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
              marginBottom: 24,
            }}>
              {categoryOrder.map((cat, i) => {
                const meta = catMeta[cat] || catMeta.Calculators
                const count = allFeatures.filter(f => f.category === cat).length
                const isExpanded = expandedCat === cat
                return (
                  <button key={cat} className="cat-btn animate-in" onClick={() =>
                    setExpandedCat(isExpanded ? null : cat)
                  } style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '14px 14px 12px',
                    background: isExpanded ? meta.bg : 'var(--surface)',
                    borderRadius: 'var(--radius)',
                    border: `1px solid ${isExpanded ? meta.accent + '30' : 'var(--divider)'}`,
                    textDecoration: 'none', minHeight: 76,
                    textAlign: 'left', width: '100%',
                    position: 'relative', overflow: 'hidden',
                    animationDelay: `${i * 30}ms`,
                  }}>
                    {/* Top accent bar */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 2, background: meta.accent,
                      opacity: isExpanded ? 0.8 : 0.2,
                      transition: 'opacity 200ms ease',
                    }} />
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%',
                    }}>
                      <div style={{ width: 22, height: 22, color: meta.accent, flexShrink: 0, display: 'inline-flex' }}>{meta.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700,
                          fontFamily: 'var(--font-display)',
                          color: 'var(--text)', lineHeight: 1.2,
                        }}>
                          {cat}
                        </div>
                        <div style={{
                          fontSize: 11, fontWeight: 500,
                          fontFamily: 'var(--font-mono)',
                          color: meta.accent, marginTop: 2,
                        }}>
                          {count}
                        </div>
                      </div>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-tertiary)" strokeWidth={2.5} strokeLinecap="round"
                        style={{
                          transition: 'transform 200ms ease',
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                        }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* ─── Expanded Items ─── */}
            {expandedCat && grouped.has(expandedCat) && (
              <div style={{ marginTop: -16, marginBottom: 24 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  color: catMeta[expandedCat]?.accent || 'var(--primary)',
                  marginBottom: 10, paddingLeft: 2,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <div style={{ width: 16, height: 16, flexShrink: 0, display: 'inline-flex' }}>{catMeta[expandedCat]?.icon}</div>
                  {expandedCat}
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  {(grouped.get(expandedCat) || []).map((f, i) => {
                    const meta = catMeta[f.category] || catMeta.Calculators
                    return (
                      <Link key={f.to} to={f.to} className="feat-row animate-in" style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px',
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--divider)',
                        borderLeft: `3px solid ${meta.accent}`,
                        textDecoration: 'none', minHeight: 56,
                        animationDelay: `${Math.min(i, 10) * 30}ms`,
                      }}>
                        <span style={{
                          fontSize: 18, width: 34, height: 34,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: meta.bg, borderRadius: 'var(--radius-sm)',
                          flexShrink: 0,
                        }}>
                          {f.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 14, fontWeight: 600, color: 'var(--text)',
                            fontFamily: 'var(--font-display)',
                          }}>{f.title}</div>
                          {f.subtitle && (
                            <div style={{
                              fontSize: 12, color: 'var(--text-secondary)',
                              fontFamily: 'var(--font-display)',
                              marginTop: 1,
                            }}>{f.subtitle}</div>
                          )}
                        </div>
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                          stroke="var(--text-tertiary)" strokeWidth={2} strokeLinecap="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ─── All Tools ─── */}
            <SectionLabel>All {allFeatures.length} Tools</SectionLabel>
            {categoryOrder.map(cat => {
              const items = allFeatures.filter(f => f.category === cat)
              if (items.length === 0) return null
              const meta = catMeta[cat] || catMeta.Calculators
              return (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: meta.accent,
                    marginBottom: 8, paddingLeft: 4,
                    display: 'flex', alignItems: 'center', gap: 8,
                    textTransform: 'uppercase', letterSpacing: '0.8px',
                  }}>
                    <div style={{ width: 16, height: 16, color: meta.accent, flexShrink: 0, display: 'inline-flex' }}>{meta.icon}</div>
                    {cat}
                    <span style={{
                      fontSize: 10, fontWeight: 500,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-tertiary)',
                      background: 'var(--surface)',
                      padding: '2px 8px', borderRadius: 'var(--radius-full)',
                    }}>
                      {items.length}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gap: 4 }}>
                    {items.map(f => (
                      <Link key={f.to} to={f.to} className="feat-row" style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px',
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--divider)',
                        textDecoration: 'none', minHeight: 48,
                      }}>
                        <span style={{
                          fontSize: 15, width: 28, textAlign: 'center', flexShrink: 0,
                        }}>
                          {f.icon}
                        </span>
                        <span style={{
                          fontSize: 14, fontWeight: 500, color: 'var(--text)',
                          fontFamily: 'var(--font-display)',
                          flex: 1,
                        }}>
                          {f.title}
                        </span>
                        <span style={{
                          fontSize: 11, color: 'var(--text-tertiary)',
                          fontFamily: 'var(--font-display)',
                          flexShrink: 0,
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
