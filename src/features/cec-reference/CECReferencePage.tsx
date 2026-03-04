import { useState } from 'react'
import Header from '../../layout/Header'

interface ColorEntry {
  color: string
  css: string
  label: string
}

interface WireSection {
  title: string
  entries: ColorEntry[]
}

const wireSections: WireSection[] = [
  {
    title: 'Single Phase (120/240V)',
    entries: [
      { color: 'Black', css: '#222', label: 'Hot (Line 1)' },
      { color: 'Red', css: '#e53e3e', label: 'Hot (Line 2)' },
      { color: 'White', css: '#f0f0f0', label: 'Neutral' },
      { color: 'Green', css: '#38a169', label: 'Ground' },
    ],
  },
  {
    title: 'Three Phase (120/208V or 347/600V)',
    entries: [
      { color: 'Red', css: '#e53e3e', label: 'Phase A' },
      { color: 'Black', css: '#222', label: 'Phase B' },
      { color: 'Blue', css: '#3182ce', label: 'Phase C' },
      { color: 'White', css: '#f0f0f0', label: 'Neutral' },
      { color: 'Green', css: '#38a169', label: 'Ground' },
    ],
  },
  {
    title: 'DC',
    entries: [
      { color: 'Red', css: '#e53e3e', label: 'Positive' },
      { color: 'Black/Blue', css: '#222', label: 'Negative' },
      { color: 'White', css: '#f0f0f0', label: 'Neutral (if applicable)' },
      { color: 'Green', css: '#38a169', label: 'Ground' },
    ],
  },
]

interface CECRule {
  rule: string
  title: string
  description: string
}

const cecRules: CECRule[] = [
  { rule: '4-006', title: 'Conductor Ampacity', description: 'Establishes allowable ampacities for conductors based on insulation type, temperature rating, and installation conditions.' },
  { rule: '8-200', title: 'Residential Demand Loads', description: 'Calculation method for determining minimum service size for residential dwelling units.' },
  { rule: '10-204', title: 'Receptacle Ratings', description: 'Specifies that receptacle ratings must not be less than the rating of the circuit they are connected to.' },
  { rule: '12-100', title: 'Wiring Methods', description: 'General requirements for approved wiring methods and their appropriate applications.' },
  { rule: '12-506', title: 'Box Fill Requirements', description: 'Requirements for the minimum volume of boxes based on the number and size of conductors.' },
  { rule: '12-3034', title: 'Box Volume Calculations', description: 'Detailed counting rules for determining required box volume including conductors, clamps, grounds, and devices.' },
  { rule: '14-100', title: 'Overcurrent Protection', description: 'General requirements for overcurrent protection of conductors and equipment.' },
  { rule: '26-252', title: 'Transformer Protection', description: 'Overcurrent protection requirements for transformer primary and secondary windings.' },
  { rule: '26-700', title: 'Motor Circuits General', description: 'General requirements for motor circuit conductors, disconnecting means, and controllers.' },
  { rule: '28-106', title: 'Motor Conductor Sizing', description: 'Motor branch circuit conductors must be rated at least 125% of the motor full-load current (FLC).' },
  { rule: '28-200', title: 'Motor Overcurrent Protection', description: 'Branch circuit overcurrent protection requirements for motor circuits.' },
  { rule: '28-400', title: 'Motor Overload Protection', description: 'Running overload protection requirements to protect motors from sustained overcurrent.' },
  { rule: '30-004', title: 'GFCI Protection Requirements', description: 'Locations and circuits requiring ground fault circuit interrupter protection.' },
  { rule: '30-320', title: 'Tamper-Resistant Receptacles', description: 'Requirements for tamper-resistant receptacles in dwelling units and child care facilities.' },
  { rule: '36-110', title: 'High Voltage Installations', description: 'Requirements for installations operating at voltages exceeding 750V.' },
  { rule: '64-112', title: 'Bonding of Services', description: 'Requirements for bonding the grounding conductor to the service equipment enclosure.' },
  { rule: '68-302', title: 'Fire Alarm Wiring', description: 'Wiring methods and installation requirements for fire alarm systems.' },
]

interface Formula {
  name: string
  formula: string
  note?: string
}

const formulas: Formula[] = [
  { name: "Ohm's Law", formula: 'V = I \× R' },
  { name: 'Power (single phase)', formula: 'P = V \× I \× PF' },
  { name: 'Power (three phase)', formula: 'P = \√3 \× V \× I \× PF' },
  { name: 'Voltage Drop (single phase)', formula: 'VD = 2 \× K \× I \× L / CM' },
  { name: 'Motor conductor', formula: '125% of FLC', note: 'CEC Rule 28-106' },
  { name: 'Continuous load conductor', formula: '125% of load current' },
  { name: 'Transformer FLA (single phase)', formula: 'FLA = kVA \× 1000 / V' },
  { name: 'Transformer FLA (three phase)', formula: 'FLA = kVA \× 1000 / (V \× \√3)' },
]

const breakerSizes = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600]

const conduitFill = [
  { conductors: '1 conductor', fill: '53%' },
  { conductors: '2 conductors', fill: '31%' },
  { conductors: '3+ conductors', fill: '40%' },
]

function matchesSearch(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase())
}

function CollapsibleCard({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--divider)',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          minHeight: 56,
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
        {title}
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function CECReferencePage() {
  const [search, setSearch] = useState('')

  const q = search.trim()

  // Filter sections based on search
  const showColors = !q || matchesSearch('wire color codes canadian single phase three dc hot neutral ground positive negative', q)
    || wireSections.some(s => s.entries.some(e => matchesSearch(e.color + ' ' + e.label, q)))

  const filteredRules = cecRules.filter(r =>
    !q || matchesSearch(r.rule + ' ' + r.title + ' ' + r.description, q)
  )
  const showRules = filteredRules.length > 0

  const filteredFormulas = formulas.filter(f =>
    !q || matchesSearch(f.name + ' ' + f.formula + ' ' + (f.note || ''), q)
  )
  const showFormulas = filteredFormulas.length > 0

  const showBreakers = !q || matchesSearch('standard breaker sizes ampere', q)
    || breakerSizes.some(s => matchesSearch(String(s), q))

  const showConduit = !q || matchesSearch('conduit fill percentages conductor', q)

  const noResults = !showColors && !showRules && !showFormulas && !showBreakers && !showConduit

  return (
    <>
      <Header title="CEC Reference" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search CEC references..."
            style={{
              width: '100%',
              height: 56,
              background: 'var(--input-bg)',
              border: '2px solid var(--input-border)',
              borderRadius: 8,
              padding: '0 16px 0 44px',
              fontSize: 16,
              color: 'var(--text)',
            }}
          />
        </div>

        {noResults && (
          <div style={{
            textAlign: 'center',
            padding: '32px 16px',
            color: 'var(--text-secondary)',
            fontSize: 14,
          }}>
            No results found for &ldquo;{q}&rdquo;
          </div>
        )}

        {/* 1. Wire Color Codes */}
        {showColors && (
          <CollapsibleCard title="Wire Color Codes (Canadian)" defaultOpen={!!q}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {wireSections.map(section => (
                <div key={section.title}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {section.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {section.entries.map((entry, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '8px 12px',
                          background: 'var(--bg)',
                          borderRadius: 6,
                          minHeight: 44,
                        }}
                      >
                        <span style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: entry.css,
                          border: entry.color === 'White' ? '2px solid var(--divider)' : '2px solid transparent',
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', minWidth: 80 }}>
                          {entry.color}
                        </span>
                        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                          {entry.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleCard>
        )}

        {/* 2. Common CEC Rules */}
        {showRules && (
          <CollapsibleCard title="Common CEC Rules Quick Reference" defaultOpen={!!q}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filteredRules.map(rule => (
                <div
                  key={rule.rule}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--bg)',
                    borderRadius: 6,
                    borderLeft: '3px solid var(--primary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--primary)',
                      whiteSpace: 'nowrap',
                    }}>
                      Rule {rule.rule}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      {rule.title}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {rule.description}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleCard>
        )}

        {/* 3. Common Formulas */}
        {showFormulas && (
          <CollapsibleCard title="Common Formulas" defaultOpen={!!q}>
            <div style={{ display: 'grid', gap: 8 }}>
              {filteredFormulas.map(f => (
                <div
                  key={f.name}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg)',
                    borderRadius: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {f.name}
                  </span>
                  <span style={{
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text)',
                  }}>
                    {f.formula}
                  </span>
                  {f.note && (
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {f.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleCard>
        )}

        {/* 4. Standard Breaker Sizes */}
        {showBreakers && (
          <CollapsibleCard title="Standard Breaker Sizes" defaultOpen={!!q}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
            }}>
              {breakerSizes.map(size => (
                <span
                  key={size}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 52,
                    height: 36,
                    padding: '0 10px',
                    background: 'var(--bg)',
                    border: '1px solid var(--divider)',
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text)',
                  }}
                >
                  {size}A
                </span>
              ))}
            </div>
          </CollapsibleCard>
        )}

        {/* 5. Conduit Fill Percentages */}
        {showConduit && (
          <CollapsibleCard title="Conduit Fill Percentages" defaultOpen={!!q}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {conduitFill.map(item => (
                <div
                  key={item.conductors}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: 'var(--bg)',
                    borderRadius: 6,
                    minHeight: 48,
                  }}
                >
                  <span style={{ fontSize: 14, color: 'var(--text)' }}>
                    {item.conductors}
                  </span>
                  <span style={{
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--primary)',
                  }}>
                    {item.fill}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleCard>
        )}
      </div>
    </>
  )
}
