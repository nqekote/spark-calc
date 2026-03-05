import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category = 'length' | 'area' | 'temp' | 'wire' | 'weight' | 'torque'

interface ConversionPair {
  label: string
  unitA: string
  unitB: string
  toB: (v: number) => number
  toA: (v: number) => number
}

interface WireEntry {
  awg: string
  mm2: string
}

/* ------------------------------------------------------------------ */
/*  Category definitions                                               */
/* ------------------------------------------------------------------ */

const categories: { key: Category; label: string }[] = [
  { key: 'length', label: 'Length' },
  { key: 'area', label: 'Area' },
  { key: 'temp', label: 'Temp' },
  { key: 'wire', label: 'Wire Size' },
  { key: 'weight', label: 'Weight' },
  { key: 'torque', label: 'Torque' },
]

/* ------------------------------------------------------------------ */
/*  Conversion pairs per category                                      */
/* ------------------------------------------------------------------ */

const conversions: Record<Exclude<Category, 'wire'>, ConversionPair[]> = {
  length: [
    {
      label: 'mm ↔ in',
      unitA: 'mm',
      unitB: 'in',
      toB: v => v / 25.4,
      toA: v => v * 25.4,
    },
    {
      label: 'cm ↔ in',
      unitA: 'cm',
      unitB: 'in',
      toB: v => v / 2.54,
      toA: v => v * 2.54,
    },
    {
      label: 'm ↔ ft',
      unitA: 'm',
      unitB: 'ft',
      toB: v => v * 3.28084,
      toA: v => v / 3.28084,
    },
    {
      label: 'km ↔ mi',
      unitA: 'km',
      unitB: 'mi',
      toB: v => v / 1.60934,
      toA: v => v * 1.60934,
    },
  ],
  area: [
    {
      label: 'mm² ↔ in²',
      unitA: 'mm²',
      unitB: 'in²',
      toB: v => v / 645.16,
      toA: v => v * 645.16,
    },
    {
      label: 'cm² ↔ in²',
      unitA: 'cm²',
      unitB: 'in²',
      toB: v => v / 6.4516,
      toA: v => v * 6.4516,
    },
    {
      label: 'm² ↔ ft²',
      unitA: 'm²',
      unitB: 'ft²',
      toB: v => v * 10.7639,
      toA: v => v / 10.7639,
    },
  ],
  temp: [
    {
      label: '°C ↔ °F',
      unitA: '°C',
      unitB: '°F',
      toB: v => v * 9 / 5 + 32,
      toA: v => (v - 32) * 5 / 9,
    },
  ],
  weight: [
    {
      label: 'kg ↔ lbs',
      unitA: 'kg',
      unitB: 'lbs',
      toB: v => v * 2.20462,
      toA: v => v / 2.20462,
    },
    {
      label: 'N ↔ lbf',
      unitA: 'N',
      unitB: 'lbf',
      toB: v => v * 0.224809,
      toA: v => v / 0.224809,
    },
  ],
  torque: [
    {
      label: 'N·m ↔ lb·ft',
      unitA: 'N·m',
      unitB: 'lb·ft',
      toB: v => v * 0.737562,
      toA: v => v / 0.737562,
    },
    {
      label: 'N·m ↔ lb·in',
      unitA: 'N·m',
      unitB: 'lb·in',
      toB: v => v * 8.85075,
      toA: v => v / 8.85075,
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Wire size reference data (AWG / kcmil <-> mm^2)                    */
/* ------------------------------------------------------------------ */

const wireData: WireEntry[] = [
  { awg: '14 AWG', mm2: '2.08' },
  { awg: '12 AWG', mm2: '3.31' },
  { awg: '10 AWG', mm2: '5.26' },
  { awg: '8 AWG', mm2: '8.37' },
  { awg: '6 AWG', mm2: '13.3' },
  { awg: '4 AWG', mm2: '21.2' },
  { awg: '3 AWG', mm2: '26.7' },
  { awg: '2 AWG', mm2: '33.6' },
  { awg: '1 AWG', mm2: '42.4' },
  { awg: '1/0', mm2: '53.5' },
  { awg: '2/0', mm2: '67.4' },
  { awg: '3/0', mm2: '85.0' },
  { awg: '4/0', mm2: '107' },
  { awg: '250 kcmil', mm2: '127' },
  { awg: '300 kcmil', mm2: '152' },
  { awg: '350 kcmil', mm2: '177' },
  { awg: '400 kcmil', mm2: '203' },
  { awg: '500 kcmil', mm2: '253' },
  { awg: '600 kcmil', mm2: '304' },
  { awg: '750 kcmil', mm2: '380' },
  { awg: '1000 kcmil', mm2: '507' },
]

/* ------------------------------------------------------------------ */
/*  Quick-reference chips                                              */
/* ------------------------------------------------------------------ */

interface QuickRef {
  label: string
  cat: Category
  pairIdx: number
  value: string
  side: 'A' | 'B'
}

const quickRefs: QuickRef[] = [
  { label: '1 in → mm', cat: 'length', pairIdx: 0, value: '1', side: 'B' },
  { label: '1 ft → m', cat: 'length', pairIdx: 2, value: '1', side: 'B' },
  { label: '100°C → °F', cat: 'temp', pairIdx: 0, value: '100', side: 'A' },
  { label: '1 m² → ft²', cat: 'area', pairIdx: 2, value: '1', side: 'A' },
  { label: '10 kg → lbs', cat: 'weight', pairIdx: 0, value: '10', side: 'A' },
  { label: '1 N·m → lb·in', cat: 'torque', pairIdx: 1, value: '1', side: 'A' },
]

/* ------------------------------------------------------------------ */
/*  Formatting helper                                                  */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs === 0) return '0'
  if (abs >= 1000) return n.toFixed(1)
  if (abs >= 100) return n.toFixed(2)
  if (abs >= 10) return n.toFixed(3)
  if (abs >= 1) return n.toFixed(4)
  return n.toPrecision(4)
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
}

const pillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 'var(--touch-min)',
  padding: '0 18px',
  borderRadius: 28,
  fontSize: 14,
  fontWeight: 600,
  border: '2px solid var(--divider)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all .15s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
}

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: 'var(--primary)',
  color: '#000',
  border: '2px solid var(--primary)',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--divider)',
  padding: 16,
}

const subPillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 44,
  padding: '0 14px',
  borderRadius: 22,
  fontSize: 13,
  fontWeight: 500,
  border: '1px solid var(--divider)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all .15s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
}

const subPillActive: React.CSSProperties = {
  ...subPillBase,
  background: 'var(--primary-dim)',
  color: '#000',
  border: '1px solid var(--primary-dim)',
  fontWeight: 600,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 'var(--touch-min)',
  background: 'var(--input-bg)',
  border: '2px solid var(--input-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '0 16px',
  fontSize: 18,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text)',
  transition: 'border-color .15s',
}

const unitLabelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--primary)',
  textAlign: 'center',
  marginBottom: 4,
}

const arrowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 22,
  color: 'var(--text-secondary)',
  minWidth: 32,
  paddingTop: 20,
}

const tableContainerStyle: React.CSSProperties = {
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--divider)',
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: 0.3,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  background: 'var(--surface)',
  borderBottom: '2px solid var(--divider)',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: 14,
  color: 'var(--text)',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--divider)',
}

const chipBase: React.CSSProperties = {
  flexShrink: 0,
  height: 40,
  padding: '0 14px',
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 500,
  border: '1px solid var(--divider)',
  background: 'var(--surface)',
  color: 'var(--text)',
  cursor: 'pointer',
  transition: 'all .15s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
}

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 8,
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length')
  const [pairIdx, setPairIdx] = useState(0)
  const [valueA, setValueA] = useState('')
  const [valueB, setValueB] = useState('')
  const [lastEdited, setLastEdited] = useState<'A' | 'B'>('A')
  const [wireSearch, setWireSearch] = useState('')

  /* ---- helpers ---- */

  const isWire = category === 'wire'
  const pairs = isWire ? [] : conversions[category]
  const currentPair = isWire ? null : pairs[pairIdx]

  function switchCategory(cat: Category) {
    setCategory(cat)
    setPairIdx(0)
    setValueA('')
    setValueB('')
    setLastEdited('A')
    setWireSearch('')
  }

  function switchPair(idx: number) {
    setPairIdx(idx)
    setValueA('')
    setValueB('')
    setLastEdited('A')
  }

  function handleChangeA(raw: string) {
    setValueA(raw)
    setLastEdited('A')
    if (!currentPair) return
    const num = parseFloat(raw)
    if (raw === '' || raw === '-' || raw === '.') {
      setValueB('')
      return
    }
    if (!isNaN(num)) {
      setValueB(fmt(currentPair.toB(num)))
    }
  }

  function handleChangeB(raw: string) {
    setValueB(raw)
    setLastEdited('B')
    if (!currentPair) return
    const num = parseFloat(raw)
    if (raw === '' || raw === '-' || raw === '.') {
      setValueA('')
      return
    }
    if (!isNaN(num)) {
      setValueA(fmt(currentPair.toA(num)))
    }
  }

  function handleQuickRef(qr: QuickRef) {
    setCategory(qr.cat)
    setPairIdx(qr.pairIdx)
    setWireSearch('')
    const pair = conversions[qr.cat as Exclude<Category, 'wire'>][qr.pairIdx]
    if (qr.side === 'A') {
      setValueA(qr.value)
      setLastEdited('A')
      setValueB(fmt(pair.toB(parseFloat(qr.value))))
    } else {
      setValueB(qr.value)
      setLastEdited('B')
      setValueA(fmt(pair.toA(parseFloat(qr.value))))
    }
  }

  /* ---- filtered wire data ---- */

  const filteredWire = wireSearch.trim()
    ? wireData.filter(w =>
        w.awg.toLowerCase().includes(wireSearch.trim().toLowerCase()) ||
        w.mm2.includes(wireSearch.trim())
      )
    : wireData

  /* ---- render ---- */

  return (
    <>
      <Header title="Unit Converter" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Category pills */}
        <div style={pillRow}>
          {categories.map(cat => (
            <button
              key={cat.key}
              style={category === cat.key ? pillActive : pillBase}
              onClick={() => switchCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Converter content */}
        {isWire ? (
          /* ---------- Wire Size Reference Table ---------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>AWG / kcmil {'↔'} mm{'²'}</div>

            {/* Search */}
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
                value={wireSearch}
                onChange={e => setWireSearch(e.target.value)}
                placeholder="Search wire size…"
                style={{
                  width: '100%',
                  height: 'var(--touch-min)',
                  background: 'var(--input-bg)',
                  border: '2px solid var(--input-border)',
                  borderRadius: 'var(--radius)',
                  padding: '0 16px 0 44px',
                  fontSize: 16,
                  color: 'var(--text)',
                }}
              />
            </div>

            {/* Table */}
            <div style={tableContainerStyle}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>AWG / kcmil</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>mm{'²'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWire.map((w, i) => (
                    <tr
                      key={w.awg}
                      style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}
                    >
                      <td style={{ ...tdStyle, fontWeight: 500 }}>{w.awg}</td>
                      <td style={{
                        ...tdStyle,
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        color: 'var(--primary)',
                      }}>
                        {w.mm2}
                      </td>
                    </tr>
                  ))}
                  {filteredWire.length === 0 && (
                    <tr>
                      <td colSpan={2} style={{
                        ...tdStyle,
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        padding: '24px 16px',
                      }}>
                        No matching wire sizes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Note */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--divider)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 14px',
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}>
              <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>
                Note
              </div>
              AWG wire sizing is not a linear scale. These are the standard cross-sectional areas
              for common electrical wire sizes per CEC. Values are approximate.
            </div>
          </div>
        ) : (
          /* ---------- Standard Converter ---------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Sub-pair pills (only if more than one pair) */}
            {pairs.length > 1 && (
              <div style={pillRow}>
                {pairs.map((p, idx) => (
                  <button
                    key={p.label}
                    style={pairIdx === idx ? subPillActive : subPillBase}
                    onClick={() => switchPair(idx)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Converter card */}
            {currentPair && (
              <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>

                  {/* Side A */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={unitLabelStyle}>{currentPair.unitA}</div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={valueA}
                      onChange={e => handleChangeA(e.target.value)}
                      placeholder="0"
                      style={{
                        ...inputStyle,
                        borderColor: lastEdited === 'A' && valueA ? 'var(--input-focus)' : 'var(--input-border)',
                      }}
                    />
                  </div>

                  {/* Arrow */}
                  <div style={arrowStyle}>{'↔'}</div>

                  {/* Side B */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={unitLabelStyle}>{currentPair.unitB}</div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={valueB}
                      onChange={e => handleChangeB(e.target.value)}
                      placeholder="0"
                      style={{
                        ...inputStyle,
                        borderColor: lastEdited === 'B' && valueB ? 'var(--input-focus)' : 'var(--input-border)',
                      }}
                    />
                  </div>
                </div>

                {/* Formula hint */}
                {valueA && valueB && (
                  <div style={{
                    marginTop: 12,
                    padding: '10px 12px',
                    background: 'var(--input-bg)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                  }}>
                    {lastEdited === 'A'
                      ? `${valueA} ${currentPair.unitA} = ${valueB} ${currentPair.unitB}`
                      : `${valueB} ${currentPair.unitB} = ${valueA} ${currentPair.unitA}`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick-reference chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionTitle}>Quick Conversions</div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            {quickRefs.map(qr => (
              <button
                key={qr.label}
                style={chipBase}
                onClick={() => handleQuickRef(qr)}
              >
                {qr.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
