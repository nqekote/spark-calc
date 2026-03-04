import { useState, useEffect, useCallback, useMemo } from 'react'
import Header from '../../layout/Header'

// ── Types ──────────────────────────────────────────────────
type ItemCategory = 'Cable' | 'Fittings' | 'Hardware' | 'Devices' | 'Tools' | 'Consumables' | 'PPE' | 'Other'

interface MaterialItem {
  id: string
  name: string
  quantity: string
  unit: string
  notes: string
  checked: boolean
  category: ItemCategory
}

interface Job {
  id: string
  name: string
  createdAt: number
  items: MaterialItem[]
  archived: boolean
}

type SortMode = 'added' | 'name' | 'category' | 'unchecked'

// ── Storage ────────────────────────────────────────────────
const STORAGE_KEY = 'sparkCalc_materialJobs'

function loadJobs(): Job[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Job[]
    // Migrate old items without category
    return parsed.map(j => ({
      ...j,
      items: j.items.map(i => ({ ...i, category: i.category || 'Other' as ItemCategory })),
    }))
  } catch { return [] }
}

function saveJobs(jobs: Job[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// ── Category colors ────────────────────────────────────────
const CAT_COLORS: Record<ItemCategory, string> = {
  Cable: '#3B82F6',
  Fittings: '#F59E0B',
  Hardware: '#8B5CF6',
  Devices: '#10B981',
  Tools: '#6366F1',
  Consumables: '#EF4444',
  PPE: '#EC4899',
  Other: '#6B7280',
}

const ALL_CATEGORIES: ItemCategory[] = ['Cable', 'Fittings', 'Hardware', 'Devices', 'Tools', 'Consumables', 'PPE', 'Other']

// ── Common units for electrical work ───────────────────────
const COMMON_UNITS = [
  { value: 'pcs', label: 'pcs' },
  { value: 'ft', label: 'ft' },
  { value: 'm', label: 'm' },
  { value: 'rolls', label: 'rolls' },
  { value: 'boxes', label: 'boxes' },
  { value: 'bags', label: 'bags' },
  { value: 'lengths', label: 'lengths' },
  { value: 'coils', label: 'coils' },
  { value: 'pairs', label: 'pairs' },
  { value: 'sets', label: 'sets' },
  { value: 'ea', label: 'ea' },
  { value: 'lbs', label: 'lbs' },
  { value: '', label: '—' },
]

// ── Categorized preset materials (mining/industrial) ──────
interface PresetItem { name: string; cat: ItemCategory; unit: string }

const PRESET_CATEGORIES: { label: string; items: PresetItem[] }[] = [
  {
    label: 'TECK Cable',
    items: [
      { name: '#18 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#16 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#14 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#12 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#10 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#8 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#6 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#4 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#3 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#2 TECK90', cat: 'Cable', unit: 'm' },
      { name: '#1 TECK90', cat: 'Cable', unit: 'm' },
      { name: '1/0 TECK90', cat: 'Cable', unit: 'm' },
      { name: '2/0 TECK90', cat: 'Cable', unit: 'm' },
      { name: '3/0 TECK90', cat: 'Cable', unit: 'm' },
      { name: '4/0 TECK90', cat: 'Cable', unit: 'm' },
      { name: '250 MCM TECK90', cat: 'Cable', unit: 'm' },
      { name: '350 MCM TECK90', cat: 'Cable', unit: 'm' },
      { name: '500 MCM TECK90', cat: 'Cable', unit: 'm' },
    ],
  },
  {
    label: 'Other Cable',
    items: [
      { name: '#14/2 NMWU', cat: 'Cable', unit: 'm' },
      { name: '#12/2 NMWU', cat: 'Cable', unit: 'm' },
      { name: '#10/3 NMWU', cat: 'Cable', unit: 'm' },
      { name: '#14/2 NMD90', cat: 'Cable', unit: 'm' },
      { name: '#12/2 NMD90', cat: 'Cable', unit: 'm' },
      { name: '#12/3 NMD90', cat: 'Cable', unit: 'm' },
      { name: 'SHD-GC Trailing Cable', cat: 'Cable', unit: 'm' },
      { name: '#12 T90 Black', cat: 'Cable', unit: 'm' },
      { name: '#12 T90 White', cat: 'Cable', unit: 'm' },
      { name: '#12 T90 Red', cat: 'Cable', unit: 'm' },
      { name: '#12 T90 Blue', cat: 'Cable', unit: 'm' },
      { name: '#12 T90 Green', cat: 'Cable', unit: 'm' },
      { name: '#10 T90 Black', cat: 'Cable', unit: 'm' },
      { name: '#10 T90 Green', cat: 'Cable', unit: 'm' },
      { name: '#6 T90 Green (Ground)', cat: 'Cable', unit: 'm' },
      { name: '18/2 Shielded Control Cable', cat: 'Cable', unit: 'm' },
      { name: '18/4 Shielded Control Cable', cat: 'Cable', unit: 'm' },
      { name: 'Cat6 Ethernet Cable', cat: 'Cable', unit: 'm' },
    ],
  },
  {
    label: 'TECK Connectors',
    items: [
      { name: '#18 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#16 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#14 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#12 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#10 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#8 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#6 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#4 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#3 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#2 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '#1 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '1/0 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '2/0 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '3/0 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '4/0 TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '250 MCM TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '350 MCM TECK Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '500 MCM TECK Connector', cat: 'Fittings', unit: 'pcs' },
    ],
  },
  {
    label: 'Lock Nuts & Bushings',
    items: [
      { name: '1/2" Lock Nut', cat: 'Fittings', unit: 'pcs' },
      { name: '3/4" Lock Nut', cat: 'Fittings', unit: 'pcs' },
      { name: '1" Lock Nut', cat: 'Fittings', unit: 'pcs' },
      { name: '1-1/4" Lock Nut', cat: 'Fittings', unit: 'pcs' },
      { name: '1-1/2" Lock Nut', cat: 'Fittings', unit: 'pcs' },
      { name: '2" Lock Nut', cat: 'Fittings', unit: 'pcs' },
      { name: '1/2" Plastic Bushing', cat: 'Fittings', unit: 'pcs' },
      { name: '3/4" Plastic Bushing', cat: 'Fittings', unit: 'pcs' },
      { name: '1" Plastic Bushing', cat: 'Fittings', unit: 'pcs' },
      { name: '1-1/4" Plastic Bushing', cat: 'Fittings', unit: 'pcs' },
      { name: '1-1/2" Plastic Bushing', cat: 'Fittings', unit: 'pcs' },
      { name: '2" Plastic Bushing', cat: 'Fittings', unit: 'pcs' },
      { name: '1/2" Insulated Bushing', cat: 'Fittings', unit: 'pcs' },
      { name: '3/4" Insulated Bushing', cat: 'Fittings', unit: 'pcs' },
      { name: '1" Insulated Bushing', cat: 'Fittings', unit: 'pcs' },
    ],
  },
  {
    label: 'EMT & Straps',
    items: [
      { name: '1/2" EMT', cat: 'Fittings', unit: 'lengths' },
      { name: '3/4" EMT', cat: 'Fittings', unit: 'lengths' },
      { name: '1" EMT', cat: 'Fittings', unit: 'lengths' },
      { name: '1-1/4" EMT', cat: 'Fittings', unit: 'lengths' },
      { name: '1/2" EMT Strap', cat: 'Fittings', unit: 'pcs' },
      { name: '3/4" EMT Strap', cat: 'Fittings', unit: 'pcs' },
      { name: '1" EMT Strap', cat: 'Fittings', unit: 'pcs' },
      { name: '1/2" EMT Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '3/4" EMT Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '1" EMT Connector', cat: 'Fittings', unit: 'pcs' },
      { name: '1/2" EMT Coupling', cat: 'Fittings', unit: 'pcs' },
      { name: '3/4" EMT Coupling', cat: 'Fittings', unit: 'pcs' },
    ],
  },
  {
    label: 'Clamps & Strut',
    items: [
      { name: '1/2" Cobra Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '3/4" Cobra Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '1" Cobra Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '1-1/2" Cobra Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '2" Cobra Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '1/2" P-Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '3/4" P-Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '1" P-Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '1-1/2" P-Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '2" P-Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: '1-5/8" Strut (10ft)', cat: 'Fittings', unit: 'lengths' },
      { name: '1-5/8" Strut (Slotted)', cat: 'Fittings', unit: 'lengths' },
      { name: 'Strut Strap', cat: 'Fittings', unit: 'pcs' },
      { name: 'Spring Nut (Strut)', cat: 'Fittings', unit: 'pcs' },
      { name: 'Beam Clamp', cat: 'Fittings', unit: 'pcs' },
      { name: 'Threaded Rod 3/8" (10ft)', cat: 'Fittings', unit: 'lengths' },
      { name: 'Threaded Rod 1/2" (10ft)', cat: 'Fittings', unit: 'lengths' },
    ],
  },
  {
    label: 'Screws & Fasteners',
    items: [
      { name: '#8 x 1/2" Tapper Screws', cat: 'Hardware', unit: 'pcs' },
      { name: '#8 x 3/4" Tapper Screws', cat: 'Hardware', unit: 'pcs' },
      { name: '#10 x 1" Tapper Screws', cat: 'Hardware', unit: 'pcs' },
      { name: '#10 x 3/4" Tapper Screws', cat: 'Hardware', unit: 'pcs' },
      { name: '#10 x 1-1/2" Tapper Screws', cat: 'Hardware', unit: 'pcs' },
      { name: '#6-32 Machine Screws', cat: 'Hardware', unit: 'pcs' },
      { name: '#8-32 Machine Screws', cat: 'Hardware', unit: 'pcs' },
      { name: '#10-32 Machine Screws', cat: 'Hardware', unit: 'pcs' },
      { name: '#8 Green Ground Screws', cat: 'Hardware', unit: 'pcs' },
      { name: 'Tapcon 3/16" x 1-1/4"', cat: 'Hardware', unit: 'pcs' },
      { name: 'Tapcon 1/4" x 1-3/4"', cat: 'Hardware', unit: 'pcs' },
    ],
  },
  {
    label: '1/4" Hardware',
    items: [
      { name: '1/4"-20 x 1" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '1/4"-20 x 1-1/2" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '1/4"-20 x 2" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '1/4"-20 Hex Nut', cat: 'Hardware', unit: 'pcs' },
      { name: '1/4" Flat Washer', cat: 'Hardware', unit: 'pcs' },
      { name: '1/4" Lock Washer', cat: 'Hardware', unit: 'pcs' },
      { name: '1/4" Spring Nut', cat: 'Hardware', unit: 'pcs' },
    ],
  },
  {
    label: '3/8" Hardware',
    items: [
      { name: '3/8"-16 x 1" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '3/8"-16 x 1-1/2" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '3/8"-16 x 2" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '3/8"-16 x 3" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '3/8"-16 Hex Nut', cat: 'Hardware', unit: 'pcs' },
      { name: '3/8" Flat Washer', cat: 'Hardware', unit: 'pcs' },
      { name: '3/8" Lock Washer', cat: 'Hardware', unit: 'pcs' },
      { name: '3/8" Spring Nut', cat: 'Hardware', unit: 'pcs' },
    ],
  },
  {
    label: '1/2" Hardware',
    items: [
      { name: '1/2"-13 x 1-1/2" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '1/2"-13 x 2" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '1/2"-13 x 3" Bolt', cat: 'Hardware', unit: 'pcs' },
      { name: '1/2"-13 Hex Nut', cat: 'Hardware', unit: 'pcs' },
      { name: '1/2" Flat Washer', cat: 'Hardware', unit: 'pcs' },
      { name: '1/2" Lock Washer', cat: 'Hardware', unit: 'pcs' },
    ],
  },
  {
    label: 'Terminations & Wire',
    items: [
      { name: 'Red Marrettes', cat: 'Fittings', unit: 'pcs' },
      { name: 'Yellow Marrettes', cat: 'Fittings', unit: 'pcs' },
      { name: 'Orange Marrettes', cat: 'Fittings', unit: 'pcs' },
      { name: 'Blue Marrettes', cat: 'Fittings', unit: 'pcs' },
      { name: 'Ring Terminals (Blue)', cat: 'Fittings', unit: 'pcs' },
      { name: 'Ring Terminals (Yellow)', cat: 'Fittings', unit: 'pcs' },
      { name: 'Ring Terminals (Red)', cat: 'Fittings', unit: 'pcs' },
      { name: 'Compression Lugs', cat: 'Fittings', unit: 'pcs' },
      { name: 'Heat Shrink Tubing', cat: 'Consumables', unit: 'ft' },
      { name: 'Split Bolt Connectors', cat: 'Fittings', unit: 'pcs' },
    ],
  },
  {
    label: 'Boxes & Devices',
    items: [
      { name: '4" Square Box', cat: 'Devices', unit: 'pcs' },
      { name: '4" Square Mud Ring (1G)', cat: 'Devices', unit: 'pcs' },
      { name: '4" Square Mud Ring (2G)', cat: 'Devices', unit: 'pcs' },
      { name: 'Single Gang Box', cat: 'Devices', unit: 'pcs' },
      { name: 'Double Gang Box', cat: 'Devices', unit: 'pcs' },
      { name: 'Duplex Receptacle', cat: 'Devices', unit: 'pcs' },
      { name: 'GFCI Receptacle', cat: 'Devices', unit: 'pcs' },
      { name: 'Single Pole Switch', cat: 'Devices', unit: 'pcs' },
      { name: 'Decora Plate (1G)', cat: 'Devices', unit: 'pcs' },
      { name: 'Decora Plate (2G)', cat: 'Devices', unit: 'pcs' },
      { name: 'Blank Cover Plate', cat: 'Devices', unit: 'pcs' },
      { name: 'Weatherproof Box Cover', cat: 'Devices', unit: 'pcs' },
    ],
  },
  {
    label: 'Consumables',
    items: [
      { name: 'Electrical Tape (Black)', cat: 'Consumables', unit: 'rolls' },
      { name: 'Electrical Tape (Red)', cat: 'Consumables', unit: 'rolls' },
      { name: 'Rubber Splicing Tape', cat: 'Consumables', unit: 'rolls' },
      { name: 'Cable Ties (Small)', cat: 'Consumables', unit: 'bags' },
      { name: 'Cable Ties (Large)', cat: 'Consumables', unit: 'bags' },
      { name: 'Wire Pulling Lube', cat: 'Consumables', unit: 'pcs' },
      { name: 'Fire Caulk', cat: 'Consumables', unit: 'pcs' },
      { name: 'Penetrox (Anti-Oxidant)', cat: 'Consumables', unit: 'pcs' },
      { name: 'Dielectric Grease', cat: 'Consumables', unit: 'pcs' },
      { name: 'Wire Markers / Labels', cat: 'Consumables', unit: 'pcs' },
      { name: 'Anchor Bolts', cat: 'Hardware', unit: 'pcs' },
    ],
  },
]

// ── Job Templates ──────────────────────────────────────────
interface JobTemplate {
  name: string
  description: string
  items: Omit<MaterialItem, 'id' | 'checked'>[]
}

const JOB_TEMPLATES: JobTemplate[] = [
  {
    name: 'Trailing Cable Replacement',
    description: 'Shovel/drill trailing cable swap',
    items: [
      { name: 'SHD-GC Trailing Cable', quantity: '', unit: 'm', notes: 'Confirm gauge & length', category: 'Cable' },
      { name: 'Cable Coupler (Mine Type)', quantity: '2', unit: 'pcs', notes: '', category: 'Fittings' },
      { name: 'Heat Shrink Tubing', quantity: '', unit: 'ft', notes: '', category: 'Consumables' },
      { name: 'Rubber Splicing Tape', quantity: '2', unit: 'rolls', notes: '', category: 'Consumables' },
      { name: 'Electrical Tape (Black)', quantity: '2', unit: 'rolls', notes: '', category: 'Consumables' },
      { name: 'Cable Ties (Large)', quantity: '1', unit: 'bags', notes: '', category: 'Consumables' },
      { name: 'Penetrox (Anti-Oxidant)', quantity: '1', unit: 'pcs', notes: '', category: 'Consumables' },
      { name: 'Compression Lugs', quantity: '', unit: 'pcs', notes: 'Match cable size', category: 'Fittings' },
    ],
  },
  {
    name: 'Motor Changeout',
    description: 'Crusher, pump, or conveyor motor swap',
    items: [
      { name: 'TECK90 Cable', quantity: '', unit: 'm', notes: 'Confirm gauge, 3+G', category: 'Cable' },
      { name: 'TECK Connector', quantity: '4', unit: 'pcs', notes: 'Match cable size', category: 'Fittings' },
      { name: 'Lock Nut', quantity: '4', unit: 'pcs', notes: 'Match connector size', category: 'Fittings' },
      { name: 'Ring Terminals', quantity: '8', unit: 'pcs', notes: '', category: 'Fittings' },
      { name: 'Heat Shrink Tubing', quantity: '', unit: 'ft', notes: '', category: 'Consumables' },
      { name: '3/8"-16 x 1-1/2" Bolt', quantity: '4', unit: 'pcs', notes: 'Motor mount bolts', category: 'Hardware' },
      { name: '3/8" Flat Washer', quantity: '8', unit: 'pcs', notes: '', category: 'Hardware' },
      { name: '3/8" Lock Washer', quantity: '4', unit: 'pcs', notes: '', category: 'Hardware' },
      { name: '3/8"-16 Hex Nut', quantity: '4', unit: 'pcs', notes: '', category: 'Hardware' },
      { name: 'Megger (IR tester)', quantity: '1', unit: 'pcs', notes: 'Test before energizing', category: 'Tools' },
      { name: 'Electrical Tape (Black)', quantity: '1', unit: 'rolls', notes: '', category: 'Consumables' },
    ],
  },
  {
    name: 'Portable Sub Installation',
    description: 'Set up portable substation at new location',
    items: [
      { name: 'MV Cable (Confirm kV)', quantity: '', unit: 'm', notes: 'Primary feed', category: 'Cable' },
      { name: 'MV Termination Kit', quantity: '3', unit: 'pcs', notes: 'Match voltage class', category: 'Fittings' },
      { name: 'Ground Rod (8ft)', quantity: '4', unit: 'pcs', notes: 'Min 4 rods', category: 'Fittings' },
      { name: 'Ground Clamp', quantity: '4', unit: 'pcs', notes: '', category: 'Fittings' },
      { name: '#2 Bare Ground Wire', quantity: '', unit: 'm', notes: 'Ground grid', category: 'Cable' },
      { name: 'Exothermic Weld Kit', quantity: '1', unit: 'sets', notes: 'Cadweld', category: 'Consumables' },
      { name: 'Fall of Potential Tester', quantity: '1', unit: 'pcs', notes: 'Verify <1\u03A9', category: 'Tools' },
      { name: 'Dielectric Grease', quantity: '1', unit: 'pcs', notes: '', category: 'Consumables' },
      { name: 'Penetrox (Anti-Oxidant)', quantity: '1', unit: 'pcs', notes: '', category: 'Consumables' },
      { name: 'Wire Markers / Labels', quantity: '1', unit: 'pcs', notes: 'Phase identification', category: 'Consumables' },
      { name: 'Danger Tags / Signs', quantity: '', unit: 'pcs', notes: '', category: 'Consumables' },
    ],
  },
  {
    name: 'Cable Tray Run',
    description: 'TECK cable install in tray or on strut',
    items: [
      { name: 'TECK90 Cable', quantity: '', unit: 'm', notes: 'Confirm gauge & conductors', category: 'Cable' },
      { name: 'TECK Connector', quantity: '', unit: 'pcs', notes: 'Both ends', category: 'Fittings' },
      { name: 'Lock Nut', quantity: '', unit: 'pcs', notes: '', category: 'Fittings' },
      { name: 'Plastic Bushing', quantity: '', unit: 'pcs', notes: '', category: 'Fittings' },
      { name: '1-5/8" Strut (10ft)', quantity: '', unit: 'lengths', notes: '', category: 'Fittings' },
      { name: 'Cobra Clamp', quantity: '', unit: 'pcs', notes: 'Match cable OD', category: 'Fittings' },
      { name: 'Spring Nut (Strut)', quantity: '', unit: 'pcs', notes: '', category: 'Fittings' },
      { name: '3/8"-16 x 1" Bolt', quantity: '', unit: 'pcs', notes: 'For strut clamps', category: 'Hardware' },
      { name: 'Beam Clamp', quantity: '', unit: 'pcs', notes: 'If overhead', category: 'Fittings' },
      { name: 'Threaded Rod 3/8" (10ft)', quantity: '', unit: 'lengths', notes: 'For hangers', category: 'Fittings' },
      { name: 'Cable Ties (Large)', quantity: '1', unit: 'bags', notes: '', category: 'Consumables' },
    ],
  },
  {
    name: 'Panel / MCC Work',
    description: 'Panel wiring, breaker install, MCC bucket',
    items: [
      { name: '#12 T90 Black', quantity: '', unit: 'm', notes: '', category: 'Cable' },
      { name: '#12 T90 White', quantity: '', unit: 'm', notes: '', category: 'Cable' },
      { name: '#12 T90 Red', quantity: '', unit: 'm', notes: '', category: 'Cable' },
      { name: '#12 T90 Blue', quantity: '', unit: 'm', notes: '', category: 'Cable' },
      { name: '#12 T90 Green', quantity: '', unit: 'm', notes: '', category: 'Cable' },
      { name: '#10 T90 Green', quantity: '', unit: 'm', notes: 'Bonding', category: 'Cable' },
      { name: 'Ring Terminals (Blue)', quantity: '', unit: 'pcs', notes: '', category: 'Fittings' },
      { name: 'Yellow Marrettes', quantity: '', unit: 'pcs', notes: '', category: 'Fittings' },
      { name: 'Wire Markers / Labels', quantity: '1', unit: 'pcs', notes: '', category: 'Consumables' },
      { name: '#8 Green Ground Screws', quantity: '', unit: 'pcs', notes: '', category: 'Hardware' },
      { name: '#8-32 Machine Screws', quantity: '', unit: 'pcs', notes: '', category: 'Hardware' },
    ],
  },
  {
    name: 'Ground Grid Testing/Repair',
    description: 'Mine substation ground system work',
    items: [
      { name: 'Ground Rod (8ft)', quantity: '', unit: 'pcs', notes: 'Copper-clad', category: 'Fittings' },
      { name: 'Ground Clamp', quantity: '', unit: 'pcs', notes: 'Bronze', category: 'Fittings' },
      { name: '#2 Bare Ground Wire', quantity: '', unit: 'm', notes: '', category: 'Cable' },
      { name: '#4/0 Bare Ground Wire', quantity: '', unit: 'm', notes: 'Main grid', category: 'Cable' },
      { name: 'Exothermic Weld Kit', quantity: '1', unit: 'sets', notes: 'Cadweld molds + charges', category: 'Consumables' },
      { name: 'Fall of Potential Tester', quantity: '1', unit: 'pcs', notes: '', category: 'Tools' },
      { name: 'Clamp-On Ground Tester', quantity: '1', unit: 'pcs', notes: '', category: 'Tools' },
    ],
  },
]

// ── Copy to clipboard helper ───────────────────────────────
function formatJobAsText(job: Job): string {
  const lines: string[] = []
  lines.push(`=== ${job.name} ===`)
  lines.push(`Date: ${new Date(job.createdAt).toLocaleDateString('en-CA')}`)

  const unchecked = job.items.filter(i => !i.checked)
  const checked = job.items.filter(i => i.checked)

  // Group by category
  const byCat = new Map<string, MaterialItem[]>()
  for (const item of unchecked) {
    const list = byCat.get(item.category) || []
    list.push(item)
    byCat.set(item.category, list)
  }

  if (unchecked.length > 0) {
    lines.push('')
    lines.push(`NEEDED (${unchecked.length}):`)
    for (const [cat, items] of byCat) {
      lines.push(`  -- ${cat} --`)
      for (const i of items) {
        const qty = i.quantity ? `${i.quantity} ${i.unit}` : ''
        const note = i.notes ? ` (${i.notes})` : ''
        lines.push(`  [ ] ${i.name}${qty ? ' — ' + qty : ''}${note}`)
      }
    }
  }

  if (checked.length > 0) {
    lines.push('')
    lines.push(`COLLECTED (${checked.length}):`)
    for (const i of checked) {
      const qty = i.quantity ? `${i.quantity} ${i.unit}` : ''
      lines.push(`  [x] ${i.name}${qty ? ' — ' + qty : ''}`)
    }
  }

  lines.push('')
  lines.push(`Total: ${job.items.length} items, ${checked.length} collected`)
  return lines.join('\n')
}

// ── Components ─────────────────────────────────────────────

function CategoryBadge({ category }: { category: ItemCategory }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700,
      color: CAT_COLORS[category],
      background: CAT_COLORS[category] + '15',
      padding: '2px 6px', borderRadius: 4,
      textTransform: 'uppercase', letterSpacing: '0.3px',
      whiteSpace: 'nowrap',
    }}>
      {category}
    </span>
  )
}

function AddItemForm({ onAdd }: { onAdd: (item: Omit<MaterialItem, 'id' | 'checked'>) => void }) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('pcs')
  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState<ItemCategory>('Other')
  const [showPresets, setShowPresets] = useState(false)
  const [presetFilter, setPresetFilter] = useState('')
  const [activePresetCat, setActivePresetCat] = useState<string | null>(null)

  const filteredPresets = useMemo(() => {
    const q = presetFilter.toLowerCase()
    if (!q && !activePresetCat) return PRESET_CATEGORIES
    return PRESET_CATEGORIES.map(group => ({
      ...group,
      items: group.items.filter(p => {
        const matchesSearch = !q || p.name.toLowerCase().includes(q)
        const matchesCat = !activePresetCat || group.label === activePresetCat
        return matchesSearch && matchesCat
      }),
    })).filter(g => g.items.length > 0)
  }, [presetFilter, activePresetCat])

  const handleSubmit = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), quantity, unit, notes, category })
    setName('')
    setQuantity('')
    setUnit('pcs')
    setNotes('')
    setCategory('Other')
  }

  const handlePresetSelect = (preset: PresetItem) => {
    setName(preset.name)
    setUnit(preset.unit)
    setCategory(preset.cat)
    setShowPresets(false)
    setPresetFilter('')
    setActivePresetCat(null)
  }

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius)',
      border: '1px solid var(--divider)', padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
        Add Material
      </div>

      {/* Material name with preset toggle */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            placeholder="Material name..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              flex: 1, height: 48,
              background: 'var(--input-bg)', border: '2px solid var(--input-border)',
              borderRadius: 'var(--radius-sm)', padding: '0 12px',
              fontSize: 16, color: 'var(--text)',
            }}
          />
          <button
            onClick={() => { setShowPresets(!showPresets); setActivePresetCat(null); setPresetFilter('') }}
            style={{
              width: 48, height: 48, borderRadius: 'var(--radius-sm)',
              background: showPresets ? 'var(--primary)' : 'var(--input-bg)',
              color: showPresets ? '#000' : 'var(--text-secondary)',
              border: `2px solid ${showPresets ? 'var(--primary)' : 'var(--input-border)'}`,
              fontSize: 20, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Common materials"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
          </button>
        </div>

        {/* Preset dropdown */}
        {showPresets && (
          <div style={{
            position: 'absolute', top: 54, left: 0, right: 0, zIndex: 50,
            background: 'var(--surface)', border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-sm)',
            maxHeight: 350, overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <input
              type="text"
              placeholder="Search materials..."
              value={presetFilter}
              onChange={e => setPresetFilter(e.target.value)}
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '10px 12px', fontSize: 14,
                background: 'var(--input-bg)', border: 'none',
                borderBottom: '1px solid var(--divider)',
                color: 'var(--text)', outline: 'none',
                position: 'sticky', top: 0, zIndex: 1,
              }}
            />
            {/* Category filter pills */}
            {!presetFilter && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 4,
                padding: '8px 10px', borderBottom: '1px solid var(--divider)',
                position: 'sticky', top: 44, background: 'var(--surface)', zIndex: 1,
              }}>
                <button
                  onClick={() => setActivePresetCat(null)}
                  style={{
                    padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    background: !activePresetCat ? 'var(--primary)' : 'var(--surface-elevated)',
                    color: !activePresetCat ? '#000' : 'var(--text-secondary)',
                  }}
                >All</button>
                {PRESET_CATEGORIES.map(c => (
                  <button
                    key={c.label}
                    onClick={() => setActivePresetCat(activePresetCat === c.label ? null : c.label)}
                    style={{
                      padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                      border: 'none', cursor: 'pointer',
                      background: activePresetCat === c.label ? 'var(--primary)' : 'var(--surface-elevated)',
                      color: activePresetCat === c.label ? '#000' : 'var(--text-secondary)',
                    }}
                  >{c.label}</button>
                ))}
              </div>
            )}
            {filteredPresets.map(group => (
              <div key={group.label}>
                <div style={{
                  padding: '8px 12px 4px', fontSize: 10, fontWeight: 700,
                  color: 'var(--primary)', textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {group.label}
                </div>
                {group.items.map(p => (
                  <button
                    key={p.name}
                    onClick={() => handlePresetSelect(p)}
                    style={{
                      width: '100%', padding: '8px 12px', textAlign: 'left',
                      fontSize: 14, color: 'var(--text)',
                      background: 'transparent', border: 'none',
                      borderBottom: '1px solid var(--divider)',
                      cursor: 'pointer', minHeight: 36,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                  >
                    <span>{p.name}</span>
                    <CategoryBadge category={p.cat} />
                  </button>
                ))}
              </div>
            ))}
            {filteredPresets.length === 0 && (
              <div style={{ padding: 16, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
                No matches — type a custom name above
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quantity + Unit + Category row */}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Qty"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          style={{
            width: 64, height: 44,
            background: 'var(--input-bg)', border: '2px solid var(--input-border)',
            borderRadius: 'var(--radius-sm)', padding: '0 8px',
            fontSize: 16, color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
          }}
        />
        <select
          value={unit}
          onChange={e => setUnit(e.target.value)}
          style={{
            width: 72, height: 44,
            background: 'var(--input-bg)', border: '2px solid var(--input-border)',
            borderRadius: 'var(--radius-sm)', padding: '0 6px',
            fontSize: 13, color: 'var(--text)', appearance: 'none',
          }}
        >
          {COMMON_UNITS.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as ItemCategory)}
          style={{
            width: 90, height: 44,
            background: 'var(--input-bg)', border: '2px solid var(--input-border)',
            borderRadius: 'var(--radius-sm)', padding: '0 6px',
            fontSize: 12, color: CAT_COLORS[category], fontWeight: 600,
            appearance: 'none',
          }}
        >
          {ALL_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{
            flex: 1, height: 44, minWidth: 0,
            background: 'var(--input-bg)', border: '2px solid var(--input-border)',
            borderRadius: 'var(--radius-sm)', padding: '0 8px',
            fontSize: 13, color: 'var(--text)',
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        style={{
          width: '100%', height: 46,
          background: name.trim() ? 'var(--primary)' : 'var(--input-bg)',
          color: name.trim() ? '#000' : 'var(--text-secondary)',
          border: 'none', borderRadius: 'var(--radius-sm)',
          fontSize: 15, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'default',
          transition: 'all .15s',
        }}
      >
        + Add to List
      </button>
    </div>
  )
}

function MaterialItemRow({
  item,
  onToggle,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  item: MaterialItem
  onToggle: () => void
  onDelete: () => void
  onEdit: (updated: MaterialItem) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [editQty, setEditQty] = useState(item.quantity)
  const [editNotes, setEditNotes] = useState(item.notes)
  const [editCat, setEditCat] = useState(item.category)

  const handleSave = () => {
    onEdit({ ...item, name: editName, quantity: editQty, notes: editNotes, category: editCat })
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{
        padding: 10, background: 'var(--input-bg)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex', flexDirection: 'column', gap: 8,
        border: '2px solid var(--primary)',
      }}>
        <input
          value={editName}
          onChange={e => setEditName(e.target.value)}
          style={{
            height: 40, background: 'var(--surface)',
            border: '1px solid var(--divider)', borderRadius: 6,
            padding: '0 10px', fontSize: 14, color: 'var(--text)',
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={editQty}
            onChange={e => setEditQty(e.target.value)}
            placeholder="Qty"
            style={{
              width: 60, height: 40, background: 'var(--surface)',
              border: '1px solid var(--divider)', borderRadius: 6,
              padding: '0 8px', fontSize: 14, color: 'var(--text)',
            }}
          />
          <select
            value={editCat}
            onChange={e => setEditCat(e.target.value as ItemCategory)}
            style={{
              height: 40, background: 'var(--surface)',
              border: '1px solid var(--divider)', borderRadius: 6,
              padding: '0 6px', fontSize: 12, color: CAT_COLORS[editCat],
              fontWeight: 600, appearance: 'none',
            }}
          >
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
            placeholder="Notes"
            style={{
              flex: 1, height: 40, background: 'var(--surface)',
              border: '1px solid var(--divider)', borderRadius: 6,
              padding: '0 8px', fontSize: 14, color: 'var(--text)',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleSave} style={{
            flex: 1, height: 40, background: 'var(--primary)', color: '#000',
            border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13,
          }}>Save</button>
          <button onClick={() => setEditing(false)} style={{
            flex: 1, height: 40, background: 'var(--surface)', color: 'var(--text)',
            border: '1px solid var(--divider)', borderRadius: 6, fontSize: 13,
          }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 6px',
      borderBottom: '1px solid var(--divider)',
      opacity: item.checked ? 0.45 : 1,
      transition: 'opacity .2s',
    }}>
      {/* Reorder buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flexShrink: 0 }}>
        <button onClick={onMoveUp} disabled={isFirst} style={{
          width: 20, height: 16, border: 'none', background: 'transparent',
          color: isFirst ? 'transparent' : 'var(--text-tertiary)', cursor: isFirst ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        }}>
          <svg width={10} height={10} viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>
        </button>
        <button onClick={onMoveDown} disabled={isLast} style={{
          width: 20, height: 16, border: 'none', background: 'transparent',
          color: isLast ? 'transparent' : 'var(--text-tertiary)', cursor: isLast ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        }}>
          <svg width={10} height={10} viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
      </div>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        style={{
          width: 30, height: 30, flexShrink: 0,
          borderRadius: 6,
          border: `2px solid ${item.checked ? 'var(--primary)' : 'var(--input-border)'}`,
          background: item.checked ? 'var(--primary)' : 'transparent',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {item.checked && (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={3} strokeLinecap="round">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        )}
      </button>

      {/* Material info */}
      <div style={{ flex: 1, minWidth: 0 }} onClick={() => setEditing(true)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 14, fontWeight: 500, color: 'var(--text)',
            textDecoration: item.checked ? 'line-through' : 'none',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {item.name}
          </span>
          <CategoryBadge category={item.category} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 1 }}>
          {item.quantity && (
            <span style={{
              fontSize: 11, color: 'var(--primary)',
              fontFamily: 'var(--font-mono)', fontWeight: 600,
            }}>
              {item.quantity} {item.unit}
            </span>
          )}
          {item.notes && (
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              {item.notes}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        style={{
          width: 28, height: 28, flexShrink: 0,
          border: 'none', background: 'transparent',
          color: 'var(--text-secondary)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────

export default function MaterialListPage() {
  const [jobs, setJobs] = useState<Job[]>(loadJobs)
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [showNewJob, setShowNewJob] = useState(false)
  const [newJobName, setNewJobName] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [confirmDeleteJob, setConfirmDeleteJob] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('added')
  const [groupByCategory, setGroupByCategory] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Persist on every change
  useEffect(() => { saveJobs(jobs) }, [jobs])

  const activeJob = jobs.find(j => j.id === activeJobId) ?? null
  const visibleJobs = jobs.filter(j => showArchived ? j.archived : !j.archived)

  const updateJobs = useCallback((fn: (prev: Job[]) => Job[]) => {
    setJobs(prev => fn(prev))
  }, [])

  // ── Sort items ──────────────────────────────────────────
  const sortItems = useCallback((items: MaterialItem[]): MaterialItem[] => {
    const sorted = [...items]
    switch (sortMode) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'category':
        sorted.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
        break
      case 'unchecked':
        sorted.sort((a, b) => (a.checked ? 1 : 0) - (b.checked ? 1 : 0))
        break
      default: // 'added' - preserve insertion order
        break
    }
    return sorted
  }, [sortMode])

  // ── Job CRUD ──────────────────────────────────────────
  const createJob = () => {
    if (!newJobName.trim()) return
    const job: Job = {
      id: uid(),
      name: newJobName.trim(),
      createdAt: Date.now(),
      items: [],
      archived: false,
    }
    updateJobs(prev => [job, ...prev])
    setActiveJobId(job.id)
    setNewJobName('')
    setShowNewJob(false)
    setShowTemplates(false)
  }

  const createFromTemplate = (template: JobTemplate) => {
    const job: Job = {
      id: uid(),
      name: template.name,
      createdAt: Date.now(),
      items: template.items.map(i => ({ ...i, id: uid(), checked: false })),
      archived: false,
    }
    updateJobs(prev => [job, ...prev])
    setActiveJobId(job.id)
    setShowNewJob(false)
    setShowTemplates(false)
  }

  const archiveJob = (id: string) => {
    updateJobs(prev => prev.map(j => j.id === id ? { ...j, archived: !j.archived } : j))
    if (activeJobId === id) setActiveJobId(null)
  }

  const deleteJob = (id: string) => {
    updateJobs(prev => prev.filter(j => j.id !== id))
    if (activeJobId === id) setActiveJobId(null)
    setConfirmDeleteJob(null)
  }

  const duplicateJob = (id: string) => {
    const source = jobs.find(j => j.id === id)
    if (!source) return
    const copy: Job = {
      ...source,
      id: uid(),
      name: `${source.name} (copy)`,
      createdAt: Date.now(),
      items: source.items.map(i => ({ ...i, id: uid(), checked: false })),
      archived: false,
    }
    updateJobs(prev => [copy, ...prev])
    setActiveJobId(copy.id)
  }

  const copyJobToClipboard = () => {
    if (!activeJob) return
    const text = formatJobAsText(activeJob)
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    })
  }

  // ── Item CRUD ─────────────────────────────────────────
  const addItem = (item: Omit<MaterialItem, 'id' | 'checked'>) => {
    if (!activeJobId) return
    const newItem: MaterialItem = { ...item, id: uid(), checked: false }
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId ? { ...j, items: [...j.items, newItem] } : j
    ))
  }

  const toggleItem = (itemId: string) => {
    if (!activeJobId) return
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId
        ? { ...j, items: j.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) }
        : j
    ))
  }

  const deleteItem = (itemId: string) => {
    if (!activeJobId) return
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId
        ? { ...j, items: j.items.filter(i => i.id !== itemId) }
        : j
    ))
  }

  const editItem = (updated: MaterialItem) => {
    if (!activeJobId) return
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId
        ? { ...j, items: j.items.map(i => i.id === updated.id ? updated : i) }
        : j
    ))
  }

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    if (!activeJobId) return
    updateJobs(prev => prev.map(j => {
      if (j.id !== activeJobId) return j
      const idx = j.items.findIndex(i => i.id === itemId)
      if (idx < 0) return j
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= j.items.length) return j
      const newItems = [...j.items]
      const tmp = newItems[idx]
      newItems[idx] = newItems[newIdx]
      newItems[newIdx] = tmp
      return { ...j, items: newItems }
    }))
  }

  const clearChecked = () => {
    if (!activeJobId) return
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId
        ? { ...j, items: j.items.filter(i => !i.checked) }
        : j
    ))
  }

  // ── Render: Job Detail View ───────────────────────────
  if (activeJob) {
    const allItems = sortMode === 'added' ? activeJob.items : sortItems(activeJob.items)
    const totalItems = activeJob.items.length
    const checkedCount = activeJob.items.filter(i => i.checked).length

    // Group items by category for grouped view
    const grouped = useMemo(() => {
      if (!groupByCategory) return null
      const map = new Map<ItemCategory, MaterialItem[]>()
      for (const item of allItems) {
        const list = map.get(item.category) || []
        list.push(item)
        map.set(item.category, list)
      }
      return map
    }, [allItems, groupByCategory])

    const renderItemRow = (item: MaterialItem, idx: number, arr: MaterialItem[]) => (
      <MaterialItemRow
        key={item.id}
        item={item}
        onToggle={() => toggleItem(item.id)}
        onDelete={() => deleteItem(item.id)}
        onEdit={editItem}
        onMoveUp={() => moveItem(item.id, 'up')}
        onMoveDown={() => moveItem(item.id, 'down')}
        isFirst={idx === 0}
        isLast={idx === arr.length - 1}
      />
    )

    return (
      <>
        <Header title={activeJob.name} />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 100 }}>

          {/* Progress bar */}
          {totalItems > 0 && (
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6,
              }}>
                <span>{checkedCount} of {totalItems} collected</span>
                <span>{totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0}%</span>
              </div>
              <div style={{
                height: 6, background: 'var(--input-bg)',
                borderRadius: 3, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  background: checkedCount === totalItems ? '#22c55e' : 'var(--primary)',
                  width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%`,
                  transition: 'width .3s ease',
                }} />
              </div>
            </div>
          )}

          {/* Action bar: Copy + Sort + Group */}
          {totalItems > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {/* Copy to clipboard */}
              <button onClick={copyJobToClipboard} style={{
                height: 34, padding: '0 12px', borderRadius: 6,
                background: copyFeedback ? '#22c55e' : 'var(--surface-elevated)',
                color: copyFeedback ? '#000' : 'var(--text-secondary)',
                border: '1px solid var(--divider)', fontSize: 11, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all .2s',
              }}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                {copyFeedback ? 'Copied!' : 'Copy List'}
              </button>

              {/* Sort dropdown */}
              <select
                value={sortMode}
                onChange={e => setSortMode(e.target.value as SortMode)}
                style={{
                  height: 34, padding: '0 8px', borderRadius: 6,
                  background: 'var(--surface-elevated)', color: 'var(--text-secondary)',
                  border: '1px solid var(--divider)', fontSize: 11, fontWeight: 600,
                  appearance: 'none', cursor: 'pointer',
                }}
              >
                <option value="added">Sort: Added</option>
                <option value="name">Sort: Name</option>
                <option value="category">Sort: Category</option>
                <option value="unchecked">Sort: Needed First</option>
              </select>

              {/* Group toggle */}
              <button onClick={() => setGroupByCategory(!groupByCategory)} style={{
                height: 34, padding: '0 12px', borderRadius: 6,
                background: groupByCategory ? 'var(--primary)' : 'var(--surface-elevated)',
                color: groupByCategory ? '#000' : 'var(--text-secondary)',
                border: '1px solid var(--divider)', fontSize: 11, fontWeight: 600,
                cursor: 'pointer',
              }}>
                {groupByCategory ? 'Grouped' : 'Group'}
              </button>

              {/* Clear checked */}
              {checkedCount > 0 && (
                <button onClick={clearChecked} style={{
                  height: 34, padding: '0 10px', borderRadius: 6,
                  background: 'var(--surface-elevated)',
                  color: '#ef4444', border: '1px solid var(--divider)',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto',
                }}>
                  Clear {checkedCount} Done
                </button>
              )}
            </div>
          )}

          {/* Add item form */}
          <AddItemForm onAdd={addItem} />

          {/* Grouped view */}
          {groupByCategory && grouped ? (
            Array.from(grouped.entries()).map(([cat, items]) => (
              <div key={cat} style={{
                background: 'var(--surface)', borderRadius: 'var(--radius)',
                border: '1px solid var(--divider)', overflow: 'hidden',
              }}>
                <div style={{
                  padding: '8px 12px', fontSize: 12, fontWeight: 700,
                  color: CAT_COLORS[cat], textTransform: 'uppercase',
                  letterSpacing: 0.5, borderBottom: '1px solid var(--divider)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderLeft: `3px solid ${CAT_COLORS[cat]}`,
                }}>
                  <span>{cat}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    {items.filter(i => !i.checked).length}/{items.length}
                  </span>
                </div>
                {items.map((item, idx) => renderItemRow(item, idx, items))}
              </div>
            ))
          ) : (
            /* Flat view: Unchecked then Checked */
            <>
              {allItems.filter(i => !i.checked).length > 0 && (
                <div style={{
                  background: 'var(--surface)', borderRadius: 'var(--radius)',
                  border: '1px solid var(--divider)', overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '10px 12px', fontSize: 12, fontWeight: 600,
                    color: 'var(--text-secondary)', textTransform: 'uppercase',
                    letterSpacing: 0.5, borderBottom: '1px solid var(--divider)',
                  }}>
                    Needed ({allItems.filter(i => !i.checked).length})
                  </div>
                  {(() => { const unchecked = allItems.filter(i => !i.checked); return unchecked.map((item, idx) => renderItemRow(item, idx, unchecked)) })()}
                </div>
              )}

              {allItems.filter(i => i.checked).length > 0 && (
                <div style={{
                  background: 'var(--surface)', borderRadius: 'var(--radius)',
                  border: '1px solid var(--divider)', overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '10px 12px', fontSize: 12, fontWeight: 600,
                    color: 'var(--text-secondary)', textTransform: 'uppercase',
                    letterSpacing: 0.5, borderBottom: '1px solid var(--divider)',
                  }}>
                    Collected ({allItems.filter(i => i.checked).length})
                  </div>
                  {(() => { const checked = allItems.filter(i => i.checked); return checked.map((item, idx) => renderItemRow(item, idx, checked)) })()}
                </div>
              )}
            </>
          )}

          {/* Empty state */}
          {totalItems === 0 && (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: 'var(--text-secondary)',
            }}>
              <svg width={48} height={48} viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.3, marginBottom: 12 }}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17 12h-4V8h-2v4H7v2h4v4h2v-4h4z"/>
              </svg>
              <div style={{ fontSize: 15, fontWeight: 500 }}>No materials yet</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Add materials above or use the preset list
              </div>
            </div>
          )}

          {/* Back to jobs button */}
          <button
            onClick={() => setActiveJobId(null)}
            style={{
              width: '100%', height: 48,
              background: 'var(--input-bg)', color: 'var(--text-secondary)',
              border: '1px solid var(--divider)', borderRadius: 'var(--radius-sm)',
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            All Jobs
          </button>
        </div>
      </>
    )
  }

  // ── Render: Job List View ─────────────────────────────
  return (
    <>
      <Header title="Material Lists" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 100 }}>

        {/* New Job / Template buttons */}
        {showTemplates ? (
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius)',
            border: '2px solid var(--primary)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 14px', fontSize: 14, fontWeight: 600, color: 'var(--text)',
              borderBottom: '1px solid var(--divider)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Start from Template</span>
              <button onClick={() => setShowTemplates(false)} style={{
                width: 28, height: 28, border: 'none', background: 'transparent',
                color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 18,
              }}>&times;</button>
            </div>
            {JOB_TEMPLATES.map((t, i) => (
              <button key={i} onClick={() => createFromTemplate(t)} style={{
                width: '100%', padding: '12px 14px', textAlign: 'left',
                background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: '1px solid var(--divider)',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {t.description} · {t.items.length} items
                </div>
              </button>
            ))}
          </div>
        ) : showNewJob ? (
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius)',
            border: '2px solid var(--primary)', padding: 14,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>New Job</div>
            <input
              type="text"
              placeholder="Job name or location..."
              value={newJobName}
              onChange={e => setNewJobName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createJob()}
              autoFocus
              style={{
                height: 48, background: 'var(--input-bg)',
                border: '2px solid var(--input-border)',
                borderRadius: 'var(--radius-sm)', padding: '0 14px',
                fontSize: 16, color: 'var(--text)',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={createJob} disabled={!newJobName.trim()} style={{
                flex: 1, height: 48, background: newJobName.trim() ? 'var(--primary)' : 'var(--input-bg)',
                color: newJobName.trim() ? '#000' : 'var(--text-secondary)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontSize: 15, fontWeight: 700, cursor: newJobName.trim() ? 'pointer' : 'default',
              }}>Create</button>
              <button onClick={() => { setShowNewJob(false); setNewJobName('') }} style={{
                width: 48, height: 48, background: 'var(--input-bg)',
                color: 'var(--text-secondary)', border: '1px solid var(--divider)',
                borderRadius: 'var(--radius-sm)', fontSize: 18, cursor: 'pointer',
              }}>&times;</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowNewJob(true)}
              style={{
                flex: 1, height: 56,
                background: 'var(--primary)', color: '#000',
                border: 'none', borderRadius: 'var(--radius)',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              New Job
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              style={{
                width: 56, height: 56,
                background: 'var(--surface)', color: 'var(--text-secondary)',
                border: '1px solid var(--divider)', borderRadius: 'var(--radius)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="From template"
            >
              <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11z"/>
              </svg>
            </button>
          </div>
        )}

        {/* Active/Archived toggle */}
        <div style={{
          display: 'flex', gap: 4, background: 'var(--input-bg)',
          borderRadius: 'var(--radius-sm)', padding: 4,
        }}>
          <button onClick={() => setShowArchived(false)} style={{
            flex: 1, height: 40, borderRadius: 6,
            background: !showArchived ? 'var(--primary)' : 'transparent',
            color: !showArchived ? '#000' : 'var(--text-secondary)',
            border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Active ({jobs.filter(j => !j.archived).length})</button>
          <button onClick={() => setShowArchived(true)} style={{
            flex: 1, height: 40, borderRadius: 6,
            background: showArchived ? 'var(--primary)' : 'transparent',
            color: showArchived ? '#000' : 'var(--text-secondary)',
            border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Archived ({jobs.filter(j => j.archived).length})</button>
        </div>

        {/* Job cards */}
        {visibleJobs.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            color: 'var(--text-secondary)',
          }}>
            <svg width={56} height={56} viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.2, marginBottom: 16 }}>
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
            <div style={{ fontSize: 16, fontWeight: 500 }}>
              {showArchived ? 'No archived jobs' : 'No jobs yet'}
            </div>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              {showArchived
                ? 'Archived jobs will appear here'
                : 'Create a new job or start from a template'
              }
            </div>
          </div>
        )}

        {visibleJobs.map(job => {
          const totalItems = job.items.length
          const checkedCount = job.items.filter(i => i.checked).length
          const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0
          const dateStr = new Date(job.createdAt).toLocaleDateString('en-CA', {
            month: 'short', day: 'numeric', year: 'numeric',
          })
          // Show category breakdown
          const catCounts = new Map<ItemCategory, number>()
          for (const item of job.items) {
            catCounts.set(item.category, (catCounts.get(item.category) || 0) + 1)
          }

          return (
            <div key={job.id} style={{
              background: 'var(--surface)', borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)', overflow: 'hidden',
            }}>
              {/* Job card header - clickable to open */}
              <button
                onClick={() => setActiveJobId(job.id)}
                style={{
                  width: '100%', padding: '14px 14px 10px', textAlign: 'left',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{job.name}</span>
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span>{dateStr}</span>
                  <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                  {totalItems > 0 && (
                    <span style={{ color: progress === 100 ? '#22c55e' : 'var(--primary)', fontWeight: 600 }}>
                      {progress}%
                    </span>
                  )}
                </div>
                {/* Category dots */}
                {catCounts.size > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {Array.from(catCounts.entries()).map(([cat, count]) => (
                      <span key={cat} style={{
                        fontSize: 9, fontWeight: 600,
                        color: CAT_COLORS[cat],
                        background: CAT_COLORS[cat] + '12',
                        padding: '1px 5px', borderRadius: 3,
                      }}>
                        {cat} {count}
                      </span>
                    ))}
                  </div>
                )}
                {/* Mini progress bar */}
                {totalItems > 0 && (
                  <div style={{
                    height: 4, background: 'var(--input-bg)',
                    borderRadius: 2, overflow: 'hidden', width: '100%',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: progress === 100 ? '#22c55e' : 'var(--primary)',
                      width: `${progress}%`,
                      transition: 'width .3s ease',
                    }} />
                  </div>
                )}
              </button>

              {/* Job actions row */}
              <div style={{
                display: 'flex', borderTop: '1px solid var(--divider)',
              }}>
                <button onClick={() => duplicateJob(job.id)} style={{
                  flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 500,
                  color: 'var(--text-secondary)', background: 'transparent',
                  border: 'none', cursor: 'pointer',
                  borderRight: '1px solid var(--divider)',
                }}>Duplicate</button>
                <button onClick={() => archiveJob(job.id)} style={{
                  flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 500,
                  color: 'var(--text-secondary)', background: 'transparent',
                  border: 'none', cursor: 'pointer',
                  borderRight: '1px solid var(--divider)',
                }}>{job.archived ? 'Restore' : 'Archive'}</button>
                {confirmDeleteJob === job.id ? (
                  <button onClick={() => deleteJob(job.id)} style={{
                    flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700,
                    color: '#ef4444', background: 'transparent',
                    border: 'none', cursor: 'pointer',
                  }}>Confirm</button>
                ) : (
                  <button onClick={() => setConfirmDeleteJob(job.id)} style={{
                    flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 500,
                    color: 'var(--text-secondary)', background: 'transparent',
                    border: 'none', cursor: 'pointer',
                  }}>Delete</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
