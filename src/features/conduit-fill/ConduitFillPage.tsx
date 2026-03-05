import { useState } from 'react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'
import { useSessionStorage } from '../../core/hooks/useSessionStorage'

/* ---------- Data tables ---------- */

type ConduitType = 'EMT' | 'Rigid' | 'PVC40' | 'PVC80'

const conduitTypeOptions = [
  { value: 'EMT', label: 'EMT' },
  { value: 'Rigid', label: 'Rigid' },
  { value: 'PVC40', label: 'PVC Schedule 40' },
  { value: 'PVC80', label: 'PVC Schedule 80' },
]

const tradeSizeOptions = [
  { value: '1/2', label: '1/2"' },
  { value: '3/4', label: '3/4"' },
  { value: '1', label: '1"' },
  { value: '1-1/4', label: '1-1/4"' },
  { value: '1-1/2', label: '1-1/2"' },
  { value: '2', label: '2"' },
  { value: '2-1/2', label: '2-1/2"' },
  { value: '3', label: '3"' },
  { value: '3-1/2', label: '3-1/2"' },
  { value: '4', label: '4"' },
]

const conduitAreas: Record<ConduitType, Record<string, number>> = {
  EMT: {
    '1/2': 146, '3/4': 252, '1': 397, '1-1/4': 573, '1-1/2': 794,
    '2': 1314, '2-1/2': 1858, '3': 2850, '3-1/2': 3525, '4': 4560,
  },
  Rigid: {
    '1/2': 132, '3/4': 227, '1': 366, '1-1/4': 541, '1-1/2': 756,
    '2': 1256, '2-1/2': 1803, '3': 2763, '3-1/2': 3408, '4': 4391,
  },
  PVC40: {
    '1/2': 168, '3/4': 277, '1': 438, '1-1/4': 619, '1-1/2': 855,
    '2': 1405, '2-1/2': 1965, '3': 3029, '3-1/2': 3764, '4': 4869,
  },
  PVC80: {
    '1/2': 122, '3/4': 211, '1': 343, '1-1/4': 494, '1-1/2': 692,
    '2': 1151, '2-1/2': 1649, '3': 2573, '3-1/2': 3213, '4': 4168,
  },
}

const wireSizeOptions = [
  { value: '14', label: '14 AWG' },
  { value: '12', label: '12 AWG' },
  { value: '10', label: '10 AWG' },
  { value: '8', label: '8 AWG' },
  { value: '6', label: '6 AWG' },
  { value: '4', label: '4 AWG' },
  { value: '3', label: '3 AWG' },
  { value: '2', label: '2 AWG' },
  { value: '1', label: '1 AWG' },
  { value: '1/0', label: '1/0 AWG' },
  { value: '2/0', label: '2/0 AWG' },
  { value: '3/0', label: '3/0 AWG' },
  { value: '4/0', label: '4/0 AWG' },
  { value: '250', label: '250 kcmil' },
  { value: '300', label: '300 kcmil' },
  { value: '350', label: '350 kcmil' },
  { value: '400', label: '400 kcmil' },
  { value: '500', label: '500 kcmil' },
]

const wireAreas: Record<string, number> = {
  '14': 8.97, '12': 11.68, '10': 16.97, '8': 28.19,
  '6': 42.0, '4': 58.07, '3': 67.43, '2': 76.70,
  '1': 98.97, '1/0': 117.0, '2/0': 134.7, '3/0': 158.1,
  '4/0': 185.0, '250': 233.0, '300': 268.0, '350': 307.0,
  '400': 346.0, '500': 420.0,
}

interface WireEntry {
  id: number
  wireSize: string
  quantity: string
}

function getFillPercent(totalConductors: number): number {
  if (totalConductors <= 0) return 0
  if (totalConductors === 1) return 0.53
  if (totalConductors === 2) return 0.31
  return 0.40
}

function getFillRuleLabel(totalConductors: number): string {
  if (totalConductors <= 0) return '—'
  if (totalConductors === 1) return '53% (1 conductor)'
  if (totalConductors === 2) return '31% (2 conductors)'
  return '40% (3+ conductors)'
}

/* ---------- Main page ---------- */

export default function ConduitFillPage() {
  const [conduitType, setConduitType] = useSessionStorage<string>('cfill-type', 'EMT')
  const [tradeSize, setTradeSize] = useSessionStorage('cfill-size', '1/2')
  const [wireEntries, setWireEntries] = useState<WireEntry[]>([
    { id: 1, wireSize: '14', quantity: '' },
  ])
  const [nextId, setNextId] = useState(2)

  const updateEntry = (id: number, field: 'wireSize' | 'quantity', value: string) => {
    setWireEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const addEntry = () => {
    setWireEntries(prev => [...prev, { id: nextId, wireSize: '14', quantity: '' }])
    setNextId(n => n + 1)
  }

  const removeEntry = (id: number) => {
    if (wireEntries.length <= 1) return
    setWireEntries(prev => prev.filter(e => e.id !== id))
  }

  // Calculate totals
  const conduitArea = conduitAreas[conduitType as ConduitType]?.[tradeSize] ?? 0

  let totalWireArea = 0
  let totalConductors = 0
  let allValid = true

  for (const entry of wireEntries) {
    const qty = parseFloat(entry.quantity)
    if (entry.quantity === '' || isNaN(qty) || qty <= 0) {
      if (entry.quantity !== '') allValid = false
      continue
    }
    const area = wireAreas[entry.wireSize]
    if (!area) { allValid = false; continue }
    totalWireArea += area * qty
    totalConductors += qty
  }

  const fillPercent = getFillPercent(totalConductors)
  const allowableArea = conduitArea * fillPercent
  const fillUsed = conduitArea > 0 && totalWireArea > 0 ? (totalWireArea / conduitArea) * 100 : 0
  const pass = totalWireArea > 0 && totalWireArea <= allowableArea

  // Max wires of first entry type that fit
  const firstWireArea = wireAreas[wireEntries[0]?.wireSize] ?? 0
  const maxWires = firstWireArea > 0 && conduitArea > 0
    ? Math.floor((conduitArea * 0.40) / firstWireArea)
    : 0

  const hasResults = totalConductors > 0 && allValid

  return (
    <>
      <Header title="Conduit Fill" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Conduit selection */}
        <SelectField
          label="Conduit Type"
          value={conduitType}
          onChange={setConduitType}
          options={conduitTypeOptions}
        />
        <SelectField
          label="Trade Size"
          value={tradeSize}
          onChange={setTradeSize}
          options={tradeSizeOptions}
        />

        {/* Conduit area info */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: 13,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}>
          Internal area: {fmt(conduitArea, 0)} mm²
        </div>

        {/* Wire entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
            Conductors
          </label>
          {wireEntries.map((entry, idx) => (
            <div key={entry.id} style={{
              display: 'flex', gap: 8, alignItems: 'flex-end',
            }}>
              <div style={{ flex: 2 }}>
                <SelectField
                  label={idx === 0 ? 'Wire Size' : ''}
                  value={entry.wireSize}
                  onChange={v => updateEntry(entry.id, 'wireSize', v)}
                  options={wireSizeOptions}
                />
              </div>
              <div style={{ flex: 1 }}>
                <InputField
                  label={idx === 0 ? 'Qty' : ''}
                  unit=""
                  value={entry.quantity}
                  onChange={v => updateEntry(entry.id, 'quantity', v)}
                  placeholder="#"
                />
              </div>
              {wireEntries.length > 1 && (
                <button
                  onClick={() => removeEntry(entry.id)}
                  style={{
                    minWidth: 56, minHeight: 56,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--input-bg)',
                    border: '2px solid var(--input-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--error)',
                    fontSize: 22, fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  aria-label="Remove wire entry"
                >
                  −
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addEntry}
            style={{
              minHeight: 56,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--input-bg)',
              border: '2px solid var(--input-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--primary)',
              fontSize: 15, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 20 }}>+</span> Add Wire Size
          </button>
        </div>

        {/* Results */}
        <ResultDisplay
          title="Conduit Fill"
          results={[
            {
              label: 'Fill Status',
              value: hasResults ? (pass ? 'PASS' : 'FAIL') : '—',
              highlight: true,
            },
            {
              label: 'Total Wire Area',
              value: hasResults ? fmt(totalWireArea, 1) : '—',
              unit: 'mm²',
            },
            {
              label: 'Allowable Fill Area',
              value: hasResults ? fmt(allowableArea, 1) : '—',
              unit: 'mm²',
            },
            {
              label: 'Fill Percentage',
              value: hasResults ? fmt(fillUsed, 1) : '—',
              unit: '%',
            },
            {
              label: 'Fill Rule',
              value: hasResults ? getFillRuleLabel(totalConductors) : '—',
            },
            {
              label: `Max ${wireSizeOptions.find(w => w.value === wireEntries[0]?.wireSize)?.label ?? ''} wires (40% fill)`,
              value: maxWires > 0 ? String(maxWires) : '—',
            },
          ]}
          formula={hasResults
            ? `${fmt(totalWireArea, 1)} mm² / ${fmt(conduitArea, 0)} mm² = ${fmt(fillUsed, 1)}%`
            : undefined
          }
        />

        {/* Pass / Fail visual indicator */}
        {hasResults && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: pass ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            border: `2px solid ${pass ? 'var(--success)' : 'var(--error)'}`,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: pass ? 'var(--success)' : 'var(--error)',
          }}>
            {pass
              ? `Conduit fill is within the ${fmt(fillPercent * 100, 0)}% limit`
              : `Exceeds ${fmt(fillPercent * 100, 0)}% fill limit — use a larger conduit`
            }
          </div>
        )}

        <InfoBox title="CEC Conduit Fill Rules">
          <p><strong>1 conductor:</strong> Maximum 53% fill of the conduit's internal area.</p>
          <p style={{ marginTop: 6 }}><strong>2 conductors:</strong> Maximum 31% fill.</p>
          <p style={{ marginTop: 6 }}><strong>3 or more conductors:</strong> Maximum 40% fill.</p>
          <p style={{ marginTop: 10 }}>These rules ensure adequate space for pulling conductors through the conduit without damaging insulation. Wire areas shown are for T90/RW90 insulation type. Always verify with the applicable CEC tables for your specific installation.</p>
        </InfoBox>
      </div>
    </>
  )
}
