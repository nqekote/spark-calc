import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../layout/Header'
import { useCalcHistory, type HistoryEntry } from '../../core/hooks/useCalcHistory'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

export default function HistoryPage() {
  const { history, clearHistory } = useCalcHistory()
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  return (
    <>
      <Header title="Calc History" />
      <div style={{ padding: '16px 16px 32px' }}>
        {/* Header row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: 'var(--primary)',
            background: 'var(--primary-subtle)',
            padding: '5px 12px', borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-display)', letterSpacing: '0.3px',
          }}>
            {history.length} calculation{history.length !== 1 ? 's' : ''}
          </div>
          {history.length > 0 && (
            <button
              onClick={() => { if (confirm('Clear all calculation history?')) clearHistory() }}
              style={{
                fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-display)', padding: '5px 12px',
                borderRadius: 'var(--radius-full)', border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {history.length === 0 && (
          <div style={{
            padding: '64px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{
              fontSize: 16, fontWeight: 600, color: 'var(--text)',
              fontFamily: 'var(--font-display)', marginBottom: 6,
            }}>
              No calculations yet
            </div>
            <div style={{
              fontSize: 14, color: 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
            }}>
              Use any calculator and your results will appear here automatically.
            </div>
          </div>
        )}

        {/* History list */}
        <div style={{ display: 'grid', gap: 8 }}>
          {history.map((entry: HistoryEntry, i: number) => {
            const isExpanded = expandedIdx === i
            return (
              <div key={entry.ts + i} style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--divider)',
                overflow: 'hidden',
              }}>
                {/* Summary row — tappable */}
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', width: '100%', textAlign: 'left',
                    background: 'transparent',
                    minHeight: 56,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600, color: 'var(--text)',
                      fontFamily: 'var(--font-display)',
                    }}>
                      {entry.tool}
                    </div>
                    <div style={{
                      fontSize: 12, color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginTop: 2,
                    }}>
                      {entry.lines[0]}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-display)', fontWeight: 500,
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    {timeAgo(entry.ts)}
                  </div>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                    stroke="var(--text-tertiary)" strokeWidth={2.5} strokeLinecap="round"
                    style={{
                      transition: 'transform 200ms ease',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                      flexShrink: 0,
                    }}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{
                    padding: '0 14px 14px',
                    borderTop: '1px solid var(--divider)',
                  }}>
                    <div style={{
                      display: 'grid', gap: 6, marginTop: 12,
                    }}>
                      {entry.lines.map((line, j) => (
                        <div key={j} style={{
                          fontSize: 13, color: 'var(--text)',
                          fontFamily: 'var(--font-mono)',
                          padding: '6px 10px',
                          background: 'var(--surface-elevated)',
                          borderRadius: 'var(--radius-sm)',
                        }}>
                          {line}
                        </div>
                      ))}
                    </div>
                    {entry.formula && (
                      <div style={{
                        fontSize: 12, color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        marginTop: 8, padding: '6px 10px',
                        background: 'var(--primary-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {entry.formula}
                      </div>
                    )}
                    <Link to={entry.path} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      marginTop: 10, fontSize: 12, fontWeight: 600,
                      color: 'var(--primary)', fontFamily: 'var(--font-display)',
                      textDecoration: 'none',
                    }}>
                      Open {entry.tool}
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
