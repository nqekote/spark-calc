import { useState } from 'react'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'

const materialOptions = [
  { value: 'copper', label: 'Copper' },
  { value: 'aluminum', label: 'Aluminum' },
]

// CEC Table 17 - Minimum Size of Bonding Conductor
const table17: { ocp: number; copper: string; aluminum: string }[] = [
  { ocp: 15, copper: '14', aluminum: '12' },
  { ocp: 20, copper: '12', aluminum: '10' },
  { ocp: 30, copper: '10', aluminum: '8' },
  { ocp: 40, copper: '10', aluminum: '8' },
  { ocp: 60, copper: '10', aluminum: '8' },
  { ocp: 100, copper: '8', aluminum: '6' },
  { ocp: 200, copper: '6', aluminum: '4' },
  { ocp: 300, copper: '4', aluminum: '2' },
  { ocp: 400, copper: '3', aluminum: '1' },
  { ocp: 500, copper: '2', aluminum: '1/0' },
  { ocp: 600, copper: '1', aluminum: '2/0' },
  { ocp: 800, copper: '1/0', aluminum: '3/0' },
  { ocp: 1000, copper: '2/0', aluminum: '4/0' },
  { ocp: 1200, copper: '3/0', aluminum: '250' },
  { ocp: 1600, copper: '4/0', aluminum: '350' },
  { ocp: 2000, copper: '250', aluminum: '400' },
  { ocp: 2500, copper: '350', aluminum: '600' },
  { ocp: 3000, copper: '400', aluminum: '600' },
  { ocp: 4000, copper: '500', aluminum: '800' },
  { ocp: 5000, copper: '700', aluminum: '1000' },
  { ocp: 6000, copper: '800', aluminum: '1200' },
]

const ocpOptions = table17.map(row => ({
  value: String(row.ocp),
  label: `${row.ocp} A`,
}))

function formatSize(s: string): string {
  const num = parseInt(s)
  if (s.includes('/')) return `${s} AWG`
  if (num >= 250) return `${s} kcmil`
  return `${s} AWG`
}

export default function GroundingConductorPage() {
  const [ocpRating, setOcpRating] = useState('100')
  const [material, setMaterial] = useState('copper')

  const selectedRow = table17.find(r => String(r.ocp) === ocpRating)
  const conductorSize = selectedRow
    ? material === 'copper' ? selectedRow.copper : selectedRow.aluminum
    : null

  const results = conductorSize
    ? [
        {
          label: 'Minimum Bonding Conductor',
          value: formatSize(conductorSize),
          highlight: true,
        },
        {
          label: 'Material',
          value: material === 'copper' ? 'Copper' : 'Aluminum',
        },
        {
          label: 'OCP Device Rating',
          value: `${ocpRating} A`,
        },
      ]
    : [
        { label: 'Minimum Bonding Conductor', value: '\u2014' },
      ]

  return (
    <>
      <Header title="Grounding Conductor" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 100 }}>
        <SegmentedControl options={materialOptions} value={material} onChange={setMaterial} />

        <SelectField
          label="OCP Device Rating"
          value={ocpRating}
          onChange={setOcpRating}
          options={ocpOptions}
        />

        <ResultDisplay results={results} />

        {/* CEC Table 17 Reference */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            borderBottom: '1px solid var(--divider)',
          }}>
            CEC Table 17 \u2014 Bonding Conductor Sizes
          </div>

          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            borderBottom: '1px solid var(--divider)',
            background: 'var(--input-bg)',
          }}>
            <span>OCP (A)</span>
            <span style={{ textAlign: 'center' }}>Copper</span>
            <span style={{ textAlign: 'right' }}>Aluminum</span>
          </div>

          {/* Table rows */}
          {table17.map((row, i) => {
            const isSelected = String(row.ocp) === ocpRating
            return (
              <div
                key={row.ocp}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  padding: '10px 14px',
                  fontSize: 14,
                  fontFamily: 'var(--font-mono)',
                  borderBottom: i < table17.length - 1 ? '1px solid var(--divider)' : undefined,
                  background: isSelected ? 'rgba(var(--primary-rgb, 255,193,7), 0.1)' : undefined,
                  color: isSelected ? 'var(--primary)' : 'var(--text)',
                  fontWeight: isSelected ? 700 : 400,
                  minHeight: 44,
                  alignItems: 'center',
                }}
              >
                <span>{row.ocp}</span>
                <span style={{ textAlign: 'center' }}>{formatSize(row.copper)}</span>
                <span style={{ textAlign: 'right' }}>{formatSize(row.aluminum)}</span>
              </div>
            )
          })}
        </div>

        <InfoBox title="CEC Table 17 \u2014 Bonding Conductors">
          The bonding conductor must not be smaller than the values shown. For circuits
          with multiple conduit runs, each run requires its own bonding conductor.
          CEC Rule 10-614.
        </InfoBox>
      </div>
    </>
  )
}
