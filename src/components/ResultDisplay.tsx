import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useCalcHistory } from '../core/hooks/useCalcHistory'

interface ResultItem {
  label: string
  value: string
  unit?: string
  highlight?: boolean
}

interface Props {
  results: ResultItem[]
  formula?: string
  /** Calculator name shown in copied/shared text */
  title?: string
}

/** Build clean plain-text from results + formula */
function buildText(results: ResultItem[], formula?: string, title?: string): string {
  const lines: string[] = []
  if (title) lines.push(title + ' \u2014 SparkCalc')
  for (const r of results) {
    if (r.value === '\u2014' || r.value === '') continue
    const unit = r.unit ? ' ' + r.unit : ''
    lines.push(r.label + ': ' + r.value + unit)
  }
  if (formula) {
    lines.push('')
    lines.push(formula)
  }
  return lines.join('\n')
}

/** Copy text with explicit text/plain MIME type to prevent URL encoding */
async function copyPlainText(text: string): Promise<void> {
  // Try ClipboardItem API first — explicit MIME type prevents browsers
  // from reinterpreting the text as a URL (which causes %20 encoding)
  if (typeof ClipboardItem !== 'undefined') {
    try {
      const blob = new Blob([text], { type: 'text/plain' })
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })])
      return
    } catch {
      // Fall through to next method
    }
  }

  // Standard clipboard API
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Fall through to legacy method
    }
  }

  // Legacy fallback
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.cssText = 'position:fixed;left:-9999px;opacity:0'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

const canShare = typeof navigator !== 'undefined' && !!navigator.share

export default function ResultDisplay({ results, formula, title }: Props) {
  const [copied, setCopied] = useState(false)
  const location = useLocation()
  const { addEntry } = useCalcHistory()
  const savedRef = useRef('')

  const text = buildText(results, formula, title)

  // Auto-save to calculation history when results change
  const hasResults = results.some(r => r.value !== '\u2014' && r.value !== '')
  const resultKey = results.map(r => r.value).join('|')
  useEffect(() => {
    if (!hasResults || !title) return
    // Only save if the result is different from what we last saved
    if (savedRef.current === resultKey) return
    savedRef.current = resultKey

    const timer = setTimeout(() => {
      const lines = results
        .filter(r => r.value !== '\u2014' && r.value !== '')
        .map(r => {
          const unit = r.unit ? ' ' + r.unit : ''
          return r.label + ': ' + r.value + unit
        })
      addEntry({
        tool: title,
        path: location.pathname,
        lines,
        formula: formula || undefined,
      })
    }, 800) // debounce 800ms to avoid saving every keystroke
    return () => clearTimeout(timer)
  }, [resultKey, hasResults, title, formula, location.pathname, addEntry, results])

  const handleCopy = useCallback(() => {
    copyPlainText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {
      // Still show feedback even if copy fails
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [text])

  const handleShare = useCallback(() => {
    navigator.share({ text }).catch(() => {})
  }, [text])

  if (results.every(r => r.value === '\u2014' || r.value === '')) return null

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

      {/* Formula + action row */}
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

        <div style={{ display: 'flex', gap: 6, marginLeft: formula ? 0 : 'auto' }}>
          {/* Share button — only on devices that support Web Share API */}
          {canShare && (
            <button onClick={handleShare} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32,
              background: 'var(--surface-hover)',
              border: '1px solid var(--divider)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }} aria-label="Share results">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1={12} y1={2} x2={12} y2={15} />
              </svg>
            </button>
          )}

          {/* Copy button */}
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
    </div>
  )
}
