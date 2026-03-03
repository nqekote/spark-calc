import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'

interface Calculator {
  to: string
  title: string
  icon: string
  category: string
}

const allCalculators: Calculator[] = [
  // Electrical
  { to: '/electrical/ohms-law', title: "Ohm's Law", icon: '\u03A9', category: 'Electrical' },
  { to: '/electrical/power', title: 'Power Calculator', icon: '\u26A1', category: 'Electrical' },
  { to: '/electrical/voltage-drop', title: 'Voltage Drop', icon: '\u2193', category: 'Electrical' },
  { to: '/electrical/power-factor', title: 'Power Factor', icon: '\u223C', category: 'Electrical' },
  { to: '/electrical/gfci-afci', title: 'GFCI / AFCI', icon: '\u26A1', category: 'Electrical' },
  { to: '/electrical/short-circuit', title: 'Short Circuit', icon: '\uD83D\uDCA5', category: 'Electrical' },
  { to: '/electrical/lighting', title: 'Lighting Calculator', icon: '\uD83D\uDCA1', category: 'Electrical' },
  { to: '/electrical/transformer-sizing', title: 'Transformer Sizing', icon: '\u2394', category: 'Electrical' },
  { to: '/electrical/disconnect', title: 'Disconnect Sizing', icon: '\u2393', category: 'Electrical' },
  { to: '/electrical/generator', title: 'Generator Sizing', icon: '\u26A1', category: 'Electrical' },
  // Conduit
  { to: '/conduit/bending', title: 'EMT Bending', icon: '\u2312', category: 'Conduit' },
  { to: '/conduit/fill', title: 'Conduit Fill', icon: '\u25CE', category: 'Conduit' },
  { to: '/conduit/raceway-spacing', title: 'Raceway Spacing', icon: '\u2393', category: 'Conduit' },
  { to: '/conduit/burial-depths', title: 'Burial Depths', icon: '\u2B07', category: 'Conduit' },
  { to: '/conduit/cable-tray', title: 'Cable Tray Sizing', icon: '\u25A4', category: 'Conduit' },
  // Wire & Protection
  { to: '/wire/ampacity', title: 'Ampacity Lookup', icon: '\u1D2C', category: 'Wire & Protection' },
  { to: '/wire/sizing', title: 'Wire Sizing', icon: '\u2338', category: 'Wire & Protection' },
  { to: '/wire/grounding', title: 'Grounding Conductor', icon: '\u23DA', category: 'Wire & Protection' },
  { to: '/wire/ocp-transformer', title: 'Transformer OCP', icon: '\u2397', category: 'Wire & Protection' },
  { to: '/wire/ocp-feeder', title: 'Feeder OCP', icon: '\u2393', category: 'Wire & Protection' },
  { to: '/wire/cable-types', title: 'Cable Types', icon: '\uD83D\uDD0C', category: 'Wire & Protection' },
  { to: '/wire/torque-specs', title: 'Torque Specs', icon: '\uD83D\uDD27', category: 'Wire & Protection' },
  { to: '/wire/teck-cable', title: 'TECK90 Cable Guide', icon: '\uD83D\uDD29', category: 'Wire & Protection' },
  // Motors
  { to: '/motors/flc', title: 'Motor FLC Tables', icon: '\u2699', category: 'Motors' },
  { to: '/motors/branch', title: 'Motor Branch Circuit', icon: '\u2442', category: 'Motors' },
  { to: '/motors/ocp', title: 'Motor OCP', icon: '\u26D4', category: 'Motors' },
  { to: '/motors/starters', title: 'Motor Starters', icon: '\u25B6', category: 'Motors' },
  { to: '/motors/vfd', title: 'VFD Reference', icon: '\u223F', category: 'Motors' },
  { to: '/motors/medium-voltage', title: 'Medium Voltage', icon: '\u26A1', category: 'Motors' },
  // Safety
  { to: '/safety/arc-flash', title: 'Arc Flash', icon: '\u26A1', category: 'Safety' },
  { to: '/safety/loto', title: 'Lockout / Tagout', icon: '\uD83D\uDD12', category: 'Safety' },
  // Mining
  { to: '/mining/safety', title: 'Mining Electrical Safety', icon: '\u26A0\uFE0F', category: 'Mining' },
  { to: '/mining/hazardous-areas', title: 'Hazardous Areas', icon: '\uD83D\uDCA8', category: 'Mining' },
  { to: '/mining/power', title: 'Mine Power Systems', icon: '\u26CF', category: 'Mining' },
  { to: '/mining/cable-tray', title: 'Cable Tray Sizing', icon: '\u25A4', category: 'Mining' },
  // Reference
  { to: '/reference/box-fill', title: 'Box Fill', icon: '\u25A3', category: 'Reference' },
  { to: '/reference/residential', title: 'Residential Demand', icon: '\u2302', category: 'Reference' },
  { to: '/reference/cec', title: 'CEC Reference', icon: '\uD83D\uDCD6', category: 'Reference' },
  { to: '/reference/formulas', title: 'Formulas Cheat Sheet', icon: '\uD83D\uDCDD', category: 'Reference' },
  { to: '/reference/unit-converter', title: 'Unit Converter', icon: '\uD83D\uDD04', category: 'Reference' },
  { to: '/reference/troubleshooting', title: 'Troubleshooting', icon: '\uD83D\uDD0D', category: 'Reference' },
  { to: '/reference/multimeter', title: 'Multimeter Guide', icon: '\uD83D\uDCCF', category: 'Reference' },
  { to: '/reference/control-circuits', title: 'Control Circuits', icon: '\u2B61', category: 'Reference' },
  { to: '/reference/plc-basics', title: 'PLC Basics', icon: '\uD83E\uDDE0', category: 'Reference' },
  { to: '/reference/grounding-systems', title: 'Grounding Systems', icon: '\u23DA', category: 'Reference' },
  { to: '/reference/fire-alarm', title: 'Fire Alarm', icon: '\uD83D\uDD14', category: 'Reference' },
  { to: '/reference/electrical-symbols', title: 'Electrical Symbols', icon: '\uD83D\uDD0C', category: 'Reference' },
  { to: '/reference/instrumentation', title: 'Instrumentation', icon: '\uD83D\uDCE1', category: 'Reference' },
  { to: '/reference/power-quality', title: 'Power Quality', icon: '\uD83D\uDCC8', category: 'Reference' },
  { to: '/reference/code-requirements', title: 'CEC Code by Task', icon: '\uD83D\uDCDC', category: 'Reference' },
  // Tools
  { to: '/materials', title: 'Material Lists', icon: '\uD83D\uDCCB', category: 'Tools' },
  { to: '/tools/panel-schedule', title: 'Panel Schedule', icon: '\uD83D\uDCCA', category: 'Tools' },
  { to: '/tools/hour-tracker', title: 'Hour Tracker', icon: '\u23F1', category: 'Tools' },
  { to: '/tools/exam-prep', title: 'Exam Prep', icon: '\uD83C\uDF93', category: 'Tools' },
]

const quickAccessRoutes = [
  '/wire/teck-cable',
  '/safety/loto',
  '/safety/arc-flash',
  '/reference/code-requirements',
  '/motors/vfd',
  '/reference/instrumentation',
  '/reference/electrical-symbols',
  '/mining/safety',
  '/reference/troubleshooting',
]

export default function HomePage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return allCalculators
    const q = search.toLowerCase()
    return allCalculators.filter(
      c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    )
  }, [search])

  const quickAccess = useMemo(
    () => allCalculators.filter(c => quickAccessRoutes.includes(c.to)),
    []
  )

  const grouped = useMemo(() => {
    const map = new Map<string, Calculator[]>()
    for (const calc of filtered) {
      const list = map.get(calc.category) || []
      list.push(calc)
      map.set(calc.category, list)
    }
    return map
  }, [filtered])

  const isSearching = search.trim().length > 0

  return (
    <>
      <Header />

      <div style={{ padding: '0 16px 24px' }}>
        {/* Brand greeting */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '20px 0 16px',
        }}>
          <svg width={36} height={36} viewBox="0 0 24 24" fill="var(--primary)">
            <path d="M13 2L4 14h7l-2 8 11-14h-7l4-6z" />
          </svg>
          <div>
            <div style={{
              fontSize: 22, fontWeight: 700, color: 'var(--primary)',
              fontFamily: 'var(--font-sans)',
            }}>
              SparkCalc
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 1 }}>
              Electrical & Mining Tools
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <svg
            width={18} height={18} viewBox="0 0 24 24"
            fill="none" stroke="var(--text-secondary)" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="text"
            placeholder="Search calculators..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '14px 14px 14px 44px',
              fontSize: 16, borderRadius: 'var(--radius)',
              border: '1px solid var(--input-border)',
              background: 'var(--input-bg)',
              color: 'var(--text)',
              outline: 'none',
              minHeight: 56,
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* Quick Access - only when not searching */}
        {!isSearching && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{
              fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)',
              textTransform: 'uppercase', letterSpacing: 0.8,
              marginBottom: 12,
            }}>
              Quick Access
            </h2>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: 10,
            }}>
              {quickAccess.map(calc => (
                <Link key={calc.to} to={calc.to} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 6, padding: '14px 8px',
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--divider)',
                  textDecoration: 'none',
                  minHeight: 56,
                  transition: 'background .15s',
                }}>
                  <span style={{ fontSize: 24 }}>{calc.icon}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: 'var(--text)', textAlign: 'center',
                    lineHeight: 1.3,
                  }}>
                    {calc.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Tools grouped by category */}
        <section>
          <h2 style={{
            fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: 0.8,
            marginBottom: 12,
          }}>
            {isSearching ? 'Search Results' : 'All Tools'}
          </h2>

          {filtered.length === 0 && (
            <div style={{
              padding: '32px 16px', textAlign: 'center',
              color: 'var(--text-secondary)', fontSize: 15,
            }}>
              No calculators match "{search}"
            </div>
          )}

          {Array.from(grouped.entries()).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 20 }}>
              <h3 style={{
                fontSize: 13, fontWeight: 600, color: 'var(--primary)',
                marginBottom: 8, paddingLeft: 4,
              }}>
                {category}
              </h3>
              <div style={{ display: 'grid', gap: 6 }}>
                {items.map(calc => (
                  <Link key={calc.to} to={calc.to} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--divider)',
                    textDecoration: 'none',
                    minHeight: 56,
                    transition: 'background .15s',
                  }}>
                    <span style={{
                      fontSize: 20, width: 32, textAlign: 'center',
                      flexShrink: 0,
                    }}>
                      {calc.icon}
                    </span>
                    <span style={{
                      fontSize: 15, fontWeight: 500, color: 'var(--text)',
                      flex: 1,
                    }}>
                      {calc.title}
                    </span>
                    <svg
                      width={18} height={18} viewBox="0 0 24 24"
                      fill="none" stroke="var(--text-secondary)"
                      strokeWidth={2} strokeLinecap="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
