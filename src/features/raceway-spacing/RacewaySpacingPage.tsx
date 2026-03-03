import { useState } from 'react'
import Header from '../../layout/Header'

/* ---------- Data ---------- */

interface SpacingEntry {
  method: string
  maxSpacing: string
  withinFromBox: string
}

interface SpacingGroup {
  title: string
  columns: string[]
  entries: SpacingEntry[]
}

const spacingData: SpacingGroup[] = [
  {
    title: 'Raceways',
    columns: ['Wiring Method', 'Max Support Spacing', 'Within from Box/Fitting'],
    entries: [
      { method: 'EMT - 1/2" to 1"', maxSpacing: '1.5 m (5 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'EMT - 1-1/4" and larger', maxSpacing: '1.5 m (5 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'Rigid Metal Conduit (RMC) - 1/2" to 3/4"', maxSpacing: '3 m (10 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'Rigid Metal Conduit (RMC) - 1" and larger', maxSpacing: '3 m (10 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'Rigid PVC Conduit - 1/2" to 1"', maxSpacing: '1.5 m (5 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'Rigid PVC Conduit - 1-1/4" to 2"', maxSpacing: '1.5 m (5 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'Rigid PVC Conduit - 2-1/2" to 3"', maxSpacing: '1.8 m (6 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'Rigid PVC Conduit - 3-1/2" to 5"', maxSpacing: '2.1 m (7 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'Rigid PVC Conduit - 6"', maxSpacing: '2.4 m (8 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'Flexible Metal Conduit (FMC)', maxSpacing: '1.5 m (5 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'Liquid-tight Flexible', maxSpacing: '1.5 m (5 ft)', withinFromBox: '300 mm (12 in)' },
    ],
  },
  {
    title: 'Cables',
    columns: ['Cable Type', 'Max Support Spacing', 'Within from Box'],
    entries: [
      { method: 'NMD90 (Romex)', maxSpacing: '1.5 m (5 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'AC90 (BX/Armoured)', maxSpacing: '1.5 m (5 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'TECK90', maxSpacing: '1.8 m (6 ft)', withinFromBox: '300 mm (12 in)' },
      { method: 'NMS', maxSpacing: '1.5 m (5 ft)', withinFromBox: '300 mm (12 in)' },
    ],
  },
  {
    title: 'Other',
    columns: ['Item', 'Max Spacing', ''],
    entries: [
      { method: 'Cable Tray - Ladder Type', maxSpacing: '2.4 m (8 ft)', withinFromBox: '' },
      { method: 'Cable Tray - Solid Bottom', maxSpacing: '1.5 m (5 ft)', withinFromBox: '' },
      { method: 'Busway/Bus Duct', maxSpacing: 'per manufacturer', withinFromBox: '' },
      { method: 'Strut Channel (Unistrut)', maxSpacing: '1.8 m (6 ft)', withinFromBox: '' },
    ],
  },
]

function matchesSearch(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase())
}

/* ---------- Styles ---------- */

const tableContainerStyle: React.CSSProperties = {
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--divider)',
}

const thStyle: React.CSSProperties = {
  padding: '12px 14px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  background: 'var(--surface)',
  borderBottom: '2px solid var(--divider)',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 14px',
  fontSize: 14,
  color: 'var(--text)',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--divider)',
}

const groupTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 8,
}

/* ---------- Component ---------- */

export default function RacewaySpacingPage() {
  const [search, setSearch] = useState('')

  const q = search.trim()

  const filteredGroups = spacingData.map(group => ({
    ...group,
    entries: group.entries.filter(
      entry => !q || matchesSearch(entry.method + ' ' + entry.maxSpacing + ' ' + entry.withinFromBox, q)
    ),
  })).filter(group => group.entries.length > 0)

  const noResults = filteredGroups.length === 0 && q.length > 0

  return (
    <>
      <Header title="Raceway Spacing" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 100 }}>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search wiring methods..."
            style={{
              width: '100%',
              height: 56,
              background: 'var(--input-bg)',
              border: '2px solid var(--input-border)',
              borderRadius: 'var(--radius)',
              padding: '0 16px 0 44px',
              fontSize: 16,
              color: 'var(--text)',
            }}
          />
        </div>

        {noResults && (
          <div style={{
            textAlign: 'center',
            padding: '32px 16px',
            color: 'var(--text-secondary)',
            fontSize: 14,
          }}>
            No results found for &ldquo;{q}&rdquo;
          </div>
        )}

        {/* Grouped tables */}
        {filteredGroups.map(group => {
          const showThirdCol = group.columns[2] !== ''

          return (
            <div key={group.title}>
              <div style={groupTitleStyle}>{group.title}</div>
              <div style={tableContainerStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: showThirdCol ? 520 : 380 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>{group.columns[0]}</th>
                      <th style={thStyle}>{group.columns[1]}</th>
                      {showThirdCol && <th style={thStyle}>{group.columns[2]}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {group.entries.map((entry, i) => (
                      <tr
                        key={entry.method}
                        style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}
                      >
                        <td style={{ ...tdStyle, fontWeight: 500, minWidth: 180 }}>
                          {entry.method}
                        </td>
                        <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                          {entry.maxSpacing}
                        </td>
                        {showThirdCol && (
                          <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>
                            {entry.withinFromBox}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}

        {/* Note */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>
            CEC Rules 12-1210 through 12-1220
          </div>
          Always verify with your local AHJ. Horizontal runs may have different requirements.
        </div>
      </div>
    </>
  )
}
