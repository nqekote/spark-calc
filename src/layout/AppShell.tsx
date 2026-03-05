import { type ReactNode } from 'react'
import BottomNav from './BottomNav'
import GlobalSearch from '../components/GlobalSearch'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, paddingBottom: 80, overflowY: 'auto' }}>
        {children}
      </main>
      <BottomNav />
      <GlobalSearch />
    </div>
  )
}
