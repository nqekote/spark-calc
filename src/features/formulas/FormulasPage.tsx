import { useState, useMemo } from 'react'
import Header from '../../layout/Header'

type Category = 'basic' | 'ac' | 'motor' | 'transformer' | 'cable' | 'conduit'

interface Formula {
  name: string
  formula: string
  description: string
  variables: string[]
  category: Category
}

const categories: { value: Category; label: string }[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'ac', label: 'AC Power' },
  { value: 'motor', label: 'Motor' },
  { value: 'transformer', label: 'Xfmr' },
  { value: 'cable', label: 'Cable' },
  { value: 'conduit', label: 'Conduit' },
]

const formulas: Formula[] = [
  // Basic
  {
    name: "Ohm's Law (Voltage)",
    formula: 'V = I × R',
    description: 'Voltage equals current multiplied by resistance.',
    variables: ['V = Voltage (volts)', 'I = Current (amps)', 'R = Resistance (ohms)'],
    category: 'basic',
  },
  {
    name: 'Power (Basic)',
    formula: 'P = V × I',
    description: 'Power equals voltage multiplied by current.',
    variables: ['P = Power (watts)', 'V = Voltage (volts)', 'I = Current (amps)'],
    category: 'basic',
  },
  {
    name: 'Power (Current & Resistance)',
    formula: 'P = I² × R',
    description: 'Power equals current squared multiplied by resistance. Useful when voltage is unknown.',
    variables: ['P = Power (watts)', 'I = Current (amps)', 'R = Resistance (ohms)'],
    category: 'basic',
  },
  {
    name: 'Power (Voltage & Resistance)',
    formula: 'P = V² / R',
    description: 'Power equals voltage squared divided by resistance. Useful when current is unknown.',
    variables: ['P = Power (watts)', 'V = Voltage (volts)', 'R = Resistance (ohms)'],
    category: 'basic',
  },
  {
    name: 'Current from Power',
    formula: 'I = P / V',
    description: 'Current equals power divided by voltage. Used to find the current draw of a known load.',
    variables: ['I = Current (amps)', 'P = Power (watts)', 'V = Voltage (volts)'],
    category: 'basic',
  },
  // AC Power
  {
    name: 'Single-Phase Power',
    formula: 'P = V × I × PF',
    description: 'Real power in a single-phase AC circuit, accounting for power factor.',
    variables: [
      'P = Real power (watts)',
      'V = Voltage (volts)',
      'I = Current (amps)',
      'PF = Power factor (0 to 1)',
    ],
    category: 'ac',
  },
  {
    name: 'Three-Phase Power',
    formula: 'P = √3 × Vₗ × Iₗ × PF',
    description: 'Real power in a three-phase AC circuit using line voltage and line current.',
    variables: [
      'P = Real power (watts)',
      'Vₗ = Line-to-line voltage (volts)',
      'Iₗ = Line current (amps)',
      'PF = Power factor (0 to 1)',
    ],
    category: 'ac',
  },
  {
    name: 'Apparent Power (3ϕ)',
    formula: 'kVA = √3 × V × I / 1000',
    description: 'Apparent power in a three-phase system, measured in kilovolt-amperes.',
    variables: [
      'kVA = Apparent power (kilovolt-amperes)',
      'V = Line voltage (volts)',
      'I = Line current (amps)',
    ],
    category: 'ac',
  },
  {
    name: 'Real Power from kVA',
    formula: 'kW = kVA × PF',
    description: 'Real power equals apparent power multiplied by power factor.',
    variables: [
      'kW = Real power (kilowatts)',
      'kVA = Apparent power (kilovolt-amperes)',
      'PF = Power factor (0 to 1)',
    ],
    category: 'ac',
  },
  {
    name: 'Reactive Power',
    formula: 'kVAR = √(kVA² − kW²)',
    description: 'Reactive power is the component of apparent power that does no useful work but sustains magnetic fields in motors and transformers.',
    variables: [
      'kVAR = Reactive power (kilovolt-amperes reactive)',
      'kVA = Apparent power',
      'kW = Real power',
    ],
    category: 'ac',
  },
  // Motor
  {
    name: 'Motor Full Load Amps',
    formula: 'FLA = HP × 746 / (V × √3 × PF × Eff)',
    description: 'Calculates the full-load current of a three-phase motor from its horsepower rating.',
    variables: [
      'FLA = Full load amps',
      'HP = Horsepower',
      '746 = Watts per HP',
      'V = Line voltage (volts)',
      'PF = Power factor',
      'Eff = Motor efficiency (decimal)',
    ],
    category: 'motor',
  },
  {
    name: 'Motor Slip',
    formula: 'Slip% = (Ns − N) / Ns × 100',
    description: 'Slip is the difference between synchronous speed and actual rotor speed, expressed as a percentage.',
    variables: [
      'Slip% = Percent slip',
      'Ns = Synchronous speed (RPM)',
      'N = Actual rotor speed (RPM)',
    ],
    category: 'motor',
  },
  {
    name: 'Synchronous Speed',
    formula: 'Ns = 120 × f / P',
    description: 'The theoretical speed of the rotating magnetic field in an AC motor.',
    variables: [
      'Ns = Synchronous speed (RPM)',
      'f = Frequency (Hz, 60 in Ontario)',
      'P = Number of poles',
    ],
    category: 'motor',
  },
  {
    name: 'Motor Torque',
    formula: 'T = HP × 5252 / RPM',
    description: 'Torque output of a motor at a given speed in foot-pounds.',
    variables: [
      'T = Torque (ft-lbs)',
      'HP = Horsepower',
      '5252 = Constant (33000 / 2π)',
      'RPM = Rotational speed',
    ],
    category: 'motor',
  },
  // Transformer
  {
    name: 'Turns Ratio',
    formula: 'Np / Ns = Vp / Vs',
    description: 'The ratio of primary to secondary turns equals the ratio of primary to secondary voltage.',
    variables: [
      'Np = Primary turns',
      'Ns = Secondary turns',
      'Vp = Primary voltage',
      'Vs = Secondary voltage',
    ],
    category: 'transformer',
  },
  {
    name: 'Transformer kVA (3ϕ)',
    formula: 'kVA = V × I × √3 / 1000',
    description: 'Apparent power rating of a three-phase transformer.',
    variables: [
      'kVA = Transformer rating',
      'V = Rated voltage (volts)',
      'I = Rated current (amps)',
    ],
    category: 'transformer',
  },
  {
    name: 'Impedance Voltage',
    formula: 'Z% = Vsc / Vrated × 100',
    description: 'Percent impedance is the voltage required to circulate rated current through one winding with the other shorted.',
    variables: [
      'Z% = Percent impedance',
      'Vsc = Short-circuit voltage (volts)',
      'Vrated = Rated voltage (volts)',
    ],
    category: 'transformer',
  },
  {
    name: 'Short-Circuit Current',
    formula: 'Isc = kVA × 1000 / (V × √3 × Z%)',
    description: 'Maximum fault current available at the transformer secondary. Critical for selecting overcurrent devices.',
    variables: [
      'Isc = Short-circuit current (amps)',
      'kVA = Transformer rating',
      'V = Secondary line voltage',
      'Z% = Percent impedance (as decimal)',
    ],
    category: 'transformer',
  },
  // Cable
  {
    name: 'Voltage Drop',
    formula: 'VD = 2 × L × I × R / 1000',
    description: 'Voltage drop in a single-phase circuit based on conductor length, current, and resistance per km.',
    variables: [
      'VD = Voltage drop (volts)',
      'L = One-way length (metres)',
      'I = Current (amps)',
      'R = Resistance (Ω/km)',
      '2 = Accounts for supply and return conductor',
    ],
    category: 'cable',
  },
  {
    name: 'Conductor Resistance',
    formula: 'R = ρ × L / A',
    description: 'Resistance of a conductor based on its resistivity, length, and cross-sectional area.',
    variables: [
      'R = Resistance (ohms)',
      'ρ = Resistivity (Ω·mm²/m)',
      'L = Length (metres)',
      'A = Cross-sectional area (mm²)',
    ],
    category: 'cable',
  },
  {
    name: 'Ampacity Derating',
    formula: 'I_adj = I_table × TCF × BCF',
    description: 'Adjusted ampacity after applying temperature correction and bundling correction factors from CEC tables.',
    variables: [
      'I_adj = Adjusted ampacity (amps)',
      'I_table = Table ampacity (CEC Table 1–4)',
      'TCF = Temperature correction factor (CEC Table 5A–5C)',
      'BCF = Bundling correction factor (CEC Table 5D)',
    ],
    category: 'cable',
  },
  // Conduit
  {
    name: 'Conduit Fill Percentage',
    formula: 'Fill% = Σ(Cable Area) / Conduit Area × 100',
    description: 'The total cross-sectional area of all conductors divided by the internal area of the conduit.',
    variables: [
      'Fill% = Percent fill',
      'Σ(Cable Area) = Sum of all conductor areas (mm²)',
      'Conduit Area = Internal area of conduit (mm²)',
    ],
    category: 'conduit',
  },
  {
    name: 'CEC Fill Limits — 1 Conductor',
    formula: '1 wire = 53% fill max',
    description: 'A single conductor may fill up to 53% of the conduit cross-sectional area (CEC Table 8).',
    variables: ['Applies to a single conductor in a raceway'],
    category: 'conduit',
  },
  {
    name: 'CEC Fill Limits — 2 Conductors',
    formula: '2 wires = 31% fill max',
    description: 'Two conductors may fill up to 31% of the conduit cross-sectional area (CEC Table 8).',
    variables: ['Applies to exactly two conductors in a raceway'],
    category: 'conduit',
  },
  {
    name: 'CEC Fill Limits — 3+ Conductors',
    formula: '3+ wires = 40% fill max',
    description: 'Three or more conductors may fill up to 40% of the conduit cross-sectional area (CEC Table 8).',
    variables: ['Applies to three or more conductors in a raceway'],
    category: 'conduit',
  },
]

const pillStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 14px',
  borderRadius: 'var(--radius)',
  border: 'none',
  background: active ? 'var(--primary)' : 'var(--surface)',
  color: active ? '#000' : 'var(--text-secondary)',
  fontWeight: active ? 700 : 500,
  fontSize: 13,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  minHeight: 'var(--touch-min)',
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'var(--font-sans)',
})

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius)',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}

const formulaTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 18,
  fontWeight: 700,
  color: 'var(--primary)',
  letterSpacing: 0.5,
}

const descStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text)',
  lineHeight: 1.5,
}

const varStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-mono)',
  lineHeight: 1.6,
}

export default function FormulasPage() {
  const [activeTab, setActiveTab] = useState<Category>('basic')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let list = formulas.filter((f) => f.category === activeTab)
    if (q) {
      list = formulas.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.formula.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.variables.some((v) => v.toLowerCase().includes(q))
      )
    }
    return list
  }, [activeTab, search])

  return (
    <>
      <Header title="Electrical Formulas" />
      <div style={{ padding: '0 16px 120px' }}>
        {/* Search */}
        <div style={{ padding: '12px 0' }}>
          <input
            type="text"
            placeholder="Search formulas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--input-border)',
              background: 'var(--input-bg)',
              color: 'var(--text)',
              fontSize: 15,
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              boxSizing: 'border-box',
              minHeight: 'var(--touch-min)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--input-focus)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--input-border)')}
          />
        </div>

        {/* Category pills */}
        {!search && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 12,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                style={pillStyle(activeTab === cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Results count when searching */}
        {search && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '0 0 8px' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </div>
        )}

        {/* Formula cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((f, i) => (
            <div key={`${f.category}-${i}`} style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{f.name}</div>
              <div style={formulaTextStyle}>{f.formula}</div>
              <div style={descStyle}>{f.description}</div>
              <div
                style={{
                  borderTop: '1px solid var(--divider)',
                  paddingTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {f.variables.map((v, vi) => (
                  <div key={vi} style={varStyle}>
                    {v}
                  </div>
                ))}
              </div>
              {search && (
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    background: 'var(--primary-dim)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    alignSelf: 'flex-start',
                  }}
                >
                  {categories.find((c) => c.value === f.category)?.label}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: 'var(--text-secondary)',
                fontSize: 14,
              }}
            >
              No formulas found. Try a different search term.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
