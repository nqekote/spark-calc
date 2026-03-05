import { useCallback } from 'react'
import { useLocalStorage } from '../storage/useLocalStorage'

const STORAGE_KEY = 'spark-favorites'

/**
 * Manages a list of favorite tool paths.
 * Persists across sessions via localStorage.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEY, [])

  const toggle = useCallback((path: string) => {
    setFavorites(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
  }, [setFavorites])

  const isFavorite = useCallback(
    (path: string) => favorites.includes(path),
    [favorites],
  )

  return { favorites, toggle, isFavorite }
}
