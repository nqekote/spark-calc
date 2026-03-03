interface Option { value: string; label: string }

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  options: Option[]
}

export default function SelectField({ label, value, onChange, options }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', height: 'var(--touch-min)',
          background: 'var(--input-bg)',
          border: '2px solid var(--input-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0 16px', fontSize: 16,
          color: 'var(--text)',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23a0a0b0'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
