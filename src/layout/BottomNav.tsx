import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: 'M12 3L4 9v11a1 1 0 001 1h4v-6h6v6h4a1 1 0 001-1V9l-8-6z' },
  { to: '/electrical', label: 'Electrical', icon: 'M13 2L4 14h7l-2 8 11-14h-7l4-6z' },
  { to: '/conduit', label: 'Conduit', icon: 'M4 7h16v2H4zm0 4h16v2H4zm2-8l-2 4h16l-2-4H6zm0 16l-2-4h16l-2 4H6z' },
  { to: '/wire', label: 'Wire', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z' },
  { to: '/mining', label: 'Mining', icon: 'M17.5 3.5L12 2 6.5 3.5 2 5v2l4.5 1.5L12 10l5.5-1.5L22 7V5l-4.5-1.5zM12 12l-6 2v4l6 4 6-4v-4l-6-2z' },
  { to: '/materials', label: 'Materials', icon: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9h-2v2H9v-2H7v-2h2V7h2v2h2v2zm-1-7.5L16.5 8H12V3.5z' },
]

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--nav-bg)',
      borderTop: '1px solid var(--divider)',
      display: 'flex', justifyContent: 'space-around',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      paddingTop: 8, zIndex: 100,
    }}>
      {tabs.map(t => (
        <NavLink key={t.to} to={t.to} end={t.to === '/'} style={({ isActive }) => ({
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          minWidth: 56, minHeight: 56, justifyContent: 'center',
          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
          fontSize: 10, fontWeight: isActive ? 700 : 400,
          textDecoration: 'none', transition: 'color .15s',
        })}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor"><path d={t.icon}/></svg>
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}
