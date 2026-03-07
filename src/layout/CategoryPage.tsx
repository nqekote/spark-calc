import { Link } from 'react-router-dom'
import Header from './Header'
import ToolIcon from '../components/icons/ToolIcon'

export interface CalcItem {
  to: string
  title: string
  subtitle: string
  icon: string
}

/* accent colour by category title */
const catAccents: Record<string, string> = {
  Electrical: 'var(--accent-calc)',
  Conduit: 'var(--accent-calc)',
  'Wire & Protection': 'var(--accent-wire)',
  'Wire & Cable': 'var(--accent-wire)',
  Motors: 'var(--accent-motor)',
  Reference: 'var(--accent-ref)',
  Safety: 'var(--accent-safety)',
  Mining: 'var(--accent-mining)',
  Tools: 'var(--accent-tools)',
  'Installation Guides': 'var(--accent-install)',
}

export default function CategoryPage({ title, items }: { title: string; items: CalcItem[] }) {
  const accent = catAccents[title] || 'var(--primary)'

  return (
    <>
      <Header title={title} />
      <style>{`
        .cat-item { transition: background 150ms ease, transform 80ms ease; }
        .cat-item:active { transform: scale(0.985); background: var(--surface-hover) !important; }
      `}</style>
      <div style={{ padding: '16px 16px 32px', display: 'grid', gap: 8 }}>
        {/* Feature count */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 4,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: accent,
            background: 'var(--primary-subtle)',
            padding: '5px 12px', borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.3px',
          }}>
            {items.length} tool{items.length !== 1 ? 's' : ''}
          </div>
        </div>

        {items.map((item, i) => (
          <Link key={item.to} to={item.to} className="cat-item animate-in" style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--surface)', borderRadius: 'var(--radius)',
            padding: '14px 16px',
            textDecoration: 'none',
            border: '1px solid var(--divider)',
            borderLeft: `3px solid ${accent}`,
            minHeight: 'var(--touch-min)',
            animationDelay: `${Math.min(i, 12) * 30}ms`,
          }}>
            <span style={{
              width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--primary-subtle)',
              borderRadius: 10, flexShrink: 0,
              color: accent,
            }}>
              <ToolIcon name={item.icon} size={22} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600, fontSize: 15,
                color: 'var(--text)',
                fontFamily: 'var(--font-display)',
              }}>{item.title}</div>
              <div style={{
                fontSize: 13, color: 'var(--text-secondary)', marginTop: 2,
                fontFamily: 'var(--font-display)',
              }}>{item.subtitle}</div>
            </div>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
              stroke="var(--text-tertiary)" strokeWidth={2} strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>
    </>
  )
}
