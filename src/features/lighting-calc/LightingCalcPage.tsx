import { useState } from 'react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

const modeOptions = [
  { value: 'room', label: 'Room Lighting' },
  { value: 'mining', label: 'Mining Lighting' },
]

const luxPresets = [
  { value: '50', label: '50 lux \— Garage / Parking' },
  { value: '100', label: '100 lux \— Warehouse' },
  { value: '150', label: '150 lux \— Workshop' },
  { value: '200', label: '200 lux \— Office / Classroom' },
  { value: '300', label: '300 lux \— Detailed Work' },
  { value: '500', label: '500 lux \— Fine Detail' },
]

const cuOptions = [
  { value: '0.40', label: '0.40 \— Dark surfaces' },
  { value: '0.45', label: '0.45' },
  { value: '0.50', label: '0.50 \— Average' },
  { value: '0.55', label: '0.55' },
  { value: '0.60', label: '0.60 \— Light surfaces' },
  { value: '0.65', label: '0.65' },
  { value: '0.70', label: '0.70 \— Very light' },
  { value: '0.75', label: '0.75' },
  { value: '0.80', label: '0.80 \— White / reflective' },
]

const llfOptions = [
  { value: '0.60', label: '0.60 \— Very dirty / dusty' },
  { value: '0.65', label: '0.65 \— Dirty' },
  { value: '0.70', label: '0.70 \— Moderate dirt' },
  { value: '0.75', label: '0.75 \— Average' },
  { value: '0.80', label: '0.80 \— Clean' },
  { value: '0.85', label: '0.85 \— Very clean' },
  { value: '0.90', label: '0.90 \— Pristine' },
]

const miningLightingReqs: { area: string; lux: number; notes: string }[] = [
  { area: 'Headframe', lux: 50, notes: 'Hoist area and collar region' },
  { area: 'Shaft Stations', lux: 50, notes: 'Landing and loading areas' },
  { area: 'Haulageways', lux: 10, notes: 'Main travel routes underground' },
  { area: 'Working Faces', lux: 50, notes: 'Active mining/drilling areas' },
  { area: 'Electrical Rooms', lux: 200, notes: 'Switchgear, MCC, transformer rooms' },
  { area: 'Refuge Stations', lux: 50, notes: 'Emergency refuge areas' },
  { area: 'Surface Shops', lux: 300, notes: 'Maintenance and repair facilities' },
  { area: 'Walkways', lux: 20, notes: 'Corridors and pedestrian paths' },
]

export default function LightingCalcPage() {
  const [mode, setMode] = useState('room')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [targetLux, setTargetLux] = useState('200')
  const [lumensPerFixture, setLumensPerFixture] = useState('')
  const [cu, setCu] = useState('0.50')
  const [llf, setLlf] = useState('0.75')

  const L = parseFloat(length)
  const W = parseFloat(width)
  const H = parseFloat(height)
  const lux = parseFloat(targetLux)
  const lumens = parseFloat(lumensPerFixture)
  const cuVal = parseFloat(cu)
  const llfVal = parseFloat(llf)

  const hasInputs = !isNaN(L) && L > 0 && !isNaN(W) && W > 0 && !isNaN(lumens) && lumens > 0

  let numFixtures = NaN
  let area = NaN
  let totalLumens = NaN
  let formula = ''

  if (hasInputs) {
    area = L * W
    // Number of fixtures = (Lux × Area) / (Lumens × CU × LLF)
    numFixtures = (lux * area) / (lumens * cuVal * llfVal)
    totalLumens = Math.ceil(numFixtures) * lumens
    formula = `N = (${fmt(lux, 0)} lux \× ${fmt(area, 1)} m\²) / (${fmt(lumens, 0)} lm \× ${fmt(cuVal, 2)} \× ${fmt(llfVal, 2)}) = ${fmt(numFixtures, 1)}`
  }

  const roomResults = hasInputs
    ? [
        { label: 'Fixtures Required', value: `${Math.ceil(numFixtures)}`, highlight: true },
        { label: 'Calculated (exact)', value: fmt(numFixtures, 1), unit: 'fixtures' },
        { label: 'Room Area', value: fmt(area, 1), unit: 'm\²' },
        { label: 'Total Lumens Delivered', value: fmt(totalLumens, 0), unit: 'lm' },
        ...((!isNaN(H) && H > 0) ? [{ label: 'Room Cavity Ratio', value: fmt((5 * H * (L + W)) / (L * W), 2) }] : []),
      ]
    : [
        { label: 'Fixtures Required', value: '\—' },
        { label: 'Room Area', value: '\—', unit: 'm\²' },
        { label: 'Total Lumens', value: '\—', unit: 'lm' },
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
  }

  return (
    <>
      <Header title="Lighting Calculator" />
      <div style={{ padding: '0 16px 120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <SegmentedControl options={modeOptions} value={mode} onChange={setMode} />

          {mode === 'room' && (
            <>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <InputField
                    label="Length"
                    unit="m"
                    value={length}
                    onChange={setLength}
                    placeholder="L"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <InputField
                    label="Width"
                    unit="m"
                    value={width}
                    onChange={setWidth}
                    placeholder="W"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <InputField
                    label="Height"
                    unit="m"
                    value={height}
                    onChange={setHeight}
                    placeholder="H"
                  />
                </div>
              </div>

              <SelectField
                label="Target Illumination"
                value={targetLux}
                onChange={setTargetLux}
                options={luxPresets}
              />

              <InputField
                label="Lumens per Fixture"
                unit="lm"
                value={lumensPerFixture}
                onChange={setLumensPerFixture}
                placeholder="e.g. 5000"
              />

              <SelectField
                label="Coefficient of Utilization (CU)"
                value={cu}
                onChange={setCu}
                options={cuOptions}
              />

              <SelectField
                label="Light Loss Factor (LLF)"
                value={llf}
                onChange={setLlf}
                options={llfOptions}
              />

              <ResultDisplay results={roomResults} formula={hasInputs ? formula : undefined} />

              <InfoBox title="Lumen Method">
                The lumen method (or zonal cavity method) estimates the number of fixtures needed to
                achieve a desired illumination level. The Coefficient of Utilization (CU) accounts for
                room geometry and surface reflectances. The Light Loss Factor (LLF) accounts for lamp
                depreciation, luminaire dirt, and other maintenance factors. For mining environments,
                use lower LLF values (0.6\–0.7) due to dust and harsh conditions. Always verify
                emergency lighting meets minimum code requirements.
              </InfoBox>
            </>
          )}

          {mode === 'mining' && (
            <>
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
                  Mine Lighting Requirements
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Area</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Min. Lux</th>
                        <th style={thStyle}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {miningLightingReqs.map(row => (
                        <tr key={row.area}>
                          <td style={{ ...tdStyle, fontWeight: 500 }}>{row.area}</td>
                          <td style={{
                            ...tdStyle,
                            textAlign: 'right',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            color: 'var(--primary)',
                          }}>
                            {row.lux}
                          </td>
                          <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontSize: 13 }}>
                            {row.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Color coding legend */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius)',
                padding: 16,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                  Quick Reference by Lux Level
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { lux: '10 lux', areas: 'Haulageways', color: '#4ade80' },
                    { lux: '20 lux', areas: 'Walkways', color: '#86efac' },
                    { lux: '50 lux', areas: 'Headframe, Shaft Stations, Working Faces, Refuge Stations', color: '#facc15' },
                    { lux: '200 lux', areas: 'Electrical Rooms', color: '#fb923c' },
                    { lux: '300 lux', areas: 'Surface Shops', color: '#f87171' },
                  ].map(item => (
                    <div key={item.lux} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 0',
                      borderBottom: '1px solid var(--divider)',
                    }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: item.color, flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 13,
                        fontWeight: 600, color: 'var(--text)',
                        minWidth: 60,
                      }}>
                        {item.lux}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {item.areas}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <InfoBox title="CEC / O.Reg.854 Mine Lighting">
                Ontario Regulation 854 (Mines and Mining Plants) and the CEC establish minimum
                illumination requirements for underground and surface mine areas. Lighting in mines
                must be maintained at or above the specified lux levels during all working periods.
                Emergency lighting must be provided for shaft stations, refuge stations, and main
                travel routes. All underground lighting fixtures must be suitable for the environment
                (wet, dusty, potentially explosive atmospheres where applicable). Battery-powered
                emergency lighting with minimum 3-hour duration is required in critical areas.
                Regular light level surveys should be conducted to verify compliance.
              </InfoBox>
            </>
          )}
        </div>
      </div>
    </>
  )
}
