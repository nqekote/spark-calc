import { useState } from 'react'
import InputField from '../../components/InputField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

const modeOptions = [
  { value: 'loadlist', label: 'Load List' },
  { value: 'quick', label: 'Quick Calc' },
]

const loadTypeOptions = [
  { value: 'resistive', label: 'Resistive' },
  { value: 'motor', label: 'Motor' },
  { value: 'other', label: 'Other' },
]

const STANDARD_GEN_SIZES = [
  5, 7.5, 10, 15, 20, 25, 30, 50, 75, 100, 125, 150,
  200, 250, 300, 350, 400, 500, 750, 1000, 1500, 2000,
]

function getNextGenSize(kw: number): number {
  for (const size of STANDARD_GEN_SIZES) {
    if (size >= kw) return size
  }
  return STANDARD_GEN_SIZES[STANDARD_GEN_SIZES.length - 1]
}

interface LoadItem {
  id: number
  name: string
  watts: string
  type: string
  voltage: string
  pf: string
  qty: string
}

let nextId = 1

function createLoadItem(): LoadItem {
  return {
    id: nextId++,
    name: '',
    watts: '',
    type: 'resistive',
    voltage: '480',
    pf: '1.0',
    qty: '1',
  }
}

export default function GeneratorSizingPage() {
  const [mode, setMode] = useState('loadlist')
  const [loads, setLoads] = useState<LoadItem[]>([createLoadItem()])
  const [quickKw, setQuickKw] = useState('')

  // Load List helpers
  function updateLoad(id: number, field: keyof LoadItem, value: string) {
    setLoads(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  function addLoad() {
    setLoads(prev => [...prev, createLoadItem()])
  }

  function removeLoad(id: number) {
    if (loads.length <= 1) return
    setLoads(prev => prev.filter(l => l.id !== id))
  }

  // Calculate load list totals
  const parsedLoads = loads.map(l => {
    const w = parseFloat(l.watts)
    const pf = parseFloat(l.pf)
    const qty = parseInt(l.qty) || 1
    const isMotor = l.type === 'motor'
    const wattsValid = !isNaN(w) && w > 0
    const pfValid = !isNaN(pf) && pf > 0 && pf <= 1
    const runningW = wattsValid ? w * qty : 0
    // Motor starting watts = 3x running for LRA estimation
    const startingW = wattsValid && isMotor ? w * 3 * qty : runningW
    const kvaRun = wattsValid && pfValid ? runningW / (pf * 1000) : 0
    return { ...l, runningW, startingW, kvaRun, wattsValid, isMotor }
  })

  const totalRunningW = parsedLoads.reduce((sum, l) => sum + l.runningW, 0)
  const totalRunningKw = totalRunningW / 1000

  // Starting kW: largest motor starting + all other loads running
  const motorLoads = parsedLoads.filter(l => l.isMotor && l.wattsValid)
  const largestMotorStartingW = motorLoads.length > 0
    ? Math.max(...motorLoads.map(l => l.startingW))
    : 0
  const largestMotorRunningW = motorLoads.length > 0
    ? Math.max(...motorLoads.map(l => l.runningW))
    : 0

  // Total starting kW = all running loads + (largest motor starting - its running, since it's already counted)
  const totalStartingW = totalRunningW + (largestMotorStartingW - largestMotorRunningW)
  const totalStartingKw = totalStartingW / 1000

  // Use the higher of running vs starting for gen sizing
  const peakKw = Math.max(totalRunningKw, totalStartingKw)
  const hasLoadListInputs = totalRunningW > 0

  const avgPf = parsedLoads.reduce((sum, l) => sum + l.kvaRun, 0) > 0
    ? totalRunningKw / parsedLoads.reduce((sum, l) => sum + l.kvaRun, 0)
    : 0.8

  const recommendedKw = hasLoadListInputs ? peakKw : NaN
  const recommendedKva = hasLoadListInputs && avgPf > 0 ? recommendedKw / avgPf : NaN
  const nextGenSize = hasLoadListInputs ? getNextGenSize(recommendedKw) : NaN

  const loadListResults = hasLoadListInputs
    ? [
        { label: 'Total Running', value: fmt(totalRunningKw, 1), unit: 'kW' },
        { label: 'Peak Starting', value: fmt(totalStartingKw, 1), unit: 'kW' },
        { label: 'Recommended Size', value: fmt(recommendedKw, 1), unit: 'kW', highlight: true },
        { label: 'Recommended Size', value: fmt(recommendedKva, 1), unit: 'kVA' },
        { label: 'Next Standard Gen', value: `${nextGenSize}`, unit: 'kW' },
        { label: 'Average Power Factor', value: fmt(avgPf, 2) },
      ]
    : [
        { label: 'Total Running', value: '—', unit: 'kW' },
        { label: 'Peak Starting', value: '—', unit: 'kW' },
        { label: 'Recommended Size', value: '—', unit: 'kW' },
      ]

  // Quick calc
  const quickKwVal = parseFloat(quickKw)
  const hasQuickInputs = !isNaN(quickKwVal) && quickKwVal > 0
  const quickWithMargin = hasQuickInputs ? quickKwVal * 1.25 : NaN
  const quickGenSize = hasQuickInputs ? getNextGenSize(quickWithMargin) : NaN
  const quickKva = hasQuickInputs ? quickWithMargin / 0.8 : NaN

  const quickResults = hasQuickInputs
    ? [
        { label: 'Load', value: fmt(quickKwVal, 1), unit: 'kW' },
        { label: 'With 25% Margin', value: fmt(quickWithMargin, 1), unit: 'kW', highlight: true },
        { label: 'Recommended kVA (0.8 PF)', value: fmt(quickKva, 1), unit: 'kVA' },
        { label: 'Next Standard Gen', value: `${quickGenSize}`, unit: 'kW' },
      ]
    : [
        { label: 'Load', value: '—', unit: 'kW' },
        { label: 'With 25% Margin', value: '—', unit: 'kW' },
        { label: 'Next Standard Gen', value: '—', unit: 'kW' },
      ]

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    background: 'var(--input-bg)',
    border: '2px solid var(--input-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '0 10px',
    fontSize: 15,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text)',
  }

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23a0a0b0'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: 2,
  }

  return (
    <>
      <Header title="Generator Sizing" />
      <div style={{ padding: '0 16px 120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <SegmentedControl options={modeOptions} value={mode} onChange={setMode} />

          {mode === 'loadlist' && (
            <>
              {loads.map((load, idx) => (
                <div key={load.id} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--input-border)',
                  borderRadius: 'var(--radius)',
                  padding: 12,
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Load {idx + 1}
                    </span>
                    {loads.length > 1 && (
                      <button
                        onClick={() => removeLoad(load.id)}
                        style={{
                          width: 32, height: 32,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-secondary)',
                          border: 'none',
                          background: 'transparent',
                          fontSize: 18,
                          cursor: 'pointer',
                        }}
                        aria-label="Remove load"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Row 1: Name */}
                    <div>
                      <div style={labelStyle}>Name</div>
                      <input
                        type="text"
                        value={load.name}
                        onChange={e => updateLoad(load.id, 'name', e.target.value)}
                        placeholder="e.g. Pump Motor"
                        style={{ ...inputStyle, fontFamily: 'var(--font-sans)' }}
                      />
                    </div>

                    {/* Row 2: Watts and Type */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={labelStyle}>Watts</div>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={load.watts}
                          onChange={e => updateLoad(load.id, 'watts', e.target.value)}
                          placeholder="W"
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={labelStyle}>Type</div>
                        <select
                          value={load.type}
                          onChange={e => updateLoad(load.id, 'type', e.target.value)}
                          style={selectStyle}
                        >
                          {loadTypeOptions.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 3: PF and Qty */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={labelStyle}>Power Factor</div>
                        <select
                          value={load.pf}
                          onChange={e => updateLoad(load.id, 'pf', e.target.value)}
                          style={selectStyle}
                        >
                          <option value="0.5">0.5</option>
                          <option value="0.6">0.6</option>
                          <option value="0.7">0.7</option>
                          <option value="0.75">0.75</option>
                          <option value="0.8">0.8</option>
                          <option value="0.85">0.85</option>
                          <option value="0.9">0.9</option>
                          <option value="0.95">0.95</option>
                          <option value="1.0">1.0</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={labelStyle}>Quantity</div>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={load.qty}
                          onChange={e => updateLoad(load.id, 'qty', e.target.value)}
                          placeholder="1"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Per-load summary */}
                    {(() => {
                      const p = parsedLoads.find(pl => pl.id === load.id)
                      if (!p || !p.wattsValid) return null
                      return (
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          padding: '6px 0', borderTop: '1px solid var(--divider)',
                          marginTop: 4,
                        }}>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            Running: {fmt(p.runningW / 1000, 2)} kW
                          </span>
                          {p.isMotor && (
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                              Starting: {fmt(p.startingW / 1000, 2)} kW
                            </span>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              ))}

              <button
                onClick={addLoad}
                style={{
                  width: '100%',
                  minHeight: 'var(--touch-min)',
                  background: 'var(--input-bg)',
                  border: '2px dashed var(--input-border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--primary)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                + Add Load
              </button>

              <ResultDisplay results={loadListResults} />
            </>
          )}

          {mode === 'quick' && (
            <>
              <InputField
                label="Total Load"
                unit="kW"
                value={quickKw}
                onChange={setQuickKw}
                placeholder="Enter total kW needed"
              />

              <ResultDisplay results={quickResults} />
            </>
          )}

          {/* Standard Generator Sizes Reference */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--input-border)',
            borderRadius: 'var(--radius)',
            padding: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
              Standard Generator Sizes (kW)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STANDARD_GEN_SIZES.map(size => {
                const selectedSize = mode === 'loadlist' ? nextGenSize : quickGenSize
                const isSelected = !isNaN(selectedSize) && size === selectedSize
                return (
                  <span key={size} style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isSelected ? 700 : 400,
                    background: isSelected ? 'var(--primary)' : 'var(--input-bg)',
                    color: isSelected ? '#000' : 'var(--text-secondary)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--divider)',
                  }}>
                    {size}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Mining Emergency Power Note */}
          <div style={{
            background: 'var(--surface)',
            border: '2px solid var(--primary-dim)',
            borderRadius: 'var(--radius)',
            padding: 16,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="var(--primary)" style={{ flexShrink: 0 }}>
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                Mine Emergency Power — O.Reg.854
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Ontario Regulation 854 requires emergency backup power for critical mine systems:
            </div>
            <ul style={{
              margin: '8px 0 0 0',
              paddingLeft: 20,
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}>
              <li><strong style={{ color: 'var(--text)' }}>Ventilation</strong> — Main fans or auxiliary ventilation to maintain safe atmosphere</li>
              <li><strong style={{ color: 'var(--text)' }}>Pumps</strong> — Dewatering pumps to prevent flooding of workings</li>
              <li><strong style={{ color: 'var(--text)' }}>Hoists</strong> — Main shaft hoist for personnel evacuation</li>
              <li><strong style={{ color: 'var(--text)' }}>Communications</strong> — Mine telephone system and surface-to-underground radio</li>
              <li><strong style={{ color: 'var(--text)' }}>Lighting</strong> — Emergency lighting at shaft stations, refuge stations, and travel ways</li>
            </ul>
          </div>

          <InfoBox title="Generator Sizing Guidelines">
            Generator sizing must account for both continuous running loads and transient starting
            loads. Motor starting current (LRA) is typically 3\–6 times the full load current,
            causing a significant momentary power demand. The generator must be sized to handle
            the largest motor starting while all other loads are running. A minimum 25% safety
            margin above calculated load is recommended for future expansion and load growth.
            Power factor affects the kVA rating: a generator rated at 100 kW with 0.8 PF is
            rated at 125 kVA. For mining applications, ensure the emergency generator can carry
            all critical loads simultaneously and has automatic transfer capability per O.Reg.854.
          </InfoBox>
        </div>
      </div>
    </>
  )
}
