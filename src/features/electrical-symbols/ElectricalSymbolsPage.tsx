import { useState } from 'react'
import PageWrapper from '../../layout/PageWrapper'

/* ================================================================== */
/*  Electrical Symbols & Schematics Reference                         */
/*  Target: Ontario Electrical / Mining Apprentices                    */
/*  Covers CEC, CSA, ANSI/IEEE, and industrial/mining symbology       */
/* ================================================================== */

type TabKey =
  | 'standard'
  | 'oneline'
  | 'control'
  | 'diagrams'
  | 'reading'
  | 'csa'
  | 'mining'

/* ------------------------------------------------------------------ */
/*  Data types                                                         */
/* ------------------------------------------------------------------ */

interface SymbolEntry {
  name: string
  ascii: string
  description: string
  cecRef?: string
}

interface SymbolGroup {
  title: string
  color: string
  entries: SymbolEntry[]
}

interface DiagramComparison {
  type: string
  purpose: string
  audience: string
  detail: string
  example: string
}

interface ReadingTip {
  title: string
  body: string
  example?: string
}

/* ================================================================== */
/*  TAB 1 — Standard Electrical Symbols                                */
/* ================================================================== */

const standardGroups: SymbolGroup[] = [
  {
    title: 'Switches',
    color: '#ffd700',
    entries: [
      {
        name: 'SPST (Single Pole Single Throw)',
        ascii:
`    o
   /
  o     o
  |     |
  L     LOAD`,
        description: 'Simplest switch — one pole, one path. On or off. Used in basic lighting circuits and small appliance control.',
        cecRef: 'CEC Rule 14-500',
      },
      {
        name: 'SPDT (Single Pole Double Throw)',
        ascii:
`      o  T1
     /
  o
     \\
      o  T2
  |
  COM`,
        description: 'One input, two possible output paths. The common terminal connects to either T1 or T2. Basis of 3-way switching.',
        cecRef: 'CEC Rule 14-502',
      },
      {
        name: 'DPST (Double Pole Single Throw)',
        ascii:
`  o     o
   \\   /
    \\ /
  o  X  o
     |
  L1    L2`,
        description: 'Two separate poles switched simultaneously by one mechanism. Used for 240V circuits where both hot legs must be broken.',
      },
      {
        name: 'DPDT (Double Pole Double Throw)',
        ascii:
`  T1a o     o T1b
       \\   /
   Ca o  X  o Cb
       /   \\
  T2a o     o T2b`,
        description: 'Two poles, each with two throw positions. Used in motor reversing, transfer switches, and polarity reversal.',
      },
      {
        name: '3-Way Switch (S3)',
        ascii:
`  Drawing Symbol:       Circuit:

    S3                COM ─┐
   ─┤├─                    ├── Traveller 1
                           └── Traveller 2

  On Plan:            On plan drawings,
  ──S3──              shown as "S3"`,
        description: 'Controls a light from two locations. Two SPDT switches with travellers between them. Travelers carry switched hot between the two switch locations. CEC requires identified traveller conductors.',
        cecRef: 'CEC Rule 14-502',
      },
      {
        name: '4-Way Switch (S4)',
        ascii:
`  Drawing Symbol:       Circuit:

    S4              T1in ─┐   ┌─ T1out
   ─┤├─                   ├─X─┤
                    T2in ─┘   └─ T2out

  On Plan:          Reverses travellers
  ──S4──            between 3-way switches`,
        description: 'Installed between two 3-way switches for 3+ location control. A DPDT switch that cross-connects or straight-connects the two travellers. Each additional location requires one more 4-way switch.',
        cecRef: 'CEC Rule 14-502',
      },
      {
        name: 'Dimmer Switch',
        ascii:
`  Drawing Symbol:

    D
   ─┤├─

  or on plans:

  ──SD──`,
        description: 'Variable brightness control. Modern dimmers use TRIAC or MOSFET switching. Must be rated for load type (incandescent, LED, fluorescent). Check CEC for derating requirements.',
      },
      {
        name: 'Key-Operated Switch',
        ascii:
`    ┌───┐
    │ K │
    └─┬─┘
      │
  ────┴────`,
        description: 'Requires a key to operate. Used in security applications, fire alarm panels, and mine shaft controls where unauthorized operation must be prevented.',
      },
      {
        name: 'Pressure Switch',
        ascii:
`  Symbol:

    ┌──┐
  ──┤PS├──
    └──┘

  Schematic:
       ╱╲
  ────╱  ╲────
      (pressure)

  NO: closes on rise
  NC: opens on rise`,
        description: 'Pressure-actuated switch. Available in NO (closes on pressure rise) and NC (opens on pressure rise) configurations. Set point is adjustable. Used for pump control, compressor control, and hydraulic system monitoring in mining. Deadband (differential) prevents rapid cycling.',
      },
      {
        name: 'Float Switch',
        ascii:
`  Symbol:

    ┌──┐
  ──┤FS├──
    └──┘

  Mechanical:
    ┌─────┐
    │  ○  │  float
    │  │  │  rises
    │  │  │  with level
    └──┴──┘

  NO: closes on rise
  NC: opens on rise`,
        description: 'Level-actuated switch using a buoyant float mechanism. Used for sump pump control, tank level control, and water management in mines. Typically paired with HOA selector: AUTO position lets float control the pump. Can be single-point or multi-point for high/low control.',
      },
      {
        name: 'Temperature Switch (Thermostat)',
        ascii:
`  Symbol:

    ┌──┐
  ──┤TS├──
    └──┘

  or:
       ╱╲
  ────╱T ╲────

  Set point adjustable
  Deadband prevents
  short-cycling`,
        description: 'Temperature-actuated switch. Bimetallic, capillary bulb, or electronic type. Used for space heating/cooling control, motor bearing temperature monitoring, and transformer oil temperature alarms. In mining, used to monitor motor winding temperatures.',
      },
      {
        name: 'Flow Switch',
        ascii:
`  Symbol:

    ┌──┐
  ──┤FL├──
    └──┘

  Paddle-type:
  ──────┬──────
        │
       ╱│╲  paddle in
      ╱ │ ╲ flow stream
        │
  Flow →→→→→`,
        description: 'Flow-actuated switch. Paddle, vane, or thermal dispersion type. Verifies fluid flow in cooling lines, lubrication systems, and process piping. In mining, used to confirm coolant flow to motor bearings, drill water flow, and slurry pump discharge. Loss of flow triggers alarm or equipment shutdown.',
      },
      {
        name: 'Disconnect Switch (Isolator)',
        ascii:
`  ───/ ───
     △
     |
  HANDLE

  Three-phase:
  ──/ ──
  ──/ ──
  ──/ ──
    △`,
        description: 'Visible-break isolation device. Must be lockable for LOTO. In mining, disconnects are required at every motor and within sight of the motor per OHSA Reg 854.',
        cecRef: 'CEC Rule 14-700',
      },
    ],
  },
  {
    title: 'Receptacles',
    color: '#4fc3f7',
    entries: [
      {
        name: 'Standard Duplex Receptacle (15A/20A)',
        ascii:
`  Plan Symbol:        Elevation:

      ⊚              ┌──────┐
                      │ ═  ═ │
  or:  ─⊚─           │  ∪   │
                      │ ═  ═ │
                      │  ∪   │
                      └──────┘`,
        description: 'Standard 15A-125V (5-15R) or 20A-125V (5-20R) duplex receptacle. On floor plans shown as a circle with two short lines. CEC requires minimum spacings in dwelling units.',
        cecRef: 'CEC Rule 26-712',
      },
      {
        name: 'GFCI Receptacle',
        ascii:
`  Plan Symbol:

      ⊚
     GFI

  or:  ─⊚─
       GFI

  Wiring:
  LINE ──┬── HOT IN
         ├── NEUT IN
  LOAD ──┬── HOT OUT (downstream)
         └── NEUT OUT (downstream)`,
        description: 'Ground Fault Circuit Interrupter. Trips at 5mA ground fault (4-6mA range). Required in bathrooms, kitchens (within 1.5m of sink), outdoors, garages, unfinished basements. Can protect downstream receptacles from LOAD terminals.',
        cecRef: 'CEC Rule 26-700(11)',
      },
      {
        name: 'AFCI Receptacle',
        ascii:
`  Plan Symbol:

      ⊚
     AFI

  Features:
  - Detects series arcing
  - Detects parallel arcing
  - Combination type most common`,
        description: 'Arc Fault Circuit Interrupter. Detects dangerous arcing (series and parallel) that could cause fires. Required on all 125V 15A and 20A bedroom circuits in dwellings. Ontario adopted this in the 2018 CEC cycle.',
        cecRef: 'CEC Rule 26-656',
      },
      {
        name: 'Twist-Lock Receptacle',
        ascii:
`  Plan Symbol:

      ⊚
      TL

  Face View:
    ┌─────┐
    │  ╱  │   Blades twist
    │ ○   │   and lock in
    │  ╲  │   place
    └─────┘`,
        description: 'Locking-type receptacle — plug twists to lock in. Used for portable tools, temporary power, generators, and industrial equipment where vibration could disconnect a straight-blade plug. Common configs: L5-20, L6-30, L14-30, L21-30.',
      },
      {
        name: 'Welder Receptacle (50A/60A)',
        ascii:
`  Plan Symbol:

      ⊚
      W

  Common Configs:
  NEMA 6-50R  (240V, 50A)
  NEMA 14-50R (120/240V, 50A)
  NEMA 14-60R (120/240V, 60A)`,
        description: 'Heavy-duty receptacle for welding equipment. Typically NEMA 6-50R (240V 2-pole 3-wire) or NEMA 14-50R (120/240V). Must have dedicated circuit. Common in mine maintenance shops.',
        cecRef: 'CEC Rule 26-744',
      },
      {
        name: 'Floor Receptacle',
        ascii:
`  Plan Symbol:

      ⊙
      (circle within circle)

  Shown on plan
  at floor level
  with cover plate`,
        description: 'Flush-mount receptacle installed in the floor. Used in open office areas, workshops, and some industrial settings. Must have a weather-rated cover if subject to wet mopping.',
      },
      {
        name: 'Weatherproof Receptacle',
        ascii:
`  Plan Symbol:

      ⊚
      WP

  Requires:
  - In-use cover (while-in-use)
  - GFCI protection
  - Rated enclosure`,
        description: 'Outdoor or wet-location receptacle. Must have an in-use cover that protects while a cord is plugged in. GFCI protection required. Common at mine surface buildings and outdoor substations.',
        cecRef: 'CEC Rule 26-702',
      },
      {
        name: 'Dedicated / Isolated Ground Receptacle',
        ascii:
`  Plan Symbol:

      ⊚
      IG

  (orange triangle
   on face plate)

  Separate ground
  conductor back
  to panel`,
        description: 'Isolated ground receptacle — equipment ground terminal is isolated from the mounting yoke and connected via a separate insulated ground conductor back to the panel. Used for sensitive electronic equipment, PLCs, and computer systems in mining.',
      },
      {
        name: 'Range Receptacle (50A)',
        ascii:
`  Plan Symbol:

      ⊚
      R

  Common Configs:
  NEMA 14-50R (120/240V, 50A)
  4-wire: 2 hot + N + G
  Required in dwelling kitchens`,
        description: 'Heavy-duty 50A receptacle for electric ranges and ovens. NEMA 14-50R is standard 4-wire (two hots, neutral, ground). Older installations may have 3-wire NEMA 10-50R (no separate ground) which is no longer permitted for new work.',
        cecRef: 'CEC Rule 26-744',
      },
      {
        name: 'Dryer Receptacle (30A)',
        ascii:
`  Plan Symbol:

      ⊚
      D

  Common Configs:
  NEMA 14-30R (120/240V, 30A)
  4-wire: 2 hot + N + G
  Dedicated circuit required`,
        description: 'Heavy-duty 30A receptacle for electric clothes dryers. NEMA 14-30R is standard 4-wire configuration. Must be on a dedicated circuit. Older 3-wire NEMA 10-30R installations should be updated to 4-wire when dryer is replaced.',
        cecRef: 'CEC Rule 26-744',
      },
      {
        name: 'Clock Hanger Receptacle',
        ascii:
`  Plan Symbol:

      ⊚
      C

  Recessed single
  receptacle on
  clock outlet box`,
        description: 'Recessed single receptacle for wall clocks. Located high on wall. On floor plans shown with "C" designation. Less common in new construction but still appears on older institutional building drawings.',
      },
    ],
  },
  {
    title: 'Lighting',
    color: '#ffab40',
    entries: [
      {
        name: 'Incandescent Light',
        ascii:
`  Plan Symbol:    Schematic:

      ◯           ──(X)──
                   or
  (empty circle)   ──⊗──`,
        description: 'Traditional filament lamp. On plans shown as an empty circle. Being phased out in favour of LED but still found in older installations and some industrial applications.',
      },
      {
        name: 'Fluorescent Light',
        ascii:
`  Plan Symbol:

  ════════
  ║      ║     (rectangle)
  ════════

  or: ─[====]─

  Common sizes:
  2x2, 2x4, 1x4 troffers`,
        description: 'Shown as a rectangle on plans. May include number of lamps (e.g., "2L-F32T8"). Ballast type matters — magnetic (old) vs electronic. T8 and T5 are most common. Being replaced by LED tubes and troffers.',
      },
      {
        name: 'LED Light Fixture',
        ascii:
`  Plan Symbol:

      ◯         ┌────────┐
     LED        │  LED   │
                └────────┘
  or with driver info:
  "LED 40W 4000K"`,
        description: 'LED fixture or LED retrofit. On plans, often shown as circle with "LED" label or rectangle with LED notation. Driver may be integral or remote. Specify colour temperature (3000K-5000K) and lumens.',
      },
      {
        name: 'Exit Sign',
        ascii:
`  Plan Symbol:        Schematic:

    ┌─────┐           ┌───────┐
    │EXIT │           │ EXIT  │
    └─────┘           │  ↙    │
      X               └───────┘

  or:  ──X──
  (X in box)`,
        description: 'Illuminated exit sign. Must be on emergency circuit. Battery backup or generator backup required. CEC and OBC require exit signs at every exit door and along the path of egress. Green running man symbol required in Ontario.',
        cecRef: 'CEC Rule 46-300',
      },
      {
        name: 'Emergency Light (Bug-Eye)',
        ascii:
`  Plan Symbol:

    ◯ ◯           ┌─────────────┐
    └─┘           │ ◯    ◯     │
     EM           │  \\    /     │
                  │   Battery   │
                  └─────────────┘`,
        description: 'Battery-backed emergency lighting unit (bug-eye). Activates on power failure. Must provide minimum 1 foot-candle (10 lux) along egress path. Monthly 30-second test and annual 30-minute test required.',
        cecRef: 'CEC Rule 46-200',
      },
      {
        name: 'Recessed Downlight (Pot Light)',
        ascii:
`  Plan Symbol:

      ◯           ┌─────┐
      R           │  ◯  │ (recessed
                  └─────┘  in ceiling)

  IC-rated if insulation contact
  Non-IC if clearance required`,
        description: 'Recessed ceiling luminaire. IC-rated (insulation contact) required when insulation will be within 75mm. Air-tight type required in insulated ceilings per building code. Common in residential and office.',
      },
      {
        name: 'High-Bay / Low-Bay Fixture',
        ascii:
`  Plan Symbol:

      ◯           Mounting > 6m: High Bay
      HB          Mounting 3-6m: Low Bay

  Common types:
  - LED High Bay (most common now)
  - Metal Halide (legacy)
  - HPS (legacy, orange light)`,
        description: 'Industrial luminaire for warehouses, shops, and mine surface buildings. LED high-bays now standard — 100-400W replacing 400-1000W MH/HPS. Specify mounting height, lumen output, and lens type.',
      },
      {
        name: 'Explosion-Proof Light',
        ascii:
`  Plan Symbol:

      ◯           ┌──────────┐
      XP          │ Ex d     │
                  │    ◯     │
  Class/Div      │ Cl.I D.1 │
  marked on      └──────────┘
  drawing`,
        description: 'Luminaire rated for hazardous locations. Heavy cast housing with flame path joints. Must match area classification (Class/Division or Zone). Used in mine gassy areas, battery rooms, and fuel storage.',
      },
      {
        name: 'Outdoor Pole-Mounted Light',
        ascii:
`  Plan Symbol:

      ◯          ┌───┐
      PM         │ ◯ │  fixture
                 └─┬─┘
                   │   pole
                   │
                 ──┴──  base

  Label: "PM-1"
  "LED 150W, 20ft pole"`,
        description: 'Exterior pole-mounted luminaire. Shown on site plans with mounting height and wattage. LED area lights now standard for mine yards and parking areas. Consider dark-sky compliance and light trespass requirements. Photocell control is typical.',
      },
      {
        name: 'Wall Pack / Security Light',
        ascii:
`  Plan Symbol:

    ◯  ←── on wall
    WP

  or:
    ──◯──  (on wall line)

  Types:
  - Full cutoff (dark-sky)
  - Semi-cutoff
  - LED standard now`,
        description: 'Wall-mounted exterior luminaire for building perimeter lighting. Full-cutoff type prevents uplight and glare. Photo-cell and/or motion sensor control common. In mining, used on surface buildings, headframes, and shop exteriors.',
      },
      {
        name: 'Strobe / Warning Light',
        ascii:
`  Plan Symbol:

      ◯
      STR

  Colours:
  RED    = Fire alarm / danger
  AMBER  = Caution / warning
  BLUE   = Special (mining)
  CLEAR  = General alarm

  Often paired with horn`,
        description: 'Visual alarm device. Xenon strobe or LED type. Used in fire alarm systems (red per OBC), industrial pre-start warnings, and hearing-impaired notification. In mining, strobes are paired with audible alarms on conveyors, crushers, and hoist signals.',
      },
    ],
  },
  {
    title: 'Panels & Distribution',
    color: '#ce93d8',
    entries: [
      {
        name: 'Panelboard (Lighting/Power)',
        ascii:
`  Plan Symbol:       Single Line:

  ┌──┬──┐            ─┤├─
  │  │  │            PANEL
  │  │  │            "LP-1"
  │  │  │
  └──┴──┘
  "Panel LP-1"
  208/120V 42cct`,
        description: 'Branch circuit panelboard. Shown on plans as a rectangle with circuit directory. Single-line shows as a bus with branch breakers. Label with panel name, voltage, phases, and total circuits.',
        cecRef: 'CEC Rule 26-400',
      },
      {
        name: 'Distribution Panel / Switchboard',
        ascii:
`  Plan Symbol:

  ╔══════════╗
  ║  DP-1    ║
  ║ 600A     ║
  ║ 347/600V ║
  ╚══════════╝

  (double-line border
   distinguishes from
   branch panel)`,
        description: 'Distribution panelboard or switchboard. Feeds downstream panels and large loads. Larger than branch panel symbol on drawings. Shows main breaker size, bus rating, and voltage.',
      },
      {
        name: 'Transformer (Power)',
        ascii:
`  Plan Symbol:       Schematic:

    ┌───┐            )(
    │ T │            )(
    └───┘            )(

  Single Line:     Winding Config:

   ─╍╍╍─            Δ─Y  (Delta-Wye)
   ─╍╍╍─            Y─Δ  (Wye-Delta)
                     Y─Y  (Wye-Wye)`,
        description: 'Power transformer. On schematics shown as two coils side by side. On single-line diagrams shown as two circles or two coil symbols. Always label kVA/MVA rating, voltage ratio, and winding configuration.',
        cecRef: 'CEC Rule 26-240',
      },
      {
        name: 'Motor',
        ascii:
`  Plan Symbol:       Schematic:

      M              ┌───┐
     ◯              │ M │
                     └─┬─┘
  or:                  │
   ─(M)─           ───┴───

  With HP:          Label: "M1"
  "M - 50HP"       "50HP, 460V, 3ph"`,
        description: 'Electric motor. Circle with "M" inside on plans. On schematics, shown in the power circuit connected to a starter. Label with designation, horsepower, voltage, phase, and RPM.',
      },
      {
        name: 'Generator',
        ascii:
`  Plan Symbol:       Schematic:

      G              ┌───┐
     ◯              │ G │
                     └─┬─┘
  or:                  │
   ─(G)─           ───┴───

  Label: "GEN-1"
  "500kW, 600V, 3ph"`,
        description: 'Generator or genset. Circle with "G" on plans. For standby generators, shown with transfer switch. In mining, standby generators are required for critical ventilation, hoisting, and pumping.',
        cecRef: 'CEC Rule 46-100',
      },
      {
        name: 'UPS (Uninterruptible Power Supply)',
        ascii:
`  Plan Symbol:

  ┌───────┐
  │  UPS  │
  └───────┘

  Single Line:
                 ┌─────┐
  UTILITY ──┬───│ UPS │───── CRITICAL
            │   └──┬──┘     LOADS
            │      │
            │   [BATT]
            │
  BYPASS ───┘`,
        description: 'UPS system. Provides battery-backed power for critical loads. Online (double-conversion) type is standard for industrial. Shown on single-line with bypass switch. Used for mine control rooms, PLCs, and communication systems.',
      },
      {
        name: 'Automatic Transfer Switch (ATS)',
        ascii:
`  Plan Symbol:       Single Line:

  ┌───────┐         NORMAL ──┐
  │  ATS  │                  ├── LOAD
  └───────┘         EMERG ───┘
                      ATS`,
        description: 'Automatic transfer switch. Transfers load between normal and emergency power sources. Can be open-transition (brief outage) or closed-transition (make-before-break). Required in systems with standby generators.',
        cecRef: 'CEC Rule 46-108',
      },
      {
        name: 'Service Entrance',
        ascii:
`  Plan Symbol:

  ═══════════════
  ║ SERVICE ENT ║
  ║ 200A, 120/  ║
  ║ 240V, 1PH   ║
  ║ kAIC: 10    ║
  ═══════════════

  One-Line:
  UTILITY──[METER]──┤×├──BUS
                    MAIN`,
        description: 'Service entrance equipment. The point where utility power enters the building. Includes meter base, main disconnect/breaker, and service panel. Must show voltage, ampacity, phases, and available fault current (kAIC) on drawings. One service per building per CEC unless exemptions apply.',
        cecRef: 'CEC Rule 6-100',
      },
      {
        name: 'Junction Box / Pull Box',
        ascii:
`  Plan Symbol:

      ┌─┐
      │J│     Junction box
      └─┘

      ┌──┐
      │PB│    Pull box
      └──┘

  Label with size:
  "JB-1 (8x8x4)"`,
        description: 'Junction box (splice point) or pull box (for long conduit runs). Shown on plan drawings at junction points. CEC Rule 12-3000 covers sizing requirements based on conductor size and number of conduit entries. Must be accessible after installation.',
        cecRef: 'CEC Rule 12-3000',
      },
      {
        name: 'Conduit (Various Types)',
        ascii:
`  Plan Symbols:

  ────────  EMT (thin wall)
  ════════  Rigid (heavy wall)
  ─ ─ ─ ─  Concealed in floor
  ─·─·─·─  Concealed in ceiling
  --------  Exposed
  ~~~~~~~~  Flexible conduit

  With size label:
  ──3/4"EMT──  or  ──1"RGS──`,
        description: 'Conduit types shown on plan drawings using different line styles. EMT (Electrical Metallic Tubing), Rigid (galvanized or PVC-coated), PVC, and Flexible (Greenfield/Liquidtight). Dashed lines indicate concealed runs. Solid lines indicate exposed runs. Always label with size and type.',
        cecRef: 'CEC Rule 12-900',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 2 — One-Line Diagram Symbols                                   */
/* ================================================================== */

const oneLineGroups: SymbolGroup[] = [
  {
    title: 'Protective Devices',
    color: '#ff5252',
    entries: [
      {
        name: 'Circuit Breaker (General)',
        ascii:
`  Symbol:

  ──┤×├──       Fixed breaker

  ──┤×├──       Draw-out breaker
    ═══         (with cradle marks)

  Label format:
  "CB-1, 200A, 3P, 25kAIC"`,
        description: 'Circuit breaker on one-line diagram. Shown as a line with an X or square. Label with designation, trip rating, number of poles, and interrupting capacity (kAIC). Draw-out type shown with additional cradle symbol.',
      },
      {
        name: 'Molded Case Circuit Breaker (MCCB)',
        ascii:
`  ──[×]──

  With thermal-magnetic trip:
  ──[×TM]──

  With electronic trip:
  ──[×ET]──

  Label: "MCCB-1"
  "100A, 3P, 65kAIC"`,
        description: 'MCCB — most common breaker type in panelboards and MCCs. Thermal element for overload, magnetic element for short circuit. Electronic trip units offer adjustable settings. Match AIC rating to available fault current.',
      },
      {
        name: 'Fuse',
        ascii:
`  Standard:        Dual-element:

  ──┤>├──          ──┤>>├──

  Current-limiting:

  ──┤>├──
    (CL)

  Label: "FU-1"
  "100A, 600V, Class J"`,
        description: 'Fuse symbol on one-line. Various types: Class J (current-limiting), Class R (rejection), Class CC, Class T. Dual-element (time-delay) fuses shown with double element symbol. Must coordinate with upstream/downstream devices.',
        cecRef: 'CEC Rule 14-200',
      },
      {
        name: 'Ground Fault Relay',
        ascii:
`        ┌────┐
  ──────┤ GF ├──────
        └────┘

  or with CT:
     ┌─○─┐
  ───┤ GF├───
     └───┘

  "Ground Fault Relay"
  "Trip: 30mA / 200ms"`,
        description: 'Ground fault protection relay. Required on services 150V-to-ground, over 1000A per CEC. Monitors for ground faults using zero-sequence CT or residual sensing. Adjustable pickup and time delay.',
        cecRef: 'CEC Rule 14-102(2)',
      },
    ],
  },
  {
    title: 'Instrument Transformers & Metering',
    color: '#81c784',
    entries: [
      {
        name: 'Current Transformer (CT)',
        ascii:
`  Symbol on one-line:

  ───○───         CT symbol
  ───⊘───         (circle on line)

  With ratio:
  ───○───
  200:5A

  Connection:
  ───○─── → Ammeter
  ───○─── → Relay
  ───○─── → Meter`,
        description: 'Current transformer. Steps down line current for metering and relaying. Common ratios: 50:5, 100:5, 200:5, 400:5, 800:5. Secondary must never be open-circuited (dangerous HV develops). Short secondary before disconnecting load.',
        cecRef: 'CEC Rule 36-100',
      },
      {
        name: 'Potential (Voltage) Transformer (PT/VT)',
        ascii:
`  Symbol on one-line:

  ──┤)(├──       PT/VT symbol

  With ratio:
  ──┤)(├──
  4160:120V

  Connection:
  ──┤)(├── → Voltmeter
  ──┤)(├── → Relay`,
        description: 'Potential transformer (voltage transformer). Steps down line voltage for metering and relaying. Standard secondary is 120V. Must have primary fuse protection. Used on medium/high voltage systems.',
      },
      {
        name: 'Ammeter',
        ascii:
`  Symbol:

  ──(A)──       In-line ammeter

  With CT:
         ○
  ───────┼───────
         │
        (A)`,
        description: 'Ammeter — measures current. On one-line, shown as circle with "A". Connected via CT secondary on medium/high voltage circuits. Direct connection on low-voltage circuits.',
      },
      {
        name: 'Voltmeter',
        ascii:
`  Symbol:

        (V)     Connected across
       / \\     (in parallel)
  ────┘   └────

  With PT:
  ──┤)(├──┐
          (V)`,
        description: 'Voltmeter — measures voltage. Connected in parallel (across the line). On medium/high voltage, connected via PT secondary. Shown with leads going to the bus or line.',
      },
      {
        name: 'Wattmeter / Power Meter',
        ascii:
`  Symbol:

  ──(W)──       Wattmeter
  ──(kWh)──     Energy meter

  Modern:
  ┌──────┐
  │ PQ   │     Power quality
  │Meter │     meter
  └──────┘`,
        description: 'Power/energy metering. Modern digital meters measure W, VAR, VA, PF, kWh, and harmonics. Required at service entrance per utility specs. Revenue metering must be utility-approved.',
      },
    ],
  },
  {
    title: 'Bus & Switchgear',
    color: '#ffd740',
    entries: [
      {
        name: 'Bus Bar',
        ascii:
`  One-Line:

  ════════════════════     Main Bus

  ──┤×├── ──┤×├── ──┤×├──  Breakers
    CB1     CB2     CB3

  Split Bus:
  ══════╤═══════
        │
     ──┤×├──    Tie Breaker
        │
  ══════╧═══════`,
        description: 'Bus bar — heavy copper or aluminum conductor that distributes power. Shown as a thick horizontal line. Branch breakers feed from the bus. Split bus configuration uses a tie breaker between two bus sections.',
      },
      {
        name: 'Switchgear / MCC',
        ascii:
`  One-Line Symbol:

  ┌─────────────────┐
  │   SWGR-1        │
  │   4160V Main    │
  │ ════════════    │
  │ ┤×├ ┤×├ ┤×├    │
  └─────────────────┘

  MCC:
  ┌─────────────────┐
  │   MCC-1         │
  │   480V          │
  │ ════════════    │
  │ BKT BKT BKT    │
  │  M1  M2  M3    │
  └─────────────────┘`,
        description: 'Switchgear or Motor Control Centre (MCC). Shown as a box containing the bus and branch devices. MCC uses buckets (BKT) with individual motor starters. Label with designation, voltage, bus rating.',
      },
      {
        name: 'Capacitor Bank',
        ascii:
`  Symbol:

  ──┤├──        Single capacitor

  ──┤├──┤├──    Capacitor bank
  ──┤├──┤├──
  ──┤├──┤├──

  On one-line:
  ──┤×├──┤├──
   CB    CAP
   "PF Correction
    300 kVAR"`,
        description: 'Power factor correction capacitor bank. Connected to bus to improve power factor. Switched in steps based on demand. Must have discharge resistors and dedicated overcurrent protection. Harmonic concerns with VFDs.',
        cecRef: 'CEC Rule 26-210',
      },
      {
        name: 'Surge Protective Device (SPD)',
        ascii:
`  Symbol:

      ╱│
  ───╱ │───
      ─┴─
       │
      GND

  On one-line:
  ══════╤══════
        │
       SPD
        │
       GND`,
        description: 'Surge protective device (formerly TVSS). Clamps voltage transients to protect equipment. Type 1 (service entrance), Type 2 (distribution panel), Type 3 (point of use). Required at service entrance per CEC 2021.',
        cecRef: 'CEC Rule 18-100',
      },
      {
        name: 'Motor Starter on One-Line',
        ascii:
`  Combination starter:

  ──┤×├──┤M├──[OL]──(M)
    CB   CONT  OL   MOTOR

  Full Voltage Non-Reversing:
  FVNR

  Full Voltage Reversing:
  FVR
  ──┤×├──┤MF├──[OL]──(M)
         ┤MR├`,
        description: 'Motor starter shown on one-line diagram. Combination starter includes disconnect/breaker, contactor, and overload in one package. FVNR (Full Voltage Non-Reversing) is most common. FVR (Full Voltage Reversing) uses two contactors with mechanical and electrical interlocking.',
      },
      {
        name: 'Reactor / Inductor',
        ascii:
`  Symbol:

  ──╍╍╍──     Air core reactor

  ──╍╍╍──     Iron core reactor
    ───       (line under coils)

  Common uses:
  - Line reactor (before VFD)
  - Load reactor (after VFD)
  - Current-limiting reactor`,
        description: 'Reactor (inductor) on one-line diagram. Shown as coil symbol. Line reactors installed before VFDs reduce harmonic distortion and limit inrush current. Load reactors on VFD output protect motor insulation from voltage spikes. Current-limiting reactors reduce fault current.',
      },
      {
        name: 'Harmonic Filter',
        ascii:
`  Symbol:

  ──╍╍╍──┤├──
  (reactor + capacitor
   in series = tuned filter)

  or:
  ┌──────────┐
  │ HARM.    │
  │ FILTER   │
  │ 5th/7th  │
  └──────────┘`,
        description: 'Harmonic filter on one-line. Passive filters use tuned LC circuits to absorb specific harmonic frequencies (typically 5th, 7th, 11th, 13th). Active filters inject cancelling currents. Required in many mining operations where multiple VFDs create significant harmonic distortion on the power system.',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 3 — Control Circuit Symbols                                    */
/* ================================================================== */

const controlGroups: SymbolGroup[] = [
  {
    title: 'Pushbuttons & Switches',
    color: '#ef5350',
    entries: [
      {
        name: 'Pushbutton — Normally Open (NO)',
        ascii:
`  Schematic:         Ladder:

     │                  │
    ┌┴┐                 │
    │ │  NO         ──┤ ├──
    └┬┘                 │
     │               ─┤PB1├─
                     (NO - Start)`,
        description: 'Normally open pushbutton. Contact is OPEN at rest, CLOSES when pressed. Used as START buttons. Symbol shows contacts separated at rest. In ladder logic, shown as two vertical lines with gap.',
      },
      {
        name: 'Pushbutton — Normally Closed (NC)',
        ascii:
`  Schematic:         Ladder:

     │                  │
    ┌┴┐                 │
    │/│  NC         ──┤/├──
    └┬┘                 │
     │               ─┤PB2├─
                     (NC - Stop)`,
        description: 'Normally closed pushbutton. Contact is CLOSED at rest, OPENS when pressed. Used as STOP and E-STOP buttons. Fail-safe: if wire breaks, circuit opens (same as pressing STOP). Critical safety design principle.',
      },
      {
        name: 'Mushroom-Head E-Stop',
        ascii:
`  Symbol:

     ┌─────┐
     │  ◉  │    Red mushroom head
     └──┬──┘    Twist-to-release
        │       or key-release
    ──┤/├──     NC contact
        │
  Label: "E-STOP"

  Must be RED on
  YELLOW background`,
        description: 'Emergency stop pushbutton. Large red mushroom-head button on yellow background. Must be NC contact (fail-safe). Latching type — requires deliberate reset. Must be in series with control circuit. Required at all operator stations in mining.',
        cecRef: 'CEC Rule 28-400',
      },
      {
        name: 'Selector Switch (2-Position)',
        ascii:
`  Symbol:

     ┌───┐
     │ H │     HAND
     │───│
     │OFF│     OFF
     └─┬─┘
       │
   ──┤SS├──

  Positions:
  HAND = Manual run
  OFF  = Stopped`,
        description: 'Two-position maintained selector switch. Common configurations: HAND-OFF, ON-OFF, LOCAL-REMOTE. Contacts stay in selected position. Used for mode selection on motor starters and control panels.',
      },
      {
        name: 'Selector Switch (3-Position)',
        ascii:
`  Symbol:

     ┌───┐
     │ H │     HAND (manual)
     │───│
     │OFF│     OFF (stopped)
     │───│
     │ A │     AUTO (automatic)
     └─┬─┘
       │
   ──┤HOA├──`,
        description: 'Three-position HAND-OFF-AUTO selector switch. HAND: motor runs continuously. OFF: motor stopped. AUTO: motor controlled by automatic device (float, pressure, PLC). Most common selector in industrial/mining motor control.',
      },
      {
        name: 'Limit Switch — NO',
        ascii:
`  Symbol:

       ┌─╮
  ─────┤ ╰────
       │
   ──┤LS├──
     (NO)

  Actuator types:
  - Roller lever
  - Plunger
  - Wobble stick
  - Fork lever`,
        description: 'Normally open limit switch. Mechanically activated by machine travel or part position. Closes when actuated. Used for end-of-travel detection, position verification, and safety interlocks in mining equipment.',
      },
      {
        name: 'Limit Switch — NC',
        ascii:
`  Symbol:

       ┌─╮
  ─────┤/╰────
       │
   ──┤LS├──
     (NC)

  Used for:
  - Safety interlocking
  - Guard position
  - Overtravel protection`,
        description: 'Normally closed limit switch. Opens when actuated. Used in safety circuits where a broken wire or disconnected switch must stop the machine. Guard interlock switches are typically NC.',
      },
      {
        name: 'Proximity Sensor (Inductive)',
        ascii:
`  Symbol:

    ┌──┐
  ──┤PR├──     2-wire
    └──┘

    ┌──┐
  ──┤PR├──┬──  3-wire
    └──┘  │    (separate output)
          │

  Types:
  NPN (sinking)
  PNP (sourcing)`,
        description: 'Inductive proximity sensor. Detects metal objects without contact. Range typically 2-30mm depending on size. PNP (sourcing) is standard in North America. NPN (sinking) common in Asian equipment. 2-wire (replaces limit switch), 3-wire (separate power/signal).',
      },
      {
        name: 'Photoelectric Sensor (Photoeye)',
        ascii:
`  Symbols:

  Through-beam:
  [TX]>>>>>>>>>[RX]
  (separate emitter/receiver)

  Retro-reflective:
  [TX/RX]>>>> ◇ (reflector)

  Diffuse:
  [TX/RX]>>>> (target)

  Ladder symbol:
  ──┤PE├──`,
        description: 'Photoelectric sensor. Through-beam: longest range, separate TX and RX. Retro-reflective: uses reflector, good range. Diffuse: shortest range, detects object directly. Used for part detection, counting, level sensing in conveyors and hoppers.',
      },
      {
        name: 'Speed Sensor / Zero-Speed Switch',
        ascii:
`  Symbol:

    ┌──┐
  ──┤ZS├──    Zero-speed switch
    └──┘

    ┌──┐
  ──┤SS├──    Speed sensor
    └──┘

  Magnetic pickup:
  ──[MPU]── → frequency
              to relay

  Underspeed relay:
  ──┤ZSR├── NC contact
  (opens below setpoint)`,
        description: 'Speed sensing devices for rotating equipment. Zero-speed switch verifies that equipment has stopped before allowing restart or maintenance. Magnetic pickup senses gear tooth frequency proportional to RPM. Underspeed relay trips when speed drops below setpoint. Critical on conveyors, fans, and crushers in mining to detect belt slip, bearing failure, or mechanical jams.',
      },
      {
        name: 'Safety Relay Module',
        ascii:
`  Symbol:

  ┌───────────────┐
  │  SAFETY RELAY  │
  │                │
  │ IN: E-STOP ───│
  │ IN: GUARD ────│
  │ IN: RESET ────│
  │                │
  │ OUT: S1 ──────│── to M
  │ OUT: S2 ──────│── to M
  │ (dual channel) │
  └────────────────┘

  ──┤SR├──  safety contact`,
        description: 'Safety relay module (e.g., Pilz PNOZ, Allen-Bradley Guardmaster). Monitors safety devices (E-stops, guard switches, light curtains) using dual-channel redundant inputs. Provides safety-rated outputs with forced-guided contacts. Category 3 or 4 safety per CSA Z432. Mandatory reset prevents automatic restart. Standard in modern mining equipment safety systems.',
      },
      {
        name: 'Capacitive Proximity Sensor',
        ascii:
`  Symbol:

    ┌──┐
  ──┤CP├──    Capacitive prox
    └──┘

  Detects:
  - Non-metal materials
  - Liquids through walls
  - Granular materials
  - Plastics, wood, paper

  Range: 1-25mm typical
  Output: PNP or NPN`,
        description: 'Capacitive proximity sensor. Detects both metallic and non-metallic materials by sensing changes in capacitance. Can detect liquids through non-metallic container walls. Used in mining for bin level detection (granular material), liquid level through pipe walls, and non-metallic material detection on conveyors.',
      },
    ],
  },
  {
    title: 'Relay & Contactor Coils',
    color: '#64b5f6',
    entries: [
      {
        name: 'Control Relay Coil (CR)',
        ascii:
`  Ladder Symbol:

  ──────( CR )──────
        coil

  Contact symbols:
  ──┤CR├──  NO contact
  ──┤/CR├── NC contact

  Typical: 120VAC or
  24VDC coil voltage`,
        description: 'Control relay coil and contacts. CR (Control Relay) is an auxiliary relay used for logic, signal multiplication, and voltage isolation. A single CR coil can control multiple NO and NC contacts throughout the ladder.',
      },
      {
        name: 'Timer Relay — On-Delay (TON)',
        ascii:
`  Ladder Symbol:

  ──────( TR )──────
     on-delay coil

  Timed contacts:
  ──┤TR├──  NOTC (NO, timed close)
  ──┤/TR├── NCTO (NC, timed open)

  Operation:
  Coil energize → Timer starts
  Timer expires → Contacts change
  Coil de-energize → Instant reset`,
        description: 'On-delay timer relay (TON). When coil energizes, timer starts counting. After set time delay, timed contacts change state. When coil de-energizes, contacts instantly reset. Used for star-delta transition, sequential starting, and time delays.',
      },
      {
        name: 'Timer Relay — Off-Delay (TOF)',
        ascii:
`  Ladder Symbol:

  ──────( TR )──────
     off-delay coil

  Timed contacts:
  ──┤TR├──  NOTC
  ──┤/TR├── NCTO

  Operation:
  Coil energize → Contacts instant
  Coil de-energize → Timer starts
  Timer expires → Contacts reset`,
        description: 'Off-delay timer relay (TOF). Contacts change instantly when coil energizes. When coil de-energizes, timer starts. After delay, contacts return to normal state. Used for coast-down timing, cooling fan run-on, and lubrication cycles.',
      },
      {
        name: 'Overload Relay (OL)',
        ascii:
`  Power Circuit:
  ───[HTR]───[HTR]───[HTR]───
     OL-1     OL-2    OL-3
  (heaters in motor leads)

  Control Circuit:
  ──┤/OL├──    NC contact
  (in series with M coil)

  Classes:
  Class 10 (standard)
  Class 20 (slow trip)
  Class 30 (very slow)`,
        description: 'Overload relay. Thermal or electronic type. Heater elements in power circuit monitor motor current. NC auxiliary contact in control circuit opens on overload, de-energizing contactor coil. Class 10 standard, Class 20 for high-inertia loads.',
        cecRef: 'CEC Rule 28-308',
      },
      {
        name: 'Contactor Coil (M)',
        ascii:
`  Power Circuit (3-phase):
  L1 ──┤M├── T1
  L2 ──┤M├── T2  to motor
  L3 ──┤M├── T3

  Control Circuit:
  ──────( M )──────
       coil

  Auxiliary contacts:
  ──┤M├──  NO aux (seal-in)
  ──┤/M├── NC aux (interlock)`,
        description: 'Motor contactor coil. "M" designation for main contactor. Power contacts switch motor leads. Auxiliary NO contact used for seal-in. Auxiliary NC contact used for interlocking (forward/reverse). Coil voltage typically 120VAC or 24VDC.',
      },
      {
        name: 'Motor Starter (Complete)',
        ascii:
`  One-Line:

  ──┤×├──┤M├──[OL]──(M)
    CB    CONT  OL  MOTOR

  Ladder (control):

  L1──┤STOP├──┬──┤OL├──(M)──L2
     NC    │
           ├──┤START├───┘
           │   NO
           └──┤M├───────┘
              seal-in

  Components:
  1. Disconnect / CB
  2. Contactor (M)
  3. Overload relay (OL)
  4. Control circuit`,
        description: 'Complete motor starter showing power and control circuits. Disconnect → Contactor → Overload → Motor. Control circuit is 3-wire (STOP-START with seal-in). This is the fundamental building block of industrial motor control.',
      },
      {
        name: 'Latching Relay',
        ascii:
`  Symbol:

  ──────( L )──────
      latch coil

  ──────( U )──────
      unlatch coil

  Contacts maintain
  state after coil
  is de-energized.
  Requires separate
  unlatch pulse.`,
        description: 'Latching (impulse) relay. SET coil latches contacts, RESET coil unlatches. Contacts maintain last state without continuous coil power. Used where maintaining state through power loss is required. Found in some mining hoist controls.',
      },
      {
        name: 'Reversing Contactor Pair (F/R)',
        ascii:
`  Power Circuit:
  L1─┤F├─ T1─(M)
  L2─┤F├─ T2─(M)
  L3─┤F├─ T3─(M)

  L1─┤R├─ T3─(M)  ← phases
  L2─┤R├─ T2─(M)    swapped
  L3─┤R├─ T1─(M)    for reverse

  Control (interlocked):
  ──┤/R├──┤FWD├──(F)──
  ──┤/F├──┤REV├──(R)──

  Mechanical interlock
  + electrical interlock`,
        description: 'Reversing contactor pair (F = Forward, R = Reverse). Two contactors swap two motor leads to reverse rotation direction. MUST have both electrical interlock (NC aux contacts) AND mechanical interlock to prevent both closing simultaneously (catastrophic short circuit). Mandatory in mining for conveyors, hoists, and any reversible drives.',
      },
      {
        name: 'Star-Delta (Wye-Delta) Starter',
        ascii:
`  Power Circuit:
  L1──┤M├──┤OL├─┬─T1
  L2──┤M├──┤OL├─┬─T2
  L3──┤M├──┤OL├─┬─T3
                │
       ┤S├──────┘ Star
       (shorts T4,T5,T6)
       ┤D├──────  Delta
       (connects T4-T2,
        T5-T3, T6-T1)

  Sequence:
  1. M + S close (star)
  2. Timer expires
  3. S opens
  4. D closes (delta)`,
        description: 'Star-Delta (Wye-Delta) reduced voltage starter. Starting current reduced to 33% of DOL. Three contactors: M (main/line), S (star), D (delta). Timer controls transition from star to delta. Transition causes brief current spike (open transition) unless closed-transition type is used. Common on large pumps and fans in mining.',
      },
    ],
  },
  {
    title: 'Pilot Devices & Indicators',
    color: '#4dd0e1',
    entries: [
      {
        name: 'Pilot Light (General)',
        ascii:
`  Ladder Symbol:

  ──────(PL)──────
       lamp

  Colours & Meaning:
  RED    = STOP / danger / fault
  GREEN  = RUN / safe / OK
  AMBER  = WARNING / attention
  BLUE   = Special function
  WHITE  = General / power on
  CLEAR  = Neutral / test`,
        description: 'Pilot light (indicator lamp). Colour coding follows NEMA/IEC standards. RED for stop/danger, GREEN for run/safe, AMBER for caution. On ladder diagrams, shown as circle with PL designation. LED pilot lights are now standard.',
      },
      {
        name: 'Horn / Audible Alarm',
        ascii:
`  Ladder Symbol:

  ──────(H)──────
       horn

  ──────(BZ)──────
       buzzer

  Mining requirement:
  Pre-start warning horn
  before conveyor/crusher
  start-up`,
        description: 'Audible alarm device. Horn, buzzer, or siren. Required as pre-start warning in mining before starting conveyors, crushers, and other equipment where personnel may be in danger. Typically 3 short blasts before start.',
      },
      {
        name: 'Solenoid Valve',
        ascii:
`  Ladder Symbol:

  ──────(SOL)──────
       solenoid

  Valve types:
  2-way: on/off
  3-way: extend/retract
  4-way: dual-acting cylinder

  ──────(SOL-A)──────
  ──────(SOL-B)──────
  (dual solenoid valve)`,
        description: 'Solenoid valve coil. Controls pneumatic or hydraulic valves electrically. 2-way for simple on/off, 3-way for single-acting cylinders, 4/5-way for double-acting cylinders. Spring-return or double-solenoid types. Common in mining equipment controls.',
      },
      {
        name: 'Heating Element',
        ascii:
`  Ladder Symbol:

  ──────(HTR)──────
        heater

  Plan Symbol:
  ══[HTR]══

  Types:
  - Space heater (anti-condensation)
  - Motor space heater
  - Trace heating
  - Process heater`,
        description: 'Electric heating element. In control circuits, space heaters prevent condensation in motor windings and enclosures when equipment is idle. On plans, trace heating is shown as a line alongside the pipe being heated. Motor space heaters are typically energized when the motor is OFF and de-energized when running.',
      },
      {
        name: 'Analog Meter / Display',
        ascii:
`  Ladder Symbol:

  ──────(MTR)──────
        meter/display

  Panel-mount:
  ┌──────────┐
  │  DISPLAY │
  │  ____    │
  │ │ 125│V  │
  │  ────    │
  └──────────┘

  4-20mA or 0-10V input
  Displays process value`,
        description: 'Panel-mounted analog or digital display. Receives 4-20mA or 0-10V signal from a transmitter and displays the process value (pressure, temperature, flow, level). On ladder diagrams, shown as a load device. May include relay outputs for high/low alarms.',
      },
      {
        name: 'Power Supply (24VDC)',
        ascii:
`  Symbol:

  ┌───────────┐
  │  24VDC PS  │
  │            │
  │ AC IN ─── │── L, N
  │            │
  │ DC OUT ── │── +24V, 0V
  │   5A      │
  └────────────┘

  Feeds: PLC, sensors,
  pilot devices, relays`,
        description: 'Control circuit power supply. Converts 120VAC (or 240VAC) to 24VDC for control circuits, PLC I/O, sensors, and pilot devices. 24VDC is the standard control voltage in modern industrial installations. Size based on total connected load with 20% spare capacity. DIN-rail mount is standard.',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 4 — Diagram Types Comparison                                   */
/* ================================================================== */

const diagramTypes: DiagramComparison[] = [
  {
    type: 'One-Line (Single-Line) Diagram',
    purpose: 'Shows the overall power distribution system in simplified form. One line represents a 3-phase circuit. Focuses on the "big picture" of power flow from utility to loads.',
    audience: 'Engineers, power system designers, maintenance supervisors. Required for every commercial/industrial electrical installation.',
    detail: 'LOW — Simplified. Shows equipment, ratings, and connections but not individual wires or physical locations.',
    example:
`  UTILITY
    │
  ──┤×├──   Main Breaker 2000A
    │
  ══╪════════════════   4160V Main Bus
    │        │       │
  ┤)(├     ┤×├     ┤×├
  XFMR     CB2     CB3
  4160/     │       │
  600V    (M)     (M)
    │     250HP   100HP
  ══╪══════   600V Bus
    │    │
  ┤×├  ┤×├
  PNL  PNL
  LP1  LP2`,
  },
  {
    type: 'Schematic (Elementary / Ladder) Diagram',
    purpose: 'Shows the LOGICAL operation of a control circuit. Every wire, contact, and coil is shown in its electrical sequence. Used for troubleshooting — you can trace circuit logic rung by rung.',
    audience: 'Electricians, technicians, troubleshooters, PLC programmers. This is the diagram you use most on the job.',
    detail: 'HIGH — Every wire, contact state (NO/NC), coil, and device is shown. Physical layout is irrelevant — only electrical connections matter.',
    example:
`  L1 (HOT)                          L2 (NEUTRAL)
  ─┬─────────────────────────────────┬─
   │                                 │
  1├──┤STOP├──┬──┤OL├───( M )───────┤  Rung 1
   │   NC     │                      │
   │          ├──┤START├─────────────┤  (Start)
   │          │   NO                 │
   │          └──┤M├─────────────────┤  (Seal-in)
   │             NO aux              │
  2├──┤M├────────────────(PL-G)─────┤  Rung 2
   │   NO aux            green       │  (Run light)
   │                                 │
  3├──┤/M├───────────────(PL-R)─────┤  Rung 3
   │   NC aux            red         │  (Stop light)
   │                                 │
  ─┴─────────────────────────────────┴─`,
  },
  {
    type: 'Wiring Diagram (Connection Diagram)',
    purpose: 'Shows the PHYSICAL connections between devices. Every wire is shown as it actually connects to device terminals. Used for installation — tells you where to land each wire.',
    audience: 'Electricians performing installation, panel builders, maintenance workers tracing physical wires.',
    detail: 'HIGHEST — Shows actual terminal numbers, wire colours/numbers, and physical arrangement of components. Matches what you see when you open the panel door.',
    example:
`  ┌─CONTACTOR─M1──┐    ┌──OVERLOAD──┐
  │ L1  L2  L3    │    │ T1  T2  T3 │
  │ ●   ●   ●     │    │ ●   ●   ●  │
  └─┼───┼───┼─────┘    └─┼───┼───┼──┘
    │   │   │             │   │   │
    │   │   │    Wire     │   │   │
    │   │   │   #1R,2B,3K │   │   │
    │   │   └─────────────┘   │   │
    │   └─────────────────────┘   │
    └─────────────────────────────┘

  ┌──────MOTOR─M1──────┐
  │ T1    T2    T3     │
  │ ●     ●     ●      │
  │                    │
  │   50HP 460V 3PH    │
  └────────────────────┘`,
  },
  {
    type: 'Riser Diagram',
    purpose: 'Shows vertical distribution of power through a multi-story building. Traces feeders from main service up through each floor to panelboards.',
    audience: 'Electrical designers, contractors planning conduit runs, inspectors verifying installation.',
    detail: 'MEDIUM — Shows panel locations per floor, feeder sizes, conduit sizes, and riser locations. Does not show individual circuits.',
    example:
`  ROOF
  ──── RTU-1 Panel ────────── 3#10 + #10G
   │                          in 3/4" EMT
  4TH FLOOR
  ──── Panel 4A (42cct) ──── 3#3/0+#4G
   │   200A                   in 2" EMT
  3RD FLOOR
  ──── Panel 3A (42cct) ──── 3#3/0+#4G
   │   200A                   in 2" EMT
  2ND FLOOR
  ──── Panel 2A (42cct) ──── 3#3/0+#4G
   │   200A                   in 2" EMT
  1ST FLOOR
  ──── Panel 1A (42cct)
   │   200A
  BASEMENT
  ═══ MDP 800A 347/600V ═══
   │
  SERVICE ENTRANCE`,
  },
  {
    type: 'Piping & Instrumentation Diagram (P&ID)',
    purpose: 'Shows the process piping, equipment, and instrumentation. Electricians reference P&IDs to understand what instruments they are wiring, what the process does, and how control loops connect field devices to the control system.',
    audience: 'Instrument technicians, electricians wiring instruments, process engineers, maintenance planners.',
    detail: 'MEDIUM-HIGH — Shows process equipment, piping, all instruments with ISA tag numbers, control valves, and signal types. Does not show electrical wiring details (see loop diagrams for that).',
    example:
`  ┌──────┐    FT    ┌──────┐
  │ TANK │    101    │ PUMP │
  │  T-1 ├────◇────┤  P-1 │
  │      │  (flow)  │      │
  └──┬───┘          └──────┘
     │
     LT        ISA Tag Format:
    102        First letter = measured variable
   (level)    (F=Flow, L=Level, P=Pressure,
     │         T=Temp)
   ┌─┴──┐     Second letter = function
   │ LIC│     (T=Transmitter, C=Controller,
   │ 102│      I=Indicator, A=Alarm)
   └────┘`,
  },
]

/* ================================================================== */
/*  TAB 5 — Schematic Reading Tips                                     */
/* ================================================================== */

const readingTips: ReadingTip[] = [
  {
    title: 'Rung Numbering',
    body: 'Ladder diagrams are read rung by rung, top to bottom, left to right — just like reading a book. Each rung is numbered (1, 2, 3...) on the left side. Rung 1 is the main control rung. Subsequent rungs provide auxiliary functions (lights, interlocks, alarms). The two vertical lines (L1 and L2) are the power rails — hot and neutral (or two phases for higher voltage control).',
    example:
`  L1                        L2
  ─┬────────────────────────┬─
   │                        │
  1│  Rung 1: Main control  │
   │                        │
  2│  Rung 2: Pilot light   │
   │                        │
  3│  Rung 3: Alarm circuit │
   │                        │
  ─┴────────────────────────┴─`,
  },
  {
    title: 'Wire Reference Numbers',
    body: 'Every wire in a schematic should have a unique reference number. Wires connected to the same electrical node share the same number. When you see wire #3 at the top of the drawing and wire #3 at the bottom — they are the same wire (same electrical potential). This is crucial for troubleshooting: you can check voltage at any point labeled with the same wire number.',
    example:
`  L1 (Wire #1)               L2 (Wire #2)
  ─┬─────────────────────────┬─
   │                         │
  1├─#1─┤STOP├─#3─┤OL├─#4─(M)─#2─┤
   │          │                   │
   │          ├─#3─┤START├────#4──┤
   │          │                   │
   │          └─#3─┤M NO├─────#4──┤

  Wire #3 = same node everywhere
  Wire #4 = same node everywhere`,
  },
  {
    title: 'Contact Cross-Referencing',
    body: 'When a relay coil appears in one rung, its contacts may be used in many other rungs. Cross-reference numbers below a coil tell you where its contacts are used. For example, "M (2-1, 3-2)" means: M coil is here, its contacts appear in Rung 2 position 1, and Rung 3 position 2. This saves enormous time when troubleshooting — you can instantly find every contact controlled by a coil.',
    example:
`  L1                              L2
  ─┬──────────────────────────────┬─
   │                              │
  1├──┤STOP├──┬──┤OL├──( M )─────┤
   │          │        (2-1,3-1)  │
   │          └──┤M├──────────────┤
  2├──┤M├─────────────(PL-G)─────┤
   │  ^                           │
   │  Contact from M coil in R1   │
  3├──┤/M├────────────(PL-R)─────┤
   │  ^                           │
   │  NC contact from M coil      │`,
  },
  {
    title: 'Reading Contact States',
    body: 'A contact drawn with a gap (two vertical lines) is Normally Open (NO). A contact with a diagonal slash through it is Normally Closed (NC). "Normal" means the state when the coil is DE-ENERGIZED. When the coil energizes, all its contacts CHANGE state — NO contacts close, NC contacts open. This is the fundamental rule of relay logic.',
    example:
`  NO Contact:     NC Contact:

  ──┤ ├──         ──┤/├──
  (open at rest)  (closed at rest)

  When coil ENERGIZES:
  NO → CLOSES:    NC → OPENS:
  ──┤█├──         ──┤ ├──

  REMEMBER: "Normal" = coil OFF`,
  },
  {
    title: 'Sequence of Operation',
    body: 'To understand a schematic, trace the path of current flow from L1 through each device to L2. For current to flow, EVERY series element in the rung must be closed. Parallel paths provide alternate routes. Start with Rung 1 and work down. Ask: "What must happen for this coil/light to energize?" Then: "When this coil energizes, what changes in other rungs?"',
    example:
`  Reading this rung:

  L1──┤STOP├──┬──┤OL├──(M)──L2
       NC     │
              ├──┤START├──┘
              │   NO
              └──┤M├──────┘

  For M to energize:
  1. STOP must be closed (NC, so yes at rest)
  2. OL must be closed (NC, so yes if no fault)
  3. START must be pressed (NO, needs action)
     OR M aux must be closed (after M energizes)`,
  },
  {
    title: 'Power Circuit vs Control Circuit',
    body: 'Schematics separate the POWER circuit (thick lines, high current to motor) from the CONTROL circuit (thin lines, low current for logic). Power circuit is typically shown on the left page or top of the drawing. Control circuit (ladder) is on the right page or bottom. Power circuit handles motor current (hundreds of amps). Control circuit operates at low power (typically 120VAC or 24VDC).',
    example:
`  POWER CIRCUIT:          CONTROL CIRCUIT:
  (High current)          (Low current)

  L1─┤DISC├─┤M├─[OL]─T1  L1──┤STOP├─┬─(M)─L2
  L2─┤DISC├─┤M├─[OL]─T2       NC    │
  L3─┤DISC├─┤M├─[OL]─T3             ├─┤START├
                                     │  NO
     480V, 50+ Amps                  └─┤M├──
     #6 AWG wire
                              120VAC, <1 Amp
                              #14 AWG wire`,
  },
  {
    title: 'Normally Open vs Normally Closed — The Safety Rule',
    body: 'STOP buttons and safety devices are ALWAYS Normally Closed (NC). This is a fundamental safety principle. If a wire breaks, a connection comes loose, or the device fails — an NC contact opens, which is the SAME as pressing STOP. The circuit fails SAFE. If a STOP button were NO, a broken wire would mean you could NEVER stop the motor. This is why NC is used for all safety-critical functions.',
    example:
`  SAFE DESIGN (NC Stop):

  ──┤STOP├──┤OL├──(M)──
     NC      NC

  Wire breaks? → Circuit opens → Motor STOPS ✓

  UNSAFE DESIGN (NO Stop — NEVER DO THIS):

  ──┤START├──(M)──
     NO

  Wire breaks? → Can't stop motor! ✗
  THIS IS WHY STOP = NC, ALWAYS.`,
  },
  {
    title: 'Drawing Title Block & Revisions',
    body: 'Always check the title block (bottom right corner) for: drawing number, revision level, date, project name, sheet number (e.g., "Sheet 3 of 12"), and the engineer/drafter. Check the revision block for changes — the latest revision is the current version. In mining, drawings must be kept current and available at the worksite per OHSA Reg 854.',
    example:
`  ┌────────────────────────────┐
  │ DRAWING TITLE BLOCK        │
  ├────────────────────────────┤
  │ Project: ABC Mine Mill     │
  │ Title: Crusher #2 Control  │
  │ Dwg#: E-301   Sheet: 3/12 │
  │ Rev: C   Date: 2025-01-15 │
  │ Drawn: JKL  Checked: MNP  │
  ├────────────────────────────┤
  │ REV │ DATE  │ DESCRIPTION  │
  │  A  │ 06/24 │ Issued       │
  │  B  │ 09/24 │ Added E-stop │
  │  C  │ 01/25 │ Added VFD    │
  └────────────────────────────┘`,
  },
  {
    title: 'Parallel vs Series Circuits on Schematics',
    body: 'On a ladder diagram, devices in SERIES (one after another on the same rung) represent AND logic — all must be satisfied for current to flow. Devices in PARALLEL (branched paths on the same rung) represent OR logic — any one path can carry current. This is the foundation of relay logic and directly maps to PLC ladder programming. START and SEAL-IN are in parallel (either can energize M). STOP and OL are in series (both must be closed).',
    example:
`  SERIES (AND logic):
  ──┤A├──┤B├──┤C├──(Y)──
  A AND B AND C must close for Y

  PARALLEL (OR logic):
  ──┤A├──┬──(Y)──
         │
  ──┤B├──┘
  A OR B closes for Y

  COMBINED:
  ──┤A├──┬──┤C├──(Y)──
         │
  ──┤B├──┘
  (A OR B) AND C = Y`,
  },
  {
    title: 'Troubleshooting with a Meter Using the Schematic',
    body: 'The schematic is your roadmap for troubleshooting. Place one meter lead on L1 (hot) and trace through each device to find where voltage is lost. If you measure full voltage on the input of a device but 0V on the output — that device is open (the fault). Work left to right along each rung. For NC contacts, you should read 0V across them (they are closed, so no voltage drop). For open devices, you will read full line voltage across them.',
    example:
`  Measuring across each device:

  L1─┤STOP├─┤OL├──(M)──L2
      0V*    0V*   120V
  * 0V across = device is CLOSED (good)
  * 120V across = device is OPEN (fault!)

  If OL shows 120V across it:
  → OL contact is OPEN
  → Overload has tripped
  → Check motor current, reset OL`,
  },
]

/* ================================================================== */
/*  TAB 6 — CSA / CEC Drawing Symbols                                  */
/* ================================================================== */

const csaGroups: SymbolGroup[] = [
  {
    title: 'CSA vs ANSI/IEEE Key Differences',
    color: '#ff8a65',
    entries: [
      {
        name: 'Transformer Symbol',
        ascii:
`  CSA/IEC:          ANSI/IEEE:

    )(                ┌─┐  ┌─┐
    )(                │~│  │~│
    )(                └─┘  └─┘

  CSA uses two       ANSI uses two
  interlocking        coil symbols
  parentheses         (zigzag or
  (inductor style)    rectangular)`,
        description: 'In Canadian drawings following CSA standards, transformers are typically shown using IEC-style inductor coil symbols. American ANSI/IEEE drawings often use zigzag (inductor) symbols or rectangular symbols with ~ marks. Be aware of both when working with imported equipment.',
      },
      {
        name: 'Fuse Symbol',
        ascii:
`  CSA/IEC:          ANSI/IEEE:

  ──□──              ──┤>├──

  (rectangle)        (S-curve or
                      arc shape)

  Both are correct.
  Know both for
  imported drawings.`,
        description: 'CSA/IEC uses a simple rectangle for fuses. ANSI/IEEE uses an S-curve or arc-and-line symbol. Canadian electrical drawings typically follow IEC conventions, but American equipment manuals will show ANSI symbols.',
      },
      {
        name: 'Ground Symbol',
        ascii:
`  CSA/CEC:          Chassis Ground:

    │                   │
   ─┼─                 ─┴─
   ─┼─                  △
   ─┼─
    ▽               Signal Ground:

  Earth Ground          │
  (3 decreasing        ─┼─
   horizontal lines)    ○`,
        description: 'Ground symbols are largely universal. Earth ground (3 decreasing lines) and chassis ground (triangle) are used in both CSA and ANSI systems. CEC requires a bonding conductor (green or bare) to be identified with the ground symbol on drawings.',
        cecRef: 'CEC Rule 10-604',
      },
      {
        name: 'Motor Overload / Thermal Element',
        ascii:
`  CSA/IEC:          ANSI:

  ──[▽]──           ──[HTR]──
  (triangle in       (heater
   rectangle)         element)

  or: ──[◊]──

  Both represent
  the thermal
  overload heater`,
        description: 'CSA/IEC often shows the thermal overload element as a diamond or triangle in a box. ANSI typically labels it "HTR" (heater). The function is identical — it is the current-sensing element in the overload relay that protects the motor from sustained overcurrent.',
      },
      {
        name: 'Contactor / Relay Coil',
        ascii:
`  CSA/IEC:          ANSI:

  ──( )──           ──(M)──
  (circle/           (circle with
   rectangle)         letter)

  IEC designations:
  KM = Contactor
  KA = Aux relay
  KT = Timer relay

  ANSI designations:
  M  = Motor contactor
  CR = Control relay
  TR = Timer relay`,
        description: 'IEC (used in CSA drawings) uses K-prefix designations: KM for contactors, KA for auxiliary relays, KT for timers. ANSI uses M for contactors, CR for control relays, TR for timer relays. Ontario drawings may use either system. Learn both.',
      },
      {
        name: 'Contact Symbols — IEC vs ANSI',
        ascii:
`  IEC (CSA):

  NO:  ──│ │──     NC:  ──│/│──
  (vertical bars)  (slash through)

  ANSI:

  NO:  ──┤ ├──     NC:  ──┤/├──
  (bracket style)  (slash through)

  Timer contacts (IEC):
  NOTC:  ──│>│──   (timed close)
  NCTO:  ──│/←│──  (timed open)

  Arrow shows delay direction`,
        description: 'IEC uses vertical bar contacts; ANSI uses bracket-style contacts. The NC diagonal slash is universal. IEC timer contacts use arrows to show delay direction. In Ontario, you will encounter both systems. CSA references IEC standards but many imported panels use ANSI.',
      },
      {
        name: 'Wire Numbering — CEC Requirements',
        ascii:
`  CEC Wire Identification:

  Colour Code (CEC Rule 4-036):
  ┌──────────────────────────┐
  │ BLACK   = Ungrounded     │
  │ RED     = Ungrounded     │
  │ BLUE    = Ungrounded     │
  │ WHITE   = Grounded (N)   │
  │ GREEN   = Bonding        │
  │ GREEN/  = Bonding        │
  │ YELLOW                   │
  │ ORANGE  = Delta HiLeg    │
  └──────────────────────────┘

  600V system (347/600V):
  ┌──────────────────────────┐
  │ BROWN   = Phase A        │
  │ ORANGE  = Phase B        │
  │ YELLOW  = Phase C        │
  │ WHITE   = Neutral        │
  │ GREEN   = Ground         │
  └──────────────────────────┘`,
        description: 'CEC Rule 4-036 specifies conductor colour identification. 120/208V system: black, red, blue for phases. 347/600V system: brown, orange, yellow for phases. White is always grounded conductor (neutral). Green or green/yellow is always bonding (ground). Orange is high-leg delta.',
        cecRef: 'CEC Rule 4-036',
      },
    ],
  },
  {
    title: 'CSA Drawing Conventions',
    color: '#a5d6a7',
    entries: [
      {
        name: 'Panel Schedule Format',
        ascii:
`  CEC Panel Schedule:

  PANEL: LP-1        LOCATION: Rm 101
  VOLTAGE: 120/208V  MOUNTING: Surface
  MAIN: 100A MLO     BUS: 100A
  AIC: 10kAIC        PHASES: 3

  CKT │ TRIP │ LOAD      │ TRIP │ CKT
  ────┼──────┼───────────┼──────┼────
   1  │ 20A  │ Recepts   │ 20A  │  2
   3  │ 15A  │ Lights    │ 15A  │  4
   5  │ 20A  │ GFCI Bath │ 20A  │  6
  ────┼──────┼───────────┼──────┼────
  Odd circuits on left (Phase A-B-C)
  Even circuits on right (A-B-C)`,
        description: 'CEC-compliant panel schedules must show panel designation, voltage, main breaker/lugs rating, bus rating, AIC rating, and complete circuit directory. Odd circuits on left, even on right. Each circuit must list the trip rating and load description.',
        cecRef: 'CEC Rule 2-100',
      },
      {
        name: 'Arc Flash Label (CSA Z462)',
        ascii:
`  ┌────────────────────────────┐
  │ ⚡ WARNING — ARC FLASH AND │
  │   SHOCK HAZARD             │
  │                            │
  │ Arc Flash Boundary: 1.2m   │
  │ Incident Energy: 8 cal/cm² │
  │ PPE Required: CAT 2        │
  │ Shock Hazard: 600V         │
  │ Limited Approach: 1.0m     │
  │ Restricted Approach: 0.3m  │
  │                            │
  │ Equipment: MCC-1 Bus       │
  │ Date: 2025-01-15           │
  └────────────────────────────┘`,
        description: 'CSA Z462 (Workplace Electrical Safety) requires arc flash labels on all electrical equipment likely to require servicing while energized. Labels must show incident energy, PPE category, flash boundary, and shock approach boundaries. Required on all panels, MCCs, switchgear, and disconnects.',
      },
      {
        name: 'CEC Equipment Nameplate Info',
        ascii:
`  Motor Nameplate (per CEC):
  ┌───────────────────────────┐
  │ HP: 50     RPM: 1775     │
  │ V: 460    A(FLC): 65     │
  │ PH: 3     HZ: 60        │
  │ SF: 1.15  EFF: 95.0%    │
  │ FRAME: 326T              │
  │ ENCL: TEFC               │
  │ INS CLASS: F             │
  │ DUTY: CONT               │
  │ CSA/cUL LISTED           │
  └───────────────────────────┘

  Key for drawings:
  FLC = Full Load Current
  SF  = Service Factor
  TEFC = Totally Enclosed
         Fan Cooled`,
        description: 'CEC requires motor nameplate data to be recorded on drawings and used for sizing conductors (Rule 28-104), overload protection (Rule 28-306), and branch circuit protection (Rule 28-200). FLC from nameplate is used for OL sizing; CEC Table 44 or 46 values are used for conductor and branch circuit sizing.',
        cecRef: 'CEC Rule 28-104',
      },
    ],
  },
]

/* ================================================================== */
/*  TAB 7 — Mining & Industrial Symbols                                */
/* ================================================================== */

const miningGroups: SymbolGroup[] = [
  {
    title: 'Explosion-Proof & Hazardous Area',
    color: '#ff5252',
    entries: [
      {
        name: 'Explosion-Proof Enclosure (Ex d)',
        ascii:
`  Drawing Symbol:

  ┌──────────────────┐
  │   ╔═══════════╗  │
  │   ║  Ex d     ║  │
  │   ║  IIC T4   ║  │
  │   ║  IP66     ║  │
  │   ╚═══════════╝  │
  └──────────────────┘
  Double-border or
  bold border indicates
  Ex-rated enclosure

  On plan:
  ───[Exd]───`,
        description: 'Explosion-proof (flameproof) enclosure. Contains the explosion internally — flame path joints cool escaping gases below ignition temperature. Used in Class I / Zone 1 areas. Common in mine underground where methane may be present. Must be CSA-certified for the specific gas group and temperature class.',
      },
      {
        name: 'Intrinsically Safe (Ex i)',
        ascii:
`  Drawing Symbol:

  ┌──── IS CIRCUIT ────┐
  │                     │
  │ BLUE wiring         │
  │ required             │
  │                     │
  └─────────────────────┘

  Barrier symbol:
  ═══[IS BARRIER]═══
      (Zener or
       galvanic)

  IS circuit diagram
  shown in BLUE on
  multi-colour drawings`,
        description: 'Intrinsically safe circuit. Energy is limited below ignition levels — cannot produce a spark with enough energy to ignite. Requires IS barriers (Zener or galvanic isolator) at the boundary between safe and hazardous areas. IS wiring must be identified (typically blue). Only protection method permitted in Zone 0.',
        cecRef: 'CEC Rule 18-150',
      },
      {
        name: 'Hazardous Area Boundary on Drawings',
        ascii:
`  Plan Drawing:

  ┌──────────────────────────┐
  │           ZONE 2          │
  │    ┌────────────────┐     │
  │    │    ZONE 1      │     │
  │    │   ┌────────┐   │     │
  │    │   │ ZONE 0 │   │     │
  │    │   │ (tank) │   │     │
  │    │   └────────┘   │     │
  │    └────────────────┘     │
  │                           │
  │  ---- = Zone boundary     │
  │  Hatching indicates zone  │
  └──────────────────────────┘`,
        description: 'Hazardous area boundaries are shown on plan drawings with dashed lines or different hatching patterns for each zone/division. Equipment within each zone must be rated for that classification. The boundary drawing is a critical reference document for selecting equipment.',
      },
      {
        name: 'Equipment Protection Markings',
        ascii:
`  IECEx / CSA Marking:

  Ex  d  IIC  T4  Gb
  │   │   │    │   │
  │   │   │    │   └─ Equipment
  │   │   │    │     Protection
  │   │   │    │     Level
  │   │   │    └─ Temperature
  │   │   │      Class
  │   │   └─ Gas Group
  │   └─ Protection Type
  └─ Explosion Protected

  EPL (Equipment Protection Level):
  Ga = Zone 0  (highest)
  Gb = Zone 1
  Gc = Zone 2  (lowest)
  Da = Zone 20
  Db = Zone 21
  Dc = Zone 22`,
        description: 'IECEx and CSA equipment markings tell you exactly where the equipment can be used. Read the marking left-to-right: protection concept, gas/dust group, temperature class, and equipment protection level. Must match the area classification on the drawing.',
      },
    ],
  },
  {
    title: 'Mining-Specific Drawing Symbols',
    color: '#ffa726',
    entries: [
      {
        name: 'Ground Fault Protection (Mining)',
        ascii:
`  Mine Power System:

  ═══════╤══════════
         │
      ┌──┴──┐
      │ GFR │     Ground Fault
      └──┬──┘     Relay
         │
        NGR       Neutral
        (R)       Grounding
         │        Resistor
        GND

  Mining systems use:
  - High-resistance grounding
  - Sensitive GF detection
  - Typically 5A or less
    ground fault current`,
        description: 'Mining power systems use high-resistance grounding (HRG) with sensitive ground fault relays. The neutral grounding resistor (NGR) limits ground fault current to typically 5A or less, preventing arc flash and shock hazards underground. GFR must trip the feeder on ANY ground fault. This is a critical mine safety system.',
        cecRef: 'CEC Rule 36-302',
      },
      {
        name: 'Mine Power Centre (MPC)',
        ascii:
`  One-Line Symbol:

  ┌─────────────────────┐
  │   MPC-1             │
  │   Mine Power Centre │
  │                     │
  │ IN: 4160V           │
  │ XFMR: 4160/600V    │
  │ OUT: 600V Bus       │
  │                     │
  │ ┤×├ ┤×├ ┤×├ ┤×├    │
  │ GFR on each feeder  │
  └─────────────────────┘

  Portable/skid-mounted
  for underground use`,
        description: 'Mine Power Centre — portable/skid-mounted unit containing transformer, switchgear, and distribution for underground mining. Shown on one-line as a box with internal transformer and breakers. Each outgoing feeder has ground fault protection. Must be rated for mining service (dust-tight, ground fault equipped).',
      },
      {
        name: 'Trailing Cable Connection',
        ascii:
`  Symbol:

  ═══╤═══
     │
  ┌──┴──┐
  │PLUG │    Cable coupler
  │     │    (mine-duty)
  └──┬──┘
     │
  ===╪===    Trailing cable
  ===╪===    (Type W or
  ===╪===     Type SHD-GC)
     │
  ┌──┴──┐
  │ M   │    Mobile
  └─────┘    equipment

  Grounding conductor
  monitoring required`,
        description: 'Trailing cable connections in mining use mine-duty plugs and receptacles rated for the environment. Type W (portable power) or Type SHD-GC (shield and ground check) cable required. Ground continuity monitoring (pilot wire) is mandatory per OHSA Reg 854. Cable must be inspected daily.',
      },
      {
        name: 'Ground Check Monitor',
        ascii:
`  Schematic:

  ┌─────────────────────┐
  │  GCM (Ground Check  │
  │  Monitor)            │
  │                     │
  │  Pilot wire ────────│── Pilot
  │  monitors ground    │   conductor
  │  continuity         │   in cable
  │                     │
  │  If ground breaks:  │
  │  → Trips breaker    │
  │  → Motor stops      │
  └─────────────────────┘

  Required on all trailing
  cables per OHSA Reg 854`,
        description: 'Ground check monitor (GCM). Uses a pilot conductor in the trailing cable to continuously verify ground conductor continuity. If the ground is broken, the GCM trips the breaker, stopping the equipment. This is a critical mining safety system — prevents a fault from occurring with no ground path (shock/electrocution hazard).',
      },
      {
        name: 'Underground Mine One-Line Layout',
        ascii:
`  SURFACE
  ═══════════════════════════
  │ MAIN SUBSTATION         │
  │ 44kV/4160V             │
  ═══════╤═══════════════════
         │ 4160V Feeder
         │ (down shaft)
  ═══════╪═══════════════════
  UNDERGROUND
         │
    ┌────┴────┐
    │  MPC-1  │    Level 1
    │4160/600V│
    └────┬────┘
         │ 600V
    ┌────┼────┬────┐
   ┤×├  ┤×├  ┤×├  ┤×├
   FAN  PUMP CONV DRILL
   GFR  GFR  GFR  GFR
   on   on   on   on
   each each each each`,
        description: 'Typical underground mine power distribution. High voltage (4160V or 13.8kV) from surface substation down the shaft. Mine power centres at each level step down to 600V for distribution to equipment. Every feeder has ground fault protection. All equipment must be approved for underground use.',
      },
      {
        name: 'Ventilation Fan Circuit (Mining)',
        ascii:
`  Typical mine fan control:

  L1──┤E-STOP├──┬──┤OL├──(M)──L2
       NC(all   │
       stations)│
       ├────────┤START├──────┘
       │         NO
       └────────┤M├──────────┘
                 seal

  L1──┤M├───────────(HORN)──L2
       NO         pre-start
                  warning

  L1──┤M├───────────(PL-G)──L2
       NO         fan running

  E-STOP stations at:
  - Fan motor location
  - Mine entrance
  - Control room
  - Each level affected`,
        description: 'Mine ventilation fan control includes multiple E-stop stations (at the fan, mine entrance, control room, and each affected level), pre-start warning horn, and run indication. Ventilation is life-critical in mining — loss of ventilation requires evacuation procedures. Standby fan with auto-transfer may be required.',
      },
      {
        name: 'Conveyor Belt Protection Devices',
        ascii:
`  Belt conveyor safety circuit:

  ──┤E-STOP├──┤PULL├──┤PULL├──
      all      CORD   CORD
      stations  #1     #2
  ──┤BELT├──┤SPEED├──┤ALIGN├──
    SLIP     ZERO    SWITCH
    (NC)    SPEED     (NC)
              (NC)
  ──┤OL├──────────────(M)──

  Pull cord stations
  along full length of belt

  Belt slip: compares
  head/tail pulley speed

  Alignment switch: detects
  belt tracking off-centre`,
        description: 'Conveyor belt protection devices form a comprehensive safety circuit. Pull-cord E-stops along the belt length, belt slip detection (compares head and tail pulley speeds), zero-speed switch (confirms belt is moving), alignment switches (detect belt mistracking), and plugged chute detection. All are wired in series — any fault stops the belt. Required per OHSA Reg 854 for all mine conveyors.',
      },
      {
        name: 'Mine Hoist Signal System',
        ascii:
`  Hoist Signal Code:

  SIGNAL  │ MEANING
  ────────┼───────────────
    1      │ STOP (from any level)
    2      │ HOIST (raise)
    3      │ LOWER
    4      │ CAUTION (men/material)
    1-2    │ Release brakes
    3-2-1  │ Blasting signal

  Signal devices:
  ──┤SIG├──(BELL)──
  At each level + hoist room

  Signals must be audible
  at hoist room and levels`,
        description: 'Mine hoist signal system. Bell or buzzer code system for communication between level stations and the hoist operator. Signal code is standardized per OHSA Reg 854. Signals must be audible and unambiguous. Modern installations may add visual displays, but the bell/buzzer code remains the primary signal system. E-stop capability at every level.',
      },
      {
        name: 'Battery Room Ventilation Monitoring',
        ascii:
`  Battery Room Circuit:

  ┌──────────────────────┐
  │ BATTERY ROOM         │
  │                      │
  │ H2 Sensor ──┤GAS├── │
  │              (NC)    │
  │                      │
  │ Vent Fan ──(FAN)──   │
  │                      │
  │ Flow Switch ──┤FL├── │
  │               (NC)   │
  └──────────────────────┘

  H2 > 1% → Alarm
  H2 > 2% → Disconnect
  Vent fan must run before
  and during charging`,
        description: 'Battery charging rooms in mines are classified as hazardous locations due to hydrogen gas evolution during charging. Ventilation monitoring includes hydrogen sensors (alarm at 1% H2, trip at 2% H2), flow switches to confirm ventilation airflow, and interlocking to prevent charging without ventilation. All equipment must be rated for Class I Division 1 or 2.',
        cecRef: 'CEC Rule 26-544',
      },
    ],
  },
  {
    title: 'Industrial Control Drawing Standards',
    color: '#90caf9',
    entries: [
      {
        name: 'PLC I/O Drawing Notation',
        ascii:
`  Input Module:             Output Module:

  ┌─PLC INPUT──────┐       ┌─PLC OUTPUT─────┐
  │                │       │                │
  │ I:1/0 ─ START  │       │ O:2/0 ─ M1    │
  │ I:1/1 ─ STOP   │       │ O:2/1 ─ SOL-A │
  │ I:1/2 ─ LS-1   │       │ O:2/2 ─ PL-G  │
  │ I:1/3 ─ LS-2   │       │ O:2/3 ─ PL-R  │
  │ I:1/4 ─ PE-1   │       │ O:2/4 ─ HORN  │
  │ I:1/5 ─ PROX-1 │       │                │
  │ I:1/6 ─ OL-1   │       │ Outputs drive  │
  │ I:1/7 ─ E-STOP │       │ relay/contactor│
  │                │       │ coils          │
  └────────────────┘       └────────────────┘`,
        description: 'PLC I/O drawings show the physical connections between field devices and PLC modules. Each input/output is labeled with its PLC address (e.g., I:1/0) and field device tag. This is the bridge between the wiring diagram and the PLC program. Essential for commissioning and troubleshooting.',
      },
      {
        name: 'VFD Connection Diagram',
        ascii:
`  Power:
  L1──┤DISC├──┤FU├── R  ┌─────┐  U──(M)
  L2──┤DISC├──┤FU├── S  │ VFD │  V──(M)
  L3──┤DISC├──┤FU├── T  └─────┘  W──(M)

  Control:
  ┌─VFD TERMINALS────────┐
  │                      │
  │ DI1 ── RUN command   │
  │ DI2 ── FWD/REV       │
  │ DI3 ── Speed 1       │
  │ DI4 ── Speed 2       │
  │ AI1 ── 4-20mA speed  │
  │ AO1 ── 4-20mA freq   │
  │ RLA ── Run status     │
  │ RLB ── Fault status   │
  │ +24V ── Logic supply  │
  │ COM ── Common         │
  └──────────────────────┘`,
        description: 'VFD (Variable Frequency Drive) connection diagram shows power input (R/S/T or L1/L2/L3), motor output (U/V/W), and control terminal connections. Digital inputs for run/stop/speed select, analog inputs for speed reference, and relay outputs for status/fault. Line reactor or dV/dt filter may be shown on output.',
      },
      {
        name: 'Instrument Loop Diagram',
        ascii:
`  4-20mA Loop:

  ┌──XMTR──┐        ┌──PLC──┐
  │  PT-101 │        │ AI:3/0│
  │         │        │       │
  │    (+)──┼───#1───┤(+)    │
  │         │        │       │
  │    (-)──┼───#2───┤(-)    │
  └─────────┘        └───────┘

  24VDC supply from
  PLC analog input card

  Signal: 4mA = 0%
         20mA = 100%
  (0 PSI to 500 PSI)`,
        description: 'Instrument loop diagram shows the connection between a field transmitter and the receiving device (PLC, DCS, panel meter). 4-20mA is standard analog signal: 4mA = 0% (zero), 20mA = 100% (full scale). Two-wire transmitters are powered by the loop. Used for pressure, temperature, level, and flow measurement.',
      },
      {
        name: 'Cable Schedule Format',
        ascii:
`  ┌──────────────────────────────┐
  │ CABLE SCHEDULE               │
  ├─────┬──────┬─────┬───────────┤
  │CABLE│ FROM │  TO │   TYPE    │
  ├─────┼──────┼─────┼───────────┤
  │ C1  │MCC-1 │ M1  │3/C #6+#10│
  │     │BKT 1 │     │TECK90    │
  │     │      │     │600V      │
  ├─────┼──────┼─────┼───────────┤
  │ C2  │MCC-1 │ M2  │3/C #4+#8 │
  │     │BKT 2 │     │TECK90    │
  │     │      │     │600V      │
  ├─────┼──────┼─────┼───────────┤
  │ C3  │PLC   │PT101│2/C #16   │
  │     │AI:3  │     │SHIELDED  │
  └─────┴──────┴─────┴───────────┘`,
        description: 'Cable schedule lists every cable in the installation with tag number, origin, destination, cable type, size, and conduit/tray routing. Essential for installation and maintenance. In mining, cable schedules must be maintained and updated for inspection purposes.',
      },
      {
        name: 'Interlock Logic Diagram',
        ascii:
`  Safety Interlock Logic:

  Guard Door LS-1 (NC) ──┐
                          │
  Light Curtain PE-1 ────┤
                          ├─ ALL must be
  E-Stop (NC) ───────────┤   satisfied
                          │   (series / AND)
  Overload OL-1 (NC) ────┤
                          │
  GFR Status (NC) ────────┘
                          │
                    ──────( M )──
                    Motor runs only
                    when ALL interlocks
                    are satisfied

  If ANY opens → Motor stops
  (fail-safe design)`,
        description: 'Interlock logic diagrams show the safety conditions that must be satisfied for equipment to operate. All safety devices are wired in series (AND logic) — if any interlock opens, the equipment stops. Used to document safety systems for mining equipment, conveyors, crushers, and hoisting systems.',
      },
    ],
  },
]

/* ================================================================== */
/*  Styles                                                             */
/* ================================================================== */

const pillRow: React.CSSProperties = {
  display: 'flex', gap: 6, overflowX: 'auto',
  WebkitOverflowScrolling: 'touch', paddingBottom: 4,
  scrollbarWidth: 'none',
}

const pillBase: React.CSSProperties = {
  flexShrink: 0, minHeight: 56, padding: '0 14px', borderRadius: 28,
  fontSize: 12, fontWeight: 600, border: '2px solid var(--divider)',
  background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
  fontFamily: 'var(--font-sans)',
}

const pillActive: React.CSSProperties = {
  ...pillBase, background: 'var(--primary)', color: '#000',
  border: '2px solid var(--primary)',
}

const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius, 12px)', overflow: 'hidden',
}

const cardHeader: React.CSSProperties = {
  padding: '12px 14px', borderBottom: '1px solid var(--divider)',
  background: 'var(--input-bg)',
}

const cardBody: React.CSSProperties = {
  padding: '14px',
}

const pre: React.CSSProperties = {
  fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
  fontSize: 11, lineHeight: 1.4,
  background: 'var(--input-bg, #1a1a2e)',
  color: 'var(--primary)',
  padding: '12px', borderRadius: 8,
  overflowX: 'auto', whiteSpace: 'pre',
  WebkitOverflowScrolling: 'touch',
  border: '1px solid var(--divider)',
  margin: 0,
}

const sectionLabel: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--primary)',
  textTransform: 'uppercase' as const, letterSpacing: 0.5,
  marginBottom: 8,
}

const descText: React.CSSProperties = {
  fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
}

const cecRefStyle: React.CSSProperties = {
  fontSize: 12, color: 'var(--primary)', fontWeight: 600,
  background: 'var(--input-bg)', borderRadius: 4,
  padding: '4px 8px', display: 'inline-block', marginTop: 8,
}

const tabList: { key: TabKey; label: string }[] = [
  { key: 'standard', label: 'Standard' },
  { key: 'oneline', label: 'One-Line' },
  { key: 'control', label: 'Control' },
  { key: 'diagrams', label: 'Diagrams' },
  { key: 'reading', label: 'Reading' },
  { key: 'csa', label: 'CSA/CEC' },
  { key: 'mining', label: 'Mining' },
]

/* ================================================================== */
/*  Helper Components                                                  */
/* ================================================================== */

function SymbolCard({ entry }: { entry: SymbolEntry }) {
  return (
    <div style={card}>
      <div style={cardHeader}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
          {entry.name}
        </div>
      </div>
      <div style={cardBody}>
        <pre style={pre}>{entry.ascii}</pre>
        <div style={{ ...descText, marginTop: 10 }}>
          {entry.description}
        </div>
        {entry.cecRef && (
          <div style={cecRefStyle}>
            {entry.cecRef}
          </div>
        )}
      </div>
    </div>
  )
}

function SymbolGroupSection({ group }: { group: SymbolGroup }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ ...sectionLabel, color: group.color }}>
        {group.title}
      </div>
      {group.entries.map((entry, i) => (
        <SymbolCard key={i} entry={entry} />
      ))}
    </div>
  )
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export default function ElectricalSymbolsPage() {
  const [tab, setTab] = useState<TabKey>('standard')
  const [searchTerm, setSearchTerm] = useState('')

  /* -------------------------------------------------------------- */
  /*  Filter logic for search                                        */
  /* -------------------------------------------------------------- */

  function filterGroups(groups: SymbolGroup[]): SymbolGroup[] {
    if (!searchTerm.trim()) return groups
    const term = searchTerm.toLowerCase()
    return groups
      .map(g => ({
        ...g,
        entries: g.entries.filter(
          e =>
            e.name.toLowerCase().includes(term) ||
            e.description.toLowerCase().includes(term) ||
            (e.cecRef && e.cecRef.toLowerCase().includes(term))
        ),
      }))
      .filter(g => g.entries.length > 0)
  }

  /* -------------------------------------------------------------- */
  /*  Render helpers                                                  */
  /* -------------------------------------------------------------- */

  function renderStandard() {
    const groups = filterGroups(standardGroups)
    if (groups.length === 0)
      return <div style={{ color: 'var(--text-secondary)', padding: 20, textAlign: 'center' as const }}>No symbols match your search.</div>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map((g, i) => (
          <SymbolGroupSection key={i} group={g} />
        ))}
      </div>
    )
  }

  function renderOneLine() {
    const groups = filterGroups(oneLineGroups)
    if (groups.length === 0)
      return <div style={{ color: 'var(--text-secondary)', padding: 20, textAlign: 'center' as const }}>No symbols match your search.</div>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map((g, i) => (
          <SymbolGroupSection key={i} group={g} />
        ))}
      </div>
    )
  }

  function renderControl() {
    const groups = filterGroups(controlGroups)
    if (groups.length === 0)
      return <div style={{ color: 'var(--text-secondary)', padding: 20, textAlign: 'center' as const }}>No symbols match your search.</div>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map((g, i) => (
          <SymbolGroupSection key={i} group={g} />
        ))}
      </div>
    )
  }

  function renderDiagrams() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={sectionLabel}>
          Diagram Types Comparison
        </div>
        <div style={{
          ...card, padding: 14,
          background: 'var(--input-bg)',
          borderLeft: '4px solid var(--primary)',
        }}>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
            Understanding the differences between diagram types is essential for every electrician. Each type serves a specific purpose and audience. You will encounter all of these on the job — especially in mining and industrial settings.
          </div>
        </div>

        {diagramTypes.map((d, i) => (
          <div key={i} style={card}>
            <div style={cardHeader}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                {d.type}
              </div>
            </div>
            <div style={cardBody}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, marginBottom: 4 }}>
                  Purpose
                </div>
                <div style={descText}>{d.purpose}</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, marginBottom: 4 }}>
                  Who Uses It
                </div>
                <div style={descText}>{d.audience}</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, marginBottom: 4 }}>
                  Level of Detail
                </div>
                <div style={descText}>{d.detail}</div>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, marginBottom: 4 }}>
                  Example
                </div>
                <pre style={pre}>{d.example}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  function renderReading() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={sectionLabel}>
          Schematic Reading Tips
        </div>
        <div style={{
          ...card, padding: 14,
          background: 'var(--input-bg)',
          borderLeft: '4px solid #81c784',
        }}>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
            Reading electrical schematics is one of the most important skills for any electrician. These tips cover the fundamentals of interpreting ladder diagrams, which are the primary troubleshooting tool in industrial and mining electrical work.
          </div>
        </div>

        {readingTips.map((tip, i) => (
          <div key={i} style={card}>
            <div style={cardHeader}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                {tip.title}
              </div>
            </div>
            <div style={cardBody}>
              <div style={{ ...descText, marginBottom: tip.example ? 12 : 0 }}>
                {tip.body}
              </div>
              {tip.example && (
                <pre style={pre}>{tip.example}</pre>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  function renderCSA() {
    const groups = filterGroups(csaGroups)
    if (groups.length === 0)
      return <div style={{ color: 'var(--text-secondary)', padding: 20, textAlign: 'center' as const }}>No symbols match your search.</div>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{
          ...card, padding: 14,
          background: 'var(--input-bg)',
          borderLeft: '4px solid #ff8a65',
        }}>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
            Canadian drawings follow CSA and IEC standards, which differ from American ANSI/IEEE conventions. As an Ontario electrician, you need to recognize both — CSA/IEC is standard on Canadian-designed installations, but imported equipment from the US will use ANSI symbols.
          </div>
        </div>
        {groups.map((g, i) => (
          <SymbolGroupSection key={i} group={g} />
        ))}
      </div>
    )
  }

  function renderMining() {
    const groups = filterGroups(miningGroups)
    if (groups.length === 0)
      return <div style={{ color: 'var(--text-secondary)', padding: 20, textAlign: 'center' as const }}>No symbols match your search.</div>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{
          ...card, padding: 14,
          background: 'var(--input-bg)',
          borderLeft: '4px solid #ff5252',
        }}>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
            Mining and heavy industrial drawings include specialized symbols for hazardous area equipment, ground fault protection systems, and safety interlocks. These are critical for safety in underground and surface mining operations in Ontario. OHSA Regulation 854 (Mines and Mining Plants) governs electrical installations in Ontario mines.
          </div>
        </div>
        {groups.map((g, i) => (
          <SymbolGroupSection key={i} group={g} />
        ))}
      </div>
    )
  }

  /* -------------------------------------------------------------- */
  /*  Render current tab content                                      */
  /* -------------------------------------------------------------- */

  function renderTab() {
    switch (tab) {
      case 'standard': return renderStandard()
      case 'oneline': return renderOneLine()
      case 'control': return renderControl()
      case 'diagrams': return renderDiagrams()
      case 'reading': return renderReading()
      case 'csa': return renderCSA()
      case 'mining': return renderMining()
      default: return renderStandard()
    }
  }

  /* -------------------------------------------------------------- */
  /*  Main render                                                     */
  /* -------------------------------------------------------------- */

  return (
    <PageWrapper title="Electrical Symbols">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search symbols, devices, CEC rules..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: 48,
              padding: '0 16px 0 44px',
              fontSize: 14,
              borderRadius: 'var(--radius, 12px)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
              color: 'var(--text)',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <svg
            width={18} height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
            }}
          >
            <circle cx={11} cy={11} r={8} />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute', right: 8, top: '50%',
                transform: 'translateY(-50%)',
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', background: 'transparent',
                border: 'none', cursor: 'pointer', fontSize: 18,
              }}
              aria-label="Clear search"
            >
              x
            </button>
          )}
        </div>

        {/* Tab Pills */}
        <div style={pillRow}>
          {tabList.map(t => (
            <button
              key={t.key}
              style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTab()}

        {/* Quick Reference Legend */}
        <div style={{ ...card, marginTop: 16 }}>
          <div style={{ ...cardHeader, background: 'var(--surface)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
              Quick Reference — Common Abbreviations
            </div>
          </div>
          <div style={cardBody}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 4,
            }}>
              {[
                ['NO', 'Normally Open'],
                ['NC', 'Normally Closed'],
                ['SPST', 'Single Pole Single Throw'],
                ['SPDT', 'Single Pole Double Throw'],
                ['DPST', 'Double Pole Single Throw'],
                ['DPDT', 'Double Pole Double Throw'],
                ['CB', 'Circuit Breaker'],
                ['MCCB', 'Molded Case Circuit Breaker'],
                ['CT', 'Current Transformer'],
                ['PT/VT', 'Potential/Voltage Transformer'],
                ['CR', 'Control Relay'],
                ['TR', 'Timer Relay'],
                ['OL', 'Overload Relay'],
                ['M', 'Motor Contactor'],
                ['PL', 'Pilot Light'],
                ['PB', 'Pushbutton'],
                ['LS', 'Limit Switch'],
                ['SS', 'Selector Switch'],
                ['PE', 'Photoelectric Sensor'],
                ['PROX', 'Proximity Sensor'],
                ['SOL', 'Solenoid Valve'],
                ['HOA', 'Hand-Off-Auto'],
                ['MCC', 'Motor Control Centre'],
                ['ATS', 'Auto Transfer Switch'],
                ['UPS', 'Uninterruptible Power Supply'],
                ['VFD', 'Variable Frequency Drive'],
                ['GFR', 'Ground Fault Relay'],
                ['NGR', 'Neutral Grounding Resistor'],
                ['GCM', 'Ground Check Monitor'],
                ['MPC', 'Mine Power Centre'],
                ['GFCI', 'Ground Fault Circuit Interrupter'],
                ['AFCI', 'Arc Fault Circuit Interrupter'],
                ['SPD', 'Surge Protective Device'],
                ['Ex d', 'Explosion-proof (Flameproof)'],
                ['Ex i', 'Intrinsically Safe'],
                ['TEFC', 'Totally Enclosed Fan Cooled'],
                ['FLC', 'Full Load Current'],
                ['AIC', 'Ampere Interrupting Capacity'],
                ['LOTO', 'Lockout/Tagout'],
                ['CEC', 'Canadian Electrical Code'],
                ['CSA', 'Canadian Standards Assoc.'],
                ['OHSA', 'Occupational Health & Safety Act'],
                ['Reg 854', 'Ontario Mining Regulation'],
              ].map(([abbr, full]) => (
                <div key={abbr} style={{
                  display: 'flex', gap: 8, padding: '6px 0',
                  borderBottom: '1px solid var(--divider)',
                  fontSize: 13, alignItems: 'baseline',
                }}>
                  <span style={{
                    fontWeight: 700, color: 'var(--primary)',
                    fontFamily: 'var(--font-mono, monospace)',
                    minWidth: 50, flexShrink: 0,
                  }}>
                    {abbr}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {full}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CEC Rules Quick Lookup */}
        <div style={{ ...card, marginTop: 8 }}>
          <div style={{ ...cardHeader, background: 'var(--surface)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
              Key CEC Rules for Drawing Interpretation
            </div>
          </div>
          <div style={cardBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['Rule 2-100', 'Drawings and specifications required for installations'],
                ['Rule 4-036', 'Conductor colour identification'],
                ['Rule 10-604', 'Grounding conductor identification on drawings'],
                ['Rule 14-100', 'Overcurrent protection requirements'],
                ['Rule 14-200', 'Fuse and breaker ratings'],
                ['Rule 14-500', 'Switch requirements'],
                ['Rule 14-700', 'Disconnect switch requirements'],
                ['Rule 18-100', 'Hazardous locations — general'],
                ['Rule 18-150', 'Intrinsically safe systems'],
                ['Rule 26-210', 'Capacitor installations'],
                ['Rule 26-240', 'Transformer installations'],
                ['Rule 26-400', 'Panelboard requirements'],
                ['Rule 26-656', 'AFCI protection requirements'],
                ['Rule 26-700', 'Receptacle requirements'],
                ['Rule 28-104', 'Motor nameplate requirements'],
                ['Rule 28-200', 'Motor branch circuit protection'],
                ['Rule 28-306', 'Motor overload protection'],
                ['Rule 28-400', 'Motor controller requirements'],
                ['Rule 36-100', 'Metering installation requirements'],
                ['Rule 36-302', 'Ground fault protection — high resistance grounding'],
                ['Rule 46-100', 'Emergency power systems'],
                ['Rule 46-200', 'Emergency lighting requirements'],
                ['Rule 46-300', 'Exit sign requirements'],
              ].map(([rule, desc]) => (
                <div key={rule} style={{
                  display: 'flex', gap: 12, padding: '8px 0',
                  borderBottom: '1px solid var(--divider)',
                  fontSize: 13, alignItems: 'baseline',
                }}>
                  <span style={{
                    fontWeight: 700, color: 'var(--primary)',
                    fontFamily: 'var(--font-mono, monospace)',
                    minWidth: 100, flexShrink: 0, fontSize: 12,
                  }}>
                    {rule}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ontario Mining Electrical Safety Notes */}
        <div style={{
          ...card, marginTop: 8,
          borderLeft: '4px solid #ff5252',
        }}>
          <div style={{ ...cardHeader, background: 'var(--surface)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#ff5252' }}>
              Ontario Mining — Electrical Drawing Requirements
            </div>
          </div>
          <div style={cardBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'OHSA Reg 854, s.160 — Electrical installations must comply with the Ontario Electrical Safety Code (based on CEC).',
                'Reg 854, s.161 — Drawings of the electrical distribution system must be kept current and available at the mine site.',
                'Reg 854, s.163 — All electrical equipment underground must be suitable for the conditions (moisture, dust, temperature).',
                'Reg 854, s.164 — Ground fault protection required on all circuits supplying portable/mobile equipment underground.',
                'Reg 854, s.167 — Trailing cables must have a grounding conductor monitored by a ground check circuit.',
                'Reg 854, s.168 — Disconnecting switches must be provided for all motors and must be lockable.',
                'Reg 854, s.195 — Emergency power is required for hoisting, pumping, ventilation, and communication systems.',
                'All electrical work in Ontario mines requires a valid Certificate of Qualification (309A or 442A).',
                'Drawings must reflect the as-built condition — update drawings after every modification.',
                'Keep a complete set of drawings in the electrical room/control room and a backup copy at the mine office.',
              ].map((note, i) => (
                <div key={i} style={{
                  fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
                  padding: '6px 0',
                  borderBottom: i < 9 ? '1px solid var(--divider)' : 'none',
                }}>
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
