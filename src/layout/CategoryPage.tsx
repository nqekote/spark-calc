import { Link } from 'react-router-dom'
import Header from './Header'

export interface CalcItem {
  to: string
  title: string
  subtitle: string
  icon: string
}

export default function CategoryPage({ title, items }: { title: string; items: CalcItem[] }) {
  return (
    <>
      <Header title={title} />
      <div style={{ padding: 16, display: 'grid', gap: 12 }}>
        {items.map(item => (
          <Link key={item.to} to={item.to} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--surface)', borderRadius: 'var(--radius)',
            padding: '16px 18px', textDecoration: 'none',
            border: '1px solid var(--divider)',
            transition: 'background .15s',
            minHeight: 'var(--touch-min)',
          }}>
            <span style={{ fontSize: 28, width: 40, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>{item.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{item.subtitle}</div>
            </div>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        ))}
      </div>
    </>
  )
}
