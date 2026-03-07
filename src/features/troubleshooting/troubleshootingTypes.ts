/* ------------------------------------------------------------------ */
/*  Troubleshooting Types — shared across data + UI                    */
/* ------------------------------------------------------------------ */

export type TabKey =
  | 'symptoms'
  | 'motors'
  | 'controls'
  | 'power'
  | 'grounding'
  | 'cables'
  | 'equipment'
  | 'tools'

export interface TroubleshootingItem {
  title: string
  severity?: 'warning' | 'critical' | 'info'
  steps?: string[]
  notes?: string
  subItems?: { label: string; detail: string; color?: string }[]
  table?: { headers: string[]; rows: string[][] }
}

export interface TroubleshootingSection {
  heading: string
  items: TroubleshootingItem[]
}
