import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../core/theme/ThemeContext'

export default function Header({ title }: { title?: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggle } = useTheme()
  const isHome = location.pathname === '/'
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--nav-bg)',
      borderBottom: '1px solid var(--divider)',
      display: 'flex', alignItems: 'center',
      padding: '8px 12px', gap: 8, minHeight: 56,
    }}>
      {!isHome && (
        <button onClick={() => navigate(-1)} style={{
          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 8, color: 'var(--text)',
        }} aria-label="Go back">
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      )}
      <h1 style={{
        flex: 1, fontSize: isHome ? 22 : 18, fontWeight: 700,
        color: isHome ? 'var(--primary)' : 'var(--text)',
        fontFamily: isHome ? 'var(--font-sans)' : undefined,
      }}>
        {isHome ? 'SparkCalc' : (title || 'SparkCalc')}
      </h1>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: isOnline ? 'var(--success)' : 'var(--warning)',
        flexShrink: 0,
      }} title={isOnline ? 'Online' : 'Offline - all features available'} />
      <button onClick={toggle} style={{
        width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 8, color: 'var(--text)',
      }} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        {theme === 'dark' ? (
          <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor"><circle cx={12} cy={12} r={5}/><g stroke="currentColor" strokeWidth={2}><line x1={12} y1={1} x2={12} y2={3}/><line x1={12} y1={21} x2={12} y2={23}/><line x1={4.22} y1={4.22} x2={5.64} y2={5.64}/><line x1={18.36} y1={18.36} x2={19.78} y2={19.78}/><line x1={1} y1={12} x2={3} y2={12}/><line x1={21} y1={12} x2={23} y2={12}/><line x1={4.22} y1={19.78} x2={5.64} y2={18.36}/><line x1={18.36} y1={5.64} x2={19.78} y2={4.22}/></g></svg>
        ) : (
          <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        )}
      </button>
    </header>
  )
}
