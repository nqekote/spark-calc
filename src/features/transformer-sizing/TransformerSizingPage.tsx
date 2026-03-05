import { useState } from 'react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

const phaseOptions = [
  { value: 'single', label: 'Single Phase' },
  { value: 'three', label: 'Three Phase' },
]

const inputModeOptions = [
  { value: 'watts', label: 'Watts' },
  { value: 'amps', label: 'Amps' },
]

const voltageOptions = [
  { value: '120', label: '120V' },
  { value: '208', label: '208V' },
  { value: '240', label: '240V' },
  { value: '347', label: '347V' },
  { value: '480', label: '480V' },
  { value: '600', label: '600V' },
]

const demandFactorOptions = [
  { value: '0.5', label: '0.5 (50%)' },
  { value: '0.6', label: '0.6 (60%)' },
  { value: '0.7', label: '0.7 (70%)' },
  { value: '0.8', label: '0.8 (80%)' },
  { value: '0.9', label: '0.9 (90%)' },
  { value: '1.0', label: '1.0 (100%)' },
]

const STANDARD_XFMR_SIZES = [
  15, 25, 37.5, 45, 75, 100, 112.5, 150, 167, 200, 225, 300,
  500, 750, 1000, 1500, 2000, 2500, 3000,
]

function getNextStandardSize(kva: number): number {
  for (const size of STANDARD_XFMR_SIZES) {
    if (size >= kva) return size
  }
  return STANDARD_XFMR_SIZES[STANDARD_XFMR_SIZES.length - 1]
}

export default function TransformerSizingPage() {
  const [phase, setPhase] = useState('three')
  const [inputMode, setInputMode] = useState('watts')
  const [load, setLoad] = useState('')
  const [voltage, setVoltage] = useState('480')
  const [demandFactor, setDemandFactor] = useState('1.0')

  const loadVal = parseFloat(load)
  const V = parseFloat(voltage)
  const df = parseFloat(demandFactor)
  const hasInputs = !isNaN(loadVal) && loadVal > 0 && !isNaN(V)

  let calculatedKva = NaN
  let currentAmps = NaN
  let formula = ''

  if (hasInputs) {
    const demandLoad = loadVal * df

    if (inputMode === 'watts') {
      // Load is in watts, convert to kVA
      if (phase === 'three') {
        calculatedKva = demandLoad / 1000
        currentAmps = (demandLoad) / (V * Math.sqrt(3))
        formula = `kVA = ${fmt(demandLoad, 0)} W / 1000 = ${fmt(calculatedKva, 2)} kVA`
      } else {
        calculatedKva = demandLoad / 1000
        currentAmps = demandLoad / V
        formula = `kVA = ${fmt(demandLoad, 0)} W / 1000 = ${fmt(calculatedKva, 2)} kVA`
      }
    } else {
      // Load is in amps
      if (phase === 'three') {
        calculatedKva = (V * demandLoad * Math.sqrt(3)) / 1000
        currentAmps = demandLoad
        formula = `kVA = (${V}V × ${fmt(demandLoad, 1)}A × \√3) / 1000 = ${fmt(calculatedKva, 2)} kVA`
      } else {
        calculatedKva = (V * demandLoad) / 1000
        currentAmps = demandLoad
        formula = `kVA = (${V}V × ${fmt(demandLoad, 1)}A) / 1000 = ${fmt(calculatedKva, 2)} kVA`
      }
    }
  }

  const nextStd = hasInputs ? getNextStandardSize(calculatedKva) : NaN
  const loadingPct = hasInputs && nextStd > 0 ? (calculatedKva / nextStd) * 100 : NaN

  const getLoadingStatus = (pct: number): string => {
    if (pct <= 65) return 'Light load'
    if (pct <= 80) return 'Good loading'
    if (pct <= 100) return 'Full load'
    return 'Overloaded'
  }

  const results = hasInputs
    ? [
        { label: 'Required kVA', value: fmt(calculatedKva, 2), unit: 'kVA', highlight: true },
        { label: 'Load Current', value: fmt(currentAmps, 1), unit: 'A' },
        { label: 'Next Standard Size', value: fmt(nextStd, 1), unit: 'kVA' },
        { label: 'Loading', value: `${fmt(loadingPct, 1)}% — ${getLoadingStatus(loadingPct)}` },
      ]
    : [
        { label: 'Required kVA', value: '—', unit: 'kVA' },
        { label: 'Load Current', value: '—', unit: 'A' },
        { label: 'Next Standard Size', value: '—', unit: 'kVA' },
        { label: 'Loading', value: '—' },
      ]

  return (
    <>
      <Header title="Transformer Sizing" />
      <div style={{ padding: '0 16px 120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <SegmentedControl options={phaseOptions} value={phase} onChange={setPhase} />
          <SegmentedControl options={inputModeOptions} value={inputMode} onChange={setInputMode} />

          <InputField
            label={inputMode === 'watts' ? 'Total Connected Load' : 'Total Load Current'}
            unit={inputMode === 'watts' ? 'W' : 'A'}
            value={load}
            onChange={setLoad}
            placeholder={inputMode === 'watts' ? 'Enter watts' : 'Enter amps'}
          />

          <SelectField
            label="System Voltage"
            value={voltage}
            onChange={setVoltage}
            options={voltageOptions}
          />

          <SelectField
            label="Demand Factor"
            value={demandFactor}
            onChange={setDemandFactor}
            options={demandFactorOptions}
          />

          <ResultDisplay results={results} formula={hasInputs ? formula : undefined} />

          {/* Standard Transformer Sizes Reference Table */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--input-border)',
            borderRadius: 'var(--radius)',
            padding: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
              Standard Transformer Sizes (kVA)
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 8,
            }}>
              {STANDARD_XFMR_SIZES.map(size => {
                const isSelected = hasInputs && size === nextStd
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

          <InfoBox title="CEC Rule 26-252 — Transformer OCP">
            CEC Rule 26-252 governs overcurrent protection for transformers. For transformers rated
            over 750V, primary OCP shall not exceed 150% of rated primary current (300% for
            supervised installations with impedance \≥ 6%). For transformers rated 750V or less,
            primary OCP shall not exceed 125% of rated primary current. If 125% does not correspond
            to a standard fuse or breaker size, the next higher standard size is permitted.
            Demand factors can be applied per CEC Rule 8-106 depending on the type of load served.
            Always verify transformer impedance and available fault current at the secondary
            to ensure adequate short-circuit protection.
          </InfoBox>
        </div>
      </div>
    </>
  )
}
