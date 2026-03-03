interface ResultItem {
  label: string
  value: string
  unit?: string
  highlight?: boolean
}

export default function ResultDisplay({ results, formula }: { results: ResultItem[]; formula?: string }) {
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
      {formula && (
        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: '1px solid var(--divider)',
          fontSize: 13, color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}>{formula}</div>
      )}
    </div>
  )
}
