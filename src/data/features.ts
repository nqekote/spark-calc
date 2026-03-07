/* ══════════════════════════════════════════════
   Shared feature catalogue & category metadata
   Used by HomePage + GlobalSearch
   ══════════════════════════════════════════════ */

export interface Feature {
  to: string
  title: string
  icon: string
  category: string
  subtitle?: string
  /** Extra search keywords (not displayed) */
  keywords?: string
}

export const allFeatures: Feature[] = [
  // ── Calculators ──
  { to: '/electrical/ohms-law', title: "Ohm's Law", icon: 'Ω', category: 'Calculators', subtitle: 'V, I, R', keywords: 'voltage current resistance' },
  { to: '/electrical/power', title: 'Power Calc', icon: '⚡', category: 'Calculators', subtitle: 'Watts & VA', keywords: 'watt kva kw single three phase' },
  { to: '/electrical/voltage-drop', title: 'Voltage Drop', icon: '↓', category: 'Calculators', subtitle: 'Wire loss', keywords: 'vdrop wire length distance' },
  { to: '/electrical/power-factor', title: 'Power Factor', icon: '∼', category: 'Calculators', subtitle: 'PF correction', keywords: 'capacitor pf kvar' },
  { to: '/electrical/short-circuit', title: 'Short Circuit', icon: '💥', category: 'Calculators', subtitle: 'Fault current', keywords: 'fault aic kaic scc' },
  { to: '/electrical/lighting', title: 'Lighting', icon: '💡', category: 'Calculators', subtitle: 'Lux & lumens', keywords: 'lux lumens fixture foot candle' },
  { to: '/electrical/transformer-sizing', title: 'Transformer', icon: '⎔', category: 'Calculators', subtitle: 'kVA sizing', keywords: 'kva transformer size' },
  { to: '/electrical/disconnect', title: 'Disconnect', icon: '⎓', category: 'Calculators', subtitle: 'HP-rated switch', keywords: 'disconnect switch hp horsepower' },
  { to: '/electrical/generator', title: 'Generator', icon: '⚡', category: 'Calculators', subtitle: 'Backup power', keywords: 'genset backup standby' },
  { to: '/reference/box-fill', title: 'Box Fill', icon: '▣', category: 'Calculators', subtitle: 'Junction box', keywords: 'junction box fill conductor' },
  { to: '/reference/residential', title: 'Residential', icon: '⌂', category: 'Calculators', subtitle: 'Demand load', keywords: 'dwelling demand load service' },
  { to: '/electrical/oc-coordination', title: 'OC Coordination', icon: '📊', category: 'Calculators', subtitle: 'Selectivity', keywords: 'breaker fuse selectivity coordination' },
  { to: '/electrical/transformer-loading', title: 'Xfmr Loading', icon: '🔥', category: 'Calculators', subtitle: 'Loading & life', keywords: 'transformer loading derating life' },
  { to: '/electrical/ground-fault', title: 'Ground Fault', icon: '⏚', category: 'Calculators', subtitle: 'GF & NGR calc', keywords: 'ground fault ngr neutral grounding resistor' },

  // ── Wire & Cable ──
  { to: '/wire/ampacity', title: 'Ampacity', icon: 'ᴬ', category: 'Wire & Cable', subtitle: 'Wire tables', keywords: 'ampacity table 2 4 copper aluminum' },
  { to: '/wire/sizing', title: 'Wire Sizing', icon: '⌸', category: 'Wire & Cable', subtitle: 'Conductor sizing', keywords: 'wire size conductor awg kcmil' },
  { to: '/wire/grounding', title: 'Grounding', icon: '⏚', category: 'Wire & Cable', subtitle: 'Table 17', keywords: 'ground bonding table 17' },
  { to: '/wire/cable-types', title: 'Cable Types', icon: '🔌', category: 'Wire & Cable', subtitle: 'NMD, TECK, AC90', keywords: 'nmd90 teck90 ac90 shd cable type' },
  { to: '/wire/teck-cable', title: 'TECK90 Guide', icon: '🔩', category: 'Wire & Cable', subtitle: 'Specs & glands', keywords: 'teck cable gland connector' },
  { to: '/wire/ocp-transformer', title: 'Transformer OCP', icon: '⍗', category: 'Wire & Cable', subtitle: 'Protection', keywords: 'overcurrent protection transformer' },
  { to: '/wire/ocp-feeder', title: 'Feeder OCP', icon: '⎓', category: 'Wire & Cable', subtitle: 'Protection', keywords: 'overcurrent feeder breaker fuse' },
  { to: '/wire/torque-specs', title: 'Torque Specs', icon: '🔧', category: 'Wire & Cable', subtitle: 'Termination', keywords: 'torque lug termination' },
  { to: '/conduit/raceway-spacing', title: 'Raceway Spacing', icon: '⎓', category: 'Wire & Cable', subtitle: 'Support dist.', keywords: 'raceway support spacing strap' },
  { to: '/conduit/burial-depths', title: 'Burial Depths', icon: '⬇', category: 'Wire & Cable', subtitle: 'Min. cover', keywords: 'burial depth underground cover' },
  { to: '/conduit/cable-tray', title: 'Cable Tray', icon: '▤', category: 'Wire & Cable', subtitle: 'Tray fill', keywords: 'cable tray fill teck' },
  { to: '/conduit/fill', title: 'Conduit Fill', icon: '◎', category: 'Wire & Cable', subtitle: 'Fill calcs', keywords: 'conduit fill emt rigid pvc' },
  { to: '/conduit/bending', title: 'EMT Bending', icon: '⌒', category: 'Wire & Cable', subtitle: 'Offsets & saddles', keywords: 'bending offset saddle kick stub' },
  { to: '/wire/colors', title: 'Wire Colors', icon: '🎨', category: 'Wire & Cable', subtitle: 'Color codes', keywords: 'wire color code phase neutral ground' },

  // ── Motors & Drives ──
  { to: '/motors/flc', title: 'Motor FLC', icon: '⚙', category: 'Motors & Drives', subtitle: 'Current tables', keywords: 'flc full load current motor table' },
  { to: '/motors/branch', title: 'Motor Branch', icon: '⑂', category: 'Motors & Drives', subtitle: 'Circuit sizing', keywords: 'motor branch circuit wire breaker' },
  { to: '/motors/ocp', title: 'Motor OCP', icon: '⛔', category: 'Motors & Drives', subtitle: 'Protection', keywords: 'motor overcurrent protection breaker fuse' },
  { to: '/motors/starters', title: 'Motor Starters', icon: '▶', category: 'Motors & Drives', subtitle: 'DOL, Y/Δ, VFD', keywords: 'starter dol star delta soft start' },
  { to: '/motors/vfd', title: 'VFD Reference', icon: '∿', category: 'Motors & Drives', subtitle: 'Params & faults', keywords: 'vfd drive variable frequency inverter' },
  { to: '/motors/medium-voltage', title: 'Medium Voltage', icon: '⚡', category: 'Motors & Drives', subtitle: 'MV systems', keywords: 'medium voltage 4160 mv switchgear' },

  // ── Safety ──
  { to: '/safety/arc-flash', title: 'Arc Flash', icon: '⚡', category: 'Safety', subtitle: 'PPE & boundaries', keywords: 'arc flash ppe cal/cm boundary' },
  { to: '/safety/loto', title: 'Lockout/Tagout', icon: '🔒', category: 'Safety', subtitle: 'LOTO procedures', keywords: 'lockout tagout loto energy isolation' },
  { to: '/mining/safety', title: 'Mining Safety', icon: '⚠️', category: 'Safety', subtitle: 'PPE, grounding', keywords: 'mining safety ppe grounding' },
  { to: '/mining/hazardous-areas', title: 'Hazardous Areas', icon: '💨', category: 'Safety', subtitle: 'Zone classify', keywords: 'hazardous area zone class division' },
  { to: '/safety/training', title: 'CSA Z462', icon: '🎓', category: 'Safety', subtitle: 'Safety training', keywords: 'csa z462 training shock' },

  // ── Reference ──
  { to: '/reference/formulas', title: 'Formulas', icon: '📝', category: 'Reference', subtitle: 'Cheat sheet', keywords: 'formula cheat sheet equations' },
  { to: '/reference/cec', title: 'CEC Tables', icon: '📖', category: 'Reference', subtitle: 'Code reference', keywords: 'cec code table canadian electrical' },
  { to: '/reference/code-requirements', title: 'CEC by Task', icon: '📜', category: 'Reference', subtitle: 'Rules by job', keywords: 'code requirement rule task disconnect' },
  { to: '/reference/cec-lookup', title: 'CEC Code Lookup', icon: '⚡', category: 'Reference', subtitle: 'Smart search & trees', keywords: 'cec code lookup search rule decision tree motor wire grounding' },
  { to: '/reference/electrical-symbols', title: 'Symbols', icon: '🔌', category: 'Reference', subtitle: 'Schematics', keywords: 'symbol schematic one-line drawing' },
  { to: '/reference/unit-converter', title: 'Converter', icon: '🔄', category: 'Reference', subtitle: 'AWG↔mm²', keywords: 'convert awg mm celsius fahrenheit' },
  { to: '/reference/troubleshooting', title: 'Troubleshoot', icon: '🔍', category: 'Reference', subtitle: 'Fault finding', keywords: 'troubleshoot fault finding diagnosis' },
  { to: '/reference/multimeter', title: 'Multimeter', icon: '📏', category: 'Reference', subtitle: 'Usage guide', keywords: 'multimeter dmm fluke meter' },
  { to: '/reference/control-circuits', title: 'Control Circuits', icon: '⭡', category: 'Reference', subtitle: 'Schematics', keywords: 'control circuit relay contactor schematic' },
  { to: '/reference/plc-basics', title: 'PLC Basics', icon: '🧠', category: 'Reference', subtitle: 'Ladder logic', keywords: 'plc ladder logic input output' },
  { to: '/reference/instrumentation', title: 'Instrumentation', icon: '📡', category: 'Reference', subtitle: '4-20mA, HART', keywords: 'instrumentation 4-20 rtd thermocouple hart' },
  { to: '/reference/power-quality', title: 'Power Quality', icon: '📈', category: 'Reference', subtitle: 'Harmonics/THD', keywords: 'harmonic thd k-factor power quality' },
  { to: '/electrical/gfci-afci', title: 'GFCI / AFCI', icon: '🛡', category: 'Reference', subtitle: 'Protection', keywords: 'gfci afci ground fault arc' },
  { to: '/reference/battery-ups', title: 'Battery & UPS', icon: '🔋', category: 'Reference', subtitle: 'UPS systems', keywords: 'battery ups uninterruptible power' },
  { to: '/reference/solar-renewable', title: 'Solar & PV', icon: '☀', category: 'Reference', subtitle: 'PV systems', keywords: 'solar pv photovoltaic inverter' },
  { to: '/reference/emergency-power', title: 'Emergency Power', icon: '🚨', category: 'Reference', subtitle: 'ATS & gensets', keywords: 'emergency ats transfer switch generator' },
  { to: '/reference/protective-relays', title: 'Protective Relays', icon: '⚡', category: 'Reference', subtitle: 'ANSI & settings', keywords: 'relay ansi 50 51 overcurrent' },
  { to: '/reference/switchgear', title: 'Switchgear', icon: '🔧', category: 'Reference', subtitle: 'MV/LV types', keywords: 'switchgear mv lv breaker racking' },
  { to: '/reference/portable-substation', title: 'Portable Subs', icon: '⎔', category: 'Reference', subtitle: 'Install & maint.', keywords: 'portable substation mine mobile' },

  // ── Installation Guides ──
  { to: '/reference/grounding-systems', title: 'Grounding Systems', icon: '⏚', category: 'Installation Guides', subtitle: 'HRG, testing', keywords: 'grounding hrg solidly ground test' },
  { to: '/reference/fire-alarm', title: 'Fire Alarm', icon: '🔔', category: 'Installation Guides', subtitle: 'Wiring & inspect', keywords: 'fire alarm smoke detector wiring' },
  { to: '/reference/wiring-methods', title: 'Wiring Methods', icon: '🔧', category: 'Installation Guides', subtitle: 'EMT, TECK, burial', keywords: 'wiring method emt rigid teck burial' },
  { to: '/reference/conductor-properties', title: 'Conductors', icon: '🧵', category: 'Installation Guides', subtitle: 'AWG, derating', keywords: 'conductor properties awg derating resistance' },
  { to: '/reference/industrial-comms', title: 'Industrial Comms', icon: '📡', category: 'Installation Guides', subtitle: 'Modbus, Ethernet', keywords: 'modbus ethernet rs485 industrial communication' },
  { to: '/reference/testing-guide', title: 'Hi-Pot & Megger', icon: '📏', category: 'Installation Guides', subtitle: 'IR, PI, hi-pot', keywords: 'hipot megger insulation resistance testing' },

  // ── Mining ──
  { to: '/mining/power', title: 'Mine Power', icon: '⛏', category: 'Mining', subtitle: 'Equipment & volts', keywords: 'mine power equipment shovel drill' },
  { to: '/mining/cable-tray', title: 'Mine Cable Tray', icon: '▤', category: 'Mining', subtitle: 'TECK90 tray fill', keywords: 'mine cable tray teck fill' },

  // ── Tools ──
  { to: '/materials', title: 'Material Lists', icon: '📋', category: 'Tools', subtitle: 'Job tracking', keywords: 'material list job parts' },
  { to: '/tools/panel-schedule', title: 'Panel Schedule', icon: '📊', category: 'Tools', subtitle: 'Panel builder', keywords: 'panel schedule breaker circuit' },
  { to: '/tools/hour-tracker', title: 'Hour Tracker', icon: '⏱', category: 'Tools', subtitle: 'Apprentice hrs', keywords: 'hour tracker apprentice log' },
  { to: '/tools/exam-prep', title: 'Exam Prep', icon: '🎓', category: 'Tools', subtitle: '309A Exam Practice', keywords: 'exam prep quiz 309a certification practice test study flashcard multiple choice spaced repetition' },
  { to: '/tools/single-line', title: 'Single-Line', icon: '─', category: 'Tools', subtitle: 'Diagram builder', keywords: 'single line diagram one-line builder' },
  { to: '/tools/field-notes', title: 'Field Notes', icon: '📝', category: 'Tools', subtitle: 'On-site journal', keywords: 'notes journal memo field site' },
]

export const categoryOrder = [
  'Calculators', 'Wire & Cable', 'Motors & Drives', 'Safety',
  'Reference', 'Installation Guides', 'Mining', 'Tools',
]

export const spotlightRoutes = [
  '/wire/teck-cable',
  '/safety/loto',
  '/reference/code-requirements',
  '/motors/vfd',
  '/reference/troubleshooting',
  '/safety/arc-flash',
]

/** Category accent colors (CSS variables) */
export const categoryAccents: Record<string, string> = {
  Calculators: 'var(--accent-calc)',
  'Wire & Cable': 'var(--accent-wire)',
  'Motors & Drives': 'var(--accent-motor)',
  Safety: 'var(--accent-safety)',
  Reference: 'var(--accent-ref)',
  Mining: 'var(--accent-mining)',
  'Installation Guides': 'var(--accent-install)',
  Tools: 'var(--accent-tools)',
}

/** Category background tints */
export const categoryBgs: Record<string, string> = {
  Calculators: 'rgba(255,107,44,0.06)',
  'Wire & Cable': 'rgba(59,130,246,0.06)',
  'Motors & Drives': 'rgba(16,185,129,0.06)',
  Safety: 'rgba(244,63,94,0.06)',
  Reference: 'rgba(168,85,247,0.06)',
  Mining: 'rgba(245,158,11,0.06)',
  'Installation Guides': 'rgba(6,182,212,0.06)',
  Tools: 'rgba(99,102,241,0.06)',
}
