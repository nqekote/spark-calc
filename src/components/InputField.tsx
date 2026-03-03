import { type InputHTMLAttributes } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  unit?: string
  error?: string
  value: string
  onChange: (v: string) => void
}

export default function InputField({ label, unit, error, value, onChange, ...rest }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex' }}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', height: 'var(--touch-min)',
            background: 'var(--input-bg)',
            border: `2px solid ${error ? 'var(--error)' : 'var(--input-border)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '0 16px',
            paddingRight: unit ? 56 : 16,
            fontSize: 18, fontFamily: 'var(--font-mono)',
            color: 'var(--text)',
            transition: 'border-color .15s',
          }}
          {...rest}
        />
        {unit && (
          <span style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
            pointerEvents: 'none',
          }}>{unit}</span>
        )}
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--error)' }}>{error}</span>}
    </div>
  )
}
