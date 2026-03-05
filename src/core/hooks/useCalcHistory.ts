import { useCallback } from 'react'
import { useLocalStorage } from '../storage/useLocalStorage'

export interface HistoryEntry {
  /** Calculator name, e.g. "Ohm's Law" */
  tool: string
  /** Route path, e.g. "/electrical/ohms-law" */
  path: string
  /** Result lines, e.g. ["Voltage: 240 V", "Current: 10 A"] */
  lines: string[]
  /** Formula string if available */
  formula?: string
  /** ISO timestamp */
  ts: string
}

const MAX_HISTORY = 50
const STORAGE_KEY = 'spark-history'

/**
 * Stores the last 50 calculation results.
 * Persists across sessions via localStorage.
 */
export function useCalcHistory() {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(STORAGE_KEY, [])

  const addEntry = useCallback((entry: Omit<HistoryEntry, 'ts'>) => {
    setHistory(prev => {
      // Deduplicate: if the very last entry has the same tool + same result lines, skip
      const last = prev[0]
      if (last && last.tool === entry.tool && last.lines.join() === entry.lines.join()) {
        return prev
      }
      return [{ ...entry, ts: new Date().toISOString() }, ...prev].slice(0, MAX_HISTORY)
    })
  }, [setHistory])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [setHistory])

  return { history, addEntry, clearHistory }
}
