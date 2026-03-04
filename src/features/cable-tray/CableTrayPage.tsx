import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Cable Tray Sizing - CEC Rule 12-2200                              */
/* ------------------------------------------------------------------ */

type TrayType = 'ladder' | 'ventilated' | 'solid'
type CableType = 'single' | 'multi'
type CalcMode = 'calculator' | 'reference'

interface CableEntry {
  id: number
  size: string
  diameter: number // mm
  quantity: number
}

interface TraySize {
  width: number  // mm
  depth: number  // mm
  usableArea: number // mm²
}

const traySizes: TraySize[] = [
  { width: 150, depth: 75, usableArea: 11250 },
  { width: 150, depth: 100, usableArea: 15000 },
  { width: 225, depth: 75, usableArea: 16875 },
  { width: 225, depth: 100, usableArea: 22500 },
  { width: 300, depth: 75, usableArea: 22500 },
  { width: 300, depth: 100, usableArea: 30000 },
  { width: 450, depth: 75, usableArea: 33750 },
  { width: 450, depth: 100, usableArea: 45000 },
  { width: 600, depth: 75, usableArea: 45000 },
  { width: 600, depth: 100, usableArea: 60000 },
  { width: 750, depth: 100, usableArea: 75000 },
  { width: 900, depth: 100, usableArea: 90000 },
]

// Common cable outer diameters (mm) for mining / industrial
const commonCables: { size: string; diameter: number }[] = [
  { size: '14/2 NMD90', diameter: 10.5 },
  { size: '12/2 NMD90', diameter: 11.1 },
  { size: '10/3 NMD90', diameter: 13.5 },
  { size: '#14 TECK90', diameter: 12.7 },
  { size: '#12 TECK90', diameter: 13.2 },
  { size: '#10 TECK90', diameter: 14.5 },
  { size: '#8 TECK90', diameter: 17.0 },
  { size: '#6 TECK90', diameter: 19.5 },
  { size: '#4 TECK90', diameter: 21.0 },
  { size: '#2 TECK90', diameter: 24.0 },
  { size: '#1/0 TECK90', diameter: 28.5 },
  { size: '#2/0 TECK90', diameter: 30.0 },
  { size: '#3/0 TECK90', diameter: 32.0 },
  { size: '#4/0 TECK90', diameter: 34.5 },
  { size: '250 TECK90', diameter: 38.0 },
  { size: '350 TECK90', diameter: 42.5 },
  { size: '500 TECK90', diameter: 49.0 },
  { size: '#12 AC90', diameter: 12.0 },
  { size: '#10 AC90', diameter: 13.5 },
  { size: '#8 AC90', diameter: 16.0 },
  { size: '#6 AC90', diameter: 18.5 },
  { size: '3/C #10 SHD-GC', diameter: 25.0 },
  { size: '3/C #8 SHD-GC', diameter: 28.0 },
  { size: '3/C #6 SHD-GC', diameter: 32.0 },
  { size: '3/C #4 SHD-GC', diameter: 35.0 },
  { size: '3/C #2 SHD-GC', diameter: 40.0 },
  { size: '3/C #1/0 SHD-GC', diameter: 48.0 },
]

const fillFactor: Record<TrayType, Record<CableType, number>> = {
  ladder: { single: 1.0, multi: 0.40 },
  ventilated: { single: 1.0, multi: 0.40 },
  solid: { single: 1.0, multi: 0.40 },
}

let nextId = 1

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CableTrayPage() {
  const [mode, setMode] = useState<CalcMode>('calculator')
  const [trayType, setTrayType] = useState<TrayType>('ladder')
  const [cableType, setCableType] = useState<CableType>('multi')
  const [cables, setCables] = useState<CableEntry[]>([])
  const [selectedCable, setSelectedCable] = useState(commonCables[4].size)
  const [customDiameter, setCustomDiameter] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [useCustom, setUseCustom] = useState(false)

  const factor = fillFactor[trayType][cableType]

  // Calculate total cable area
  const totalCableArea = cables.reduce((sum, c) => {
    const area = Math.PI * (c.diameter / 2) ** 2
    return sum + area * c.quantity
  }, 0)

  // Find minimum tray size
  const requiredArea = totalCableArea / factor
  const recommendedTray = traySizes.find(t => t.usableArea >= requiredArea) || null

  function addCable() {
    const diam = useCustom
      ? parseFloat(customDiameter)
      : commonCables.find(c => c.size === selectedCable)?.diameter || 0
    const qty = parseInt(quantity) || 1
    if (diam <= 0 || qty <= 0) return

    const size = useCustom ? `Custom ${customDiameter}mm` : selectedCable
    setCables(prev => [...prev, { id: nextId++, size, diameter: diam, quantity: qty }])
    setQuantity('1')
  }

  function removeCable(id: number) {
    setCables(prev => prev.filter(c => c.id !== id))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    minHeight: 56, padding: '0 16px',
    background: 'var(--input-bg)', border: '2px solid var(--input-border)',
    borderRadius: 'var(--radius-sm)', fontSize: 16, color: 'var(--text)',
  }

  const selectStyle: React.CSSProperties = {
    ...inputStyle, appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: 40,
  }

  return (
    <>
      <Header title="Cable Tray Sizing" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['calculator', 'reference'] as CalcMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, minHeight: 48, borderRadius: 24, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', border: '2px solid ' + (mode === m ? 'var(--primary)' : 'var(--divider)'),
              background: mode === m ? 'var(--primary)' : 'transparent',
              color: mode === m ? '#000' : 'var(--text-secondary)',
            }}>
              {m === 'calculator' ? 'Calculator' : 'Reference'}
            </button>
          ))}
        </div>

        {mode === 'calculator' ? (
          <>
            {/* Tray type */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                Tray Type
              </label>
              <select value={trayType} onChange={e => setTrayType(e.target.value as TrayType)} style={selectStyle}>
                <option value="ladder">Ladder Tray</option>
                <option value="ventilated">Ventilated Trough</option>
                <option value="solid">Solid Bottom</option>
              </select>
            </div>

            {/* Cable type */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                Cable Configuration
              </label>
              <select value={cableType} onChange={e => setCableType(e.target.value as CableType)} style={selectStyle}>
                <option value="multi">Multiconductor Cables</option>
                <option value="single">Single Conductors (maintained spacing)</option>
              </select>
            </div>

            {/* Add cable section */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--divider)',
              borderRadius: 'var(--radius)', padding: 14,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 10 }}>
                Add Cables
              </div>

              {/* Toggle custom/preset */}
              <button onClick={() => setUseCustom(!useCustom)} style={{
                fontSize: 13, color: 'var(--primary)', background: 'none',
                border: 'none', cursor: 'pointer', textDecoration: 'underline',
                marginBottom: 10, padding: 0,
              }}>
                {useCustom ? 'Use preset cable sizes' : 'Enter custom diameter'}
              </button>

              {useCustom ? (
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                    Cable OD (mm)
                  </label>
                  <input
                    type="text" inputMode="decimal"
                    value={customDiameter}
                    onChange={e => setCustomDiameter(e.target.value)}
                    placeholder="e.g., 25.4"
                    style={inputStyle}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                    Cable Size
                  </label>
                  <select value={selectedCable} onChange={e => setSelectedCable(e.target.value)} style={selectStyle}>
                    {commonCables.map(c => (
                      <option key={c.size} value={c.size}>
                        {c.size} ({c.diameter}mm OD)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                  Quantity
                </label>
                <input
                  type="text" inputMode="numeric"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button onClick={addCable} style={{
                width: '100%', minHeight: 56, borderRadius: 'var(--radius-sm)',
                background: 'var(--primary)', color: '#000', fontSize: 16,
                fontWeight: 700, border: 'none', cursor: 'pointer',
              }}>
                + Add Cable
              </button>
            </div>

            {/* Cable list */}
            {cables.length > 0 && (
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--divider)',
                borderRadius: 'var(--radius)', overflow: 'hidden',
              }}>
                <div style={{
                  padding: '10px 14px', fontSize: 13, fontWeight: 700,
                  color: 'var(--text-secondary)', borderBottom: '1px solid var(--divider)',
                }}>
                  Cables ({cables.reduce((s, c) => s + c.quantity, 0)} total)
                </div>
                {cables.map(c => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderBottom: '1px solid var(--divider)',
                    minHeight: 48,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{c.size}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {c.diameter}mm OD × {c.quantity}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                      {(Math.PI * (c.diameter / 2) ** 2 * c.quantity).toFixed(0)} mm²
                    </div>
                    <button onClick={() => removeCable(c.id)} style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)',
                      color: '#ff3c3c', fontSize: 18, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {'\×'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Result */}
            {cables.length > 0 && (
              <div style={{
                background: 'var(--surface)',
                border: `2px solid ${recommendedTray ? 'var(--primary)' : '#ff3c3c'}`,
                borderRadius: 'var(--radius)', padding: 16,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Result
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Total Cable Area</span>
                    <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>
                      {totalCableArea.toFixed(0)} mm²
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Fill Factor ({cableType})</span>
                    <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>
                      {(factor * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Required Tray Area</span>
                    <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>
                      {requiredArea.toFixed(0)} mm²
                    </span>
                  </div>
                  <div style={{ height: 1, background: 'var(--divider)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                      Minimum Tray Size
                    </span>
                    <span style={{
                      fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: recommendedTray ? 'var(--primary)' : '#ff3c3c',
                    }}>
                      {recommendedTray
                        ? `${recommendedTray.width} × ${recommendedTray.depth} mm`
                        : 'Exceeds max size'}
                    </span>
                  </div>
                  {recommendedTray && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>
                      ({((totalCableArea / (recommendedTray.usableArea * factor)) * 100).toFixed(1)}% fill)
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Reference mode */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--primary)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              Standard Cable Tray Sizes
            </div>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--divider)',
              borderRadius: 'var(--radius)', overflow: 'hidden',
            }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                padding: '10px 14px', fontSize: 12, fontWeight: 700,
                color: 'var(--text-secondary)', borderBottom: '2px solid var(--divider)',
                background: 'var(--input-bg)',
              }}>
                <span>Width</span>
                <span style={{ textAlign: 'center' }}>Depth</span>
                <span style={{ textAlign: 'right' }}>Area (mm²)</span>
              </div>
              {traySizes.map((ts, i) => (
                <div key={`${ts.width}-${ts.depth}`} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  padding: '10px 14px', fontSize: 14,
                  borderBottom: i < traySizes.length - 1 ? '1px solid var(--divider)' : undefined,
                  minHeight: 44, alignItems: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                    {ts.width} mm
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)', textAlign: 'center' }}>
                    {ts.depth} mm
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', textAlign: 'right', fontWeight: 600 }}>
                    {ts.usableArea.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--primary)',
              textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8,
            }}>
              CEC Cable Tray Fill Rules
            </div>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--divider)',
              borderRadius: 'var(--radius)', padding: 14,
              display: 'flex', flexDirection: 'column', gap: 10,
              fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)',
            }}>
              <div><strong style={{ color: 'var(--text)' }}>Multiconductor cables:</strong> Maximum 40% fill of tray cross-section (CEC Rule 12-2202)</div>
              <div><strong style={{ color: 'var(--text)' }}>Single conductors (maintained spacing):</strong> Single layer, no stacking. 100% of width permitted.</div>
              <div><strong style={{ color: 'var(--text)' }}>Mining / Industrial note:</strong> TECK90 cable is the standard for mining cable trays in Ontario. SHD-GC cables used for mobile equipment connections.</div>
              <div><strong style={{ color: 'var(--text)' }}>Derating:</strong> When cables are stacked or bundled in tray, apply CEC Table 5C ampacity correction factors.</div>
            </div>
          </div>
        )}

        {/* Info */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)', padding: '12px 14px',
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>Reference:</strong> CEC Rule 12-2200 series.
          Cable tray fill calculations based on cable outer diameter. Always verify cable OD
          with manufacturer data sheets for exact sizing.
        </div>
      </div>
    </>
  )
}
