import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  VFD Reference - Comprehensive Guide for Ontario Mining Electricians */
/* ------------------------------------------------------------------ */

type TabKey = 'basics' | 'parameters' | 'faults' | 'installation' | 'sizing'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'basics', label: 'Basics' },
  { key: 'parameters', label: 'Parameters' },
  { key: 'faults', label: 'Fault Codes' },
  { key: 'installation', label: 'Installation' },
  { key: 'sizing', label: 'Sizing' },
]

/* ------------------------------------------------------------------ */
/*  Tab 1: VFD Basics Data                                             */
/* ------------------------------------------------------------------ */

const blockDiagram = `  AC Supply          CONVERTER           DC BUS            INVERTER           Motor
  3-Phase   ──►  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐   ┌─────────┐
  L1 ──────────►│             │   │              │   │             │   │         │
  L2 ──────────►│  Rectifier  ├──►│  Capacitor   ├──►│  IGBTs      ├──►│  3-Ph   │
  L3 ──────────►│  (AC → DC)  │   │  Bank        │   │  (DC → AC)  │   │  Motor  │
               └─────────────┘   │  (Smoothing)  │   │  (PWM)      │   │         │
                  Diode Bridge    └──────────────┘   └─────────────┘   └─────────┘
                  or SCR                Stores          Switches at      Variable
                  6-pulse or           energy,          high freq to     speed &
                  12-pulse             smooths DC       create AC        torque`

interface BlockSection {
  name: string
  component: string
  function: string
  failureMode: string
  color: string
}

const blockSections: BlockSection[] = [
  {
    name: 'Converter (Rectifier)',
    component: 'Diode bridge (6-pulse) or SCR bridge',
    function: 'Converts incoming 3-phase AC to DC. In a 6-pulse design, six diodes conduct in pairs to produce pulsating DC. SCR-based converters allow regenerative braking.',
    failureMode: 'Open/shorted diodes cause DC bus imbalance, input current distortion, or blown fuses.',
    color: '#3b82f6',
  },
  {
    name: 'DC Bus (Capacitor Bank)',
    component: 'Electrolytic capacitors',
    function: 'Smooths the pulsating DC from the rectifier into a stable DC voltage. Bus voltage is approximately 1.35 x line voltage (e.g., ~650VDC on 480V system, ~810VDC on 600V). Stores energy for brief power dips.',
    failureMode: 'Capacitor aging (drying out) causes voltage ripple, nuisance DC bus faults, and reduced ride-through. Typical lifespan: 5-10 years depending on temperature.',
    color: '#22c55e',
  },
  {
    name: 'Inverter (IGBT Section)',
    component: 'Insulated Gate Bipolar Transistors (IGBTs)',
    function: 'Rapidly switches DC bus voltage on/off using Pulse Width Modulation (PWM) to create a simulated AC waveform at the desired frequency and voltage. Six IGBTs in three pairs create 3-phase output.',
    failureMode: 'IGBT failure causes output phase loss or short circuit. Usually caused by overcurrent, overheating, or voltage spikes from long cable runs.',
    color: '#8b5cf6',
  },
  {
    name: 'Control Board',
    component: 'Microprocessor, DSP, gate drivers',
    function: 'Runs the motor control algorithm (V/Hz, vector, etc.). Reads feedback, processes parameters, generates PWM signals for IGBTs, handles communication and I/O.',
    failureMode: 'Firmware crashes, corrupted parameters, communication failures. Power supply issues on control board can cause random faults.',
    color: '#f59e0b',
  },
]

const vhzExplanation = [
  {
    title: 'V/Hz Law (Volts-per-Hertz)',
    detail: 'To maintain constant motor flux (and therefore constant torque), voltage and frequency must scale proportionally. At 60Hz/460V, the ratio is 7.67 V/Hz. At 30Hz, voltage should be ~230V. Below about 5-10Hz, the VFD must "boost" voltage to overcome stator resistance (IR drop).',
  },
  {
    title: 'Base Speed (Nameplate RPM)',
    detail: 'The speed at which the motor produces rated torque at rated voltage and frequency. For a 4-pole motor on 60Hz: synchronous speed = 1800 RPM, nameplate ~1760 RPM. Running below base speed = constant torque region.',
  },
  {
    title: 'Above Base Speed',
    detail: 'Running above 60Hz: voltage cannot increase beyond rated (already at max), so the V/Hz ratio drops. Motor enters "field weakening" — constant HP region. Torque decreases as speed increases. HP stays roughly constant. Used for fans and spindles, rarely in mining.',
  },
  {
    title: 'Constant Torque Region (0 to Base Speed)',
    detail: 'Below base speed, the VFD maintains V/Hz ratio so motor produces rated torque. Current stays near FLA at full load. This is where most mining applications operate — conveyors, crushers, hoists, pumps.',
  },
  {
    title: 'Constant HP Region (Above Base Speed)',
    detail: 'Above base speed, voltage is maxed out. Frequency increases but voltage stays flat. Torque drops inversely with speed. HP = Torque x Speed / 5252, so HP stays roughly constant. Not common in mining — mostly machine tool spindles.',
  },
]

interface ComparisonRow {
  feature: string
  dol: string
  softStarter: string
  vfd: string
}

const comparisonTable: ComparisonRow[] = [
  { feature: 'Starting Current', dol: '600-800% FLA', softStarter: '200-400% FLA', vfd: '100-150% FLA' },
  { feature: 'Speed Control', dol: 'None (full speed only)', softStarter: 'None (ramp up/down only)', vfd: 'Full 0-100% continuously' },
  { feature: 'Torque Control', dol: 'None', softStarter: 'Limited (voltage ramp)', vfd: 'Full torque control' },
  { feature: 'Energy Savings', dol: 'None', softStarter: 'Minimal', vfd: '20-50% on variable loads' },
  { feature: 'Mechanical Stress', dol: 'High (sudden start)', softStarter: 'Reduced', vfd: 'Minimal (smooth ramp)' },
  { feature: 'Typical Cost', dol: 'Lowest', softStarter: '2-3x DOL', vfd: '5-10x DOL' },
  { feature: 'Complexity', dol: 'Simplest', softStarter: 'Moderate', vfd: 'Most complex' },
  { feature: 'Size', dol: 'Smallest', softStarter: 'Medium', vfd: 'Largest (+ heatsink)' },
  { feature: 'Harmonics', dol: 'None (on utility)', softStarter: 'Minor during start', vfd: 'Significant (need filters)' },
  { feature: 'Bypass Capable', dol: 'N/A', softStarter: 'Yes (common)', vfd: 'Yes (critical apps)' },
  { feature: 'Best For', dol: 'Simple fixed-speed', softStarter: 'Reduce start current only', vfd: 'Variable speed required' },
]

interface MiningApp {
  application: string
  why: string
  typicalBrands: string
  notes: string
  color: string
}

const miningApplications: MiningApp[] = [
  {
    application: 'Conveyor Belt Drives',
    why: 'Speed control for varying material loads. Soft starting reduces belt stress and splice failures. Multiple drives can load-share.',
    typicalBrands: 'Allen-Bradley PowerFlex 755, ABB ACS880, Siemens G120/S120',
    notes: 'Often need regenerative capability for downhill conveyors. Consider dynamic braking resistors. Speed range typically 50-100%.',
    color: '#3b82f6',
  },
  {
    application: 'Pump Stations',
    why: 'Huge energy savings — pump power varies with cube of speed (50% speed = 12.5% power). Reduces water hammer on start/stop. Maintains constant pressure with PID control.',
    typicalBrands: 'ABB ACS580/ACS880, Danfoss FC302, PowerFlex 525',
    notes: 'Variable torque application — can use standard duty VFD. Add pipe-fill function to prevent water hammer. Common in dewatering and process water systems.',
    color: '#22c55e',
  },
  {
    application: 'Ventilation Fans',
    why: 'Energy savings similar to pumps (cube law). Underground mines require variable ventilation for different mining phases. On-demand ventilation saves massive energy costs.',
    typicalBrands: 'ABB ACS880, Siemens G120, Danfoss VLT HVAC',
    notes: 'Variable torque — standard duty sizing OK. Long cable runs common (use output filters). Critical application — consider bypass contactor.',
    color: '#8b5cf6',
  },
  {
    application: 'Hoist Drives',
    why: 'Precise speed and torque control for personnel and material hoists. Smooth acceleration/deceleration. Regenerative braking recovers energy during lowering.',
    typicalBrands: 'ABB ACS880 (with regen), Siemens S120, PowerFlex 755T',
    notes: 'CRITICAL SAFETY APPLICATION. Requires redundant safety systems, overspeed monitoring, mechanical brakes. Must use flux vector or DTC control mode. Constant torque — oversize VFD.',
    color: '#ef4444',
  },
  {
    application: 'Crushers & Mills',
    why: 'High starting torque for loaded starts. Speed optimization for different ore types. Reduces mechanical shock on startup.',
    typicalBrands: 'ABB ACS880, Siemens G120X, PowerFlex 755',
    notes: 'Constant torque with high starting torque — oversize VFD by one frame. Cyclic loading may need further oversizing. Consider incoming harmonic filters.',
    color: '#f59e0b',
  },
  {
    application: 'Compressors',
    why: 'Match air/gas output to demand. Eliminate load/unload cycling. Significant energy savings at partial load.',
    typicalBrands: 'Danfoss FC302, ABB ACS580, PowerFlex 525/755',
    notes: 'Check compressor OEM approval — some scroll/screw compressors have minimum speed limits. May need output filters to protect compressor motor bearings.',
    color: '#06b6d4',
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 2: Parameters Data                                             */
/* ------------------------------------------------------------------ */

interface Parameter {
  name: string
  description: string
  typicalRange: string
  abRef: string
  abbRef: string
  siemensRef: string
  tip?: string
}

interface ParamCategory {
  category: string
  color: string
  params: Parameter[]
}

const parameterCategories: ParamCategory[] = [
  {
    category: 'Motor Nameplate',
    color: '#3b82f6',
    params: [
      {
        name: 'Motor Rated Voltage',
        description: 'Nameplate voltage of the motor. Must match VFD output rating.',
        typicalRange: '208V, 460V, 575V',
        abRef: 'P041 (Motor NP Volts)',
        abbRef: 'Group 99: Motor Data',
        siemensRef: 'P0304',
        tip: 'Always set this FIRST. Wrong voltage = wrong V/Hz ratio = motor overheating.',
      },
      {
        name: 'Motor Rated Current (FLA)',
        description: 'Full Load Amps from motor nameplate. Sets the overload protection baseline.',
        typicalRange: 'Per nameplate',
        abRef: 'P042 (Motor NP FLA)',
        abbRef: 'Par 99.06 Motor Nom Current',
        siemensRef: 'P0305',
        tip: 'Enter EXACT nameplate value. Do NOT use CEC table values — use actual nameplate FLA.',
      },
      {
        name: 'Motor Rated HP/kW',
        description: 'Nameplate horsepower or kilowatt rating. Used for thermal model calculations.',
        typicalRange: 'Per nameplate',
        abRef: 'P040 (Motor NP Power)',
        abbRef: 'Par 99.03 Motor Nom Power',
        siemensRef: 'P0307',
      },
      {
        name: 'Motor Rated RPM',
        description: 'Nameplate speed at rated load. Used to calculate slip for vector control.',
        typicalRange: '1140-3450 RPM',
        abRef: 'P043 (Motor NP RPM)',
        abbRef: 'Par 99.07 Motor Nom Speed',
        siemensRef: 'P0311',
        tip: 'Critical for vector control — motor ID/auto-tune uses this to calculate slip.',
      },
      {
        name: 'Motor Rated Frequency',
        description: 'Nameplate frequency. Usually 60Hz in North America.',
        typicalRange: '50 or 60Hz',
        abRef: 'P044 (Motor NP Freq)',
        abbRef: 'Par 99.04 Motor Nom Freq',
        siemensRef: 'P0310',
      },
    ],
  },
  {
    category: 'Speed Settings',
    color: '#22c55e',
    params: [
      {
        name: 'Maximum Frequency',
        description: 'Upper speed limit. Usually set at or near motor nameplate frequency.',
        typicalRange: '50-120Hz',
        abRef: 'P036 (Maximum Freq)',
        abbRef: 'Par 20.02 Maximum Freq',
        siemensRef: 'P1082',
        tip: 'Running above base frequency (60Hz) enters field weakening — torque drops. Only do this if the application requires it.',
      },
      {
        name: 'Minimum Frequency',
        description: 'Lower speed limit. Prevents motor from running too slowly (overheating due to reduced cooling).',
        typicalRange: '0-20Hz',
        abRef: 'P037 (Minimum Freq)',
        abbRef: 'Par 20.01 Minimum Freq',
        siemensRef: 'P1080',
        tip: 'Most TEFC motors should not run below 15-20% speed continuously without external cooling (force-ventilated motor or separate blower).',
      },
      {
        name: 'Acceleration Time',
        description: 'Time to ramp from 0 to maximum frequency. Longer time = softer start, less current.',
        typicalRange: '5-60 seconds',
        abRef: 'P045 (Accel Time 1)',
        abbRef: 'Par 22.02 Accel Time 1',
        siemensRef: 'P1120',
        tip: 'Conveyors: 15-30s typical. Pumps: 10-20s. Crushers: 20-45s. Too fast = overcurrent trip. Too slow = motor overheating during accel.',
      },
      {
        name: 'Deceleration Time',
        description: 'Time to ramp from maximum frequency to 0. Affects regenerative voltage.',
        typicalRange: '5-120 seconds',
        abRef: 'P046 (Decel Time 1)',
        abbRef: 'Par 22.03 Decel Time 1',
        siemensRef: 'P1121',
        tip: 'Too fast decel on high-inertia loads = overvoltage trip (regen energy). Solutions: increase decel time, add braking resistor, or enable DC bus regulation.',
      },
      {
        name: 'Skip Frequencies',
        description: 'Frequency ranges the VFD will skip over to avoid mechanical resonance.',
        typicalRange: 'Application-specific',
        abRef: 'P049/P050 (Skip Freq)',
        abbRef: 'Par 22.51-52 Critical Freq',
        siemensRef: 'P1091-P1094',
        tip: 'If equipment vibrates badly at certain speeds, set skip frequencies to jump over those resonant points. Common with fans and long conveyors.',
      },
    ],
  },
  {
    category: 'Protection',
    color: '#ef4444',
    params: [
      {
        name: 'Motor Overload Level',
        description: 'Percentage of motor FLA at which thermal overload protection activates. Acts like an electronic OL relay.',
        typicalRange: '100-115% of motor FLA',
        abRef: 'P047 (Motor OL Current)',
        abbRef: 'Par 30.11 Motor Thermal Limit',
        siemensRef: 'P0640',
        tip: 'Set to motor service factor. SF 1.15 = set to 115%. This replaces the traditional overload relay — do NOT also install an external OL in series.',
      },
      {
        name: 'Current Limit',
        description: 'Maximum output current the VFD will allow. Limits torque during overloads.',
        typicalRange: '100-150% of drive rated current',
        abRef: 'P039 (Current Limit)',
        abbRef: 'Par 20.06 Current Limit',
        siemensRef: 'P0640',
        tip: 'Set based on application: 110% for variable torque (fans/pumps), 150% for constant torque (conveyors/crushers).',
      },
      {
        name: 'Ground Fault Enable',
        description: 'Enables ground fault detection on VFD output. Critical for mining applications.',
        typicalRange: 'Enable/Disable',
        abRef: 'A095 (Ground Fault)',
        abbRef: 'Par 30.21 Earth Fault',
        siemensRef: 'P0578',
        tip: 'ALWAYS enable in mining. Ontario Reg 854 requires ground fault protection. VFD ground fault detection supplements (does not replace) upstream GF relay.',
      },
      {
        name: 'Stall Prevention',
        description: 'Prevents motor stall by reducing frequency when current exceeds limit during acceleration.',
        typicalRange: 'Enable/Disable + level',
        abRef: 'A090 (Stall Fault)',
        abbRef: 'Par 30.01 Stall Function',
        siemensRef: 'P1610',
      },
    ],
  },
  {
    category: 'Control Mode',
    color: '#8b5cf6',
    params: [
      {
        name: 'V/Hz (Volts-per-Hertz)',
        description: 'Simplest control mode. Maintains fixed voltage/frequency ratio. Good for most standard applications. No feedback needed.',
        typicalRange: 'Default mode',
        abRef: 'P035=0 (V/Hz Mode)',
        abbRef: 'Par 99.01=1 (Scalar)',
        siemensRef: 'P1300=0',
        tip: 'Use for: fans, pumps, simple conveyors, multi-motor applications (one VFD driving multiple motors). Cannot provide full torque at zero speed.',
      },
      {
        name: 'Sensorless Vector',
        description: 'Estimates rotor position using motor model. Better torque response than V/Hz. Requires motor auto-tune.',
        typicalRange: 'Most common for conveyors',
        abRef: 'P035=2 (SVC Mode)',
        abbRef: 'Par 99.01=2 (Vector)',
        siemensRef: 'P1300=20',
        tip: 'Best balance of performance and simplicity for most mining apps. Requires motor auto-tune for best results. One motor per VFD only.',
      },
      {
        name: 'Flux Vector (Closed Loop)',
        description: 'Uses encoder feedback for precise speed and torque control. Best performance but most complex.',
        typicalRange: 'Hoists, winders',
        abRef: 'P035=4 (FV Mode)',
        abbRef: 'Par 99.01=3 (DTC)',
        siemensRef: 'P1300=21',
        tip: 'Required for hoist/winder applications where holding torque at zero speed is critical. Needs encoder feedback. Full 4-quadrant operation.',
      },
      {
        name: 'DTC (Direct Torque Control)',
        description: 'ABB proprietary method. Controls torque and flux directly without PWM modulator. Very fast torque response.',
        typicalRange: 'ABB drives only',
        abRef: 'N/A',
        abbRef: 'Par 99.01=3 (DTC)',
        siemensRef: 'N/A',
        tip: 'ABB ACS880 default. Excellent torque response (2-5ms). Good for crane, hoist, and winder applications. Requires motor ID run.',
      },
    ],
  },
  {
    category: 'I/O Setup',
    color: '#f59e0b',
    params: [
      {
        name: 'Start/Stop Source',
        description: 'Where the VFD receives run/stop commands: terminal block, keypad, or network.',
        typicalRange: 'Terminal / Keypad / Fieldbus',
        abRef: 'P046 (Start Source)',
        abbRef: 'Par 10.01 Ext1 Commands',
        siemensRef: 'P0700',
        tip: '2-wire: maintained signal (high=run, low=stop). 3-wire: momentary start/stop pulses with latching. 2-wire is most common in mining.',
      },
      {
        name: 'Speed Reference Source',
        description: 'Where the VFD gets its speed command: analog input (4-20mA or 0-10V), preset speeds, keypad, or fieldbus.',
        typicalRange: '4-20mA most common',
        abRef: 'P048 (Speed Ref)',
        abbRef: 'Par 11.01 Ext Ref1 Select',
        siemensRef: 'P1000',
        tip: '4-20mA preferred over 0-10V for long runs (current signal immune to voltage drop). Scale: 4mA=min speed, 20mA=max speed.',
      },
      {
        name: 'Relay Output Assignment',
        description: 'Configures what the relay outputs signal: running, faulted, at speed, warning, etc.',
        typicalRange: 'Drive Faulted, At Speed, Running',
        abRef: 'A052 (Relay 1 Sel)',
        abbRef: 'Par 14.01 Relay Output 1',
        siemensRef: 'P0731',
        tip: 'Common setup: Relay 1 = "Fault" (NC contact breaks on fault for safety chain). Relay 2 = "Running" or "At Speed" for interlock confirmation.',
      },
      {
        name: 'Analog Output',
        description: 'Configures analog output signal: output frequency, current, power, DC bus voltage.',
        typicalRange: '4-20mA or 0-10V',
        abRef: 'A054 (Analog Out Sel)',
        abbRef: 'Par 15.01 AO1 Content',
        siemensRef: 'P0771',
        tip: 'Use for remote speed indication, DCS/PLC feedback, or power monitoring. Scale output to match receiver input range.',
      },
    ],
  },
  {
    category: 'Communication',
    color: '#06b6d4',
    params: [
      {
        name: 'Modbus RTU',
        description: 'Serial communication over RS-485. Simple, widely supported. Master/slave architecture.',
        typicalRange: '9600-19200 baud',
        abRef: 'Adapter P-DPI module',
        abbRef: 'Built-in on ACS580/880',
        siemensRef: 'Built-in USS / Modbus',
        tip: 'Most common for simple setups. Set station address, baud rate, parity. Max 32 devices on one bus. Use twisted shielded pair cable.',
      },
      {
        name: 'EtherNet/IP',
        description: 'Industrial Ethernet protocol. Fast, flexible. Standard in Allen-Bradley/Rockwell systems.',
        typicalRange: '100 Mbps',
        abRef: 'Built-in on PF525/755',
        abbRef: 'FENA-01/21 adapter',
        siemensRef: 'PROFINET preferred',
        tip: 'Allen-Bradley standard. PowerFlex drives have dual-port switch built in for daisy-chaining. Set IP address and configure I/O assembly.',
      },
      {
        name: 'DeviceNet',
        description: 'CAN-based fieldbus. Common in older Allen-Bradley systems. Being phased out in favor of EtherNet/IP.',
        typicalRange: '125-500 kbps',
        abRef: 'Built-in on older PF drives',
        abbRef: 'FDNA-01 adapter',
        siemensRef: 'Not common',
        tip: 'Legacy protocol — still found in many existing mine installations. Set MAC ID and baud rate. Max 64 nodes per segment.',
      },
      {
        name: 'PROFIBUS / PROFINET',
        description: 'Siemens standard fieldbus (PROFIBUS DP) and industrial Ethernet (PROFINET). Dominant in Siemens-based systems.',
        typicalRange: 'Up to 12 Mbps / 100 Mbps',
        abRef: 'Not common',
        abbRef: 'FPBA-01 adapter',
        siemensRef: 'Built-in on G120/S120',
        tip: 'If the mine uses Siemens PLCs (S7-1500/1200), PROFINET is the natural choice. Telegram types define data structure. PZD (process data) and PKW (parameter data).',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 3: Fault Codes Data                                            */
/* ------------------------------------------------------------------ */

interface FaultCode {
  code: string
  name: string
  severity: 'trip' | 'warning'
  description: string
  causes: string[]
  troubleshooting: string[]
  callSpecialist: string
  color: string
}

const faultCodes: FaultCode[] = [
  {
    code: 'OC / F01',
    name: 'Overcurrent',
    severity: 'trip',
    description: 'Output current has exceeded the VFD overcurrent trip level. May occur during acceleration, at constant speed, or during deceleration — each has different root causes.',
    causes: [
      'During acceleration: accel time too short for load inertia, motor jammed/locked rotor, wrong motor data entered',
      'At constant speed: sudden load increase (e.g., conveyor jam, crusher tramp metal), ground fault developing on motor cable',
      'During deceleration: decel time too short, high-inertia load feeding energy back, motor phase imbalance',
      'Hardware: shorted IGBT, ground fault in motor cable, motor winding failure',
    ],
    troubleshooting: [
      'Check motor amps at startup — does it spike above drive rating?',
      'Increase accel/decel time gradually (try doubling it)',
      'Disconnect motor cable at VFD — if fault clears, problem is in cable or motor',
      'Megger motor windings (phase-to-phase and phase-to-ground). Must be >1 MΩ for 600V motors',
      'Check for mechanical binding: try rotating motor shaft by hand',
      'Verify motor nameplate data matches VFD parameters',
      'On PowerFlex: check fault queue (param A092) for additional details',
    ],
    callSpecialist: 'If fault occurs with motor disconnected (IGBT failure), if motor megs low (rewind needed), or if fault is intermittent with no obvious cause.',
    color: '#ef4444',
  },
  {
    code: 'OV / F02',
    name: 'Overvoltage',
    severity: 'trip',
    description: 'DC bus voltage has exceeded the maximum limit. Typically caused by regenerative energy from the load feeding back to the DC bus during deceleration or by incoming power surges.',
    causes: [
      'Decel time too short: high-inertia load (conveyor, crusher, fan) acts as generator, pumping energy back to DC bus',
      'Incoming power surge or voltage swell from utility switching',
      'Braking resistor failed (open) or braking IGBT failed',
      'Load overhauling the motor (downhill conveyor, lowering hoist)',
    ],
    troubleshooting: [
      'Increase deceleration time — try doubling or tripling it',
      'Enable DC bus regulation / overvoltage stall prevention (lets VFD extend decel automatically)',
      'Check incoming voltage: should be within drive rating +10%/-15%',
      'If braking resistor installed: verify resistor continuity and braking IGBT operation',
      'For overhauling loads: consider regenerative drive or properly sized braking resistor',
      'On ABB: check actual DC bus voltage in parameter monitoring group',
    ],
    callSpecialist: 'If incoming power is normal and decel times are reasonable. May indicate DC bus capacitor degradation requiring internal drive inspection.',
    color: '#f97316',
  },
  {
    code: 'UV / F03',
    name: 'Undervoltage',
    severity: 'trip',
    description: 'DC bus voltage has dropped below minimum operating level. The VFD cannot maintain output to the motor.',
    causes: [
      'Input power dip or momentary loss (utility switching, large motor starting nearby)',
      'Loose connection on input power terminals or upstream breaker',
      'Input fuse blown (one phase lost)',
      'Undersized supply transformer or long feeder cables causing voltage drop',
      'DC bus capacitors degrading (cannot hold voltage during brief dips)',
    ],
    troubleshooting: [
      'Check input voltage at VFD terminals with meter while running — is it stable?',
      'Verify all three input phases present and balanced (within 2%)',
      'Check torque on input terminal connections',
      'Monitor for voltage dips — install a power quality recorder if intermittent',
      'Check input fuses with meter (don\'t just look at them — measure continuity)',
      'If multiple VFDs tripping simultaneously: power quality issue on supply',
    ],
    callSpecialist: 'If input power is confirmed stable but UV faults persist — may indicate internal DC bus capacitor failure or charging circuit issue.',
    color: '#f59e0b',
  },
  {
    code: 'GF / F04',
    name: 'Ground Fault',
    severity: 'trip',
    description: 'Current leakage detected between output phase(s) and ground. Critical in mining — indicates insulation breakdown.',
    causes: [
      'Motor winding insulation breakdown (moisture, age, contamination, overheating)',
      'Cable insulation damage (physical damage, rodent damage, UV degradation)',
      'Moisture in junction boxes, motor terminal box, or cable splices',
      'Long motor cable runs causing high capacitive leakage current (false trips)',
      'VFD output filter capacitors leaking to ground',
    ],
    troubleshooting: [
      'DISCONNECT POWER AND LOCK OUT before testing insulation',
      'Disconnect motor cable at VFD output terminals',
      'Megger each phase to ground at VFD end: should be >1 MΩ (>100 MΩ preferred for 600V)',
      'If cable megs OK from VFD end, megger at motor end with motor disconnected to isolate cable vs motor',
      'Check all junction boxes for moisture, damaged splices, or contamination',
      'For long cable runs (>100m): output reactor or dV/dt filter may eliminate false ground fault trips',
      'In mining: inspect TECK90 cable jacket and gland connections thoroughly',
    ],
    callSpecialist: 'If motor megs low (winding failure — needs rewind). If ground fault is intermittent and only occurs under load or at temperature (insulation may be borderline).',
    color: '#ef4444',
  },
  {
    code: 'OT / F05',
    name: 'Overtemperature',
    severity: 'warning',
    description: 'Drive heatsink or internal temperature has exceeded warning or trip level. The VFD will derate or shut down to protect IGBTs.',
    causes: [
      'Ambient temperature too high (>40C typical rating). Common in enclosed panels or mine compressor rooms',
      'Ventilation blocked: dirty/clogged filters, failed cooling fan, blocked airflow',
      'Drive overloaded: running above rated current for extended period',
      'High carrier (switching) frequency: increases IGBT switching losses and heat',
      'Altitude >1000m: reduced air density means less cooling capacity',
    ],
    troubleshooting: [
      'Check heatsink temperature (many VFDs show this in parameters)',
      'Verify cooling fans are running — on most VFDs, fans run when drive is powered',
      'Clean or replace air filters on enclosure and VFD heatsink',
      'Measure ambient temperature inside the panel — if >40C, improve ventilation or add AC unit',
      'Reduce carrier frequency from default (often 4kHz or higher) to 2kHz — reduces heat significantly',
      'Verify output current is not exceeding drive rating — check for undersized VFD',
      'Check that VFD is properly derated for altitude if above 1000m',
    ],
    callSpecialist: 'If temperature is excessive with no obvious cause — may indicate internal component failure or thermal paste degradation on heatsink.',
    color: '#f97316',
  },
  {
    code: 'CF / F06',
    name: 'Communication Loss',
    severity: 'trip',
    description: 'The VFD has lost communication with the controlling PLC, DCS, or network device. Action on comm loss is configurable (fault, coast, hold last speed).',
    causes: [
      'Fieldbus cable disconnected or damaged',
      'PLC program stopped or PLC hardware fault',
      'Network switch failure or IP conflict (EtherNet/IP)',
      'Incorrect baud rate, address, or protocol settings',
      'EMI interference on communication cables (too close to power cables)',
    ],
    troubleshooting: [
      'Check physical cable connections at both VFD and PLC/network ends',
      'Verify PLC is running and communicating (check PLC status and diagnostics)',
      'For serial (Modbus/DeviceNet): check baud rate, address, and parity settings match both ends',
      'For Ethernet: verify IP address, subnet mask, ping test from PLC',
      'Check communication timeout parameter — may be set too short for network latency',
      'Route comm cables away from power cables — minimum 12" separation',
      'Check communication LED indicators on VFD comm module',
    ],
    callSpecialist: 'If comm module LED shows no activity even with good connections — module may need replacement.',
    color: '#f59e0b',
  },
  {
    code: 'OL / F07',
    name: 'Motor Overload',
    severity: 'trip',
    description: 'The VFD electronic thermal overload has tripped. Motor current has exceeded rated current for too long, accumulating thermal damage risk.',
    causes: [
      'Sustained overcurrent: motor undersized for actual load',
      'Motor FLA parameter set higher than actual motor FLA (overload won\'t trip in time)',
      'Mechanical issue: bearing failure, alignment problem, belt too tight',
      'Low speed operation: reduced motor cooling at low RPM while maintaining high torque',
      'Ambient temperature: motor in hot environment reduces thermal capacity',
    ],
    troubleshooting: [
      'Compare actual running amps to motor nameplate FLA — should be well below FLA at normal load',
      'Verify motor FLA parameter matches actual motor nameplate exactly',
      'Check motor operating speed — prolonged low-speed operation requires external cooling fan',
      'Measure motor temperature with IR thermometer — Class B insulation max: 130C, Class F: 155C',
      'Check mechanical load: disconnect motor from load, run motor solo to verify current is normal',
      'Review thermal model curve — some VFDs allow adjusting the thermal time constant',
    ],
    callSpecialist: 'If motor draws excessive current even with no load — possible winding issue or bearing seizure.',
    color: '#ef4444',
  },
  {
    code: 'OPL / F08',
    name: 'Output Phase Loss',
    severity: 'trip',
    description: 'The VFD has detected loss of one or more output phases to the motor. Motor will run poorly or not at all on two phases.',
    causes: [
      'Loose connection on VFD output terminals or motor terminals',
      'Blown output IGBT (one phase not switching)',
      'Motor cable damage (open conductor)',
      'Motor winding open (single-phase failure)',
      'Contactor between VFD and motor has a bad contact (avoid contactors on VFD output!)',
    ],
    troubleshooting: [
      'Check torque on VFD output terminals and motor terminal connections',
      'Measure resistance of each motor phase end-to-end from VFD output to motor terminals',
      'If contactor is installed between VFD and motor: check contactor contacts (this configuration should be avoided)',
      'Disconnect motor cable at VFD — check for open conductors with ohmmeter',
      'If wiring checks OK: possible IGBT failure inside VFD — check output voltage across all three phases',
    ],
    callSpecialist: 'If VFD output voltages are unbalanced with motor disconnected — internal IGBT failure requires drive repair or replacement.',
    color: '#ef4444',
  },
  {
    code: 'dCb / F09',
    name: 'DC Bus Fault',
    severity: 'trip',
    description: 'DC bus voltage is out of range or DC bus charging circuit has failed. VFD may not power up normally.',
    causes: [
      'Pre-charge resistor or relay failed (charging circuit)',
      'DC bus capacitors degraded (age, heat, high ripple current)',
      'Input power interruption during DC bus charging sequence',
      'Internal power supply fault on control board',
    ],
    troubleshooting: [
      'DANGER: DC bus capacitors hold lethal voltage even with power off — wait minimum 5 minutes and verify with meter',
      'Power cycle the VFD — if DC bus charges normally, may be a transient issue',
      'Check DC bus voltage on VFD display during startup — should ramp up smoothly',
      'Listen for relay click during power-up (pre-charge relay engaging)',
      'If DC bus voltage is low or fluctuating: capacitors may be failing',
      'Check VFD age — electrolytic capacitors typically need replacement after 5-10 years in harsh environments',
    ],
    callSpecialist: 'DC bus capacitor replacement and pre-charge circuit repair require factory-trained technicians. Do not attempt to discharge capacitors manually.',
    color: '#ef4444',
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 4: Installation Data                                           */
/* ------------------------------------------------------------------ */

interface InstallSection {
  title: string
  items: { label: string; detail: string; critical?: boolean }[]
  color: string
}

const installSections: InstallSection[] = [
  {
    title: 'Cable Requirements',
    color: '#3b82f6',
    items: [
      {
        label: 'Motor Cable Type',
        detail: 'Use shielded/armored cable for VFD-to-motor runs. In Ontario mining: TECK90 is the standard (interlocked aluminum armor + PVC jacket). The continuous metallic shield provides a low-impedance path for high-frequency common-mode currents generated by PWM switching.',
        critical: true,
      },
      {
        label: 'Maximum Cable Length',
        detail: 'Without output filter: typically 100m (330ft) for standard VFD. With output reactor: up to 300m. With dV/dt filter: up to 300m. With sinewave filter: unlimited. Long cables cause voltage reflections that can damage motor insulation. Cable capacitance increases with length, causing higher ground leakage current.',
      },
      {
        label: 'Cable Sizing',
        detail: 'Size motor cable to carry VFD output FLA, derated per CEC tables. VFD output is non-sinusoidal — apply 1.05x derating factor for harmonic heating. Minimum #14 AWG for control wiring, #10 AWG for power.',
      },
      {
        label: 'Input Cable',
        detail: 'Standard power cable is acceptable for VFD input (line side). No special shielding required. Size per CEC for VFD input current rating (slightly higher than output due to harmonics).',
      },
      {
        label: 'Separation',
        detail: 'Keep VFD motor cables separated from other cables: minimum 300mm (12") from signal/control cables. Cross at 90 degrees if they must cross. Route VFD power cables in separate cable tray from standard power cables where possible.',
        critical: true,
      },
    ],
  },
  {
    title: 'Grounding',
    color: '#22c55e',
    items: [
      {
        label: '360-Degree Shield Termination',
        detail: 'Terminate TECK90/shielded cable armor with 360-degree compression glands at BOTH the VFD and motor ends. Do NOT use pigtail connections for the shield — they create high impedance at high frequencies and defeat the shielding purpose.',
        critical: true,
      },
      {
        label: 'Equipment Grounding',
        detail: 'Bond VFD chassis to building ground bus with minimum #6 AWG green or bare copper. Motor frame must also be grounded. Ground conductor in motor cable must be continuous from VFD ground terminal to motor ground.',
      },
      {
        label: 'Signal vs Power Ground',
        detail: 'Keep signal grounds (analog I/O, comm shields) separate from power grounds. Connect signal grounds to the VFD signal ground terminal, NOT to the power ground bus. Single-point grounding for signal shields (ground at VFD end only).',
      },
      {
        label: 'Ground Rod',
        detail: 'In mining installations, ensure VFD ground is bonded to the mine grounding system. Ground resistance should be <5 ohms per CEC Rule 10-700. Test annually and after ground fault events.',
      },
    ],
  },
  {
    title: 'EMI & Harmonics',
    color: '#8b5cf6',
    items: [
      {
        label: 'Line Reactor (3-5% impedance)',
        detail: 'Installed on VFD input side. Reduces input current harmonics by 30-40%. Protects VFD from power surges. Provides some voltage drop buffering. Recommended on ALL VFD installations. Cost-effective first line of defense.',
        critical: true,
      },
      {
        label: 'dV/dt Filter',
        detail: 'Installed on VFD output. Reduces rate of voltage rise (dV/dt) to protect motor insulation from voltage reflection spikes. Required for cable runs >50m or motors not rated for inverter duty. Typical dV/dt reduction: from 5000V/us to 500V/us.',
      },
      {
        label: 'Common Mode Choke',
        detail: 'Reduces common-mode (ground) currents from PWM switching. Helps prevent bearing damage on motor. Reduces EMI conducted through ground. Recommended for sensitive environments.',
      },
      {
        label: 'Sinewave Output Filter',
        detail: 'Converts PWM output to clean sinewave. Eliminates motor derating, allows unlimited cable length, eliminates bearing current damage. Most expensive option. Used when replacing standard motor with VFD retrofit.',
      },
      {
        label: 'Harmonic Filters (Input Side)',
        detail: 'Active harmonic filters or 18-pulse rectifier configurations for IEEE-519 compliance. Required when multiple large VFDs on same transformer. Typical total harmonic distortion (THDi) without filter: 35-45%. With filter: <5%.',
      },
    ],
  },
  {
    title: 'Heat & Ventilation',
    color: '#f59e0b',
    items: [
      {
        label: 'Heat Dissipation',
        detail: 'VFDs generate heat equal to 3-5% of their power rating. A 100HP VFD at full load generates approximately 3-4 kW of heat. This MUST be removed from the enclosure. Undersized enclosures are the #1 cause of overtemperature faults.',
        critical: true,
      },
      {
        label: 'Airflow Requirements',
        detail: 'VFDs require clear airflow space: minimum 100mm (4") above and below for air circulation. Side clearance per manufacturer specs (typically 50mm minimum). Never install drives touching side-by-side without spacing.',
      },
      {
        label: 'Enclosure Cooling',
        detail: 'Sealed enclosure (NEMA 4/12): requires AC unit or heat exchanger rated for total heat dissipation. Vented enclosure: filtered fans with adequate CFM. Through-wall mounting: mounts VFD heatsink outside enclosure to reject heat directly.',
      },
      {
        label: 'Filter Maintenance',
        detail: 'Clogged air filters are the most common cause of VFD overtemperature. In mining environments (dusty): check/clean filters monthly minimum. Replace filters every 6-12 months. Use filter minder differential pressure indicators.',
      },
    ],
  },
  {
    title: 'Input Protection & Disconnect',
    color: '#ef4444',
    items: [
      {
        label: 'Disconnect Requirements',
        detail: 'CEC requires a lockable disconnect within sight of the VFD. Must be rated for VFD input current. Motor-rated switch not acceptable — use drive-rated disconnect. In mining: additional isolation requirements per O.Reg 854.',
        critical: true,
      },
      {
        label: 'Fuses vs Breakers',
        detail: 'Semiconductor fuses (Class J, Class RK1) are PREFERRED for VFD protection. They are fast enough to protect IGBT power devices. Standard breakers may not clear fast enough to prevent IGBT damage during internal short circuit. Size fuses per VFD manufacturer recommendation — do NOT oversize.',
        critical: true,
      },
      {
        label: 'Bypass Contactor',
        detail: 'For critical applications (mine ventilation, dewatering pumps): install full-voltage bypass contactor to run motor across-the-line if VFD fails. Interlock VFD output contactor with bypass contactor (never both closed!). Include overload relay in bypass circuit.',
      },
      {
        label: 'Surge Protection',
        detail: 'Install surge protection devices (SPDs) on VFD input, especially in areas prone to lightning or switching transients. Mining sites with long overhead feeders are particularly vulnerable.',
      },
    ],
  },
  {
    title: 'Mining-Specific Requirements',
    color: '#ffd700',
    items: [
      {
        label: 'Enclosure Rating',
        detail: 'Underground mining: NEMA 4 or NEMA 12 minimum for dusty environments. Explosion-proof (NEMA 7/9) if in hazardous areas per CEC Section 18/20. Surface mining: NEMA 3R for outdoor, NEMA 12 for indoor dusty areas.',
        critical: true,
      },
      {
        label: 'Ground Fault Protection',
        detail: 'Ontario Reg 854 Section 153 requires ground fault protection on all mine electrical systems. VFD built-in GF detection supplements but does NOT replace upstream ground fault relay. Set upstream GF relay coordination to avoid nuisance trips from VFD common-mode currents.',
        critical: true,
      },
      {
        label: 'Trailing Cable Considerations',
        detail: 'VFDs feeding motors via trailing cables: cable movement causes stress on conductors. Use extra-flexible cable rated for VFD service. Ensure shield continuity despite cable flexing. Additional ground check monitoring may be required.',
      },
      {
        label: 'Cable Derating for Length',
        detail: 'Long cable runs reduce VFD output current capability. >50m: consider output reactor. >100m: dV/dt filter recommended. >300m: sinewave filter or additional VFD frame upsizing. Always check VFD manual for specific cable length derating.',
      },
      {
        label: 'Temperature Extremes',
        detail: 'Mining environments may exceed 40C ambient (underground near geothermal activity, compressor rooms). Derate VFD by ~2% per degree above 40C. Below -10C: some VFDs need heaters for proper capacitor operation.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 5: Sizing Data                                                 */
/* ------------------------------------------------------------------ */

interface VFDSize {
  hp: number
  amps208: number
  amps480: number
  amps600: number
}

const vfdSizes: VFDSize[] = [
  { hp: 1, amps208: 4.2, amps480: 2.1, amps600: 1.7 },
  { hp: 2, amps208: 7.2, amps480: 3.4, amps600: 2.7 },
  { hp: 3, amps208: 10.6, amps480: 4.8, amps600: 3.9 },
  { hp: 5, amps208: 16.7, amps480: 7.6, amps600: 6.1 },
  { hp: 7.5, amps208: 24.2, amps480: 11, amps600: 8.8 },
  { hp: 10, amps208: 31, amps480: 14, amps600: 11.5 },
  { hp: 15, amps208: 46, amps480: 21, amps600: 17 },
  { hp: 20, amps208: 60, amps480: 27, amps600: 22 },
  { hp: 25, amps208: 75, amps480: 34, amps600: 27 },
  { hp: 30, amps208: 88, amps480: 40, amps600: 32 },
  { hp: 40, amps208: 114, amps480: 52, amps600: 41 },
  { hp: 50, amps208: 143, amps480: 65, amps600: 52 },
  { hp: 60, amps208: 170, amps480: 77, amps600: 62 },
  { hp: 75, amps208: 211, amps480: 96, amps600: 77 },
  { hp: 100, amps208: 280, amps480: 124, amps600: 99 },
  { hp: 125, amps208: 343, amps480: 156, amps600: 125 },
  { hp: 150, amps208: 396, amps480: 180, amps600: 144 },
  { hp: 200, amps208: 528, amps480: 240, amps600: 192 },
  { hp: 250, amps208: 0, amps480: 302, amps600: 242 },
  { hp: 300, amps208: 0, amps480: 361, amps600: 289 },
  { hp: 350, amps208: 0, amps480: 414, amps600: 331 },
  { hp: 400, amps208: 0, amps480: 477, amps600: 382 },
  { hp: 500, amps208: 0, amps480: 590, amps600: 472 },
]

interface DeratingFactor {
  condition: string
  factor: string
  detail: string
}

const deratingFactors: DeratingFactor[] = [
  {
    condition: 'Altitude > 1000m (3300ft)',
    factor: 'Derate 1% per 100m above 1000m',
    detail: 'Reduced air density decreases cooling. At 2000m: derate by 10%. Most underground mines are below 1000m but some open pit sites at high elevation need this.',
  },
  {
    condition: 'Ambient Temperature > 40C',
    factor: 'Derate ~2% per degree above 40C',
    detail: 'Typical max rated temp: 40C (104F). In enclosed panels or hot environments, this is easily exceeded. Measure INSIDE the panel, not room ambient.',
  },
  {
    condition: 'High Carrier Frequency',
    factor: 'Varies by manufacturer — see derating curve',
    detail: 'Default carrier freq (2-4kHz) = full rated output. Increasing to 8kHz+ may reduce output current by 10-20%. Higher carrier freq = quieter motor but more heat in VFD.',
  },
  {
    condition: 'Long Cable Runs',
    factor: 'Derate 1-2% per 50m above 100m',
    detail: 'Long cables increase capacitive charging current, reducing available motor current. Also increases common-mode ground leakage which may trip ground fault detection.',
  },
  {
    condition: 'Frequent Starting/Stopping',
    factor: 'Oversize by 1 frame',
    detail: 'More than 10 starts per hour or continuous cycling: choose next frame size up. The VFD thermal capacity needs to handle repeated high-current acceleration events.',
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

const tipBox: React.CSSProperties = {
  background: 'rgba(255, 215, 0, 0.08)',
  border: '1px solid rgba(255, 215, 0, 0.25)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  fontSize: 13,
  color: 'var(--primary)',
  lineHeight: 1.5,
}

const monoTag: React.CSSProperties = {
  display: 'inline-block',
  background: 'var(--input-bg)',
  borderRadius: 4,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  marginRight: 6,
  marginBottom: 4,
}

const tableCell: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 12,
  borderBottom: '1px solid var(--divider)',
  color: 'var(--text-secondary)',
  lineHeight: 1.4,
}

const tableHeader: React.CSSProperties = {
  ...tableCell,
  fontWeight: 700,
  color: 'var(--primary)',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.3,
  position: 'sticky' as const,
  top: 0,
  background: 'var(--surface)',
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
/*  VFD Sizing Calculator Component                                    */
/* ------------------------------------------------------------------ */

function SizingCalculator() {
  const [hp, setHp] = useState('')
  const [voltage, setVoltage] = useState('480')
  const [appType, setAppType] = useState<'vt' | 'ct' | 'ht'>('ct')

  const hpNum = parseFloat(hp)
  const valid = hpNum > 0 && hpNum <= 1000

  // Approximate FLA per HP by voltage
  const flaPerHp: Record<string, number> = {
    '208': 2.8,
    '480': 1.25,
    '600': 1.0,
  }
  const motorFLA = valid ? hpNum * (flaPerHp[voltage] || 1.25) : 0

  // Oversize factors
  const oversizeFactor = appType === 'vt' ? 1.0 : appType === 'ct' ? 1.15 : 1.25
  const oversizeLabel = appType === 'vt' ? 'No oversize needed' : appType === 'ct' ? 'Oversize by 15%' : 'Oversize by 25%'
  const recommendedAmps = valid ? motorFLA * oversizeFactor : 0

  const selectStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 48,
    padding: '0 12px',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text)',
    fontSize: 14,
    fontFamily: 'var(--font-sans)',
  }

  const inputStyle: React.CSSProperties = {
    ...selectStyle,
    maxWidth: 140,
  }

  return (
    <div style={{ ...cardStyle, borderLeft: '4px solid var(--primary)' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>
        VFD Sizing Calculator
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Motor HP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 80 }}>Motor HP:</label>
          <input
            type="number"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            placeholder="e.g. 50"
            style={inputStyle}
            min={0}
            step={0.5}
          />
        </div>

        {/* Voltage */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 80 }}>Voltage:</label>
          <select value={voltage} onChange={(e) => setVoltage(e.target.value)} style={selectStyle}>
            <option value="208">208V</option>
            <option value="480">480V</option>
            <option value="600">600V</option>
          </select>
        </div>

        {/* Application Type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 80 }}>Application:</label>
          <select value={appType} onChange={(e) => setAppType(e.target.value as 'vt' | 'ct' | 'ht')} style={selectStyle}>
            <option value="vt">Variable Torque (fans, pumps)</option>
            <option value="ct">Constant Torque (conveyors, crushers)</option>
            <option value="ht">High Starting Torque (crushers loaded, hoists)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {valid && (
        <div
          style={{
            marginTop: 14,
            background: 'var(--input-bg)',
            borderRadius: 'var(--radius-sm)',
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text)' }}>Estimated Motor FLA:</strong> {motorFLA.toFixed(1)}A at {voltage}V
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text)' }}>Application Factor:</strong> {oversizeLabel} ({oversizeFactor}x)
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--primary)',
              paddingTop: 4,
              borderTop: '1px solid var(--divider)',
            }}
          >
            Recommended VFD Rating: {'\u2265'} {recommendedAmps.toFixed(1)}A at {voltage}V
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Select a VFD with continuous output current rating at or above this value.
            Always verify motor nameplate FLA — this calculator uses approximate values.
            Consult manufacturer catalogs for exact frame sizing.
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Mining Pump Sizing Example Component                               */
/* ------------------------------------------------------------------ */

function PumpSizingExample() {
  return (
    <div style={{ ...cardStyle, borderLeft: '4px solid #22c55e' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#22c55e', marginBottom: 10 }}>
        Sizing Walkthrough: 75HP Mine Dewatering Pump
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text)' }}>Step 1: Motor Nameplate</strong><br />
          75HP, 575V, 3-phase, 1770 RPM, FLA = 77A, Service Factor = 1.15
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text)' }}>Step 2: Application Type</strong><br />
          Centrifugal pump = Variable Torque. Power varies with cube of speed. Standard duty VFD is acceptable. No oversizing required for the application itself.
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text)' }}>Step 3: Check Derating</strong><br />
          Underground mine at 400m depth: altitude OK (below 1000m). Pump room ambient temperature: 35C (below 40C limit). Cable run to motor: 85m (within 100m limit). No derating required.
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text)' }}>Step 4: Select VFD</strong><br />
          Motor FLA = 77A at 575V. Variable torque, no derating needed. Select VFD with continuous output current {'\u2265'} 77A at 600V. Example: ABB ACS580-01-088A-6 (88A/600V) or PowerFlex 525 Frame F (88A/600V).
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text)' }}>Step 5: Accessories</strong><br />
          {'\u2022'} 3% line reactor on input (harmonic reduction + surge protection)<br />
          {'\u2022'} Output reactor (85m cable run, near the 100m threshold)<br />
          {'\u2022'} NEMA 12 panel (underground, dusty environment)<br />
          {'\u2022'} Panel AC unit or forced ventilation for heat removal<br />
          {'\u2022'} Semiconductor fuses per manufacturer specification<br />
          {'\u2022'} Bypass contactor (critical dewatering application)
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text)' }}>Step 6: Key Parameters</strong><br />
          {'\u2022'} Motor data: 575V, 77A, 75HP, 1770 RPM, 60Hz<br />
          {'\u2022'} Control mode: V/Hz (adequate for centrifugal pump)<br />
          {'\u2022'} Min freq: 20Hz (maintain pump prime and cooling)<br />
          {'\u2022'} Max freq: 60Hz<br />
          {'\u2022'} Accel time: 15s, Decel time: 20s<br />
          {'\u2022'} PID control: enable for constant pressure/level<br />
          {'\u2022'} Pipe-fill function: enable to prevent water hammer on start<br />
          {'\u2022'} Ground fault detection: ENABLED
        </div>

        <div style={tipBox}>
          <strong>Estimated Annual Savings:</strong> Running a pump at 80% speed uses only ~50% power compared to throttling a valve at full speed. For a 75HP pump running 24/7: savings of approximately 15,000-20,000 kWh/year.
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function VFDReferencePage() {
  const [tab, setTab] = useState<TabKey>('basics')

  return (
    <>
      <Header />
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
          {/* TAB 1: Basics                                 */}
          {/* ============================================= */}
          {tab === 'basics' && (
            <>
              <div style={sectionTitle}>How a VFD Works</div>

              {/* Block Diagram */}
              <div style={{ ...cardStyle, borderLeft: '4px solid var(--primary)' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 10 }}>
                  VFD Block Diagram
                </div>
                <div
                  style={{
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    background: 'var(--input-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      lineHeight: 1.5,
                      color: 'var(--text)',
                      margin: 0,
                      whiteSpace: 'pre',
                    }}
                  >
                    {blockDiagram}
                  </pre>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text)' }}>In plain terms:</strong> The VFD takes fixed-frequency AC power (60Hz), converts it to DC, then reconstructs it as variable-frequency AC to control motor speed. Speed is directly proportional to frequency for an AC motor.
                </div>
              </div>

              {/* Block Sections */}
              <CollapsibleSection title="VFD Sections Explained" defaultOpen borderColor="var(--primary)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {blockSections.map((s) => (
                    <div key={s.name} style={{ ...cardStyle, borderLeft: `4px solid ${s.color}` }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                        {s.name}
                      </div>
                      <span style={{ ...monoTag, color: s.color }}>{s.component}</span>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 8 }}>
                        <strong style={{ color: 'var(--text)' }}>Function:</strong> {s.function}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 6 }}>
                        <strong style={{ color: '#ff6b6b' }}>Failure Mode:</strong> {s.failureMode}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* V/Hz Relationship */}
              <CollapsibleSection title="V/Hz Relationship & Speed Regions" defaultOpen={false} borderColor="#22c55e">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {vhzExplanation.map((v) => (
                    <div key={v.title} style={cardStyle}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                        {v.title}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {v.detail}
                      </div>
                    </div>
                  ))}
                  {/* ASCII Speed-Torque-HP diagram */}
                  <div style={{ ...cardStyle, borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                      Speed Regions Diagram
                    </div>
                    <div
                      style={{
                        overflowX: 'auto',
                        background: 'var(--input-bg)',
                        borderRadius: 'var(--radius-sm)',
                        padding: 12,
                      }}
                    >
                      <pre
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          lineHeight: 1.5,
                          color: 'var(--text)',
                          margin: 0,
                          whiteSpace: 'pre',
                        }}
                      >
{`  Torque/HP
  |
  |  CONSTANT        CONSTANT
  |  TORQUE          HP REGION
  |  REGION
  |
  |████████████┐
  |  Torque    │·········HP·····
  |            │     ┌──────────
  |            │     │  Torque
  |            │     │  (drops)
  |            └─────┘
  |
  └──────────────┬───────────────►
                 │            Speed
            Base Speed
            (60Hz/1800RPM)

  0 ←── V/Hz constant ──► 60Hz ←── V constant, f rising ──►`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Comparison Table */}
              <CollapsibleSection title="VFD vs Soft Starter vs DOL" defaultOpen={false} borderColor="#8b5cf6">
                <div
                  style={{
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--divider)',
                  }}
                >
                  <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 500 }}>
                    <thead>
                      <tr>
                        <th style={{ ...tableHeader, textAlign: 'left' }}>Feature</th>
                        <th style={{ ...tableHeader, textAlign: 'center' }}>DOL</th>
                        <th style={{ ...tableHeader, textAlign: 'center' }}>Soft Starter</th>
                        <th style={{ ...tableHeader, textAlign: 'center', color: '#ffd700' }}>VFD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonTable.map((row) => (
                        <tr key={row.feature}>
                          <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{row.feature}</td>
                          <td style={{ ...tableCell, textAlign: 'center' }}>{row.dol}</td>
                          <td style={{ ...tableCell, textAlign: 'center' }}>{row.softStarter}</td>
                          <td style={{ ...tableCell, textAlign: 'center', color: 'var(--primary)' }}>{row.vfd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>

              {/* Mining Applications */}
              <CollapsibleSection title="Mining Applications" defaultOpen={false} borderColor="#f59e0b">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {miningApplications.map((app) => (
                    <div key={app.application} style={{ ...cardStyle, borderLeft: `4px solid ${app.color}` }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                        {app.application}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
                        <strong style={{ color: 'var(--text)' }}>Why VFD:</strong> {app.why}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
                        <strong style={{ color: 'var(--text)' }}>Common Brands:</strong> {app.typicalBrands}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--text)' }}>Notes:</strong> {app.notes}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </>
          )}

          {/* ============================================= */}
          {/* TAB 2: Parameters                             */}
          {/* ============================================= */}
          {tab === 'parameters' && (
            <>
              <div style={tipBox}>
                <strong>Commissioning Tip:</strong> ALWAYS enter motor nameplate data FIRST before changing any other parameters. Then run auto-tune/motor ID if using vector control mode. Getting the motor data right is 80% of a successful VFD startup.
              </div>

              {parameterCategories.map((cat) => (
                <CollapsibleSection
                  key={cat.category}
                  title={cat.category}
                  defaultOpen={cat.category === 'Motor Nameplate'}
                  borderColor={cat.color}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {cat.params.map((p) => (
                      <div key={p.name} style={cardStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                          {p.description}
                        </div>

                        {/* Brand references */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                          <span style={{ ...monoTag, color: '#3b82f6' }}>AB: {p.abRef}</span>
                          <span style={{ ...monoTag, color: '#ef4444' }}>ABB: {p.abbRef}</span>
                          <span style={{ ...monoTag, color: '#22c55e' }}>Siemens: {p.siemensRef}</span>
                        </div>

                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          <strong style={{ color: 'var(--text)' }}>Typical Range:</strong> {p.typicalRange}
                        </div>

                        {p.tip && (
                          <div style={{ ...tipBox, marginTop: 8, fontSize: 12 }}>
                            <strong>Tip:</strong> {p.tip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              ))}

              {/* Auto-Tune Tips */}
              <CollapsibleSection title="Auto-Tune / Motor ID" defaultOpen={false} borderColor="var(--primary)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      What is Auto-Tune?
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Auto-tune (Allen-Bradley) or Motor ID (ABB/Siemens) measures actual motor electrical parameters: stator resistance, leakage inductance, magnetizing current. These values are critical for vector control performance. Without auto-tune, vector control uses estimates from nameplate data, which are less accurate.
                    </div>
                  </div>

                  <div style={cardStyle}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      Static vs Rotating Auto-Tune
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Static (Standstill):</strong> Motor does not rotate. Tests stator resistance and leakage inductance. Safe for coupled loads. Quick ({'\u003C'}1 minute).<br /><br />
                      <strong style={{ color: 'var(--text)' }}>Rotating (Spin):</strong> Motor rotates at low speed. Measures all parameters including magnetizing current and inertia. MUST disconnect from load. More accurate but longer (2-5 minutes).
                    </div>
                  </div>

                  <div style={warningBox}>
                    <strong>Safety:</strong> Before rotating auto-tune, ensure motor is UNCOUPLED from load, guards are in place, and all personnel are clear of the motor and driven equipment. The motor WILL spin during this test.
                  </div>

                  <div style={cardStyle}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      When to Re-Run Auto-Tune
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {'\u2022'} Motor replaced with different motor<br />
                      {'\u2022'} Motor rewound<br />
                      {'\u2022'} VFD replaced or factory reset<br />
                      {'\u2022'} Cable run length changed significantly<br />
                      {'\u2022'} Performance issues (torque ripple, instability, overcurrent at low speed)
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </>
          )}

          {/* ============================================= */}
          {/* TAB 3: Fault Codes                            */}
          {/* ============================================= */}
          {tab === 'faults' && (
            <>
              <div style={sectionTitle}>Common VFD Faults</div>

              <div style={tipBox}>
                <strong>Before troubleshooting:</strong> Check the VFD fault history/queue first — most VFDs log the last 5-10 faults with timestamps and operating conditions at the time of fault. This is your best diagnostic tool.
              </div>

              {faultCodes.map((fault) => (
                <CollapsibleSection
                  key={fault.code}
                  title={`${fault.code} — ${fault.name}`}
                  defaultOpen={false}
                  borderColor={fault.color}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Severity Badge */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          background: fault.severity === 'trip' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                          color: fault.severity === 'trip' ? '#ef4444' : '#f59e0b',
                        }}
                      >
                        {fault.severity === 'trip' ? 'TRIP — Drive Stops' : 'WARNING — May Auto-Clear'}
                      </span>
                    </div>

                    {/* Description */}
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {fault.description}
                    </div>

                    {/* Causes */}
                    <div style={cardStyle}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                        Likely Causes
                      </div>
                      {fault.causes.map((cause, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 13,
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            paddingLeft: 12,
                            borderLeft: `2px solid ${fault.color}`,
                            marginBottom: i < fault.causes.length - 1 ? 8 : 0,
                          }}
                        >
                          {cause}
                        </div>
                      ))}
                    </div>

                    {/* Troubleshooting */}
                    <div style={cardStyle}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                        Troubleshooting Steps
                      </div>
                      {fault.troubleshooting.map((step, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 13,
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            display: 'flex',
                            gap: 8,
                            marginBottom: i < fault.troubleshooting.length - 1 ? 6 : 0,
                          }}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: 'var(--input-bg)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 11,
                              fontWeight: 700,
                              color: 'var(--primary)',
                            }}
                          >
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* When to Call Specialist */}
                    <div style={warningBox}>
                      <strong>Call a Specialist When:</strong> {fault.callSpecialist}
                    </div>
                  </div>
                </CollapsibleSection>
              ))}
            </>
          )}

          {/* ============================================= */}
          {/* TAB 4: Installation                           */}
          {/* ============================================= */}
          {tab === 'installation' && (
            <>
              <div style={sectionTitle}>VFD Installation Best Practices</div>

              <div style={warningBox}>
                <strong>Safety First:</strong> All VFD installation and wiring must comply with CEC Section 26 (Installation of Electrical Equipment) and Ontario Regulation 854 for mining. Ensure proper lockout/tagout and verify zero energy before any electrical work.
              </div>

              {installSections.map((section) => (
                <CollapsibleSection
                  key={section.title}
                  title={section.title}
                  defaultOpen={section.title === 'Cable Requirements'}
                  borderColor={section.color}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {section.items.map((item) => (
                      <div
                        key={item.label}
                        style={{
                          ...cardStyle,
                          ...(item.critical ? { borderLeft: '4px solid #ef4444' } : {}),
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 6,
                          }}
                        >
                          {item.critical && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                                color: '#ef4444',
                                background: 'rgba(239, 68, 68, 0.15)',
                                padding: '2px 6px',
                                borderRadius: 4,
                                flexShrink: 0,
                              }}
                            >
                              Critical
                            </span>
                          )}
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                            {item.label}
                          </div>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {item.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              ))}
            </>
          )}

          {/* ============================================= */}
          {/* TAB 5: Sizing                                 */}
          {/* ============================================= */}
          {tab === 'sizing' && (
            <>
              <div style={sectionTitle}>VFD Sizing Guide</div>

              {/* Calculator */}
              <SizingCalculator />

              {/* CT vs VT */}
              <CollapsibleSection title="Constant Torque vs Variable Torque" defaultOpen borderColor="#8b5cf6">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      Variable Torque (VT) — Fans & Pumps
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Load torque varies with square of speed. Power varies with cube of speed. At 50% speed: only 12.5% power needed. VFD can be sized at 100% of motor FLA (no oversizing). Standard overload capability: 110% for 60 seconds. These applications provide the biggest energy savings.
                    </div>
                  </div>

                  <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      Constant Torque (CT) — Conveyors & Crushers
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Load torque is constant regardless of speed. At 50% speed: still need 100% torque (50% power). VFD must provide full rated current at any speed. Size VFD for 150% overload for 60 seconds. Oversize by at least one frame for high-torque applications. Starting torque may require 200%+ for loaded conveyors and crushers.
                    </div>
                  </div>

                  <div style={tipBox}>
                    <strong>Rule of Thumb:</strong> If you are unsure, size for constant torque. It is always safer to oversize a VFD than to undersize it. An oversized VFD runs cooler, lasts longer, and handles transients better.
                  </div>
                </div>
              </CollapsibleSection>

              {/* Standard Sizes Table */}
              <CollapsibleSection title="Standard VFD Sizes" defaultOpen={false} borderColor="#3b82f6">
                <div
                  style={{
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--divider)',
                  }}
                >
                  <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 400 }}>
                    <thead>
                      <tr>
                        <th style={{ ...tableHeader, textAlign: 'right' }}>HP</th>
                        <th style={{ ...tableHeader, textAlign: 'right' }}>208V (A)</th>
                        <th style={{ ...tableHeader, textAlign: 'right' }}>480V (A)</th>
                        <th style={{ ...tableHeader, textAlign: 'right' }}>600V (A)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vfdSizes.map((s) => (
                        <tr key={s.hp}>
                          <td style={{ ...tableCell, textAlign: 'right', fontWeight: 600, color: 'var(--text)' }}>
                            {s.hp}
                          </td>
                          <td style={{ ...tableCell, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                            {s.amps208 > 0 ? s.amps208 : '—'}
                          </td>
                          <td style={{ ...tableCell, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                            {s.amps480 > 0 ? s.amps480 : '—'}
                          </td>
                          <td style={{ ...tableCell, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                            {s.amps600 > 0 ? s.amps600 : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>
                  Values are typical output current ratings. Actual ratings vary by manufacturer and frame. 208V drives above 200HP are uncommon — use 480V or 600V. Always verify against specific manufacturer catalog data.
                </div>
              </CollapsibleSection>

              {/* Derating Factors */}
              <CollapsibleSection title="Derating Factors" defaultOpen={false} borderColor="#f59e0b">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {deratingFactors.map((d) => (
                    <div key={d.condition} style={cardStyle}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                        {d.condition}
                      </div>
                      <div style={{ ...monoTag, color: 'var(--primary)', marginBottom: 8 }}>
                        {d.factor}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {d.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* When to Oversize */}
              <CollapsibleSection title="When to Oversize" defaultOpen={false} borderColor="#ef4444">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      <strong style={{ color: 'var(--text)' }}>High Starting Torque:</strong> Crushers starting under load, conveyors starting loaded, mixers with high-viscosity material. Size for 150-200% overload capability or go up one frame size.
                    </div>
                  </div>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      <strong style={{ color: 'var(--text)' }}>Frequent Starting/Stopping:</strong> More than 10 starts per hour or continuous cycling applications. Each start event generates significant heat in the VFD. Oversizing reduces thermal stress per event.
                    </div>
                  </div>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      <strong style={{ color: 'var(--text)' }}>Cyclic Loads:</strong> Applications where load varies rapidly (crushing, material handling). Peak currents exceed average current significantly. VFD thermal capacity must handle the peaks.
                    </div>
                  </div>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      <strong style={{ color: 'var(--text)' }}>Long Cable Runs:</strong> Capacitive charging current from long motor cables reduces current available for the motor. At 200m+, consider oversizing by one frame.
                    </div>
                  </div>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      <strong style={{ color: 'var(--text)' }}>Harsh Environment:</strong> High ambient temperature, high altitude, or both. Combined derating may reduce capacity by 15-20%. Oversizing avoids relying on tight margins.
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Braking */}
              <CollapsibleSection title="Dynamic Braking" defaultOpen={false} borderColor="#06b6d4">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      When is Braking Needed?
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {'\u2022'} High-inertia loads that must decelerate quickly (fans, flywheels)<br />
                      {'\u2022'} Overhauling loads (downhill conveyors, lowering hoists)<br />
                      {'\u2022'} Frequent stop/start cycles requiring fast deceleration<br />
                      {'\u2022'} Any application getting overvoltage faults during deceleration
                    </div>
                  </div>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      Dynamic Braking Resistor (DBR)
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      A resistor connected across the DC bus (via braking IGBT) that dissipates regenerative energy as heat. The VFD turns on the braking IGBT when DC bus voltage exceeds a threshold. Resistor size depends on: motor HP, decel time, duty cycle, and how often braking occurs. Typical sizing: 100% of motor HP rating for continuous braking, 150% for intermittent.
                    </div>
                  </div>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      Regenerative Drive
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      Active front end (AFE) replaces diode rectifier with IGBTs. Returns braking energy to the power grid instead of wasting it as heat. Used for: mine hoists, long downhill conveyors, cranes. More expensive but recovers energy. Allen-Bradley PowerFlex 755T, ABB ACS880 with regen module, Siemens S120 AFE.
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Mining Pump Example */}
              <div style={{ ...sectionTitle, marginTop: 4 }}>Sizing Walkthrough</div>
              <PumpSizingExample />
            </>
          )}
        </div>
      </div>
    </>
  )
}
