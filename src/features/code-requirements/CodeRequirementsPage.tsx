import { useState } from 'react'
import PageWrapper from '../../layout/PageWrapper'

/* ------------------------------------------------------------------ */
/*  CEC Code Requirements by Task — Ontario Electrical/Mining          */
/*  Organized by what the electrician is DOING, not by code section    */
/* ------------------------------------------------------------------ */

type TabKey =
  | 'disconnect'
  | 'teck'
  | 'motor'
  | 'panel'
  | 'receptacle'
  | 'grounding'
  | 'hazardous'
  | 'temporary'
  | 'transformer'

interface TabDef {
  key: TabKey
  label: string
  shortLabel: string
}

const tabs: TabDef[] = [
  { key: 'disconnect', label: 'Wiring a Disconnect', shortLabel: 'Disconnects' },
  { key: 'teck', label: 'Running TECK Cable', shortLabel: 'TECK Cable' },
  { key: 'motor', label: 'Motor Installations', shortLabel: 'Motors' },
  { key: 'panel', label: 'Panel Installations', shortLabel: 'Panels' },
  { key: 'receptacle', label: 'Receptacle Circuits', shortLabel: 'Receptacles' },
  { key: 'grounding', label: 'Grounding & Bonding', shortLabel: 'Grounding' },
  { key: 'hazardous', label: 'Hazardous Locations', shortLabel: 'Haz. Loc.' },
  { key: 'temporary', label: 'Temporary Installations', shortLabel: 'Temp Power' },
  { key: 'transformer', label: 'Transformer Installations', shortLabel: 'Transformers' },
]

/* ------------------------------------------------------------------ */
/*  Shared Data Types                                                  */
/* ------------------------------------------------------------------ */

interface CodeRule {
  rule: string
  title: string
  detail: string
  critical?: boolean
  miningNote?: string
}

interface CodeSection {
  heading: string
  description?: string
  rules: CodeRule[]
}

interface QuickRef {
  label: string
  value: string
  note?: string
}

/* ------------------------------------------------------------------ */
/*  TAB 1 — WIRING A DISCONNECT                                       */
/* ------------------------------------------------------------------ */

const disconnectSections: CodeSection[] = [
  {
    heading: 'Disconnect Required',
    description: 'Every electrical installation must have a disconnect to isolate it from the supply.',
    rules: [
      {
        rule: 'Rule 14-010',
        title: 'Disconnect Required for Equipment',
        detail: 'A disconnecting means shall be provided for each consumer\'s service, each building or structure supplied, and each piece of equipment that may require isolation for maintenance. The disconnect must open all ungrounded conductors simultaneously.',
        critical: true,
      },
      {
        rule: 'Rule 14-012',
        title: 'Disconnect Location',
        detail: 'The disconnect must be located so it is readily accessible, within sight of the equipment it serves, and at a point closest to where the conductors enter the building. For service entrances, the disconnect must be at the point of entry.',
        critical: true,
      },
      {
        rule: 'Rule 14-010(b)',
        title: 'Disconnect as Service Entrance',
        detail: 'The service disconnect shall be located at the point where the supply conductors enter the building. It must be the first device on the load side of the supply conductors and must be accessible to the supply authority.',
      },
      {
        rule: 'Rule 14-014',
        title: 'Grouping of Disconnects',
        detail: 'Where more than one disconnect is required at a single location, they shall be grouped together. A maximum of 6 disconnects is permitted at any one location for a service entrance.',
      },
    ],
  },
  {
    heading: 'Motor Disconnect Specifics',
    description: 'Additional disconnect rules that apply specifically to motor circuits.',
    rules: [
      {
        rule: 'Rule 28-600',
        title: 'Motor Disconnect Rating',
        detail: 'The motor disconnect must be rated at least 115% of the motor full-load current (FLC) from CEC Table D16. For fused disconnects, the switch must be rated to handle the fuse size installed. HP-rated switches are required for motor loads unless the switch interrupts only the control circuit.',
        critical: true,
        miningNote: 'In mining, motor disconnects must be lockable and located within sight of the motor or have a provision for locking in the open position per O. Reg. 854 s. 160.',
      },
      {
        rule: 'Rule 28-602',
        title: 'Motor Disconnect Location',
        detail: 'The motor disconnect must be within sight of the motor and the controller, OR must be capable of being locked in the open position. "Within sight" means visible and within 9 m (30 ft) of the equipment.',
      },
      {
        rule: 'Rule 14-414',
        title: 'Disconnect for Motor-Operated Equipment',
        detail: 'Each motor shall have its own disconnect. The disconnect must open all ungrounded supply conductors. It must clearly indicate whether it is open or closed. A motor disconnect shall be horsepower-rated or have an ampere rating not less than 115% of the motor FLC.',
        critical: true,
      },
      {
        rule: 'Rule 28-604',
        title: 'Disconnect Type',
        detail: 'The motor disconnect can be a listed motor-circuit switch (HP rated), a molded-case switch, a molded-case circuit breaker, or an instantaneous-trip breaker with a listed combination starter. For motors over 2 HP at 300V or less, or over 100 HP, special requirements apply.',
      },
    ],
  },
  {
    heading: 'TECK Cable at Disconnects',
    description: 'When TECK90 cable feeds a disconnect, termination and grounding rules apply.',
    rules: [
      {
        rule: 'Rule 12-618',
        title: 'Cable Termination at Enclosures',
        detail: 'TECK cable must be terminated using an approved cable gland (connector) that secures the armor, provides a bonding connection via the armor, and protects the cable jacket from damage. The gland must be sized to match the cable outer diameter.',
        critical: true,
      },
      {
        rule: 'Rule 12-610',
        title: 'Armor as Bonding Conductor',
        detail: 'The interlocked aluminum armor of TECK90 cable is recognized as a bonding conductor per CEC. This is acceptable ONLY if the armor continuity is maintained by proper gland connections at both ends. An additional bonding conductor inside the cable (green) is also required.',
      },
      {
        rule: 'Rule 10-614',
        title: 'Bonding at Disconnect Enclosure',
        detail: 'The bonding conductor must be connected to the bonding terminal (green screw) inside the disconnect enclosure. All metal parts must be bonded together to create a continuous fault current path back to the source.',
      },
      {
        rule: 'Rule 12-612',
        title: 'Cable Entry Protection',
        detail: 'Where cables enter an enclosure, bushings or approved fittings must be used to protect the conductors from abrasion at the point of entry. The cable sheath must extend at least 6 mm into the enclosure.',
      },
    ],
  },
  {
    heading: 'Labeling & Lockout',
    description: 'Marking, identification, and lockout requirements for disconnects.',
    rules: [
      {
        rule: 'Rule 2-100',
        title: 'Equipment Labeling',
        detail: 'Disconnects must be permanently labeled to identify: the equipment they serve, the voltage, and the source of supply. Labels must be durable and legible. In bilingual workplaces, labels in both English and French may be required.',
        critical: true,
      },
      {
        rule: 'Rule 14-010(d)',
        title: 'Disconnect Marking — Open/Closed',
        detail: 'Every disconnect must clearly indicate its open (OFF) and closed (ON) positions. The position must be evident by visual inspection of the handle or indicator.',
      },
      {
        rule: 'Rule 2-304',
        title: 'Lockout Provisions',
        detail: 'Disconnects must be capable of being locked in the open position. This requires either a built-in lock hasp on the disconnect handle or a provision for attaching a padlock. This is a CEC requirement independent of provincial lockout/tagout regulations.',
        critical: true,
        miningNote: 'O. Reg. 854 s. 160 requires personal locks with unique keys. Every worker must apply their own lock. Group lockout procedures using a lockout box are permitted for multiple-worker situations.',
      },
      {
        rule: 'O. Reg. 854, s. 159',
        title: 'Zero Energy Verification (Mining)',
        detail: 'After locking out, verify de-energization with a properly rated voltage tester. Test the tester on a known live source BEFORE and AFTER testing the isolated equipment. This "live-dead-live" test is mandatory in Ontario mines.',
        critical: true,
        miningNote: 'This applies to all mining electrical installations and is frequently tested on mine electrician examinations.',
      },
      {
        rule: 'Rule 14-010(c)',
        title: 'Accessible Means of Disconnect',
        detail: 'The disconnect handle must be readily accessible without using ladders, removing obstacles, or reaching over equipment. The centre of the handle grip should be no higher than 2.0 m above the floor or working platform.',
      },
    ],
  },
  {
    heading: 'Grounding at the Disconnect',
    description: 'Grounding and bonding requirements inside disconnect enclosures.',
    rules: [
      {
        rule: 'Rule 10-400',
        title: 'Equipment Grounding Conductor',
        detail: 'An equipment grounding conductor (bonding conductor) must be installed with all circuit conductors. It must be sized per CEC Table 16 based on the rating of the overcurrent device protecting the circuit. Copper conductors are required unless aluminum is specifically permitted.',
      },
      {
        rule: 'Rule 10-500',
        title: 'Bonding of Disconnect Enclosure',
        detail: 'The metal enclosure of the disconnect switch must be bonded to the grounding system. This can be achieved through the TECK armor (with proper gland), through a separate bonding conductor, or through metal conduit that serves as the bonding path.',
      },
      {
        rule: 'Rule 10-906',
        title: 'Grounding Terminal in Disconnect',
        detail: 'Every disconnect enclosure must have an approved grounding terminal or bus for the connection of bonding conductors. The terminal must be identified with a green marking or the word "GROUND" or the ground symbol.',
      },
    ],
  },
]

const disconnectQuickRef: QuickRef[] = [
  { label: 'Min. disconnect rating for motors', value: '115% of motor FLC', note: 'Per Table D16' },
  { label: 'Max. handle height from floor', value: '2.0 m (6\'-7")', note: 'Rule 14-010(c)' },
  { label: 'Max. disconnects at service entrance', value: '6', note: 'Rule 14-014' },
  { label: 'Within sight distance', value: '9 m (30 ft)', note: 'Rule 28-602' },
  { label: 'Standard disconnect sizes', value: '30A, 60A, 100A, 200A, 400A, 600A', note: 'CSA standard sizes' },
  { label: 'HP-rated switch required', value: 'Motor loads unless control circuit only', note: 'Rule 28-604' },
  { label: 'Armor extends into enclosure', value: 'Min. 6 mm', note: 'Rule 12-612' },
]

/* ------------------------------------------------------------------ */
/*  TAB 2 — RUNNING TECK CABLE                                        */
/* ------------------------------------------------------------------ */

const teckSections: CodeSection[] = [
  {
    heading: 'Support & Strapping',
    description: 'CEC rules for how often and how TECK cable must be supported.',
    rules: [
      {
        rule: 'Rule 12-616 / Table 21',
        title: 'Cable Support Spacing',
        detail: 'TECK cable must be supported at intervals not exceeding those in CEC Table 21. For TECK90 run horizontally on a surface, supports are required every 1.5 m (5 ft). For vertical runs, support every 1.0 m to 2.0 m depending on cable size. Supports must be within 300 mm of every box, fitting, or enclosure.',
        critical: true,
      },
      {
        rule: 'Rule 12-614',
        title: 'Type of Support',
        detail: 'Approved cable straps, clips, or hangers must be used. The support must not damage the cable jacket. Cable ties are acceptable for bundling but NOT as the sole means of support on a surface. Straps must be secured to the building structure.',
      },
      {
        rule: 'Rule 12-620',
        title: 'Cable Tray Installation',
        detail: 'TECK cable may be installed in cable tray without additional strapping. The tray itself acts as the support. Cables must be secured in the tray at changes of direction and at tray transitions. Cable tray fill limits per Rule 12-2200 apply.',
      },
      {
        rule: 'Rule 12-2200',
        title: 'Cable Tray Fill',
        detail: 'Single-layer tray: cables in a single layer with maintained spacing. Multi-layer tray: total cable cross-section shall not exceed the usable tray area. Ladder tray: cables may be stacked but derating factors apply for more than one layer. Power cables and control cables should be separated.',
        miningNote: 'In mine tunnels, cable tray must be secured to the rock face or structure and protected from vehicle traffic. O. Reg. 854 s. 164 requires cables to be kept clear of mobile equipment paths.',
      },
    ],
  },
  {
    heading: 'Bending Radius',
    description: 'Minimum bend radius to prevent cable damage.',
    rules: [
      {
        rule: 'Rule 12-614(2)',
        title: 'Minimum Bending Radius',
        detail: 'The minimum bending radius for TECK cable is 6 times the cable outer diameter for cables 1/0 AWG and smaller, and 8 times the outer diameter for cables larger than 1/0 AWG. This is measured to the inside of the bend. Exceeding the bend radius will damage the interlocked armor and compromise the cable.',
        critical: true,
      },
      {
        rule: 'Manufacturer Spec',
        title: 'Bending at Low Temperature',
        detail: 'TECK90 is rated for installation at temperatures down to -40 degrees C. However, the cable jacket stiffens significantly in cold weather. At temperatures below -25 degrees C, warm the cable before bending. Cold bending causes jacket cracking and armor displacement.',
        miningNote: 'Surface mining installations in Northern Ontario regularly encounter extreme cold. Pre-warming TECK cable in a heated building before running outside is standard practice.',
      },
    ],
  },
  {
    heading: 'Burial & Protection',
    description: 'Requirements for direct burial and physical protection of TECK cable.',
    rules: [
      {
        rule: 'Rule 12-012 / Table 53',
        title: 'Direct Burial Depth',
        detail: 'TECK90 is approved for direct burial. Minimum burial depths from CEC Table 53: Under roadways or parking areas: 900 mm (36 in). Under areas not subject to vehicle traffic: 600 mm (24 in). Under concrete slabs (min. 50 mm thick): 450 mm (18 in). All measurements are from finished grade to top of cable.',
        critical: true,
      },
      {
        rule: 'Rule 12-012(3)',
        title: 'Warning Tape',
        detail: 'A continuous warning ribbon or tape must be installed 150 mm to 300 mm above all direct-buried cables. The tape must be a distinctive colour (typically red for power cables) and marked "CAUTION BURIED ELECTRICAL CABLE" or equivalent.',
      },
      {
        rule: 'Rule 12-012(5)',
        title: 'Mechanical Protection at Grade Transition',
        detail: 'Where cable transitions from underground to above-ground, mechanical protection (conduit sleeve, channel, or rigid cover) must extend from 300 mm below finished grade to at least 1.5 m (5 ft) above finished grade. PVC schedule 80 or rigid metal conduit is typically used.',
        critical: true,
      },
      {
        rule: 'Rule 12-614(3)',
        title: 'Protection from Damage',
        detail: 'TECK cable installed where subject to mechanical damage must be protected by guard strips, rigid conduit, channel, or other approved means. Areas subject to damage include: below 1.5 m on walls exposed to traffic, across doorways, and near moving equipment.',
        miningNote: 'O. Reg. 854 s. 164 requires mine cables to be protected from mobile equipment, falling rock, and blasting. Steel angle iron or channel protection is standard underground.',
      },
    ],
  },
  {
    heading: 'Termination & Glands',
    description: 'Proper methods for terminating TECK cable at equipment and junction boxes.',
    rules: [
      {
        rule: 'Rule 12-618',
        title: 'Approved Cable Gland Required',
        detail: 'Every TECK cable termination must use an approved gland (connector) that: (a) secures the cable jacket and armor to the enclosure, (b) provides a bonding path through the armor, (c) provides strain relief, and (d) seals the entry point. The gland must be CSA or cUL listed.',
        critical: true,
      },
      {
        rule: 'CSA C22.2 No. 65',
        title: 'Gland Selection by Cable OD',
        detail: 'Select the gland based on the cable\'s outer diameter (over the PVC jacket). The armor diameter determines the inner gland cone. Use manufacturer data: each gland trade size covers a range of cable ODs. Undersized glands cannot grip the armor; oversized glands leave gaps.',
      },
      {
        rule: 'Rule 12-610',
        title: 'Armor Bonding via Gland',
        detail: 'The cable gland must make a continuous metal-to-metal connection between the cable armor and the enclosure. The gland cone teeth must bite into the armor strips. After tightening, the armor must not rotate independently of the gland body. Torque the gland to manufacturer specifications.',
      },
      {
        rule: 'Installation Practice',
        title: 'Gland Assembly Steps',
        detail: 'Step 1: Slide locknut and gland body onto cable. Step 2: Strip outer PVC jacket back to expose armor. Step 3: Cut armor and fold back any sharp edges. Step 4: Strip inner bedding to expose conductors. Step 5: Insert cable into enclosure. Step 6: Thread gland body into enclosure knockout. Step 7: Tighten gland cone onto armor. Step 8: Tighten locknut inside enclosure. Verify armor bonding with continuity test.',
      },
    ],
  },
  {
    heading: 'Ampacity & Derating',
    description: 'Current-carrying capacity and derating considerations.',
    rules: [
      {
        rule: 'Rule 4-004 / Table 2',
        title: 'Conductor Ampacity',
        detail: 'TECK90 conductor ampacity is determined by CEC Table 2 (copper) or Table 4 (aluminum) based on the 90 degree C column. However, if the termination equipment is rated 75 degrees C (most disconnects and panels), conductors must be sized based on the 75 degree C ampacity.',
        critical: true,
      },
      {
        rule: 'Rule 4-004(4) / Table 5C',
        title: 'Grouping Derating',
        detail: 'When multiple TECK cables are grouped together (in cable tray, bundled, or touching), derating factors from CEC Table 5C apply. 1-3 cables: no derating. 4-6 cables: 80% derating factor. 7-9 cables: 70%. 10-24 cables: 60%. 25-42 cables: 50%. Over 42 cables: 45%.',
      },
      {
        rule: 'Rule 4-004(8) / Table 5A',
        title: 'Ambient Temperature Correction',
        detail: 'If the ambient temperature exceeds 30 degrees C, apply the correction factors from CEC Table 5A. For TECK90 at 90 degree C rating: at 35 degrees C ambient, factor is 0.96. At 40 degrees C: 0.91. At 45 degrees C: 0.87. At 50 degrees C: 0.82.',
        miningNote: 'Underground mine temperatures can be quite warm at depth. Some deep Ontario mines operate at 40+ degrees C ambient. Always verify ambient conditions before sizing cables.',
      },
    ],
  },
]

const teckQuickRef: QuickRef[] = [
  { label: 'Horizontal support spacing', value: '1.5 m (5 ft)', note: 'Table 21' },
  { label: 'Support near enclosure', value: 'Within 300 mm', note: 'Rule 12-616' },
  { label: 'Min. bend radius (1/0 and smaller)', value: '6x cable OD', note: 'Rule 12-614(2)' },
  { label: 'Min. bend radius (larger than 1/0)', value: '8x cable OD', note: 'Rule 12-614(2)' },
  { label: 'Burial depth under roadway', value: '900 mm (36 in)', note: 'Table 53' },
  { label: 'Burial depth no vehicle traffic', value: '600 mm (24 in)', note: 'Table 53' },
  { label: 'Warning tape above buried cable', value: '150-300 mm above cable', note: 'Rule 12-012(3)' },
  { label: 'Protection above grade', value: '1.5 m (5 ft) min.', note: 'Rule 12-012(5)' },
  { label: 'Cold installation limit', value: '-40 degrees C', note: 'TECK90 rating' },
  { label: 'Grouping derating 4-6 cables', value: '80%', note: 'Table 5C' },
  { label: 'Grouping derating 7-9 cables', value: '70%', note: 'Table 5C' },
]

/* ------------------------------------------------------------------ */
/*  TAB 3 — MOTOR INSTALLATIONS                                       */
/* ------------------------------------------------------------------ */

const motorSections: CodeSection[] = [
  {
    heading: 'Branch Circuit Protection',
    description: 'Overcurrent protection on the branch circuit feeding the motor.',
    rules: [
      {
        rule: 'Rule 28-200',
        title: 'Motor Branch Circuit Overcurrent Protection',
        detail: 'Each motor branch circuit shall have overcurrent protection sized based on the motor FLC from CEC Table D16 (NOT the nameplate). Maximum overcurrent device sizes: Time-delay fuse: 175% of FLC. Non-time-delay fuse: 300% of FLC. Inverse-time breaker: 250% of FLC. Instantaneous-trip breaker: 800% of FLC (design B motors). If the calculated value does not correspond to a standard size, the next larger standard size is permitted.',
        critical: true,
      },
      {
        rule: 'Rule 28-204',
        title: 'Motor Short Circuit Protection Exception',
        detail: 'Where the motor overcurrent device values calculated from Rule 28-200 are not sufficient for starting, they may be increased: Time-delay fuse: up to 225%. Non-time-delay fuse: up to 400%. Inverse-time breaker: up to 400%. This is allowed only where the motor protection values are insufficient for starting inrush.',
      },
      {
        rule: 'Rule 28-210',
        title: 'Multiple Motors on One Branch Circuit',
        detail: 'Two or more motors may be connected to a single branch circuit only if: each motor is rated 1 HP or less, the full-load rating of each motor does not exceed 6A, the branch circuit overcurrent device does not exceed 15A (for 600V or less) or 20A, and each motor has individual overload protection.',
      },
    ],
  },
  {
    heading: 'Overload Protection',
    description: 'Running overload protection to prevent motor damage from sustained overcurrent.',
    rules: [
      {
        rule: 'Rule 28-300',
        title: 'Motor Overload Protection Required',
        detail: 'Each motor shall have overload protection. Overloads protect the motor from sustained overcurrent during running conditions. They are typically heaters in a starter or electronic overloads. Overloads are set based on the motor NAMEPLATE FLA, not the CEC table value.',
        critical: true,
      },
      {
        rule: 'Rule 28-302',
        title: 'Overload Sizing',
        detail: 'Overload device trip setting: For motors with service factor 1.15 or greater: not more than 125% of nameplate FLA. For motors with temperature rise not exceeding 40 degrees C: not more than 125% of nameplate FLA. For all other motors: not more than 115% of nameplate FLA.',
      },
      {
        rule: 'Rule 28-304',
        title: 'Overload Device Location',
        detail: 'Overload devices must be in each ungrounded conductor. For 3-phase motors: overload required in all 3 phases (this detects single-phasing). This is critical for motor protection in mining where power quality issues can cause single-phasing.',
        critical: true,
        miningNote: 'Mining operations frequently experience single-phasing due to long feeder runs, fuse blowing, and transformer issues. Electronic overloads with phase-loss detection are strongly recommended over thermal overloads.',
      },
      {
        rule: 'Rule 28-306',
        title: 'Automatic Restart',
        detail: 'Overload devices that can restart a motor automatically after an overload trip are not permitted on motors where unexpected restarting would be hazardous. This includes conveyors, crushers, hoists, and most mining equipment. Manual reset overloads are required.',
        miningNote: 'O. Reg. 854 effectively requires manual-reset overloads on all mining motor installations for worker safety.',
      },
    ],
  },
  {
    heading: 'Motor Disconnect',
    description: 'Disconnect switch requirements for motor circuits.',
    rules: [
      {
        rule: 'Rule 28-600',
        title: 'Motor Disconnect Required',
        detail: 'Each motor must have a disconnect that: opens all ungrounded conductors, is horsepower-rated or rated at least 115% of motor FLC, is within sight of the motor and controller (or lockable in open position), clearly indicates open/closed position.',
        critical: true,
      },
      {
        rule: 'Rule 28-602',
        title: 'Within Sight Requirement',
        detail: 'The disconnect must be within sight (visible and within 9 m / 30 ft) of the motor location AND the controller location. If the disconnect is NOT within sight, it must be capable of being locked in the open position and a lockout procedure must be established.',
        miningNote: 'In mining, disconnect-within-sight is strongly preferred. Where not possible, lock-open provisions with O. Reg. 854 lockout procedures are mandatory.',
      },
      {
        rule: 'Rule 28-606',
        title: 'Disconnect for Group Installation',
        detail: 'A single disconnect may serve a group of motors ONLY if: the disconnect is rated for the combined load, all motors are in the same room as the disconnect, all motors are within sight of the disconnect, and no motor exceeds 1 HP.',
      },
    ],
  },
  {
    heading: 'Conductor Sizing',
    description: 'How to size the conductors feeding a motor.',
    rules: [
      {
        rule: 'Rule 28-104',
        title: 'Motor Branch Circuit Conductor Sizing',
        detail: 'Conductors supplying a single motor must have an ampacity not less than 125% of the motor FLC from CEC Table D16. For motors with intermittent duty or short-time duty, lower percentages may apply per Table D16 notes. Always use the CEC table value, NOT the motor nameplate current.',
        critical: true,
      },
      {
        rule: 'Rule 28-106',
        title: 'Conductor Sizing for Multiple Motors',
        detail: 'Conductors supplying two or more motors: size at 125% of the largest motor FLC plus the sum of the FLC of all remaining motors. This accounts for starting inrush of the largest motor while others are running.',
      },
      {
        rule: 'Rule 28-108',
        title: 'Motor Feeder Overcurrent Protection',
        detail: 'The feeder overcurrent device for multiple motors: maximum setting = largest motor branch circuit OCP + sum of FLC of all other motors. This provides short-circuit protection for the feeder while allowing any motor to start.',
      },
      {
        rule: 'CEC Table D16',
        title: 'Motor Full-Load Current Tables',
        detail: 'ALWAYS use CEC Table D16 for motor FLC values when sizing conductors, disconnects, and overcurrent protection. Table D16 provides standard FLC values organized by HP, voltage, and phase. Do NOT use motor nameplate current for circuit sizing. Nameplate is used ONLY for overload heater selection (Rule 28-302).',
        critical: true,
      },
    ],
  },
  {
    heading: 'Controller & Nameplate',
    description: 'Motor controller and identification requirements.',
    rules: [
      {
        rule: 'Rule 28-400',
        title: 'Motor Controller Required',
        detail: 'Each motor must have a controller. The controller must be rated in HP at the application voltage, or be rated in amperes at not less than the motor FLC. For motors 1/8 HP or less, the branch circuit overcurrent device can serve as the controller.',
      },
      {
        rule: 'Rule 28-402',
        title: 'Controller Location',
        detail: 'The controller must be within sight of the motor OR the disconnect for the controller must be lockable in the open position. For mining applications, combination starter units with integral disconnect are common and satisfy both controller and disconnect requirements.',
      },
      {
        rule: 'Rule 28-500',
        title: 'Motor Nameplate',
        detail: 'Every motor must have a visible nameplate showing: manufacturer, rated voltage, rated frequency, number of phases, full-load current, horsepower or kW rating, rated speed (RPM), service factor, locked-rotor code letter, and temperature rise or insulation class.',
      },
      {
        rule: 'Rule 2-100',
        title: 'Circuit Identification at Motor',
        detail: 'The motor disconnect and controller must be identified with durable labeling indicating the motor it serves, the supply source, and voltage. This is especially important in mining where many motors and starters may be in the same area.',
      },
    ],
  },
]

const motorQuickRef: QuickRef[] = [
  { label: 'Branch circuit conductor sizing', value: '125% of Table D16 FLC', note: 'Rule 28-104' },
  { label: 'Time-delay fuse max', value: '175% of FLC', note: 'Rule 28-200 (up to 225% for starting)' },
  { label: 'Non-time-delay fuse max', value: '300% of FLC', note: 'Rule 28-200 (up to 400% for starting)' },
  { label: 'Inverse-time breaker max', value: '250% of FLC', note: 'Rule 28-200 (up to 400% for starting)' },
  { label: 'Overload setting (SF >= 1.15)', value: '125% of nameplate FLA', note: 'Rule 28-302' },
  { label: 'Overload setting (all others)', value: '115% of nameplate FLA', note: 'Rule 28-302' },
  { label: 'Disconnect rating', value: '115% of FLC minimum', note: 'Rule 28-600' },
  { label: 'Use nameplate current for', value: 'Overload sizing ONLY', note: 'Rule 28-302' },
  { label: 'Use CEC Table D16 for', value: 'Conductor, OCP, disconnect sizing', note: 'Rule 28-104' },
]

/* ------------------------------------------------------------------ */
/*  TAB 4 — PANEL INSTALLATIONS                                       */
/* ------------------------------------------------------------------ */

const panelSections: CodeSection[] = [
  {
    heading: 'Working Space & Access',
    description: 'Clearance requirements in front of and around electrical panels.',
    rules: [
      {
        rule: 'Rule 2-308',
        title: 'Working Space in Front of Panels',
        detail: 'A clear working space must be maintained in front of all panelboards, switchboards, and motor control centres. Minimum depth: 1.0 m (3 ft 3 in) for equipment 150V-to-ground or less, 1.0 m for 151V-600V. Minimum width: 750 mm (30 in) or the width of the equipment, whichever is greater. Minimum headroom: 2.0 m (6 ft 7 in). The space must be level and clear of all obstructions.',
        critical: true,
      },
      {
        rule: 'Rule 2-308(2)',
        title: 'Access and Egress',
        detail: 'For equipment rated 1200A or more: at least one entrance not less than 600 mm wide and 2.0 m high is required at each end of the working space. For switchboards and panelboards over 1.8 m wide, two means of egress are required.',
      },
      {
        rule: 'Rule 2-310',
        title: 'Dedicated Panel Space',
        detail: 'The space equal to the width and depth of the panel extending from floor to ceiling or to a height of 1.8 m above the panel, whichever is less, must be dedicated to the electrical installation. No piping, ductwork, or other non-electrical equipment is permitted in this space.',
        critical: true,
      },
      {
        rule: 'Rule 26-402',
        title: 'Panel Height Requirements',
        detail: 'The centre of the operating handle of the highest breaker or switch in the panel must not be more than 1.7 m (5 ft 7 in) above the floor or working platform. This ensures all breakers can be reached without a ladder or step stool.',
        critical: true,
      },
    ],
  },
  {
    heading: 'Panel Labeling & Directory',
    description: 'Identification and circuit directory requirements.',
    rules: [
      {
        rule: 'Rule 2-100(1)',
        title: 'Panel Identification',
        detail: 'Each panel must be durably and legibly marked with: panel designation (e.g., "LP-1"), voltage and phase configuration (e.g., "120/208V, 3-phase, 4-wire"), the source of supply (e.g., "Fed from MDP breaker 3"), and main breaker or fuse rating.',
        critical: true,
      },
      {
        rule: 'Rule 26-400(2)',
        title: 'Circuit Directory Required',
        detail: 'A legible circuit directory must be provided on the inside of each panel door. It must identify every circuit by description of the load or area served. The directory must correspond to the circuit numbering on the breakers. Pencil entries are not acceptable; the directory must be permanent.',
        critical: true,
      },
      {
        rule: 'Rule 2-100(3)',
        title: 'Source & Voltage Marking',
        detail: 'Where more than one voltage exists in the same building or installation, a warning label must be applied to every panel, junction box, and equipment indicating the highest voltage present. Typical warning: "DANGER: 600V" or "CAUTION: MULTIPLE VOLTAGES".',
      },
    ],
  },
  {
    heading: 'Overcurrent Protection',
    description: 'Breaker and fuse requirements within the panel.',
    rules: [
      {
        rule: 'Rule 14-104',
        title: 'Main Overcurrent Protection',
        detail: 'Each panelboard must have a main overcurrent device unless it is part of a switchboard or motor control centre where the feeder overcurrent device provides protection. The main device rating must not exceed the panel bus rating.',
      },
      {
        rule: 'Rule 14-100',
        title: 'Overcurrent Device at Point of Supply',
        detail: 'Overcurrent protection shall be provided at the point where conductors receive their supply. This means each circuit leaving the panel must be protected by a breaker or fuse rated to protect the conductor ampacity.',
        critical: true,
      },
      {
        rule: 'Rule 14-104(2)',
        title: 'Panel Bus Rating',
        detail: 'The sum of all branch circuit breaker ratings may exceed the panel bus rating (this is normal since not all loads operate simultaneously). However, the demand load calculated per CEC Section 8 must not exceed the bus rating and main overcurrent device.',
      },
      {
        rule: 'Rule 14-010',
        title: 'Overcurrent Device as Disconnect',
        detail: 'A circuit breaker in a panel can serve as both the overcurrent device and the disconnect for the circuit it feeds, provided it opens all ungrounded conductors simultaneously and can be locked in the open position.',
      },
    ],
  },
  {
    heading: 'Grounding & Neutral Buses',
    description: 'Grounding bus, neutral bus, and their separation in panels.',
    rules: [
      {
        rule: 'Rule 10-204',
        title: 'Neutral and Ground Bus Separation',
        detail: 'In sub-panels (any panel downstream of the main service panel), the neutral (grounded conductor) bus and the grounding (bonding) bus MUST be separate and insulated from each other. The neutral bus must be insulated from the panel enclosure. Only at the main service panel are neutral and ground bonded together.',
        critical: true,
      },
      {
        rule: 'Rule 10-204(1)(a)',
        title: 'Main Bonding Jumper',
        detail: 'At the main service panel (and only at the main), the neutral bus is bonded to the panel enclosure through a main bonding jumper. This is the single point where neutral and ground connect. In sub-panels, removing the bonding screw or strap is critical.',
      },
      {
        rule: 'Rule 10-400',
        title: 'Grounding Bus Required',
        detail: 'Each panel must have a grounding bus (ground bar) for the connection of all equipment grounding conductors. The bus must be bonded to the panel enclosure. In sub-panels, an insulated neutral bar and a separate ground bar bonded to the enclosure is required.',
      },
      {
        rule: 'Rule 10-812',
        title: 'Equipment Grounding Conductor Termination',
        detail: 'Equipment grounding conductors must be terminated at the panel grounding bus. Each conductor should have its own terminal or share a terminal only if the terminal is listed for multiple conductors. Two conductors under one screw is not permitted unless the terminal is designed for it.',
      },
    ],
  },
  {
    heading: 'Panel Schedule & Installation',
    description: 'Practical installation and panel schedule considerations.',
    rules: [
      {
        rule: 'Rule 26-400',
        title: 'Panelboard Construction',
        detail: 'Panelboards must be listed and labeled by a recognized testing organization (CSA, cUL). The panel must be installed in a cabinet or enclosure. NEMA ratings for enclosures: NEMA 1 (indoor general), NEMA 3R (outdoor rainproof), NEMA 4 (watertight), NEMA 12 (industrial dust-tight).',
      },
      {
        rule: 'Rule 8-304(1)',
        title: 'Branch Circuit Loading',
        detail: 'No branch circuit in a panel shall be loaded to more than 80% of its rating for continuous loads (loads that run for 3+ hours). A 15A circuit can carry max 12A continuous. A 20A circuit can carry max 16A continuous. For non-continuous loads, 100% of the breaker rating is permitted.',
        critical: true,
      },
      {
        rule: 'Rule 12-3022',
        title: 'Conductor Bending Space in Panel',
        detail: 'Adequate space must be provided in the panel for bending conductors at terminals. Minimum bending space depends on conductor size and number of conductors per terminal. For 14-10 AWG: minimum 100 mm. For 8-6 AWG: minimum 125 mm. Larger conductors require more space per CEC Table 17.',
      },
      {
        rule: 'Rule 26-402(2)',
        title: 'Panel Mounting',
        detail: 'Panels must be securely mounted to the building structure. Surface-mounted panels must be plumb and level. Flush-mounted panels must have the trim ring flush with the finished wall surface. Panels must not be installed in bathrooms, clothes closets, or stairways.',
      },
    ],
  },
]

const panelQuickRef: QuickRef[] = [
  { label: 'Min. working space depth', value: '1.0 m (3 ft 3 in)', note: 'Rule 2-308' },
  { label: 'Min. working space width', value: '750 mm (30 in)', note: 'Rule 2-308' },
  { label: 'Min. headroom', value: '2.0 m (6 ft 7 in)', note: 'Rule 2-308' },
  { label: 'Max. breaker handle height', value: '1.7 m (5 ft 7 in)', note: 'Rule 26-402' },
  { label: 'Continuous load derating', value: '80% of breaker rating', note: 'Rule 8-304(1)' },
  { label: 'N-G bond location', value: 'Main service panel ONLY', note: 'Rule 10-204' },
  { label: 'Panel not permitted in', value: 'Bathrooms, closets, stairways', note: 'Rule 26-402(2)' },
]

/* ------------------------------------------------------------------ */
/*  TAB 5 — RECEPTACLE CIRCUITS                                        */
/* ------------------------------------------------------------------ */

const receptacleSections: CodeSection[] = [
  {
    heading: 'GFCI Protection',
    description: 'Ground fault circuit interrupter requirements.',
    rules: [
      {
        rule: 'Rule 26-700(1)',
        title: 'GFCI Required Locations',
        detail: 'GFCI protection is required on all 125V, 15A and 20A receptacles in: Bathrooms (all receptacles within 1.5 m of a sink), kitchens (countertop receptacles), outdoor locations, garages and accessory buildings, unfinished basements, crawl spaces, within 1.5 m of any sink (laundry, utility, wet bar), rooftop HVAC receptacles.',
        critical: true,
      },
      {
        rule: 'Rule 26-700(8)',
        title: 'GFCI at Rooftops',
        detail: 'All receptacles installed on rooftops for servicing HVAC equipment must be GFCI protected. The receptacle must be located within 7.5 m of the HVAC equipment it serves.',
      },
      {
        rule: 'Rule 26-700(11)',
        title: 'GFCI for Washroom/Shower Facilities',
        detail: 'In commercial and industrial washrooms, all receptacles must be GFCI protected. This includes mining camp accommodations, mine site change rooms, and industrial shower facilities.',
        miningNote: 'Mine site change rooms, dry houses, and shower facilities all require GFCI on every receptacle.',
      },
      {
        rule: 'Rule 76-012',
        title: 'GFCI on Construction Sites',
        detail: 'All 15A and 20A, 125V receptacles used on construction sites must have GFCI protection. This can be a GFCI receptacle, a GFCI breaker, or a portable GFCI device. This rule applies to ALL construction site receptacles without exception.',
        critical: true,
        miningNote: 'Mine construction and expansion projects fall under this rule. Portable GFCI devices are commonly used on mine construction circuits.',
      },
      {
        rule: 'Rule 26-700(12)',
        title: 'GFCI Trip Level',
        detail: 'GFCI devices must trip at a ground fault current of 5 mA (+/- 1 mA). The device must trip within 25 ms at fault currents of 264 mA or more. GFCI devices must be tested monthly using the built-in test button.',
      },
    ],
  },
  {
    heading: 'AFCI Protection',
    description: 'Arc fault circuit interrupter requirements.',
    rules: [
      {
        rule: 'Rule 26-656',
        title: 'AFCI Required Locations',
        detail: 'AFCI protection is required for all 120V, 15A and 20A branch circuits supplying receptacles in dwelling units in the following rooms: bedrooms, living rooms, family rooms, dining rooms, hallways, closets, recreation rooms, sunrooms, dens, libraries, and similar living areas.',
        critical: true,
      },
      {
        rule: 'Rule 26-656(2)',
        title: 'AFCI Type Requirements',
        detail: 'The AFCI device must be a combination-type AFCI that detects both series and parallel arcing faults. Branch/feeder type AFCIs are no longer acceptable for new installations. The AFCI breaker must be installed at the panel (not at the outlet).',
      },
      {
        rule: 'Rule 26-656(3)',
        title: 'AFCI Exemptions',
        detail: 'AFCI is NOT required for: dedicated circuits supplying a single appliance (e.g., fridge), circuits protected by GFCI where AFCI would cause nuisance tripping, fire alarm circuits, circuits for sump pumps, and some hardwired loads. Check the current CEC edition for the complete list of exemptions.',
      },
      {
        rule: 'Rule 26-656 Note',
        title: 'Dual Function AFCI/GFCI',
        detail: 'Dual function AFCI/GFCI breakers are available and can satisfy both Rule 26-700 and Rule 26-656 simultaneously. These are commonly used in bedrooms that also have receptacles near bathroom sinks.',
      },
    ],
  },
  {
    heading: 'Circuit Loading & Spacing',
    description: 'Maximum loading on receptacle circuits and receptacle placement.',
    rules: [
      {
        rule: 'Rule 8-304(1)',
        title: 'Continuous Load Limitation',
        detail: 'Receptacle circuits supplying continuous loads shall not exceed 80% of the breaker rating. For a 15A circuit: max continuous load is 12A. For a 20A circuit: max continuous load is 16A. If the load is non-continuous, the circuit can be loaded to 100% of rating.',
        critical: true,
      },
      {
        rule: 'Rule 26-712(a)',
        title: 'Maximum 12 Outlets per Circuit',
        detail: 'A maximum of 12 outlets (receptacles or lighting points) are permitted on a single 15A branch circuit for residential occupancies. This is an Ontario Electrical Safety Code (OESC) bulletin requirement that supplements the CEC.',
      },
      {
        rule: 'Rule 26-710(a)',
        title: 'Receptacle Spacing — General Areas',
        detail: 'In dwelling unit habitable rooms, receptacles must be installed so that no point along the floor line of any usable wall space is more than 1.8 m (6 ft) from a receptacle. This effectively requires a receptacle every 3.6 m (12 ft) along walls.',
      },
      {
        rule: 'Rule 26-710(b)',
        title: 'Kitchen Counter Receptacles',
        detail: 'Kitchen countertop receptacles: one receptacle is required for every 600 mm (2 ft) of countertop frontage. No point along the countertop shall be more than 900 mm (3 ft) from a receptacle. Island countertops require at least one receptacle.',
      },
      {
        rule: 'Rule 26-710(g)',
        title: 'Bathroom Receptacles',
        detail: 'At least one receptacle must be installed within 1.0 m of each basin in a bathroom. This receptacle must be GFCI protected and on a circuit dedicated to bathroom receptacles (or the bathroom receptacle and lighting can share a circuit if they are in the same bathroom).',
      },
    ],
  },
  {
    heading: 'Outdoor & Special Receptacles',
    description: 'Requirements for outdoor, kitchen, and bathroom receptacle circuits.',
    rules: [
      {
        rule: 'Rule 26-714',
        title: 'Outdoor Receptacles — Dwelling',
        detail: 'At least one GFCI-protected receptacle must be installed at the front and back of every dwelling unit with access to the outdoors. Outdoor receptacles must be in a weatherproof enclosure rated at least NEMA 3R. In-use covers are required where the receptacle may be used while a cord is plugged in.',
        critical: true,
      },
      {
        rule: 'Rule 26-710(d)',
        title: 'Kitchen Split Receptacles',
        detail: 'Kitchen countertop receptacles in dwelling units must be supplied by a minimum of two 15A or 20A circuits (the split circuit requirement). No other outlets may be connected to these circuits. Each T-slot duplex receptacle counts as one outlet regardless of whether it is split-wired.',
      },
      {
        rule: 'Rule 26-710(f)',
        title: 'Laundry Receptacle',
        detail: 'At least one receptacle must be provided within 1.0 m of the laundry area. This must be on a separate 20A circuit dedicated to laundry room receptacles. GFCI protection is required if within 1.5 m of a sink.',
      },
      {
        rule: 'Rule 26-720',
        title: 'Receptacle Types & Ratings',
        detail: 'Receptacles must be CSA configuration type matching the circuit. 15A/125V: NEMA 5-15R. 20A/125V: NEMA 5-20R (T-slot). 30A/125V: NEMA L5-30R (locking). Industrial receptacles at 250V, 600V, and 3-phase configurations must use the correct CSA/NEMA configuration to prevent cross-connection.',
      },
    ],
  },
]

const receptacleQuickRef: QuickRef[] = [
  { label: 'GFCI trip level', value: '5 mA', note: 'Rule 26-700(12)' },
  { label: 'GFCI test frequency', value: 'Monthly', note: 'Manufacturer recommendation' },
  { label: 'Max outlets per 15A circuit (Ontario)', value: '12', note: 'OESC Bulletin' },
  { label: 'Max continuous load on 15A', value: '12A (80%)', note: 'Rule 8-304(1)' },
  { label: 'Max continuous load on 20A', value: '16A (80%)', note: 'Rule 8-304(1)' },
  { label: 'General receptacle spacing', value: 'Every 3.6 m (12 ft) max', note: 'Rule 26-710(a)' },
  { label: 'Kitchen counter spacing', value: 'Every 1.8 m (6 ft) max', note: 'Rule 26-710(b)' },
  { label: 'Bathroom receptacle distance', value: 'Within 1.0 m of basin', note: 'Rule 26-710(g)' },
  { label: 'Min kitchen counter circuits', value: '2 circuits minimum', note: 'Rule 26-710(d)' },
]

/* ------------------------------------------------------------------ */
/*  TAB 6 — GROUNDING & BONDING                                       */
/* ------------------------------------------------------------------ */

const groundingSections: CodeSection[] = [
  {
    heading: 'System Grounding (Section 10)',
    description: 'Connecting the electrical system to earth.',
    rules: [
      {
        rule: 'Rule 10-002',
        title: 'Systems Required to be Grounded',
        detail: 'AC systems shall be grounded where the system can be grounded so that the maximum voltage-to-ground does not exceed 150V. This includes: 120/240V single-phase, 120/208V three-phase wye, and 347/600V three-phase wye systems. Delta systems are NOT required to be grounded but may be.',
        critical: true,
      },
      {
        rule: 'Rule 10-004',
        title: 'Point of System Ground Connection',
        detail: 'Systems must be grounded at the transformer secondary (or generator). The grounding connection is made at the neutral point (wye systems) or at one corner of a delta system. Only ONE point of system grounding is permitted per separately derived system.',
      },
      {
        rule: 'Rule 10-102',
        title: 'Grounding Conductor — Service',
        detail: 'A grounding conductor must connect the grounded system conductor (neutral) to the grounding electrode at the service. This conductor must be copper, continuous without splice (except by irreversible compression or exothermic welding), and sized per Rule 10-812.',
      },
      {
        rule: 'Rule 10-106',
        title: 'Grounding Electrode',
        detail: 'The grounding electrode can be: a metal water pipe in direct contact with earth for 3 m or more, a concrete-encased electrode (rebar in footing), a ground plate (min. 0.6 m2 surface area), a ground rod (min. 3 m long, driven full length), or a ground ring. The electrode must achieve a resistance to ground not exceeding 25 ohms (10 ohms is recommended).',
        critical: true,
      },
    ],
  },
  {
    heading: 'Equipment Grounding Conductors',
    description: 'Sizing and installing the bonding conductors that protect people and equipment.',
    rules: [
      {
        rule: 'Rule 10-814 / Table 16',
        title: 'Equipment Grounding Conductor Sizing',
        detail: 'The equipment grounding conductor (bonding conductor) must be sized based on the rating of the overcurrent device on the circuit, per CEC Table 16. Key sizes: 15A OCP = 14 AWG Cu. 20A = 12 AWG. 30A = 10 AWG. 60A = 10 AWG. 100A = 8 AWG. 200A = 6 AWG. 400A = 3 AWG. 600A = 1 AWG. 800A = 1/0 AWG. 1200A = 3/0 AWG.',
        critical: true,
      },
      {
        rule: 'Rule 10-614',
        title: 'Bonding Continuity',
        detail: 'The bonding path must be continuous from every piece of equipment back to the service grounding point. All connections must be made with approved connectors, lugs, or clamps. No solder-only connections. The bonding path must have sufficiently low impedance to facilitate the operation of overcurrent devices under fault conditions.',
        critical: true,
      },
      {
        rule: 'Rule 10-400(2)',
        title: 'Bonding Conductor Material',
        detail: 'Equipment grounding conductors may be copper, aluminum (where permitted and properly sized), or the metal armor/sheath of approved cables (TECK90 armor, rigid conduit, EMT with approved fittings). Where aluminum is used, it must be sized one trade size larger than the equivalent copper conductor.',
      },
      {
        rule: 'Rule 10-618',
        title: 'Bonding Around Flexible Connections',
        detail: 'Where flexible conduit or flexible cable assemblies are used, a separate bonding conductor must be installed if the flexible section exceeds 1.8 m in length or if the flexible conduit/cable is not approved as a bonding means. Liquid-tight flexible conduit over 1.8 m always requires a separate bonding conductor.',
      },
    ],
  },
  {
    heading: 'Bonding Jumpers',
    description: 'Bonding jumpers at service equipment and within systems.',
    rules: [
      {
        rule: 'Rule 10-600',
        title: 'Main Bonding Jumper',
        detail: 'The main bonding jumper connects the grounded conductor (neutral) to the equipment grounding system at the service. This is the single point where neutral and ground are connected. It must be a copper conductor or bus, sized per Table 16, and located at the service panel or separately derived system.',
        critical: true,
      },
      {
        rule: 'Rule 10-614(2)',
        title: 'Bonding Jumper Sizing',
        detail: 'Bonding jumpers for service equipment must be sized per Table 16 based on the service overcurrent device rating. For example: 200A service requires a minimum 6 AWG Cu bonding jumper. 400A service requires minimum 3 AWG Cu. 600A requires 1 AWG Cu.',
      },
      {
        rule: 'Rule 10-620',
        title: 'Bonding of Metal Water Piping',
        detail: 'Interior metal water piping systems must be bonded to the electrical grounding system. The bonding jumper must be attached to the water pipe within 1.5 m of the point where it enters the building. If the water meter is in the line, a bonding jumper must bridge the meter.',
      },
      {
        rule: 'Rule 10-700',
        title: 'Intersystem Bonding',
        detail: 'An intersystem bonding termination must be provided at the service for connection of communications systems (telephone, cable TV, data). This termination must be accessible and capable of accepting at least 3 bonding conductors. It provides a common ground reference for all systems entering the building.',
      },
    ],
  },
  {
    heading: 'Grounding Electrodes',
    description: 'Types, installation, and testing of grounding electrodes.',
    rules: [
      {
        rule: 'Rule 10-700(1)',
        title: 'Ground Rod Requirements',
        detail: 'Ground rods must be: copper or copper-clad steel, minimum 16 mm (5/8 in) diameter, minimum 3.0 m (10 ft) long, and driven to their full length. If rock prevents full driving, the rod may be driven at an angle not exceeding 45 degrees from vertical, or buried in a trench at least 600 mm deep.',
        critical: true,
      },
      {
        rule: 'Rule 10-700(2)',
        title: 'Supplemental Electrodes',
        detail: 'If a single ground rod does not achieve 25 ohms resistance-to-ground, a supplemental electrode must be installed. The supplemental electrode must be at least 1.8 m (6 ft) from the first rod. The two rods are bonded together with a continuous conductor.',
      },
      {
        rule: 'Rule 10-706',
        title: 'Concrete-Encased Electrode (Ufer Ground)',
        detail: 'A concrete-encased electrode consists of at least 6.0 m (20 ft) of 4 AWG copper conductor or 13 mm (1/2 in) rebar encased in at least 50 mm (2 in) of concrete near the bottom of a footing in direct contact with earth. This is one of the most effective grounding electrodes.',
      },
      {
        rule: 'Rule 10-902',
        title: 'Grounding Electrode Conductor Protection',
        detail: 'The grounding electrode conductor must be protected from physical damage where exposed. It must be securely fastened to the surface on which it is carried. It may be run through the interior of the building without protection if not exposed to physical damage.',
        miningNote: 'In mining, ground beds require special attention. O. Reg. 854 requires ground fault protection testing monthly. Ground resistance should be tested annually with a fall-of-potential method.',
      },
    ],
  },
]

const groundingQuickRef: QuickRef[] = [
  { label: '15A circuit ground conductor', value: '14 AWG Cu', note: 'Table 16' },
  { label: '20A circuit ground conductor', value: '12 AWG Cu', note: 'Table 16' },
  { label: '60A circuit ground conductor', value: '10 AWG Cu', note: 'Table 16' },
  { label: '100A circuit ground conductor', value: '8 AWG Cu', note: 'Table 16' },
  { label: '200A circuit ground conductor', value: '6 AWG Cu', note: 'Table 16' },
  { label: '400A circuit ground conductor', value: '3 AWG Cu', note: 'Table 16' },
  { label: '600A circuit ground conductor', value: '1 AWG Cu', note: 'Table 16' },
  { label: 'Max ground rod resistance', value: '25 ohms (10 recommended)', note: 'Rule 10-106' },
  { label: 'Min ground rod length', value: '3.0 m (10 ft)', note: 'Rule 10-700(1)' },
  { label: 'Supplemental rod spacing', value: '1.8 m (6 ft) min', note: 'Rule 10-700(2)' },
  { label: 'N-G bond point', value: 'Service panel only', note: 'Rule 10-600' },
]

/* ------------------------------------------------------------------ */
/*  TAB 7 — HAZARDOUS LOCATIONS                                       */
/* ------------------------------------------------------------------ */

const hazardousSections: CodeSection[] = [
  {
    heading: 'Zone Classification System',
    description: 'IEC Zone system used in the CEC (Sections 18 and 20).',
    rules: [
      {
        rule: 'CEC Section 18',
        title: 'Zone System — Gas/Vapour (Zone 0, 1, 2)',
        detail: 'Zone 0: Explosive atmosphere present continuously or for long periods. Only intrinsically safe equipment (Ex ia). Zone 1: Explosive atmosphere likely during normal operation. Explosion-proof (Ex d), increased safety (Ex e), or intrinsically safe (Ex ib) equipment required. Zone 2: Explosive atmosphere not likely, only abnormal conditions. Non-sparking (Ex n) or energy-limited equipment acceptable.',
        critical: true,
      },
      {
        rule: 'CEC Section 18',
        title: 'Zone System — Dust (Zone 20, 21, 22)',
        detail: 'Zone 20: Combustible dust cloud present continuously or frequently (inside silos, hoppers). Requires dust-tight enclosures (Ex tD). Zone 21: Combustible dust cloud likely during normal operation (near conveyor transfers). Dust ignition-proof (Ex tD) or pressurized (Ex pD) required. Zone 22: Combustible dust cloud only under abnormal conditions. Dust-tight enclosures sufficient.',
        critical: true,
        miningNote: 'Mining crusher stations, ore storage bins, conveyor transfer points, and screening areas are commonly classified Zone 21 or Zone 22 for dust. Sulfide ore dust is particularly hazardous.',
      },
      {
        rule: 'CEC Section 18 / 20',
        title: 'Class/Division vs Zone System',
        detail: 'The CEC supports both the Class/Division system (legacy, Section 18 Appendix J) and the Zone system (preferred, Sections 18/20). New installations should use the Zone system. Class I Div 1 roughly corresponds to Zone 1, Class I Div 2 to Zone 2. The Zone system provides a more graduated approach to hazard assessment.',
      },
    ],
  },
  {
    heading: 'Equipment Marking',
    description: 'Understanding Ex markings on hazardous location equipment.',
    rules: [
      {
        rule: 'Rule 18-060',
        title: 'Equipment Marking Requirements',
        detail: 'All electrical equipment installed in a hazardous location must be marked with: the protection type (Ex d, Ex e, Ex i, etc.), the zone suitability (Zone 0, 1, or 2), the gas group (IIA, IIB, IIC), the temperature class (T1-T6), and the equipment category. This marking must be visible after installation.',
        critical: true,
      },
      {
        rule: 'Rule 18-060',
        title: 'Ex d — Flameproof (Explosion-Proof)',
        detail: 'Enclosure designed to contain an internal explosion and prevent it from igniting the surrounding atmosphere. The flame path (machined flanges) cools the escaping gases below the ignition temperature. Used for motors, junction boxes, and lighting in Zone 1. Covers must be secured with all bolts; a single missing bolt invalidates the protection.',
      },
      {
        rule: 'Rule 18-060',
        title: 'Ex e — Increased Safety',
        detail: 'Equipment designed with extra measures to prevent sparks, arcs, or excessive temperatures during normal operation. No switching contacts or sparking parts. Used for terminal boxes, light fixtures, and junction boxes in Zone 1. Terminations must maintain creepage and clearance distances.',
      },
      {
        rule: 'Rule 18-060',
        title: 'Ex i — Intrinsically Safe (ia and ib)',
        detail: 'Circuit energy is limited so that no spark or thermal effect can cause ignition. Ex ia: safe with two faults (Zone 0 suitable). Ex ib: safe with one fault (Zone 1). Intrinsic safety barriers (zener or galvanic) are installed in the safe area. All wiring must be segregated from non-IS circuits. Blue cable or conduit identification required.',
        critical: true,
      },
      {
        rule: 'Rule 18-060',
        title: 'Ex n — Non-Sparking / Non-Incendive',
        detail: 'Equipment that does not produce arcs, sparks, or temperatures capable of ignition in normal operation. Only suitable for Zone 2 (abnormal conditions). Common for instrumentation, control equipment, and some lighting in Zone 2 areas.',
      },
      {
        rule: 'Rule 18-064',
        title: 'Temperature Class',
        detail: 'Equipment must have a temperature class (T-rating) that does not exceed the auto-ignition temperature of the gas or dust present. T1: 450 degrees C (lowest restriction). T2: 300 degrees C. T3: 200 degrees C (gasoline, diesel). T4: 135 degrees C. T5: 100 degrees C. T6: 85 degrees C (most restrictive). Select equipment with T-class at or below the ignition temperature of the hazard.',
        critical: true,
      },
    ],
  },
  {
    heading: 'Wiring Methods',
    description: 'Approved wiring methods in hazardous locations.',
    rules: [
      {
        rule: 'Rule 18-100',
        title: 'Wiring Methods — Zone 1',
        detail: 'Zone 1 gas areas: threaded rigid metal conduit with explosion-proof fittings, MI (mineral-insulated) cable, or TECK cable with approved hazardous location glands. All connections must be explosion-proof or increased-safety rated. At least 5 full threads engagement on conduit fittings.',
        critical: true,
      },
      {
        rule: 'Rule 18-102',
        title: 'Wiring Methods — Zone 2',
        detail: 'Zone 2 gas areas permit: any wiring method allowed in Zone 1, plus non-metallic sheathed cable (in some cases), TECK cable with standard industrial glands, rigid metal conduit, EMT (with approved fittings), and flexible metal conduit (limited lengths).',
      },
      {
        rule: 'Rule 18-100(6)',
        title: 'Conduit Thread Engagement',
        detail: 'In Zone 1, conduit connections to explosion-proof enclosures must have at least 5 full threads engaged (wrench-tight). Thread compound approved for the application must be used. NPT threads must be clean and undamaged. This ensures the flame path integrity at the conduit entry.',
      },
    ],
  },
  {
    heading: 'Sealing Requirements',
    description: 'Where and how to install conduit seals in hazardous locations.',
    rules: [
      {
        rule: 'Rule 18-108',
        title: 'Conduit Seal — Zone 1 Boundary',
        detail: 'A conduit seal is required at each point where a conduit passes from a Zone 1 or Zone 0 area into an unclassified area. The seal must be installed within 450 mm (18 in) of the enclosure in Zone 1. The seal prevents the migration of gas through the conduit system from the hazardous area to the non-hazardous area.',
        critical: true,
      },
      {
        rule: 'Rule 18-108(3)',
        title: 'Seal at Equipment',
        detail: 'A conduit seal is required within 450 mm (18 in) of every explosion-proof (Ex d) enclosure containing arcing or sparking contacts (switches, breakers, relays). Seals are also required on conduits 53 mm (2 in) trade size and larger entering an explosion-proof enclosure.',
      },
      {
        rule: 'Rule 18-108(5)',
        title: 'Seal Compound',
        detail: 'Seals must be filled with an approved sealing compound that is resistant to the chemicals present in the area, has a melting point above 93 degrees C, and prevents the passage of gas or vapour. The compound thickness must be at least equal to the trade size of the conduit. No splices or taps are permitted inside a seal fitting.',
      },
      {
        rule: 'Rule 18-108(4)',
        title: 'Cable Seal Requirements',
        detail: 'Where TECK cable or MI cable passes from a hazardous area to a non-hazardous area, an approved cable seal or transition fitting must be used at the boundary. This prevents gas from migrating along the cable interstices into the safe area.',
        miningNote: 'In mining, where methane may be present (gassy mines), sealing is critical at every transition from the classified area to the fresh air intake or non-classified area.',
      },
    ],
  },
  {
    heading: 'Mining-Specific Hazardous Area Rules',
    description: 'Ontario mining regulations for hazardous electrical installations.',
    rules: [
      {
        rule: 'O. Reg. 854, s. 152',
        title: 'Mine Electrical Installations — General',
        detail: 'All electrical installations in Ontario mines must comply with the CEC AND the Ontario Mining Regulations. Where the mining regulations are more stringent, they take precedence. The mine\'s chief electrician or electrical engineer is responsible for ensuring compliance.',
        critical: true,
      },
      {
        rule: 'O. Reg. 854, s. 165',
        title: 'Methane Detection in Gassy Mines',
        detail: 'In mines designated as gassy (methane-bearing), continuous methane monitoring is required. Electrical equipment must be automatically de-energized when methane concentration reaches 1.0% by volume. Intrinsically safe (Ex ia) methane detectors are required at the working face.',
        critical: true,
        miningNote: 'Some Ontario gold mines encounter methane in certain ore zones. The mine ventilation engineer and electrical engineer must coordinate classification areas with the mining engineer.',
      },
      {
        rule: 'O. Reg. 854, s. 166',
        title: 'Underground Fuel Storage',
        detail: 'Underground fuel storage and refueling areas must be classified as Class I Zone 1 or Zone 2 as appropriate. Explosion-proof or intrinsically safe electrical equipment is required. Ventilation must maintain fuel vapour concentrations below 25% of the Lower Explosive Limit (LEL).',
      },
      {
        rule: 'CEC Rule 20-002',
        title: 'Mine Surface Fuel Stations',
        detail: 'Mine surface fuel dispensing stations follow CEC Section 20 for fuel dispensing areas. Zone 1 extends 6 m horizontally from the dispenser nozzle and up to 1.2 m above grade. Zone 2 extends from 6 m to 7.5 m from the nozzle. All electrical equipment within these zones must be appropriately rated.',
      },
    ],
  },
]

const hazardousQuickRef: QuickRef[] = [
  { label: 'Zone 0 equipment', value: 'Ex ia ONLY (intrinsically safe)', note: 'Section 18' },
  { label: 'Zone 1 equipment', value: 'Ex d, Ex e, Ex ib, Ex p', note: 'Section 18' },
  { label: 'Zone 2 equipment', value: 'Ex n, Ex nA, Ex nR, or Zone 1 types', note: 'Section 18' },
  { label: 'Conduit thread engagement', value: '5 full threads minimum', note: 'Rule 18-100(6)' },
  { label: 'Seal distance from enclosure', value: 'Within 450 mm (18 in)', note: 'Rule 18-108' },
  { label: 'Methane auto-trip level', value: '1.0% by volume', note: 'O. Reg. 854 s. 165' },
  { label: 'T3 temperature class', value: '200 degrees C (gasoline/diesel)', note: 'Rule 18-064' },
  { label: 'IS circuit identification', value: 'Blue cable / conduit', note: 'Installation practice' },
]

/* ------------------------------------------------------------------ */
/*  TAB 8 — TEMPORARY INSTALLATIONS                                    */
/* ------------------------------------------------------------------ */

const temporarySections: CodeSection[] = [
  {
    heading: 'Temporary Power Rules',
    description: 'CEC Section 76 governs temporary wiring for construction and similar activities.',
    rules: [
      {
        rule: 'Rule 76-000',
        title: 'Scope — Temporary Installations',
        detail: 'CEC Section 76 applies to temporary wiring for: construction, remodeling, demolition, seasonal/holiday displays, experimental/testing purposes, and emergencies. Temporary wiring is NOT a permanent solution and must be removed when the need has passed.',
        critical: true,
      },
      {
        rule: 'Rule 76-002',
        title: 'Time Limits for Temporary Wiring',
        detail: 'Temporary wiring for construction shall be permitted for the duration of the construction period. For seasonal displays: maximum 90 days. For experimental or testing: as long as needed with approval. All temporary wiring must be removed promptly when no longer needed.',
      },
      {
        rule: 'Rule 76-004',
        title: 'Temporary Service',
        detail: 'A temporary service shall comply with all CEC service entrance rules (Section 6). The service equipment must be weather-resistant if installed outdoors. The service disconnect must be readily accessible and capable of being locked in the open position.',
        miningNote: 'Mine construction projects often use temporary power centres. These must comply with both CEC temporary power rules and O. Reg. 854 mining electrical requirements including ground fault protection.',
      },
    ],
  },
  {
    heading: 'GFCI for Temporary Power',
    description: 'Ground fault protection requirements on construction sites.',
    rules: [
      {
        rule: 'Rule 76-012',
        title: 'GFCI Required on All Construction Receptacles',
        detail: 'ALL 15A and 20A, 125V receptacles used on construction sites must have GFCI protection. No exceptions. This applies whether the receptacles are on temporary power distribution panels, spider boxes, or permanent panels used during construction. GFCI can be at the panel (GFCI breaker), at the outlet (GFCI receptacle), or a portable GFCI device.',
        critical: true,
      },
      {
        rule: 'Rule 76-012(2)',
        title: 'Assured Equipment Grounding Program',
        detail: 'As an alternative to GFCI on construction sites (rarely used in Ontario), an assured equipment grounding conductor program may be used. This requires documented testing of all equipment grounding on a regular schedule. Most Ontario contractors use GFCI instead as it is simpler to implement and provides better worker protection.',
      },
      {
        rule: 'Rule 76-012(3)',
        title: 'GFCI for Temporary Lighting',
        detail: 'Temporary lighting circuits on construction sites that use cord-and-plug connected fixtures must also be GFCI protected if operating at 125V, 15A or 20A. String lights and temporary work lights fall under this requirement.',
      },
    ],
  },
  {
    heading: 'Permitted Wiring Methods',
    description: 'What types of wiring can be used for temporary installations.',
    rules: [
      {
        rule: 'Rule 76-006',
        title: 'Temporary Wiring Methods — General',
        detail: 'Permitted temporary wiring methods include: any permanent wiring method (conduit, TECK cable, etc.), NMD90 (Loomex) if protected from damage, Type S or SJ cords for portable equipment, and multi-conductor portable cords. The wiring must be supported and protected from physical damage.',
        critical: true,
      },
      {
        rule: 'Rule 76-006(2)',
        title: 'NMD90 for Temporary Use',
        detail: 'NMD90 cable may be used for temporary wiring on construction sites even though it would not be permitted for the permanent installation. It must be protected from damage, secured at intervals, and not run through doorways or openings where it could be pinched or damaged by traffic.',
      },
      {
        rule: 'Rule 76-006(3)',
        title: 'Extension Cords and Portable Cords',
        detail: 'Extension cords used on construction sites must be: hard-usage (Type S, ST, SO, STO) or extra-hard-usage (Type W), 3-wire with equipment grounding conductor, continuous without splices, and equipped with an attachment cap and connector body that are molded on or dead-front type. No flat (zip) cords or household extension cords.',
        critical: true,
      },
      {
        rule: 'Rule 76-006(5)',
        title: 'Cable Protection on Construction Sites',
        detail: 'Temporary cables and cords must be protected where they cross walkways, roadways, or other areas subject to traffic. Cable protectors (ramps), burial, suspension, or other approved methods must be used. Cables must not be stapled, nailed through, or otherwise damaged during installation.',
        miningNote: 'On mine construction sites, cable protection is critical due to heavy mobile equipment. Steel channel or cable troughs are typically used to protect temporary cables from vehicle traffic.',
      },
    ],
  },
  {
    heading: 'Temporary Panels & Distribution',
    description: 'Temporary power distribution equipment requirements.',
    rules: [
      {
        rule: 'Rule 76-008',
        title: 'Temporary Panel Requirements',
        detail: 'Temporary power panels (spider boxes, temporary distribution panels) must: be listed for the purpose, be weather-resistant if used outdoors (NEMA 3R minimum), have overcurrent protection for all branch circuits, have a main disconnect, and be properly grounded and bonded per CEC Section 10.',
      },
      {
        rule: 'Rule 76-010',
        title: 'Spider Box Requirements',
        detail: 'Spider boxes (portable power distribution units) commonly used on construction sites must: have GFCI protection on all 15A/20A 125V outlets, have a disconnect or breaker for each circuit, be rated for the environment (weather-resistant for outdoor), and have a proper grounding terminal connected to the supply ground.',
      },
      {
        rule: 'Rule 76-014',
        title: 'Temporary Lighting',
        detail: 'Temporary lighting on construction sites must: provide adequate illumination for safe work (minimum 50 lux at floor level), use lampholders with guards or approved temporary light fixtures, not use bare lamp sockets (must have a guard or globe), and have all metal parts grounded. String lights must have lampholders permanently attached.',
        miningNote: 'Underground mine construction lighting has additional requirements per O. Reg. 854. Emergency lighting and escape route illumination must be maintained even during temporary power arrangements.',
      },
      {
        rule: 'Rule 76-016',
        title: 'Removal of Temporary Wiring',
        detail: 'Temporary wiring must be removed immediately upon completion of the construction or purpose for which it was installed. It may not be left in place to serve as permanent wiring. Any temporary wiring discovered during final inspection must be removed before the installation is accepted.',
      },
    ],
  },
  {
    heading: 'Emergency & Standby Temporary Power',
    description: 'Temporary generator and emergency power provisions.',
    rules: [
      {
        rule: 'Rule 76-018',
        title: 'Temporary Generator Connections',
        detail: 'Portable generators used for temporary power must: have a grounding electrode if the generator is a separately derived system, not be back-fed into the permanent wiring system without an approved transfer switch, and have overcurrent protection for all circuits supplied. The generator frame must be bonded.',
      },
      {
        rule: 'Rule 46-002',
        title: 'Transfer Switch for Temporary Standby',
        detail: 'If a temporary generator is connected to a building\'s electrical system, an approved transfer switch is required to prevent back-feeding. The transfer switch must be mechanically or electrically interlocked to prevent simultaneous connection of the utility and generator. Suicide cords (male-to-male plugs) are prohibited.',
        critical: true,
      },
      {
        rule: 'Rule 76-020',
        title: 'Grounding of Portable Generators',
        detail: 'Portable generators used as separately derived systems require a grounding electrode at the generator location. The generator frame, neutral, and grounding electrode must be bonded at the generator. If the generator is not a separately derived system (neutral bonded at the service), a grounding electrode at the generator is not required, but a ground fault path back to the service must be maintained.',
      },
    ],
  },
]

const temporaryQuickRef: QuickRef[] = [
  { label: 'GFCI required on construction', value: 'ALL 15A/20A 125V receptacles', note: 'Rule 76-012' },
  { label: 'Seasonal display max duration', value: '90 days', note: 'Rule 76-002' },
  { label: 'Extension cord type required', value: 'Type S, ST, SO, STO, or W', note: 'Rule 76-006(3)' },
  { label: 'Min. construction lighting', value: '50 lux at floor level', note: 'Rule 76-014' },
  { label: 'Outdoor temp panel rating', value: 'NEMA 3R minimum', note: 'Rule 76-008' },
  { label: 'Generator transfer switch', value: 'Required for building connection', note: 'Rule 46-002' },
  { label: 'Suicide cords', value: 'PROHIBITED', note: 'Rule 46-002' },
]

/* ------------------------------------------------------------------ */
/*  TAB 9 — TRANSFORMER INSTALLATIONS                                  */
/* ------------------------------------------------------------------ */

const transformerSections: CodeSection[] = [
  {
    heading: 'Transformer Selection & Rating',
    description: 'Choosing the correct transformer type, kVA rating, and overcurrent protection for the installation.',
    rules: [
      {
        rule: 'Rule 26-240',
        title: 'Transformer Overcurrent Protection Requirements',
        detail: 'Every transformer shall be protected by an overcurrent device on the primary side rated or set at not more than the percentages specified in Table 50. This protection must guard against faults within the transformer and is independent of the branch circuit or feeder overcurrent protection.',
        critical: true,
      },
      {
        rule: 'Rule 26-242',
        title: 'Primary-Side Overcurrent Protection Sizing',
        detail: 'Primary overcurrent protection shall not exceed the maximum percentages from Table 50 based on transformer primary current and installation conditions. For transformers rated over 9A primary, max 125%. For transformers rated 9A or less primary, max 167%. For supervised locations, max 150%. If 125% does not correspond to a standard fuse or breaker size, the next larger standard size is permitted.',
        critical: true,
        miningNote: 'Open pit mines use portable and mobile substations (pad-mount, skid-mount) that feed shovels, drills, and conveyors. Rating must account for altitude derating above 1000 m, ambient temperature extremes, and load diversity of mining equipment. Always verify nameplate kVA against actual connected load.',
      },
      {
        rule: 'Rule 26-244',
        title: 'Secondary-Side Overcurrent Protection',
        detail: 'Secondary overcurrent protection is required unless the primary device provides adequate protection per Table 50. Where secondary conductors are not longer than 3 m and terminate at a single overcurrent device, secondary protection at the transformer is not required.',
      },
      {
        rule: 'Rule 26-250',
        title: 'Transformer Impedance & Fault Current',
        detail: 'The transformer impedance (%Z) determines the maximum available fault current on the secondary. The available fault current at the transformer secondary must be calculated and all downstream equipment must be rated to withstand and interrupt this fault level. Typical distribution transformers have 4-6% impedance.',
        miningNote: 'Portable substations in open pit mines may be relocated, changing the available fault current at downstream equipment. Recalculate available fault current whenever a transformer is moved or the upstream configuration changes.',
      },
    ],
  },
  {
    heading: 'Transformer Overcurrent Protection — Table 50',
    description: 'Detailed overcurrent protection requirements from CEC Table 50 for primary and secondary devices.',
    rules: [
      {
        rule: 'Rule 26-242 (Table 50)',
        title: 'Primary Protection — Detailed Sizing',
        detail: 'For transformers with primary current greater than 9A: max 125% of primary FLC. For transformers with primary current 9A or less: max 167% of primary FLC. For supervised locations (qualified personnel only): max 150% of primary FLC. If 125% does not correspond to a standard fuse or breaker rating, the next larger standard size is permitted. Standard fuse sizes: 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100A etc.',
        critical: true,
      },
      {
        rule: 'Rule 26-244 (Table 50)',
        title: 'Secondary Protection — Conductor Length Exception',
        detail: 'When secondary conductors are 3 m or less in length and terminate at a single overcurrent device, secondary-side transformer protection is not required. For secondary conductors longer than 3 m, an overcurrent device rated at not more than 125% of the transformer secondary full-load current must be installed at the transformer.',
      },
      {
        rule: 'Rule 26-252',
        title: 'Voltage and Frequency Requirements',
        detail: 'Transformers shall be operated at the voltage and frequency specified on the nameplate. Operation at voltages exceeding 105% of nameplate voltage increases core losses, heating, and may cause saturation. Operation below 95% reduces available output power proportionally.',
      },
      {
        rule: 'Practical Note',
        title: 'Coordination with Upstream and Downstream Devices',
        detail: 'The primary overcurrent device must coordinate with upstream feeder protection and downstream branch circuit protection. Time-current curves (TCC) should be reviewed to ensure the transformer primary fuse clears a secondary fault before the upstream device trips, maintaining selective coordination.',
        miningNote: 'In open pit operations, portable transformers feeding shovels and drills often have integral primary protection (fused disconnects or breakers). Verify that this integral protection coordinates with the upstream line protection and downstream motor branch circuit devices. Miscoordination can cause nuisance tripping of main feeders.',
      },
    ],
  },
  {
    heading: 'Wiring & Connections',
    description: 'Conductor sizing, transformer winding configurations, and connection requirements.',
    rules: [
      {
        rule: 'Rule 26-200',
        title: 'Transformer Connections — Conductor Sizing',
        detail: 'Primary and secondary conductors shall be sized to carry the transformer full-load current. Primary conductors are sized based on the transformer kVA rating divided by primary voltage. Secondary conductors are sized based on transformer kVA divided by secondary voltage. Conductor ampacity must be at least 125% of rated transformer current per Rule 8-104.',
      },
      {
        rule: 'Rule 26-210',
        title: 'Delta and Wye Configurations — Grounding',
        detail: 'Delta-connected secondaries have no neutral point — a grounding conductor must be derived from a corner ground or mid-tap ground if needed. Wye-connected secondaries provide a neutral point that must be grounded when the voltage to ground is 150V or less, or when serving a 4-wire system. The configuration must match the load requirements.',
        critical: true,
      },
      {
        rule: 'Rule 26-212',
        title: 'Corner-Grounded Delta Systems',
        detail: 'Where a corner-grounded delta system is used, the grounded phase conductor must be identified and the grounded phase must be connected to the grounding system. Special bonding requirements apply — the grounded phase conductor serves as both the system ground and the equipment grounding path. Equipment must be rated for the system voltage.',
      },
      {
        rule: 'Rule 4-006',
        title: 'Conductor Ampacity for Transformer Circuits',
        detail: 'Conductor ampacity for transformer primary and secondary circuits shall be determined from CEC Table 2 (copper) or Table 4 (aluminum) based on 125% of the transformer rated full-load current. Temperature correction factors and bundling derating factors apply. For transformers with multiple secondaries, each secondary circuit is sized independently.',
      },
      {
        rule: 'Rule 26-256',
        title: 'Parallel Operation of Transformers',
        detail: 'Transformers connected in parallel must have the same voltage ratio, the same impedance percentage, the same polarity, and compatible winding configurations (both delta-wye, or both wye-wye, etc.). Unequal impedances cause circulating currents and uneven load sharing. Phase rotation must be verified before paralleling.',
        miningNote: 'Open pit mine portable substations typically use delta-wye (delta primary, wye secondary) configuration to provide a solidly grounded neutral for 347/600V three-phase four-wire distribution. The wye secondary neutral MUST be solidly grounded per Rule 10-204. This configuration is standard for mining power distribution to shovels, drills, and plant equipment.',
      },
    ],
  },
  {
    heading: 'Grounding & Bonding',
    description: 'System grounding, grounding electrode requirements, and bonding for transformer installations.',
    rules: [
      {
        rule: 'Rule 10-204',
        title: 'System Grounding — Transformer Secondary',
        detail: 'The transformer secondary must be grounded when the voltage to ground does not exceed 150V, or when the transformer supplies a 4-wire system (e.g., 347/600V wye). The grounding connection shall be made at the transformer secondary terminals or at the first disconnect on the secondary side. The grounding conductor connects the neutral to the grounding electrode.',
        critical: true,
      },
      {
        rule: 'Rule 10-206',
        title: 'Grounding Electrode for Transformer',
        detail: 'A transformer installed in a separate building or structure (including a portable substation) must have its own grounding electrode. The electrode may be a driven ground rod (min. 3 m / 10 ft copper-clad steel), a ground plate, or a concrete-encased electrode. Multiple electrodes may be required to achieve acceptable ground resistance.',
      },
      {
        rule: 'Rule 10-210',
        title: 'Grounding Conductor Sizing — Table 43',
        detail: 'The system grounding conductor from the transformer secondary neutral to the grounding electrode shall be sized per CEC Table 43 based on the ampere rating of the transformer secondary overcurrent device or the transformer rated secondary current. This conductor must be copper and installed without splice unless using approved connectors.',
        critical: true,
      },
      {
        rule: 'Rule 10-500',
        title: 'Bonding of Transformer Enclosure',
        detail: 'The transformer enclosure, case, core, and all associated metal parts must be bonded to the equipment grounding system. The bonding conductor must provide a low-impedance fault current path back to the source. For pad-mount transformers, the bonding conductor is typically connected to the enclosure grounding pad or lug.',
      },
      {
        rule: 'Rule 10-114',
        title: 'Ground Fault Protection for Transformer Secondary',
        detail: 'Ground fault protection may be required on the transformer secondary depending on the system voltage, ampere rating, and application. For solidly grounded wye systems over 150V to ground, ground fault protection of equipment (GFPE) is required for disconnects rated 1000A or more.',
        miningNote: 'Open pit mine portable substations require independent grounding electrodes (driven ground rods) at each transformer location. O. Reg. 854 s. 153 requires ground fault protection on all mine distribution systems — this is more stringent than the CEC. Ground resistance must be tested and documented: max 25 ohms per individual rod, total system ground resistance must be 5 ohms or less. Ground rods must be inspected annually.',
      },
    ],
  },
  {
    heading: 'Installation & Clearances',
    description: 'Physical installation requirements, ventilation, clearances from combustibles, and vault requirements.',
    rules: [
      {
        rule: 'Rule 26-200',
        title: 'Transformer Location — Ventilation & Access',
        detail: 'Transformers shall be installed in locations with adequate ventilation to dissipate heat losses. Natural ventilation must provide sufficient airflow for the transformer rating. Access for inspection, maintenance, and replacement must be maintained. Transformers must not block egress paths.',
      },
      {
        rule: 'Rule 26-204',
        title: 'Indoor Dry-Type — Clearances from Combustibles',
        detail: 'Dry-type transformers installed indoors shall have a minimum clearance of 300 mm (12 in) from combustible materials, unless separated by a fire-rated barrier. Transformers rated over 112.5 kVA shall be installed in fire-resistant rooms or vaults unless they are of the sealed/non-ventilated type with 220 degrees C or higher insulation.',
      },
      {
        rule: 'Rule 26-206',
        title: 'Outdoor Oil-Filled — Building Clearances',
        detail: 'Oil-filled transformers installed outdoors must maintain minimum clearances from buildings, doors, windows, and fire escapes as specified in Table 50B. These clearances depend on the transformer oil volume and kVA rating. Typical minimum clearance is 1.8 m from building openings for transformers containing over 230 L of oil.',
      },
      {
        rule: 'Rule 26-220',
        title: 'Vault Requirements for Indoor Oil-Filled',
        detail: 'Oil-filled transformers installed indoors must be located in a fire-resistant vault with a minimum 3-hour fire rating on walls, floor, and ceiling. The vault must have adequate ventilation, a sill or drain to contain oil spills, and self-closing fire-rated doors. Vault openings must not face means of egress.',
      },
      {
        rule: 'Rule 26-224',
        title: 'Fire Protection for Oil-Filled Transformers',
        detail: 'Oil-filled transformers containing more than 230 L (60 US gal) of oil require fire protection provisions including containment for the total oil volume, automatic fire suppression where required by the AHJ, and oil spill prevention. Less-flammable liquids (silicone, FR3) may reduce vault and clearance requirements.',
      },
      {
        rule: 'Rule 26-230',
        title: 'Transformer Accessibility for Maintenance',
        detail: 'Transformers must be accessible for inspection, testing, and maintenance. A clear working space of at least 1.0 m must be provided around the transformer where access is required. Nameplate data must be visible and legible. Lifting provisions must be maintained for replaceable units.',
        miningNote: 'Open pit mine pad-mount transformers must be located clear of haul roads, blast zones, and areas subject to flyrock. Oil containment is mandatory — secondary containment berm or double-wall design required per provincial environmental regulations. Lockable enclosures are required per O. Reg. 854. Transformer locations must be shown on the mine electrical single-line diagram and updated when units are relocated.',
      },
    ],
  },
  {
    heading: 'Tap Changers & Voltage Regulation',
    description: 'Voltage regulation, tap changer types, and practical guidance for mining feeder voltage management.',
    rules: [
      {
        rule: 'Rule 26-252',
        title: 'Voltage Regulation Requirements',
        detail: 'The voltage at utilization equipment must be maintained within acceptable limits (typically +/- 5% of nameplate). Transformers with tap changers allow adjustment of the turns ratio to compensate for source voltage variations and line voltage drop. Proper tap selection is essential for equipment performance and longevity.',
      },
      {
        rule: 'Rule 26-254',
        title: 'No-Load Tap Changers (NLTC) vs Load Tap Changers (LTC)',
        detail: 'No-load tap changers (NLTC) must be adjusted only when the transformer is de-energized. They are used for semi-permanent voltage adjustment. Load tap changers (LTC) can adjust under load and are used for dynamic voltage regulation. Most distribution transformers have NLTC with a typical range of +/- 5% in 2.5% steps (5 positions).',
      },
      {
        rule: 'Practical Guidance',
        title: 'Tap Settings for Mining Feeder Voltage Drop',
        detail: 'Long feeder runs cause voltage drop that reduces voltage at the transformer primary. Calculate voltage drop using conductor resistance, cable length, and load current. If primary voltage is consistently low, adjust the NLTC tap to a lower ratio (boost position) to maintain secondary voltage. Always verify secondary voltage under load after any tap change.',
        miningNote: 'Open pit mines often have long overhead or underground feeder runs to portable substations — distances of 2-5 km are common. Primary voltage is typically 4.16 kV, 13.8 kV, or 25 kV. Tap adjustments compensate for voltage drop on these long runs. Typical adjustment range is +/- 5% in 2.5% steps. Measure secondary voltage under load at the transformer and at the most remote load to verify adequate regulation.',
      },
    ],
  },
  {
    heading: 'Testing & Commissioning',
    description: 'Required tests before energizing a new or relocated transformer.',
    rules: [
      {
        rule: 'Rule 2-024',
        title: 'Inspection Before Energizing',
        detail: 'No electrical equipment shall be energized until it has been inspected and approved by the inspection authority. For transformer installations, this includes verification of grounding, overcurrent protection, conductor sizing, clearances, labeling, and overall conformance with the CEC and the installation drawings.',
      },
      {
        rule: 'CSA C88',
        title: 'Testing Standards for Power Transformers',
        detail: 'CSA C88 (Power Transformers) specifies factory and field tests for power transformers. Field tests include: insulation resistance (megger test), turns ratio test, winding resistance measurement, polarity verification, and oil dielectric breakdown test (for oil-filled units). All tests must be documented and records retained.',
      },
      {
        rule: 'Field Testing',
        title: 'Required Field Tests',
        detail: 'Before energizing: (1) Insulation resistance — megger at rated voltage plus 1 kV, minimum 1 minute. (2) Turns ratio — verify nameplate ratio on all taps. (3) Winding resistance — DC resistance of each winding, compare phases for balance. (4) Oil dielectric (oil-filled) — breakdown voltage per ASTM D1816, minimum 30 kV for new oil. (5) Visual inspection — check for shipping damage, oil leaks, loose connections, proper grounding.',
        miningNote: 'O. Reg. 854 requires transformer testing before initial energization and after any maintenance or relocation. Insulation resistance records must be maintained as a baseline for trending. Minimum insulation resistance for a new transformer: 1 megohm per kV of rated voltage plus 1 megohm (e.g., a 600V transformer needs minimum 1.6 megohms). Oil-filled units require dissolved gas analysis (DGA) oil sampling annually to detect incipient faults.',
      },
    ],
  },
]

const transformerQuickRef: QuickRef[] = [
  { label: 'Primary OCP max (>9A primary)', value: '125%', note: 'Rule 26-242 / Table 50' },
  { label: 'Primary OCP max (<=9A primary)', value: '167%', note: 'Rule 26-242 / Table 50' },
  { label: 'Primary OCP supervised location', value: '150%', note: 'Rule 26-242 / Table 50' },
  { label: 'Secondary OCP max', value: '125% of secondary FLC', note: 'Rule 26-244' },
  { label: 'Min clearance from combustible (dry type)', value: '300 mm (12")', note: 'Rule 26-204' },
  { label: 'Grounding conductor sizing', value: 'Per CEC Table 43', note: 'Rule 10-210' },
  { label: 'Max ground resistance (mine, per rod)', value: '25 ohms', note: 'O. Reg. 854' },
  { label: 'Max ground resistance (system)', value: '5 ohms', note: 'O. Reg. 854' },
  { label: 'Insulation resistance (new, min)', value: '1 M-ohm/kV + 1 M-ohm', note: 'CSA C88' },
  { label: 'Common mine primary voltages', value: '4.16 kV, 13.8 kV, 25 kV', note: 'Mining standard' },
  { label: 'Typical secondary voltages (mining)', value: '600V, 347/600V, 480V', note: 'Mining standard' },
]

/* ------------------------------------------------------------------ */
/*  STYLES                                                             */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
  msOverflowStyle: 'none' as const,
}

const pillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 56,
  padding: '0 14px',
  borderRadius: 28,
  fontSize: 13,
  fontWeight: 600,
  border: '2px solid var(--divider)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease',
}

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: 'var(--primary)',
  color: '#000',
  border: '2px solid var(--primary)',
}

const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)',
  padding: 14,
}

const sectionHeading: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: 'var(--primary)',
  marginBottom: 4,
}

const sectionDesc: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-secondary)',
  marginBottom: 12,
  lineHeight: 1.4,
}

const ruleCard: React.CSSProperties = {
  background: 'var(--input-bg)',
  borderRadius: 8,
  padding: 12,
  marginBottom: 8,
}

const ruleCritical: React.CSSProperties = {
  ...ruleCard,
  borderLeft: '4px solid var(--primary)',
}

const ruleNumber: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
  marginBottom: 2,
}

const ruleTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--text)',
  marginBottom: 4,
}

const ruleDetail: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-secondary)',
  lineHeight: 1.55,
}

const miningBox: React.CSSProperties = {
  marginTop: 8,
  padding: '8px 10px',
  background: 'rgba(255, 179, 0, 0.08)',
  border: '1px solid rgba(255, 179, 0, 0.25)',
  borderRadius: 6,
  fontSize: 12,
  color: 'var(--primary)',
  lineHeight: 1.45,
}

const quickRefContainer: React.CSSProperties = {
  ...card,
  marginTop: 8,
  padding: 0,
  overflow: 'hidden',
}

const quickRefHeader: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--primary)',
  padding: '12px 14px 8px',
  borderBottom: '1px solid var(--divider)',
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
}

const quickRefRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '10px 14px',
  borderBottom: '1px solid var(--divider)',
  gap: 12,
}

const quickRefLabel: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-secondary)',
  flex: 1,
}

const quickRefValue: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text)',
  textAlign: 'right' as const,
  flex: 1,
}

const quickRefNote: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--primary)',
  textAlign: 'right' as const,
  marginTop: 2,
}

const criticalBadge: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 10,
  fontWeight: 700,
  color: '#000',
  background: 'var(--primary)',
  borderRadius: 4,
  padding: '1px 6px',
  marginLeft: 8,
  verticalAlign: 'middle',
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
}

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function RuleCard({ rule }: { rule: CodeRule }) {
  return (
    <div style={rule.critical ? ruleCritical : ruleCard}>
      <div style={ruleNumber}>{rule.rule}</div>
      <div style={ruleTitle}>
        {rule.title}
        {rule.critical && <span style={criticalBadge}>KEY RULE</span>}
      </div>
      <div style={ruleDetail}>{rule.detail}</div>
      {rule.miningNote && (
        <div style={miningBox}>
          <strong>Mining Note:</strong> {rule.miningNote}
        </div>
      )}
    </div>
  )
}

function SectionBlock({ section }: { section: CodeSection }) {
  return (
    <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={sectionHeading}>{section.heading}</div>
      {section.description && <div style={sectionDesc}>{section.description}</div>}
      {section.rules.map((r, i) => (
        <RuleCard key={i} rule={r} />
      ))}
    </div>
  )
}

function QuickRefTable({ items, title }: { items: QuickRef[]; title?: string }) {
  return (
    <div style={quickRefContainer}>
      <div style={quickRefHeader}>{title || 'Quick Reference'}</div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            ...quickRefRow,
            ...(i === items.length - 1 ? { borderBottom: 'none' } : {}),
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={quickRefLabel}>{item.label}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' as const }}>
            <div style={quickRefValue}>{item.value}</div>
            {item.note && <div style={quickRefNote}>{item.note}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TAB CONTENT RENDERERS                                              */
/* ------------------------------------------------------------------ */

function DisconnectTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)', padding: 14,
      }}>
        Complete CEC code reference for wiring disconnect switches. Covers service disconnects,
        motor disconnects, TECK cable termination at disconnect enclosures, labeling, lockout
        provisions, and grounding requirements. Includes Ontario mining-specific lockout rules.
      </div>
      <QuickRefTable items={disconnectQuickRef} title="Disconnect Quick Reference" />
      {disconnectSections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  )
}

function TECKTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)', padding: 14,
      }}>
        CEC rules for installing TECK90 armoured cable. Covers support spacing, bending radius,
        cable tray fill, direct burial depths, damage protection, strapping requirements,
        gland termination, and ampacity derating. TECK90 is the primary power cable for
        Ontario mining installations.
      </div>
      <QuickRefTable items={teckQuickRef} title="TECK Cable Quick Reference" />
      {teckSections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  )
}

function MotorTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)', padding: 14,
      }}>
        CEC Section 28 rules for motor installations. Covers branch circuit protection,
        overload protection, motor disconnect requirements, conductor sizing, controller
        requirements, and nameplate identification. Remember: use CEC Table D16 for conductor
        and OCP sizing, use motor nameplate FLA only for overload sizing.
      </div>
      <div style={{
        background: 'rgba(255, 179, 0, 0.08)',
        border: '1px solid rgba(255, 179, 0, 0.25)',
        borderRadius: 'var(--radius)',
        padding: 14,
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--primary)',
        textAlign: 'center' as const,
      }}>
        Table D16 FLC = Conductor + OCP + Disconnect Sizing
        <br />
        Nameplate FLA = Overload Sizing ONLY
      </div>
      <QuickRefTable items={motorQuickRef} title="Motor Installation Quick Reference" />
      {motorSections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  )
}

function PanelTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)', padding: 14,
      }}>
        CEC rules for installing panelboards. Covers working space clearances, height
        requirements, labeling and circuit directories, overcurrent protection, grounding
        and neutral bus separation, and practical installation notes. Critical for both
        residential and industrial/mining panel installations.
      </div>
      <QuickRefTable items={panelQuickRef} title="Panel Installation Quick Reference" />
      {panelSections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  )
}

function ReceptacleTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)', padding: 14,
      }}>
        CEC rules for receptacle circuits. Covers GFCI requirements (Rule 26-700), AFCI
        requirements (Rule 26-656), circuit loading limits, receptacle spacing in dwelling
        units, outdoor receptacles, and kitchen/bathroom specific requirements. Includes
        Ontario-specific bulletin requirements.
      </div>
      <QuickRefTable items={receptacleQuickRef} title="Receptacle Circuit Quick Reference" />
      {receptacleSections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  )
}

function GroundingTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)', padding: 14,
      }}>
        CEC Section 10 grounding and bonding rules. Covers system grounding, equipment grounding
        conductor sizing (Table 16), bonding jumper requirements, grounding electrode types and
        installation, and intersystem bonding. The grounding system is the foundation of
        electrical safety.
      </div>
      <QuickRefTable items={groundingQuickRef} title="Grounding Quick Reference — Table 16" />
      {groundingSections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  )
}

function HazardousTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)', padding: 14,
      }}>
        CEC Sections 18 and 20 hazardous location rules. Covers Zone classification (gas and dust),
        equipment markings (Ex d, Ex e, Ex i, Ex n), wiring methods, sealing requirements, and
        Ontario mining-specific hazardous area regulations. Understanding hazardous classification
        is critical for mining electricians.
      </div>
      <QuickRefTable items={hazardousQuickRef} title="Hazardous Location Quick Reference" />
      {hazardousSections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  )
}

function TemporaryTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)', padding: 14,
      }}>
        CEC Section 76 temporary wiring rules. Covers construction site power, GFCI requirements
        for all construction receptacles, permitted wiring methods, extension cord requirements,
        temporary panels and spider boxes, generator connections, and removal requirements.
        Essential for mine construction and expansion projects.
      </div>
      <QuickRefTable items={temporaryQuickRef} title="Temporary Power Quick Reference" />
      {temporarySections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  )
}

function TransformerTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)', padding: 14,
      }}>
        CEC Section 26 transformer installation rules. Covers overcurrent protection (Table 50),
        winding configurations (delta-wye), grounding and bonding, conductor sizing, clearances,
        vault requirements, tap changers, and commissioning tests. Includes Ontario mining
        portable substation requirements and O. Reg. 854 ground fault protection mandates.
      </div>
      <div style={{
        background: 'rgba(255, 179, 0, 0.08)',
        border: '1px solid rgba(255, 179, 0, 0.25)',
        borderRadius: 'var(--radius)',
        padding: 14,
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--primary)',
        textAlign: 'center' as const,
      }}>
        Primary OCP: Table 50 — 125% (&gt;9A) / 167% (&le;9A) / 150% (supervised)
        <br />
        Grounding Conductor: Size per Table 43
      </div>
      <QuickRefTable items={transformerQuickRef} title="Transformer Installation Quick Reference" />
      {transformerSections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function CodeRequirementsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('disconnect')

  const renderTab = () => {
    switch (activeTab) {
      case 'disconnect':
        return <DisconnectTab />
      case 'teck':
        return <TECKTab />
      case 'motor':
        return <MotorTab />
      case 'panel':
        return <PanelTab />
      case 'receptacle':
        return <ReceptacleTab />
      case 'grounding':
        return <GroundingTab />
      case 'hazardous':
        return <HazardousTab />
      case 'temporary':
        return <TemporaryTab />
      case 'transformer':
        return <TransformerTab />
      default:
        return <DisconnectTab />
    }
  }

  return (
    <PageWrapper title="Code Requirements">
      {/* Intro */}
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
        textAlign: 'center' as const,
      }}>
        CEC code requirements organized by task. Select what you are doing to see all applicable rules.
        <br />
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
          Ontario CEC + Mining Regulations (O. Reg. 854)
        </span>
      </div>

      {/* Tab Pills */}
      <div style={pillRow}>
        {tabs.map(t => (
          <button
            key={t.key}
            style={activeTab === t.key ? pillActive : pillBase}
            onClick={() => setActiveTab(t.key)}
          >
            {t.shortLabel}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {renderTab()}

      {/* Disclaimer */}
      <div style={{
        marginTop: 16,
        padding: 14,
        background: 'var(--surface)',
        border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)',
        fontSize: 11,
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        textAlign: 'center' as const,
      }}>
        <strong style={{ color: 'var(--primary)' }}>Disclaimer:</strong> This reference is a study aid
        and field guide. Always verify requirements against the current edition of the Canadian
        Electrical Code (CEC), the Ontario Electrical Safety Code (OESC), and Ontario Regulation
        854 (Mines and Mining Plants). Code requirements may change with each edition. This tool
        does not replace the official code books or the judgment of a qualified electrician or
        engineer. When in doubt, consult the Authority Having Jurisdiction (AHJ) or the
        Electrical Safety Authority (ESA).
      </div>
    </PageWrapper>
  )
}
