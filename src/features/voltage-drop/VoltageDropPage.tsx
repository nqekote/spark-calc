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

const unitOptions = [
  { value: 'ft', label: 'Feet' },
  { value: 'm', label: 'Meters' },
]

const materialOptions = [
  { value: 'copper', label: 'Copper' },
  { value: 'aluminum', label: 'Aluminum' },
]

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

const circularMils: Record<string, number> = {
  '14': 4110,
  '12': 6530,
  '10': 10380,
  '8': 16510,
  '6': 26240,
  '4': 41740,
  '3': 52620,
  '2': 66360,
  '1': 83690,
  '1/0': 105600,
  '2/0': 133100,
  '3/0': 167800,
  '4/0': 211600,
  '250': 250000,
  '300': 300000,
  '350': 350000,
  '400': 400000,
  '500': 500000,
}

const K_VALUES: Record<string, number> = {
  copper: 12.9,
  aluminum: 21.2,
}

const METERS_TO_FEET = 3.281

export default function VoltageDropPage() {
  const [phase, setPhase] = useState('single')
  const [distUnit, setDistUnit] = useState('ft')
  const [voltage, setVoltage] = useState('')
  const [current, setCurrent] = useState('')
  const [distance, setDistance] = useState('')
  const [material, setMaterial] = useState('copper')
  const [wireSize, setWireSize] = useState('12')

  const V = parseFloat(voltage)
  const I = parseFloat(current)
  const rawDist = parseFloat(distance)
  const hasInputs = !isNaN(V) && !isNaN(I) && !isNaN(rawDist) && V > 0

  const L = !isNaN(rawDist) ? (distUnit === 'm' ? rawDist * METERS_TO_FEET : rawDist) : NaN
  const K = K_VALUES[material]
  const CM = circularMils[wireSize]

  let vDrop = NaN
  let vDropPercent = NaN
  let vAtLoad = NaN
  let formula = ''

  if (hasInputs) {
    const multiplier = phase === 'single' ? 2 : Math.sqrt(3)
    vDrop = (multiplier * K * I * L) / CM
    vDropPercent = (vDrop / V) * 100
    vAtLoad = V - vDrop

    if (phase === 'single') {
      formula = `VD = 2 \× K \× I \× L / CM = 2 \× ${K} \× ${fmt(I)} \× ${fmt(L)} / ${CM.toLocaleString()} = ${fmt(vDrop)} V`
    } else {
      formula = `VD = \√3 \× K \× I \× L / CM = 1.732 \× ${K} \× ${fmt(I)} \× ${fmt(L)} / ${CM.toLocaleString()} = ${fmt(vDrop)} V`
    }
  }

  const getStatus = (pct: number): string => {
    if (pct <= 3) return 'PASS'
    if (pct <= 5) return 'WARNING - Exceeds 3% branch limit'
    return 'FAIL - Exceeds 5% total limit'
  }

  const results = hasInputs
    ? [
        { label: 'Voltage Drop', value: fmt(vDrop), unit: 'V', highlight: true },
        { label: 'Voltage Drop', value: fmt(vDropPercent, 1), unit: '%' },
        { label: 'Voltage at Load', value: fmt(vAtLoad), unit: 'V' },
        { label: 'Status', value: getStatus(vDropPercent) },
      ]
    : [
        { label: 'Voltage Drop', value: '\—', unit: 'V' },
        { label: 'Voltage Drop', value: '\—', unit: '%' },
        { label: 'Voltage at Load', value: '\—', unit: 'V' },
        { label: 'Status', value: '\—' },
      ]

  return (
    <>
      <Header title="Voltage Drop" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={phaseOptions} value={phase} onChange={setPhase} />
        <InputField
          label="Voltage"
          unit="V"
          value={voltage}
          onChange={setVoltage}
          placeholder="Enter voltage"
        />
        <InputField
          label="Current"
          unit="A"
          value={current}
          onChange={setCurrent}
          placeholder="Enter current"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <InputField
                label="One-way Distance"
                unit={distUnit}
                value={distance}
                onChange={setDistance}
                placeholder="Enter distance"
              />
            </div>
            <div style={{ width: 120, flexShrink: 0 }}>
              <SegmentedControl options={unitOptions} value={distUnit} onChange={setDistUnit} />
            </div>
          </div>
        </div>
        <SelectField
          label="Conductor Material"
          value={material}
          onChange={setMaterial}
          options={materialOptions}
        />
        <SelectField
          label="Wire Size"
          value={wireSize}
          onChange={setWireSize}
          options={wireSizeOptions}
        />
        <ResultDisplay results={results} formula={hasInputs ? formula : undefined} />
        <InfoBox title="CEC Voltage Drop Recommendations">
          The Canadian Electrical Code recommends a maximum voltage drop of 3% for branch circuits
          and 5% for the combined feeder and branch circuit. Excessive voltage drop can cause
          equipment to malfunction, motors to overheat, and lights to dim. Selecting a larger wire
          size or reducing the circuit length will reduce voltage drop.
        </InfoBox>
      </div>
    </>
  )
}
