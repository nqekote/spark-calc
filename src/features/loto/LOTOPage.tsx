import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Lockout/Tagout Reference — Ontario Mining Electricians              */
/* ------------------------------------------------------------------ */

type TabKey = 'procedure' | 'energy' | 'mining' | 'devices' | 'regs'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'procedure', label: 'Procedure' },
  { key: 'energy', label: 'Energy Sources' },
  { key: 'mining', label: 'Mining LOTO' },
  { key: 'devices', label: 'Devices' },
  { key: 'regs', label: 'Regs & Training' },
]

/* ------------------------------------------------------------------ */
/*  Tab 1: Procedure Steps                                             */
/* ------------------------------------------------------------------ */

interface ProcedureStep {
  num: number
  title: string
  summary: string
  details: string[]
  miningNotes?: string[]
  critical?: boolean
}

const procedureSteps: ProcedureStep[] = [
  {
    num: 1,
    title: 'Notify Affected Personnel',
    summary: 'Inform all workers who may be affected by the lockout before beginning.',
    details: [
      'Identify everyone who operates, maintains, or works near the equipment.',
      'Notify production supervisors, operators, maintenance crew, and contractors.',
      'Explain what equipment is being locked out, why, and estimated duration.',
      'Ensure notification includes all shifts that may be affected.',
      'Post notification at the workstation or equipment if it spans shifts.',
      'Document who was notified and when — required for group lockouts.',
    ],
    miningNotes: [
      'Underground: notify the shift boss and hoist operator if work affects the hoist or ventilation.',
      'Use the mine communication system (radio/phone) for remote equipment notifications.',
      'Log notifications in the shift log book per O. Reg. 854.',
    ],
  },
  {
    num: 2,
    title: 'Identify ALL Energy Sources',
    summary: 'Survey every energy type that could be present — electrical, mechanical, hydraulic, pneumatic, thermal, chemical, gravitational, stored energy.',
    details: [
      'Review equipment manuals, schematics, and piping diagrams.',
      'Walk down the equipment and physically trace all energy inputs.',
      'Check for multiple voltage sources — equipment may have more than one feed.',
      'Identify control power separately from main power (often different sources).',
      'Look for backup power: UPS, battery backup, emergency generators.',
      'Identify all forms of stored energy: capacitors, springs, elevated loads, compressed gas, hydraulic accumulators.',
      'Check for process energy: hot surfaces, chemical reactions, pressurized lines.',
      'Document ALL energy sources on the lockout procedure sheet before proceeding.',
    ],
    miningNotes: [
      'Mining conveyors often have gravity energy — loaded belt can move even when de-energized.',
      'VFDs on mine equipment have DC bus capacitors that hold lethal voltage for 15+ minutes.',
      'Check for trailing cable connections — portable equipment may have multiple plug points.',
      'Underground pumps may have pressurized discharge lines.',
    ],
    critical: true,
  },
  {
    num: 3,
    title: 'Normal Shutdown of Equipment',
    summary: 'Shut down equipment using the normal operating controls before applying locks.',
    details: [
      'Use the normal stop button, HMI shutdown, or control room shutdown procedure.',
      'Do NOT simply pull the disconnect — this can damage equipment and cause energy surges.',
      'Allow rotating equipment to come to a complete stop before proceeding.',
      'Verify motors have stopped, conveyors are stationary, and pumps have ceased operation.',
      'If equipment has a sequenced shutdown, follow the correct sequence.',
      'Bleed air lines, depressurize hydraulic systems where possible during normal shutdown.',
    ],
    miningNotes: [
      'For conveyor systems: follow the conveyor shutdown sequence (downstream to upstream).',
      'Crushers: ensure the crushing chamber is empty if possible before shutdown.',
      'Mine hoists: park the conveyance, set mechanical brakes, and follow the hoist shutdown checklist.',
    ],
  },
  {
    num: 4,
    title: 'Isolate ALL Energy Sources',
    summary: 'Physically separate every energy source from the equipment using isolation devices.',
    details: [
      'Open electrical disconnects and breakers to the OFF position.',
      'Pull MCC bucket starters to the disconnected/test position.',
      'Close manual isolation valves on hydraulic and pneumatic lines.',
      'Block or restrain any mechanical motion (chock, chain, or pin components).',
      'Bleed residual pressure from hydraulic and pneumatic lines.',
      'Block elevated loads or lower them to a resting position.',
      'Discharge capacitors (especially VFD DC bus) — use manufacturer discharge procedure.',
      'Disconnect battery backup and UPS feeds.',
      'Close steam valves and allow thermal energy to dissipate.',
      'Install blank flanges on chemical or process pipelines if required.',
    ],
    miningNotes: [
      'Trailing cables: disconnect at the plug/receptacle AND at the power centre.',
      'High voltage (>750V): follow written switching orders signed by a competent supervisor.',
      'Conveyor head drives: isolate the drive motor AND install belt clamp/holdback to prevent gravity rollback.',
      'Underground fans: ensure dampers are secured after motor isolation.',
    ],
    critical: true,
  },
  {
    num: 5,
    title: 'Apply Lockout Devices & Tags',
    summary: 'Each worker applies their personal lock and danger tag to every isolation point.',
    details: [
      'Apply YOUR personal lock — only YOU hold the key. No master keys, no shared locks.',
      'Place lock directly on isolation device (disconnect handle, breaker, valve).',
      'Use multi-lock hasps when more than one worker needs to lock out the same point.',
      'Attach a completed danger tag with: your name, date, time, reason for lockout.',
      'Tags alone are NOT sufficient — always use locks AND tags together.',
      'For group lockout: each worker locks on the group lock box, supervisor controls the primary lock.',
      'Ensure the isolation device cannot be operated with the lock in place.',
      'Photograph or document all lock placements for complex lockouts.',
    ],
    miningNotes: [
      'Ontario mining: every worker MUST apply their own personal lock (O. Reg. 854, s. 160).',
      'Color-coded locks by department are common in mines (e.g., red = electrical, blue = mechanical).',
      'Contractor locks must be distinguishable from company locks.',
      'Underground: ensure lock and tag materials are suitable for the environment (moisture, dust).',
    ],
    critical: true,
  },
  {
    num: 6,
    title: 'Verify Zero Energy State',
    summary: 'Confirm that ALL energy has been isolated by testing and attempting to start equipment.',
    details: [
      'ATTEMPT TO START the equipment using normal operating controls — it should not start.',
      'Return the start control to the OFF position after the try-start test.',
      'Test for voltage at the point of work with a properly rated voltage tester.',
      'Test your voltage tester on a known live source BEFORE and AFTER testing the locked-out circuit (live-dead-live method).',
      'Check for voltage phase-to-phase AND phase-to-ground on all conductors.',
      'Verify hydraulic/pneumatic pressure gauges read zero.',
      'Verify elevated loads are blocked and secure.',
      'Check for residual capacitor voltage — especially on VFD DC bus.',
      'Verify thermal energy has dissipated to safe levels.',
      'Use a non-contact detector as a secondary check, but NEVER rely on it alone.',
    ],
    miningNotes: [
      'Always use a CAT III or CAT IV rated meter appropriate for the voltage level.',
      'For high voltage (>750V): use rated HV proving devices and follow CSA Z462 approach boundaries.',
      'VFD DC bus: measure DC voltage at the bus — wait a minimum of 15 minutes or per manufacturer spec before assuming zero energy.',
      'Underground: verify ground fault relay function if circuit will be re-energized.',
    ],
    critical: true,
  },
  {
    num: 7,
    title: 'Perform the Work',
    summary: 'Only after verified zero energy state — proceed with maintenance, repair, or inspection.',
    details: [
      'Work only within the scope of the lockout — do not expand to unlocked equipment.',
      'If new energy sources are discovered, STOP work and isolate/lock them.',
      'If the lockout spans a shift change, the incoming worker must apply their lock BEFORE the outgoing worker removes theirs.',
      'Never bypass or defeat a safety interlock during locked-out work.',
      'If temporary re-energization is needed for testing, follow a specific procedure: remove personnel, remove tools, replace guards, start, test, re-lockout.',
      'Keep the work area clean and organized — account for all tools.',
    ],
    miningNotes: [
      'Underground hot work requires a separate hot work permit in addition to lockout.',
      'If working in a confined space within locked-out equipment, a separate confined space procedure is required.',
      'Mining shift changes: use the lock box transfer procedure — never leave equipment without locks.',
    ],
  },
  {
    num: 8,
    title: 'Remove Lockout — Restore Energy',
    summary: 'Reverse the procedure — only the person who applied a lock may remove it.',
    details: [
      'Verify ALL workers are clear of the equipment and at a safe distance.',
      'Ensure all tools, materials, and loose parts are removed from the equipment.',
      'Replace all machine guards, covers, and safety devices.',
      'Verify that operating controls are in the neutral or OFF position.',
      'Remove YOUR lock and tag — ONLY the person who applied the lock may remove it.',
      'Last lock removed: notify all affected personnel before re-energizing.',
      'Re-energize in the correct sequence (control power first, then main power, etc.).',
      'Test equipment operation and verify all safety interlocks function correctly.',
      'Removal by a supervisor (lock cut-off) is an EMERGENCY procedure only — requires written authorization, documented attempts to contact the lock owner, and full inspection before re-energizing.',
    ],
    miningNotes: [
      'Ontario mining: lock removal by someone other than the installer requires mine supervisor authorization and documented procedure (O. Reg. 854, s. 161).',
      'After re-energizing mine equipment, verify ground fault protection is functional.',
      'For conveyor restarts: follow the conveyor start-up sequence (upstream to downstream) with audible warning.',
      'Log re-energization in the shift log book.',
    ],
    critical: true,
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 2: Energy Sources                                              */
/* ------------------------------------------------------------------ */

interface EnergySource {
  type: string
  icon: string
  color: string
  sources: {
    name: string
    isolation: string
    verification: string
    mistakes: string
  }[]
}

const energySources: EnergySource[] = [
  {
    type: 'Electrical',
    icon: '\⚡',
    color: '#ffd700',
    sources: [
      {
        name: 'Disconnects & Breakers',
        isolation: 'Open disconnect to OFF and lock. For breakers, trip to OFF and apply breaker lockout device. Verify visually that contacts are open where possible.',
        verification: 'Test all phases with a rated voltmeter — phase-to-phase AND phase-to-ground. Use live-dead-live testing method.',
        mistakes: 'Assuming "OFF" position means de-energized without testing. Failing to check for backfeed from other sources.',
      },
      {
        name: 'MCC Bucket Starters',
        isolation: 'Rack bucket out to DISCONNECTED or TEST position. Lock the bucket statch in the disconnected position. Verify bus stabs are separated.',
        verification: 'Test at the load side of the bucket with a voltmeter. Check control power transformer — often a separate feed.',
        mistakes: 'Forgetting the control power transformer may stay energized. Not verifying bus stab separation.',
      },
      {
        name: 'VFDs (Variable Frequency Drives)',
        isolation: 'Open input disconnect and lock. WAIT for DC bus capacitors to discharge — minimum 15 minutes or per manufacturer spec. Some VFDs have a manual discharge procedure.',
        verification: 'Measure DC bus voltage with a rated meter (often 600-700VDC). Verify drive display is completely off. Test output terminals for voltage.',
        mistakes: 'Not waiting for DC bus discharge — VFD capacitors can hold lethal voltage (600VDC+) for 15+ minutes after input power is removed! Never trust the drive display alone.',
      },
      {
        name: 'UPS / Battery Backup',
        isolation: 'Turn off UPS inverter, open input breaker AND battery disconnect. For larger UPS, follow manufacturer shutdown procedure.',
        verification: 'Test output of UPS with voltmeter. Verify battery disconnect is open. Check for automatic bypass that may keep circuits energized.',
        mistakes: 'Forgetting that UPS output stays live when input power is removed — that is literally the purpose of a UPS. Missing automatic bypass circuits.',
      },
      {
        name: 'Capacitor Banks (Power Factor Correction)',
        isolation: 'Open supply breaker and lock. Capacitors must be discharged through built-in resistors. Wait a minimum of 5 minutes (or per manufacturer spec).',
        verification: 'Test with a rated voltmeter across capacitor terminals. Check each individual capacitor in a bank.',
        mistakes: 'Not waiting for discharge. Assuming discharge resistors are functional — they can fail open. Never short capacitor terminals to discharge.',
      },
      {
        name: 'Transformer Stored Energy',
        isolation: 'Open primary AND secondary disconnects and lock both. Transformers can have residual magnetic energy and can backfeed from the secondary side.',
        verification: 'Test all windings (primary and secondary) for voltage. Check for tertiary windings or auxiliary power taps.',
        mistakes: 'Locking out primary only — transformers can be backfed from the secondary (e.g., generator feed). Missing auxiliary taps.',
      },
    ],
  },
  {
    type: 'Mechanical',
    icon: '\⚙\uFE0F',
    color: '#a0a0a0',
    sources: [
      {
        name: 'Rotating Equipment (Motors, Fans)',
        isolation: 'De-energize motor and lock out disconnect. Wait for rotation to completely stop. Verify shaft is stationary.',
        verification: 'Attempt to turn shaft by hand (only if safe to do so). Verify visually that all rotation has ceased.',
        mistakes: 'Not waiting for coast-down — large fans and flywheels can take several minutes to stop. Wind can drive ventilation fans.',
      },
      {
        name: 'Conveyors (Gravity Energy)',
        isolation: 'De-energize drive motor and lock. Install belt clamp or holdback device to prevent gravity rollback on inclined conveyors. Block counterweights.',
        verification: 'Attempt to start conveyor via normal controls. Check for belt creep on inclined sections. Verify holdback device is engaged.',
        mistakes: 'Forgetting gravity — a loaded inclined conveyor WILL move when the brake is released. Not securing counterweight take-ups.',
      },
      {
        name: 'Crushers',
        isolation: 'De-energize all drive motors and lock. Ensure crushing chamber is clear or supported. Block flywheel if present. Lock out hydraulic adjust system.',
        verification: 'Attempt to start via normal controls. Verify flywheel is stationary. Check hydraulic pressure gauges read zero.',
        mistakes: 'Not clearing the crushing chamber — jammed rock can release stored energy when maintenance is performed. Missing hydraulic systems.',
      },
      {
        name: 'Belt Tension / Springs / Counterweights',
        isolation: 'Release tension by following manufacturer procedure. Block or restrain springs in a relaxed state. Pin or support counterweights.',
        verification: 'Verify tension gauges read zero. Visually confirm springs are relaxed. Confirm counterweights are pinned.',
        mistakes: 'Cutting a tensioned belt — it will snap violently. Releasing springs without controlled letdown. Working under unsecured counterweights.',
      },
    ],
  },
  {
    type: 'Hydraulic',
    icon: '\uD83D\uDCA7',
    color: '#3b82f6',
    sources: [
      {
        name: 'Hydraulic Pumps & Lines',
        isolation: 'De-energize pump motor and lock. Close and lock manual isolation valves. Bleed pressure from lines through designated bleed points.',
        verification: 'Check all pressure gauges — they must read zero. Carefully crack a fitting to verify zero pressure (use PPE).',
        mistakes: 'Not bleeding trapped pressure between isolation valves and cylinders. Pressure can remain in dead-ended lines.',
      },
      {
        name: 'Accumulators',
        isolation: 'Close and lock accumulator isolation valve. Bleed accumulator pressure through the designated bleed valve. Follow manufacturer procedure.',
        verification: 'Check accumulator pressure gauge reads zero. Verify pre-charge pressure is also safely controlled.',
        mistakes: 'Forgetting the accumulator — it stores significant energy even when the pump is off. This is one of the most commonly missed energy sources.',
      },
      {
        name: 'Elevated Loads / Rams / Cylinders',
        isolation: 'Lower load to resting position where possible. If load cannot be lowered, mechanically block/support it. Close and lock control valves. Bleed cylinder pressure.',
        verification: 'Verify the load is resting or mechanically supported (do not rely on hydraulic pressure alone). Check pressure gauges.',
        mistakes: 'Relying on hydraulic pressure to hold a load — cylinders can drift or seals can fail. Always mechanically block elevated loads.',
      },
    ],
  },
  {
    type: 'Pneumatic',
    icon: '\uD83C\uDF2C\uFE0F',
    color: '#67e8f9',
    sources: [
      {
        name: 'Compressors & Receivers',
        isolation: 'De-energize compressor and lock. Close and lock isolation valve between receiver and downstream equipment. Bleed receiver pressure through drain valve.',
        verification: 'Check receiver pressure gauge reads zero. Open downstream bleed valves to verify zero pressure in lines.',
        mistakes: 'Not isolating the receiver from the compressor and other receivers on the same header. Trapped pressure in branch lines.',
      },
      {
        name: 'Pneumatic Actuators & Cylinders',
        isolation: 'Close and lock supply valve. Exhaust air from the actuator using the designated exhaust. For spring-return actuators, secure the spring.',
        verification: 'Verify pressure gauges at zero. Attempt to manually move the actuator — it should move freely if fully depressurized.',
        mistakes: 'Forgetting spring-return energy in actuators. Not exhausting air from both sides of double-acting cylinders.',
      },
      {
        name: 'Air-Over-Oil Systems',
        isolation: 'Shut off air supply and lock. Bleed air from the intensifier. Bleed hydraulic pressure from the oil side. Both systems must be depressurized.',
        verification: 'Check gauges on both air and oil sides. This is a dual-energy system — both must be verified independently.',
        mistakes: 'Depressurizing only the air side and assuming the oil side is also depressurized. Oil-side pressures can be significantly higher.',
      },
    ],
  },
  {
    type: 'Thermal',
    icon: '\uD83D\uDD25',
    color: '#ef4444',
    sources: [
      {
        name: 'Steam Lines & Vessels',
        isolation: 'Close and lock steam supply valves. Open drain valves to relieve pressure. Allow system to cool to a safe temperature.',
        verification: 'Check pressure gauges. Measure surface temperature with an IR thermometer or thermocouple. Verify temperature is below the burn threshold.',
        mistakes: 'Opening a steam system before it has cooled and depressurized — flash steam burns are severe. Not draining condensate.',
      },
      {
        name: 'Heated Surfaces / Furnaces / Kilns',
        isolation: 'De-energize heating elements and lock. Close fuel supply valves and lock. Allow natural cooling — do not open doors to speed cooling unless designed for it.',
        verification: 'Monitor temperature with instruments. Verify temperature is below safe working level before entry. Check for fuel gas pockets.',
        mistakes: 'Impatience — thermal energy takes a long time to dissipate. Opening furnace doors prematurely can cause thermal shock or exposure to combustion gases.',
      },
    ],
  },
  {
    type: 'Chemical',
    icon: '\☣\uFE0F',
    color: '#a855f7',
    sources: [
      {
        name: 'Process Pipelines',
        isolation: 'Close and lock isolation valves. Drain and purge lines with inert gas or water. Install blank flanges (spectacle blinds) for positive isolation on hazardous chemicals.',
        verification: 'Verify gauge pressure is zero. Test atmosphere for toxic/flammable gases. Confirm blank flanges are installed correctly.',
        mistakes: 'Relying on valves alone for hazardous chemicals — valves can leak. Not purging lines before opening them.',
      },
      {
        name: 'Chemical Reactions (Exothermic)',
        isolation: 'Stop reagent feed and lock. Allow reaction to complete or quench per procedure. Isolate all reagent supply lines.',
        verification: 'Monitor temperature and pressure to confirm reaction has ceased. Test for residual reagents.',
        mistakes: 'Not allowing a reaction to complete before opening the vessel. Mixing incompatible chemicals during drain/purge.',
      },
    ],
  },
  {
    type: 'Gravitational',
    icon: '\⬇\uFE0F',
    color: '#f97316',
    sources: [
      {
        name: 'Elevated Loads / Hoists / Cranes',
        isolation: 'Lower load to ground/floor level. If load cannot be lowered, mechanically block using rated cribbing, stands, or pins. De-energize hoist and lock.',
        verification: 'Verify load is resting on mechanical supports (not suspended by cables/chains). Check that blocking is rated for the load weight.',
        mistakes: 'Working under a suspended load — NEVER rely on brakes, slings, or hydraulics alone. Always mechanically block.',
      },
      {
        name: 'Man-Lifts / Scissor Lifts / Platforms',
        isolation: 'Lower platform to ground level. If work requires elevated platform, use mechanical safety props/locks designed for the equipment.',
        verification: 'Verify mechanical props are engaged. Check manufacturer procedure for safe maintenance position.',
        mistakes: 'Working under a raised platform without mechanical props. Hydraulic systems can fail suddenly.',
      },
      {
        name: 'Hinged Covers / Counterbalanced Doors',
        isolation: 'Secure open covers with mechanical props or chains. For spring-assisted covers, block them in the open position. For heavy covers, use overhead support.',
        verification: 'Verify props are in place and rated for the load. Test stability before working underneath.',
        mistakes: 'Relying on gas springs or counterweights to hold covers open. These can fail without warning.',
      },
    ],
  },
  {
    type: 'Stored Energy',
    icon: '\uD83D\uDD0B',
    color: '#fbbf24',
    sources: [
      {
        name: 'Capacitors (VFD DC Bus)',
        isolation: 'Open input power and lock. Wait a MINIMUM of 15 minutes for internal discharge resistors to bleed DC bus. Some large drives require 30+ minutes.',
        verification: 'Measure DC bus voltage with a CAT III rated meter. Voltage must be below 50VDC before it is considered safe. Check manufacturer spec.',
        mistakes: 'THE #1 MISSED ENERGY SOURCE IN ELECTRICAL WORK. VFD DC bus capacitors hold 600-700VDC and can be lethal 15+ minutes after power removal. Never assume discharge is complete without measuring.',
      },
      {
        name: 'Springs (Mechanical)',
        isolation: 'Release spring tension following manufacturer procedure using proper tooling. Block springs in a relaxed or controlled state. Pin retractable mechanisms.',
        verification: 'Visually confirm springs are relaxed or securely blocked. Verify retractable pins are fully engaged.',
        mistakes: 'Releasing a compressed spring without controlled letdown. Removing components that are under spring tension without awareness.',
      },
      {
        name: 'Compressed Gas (Cylinders, Receivers)',
        isolation: 'Close cylinder valve and lock. For systems: close and lock supply valve, bleed downstream lines, vent to atmosphere through proper relief device.',
        verification: 'Check all downstream gauges read zero. Verify vent valves are open. For toxic gases, monitor atmosphere.',
        mistakes: 'Not bleeding trapped gas in dead legs or between valves. Gas at even moderate pressure can cause serious injury.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 3: Mining LOTO                                                 */
/* ------------------------------------------------------------------ */

interface RegSection {
  title: string
  ref: string
  items: string[]
  critical?: boolean
}

const ontarioRegs: RegSection[] = [
  {
    title: 'Worker Must Apply Own Lock',
    ref: 'O. Reg. 854, s. 160',
    items: [
      'Every worker performing maintenance or repair must apply their own personal lock and tag.',
      'No worker shall rely on another person\'s lock for their own protection.',
      'Each lock must be identifiable to the worker who installed it (name, number, or color coding).',
      'Only the person who installed the lock shall remove it, except in emergency per s. 161.',
    ],
    critical: true,
  },
  {
    title: 'Supervisor Lock Removal (Emergency Only)',
    ref: 'O. Reg. 854, s. 161',
    items: [
      'A supervisor may authorize removal of another worker\'s lock ONLY if the worker cannot be contacted.',
      'Documented attempts to contact the lock owner must be made.',
      'A complete inspection of the equipment must be performed before re-energizing.',
      'The incident must be documented and the lock owner must be notified upon return.',
      'This is an EMERGENCY procedure — it must never become routine.',
    ],
    critical: true,
  },
  {
    title: 'De-energization Before Work',
    ref: 'O. Reg. 854, s. 159',
    items: [
      'Electrical equipment must be de-energized and locked out before maintenance work is performed.',
      'Zero energy state must be verified by the worker performing the work.',
      'A proper voltage testing device must be used — rated for the voltage level being tested.',
      'Live work is only permitted under strict CSA Z462 procedures with proper PPE and justification.',
    ],
    critical: true,
  },
  {
    title: 'Competent Supervisor Required',
    ref: 'O. Reg. 854, s. 118-121',
    items: [
      'All electrical work at a mine must be supervised by a competent person.',
      'High voltage switching orders must be prepared by and authorized by competent persons.',
      'Workers performing electrical work must be qualified for the voltage level and equipment.',
      'The mine must maintain a list of authorized persons for electrical work.',
    ],
  },
]

interface EquipmentLOTO {
  equipment: string
  steps: string[]
  critical?: boolean
}

const miningEquipment: EquipmentLOTO[] = [
  {
    equipment: 'Conveyor Systems',
    steps: [
      'Follow conveyor shutdown sequence: downstream to upstream.',
      'Lock out drive motor disconnect at MCC.',
      'Lock out control power (separate feed from drive power).',
      'Install belt clamp or verify anti-rollback device on inclined sections.',
      'Secure take-up counterweights (chain or pin them).',
      'Lock out any belt cleaning or belt scale systems.',
      'For multi-drive conveyors: lock out ALL drives.',
      'Verify: attempt to start, check for belt creep, verify holdback engaged.',
    ],
    critical: true,
  },
  {
    equipment: 'Crushers (Jaw, Cone, Gyratory)',
    steps: [
      'Shut down using normal controls — allow to run empty if possible.',
      'Lock out main drive motor disconnect at MCC.',
      'Lock out hydraulic power unit (adjust, clamp, tramp iron release).',
      'Lock out lube oil system (separate motor/disconnect).',
      'Block flywheel if working near moving parts.',
      'Support or pin the mantle/bowl if working inside the chamber.',
      'Verify: try to start, check all hydraulic gauges at zero.',
    ],
  },
  {
    equipment: 'Mills (SAG, Ball, Rod)',
    steps: [
      'Follow mill shutdown procedure — run empty or follow maintenance procedure.',
      'Lock out main drive motor disconnect.',
      'Lock out lube oil system (all pumps).',
      'Lock out inching/barring drive.',
      'Engage mill holding pin/brake per manufacturer procedure.',
      'Lock out water supply valves to mill.',
      'Lock out any classifying equipment (cyclones, screens) in the circuit.',
      'Verify: try to start all drives, verify mill is pinned and cannot rotate.',
    ],
    critical: true,
  },
  {
    equipment: 'Mine Hoists',
    steps: [
      'Park the conveyance and set mechanical brakes.',
      'Follow the hoist shutdown checklist in the hoist log.',
      'Lock out hoist motor disconnect AND the hoist room control panel.',
      'Lock out dynamic braking resistor circuit.',
      'Engage mechanical holding devices (caliper brakes, drum locks).',
      'If working on the headframe: lock out the hoist AND the skip dump mechanism.',
      'Notify the hoist operator, shaft crew, and all levels that may be affected.',
      'Post signage at all shaft stations: "HOIST OUT OF SERVICE."',
    ],
    critical: true,
  },
  {
    equipment: 'Ventilation Fans (Main & Auxiliary)',
    steps: [
      'Shut down the fan using normal controls.',
      'Lock out the fan motor disconnect at MCC or switchgear.',
      'Wait for the fan to coast to a complete stop (large fans can coast for several minutes).',
      'Secure dampers in the closed position if working on the fan.',
      'For axial fans: lock the blades or block against windmilling from natural ventilation.',
      'Notify underground crew — fan shutdown affects ventilation flow.',
      'Verify: attempt to start, physically verify fan is stationary.',
    ],
  },
  {
    equipment: 'Underground Pumps',
    steps: [
      'Shut down pump using normal controls.',
      'Lock out pump motor disconnect (may be a long cable run to MCC).',
      'Close and lock discharge valve to prevent backflow.',
      'Close and lock suction valve.',
      'Bleed pressure between closed valves.',
      'For deep sump pumps: ensure check valve prevents column backflow.',
      'Verify: attempt to start, check pressure gauges at zero.',
    ],
  },
  {
    equipment: 'MCC Buckets',
    steps: [
      'Turn off the bucket/starter using the local controls.',
      'Rack the MCC bucket to the DISCONNECTED or TEST position.',
      'Lock the bucket statch in the disconnected position.',
      'Verify: visually confirm bus stabs are separated. Test at the load side of the bucket.',
      'Lock out control power transformer if working on control circuits (often a separate feed).',
      'For VFD buckets: wait for DC bus discharge (15+ minutes) and verify with meter.',
    ],
  },
  {
    equipment: 'Portable Equipment (Trailing Cable)',
    steps: [
      'Shut down equipment using normal controls.',
      'Unplug the trailing cable from the receptacle AND lock the receptacle in the OFF position.',
      'Lock out the power centre breaker feeding the receptacle.',
      'If the equipment has a disconnect on the machine, lock it as well.',
      'For medium voltage trailing cables: follow high voltage switching procedures.',
      'Verify: attempt to start, test at the equipment disconnect for voltage.',
    ],
  },
]

interface ChecklistItem {
  text: string
  critical?: boolean
}

const miningChecklist: ChecklistItem[] = [
  { text: 'All affected workers notified of the lockout' },
  { text: 'All energy sources identified and documented', critical: true },
  { text: 'Equipment shut down using normal controls' },
  { text: 'All electrical disconnects opened and locked', critical: true },
  { text: 'All mechanical energy restrained or blocked' },
  { text: 'Hydraulic/pneumatic systems depressurized and locked' },
  { text: 'Gravitational energy secured (loads lowered or blocked)' },
  { text: 'Stored energy released (capacitors, springs, compressed gas)', critical: true },
  { text: 'Personal lock and tag applied at every isolation point', critical: true },
  { text: 'Try-start test performed — equipment does NOT start', critical: true },
  { text: 'Voltage tested at point of work — confirmed zero energy', critical: true },
  { text: 'Tester verified on known live source (live-dead-live method)', critical: true },
  { text: 'All guards and barriers in place around work area' },
  { text: 'Shift log book updated with lockout details' },
  { text: 'Group lockout box in use if multiple workers (each worker locked on)' },
]

/* ------------------------------------------------------------------ */
/*  Tab 4: Devices                                                     */
/* ------------------------------------------------------------------ */

interface DeviceCategory {
  category: string
  description: string
  devices: {
    name: string
    detail: string
    usage: string
  }[]
}

const deviceCategories: DeviceCategory[] = [
  {
    category: 'Padlocks',
    description: 'The primary lockout device. Each worker must have their own personal lock that is uniquely keyed.',
    devices: [
      {
        name: 'Personal Safety Locks',
        detail: 'Individually keyed padlocks assigned to one worker. Only one key exists (or two — one with supervisor for emergency use). Non-master-keyed. Durable body with hardened steel, aluminum, or non-conductive shackle.',
        usage: 'Applied by every worker performing lockout. The most fundamental lockout device. Must be identifiable to the individual worker by name, number, or photo.',
      },
      {
        name: 'Department Locks (Color-Coded)',
        detail: 'Color-coded by department or trade: Red = Electrical, Blue = Mechanical, Green = Operations, Yellow = Instrumentation, Orange = Contractor. Lightweight anodized aluminum body for easy identification.',
        usage: 'Quick visual identification of which department has locks applied. Common in mining operations with multiple trades working simultaneously.',
      },
      {
        name: 'Contractor Locks',
        detail: 'Distinctly different color or style from company locks (often orange or white). Issued by the mine to contractors upon orientation. Must be returned when contract work is complete.',
        usage: 'Ensures contractor locks are immediately identifiable and distinguishable from employee locks. Tracked by the mine\'s safety department.',
      },
    ],
  },
  {
    category: 'Hasps',
    description: 'Allow multiple workers to lock out the same energy isolation point. Each worker applies their own lock to the hasp.',
    devices: [
      {
        name: 'Standard Lockout Hasp (Jaw Style)',
        detail: '6-hole or 8-hole hasp with a jaw that fits over the disconnect handle or breaker toggle. All locks must be removed before the hasp can be removed and the disconnect operated.',
        usage: 'Most common hasp. Used on disconnect switches, breaker toggles, and valve handles. Must be sized to fit the specific isolation device.',
      },
      {
        name: 'Scissor Hasp (Folding)',
        detail: 'Interlocking scissor-style arms that expand to accommodate many locks. More compact than jaw-style when few locks are applied. Can typically hold 6-12 locks.',
        usage: 'Used when many workers need to lock out the same point (e.g., major maintenance shutdowns). Common at mine MCC sections.',
      },
    ],
  },
  {
    category: 'Circuit Breaker Lockouts',
    description: 'Devices designed to lock circuit breakers in the OFF position. Different designs for different breaker types.',
    devices: [
      {
        name: 'Standard Toggle Breaker Lockout',
        detail: 'Clamp-on device that fits over the breaker toggle and prevents it from being moved to ON. Accommodates single, double, or triple-pole breakers. Some are universal fit, others are sized.',
        usage: 'Used on standard bolt-on breakers in panelboards and switchgear. Select the correct size for the breaker toggle width.',
      },
      {
        name: 'Push-Button Breaker Lockout',
        detail: 'Rotating or sliding device that covers the ON button of a push-on/push-off breaker, preventing re-energization while allowing the OFF button to remain accessible.',
        usage: 'Common on some motor control breakers and European-style breakers. Verify compatibility with the specific breaker model.',
      },
      {
        name: 'Molded Case Breaker Lockout (Large Frame)',
        detail: 'Designed for large molded case breakers (100A-2500A). May use a padlock plate, handle block, or a through-the-handle clamp depending on the breaker manufacturer.',
        usage: 'Used on main breakers, feeder breakers in switchgear, and large motor branch breakers. Match to the specific breaker manufacturer and frame size.',
      },
    ],
  },
  {
    category: 'Plug Lockouts',
    description: 'Prevent cord-and-plug equipment from being energized by covering the plug end of the power cord.',
    devices: [
      {
        name: 'Standard Plug Lockout',
        detail: 'A clamshell or box-style device that encases the electrical plug, preventing it from being inserted into a receptacle. Available in various sizes for different plug configurations.',
        usage: 'Used on portable tools, small pumps, and any cord-and-plug connected equipment. Size to match the plug type (15A, 20A, 30A, etc.).',
      },
      {
        name: 'Mine Plug/Receptacle Lockout',
        detail: 'Heavy-duty device for mine-type power receptacles and plugs. Designed to lock a mine-type plug in the disconnected position or to lock the receptacle cover closed.',
        usage: 'Used on mine trailing cable connections, underground power distribution, and portable mining equipment. Match to the receptacle type and amperage.',
      },
    ],
  },
  {
    category: 'Valve Lockouts',
    description: 'Devices for isolating hydraulic, pneumatic, steam, and chemical process valves in the closed position.',
    devices: [
      {
        name: 'Gate Valve Lockout',
        detail: 'Device that clamps around the gate valve handwheel and prevents rotation. Available in various sizes to fit different handwheel diameters. Some use a chain wrap for oversized valves.',
        usage: 'Used on gate valves in water, steam, hydraulic, and process piping systems. Verify the device fits the handwheel diameter.',
      },
      {
        name: 'Ball Valve Lockout',
        detail: 'Device that clamps over the ball valve lever handle, preventing it from being rotated. May use an arm clamp or a full enclosure depending on the handle style.',
        usage: 'Very common in compressed air, hydraulic, and process lines. Ensure the device fits the specific handle configuration (some ball valves have removable handles).',
      },
      {
        name: 'Butterfly Valve Lockout',
        detail: 'Handle clamp or lever lock designed for butterfly valve lever-type operators. Prevents the lever from being rotated or the latch from being released.',
        usage: 'Used on butterfly valves in HVAC, water, and process systems. Match to the lever style and size.',
      },
    ],
  },
  {
    category: 'Pneumatic / Hydraulic Lockouts',
    description: 'Specialized devices for isolating pneumatic and hydraulic energy at the source.',
    devices: [
      {
        name: 'Pneumatic Quick-Disconnect Lockout',
        detail: 'Locks over pneumatic quick-disconnect fittings, preventing connection. Can lock the male or female end of the coupling in the disconnected state.',
        usage: 'Used on pneumatic tool connections, air-operated actuators, and pneumatic control lines.',
      },
      {
        name: 'Hydraulic Hose Lockout',
        detail: 'A cap or blind plug that locks over hydraulic quick-disconnect fittings. Prevents reconnection and protects against pressurized fluid release.',
        usage: 'Used on hydraulic tool connections, mobile equipment hydraulic lines, and maintenance disconnection points.',
      },
    ],
  },
  {
    category: 'Tags & Signage',
    description: 'Tags communicate WHO locked out, WHEN, and WHY. Tags supplement locks — they never replace them.',
    devices: [
      {
        name: 'DANGER — Do Not Operate Tags',
        detail: 'Red and white DANGER tag with space for: worker name, date, time, reason for lockout, expected duration, and department. Non-reusable ties or grommets. Weather-resistant material.',
        usage: 'Required on every lock. Must be filled out completely and legibly. The most common and important tag type.',
      },
      {
        name: 'Information Tags (Yellow)',
        detail: 'Yellow CAUTION tags for informational purposes. Used to communicate information that is not a lockout but requires attention.',
        usage: 'Equipment awaiting parts, temporary operating restrictions, or general safety information. NOT a substitute for lockout tags.',
      },
      {
        name: 'Out-of-Service Tags',
        detail: 'Tags indicating equipment is removed from service and should not be operated. May be combined with lockout or used independently for equipment awaiting decommissioning.',
        usage: 'Used on equipment that has been taken out of service, is awaiting repair, or has failed inspection. Not the same as lockout.',
      },
    ],
  },
  {
    category: 'Group Lockout Equipment',
    description: 'Used when multiple workers must lock out the same equipment, especially during complex maintenance or shutdowns.',
    devices: [
      {
        name: 'Lock Box (Group Lock Box)',
        detail: 'A steel box that holds the keys to all isolation point locks. One authorized person applies locks on all isolation points and places the keys in the box. Each worker then applies their personal lock to the box. Equipment cannot be re-energized until every worker removes their lock from the box.',
        usage: 'Essential for group lockout in mining. Used during major shutdowns, multi-trade work, and shift transfers. The supervisor or lead worker controls the primary locks.',
      },
      {
        name: 'Key Storage / Key Pouch',
        detail: 'Lockable pouch or cabinet for storing lock keys during group lockout. Transparent or numbered for accountability. Zipped and locked with a personal padlock.',
        usage: 'Alternative to lock boxes for smaller group lockouts. Each key pouch is assigned to one worker and locked with their personal lock.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 5: Regs & Training                                             */
/* ------------------------------------------------------------------ */

interface RegRef {
  code: string
  title: string
  keyPoints: string[]
}

const regulations: RegRef[] = [
  {
    code: 'CSA Z460',
    title: 'Control of Hazardous Energy — Lockout and Other Methods',
    keyPoints: [
      'Canada\'s primary standard for lockout/tagout programs.',
      'Defines requirements for written procedures, training, auditing, and hardware.',
      'Requires hazardous energy control procedures to be documented for each piece of equipment.',
      'Annual review of all lockout procedures is mandatory.',
      'Defines roles: authorized workers, affected workers, and other workers.',
      'Requires periodic inspection of procedures by someone other than the procedure user.',
    ],
  },
  {
    code: 'Ontario O. Reg. 854',
    title: 'Mines and Mining Plants — Electrical Safety',
    keyPoints: [
      'Sections 118-121: Electrical supervision and competency requirements.',
      'Section 159: De-energization and lockout before electrical work.',
      'Section 160: Every worker must apply their own lock. No shared locks.',
      'Section 161: Emergency lock removal requires supervisor authorization and documentation.',
      'Section 153: Ground fault protection requirements for mining electrical systems.',
      'Applies to all Ontario mines — surface and underground.',
    ],
  },
  {
    code: 'Ontario OHSA, Section 42',
    title: 'Occupational Health & Safety Act — Prescribed Equipment',
    keyPoints: [
      'Requires employers to ensure equipment is locked out before maintenance.',
      'Equipment must not be operated during maintenance unless specifically required for the work.',
      'Training must be provided to all workers who may be exposed to hazardous energy.',
      'Applies to all Ontario workplaces (not just mines).',
    ],
  },
]

interface WorkerRole {
  role: string
  description: string
  requirements: string[]
}

const workerRoles: WorkerRole[] = [
  {
    role: 'Authorized Worker',
    description: 'A qualified worker who performs the lockout and the maintenance/repair work.',
    requirements: [
      'Must be trained in the specific lockout procedure for the equipment.',
      'Must understand all energy sources and isolation methods for the equipment.',
      'Responsible for applying their own lock and tag.',
      'Responsible for verifying zero energy state before beginning work.',
      'Must be retrained when procedures change or at least annually.',
    ],
  },
  {
    role: 'Affected Worker',
    description: 'A worker whose job requires operating or using equipment that is being locked out.',
    requirements: [
      'Must be notified before lockout begins and before re-energization.',
      'Must understand the purpose and basic rules of lockout (do not attempt to start locked-out equipment).',
      'Does NOT apply their own lock (unless they are also performing maintenance).',
      'Training focuses on recognition and respect for lockout devices.',
    ],
  },
  {
    role: 'Other Workers',
    description: 'Workers who work in an area where lockout is being performed but do not operate or maintain the equipment.',
    requirements: [
      'Must be aware that lockout is in progress in their work area.',
      'Must not attempt to restart or operate locked-out equipment.',
      'Must not remove or tamper with locks, tags, or isolation devices.',
      'General awareness training is required.',
    ],
  },
]

interface TrainingReq {
  topic: string
  frequency: string
  details: string
}

const trainingReqs: TrainingReq[] = [
  {
    topic: 'Initial Lockout Training',
    frequency: 'Before first lockout assignment',
    details: 'All workers must receive lockout training before they are authorized to perform lockout. Training must cover the employer\'s energy control program, specific procedures, and hands-on demonstration.',
  },
  {
    topic: 'Retraining / Refresher',
    frequency: 'Annually (or when procedures change)',
    details: 'All authorized workers must be retrained at least annually. Retraining is also required when: new equipment is installed, procedures change, audits reveal deficiencies, or after a near-miss or incident.',
  },
  {
    topic: 'Procedure Audits',
    frequency: 'At least annually per CSA Z460',
    details: 'A qualified person (not the regular procedure user) must observe and audit lockout procedures for each piece of equipment at least once per year.',
  },
  {
    topic: 'Record Keeping',
    frequency: 'Ongoing — retain per company policy',
    details: 'Employers must maintain records of: worker training (dates, content, trainer), procedure audits, lock assignments, incident reports, and procedure reviews.',
  },
  {
    topic: 'Procedure Review',
    frequency: 'Annually or after any incident',
    details: 'All energy control procedures must be reviewed at least annually. Reviews must also occur after any lockout-related incident, near-miss, or equipment modification.',
  },
]

interface QuizQuestion {
  question: string
  answer: boolean
  explanation: string
}

const quizQuestions: QuizQuestion[] = [
  {
    question: 'A supervisor can remove another worker\'s lock at any time as long as they have a master key.',
    answer: false,
    explanation: 'Only the worker who applied the lock may remove it under normal circumstances. A supervisor may only authorize removal as an emergency procedure when the worker cannot be contacted, and it must be documented per O. Reg. 854, s. 161.',
  },
  {
    question: 'After locking out a VFD, you must wait for the DC bus capacitors to discharge before testing — this can take 15 minutes or more.',
    answer: true,
    explanation: 'VFD DC bus capacitors can hold 600-700VDC for 15+ minutes after input power is removed. Always wait the manufacturer-specified time and verify with a rated voltmeter before working on the drive.',
  },
  {
    question: 'A danger tag alone (without a lock) is an acceptable lockout device when personal locks are not available.',
    answer: false,
    explanation: 'Tags alone are NEVER acceptable as a substitute for locks. CSA Z460 and O. Reg. 854 require physical locks for energy isolation. Tags supplement locks — they do not replace them.',
  },
  {
    question: 'In Ontario mines, every worker performing maintenance must apply their own personal lock, even if another worker has already locked out the same equipment.',
    answer: true,
    explanation: 'O. Reg. 854, s. 160 requires every worker to apply their own personal lock. No worker shall rely on another person\'s lock for their own protection. Use multi-lock hasps or lock boxes for multiple workers.',
  },
  {
    question: 'When verifying zero energy on a locked-out circuit, a non-contact voltage detector (tick tracer) is sufficient as the primary testing method.',
    answer: false,
    explanation: 'A non-contact voltage detector should never be used as the primary verification method. You must use a properly rated contact voltage tester and perform the live-dead-live test method. Non-contact detectors can give false negatives and false positives.',
  },
]

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
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
  borderRadius: 'var(--radius)', padding: 14, lineHeight: 1.5,
}
const sectionLabel: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--primary)',
  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
}
const criticalBorder = '4px solid #ff3c3c'

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LOTOPage() {
  const [tab, setTab] = useState<TabKey>('procedure')

  /* Procedure tab: track which steps are expanded */
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  const toggleStep = (num: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num); else next.add(num)
      return next
    })
  }

  /* Energy tab: track which categories are expanded */
  const [expandedEnergy, setExpandedEnergy] = useState<Set<string>>(new Set())
  const toggleEnergy = (type: string) => {
    setExpandedEnergy(prev => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type); else next.add(type)
      return next
    })
  }

  /* Mining tab: interactive checklist */
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const toggleChecked = (i: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  /* Mining tab: expanded equipment */
  const [expandedEquip, setExpandedEquip] = useState<Set<string>>(new Set())
  const toggleEquip = (eq: string) => {
    setExpandedEquip(prev => {
      const next = new Set(prev)
      if (next.has(eq)) next.delete(eq); else next.add(eq)
      return next
    })
  }

  /* Devices tab: expanded categories */
  const [expandedDevices, setExpandedDevices] = useState<Set<string>>(new Set())
  const toggleDevice = (cat: string) => {
    setExpandedDevices(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat); else next.add(cat)
      return next
    })
  }

  /* Quiz state */
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState<boolean | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const handleQuiz = (answer: boolean) => {
    if (quizAnswer !== null) return
    setQuizAnswer(answer)
    if (answer === quizQuestions[quizIndex].answer) {
      setQuizScore(prev => prev + 1)
    }
  }

  const nextQuiz = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1)
      setQuizAnswer(null)
    } else {
      setQuizComplete(true)
    }
  }

  const resetQuiz = () => {
    setQuizIndex(0)
    setQuizAnswer(null)
    setQuizScore(0)
    setQuizComplete(false)
  }

  return (
    <>
      <Header title="Lockout / Tagout" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tab Pills */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button key={t.key} style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  TAB 1: PROCEDURE                                            */}
        {/* ============================================================ */}
        {tab === 'procedure' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={sectionLabel}>Step-by-Step LOTO Procedure</div>
            <div style={{
              ...card,
              background: 'rgba(255,60,60,0.08)',
              borderLeft: criticalBorder,
              fontSize: 13, color: '#ff6b6b',
            }}>
              <strong style={{ color: '#ff3c3c' }}>SAFETY FIRST:</strong> Lockout/Tagout is the
              single most important safety procedure. More than 10% of serious workplace injuries
              involve inadequate energy isolation. Follow EVERY step — shortcuts kill.
            </div>

            {procedureSteps.map(step => {
              const isOpen = expandedSteps.has(step.num)
              return (
                <button
                  key={step.num}
                  onClick={() => toggleStep(step.num)}
                  style={{
                    ...card,
                    borderLeft: step.critical ? criticalBorder : '4px solid var(--primary)',
                    cursor: 'pointer', textAlign: 'left',
                    width: '100%', fontFamily: 'var(--font-sans)',
                  }}
                >
                  {/* Step header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    minHeight: 40,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700,
                      fontSize: 20, minWidth: 32,
                      color: step.critical ? '#ff3c3c' : 'var(--primary)',
                    }}>
                      {step.num}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 15, fontWeight: 700,
                        color: step.critical ? '#ff3c3c' : 'var(--text)',
                      }}>
                        {step.title}
                        {step.critical && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: '#fff',
                            background: '#ff3c3c', borderRadius: 4,
                            padding: '2px 6px', marginLeft: 8, verticalAlign: 'middle',
                          }}>
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: 13, color: 'var(--text-secondary)', marginTop: 2,
                      }}>
                        {step.summary}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 18, color: 'var(--text-secondary)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                      {'\▼'}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div style={{ marginTop: 12, paddingLeft: 42 }}
                      onClick={e => e.stopPropagation()}>
                      <div style={{
                        fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
                        textTransform: 'uppercase', marginBottom: 6,
                      }}>
                        Detailed Steps
                      </div>
                      {step.details.map((d, i) => (
                        <div key={i} style={{
                          fontSize: 13, color: 'var(--text)', padding: '4px 0',
                          borderBottom: i < step.details.length - 1 ? '1px solid var(--divider)' : 'none',
                          lineHeight: 1.5,
                        }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 700, marginRight: 6 }}>
                            {'\•'}
                          </span>
                          {d}
                        </div>
                      ))}

                      {step.miningNotes && (
                        <>
                          <div style={{
                            fontSize: 12, fontWeight: 700, color: '#ffd700',
                            textTransform: 'uppercase', marginTop: 12, marginBottom: 6,
                          }}>
                            Mining-Specific Notes
                          </div>
                          {step.miningNotes.map((n, i) => (
                            <div key={i} style={{
                              fontSize: 13, color: '#ffd700', padding: '4px 0',
                              background: 'rgba(255,215,0,0.05)',
                              borderRadius: 'var(--radius-sm)',
                              paddingLeft: 8, marginBottom: 2, lineHeight: 1.5,
                            }}>
                              <span style={{ marginRight: 6 }}>{'\⛏'}</span>
                              {n}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: ENERGY SOURCES                                       */}
        {/* ============================================================ */}
        {tab === 'energy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={sectionLabel}>Energy Source Identification & Isolation</div>
            <div style={{
              ...card,
              background: 'rgba(255,60,60,0.08)',
              borderLeft: criticalBorder,
              fontSize: 13, color: '#ff6b6b',
            }}>
              <strong style={{ color: '#ff3c3c' }}>IDENTIFY ALL SOURCES:</strong> The most common
              cause of lockout failures is missing an energy source. Walk down the equipment and
              systematically check every category below. Document every source before applying locks.
            </div>

            {energySources.map(es => {
              const isOpen = expandedEnergy.has(es.type)
              return (
                <div key={es.type} style={{
                  ...card,
                  borderLeft: `4px solid ${es.color}`,
                  padding: 0, overflow: 'hidden',
                }}>
                  <button
                    onClick={() => toggleEnergy(es.type)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: 14, minHeight: 56,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{es.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: es.color }}>
                        {es.type}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {es.sources.length} source{es.sources.length > 1 ? 's' : ''} — tap to {isOpen ? 'collapse' : 'expand'}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 18, color: 'var(--text-secondary)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                      {'\▼'}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {es.sources.map((src, i) => (
                        <div key={i} style={{
                          background: 'var(--input-bg)',
                          borderRadius: 'var(--radius-sm)',
                          padding: 12, border: '1px solid var(--divider)',
                        }}>
                          <div style={{
                            fontSize: 14, fontWeight: 700, color: 'var(--text)',
                            marginBottom: 8,
                          }}>
                            {src.name}
                          </div>
                          <div style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase' }}>
                              How to Isolate:
                            </span>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>
                              {src.isolation}
                            </div>
                          </div>
                          <div style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>
                              How to Verify Zero Energy:
                            </span>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>
                              {src.verification}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#ff3c3c', textTransform: 'uppercase' }}>
                              Common Mistakes:
                            </span>
                            <div style={{ fontSize: 13, color: '#ff6b6b', marginTop: 2, lineHeight: 1.5 }}>
                              {src.mistakes}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: MINING LOTO                                          */}
        {/* ============================================================ */}
        {tab === 'mining' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Ontario Regs */}
            <div>
              <div style={sectionLabel}>Ontario O. Reg. 854 — Key Requirements</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ontarioRegs.map((reg, i) => (
                  <div key={i} style={{
                    ...card,
                    borderLeft: reg.critical ? criticalBorder : '4px solid var(--primary)',
                  }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700,
                      color: reg.critical ? '#ff3c3c' : 'var(--text)',
                    }}>
                      {reg.title}
                      {reg.critical && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#fff',
                          background: '#ff3c3c', borderRadius: 4,
                          padding: '2px 6px', marginLeft: 8, verticalAlign: 'middle',
                        }}>
                          CRITICAL
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: 'var(--primary)',
                      fontFamily: 'var(--font-mono)', marginTop: 4, marginBottom: 8,
                    }}>
                      {reg.ref}
                    </div>
                    {reg.items.map((item, j) => (
                      <div key={j} style={{
                        fontSize: 13, color: 'var(--text-secondary)', padding: '3px 0',
                        lineHeight: 1.5,
                      }}>
                        <span style={{ color: 'var(--primary)', marginRight: 6 }}>{'\•'}</span>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Group Lockout */}
            <div>
              <div style={sectionLabel}>Group Lockout Procedures</div>
              <div style={{
                ...card,
                borderLeft: '4px solid var(--primary)',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  Shift Lockout (Transfer of Locks)
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                  When lockout spans a shift change, the incoming worker MUST apply their lock BEFORE
                  the outgoing worker removes theirs. Equipment is never left without a lock applied.
                  Use a lock box for multi-worker shift transfers.
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  Multi-Craft Lockout
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                  When multiple trades (electrical, mechanical, instrumentation) work on the same
                  equipment: use a group lock box. The lead worker or supervisor applies locks on all
                  isolation points and places the keys in the lock box. Each worker applies their
                  personal lock to the lock box.
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  Underground vs Surface Requirements
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Underground lockout adds considerations: limited egress, poor visibility,
                  ventilation impacts, communication challenges. All lockouts underground must be
                  logged and communicated to the shift boss. Surface operations may have more complex
                  group lockouts due to larger equipment and more energy sources. High voltage switching
                  orders (required for voltages above 750V) must be written, authorized, and signed.
                </div>
              </div>
            </div>

            {/* Trailing Cable & HV */}
            <div>
              <div style={sectionLabel}>Trailing Cable & High Voltage Procedures</div>
              <div style={{
                ...card,
                borderLeft: '4px solid #ffd700',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffd700', marginBottom: 8 }}>
                  Trailing Cable Disconnect
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                  {'\•'} Shut down equipment using normal controls.{'\n'}
                  {'\•'} Unplug trailing cable from the receptacle.{'\n'}
                  {'\•'} Lock the receptacle in the OFF/disconnected position.{'\n'}
                  {'\•'} Lock out the power centre breaker feeding the receptacle.{'\n'}
                  {'\•'} For medium voltage cables: follow HV switching orders.{'\n'}
                  {'\•'} Test at the equipment disconnect for zero voltage.
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ff3c3c', marginBottom: 8 }}>
                  High Voltage Switching Orders
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {'\•'} Required for all switching above 750V in Ontario mines.{'\n'}
                  {'\•'} Must be written, step-by-step, and authorized by a competent supervisor.{'\n'}
                  {'\•'} Each step must be checked off as completed, in sequence.{'\n'}
                  {'\•'} Grounding of HV circuits is required after isolation.{'\n'}
                  {'\•'} Live-line tools and rated HV PPE are required during switching.{'\n'}
                  {'\•'} Two-person rule: HV switching always requires a second person present.
                </div>
              </div>
            </div>

            {/* Mining Equipment LOTO */}
            <div>
              <div style={sectionLabel}>Equipment-Specific LOTO Procedures</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {miningEquipment.map(eq => {
                  const isOpen = expandedEquip.has(eq.equipment)
                  return (
                    <button
                      key={eq.equipment}
                      onClick={() => toggleEquip(eq.equipment)}
                      style={{
                        ...card,
                        borderLeft: eq.critical ? criticalBorder : '4px solid var(--primary)',
                        cursor: 'pointer', textAlign: 'left',
                        width: '100%', fontFamily: 'var(--font-sans)',
                        padding: isOpen ? 14 : 14,
                      }}
                    >
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        minHeight: 32,
                      }}>
                        <div style={{
                          fontSize: 14, fontWeight: 700,
                          color: eq.critical ? '#ff3c3c' : 'var(--text)',
                        }}>
                          {eq.equipment}
                          {eq.critical && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, color: '#fff',
                              background: '#ff3c3c', borderRadius: 4,
                              padding: '2px 6px', marginLeft: 8, verticalAlign: 'middle',
                            }}>
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <span style={{
                          fontSize: 16, color: 'var(--text-secondary)',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}>
                          {'\▼'}
                        </span>
                      </div>
                      {isOpen && (
                        <div style={{ marginTop: 10 }} onClick={e => e.stopPropagation()}>
                          {eq.steps.map((s, j) => (
                            <div key={j} style={{
                              fontSize: 13, color: 'var(--text-secondary)',
                              padding: '4px 0', lineHeight: 1.5,
                              borderBottom: j < eq.steps.length - 1 ? '1px solid var(--divider)' : 'none',
                            }}>
                              <span style={{
                                fontFamily: 'var(--font-mono)', fontWeight: 700,
                                color: 'var(--primary)', marginRight: 8, fontSize: 12,
                              }}>
                                {j + 1}.
                              </span>
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Interactive Checklist */}
            <div>
              <div style={sectionLabel}>
                Interactive LOTO Checklist
                <span style={{
                  fontSize: 11, fontWeight: 400, color: 'var(--text-secondary)',
                  marginLeft: 8, textTransform: 'none',
                }}>
                  (tap to check off)
                </span>
              </div>
              <div style={{
                ...card,
                padding: 0,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--input-bg)',
                  borderBottom: '1px solid var(--divider)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                    {checkedItems.size} / {miningChecklist.length} completed
                  </span>
                  {checkedItems.size > 0 && (
                    <button
                      onClick={() => setCheckedItems(new Set())}
                      style={{
                        fontSize: 12, color: 'var(--primary)', background: 'transparent',
                        border: 'none', cursor: 'pointer', fontWeight: 700,
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      Reset All
                    </button>
                  )}
                </div>
                {miningChecklist.map((item, i) => {
                  const checked = checkedItems.has(i)
                  return (
                    <button
                      key={i}
                      onClick={() => toggleChecked(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        width: '100%', padding: '12px 14px',
                        minHeight: 56,
                        background: checked ? 'rgba(34,197,94,0.06)' : 'transparent',
                        border: 'none', borderBottom: '1px solid var(--divider)',
                        cursor: 'pointer', textAlign: 'left',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                        border: checked
                          ? '2px solid #22c55e'
                          : item.critical
                            ? '2px solid #ff3c3c'
                            : '2px solid var(--divider)',
                        background: checked ? '#22c55e' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: 16, color: '#fff', fontWeight: 700,
                      }}>
                        {checked ? '\✓' : ''}
                      </div>
                      <span style={{
                        fontSize: 13,
                        color: checked
                          ? '#22c55e'
                          : item.critical
                            ? '#ff3c3c'
                            : 'var(--text)',
                        textDecoration: checked ? 'line-through' : 'none',
                        lineHeight: 1.4,
                      }}>
                        {item.text}
                        {item.critical && !checked && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: '#fff',
                            background: '#ff3c3c', borderRadius: 4,
                            padding: '1px 5px', marginLeft: 6, verticalAlign: 'middle',
                          }}>
                            CRITICAL
                          </span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: DEVICES                                              */}
        {/* ============================================================ */}
        {tab === 'devices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={sectionLabel}>Lockout Devices & Hardware</div>
            <div style={{
              ...card,
              fontSize: 13, color: 'var(--text-secondary)',
              borderLeft: '4px solid var(--primary)',
            }}>
              Select the correct lockout device for each energy isolation point. Using the wrong
              device can result in inadequate isolation. All devices must accommodate a personal
              padlock.
            </div>

            {deviceCategories.map(cat => {
              const isOpen = expandedDevices.has(cat.category)
              return (
                <div key={cat.category} style={{
                  ...card, padding: 0, overflow: 'hidden',
                }}>
                  <button
                    onClick={() => toggleDevice(cat.category)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: 14, minHeight: 56,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
                        {cat.category}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {cat.description.slice(0, 80)}...
                      </div>
                    </div>
                    <span style={{
                      fontSize: 18, color: 'var(--text-secondary)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                      {'\▼'}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 14px 14px',
                      display: 'flex', flexDirection: 'column', gap: 10,
                    }}>
                      <div style={{
                        fontSize: 13, color: 'var(--text-secondary)',
                        lineHeight: 1.5, marginBottom: 4,
                      }}>
                        {cat.description}
                      </div>
                      {cat.devices.map((dev, i) => (
                        <div key={i} style={{
                          background: 'var(--input-bg)',
                          borderRadius: 'var(--radius-sm)',
                          padding: 12, border: '1px solid var(--divider)',
                        }}>
                          <div style={{
                            fontSize: 14, fontWeight: 700, color: 'var(--text)',
                            marginBottom: 6,
                          }}>
                            {dev.name}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
                            {dev.detail}
                          </div>
                          <div style={{
                            fontSize: 12, color: 'var(--primary)',
                            background: 'rgba(255,215,0,0.08)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 10px', lineHeight: 1.5,
                          }}>
                            <strong>Where to Use:</strong> {dev.usage}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 5: REGS & TRAINING                                      */}
        {/* ============================================================ */}
        {tab === 'regs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Regulatory Standards */}
            <div>
              <div style={sectionLabel}>Regulatory Standards</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {regulations.map((reg, i) => (
                  <div key={i} style={card}>
                    <div style={{
                      fontSize: 16, fontWeight: 700, color: 'var(--primary)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {reg.code}
                    </div>
                    <div style={{
                      fontSize: 14, fontWeight: 600, color: 'var(--text)',
                      marginTop: 2, marginBottom: 8,
                    }}>
                      {reg.title}
                    </div>
                    {reg.keyPoints.map((pt, j) => (
                      <div key={j} style={{
                        fontSize: 13, color: 'var(--text-secondary)',
                        padding: '3px 0', lineHeight: 1.5,
                      }}>
                        <span style={{ color: 'var(--primary)', marginRight: 6 }}>{'\•'}</span>
                        {pt}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Worker Roles */}
            <div>
              <div style={sectionLabel}>Authorized vs Affected Workers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {workerRoles.map((wr, i) => (
                  <div key={i} style={{
                    ...card,
                    borderLeft: '4px solid var(--primary)',
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                      {wr.role}
                    </div>
                    <div style={{
                      fontSize: 13, color: 'var(--text-secondary)',
                      marginTop: 4, marginBottom: 8, lineHeight: 1.5,
                    }}>
                      {wr.description}
                    </div>
                    {wr.requirements.map((req, j) => (
                      <div key={j} style={{
                        fontSize: 13, color: 'var(--text-secondary)',
                        padding: '3px 0', lineHeight: 1.5,
                      }}>
                        <span style={{ color: 'var(--primary)', marginRight: 6 }}>{'\•'}</span>
                        {req}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Training Requirements */}
            <div>
              <div style={sectionLabel}>Training & Record Keeping</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {trainingReqs.map((tr, i) => (
                  <div key={i} style={card}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', marginBottom: 6,
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        {tr.topic}
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: '#000',
                        background: 'var(--primary)', borderRadius: 4,
                        padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0,
                        marginLeft: 8,
                      }}>
                        {tr.frequency}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                    }}>
                      {tr.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disciplinary Actions */}
            <div>
              <div style={sectionLabel}>Disciplinary Actions</div>
              <div style={{
                ...card,
                borderLeft: criticalBorder,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ff3c3c', marginBottom: 8 }}>
                  LOTO violations are treated as serious safety offences
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {[
                    'Removing another worker\'s lock — may result in immediate termination.',
                    'Failure to lock out before performing maintenance — written discipline or suspension.',
                    'Using another worker\'s lock or a shared lock — written discipline.',
                    'Not verifying zero energy state — written discipline or suspension.',
                    'Bypassing or defeating a lockout — may result in immediate termination.',
                    'Failure to complete lockout tag properly — verbal or written warning.',
                    'Ministry of Labour fines: up to $100,000 for individuals, $1,500,000 for corporations.',
                    'Criminal charges under C-45 (Westray Bill) possible for gross negligence causing harm.',
                  ].map((item, j) => (
                    <div key={j} style={{ padding: '3px 0' }}>
                      <span style={{ color: '#ff3c3c', marginRight: 6 }}>{'\•'}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Quiz */}
            <div>
              <div style={sectionLabel}>
                Quick Quiz — Test Your LOTO Knowledge
              </div>

              {!quizComplete ? (
                <div style={{
                  ...card,
                  borderLeft: '4px solid var(--primary)',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 12,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Question {quizIndex + 1} of {quizQuestions.length}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                      Score: {quizScore}/{quizIndex + (quizAnswer !== null ? 1 : 0)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: 4, background: 'var(--divider)', borderRadius: 2, marginBottom: 16,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: 'var(--primary)',
                      width: `${((quizIndex + (quizAnswer !== null ? 1 : 0)) / quizQuestions.length) * 100}%`,
                      transition: 'width 0.3s',
                    }} />
                  </div>

                  <div style={{
                    fontSize: 15, fontWeight: 600, color: 'var(--text)',
                    lineHeight: 1.5, marginBottom: 16,
                  }}>
                    "{quizQuestions[quizIndex].question}"
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginBottom: quizAnswer !== null ? 16 : 0 }}>
                    <button
                      onClick={() => handleQuiz(true)}
                      style={{
                        flex: 1, minHeight: 56, borderRadius: 'var(--radius)',
                        fontSize: 16, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        border: quizAnswer !== null
                          ? quizQuestions[quizIndex].answer === true
                            ? '2px solid #22c55e'
                            : quizAnswer === true
                              ? '2px solid #ff3c3c'
                              : '2px solid var(--divider)'
                          : '2px solid var(--divider)',
                        background: quizAnswer !== null
                          ? quizQuestions[quizIndex].answer === true
                            ? 'rgba(34,197,94,0.15)'
                            : quizAnswer === true
                              ? 'rgba(255,60,60,0.15)'
                              : 'var(--surface)'
                          : 'var(--surface)',
                        color: quizAnswer !== null
                          ? quizQuestions[quizIndex].answer === true
                            ? '#22c55e'
                            : quizAnswer === true
                              ? '#ff3c3c'
                              : 'var(--text-secondary)'
                          : 'var(--text)',
                      }}
                    >
                      TRUE
                    </button>
                    <button
                      onClick={() => handleQuiz(false)}
                      style={{
                        flex: 1, minHeight: 56, borderRadius: 'var(--radius)',
                        fontSize: 16, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        border: quizAnswer !== null
                          ? quizQuestions[quizIndex].answer === false
                            ? '2px solid #22c55e'
                            : quizAnswer === false
                              ? '2px solid #ff3c3c'
                              : '2px solid var(--divider)'
                          : '2px solid var(--divider)',
                        background: quizAnswer !== null
                          ? quizQuestions[quizIndex].answer === false
                            ? 'rgba(34,197,94,0.15)'
                            : quizAnswer === false
                              ? 'rgba(255,60,60,0.15)'
                              : 'var(--surface)'
                          : 'var(--surface)',
                        color: quizAnswer !== null
                          ? quizQuestions[quizIndex].answer === false
                            ? '#22c55e'
                            : quizAnswer === false
                              ? '#ff3c3c'
                              : 'var(--text-secondary)'
                          : 'var(--text)',
                      }}
                    >
                      FALSE
                    </button>
                  </div>

                  {quizAnswer !== null && (
                    <>
                      <div style={{
                        fontSize: 13, lineHeight: 1.5, padding: 12,
                        background: quizAnswer === quizQuestions[quizIndex].answer
                          ? 'rgba(34,197,94,0.08)'
                          : 'rgba(255,60,60,0.08)',
                        borderRadius: 'var(--radius-sm)',
                        color: quizAnswer === quizQuestions[quizIndex].answer
                          ? '#22c55e'
                          : '#ff6b6b',
                        marginBottom: 12,
                      }}>
                        <strong>
                          {quizAnswer === quizQuestions[quizIndex].answer
                            ? 'Correct!'
                            : 'Incorrect.'
                          }
                        </strong>{' '}
                        {quizQuestions[quizIndex].explanation}
                      </div>
                      <button
                        onClick={nextQuiz}
                        style={{
                          width: '100%', minHeight: 48, borderRadius: 'var(--radius)',
                          background: 'var(--primary)', color: '#000',
                          fontSize: 14, fontWeight: 700, border: 'none',
                          cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {quizIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div style={{
                  ...card,
                  borderLeft: '4px solid var(--primary)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: 48, fontWeight: 700,
                    color: quizScore >= 4 ? '#22c55e' : quizScore >= 3 ? '#ffd700' : '#ff3c3c',
                    marginBottom: 8,
                  }}>
                    {quizScore}/{quizQuestions.length}
                  </div>
                  <div style={{
                    fontSize: 16, fontWeight: 700, color: 'var(--text)',
                    marginBottom: 4,
                  }}>
                    {quizScore === 5
                      ? 'Perfect Score!'
                      : quizScore >= 4
                        ? 'Great Job!'
                        : quizScore >= 3
                          ? 'Good — Review the missed topics.'
                          : 'Review Required — Study the LOTO procedures above.'
                    }
                  </div>
                  <div style={{
                    fontSize: 13, color: 'var(--text-secondary)',
                    marginBottom: 16,
                  }}>
                    {quizScore < 5 && 'LOTO knowledge saves lives. Review any missed topics in the tabs above.'}
                  </div>
                  <button
                    onClick={resetQuiz}
                    style={{
                      minHeight: 48, padding: '0 32px', borderRadius: 'var(--radius)',
                      background: 'var(--primary)', color: '#000',
                      fontSize: 14, fontWeight: 700, border: 'none',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </>
  )
}
