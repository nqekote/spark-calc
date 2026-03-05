import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecentlyUsed } from '../core/hooks/useRecentlyUsed'
import { allFeatures } from '../data/features'

// Paths that are actual tools (not category landing pages or home)
const featurePaths = new Set(allFeatures.map(f => f.to))

/**
 * Invisible component that tracks which tool pages the user visits.
 * Mounted in AppShell so it runs on every route change.
 */
export default function RouteTracker() {
  const location = useLocation()
  const { track } = useRecentlyUsed()

  useEffect(() => {
    if (featurePaths.has(location.pathname)) {
      track(location.pathname)
    }
  }, [location.pathname, track])

  return null
}
