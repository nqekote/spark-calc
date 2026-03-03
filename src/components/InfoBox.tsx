import { useState, type ReactNode } from 'react'

export default function InfoBox({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--divider)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden', marginTop: 8,
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 14px', minHeight: 44,
        color: 'var(--text-secondary)', fontSize: 13,
      }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        {title}
        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 'auto', transform: open ? 'rotate(180deg)' : '', transition: 'transform .2s' }}><path d="M7 10l5 5 5-5z"/></svg>
      </button>
      {open && <div style={{ padding: '0 14px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{children}</div>}
    </div>
  )
}
