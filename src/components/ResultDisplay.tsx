import { useState, useCallback } from 'react'

interface ResultItem {
  label: string
  value: string
  unit?: string
  highlight?: boolean
}

export default function ResultDisplay({ results, formula }: { results: ResultItem[]; formula?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const lines = results
      .filter(r => r.value !== '—' && r.value !== '')
      .map(r => `${r.label}: ${r.value}${r.unit ? ' ' + r.unit : ''}`)
    if (formula) lines.push(formula)
    const text = lines.join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [results, formula])

  if (results.every(r => r.value === '—' || r.value === '')) return null

  return (
    <div style={{
      background: 'var(--surface)',
      border: '2px solid var(--primary)',
      borderRadius: 'var(--radius)',
      padding: 16, marginTop: 8,
    }}>
      <div style={{ display: 'grid', gap: 12 }}>
        {results.map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{r.label}</span>
            <span style={{
              fontSize: r.highlight ? 28 : 22, fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: r.highlight ? 'var(--primary)' : 'var(--text)',
            }}>
              {r.value}{r.unit && <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4, color: 'var(--text-secondary)' }}>{r.unit}</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Formula + Copy row */}
      <div style={{
        marginTop: 12, paddingTop: 12,
        borderTop: '1px solid var(--divider)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {formula && (
          <div style={{
            flex: 1, fontSize: 13, color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{formula}</div>
        )}
        <button onClick={handleCopy} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '6px 12px',
          fontSize: 12, fontWeight: 600,
          fontFamily: 'var(--font-display)',
          background: copied ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface-hover)',
          border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.3)' : 'var(--divider)'}`,
          borderRadius: 'var(--radius-full)',
          color: copied ? 'var(--success)' : 'var(--text-secondary)',
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'all 150ms ease',
          marginLeft: formula ? 0 : 'auto',
          minHeight: 32,
        }}>
          {copied ? (
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x={9} y={9} width={13} height={13} rx={2} />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
