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
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--divider)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: 8, height: 56,
    }}>
      {/* Back button */}
      {!isHome && (
        <button onClick={() => navigate(-1)} className="tap-target" style={{
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 10, color: 'var(--text-secondary)',
          transition: 'color var(--transition-fast), background var(--transition-fast)',
        }} aria-label="Go back">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      )}

      {/* Title */}
      <h1 style={{
        flex: 1, margin: 0,
        fontSize: isHome ? 20 : 17,
        fontWeight: isHome ? 700 : 600,
        fontFamily: 'var(--font-display)',
        color: isHome ? 'var(--primary)' : 'var(--text)',
        letterSpacing: isHome ? '-0.3px' : '-0.2px',
      }}>
        {isHome ? 'SparkCalc' : (title || 'SparkCalc')}
      </h1>

      {/* Status pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        background: isOnline ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
        border: `1px solid ${isOnline ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)'}`,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: isOnline ? 'var(--success)' : 'var(--warning)',
          boxShadow: isOnline ? '0 0 6px rgba(76,175,80,0.4)' : '0 0 6px rgba(255,152,0,0.4)',
        }} />
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.3px',
          color: isOnline ? 'var(--success)' : 'var(--warning)',
          fontFamily: 'var(--font-display)',
        }}>
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      {/* Theme toggle */}
      <button onClick={toggle} className="tap-target" style={{
        width: 40, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 10, color: 'var(--text-secondary)',
        transition: 'color var(--transition-fast), background var(--transition-fast)',
      }} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        {theme === 'dark' ? (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
            <circle cx={12} cy={12} r={5}/>
            <g stroke="currentColor" strokeWidth={2}>
              <line x1={12} y1={1} x2={12} y2={3}/>
              <line x1={12} y1={21} x2={12} y2={23}/>
              <line x1={4.22} y1={4.22} x2={5.64} y2={5.64}/>
              <line x1={18.36} y1={18.36} x2={19.78} y2={19.78}/>
              <line x1={1} y1={12} x2={3} y2={12}/>
              <line x1={21} y1={12} x2={23} y2={12}/>
              <line x1={4.22} y1={19.78} x2={5.64} y2={18.36}/>
              <line x1={18.36} y1={5.64} x2={19.78} y2={4.22}/>
            </g>
          </svg>
        ) : (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        )}
      </button>
    </header>
  )
}
