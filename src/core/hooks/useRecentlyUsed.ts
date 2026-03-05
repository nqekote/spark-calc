import { useCallback } from 'react'
import { useLocalStorage } from '../storage/useLocalStorage'

const MAX_RECENT = 6
const STORAGE_KEY = 'spark-recent'

/**
 * Tracks the last 6 tools the user visited.
 * Persists across sessions via localStorage.
 */
export function useRecentlyUsed() {
  const [recent, setRecent] = useLocalStorage<string[]>(STORAGE_KEY, [])

  const track = useCallback((path: string) => {
    setRecent(prev => {
      const filtered = prev.filter(p => p !== path)
      return [path, ...filtered].slice(0, MAX_RECENT)
    })
  }, [setRecent])

  return { recent, track }
}
