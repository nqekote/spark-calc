import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  PLC Basics Reference - Comprehensive Guide for Mining Electricians */
/* ------------------------------------------------------------------ */

type TabKey = 'io' | 'ladder' | 'troubleshoot' | 'comm' | 'plcs'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'io', label: 'I/O Types' },
  { key: 'ladder', label: 'Ladder Logic' },
  { key: 'troubleshoot', label: 'Troubleshooting' },
  { key: 'comm', label: 'Comm Protocols' },
  { key: 'plcs', label: 'Common PLCs' },
]

/* ------------------------------------------------------------------ */
/*  Tab 1: I/O Types Data                                              */
/* ------------------------------------------------------------------ */

interface IOEntry {
  name: string
  voltage: string
  wiring: string
  useCase: string
  tint: string // subtle left border color
}

const digitalInputs: IOEntry[] = [
  {
    name: '24VDC Input',
    voltage: '24VDC (typical range 20-28VDC)',
    wiring: 'Connect field device between input terminal and 24VDC common. Most common in new installations. Use shielded cable in noisy environments.',
    useCase: 'Proximity sensors, limit switches, pushbuttons, photoelectric sensors. Standard for most modern PLCs in mining.',
    tint: '#3b82f6',
  },
  {
    name: '120VAC Input',
    voltage: '120VAC (typical range 100-132VAC)',
    wiring: 'Connect hot (L1) through field device to input terminal. Neutral goes to input common. Use rated contact blocks.',
    useCase: 'Larger contactors, older installations, motor starters with 120V aux contacts. Common in legacy mining equipment.',
    tint: '#3b82f6',
  },
  {
    name: 'Dry Contact (Voltage-Free)',
    voltage: 'No voltage from field device — PLC supplies sensing voltage',
    wiring: 'PLC provides internal voltage on input terminal. Field device simply makes/breaks contact between input and common.',
    useCase: 'Relay contacts, float switches, pressure switches, thermostat contacts. Simple on/off devices without their own power.',
    tint: '#3b82f6',
  },
  {
    name: 'Sourcing Input (PNP)',
    voltage: '24VDC — current flows INTO the input terminal',
    wiring: 'PNP sensor sources current to PLC input. Sensor output goes high (+24V) when active. Input common connects to 0V. Most common in North America.',
    useCase: 'Modern 3-wire proximity sensors, photoelectric sensors. Standard for Allen-Bradley and most North American PLCs.',
    tint: '#3b82f6',
  },
  {
    name: 'Sinking Input (NPN)',
    voltage: '24VDC — current flows OUT OF the input terminal',
    wiring: 'NPN sensor sinks current from PLC input. Sensor output pulls low (0V) when active. Input common connects to +24V. More common in Asian/European equipment.',
    useCase: 'Some imported sensors and equipment. Must match sensor type to input type or use converter.',
    tint: '#3b82f6',
  },
]

const digitalOutputs: IOEntry[] = [
  {
    name: 'Relay Output',
    voltage: 'Handles AC or DC — typically up to 250VAC / 30VDC, 2A',
    wiring: 'Dry contact output — provides isolated switching. Connect external power through output terminal and field device to common. Include suppression on inductive loads.',
    useCase: 'Most versatile — works with any voltage. Best for mixed voltage systems. Slower switching speed. Common in mining for contactor coils, pilot lights, horns.',
    tint: '#22c55e',
  },
  {
    name: 'Transistor Sourcing (PNP)',
    voltage: '24VDC only, typically 0.5-2A per point',
    wiring: 'Output sources +24V when energized. Field device connects between output and 0V common. Very fast switching. Solid state — no mechanical wear.',
    useCase: 'High-speed applications, solenoid valves, indicator lights, driving relay coils. No contact bounce. Standard for Allen-Bradley DC output modules.',
    tint: '#22c55e',
  },
  {
    name: 'Transistor Sinking (NPN)',
    voltage: '24VDC only, typically 0.5-2A per point',
    wiring: 'Output sinks to 0V when energized. Field device connects between +24V supply and output terminal. Less common in North America.',
    useCase: 'Some specialty applications, interfacing with NPN-compatible devices, some safety relays.',
    tint: '#22c55e',
  },
  {
    name: 'Triac Output',
    voltage: '120-240VAC, typically 0.5-1A per point',
    wiring: 'Solid-state AC switching. Connect load between output terminal and AC neutral. Include snubber circuit on inductive loads. May have leakage current when off.',
    useCase: 'Fast AC switching without relay wear. Pilot lights, small AC solenoids. Not suitable for high-inrush loads like motors.',
    tint: '#22c55e',
  },
]

const analogInputs: IOEntry[] = [
  {
    name: '4-20mA Input',
    voltage: '4-20mA current loop (live zero at 4mA)',
    wiring: '2-wire: PLC powers transmitter through loop. 3/4-wire: transmitter has separate power, signal wire to input. 4mA = 0%, 20mA = 100%. Below 4mA indicates fault.',
    useCase: 'Industry standard for process instruments. Pressure transmitters, level transmitters, flow meters. Preferred in mining — immune to voltage drop over long cable runs.',
    tint: '#8b5cf6',
  },
  {
    name: '0-10V Input',
    voltage: '0-10VDC (some modules accept 0-5V, \±10V)',
    wiring: 'Signal wire from transmitter to input terminal, common to common. Keep cable short — susceptible to voltage drop. Use shielded cable.',
    useCase: 'VFD speed reference, some HVAC sensors, potentiometer position feedback. Shorter distances only — voltage drops over long runs.',
    tint: '#8b5cf6',
  },
  {
    name: 'RTD Input (PT100/PT1000)',
    voltage: 'Resistance measurement — 100Ω at 0\°C (PT100)',
    wiring: '2-wire: least accurate, lead resistance adds error. 3-wire: standard, compensates for lead resistance. 4-wire: most accurate. Use RTD-rated input module.',
    useCase: 'Precise temperature measurement (-200 to +850\°C). Motor bearing temps, process fluid temps, transformer oil temp. Very common in mining process control.',
    tint: '#8b5cf6',
  },
  {
    name: 'Thermocouple Input',
    voltage: 'Millivolt signal (type-dependent)',
    wiring: 'Use correct thermocouple extension wire (matching type). Cold junction compensation at module. Types: J (iron/constantan, general), K (chromel/alumel, high temp), T (copper/constantan, low temp), N (nicrosil/nisil, high temp stable).',
    useCase: 'Type K: furnaces, kilns, exhaust gas (up to 1260\°C). Type J: plastics, rubber processing. Type T: food, HVAC, cryogenics. Used in mining smelters and process heating.',
    tint: '#8b5cf6',
  },
]

const analogOutputs: IOEntry[] = [
  {
    name: '4-20mA Output',
    voltage: '4-20mA current output (sourcing)',
    wiring: 'Output terminal drives current through load resistor of receiving device. Max loop resistance typically 500-750Ω. Use shielded twisted pair.',
    useCase: 'VFD speed reference, valve positioners, analog meters, chart recorders. Preferred for long cable runs in mining plants.',
    tint: '#f59e0b',
  },
  {
    name: '0-10V Output',
    voltage: '0-10VDC (some modules support 0-5V, \±10V)',
    wiring: 'Voltage output to receiving device input. Minimum load resistance typically 1kΩ. Keep cable runs short. Use shielded cable.',
    useCase: 'VFD speed reference (short distance), damper actuators, proportional valves. Limited cable distance — keep under 15m in noisy mining environments.',
    tint: '#f59e0b',
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 2: Ladder Logic Data                                           */
/* ------------------------------------------------------------------ */

interface Instruction {
  symbol: string
  name: string
  description: string
  useCase: string
  category: 'bit' | 'timer' | 'counter' | 'math' | 'flow'
}

const instructions: Instruction[] = [
  {
    symbol: '—] [—',
    name: 'XIC (Examine If Closed)',
    description: 'Checks if a bit is ON (1). True when the referenced bit = 1. Acts like a normally-open contact.',
    useCase: 'Checking if a pushbutton is pressed, sensor is active, or internal bit is set. Most commonly used instruction.',
    category: 'bit',
  },
  {
    symbol: '—]/[—',
    name: 'XIO (Examine If Open)',
    description: 'Checks if a bit is OFF (0). True when the referenced bit = 0. Acts like a normally-closed contact.',
    useCase: 'E-stop circuits (NC contact), checking if a fault is NOT present, interlock conditions that must be clear.',
    category: 'bit',
  },
  {
    symbol: '—( )—',
    name: 'OTE (Output Energize)',
    description: 'Turns a bit ON when rung conditions are true, OFF when false. Non-retentive — resets on power cycle or mode change.',
    useCase: 'Driving physical outputs (motors, valves, lights), setting internal status bits. Standard output instruction.',
    category: 'bit',
  },
  {
    symbol: '—(L)—',
    name: 'OTL (Output Latch)',
    description: 'Sets a bit ON and KEEPS it on even if rung goes false. Must be unlatched with OTU. Retentive through power cycle.',
    useCase: 'Latching a fault condition, maintaining a run command, any condition that must stay on until explicitly cleared.',
    category: 'bit',
  },
  {
    symbol: '—(U)—',
    name: 'OTU (Output Unlatch)',
    description: 'Turns OFF a latched bit. Only way to clear an OTL instruction. Always place OTU rung after OTL rung.',
    useCase: 'Resetting faulted equipment after acknowledgement, clearing latched alarms, reset pushbutton logic.',
    category: 'bit',
  },
  {
    symbol: '—[TON]—',
    name: 'TON (Timer On-Delay)',
    description: 'Starts timing when rung is true. Done bit (.DN) energizes after preset time. Resets when rung goes false. Accumulator (.ACC) tracks elapsed time.',
    useCase: 'Delayed start sequences, debouncing inputs, time-delay before fault trip, motor star-delta transition timing.',
    category: 'timer',
  },
  {
    symbol: '—[TOF]—',
    name: 'TOF (Timer Off-Delay)',
    description: 'Done bit (.DN) is ON while rung is true. Starts timing when rung goes false. Done bit turns OFF after preset time.',
    useCase: 'Keeping a cooling fan running after motor stops, delayed alarm clearing, preventing rapid cycling.',
    category: 'timer',
  },
  {
    symbol: '—[CTU]—',
    name: 'CTU (Counter Up)',
    description: 'Increments count by 1 on each false-to-true transition of rung. Done bit (.DN) sets when count reaches preset. Retentive — must use RES to reset.',
    useCase: 'Counting parts, tracking cycles for maintenance, batch counting in process control.',
    category: 'counter',
  },
  {
    symbol: '—[CTD]—',
    name: 'CTD (Counter Down)',
    description: 'Decrements count by 1 on each false-to-true transition. Done bit sets when count reaches zero. Often paired with CTU.',
    useCase: 'Tracking remaining inventory, countdown sequences, batch processing remaining count.',
    category: 'counter',
  },
  {
    symbol: '—[MOV]—',
    name: 'MOV (Move)',
    description: 'Copies source value to destination when rung is true. Does not modify source. Executes every scan when true.',
    useCase: 'Loading setpoints, transferring analog values, copying timer/counter presets, initializing values.',
    category: 'math',
  },
  {
    symbol: '—[ADD]—',
    name: 'ADD (Add)',
    description: 'Adds Source A + Source B, stores result in Destination. Executes every scan when rung is true.',
    useCase: 'Totalizing flow, accumulating production counts, calculating combined values.',
    category: 'math',
  },
  {
    symbol: '—[SUB]—',
    name: 'SUB (Subtract)',
    description: 'Subtracts Source B from Source A (A - B), stores result in Destination.',
    useCase: 'Calculating differential pressure, level difference, deviation from setpoint.',
    category: 'math',
  },
  {
    symbol: '—[CMP]—',
    name: 'CMP/Compare',
    description: 'Compares two values. Includes EQU (=), NEQ (\≠), GRT (>), LES (<), GEQ (\≥), LEQ (\≤). Output is true/false.',
    useCase: 'Checking if temperature exceeds limit, verifying count reached target, analog alarm thresholds.',
    category: 'math',
  },
  {
    symbol: '—[JMP]—',
    name: 'JMP (Jump)',
    description: 'Skips program execution to a LBL instruction when rung is true. Rungs between JMP and LBL are NOT scanned.',
    useCase: 'Skipping sections of code based on machine mode, bypassing unused logic, conditional program flow.',
    category: 'flow',
  },
  {
    symbol: '—[LBL]—',
    name: 'LBL (Label)',
    description: 'Target destination for a JMP instruction. Must have a matching number to the JMP. Always on first instruction of rung.',
    useCase: 'Marks the destination for JMP instructions. Used for mode-based program sections, error handling.',
    category: 'flow',
  },
]

interface LadderTip {
  title: string
  detail: string
  isWarning?: boolean
}

const ladderTips: LadderTip[] = [
  {
    title: 'Scan Cycle Basics',
    detail: 'PLC executes in a repeating cycle: (1) Read all inputs, (2) Execute program top-to-bottom left-to-right, (3) Update all outputs, (4) Housekeeping/comms. Typical scan time: 1-20ms. Faster scan = faster response but more CPU load.',
  },
  {
    title: 'Reading Rung Logic',
    detail: 'Read left to right like a sentence. Conditions (inputs) are on the left, actions (outputs) on the right. ALL conditions in series must be true (AND logic). Parallel branches mean ANY path can be true (OR logic).',
  },
  {
    title: 'Last Rung Wins',
    detail: 'If the same output appears on multiple rungs, only the LAST rung in the program determines the final output state. This is the #1 beginner mistake — always search for duplicate output addresses.',
  },
  {
    title: 'Use Seal-In Circuits',
    detail: 'For start/stop logic, use a seal-in (latch) circuit: Start button in parallel with output contact, stop button in series. This is standard motor control logic translated to ladder.',
  },
  {
    title: 'Always Wire E-Stops NC',
    detail: 'Emergency stops should be wired as normally-closed (NC) and use XIO in logic. If the wire breaks, the E-stop activates — fail-safe design. This is required by mining safety regulations.',
    isWarning: true,
  },
  {
    title: 'Avoid Overusing Latches',
    detail: 'OTL/OTU are retentive through power cycles. If power is lost and restored, latched outputs turn back on immediately. Use OTE for most outputs and reserve latches for fault flags and modes.',
    isWarning: true,
  },
  {
    title: 'One OTE Per Address',
    detail: 'Never use the same address on multiple OTE instructions (last rung wins). For latching behavior, use OTL/OTU pairs. Multiple XIC/XIO references to the same address are fine.',
  },
  {
    title: 'Timer/Counter Gotchas',
    detail: 'TON resets to 0 when rung goes false. If you need retentive timing, use RTO (retentive timer). Counters are retentive by default — you must add a RES instruction to reset them.',
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 3: Troubleshooting Data                                        */
/* ------------------------------------------------------------------ */

interface TroubleshootStep {
  step: string
  detail: string
  isWarning?: boolean
}

interface TroubleshootSection {
  title: string
  icon: string
  steps: TroubleshootStep[]
}

const troubleshootSections: TroubleshootSection[] = [
  {
    title: 'Systematic Approach',
    icon: '\uD83D\uDD0D',
    steps: [
      { step: 'Check PLC status LEDs', detail: 'RUN (solid green = running), FLT (red = fault), I/O (flashing = comm issue). Always start here.' },
      { step: 'Check power supply', detail: 'Verify 24VDC supply voltage at PLC terminals (not just at power supply). Should be 23.5-24.5VDC. Low voltage causes erratic behavior.' },
      { step: 'Check I/O indicator LEDs', detail: 'LEDs on I/O modules show real-time hardware status. Compare with expected state. LED on but logic shows off = addressing error.' },
      { step: 'Go online with programming software', detail: 'Monitor the program live. Watch rung conditions change in real-time. Check data tables and status bits.' },
      { step: 'Check for faults in processor', detail: 'Open fault log/history. Major faults halt the processor. Minor faults generate warnings. Note fault code and timestamp.' },
      { step: 'Isolate the problem', detail: 'Is it input, logic, or output? If input LED matches field device, input is fine. If logic is correct but output LED off, check output module. Divide and conquer.' },
    ],
  },
  {
    title: 'Forcing I/O (Use with Extreme Caution)',
    icon: '\⚠\uFE0F',
    steps: [
      { step: 'Understand the risks', detail: 'Forcing overrides normal program logic. A forced output STAYS on/off regardless of program. Forced inputs lie to the program about real-world conditions.', isWarning: true },
      { step: 'Document before forcing', detail: 'Record what you are forcing, why, and communicate to all personnel in the area. In mining, inform the shift supervisor.' },
      { step: 'Force inputs for testing', detail: 'Force an input ON to simulate a sensor activation. Verify the program responds correctly. Remove force immediately after testing.' },
      { step: 'Force outputs for testing', detail: 'Force an output ON to verify wiring. ENSURE the equipment is safe to operate. Physically verify the device activates.', isWarning: true },
      { step: 'Remove ALL forces when done', detail: 'Use "Remove All Forces" command. Verify force count returns to zero. Leftover forces are extremely dangerous and have caused serious incidents in mines.', isWarning: true },
      { step: 'Check for existing forces first', detail: 'Before troubleshooting, check if someone left forces active. Look for force indicators in the status bar. This is a common cause of "unexplained" behavior.' },
    ],
  },
  {
    title: 'Common Allen-Bradley Fault Codes',
    icon: '\uD83D\uDCCB',
    steps: [
      { step: 'Major Fault Type 1: Power-Up', detail: 'PLC detected power loss. Check power supply, battery backup. May need to clear fault and switch to RUN.' },
      { step: 'Major Fault Type 4: I/O', detail: 'Communication lost with I/O module. Check module seating, backplane connection, I/O wiring for shorts.' },
      { step: 'Major Fault Type 6: Instruction', detail: 'Program execution error — divide by zero, invalid address, math overflow. Check program logic.' },
      { step: 'Minor Fault: Battery Low', detail: 'Replace processor battery soon. Program is retained but will be lost if power is removed with dead battery. Standard in CompactLogix/SLC.' },
      { step: 'Minor Fault: I/O Warning', detail: 'Module reporting a warning but still operating. Check module diagnostics. May indicate wiring issue or overtemp.' },
      { step: 'I/O Fault: Module Not Responding', detail: 'Check EtherNet/IP or backplane connection. Verify module is powered and firmware is correct revision.' },
    ],
  },
  {
    title: 'Communication Troubleshooting',
    icon: '\uD83D\uDD17',
    steps: [
      { step: 'Check physical connections', detail: 'Ethernet: verify link lights on switch and PLC port. Serial: check cable, pinout (null modem vs straight). Fieldbus: check termination resistors.' },
      { step: 'Verify IP address settings', detail: 'PLC and PC must be on the same subnet. Use BOOTP/DHCP tool or front panel display to check PLC IP. Common mining subnet: 192.168.1.x/24.' },
      { step: 'Ping test', detail: 'From PC command prompt, ping PLC IP address. If no reply: check cable, switch, IP config. If reply but can not connect: check driver/protocol settings.' },
      { step: 'Check switch/network', detail: 'Verify managed switch port is enabled and in correct VLAN. Check for duplicate IP addresses. Mining networks often use ring topology — check ring status.' },
      { step: 'RSLinx/RSWho (Allen-Bradley)', detail: 'Use RSLinx Classic to browse the network. If PLC shows in RSWho but cannot go online, check firmware revision compatibility with Studio 5000.' },
    ],
  },
]

interface DecisionTree {
  problem: string
  steps: string[]
}

const decisionTrees: DecisionTree[] = [
  {
    problem: 'Motor Won\'t Start',
    steps: [
      'Check PLC output status LED — is it ON?',
      'If LED off: check program logic online. Is the output rung true? Check interlocks.',
      'If LED on: check contactor coil voltage with meter. Is voltage present at output terminal?',
      'If voltage present: check contactor — is coil burned? Are contacts welded?',
      'If contactor pulls in: check overload relay. Is it tripped? Reset and check current draw.',
      'Check motor disconnect — is it in the ON position?',
      'Check motor terminal connections. Meg motor windings if suspect.',
      'Check VFD fault codes if motor is VFD-driven. Common: overcurrent, overvoltage, ground fault.',
    ],
  },
  {
    problem: 'Analog Reading is Wrong',
    steps: [
      'Check module status — any fault LEDs on the analog input module?',
      'Verify scaling in program: raw count to engineering units. 4mA = 0%, 20mA = 100%, typical raw 0-32767.',
      'Measure actual signal at module terminals with milliamp clamp or multimeter in series.',
      'If reading 0mA (not 4mA): wire is broken, transmitter is dead, or fuse is blown.',
      'If reading is correct at terminals but wrong in program: check channel configuration, scaling parameters.',
      'If reading is noisy/jumping: check cable shielding, route away from VFDs and power cables. Ground shield at one end only.',
      'If reading is offset: check calibration of transmitter. Zero and span adjustment may be needed.',
      'Check if input module filter time needs adjustment for the application.',
    ],
  },
  {
    problem: 'PLC Goes to Fault',
    steps: [
      'Read the fault code from the processor fault log. Note type and code number.',
      'Major fault = processor stopped. Minor fault = processor still running.',
      'Type 1 (Power-up): check power supply voltage, check battery, check for brownouts.',
      'Type 4 (I/O): check all modules are seated, check for disconnected cables, check module LEDs.',
      'Type 6 (Instruction): check for divide-by-zero, out-of-range array index, invalid address reference.',
      'Check if fault is repeatable — same conditions trigger it consistently?',
      'Check fault timestamp — does it correlate with any operational event (motor starting, VFD running)?',
      'If power-related, check for grounding issues. Mining environments often have ground fault problems.',
    ],
  },
  {
    problem: 'Output Turns On/Off Unexpectedly',
    steps: [
      'Go online and monitor the output rung. Which condition is changing?',
      'Check for forces — someone may have left a force on this output.',
      'Search entire program for this output address. Is it used on multiple rungs? (Last rung wins rule).',
      'Check if a timer is involved — is it timing out and resetting?',
      'If output is on an OTL, check all OTU rungs that affect it.',
      'Check scan time — if too slow, fast inputs may be missed between scans.',
      'Check for electrical noise on input wiring causing false triggers. Common near VFDs in mining.',
      'Verify field device is not bouncing (mechanical switch chatter). Add debounce timer if needed.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 4: Communication Protocols Data                                */
/* ------------------------------------------------------------------ */

interface Protocol {
  name: string
  description: string
  miningUse: string
  speed: string
  maxDistance: string
  maxNodes: string
}

const protocols: Protocol[] = [
  {
    name: 'EtherNet/IP',
    description: 'Industrial Ethernet protocol by ODVA, used by Allen-Bradley/Rockwell. Uses standard Ethernet hardware with CIP (Common Industrial Protocol) application layer. Supports implicit (I/O) and explicit (configuration) messaging.',
    miningUse: 'Primary network for Allen-Bradley PLCs in most Ontario mines. PLC-to-PLC communication, VFD control, HMI connections. Supports Device Level Ring (DLR) for redundancy.',
    speed: '100 Mbps / 1 Gbps',
    maxDistance: '100m per segment (standard Ethernet). Fiber optic for longer runs common in mines.',
    maxNodes: 'Practically unlimited (standard Ethernet switching)',
  },
  {
    name: 'Modbus TCP',
    description: 'Modbus protocol over TCP/IP Ethernet. Simple, open, widely supported. Client/server architecture. Register-based communication (holding registers, input registers, coils, discrete inputs).',
    miningUse: 'Connecting third-party devices to PLC systems. Power meters, UPS systems, building automation, intelligent motor controls. Universal translator between vendors.',
    speed: '10/100 Mbps (Ethernet)',
    maxDistance: '100m per segment (standard Ethernet)',
    maxNodes: '247 per server (Modbus address limit), multiple servers on network',
  },
  {
    name: 'Modbus RTU',
    description: 'Serial version of Modbus over RS-485 (or RS-232). Master/slave architecture. Binary frame format. Simple, reliable, and still very widely used. Open protocol.',
    miningUse: 'Legacy VFDs, power meters, environmental sensors, flow meters. Still common in mining for simple device integration. Easy to troubleshoot with serial monitor.',
    speed: '9600 to 115200 baud (typically 19200)',
    maxDistance: 'RS-485: up to 1200m. RS-232: up to 15m.',
    maxNodes: '32 devices on RS-485 (247 with repeaters)',
  },
  {
    name: 'DeviceNet',
    description: 'CAN-based fieldbus by ODVA, used with Allen-Bradley. Designed for device-level I/O networking. Trunk-and-drop topology. Combined power and signal on single cable.',
    miningUse: 'Connecting field devices: motor starters, sensors, pushbutton stations, pneumatic valve manifolds. Reduces wiring in mine process areas. Being replaced by EtherNet/IP in new installations.',
    speed: '125 / 250 / 500 Kbps (speed depends on distance)',
    maxDistance: '500m at 125Kbps, 250m at 250Kbps, 100m at 500Kbps',
    maxNodes: '64 nodes',
  },
  {
    name: 'ControlNet',
    description: 'Deterministic network by Rockwell Automation. Token-passing protocol. Supports both I/O and messaging. Redundant media option for high availability.',
    miningUse: 'Connecting remote I/O chassis to main PLC in large mining systems. High-speed deterministic communication for coordinated motion and process control.',
    speed: '5 Mbps',
    maxDistance: '1000m with coaxial, further with fiber repeaters',
    maxNodes: '99 nodes',
  },
  {
    name: 'PROFIBUS',
    description: 'Siemens-originated fieldbus. PROFIBUS DP (Decentralized Peripherals) for factory automation, PROFIBUS PA for process automation. RS-485 physical layer.',
    miningUse: 'Common in mines with Siemens PLCs. Remote I/O, motor drives, instrumentation. Well-established in European-designed mining equipment and process plants.',
    speed: '9.6 Kbps to 12 Mbps (distance-dependent)',
    maxDistance: '100m at 12Mbps, 1200m at 93.75Kbps. Repeaters extend further.',
    maxNodes: '126 devices (32 per segment without repeaters)',
  },
  {
    name: 'PROFINET',
    description: 'Siemens Ethernet-based protocol. Successor to PROFIBUS. Real-time Ethernet with IRT (Isochronous Real-Time) for motion control. Standard Ethernet hardware.',
    miningUse: 'Modern Siemens installations. S7-1500 to distributed I/O, drives, HMIs. Growing presence in new mining automation projects.',
    speed: '100 Mbps / 1 Gbps',
    maxDistance: '100m copper, further with fiber. Supports ring redundancy.',
    maxNodes: 'Practically unlimited',
  },
  {
    name: 'HART',
    description: 'Highway Addressable Remote Transducer. Digital signal superimposed on 4-20mA analog wiring. Allows configuration and diagnostics without additional wiring.',
    miningUse: 'Smart transmitter configuration and diagnostics. Calibrate instruments from control room. Common on pressure, level, and flow transmitters in mining process plants.',
    speed: '1200 baud (slow — for configuration, not control)',
    maxDistance: 'Same as 4-20mA wiring (up to 3000m depending on cable)',
    maxNodes: '15 devices in multidrop mode (rarely used); typically 1 per loop',
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 5: Common PLCs Data                                            */
/* ------------------------------------------------------------------ */

interface PLCInfo {
  manufacturer: string
  family: string
  software: string
  commonModules: string
  miningNotes: string
  status: 'current' | 'legacy' | 'obsolete'
}

const plcData: PLCInfo[] = [
  {
    manufacturer: 'Allen-Bradley',
    family: 'CompactLogix (1769-L3x/L4x)',
    software: 'Studio 5000 / RSLogix 5000',
    commonModules: '1769-IQ16 (16-pt DI), 1769-OB16 (16-pt DO), 1769-IF8 (8ch AI), 1769-OF4 (4ch AO), 1769-L33ER (processor)',
    miningNotes: 'Most common PLC in Ontario mining today. Compact form factor fits in mine electrical rooms. EtherNet/IP built-in. Supports Add-On Instructions for reusable code.',
    status: 'current',
  },
  {
    manufacturer: 'Allen-Bradley',
    family: 'ControlLogix (1756 series)',
    software: 'Studio 5000 / RSLogix 5000',
    commonModules: '1756-IB16I (isolated DI), 1756-OB16E (electronic DO), 1756-IF8 (8ch AI), 1756-EN2T (EtherNet/IP), 1756-L8x (processor)',
    miningNotes: 'Larger mining systems, mill process control, hoisting systems. Hot-swap capability. Redundancy options for critical processes. Modular chassis-based design.',
    status: 'current',
  },
  {
    manufacturer: 'Allen-Bradley',
    family: 'MicroLogix (1100/1400)',
    software: 'RSLogix 500',
    commonModules: '1762-IQ16 (DI expansion), 1762-OB16 (DO expansion), 1762-IF4 (AI). Built-in I/O on base unit. Ethernet port on 1100/1400.',
    miningNotes: 'Small standalone applications, auxiliary systems. Being discontinued — replaced by Micro800 series. Still very common in existing mining installations. Fixed I/O with expansion.',
    status: 'legacy',
  },
  {
    manufacturer: 'Allen-Bradley',
    family: 'SLC 500 (1747 series)',
    software: 'RSLogix 500',
    commonModules: '1746-IB16 (DI), 1746-OB16 (DO), 1746-NI4 (AI), 1746-P2 (power supply). Modular rack-based system.',
    miningNotes: 'Legacy workhorse — huge installed base in mining. Being replaced by CompactLogix. File-based addressing (N7, B3, T4, etc.). Spare parts becoming scarce.',
    status: 'legacy',
  },
  {
    manufacturer: 'Allen-Bradley',
    family: 'PLC-5 (1771 series)',
    software: 'RSLogix 5 (or 6200 for very old)',
    commonModules: '1771-IBD (DI), 1771-OBD (DO), 1771-IFE (AI). Large rack-based system.',
    miningNotes: 'Obsolete but still found in older mine hoists, mills, and process plants. Data Highway Plus (DH+) network. Extremely expensive to maintain. Migrate to ControlLogix when possible.',
    status: 'obsolete',
  },
  {
    manufacturer: 'Siemens',
    family: 'S7-1200',
    software: 'TIA Portal (STEP 7 Basic)',
    commonModules: 'SM 1221 (DI), SM 1222 (DO), SM 1231 (AI), SM 1232 (AO), CB 1241 (RS-485 comm). Compact base unit with built-in I/O.',
    miningNotes: 'Smaller applications, conveyors, auxiliary equipment. PROFINET built-in. Growing presence in Ontario mines. Good for standalone skid-mounted equipment.',
    status: 'current',
  },
  {
    manufacturer: 'Siemens',
    family: 'S7-1500',
    software: 'TIA Portal (STEP 7 Professional)',
    commonModules: 'DI 32x24VDC, DQ 32x24VDC, AI 8xU/I/RTD, AO 4xU/I. ET 200SP distributed I/O. Built-in web server and diagnostics.',
    miningNotes: 'Newer Siemens installations in mining. High performance, built-in security features. PROFINET IRT for motion control. Integrated display on some CPU models.',
    status: 'current',
  },
  {
    manufacturer: 'Siemens',
    family: 'S7-300 / S7-400',
    software: 'STEP 7 Classic (SIMATIC Manager)',
    commonModules: 'SM 321 (DI), SM 322 (DO), SM 331 (AI), SM 332 (AO), CP 343-1 (Ethernet). Modular rack-based design.',
    miningNotes: 'Legacy Siemens workhorse. Common in mines with European-designed processing equipment. Being replaced by S7-1500. PROFIBUS DP is typical network.',
    status: 'legacy',
  },
  {
    manufacturer: 'Schneider Electric',
    family: 'Modicon M340',
    software: 'Unity Pro / EcoStruxure Control Expert',
    commonModules: 'BMX DDI 1602 (16 DI), BMX DDO 1602 (16 DO), BMX AMI 0810 (8 AI), BMX EHC 0200 (high-speed counter). Modular rack-based.',
    miningNotes: 'Found in some mining operations, especially those with Schneider VFDs (Altivar). Modbus TCP/RTU native support. Good for process control applications.',
    status: 'current',
  },
  {
    manufacturer: 'Schneider Electric',
    family: 'Modicon M580',
    software: 'EcoStruxure Control Expert',
    commonModules: 'BME DDI 6402 (64 DI), BME DDO 6402 (64 DO), BME AHI 0812 (8 AI HART), BME CXM 0100 (Ethernet backplane). High-density I/O.',
    miningNotes: 'Schneider flagship. Ethernet backplane for high-speed communication. Redundancy options. Used in larger mining process control where Schneider is the standard.',
    status: 'current',
  },
]

/* ------------------------------------------------------------------ */
/*  Shared Styles                                                      */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
  padding: '12px 16px 4px',
}

const pillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 44,
  padding: '0 14px',
  borderRadius: 22,
  fontSize: 13,
  fontWeight: 600,
  border: '2px solid var(--divider)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
}

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: 'var(--primary)',
  color: '#000',
  border: '2px solid var(--primary)',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)',
  padding: 14,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 10,
}

const warningBox: React.CSSProperties = {
  background: 'rgba(255, 59, 48, 0.1)',
  border: '1px solid rgba(255, 59, 48, 0.3)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  fontSize: 13,
  color: '#ff6b6b',
  lineHeight: 1.5,
}

/* ------------------------------------------------------------------ */
/*  Collapsible Section Component                                      */
/* ------------------------------------------------------------------ */

function CollapsibleSection({
  title,
  defaultOpen = false,
  borderColor,
  children,
}: {
  title: string
  defaultOpen?: boolean
  borderColor?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        borderLeft: borderColor ? `4px solid ${borderColor}` : undefined,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          minHeight: 56,
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
        {title}
      </button>
      {open && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  I/O Card Component                                                 */
/* ------------------------------------------------------------------ */

function IOCard({ entry }: { entry: IOEntry }) {
  return (
    <div
      style={{
        ...cardStyle,
        borderLeft: `4px solid ${entry.tint}`,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 8,
        }}
      >
        {entry.name}
      </div>
      <div
        style={{
          display: 'inline-block',
          background: 'var(--input-bg)',
          borderRadius: 4,
          padding: '4px 8px',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--primary)',
          fontFamily: 'var(--font-mono)',
          marginBottom: 8,
        }}
      >
        {entry.voltage}
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: 6,
        }}
      >
        <strong style={{ color: 'var(--text)' }}>Wiring:</strong>{' '}
        {entry.wiring}
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--text)' }}>Use Case:</strong>{' '}
        {entry.useCase}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PLCBasicsPage() {
  const [tab, setTab] = useState<TabKey>('io')
  const [expandedTree, setExpandedTree] = useState<number | null>(null)

  return (
    <>
      <Header title="PLC Basics" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          paddingBottom: 120,
        }}
      >
        {/* Tab Pills */}
        <div style={pillRow}>
          {tabs.map((t) => (
            <button
              key={t.key}
              style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          style={{
            padding: '12px 16px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* ============================================= */}
          {/* TAB 1: I/O Types                              */}
          {/* ============================================= */}
          {tab === 'io' && (
            <>
              {/* Sourcing vs Sinking Explainer */}
              <div style={{ ...cardStyle, borderLeft: '4px solid var(--primary)' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                  Sourcing vs Sinking — Quick Explanation
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--text)' }}>Sourcing (PNP):</strong> The device <em>sources</em> current — it provides +24V on its output. Current flows FROM the device TO the PLC input, then to 0V common. Think: device is the source of current.
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 6 }}>
                  <strong style={{ color: 'var(--text)' }}>Sinking (NPN):</strong> The device <em>sinks</em> current — it provides a path to 0V. Current flows from +24V supply, through the PLC input, and DOWN through the device to 0V. Think: device is the sink (drain) for current.
                </div>
                <div style={{ ...warningBox, marginTop: 10 }}>
                  <strong>Important:</strong> You must match sensor type to input type. A PNP sensor needs a sourcing-compatible (sinking input) module, and vice versa. Most Allen-Bradley DC input modules accept both.
                </div>
              </div>

              {/* Digital Inputs */}
              <CollapsibleSection title="Digital Inputs" defaultOpen borderColor="#3b82f6">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {digitalInputs.map((entry) => (
                    <IOCard key={entry.name} entry={entry} />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Digital Outputs */}
              <CollapsibleSection title="Digital Outputs" defaultOpen={false} borderColor="#22c55e">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {digitalOutputs.map((entry) => (
                    <IOCard key={entry.name} entry={entry} />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Analog Inputs */}
              <CollapsibleSection title="Analog Inputs" defaultOpen={false} borderColor="#8b5cf6">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {analogInputs.map((entry) => (
                    <IOCard key={entry.name} entry={entry} />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Analog Outputs */}
              <CollapsibleSection title="Analog Outputs" defaultOpen={false} borderColor="#f59e0b">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {analogOutputs.map((entry) => (
                    <IOCard key={entry.name} entry={entry} />
                  ))}
                </div>
              </CollapsibleSection>
            </>
          )}

          {/* ============================================= */}
          {/* TAB 2: Ladder Logic                           */}
          {/* ============================================= */}
          {tab === 'ladder' && (
            <>
              <div style={sectionTitle}>Instructions Reference</div>

              {/* Bit Instructions */}
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Bit Instructions
              </div>
              {instructions
                .filter((i) => i.category === 'bit')
                .map((inst) => (
                  <div key={inst.name} style={{ ...cardStyle, borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 16,
                          fontWeight: 700,
                          color: 'var(--primary)',
                          background: 'var(--input-bg)',
                          borderRadius: 4,
                          padding: '2px 8px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {inst.symbol}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        {inst.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                      {inst.description}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Common Use:</strong> {inst.useCase}
                    </div>
                  </div>
                ))}

              {/* Timer Instructions */}
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 }}>
                Timer Instructions
              </div>
              {instructions
                .filter((i) => i.category === 'timer')
                .map((inst) => (
                  <div key={inst.name} style={{ ...cardStyle, borderLeft: '4px solid #22c55e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#22c55e',
                          background: 'var(--input-bg)',
                          borderRadius: 4,
                          padding: '2px 8px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {inst.symbol}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        {inst.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                      {inst.description}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Common Use:</strong> {inst.useCase}
                    </div>
                  </div>
                ))}

              {/* Counter Instructions */}
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 }}>
                Counter Instructions
              </div>
              {instructions
                .filter((i) => i.category === 'counter')
                .map((inst) => (
                  <div key={inst.name} style={{ ...cardStyle, borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#8b5cf6',
                          background: 'var(--input-bg)',
                          borderRadius: 4,
                          padding: '2px 8px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {inst.symbol}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        {inst.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                      {inst.description}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Common Use:</strong> {inst.useCase}
                    </div>
                  </div>
                ))}

              {/* Math / Data Instructions */}
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 }}>
                Math / Data Instructions
              </div>
              {instructions
                .filter((i) => i.category === 'math')
                .map((inst) => (
                  <div key={inst.name} style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#f59e0b',
                          background: 'var(--input-bg)',
                          borderRadius: 4,
                          padding: '2px 8px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {inst.symbol}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        {inst.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                      {inst.description}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Common Use:</strong> {inst.useCase}
                    </div>
                  </div>
                ))}

              {/* Program Flow Instructions */}
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 }}>
                Program Flow
              </div>
              {instructions
                .filter((i) => i.category === 'flow')
                .map((inst) => (
                  <div key={inst.name} style={{ ...cardStyle, borderLeft: '4px solid #ec4899' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#ec4899',
                          background: 'var(--input-bg)',
                          borderRadius: 4,
                          padding: '2px 8px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {inst.symbol}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        {inst.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                      {inst.description}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Common Use:</strong> {inst.useCase}
                    </div>
                  </div>
                ))}

              {/* Tips Section */}
              <div style={{ ...sectionTitle, marginTop: 12 }}>Tips & Common Mistakes</div>
              {ladderTips.map((tip) => (
                <div
                  key={tip.title}
                  style={{
                    ...(tip.isWarning ? warningBox : cardStyle),
                    ...(!tip.isWarning ? { borderLeft: '4px solid var(--primary)' } : {}),
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: tip.isWarning ? '#ff6b6b' : 'var(--text)',
                      marginBottom: 4,
                    }}
                  >
                    {tip.isWarning ? '\⚠ ' : ''}{tip.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: tip.isWarning ? '#ff9999' : 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {tip.detail}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ============================================= */}
          {/* TAB 3: Troubleshooting                        */}
          {/* ============================================= */}
          {tab === 'troubleshoot' && (
            <>
              {/* Safety Warning */}
              <div style={warningBox}>
                <strong>SAFETY WARNING:</strong> Before troubleshooting any PLC system in a mine, ensure proper lockout/tagout procedures are followed per O. Reg. 854. Never reach into energized panels. Verify zero energy before touching any wiring. Inform the shift supervisor before forcing any I/O.
              </div>

              {/* Troubleshooting Sections */}
              {troubleshootSections.map((section) => (
                <CollapsibleSection
                  key={section.title}
                  title={`${section.icon} ${section.title}`}
                  defaultOpen={section.title === 'Systematic Approach'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {section.steps.map((s, i) => (
                      <div
                        key={i}
                        style={
                          s.isWarning
                            ? { ...warningBox }
                            : {
                                padding: '10px 12px',
                                background: 'var(--input-bg)',
                                borderRadius: 'var(--radius-sm)',
                                borderLeft: '3px solid var(--primary)',
                              }
                        }
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'flex-start',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 12,
                              fontWeight: 700,
                              color: s.isWarning ? '#ff6b6b' : 'var(--primary)',
                              background: s.isWarning ? 'rgba(255,59,48,0.15)' : 'var(--surface)',
                              borderRadius: 4,
                              padding: '2px 6px',
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {s.isWarning ? '\⚠' : (i + 1)}
                          </span>
                          <div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: s.isWarning ? '#ff6b6b' : 'var(--text)',
                                marginBottom: 2,
                              }}
                            >
                              {s.step}
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: s.isWarning ? '#ff9999' : 'var(--text-secondary)',
                                lineHeight: 1.6,
                              }}
                            >
                              {s.detail}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              ))}

              {/* Decision Trees */}
              <div style={{ ...sectionTitle, marginTop: 8 }}>
                Troubleshooting Decision Trees
              </div>

              {decisionTrees.map((tree, treeIdx) => (
                <div key={tree.problem} style={{ ...cardStyle, borderLeft: '4px solid var(--primary)' }}>
                  <button
                    onClick={() =>
                      setExpandedTree(expandedTree === treeIdx ? null : treeIdx)
                    }
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      minHeight: 44,
                    }}
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="var(--primary)"
                      style={{
                        flexShrink: 0,
                        transform:
                          expandedTree === treeIdx
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--primary)',
                        textAlign: 'left',
                      }}
                    >
                      {tree.problem}
                    </span>
                  </button>
                  {expandedTree === treeIdx && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        marginTop: 12,
                        paddingLeft: 4,
                      }}
                    >
                      {tree.steps.map((step, stepIdx) => (
                        <div
                          key={stepIdx}
                          style={{
                            display: 'flex',
                            gap: 10,
                            alignItems: 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <span
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: 'var(--primary)',
                                color: '#000',
                                fontSize: 12,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {stepIdx + 1}
                            </span>
                            {stepIdx < tree.steps.length - 1 && (
                              <div
                                style={{
                                  width: 2,
                                  height: 16,
                                  background: 'var(--divider)',
                                  marginTop: 4,
                                }}
                              />
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: 'var(--text-secondary)',
                              lineHeight: 1.6,
                              paddingTop: 2,
                            }}
                          >
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ============================================= */}
          {/* TAB 4: Communication Protocols                 */}
          {/* ============================================= */}
          {tab === 'comm' && (
            <>
              <div style={sectionTitle}>Industrial Communication Protocols</div>

              {protocols.map((proto) => (
                <div key={proto.name} style={{ ...cardStyle, borderLeft: '4px solid var(--primary)' }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--primary)',
                      marginBottom: 6,
                    }}
                  >
                    {proto.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: 8,
                    }}
                  >
                    {proto.description}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: 8,
                      background: 'var(--input-bg)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 10px',
                    }}
                  >
                    <strong style={{ color: 'var(--text)' }}>Mining Use:</strong>{' '}
                    {proto.miningUse}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        background: 'var(--input-bg)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: 'var(--text-secondary)',
                          textTransform: 'uppercase',
                          marginBottom: 2,
                        }}
                      >
                        Speed
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--primary)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {proto.speed}
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'var(--input-bg)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: 'var(--text-secondary)',
                          textTransform: 'uppercase',
                          marginBottom: 2,
                        }}
                      >
                        Max Distance
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--text)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {proto.maxDistance}
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'var(--input-bg)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: 'var(--text-secondary)',
                          textTransform: 'uppercase',
                          marginBottom: 2,
                        }}
                      >
                        Max Nodes
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--text)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {proto.maxNodes}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Comparison Quick Reference */}
              <div style={{ ...sectionTitle, marginTop: 8 }}>Quick Comparison</div>
              <div
                style={{
                  ...cardStyle,
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  padding: 0,
                }}
              >
                <table
                  style={{
                    width: '100%',
                    minWidth: 500,
                    borderCollapse: 'collapse',
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: 'var(--input-bg)',
                        borderBottom: '2px solid var(--divider)',
                      }}
                    >
                      {['Protocol', 'Medium', 'Speed', 'Vendor'].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: '10px 8px',
                              textAlign: 'left',
                              fontWeight: 700,
                              color: 'var(--primary)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['EtherNet/IP', 'Ethernet', '100M/1Gbps', 'Rockwell/ODVA'],
                      ['Modbus TCP', 'Ethernet', '100Mbps', 'Open/Schneider'],
                      ['Modbus RTU', 'RS-485/232', '115.2Kbps', 'Open/Schneider'],
                      ['DeviceNet', 'CAN bus', '500Kbps', 'Rockwell/ODVA'],
                      ['ControlNet', 'Coax/Fiber', '5Mbps', 'Rockwell'],
                      ['PROFIBUS', 'RS-485', '12Mbps', 'Siemens/PI'],
                      ['PROFINET', 'Ethernet', '100M/1Gbps', 'Siemens/PI'],
                      ['HART', '4-20mA wire', '1.2Kbps', 'Open/FieldComm'],
                    ].map((row, i) => (
                      <tr
                        key={row[0]}
                        style={{
                          borderBottom: '1px solid var(--divider)',
                          background:
                            i % 2 === 0 ? 'transparent' : 'var(--input-bg)',
                        }}
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            style={{
                              padding: '8px',
                              color:
                                ci === 0
                                  ? 'var(--primary)'
                                  : 'var(--text-secondary)',
                              fontWeight: ci === 0 ? 600 : 400,
                              fontFamily:
                                ci === 2
                                  ? 'var(--font-mono)'
                                  : 'var(--font-sans)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ============================================= */}
          {/* TAB 5: Common PLCs                            */}
          {/* ============================================= */}
          {tab === 'plcs' && (
            <>
              <div style={sectionTitle}>PLCs Common in Ontario Mining</div>

              {/* Status Legend */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginBottom: 4,
                }}
              >
                {[
                  { label: 'Current', color: '#22c55e' },
                  { label: 'Legacy', color: '#f59e0b' },
                  { label: 'Obsolete', color: '#ef4444' },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: s.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {plcData.map((plc) => {
                const statusColor =
                  plc.status === 'current'
                    ? '#22c55e'
                    : plc.status === 'legacy'
                      ? '#f59e0b'
                      : '#ef4444'
                const statusLabel =
                  plc.status === 'current'
                    ? 'Current'
                    : plc.status === 'legacy'
                      ? 'Legacy'
                      : 'Obsolete'

                return (
                  <div
                    key={plc.family}
                    style={{
                      ...cardStyle,
                      borderLeft: `4px solid ${statusColor}`,
                    }}
                  >
                    {/* Header row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 4,
                        gap: 8,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: 0.3,
                          }}
                        >
                          {plc.manufacturer}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: 'var(--text)',
                          }}
                        >
                          {plc.family}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: statusColor,
                          background: `${statusColor}15`,
                          border: `1px solid ${statusColor}40`,
                          borderRadius: 12,
                          padding: '2px 8px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {/* Software */}
                    <div
                      style={{
                        display: 'inline-block',
                        background: 'var(--input-bg)',
                        borderRadius: 4,
                        padding: '4px 8px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--primary)',
                        fontFamily: 'var(--font-mono)',
                        marginBottom: 8,
                      }}
                    >
                      {plc.software}
                    </div>

                    {/* Common Modules */}
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: 6,
                      }}
                    >
                      <strong style={{ color: 'var(--text)' }}>
                        Common Modules:
                      </strong>{' '}
                      {plc.commonModules}
                    </div>

                    {/* Mining Notes */}
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        background: 'var(--input-bg)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 10px',
                      }}
                    >
                      <strong style={{ color: 'var(--text)' }}>
                        Mining Notes:
                      </strong>{' '}
                      {plc.miningNotes}
                    </div>
                  </div>
                )
              })}

              {/* Quick Software Reference */}
              <div style={{ ...sectionTitle, marginTop: 8 }}>
                Software Quick Reference
              </div>
              <div
                style={{
                  ...cardStyle,
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  padding: 0,
                }}
              >
                <table
                  style={{
                    width: '100%',
                    minWidth: 420,
                    borderCollapse: 'collapse',
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: 'var(--input-bg)',
                        borderBottom: '2px solid var(--divider)',
                      }}
                    >
                      {['PLC Family', 'Software', 'Language'].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: '10px 8px',
                            textAlign: 'left',
                            fontWeight: 700,
                            color: 'var(--primary)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['CompactLogix / ControlLogix', 'Studio 5000', 'Ladder, FBD, ST, SFC'],
                      ['MicroLogix', 'RSLogix 500', 'Ladder only'],
                      ['SLC 500', 'RSLogix 500', 'Ladder only'],
                      ['PLC-5', 'RSLogix 5', 'Ladder, SFC'],
                      ['S7-1200 / S7-1500', 'TIA Portal', 'Ladder, FBD, SCL, STL'],
                      ['S7-300 / S7-400', 'STEP 7 Classic', 'Ladder, FBD, STL'],
                      ['M340 / M580', 'Control Expert', 'Ladder, FBD, ST, SFC, IL'],
                    ].map((row, i) => (
                      <tr
                        key={row[0]}
                        style={{
                          borderBottom: '1px solid var(--divider)',
                          background:
                            i % 2 === 0 ? 'transparent' : 'var(--input-bg)',
                        }}
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            style={{
                              padding: '8px',
                              color:
                                ci === 0
                                  ? 'var(--text)'
                                  : 'var(--text-secondary)',
                              fontWeight: ci === 0 ? 600 : 400,
                              fontFamily:
                                ci === 1
                                  ? 'var(--font-mono)'
                                  : 'var(--font-sans)',
                              whiteSpace: ci === 2 ? 'normal' : 'nowrap',
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ============================================= */}
          {/* Footer Reference Note                         */}
          {/* ============================================= */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--divider)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginTop: 4,
            }}
          >
            <strong style={{ color: 'var(--text)' }}>Note:</strong> This
            reference covers general PLC concepts. Always consult the
            manufacturer documentation for specific hardware configurations.
            Follow all site-specific safety procedures and Ontario Mining
            Regulations (O. Reg. 854) when working with PLC-controlled
            equipment in mines.
          </div>
        </div>
      </div>
    </>
  )
}
