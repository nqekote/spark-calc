import { useState } from 'react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

const volumeAllowance: Record<string, number> = {
  '14': 32.8,
  '12': 36.1,
  '10': 40.7,
  '8': 49.2,
  '6': 81.9,
}

const conductorOptions = [
  { value: '14', label: '14 AWG (32.8 cm³)' },
  { value: '12', label: '12 AWG (36.1 cm³)' },
  { value: '10', label: '10 AWG (40.7 cm³)' },
  { value: '8', label: '8 AWG (49.2 cm³)' },
  { value: '6', label: '6 AWG (81.9 cm³)' },
]

const standardBoxes: { value: string; label: string; volume: number }[] = [
  { value: '295', label: '100mm × 54mm rectangular (single gang) — 295 cm³', volume: 295 },
  { value: '350', label: '100mm × 54mm deep rectangular — 350 cm³', volume: 350 },
  { value: '310', label: '100mm × 54mm device box — 310 cm³', volume: 310 },
  { value: '344', label: '4" square × 1-1/2" deep — 344 cm³', volume: 344 },
  { value: '497a', label: '4" square × 2-1/8" deep — 497 cm³', volume: 497 },
  { value: '497b', label: '4-11/16" square × 1-1/2" deep — 497 cm³', volume: 497 },
  { value: '720', label: '4-11/16" square × 2-1/8" deep — 720 cm³', volume: 720 },
  { value: 'custom', label: 'Custom', volume: 0 },
]

const boxSelectOptions = standardBoxes.map(b => ({ value: b.value, label: b.label }))

export default function BoxFillPage() {
  const [boxType, setBoxType] = useState('295')
  const [customVolume, setCustomVolume] = useState('')
  const [conductorSize, setConductorSize] = useState('14')
  const [numConductors, setNumConductors] = useState('')
  const [numClamps, setNumClamps] = useState('')
  const [numGrounds, setNumGrounds] = useState('')
  const [numDevices, setNumDevices] = useState('')

  const isCustom = boxType === 'custom'
  const selectedBox = standardBoxes.find(b => b.value === boxType)
  const boxVolume = isCustom ? parseFloat(customVolume) : (selectedBox?.volume ?? 0)
  const allowance = volumeAllowance[conductorSize] ?? 0

  const conductorCount = parseFloat(numConductors)
  const clampCount = parseFloat(numClamps)
  const groundCount = parseFloat(numGrounds)
  const deviceCount = parseFloat(numDevices)

  const conductorVol = !isNaN(conductorCount) ? conductorCount * allowance : NaN
  const clampVol = !isNaN(clampCount) && clampCount > 0 ? 1 * allowance : 0
  const groundVol = !isNaN(groundCount) && groundCount > 0 ? 1 * allowance : 0
  const deviceVol = !isNaN(deviceCount) ? deviceCount * 2 * allowance : NaN

  const hasInputs = !isNaN(conductorVol) && !isNaN(deviceVol) && !isNaN(boxVolume) && boxVolume > 0
  const totalRequired = hasInputs ? conductorVol + clampVol + groundVol + deviceVol : NaN
  const remaining = hasInputs ? boxVolume - totalRequired : NaN
  const pass = hasInputs && remaining >= 0

  const formula = hasInputs
    ? `Total = ${fmt(conductorVol)} + ${fmt(clampVol)} + ${fmt(groundVol)} + ${fmt(deviceVol)} = ${fmt(totalRequired)} cm³`
    : undefined

  const results = hasInputs
    ? [
        { label: 'Conductor volume', value: fmt(conductorVol), unit: 'cm³' },
        { label: 'Clamp volume', value: fmt(clampVol), unit: 'cm³' },
        { label: 'Ground volume', value: fmt(groundVol), unit: 'cm³' },
        { label: 'Device volume', value: fmt(deviceVol), unit: 'cm³' },
        { label: 'Total required', value: fmt(totalRequired), unit: 'cm³', highlight: true },
        { label: 'Box volume', value: fmt(boxVolume), unit: 'cm³' },
        { label: remaining >= 0 ? 'Remaining' : 'Deficit', value: fmt(Math.abs(remaining)), unit: 'cm³' },
        { label: 'Result', value: pass ? 'PASS' : 'FAIL', highlight: true },
      ]
    : [
        { label: 'Conductor volume', value: '—', unit: 'cm³' },
        { label: 'Clamp volume', value: '—', unit: 'cm³' },
        { label: 'Ground volume', value: '—', unit: 'cm³' },
        { label: 'Device volume', value: '—', unit: 'cm³' },
        { label: 'Total required', value: '—', unit: 'cm³' },
        { label: 'Box volume', value: '—', unit: 'cm³' },
        { label: 'Remaining', value: '—', unit: 'cm³' },
        { label: 'Result', value: '—' },
      ]

  return (
    <>
      <Header title="Box Fill Calculator" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SelectField
          label="Box type"
          value={boxType}
          onChange={setBoxType}
          options={boxSelectOptions}
        />

        {isCustom && (
          <InputField
            label="Custom box volume"
            unit="cm³"
            value={customVolume}
            onChange={setCustomVolume}
            placeholder="Enter volume"
          />
        )}

        <SelectField
          label="Largest conductor size"
          value={conductorSize}
          onChange={setConductorSize}
          options={conductorOptions}
        />

        <InputField
          label="Number of conductors (current-carrying)"
          value={numConductors}
          onChange={setNumConductors}
          placeholder="0"
        />

        <InputField
          label="Number of internal cable clamps"
          value={numClamps}
          onChange={setNumClamps}
          placeholder="0"
        />

        <InputField
          label="Number of equipment grounding conductors"
          value={numGrounds}
          onChange={setNumGrounds}
          placeholder="0"
        />

        <InputField
          label="Number of devices (switches/receptacles)"
          value={numDevices}
          onChange={setNumDevices}
          placeholder="0"
        />

        <ResultDisplay results={results} formula={formula} title="Box Fill" />

        {hasInputs && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: pass ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `2px solid ${pass ? 'var(--success)' : 'var(--error)'}`,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: pass ? 'var(--success)' : 'var(--error)',
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {pass
              ? `PASS — ${fmt(remaining)} cm³ remaining`
              : `FAIL — ${fmt(Math.abs(remaining))} cm³ over capacity`}
          </div>
        )}

        <InfoBox title="CEC Rule 12-3034 — Box Fill Counting Rules">
          <p>Per CEC Rule 12-3034 and Table 22, the volume of a box must be sufficient for all conductors, clamps, grounds, and devices:</p>
          <ol style={{ paddingLeft: 20, margin: '8px 0' }}>
            <li style={{ marginBottom: 4 }}>Each current-carrying conductor counts as 1 volume allowance based on its size.</li>
            <li style={{ marginBottom: 4 }}>All internal cable clamps together count as 1 volume allowance (based on largest conductor).</li>
            <li style={{ marginBottom: 4 }}>All equipment grounding conductors together count as 1 volume allowance (based on largest ground).</li>
            <li style={{ marginBottom: 4 }}>Each device (switch/receptacle) on a yoke counts as 2 volume allowances (based on largest conductor connected).</li>
            <li style={{ marginBottom: 4 }}>Conductors passing through without splice or termination count as 1.</li>
            <li style={{ marginBottom: 4 }}>Pigtails originating within the box do not count extra.</li>
          </ol>
          <p style={{ marginTop: 8 }}>This calculator uses a simplified approach with the largest conductor size for all allowance calculations. For mixed-size installations, calculate each group separately.</p>
        </InfoBox>
      </div>
    </>
  )
}
