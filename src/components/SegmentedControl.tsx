interface Props {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}

export default function SegmentedControl({ options, value, onChange }: Props) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      background: 'var(--input-bg)',
      borderRadius: 'var(--radius-sm)',
      padding: 4,
    }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          flex: 1, height: 44,
          borderRadius: 6, fontSize: 14, fontWeight: 600,
          background: value === o.value ? 'var(--primary)' : 'transparent',
          color: value === o.value ? '#000' : 'var(--text-secondary)',
          transition: 'all .15s',
          border: 'none',
        }}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
