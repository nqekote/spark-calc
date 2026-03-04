import { useState } from 'react'
import Header from '../../layout/Header'

/* ---------- Data ---------- */

interface TorqueEntry {
  item: string
  detail: string
  torqueInLb: string
  torqueNm: string
  notes?: string
}

interface TorqueGroup {
  title: string
  columns: string[]
  entries: TorqueEntry[]
}

const torqueData: TorqueGroup[] = [
  {
    title: 'Wire Terminations',
    columns: ['Wire Size', 'Screw Type', 'Torque (in-lb)', 'Torque (N\·m)'],
    entries: [
      { item: '14 AWG', detail: '#6 screw', torqueInLb: '7', torqueNm: '0.8' },
      { item: '12 AWG', detail: '#6 screw', torqueInLb: '7', torqueNm: '0.8' },
      { item: '10 AWG', detail: '#8 screw', torqueInLb: '9', torqueNm: '1.0' },
      { item: '8 AWG', detail: '#10 screw', torqueInLb: '20', torqueNm: '2.3' },
      { item: '6 AWG', detail: '#10 screw', torqueInLb: '20', torqueNm: '2.3' },
      { item: '4 AWG', detail: '1/4" bolt', torqueInLb: '36', torqueNm: '4.1' },
      { item: '3 AWG', detail: '1/4" bolt', torqueInLb: '36', torqueNm: '4.1' },
      { item: '2 AWG', detail: '1/4" bolt', torqueInLb: '36', torqueNm: '4.1' },
      { item: '1 AWG', detail: '3/8" bolt', torqueInLb: '60', torqueNm: '6.8' },
      { item: '1/0 AWG', detail: '3/8" bolt', torqueInLb: '60', torqueNm: '6.8' },
      { item: '2/0 AWG', detail: '3/8" bolt', torqueInLb: '60', torqueNm: '6.8' },
      { item: '3/0 AWG', detail: '1/2" bolt', torqueInLb: '85', torqueNm: '9.6' },
      { item: '4/0 AWG', detail: '1/2" bolt', torqueInLb: '85', torqueNm: '9.6' },
      { item: '250 kcmil', detail: '1/2" bolt', torqueInLb: '100', torqueNm: '11.3' },
      { item: '300-500 kcmil', detail: '1/2" bolt', torqueInLb: '100', torqueNm: '11.3' },
    ],
  },
  {
    title: 'Panel/Breaker Connections',
    columns: ['Device', '', 'Torque (in-lb)', 'Torque (N\·m)'],
    entries: [
      { item: '15/20A breaker', detail: '', torqueInLb: '20-25', torqueNm: '2.3-2.8' },
      { item: '30A breaker', detail: '', torqueInLb: '25-30', torqueNm: '2.8-3.4' },
      { item: '40-60A breaker', detail: '', torqueInLb: '35-45', torqueNm: '4.0-5.1' },
      { item: '100A breaker', detail: '', torqueInLb: '50-75', torqueNm: '5.6-8.5' },
      { item: '200A breaker', detail: '', torqueInLb: '100-125', torqueNm: '11.3-14.1' },
      { item: 'Neutral/Ground bar #14-#10', detail: '', torqueInLb: '20', torqueNm: '2.3' },
      { item: 'Neutral/Ground bar #8-#6', detail: '', torqueInLb: '25', torqueNm: '2.8' },
      { item: 'Neutral/Ground bar #4-#1', detail: '', torqueInLb: '35', torqueNm: '4.0' },
      { item: 'Main lugs (varies by mfr)', detail: '', torqueInLb: 'Per manufacturer', torqueNm: 'Per manufacturer' },
    ],
  },
  {
    title: 'Receptacles & Switches',
    columns: ['Device', '', 'Torque (in-lb)', 'Torque (N\·m)'],
    entries: [
      { item: 'Receptacle terminal screws', detail: '', torqueInLb: '12', torqueNm: '1.4' },
      { item: 'Switch terminal screws', detail: '', torqueInLb: '12', torqueNm: '1.4' },
      { item: 'GFCI terminal screws', detail: '', torqueInLb: '12-14', torqueNm: '1.4-1.6' },
      { item: 'Device mounting screws', detail: '', torqueInLb: '8-10', torqueNm: '0.9-1.1' },
      { item: 'Cover plate screws', detail: '', torqueInLb: '4-5', torqueNm: '0.5-0.6' },
    ],
  },
  {
    title: 'Conduit Connections',
    columns: ['Connection', '', 'Torque', 'Notes'],
    entries: [
      { item: 'EMT set screw connectors', detail: '', torqueInLb: 'Hand tight + 1/4 turn', torqueNm: 'Use proper tool' },
      { item: 'EMT compression connectors', detail: '', torqueInLb: 'Per manufacturer', torqueNm: 'Typically wrench tight' },
      { item: 'Rigid conduit fittings', detail: '', torqueInLb: 'Wrench tight', torqueNm: '3 turns past hand tight' },
      { item: 'Ground bushings', detail: '', torqueInLb: 'Per manufacturer', torqueNm: 'Must be tight' },
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
  padding: '12px 12px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: 0.3,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  background: 'var(--surface)',
  borderBottom: '2px solid var(--divider)',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 12px',
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

export default function TorqueSpecsPage() {
  const [search, setSearch] = useState('')

  const q = search.trim()

  const filteredGroups = torqueData.map(group => ({
    ...group,
    entries: group.entries.filter(
      entry =>
        !q ||
        matchesSearch(
          entry.item + ' ' + entry.detail + ' ' + entry.torqueInLb + ' ' + entry.torqueNm + ' ' + (entry.notes || ''),
          q
        )
    ),
  })).filter(group => group.entries.length > 0)

  const noResults = filteredGroups.length === 0 && q.length > 0

  return (
    <>
      <Header title="Torque Specs" />
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
            placeholder="Search torque specs..."
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
          const hasDetailCol = group.columns[1] !== ''

          return (
            <div key={group.title}>
              <div style={groupTitleStyle}>{group.title}</div>
              <div style={tableContainerStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: hasDetailCol ? 520 : 420 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>{group.columns[0]}</th>
                      {hasDetailCol && <th style={thStyle}>{group.columns[1]}</th>}
                      <th style={thStyle}>{group.columns[2]}</th>
                      <th style={thStyle}>{group.columns[3]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.entries.map((entry, i) => (
                      <tr
                        key={entry.item + i}
                        style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}
                      >
                        <td style={{ ...tdStyle, fontWeight: 500, minWidth: 140 }}>
                          {entry.item}
                        </td>
                        {hasDetailCol && (
                          <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                            {entry.detail}
                          </td>
                        )}
                        <td style={{
                          ...tdStyle,
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: 'var(--primary)',
                        }}>
                          {entry.torqueInLb}
                        </td>
                        <td style={{
                          ...tdStyle,
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                        }}>
                          {entry.torqueNm}
                        </td>
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
          padding: '14px 14px',
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>
            Important
          </div>
          Always follow manufacturer's specifications. These are general guidelines. Over-torquing can damage equipment.
        </div>
      </div>
    </>
  )
}
