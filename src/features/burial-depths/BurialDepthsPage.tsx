import { useState } from 'react'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'

/* ---------- Data ---------- */

interface BurialEntry {
  method: string
  underBuildings: string
  underRoadways: string
  underDriveways: string
  underParkingLots: string
  underOtherAreas: string
}

const burialData: BurialEntry[] = [
  {
    method: 'Rigid Metal Conduit',
    underBuildings: '0 (slab)',
    underRoadways: '600 mm',
    underDriveways: '450 mm',
    underParkingLots: '450 mm',
    underOtherAreas: '450 mm',
  },
  {
    method: 'Rigid PVC (Schedule 40)',
    underBuildings: '0 (slab)',
    underRoadways: '600 mm',
    underDriveways: '450 mm',
    underParkingLots: '450 mm',
    underOtherAreas: '450 mm',
  },
  {
    method: 'Direct Burial Cable',
    underBuildings: '0 (slab)',
    underRoadways: '900 mm',
    underDriveways: '600 mm',
    underParkingLots: '600 mm',
    underOtherAreas: '600 mm',
  },
  {
    method: 'Rigid PVC with concrete encasement',
    underBuildings: '0 (slab)',
    underRoadways: '450 mm',
    underDriveways: '300 mm',
    underParkingLots: '300 mm',
    underOtherAreas: '300 mm',
  },
  {
    method: 'Low Voltage (Class 2)',
    underBuildings: '0 (slab)',
    underRoadways: '450 mm',
    underDriveways: '300 mm',
    underParkingLots: '300 mm',
    underOtherAreas: '150 mm',
  },
]

/* ---------- Calculator lookup ---------- */

interface DepthLookup {
  [method: string]: {
    [location: string]: { mm: number; label: string }
  }
}

const depthLookup: DepthLookup = {
  rmc: {
    buildings: { mm: 0, label: '0 (slab)' },
    roadways: { mm: 600, label: '600 mm' },
    driveways: { mm: 450, label: '450 mm' },
    parking: { mm: 450, label: '450 mm' },
    other: { mm: 450, label: '450 mm' },
  },
  pvc40: {
    buildings: { mm: 0, label: '0 (slab)' },
    roadways: { mm: 600, label: '600 mm' },
    driveways: { mm: 450, label: '450 mm' },
    parking: { mm: 450, label: '450 mm' },
    other: { mm: 450, label: '450 mm' },
  },
  directBurial: {
    buildings: { mm: 0, label: '0 (slab)' },
    roadways: { mm: 900, label: '900 mm' },
    driveways: { mm: 600, label: '600 mm' },
    parking: { mm: 600, label: '600 mm' },
    other: { mm: 600, label: '600 mm' },
  },
  pvcConcrete: {
    buildings: { mm: 0, label: '0 (slab)' },
    roadways: { mm: 450, label: '450 mm' },
    driveways: { mm: 300, label: '300 mm' },
    parking: { mm: 300, label: '300 mm' },
    other: { mm: 300, label: '300 mm' },
  },
  lowVoltage: {
    buildings: { mm: 0, label: '0 (slab)' },
    roadways: { mm: 450, label: '450 mm' },
    driveways: { mm: 300, label: '300 mm' },
    parking: { mm: 300, label: '300 mm' },
    other: { mm: 150, label: '150 mm' },
  },
}

const methodOptions = [
  { value: 'rmc', label: 'Rigid Metal Conduit' },
  { value: 'pvc40', label: 'Rigid PVC (Schedule 40)' },
  { value: 'directBurial', label: 'Direct Burial Cable' },
  { value: 'pvcConcrete', label: 'Rigid PVC with concrete encasement' },
  { value: 'lowVoltage', label: 'Low Voltage (Class 2)' },
]

const locationOptions = [
  { value: 'buildings', label: 'Under Buildings' },
  { value: 'roadways', label: 'Under Roadways' },
  { value: 'driveways', label: 'Under Driveways (Residential)' },
  { value: 'parking', label: 'Under Parking Lots' },
  { value: 'other', label: 'Under Other Areas (Lawn/Garden)' },
]

const locationHeaders = [
  'Under Buildings',
  'Under Roadways',
  'Under Driveways (Residential)',
  'Under Parking Lots',
  'Under Other Areas (Lawn/Garden)',
]

function mmToInches(mm: number): string {
  if (mm === 0) return '0'
  const inches = mm / 25.4
  return fmt(inches, 1)
}

/* ---------- Styles ---------- */

const thStyle: React.CSSProperties = {
  padding: '12px 10px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: 0.3,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  background: 'var(--surface)',
  borderBottom: '2px solid var(--divider)',
  minWidth: 100,
}

const thStickyStyle: React.CSSProperties = {
  ...thStyle,
  position: 'sticky',
  left: 0,
  zIndex: 2,
  textAlign: 'left',
  minWidth: 160,
  background: 'var(--surface)',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 10px',
  fontSize: 14,
  color: 'var(--text)',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--divider)',
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
}

const tdStickyStyle: React.CSSProperties = {
  padding: '12px 10px',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--divider)',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  minWidth: 160,
}

const noteStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'flex-start',
  fontSize: 13,
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
}

const bulletStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: 'var(--primary)',
  marginTop: 7,
}

/* ---------- Component ---------- */

export default function BurialDepthsPage() {
  const [wiringMethod, setWiringMethod] = useState('rmc')
  const [locationType, setLocationType] = useState('roadways')

  const lookup = depthLookup[wiringMethod]?.[locationType]
  const depthMm = lookup?.mm ?? 0
  const depthLabel = lookup?.label ?? '\u2014'
  const depthInches = lookup ? mmToInches(depthMm) : '\u2014'

  return (
    <>
      <Header title="Burial Depths" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 100 }}>

        {/* Reference Table */}
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}>
          Minimum Cover Requirements
        </div>

        <div style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--divider)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                <th style={thStickyStyle}>Wiring Method</th>
                {locationHeaders.map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {burialData.map((entry, i) => {
                const rowBg = i % 2 === 0 ? 'transparent' : 'var(--surface)'
                return (
                  <tr key={entry.method}>
                    <td style={{ ...tdStickyStyle, background: rowBg }}>
                      {entry.method}
                    </td>
                    <td style={{ ...tdStyle, background: rowBg }}>{entry.underBuildings}</td>
                    <td style={{ ...tdStyle, background: rowBg, color: 'var(--primary)' }}>{entry.underRoadways}</td>
                    <td style={{ ...tdStyle, background: rowBg }}>{entry.underDriveways}</td>
                    <td style={{ ...tdStyle, background: rowBg }}>{entry.underParkingLots}</td>
                    <td style={{ ...tdStyle, background: rowBg }}>{entry.underOtherAreas}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Depth Calculator */}
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 8,
        }}>
          Depth Calculator
        </div>

        <SelectField
          label="Wiring Method"
          value={wiringMethod}
          onChange={setWiringMethod}
          options={methodOptions}
        />

        <SelectField
          label="Location Type"
          value={locationType}
          onChange={setLocationType}
          options={locationOptions}
        />

        <ResultDisplay
          results={[
            {
              label: 'Minimum Cover Depth',
              value: depthLabel,
              highlight: true,
            },
            {
              label: 'Imperial Equivalent',
              value: depthMm === 0 ? '0 (slab)' : `${depthInches} in`,
            },
          ]}
        />

        {/* Notes */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>
            Important Notes
          </div>
          <div style={noteStyle}>
            <span style={bulletStyle} />
            <span>Depths measured from finished grade to top of conduit/cable</span>
          </div>
          <div style={noteStyle}>
            <span style={bulletStyle} />
            <span>Add 150 mm (6 in) if subject to vehicular traffic not expected</span>
          </div>
          <div style={noteStyle}>
            <span style={bulletStyle} />
            <span>GFCI protection required for underground installations per Rule 10-002</span>
          </div>
          <div style={noteStyle}>
            <span style={bulletStyle} />
            <span>CEC Rule 12-012 and Table 53</span>
          </div>
        </div>
      </div>
    </>
  )
}
