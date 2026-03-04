import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: 'M12 3L4 9v11a1 1 0 001 1h4v-6h6v6h4a1 1 0 001-1V9l-8-6z' },
  { to: '/electrical', label: 'Calc', icon: 'M13 2L4 14h7l-2 8 11-14h-7l4-6z' },
  { to: '/reference', label: 'Reference', icon: 'M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 12h8v2H8v-2zm0 4h5v2H8v-2z' },
  { to: '/safety', label: 'Safety', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' },
  { to: '/motors', label: 'Motors', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v5h4l-5 6V14H8l5-6v-1z' },
  { to: '/mining', label: 'Mining', icon: 'M17.5 3.5L12 2 6.5 3.5 2 5v2l4.5 1.5L12 10l5.5-1.5L22 7V5l-4.5-1.5zM12 12l-6 2v4l6 4 6-4v-4l-6-2z' },
]

export default function BottomNav() {
  return (
    <>
      <style>{`
        .nav-tab { position: relative; }
        .nav-tab::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%; transform: translateX(-50%);
          width: 0; height: 2px;
          background: var(--primary);
          border-radius: 2px;
          transition: width 200ms ease, box-shadow 200ms ease;
        }
        .nav-tab.active::after {
          width: 20px;
          box-shadow: 0 0 8px rgba(255, 107, 44, 0.4);
        }
      `}</style>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--divider)',
        display: 'flex', justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        paddingTop: 8, zIndex: 100,
      }}>
        {tabs.map(t => (
          <NavLink key={t.to} to={t.to} end={t.to === '/'}
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column' as const,
              alignItems: 'center', gap: 3,
              minWidth: 52, minHeight: 52,
              paddingBottom: 6,
              justifyContent: 'center',
              color: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
              fontSize: 10, fontWeight: isActive ? 600 : 400,
              fontFamily: 'var(--font-display)',
              textDecoration: 'none',
              letterSpacing: '0.2px',
              transition: 'color 200ms ease',
            })}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
              <path d={t.icon} />
            </svg>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
