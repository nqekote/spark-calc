import { useState } from 'react'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

const phaseOptions = [
  { value: 'three', label: '3-Phase' },
  { value: 'single', label: 'Single Phase' },
]

const materialOptions = [
  { value: 'copper', label: 'Copper' },
  { value: 'aluminum', label: 'Aluminum' },
]

const tempRatingOptions = [
  { value: '60', label: '60°C' },
  { value: '75', label: '75°C' },
  { value: '90', label: '90°C' },
]

const ocpDeviceOptions = [
  { value: 'inverse', label: 'Inverse Time Breaker' },
  { value: 'instantaneous', label: 'Instantaneous Trip Breaker' },
  { value: 'dualElement', label: 'Dual Element Fuse' },
  { value: 'nonTimeDelay', label: 'Non-Time-Delay Fuse' },
]

// OCP multipliers per CEC Table 29
const ocpMultipliers: Record<string, number> = {
  inverse: 2.5,
  instantaneous: 8.0,
  dualElement: 1.75,
  nonTimeDelay: 3.0,
}

// Standard OCP sizes
const standardOCPSizes = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600]

// Three Phase FLC Data (CEC Table 44)
const threePhaseVoltages = ['200', '208', '230', '460', '575']
const threePhaseData: Record<string, Record<string, number>> = {
  '1/2':  { '200': 2.5, '208': 2.4, '230': 2.2, '460': 1.1, '575': 0.9 },
  '3/4':  { '200': 3.7, '208': 3.5, '230': 3.2, '460': 1.6, '575': 1.3 },
  '1':    { '200': 4.8, '208': 4.6, '230': 4.2, '460': 2.1, '575': 1.7 },
  '1.5':  { '200': 6.9, '208': 6.6, '230': 6.0, '460': 3.0, '575': 2.4 },
  '2':    { '200': 7.8, '208': 7.5, '230': 6.8, '460': 3.4, '575': 2.7 },
  '3':    { '200': 11.0, '208': 10.6, '230': 9.6, '460': 4.8, '575': 3.9 },
  '5':    { '200': 17.5, '208': 16.7, '230': 15.2, '460': 7.6, '575': 6.1 },
  '7.5':  { '200': 25.3, '208': 24.2, '230': 22.0, '460': 11.0, '575': 9.0 },
  '10':   { '200': 32.2, '208': 30.8, '230': 28.0, '460': 14.0, '575': 11.0 },
  '15':   { '200': 48.3, '208': 46.2, '230': 42.0, '460': 21.0, '575': 17.0 },
  '20':   { '200': 62.1, '208': 59.4, '230': 54.0, '460': 27.0, '575': 22.0 },
  '25':   { '200': 78.2, '208': 74.8, '230': 68.0, '460': 34.0, '575': 27.0 },
  '30':   { '200': 92.0, '208': 88.0, '230': 80.0, '460': 40.0, '575': 32.0 },
  '40':   { '200': 120.0, '208': 114.0, '230': 104.0, '460': 52.0, '575': 41.0 },
  '50':   { '200': 150.0, '208': 143.0, '230': 130.0, '460': 65.0, '575': 52.0 },
  '60':   { '200': 177.0, '208': 169.0, '230': 154.0, '460': 77.0, '575': 62.0 },
  '75':   { '200': 221.0, '208': 211.0, '230': 192.0, '460': 96.0, '575': 77.0 },
  '100':  { '200': 285.0, '208': 273.0, '230': 248.0, '460': 124.0, '575': 99.0 },
  '125':  { '200': 359.0, '208': 343.0, '230': 312.0, '460': 156.0, '575': 125.0 },
  '150':  { '200': 414.0, '208': 396.0, '230': 360.0, '460': 180.0, '575': 144.0 },
  '200':  { '200': 552.0, '208': 528.0, '230': 480.0, '460': 240.0, '575': 192.0 },
}

// Single Phase FLC Data (CEC Table 45)
const singlePhaseVoltages = ['115', '230']
const singlePhaseData: Record<string, Record<string, number>> = {
  '1/6':  { '115': 4.4, '230': 2.2 },
  '1/4':  { '115': 5.8, '230': 2.9 },
  '1/3':  { '115': 7.2, '230': 3.6 },
  '1/2':  { '115': 9.8, '230': 4.9 },
  '3/4':  { '115': 13.8, '230': 6.9 },
  '1':    { '115': 16.0, '230': 8.0 },
  '1.5':  { '115': 20.0, '230': 10.0 },
  '2':    { '115': 24.0, '230': 12.0 },
  '3':    { '115': 34.0, '230': 17.0 },
  '5':    { '115': 56.0, '230': 28.0 },
  '7.5':  { '115': 80.0, '230': 40.0 },
  '10':   { '115': 100.0, '230': 50.0 },
}

// Ampacity data - Copper 75°C column
const ampacityCopper75: Record<string, number> = {
  '14': 15, '12': 20, '10': 30, '8': 45, '6': 65, '4': 85, '3': 100, '2': 115,
  '1': 130, '1/0': 150, '2/0': 175, '3/0': 200, '4/0': 230,
  '250': 255, '300': 285, '350': 310, '400': 335, '500': 380,
}

// Aluminum ampacity is roughly 78% of copper (simplified per CEC tables)
const ampacityAluminum75: Record<string, number> = {
  '14': 15, '12': 15, '10': 25, '8': 35, '6': 50, '4': 65, '3': 75, '2': 90,
  '1': 100, '1/0': 120, '2/0': 135, '3/0': 155, '4/0': 180,
  '250': 205, '300': 230, '350': 250, '400': 270, '500': 310,
}

// Temperature correction factors (relative to 75°C base)
const tempFactors: Record<string, number> = {
  '60': 0.85,
  '75': 1.0,
  '90': 1.15,
}

const wireSizes = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0', '250', '300', '350', '400', '500']
const wireSizeLabels: Record<string, string> = {
  '14': '14 AWG', '12': '12 AWG', '10': '10 AWG', '8': '8 AWG', '6': '6 AWG',
  '4': '4 AWG', '3': '3 AWG', '2': '2 AWG', '1': '1 AWG',
  '1/0': '1/0 AWG', '2/0': '2/0 AWG', '3/0': '3/0 AWG', '4/0': '4/0 AWG',
  '250': '250 kcmil', '300': '300 kcmil', '350': '350 kcmil', '400': '400 kcmil', '500': '500 kcmil',
}

function getNextStandardOCP(calculated: number): number {
  for (const size of standardOCPSizes) {
    if (size >= calculated) return size
  }
  return standardOCPSizes[standardOCPSizes.length - 1]
}

function findMinWireSize(minAmpacity: number, material: string, tempRating: string): { size: string; ampacity: number } | null {
  const baseAmpacity = material === 'copper' ? ampacityCopper75 : ampacityAluminum75
  const factor = tempFactors[tempRating]

  for (const size of wireSizes) {
    const adjusted = baseAmpacity[size] * factor
    if (adjusted >= minAmpacity) {
      return { size, ampacity: Math.round(adjusted * 100) / 100 }
    }
  }
  return null
}

export default function MotorBranchPage() {
  const [phase, setPhase] = useState('three')
  const [hp, setHp] = useState('')
  const [voltage, setVoltage] = useState('')
  const [material, setMaterial] = useState('copper')
  const [tempRating, setTempRating] = useState('75')
  const [ocpDevice, setOcpDevice] = useState('inverse')

  const data = phase === 'three' ? threePhaseData : singlePhaseData
  const voltages = phase === 'three' ? threePhaseVoltages : singlePhaseVoltages

  const hpList = Object.keys(data)
  const hpOptions = hpList.map(h => ({ value: h, label: `${h} HP` }))
  const voltageOptions = voltages.map(v => ({ value: v, label: `${v}V` }))

  const effectiveHp = hpList.includes(hp) ? hp : hpList[0]
  const effectiveVoltage = voltages.includes(voltage) ? voltage : voltages[0]

  if (hp !== effectiveHp && hp !== '') setHp(effectiveHp)
  if (voltage !== effectiveVoltage && voltage !== '') setVoltage(effectiveVoltage)

  const selectedHp = effectiveHp || hpList[0]
  const selectedVoltage = effectiveVoltage || voltages[0]

  const row = data[selectedHp]
  const flc = row ? row[selectedVoltage] : NaN
  const hasResult = !isNaN(flc) && flc > 0

  // Calculations
  const minConductorAmpacity = hasResult ? flc * 1.25 : NaN
  const wireResult = hasResult ? findMinWireSize(minConductorAmpacity, material, tempRating) : null

  const ocpMultiplier = ocpMultipliers[ocpDevice]
  const maxOCP = hasResult ? flc * ocpMultiplier : NaN
  const standardOCP = hasResult ? getNextStandardOCP(maxOCP) : NaN

  const overloadProtection115 = hasResult ? flc * 1.15 : NaN
  const overloadProtection125 = hasResult ? flc * 1.25 : NaN

  const ocpDeviceLabel = ocpDeviceOptions.find(o => o.value === ocpDevice)?.label ?? ''

  const results = hasResult
    ? [
        { label: 'Motor FLC', value: fmt(flc, 1), unit: 'A', highlight: true },
        { label: 'Min Conductor Ampacity (125%)', value: fmt(minConductorAmpacity, 1), unit: 'A' },
        { label: 'Recommended Wire Size', value: wireResult ? wireSizeLabels[wireResult.size] : 'Exceeds table' },
        { label: 'Wire Ampacity', value: wireResult ? fmt(wireResult.ampacity, 1) : '—', unit: wireResult ? 'A' : undefined },
        { label: `Max OCP (${ocpDeviceLabel})`, value: fmt(maxOCP, 1), unit: 'A' },
        { label: 'Standard OCP Size', value: fmt(standardOCP, 0), unit: 'A' },
        { label: 'Overload (SF≥1.15)', value: fmt(overloadProtection115, 1), unit: 'A' },
        { label: 'Overload (SF<1.15)', value: fmt(overloadProtection125, 1), unit: 'A' },
      ]
    : [
        { label: 'Motor FLC', value: '—', unit: 'A' },
        { label: 'Min Conductor Ampacity (125%)', value: '—', unit: 'A' },
        { label: 'Recommended Wire Size', value: '—' },
        { label: 'Wire Ampacity', value: '—', unit: 'A' },
        { label: 'Max OCP Rating', value: '—', unit: 'A' },
        { label: 'Standard OCP Size', value: '—', unit: 'A' },
        { label: 'Overload (SF≥1.15)', value: '—', unit: 'A' },
        { label: 'Overload (SF<1.15)', value: '—', unit: 'A' },
      ]

  const formula = hasResult
    ? `FLC = ${fmt(flc, 1)} A × 125% = ${fmt(minConductorAmpacity, 1)} A min ampacity | OCP = ${fmt(flc, 1)} A × ${(ocpMultiplier * 100).toFixed(0)}% = ${fmt(maxOCP, 1)} A → ${fmt(standardOCP, 0)} A std`
    : undefined

  return (
    <>
      <Header title="Motor Branch Circuit" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={phaseOptions} value={phase} onChange={(v) => { setPhase(v); setHp(''); setVoltage('') }} />
        <SelectField
          label="Horsepower"
          value={selectedHp}
          onChange={setHp}
          options={hpOptions}
        />
        <SelectField
          label="Voltage"
          value={selectedVoltage}
          onChange={setVoltage}
          options={voltageOptions}
        />
        <SegmentedControl options={materialOptions} value={material} onChange={setMaterial} />
        <SelectField
          label="Temperature Rating"
          value={tempRating}
          onChange={setTempRating}
          options={tempRatingOptions}
        />
        <SelectField
          label="OCP Device Type"
          value={ocpDevice}
          onChange={setOcpDevice}
          options={ocpDeviceOptions}
        />
        <ResultDisplay results={results} formula={formula} title="Motor Branch" />
        <InfoBox title="CEC Rule 28 — Motor Branch Circuits">
          Motor branch circuit conductors must have an ampacity not less than 125% of the motor
          full load current (Rule 28-106). Overcurrent protection is sized per Table 29 based on the
          device type. If the calculated OCP value does not match a standard size, the next standard
          size up is permitted. Overload protection is set at 115% of FLC for motors with a service
          factor of 1.15 or greater, or 125% for motors with a service factor less than 1.15
          (Rule 28-306).
        </InfoBox>
      </div>
    </>
  )
}
