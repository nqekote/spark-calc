import { useState, useEffect, useCallback } from 'react'

/**
 * Like useState, but persists the value in sessionStorage.
 * Inputs survive navigating away and coming back (within the same browser tab).
 * Cleared automatically when the tab is closed.
 *
 * Usage:
 *   const [voltage, setVoltage] = useSessionStorage('vdrop-voltage', '')
 */
export function useSessionStorage<T>(
  key: string,
  initial: T,
): [T, (v: T | ((prev: T) => T)) => void] {
  const prefixedKey = `sc:${key}`

  const [value, setValue] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(prefixedKey)
      return stored !== null ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(prefixedKey, JSON.stringify(value))
    } catch {
      // sessionStorage full or unavailable — degrade silently
    }
  }, [prefixedKey, value])

  const setter = useCallback(
    (v: T | ((prev: T) => T)) => setValue(v),
    [],
  )

  return [value, setter]
}
