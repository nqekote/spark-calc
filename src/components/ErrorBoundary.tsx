import React, { type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onGoHome?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary — catches render crashes and shows a recovery UI
 * instead of a blank screen. Wraps the lazy-loaded route tree in App.tsx.
 */
class ErrorBoundaryInner extends React.Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[JBox] Route error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onGoHome?.()
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: 32, textAlign: 'center',
        }}>
          {/* Warning icon */}
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'rgba(244, 63, 94, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
              stroke="#F43F5E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={12} cy={12} r={10} />
              <line x1={12} y1={8} x2={12} y2={12} />
              <line x1={12} y1={16} x2={12.01} y2={16} />
            </svg>
          </div>

          <h2 style={{
            fontSize: 20, fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: 'var(--text)', marginBottom: 8,
          }}>
            Something went wrong
          </h2>

          <p style={{
            fontSize: 14, color: 'var(--text-secondary)',
            fontFamily: 'var(--font-display)',
            maxWidth: 320, lineHeight: 1.5, marginBottom: 6,
          }}>
            This page ran into an error. Your data is safe — try going back or heading home.
          </p>

          {/* Error detail (collapsed) */}
          {this.state.error && (
            <details style={{
              marginBottom: 20, width: '100%', maxWidth: 340,
              textAlign: 'left',
            }}>
              <summary style={{
                fontSize: 12, color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer', marginBottom: 6,
              }}>
                Error details
              </summary>
              <pre style={{
                fontSize: 11, color: 'var(--error)',
                fontFamily: 'var(--font-mono)',
                background: 'var(--surface)',
                border: '1px solid var(--divider)',
                borderRadius: 'var(--radius-sm)',
                padding: 12, overflow: 'auto',
                maxHeight: 120, whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {this.state.error.message}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={this.handleRetry} style={{
              padding: '12px 24px', fontSize: 14, fontWeight: 600,
              fontFamily: 'var(--font-display)',
              background: 'var(--surface)',
              border: '1px solid var(--divider)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              cursor: 'pointer', minHeight: 48,
            }}>
              Retry
            </button>

            <button onClick={this.handleReset} style={{
              padding: '12px 24px', fontSize: 14, fontWeight: 600,
              fontFamily: 'var(--font-display)',
              background: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: '#000',
              cursor: 'pointer', minHeight: 48,
            }}>
              Go Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Wrapper that provides navigation to the class component.
 * Must be rendered inside BrowserRouter.
 */
export default function ErrorBoundary({ children }: { children: ReactNode }) {
  // Use a simple callback that sets window.location for max reliability
  // (if the router itself is broken, useNavigate might not work)
  const goHome = () => {
    const base = document.querySelector('base')?.getAttribute('href') || '/'
    window.location.href = base
  }

  return (
    <ErrorBoundaryInner onGoHome={goHome}>
      {children}
    </ErrorBoundaryInner>
  )
}
