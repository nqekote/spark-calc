import type { TroubleshootingSection } from './troubleshootingTypes'

/* ================================================================== */
/*  TAB 1: SYMPTOMS  (NEW — field-first entry point)                   */
/* ================================================================== */

export const symptomSections: TroubleshootingSection[] = [
  {
    heading: 'No Power at Equipment',
    items: [
      {
        title: 'Systematic Diagnosis (6-Step)',
        severity: 'warning',
        steps: [
          'Verify your tester on a KNOWN live source first — never trust a meter that hasn\'t been proven',
          'Check the main disconnect/breaker at the equipment — is it tripped or turned off? Look for a trip indicator flag',
          'Check upstream supply: MCC bucket, panel breaker, or distribution fuse — measure voltage at the line side',
          'If voltage present on line side but not load side → the device itself has tripped or failed. Check fuses, breaker mechanism',
          'If no voltage on line side → continue tracing upstream. Check each distribution point: switchgear, substation, utility feed',
          'Once power is confirmed at one point but missing at the next → the fault is in the cable or connection between those two points. Megger the cable',
        ],
        notes: 'In mining, long cable runs mean multiple potential failure points. The key is systematic isolation: find where power stops. Cross-ref: Motors tab for motor-specific, Cables tab for cable fault finding.',
      },
    ],
  },
  {
    heading: 'Intermittent Power Loss',
    items: [
      {
        title: 'Correlation Checks',
        severity: 'warning',
        steps: [
          'Correlate with LOAD — does it happen when specific equipment starts? (inrush causing voltage dip or breaker trip)',
          'Correlate with WEATHER — rain, snow, extreme cold or heat? (moisture ingress, thermal expansion loosening connections)',
          'Correlate with TIME — same time of day? (utility switching, peak demand, shift change loads)',
          'Correlate with VIBRATION — near crushers, conveyors, blasting? (loose connections, splice degradation)',
          'Check for thermal cycling — equipment works cold, fails when hot (thermal overload, VFD derating, high-resistance joint)',
          'Check for wind/movement — trailing cable flex points, overhead line sway, coupler stress',
        ],
        notes: 'Intermittent faults are the hardest to find. Install a power logger (7-day minimum recording) to capture the event with timestamp. Cross-reference with operations log.',
      },
      {
        title: 'Mining-Specific Intermittent Causes',
        subItems: [
          { label: 'Splice Degradation', detail: 'Trailing cable splices flex and degrade over time. Resistance increases at the joint → heats under load → opens up → cools → reconnects. Classic intermittent. Megger won\'t always catch it — load test or TDR needed.', color: '#ff8c00' },
          { label: 'Coupler Wear', detail: 'Mine-duty couplers (e.g., Crouse-Hinds, Appleton) take abuse. Worn or corroded pins cause intermittent contact. Inspect all pins and sockets. Look for heat discoloration. Replace worn couplers immediately.', color: '#ff8c00' },
          { label: 'Cable Reel Issues', detail: 'Cable reel slip rings and brushes can cause intermittent supply to shovels and draglines. Check brush condition, spring tension, and ring surface. Carbon dust buildup can cause tracking.', color: 'var(--primary)' },
          { label: 'Ground Fault Relay Sensitivity', detail: 'Intermittent ground faults (moisture, flexing cable) can trip GF relays. If the relay resets and equipment runs, the fault is still there. Find it before it becomes a bolted fault.', color: '#ff3c3c' },
        ],
      },
    ],
  },
  {
    heading: 'Breaker Keeps Tripping',
    items: [
      {
        title: 'Trip Pattern Interpretation',
        severity: 'warning',
        table: {
          headers: ['Trip Pattern', 'Likely Cause', 'Action'],
          rows: [
            ['Trips instantly on close', 'Bolted short circuit or ground fault downstream', 'Do NOT re-close. Megger cable and load. Find and repair fault.'],
            ['Trips after 5–30 seconds', 'Overload — load exceeds breaker rating', 'Measure running amps. Check for mechanical binding, overloaded circuit.'],
            ['Trips after minutes/hours', 'Thermal overload — marginal overload or high ambient', 'Check load %, ambient temp, breaker ventilation. May need upsizing.'],
            ['Trips at random intervals', 'Intermittent fault — arcing, loose connection, moisture', 'Install power logger. Check all connections. Megger when tripped.'],
            ['Trips only on motor start', 'Inrush exceeds instantaneous trip — motor or starter issue', 'Check starter type, verify motor-rated breaker, inspect motor windings.'],
            ['Trips during specific operation', 'Load spike during process event', 'Clamp amps during the specific operation. May need soft starter or VFD.'],
          ],
        },
        notes: 'Never repeatedly re-close a breaker that trips instantly. Each re-close puts full fault current through the system, damaging cable insulation and equipment. Find the fault first.',
      },
    ],
  },
  {
    heading: 'Equipment Overheating',
    items: [
      {
        title: 'Temperature Thresholds',
        table: {
          headers: ['Component', 'Normal Range', 'Investigate', 'Critical'],
          rows: [
            ['Motor winding (Class B)', '< 130\u00B0C', '130\u2013145\u00B0C', '> 155\u00B0C'],
            ['Motor winding (Class F)', '< 155\u00B0C', '155\u2013165\u00B0C', '> 180\u00B0C'],
            ['Motor bearing', '< 70\u00B0C', '70\u201385\u00B0C', '> 95\u00B0C'],
            ['Cable termination', '< 60\u00B0C', '60\u201375\u00B0C (or \u039420\u00B0C above similar)', '> 90\u00B0C'],
            ['Breaker/fuse clip', '< 50\u00B0C', '50\u201370\u00B0C (or \u039415\u00B0C above similar)', '> 90\u00B0C'],
            ['Bus bar connection', '< 50\u00B0C', '50\u201370\u00B0C (or \u039415\u00B0C)', '> 85\u00B0C'],
            ['Transformer (dry)', '< 120\u00B0C', '120\u2013140\u00B0C', '> 150\u00B0C'],
            ['Transformer (oil)', '< 65\u00B0C top oil', '65\u201385\u00B0C', '> 95\u00B0C'],
            ['VFD heatsink', '< 60\u00B0C', '60\u201375\u00B0C', '> 85\u00B0C (auto-derates)'],
          ],
        },
        notes: 'Always compare with similar components under similar loads. A \u0394T (delta-T) between comparable phases is more diagnostic than an absolute temperature.',
      },
    ],
  },
  {
    heading: 'Burning Smell',
    items: [
      {
        title: 'Immediate Response',
        severity: 'critical',
        steps: [
          'STOP — do not energize or continue operating if you smell burning',
          'Identify the AREA — walk toward the smell. Burning insulation has a sharp, acrid chemical smell',
          'De-energize the suspected circuit if safe to do so (do not open switchgear doors under fault)',
          'If smoke or flame visible — evacuate, call emergency, use appropriate extinguisher (Class C for energized)',
          'Once safe and de-energized — inspect for discolored conductors, melted insulation, charred components',
          'Investigate root cause before re-energizing: loose connection, overload, short circuit, ground fault',
        ],
        notes: 'See the "Common Electrical Smells" guide in Tools & Tips tab for specific smell identification. Trust your nose — if something smells wrong, investigate IMMEDIATELY. Electrical fires escalate rapidly.',
      },
    ],
  },
  {
    heading: 'Unusual Noise',
    items: [
      {
        title: 'Sound Diagnosis Guide',
        subItems: [
          { label: '60 Hz Hum (steady)', detail: 'Normal for transformers and AC contactors. If suddenly louder → loose laminations, overloaded transformer, DC offset on supply, or shading coil broken on contactor.', color: 'var(--primary)' },
          { label: 'Buzzing / Arcing', detail: 'Arc across loose connection, pitted contacts, or tracking across contaminated insulation. DANGEROUS — can lead to arc flash. De-energize and inspect contacts, bus, connections.', color: '#ff3c3c' },
          { label: 'Rapid Clicking', detail: 'Contactor or relay chattering — insufficient control voltage, loose coil connection, or control transformer overloaded. Do not leave chattering — contacts will weld. Fix immediately.', color: '#ff8c00' },
          { label: 'Grinding / Rumbling', detail: 'Motor bearing failure — progressing from slight rumble to loud grinding. Stage 1-2: plan replacement. Stage 3-4: replace immediately. See Motors tab bearing section.', color: '#ff8c00' },
          { label: 'Whistling / Whining', detail: 'VFD-driven motors: audible switching noise at carrier frequency. Can reduce by adjusting carrier frequency. High-pitched whine from inductors or chokes is normal but increased whine can mean component stress.', color: 'var(--primary)' },
          { label: 'Popping / Snapping', detail: 'Insulation breakdown or tracking. Can precede catastrophic failure. De-energize immediately and perform insulation testing. Check for contamination, moisture, or physical damage.', color: '#ff3c3c' },
          { label: 'Rhythmic Thumping', detail: 'Motor or pump: possible misalignment, broken rotor bar, or unbalanced load. Frequency matches rotation speed or a multiple. Check coupling, alignment, rotor condition.', color: '#ff8c00' },
        ],
      },
    ],
  },
  {
    heading: 'Lights Flickering',
    items: [
      {
        title: 'Flickering Diagnosis',
        steps: [
          'SCOPE: Is it one fixture, one circuit, one panel, or the whole building/plant?',
          'One fixture → ballast (HID) or driver (LED) failing, loose lamp socket, loose wire at fixture',
          'One circuit → loose neutral or phase connection at panel, shared neutral issue, AFCI nuisance trip',
          'One panel → loose main lugs, loose bus stab, neutral bar loose, transformer tap issue',
          'Whole building → utility voltage sag/swell, large load starting (crusher, conveyor), loose main connections',
          'If flickering correlates with large motor start → voltage sag from inrush. Install soft starter or VFD on offending motor.',
        ],
        notes: 'Check neutral integrity — a loose or broken neutral on a multi-wire branch circuit causes voltage to shift between legs. One leg goes high, the other goes low. This can damage sensitive equipment.',
      },
    ],
  },
  {
    heading: 'Abnormal Voltage Reading',
    items: [
      {
        title: 'Voltage Anomaly Reference',
        subItems: [
          { label: 'Voltage Too High (>110%)', detail: 'Tap set too high on transformer. Lightly loaded circuit (Ferranti effect on long cables). Capacitor bank oversized or load dropped with caps still on. Utility issue. Can damage equipment — investigate.', color: '#ff3c3c' },
          { label: 'Voltage Too Low (<90%)', detail: 'Overloaded transformer or feeder. Long cable run with significant voltage drop. Loose connection adding resistance. Utility brownout. Under-sized conductors for the load.', color: '#ff8c00' },
          { label: 'Voltage Unbalanced (>2%)', detail: 'Unequal single-phase loads on phases. Blown power factor cap on one phase. Loose connection on one phase. Utility supply issue. Use calculator in Power tab.', color: '#ff8c00' },
          { label: 'Voltage Fluctuating', detail: 'Large intermittent loads (welders, crushers, shovels). Loose connection heating/cooling. Generator hunting. Utility flicker. Install power logger to capture events.', color: 'var(--primary)' },
          { label: 'Phantom/Ghost Voltage', detail: 'Reading voltage on a circuit that should be dead. Caused by capacitive coupling from adjacent energized conductors. Common on long parallel cable runs. Use a low-impedance voltage tester (wiggy/solenoid type) to confirm dead.', color: '#ff8c00' },
        ],
        notes: 'CEC and utility standards: nominal voltage should be maintained within +/- 5% at the point of utilization. Investigate any readings outside this range.',
      },
    ],
  },
  {
    heading: 'Motor Won\'t Start — Quick Entry',
    items: [
      {
        title: 'Quick Motor No-Start Checklist',
        severity: 'info',
        steps: [
          'Power present at disconnect? → If NO, see "No Power at Equipment" above',
          'Overload tripped? → Reset once. Trips again? → See Motors tab "Trips on Overload"',
          'Contactor pulling in? → If NO, see Controls tab "Contactor Troubleshooting"',
          'Motor hums but doesn\'t turn? → Check for single-phasing (Motors tab) or mechanical binding',
          'VFD fault? → See Motors tab "VFD Faults" for fault code diagnosis',
        ],
        notes: 'This is a quick entry point. For full motor troubleshooting decision trees, switch to the Motors tab.',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 2: MOTORS  (EXPANDED — 5 new sections added)                   */
/* ================================================================== */

export const motorSections: TroubleshootingSection[] = [
  /* --- Existing content (verbatim) --- */
  {
    heading: 'Motor Won\'t Start',
    items: [
      {
        title: 'Decision Tree',
        severity: 'warning',
        steps: [
          'Check power supply at disconnect — all 3 phases present? Measure L1-L2, L2-L3, L1-L3',
          'Check overloads (thermal or electronic) — tripped? Reset and check amps. If trips again, do NOT keep resetting',
          'Check contactor — coil pulling in? Listen for click. Check contacts for welding or pitting',
          'Check control circuit — start/stop buttons, selector switches, interlocks, safety relays',
          'Check motor windings — measure T1-T2, T2-T3, T1-T3 resistance (should be balanced within 5%)',
          'Check mechanical binding — disconnect motor from load, attempt to rotate shaft by hand',
        ],
        notes: 'Always verify your tester works on a known live source before and after testing a dead circuit.',
      },
      {
        title: 'Expected Winding Resistance Readings',
        subItems: [
          { label: 'Phase-to-Phase', detail: 'Should be balanced within 5%. Typical range: 0.3\u03A9 to 20\u03A9 depending on HP and voltage. Compare all three pairs \u2014 if one reads significantly different, suspect a winding fault.', color: 'var(--primary)' },
          { label: 'Phase-to-Ground (Megger)', detail: 'Minimum acceptable: 1 M\u03A9 per kV of rated voltage + 1 M\u03A9 (e.g., 480V motor = 1.48 M\u03A9 min). New motor should read >100 M\u03A9. Below 5 M\u03A9 = investigate.', color: 'var(--primary)' },
        ],
        table: {
          headers: ['Motor Voltage', 'Test Voltage', 'Min Insulation'],
          rows: [
            ['<1000V', '500V DC', '1 M\u03A9/kV + 1 M\u03A9'],
            ['1000\u20132500V', '1000V DC', '100 M\u03A9'],
            ['2500\u20135000V', '2500V DC', '100 M\u03A9'],
            ['5000\u201313800V', '5000V DC', '1000 M\u03A9'],
          ],
        },
      },
    ],
  },
  {
    heading: 'Motor Runs Hot',
    items: [
      {
        title: 'Decision Tree',
        severity: 'warning',
        steps: [
          'Check load \u2014 is the motor loaded beyond nameplate FLA? Measure amps on all 3 phases',
          'Check ventilation \u2014 fan turning? Air passages clear? Fan cover not blocked with debris/dust',
          'Check voltage unbalance \u2014 >2% unbalance causes significant heating (see Power tab calculator)',
          'Check current per phase \u2014 unbalanced current indicates winding or connection issue',
          'Check bearings \u2014 listen for noise, feel for excessive heat at bearing housings (>80\u00B0C = problem)',
          'Check alignment \u2014 misalignment causes bearing load, vibration, and excess heat',
        ],
        notes: 'A motor running at 10% above rated amps will experience a roughly 20% increase in winding temperature rise. Insulation life halves for every 10\u00B0C above rated temperature.',
      },
    ],
  },
  {
    heading: 'Motor Trips on Overload',
    items: [
      {
        title: 'Decision Tree',
        severity: 'warning',
        steps: [
          'Measure running amps vs nameplate FLA \u2014 if amps exceed nameplate, check mechanical load',
          'Check for single-phasing \u2014 one phase lost means remaining phases carry \u221A3x current (~173%)',
          'Check supply voltage \u2014 low voltage = high current. Every 10% voltage drop \u2248 10% current increase',
          'Check mechanical load \u2014 binding, jammed, worn bearings, overloaded conveyor, frozen pump',
          'Check starter heater/OL sizing \u2014 heaters must match motor FLA and service factor. Ambient temp affects trip point',
        ],
        notes: 'For electronic overloads: verify the trip class setting (10, 20, or 30) matches the application. Class 10 for general purpose, Class 20 for harder starting loads, Class 30 for high-inertia loads.',
      },
    ],
  },
  {
    heading: 'Motor Vibrates',
    items: [
      {
        title: 'Decision Tree',
        steps: [
          'Check mounting bolts \u2014 loose mounting is the #1 cause. Torque all base bolts to spec',
          'Check coupling alignment \u2014 use dial indicators or laser alignment. Parallel and angular',
          'Check bearing condition \u2014 growling, grinding, or rumbling noise. Check bearing temperature',
          'Check voltage balance \u2014 unbalanced voltage causes unbalanced magnetic pull in the air gap',
          'Check for single-phasing \u2014 causes 2x line frequency vibration (120Hz on 60Hz system)',
          'Check rotor bars \u2014 broken rotor bars cause pulsating current and vibration at slip frequency',
        ],
        notes: 'Quick test: if vibration disappears instantly when power is removed, it is electrical. If vibration coasts down, it is mechanical.',
      },
    ],
  },
  {
    heading: 'VFD Faults',
    items: [
      {
        title: 'Common VFD Fault Codes',
        severity: 'info',
        subItems: [
          { label: 'Overcurrent (OC)', detail: 'Check motor windings for shorts. Check output cable length (<100m without reactor). Check for ground fault on output. Reduce accel ramp if faulting on start.', color: '#ff3c3c' },
          { label: 'Overvoltage (OV)', detail: 'Check input voltage. Check decel ramp (too fast = regenerative overvoltage). Add dynamic braking resistor for high-inertia loads. Check DC bus voltage.', color: '#ff8c00' },
          { label: 'Undervoltage (UV)', detail: 'Check input power supply stability. Check for voltage sags. Check DC bus capacitors (aged caps = low bus voltage). Check input fuses/breaker.', color: '#ff8c00' },
          { label: 'Ground Fault (GF)', detail: 'Megger motor and cable (disconnect VFD first!). Check cable terminations for moisture. Check motor leads for chafing. Common in mining due to harsh environment.', color: '#ff3c3c' },
          { label: 'Overtemperature (OT)', detail: 'Check ambient temperature. Check fan operation. Check heatsink fins for dust/debris buildup. Ensure minimum clearances around VFD enclosure are maintained.', color: '#ff8c00' },
        ],
        notes: 'CRITICAL: Never megger a VFD output! Always disconnect motor leads from VFD before insulation testing. VFD IGBTs will be destroyed by megger voltage.',
      },
    ],
  },

  /* --- NEW sections --- */
  {
    heading: 'Single-Phasing Deep Dive',
    items: [
      {
        title: 'Detecting Single-Phase Condition',
        severity: 'critical',
        steps: [
          'Measure all 3 line-to-line voltages at the motor disconnect: L1-L2, L2-L3, L1-L3',
          'One voltage pair will read ZERO or very low if a phase is completely lost',
          'Check upstream: blown fuse on one phase, single-phase breaker tripped, loose connection on one phase',
          'On a running motor: measure amps on all 3 phases. Lost phase reads zero, other two read ~173% of normal',
          'Check contactor contacts \u2014 one set of contacts may be pitted/worn and not making connection',
          'Check for a blown fuse upstream in the MCC bucket or distribution panel',
        ],
        table: {
          headers: ['What You Measure', 'Phase A', 'Phase B', 'Phase C', 'Diagnosis'],
          rows: [
            ['Voltage (normal)', '480V', '480V', '480V', 'All phases present'],
            ['Voltage (Phase B lost)', '480V', '0V', '480V', 'Phase B supply missing'],
            ['Current (normal)', '10A', '10A', '10A', 'Balanced load'],
            ['Current (Phase B lost)', '17.3A', '0A', '17.3A', 'Single-phasing on B'],
          ],
        },
        notes: 'A motor running on single-phase draws 173% current on the remaining phases. The motor will run (poorly) but cannot start from standstill. Electronic OLs with phase-loss detection are the best protection.',
      },
    ],
  },
  {
    heading: 'Bearing Failure Detection',
    items: [
      {
        title: '4 Progressive Stages of Bearing Failure',
        severity: 'warning',
        table: {
          headers: ['Stage', 'Symptoms', 'Detection Method', 'Action'],
          rows: [
            ['Stage 1 \u2014 Subsurface', 'No audible noise. Ultrasonic frequencies (25\u201350 kHz) detectable.', 'Ultrasonic detector or vibration analyzer', 'Monitor \u2014 plan bearing replacement at next shutdown'],
            ['Stage 2 \u2014 Slight defect', 'Faint high-pitched noise. Bearing temp starting to rise. Slight vibration increase.', 'Stethoscope, IR thermometer, vibration trending', 'Schedule replacement within weeks'],
            ['Stage 3 \u2014 Audible', 'Clearly audible rumbling or growling. Bearing housing hot to touch (>80\u00B0C). Visible vibration.', 'Audible, IR gun, hand-feel vibration', 'Replace at first opportunity \u2014 do not run past this stage'],
            ['Stage 4 \u2014 Catastrophic', 'Grinding metal noise. Extreme heat. Possible smoke or burning smell. Shaft may seize.', 'Obvious to anyone nearby', 'STOP IMMEDIATELY \u2014 continued operation destroys motor'],
          ],
        },
        notes: 'Field quick-check: touch the bearing housing with the back of your hand. If you can\'t hold it for 3 seconds, it\'s too hot (>60\u00B0C). Use an IR gun for an actual reading. Always compare both bearings \u2014 a delta >15\u00B0C between drive-end and non-drive-end is suspect.',
      },
    ],
  },
  {
    heading: 'Insulation Failure Progression',
    items: [
      {
        title: 'Megger Trend Interpretation',
        severity: 'info',
        table: {
          headers: ['Reading Pattern', 'Interpretation', 'Action'],
          rows: [
            ['Stable high (>100 M\u03A9)', 'Healthy insulation', 'Continue routine testing (annual or semi-annual)'],
            ['Gradual decline over months', 'Normal aging, environmental contamination', 'Increase test frequency. Plan cleaning or re-varnish at next outage'],
            ['Sudden drop (e.g., 200\u219220 M\u03A9)', 'Moisture ingress, contamination event, physical damage', 'Investigate immediately. Check junction box seals, cable entries, environment'],
            ['Low but stable (5\u201310 M\u03A9)', 'Contaminated but not failing \u2014 yet', 'Schedule cleaning. Apply space heaters if motor is idle. Do not run in critical service'],
            ['Consistently dropping each test', 'Progressive insulation breakdown', 'Plan motor replacement/rewind. Do NOT rely on this motor for critical ops'],
            ['Below 1 M\u03A9', 'Insulation failure \u2014 ground fault imminent or present', 'Remove from service. Rewind or replace motor'],
          ],
        },
        notes: 'The TREND is more important than any single reading. A motor at 50 M\u03A9 that was at 500 M\u03A9 last year is more concerning than a motor that\'s been stable at 20 M\u03A9 for five years. Record all readings with date, temperature, and humidity.',
      },
    ],
  },
  {
    heading: 'Soft Starter Troubleshooting',
    items: [
      {
        title: 'Common Soft Starter Problems',
        severity: 'warning',
        subItems: [
          { label: 'Thyristor (SCR) Failure', detail: 'Motor starts across-the-line (no ramp). One or more SCRs shorted through. Check with ohmmeter: SCR should block in both directions when gate is disconnected. Shorted SCR reads low ohms. Replace SCR module.', color: '#ff3c3c' },
          { label: 'Motor Won\'t Ramp Up', detail: 'Check current limit setting \u2014 too low prevents motor from reaching full speed. Check ramp time \u2014 too long with a loaded motor may trip on stall. Verify initial torque (kick start) setting is adequate.', color: '#ff8c00' },
          { label: 'Overtemperature Fault', detail: 'Soft starters generate heat during ramp (SCRs conduct partially). Check ambient temp, enclosure ventilation, fan operation. Reduce starts-per-hour. Check for excessive ramp time \u2014 shorter ramp = less heat.', color: '#ff8c00' },
          { label: 'Stall Fault', detail: 'Motor didn\'t reach full speed within stall time. Mechanical load too heavy for settings. Increase current limit, decrease ramp time, or verify load. Check for single-phasing upstream.', color: '#ff8c00' },
          { label: 'Current Imbalance on Start', detail: 'SCR firing mismatch or one SCR failing. Will show as unequal current on the three phases during ramp. Motor may shudder or vibrate during start. Replace the affected SCR module.', color: '#ff3c3c' },
        ],
        notes: 'Soft starters bypass the SCRs once the motor reaches full speed (internal bypass contactor closes). If the motor runs fine at full speed but starts poorly, the issue is in the SCRs or ramp settings.',
      },
    ],
  },
  {
    heading: 'Mechanical Misalignment \u2014 Electrical Symptoms',
    items: [
      {
        title: 'What Misalignment Looks Like Electrically',
        subItems: [
          { label: 'Elevated Current Draw', detail: 'Misaligned motor works harder \u2014 typically 5\u201315% above normal FLA. The extra load appears as increased mechanical friction/drag that the motor must overcome. Amps are consistent, not fluctuating.', color: '#ff8c00' },
          { label: 'Vibration at 1x and 2x RPM', detail: 'Angular misalignment: dominant vibration at 1x RPM in axial direction. Parallel (offset) misalignment: dominant at 2x RPM in radial direction. Use vibration analysis to differentiate from other sources.', color: 'var(--primary)' },
          { label: 'Unequal Bearing Temperatures', detail: 'Drive-end bearing runs hotter than non-drive-end due to axial thrust from misalignment. A \u039415\u00B0C between DE and NDE bearings is a strong misalignment indicator.', color: '#ff8c00' },
          { label: 'Premature Bearing Failure Pattern', detail: 'Repeated bearing failures (every 6\u201318 months instead of 5+ years) on the drive-end bearing strongly suggest misalignment. Replacing bearings without correcting alignment is throwing away money.', color: '#ff3c3c' },
          { label: 'Coupling Wear', detail: 'Inspect flexible coupling elements: uneven wear, cracking, or deterioration on one side indicates misalignment. Rubber elements may show heat damage. Metallic couplings show fretting wear patterns.', color: 'var(--primary)' },
        ],
        notes: 'Laser alignment tools give the best results. Target: <0.05mm parallel offset and <0.05mm/100mm angular. Thermal growth must be compensated \u2014 align cold with calculated offsets for operating temperature.',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 3: CONTROLS  (EXPANDED \u2014 5 new sections, NO PLC)              */
/* ================================================================== */

export const controlSections: TroubleshootingSection[] = [
  /* --- Existing content (verbatim) --- */
  {
    heading: 'Systematic Approach',
    items: [
      {
        title: 'Control Circuit Troubleshooting Method',
        severity: 'info',
        steps: [
          'Start at the power source \u2014 verify control transformer output voltage (120VAC, 24VDC, 24VAC)',
          'Check fuse or breaker on control circuit \u2014 blown fuse is a symptom, find the cause before replacing',
          'Follow the circuit from L1 (hot) through each device toward L2 (neutral/common)',
          'Test voltage at each device \u2014 voltage present on both sides = good device. Voltage on one side only = open device found',
          'For 24VDC circuits: check power supply output. LED indicator on supply should be green. Measure output with a meter, not just the LED',
          'Check for intermittent connections \u2014 wiggle wires at terminals while monitoring the circuit',
        ],
        notes: 'The device that has voltage on the supply side but NOT on the load side is your failed component. This is the fundamental rule of series circuit troubleshooting.',
      },
    ],
  },
  {
    heading: 'Common Control Issues',
    items: [
      {
        title: 'Connection & Contact Problems',
        subItems: [
          { label: 'Loose Connections', detail: 'Number one cause of control circuit failures. Vibration in mining environments loosens terminals over time. Re-torque annually. Look for discolored wires at terminals (heat = loose).', color: '#ff8c00' },
          { label: 'Failed Relay Coils', detail: 'Measure coil resistance \u2014 open reads infinite. A shorted coil reads very low. Check for correct coil voltage rating (120VAC coil on 24VDC = no pickup). Transient voltage can kill coils \u2014 add suppression.', color: 'var(--primary)' },
          { label: 'Stuck Contacts', detail: 'Contacts can weld shut under high current or arc. NO contact stuck closed or NC contact stuck open. Physically check contact operation. Replace the entire relay, not just contacts.', color: '#ff8c00' },
          { label: 'Burnt Contact Tips', detail: 'Look for blackened, pitted, or deformed contact surfaces. Caused by arcing during open/close. High-inductive loads (coils, solenoids) without suppression are the usual culprit.', color: 'var(--primary)' },
          { label: 'Control Transformer Issues', detail: 'Check primary and secondary fuses. Measure secondary voltage under load. Overloaded transformers run hot and voltage drops. Size: total VA of all coils + 25% margin.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Contactor Troubleshooting',
    items: [
      {
        title: 'Common Contactor Problems',
        severity: 'warning',
        subItems: [
          { label: 'Chattering/Buzzing', detail: 'Low control voltage (measure at coil). Broken shading coil on AC contactor (causes AC buzz). Dirty/misaligned armature face. Foreign material in air gap. Mechanical binding.', color: '#ff3c3c' },
          { label: 'Won\'t Pick Up', detail: 'No control power \u2192 check upstream fuse/breaker. Open coil \u2192 measure coil resistance. Wrong coil voltage \u2192 verify rating matches supply. Mechanical binding \u2192 check for debris or rust. Interlock preventing pickup.', color: '#ff8c00' },
          { label: 'Won\'t Drop Out', detail: 'Welded main contacts \u2192 replace contactor. Stuck armature \u2192 clean contact faces, check spring. Voltage still applied to coil \u2192 trace control circuit. Residual magnetism in worn contactor \u2192 replace.', color: '#ff3c3c' },
        ],
        notes: 'Chattering contactors will rapidly destroy contacts and can weld shut. Do not leave chattering \u2014 remove from service immediately.',
      },
    ],
  },
  {
    heading: 'Timer Troubleshooting',
    items: [
      {
        title: 'Timer Issues',
        subItems: [
          { label: 'Wrong Timing Mode', detail: 'ON-delay vs OFF-delay \u2014 most common wiring mistake. ON-delay: coil energizes, waits, then contacts change. OFF-delay: contacts change immediately, then revert after delay on de-energize.', color: 'var(--primary)' },
          { label: 'Failed Output', detail: 'Timer display shows but contacts don\'t change \u2014 internal relay failed. No display \u2014 no power or timer is dead. Check for correct input signal (voltage vs dry contact).', color: 'var(--primary)' },
          { label: 'Incorrect Wiring', detail: 'Check if using timed contacts or instantaneous contacts (most timers have both). Verify trigger input type: voltage trigger vs contact trigger. Check time base setting (sec, min, hr).', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Safety Relay Troubleshooting',
    items: [
      {
        title: 'Safety Relay Issues',
        severity: 'critical',
        subItems: [
          { label: 'Won\'t Reset', detail: 'Feedback circuit open \u2014 check that monitoring contacts from external contactors are wired back to safety relay. E-stop still pressed or latched. Input device (light curtain, guard switch) still tripped. Check LED status indicators on relay.', color: '#ff3c3c' },
          { label: 'Feedback Circuit Issues', detail: 'Safety relays monitor external contactor auxiliary contacts to verify contactors actually dropped out. If contactor welds, feedback opens, preventing reset. This is a SAFETY FEATURE \u2014 do not bypass.', color: '#ff3c3c' },
          { label: 'Muting Problems', detail: 'Muting sensors out of alignment (common on conveyors). Muting sequence incorrect \u2014 sensors must activate in the correct order. Muting lamp burnt out \u2014 indicates muting is active, required by code.', color: '#ff8c00' },
        ],
        notes: 'NEVER bypass a safety relay. If the machine won\'t run because the safety circuit is open, FIND AND FIX THE PROBLEM. Bypassing safety circuits has killed electricians.',
      },
    ],
  },
  {
    heading: 'Common Control Voltages',
    items: [
      {
        title: 'Control Voltage Reference',
        table: {
          headers: ['Voltage', 'Type', 'Common Use'],
          rows: [
            ['120VAC', 'AC', 'Motor starters, contactors, pilot lights, most industrial control circuits in North America'],
            ['24VDC', 'DC', 'PLCs, safety relays, sensors, solenoid valves, modern control systems. Safer for panel wiring.'],
            ['24VAC', 'AC', 'HVAC controls, thermostats, some legacy valve actuators. Less common in mining.'],
            ['240VAC', 'AC', 'Some older or large contactor coils. Common on mining equipment from overseas.'],
            ['48VDC', 'DC', 'Telecommunications, some mine communication systems, DC control on mobile equipment.'],
            ['12VDC', 'DC', 'Mobile mining equipment controls, vehicle electrical systems, some instrumentation.'],
          ],
        },
      },
    ],
  },

  /* --- NEW sections --- */
  {
    heading: 'Relay Logic Troubleshooting',
    items: [
      {
        title: 'Systematic Voltage Tracing (Hardwired Relay Logic)',
        severity: 'info',
        steps: [
          'Get the schematic \u2014 you cannot effectively troubleshoot relay logic without a wiring diagram. Find the drawing set for this equipment.',
          'Identify the RUNG that controls the output that isn\'t working (motor starter coil, solenoid, pilot light, etc.)',
          'Verify power at the top of the rung (L1 or +DC) and return at the bottom (L2 or -DC/COM)',
          'Place one meter lead on the return side (L2). Probe each device in the rung from L1 toward L2. Voltage = device is being supplied. No voltage = power stops here.',
          'For SERIES devices (all must close): the open device is where voltage is present on the L1 side but NOT on the L2 side',
          'For PARALLEL branches: check each branch independently. All branches open = output de-energized. Any branch closed = output should energize. If all branches test closed but output doesn\'t work, check output device (coil).',
        ],
        notes: 'Always verify NO (normally open) vs NC (normally closed) contact state. An NC contact that has opened (broken or relay de-energized) looks the same electrically as a failed device. The schematic tells you what SHOULD be happening; your meter tells you what IS happening.',
      },
    ],
  },
  {
    heading: 'Emergency Stop Circuit Diagnosis',
    items: [
      {
        title: 'E-Stop Circuit Testing',
        severity: 'critical',
        steps: [
          'E-stop circuits are SERIES chains \u2014 all E-stops must be in the closed (released) position for the circuit to complete',
          'Start at the safety relay: check for power input and status LEDs. Most safety relays indicate input status per channel.',
          'If the safety relay shows open input: the series chain is broken somewhere',
          'Go to the MIDDLE of the E-stop chain (half-split method). Measure voltage. Voltage = fault is downstream. No voltage = fault is upstream.',
          'Common failures: E-stop mechanically stuck or broken, NC contact failed open, wire broken at terminal (vibration), cable damaged',
          'Once found: repair and TEST. Press EVERY E-stop in the circuit one at a time and verify each one stops the machine.',
        ],
        notes: 'E-stop circuits are safety-critical. NEVER jumper an E-stop for testing \u2014 use a meter to verify the circuit. After any repair, functionally test EVERY E-stop button on the machine. Document the test. O. Reg. 854 requires functional E-stop testing.',
      },
      {
        title: 'E-Stop Wiring Configurations',
        subItems: [
          { label: 'Single-Channel', detail: 'One set of NC contacts in series. Simple but less safe \u2014 a single wire fault can disable the E-stop function without indication. Used on smaller, less critical equipment.', color: 'var(--primary)' },
          { label: 'Dual-Channel (Redundant)', detail: 'Two independent sets of NC contacts. Safety relay monitors both channels. If channels disagree (one open, one closed), relay detects a fault and locks out. This is the standard for mining equipment.', color: '#4caf50' },
          { label: 'Monitored with Feedback', detail: 'Safety relay monitors external contactor auxiliary contacts. If E-stop is released but contactor doesn\'t drop (welded), feedback prevents reset. This catches the most dangerous failure mode.', color: '#4caf50' },
        ],
      },
    ],
  },
  {
    heading: 'Interlock Troubleshooting',
    items: [
      {
        title: 'Types of Interlocks',
        subItems: [
          { label: 'Mechanical Interlocks', detail: 'Physical mechanisms preventing simultaneous operation (e.g., breaker/door interlock \u2014 door can\'t open when breaker is on). Check for worn mechanisms, broken linkages, or misadjusted cams. Common issue: defeat pins or zip-ties \u2014 remove these immediately.', color: '#ff8c00' },
          { label: 'Electrical Interlocks', detail: 'Auxiliary contacts from one device control another (e.g., forward/reverse contactors \u2014 both cannot energize simultaneously). Check aux contact operation with meter. Verify correct NO/NC wiring per schematic.', color: 'var(--primary)' },
          { label: 'Safety Interlocks', detail: 'Guard switches, access door switches, pull-cord switches. Machine won\'t run with guard open. Test switch operation with multimeter. Check alignment of switch actuator. Some are magnetically coded \u2014 verify correct magnet/switch pairing.', color: '#ff3c3c' },
          { label: 'Process Interlocks', detail: 'Equipment must start in sequence (e.g., conveyor C before B before A for mine discharge). Check for run-confirm signals (aux contacts, speed switches, current switches). Process timers must time out before next step.', color: 'var(--primary)' },
        ],
        notes: 'Interlocks exist for a reason. If an interlock is preventing operation, find out WHY the interlock condition isn\'t met \u2014 don\'t defeat the interlock. Defeating interlocks has caused fatalities in mining.',
      },
    ],
  },
  {
    heading: 'Control Transformer Issues',
    items: [
      {
        title: 'Control Transformer Troubleshooting',
        severity: 'warning',
        subItems: [
          { label: 'VA Sizing Verification', detail: 'Add up ALL coil VA ratings on the control circuit (contactor coils, relay coils, solenoid valves, pilot lights). Total should not exceed transformer VA rating. Add 25% margin. Inrush: coil inrush is 5\u201310x sealed VA. Multiple coils energizing simultaneously can overload.', color: 'var(--primary)' },
          { label: 'Secondary Fusing', detail: 'CEC requires secondary fusing on control transformers. Fuse size = secondary FLA or smaller. Blown secondary fuse: DO NOT just replace \u2014 find the cause (shorted coil, ground fault on control circuit, overload). Measure current with clamp before replacing.', color: '#ff8c00' },
          { label: 'Low Secondary Voltage', detail: 'Measure secondary voltage under load, not just at no-load. >5% voltage drop under load indicates overloaded transformer or poor connections. Low voltage causes contactor chatter, relay dropout, and unreliable operation.', color: '#ff8c00' },
          { label: 'Grounding', detail: 'One side of control transformer secondary must be grounded (CEC). This establishes a known reference and allows ground fault detection on the control circuit. Verify ground connection is intact \u2014 broken ground means ground faults won\'t be detected.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Sensor Troubleshooting',
    items: [
      {
        title: 'Proximity Sensor Issues',
        subItems: [
          { label: 'No Output', detail: 'Check power supply voltage at sensor terminals (most require 10\u201330VDC). Check wiring: NPN (sinking) vs PNP (sourcing) \u2014 wrong type won\'t work with your input card/relay. Check target material: inductive sensors only detect metal; capacitive detects metal, plastic, liquid, etc.', color: 'var(--primary)' },
          { label: 'False Triggers', detail: 'Sensing distance set too close to target path. Metal chips or debris accumulating on sensor face. Adjacent sensor cross-talk (mount sensors 2x diameter apart). Vibration causing target to enter sensing range. Electrical noise from VFDs coupling into sensor cable.', color: '#ff8c00' },
          { label: 'Intermittent Operation', detail: 'Loose cable connection at sensor or input terminal. Cable damaged (common in mining \u2014 crushed, cut, or abraded). Sensor face cracked allowing moisture ingress. Connector corrosion. Replace cable and connector together.', color: '#ff8c00' },
        ],
      },
      {
        title: 'Photoelectric Sensor Issues',
        subItems: [
          { label: 'Dust / Contamination', detail: 'Mining environments coat optical sensors with dust rapidly. Clean lenses regularly. Use air curtain or self-cleaning types for heavy dust areas. Switch to ultrasonic or radar sensors where dust is extreme.', color: '#ff8c00' },
          { label: 'Alignment (Thru-Beam)', detail: 'Emitter and receiver must be precisely aligned. Vibration shifts alignment over time. Use alignment indicator LEDs on sensor. Mount rigidly. For conveyor applications, consider retroreflective type instead.', color: 'var(--primary)' },
          { label: 'Background Interference', detail: 'Diffuse sensors can pick up reflections from unintended surfaces. Adjust sensitivity or use background suppression models. Shiny metal surfaces cause mirror-like reflections confusing the sensor.', color: 'var(--primary)' },
        ],
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 4: POWER  (EXPANDED \u2014 5 new sections)                         */
/* ================================================================== */

export const powerSections: TroubleshootingSection[] = [
  /* --- Existing content (verbatim) --- */
  {
    heading: 'Phase Loss Detection',
    items: [
      {
        title: 'Symptoms & Testing',
        severity: 'critical',
        subItems: [
          { label: 'Symptoms', detail: 'Motors hum but won\'t start (single-phase condition). Motors run hot. Lights flicker. VFDs fault on input phase loss. Breakers trip without obvious overload.', color: '#ff3c3c' },
          { label: 'Testing', detail: 'Measure L1-L2, L2-L3, L1-L3 at the main disconnect. Voltage on one pair will be zero or very low if a phase is lost. Check upstream: utility feed, main breaker, fuse (one blown).', color: 'var(--primary)' },
          { label: 'Protection', detail: 'Install phase-loss relays (phase monitor relays) on critical circuits. Modern motor starters have electronic OLs with phase-loss detection built in. VFDs inherently detect input phase loss.', color: '#4caf50' },
        ],
        notes: 'Single-phasing is one of the most destructive faults for 3-phase motors. The remaining two phases carry 173% of normal current. Motors can burn out in minutes.',
      },
    ],
  },
  {
    heading: 'Voltage Unbalance',
    items: [
      {
        title: 'Calculation & Limits',
        severity: 'warning',
        steps: [
          'Measure all three phase-to-phase voltages: V_AB, V_BC, V_CA',
          'Calculate average: V_avg = (V_AB + V_BC + V_CA) / 3',
          'Find the voltage that deviates most from the average',
          'Calculate: % Unbalance = (Max Deviation / V_avg) x 100',
          'Acceptable limit: < 2% \u2014 above 2%, investigate and correct',
        ],
        subItems: [
          { label: 'Effects of Unbalance', detail: '1% voltage unbalance = 6-10% current unbalance. 3.5% voltage unbalance = motor must be derated by ~25%. Causes hot spots in windings, reduces bearing life, increases vibration.', color: '#ff8c00' },
          { label: 'Common Causes', detail: 'Unbalanced single-phase loads on the system. Blown power factor correction capacitor (one phase). Unequal transformer tap settings. Poor connections on one phase. Utility supply issue.', color: 'var(--primary)' },
        ],
      },
      {
        title: 'Voltage Unbalance Calculator',
        severity: 'info',
        notes: 'USE_CALCULATOR',
      },
    ],
  },
  {
    heading: 'Harmonics',
    items: [
      {
        title: 'Sources, Symptoms & Measurement',
        subItems: [
          { label: 'Sources', detail: 'VFDs (largest source in mining), LED/fluorescent lighting, computer/PLC power supplies, battery chargers, welding equipment, arc furnaces. Anything with a solid-state power converter.', color: 'var(--primary)' },
          { label: 'Symptoms', detail: 'Overheated neutral conductor (triplen harmonics add on neutral). Nuisance breaker trips. Transformer buzzing/overheating. Motor overheating with normal amps. Flickering or dimming lights. Communication interference.', color: '#ff8c00' },
          { label: 'Measurement', detail: 'Requires a power quality analyzer with harmonic measurement (e.g., Fluke 435). Total Harmonic Distortion (THD) should be < 5% at PCC per IEEE 519. Individual harmonics: 5th and 7th are most common from VFDs.', color: 'var(--primary)' },
          { label: 'Solutions', detail: 'Line reactors (3-5% impedance) on VFD inputs. Harmonic filters (passive or active). 12/18/24-pulse VFD front ends. K-rated transformers for harmonic-heavy loads. Oversized neutral conductors (200% for triplen harmonics).', color: '#4caf50' },
        ],
      },
    ],
  },
  {
    heading: 'Ground Faults',
    items: [
      {
        title: 'Systematic Isolation Procedure',
        severity: 'critical',
        steps: [
          'Identify affected circuit from ground fault relay indication or alarm panel',
          'De-energize and lock out the circuit',
          'Disconnect all loads (motors, heaters, etc.) from the circuit',
          'Megger the cable from the distribution panel \u2014 if good, cable is OK',
          'Reconnect loads one at a time, megger after each \u2014 fault returns when bad load is connected',
          'For the faulted load: megger phase-to-ground on each conductor. The low reading identifies the faulted phase',
          'For motor faults: check lead connections for moisture, check inside motor junction box, inspect cable entry',
        ],
        notes: 'In mining HRG systems, the ground fault relay will alarm but not trip on the first fault. This is intentional \u2014 it allows continued operation while you locate the fault. A SECOND ground fault creates a phase-to-phase fault through ground. Find and fix the first fault urgently.',
      },
      {
        title: 'Insulation Resistance Testing',
        table: {
          headers: ['Equipment Voltage', 'Test Voltage', 'Min. Acceptable'],
          rows: [
            ['<250V', '500V DC', '0.5 M\u03A9'],
            ['250\u2013600V', '1000V DC', '1.0 M\u03A9'],
            ['600\u20131000V', '1000V DC', '2.0 M\u03A9'],
            ['1000\u20132500V', '2500V DC', '5.0 M\u03A9'],
            ['2500\u20135000V', '5000V DC', '20 M\u03A9'],
          ],
        },
        notes: 'For mining trailing cables: O. Reg. 854 requires minimum 1 M\u03A9 per kV + 1 M\u03A9. Test after any repair or splice. Record all readings \u2014 trending is as important as absolute values.',
      },
    ],
  },
  {
    heading: 'Nuisance Tripping',
    items: [
      {
        title: 'Common Causes',
        subItems: [
          { label: 'Overloaded Circuits', detail: 'Circuit loaded to >80% of breaker rating on continuous loads. Calculate actual load vs breaker capacity. Add up ALL loads on the circuit, including receptacles and lighting.', color: '#ff8c00' },
          { label: 'Loose Connections', detail: 'High resistance at loose lugs creates heat and can cause thermal trip. Arc fault from loose connection can trip AFCI breakers. Tighten all connections and re-torque to manufacturer spec.', color: '#ff8c00' },
          { label: 'Shared Neutrals', detail: 'Multi-wire branch circuits sharing a neutral: if the neutral is broken or loose, voltage shifts cause overload on one branch. On GFCI/AFCI breakers, shared neutrals cause immediate trip.', color: '#ff3c3c' },
          { label: 'Harmonic Currents', detail: 'Triplen harmonics (3rd, 9th, 15th) add on the neutral. Neutral current can exceed phase current. Causes thermal trips on main breaker. See Harmonics section above.', color: 'var(--primary)' },
          { label: 'Inrush Current', detail: 'Motor starting, transformer energization, or capacitor switching can cause momentary overcurrent. Use motor-rated breakers, or adjust trip curve. Consider soft starters or VFDs.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Transformer Troubleshooting',
    items: [
      {
        title: 'Transformer Tests & Checks',
        subItems: [
          { label: 'Turns Ratio Test', detail: 'Apply known voltage to primary (or use TTR test set), measure secondary. Ratio should match nameplate within 0.5%. Deviation indicates shorted turns. Test all phases.', color: 'var(--primary)' },
          { label: 'Insulation Resistance', detail: 'Megger primary to secondary, primary to ground, secondary to ground. Min 1 M\u03A9 per kV + 1 M\u03A9 at 40\u00B0C. Correct readings for temperature: halves for every 10\u00B0C above 40\u00B0C.', color: 'var(--primary)' },
          { label: 'Oil Analysis (liquid-filled)', detail: 'Dielectric breakdown voltage (should be >30 kV for mineral oil). Dissolved gas analysis (DGA) \u2014 detects internal faults before failure. Moisture content: <35 ppm for distribution transformers.', color: 'var(--primary)' },
          { label: 'Common Issues', detail: 'Overheating: check load, cooling fans/radiators, oil level. Humming/buzzing: loose laminations, DC offset, overexcitation. Oil leaks: check gaskets, bushings, drain valve.', color: '#ff8c00' },
        ],
        notes: 'For mine substation transformers: DGA testing is the single best predictive maintenance tool. Key gases: C2H2 (acetylene) = arcing, C2H4 (ethylene) = severe overheating, H2 (hydrogen) = partial discharge.',
      },
    ],
  },

  /* --- NEW sections --- */
  {
    heading: 'Voltage Sag / Swell Diagnosis',
    items: [
      {
        title: 'Field Identification',
        severity: 'warning',
        subItems: [
          { label: 'Voltage Sag (Dip)', detail: 'Momentary voltage decrease (typically 10\u201390% of nominal for 0.5 cycles to 1 minute). Causes: large motor starts, transformer energization, remote faults on utility grid. Symptoms: lights dim, contactors drop out, VFDs fault, sensitive electronics reset.', color: '#ff8c00' },
          { label: 'Voltage Swell', detail: 'Momentary voltage increase (typically 110\u201380% of nominal). Causes: sudden large load rejection (big motor tripping), single-line-to-ground fault on ungrounded system, capacitor bank switching. Symptoms: lights brighten then dim, equipment may trip on overvoltage.', color: '#ff8c00' },
          { label: 'Sustained Undervoltage', detail: 'Voltage stays below 90% for >1 minute. Causes: overloaded transformer/feeder, utility regulation problem, long cable run at high load. Everything draws more current to maintain power, causing cascading overheating.', color: '#ff3c3c' },
        ],
        table: {
          headers: ['Event', 'Duration', 'Magnitude', 'Typical Cause'],
          rows: [
            ['Sag', '0.5 cycles \u2013 1 min', '10\u201390% of nominal', 'Motor starting, remote fault'],
            ['Swell', '0.5 cycles \u2013 1 min', '110\u2013180% of nominal', 'Load rejection, SLG fault'],
            ['Interruption', '< 3 sec', '< 10% of nominal', 'Utility auto-recloser, breaker trip'],
            ['Sustained UV', '> 1 min', '80\u201390% of nominal', 'Overloaded feeder, utility issue'],
            ['Sustained OV', '> 1 min', '105\u2013120% of nominal', 'Tap setting, capacitor bank, light load'],
          ],
        },
      },
    ],
  },
  {
    heading: 'Power Factor Issues in the Field',
    items: [
      {
        title: 'When to Suspect Power Factor Problems',
        subItems: [
          { label: 'Symptoms', detail: 'Utility power factor penalty on bill. Transformer running hot despite load within rating. Voltage drop on feeders worse than expected. Generator can\'t supply full rated kW. Breakers trip despite measured amps being below rating.', color: '#ff8c00' },
          { label: 'Field Measurement', detail: 'Use a power quality meter (Fluke 435, 1760, etc.) to measure PF directly. Clamp CT on all three phases + neutral. A basic clamp meter only reads amps, not PF. PF < 0.85 = investigate. Most mining operations target > 0.90.', color: 'var(--primary)' },
          { label: 'Common Causes of Low PF', detail: 'Lightly loaded motors (worst offenders \u2014 a motor at 25% load may have PF of 0.40). Oversized motors for the application. Large number of VFDs (displacement PF is OK but distortion PF is poor). Old fluorescent lighting with magnetic ballasts.', color: 'var(--primary)' },
          { label: 'Correction Options', detail: 'Right-size motors at next replacement. Add power factor correction capacitors at motor or bus level. Modern VFDs with active front ends have near-unity PF. For utility PF penalty: automatic cap bank at main switchgear.', color: '#4caf50' },
        ],
        notes: 'Do not install PF correction capacitors on the output of a VFD \u2014 the VFD\'s output waveform will destroy the capacitors and the resulting resonance can damage the VFD.',
      },
    ],
  },
  {
    heading: 'Capacitor Bank Troubleshooting',
    items: [
      {
        title: 'Cap Bank Issues',
        severity: 'critical',
        subItems: [
          { label: 'Blown Fuses (Repeated)', detail: 'Individual capacitor unit has failed short. Remove fused cans one at a time and test with capacitance meter. A failed cap reads very low capacitance or short circuit. Harmonic resonance can also cause fuse blowing.', color: '#ff3c3c' },
          { label: 'Bulging / Leaking Cans', detail: 'Internal failure causing gas generation. DANGER \u2014 can explode. De-energize immediately. Do not touch \u2014 internal pressure may be high. Replace entire unit. Check for overvoltage or harmonic causes.', color: '#ff3c3c' },
          { label: 'Overvoltage at Cap Bank', detail: 'Capacitors raise voltage at their point of connection. If voltage exceeds 110% of cap rating, caps will fail prematurely. Check: is the bank too large for the current load? Should caps be switched off at light load?', color: '#ff8c00' },
          { label: 'Harmonic Resonance', detail: 'Cap bank can resonate with system inductance at a harmonic frequency (typically 5th or 7th). Symptoms: loud humming, overheated caps, blown fuses, distorted voltage waveform. Fix: de-tune reactors (typically 7% reactor makes resonance below 4.7th harmonic).', color: '#ff8c00' },
        ],
        notes: 'DANGER: Capacitors store energy even after de-energizing. Always wait 5 minutes for discharge resistors to drain the charge. Verify with a voltmeter before touching. Use a shorting bar to confirm discharge.',
      },
    ],
  },
  {
    heading: 'UPS / Battery System Field Diagnosis',
    items: [
      {
        title: 'Quick UPS Checks',
        subItems: [
          { label: 'UPS in Bypass Mode', detail: 'UPS is passing raw utility power straight to the load \u2014 no protection. Check front panel: bypass indicator lit or alarm active. Causes: internal failure, overload, overtemperature. Load is unprotected \u2014 treat as urgent.', color: '#ff3c3c' },
          { label: 'Battery Age Assessment', detail: 'VRLA (sealed) batteries: 3\u20135 year life. Flooded lead-acid: 10\u201320 years. Check date codes on batteries. Voltage under load: a weak cell drops significantly. Individual cell voltages should be within 0.5V of each other in a string.', color: 'var(--primary)' },
          { label: 'Battery Capacity Test', detail: 'A new battery at 50% capacity is FAILED \u2014 capacity below 80% means end of life. Most UPS systems auto-test weekly. Check the battery test log. If runtime is significantly less than rated, batteries need replacement.', color: '#ff8c00' },
          { label: 'Common UPS Alarms', detail: 'On Battery: utility power failed, UPS running on stored energy. Low Battery: runtime almost exhausted, prepare for shutdown. Overload: load exceeds UPS rating, shed non-critical loads. Replace Battery: internal test detected weak batteries.', color: 'var(--primary)' },
        ],
        notes: 'Cross-reference the Battery/UPS page for detailed maintenance procedures. This section covers field-level quick diagnosis for when something goes wrong.',
      },
    ],
  },
  {
    heading: 'Generator Paralleling Issues',
    items: [
      {
        title: 'Generator Sync / Paralleling Problems',
        severity: 'warning',
        subItems: [
          { label: 'Won\'t Sync (Auto)', detail: 'Check: voltage match (within 5%), frequency match (within 0.5 Hz), phase angle (synchroscope shows approaching match). If any parameter out of range, auto-sync controller won\'t close breaker. Check AVR for voltage, governor for speed.', color: '#ff8c00' },
          { label: 'Reverse Power Trip', detail: 'Generator is motoring (consuming power instead of generating). Caused by: fuel issue (engine losing power), governor not increasing fuel to share load, speed droop setting too high. Reverse power relay should trip to protect engine.', color: '#ff3c3c' },
          { label: 'VAR Hunting (Voltage Oscillation)', detail: 'AVR (Automatic Voltage Regulator) settings too aggressive for parallel operation. Manifests as voltage oscillating between paralleled units. Reduce AVR gain/response. Ensure voltage droop is enabled (2\u20134% typical for parallel operation).', color: '#ff8c00' },
          { label: 'Load Sharing Imbalance', detail: 'One generator carrying more load than the other. Check speed droop setting (should be identical on all units). Check governor operation. Fuel system restriction on one unit. Engine mechanical issue reducing power output.', color: 'var(--primary)' },
        ],
        notes: 'Generator paralleling requires matched voltage, frequency, phase angle, and phase rotation. Closing a breaker out of sync can cause catastrophic mechanical damage to the prime mover. Always use a synch-check relay.',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 5: GROUNDING  (KEPT AS-IS)                                     */
/* ================================================================== */

export const groundingSections: TroubleshootingSection[] = [
  {
    heading: 'Ground Fault Tracing (HRG/NGR Systems)',
    items: [
      {
        title: 'High Resistance Grounding in Mining',
        severity: 'critical',
        subItems: [
          { label: 'How HRG Works', detail: 'A resistor (NGR) is connected between the transformer neutral and ground. Limits ground fault current to 5-10A (typical for mining). First ground fault causes alarm, not trip. Allows continued production while fault is located.', color: 'var(--primary)' },
          { label: 'Fault Indication', detail: 'Ground fault relay alarms. Ground indicator lights: normally all lit equally. On fault, one phase lamp goes dim (faulted phase) and the other two go bright. Modern systems use pulsing technology for easier tracing.', color: 'var(--primary)' },
          { label: 'Tracing Procedure', detail: 'Use a clamp-on ammeter on each feeder leaving the substation. The feeder carrying the fault will show ground fault current (typically pulsing). Follow that feeder to the next panel. Repeat: clamp each branch. Narrow down to the faulted circuit. Disconnect and megger.', color: '#4caf50' },
        ],
        notes: 'In an HRG system, the FIRST fault is safe (limited current). The SECOND ground fault on a different phase creates a phase-to-phase fault through ground, potentially with full fault current. Treat every first fault as urgent.',
      },
      {
        title: 'Pulsing Ground Fault Systems',
        steps: [
          'System pulses the ground fault current (on/off at ~1Hz)',
          'Use a clamp meter with pulse-detection \u2014 the pulsing current is easy to identify',
          'Start at the main bus, clamp each feeder. The feeder with pulsing current has the fault',
          'Follow the feeder downstream, clamping at each junction/panel',
          'Continue narrowing down until the faulted branch circuit is identified',
          'Lock out, disconnect load, megger to confirm \u2014 repair or replace the faulted component',
        ],
      },
    ],
  },
  {
    heading: 'Insulation Resistance Testing',
    items: [
      {
        title: 'Acceptable Values by Voltage Class',
        table: {
          headers: ['Nominal Voltage', 'Megger Test V', 'New Equipment', 'In-Service Min'],
          rows: [
            ['120\u2013240V', '500V DC', '>200 M\u03A9', '1 M\u03A9'],
            ['240\u2013600V', '1000V DC', '>200 M\u03A9', '2 M\u03A9'],
            ['600\u20131000V', '1000V DC', '>500 M\u03A9', '5 M\u03A9'],
            ['1\u20135kV', '2500V DC', '>1000 M\u03A9', '25 M\u03A9'],
            ['5\u201315kV', '5000V DC', '>5000 M\u03A9', '100 M\u03A9'],
          ],
        },
        notes: 'The absolute value matters less than the TREND. If a motor reads 50 M\u03A9 this month and read 500 M\u03A9 last month, investigate even though 50 M\u03A9 is technically acceptable.',
      },
      {
        title: 'Weather & Environmental Effects',
        subItems: [
          { label: 'Humidity', detail: 'High humidity lowers insulation resistance readings. Moisture condenses on insulation surfaces, creating conductive paths. If possible, test in similar conditions each time for consistent trending.', color: 'var(--primary)' },
          { label: 'Temperature', detail: 'Insulation resistance approximately halves for every 10\u00B0C rise above reference (40\u00B0C). Correct readings to 40\u00B0C for comparison. Formula: R_40 = R_measured x 0.5^((40-T)/10).', color: 'var(--primary)' },
          { label: 'Mining Conditions', detail: 'Underground mines: consistently high humidity and temperature. Dust and mineral deposits reduce surface insulation. Water intrusion at cable glands and junction boxes is common. Check readings more frequently.', color: '#ff8c00' },
        ],
      },
    ],
  },
  {
    heading: 'Step & Touch Potential',
    items: [
      {
        title: 'Mining Ground Potential Hazards',
        severity: 'critical',
        subItems: [
          { label: 'Step Potential', detail: 'Voltage difference between feet when standing near a grounding electrode during fault current flow. Worse on rocky ground (high resistivity). Can cause involuntary muscle contraction and falls. Keep feet together near substations during faults.', color: '#ff3c3c' },
          { label: 'Touch Potential', detail: 'Voltage between a person\'s hand (touching grounded equipment) and feet during a ground fault. This is why equipment grounding must be robust. A broken ground conductor means full voltage on equipment frame during a fault.', color: '#ff3c3c' },
          { label: 'Mitigation', detail: 'Ground grids around mine substations. Crushed rock layer (high resistivity surface) around equipment. Equipotential bonding of all metallic structures. Regular testing of grounding system integrity.', color: '#4caf50' },
        ],
        notes: 'In open-pit mines, ground resistance can be very high (rocky terrain). This means higher potential gradients during faults. Ground grid design is critical and should be done by a qualified engineer.',
      },
    ],
  },
  {
    heading: 'Equipment Grounding Conductor (EGC) Testing',
    items: [
      {
        title: 'EGC Verification',
        steps: [
          'Visual inspection: EGC is continuous, properly sized per CEC Table 16, connections tight',
          'Continuity test: measure resistance from equipment frame to the grounding bus at the panel. Should be <1\u03A9 for short runs, <2\u03A9 for longer circuits',
          'Ground loop impedance test: measures total impedance of the fault path. Ensures enough fault current flows to trip the breaker in the required time',
          'Bond test: measure resistance between bonded metallic parts. Should be <0.1\u03A9 for direct bonds',
          'For trailing cables: test ground continuity before each shift. Ground check monitors do this automatically on medium voltage cables',
        ],
        notes: 'CEC Rule 10-906: Equipment grounding conductors must be tested after installation and after any repair or modification to verify continuity and adequacy.',
      },
    ],
  },
  {
    heading: 'Bond Testing',
    items: [
      {
        title: 'Bonding Requirements & Tests',
        subItems: [
          { label: 'What to Bond', detail: 'All metallic raceways, cable trays, equipment frames, structural steel, piping systems, and any metallic object that could become energized. In mining: rail tracks, ventilation ducts, water/air pipes.', color: 'var(--primary)' },
          { label: 'Test Method', detail: 'Use a low-resistance ohmmeter (DLRO) or a standard multimeter for basic checks. Measure from one bonded part to the next. Acceptable: <0.1\u03A9 for direct bonds. Check both ends of bonding jumpers.', color: 'var(--primary)' },
          { label: 'Common Failures', detail: 'Corrosion at bond connections (especially in wet mine environments). Missing bonding jumpers across flexible connections. Paint or coating preventing metal-to-metal contact. Broken grounding conductor inside conduit.', color: '#ff8c00' },
        ],
      },
    ],
  },
  {
    heading: 'Lightning Protection',
    items: [
      {
        title: 'Lightning Protection System Inspection',
        subItems: [
          { label: 'Surface Facilities', detail: 'Inspect air terminals (lightning rods) for physical damage. Check down conductors for continuity and secure mounting. Measure ground resistance of lightning ground electrodes (<10\u03A9 typical). Inspect surge protective devices (SPDs) at service entrance.', color: 'var(--primary)' },
          { label: 'Power Line Entry', detail: 'Check surge arresters on incoming power lines. Verify ground connections at poles and transformers. Look for signs of previous strikes: burnt arresters, fused connections, damaged insulators.', color: 'var(--primary)' },
          { label: 'Bonding to Lightning System', detail: 'All grounding systems must be bonded together: electrical ground, lightning ground, telecom ground, structural steel. Separate grounds can have dangerous voltage differences during a strike.', color: '#ff8c00' },
        ],
        notes: 'Ontario mining surface facilities are exposed to lightning. Annual inspection of lightning protection is recommended. CSA B72 (Installation of Lightning Protection Systems) is the reference standard.',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 6: CABLES & DISTRIBUTION  (NEW)                                */
/* ================================================================== */

export const cableDistSections: TroubleshootingSection[] = [
  {
    heading: 'Cable Fault Finding',
    items: [
      {
        title: 'Megger Reading Interpretation',
        severity: 'info',
        table: {
          headers: ['Megger Reading', 'Interpretation', 'Action'],
          rows: [
            ['> 200 M\u03A9', 'Excellent insulation \u2014 no issues', 'Record reading, no action needed'],
            ['20\u2013200 M\u03A9', 'Good insulation but declining or contaminated', 'Note trend. Clean terminations. Retest in 6 months.'],
            ['5\u201320 M\u03A9', 'Marginal \u2014 contamination, moisture, or aging', 'Inspect cable route, junction boxes, terminations. Dry out if possible. Increase test frequency.'],
            ['1\u20135 M\u03A9', 'Poor \u2014 approaching failure', 'Plan cable replacement. Do not rely for critical service. Investigate cause.'],
            ['< 1 M\u03A9', 'Failed \u2014 ground fault present or imminent', 'Remove from service. Locate fault point. Replace or repair cable.'],
            ['Zero / short', 'Bolted fault \u2014 conductor touching ground', 'De-energize immediately. Locate fault by sectional isolation or TDR.'],
          ],
        },
        notes: 'Always megger with equipment disconnected at BOTH ends. For cables >1000V, use appropriate test voltage (1000V DC for 600V cable, 2500V DC for 5kV cable). Wait for reading to stabilize (60 seconds minimum).',
      },
      {
        title: 'Systematic Fault Location',
        steps: [
          'Confirm fault with megger at one end of the cable (all conductors disconnected)',
          'If fault is confirmed: megger each conductor to ground individually to identify faulted conductor(s)',
          'Half-split the cable run: disconnect at a midpoint junction box or splice and megger each half',
          'The faulted half will read low. Continue splitting until the section is narrow enough to visually inspect',
          'Common fault locations: junction boxes (moisture), cable glands (mechanical damage), bends (insulation stress), areas near heat sources',
          'For direct-buried cable: TDR (Time Domain Reflectometer) can pinpoint the fault distance from the test end',
        ],
      },
    ],
  },
  {
    heading: 'Trailing Cable Troubleshooting',
    items: [
      {
        title: 'Trailing Cable \u2014 Mining Critical',
        severity: 'critical',
        subItems: [
          { label: 'Ground Check Circuit (GCC)', detail: 'O. Reg. 854 requires continuous ground check monitoring on trailing cables. The GCC circuit monitors the ground conductor continuity. If the ground conductor breaks, the GCC relay de-energizes and trips the supply breaker. NEVER bypass the GCC \u2014 it is your life safety system.', color: '#ff3c3c' },
          { label: 'Splice Integrity', detail: 'All splices must be CSA-approved kits for the cable type and voltage. Splices are the weakest point. Inspect visually for: bulging, cracking, discoloration, deformation. Megger after any splice repair. O. Reg. 854 requires IR testing after splice work.', color: '#ff8c00' },
          { label: 'Coupler Inspection', detail: 'Check pins and sockets for corrosion, pitting, heat discoloration. Check insulating sleeves for cracks. Ensure locking mechanism is intact. Worn couplers cause intermittent faults and arcing. Replace at first sign of damage.', color: '#ff8c00' },
          { label: 'Jacket Damage', detail: 'Mining trailing cables take enormous physical abuse: crushing, dragging, UV exposure, chemical exposure. Any cut, abrasion, or puncture that exposes the conductor insulation requires immediate repair. Exposed conductors = ground fault waiting to happen.', color: '#ff3c3c' },
        ],
      },
      {
        title: 'Pre-Shift Cable Checks (O. Reg. 854)',
        steps: [
          'Visual inspection of entire cable length: look for cuts, abrasions, crushing, exposed conductors',
          'Inspect all couplers: check locking, check for damage, check for moisture intrusion',
          'Inspect all splices: look for bulging, cracking, or heat damage',
          'Verify GCC (ground check circuit) is functional \u2014 trip test if equipment allows',
          'Check cable reeling mechanism (if applicable): smooth operation, no kinks or binding',
          'Report and tag out any deficiencies for repair before use',
        ],
        notes: 'O. Reg. 854 s. 195: Trailing cables must be inspected before each use. Document findings. Defective cables must be removed from service immediately. This is law, not suggestion.',
      },
    ],
  },
  {
    heading: 'Breaker / Fuse Troubleshooting',
    items: [
      {
        title: 'Breaker Won\'t Reset',
        severity: 'warning',
        steps: [
          'Fully push the handle to OFF first, then to ON. Many breakers must be fully reset to OFF before closing.',
          'If handle feels firm in OFF but won\'t go to ON: internal trip mechanism is latched due to a downstream fault. DO NOT force.',
          'Disconnect the load. Try to reset with no load connected. If it resets: the load has a fault (short or ground fault). Megger the cable and load.',
          'If breaker won\'t reset even with load disconnected: breaker mechanism has failed internally. Replace the breaker.',
          'If breaker trips again immediately upon reset with load connected: bolted fault. Do not re-attempt. Find and fix the fault.',
        ],
      },
      {
        title: 'Fuse Diagnosis',
        subItems: [
          { label: 'Blown Fuse Identification', detail: 'Cartridge fuses: check with ohmmeter or continuity tester. Visual window (if present) shows blown indicator. Glass fuses: check element visually. NEVER rely on visual check alone for cartridge fuses \u2014 always test with a meter.', color: 'var(--primary)' },
          { label: 'One Phase Blown', detail: 'If only one fuse of three has blown: check for single-phasing on downstream motors. Cause: ground fault on one phase, or a high-impedance fault that only overcurrented one phase. Megger the faulted phase to ground.', color: '#ff8c00' },
          { label: 'Repeated Fuse Blowing', detail: 'If a fuse blows again immediately after replacement: bolted fault downstream. If after minutes/hours: overload or intermittent fault. If after days: marginal overload or deteriorating insulation. Match investigation to pattern.', color: '#ff8c00' },
          { label: 'Selective Coordination Failure', detail: 'The wrong fuse/breaker tripped \u2014 a downstream device should have tripped first. Causes: upstream device too small, downstream device too large, inrush current exceeding upstream device trip curve. Requires coordination study to fix properly.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Switchgear Quick-Check',
    items: [
      {
        title: 'Field Inspection Checklist',
        severity: 'info',
        steps: [
          'VISUAL: look through viewing windows (do not open energized). Look for discoloration, carbon tracking, debris',
          'THERMAL: scan with IR camera through windows. Compare phases. Hot spot = problem. Delta >10\u00B0C between phases = investigate.',
          'SOUND: listen for buzzing, crackling, or popping. These indicate arcing or loose connections. Corona in MV switchgear sounds like frying bacon.',
          'SMELL: any burning or ozone smell requires immediate investigation. De-energize before opening.',
          'ENVIRONMENT: check for water ingress, excessive dust, condensation. Check heater operation. Check ventilation fans.',
          'OPERATIONAL: exercise breakers per maintenance schedule. Racking mechanism should operate smoothly. Check arc flash labels are current.',
        ],
        notes: 'For detailed switchgear maintenance and testing procedures, see the Switchgear reference page. This section covers quick field checks that any electrician should perform regularly.',
      },
    ],
  },
  {
    heading: 'Panel Troubleshooting',
    items: [
      {
        title: 'Common Panel Issues',
        subItems: [
          { label: 'Loose Connections', detail: 'The #1 cause of panel fires. Check main lugs, bus bar connections, and all breaker connections. Use a calibrated torque wrench \u2014 over-tightening strips threads, under-tightening causes arcing. IR scan annually.', color: '#ff3c3c' },
          { label: 'Bus Bar Problems', detail: 'Bus bar connections can loosen over time due to thermal cycling and vibration. Look for discoloration (heat). Measure voltage drop across bus connections \u2014 any measurable voltage drop indicates a problem. Re-torque bus bar bolts to manufacturer spec.', color: '#ff8c00' },
          { label: 'Neutral / Ground Bar Issues', detail: 'Neutral bar full (no available lugs): never double-tap neutrals unless the bar is rated for it. Ground bar: ensure all equipment grounds are tight. Mixed neutral/ground on a sub-panel: must be separate per CEC (bonded only at service entrance).', color: 'var(--primary)' },
          { label: 'Breaker Stab Problems', detail: 'Plug-on breakers can work loose from the bus stabs. Intermittent supply to circuits. Push breaker firmly onto bus. If stab is worn or damaged, the panel bus must be replaced \u2014 you cannot fix worn bus stabs in the field.', color: '#ff8c00' },
        ],
      },
    ],
  },
  {
    heading: 'Transformer Field Troubleshooting',
    items: [
      {
        title: 'Quick Assessment',
        severity: 'warning',
        subItems: [
          { label: 'Unusual Noise', detail: 'Increased humming = overload, harmonic distortion, or loose core laminations. Arcing/popping = internal fault (de-energize immediately). Compare sound level with historical baseline.', color: '#ff8c00' },
          { label: 'Oil Level (Liquid-Filled)', detail: 'Check sight glass or oil level gauge. Low oil = leak (inspect gaskets, bushings, drain valve) or thermal expansion issue. Low oil exposes windings to air \u2014 accelerates insulation aging and risks flashover.', color: '#ff8c00' },
          { label: 'Temperature', detail: 'Check top oil temperature gauge and winding temperature indicator (WTI). Compare to nameplate rating. If temp is above rating: check load, check cooling fans/radiators, check for blocked airflow.', color: 'var(--primary)' },
          { label: 'Warning Signs Requiring Specialist', detail: 'Persistent gas in Buchholz relay (internal arcing). Rapid pressure rise (sudden pressure relay trips). Oil discoloration or sludge. High dissolved gas analysis (DGA) readings. Bushing cracks or oil weeping. These require a transformer specialist.', color: '#ff3c3c' },
        ],
        notes: 'For comprehensive transformer testing procedures (insulation resistance, turns ratio, DGA interpretation), see the Testing Guide page. This section covers field-level quick assessment.',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 7: EQUIPMENT  (NEW \u2014 mining-specific)                         */
/* ================================================================== */

export const equipmentSections: TroubleshootingSection[] = [
  {
    heading: 'Shovel / Excavator Electrical',
    items: [
      {
        title: 'Electric Shovel Quick Checks',
        severity: 'info',
        subItems: [
          { label: 'Main Drive Motors', detail: 'Hoist, crowd, and swing motors are DC (Ward Leonard) or AC (VFD-driven). Check motor amps vs nameplate during dig cycle. Excessive amps = mechanical drag, worn cables, or overloading. For DC motors: check commutator and brushes.', color: 'var(--primary)' },
          { label: 'Trailing Cable', detail: 'Shovel trailing cables are the most abused cables in mining. Pre-shift inspection mandatory (O. Reg. 854). Check couplers, splices, jacket. Cable reel operation: smooth reeling, no excess tension. GCC must be functional.', color: '#ff3c3c' },
          { label: 'Collector Rings (Swing)', detail: 'Collector rings (slip rings) transfer power and signals through the swing bearing. Check brushes for wear (replace at 50% length). Check ring surface for grooves, scoring, or carbon tracking. Clean with appropriate solvent.', color: '#ff8c00' },
          { label: 'Auxiliary Systems', detail: 'Cable reel motor, house lighting, house heaters, hydraulic pump motor, lube system motor. These run on a lower voltage (typically 480V or 600V from an onboard transformer). Check auxiliary transformer fuses and breakers.', color: 'var(--primary)' },
        ],
        notes: 'Electric shovels are complex machines with multiple interrelated electrical systems. Always have the manufacturer schematic set available. For major drive faults, contact the OEM service rep \u2014 drive parameters are manufacturer-specific.',
      },
    ],
  },
  {
    heading: 'Crusher Electrical',
    items: [
      {
        title: 'Common Crusher Electrical Issues',
        severity: 'warning',
        subItems: [
          { label: 'Motor Overload on Start', detail: 'Crushers are high-inertia loads requiring Design C or D motors. Verify motor design letter. Check for material packed in the crushing chamber (clear before starting). Verify soft starter or VFD ramp settings. Class 30 overloads may be required.', color: '#ff8c00' },
          { label: 'Belt / Coupling Issues', detail: 'Drive belts slipping: motor runs at full speed but crusher doesn\'t. Check belt tension and condition. Fluid coupling overheating: check oil level and condition. Fuse plug blown on fluid coupling = overload event.', color: '#ff8c00' },
          { label: 'Lube System Faults', detail: 'Lube system interlock prevents crusher start if oil pressure or flow is insufficient. Check lube pump motor operation, oil level, oil temperature (may need pre-heat in cold weather). Check pressure/flow switches for correct setting.', color: 'var(--primary)' },
          { label: 'Start Sequence Failure', detail: 'Crushers typically have a mandatory start sequence: lube system ON \u2192 lube pressure OK \u2192 crusher start permitted \u2192 feed conveyor start permitted. Check each interlock step. Status lights or HMI will indicate which step is not satisfied.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Conveyor Systems',
    items: [
      {
        title: 'Conveyor Electrical Troubleshooting',
        subItems: [
          { label: 'Motor Overload / Tripping', detail: 'Check belt loading \u2014 overloaded belt or material spillage creating drag. Check motor amps at various load conditions. Belt mistrack causing edge contact with structure. Seized roller creating drag. Inadequate belt tension (motor slipping).', color: '#ff8c00' },
          { label: 'Belt Tracking Issues', detail: 'Belt wandering triggers tracking switches that can stop the conveyor. Tracking switches are safety devices \u2014 don\'t defeat them. Adjust idler rollers to correct tracking. Check belt splice alignment. Check loading point for off-center material feed.', color: 'var(--primary)' },
          { label: 'E-Stop / Pull-Cord Chain', detail: 'Conveyor pull-cords are series-wired E-stop circuits. Any pull-cord switch pulled stops the entire conveyor. Walk the full length to find the activated switch. Reset the switch and investigate WHY it was pulled. Check pull-cord wire tension and switch alignment.', color: '#ff3c3c' },
          { label: 'Take-Up System', detail: 'Gravity or hydraulic take-up maintains belt tension. Take-up travel at limit: belt has stretched and needs re-splicing. Hydraulic take-up: check HPU operation, pressure settings, cylinder movement. Gravity: check weight carriage movement and guides.', color: 'var(--primary)' },
          { label: 'Speed Monitoring', detail: 'Zero-speed or underspeed switches monitor belt speed. Belt slip (motor runs but belt doesn\'t) triggers underspeed alarm/trip. Check drive pulley lagging condition. Check speed sensor alignment and target (proximity to rotating disc or shaft).', color: '#ff8c00' },
        ],
      },
    ],
  },
  {
    heading: 'Pump Systems',
    items: [
      {
        title: 'Pump Electrical Troubleshooting',
        subItems: [
          { label: 'Motor Overload', detail: 'Pump motor draws excessive amps: check for discharge valve closed (dead-heading = high pressure, high amps on positive displacement pumps). Check suction strainer for blockage. Check impeller clearance (worn impeller = reduced efficiency, motor works harder). Check specific gravity of pumped fluid.', color: '#ff8c00' },
          { label: 'Seal Failure Detection', detail: 'Leaking mechanical seal: visible leak at seal housing. Electrical indication: moisture-detection probe in seal chamber triggers alarm. For submersible pumps: moisture in motor housing causes insulation drop \u2014 megger regularly.', color: '#ff8c00' },
          { label: 'Dry Run Protection', detail: 'Running a pump dry destroys the mechanical seal and can damage the motor. Check dry-run protection: level switches in wet well, flow switch on discharge, motor current monitoring (dry-run current is typically lower than normal \u2014 undercurrent trip).', color: '#ff3c3c' },
          { label: 'VFD-Controlled Pumps', detail: 'VFDs on pumps provide variable flow and huge energy savings. Issues: minimum speed limit (avoid running too slow \u2014 cooling depends on speed). Motor bearing currents at high frequencies \u2014 install shaft grounding ring. Check VFD-rated motor insulation.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Lighting Systems',
    items: [
      {
        title: 'Lighting Troubleshooting',
        subItems: [
          { label: 'HID (Metal Halide / HPS)', detail: 'Won\'t start: check ballast, ignitor, and lamp. Cycling (on-off-on): lamp end-of-life \u2014 replace. Long restart delay after power interruption: normal for HID (5\u201315 min restrike time). Use quartz restrike ballasts for critical areas. Check capacitor on ballast circuit.', color: 'var(--primary)' },
          { label: 'LED Driver Failure', detail: 'LED fixture not lighting: check driver output voltage with meter. LED fixtures are DC-driven \u2014 driver converts AC to DC. Common failure: driver overtemp from poor ventilation. Flickering: driver failing or poor connection. Surge damage: install SPD on lighting circuit.', color: 'var(--primary)' },
          { label: 'Portable / Temporary Lighting', detail: 'String lights, portable work lights, tower lights. GFCI-protected circuits are required for temporary installations. GFCI tripping: moisture in connections, damaged cable, too many lights on one GFCI (leakage current adds up). Check voltage drop on long temp runs.', color: '#ff8c00' },
          { label: 'Emergency Lighting', detail: 'Monthly test: press test button, verify illumination for 30 seconds. Annual test: run on battery for full rated duration (30 or 60 minutes). Record results. Replace batteries every 3\u20135 years or when they fail annual duration test. CEC Rule 46-300.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Welding Equipment',
    items: [
      {
        title: 'Welding Machine Troubleshooting',
        subItems: [
          { label: 'No Output', detail: 'Check input power at disconnect. Check internal fuses (most welders have DC bus fuses). Check polarity switch position. For engine-driven: check generator output voltage. For inverter type: check for fault codes on display. Verify output terminal connections.', color: 'var(--primary)' },
          { label: 'Erratic Arc', detail: 'Poor work clamp connection (most common cause). Loose output terminals. Input voltage fluctuation (long extension cord \u2014 voltage drop). Worn or corroded cable connections. For MIG: check wire feed speed, gas flow, and contact tip condition.', color: '#ff8c00' },
          { label: 'Thermal Trip', detail: 'Exceeding duty cycle. Most mine-duty welders are 60\u2013100% duty cycle at rated amps. Using higher amps = reduced duty cycle. Blocked cooling vents. High ambient temperature. Internal fan failure. Allow cool-down before resuming.', color: '#ff8c00' },
          { label: 'Breaker Tripping', detail: 'Welder inrush current is very high. Use a slow-trip or motor-rated breaker. Check circuit wire size \u2014 #8 AWG minimum for most 230V welders. Multiple welders on one circuit: stagger usage. 600V mine-power welders draw less current from supply.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Portable / Temporary Power',
    items: [
      {
        title: 'Portable Power Issues',
        subItems: [
          { label: 'Generator No Output', detail: 'Engine running but no voltage: check AVR (automatic voltage regulator). Loss of residual magnetism: "flash" the field with a battery (12V to field winding briefly). Check output breaker. For generators that sat idle: moisture in windings \u2014 megger before energizing loads.', color: 'var(--primary)' },
          { label: 'Spider Boxes / Temp Panels', detail: 'Portable distribution boxes for construction/temporary power. Each receptacle should be GFCI-protected. Check all grounds \u2014 ground pin to enclosure should read <1\u03A9. Check supply cable condition and connections. Ensure proper grounding of the spider box enclosure.', color: '#ff8c00' },
          { label: 'GFCI Nuisance Tripping', detail: 'Long cable runs have inherent leakage capacitance that can trip GFCIs. Limit run length. Moisture in connectors: dry out and seal. Multiple tools on one GFCI: combined leakage exceeds 5mA threshold. Distribute loads across separate GFCIs.', color: '#ff8c00' },
          { label: 'Extension Cord Sizing', detail: 'Undersized extension cords cause voltage drop, overheating, and tool damage. 100ft of #12 AWG at 15A = 6.5% voltage drop. Use heavier gauge for long runs. 10 AWG for up to 100ft. 8 AWG for 100\u2013200ft. Check cord condition \u2014 damaged cords are a shock and fire hazard.', color: 'var(--primary)' },
        ],
        notes: 'Portable power in mining must comply with CEC Part I and O. Reg. 854. GFCI protection is required for all receptacles serving portable equipment. Bonding of portable generators: frame bonded to system ground.',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 8: TOOLS & TIPS  (EXPANDED \u2014 5 new sections)                  */
/* ================================================================== */

export const toolsSections: TroubleshootingSection[] = [
  /* --- Existing content (verbatim) --- */
  {
    heading: 'Half-Split Troubleshooting Method',
    items: [
      {
        title: 'The Fastest Way to Find a Fault',
        severity: 'info',
        steps: [
          'Identify the full scope of the circuit (from source to load, counting all devices in series)',
          'Test at the MIDDLE of the circuit \u2014 this eliminates half the components in one measurement',
          'If the test shows good power at the midpoint \u2192 fault is in the second half (toward load)',
          'If the test shows no power at the midpoint \u2192 fault is in the first half (toward source)',
          'Test at the middle of the remaining suspect half \u2014 eliminates another half',
          'Repeat until the single faulted component is identified',
        ],
        notes: 'Example: A control circuit has 8 devices in series. Testing device-by-device could take 8 measurements. Half-split: test at device 4, then 2 or 6, then 1 or 3 or 5 or 7. Maximum 3 measurements to find the fault. This method is especially powerful on long circuits or cable runs.',
      },
    ],
  },
  {
    heading: 'Reading a Motor Nameplate',
    items: [
      {
        title: 'Motor Nameplate Fields Explained',
        subItems: [
          { label: 'HP / kW', detail: 'Rated output power at the shaft. 1 HP = 0.746 kW. This is OUTPUT power; the motor draws more than this from the electrical supply.', color: 'var(--primary)' },
          { label: 'FLA (Full Load Amps)', detail: 'The current drawn at rated HP, voltage, and speed. Use this for overload relay sizing (not NEC/CEC table values). OL should be set to nameplate FLA x SF.', color: 'var(--primary)' },
          { label: 'RPM', detail: 'Rated speed at full load. Will be slightly less than synchronous speed (e.g., 1750 RPM for a 4-pole/60Hz motor, sync speed = 1800). Difference is the slip.', color: 'var(--primary)' },
          { label: 'SF (Service Factor)', detail: 'Multiplier for allowable continuous overload. 1.15 SF means motor can safely run at 115% rated HP continuously. Common on NEMA motors. Set OL to FLA x SF.', color: 'var(--primary)' },
          { label: 'Frame', detail: 'Physical mounting dimensions (bolt pattern, shaft height). NEMA standardized: 56 frame to 5000+ frame. Same frame number = same physical mounting regardless of manufacturer.', color: 'var(--primary)' },
          { label: 'Enclosure', detail: 'ODP (Open Drip-Proof): indoor use, clean environments. TEFC (Totally Enclosed Fan Cooled): outdoor, dusty, wet. TENV: no fan, convection cooled. TEAO: for belt-driven fans. XP: explosion-proof for hazardous locations.', color: 'var(--primary)' },
          { label: 'NEMA Design', detail: 'Design A: normal torque, normal starting current. Design B: normal torque, low starting current (most common). Design C: high starting torque for hard-to-start loads. Design D: very high starting torque, high slip (crushers, hoists).', color: 'var(--primary)' },
          { label: 'Insulation Class', detail: 'Class A: 105\u00B0C max. Class B: 130\u00B0C (most common). Class F: 155\u00B0C (common modern motors). Class H: 180\u00B0C (high temp applications, mining hoists). Class determines maximum allowable winding temperature.', color: 'var(--primary)' },
          { label: 'Voltage / Connection', detail: 'Dual voltage: 230/460V. Low voltage = parallel (higher amps, lower voltage). High voltage = series (lower amps, higher voltage). Check connection diagram inside junction box. 9-lead or 12-lead configurations.', color: 'var(--primary)' },
          { label: 'Code Letter', detail: 'Indicates starting current (locked rotor kVA/HP). Code A = lowest starting current, Code V = highest. Affects branch circuit protection sizing. Most industrial motors are Code F to Code H.', color: 'var(--primary)' },
          { label: 'Efficiency / Premium', detail: 'IE1 (Standard), IE2 (High), IE3 (Premium), IE4 (Super Premium). Higher efficiency = lower operating cost. CEC requires minimum efficiency for most new installations.', color: 'var(--primary)' },
          { label: 'Duty Cycle', detail: 'S1: continuous. S2: short-time. S3: intermittent periodic. S4: intermittent with starting. S6: continuous with intermittent load. Must match application duty cycle.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'CEC Wire Color Codes',
    items: [
      {
        title: 'Standard Canadian Wire Colors',
        table: {
          headers: ['Color', 'Function', 'Notes'],
          rows: [
            ['Black', 'Phase A (L1)', '120/208V and 347/600V systems'],
            ['Red', 'Phase B (L2)', '120/208V and 347/600V systems'],
            ['Blue', 'Phase C (L3)', '120/208V and 347/600V systems'],
            ['White', 'Neutral (N)', 'Grounded conductor. Must be identified throughout the run'],
            ['Green or Bare', 'Ground (EGC)', 'Equipment grounding conductor. Green with yellow stripe also acceptable'],
            ['Orange', 'HRG/Delta/Stinger Leg', 'High leg of delta system (208V to neutral). Also used in HRG fault indication circuits'],
            ['Grey', 'Neutral (alternate)', 'Sometimes used as alternate neutral identification'],
            ['Brown', 'Phase A (IEC/import equip)', 'International equipment may use IEC colors: brown, black, grey for phases'],
          ],
        },
        notes: 'CEC Rule 4-036: Identification of conductors. In mining, color coding is especially important for trailing cables and portable equipment. Always verify before connecting \u2014 previous workers may not have followed the code.',
      },
    ],
  },
  {
    heading: 'Common Electrical Smells',
    items: [
      {
        title: 'What Your Nose Tells You',
        severity: 'warning',
        subItems: [
          { label: 'Burning plastic / acrid smoke', detail: 'Wire insulation overheating or burning. IMMEDIATE fire hazard. De-energize immediately. Locate source: check panels, junction boxes, motors, and cable runs. Often caused by loose connections or overloaded circuits.', color: '#ff3c3c' },
          { label: 'Ozone (sharp, clean smell)', detail: 'Corona discharge or arcing. Common around high-voltage equipment. Can indicate insulation breakdown, loose connections, or tracking across dirty insulators. Inspect for carbon tracking on bus.', color: '#ff8c00' },
          { label: 'Rotten eggs (sulfur)', detail: 'Overheated sulfur-based insulation (older equipment). Can also indicate battery issues (hydrogen sulfide from lead-acid). In mining: may also be naturally occurring H2S gas \u2014 check atmosphere.', color: '#ff3c3c' },
          { label: 'Fish / seafood smell', detail: 'Overheated electrical components, particularly older capacitors, some wire insulation, and certain plastics. The off-gassing creates an amine compound that smells like fish. Check for hot components.', color: '#ff8c00' },
          { label: 'Hot oil / burnt transformer oil', detail: 'Transformer overheating. Could indicate overload, internal fault, blocked cooling, or low oil level. Check temperature gauges, oil level, and load. May need DGA test.', color: '#ff8c00' },
          { label: 'Metallic / electrical burning smell', detail: 'Arcing at contacts, motor brush wear, or welding contacts. Check contactors, motor brushes (if applicable), and any switching equipment. Usually accompanied by heat and possible discoloration.', color: '#ff8c00' },
        ],
        notes: 'Trust your nose. If something smells wrong, investigate IMMEDIATELY. Electrical fires can escalate rapidly, especially underground where ventilation can spread smoke and toxic gases throughout the mine.',
      },
    ],
  },
  {
    heading: 'Thermal Imaging Tips',
    items: [
      {
        title: 'Infrared Camera Best Practices',
        subItems: [
          { label: 'What to Look For', detail: 'Hot spots on connections, breakers, fuses, contactors, motors, transformers. Compare similar components under similar loads. A connection 10\u00B0C above its twin is suspect. 40\u00B0C above ambient = immediate action.', color: 'var(--primary)' },
          { label: 'Emissivity Settings', detail: 'Bare copper: ~0.07 (very low, hard to measure). Oxidized copper: ~0.65. Painted surfaces: ~0.95. Electrical tape (black): ~0.95. For accurate readings, apply a patch of electrical tape and measure it.', color: 'var(--primary)' },
          { label: 'Comparison Method', detail: 'Scan all three phases of the same circuit. They should be similar temperature at similar loads. A phase that is significantly hotter indicates a problem on that phase (loose connection, overload, imbalance).', color: 'var(--primary)' },
          { label: 'Common Findings in Mining', detail: 'Loose bus connections (vibration). Overloaded trailing cable connectors. Motor bearing housings (hot bearing vs cool bearing). VFD heatsinks with blocked airflow. Undersized or corroded ground connections.', color: '#ff8c00' },
          { label: 'Tips for Mining Environment', detail: 'Scan equipment under load (not at idle). Allow equipment to reach operating temperature (~30 min). Open panel doors for direct scanning when safe. Document and compare with previous scans. Dusty environments reduce emissivity accuracy.', color: 'var(--primary)' },
        ],
        notes: 'NFPA 70B recommends annual thermal scans for all electrical equipment. In mining, quarterly scans on critical equipment are good practice. A thermal imaging program has the best ROI of any predictive maintenance technique.',
      },
    ],
  },
  {
    heading: 'When to Call a Specialist',
    items: [
      {
        title: 'Know Your Limits',
        subItems: [
          { label: 'Power Quality Studies', detail: 'Complex harmonic issues, voltage flicker, power factor correction design, filter design. Requires specialized equipment (power quality analyzers) and expertise in IEEE 519 compliance.', color: 'var(--primary)' },
          { label: 'Relay Protection Coordination', detail: 'Setting protective relays, conducting coordination studies, time-current curve analysis, short circuit studies. Errors can result in uncoordinated protection and dangerous misoperation.', color: '#ff3c3c' },
          { label: 'Arc Flash Studies', detail: 'CSA Z462 requires arc flash hazard analysis. Requires short circuit study + coordination study + incident energy calculations. Results determine PPE categories and labeling. Update after any system changes.', color: '#ff3c3c' },
          { label: 'Transformer Oil Testing (DGA)', detail: 'Dissolved Gas Analysis requires lab testing and expert interpretation. Not a field test. Key for mine substation transformers. Detects arcing, overheating, and corona before failure.', color: 'var(--primary)' },
          { label: 'Medium/High Voltage Testing', detail: 'Cable testing (VLF, tan delta), switchgear testing, circuit breaker timing tests. Specialized equipment and training required. Work on >5kV requires specific qualifications.', color: '#ff3c3c' },
          { label: 'Grounding System Design', detail: 'Ground grid design for substations, step and touch potential calculations, soil resistivity testing, ground resistance surveys. Requires engineering analysis especially in high-resistivity mining terrain.', color: 'var(--primary)' },
        ],
        notes: 'There is no shame in calling for help. Knowing when a task exceeds your knowledge or equipment is a sign of competence, not weakness. A specialist prevents expensive mistakes and keeps everyone safe.',
      },
    ],
  },

  /* --- NEW sections --- */
  {
    heading: 'Advanced Thermal Imaging',
    items: [
      {
        title: 'Delta-T Severity Classification',
        severity: 'info',
        table: {
          headers: ['\u0394T Above Baseline', 'Severity', 'Action Required'],
          rows: [
            ['1\u201310\u00B0C', 'Possible deficiency', 'Monitor \u2014 rescan at next scheduled interval. Note as baseline.'],
            ['10\u201325\u00B0C', 'Probable deficiency', 'Schedule repair at next planned outage. Increase monitoring frequency.'],
            ['25\u201340\u00B0C', 'Serious deficiency', 'Repair as soon as possible. Continue monitoring until corrected.'],
            ['> 40\u00B0C', 'Critical \u2014 immediate risk', 'IMMEDIATE repair required. De-rate or de-energize if necessary. This component is at risk of failure.'],
          ],
        },
        subItems: [
          { label: 'Mining-Specific Considerations', detail: 'Dusty environments lower surface emissivity, making IR readings less accurate. Clean surfaces before scanning critical connections. Wind cools surfaces and masks hot spots \u2014 use wind shields or scan during calm conditions. Solar heating of outdoor enclosures creates false readings \u2014 scan early morning or on cloudy days.', color: '#ff8c00' },
          { label: 'What Makes Mining Thermal Scans Different', detail: 'Trailing cable couplers show up as hot spots due to contact resistance \u2014 compare with newly connected couplers as baseline. Collector ring brushes generate heat naturally \u2014 focus on brush-to-ring interface temperature rise, not absolute temp. Vibration in mining equipment accelerates connection loosening \u2014 scan more frequently than office/commercial environments.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Vibration Analysis Basics',
    items: [
      {
        title: 'Vibration Frequency Signatures',
        severity: 'info',
        table: {
          headers: ['Source', 'Frequency', 'Direction', 'Notes'],
          rows: [
            ['Imbalance', '1x RPM', 'Radial', 'Most common cause. Proportional to speed\u00B2. Single dominant peak at 1x.'],
            ['Misalignment (angular)', '1x RPM', 'Axial', 'High axial vibration at 1x. Caused by angular offset between shafts.'],
            ['Misalignment (parallel)', '2x RPM', 'Radial', 'High 2x radial vibration. Caused by offset between shaft centerlines.'],
            ['Bearing (outer race)', 'BPFO', 'Radial', 'Ball Pass Frequency Outer \u2014 several times RPM. Specific to bearing geometry.'],
            ['Bearing (inner race)', 'BPFI', 'Radial', 'Ball Pass Frequency Inner \u2014 higher than BPFO. Early sign of inner race defect.'],
            ['Looseness', '1x, 2x, 3x+', 'Radial', 'Multiple harmonics of running speed. Often appears as "noisy" spectrum.'],
            ['Electrical (2x line)', '7200 CPM (120Hz)', 'Radial', 'Disappears instantly on power removal. Caused by unequal air gap, broken rotor bars.'],
            ['Belt issues', 'Belt frequency', 'Radial', 'Belt RPM = motor RPM \u00D7 (drive sheave diameter / driven sheave diameter). Sub-synchronous.'],
          ],
        },
        notes: 'Quick screening: for motors and pumps, measure vibration velocity (mm/s or in/s peak). ISO 10816 general limits: <2.8 mm/s = Good, 2.8\u20137.1 = Satisfactory, 7.1\u201318 = Unsatisfactory, >18 = Unacceptable. For mining, use these as guidelines \u2014 trending is more important than absolute values.',
      },
    ],
  },
  {
    heading: 'Power Logger Interpretation',
    items: [
      {
        title: 'What to Record and Where',
        subItems: [
          { label: 'What to Record', detail: 'Voltage (all 3 phases), current (all 3 phases + neutral), power factor, kW/kVA/kVAR, harmonics (THD at minimum), frequency, and events (sags, swells, interruptions). Most power quality loggers capture all of these automatically.', color: 'var(--primary)' },
          { label: 'Where to Install', detail: 'At the service entrance for overall site power quality. At the main bus of suspect distribution panel. At the input of sensitive equipment experiencing problems. On VFD input for harmonic measurements. Always use insulated CT clamps rated for the voltage.', color: 'var(--primary)' },
          { label: 'Recording Duration', detail: '7-day minimum to capture all operating conditions (weekdays, weekends, shift patterns). 30 days for intermittent problems. For utility complaints: 7 consecutive days at the service entrance, with simultaneous recording at the affected load.', color: 'var(--primary)' },
          { label: 'Key Things to Look For', detail: 'Voltage sags correlating with motor starts or load changes. Harmonic distortion > 5% THD. Power factor below 0.85. Current unbalance between phases > 10%. Neutral current higher than phase current (triplen harmonics). Voltage variations outside +/- 5%.', color: '#ff8c00' },
        ],
        notes: 'Always correlate power logger data with operations logs. If you see a voltage sag at 07:30 every day, what starts up at 07:30? The correlation between electrical events and operational events is where you find answers.',
      },
    ],
  },
  {
    heading: 'Documentation Best Practices',
    items: [
      {
        title: 'What to Record for Electrical Work',
        subItems: [
          { label: 'Test Results', detail: 'Record: date, time, ambient conditions (temp, humidity), equipment ID, test instrument serial number and cal date, test voltage, readings (all phases), and pass/fail criteria used. This is required by O. Reg. 854 for many tests.', color: 'var(--primary)' },
          { label: 'Troubleshooting Actions', detail: 'Record: symptom description, equipment state when found, tests performed and results, root cause identified, corrective action taken, parts replaced, and verification that repair was successful. This builds valuable troubleshooting history.', color: 'var(--primary)' },
          { label: 'Photo Documentation Tips', detail: 'Take BEFORE and AFTER photos. Include the equipment nameplate/ID tag in the photo for identification. Photograph wire markings before disconnecting anything. For thermal images: include a reference shot with visible light camera. Date-stamp all photos.', color: 'var(--primary)' },
          { label: 'As-Built Drawings', detail: 'Update drawings with any changes you make. Red-line the original drawing and submit for formal update. Include: wire colors used, terminal numbers, device labels, new components added. Future you (or the next electrician) will thank you.', color: '#ff8c00' },
        ],
        notes: 'Good documentation is what separates a tradesperson from a parts-changer. Your troubleshooting notes become the training material for the next person. Mining operations require documentation for regulatory compliance \u2014 but more importantly, it makes the whole team better.',
      },
    ],
  },
  {
    heading: 'Troubleshooting Report Writing',
    items: [
      {
        title: '7-Step Report Structure',
        severity: 'info',
        steps: [
          'EQUIPMENT ID: Equipment name, tag number, location, and serial number. Be specific \u2014 "the pump" is not enough.',
          'PROBLEM STATEMENT: What symptom was reported? When did it start? Is it constant or intermittent? What was the equipment doing when it failed?',
          'INVESTIGATION: What tests did you perform? What were the results? Include meter readings, megger values, thermal scan data. List every step taken.',
          'ROOT CAUSE: What caused the failure? Not just "replaced the contactor" but WHY did the contactor fail? (e.g., vibration loosened connections causing arcing)',
          'CORRECTIVE ACTION: What did you do to fix it? Parts used (model/catalog numbers). Settings changed. Connections made.',
          'PREVENTIVE RECOMMENDATION: What should be done to prevent recurrence? (e.g., quarterly re-torque of connections, install anti-vibration mounting, add phase monitor relay)',
          'SIGN-OFF: Your name, date, time, and supervisor acknowledgment. For safety-related repairs: functional test witnessed by supervisor.',
        ],
        notes: 'A good report answers: What happened? Why did it happen? What did I do? How do we prevent it from happening again? Keep it concise but complete. This report is a legal document in mining \u2014 it may be reviewed during incident investigations.',
      },
    ],
  },
]
