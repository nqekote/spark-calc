import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Motor Starters Reference - Ontario Mining Electricians             */
/* ------------------------------------------------------------------ */

type TabKey = 'types' | 'sizing' | 'wiring' | 'troubleshoot' | 'maintenance'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'types', label: 'Starter Types' },
  { key: 'sizing', label: 'Sizing' },
  { key: 'wiring', label: 'Wiring' },
  { key: 'troubleshoot', label: 'Troubleshooting' },
  { key: 'maintenance', label: 'Maintenance' },
]

/* ------------------------------------------------------------------ */
/*  Tab 1: Starter Types Data                                          */
/* ------------------------------------------------------------------ */

interface StarterType {
  name: string
  abbr: string
  description: string
  inrush: string
  torque: string
  pros: string[]
  cons: string[]
  whenToUse: string
  wiringNote: string
  tint: string
}

const starterTypes: StarterType[] = [
  {
    name: 'Direct On Line (DOL)',
    abbr: 'DOL',
    description: 'Simplest starter method. Applies full line voltage directly to motor terminals. Contactor closes and motor receives 100% voltage immediately. Produces 6-8x full load amps (FLA) inrush current during starting.',
    inrush: '600-800% FLA',
    torque: '100% FLT',
    pros: ['Simplest wiring and control', 'Lowest cost', 'Full starting torque available', 'Most reliable (fewest components)'],
    cons: ['Highest inrush current (6-8x FLA)', 'Mechanical shock to driven equipment', 'Voltage dip on supply during start', 'May not be permitted by utility for large motors'],
    whenToUse: 'Small motors typically under 10 HP. Any application where the supply can handle the inrush and mechanical shock is acceptable. Most common starter in mining for smaller auxiliary equipment.',
    wiringNote: 'Three power contacts (L1-T1, L2-T2, L3-T3), one contactor coil, overload relay in series with motor. Control circuit: STOP NC in series with START NO, seal-in contact (M aux NO) in parallel with START.',
    tint: '#3b82f6',
  },
  {
    name: 'Star-Delta (Wye-Delta)',
    abbr: 'Y-Δ',
    description: 'Reduced voltage starting method. Motor starts in Star (Y) configuration at 1/√3 (58%) of line voltage, reducing starting current to 1/3 of DOL value. After a timed period (5-15 seconds), transitions to Delta (Δ) for full voltage run. Requires a 6-lead motor (T1-T6).',
    inrush: '200-270% FLA (33% of DOL)',
    torque: '33% FLT',
    pros: ['Reduces starting current to 33% of DOL', 'No auto-transformer needed', 'Relatively simple compared to other RVS methods', 'Good for applications with low starting torque requirements'],
    cons: ['Requires 6-lead motor', 'Starting torque reduced to 33%', 'Open transition causes current transient during switchover', 'Motor must be delta-rated at line voltage', 'Cannot adjust starting voltage (fixed 58%)'],
    whenToUse: 'Medium to large motors (25-200 HP) where reduced starting torque is acceptable. Pumps, fans, compressors. Very common in mining for pump and ventilation motors. CEC requires reduced voltage starting when utility mandates it.',
    wiringNote: 'Three contactors: Main (M), Star (S), Delta (D). Six motor leads: T1-T6. Star connects T4-T5-T6 together. Delta connects T1-T6, T2-T4, T3-T5. Electrical and mechanical interlock between S and D contactors. Timer controls transition.',
    tint: '#22c55e',
  },
  {
    name: 'Auto-Transformer',
    abbr: 'ATX',
    description: 'Reduced voltage starting using a 3-phase auto-transformer with selectable taps (typically 65%, 80%, 100%). Motor receives reduced voltage during start, then transitions to full voltage. Closed-transition (Korndorfer) type preferred to avoid current spike during switchover.',
    inrush: '42-64% FLA (at 65-80% tap)',
    torque: '42-64% FLT',
    pros: ['Adjustable starting voltage via taps', 'More starting torque than Star-Delta at same current reduction', 'Closed transition available', 'Works with any standard 3-lead motor'],
    cons: ['Large and expensive (auto-transformer is heavy)', 'More complex than Star-Delta', 'Auto-transformer generates heat', 'Limited starting duration (thermal limits on transformer)'],
    whenToUse: 'Large motors (50+ HP) where Star-Delta torque is insufficient. Mine ventilation fans, main pump drives, mill and crusher motors. When adjustable starting voltage is needed.',
    wiringNote: 'Start contactor connects motor to auto-transformer taps. Run contactor bypasses transformer for full voltage. Timer controls transition. Thermal protection on transformer windings. Interlock between start and run contactors.',
    tint: '#8b5cf6',
  },
  {
    name: 'Primary Resistor / Reactor',
    abbr: 'RES',
    description: 'Adds resistance (resistor type) or reactance (reactor type) in series with motor leads during starting. Voltage drop across the resistor/reactor reduces voltage at motor terminals. After starting, a contactor shorts out the resistors. Provides smooth, stepless acceleration.',
    inrush: '40-65% FLA (depending on resistance value)',
    torque: '40-65% FLT',
    pros: ['Smooth acceleration (no transition transient)', 'Works with any standard motor', 'Simple design concept', 'Closed transition inherent'],
    cons: ['Resistors generate significant heat', 'Less efficient than transformer methods', 'Starting torque reduced proportionally with voltage', 'Resistors need ventilation and space'],
    whenToUse: 'Applications requiring very smooth starting with no transition bump. Conveyors with delicate material, precision drives. Less common in modern installations as soft starters have largely replaced this method.',
    wiringNote: 'Resistor banks in series with each phase (L1, L2, L3) between supply and motor. Bypass contactor across each resistor. Timer energizes bypass contactor after start period. Main contactor upstream of resistors.',
    tint: '#f59e0b',
  },
  {
    name: 'Soft Starter (Electronic)',
    abbr: 'SS',
    description: 'Uses thyristors (SCRs) to gradually increase voltage applied to motor from an initial voltage (typically 30-50%) to full voltage over an adjustable ramp time. Provides precise control of starting current and torque. Most soft starters also offer soft stop (ramp down) and various protection features.',
    inrush: '150-400% FLA (adjustable via current limit)',
    torque: 'Proportional to voltage squared',
    pros: ['Adjustable ramp time (1-30 seconds typical)', 'Adjustable current limit (200-400% FLA)', 'Soft stop capability (pump applications)', 'Built-in motor protection (overload, phase loss, stall)', 'Small footprint vs auto-transformer', 'No mechanical wear (solid state)'],
    cons: ['Generates harmonics during starting', 'Thyristors produce heat (needs cooling)', 'More expensive than DOL or Star-Delta', 'Cannot vary speed during run (full voltage once started)', 'Bypass contactor recommended for run mode'],
    whenToUse: 'Medium to large motors where smooth starting and adjustable parameters are needed. Pumps (soft stop prevents water hammer), conveyors, fans, compressors. Very common in modern mining installations.',
    wiringNote: 'Three-phase input (L1-L2-L3) to soft starter, output (T1-T2-T3) to motor. Bypass contactor across soft starter for run mode (reduces heat). Control wiring: start/stop inputs, fault relay output, analog output for monitoring. Common parameters: ramp up time, ramp down time, initial voltage, current limit, motor FLA setting.',
    tint: '#ef4444',
  },
  {
    name: 'Variable Frequency Drive (VFD)',
    abbr: 'VFD',
    description: 'Converts fixed-frequency AC to variable-frequency AC, allowing full speed control from 0-100% (and beyond with some drives). Provides the lowest starting current of any method. Rectifier converts AC to DC, then inverter creates variable frequency AC output using PWM (Pulse Width Modulation).',
    inrush: '100-150% FLA (at rated torque)',
    torque: '100-150% FLT (at any speed)',
    pros: ['Full speed control (0-100%+)', 'Lowest starting current of any method', 'Energy savings at reduced speeds (fan/pump cube law)', 'Built-in comprehensive motor protection', 'PID control for process applications', 'Dynamic braking capability'],
    cons: ['Most expensive starting method', 'Generates harmonics on supply side', 'Output voltage spikes can damage motor insulation (use reactor/filter)', 'Requires inverter-duty motor for best results', 'Complex troubleshooting', 'Cooling requirements (forced ventilation)'],
    whenToUse: 'Any application requiring variable speed: fans, pumps, conveyors, hoists. When energy savings justify the cost. Overkill for simple on/off applications where speed control is not needed. Very common in modern mining for ventilation fans, pump stations, and conveyor drives.',
    wiringNote: 'Three-phase input (R/S/T or L1/L2/L3) to drive, output (U/V/W or T1/T2/T3) to motor. Output reactor or dV/dt filter recommended for cable runs over 30m. DO NOT install contactors on the output side without drive approval. Control: 4-20mA or 0-10V speed reference, digital inputs for start/stop/direction, relay outputs for fault/running status.',
    tint: '#06b6d4',
  },
  {
    name: 'Part Winding',
    abbr: 'PW',
    description: 'Uses a motor with two identical parallel windings (split winding). On start, only half the winding is energized (half the motor). After a short delay (1-3 seconds), the second half is energized. Reduces starting current to approximately 60-65% of DOL. Motor must be specifically designed for part-winding starting.',
    inrush: '60-65% FLA',
    torque: '45-50% FLT',
    pros: ['Simple — only two contactors needed', 'No external voltage-reducing equipment', 'Smooth transition (no open period)', 'Lower cost than auto-transformer'],
    cons: ['Requires special part-winding motor', 'Limited current reduction (only 60-65%)', 'Reduced starting torque', 'Not suitable for high-inertia loads', 'Motor runs on half winding during start (increased heating)'],
    whenToUse: 'Applications where moderate current reduction is sufficient. Chillers, compressors, some pumps. Motor must be designed for part-winding start. Less common in mining applications.',
    wiringNote: 'Two contactors: M1 (first winding) and M2 (second winding). Each contactor feeds 3 motor leads (T1-T3 for first half, T7-T9 for second half). Timer on M1 closes M2 after delay. Both sets of overloads required.',
    tint: '#a855f7',
  },
]

interface ComparisonRow {
  type: string
  startCurrent: string
  startTorque: string
  cost: string
  complexity: string
  speedControl: string
  applications: string
}

const comparisonTable: ComparisonRow[] = [
  { type: 'DOL', startCurrent: '600-800%', startTorque: '100%', cost: 'Low', complexity: 'Simple', speedControl: 'No', applications: 'Small motors <10HP' },
  { type: 'Star-Delta', startCurrent: '200-270%', startTorque: '33%', cost: 'Low-Med', complexity: 'Moderate', speedControl: 'No', applications: 'Pumps, fans, compressors' },
  { type: 'Auto-Transformer', startCurrent: '150-400%', startTorque: '42-64%', cost: 'Med-High', complexity: 'Moderate', speedControl: 'No', applications: 'Large motors, mine fans' },
  { type: 'Primary Resistor', startCurrent: '40-65%', startTorque: '40-65%', cost: 'Medium', complexity: 'Moderate', speedControl: 'No', applications: 'Smooth start needed' },
  { type: 'Soft Starter', startCurrent: '150-400%', startTorque: 'Variable', cost: 'Medium', complexity: 'Moderate', speedControl: 'No', applications: 'Pumps, conveyors, fans' },
  { type: 'VFD', startCurrent: '100-150%', startTorque: '100-150%', cost: 'High', complexity: 'Complex', speedControl: 'Yes', applications: 'Variable speed needed' },
  { type: 'Part Winding', startCurrent: '60-65%', startTorque: '45-50%', cost: 'Low-Med', complexity: 'Simple', speedControl: 'No', applications: 'Chillers, compressors' },
]

/* ------------------------------------------------------------------ */
/*  Tab 2: Sizing Data                                                 */
/* ------------------------------------------------------------------ */

interface NemaSize {
  size: string
  hp208: string
  hp480: string
  hp600: string
  maxAmps: string
}

const nemaSizes: NemaSize[] = [
  { size: '00', hp208: '1.5', hp480: '2', hp600: '2', maxAmps: '9' },
  { size: '0', hp208: '3', hp480: '5', hp600: '5', maxAmps: '18' },
  { size: '1', hp208: '7.5', hp480: '10', hp600: '10', maxAmps: '27' },
  { size: '2', hp208: '10', hp480: '25', hp600: '25', maxAmps: '45' },
  { size: '3', hp208: '25', hp480: '50', hp600: '50', maxAmps: '90' },
  { size: '4', hp208: '40', hp480: '100', hp600: '100', maxAmps: '135' },
  { size: '5', hp208: '75', hp480: '200', hp600: '200', maxAmps: '270' },
  { size: '6', hp208: '150', hp480: '400', hp600: '400', maxAmps: '540' },
  { size: '7', hp208: '300', hp480: '600', hp600: '600', maxAmps: '810' },
]

interface IecCategory {
  category: string
  name: string
  description: string
  typicalUse: string
}

const iecCategories: IecCategory[] = [
  { category: 'AC-1', name: 'Non-Inductive / Slightly Inductive', description: 'Resistive loads or loads with very low inductance. Power factor >= 0.95. Heating elements, lighting.', typicalUse: 'Resistive heaters, incandescent lighting, resistance welding' },
  { category: 'AC-2', name: 'Slip-Ring Motor Starting', description: 'Starting and switching off of slip-ring (wound rotor) motors. Moderate inrush and breaking current.', typicalUse: 'Wound rotor motors, crane hoists with slip-ring motors' },
  { category: 'AC-3', name: 'Squirrel Cage Motor Starting', description: 'Starting of squirrel cage motors and disconnecting while running. Motor is stopped by mechanical means or runs to standstill. Most common industrial rating.', typicalUse: 'Pumps, fans, conveyors, compressors — most mining motor applications' },
  { category: 'AC-4', name: 'Squirrel Cage Motor Inching/Plugging', description: 'Starting, plugging (reverse braking), and inching (jogging) of squirrel cage motors. Most severe duty — highest current at break. Contactor must break locked-rotor current.', typicalUse: 'Crane and hoist motors, reversing drives, jogging applications, crushers with frequent start/stop' },
]

interface OverloadInfo {
  topic: string
  detail: string
}

const overloadInfo: OverloadInfo[] = [
  { topic: 'Sizing Range', detail: 'Set overload relay to 115% of motor nameplate FLA for standard motors (service factor 1.0). For motors with 1.15 service factor, set to 125% of nameplate FLA. CEC Rule 28-400.' },
  { topic: 'Trip Class 10', detail: 'Trips within 10 seconds at 6x FLA. Standard for most motors. Pumps, fans, general industrial. Most common in mining applications.' },
  { topic: 'Trip Class 20', detail: 'Trips within 20 seconds at 6x FLA. Higher inertia loads requiring longer acceleration time. Loaded conveyors, larger fans, some crushers.' },
  { topic: 'Trip Class 30', detail: 'Trips within 30 seconds at 6x FLA. Very high inertia loads. Large flywheels, heavily loaded conveyors, ball mills. Extended starting time.' },
  { topic: 'Contactor vs Starter', detail: 'A contactor is just the switching device (power contacts + coil). A starter = contactor + overload relay. You need both to properly start and protect a motor.' },
  { topic: 'Combination Starter', detail: 'An all-in-one unit: disconnect switch + fuses/breaker + contactor + overload relay in a single enclosure. Door interlock, control transformer usually included. Standard in mining MCCs.' },
  { topic: 'Reversing Starter', detail: 'Two contactors (Forward and Reverse) with mechanical AND electrical interlocks. Swaps two phases (L1 and L3 typically) to reverse motor rotation. Both interlocks required by CEC.' },
  { topic: 'Multi-Speed Starters', detail: '2-speed Dahlander: one winding, two speeds (2:1 ratio). Uses Low, High, and Star-point contactors. 3-speed: requires two separate windings (consequent pole). Separate overloads for each speed.' },
]

/* sizing tool lookup data */
interface SizingResult {
  nemaSize: string
  contactorRating: string
  overloadRange: string
}

function lookupSizing(hp: number, voltage: number): SizingResult | null {
  /* simplified lookup based on NEMA sizes at 480/600V */
  const table: { maxHp: number; size: string; amps: string }[] = [
    { maxHp: 2, size: '00', amps: '9A' },
    { maxHp: 5, size: '0', amps: '18A' },
    { maxHp: 10, size: '1', amps: '27A' },
    { maxHp: 25, size: '2', amps: '45A' },
    { maxHp: 50, size: '3', amps: '90A' },
    { maxHp: 100, size: '4', amps: '135A' },
    { maxHp: 200, size: '5', amps: '270A' },
    { maxHp: 400, size: '6', amps: '540A' },
    { maxHp: 600, size: '7', amps: '810A' },
  ]
  /* adjust HP threshold for 208V (roughly 40-50% of 480V ratings) */
  const factor = voltage <= 240 ? 0.4 : 1
  for (const row of table) {
    if (hp <= row.maxHp * factor) {
      /* approximate FLA for overload range */
      const approxFLA = voltage <= 240
        ? (hp * 746) / (voltage * 1.732 * 0.87 * 0.88)
        : (hp * 746) / (voltage * 1.732 * 0.89 * 0.90)
      const olLow = (approxFLA * 1.0).toFixed(1)
      const olHigh = (approxFLA * 1.25).toFixed(1)
      return {
        nemaSize: `NEMA Size ${row.size}`,
        contactorRating: `${row.amps} max continuous`,
        overloadRange: `${olLow} - ${olHigh}A (set to 115-125% of nameplate FLA)`,
      }
    }
  }
  return null
}

/* ------------------------------------------------------------------ */
/*  Tab 3: Wiring Diagrams Data                                        */
/* ------------------------------------------------------------------ */

interface WiringDiagram {
  name: string
  diagram: string
  steps: string[]
}

const wiringDiagrams: WiringDiagram[] = [
  {
    name: 'DOL Starter - Power & Control',
    diagram:
`  POWER CIRCUIT:
  ═══════════════════════════════════
  L1 ─────┬──[ DISC ]──┬───────── L2
  L2 ─────┤            ├─────────
  L3 ─────┤            ├─────────
          │   FUSES    │
          ├──[FU1]─────┤
          ├──[FU2]─────┤
          ├──[FU3]─────┤
          │            │
          │  CONTACTOR │
          ├──[M L1-T1]─┤
          ├──[M L2-T2]─┤
          ├──[M L3-T3]─┤
          │            │
          │  OVERLOAD  │
          ├──[OL]──────┤
          │            │
          ├── T1 ──┐   │
          ├── T2 ──┤   │
          ├── T3 ──┤   │
               MOTOR

  CONTROL CIRCUIT:
  ═══════════════════════════════════
  L1 ──[STOP NC]──┬──[OL NC]──(M)── L2
                  │
    ┌──[START NO]─┘
    │
    └──[M aux NO]─┘  (seal-in)`,
    steps: [
      'Disconnect feeds fuses (L1, L2, L3)',
      'Fuses protect the branch circuit',
      'Contactor M switches power to motor (3 poles)',
      'Overload relay monitors motor current on all 3 phases',
      'Control: STOP NC in series, START NO in parallel with M seal-in contact',
      'OL NC contact in series with M coil — trips on overload',
      'Motor terminals: T1, T2, T3 connect to motor leads',
    ],
  },
  {
    name: 'Forward / Reverse Starter',
    diagram:
`  POWER CIRCUIT:
  ═══════════════════════════════════
  L1 ──┬──[DISC]──┬──────────────
  L2 ──┤          ├──────────────
  L3 ──┤          ├──────────────
       │          │
       │ FORWARD: │  REVERSE:
       ├─[F: L1→T1]  [R: L3→T1]─┤
       ├─[F: L2→T2]  [R: L2→T2]─┤
       ├─[F: L3→T3]  [R: L1→T3]─┤
       │          │              │
       │    ┌─────┴──────────────┘
       │    │  OVERLOAD
       │    ├──[OL]
       │    │
       │    ├── T1 ──┐
       │    ├── T2 ──┤ MOTOR
       │    └── T3 ──┘

  CONTROL CIRCUIT:
  ═══════════════════════════════════
  L1 ──[STOP NC]──┬───────────────
                  │
   FWD: ┌─[FWD NO]──[R NC]──[OL NC]──(F)── L2
        └─[F aux NO]  (seal-in)
                  │
   REV: ┌─[REV NO]──[F NC]──[OL NC]──(R)── L2
        └─[R aux NO]  (seal-in)

  ★ Mechanical interlock between F and R
  ★ R NC = electrical interlock in F circuit
  ★ F NC = electrical interlock in R circuit`,
    steps: [
      'Forward contactor (F): L1→T1, L2→T2, L3→T3 (normal phase sequence)',
      'Reverse contactor (R): swaps two phases — L1→T3, L2→T2, L3→T1',
      'Only one contactor can be energized at a time',
      'Electrical interlock: R NC contact in series with F coil, F NC in series with R coil',
      'Mechanical interlock: physical bar between F and R prevents both closing',
      'Must press STOP before changing direction',
      'Both F and R share the same overload relay',
    ],
  },
  {
    name: 'Star-Delta Power Connections',
    diagram:
`  MOTOR LEADS: T1, T2, T3, T4, T5, T6
  ═══════════════════════════════════════

  STAR (Y) CONNECTION (Starting):
  ┌─────────────────────────────────────┐
  │  L1 ──[M]── T1 ──── WINDING A ── T4 ─┐
  │  L2 ──[M]── T2 ──── WINDING B ── T5 ─┤─[S]─ STAR
  │  L3 ──[M]── T3 ──── WINDING C ── T6 ─┘ POINT
  │                                         │
  │  Star contactor (S) shorts T4-T5-T6    │
  │  together to form star point            │
  │  Voltage per winding = VL / √3 = 58%   │
  └─────────────────────────────────────────┘

  DELTA (Δ) CONNECTION (Running):
  ┌─────────────────────────────────────────┐
  │  L1 ──[M]── T1 ──── WINDING A ── T4 ─┐ │
  │  L2 ──[M]── T2 ──── WINDING B ── T5 ─┤ │
  │  L3 ──[M]── T3 ──── WINDING C ── T6 ─┤ │
  │                                        │ │
  │  Delta contactor (D) connects:         │ │
  │  T4 ──[D]── L2  (T4 to L2/T2)        │ │
  │  T5 ──[D]── L3  (T5 to L3/T3)        │ │
  │  T6 ──[D]── L1  (T6 to L1/T1)        │ │
  │                                        │ │
  │  Voltage per winding = VL = 100%       │ │
  └────────────────────────────────────────┘

  SEQUENCE:
  START → M + S energize (Star)
  TIMER → S drops, D energizes (Delta)
  RUN   → M + D remain energized`,
    steps: [
      'Motor must have 6 accessible leads (T1-T6)',
      'Main contactor (M) connects L1→T1, L2→T2, L3→T3 — stays closed during run',
      'Star contactor (S) connects T4, T5, T6 together (star point) — start only',
      'Delta contactor (D) connects T4→L2, T5→L3, T6→L1 — run only',
      'S and D must NEVER be on simultaneously (electrical + mechanical interlock)',
      'Open transition: brief moment when neither S nor D is closed (current spike)',
      'Closed transition: resistors bridge the gap during switchover (preferred)',
      'Timer typically set to 5-15 seconds depending on motor and load',
    ],
  },
  {
    name: 'Two-Speed Dahlander Connections',
    diagram:
`  DAHLANDER MOTOR (Constant Torque)
  Motor Leads: T1, T2, T3, T4, T5, T6
  ═══════════════════════════════════════

  LOW SPEED (e.g. 900 RPM):
  ┌──────────────────────────────────┐
  │  L1 ──[LOW]── T1                 │
  │  L2 ──[LOW]── T2                 │
  │  L3 ──[LOW]── T3                 │
  │                                  │
  │  T4, T5, T6 = OPEN (not used)   │
  │                                  │
  │  Windings in DELTA configuration │
  └──────────────────────────────────┘

  HIGH SPEED (e.g. 1800 RPM):
  ┌──────────────────────────────────────┐
  │  L1 ──[HIGH]── T4                    │
  │  L2 ──[HIGH]── T5                    │
  │  L3 ──[HIGH]── T6                    │
  │                                      │
  │  T1, T2, T3 ──[STAR]── star point   │
  │  (Star-point contactor shorts them) │
  │                                      │
  │  Windings in DOUBLE-STAR config     │
  └──────────────────────────────────────┘

  CONTROL:
  LOW and HIGH interlocked (elec + mech)
  STAR contactor energizes WITH HIGH only
  Separate overloads for each speed`,
    steps: [
      'Dahlander motor provides 2:1 speed ratio (e.g. 900/1800 RPM)',
      'Low speed: power to T1-T2-T3, T4-T5-T6 open — windings in delta',
      'High speed: power to T4-T5-T6, T1-T2-T3 shorted together (star point)',
      'Star-point contactor energizes only with HIGH speed contactor',
      'Electrical interlock between LOW and HIGH contactors',
      'Mechanical interlock as backup',
      'Separate overload relays sized for each speed FLC',
      'Must stop before switching speeds (or use compelling starter)',
    ],
  },
  {
    name: 'Soft Starter Connections',
    diagram:
`  SOFT STARTER TYPICAL WIRING
  ═══════════════════════════════════

  POWER:
  L1 ──┬──[DISC]──┬──[FUSES]──┐
  L2 ──┤          ├───────────┤
  L3 ──┤          ├───────────┤
       │          │           │
       │   ┌──────┴───────────┘
       │   │  SOFT STARTER
       │   │  ┌───────────┐
       │   ├─→│ L1  →  T1 │──┬── T1
       │   ├─→│ L2  →  T2 │──┤── T2
       │   └─→│ L3  →  T3 │──┤── T3
       │      │            │  │
       │      │ CTRL  COM  │  │  MOTOR
       │      │  │     │   │  │
       │      └──┼─────┼───┘  │
       │         │     │      │
       │   ┌─────┘     │      │
       │   │           │      │
       │  BYPASS CONTACTOR:   │
       │  ┌───────────────┐   │
       ├──│ L1 ──[BC]── T1│───┤
       ├──│ L2 ──[BC]── T2│───┤
       └──│ L3 ──[BC]── T3│───┘
          └───────────────┘

  CONTROL TERMINALS (typical):
  ┌──────────────────────────┐
  │ 1-2: Start input (NO)    │
  │ 3-4: Stop input (NC)     │
  │ 5-6: Fault relay (NO/NC) │
  │ 7-8: Run relay output    │
  │ A1:  4-20mA analog out   │
  │ COM: Common / 0V         │
  └──────────────────────────┘`,
    steps: [
      'Supply power enters through disconnect and fuses to soft starter L1-L2-L3',
      'Soft starter output T1-T2-T3 connects to motor',
      'Bypass contactor wired across soft starter (L to T on each phase)',
      'Soft starter controls bypass contactor — closes after motor reaches full speed',
      'Bypass reduces heat in thyristors during continuous run',
      'Control inputs: digital start/stop, fault reset',
      'Control outputs: fault relay, running relay, analog current output',
      'Set parameters: motor FLA, ramp up time, ramp down time, current limit, initial voltage',
    ],
  },
  {
    name: 'Control Transformer Connections',
    diagram:
`  CONTROL POWER TRANSFORMER (CPT)
  ═══════════════════════════════════

  480V PRIMARY → 120V SECONDARY (typical)

  PRIMARY (H terminals):
  ┌────────────────────────────────┐
  │                                │
  │  480V connection:              │
  │  L1 ──[FU pri]── H1           │
  │                   │            │
  │              ┌────┴────┐       │
  │              │ PRIMARY │       │
  │              │ WINDING │       │
  │              └────┬────┘       │
  │                   │            │
  │  L2 ──────────── H4           │
  │                                │
  │  (H2-H3 jumpered for 480V)    │
  │  (H1-H3, H2-H4 for 240V)     │
  └────────────────────────────────┘

  SECONDARY (X terminals):
  ┌────────────────────────────────┐
  │                                │
  │              ┌────────────┐    │
  │              │ SECONDARY  │    │
  │              │  WINDING   │    │
  │              └──┬──────┬──┘    │
  │                 │      │       │
  │  X1 (hot) ─────┘      └── X2  │
  │   │                        │   │
  │  [FU sec]                  │   │
  │   │                        │   │
  │  To control ── GND ── X2   │   │
  │  circuit       bond        │   │
  │                            │   │
  │  X2 bonded to ground       │   │
  │  (CEC Rule 26-252)         │   │
  └────────────────────────────────┘

  COMMON CONNECTIONS:
  480V primary: H1-H2 jumpered, H3-H4 jumpered
        → Apply L1 to H1, L2 to H4
  240V primary: H1-H3 jumpered, H2-H4 jumpered
        → Apply L1 to H1, L2 to H2/H4`,
    steps: [
      'CPT steps down power voltage (480V/600V) to control voltage (120V)',
      'Primary fuse (FU) protects transformer — sized per CEC Rule 26-256',
      'For 480V primary: jumper H2-H3, connect L1→H1 and L2→H4',
      'For 240V primary: jumper H1-H3 and H2-H4, connect L1→H1 and L2→H4',
      'Secondary: X1 is hot (120V), X2 is common/neutral',
      'X2 MUST be bonded to ground (CEC Rule 26-252)',
      'Secondary fuse protects control circuit',
      'VA rating must handle all control devices: coils, pilot lights, timers, PLC I/O',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 4: Troubleshooting Data                                        */
/* ------------------------------------------------------------------ */

interface TroubleshootItem {
  problem: string
  symptoms: string
  causes: string[]
  solutions: string[]
  severity: 'high' | 'medium' | 'low'
}

const troubleshootItems: TroubleshootItem[] = [
  {
    problem: 'Contactor Chattering / Buzzing',
    symptoms: 'Contactor makes rapid clicking/buzzing noise, may not fully pull in, motor may not start or runs intermittently.',
    causes: [
      'Low control voltage (voltage sag, long control wire run, undersized CPT)',
      'Dirty or pitted contactor pole faces — magnetic gap too large',
      'Weak or partially open coil (turn-to-turn short)',
      'Loose connections on coil terminals (A1/A2)',
      'Wrong coil voltage rating for the circuit',
      'Mechanical binding of armature or moving parts',
    ],
    solutions: [
      'Measure control voltage at coil terminals — must be within 85-110% of coil rating',
      'Check CPT VA rating vs. actual load (add up all coil VA ratings)',
      'Clean pole faces with fine file (NOT sandpaper — grit embeds in face)',
      'Measure coil resistance — compare to spec. Replace if out of range',
      'Verify coil voltage matches control voltage (120V coil on 120V circuit)',
      'Check for debris or corrosion on armature pivot points',
    ],
    severity: 'medium',
  },
  {
    problem: 'Contactor Won\'t Pick Up',
    symptoms: 'Pressing START does nothing. Motor does not start. No audible click from contactor.',
    causes: [
      'No control power (blown CPT fuse, tripped breaker, open disconnect)',
      'Open coil (burned out — infinite resistance on meter)',
      'Open auxiliary contact in control circuit (seal-in, interlock)',
      'STOP button failed open (NC contact not making)',
      'Overload relay tripped (OL NC contact open — check flag/indicator)',
      'Open safety interlock (E-stop, guard switch, pressure switch)',
    ],
    solutions: [
      'Check for control voltage at CPT secondary (X1-X2)',
      'Measure voltage at coil terminals (A1-A2) with START pressed',
      'Measure coil resistance — open = infinite, good = per manufacturer spec',
      'Walk the control circuit with meter: check each device for continuity',
      'Check and reset overload relay — investigate cause of trip before resetting',
      'Verify all interlocks in series with coil — each must be closed/satisfied',
    ],
    severity: 'high',
  },
  {
    problem: 'Contactor Won\'t Drop Out',
    symptoms: 'Motor continues running after STOP pressed. Contactor stays energized. Motor cannot be stopped from control circuit.',
    causes: [
      'Welded main contacts (most dangerous — contacts fused together from arcing)',
      'Stuck armature (mechanical binding, debris, corrosion)',
      'Feedback voltage through interlock or snubber circuit',
      'STOP button wired incorrectly (NO instead of NC)',
      'Auxiliary contact welded in seal-in circuit',
      'Incorrect wiring — power feeding through alternate path',
    ],
    solutions: [
      'IMMEDIATELY open upstream disconnect to stop motor',
      'Inspect contacts for welding — replace contactor if contacts are welded',
      'Check mechanical freedom of armature — clean and lubricate pivot points',
      'Verify STOP button wiring: must be NC, in series with coil',
      'Check seal-in contact separately — replace if welded',
      'Perform lockout/tagout and inspect all wiring against drawings',
    ],
    severity: 'high',
  },
  {
    problem: 'Overload Relay Tripping',
    symptoms: 'Motor starts then trips on overload after running for some time. OL flag/indicator shows tripped.',
    causes: [
      'Actual motor overload (mechanical load too high, bearing failure, alignment)',
      'Single phasing (one phase lost — motor draws high current on remaining two)',
      'High ambient temperature (reduces overload trip point)',
      'Wrong overload heater/setting (set too low for motor FLA)',
      'Voltage imbalance (unequal voltage on 3 phases causes current imbalance)',
      'Motor winding fault (turn-to-turn short increases current)',
    ],
    solutions: [
      'Measure motor current on all 3 phases with clamp meter — compare to nameplate FLA',
      'Check for voltage on all 3 phases at motor terminals (single phasing test)',
      'Verify OL is set to correct FLA (nameplate value, NOT the OL range max)',
      'Check ambient temperature — electronic OLs have ambient compensation',
      'Measure voltage balance: max deviation should be < 2% of average',
      'Megger motor windings (phase-to-phase and phase-to-ground) to check insulation',
    ],
    severity: 'high',
  },
  {
    problem: 'Soft Starter Faults',
    symptoms: 'Soft starter displays fault code, motor does not start, fault relay energized.',
    causes: [
      'Thyristor failure (SCR shorted or open — check with multimeter in diode mode)',
      'Over-temperature (insufficient cooling, blocked ventilation, high ambient)',
      'Motor stall (load too high, motor cannot accelerate within programmed time)',
      'Phase loss or phase imbalance on input or output',
      'Incorrect parameter settings (FLA, current limit, ramp time)',
      'Control wiring fault (start/stop inputs, relay outputs)',
    ],
    solutions: [
      'Read fault code from display — refer to manufacturer manual for specific diagnosis',
      'Check cooling: fan operation, air filters, ambient temperature, minimum clearances',
      'Increase current limit or ramp time if motor needs more time to accelerate',
      'Check all 6 power connections (3 in, 3 out) for loose or corroded terminals',
      'Verify motor FLA parameter matches motor nameplate exactly',
      'Test thyristors: disconnect power and motor, measure each SCR in diode mode',
    ],
    severity: 'medium',
  },
  {
    problem: 'Nuisance Tripping',
    symptoms: 'Starter trips randomly or frequently without apparent overload. Motor appears to run normally.',
    causes: [
      'Harmonic distortion from nearby VFDs causing false current readings',
      'Starting too frequently (motor heat buildup between starts)',
      'High ambient temperature reducing OL trip threshold',
      'Intermittent loose connection causing current spikes',
      'Voltage transients from nearby switching equipment',
      'Worn or incorrect overload elements',
    ],
    solutions: [
      'Install line reactors if VFD harmonics are suspected',
      'Check starting duty cycle — allow adequate cooling between starts',
      'Consider electronic OL with ambient compensation for high-temp environments',
      'Thermal scan all connections — look for hot spots indicating resistance',
      'Install surge protection on control circuits',
      'Verify overload heater catalog number matches motor FLA range',
    ],
    severity: 'low',
  },
  {
    problem: 'Burning Smell from Starter',
    symptoms: 'Acrid burning smell, possible smoke, discolored wiring or components.',
    causes: [
      'Loose power connections (high resistance = heat = fire risk)',
      'Oversized wire crammed into too-small lugs (poor contact area)',
      'Corroded terminals (mine environment — moisture, dust, chemicals)',
      'Overloaded contactor (undersized for the motor load)',
      'Arc damage on contacts (need replacement)',
      'Overheated coil (wrong voltage, chattering, mechanical binding)',
    ],
    solutions: [
      'DE-ENERGIZE IMMEDIATELY — open upstream disconnect',
      'Perform lockout/tagout before inspection',
      'Thermal scan if safe to do so before de-energizing',
      'Inspect all connections — look for discoloration, melted insulation',
      'Re-torque all connections to manufacturer specifications',
      'Replace any damaged wire, lugs, or components — do not reuse burned parts',
    ],
    severity: 'high',
  },
  {
    problem: 'Visual Inspection Checklist (PM)',
    symptoms: 'Routine preventive maintenance inspection items.',
    causes: [
      'Contact condition: look for pitting, blackening, material transfer between poles',
      'Arc chute condition: cracks, carbon buildup, broken arc plates',
      'Coil: discoloration, cracked insulation, burnt smell',
      'Wiring: loose connections, damaged insulation, improper terminations',
      'Overload relay: correct setting, test trip functionality',
      'Enclosure: proper sealing, no dust accumulation, ventilation clear',
      'Thermal scan: compare phases — >10°C difference indicates problem',
      'Mechanical operation: smooth armature travel, spring tension adequate',
    ],
    solutions: [
      'Document findings with photos and comparison to previous inspections',
      'Replace contacts when wear indicator shows or 50% material is gone',
      'Clean arc chutes with dry compressed air — replace if cracked or carbon tracked',
      'Re-torque all connections per manufacturer specifications',
      'Test overload trip by injection (secondary injection test) if equipped',
      'Clean enclosure interior — mine environments need more frequent cleaning',
      'Record thermal scan readings for trending over time',
      'Lubricate pivot points per manufacturer (some require no lubrication)',
    ],
    severity: 'low',
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 5: Maintenance Data                                            */
/* ------------------------------------------------------------------ */

interface MaintenanceSection {
  title: string
  icon: string
  items: string[]
  frequency: string
}

const maintenanceSections: MaintenanceSection[] = [
  {
    title: 'Contactor PM',
    icon: 'CONTACTS',
    frequency: 'Every 3-6 months in mining (12 months general industrial)',
    items: [
      'Contact inspection: check for pitting, welding, and material loss. Replace when 50% of silver alloy is worn away or wear indicator (if equipped) shows replacement needed.',
      'Coil inspection: look for discoloration, cracking, or burnt smell. Measure coil resistance and compare to manufacturer spec. Replace if out of tolerance.',
      'Spring check: verify contact pressure springs are intact and provide adequate force. Weak springs cause overheating and chattering.',
      'Arc chute cleaning: remove arc chutes and clean with dry compressed air. Inspect for cracks, carbon tracking, and broken arc plates. Replace damaged arc chutes.',
      'Connection torque check: re-torque all power and control terminals to manufacturer specifications using a calibrated torque wrench. Document values.',
      'Mechanical operation: manually operate contactor (de-energized) to verify smooth travel. Check for binding, debris, or worn pivot points.',
      'Auxiliary contacts: inspect and clean aux contact tips. Check for proper spring tension and alignment with main contacts.',
    ],
  },
  {
    title: 'Overload Relay PM',
    icon: 'OL',
    frequency: 'Every 6 months in mining (12 months general industrial)',
    items: [
      'Verify FLA setting: compare OL setting to motor nameplate. Should be set to 115% (SF 1.0) or 125% (SF 1.15) of nameplate FLA.',
      'Test trip function: use secondary injection tester to verify OL trips within specified time at test current. Class 10/20/30 as applicable.',
      'Check ambient compensation: electronic OLs have ambient temp compensation — verify it is enabled if OL is in a hot environment.',
      'Inspect thermal elements (bimetallic type): look for discoloration, warping, or carbon buildup. Ensure proper heater size for motor.',
      'Reset mechanism: verify manual reset operates smoothly and holds. Check that auto-reset is disabled on safety-critical applications.',
      'Phase-loss protection: verify phase-loss detection is enabled (electronic OLs). Test by opening one phase and confirming trip.',
      'Ground fault detection (if equipped): verify sensitivity setting and test with known ground fault current.',
    ],
  },
  {
    title: 'Soft Starter PM',
    icon: 'SS',
    frequency: 'Every 6 months in mining (3-6 months in dusty areas)',
    items: [
      'Fan cleaning: remove and clean cooling fans. Replace if bearing noise or reduced airflow detected. Check fan fuse/thermal protection.',
      'Thyristor inspection: look for signs of overheating (discoloration on heatsink), loose power connections, and thermal paste degradation.',
      'Air filter cleaning: clean or replace intake air filters. Mining environments require more frequent filter service.',
      'Parameter backup: record all programmed parameters. Store backup with maintenance records. Verify parameters match commissioning values.',
      'Heat sink cleaning: blow out dust from heatsink fins with dry compressed air. Do not use water or solvents.',
      'Bypass contactor: inspect bypass contactor contacts and coil (same as contactor PM above).',
      'Control wiring: verify all control connections are tight. Check for rodent damage or moisture intrusion.',
      'Firmware version: record current firmware version. Check manufacturer for updates if experiencing issues.',
    ],
  },
  {
    title: 'Inspection Frequency Guide',
    icon: 'SCHEDULE',
    frequency: 'Based on environment and duty cycle',
    items: [
      'Mining underground: every 3 months (dust, moisture, vibration, continuous duty)',
      'Mining surface (processing plant): every 6 months (dust, temperature extremes)',
      'Clean industrial: every 12 months (normal environment, standard duty)',
      'High-cycle applications (>100 operations/day): every 3 months regardless of environment',
      'After any fault trip: inspect before resetting — do not just reset and restart',
      'After any electrical event (short circuit, ground fault): full inspection required',
      'Seasonal: before winter (cold start issues) and before summer (overheating)',
    ],
  },
  {
    title: 'Infrared Scanning',
    icon: 'IR',
    frequency: 'Quarterly in mining (annually in clean environments)',
    items: [
      'Scan under normal load conditions (not at startup or no-load)',
      'Compare all three phases — temperature difference >10°C between phases indicates problem',
      'Hot lugs/connections: loose connection or undersized conductor — immediate attention needed',
      'Hot contacts: worn contacts, pitted surfaces, or overloaded contactor',
      'Hot coil: shorted turns, wrong voltage, or mechanical binding preventing full pull-in',
      'Hot overload relay: actual overload condition or wrong heater size',
      'Baseline scans: establish reference temperatures when new or after maintenance for future comparison',
      'Documentation: save thermal images with max temperature readings, date, load current, and ambient temp',
    ],
  },
  {
    title: 'Contact Replacement Guide',
    icon: 'REPLACE',
    frequency: 'When inspection indicates wear',
    items: [
      'Replace when: 50% of contact material is worn away (measure with caliper or use wear indicator)',
      'Replace when: contacts are welded or have transferred material between stationary and movable contacts',
      'Replace when: pitting depth exceeds 1mm on any contact surface',
      'Do NOT file silver contacts — you remove the expensive contact material. Light cleaning with contact burnishing tool only.',
      'Always replace contacts in SETS (all 3 poles) — never replace just one pole',
      'Use only OEM or manufacturer-approved replacement contacts — aftermarket may not have correct material or dimensions',
      'After replacement: check contact gap, wipe distance, and contact pressure per manufacturer spec',
      'Run-in period: monitor closely for first 24 hours after contact replacement',
    ],
  },
  {
    title: 'Mining Spare Parts (Keep On Hand)',
    icon: 'SPARES',
    frequency: 'Maintain stock at all times',
    items: [
      'Contact kits: for each NEMA size in use. Minimum 2 sets per size.',
      'Coils: one spare coil for each voltage rating in use (120V, 240V coils)',
      'Overload relays/heaters: complete OL relay and heater elements for each motor size',
      'Arc chute sets: one set per contactor size',
      'Auxiliary contact blocks: NO and NC blocks compatible with installed contactors',
      'Soft starter thyristor modules (if applicable): lead time can be 4-12 weeks',
      'Fuses: 3 spare fuses for each rating in use (motor branch circuit and CPT)',
      'Control transformer: one spare CPT for the most common VA rating in the plant',
      'Terminal blocks, wire ferrules, and cable lugs in common sizes',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Shared Styles                                                      */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex', gap: 6, overflowX: 'auto',
  WebkitOverflowScrolling: 'touch', paddingBottom: 4, scrollbarWidth: 'none',
}
const pillBase: React.CSSProperties = {
  flexShrink: 0, minHeight: 48, padding: '0 14px', borderRadius: 24,
  fontSize: 13, fontWeight: 600, border: '2px solid var(--divider)',
  background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
}
const pillActive: React.CSSProperties = {
  ...pillBase, background: 'var(--primary)', color: '#000',
  border: '2px solid var(--primary)',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
}

const sectionTitle: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--primary)',
  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
}

const subLabel: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6,
}

/* ------------------------------------------------------------------ */
/*  Collapsible Card                                                   */
/* ------------------------------------------------------------------ */

function CollapsibleCard({ title, defaultOpen, children, accentColor }: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  accentColor?: string
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div style={{
      ...cardStyle,
      borderLeft: accentColor ? `4px solid ${accentColor}` : undefined,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 600,
          color: 'var(--text)', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <path d="M7 10l5 5 5-5z" />
        </svg>
        {title}
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function MotorStartersPage() {
  const [tab, setTab] = useState<TabKey>('types')
  const [expandedStarter, setExpandedStarter] = useState<number | null>(null)
  const [expandedDiagram, setExpandedDiagram] = useState<number | null>(null)

  /* Sizing tool state */
  const [sizingHp, setSizingHp] = useState('')
  const [sizingVoltage, setSizingVoltage] = useState('480')

  const sizingResult = sizingHp
    ? lookupSizing(parseFloat(sizingHp) || 0, parseFloat(sizingVoltage) || 480)
    : null

  return (
    <>
      <Header title="Motor Starters" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tab pills */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button key={t.key} style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  TAB 1: Starter Types                                         */}
        {/* ============================================================ */}
        {tab === 'types' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>Motor Starter Types</div>

            {starterTypes.map((s, idx) => (
              <div key={s.abbr} style={cardStyle}>
                <button
                  onClick={() => setExpandedStarter(expandedStarter === idx ? null : idx)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
                    color: 'var(--primary)', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
                    style={{ flexShrink: 0, transform: expandedStarter === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  <span style={{ flex: 1 }}>{s.name}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: '#000',
                    background: s.tint, padding: '2px 8px', borderRadius: 10,
                  }}>
                    {s.abbr}
                  </span>
                </button>

                {expandedStarter === idx && (
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Description */}
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                      {s.description}
                    </div>

                    {/* Inrush & Torque badges */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 12, padding: '6px 12px', borderRadius: 8,
                        background: 'var(--input-bg)', color: 'var(--text)',
                        fontFamily: 'var(--font-mono)', fontWeight: 600,
                      }}>
                        Inrush: {s.inrush}
                      </span>
                      <span style={{
                        fontSize: 12, padding: '6px 12px', borderRadius: 8,
                        background: 'var(--input-bg)', color: 'var(--text)',
                        fontFamily: 'var(--font-mono)', fontWeight: 600,
                      }}>
                        Torque: {s.torque}
                      </span>
                    </div>

                    {/* Pros */}
                    <div>
                      <div style={{ ...subLabel, color: '#22c55e' }}>Advantages</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {s.pros.map((p, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px', borderLeft: '2px solid #22c55e',
                          }}>
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cons */}
                    <div>
                      <div style={{ ...subLabel, color: '#ef4444' }}>Disadvantages</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {s.cons.map((c, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px', borderLeft: '2px solid #ef4444',
                          }}>
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* When to use */}
                    <div style={{
                      background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: 12,
                    }}>
                      <div style={{ ...subLabel, color: 'var(--primary)' }}>When to Use</div>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                        {s.whenToUse}
                      </div>
                    </div>

                    {/* Wiring Note */}
                    <div>
                      <div style={subLabel}>Wiring Summary</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {s.wiringNote}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Comparison Table */}
            <div style={sectionTitle}>Comparison Table</div>
            <div style={{ ...cardStyle, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ background: 'var(--input-bg)' }}>
                    {['Type', 'Inrush', 'Torque', 'Cost', 'Complexity', 'Speed Ctrl', 'Application'].map(h => (
                      <th key={h} style={{
                        padding: '10px 8px', textAlign: 'left', color: 'var(--primary)',
                        fontWeight: 700, fontSize: 11, textTransform: 'uppercase',
                        borderBottom: '1px solid var(--divider)', whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, i) => (
                    <tr key={row.type} style={{ background: i % 2 ? 'var(--input-bg)' : 'transparent' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>{row.type}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{row.startCurrent}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{row.startTorque}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{row.cost}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{row.complexity}</td>
                      <td style={{ padding: '8px', color: row.speedControl === 'Yes' ? '#22c55e' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{row.speedControl}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{row.applications}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: Sizing                                                */}
        {/* ============================================================ */}
        {tab === 'sizing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Interactive Sizing Tool */}
            <div style={sectionTitle}>Starter Sizing Tool</div>
            <div style={{ ...cardStyle, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                Enter Motor HP and Voltage
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Motor HP</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={sizingHp}
                    onChange={e => setSizingHp(e.target.value)}
                    placeholder="e.g. 50"
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: 16,
                      background: 'var(--input-bg)', border: '1px solid var(--input-border)',
                      borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                      fontFamily: 'var(--font-mono)', minHeight: 48,
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Voltage</label>
                  <select
                    value={sizingVoltage}
                    onChange={e => setSizingVoltage(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: 16,
                      background: 'var(--input-bg)', border: '1px solid var(--input-border)',
                      borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                      fontFamily: 'var(--font-mono)', minHeight: 48,
                    }}
                  >
                    <option value="208">208V</option>
                    <option value="480">480V</option>
                    <option value="600">600V</option>
                  </select>
                </div>
              </div>

              {sizingResult && (
                <div style={{
                  background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: 12,
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Recommended Sizing
                  </div>
                  {[
                    { label: 'NEMA Size', value: sizingResult.nemaSize },
                    { label: 'Contactor Rating', value: sizingResult.contactorRating },
                    { label: 'Overload Range', value: sizingResult.overloadRange },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.label}</span>
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: 'var(--text)',
                        fontFamily: 'var(--font-mono)', textAlign: 'right',
                      }}>
                        {r.value}
                      </span>
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: 4 }}>
                    Always verify against CEC tables and motor nameplate data. This is a guide only.
                  </div>
                </div>
              )}
              {sizingHp && !sizingResult && (
                <div style={{
                  background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: 12,
                  fontSize: 13, color: '#ef4444',
                }}>
                  Motor HP exceeds NEMA Size 7 range. Consult manufacturer for custom sizing.
                </div>
              )}
            </div>

            {/* NEMA Sizes Table */}
            <div style={sectionTitle}>NEMA Starter Sizes</div>
            <div style={{ ...cardStyle, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ background: 'var(--input-bg)' }}>
                    {['NEMA Size', '208V HP', '480V HP', '600V HP', 'Max Amps'].map(h => (
                      <th key={h} style={{
                        padding: '10px 8px', textAlign: 'left', color: 'var(--primary)',
                        fontWeight: 700, fontSize: 11, textTransform: 'uppercase',
                        borderBottom: '1px solid var(--divider)', whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nemaSizes.map((row, i) => (
                    <tr key={row.size} style={{ background: i % 2 ? 'var(--input-bg)' : 'transparent' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: 'var(--text)' }}>Size {row.size}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{row.hp208}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{row.hp480}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{row.hp600}</td>
                      <td style={{ padding: '8px', color: 'var(--text)', fontWeight: 600 }}>{row.maxAmps}A</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* IEC Categories */}
            <div style={sectionTitle}>IEC Utilization Categories</div>
            {iecCategories.map(cat => (
              <div key={cat.category} style={{ ...cardStyle, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#000', background: 'var(--primary)',
                    padding: '2px 10px', borderRadius: 10,
                  }}>
                    {cat.category}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{cat.name}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {cat.description}
                </div>
                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>
                  Typical: {cat.typicalUse}
                </div>
              </div>
            ))}

            {/* Overload & Starter Info */}
            <div style={sectionTitle}>Overload Sizing & Starter Types</div>
            {overloadInfo.map(info => (
              <CollapsibleCard key={info.topic} title={info.topic} accentColor="var(--primary)">
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                  {info.detail}
                </div>
              </CollapsibleCard>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: Wiring                                                */}
        {/* ============================================================ */}
        {tab === 'wiring' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>Starter Wiring Diagrams</div>

            {wiringDiagrams.map((d, idx) => (
              <div key={d.name} style={cardStyle}>
                <button
                  onClick={() => setExpandedDiagram(expandedDiagram === idx ? null : idx)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
                    color: 'var(--primary)', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
                    style={{ flexShrink: 0, transform: expandedDiagram === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  <span style={{ flex: 1 }}>{d.name}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
                    background: 'var(--input-bg)', padding: '2px 8px', borderRadius: 10,
                  }}>
                    DIAGRAM
                  </span>
                </button>

                {expandedDiagram === idx && (
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* ASCII Diagram */}
                    <div style={{
                      background: '#0a0a0a', border: '1px solid var(--divider)',
                      borderRadius: 'var(--radius-sm)', padding: 14,
                      overflowX: 'auto', WebkitOverflowScrolling: 'touch',
                    }}>
                      <pre style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.4,
                        color: '#22d867', margin: 0, whiteSpace: 'pre',
                      }}>
                        {d.diagram}
                      </pre>
                    </div>

                    {/* Steps */}
                    <div>
                      <div style={subLabel}>Step-by-Step</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {d.steps.map((step, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px', borderLeft: '2px solid var(--primary)',
                            display: 'flex', gap: 8,
                          }}>
                            <span style={{ fontWeight: 700, color: 'var(--primary)', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                              {i + 1}.
                            </span>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: Troubleshooting                                       */}
        {/* ============================================================ */}
        {tab === 'troubleshoot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>Motor Starter Troubleshooting</div>

            {troubleshootItems.map(item => {
              const sevColor = item.severity === 'high' ? '#ef4444' : item.severity === 'medium' ? '#f59e0b' : '#3b82f6'
              return (
                <CollapsibleCard
                  key={item.problem}
                  title={item.problem}
                  accentColor={sevColor}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Severity Badge */}
                    <span style={{
                      alignSelf: 'flex-start', fontSize: 11, fontWeight: 700,
                      color: '#000', background: sevColor,
                      padding: '2px 10px', borderRadius: 10, textTransform: 'uppercase',
                    }}>
                      {item.severity} priority
                    </span>

                    {/* Symptoms */}
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      {item.symptoms}
                    </div>

                    {/* Causes */}
                    <div>
                      <div style={{ ...subLabel, color: '#ef4444' }}>Possible Causes</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {item.causes.map((c, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px', borderLeft: '2px solid #ef4444',
                          }}>
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Solutions */}
                    <div>
                      <div style={{ ...subLabel, color: '#22c55e' }}>Solutions</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {item.solutions.map((s, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px', borderLeft: '2px solid #22c55e',
                          }}>
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleCard>
              )
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 5: Maintenance                                           */}
        {/* ============================================================ */}
        {tab === 'maintenance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>Preventive Maintenance Guide</div>

            {maintenanceSections.map(section => (
              <CollapsibleCard
                key={section.title}
                title={section.title}
                accentColor="var(--primary)"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Frequency badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: '#000', background: 'var(--primary)',
                      padding: '2px 10px', borderRadius: 10,
                    }}>
                      {section.icon}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {section.frequency}
                    </span>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {section.items.map((item, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
                        padding: '6px 0 6px 12px', borderLeft: '2px solid var(--divider)',
                      }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleCard>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
