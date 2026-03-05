import { useState } from 'react'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

const motorTypeOptions = [
  { value: 'three', label: '3-Phase' },
  { value: 'single', label: 'Single Phase' },
  { value: 'dc', label: 'DC' },
]

const ocpDeviceOptions = [
  { value: 'inverse', label: 'Inverse Time Breaker' },
  { value: 'instantaneous', label: 'Instantaneous Trip Breaker' },
  { value: 'dualElement', label: 'Dual Element Fuse' },
  { value: 'nonTimeDelay', label: 'Non-Time-Delay Fuse' },
]

// OCP multipliers per CEC Table 29
const ocpMultipliers: Record<string, { factor: number; percent: string }> = {
  inverse:        { factor: 2.5, percent: '250%' },
  instantaneous:  { factor: 8.0, percent: '800%' },
  dualElement:    { factor: 1.75, percent: '175%' },
  nonTimeDelay:   { factor: 3.0, percent: '300%' },
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

// DC Motor FLC Data (CEC Table 46)
const dcVoltages = ['120', '240']
const dcData: Record<string, Record<string, number | null>> = {
  '1/4':  { '120': 3.1, '240': 1.6 },
  '1/3':  { '120': 4.1, '240': 2.0 },
  '1/2':  { '120': 5.4, '240': 2.7 },
  '3/4':  { '120': 7.6, '240': 3.8 },
  '1':    { '120': 9.5, '240': 4.7 },
  '1.5':  { '120': 13.2, '240': 6.6 },
  '2':    { '120': 17.0, '240': 8.5 },
  '3':    { '120': 25.0, '240': 12.2 },
  '5':    { '120': 40.0, '240': 20.0 },
  '7.5':  { '120': 58.0, '240': 29.0 },
  '10':   { '120': 76.0, '240': 38.0 },
  '15':   { '120': null, '240': 55.0 },
  '20':   { '120': null, '240': 72.0 },
  '25':   { '120': null, '240': 89.0 },
  '30':   { '120': null, '240': 106.0 },
  '40':   { '120': null, '240': 140.0 },
  '50':   { '120': null, '240': 173.0 },
  '60':   { '120': null, '240': 206.0 },
  '75':   { '120': null, '240': 255.0 },
  '100':  { '120': null, '240': 341.0 },
  '125':  { '120': null, '240': 425.0 },
  '150':  { '120': null, '240': 506.0 },
  '200':  { '120': null, '240': 675.0 },
}

function getTableInfo(motorType: string) {
  if (motorType === 'three') return { data: threePhaseData, voltages: threePhaseVoltages, tableRef: 'CEC Table 44' }
  if (motorType === 'single') return { data: singlePhaseData, voltages: singlePhaseVoltages, tableRef: 'CEC Table 45' }
  return { data: dcData, voltages: dcVoltages, tableRef: 'CEC Table 46' }
}

function getNextStandardOCP(calculated: number): number {
  for (const size of standardOCPSizes) {
    if (size >= calculated) return size
  }
  return standardOCPSizes[standardOCPSizes.length - 1]
}

export default function MotorOCPPage() {
  const [motorType, setMotorType] = useState('three')
  const [hp, setHp] = useState('')
  const [voltage, setVoltage] = useState('')
  const [ocpDevice, setOcpDevice] = useState('inverse')

  const { data, voltages, tableRef } = getTableInfo(motorType)
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
  const flcRaw = row ? row[selectedVoltage] : null
  const flc = typeof flcRaw === 'number' ? flcRaw : NaN
  const hasResult = !isNaN(flc) && flc > 0

  const { factor, percent } = ocpMultipliers[ocpDevice]
  const maxOCPCalculated = hasResult ? flc * factor : NaN
  const standardOCP = hasResult ? getNextStandardOCP(maxOCPCalculated) : NaN

  const overload115 = hasResult ? flc * 1.15 : NaN
  const overload125 = hasResult ? flc * 1.25 : NaN

  const results = hasResult
    ? [
        { label: 'Motor FLC', value: fmt(flc, 1), unit: 'A', highlight: true },
        { label: `Max OCP (${percent})`, value: fmt(maxOCPCalculated, 1), unit: 'A' },
        { label: 'Standard OCP Size', value: fmt(standardOCP, 0), unit: 'A', highlight: true },
        { label: 'Overload Relay (SF\≥1.15)', value: fmt(overload115, 1), unit: 'A' },
        { label: 'Overload Relay (SF<1.15)', value: fmt(overload125, 1), unit: 'A' },
      ]
    : [
        { label: 'Motor FLC', value: '—', unit: 'A' },
        { label: 'Max OCP', value: '—', unit: 'A' },
        { label: 'Standard OCP Size', value: '—', unit: 'A' },
        { label: 'Overload Relay (SF\≥1.15)', value: '—', unit: 'A' },
        { label: 'Overload Relay (SF<1.15)', value: '—', unit: 'A' },
      ]

  const formula = hasResult
    ? `FLC = ${fmt(flc, 1)} A (${tableRef}) | Max OCP = ${fmt(flc, 1)} × ${percent} = ${fmt(maxOCPCalculated, 1)} A \→ ${fmt(standardOCP, 0)} A std`
    : undefined

  // Build comparison table of all OCP device types for current FLC
  const allDevices = hasResult
    ? Object.entries(ocpMultipliers).map(([key, { factor: f, percent: p }]) => {
        const calc = flc * f
        const std = getNextStandardOCP(calc)
        return { key, label: ocpDeviceOptions.find(o => o.value === key)?.label ?? '', percent: p, calculated: calc, standard: std }
      })
    : []

  return (
    <>
      <Header title="Motor OCP Sizing" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={motorTypeOptions} value={motorType} onChange={(v) => { setMotorType(v); setHp(''); setVoltage('') }} />
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
        <SelectField
          label="OCP Device Type"
          value={ocpDevice}
          onChange={setOcpDevice}
          options={ocpDeviceOptions}
        />
        <ResultDisplay results={results} formula={formula} />

        {hasResult && allDevices.length > 0 && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--input-border)',
            borderRadius: 'var(--radius)',
            padding: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
              OCP Comparison — All Device Types ({selectedHp} HP @ {selectedVoltage}V)
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 8px', borderBottom: '2px solid var(--divider)', color: 'var(--text-secondary)', fontWeight: 500 }}>Device</th>
                  <th style={{ textAlign: 'center', padding: '8px 8px', borderBottom: '2px solid var(--divider)', color: 'var(--text-secondary)', fontWeight: 500 }}>Max %</th>
                  <th style={{ textAlign: 'right', padding: '8px 8px', borderBottom: '2px solid var(--divider)', color: 'var(--text-secondary)', fontWeight: 500 }}>Calc (A)</th>
                  <th style={{ textAlign: 'right', padding: '8px 8px', borderBottom: '2px solid var(--divider)', color: 'var(--text-secondary)', fontWeight: 500 }}>Std (A)</th>
                </tr>
              </thead>
              <tbody>
                {allDevices.map(d => {
                  const isSelected = d.key === ocpDevice
                  return (
                    <tr key={d.key} style={{ background: isSelected ? 'var(--primary-light, rgba(59,130,246,0.1))' : 'transparent' }}>
                      <td style={{
                        padding: '8px 8px',
                        borderBottom: '1px solid var(--divider)',
                        fontWeight: isSelected ? 700 : 400,
                        color: isSelected ? 'var(--primary)' : 'var(--text)',
                        fontSize: 12,
                      }}>{d.label}</td>
                      <td style={{
                        textAlign: 'center',
                        padding: '8px 8px',
                        borderBottom: '1px solid var(--divider)',
                        fontFamily: 'var(--font-mono)',
                        color: isSelected ? 'var(--primary)' : 'var(--text)',
                      }}>{d.percent}</td>
                      <td style={{
                        textAlign: 'right',
                        padding: '8px 8px',
                        borderBottom: '1px solid var(--divider)',
                        fontFamily: 'var(--font-mono)',
                        color: isSelected ? 'var(--primary)' : 'var(--text)',
                      }}>{fmt(d.calculated, 1)}</td>
                      <td style={{
                        textAlign: 'right',
                        padding: '8px 8px',
                        borderBottom: '1px solid var(--divider)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: isSelected ? 700 : 400,
                        color: isSelected ? 'var(--primary)' : 'var(--text)',
                      }}>{fmt(d.standard, 0)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <InfoBox title="CEC Rule 28-200 & Table 29">
          Motor overcurrent protection devices must not exceed the percentages specified in
          CEC Table 29. Non-time-delay fuses are sized at 300% of FLC, dual element (time-delay)
          fuses at 175%, inverse time breakers at 250%, and instantaneous trip breakers at 800%.
          When the calculated value does not correspond to a standard device size, the next higher
          standard size is permitted. Overload relays protect the motor from sustained overloads
          and are set at 115% of FLC for motors with a service factor of 1.15 or greater, or 125%
          for motors with a lower service factor.
        </InfoBox>
      </div>
    </>
  )
}
