import { useState } from 'react'
import Header from '../../layout/Header'

/* ================================================================== */
/*  Single-Line Diagram Builder                                        */
/*  Open Pit Mine Electrical — Quick Documentation Tool                */
/*  Per O.Reg 854: Single-line diagrams required at each substation    */
/* ================================================================== */

type TabKey = 'builder' | 'configs' | 'symbols'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ComponentType =
  | 'utility'
  | 'transformer'
  | 'breaker'
  | 'fuse'
  | 'disconnect'
  | 'motor'
  | 'bus'
  | 'cable'

interface DiagramComponent {
  id: number
  type: ComponentType
  label?: string
  voltage?: string
  kva?: string
  hp?: string
  amps?: string
  notes?: string
}

interface MineConfig {
  name: string
  description: string
  components: DiagramComponent[]
  notes: string[]
}

interface SymbolRef {
  name: string
  category: string
  description: string
  standard: string
  render: (x: number, y: number) => React.ReactNode
}

/* ------------------------------------------------------------------ */
/*  SVG Symbol Renderers — used across all three tabs                  */
/* ------------------------------------------------------------------ */

const SVG_W = 280
const COMP_H = 80
const CX = SVG_W / 2

function renderUtility(x: number, y: number, label?: string, voltage?: string) {
  return (
    <g key={`util-${y}`}>
      <circle cx={x} cy={y + 25} r={20} fill="none" stroke="var(--primary)" strokeWidth={2} />
      <line x1={x - 10} y1={y + 18} x2={x + 10} y2={y + 18} stroke="var(--primary)" strokeWidth={2} />
      <line x1={x - 7} y1={y + 25} x2={x + 7} y2={y + 25} stroke="var(--primary)" strokeWidth={2} />
      <line x1={x - 4} y1={y + 32} x2={x + 4} y2={y + 32} stroke="var(--primary)" strokeWidth={2} />
      <text x={x + 30} y={y + 22} fill="var(--text)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">{label || 'Utility Source'}</text>
      {voltage && <text x={x + 30} y={y + 37} fill="var(--primary)" fontSize={11} fontWeight={700} fontFamily="var(--font-mono)">{voltage}</text>}
      <line x1={x} y1={y + 45} x2={x} y2={y + COMP_H} stroke="var(--text-secondary)" strokeWidth={2} />
    </g>
  )
}

function renderTransformer(x: number, y: number, label?: string, kva?: string, voltage?: string) {
  return (
    <g key={`xfmr-${y}`}>
      <line x1={x} y1={y} x2={x} y2={y + 10} stroke="var(--text-secondary)" strokeWidth={2} />
      <circle cx={x} cy={y + 22} r={12} fill="none" stroke="var(--primary)" strokeWidth={2} />
      <circle cx={x} cy={y + 40} r={12} fill="none" stroke="var(--primary)" strokeWidth={2} />
      <text x={x + 30} y={y + 22} fill="var(--text)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">{label || 'Transformer'}</text>
      {kva && <text x={x + 30} y={y + 37} fill="var(--text-secondary)" fontSize={11} fontFamily="var(--font-mono)">{kva} kVA</text>}
      {voltage && <text x={x + 30} y={y + 52} fill="var(--primary)" fontSize={11} fontWeight={700} fontFamily="var(--font-mono)">{voltage}</text>}
      <line x1={x} y1={y + 52} x2={x} y2={y + COMP_H} stroke="var(--text-secondary)" strokeWidth={2} />
    </g>
  )
}

function renderBreaker(x: number, y: number, label?: string, amps?: string) {
  return (
    <g key={`bkr-${y}`}>
      <line x1={x} y1={y} x2={x} y2={y + 15} stroke="var(--text-secondary)" strokeWidth={2} />
      <rect x={x - 12} y={y + 15} width={24} height={30} rx={3} fill="none" stroke="var(--primary)" strokeWidth={2} />
      <line x1={x - 6} y1={y + 23} x2={x + 6} y2={y + 23} stroke="var(--primary)" strokeWidth={2} />
      <text x={x} y={y + 37} textAnchor="middle" fill="var(--primary)" fontSize={9} fontWeight={700}>CB</text>
      <text x={x + 22} y={y + 28} fill="var(--text)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">{label || 'Breaker'}</text>
      {amps && <text x={x + 22} y={y + 42} fill="var(--text-secondary)" fontSize={11} fontFamily="var(--font-mono)">{amps}A Trip</text>}
      <line x1={x} y1={y + 45} x2={x} y2={y + COMP_H} stroke="var(--text-secondary)" strokeWidth={2} />
    </g>
  )
}

function renderFuse(x: number, y: number, label?: string, amps?: string) {
  return (
    <g key={`fuse-${y}`}>
      <line x1={x} y1={y} x2={x} y2={y + 18} stroke="var(--text-secondary)" strokeWidth={2} />
      <rect x={x - 4} y={y + 18} width={8} height={24} rx={2} fill="none" stroke="var(--primary)" strokeWidth={2} />
      <line x1={x} y1={y + 22} x2={x} y2={y + 38} stroke="var(--primary)" strokeWidth={1.5} />
      <text x={x + 16} y={y + 28} fill="var(--text)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">{label || 'Fuse'}</text>
      {amps && <text x={x + 16} y={y + 42} fill="var(--text-secondary)" fontSize={11} fontFamily="var(--font-mono)">{amps}A</text>}
      <line x1={x} y1={y + 42} x2={x} y2={y + COMP_H} stroke="var(--text-secondary)" strokeWidth={2} />
    </g>
  )
}

function renderDisconnect(x: number, y: number, label?: string, amps?: string) {
  return (
    <g key={`disc-${y}`}>
      <line x1={x} y1={y} x2={x} y2={y + 20} stroke="var(--text-secondary)" strokeWidth={2} />
      <circle cx={x} cy={y + 22} r={3} fill="var(--primary)" />
      <line x1={x} y1={y + 22} x2={x + 14} y2={y + 10} stroke="var(--primary)" strokeWidth={2.5} />
      <circle cx={x} cy={y + 38} r={3} fill="var(--primary)" />
      <text x={x + 22} y={y + 22} fill="var(--text)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">{label || 'Disconnect'}</text>
      {amps && <text x={x + 22} y={y + 38} fill="var(--text-secondary)" fontSize={11} fontFamily="var(--font-mono)">{amps}A</text>}
      <line x1={x} y1={y + 41} x2={x} y2={y + COMP_H} stroke="var(--text-secondary)" strokeWidth={2} />
    </g>
  )
}

function renderMotor(x: number, y: number, label?: string, hp?: string, voltage?: string) {
  return (
    <g key={`motor-${y}`}>
      <line x1={x} y1={y} x2={x} y2={y + 12} stroke="var(--text-secondary)" strokeWidth={2} />
      <circle cx={x} cy={y + 30} r={18} fill="none" stroke="var(--primary)" strokeWidth={2} />
      <text x={x} y={y + 35} textAnchor="middle" fill="var(--primary)" fontSize={14} fontWeight={700}>M</text>
      <text x={x + 28} y={y + 25} fill="var(--text)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">{label || 'Motor'}</text>
      {hp && <text x={x + 28} y={y + 40} fill="var(--text-secondary)" fontSize={11} fontFamily="var(--font-mono)">{hp} HP</text>}
      {voltage && <text x={x + 28} y={y + 55} fill="var(--primary)" fontSize={11} fontWeight={700} fontFamily="var(--font-mono)">{voltage}</text>}
    </g>
  )
}

function renderBus(x: number, y: number, label?: string, voltage?: string) {
  return (
    <g key={`bus-${y}`}>
      <line x1={x} y1={y} x2={x} y2={y + 25} stroke="var(--text-secondary)" strokeWidth={2} />
      <line x1={x - 50} y1={y + 25} x2={x + 50} y2={y + 25} stroke="var(--primary)" strokeWidth={4} />
      <text x={x + 58} y={y + 22} fill="var(--text)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">{label || 'Bus'}</text>
      {voltage && <text x={x + 58} y={y + 37} fill="var(--primary)" fontSize={11} fontWeight={700} fontFamily="var(--font-mono)">{voltage}</text>}
      <line x1={x} y1={y + 25} x2={x} y2={y + COMP_H} stroke="var(--text-secondary)" strokeWidth={2} />
    </g>
  )
}

function renderCable(x: number, y: number, label?: string, notes?: string) {
  return (
    <g key={`cable-${y}`}>
      <line x1={x} y1={y} x2={x} y2={y + 10} stroke="var(--text-secondary)" strokeWidth={2} />
      <line x1={x} y1={y + 10} x2={x} y2={y + 50} stroke="var(--text-secondary)" strokeWidth={2} strokeDasharray="6,4" />
      <text x={x + 16} y={y + 28} fill="var(--text)" fontSize={12} fontWeight={600} fontFamily="var(--font-display)">{label || 'Cable / Feeder'}</text>
      {notes && <text x={x + 16} y={y + 42} fill="var(--text-secondary)" fontSize={11} fontFamily="var(--font-mono)">{notes}</text>}
      <line x1={x} y1={y + 50} x2={x} y2={y + COMP_H} stroke="var(--text-secondary)" strokeWidth={2} />
    </g>
  )
}

function renderComponent(comp: DiagramComponent, x: number, y: number) {
  switch (comp.type) {
    case 'utility': return renderUtility(x, y, comp.label, comp.voltage)
    case 'transformer': return renderTransformer(x, y, comp.label, comp.kva, comp.voltage)
    case 'breaker': return renderBreaker(x, y, comp.label, comp.amps)
    case 'fuse': return renderFuse(x, y, comp.label, comp.amps)
    case 'disconnect': return renderDisconnect(x, y, comp.label, comp.amps)
    case 'motor': return renderMotor(x, y, comp.label, comp.hp, comp.voltage)
    case 'bus': return renderBus(x, y, comp.label, comp.voltage)
    case 'cable': return renderCable(x, y, comp.label, comp.notes)
    default: return null
  }
}

/* ------------------------------------------------------------------ */
/*  Component Palette                                                  */
/* ------------------------------------------------------------------ */

interface PaletteItem {
  type: ComponentType
  label: string
  defaultVoltage?: string
  icon: string
}

const palette: PaletteItem[] = [
  { type: 'utility', label: 'Utility / Grid', defaultVoltage: '44kV', icon: 'U' },
  { type: 'transformer', label: 'Transformer', defaultVoltage: '4160V', icon: 'T' },
  { type: 'breaker', label: 'Circuit Breaker', icon: 'CB' },
  { type: 'fuse', label: 'Fuse', icon: 'F' },
  { type: 'disconnect', label: 'Disconnect', icon: 'DS' },
  { type: 'motor', label: 'Motor', icon: 'M' },
  { type: 'bus', label: 'Bus', icon: 'B' },
  { type: 'cable', label: 'Cable / Feeder', icon: 'C' },
]

/* ------------------------------------------------------------------ */
/*  Pre-built Mine Configurations                                      */
/* ------------------------------------------------------------------ */

const mineConfigs: MineConfig[] = [
  {
    name: 'Main Substation — 44kV to 4160V',
    description: 'Primary substation at pit rim. Receives utility power and distributes to portable subs and large equipment.',
    components: [
      { id: 1, type: 'utility', label: 'Utility Grid', voltage: '44kV' },
      { id: 2, type: 'breaker', label: 'Main Incoming CB', amps: '600' },
      { id: 3, type: 'fuse', label: 'HV Fuse', amps: '100E' },
      { id: 4, type: 'transformer', label: 'Main Transformer', kva: '5000', voltage: '44kV / 4160V' },
      { id: 5, type: 'breaker', label: 'Secondary Main CB', amps: '1200' },
      { id: 6, type: 'bus', label: '4160V Main Bus', voltage: '4160V' },
      { id: 7, type: 'breaker', label: 'Feeder CB #1', amps: '400' },
      { id: 8, type: 'cable', label: 'To Portable Sub #1', notes: '#2 AWG SHD-GC' },
    ],
    notes: [
      'Ground fault relay set at 40A pickup, 0.15s delay',
      'Available fault current: 8,500A at 4160V bus',
      'Main transformer Z = 5.75%',
      'Surge arresters on both primary and secondary',
    ],
  },
  {
    name: 'Portable Substation — 4160V to 600V',
    description: 'Portable sub moved with pit progression. Feeds shovels, drills, and auxiliary equipment.',
    components: [
      { id: 1, type: 'cable', label: 'From Main Sub', notes: '4160V feeder' },
      { id: 2, type: 'disconnect', label: 'Incoming Disconnect', amps: '400' },
      { id: 3, type: 'breaker', label: 'Primary CB', amps: '400' },
      { id: 4, type: 'transformer', label: 'Portable Sub Xfmr', kva: '2000', voltage: '4160V / 600V' },
      { id: 5, type: 'breaker', label: 'Secondary Main CB', amps: '2000' },
      { id: 6, type: 'bus', label: '600V Distribution Bus', voltage: '600V' },
      { id: 7, type: 'breaker', label: 'Shovel Feeder CB', amps: '600' },
      { id: 8, type: 'cable', label: 'Trailing Cable to Shovel', notes: '#4/0 SHD-GC' },
    ],
    notes: [
      'Ground fault protection: 100mA, 200ms max (O.Reg 854)',
      'Trailing cable monitoring required on all feeders',
      'Available fault current: 22,000A at 600V bus',
      'Must be on skids or trailer for relocation',
    ],
  },
  {
    name: 'Shovel Power Circuit',
    description: 'Electric rope shovel or hydraulic shovel power feed from portable substation.',
    components: [
      { id: 1, type: 'bus', label: '600V Sub Bus', voltage: '600V' },
      { id: 2, type: 'breaker', label: 'Shovel Feeder CB', amps: '600' },
      { id: 3, type: 'cable', label: 'Trailing Cable', notes: '#4/0 SHD-GC, 300m' },
      { id: 4, type: 'disconnect', label: 'Shovel Main Disc.', amps: '600' },
      { id: 5, type: 'breaker', label: 'Hoist Motor CB', amps: '400' },
      { id: 6, type: 'motor', label: 'Hoist Motor', hp: '800', voltage: '600V' },
    ],
    notes: [
      'Trailing cable must have ground check conductor',
      'Pilot wire monitoring for cable continuity',
      'Ground fault protection: 100mA, 200ms',
      'Shovel must be grounded to frame per O.Reg 854 s.160',
    ],
  },
  {
    name: 'Crusher / Conveyor Power',
    description: 'In-pit crusher and conveyor drive power circuit from MCC.',
    components: [
      { id: 1, type: 'bus', label: '600V MCC Bus', voltage: '600V' },
      { id: 2, type: 'breaker', label: 'Crusher Feeder CB', amps: '800' },
      { id: 3, type: 'fuse', label: 'Backup Fuse', amps: '500' },
      { id: 4, type: 'cable', label: 'Armored Cable', notes: 'TECK 350 MCM' },
      { id: 5, type: 'disconnect', label: 'Local Disconnect', amps: '600' },
      { id: 6, type: 'motor', label: 'Crusher Motor', hp: '500', voltage: '600V' },
    ],
    notes: [
      'VFD typically used for soft start and speed control',
      'Crusher motor FLA approx. 473A at 600V',
      'Locked rotor current: 6x FLA = 2,838A',
      'Motor space heaters on when idle',
    ],
  },
  {
    name: 'Mine Dewatering Pump',
    description: 'Submersible or vertical turbine pump for pit dewatering. Critical safety system.',
    components: [
      { id: 1, type: 'bus', label: '600V Distribution', voltage: '600V' },
      { id: 2, type: 'breaker', label: 'Pump Feeder CB', amps: '200' },
      { id: 3, type: 'cable', label: 'Submersible Cable', notes: '#2 AWG, 150m' },
      { id: 4, type: 'disconnect', label: 'Pump Disconnect', amps: '200' },
      { id: 5, type: 'motor', label: 'Pump Motor', hp: '150', voltage: '600V' },
    ],
    notes: [
      'Dewatering is critical for mine safety',
      'Backup pump on auto-transfer required',
      'Float switch / level transmitter control',
      'Ground fault protection mandatory per O.Reg 854',
    ],
  },
  {
    name: 'Surface Building Distribution',
    description: 'Shop, office, or maintenance building power from mine grid.',
    components: [
      { id: 1, type: 'cable', label: 'From 600V Bus', notes: '600V feeder' },
      { id: 2, type: 'disconnect', label: 'Building Disc.', amps: '400' },
      { id: 3, type: 'breaker', label: 'Main Breaker', amps: '400' },
      { id: 4, type: 'transformer', label: 'Dry-Type Xfmr', kva: '75', voltage: '600V / 120/208V' },
      { id: 5, type: 'breaker', label: 'Panel Main', amps: '200' },
      { id: 6, type: 'bus', label: '120/208V Panel', voltage: '120/208V' },
    ],
    notes: [
      'GFCI required on all 120V convenience outlets',
      'Emergency lighting with battery backup',
      'Arc flash labels required on all panels',
      'Panel schedule must be posted and current',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Symbols Reference Data                                             */
/* ------------------------------------------------------------------ */

const symbolCategories = [
  'All', 'Sources', 'Transformers', 'Switching', 'Protective', 'Motors', 'Loads', 'Buses', 'Grounding',
]

function makeSymbolRefs(): SymbolRef[] {
  return [
    // Sources
    {
      name: 'AC Voltage Source',
      category: 'Sources',
      description: 'Utility or generator AC source. Sine wave inside circle.',
      standard: 'IEEE C37.2',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={16} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <path d={`M${x - 8},${y} Q${x - 4},${y - 8} ${x},${y} Q${x + 4},${y + 8} ${x + 8},${y}`} fill="none" stroke="var(--primary)" strokeWidth={1.5} />
        </g>
      ),
    },
    {
      name: 'DC Voltage Source',
      category: 'Sources',
      description: 'Battery or DC rectifier source. Plus and minus inside circle.',
      standard: 'IEEE C37.2',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={16} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 6} y1={y - 4} x2={x + 6} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x} y1={y - 10} x2={x} y2={y + 2} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 6} y1={y + 6} x2={x + 6} y2={y + 6} stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Three-Phase Source',
      category: 'Sources',
      description: 'Three-phase utility or generator. Circle with 3-phase symbol.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={16} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 5} textAnchor="middle" fill="var(--primary)" fontSize={13} fontWeight={700}>3~</text>
        </g>
      ),
    },
    {
      name: 'Generator',
      category: 'Sources',
      description: 'Generator symbol. Circle with G designation.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={16} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 5} textAnchor="middle" fill="var(--primary)" fontSize={14} fontWeight={700}>G</text>
        </g>
      ),
    },
    // Transformers
    {
      name: 'Two-Winding Transformer',
      category: 'Transformers',
      description: 'Standard two-winding power transformer. Two circles touching.',
      standard: 'IEEE/CSA C12',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y - 8} r={10} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <circle cx={x} cy={y + 8} r={10} fill="none" stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Auto-Transformer',
      category: 'Transformers',
      description: 'Single winding with tap. Used for voltage regulation and reduced voltage starting.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y - 8} r={10} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <circle cx={x} cy={y + 8} r={10} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <line x1={x + 10} y1={y - 8} x2={x + 18} y2={y - 8} stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Current Transformer',
      category: 'Transformers',
      description: 'CT for metering and relay protection. Donut around conductor.',
      standard: 'IEEE C57.13',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={12} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <line x1={x} y1={y - 18} x2={x} y2={y + 18} stroke="var(--text-secondary)" strokeWidth={2} />
          <text x={x} y={y + 4} textAnchor="middle" fill="var(--primary)" fontSize={10} fontWeight={700}>CT</text>
        </g>
      ),
    },
    {
      name: 'Potential Transformer',
      category: 'Transformers',
      description: 'PT / VT for voltage sensing. Used with metering and protective relays.',
      standard: 'IEEE C57.13',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y - 6} r={8} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <circle cx={x} cy={y + 6} r={8} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y - 3} textAnchor="middle" fill="var(--primary)" fontSize={8} fontWeight={700}>PT</text>
        </g>
      ),
    },
    {
      name: 'Delta Connection',
      category: 'Transformers',
      description: 'Delta winding configuration. Triangle symbol.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <polygon points={`${x},${y - 12} ${x - 14},${y + 10} ${x + 14},${y + 10}`} fill="none" stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Wye Connection',
      category: 'Transformers',
      description: 'Wye (star) winding configuration. Y symbol.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <line x1={x} y1={y - 12} x2={x} y2={y} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 12} y1={y + 10} x2={x} y2={y} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x + 12} y1={y + 10} x2={x} y2={y} stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    // Switching Devices
    {
      name: 'Circuit Breaker',
      category: 'Switching',
      description: 'Power circuit breaker with trip mechanism. Automatic fault interruption.',
      standard: 'IEEE C37.2',
      render: (x, y) => (
        <g>
          <rect x={x - 10} y={y - 12} width={20} height={24} rx={3} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 5} y1={y - 4} x2={x + 5} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 8} textAnchor="middle" fill="var(--primary)" fontSize={8} fontWeight={700}>CB</text>
        </g>
      ),
    },
    {
      name: 'Disconnect Switch',
      category: 'Switching',
      description: 'Manual isolation switch. Open under no-load only. Visible air gap.',
      standard: 'IEEE C37.2',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y + 6} r={3} fill="var(--primary)" />
          <line x1={x} y1={y + 6} x2={x + 14} y2={y - 10} stroke="var(--primary)" strokeWidth={2.5} />
          <circle cx={x} cy={y - 6} r={3} fill="var(--primary)" />
        </g>
      ),
    },
    {
      name: 'Load Break Switch',
      category: 'Switching',
      description: 'Switch rated for load-current interruption. Has arc suppression.',
      standard: 'IEEE C37.2',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y + 8} r={3} fill="var(--primary)" />
          <line x1={x} y1={y + 8} x2={x + 14} y2={y - 8} stroke="var(--primary)" strokeWidth={2.5} />
          <circle cx={x} cy={y - 6} r={3} fill="var(--primary)" />
          <line x1={x - 8} y1={y - 6} x2={x + 8} y2={y - 6} stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Contactor',
      category: 'Switching',
      description: 'Electrically operated switch for motor starting and power control.',
      standard: 'NEMA ICS',
      render: (x, y) => (
        <g>
          <line x1={x} y1={y - 14} x2={x} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x} y1={y + 4} x2={x} y2={y + 14} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 8} y1={y - 4} x2={x + 8} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 8} y1={y + 4} x2={x + 8} y2={y + 4} stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Transfer Switch',
      category: 'Switching',
      description: 'Automatic or manual transfer between two sources. ATS for backup power.',
      standard: 'IEEE C37.2',
      render: (x, y) => (
        <g>
          <circle cx={x - 8} cy={y + 8} r={3} fill="var(--primary)" />
          <line x1={x - 8} y1={y + 8} x2={x} y2={y - 8} stroke="var(--primary)" strokeWidth={2} />
          <circle cx={x + 8} cy={y + 8} r={3} fill="var(--primary)" />
          <line x1={x + 8} y1={y + 8} x2={x} y2={y - 8} stroke="var(--primary)" strokeWidth={2} />
          <circle cx={x} cy={y - 8} r={3} fill="var(--primary)" />
        </g>
      ),
    },
    // Protective Devices
    {
      name: 'Fuse',
      category: 'Protective',
      description: 'Overcurrent protection. Sacrificial element melts to open circuit.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <rect x={x - 4} y={y - 10} width={8} height={20} rx={2} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="var(--primary)" strokeWidth={1.5} />
        </g>
      ),
    },
    {
      name: 'Overload Relay',
      category: 'Protective',
      description: 'Thermal or electronic overload protection for motors.',
      standard: 'NEMA ICS',
      render: (x, y) => (
        <g>
          <path d={`M${x - 8},${y - 8} L${x - 4},${y + 8} L${x},${y - 8} L${x + 4},${y + 8} L${x + 8},${y - 8}`} fill="none" stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Surge Arrester',
      category: 'Protective',
      description: 'Lightning / surge protection. Diverts transient overvoltages to ground.',
      standard: 'IEEE C62',
      render: (x, y) => (
        <g>
          <line x1={x} y1={y - 14} x2={x} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 8} y1={y - 4} x2={x + 8} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x} y1={y - 4} x2={x} y2={y + 8} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 8} y1={y + 8} x2={x + 8} y2={y + 8} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 6} y1={y + 8} x2={x} y2={y + 14} stroke="var(--primary)" strokeWidth={1.5} />
          <line x1={x + 6} y1={y + 8} x2={x} y2={y + 14} stroke="var(--primary)" strokeWidth={1.5} />
        </g>
      ),
    },
    {
      name: 'Protective Relay',
      category: 'Protective',
      description: 'Generic protective relay. Monitors system and trips breaker on fault.',
      standard: 'IEEE C37.2',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={14} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 4} textAnchor="middle" fill="var(--primary)" fontSize={10} fontWeight={700}>51</text>
        </g>
      ),
    },
    {
      name: 'Ground Fault Relay',
      category: 'Protective',
      description: 'Detects ground fault current. Required on all mine portable equipment per O.Reg 854.',
      standard: 'IEEE C37.2 / CSA',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={14} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 4} textAnchor="middle" fill="var(--primary)" fontSize={10} fontWeight={700}>GF</text>
        </g>
      ),
    },
    // Motors
    {
      name: 'Three-Phase Motor',
      category: 'Motors',
      description: 'Standard 3-phase induction motor. Most common mine motor type.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={16} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 5} textAnchor="middle" fill="var(--primary)" fontSize={13} fontWeight={700}>M</text>
          <text x={x + 14} y={y - 10} fill="var(--primary)" fontSize={8} fontWeight={700}>3~</text>
        </g>
      ),
    },
    {
      name: 'DC Motor',
      category: 'Motors',
      description: 'DC motor. Used in older shovels and hoists, being replaced by AC VFD drives.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={16} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 5} textAnchor="middle" fill="var(--primary)" fontSize={12} fontWeight={700}>M</text>
          <line x1={x - 10} y1={y + 12} x2={x + 10} y2={y + 12} stroke="var(--primary)" strokeWidth={1.5} />
          <line x1={x - 6} y1={y + 15} x2={x + 6} y2={y + 15} stroke="var(--primary)" strokeWidth={1.5} />
        </g>
      ),
    },
    {
      name: 'Synchronous Motor',
      category: 'Motors',
      description: 'Runs at synchronous speed. Sometimes used for power factor correction.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={16} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 5} textAnchor="middle" fill="var(--primary)" fontSize={12} fontWeight={700}>SM</text>
        </g>
      ),
    },
    {
      name: 'VFD / Variable Speed Drive',
      category: 'Motors',
      description: 'Variable Frequency Drive. Converts fixed frequency to variable for speed control.',
      standard: 'NEMA ICS',
      render: (x, y) => (
        <g>
          <rect x={x - 14} y={y - 12} width={28} height={24} rx={3} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 4} textAnchor="middle" fill="var(--primary)" fontSize={9} fontWeight={700}>VFD</text>
        </g>
      ),
    },
    // Loads
    {
      name: 'Resistive Load',
      category: 'Loads',
      description: 'Heater, toaster, or resistive heating element. PF = 1.0.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <path d={`M${x - 12},${y} L${x - 8},${y - 6} L${x - 4},${y + 6} L${x},${y - 6} L${x + 4},${y + 6} L${x + 8},${y - 6} L${x + 12},${y}`} fill="none" stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Capacitor',
      category: 'Loads',
      description: 'Power factor correction capacitor bank. Reduces reactive power demand.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <line x1={x - 10} y1={y - 3} x2={x + 10} y2={y - 3} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 10} y1={y + 3} x2={x + 10} y2={y + 3} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x} y1={y - 14} x2={x} y2={y - 3} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x} y1={y + 3} x2={x} y2={y + 14} stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Reactor / Inductor',
      category: 'Loads',
      description: 'Line reactor or current limiting reactor. Limits fault current and harmonics.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <path d={`M${x - 12},${y} A4,4 0 0,1 ${x - 4},${y} A4,4 0 0,1 ${x + 4},${y} A4,4 0 0,1 ${x + 12},${y}`} fill="none" stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Lighting Panel',
      category: 'Loads',
      description: 'Lighting distribution panel for surface buildings and mine areas.',
      standard: 'CEC / CSA',
      render: (x, y) => (
        <g>
          <rect x={x - 12} y={y - 10} width={24} height={20} rx={2} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 6} y1={y - 2} x2={x + 6} y2={y - 2} stroke="var(--primary)" strokeWidth={1.5} />
          <line x1={x - 6} y1={y + 4} x2={x + 6} y2={y + 4} stroke="var(--primary)" strokeWidth={1.5} />
        </g>
      ),
    },
    // Buses
    {
      name: 'Main Bus',
      category: 'Buses',
      description: 'Main power bus. Heavy horizontal line representing a conductor or busbar.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <line x1={x - 20} y1={y} x2={x + 20} y2={y} stroke="var(--primary)" strokeWidth={4} />
        </g>
      ),
    },
    {
      name: 'Split Bus',
      category: 'Buses',
      description: 'Bus with tie breaker for redundancy. Allows sectionalizing.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <line x1={x - 20} y1={y - 4} x2={x - 4} y2={y - 4} stroke="var(--primary)" strokeWidth={3} />
          <line x1={x + 4} y1={y - 4} x2={x + 20} y2={y - 4} stroke="var(--primary)" strokeWidth={3} />
          <rect x={x - 4} y={y - 8} width={8} height={8} rx={1} fill="none" stroke="var(--primary)" strokeWidth={1.5} />
        </g>
      ),
    },
    {
      name: 'MCC (Motor Control Center)',
      category: 'Buses',
      description: 'Motor Control Center. Multiple motor starters in a common enclosure.',
      standard: 'NEMA ICS / CSA',
      render: (x, y) => (
        <g>
          <rect x={x - 16} y={y - 10} width={32} height={20} rx={2} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <text x={x} y={y + 4} textAnchor="middle" fill="var(--primary)" fontSize={9} fontWeight={700}>MCC</text>
        </g>
      ),
    },
    // Grounding
    {
      name: 'Earth Ground',
      category: 'Grounding',
      description: 'Connection to earth. Required at all substations and portable subs in mines.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <line x1={x} y1={y - 14} x2={x} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 12} y1={y - 4} x2={x + 12} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 8} y1={y + 2} x2={x + 8} y2={y + 2} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 4} y1={y + 8} x2={x + 4} y2={y + 8} stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Chassis Ground',
      category: 'Grounding',
      description: 'Ground to equipment frame/chassis. Required on all mine mobile equipment.',
      standard: 'IEEE Std 315',
      render: (x, y) => (
        <g>
          <line x1={x} y1={y - 14} x2={x} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 12} y1={y - 4} x2={x + 12} y2={y - 4} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 10} y1={y - 4} x2={x - 14} y2={y + 4} stroke="var(--primary)" strokeWidth={1.5} />
          <line x1={x - 2} y1={y - 4} x2={x - 6} y2={y + 4} stroke="var(--primary)" strokeWidth={1.5} />
          <line x1={x + 6} y1={y - 4} x2={x + 2} y2={y + 4} stroke="var(--primary)" strokeWidth={1.5} />
        </g>
      ),
    },
    {
      name: 'Grounding Resistor',
      category: 'Grounding',
      description: 'Neutral grounding resistor (NGR). Limits ground fault current in mine systems.',
      standard: 'IEEE C62 / CSA',
      render: (x, y) => (
        <g>
          <line x1={x} y1={y - 14} x2={x} y2={y - 8} stroke="var(--primary)" strokeWidth={2} />
          <path d={`M${x},${y - 8} L${x - 6},${y - 4} L${x + 6},${y} L${x - 6},${y + 4} L${x},${y + 8}`} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <line x1={x} y1={y + 8} x2={x} y2={y + 14} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 8} y1={y + 14} x2={x + 8} y2={y + 14} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 5} y1={y + 18} x2={x + 5} y2={y + 18} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 2} y1={y + 22} x2={x + 2} y2={y + 22} stroke="var(--primary)" strokeWidth={2} />
        </g>
      ),
    },
    {
      name: 'Ground Fault Detector',
      category: 'Grounding',
      description: 'Zero-sequence CT for ground fault detection. Critical for mine safety.',
      standard: 'IEEE C37.2',
      render: (x, y) => (
        <g>
          <circle cx={x} cy={y} r={14} fill="none" stroke="var(--primary)" strokeWidth={2} />
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke="var(--primary)" strokeWidth={2} />
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke="var(--primary)" strokeWidth={2} />
          <circle cx={x} cy={y} r={8} fill="none" stroke="var(--primary)" strokeWidth={1} />
        </g>
      ),
    },
  ]
}

const allSymbolRefs = makeSymbolRefs()

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex', gap: 8, overflowX: 'auto',
  WebkitOverflowScrolling: 'touch', paddingBottom: 4, scrollbarWidth: 'none',
}
const pillBase: React.CSSProperties = {
  flexShrink: 0, minHeight: 48, padding: '0 16px', borderRadius: 24,
  fontSize: 13, fontWeight: 600, border: '2px solid var(--divider)',
  background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
}
const pillActive: React.CSSProperties = {
  ...pillBase, background: 'var(--primary)', color: '#000',
  border: '2px solid var(--primary)',
}
const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)', padding: 14,
}
const sectionLabel: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--primary)',
  textTransform: 'uppercase', letterSpacing: 0.5,
}

const tabItems: { key: TabKey; label: string }[] = [
  { key: 'builder', label: 'Quick Builder' },
  { key: 'configs', label: 'Mine Configs' },
  { key: 'symbols', label: 'Symbols Ref' },
]

/* ------------------------------------------------------------------ */
/*  Default starting diagram for the builder                           */
/* ------------------------------------------------------------------ */

let nextId = 100

function createComponent(type: ComponentType, overrides?: Partial<DiagramComponent>): DiagramComponent {
  const defaults: Record<ComponentType, Partial<DiagramComponent>> = {
    utility: { label: 'Utility / Grid', voltage: '44kV' },
    transformer: { label: 'Transformer', kva: '5000', voltage: '44kV / 4160V' },
    breaker: { label: 'Circuit Breaker', amps: '400' },
    fuse: { label: 'Fuse', amps: '200' },
    disconnect: { label: 'Disconnect Switch', amps: '600' },
    motor: { label: 'Motor', hp: '500', voltage: '600V' },
    bus: { label: 'Bus', voltage: '4160V' },
    cable: { label: 'Cable / Feeder', notes: '#4/0 SHD-GC' },
  }
  nextId++
  return { id: nextId, type, ...defaults[type], ...overrides }
}

/* ------------------------------------------------------------------ */
/*  Diagram renderer — builds the full vertical SVG                    */
/* ------------------------------------------------------------------ */

function DiagramSVG({ components }: { components: DiagramComponent[] }) {
  const totalH = components.length * COMP_H + 40
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${SVG_W} ${totalH}`}
      style={{ background: 'var(--surface-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--divider)' }}
    >
      {/* Title bar */}
      <rect x={0} y={0} width={SVG_W} height={28} fill="var(--surface)" />
      <text x={SVG_W / 2} y={18} textAnchor="middle" fill="var(--text-secondary)" fontSize={10} fontWeight={600} fontFamily="var(--font-display)">
        SINGLE-LINE DIAGRAM
      </text>
      {components.map((comp, i) => renderComponent(comp, CX, 30 + i * COMP_H))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Config diagram with extra details                                  */
/* ------------------------------------------------------------------ */

function ConfigDiagramSVG({ config }: { config: MineConfig }) {
  const totalH = config.components.length * COMP_H + 40
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${SVG_W} ${totalH}`}
      style={{ background: 'var(--surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--divider)' }}
    >
      <rect x={0} y={0} width={SVG_W} height={28} fill="var(--surface)" />
      <text x={SVG_W / 2} y={18} textAnchor="middle" fill="var(--text-secondary)" fontSize={9} fontWeight={600} fontFamily="var(--font-display)">
        {config.name.toUpperCase()}
      </text>
      {config.components.map((comp, i) => renderComponent(comp, CX, 30 + i * COMP_H))}
    </svg>
  )
}

/* ================================================================== */
/*  Main Page Component                                                */
/* ================================================================== */

export default function SingleLinePage() {
  const [tab, setTab] = useState<TabKey>('builder')

  /* Builder state */
  const [components, setComponents] = useState<DiagramComponent[]>([
    createComponent('utility', { label: 'Mine Utility Feed', voltage: '44kV' }),
    createComponent('breaker', { label: 'Main Incoming CB', amps: '600' }),
    createComponent('transformer', { label: 'Main Xfmr', kva: '5000', voltage: '44kV / 4160V' }),
    createComponent('bus', { label: '4160V Main Bus', voltage: '4160V' }),
  ])
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editValue, setEditValue] = useState('')
  const [editValue2, setEditValue2] = useState('')

  /* Config state */
  const [expandedConfig, setExpandedConfig] = useState<number | null>(null)

  /* Symbols state */
  const [symbolSearch, setSymbolSearch] = useState('')
  const [symbolCategory, setSymbolCategory] = useState('All')

  /* -------------------------------------------------------------- */
  /*  Builder helpers                                                */
  /* -------------------------------------------------------------- */

  function addComponent(type: ComponentType) {
    setComponents(prev => [...prev, createComponent(type)])
  }

  function removeLast() {
    if (components.length > 0) {
      setComponents(prev => prev.slice(0, -1))
    }
  }

  function clearAll() {
    setComponents([])
  }

  function startEdit(idx: number) {
    const c = components[idx]
    setEditingIdx(idx)
    setEditLabel(c.label || '')
    setEditValue(c.voltage || c.kva || c.amps || c.hp || c.notes || '')
    setEditValue2(c.type === 'transformer' ? (c.kva || '') : '')
  }

  function saveEdit() {
    if (editingIdx === null) return
    setComponents(prev => prev.map((c, i) => {
      if (i !== editingIdx) return c
      const updated = { ...c, label: editLabel }
      switch (c.type) {
        case 'utility': updated.voltage = editValue; break
        case 'transformer': updated.kva = editValue2; updated.voltage = editValue; break
        case 'breaker': updated.amps = editValue; break
        case 'fuse': updated.amps = editValue; break
        case 'disconnect': updated.amps = editValue; break
        case 'motor': updated.hp = editValue; updated.voltage = editValue2 || c.voltage; break
        case 'bus': updated.voltage = editValue; break
        case 'cable': updated.notes = editValue; break
      }
      return updated
    }))
    setEditingIdx(null)
  }

  function getValueLabel(type: ComponentType): string {
    switch (type) {
      case 'utility': return 'Voltage'
      case 'transformer': return 'Voltages'
      case 'breaker': return 'Trip Amps'
      case 'fuse': return 'Rating (A)'
      case 'disconnect': return 'Rating (A)'
      case 'motor': return 'HP'
      case 'bus': return 'Voltage'
      case 'cable': return 'Cable Spec'
    }
  }

  function showSecondField(type: ComponentType): string | null {
    if (type === 'transformer') return 'kVA'
    if (type === 'motor') return 'Voltage'
    return null
  }

  /* -------------------------------------------------------------- */
  /*  Filtered symbols                                               */
  /* -------------------------------------------------------------- */

  const filteredSymbols = allSymbolRefs.filter(s => {
    const matchCat = symbolCategory === 'All' || s.category === symbolCategory
    const matchSearch = symbolSearch === '' ||
      s.name.toLowerCase().includes(symbolSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(symbolSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(symbolSearch.toLowerCase())
    return matchCat && matchSearch
  })

  /* -------------------------------------------------------------- */
  /*  Render                                                         */
  /* -------------------------------------------------------------- */

  return (
    <>
      <Header title="Single-Line Diagrams" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tab pills */}
        <div style={pillRow}>
          {tabItems.map(t => (
            <button key={t.key} style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ========================================================== */}
        {/*  TAB 1: Quick Builder                                       */}
        {/* ========================================================== */}
        {tab === 'builder' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionLabel}>Build Your Single-Line Diagram</div>

            {/* Component palette */}
            <div style={{
              ...card,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>
                Add Component
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
              }}>
                {palette.map(p => (
                  <button
                    key={p.type}
                    onClick={() => addComponent(p.type)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: 4,
                      padding: '10px 4px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-elevated)', border: '1px solid var(--divider)',
                      cursor: 'pointer', minHeight: 60,
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--primary)', color: '#000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
                    }}>
                      {p.icon}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={removeLast} style={{
                  flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)',
                  background: 'transparent', border: '1px solid var(--divider)',
                  color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  Undo Last
                </button>
                <button onClick={clearAll} style={{
                  flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)',
                  background: 'transparent', border: '1px solid rgba(255,60,60,0.3)',
                  color: '#ff3c3c', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  Clear All
                </button>
              </div>
            </div>

            {/* Diagram preview */}
            {components.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>
                  Diagram Preview ({components.length} components)
                </div>
                <DiagramSVG components={components} />
              </div>
            )}

            {components.length === 0 && (
              <div style={{
                ...card, textAlign: 'center', padding: 40,
              }}>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  No components added yet
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  Tap a component button above to start building your single-line diagram
                </div>
              </div>
            )}

            {/* Component list — editable */}
            {components.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>
                  Component Details (tap to edit)
                </div>
                {components.map((comp, idx) => (
                  <div key={comp.id} style={{
                    ...card, padding: '10px 12px',
                    borderLeft: `3px solid var(--primary)`,
                    cursor: 'pointer',
                  }}
                    onClick={() => editingIdx === idx ? undefined : startEdit(idx)}
                  >
                    {editingIdx === idx ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: 'var(--primary)',
                            textTransform: 'uppercase', minWidth: 60,
                          }}>
                            {comp.type}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Label</label>
                          <input
                            value={editLabel}
                            onChange={e => setEditLabel(e.target.value)}
                            style={{
                              padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--divider)', background: 'var(--surface-elevated)',
                              color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-display)',
                              outline: 'none',
                            }}
                          />
                          <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{getValueLabel(comp.type)}</label>
                          <input
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            style={{
                              padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--divider)', background: 'var(--surface-elevated)',
                              color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-mono)',
                              outline: 'none',
                            }}
                          />
                          {showSecondField(comp.type) && (
                            <>
                              <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{showSecondField(comp.type)}</label>
                              <input
                                value={editValue2}
                                onChange={e => setEditValue2(e.target.value)}
                                style={{
                                  padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--divider)', background: 'var(--surface-elevated)',
                                  color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-mono)',
                                  outline: 'none',
                                }}
                              />
                            </>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={saveEdit} style={{
                            flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
                            background: 'var(--primary)', color: '#000',
                            border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          }}>
                            Save
                          </button>
                          <button onClick={() => setEditingIdx(null)} style={{
                            flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
                            background: 'transparent', color: 'var(--text-secondary)',
                            border: '1px solid var(--divider)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#000',
                          textTransform: 'uppercase',
                          background: 'var(--primary)', padding: '2px 6px',
                          borderRadius: 4, fontFamily: 'var(--font-mono)',
                        }}>
                          {comp.type}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>
                          {comp.label}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {comp.voltage || comp.kva || comp.amps || comp.hp || comp.notes || ''}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Mining regulation note */}
            <div style={{
              ...card, borderLeft: '3px solid #ff8c00',
              fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              <strong style={{ color: '#ff8c00' }}>O.Reg 854 Requirement:</strong> Single-line diagrams shall be
              kept at each substation and updated whenever changes are made. Include protection device settings,
              fault current levels at each bus, and cable sizes on the diagram.
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/*  TAB 2: Common Mine Configurations                          */}
        {/* ========================================================== */}
        {tab === 'configs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionLabel}>Common Open Pit Mine Power Configurations</div>

            {mineConfigs.map((config, idx) => {
              const isExpanded = expandedConfig === idx
              return (
                <div key={idx} style={{
                  ...card, padding: 0, overflow: 'hidden',
                }}>
                  <button onClick={() => setExpandedConfig(isExpanded ? null : idx)} style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '14px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    minHeight: 56,
                  }}>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                        {config.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {config.description}
                      </div>
                    </div>
                    <span style={{
                      color: 'var(--text-secondary)', fontSize: 18,
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform .2s', marginLeft: 10, flexShrink: 0,
                    }}>
                      {'▼'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* Diagram */}
                      <ConfigDiagramSVG config={config} />

                      {/* Component list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>
                          Components
                        </div>
                        {config.components.map((c, ci) => (
                          <div key={ci} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--surface-elevated)',
                          }}>
                            <span style={{
                              fontSize: 9, fontWeight: 700, color: '#000',
                              background: 'var(--primary)', padding: '1px 5px',
                              borderRadius: 3, fontFamily: 'var(--font-mono)',
                              textTransform: 'uppercase',
                            }}>
                              {c.type}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600, flex: 1 }}>
                              {c.label}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                              {c.voltage || c.kva || c.amps || c.hp || c.notes || ''}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#ff8c00', textTransform: 'uppercase' }}>
                          Protection & Notes
                        </div>
                        {config.notes.map((note, ni) => (
                          <div key={ni} style={{
                            fontSize: 12, color: 'var(--text-secondary)', padding: '3px 0 3px 16px',
                            position: 'relative', lineHeight: 1.4,
                          }}>
                            <span style={{ position: 'absolute', left: 0, color: '#ff8c00' }}>{'•'}</span>
                            {note}
                          </div>
                        ))}
                      </div>

                      {/* Load to builder button */}
                      <button
                        onClick={() => {
                          setComponents(config.components.map(c => ({ ...c })))
                          setTab('builder')
                        }}
                        style={{
                          padding: '10px 0', borderRadius: 'var(--radius-sm)',
                          background: 'var(--primary)', color: '#000',
                          border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        Load into Quick Builder
                      </button>
                    </div>
                  )}
                </div>
              )
            })}

            {/* General note */}
            <div style={{
              ...card, borderLeft: '3px solid var(--primary)',
              fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              <strong style={{ color: 'var(--text)' }}>Typical Open Pit Mine Voltages:</strong> Utility
              incoming is usually 44kV or 25kV. Primary distribution at 4160V or 13.8kV. Equipment
              fed at 600V (Canada) or 480V (US). Lighting and controls at 120/208V. All trailing cable
              equipment requires ground fault protection per O.Reg 854.
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/*  TAB 3: Symbols Reference                                   */}
        {/* ========================================================== */}
        {tab === 'symbols' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionLabel}>Electrical Symbol Reference (IEEE / CSA)</div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search symbols..."
                value={symbolSearch}
                onChange={e => setSymbolSearch(e.target.value)}
                style={{
                  width: '100%', padding: '12px 12px 12px 38px',
                  borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
                  background: 'var(--surface)', color: 'var(--text)',
                  fontSize: 14, fontFamily: 'var(--font-display)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx={11} cy={11} r={8} />
                <line x1={21} y1={21} x2={16.65} y2={16.65} />
              </svg>
            </div>

            {/* Category filter */}
            <div style={pillRow}>
              {symbolCategories.map(cat => (
                <button key={cat}
                  style={symbolCategory === cat
                    ? { ...pillBase, background: 'var(--primary)', color: '#000', borderColor: 'var(--primary)', fontSize: 12 }
                    : { ...pillBase, fontSize: 12 }
                  }
                  onClick={() => setSymbolCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Count */}
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              Showing {filteredSymbols.length} of {allSymbolRefs.length} symbols
            </div>

            {/* Symbol grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
            }}>
              {filteredSymbols.map((sym, idx) => (
                <div key={idx} style={{
                  ...card, padding: '10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                }}>
                  {/* SVG symbol preview */}
                  <svg width={60} height={50} viewBox="0 0 60 50">
                    {sym.render(30, 25)}
                  </svg>

                  {/* Name */}
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: 'var(--text)',
                    textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {sym.name}
                  </div>

                  {/* Category badge */}
                  <span style={{
                    fontSize: 9, fontWeight: 600, color: '#000',
                    background: 'var(--primary)', padding: '1px 6px',
                    borderRadius: 10, fontFamily: 'var(--font-mono)',
                  }}>
                    {sym.category}
                  </span>

                  {/* Description */}
                  <div style={{
                    fontSize: 10, color: 'var(--text-secondary)',
                    textAlign: 'center', lineHeight: 1.4,
                  }}>
                    {sym.description}
                  </div>

                  {/* Standard */}
                  <div style={{
                    fontSize: 9, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
                  }}>
                    {sym.standard}
                  </div>
                </div>
              ))}
            </div>

            {filteredSymbols.length === 0 && (
              <div style={{
                ...card, textAlign: 'center', padding: 30,
              }}>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  No symbols match your search
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>
                  Try a different search term or category
                </div>
              </div>
            )}

            {/* Mining note */}
            <div style={{
              ...card, borderLeft: '3px solid var(--primary)',
              fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              <strong style={{ color: 'var(--text)' }}>Standard Reference:</strong> Symbols follow
              IEEE Std 315 (Graphic Symbols for Electrical and Electronics Diagrams) and CSA standards.
              Mine-specific requirements per O.Reg 854 Section 153-167 and CSA M421.
              Always verify symbols match your site standards.
            </div>
          </div>
        )}

        {/* Footer reference — always visible */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)', padding: '12px 14px',
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong> IEEE Std 315 (Graphic Symbols),
          IEEE C37.2 (Device Numbers), CSA M421 (Use of Electricity in Mines),
          O.Reg 854 (Mines and Mining Plants), CEC Section 36/46
        </div>
      </div>
    </>
  )
}
