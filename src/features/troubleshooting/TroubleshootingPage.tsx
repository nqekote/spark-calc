import { useState, useEffect } from 'react'
import Header from '../../layout/Header'
import type { TabKey, TroubleshootingItem, TroubleshootingSection } from './troubleshootingTypes'
import {
  symptomSections,
  motorSections,
  controlSections,
  powerSections,
  groundingSections,
  cableDistSections,
  equipmentSections,
  toolsSections,
} from './troubleshootingData'

/* ------------------------------------------------------------------ */
/*  Tabs configuration                                                 */
/* ------------------------------------------------------------------ */

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'symptoms', label: 'Symptoms', icon: '\uD83D\uDD0D' },
  { key: 'motors', label: 'Motors', icon: '\u2699' },
  { key: 'controls', label: 'Controls', icon: '\u229E' },
  { key: 'power', label: 'Power', icon: '\u26A1' },
  { key: 'grounding', label: 'Grounding', icon: '\u23DA' },
  { key: 'cables', label: 'Cables & Dist', icon: '\uD83D\uDD0C' },
  { key: 'equipment', label: 'Equipment', icon: '\u26CF' },
  { key: 'tools', label: 'Tools & Tips', icon: '\uD83D\uDD27' },
]

const sectionsByTab: Record<TabKey, TroubleshootingSection[]> = {
  symptoms: symptomSections,
  motors: motorSections,
  controls: controlSections,
  power: powerSections,
  grounding: groundingSections,
  cables: cableDistSections,
  equipment: equipmentSections,
  tools: toolsSections,
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
}

const pillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 48,
  padding: '0 16px',
  borderRadius: 24,
  fontSize: 13,
  fontWeight: 600,
  border: '2px solid var(--divider)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  whiteSpace: 'nowrap',
}

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: 'var(--primary)',
  color: '#000',
  border: '2px solid var(--primary)',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function CollapsibleCard({ item }: { item: TroubleshootingItem }) {
  const [open, setOpen] = useState(false)

  const borderColor =
    item.severity === 'critical' ? '#ff3c3c' :
    item.severity === 'warning' ? '#ff8c00' :
    item.severity === 'info' ? 'var(--primary)' :
    'var(--divider)'

  const headerBg =
    item.severity === 'critical' ? 'rgba(255, 60, 60, 0.08)' :
    item.severity === 'warning' ? 'rgba(255, 140, 0, 0.08)' :
    undefined

  return (
    <div style={{ ...cardStyle, borderLeft: `4px solid ${borderColor}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '14px 14px',
          minHeight: 56,
          background: headerBg || 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          {item.severity === 'critical' && (
            <span style={{ color: '#ff3c3c', fontSize: 16, flexShrink: 0 }}>{'\u26A0'}</span>
          )}
          {item.severity === 'warning' && (
            <span style={{ color: '#ff8c00', fontSize: 16, flexShrink: 0 }}>{'\u25B2'}</span>
          )}
          {item.severity === 'info' && (
            <span style={{ color: 'var(--primary)', fontSize: 16, flexShrink: 0 }}>{'\u2139'}</span>
          )}
          <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{item.title}</span>
        </div>
        <svg
          width={20} height={20} viewBox="0 0 24 24"
          fill="none" stroke="var(--text-secondary)" strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Flow steps */}
          {item.steps && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {item.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--primary)', color: '#000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    {i < item.steps!.length - 1 && (
                      <div style={{
                        width: 2, height: 16,
                        background: 'var(--divider)',
                      }} />
                    )}
                  </div>
                  <div style={{
                    fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
                    paddingTop: 3, paddingBottom: i < item.steps!.length - 1 ? 8 : 0,
                  }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-items */}
          {item.subItems && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {item.subItems.map((si, i) => (
                <div key={i} style={{
                  background: 'var(--input-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  borderLeft: `3px solid ${si.color || 'var(--primary)'}`,
                }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: si.color || 'var(--primary)',
                    marginBottom: 4,
                  }}>
                    {si.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {si.detail}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          {item.table && (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{
                width: '100%', borderCollapse: 'collapse', fontSize: 13,
                minWidth: item.table.headers.length > 3 ? 500 : undefined,
              }}>
                <thead>
                  <tr>
                    {item.table.headers.map((h, i) => (
                      <th key={i} style={{
                        textAlign: 'left', padding: '8px 10px',
                        background: 'var(--input-bg)',
                        color: 'var(--primary)',
                        fontWeight: 700, fontSize: 12,
                        borderBottom: '2px solid var(--divider)',
                        whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.table.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: '8px 10px',
                          borderBottom: '1px solid var(--divider)',
                          color: ci === 0 ? 'var(--text)' : 'var(--text-secondary)',
                          fontWeight: ci === 0 ? 600 : 400,
                          fontFamily: ci === 0 ? 'var(--font-mono)' : undefined,
                          lineHeight: 1.5,
                          whiteSpace: ci === 0 ? 'nowrap' : undefined,
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Notes */}
          {item.notes && item.notes !== 'USE_CALCULATOR' && (
            <div style={{
              background: item.severity === 'critical'
                ? 'rgba(255, 60, 60, 0.08)'
                : 'rgba(255, 215, 0, 0.08)',
              border: item.severity === 'critical'
                ? '1px solid rgba(255, 60, 60, 0.2)'
                : '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              fontSize: 13,
              color: 'var(--text)',
              lineHeight: 1.6,
            }}>
              <strong style={{
                color: item.severity === 'critical' ? '#ff3c3c' : 'var(--primary)',
              }}>
                {item.severity === 'critical' ? '\u26A0 CRITICAL: ' : '\u2139 Note: '}
              </strong>
              {item.notes}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Voltage Unbalance Calculator                                       */
/* ------------------------------------------------------------------ */

function VoltageUnbalanceCalc() {
  const [vAB, setVAB] = useState('')
  const [vBC, setVBC] = useState('')
  const [vCA, setVCA] = useState('')

  const a = parseFloat(vAB)
  const b = parseFloat(vBC)
  const c = parseFloat(vCA)
  const allValid = !isNaN(a) && !isNaN(b) && !isNaN(c) && a > 0 && b > 0 && c > 0

  let avg = 0
  let maxDev = 0
  let pctUnbalance = 0
  let status: 'good' | 'caution' | 'bad' = 'good'
  let statusLabel = ''
  let statusColor = '#4caf50'

  if (allValid) {
    avg = (a + b + c) / 3
    maxDev = Math.max(Math.abs(a - avg), Math.abs(b - avg), Math.abs(c - avg))
    pctUnbalance = (maxDev / avg) * 100

    if (pctUnbalance <= 1) {
      status = 'good'
      statusLabel = 'Excellent'
      statusColor = '#4caf50'
    } else if (pctUnbalance <= 2) {
      status = 'caution'
      statusLabel = 'Acceptable (<2%)'
      statusColor = 'var(--primary)'
    } else if (pctUnbalance <= 5) {
      status = 'caution'
      statusLabel = 'Investigate & Correct'
      statusColor = '#ff8c00'
    } else {
      status = 'bad'
      statusLabel = 'CRITICAL \u2014 Do Not Run Motors'
      statusColor = '#ff3c3c'
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 56,
    padding: '0 16px',
    background: 'var(--input-bg)',
    border: '2px solid var(--input-border)',
    borderRadius: 'var(--radius)',
    fontSize: 16,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
  }

  return (
    <div style={{
      ...cardStyle,
      borderLeft: '4px solid var(--primary)',
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
        {'\u26A1'} Voltage Unbalance Calculator
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        Enter your three phase-to-phase voltage readings:
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            V<sub>AB</sub> (L1-L2)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={vAB}
            onChange={e => setVAB(e.target.value)}
            placeholder="480"
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            V<sub>BC</sub> (L2-L3)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={vBC}
            onChange={e => setVBC(e.target.value)}
            placeholder="475"
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            V<sub>CA</sub> (L3-L1)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={vCA}
            onChange={e => setVCA(e.target.value)}
            placeholder="483"
            style={inputStyle}
          />
        </div>
      </div>

      {allValid && (
        <div style={{
          background: status === 'bad' ? 'rgba(255, 60, 60, 0.1)' :
            status === 'caution' ? 'rgba(255, 215, 0, 0.08)' :
            'rgba(76, 175, 80, 0.1)',
          border: `1px solid ${statusColor}40`,
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Average Voltage</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              {avg.toFixed(1)} V
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Max Deviation</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              {maxDev.toFixed(1)} V
            </span>
          </div>
          <div style={{ height: 1, background: 'var(--divider)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>% Unbalance</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: statusColor, fontFamily: 'var(--font-mono)' }}>
              {pctUnbalance.toFixed(2)}%
            </span>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: `${statusColor}20`,
            fontSize: 14,
            fontWeight: 700,
            color: statusColor,
          }}>
            {statusLabel}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function TroubleshootingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('symptoms')
  const [search, setSearch] = useState('')

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  const currentSections = sectionsByTab[activeTab]

  // Filter sections based on search
  const filteredSections = search.trim()
    ? currentSections
        .map(section => ({
          ...section,
          items: section.items.filter(item => {
            const q = search.toLowerCase()
            const inTitle = item.title.toLowerCase().includes(q)
            const inSteps = item.steps?.some(s => s.toLowerCase().includes(q))
            const inNotes = item.notes?.toLowerCase().includes(q)
            const inSubs = item.subItems?.some(
              si => si.label.toLowerCase().includes(q) || si.detail.toLowerCase().includes(q)
            )
            const inHeading = section.heading.toLowerCase().includes(q)
            return inTitle || inSteps || inNotes || inSubs || inHeading
          }),
        }))
        .filter(section => section.items.length > 0)
    : currentSections

  return (
    <>
      <Header title="Troubleshooting" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Warning banner */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.08)',
          border: '1px solid rgba(255, 215, 0, 0.25)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{'\uD83D\uDD27'}</span>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
            <strong>Field troubleshooting guide.</strong> Always follow lockout/tagout procedures,
            verify de-energization before testing, and wear appropriate PPE. When in doubt, stop and reassess.
          </div>
        </div>

        {/* Tab pills */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button
              key={t.key}
              style={activeTab === t.key ? pillActive : pillBase}
              onClick={() => { setActiveTab(t.key); setSearch('') }}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg
            width={18} height={18} viewBox="0 0 24 24"
            fill="none" stroke="var(--text-secondary)" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${tabs.find(t => t.key === activeTab)?.label.toLowerCase()} troubleshooting...`}
            style={{
              width: '100%', boxSizing: 'border-box',
              minHeight: 56, padding: '0 16px 0 44px',
              background: 'var(--input-bg)',
              border: '2px solid var(--input-border)',
              borderRadius: 'var(--radius)',
              fontSize: 16, color: 'var(--text)',
            }}
          />
        </div>

        {/* Content */}
        {filteredSections.map((section, si) => (
          <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--primary)',
              textTransform: 'uppercase', letterSpacing: 0.5,
              paddingTop: si > 0 ? 4 : 0,
            }}>
              {section.heading}
            </div>
            {section.items.map((item, ii) => {
              // Special case: voltage unbalance calculator
              if (item.notes === 'USE_CALCULATOR') {
                return <VoltageUnbalanceCalc key={ii} />
              }
              return <CollapsibleCard key={ii} item={item} />
            })}
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div style={{
            padding: '32px 16px', textAlign: 'center',
            color: 'var(--text-secondary)', fontSize: 15,
          }}>
            No results match &quot;{search}&quot;
          </div>
        )}

        {/* Legend */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: '#ff3c3c', fontSize: 14 }}>{'\u26A0'}</span>
            <span><strong>Critical</strong> &mdash; safety hazard or immediate damage risk</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: '#ff8c00', fontSize: 14 }}>{'\u25B2'}</span>
            <span><strong>Warning</strong> &mdash; common failure point, proceed carefully</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: 'var(--primary)', fontSize: 14 }}>{'\u2139'}</span>
            <span><strong>Info</strong> &mdash; key reference or procedure</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#4caf50', fontSize: 14 }}>{'\u25CF'}</span>
            <span><strong>Solution</strong> &mdash; resolution or fix</span>
          </div>
        </div>

        {/* References */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong> CEC (Canadian Electrical Code),
          O. Reg. 854 (Mines and Mining Plants), CSA Z462 (Workplace Electrical Safety),
          IEEE 519 (Harmonic Control), NFPA 70B (Electrical Equipment Maintenance),
          CSA B72 (Lightning Protection Systems)
        </div>
      </div>
    </>
  )
}
