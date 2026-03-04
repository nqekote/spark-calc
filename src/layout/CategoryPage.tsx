import { Link } from 'react-router-dom'
import Header from './Header'

export interface CalcItem {
  to: string
  title: string
  subtitle: string
  icon: string
}

/* accent colour by category title */
const catAccents: Record<string, string> = {
  Electrical: '#ffd700',
  Conduit: '#ffd700',
  'Wire & Protection': '#4fc3f7',
  Motors: '#66bb6a',
  Reference: '#ab47bc',
  Safety: '#ef5350',
  Mining: '#ff9800',
  Tools: '#78909c',
  'Installation Guides': '#26c6da',
}

export default function CategoryPage({ title, items }: { title: string; items: CalcItem[] }) {
  const accent = catAccents[title] || 'var(--primary)'

  return (
    <>
      <Header title={title} />
      <style>{`.cat-item:active { transform: scale(0.98); background: var(--surface-hover) !important; }`}</style>
      <div style={{ padding: 16, display: 'grid', gap: 8 }}>
        {/* Feature count badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 4,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: accent,
            background: accent + '18',
            padding: '4px 10px', borderRadius: 6,
          }}>
            {items.length} tool{items.length !== 1 ? 's' : ''}
          </div>
        </div>

        {items.map(item => (
          <Link key={item.to} to={item.to} className="cat-item" style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--surface)', borderRadius: 12,
            padding: '16px 16px',
            textDecoration: 'none',
            border: '1px solid var(--divider)',
            borderLeft: `3px solid ${accent}`,
            transition: 'background .15s, transform .1s',
            minHeight: 'var(--touch-min)',
          }}>
            <span style={{
              fontSize: 26, width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: accent + '12',
              borderRadius: 10, flexShrink: 0,
            }}>
              {item.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>{item.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{item.subtitle}</div>
            </div>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
              stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>
    </>
  )
}
