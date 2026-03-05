import { useState } from 'react'
import InputField from '../../components/InputField'
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

const voltageOptions3P = [
  { value: '208', label: '208V' },
  { value: '240', label: '240V' },
  { value: '480', label: '480V' },
  { value: '575', label: '575V' },
  { value: '600', label: '600V' },
]

const voltageOptions1P = [
  { value: '120', label: '120V' },
  { value: '208', label: '208V' },
  { value: '240', label: '240V' },
]

const fuseTypeOptions = [
  { value: 'fused', label: 'Fused' },
  { value: 'unfused', label: 'Unfused' },
]

const loadTypeOptions = [
  { value: 'motor', label: 'Motor Load' },
  { value: 'nonmotor', label: 'Non-Motor Load' },
]

// Approximate FLC for 3-phase motors by HP and voltage (simplified for disconnect sizing)
const motorFLC3P: Record<string, Record<string, number>> = {
  '0.5':  { '208': 2.4, '240': 2.2, '480': 1.1, '575': 0.9, '600': 0.9 },
  '0.75': { '208': 3.5, '240': 3.2, '480': 1.6, '575': 1.3, '600': 1.3 },
  '1':    { '208': 4.6, '240': 4.2, '480': 2.1, '575': 1.7, '600': 1.7 },
  '1.5':  { '208': 6.6, '240': 6.0, '480': 3.0, '575': 2.4, '600': 2.4 },
  '2':    { '208': 7.5, '240': 6.8, '480': 3.4, '575': 2.7, '600': 2.7 },
  '3':    { '208': 10.6, '240': 9.6, '480': 4.8, '575': 3.9, '600': 3.9 },
  '5':    { '208': 16.7, '240': 15.2, '480': 7.6, '575': 6.1, '600': 6.1 },
  '7.5':  { '208': 24.2, '240': 22.0, '480': 11.0, '575': 9.0, '600': 9.0 },
  '10':   { '208': 30.8, '240': 28.0, '480': 14.0, '575': 11.0, '600': 11.0 },
  '15':   { '208': 46.2, '240': 42.0, '480': 21.0, '575': 17.0, '600': 17.0 },
  '20':   { '208': 59.4, '240': 54.0, '480': 27.0, '575': 22.0, '600': 22.0 },
  '25':   { '208': 74.8, '240': 68.0, '480': 34.0, '575': 27.0, '600': 27.0 },
  '30':   { '208': 88.0, '240': 80.0, '480': 40.0, '575': 32.0, '600': 32.0 },
  '40':   { '208': 114.0, '240': 104.0, '480': 52.0, '575': 41.0, '600': 41.0 },
  '50':   { '208': 143.0, '240': 130.0, '480': 65.0, '575': 52.0, '600': 52.0 },
  '60':   { '208': 169.0, '240': 154.0, '480': 77.0, '575': 62.0, '600': 62.0 },
  '75':   { '208': 211.0, '240': 192.0, '480': 96.0, '575': 77.0, '600': 77.0 },
  '100':  { '208': 273.0, '240': 248.0, '480': 124.0, '575': 99.0, '600': 99.0 },
  '125':  { '208': 343.0, '240': 312.0, '480': 156.0, '575': 125.0, '600': 125.0 },
  '150':  { '208': 396.0, '240': 360.0, '480': 180.0, '575': 144.0, '600': 144.0 },
  '200':  { '208': 528.0, '240': 480.0, '480': 240.0, '575': 192.0, '600': 192.0 },
}

// Approximate FLC for single-phase motors by HP and voltage
const motorFLC1P: Record<string, Record<string, number>> = {
  '0.5':  { '120': 9.8, '208': 5.7, '240': 4.9 },
  '0.75': { '120': 13.8, '208': 8.0, '240': 6.9 },
  '1':    { '120': 16.0, '208': 9.2, '240': 8.0 },
  '1.5':  { '120': 20.0, '208': 11.5, '240': 10.0 },
  '2':    { '120': 24.0, '208': 13.8, '240': 12.0 },
  '3':    { '120': 34.0, '208': 19.6, '240': 17.0 },
  '5':    { '120': 56.0, '208': 32.2, '240': 28.0 },
  '7.5':  { '120': 80.0, '208': 46.0, '240': 40.0 },
  '10':   { '120': 100.0, '208': 57.5, '240': 50.0 },
}

const DISCONNECT_SIZES = [30, 60, 100, 200, 400, 600]

// Standard fuse sizes
const STANDARD_FUSE_SIZES = [
  15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90,
  100, 110, 125, 150, 175, 200, 225, 250, 300,
  350, 400, 450, 500, 600,
]

function getNextDisconnect(amps: number): number {
  for (const size of DISCONNECT_SIZES) {
    if (size >= amps) return size
  }
  return DISCONNECT_SIZES[DISCONNECT_SIZES.length - 1]
}

function getNextFuseSize(amps: number): number {
  for (const size of STANDARD_FUSE_SIZES) {
    if (size >= amps) return size
  }
  return STANDARD_FUSE_SIZES[STANDARD_FUSE_SIZES.length - 1]
}

// HP-rated disconnect reference table - max HP per disconnect size at various voltages (3-phase)
const hpRatedDisconnects: { size: number; hp208: number; hp240: number; hp480: number; hp600: number }[] = [
  { size: 30, hp208: 7.5, hp240: 10, hp480: 15, hp600: 20 },
  { size: 60, hp208: 15, hp240: 20, hp480: 40, hp600: 50 },
  { size: 100, hp208: 30, hp240: 40, hp480: 75, hp600: 100 },
  { size: 200, hp208: 60, hp240: 75, hp480: 150, hp600: 200 },
  { size: 400, hp208: 125, hp240: 150, hp480: 350, hp600: 400 },
  { size: 600, hp208: 200, hp240: 200, hp480: 500, hp600: 600 },
]

export default function DisconnectSizingPage() {
  const [loadType, setLoadType] = useState('motor')
  const [phase, setPhase] = useState('three')
  const [voltage, setVoltage] = useState('480')
  const [hp, setHp] = useState('')
  const [fuseType, setFuseType] = useState('fused')
  const [nonMotorAmps, setNonMotorAmps] = useState('')

  const voltageOpts = phase === 'three' ? voltageOptions3P : voltageOptions1P
  const effectiveVoltage = voltageOpts.some(v => v.value === voltage) ? voltage : voltageOpts[0].value

  const hpOptions = phase === 'three'
    ? Object.keys(motorFLC3P).map(h => ({ value: h, label: `${h} HP` }))
    : Object.keys(motorFLC1P).map(h => ({ value: h, label: `${h} HP` }))

  const flcTable = phase === 'three' ? motorFLC3P : motorFLC1P
  const hpList = Object.keys(flcTable)
  const effectiveHp = hpList.includes(hp) ? hp : ''

  // Motor load calculation
  const flc = effectiveHp ? flcTable[effectiveHp]?.[effectiveVoltage] : undefined
  const hasMotorInputs = loadType === 'motor' && flc !== undefined && flc > 0

  let disconnectSize = NaN
  let fuseSize = NaN
  let motorCurrent = NaN

  if (hasMotorInputs && flc) {
    motorCurrent = flc
    // Motor disconnect must be rated at 115% of FLC minimum (CEC Rule 28-602)
    const minDisconnectAmps = flc * 1.15
    disconnectSize = getNextDisconnect(minDisconnectAmps)

    // Time-delay fuse for motor: typically 175% of FLC for standard, 225% for non-time-delay
    // Using time-delay (dual-element) fuse sizing: 175% of FLC
    const fuseAmps = flc * 1.75
    fuseSize = getNextFuseSize(fuseAmps)
  }

  // Non-motor load calculation
  const nonMotorAmpsVal = parseFloat(nonMotorAmps)
  const hasNonMotorInputs = loadType === 'nonmotor' && !isNaN(nonMotorAmpsVal) && nonMotorAmpsVal > 0

  let nonMotorDisconnect = NaN
  let nonMotorFuse = NaN

  if (hasNonMotorInputs) {
    // Non-motor loads: 115% of load current
    const minAmps = nonMotorAmpsVal * 1.15
    nonMotorDisconnect = getNextDisconnect(minAmps)
    nonMotorFuse = getNextFuseSize(minAmps)
  }

  const motorResults = hasMotorInputs
    ? [
        { label: 'Motor FLC', value: fmt(motorCurrent, 1), unit: 'A' },
        { label: 'Min. Disconnect Size', value: `${disconnectSize}`, unit: 'A', highlight: true },
        ...(fuseType === 'fused'
          ? [{ label: 'Recommended Fuse (TDF)', value: `${fuseSize}`, unit: 'A' }]
          : []),
        { label: 'Fuse Type', value: 'Time-Delay (Dual Element)' },
      ]
    : [
        { label: 'Motor FLC', value: '—', unit: 'A' },
        { label: 'Min. Disconnect Size', value: '—', unit: 'A' },
      ]

  const nonMotorResults = hasNonMotorInputs
    ? [
        { label: 'Load Current', value: fmt(nonMotorAmpsVal, 1), unit: 'A' },
        { label: '115% of Load', value: fmt(nonMotorAmpsVal * 1.15, 1), unit: 'A' },
        { label: 'Min. Disconnect Size', value: `${nonMotorDisconnect}`, unit: 'A', highlight: true },
        ...(fuseType === 'fused'
          ? [{ label: 'Recommended Fuse', value: `${nonMotorFuse}`, unit: 'A' }]
          : []),
      ]
    : [
        { label: 'Load Current', value: '—', unit: 'A' },
        { label: 'Min. Disconnect Size', value: '—', unit: 'A' },
      ]

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '2px solid var(--divider)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    fontSize: 13,
  }

  const tdStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderBottom: '1px solid var(--divider)',
    fontSize: 14,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    textAlign: 'right',
  }

  return (
    <>
      <Header title="Disconnect Sizing" />
      <div style={{ padding: '0 16px 120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <SegmentedControl options={loadTypeOptions} value={loadType} onChange={setLoadType} />

          {loadType === 'motor' && (
            <>
              <SegmentedControl options={phaseOptions} value={phase} onChange={(v) => { setPhase(v); setHp('') }} />
              <SegmentedControl options={fuseTypeOptions} value={fuseType} onChange={setFuseType} />

              <SelectField
                label="Voltage"
                value={effectiveVoltage}
                onChange={setVoltage}
                options={voltageOpts}
              />

              <SelectField
                label="Motor Horsepower"
                value={effectiveHp}
                onChange={setHp}
                options={[{ value: '', label: 'Select HP...' }, ...hpOptions]}
              />

              <ResultDisplay results={motorResults} title="Motor Disconnect" />
            </>
          )}

          {loadType === 'nonmotor' && (
            <>
              <SegmentedControl options={fuseTypeOptions} value={fuseType} onChange={setFuseType} />

              <InputField
                label="Load Current"
                unit="A"
                value={nonMotorAmps}
                onChange={setNonMotorAmps}
                placeholder="Enter load amps"
              />

              <ResultDisplay results={nonMotorResults} title="Non-Motor Disconnect" />
            </>
          )}

          {/* Disconnect Ampere Ratings Reference */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--input-border)',
            borderRadius: 'var(--radius)',
            padding: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
              Standard Disconnect Sizes
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DISCONNECT_SIZES.map(size => {
                const isSelected = loadType === 'motor'
                  ? hasMotorInputs && size === disconnectSize
                  : hasNonMotorInputs && size === nonMotorDisconnect
                return (
                  <span key={size} style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 14,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isSelected ? 700 : 400,
                    background: isSelected ? 'var(--primary)' : 'var(--input-bg)',
                    color: isSelected ? '#000' : 'var(--text-secondary)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--divider)',
                  }}>
                    {size}A
                  </span>
                )
              })}
            </div>
          </div>

          {/* HP-Rated Disconnect Table (3-phase) */}
          {loadType === 'motor' && phase === 'three' && (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--input-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--divider)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text)',
              }}>
                HP-Rated Disconnect Reference (3-Phase)
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Size (A)</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>208V</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>240V</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>480V</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>600V</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hpRatedDisconnects.map(row => {
                      const isSelected = hasMotorInputs && row.size === disconnectSize
                      return (
                        <tr key={row.size} style={{
                          background: isSelected ? 'rgba(59,130,246,0.1)' : 'transparent',
                        }}>
                          <td style={{
                            ...tdStyle,
                            textAlign: 'left',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? 'var(--primary)' : 'var(--text)',
                          }}>
                            {row.size}A
                          </td>
                          <td style={{ ...tdStyle, fontWeight: isSelected ? 700 : 400, color: isSelected ? 'var(--primary)' : 'var(--text)' }}>{row.hp208} HP</td>
                          <td style={{ ...tdStyle, fontWeight: isSelected ? 700 : 400, color: isSelected ? 'var(--primary)' : 'var(--text)' }}>{row.hp240} HP</td>
                          <td style={{ ...tdStyle, fontWeight: isSelected ? 700 : 400, color: isSelected ? 'var(--primary)' : 'var(--text)' }}>{row.hp480} HP</td>
                          <td style={{ ...tdStyle, fontWeight: isSelected ? 700 : 400, color: isSelected ? 'var(--primary)' : 'var(--text)' }}>{row.hp600} HP</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <InfoBox title="CEC Disconnect Sizing Rules">
            Per CEC Rule 28-602, a motor disconnect must have an ampere rating of not less than
            115% of the full-load current rating of the motor. For HP-rated disconnects, the HP
            rating must be equal to or greater than the motor HP at the operating voltage. Time-delay
            (dual-element) fuses are recommended for motor circuits to handle inrush current during
            starting. For non-motor loads such as lighting and heating, size the disconnect at
            115% of the continuous load current. Always verify fuse coordination with upstream
            overcurrent devices.
          </InfoBox>
        </div>
      </div>
    </>
  )
}
