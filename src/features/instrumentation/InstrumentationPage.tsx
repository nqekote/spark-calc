import { useState } from 'react'
import PageWrapper from '../../layout/PageWrapper'

/* ================================================================== */
/*  Instrumentation & Process Control Reference                        */
/*  Target: Ontario electrical/mining apprentices (309A / MM)           */
/*  Covers: 4-20mA, RTD/TC, Pressure/Level/Flow, Signal Conditioning, */
/*          P&ID Symbols, HART, Troubleshooting, Mining Instrumentation*/
/* ================================================================== */

type TabKey =
  | 'mA'
  | 'rtdtc'
  | 'plf'
  | 'signal'
  | 'pid'
  | 'hart'
  | 'trouble'
  | 'mining'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'mA', label: '4-20 mA' },
  { key: 'rtdtc', label: 'RTD / TC' },
  { key: 'plf', label: 'P / L / F' },
  { key: 'signal', label: 'Signal Cond.' },
  { key: 'pid', label: 'P&ID' },
  { key: 'hart', label: 'HART' },
  { key: 'trouble', label: 'Troubleshoot' },
  { key: 'mining', label: 'Mining' },
]

/* ================================================================== */
/*  SHARED STYLES                                                      */
/* ================================================================== */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
}
const pillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 48,
  padding: '0 14px',
  borderRadius: 24,
  fontSize: 12,
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
const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)',
  padding: 14,
}
const cardHL = (color: string): React.CSSProperties => ({
  ...card,
  borderLeft: `4px solid ${color}`,
})
const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 4,
}
const subHeading: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--text)',
  marginBottom: 6,
}
const bodyText: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
}
const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 4,
}
const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 56,
  padding: '0 14px',
  fontSize: 16,
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--input-border)',
  background: 'var(--input-bg)',
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
  boxSizing: 'border-box',
}
const resultBox: React.CSSProperties = {
  background: 'var(--input-bg)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  fontFamily: 'var(--font-mono)',
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--primary)',
}
const tableHeader: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: 0.3,
  padding: '10px 8px',
  borderBottom: '2px solid var(--divider)',
  textAlign: 'left',
}
const tableCell: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text)',
  padding: '10px 8px',
  borderBottom: '1px solid var(--divider)',
  lineHeight: 1.5,
  verticalAlign: 'top',
}
const tableCellMono: React.CSSProperties = {
  ...tableCell,
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
  color: 'var(--primary)',
}
const tipBox: React.CSSProperties = {
  background: 'rgba(255,215,0,0.08)',
  border: '1px solid rgba(255,215,0,0.25)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  fontSize: 13,
  color: 'var(--text)',
  lineHeight: 1.6,
}
const warningBox: React.CSSProperties = {
  background: 'rgba(255,107,107,0.08)',
  border: '1px solid rgba(255,107,107,0.3)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  fontSize: 13,
  color: 'var(--text)',
  lineHeight: 1.6,
}
const tagPill = (bg: string, fg: string): React.CSSProperties => ({
  display: 'inline-block',
  background: bg,
  color: fg,
  borderRadius: 12,
  padding: '2px 10px',
  fontSize: 11,
  fontWeight: 700,
  marginRight: 6,
  marginBottom: 4,
})

/* ================================================================== */
/*  DATA: 4-20 mA Common Ranges                                       */
/* ================================================================== */

interface CommonRange {
  parameter: string
  unit: string
  low: number
  high: number
  application: string
  color: string
}

const commonRanges: CommonRange[] = [
  { parameter: 'Pressure', unit: 'PSI', low: 0, high: 100, application: 'Compressed air, hydraulic systems', color: '#3b82f6' },
  { parameter: 'Pressure', unit: 'PSI', low: 0, high: 500, application: 'High-pressure process lines', color: '#3b82f6' },
  { parameter: 'Pressure', unit: 'kPa', low: 0, high: 700, application: 'Water distribution, HVAC', color: '#3b82f6' },
  { parameter: 'Pressure', unit: 'inH2O', low: 0, high: 200, application: 'Draft/duct pressure, filter differential', color: '#3b82f6' },
  { parameter: 'Temperature', unit: '\°F', low: 0, high: 500, application: 'General process heating', color: '#ef4444' },
  { parameter: 'Temperature', unit: '\°C', low: -40, high: 150, application: 'Ambient & low-temp process', color: '#ef4444' },
  { parameter: 'Temperature', unit: '\°C', low: 0, high: 400, application: 'Kiln, dryer, heat treatment', color: '#ef4444' },
  { parameter: 'Level', unit: '%', low: 0, high: 100, application: 'Tank level (any sensor type)', color: '#22c55e' },
  { parameter: 'Level', unit: 'ft', low: 0, high: 30, application: 'Open-channel / reservoir', color: '#22c55e' },
  { parameter: 'Level', unit: 'm', low: 0, high: 10, application: 'Sump / holding tank', color: '#22c55e' },
  { parameter: 'Flow', unit: 'GPM', low: 0, high: 500, application: 'Water/coolant flow', color: '#a855f7' },
  { parameter: 'Flow', unit: 'L/min', low: 0, high: 1000, application: 'Process water, slurry (mining)', color: '#a855f7' },
  { parameter: 'Flow', unit: 'SCFM', low: 0, high: 2000, application: 'Compressed air, ventilation', color: '#a855f7' },
  { parameter: 'pH', unit: 'pH', low: 0, high: 14, application: 'Water treatment, tailings', color: '#f59e0b' },
  { parameter: 'Speed', unit: 'RPM', low: 0, high: 1800, application: 'Motor/pump speed monitoring', color: '#06b6d4' },
]

/* ================================================================== */
/*  DATA: RTDs                                                         */
/* ================================================================== */

interface RTDType {
  name: string
  resistance: string
  range: string
  accuracy: string
  material: string
  application: string
  color: string
}

const rtdTypes: RTDType[] = [
  {
    name: 'PT100',
    resistance: '100\Ω at 0\°C',
    range: '-200 to +850\°C',
    accuracy: 'Class A: \±0.15\°C at 0\°C',
    material: 'Platinum',
    application: 'Most common industrial RTD. Used in mining process control, HVAC, food & beverage.',
    color: '#3b82f6',
  },
  {
    name: 'PT1000',
    resistance: '1000\Ω at 0\°C',
    range: '-200 to +850\°C',
    accuracy: 'Class A: \±0.15\°C at 0\°C',
    material: 'Platinum',
    application: 'Higher resistance = less lead wire error. Great for 2-wire applications and long cable runs in mines.',
    color: '#6366f1',
  },
  {
    name: 'Ni120',
    resistance: '120\Ω at 0\°C',
    range: '-80 to +260\°C',
    accuracy: '\±0.5\°C',
    material: 'Nickel',
    application: 'HVAC, older industrial systems. Higher temperature coefficient than platinum.',
    color: '#22c55e',
  },
  {
    name: 'Cu10',
    resistance: '10\Ω at 0\°C',
    range: '-50 to +150\°C',
    accuracy: '\±0.5\°C',
    material: 'Copper',
    application: 'Motor winding temperature measurement. Very linear but low resistance.',
    color: '#f59e0b',
  },
]

interface RTDWiring {
  wires: number
  description: string
  accuracy: string
  use: string
  diagram: string
}

const rtdWiringTypes: RTDWiring[] = [
  {
    wires: 2,
    description: 'Two leads connected directly to RTD element. Lead resistance adds directly to measurement.',
    accuracy: 'Lowest accuracy. Lead resistance causes positive error. PT1000 helps reduce effect.',
    use: 'Short cable runs only (<10m). Use PT1000 to minimize error.',
    diagram: '[Transmitter +] ---wire--- [RTD] ---wire--- [Transmitter -]',
  },
  {
    wires: 3,
    description: 'Three leads: two on one side, one on other. Third wire measures lead resistance for compensation.',
    accuracy: 'Good accuracy. Compensates for lead resistance assuming all 3 leads are equal length/gauge.',
    use: 'Most common industrial installation. Standard for mining process control.',
    diagram: '[Tx +] ---wire1--- [RTD] ---wire2--- [Tx -]\n              \└---wire3--- [Tx comp]',
  },
  {
    wires: 4,
    description: 'Four leads: two carry excitation current, two measure voltage. Full Kelvin connection.',
    accuracy: 'Highest accuracy. Completely eliminates lead resistance error.',
    use: 'Laboratory, precision measurement, long cable runs where accuracy is critical.',
    diagram: '[Tx I+] ---wire1--- [RTD] ---wire3--- [Tx V+]\n[Tx I-] ---wire2---       ---wire4--- [Tx V-]',
  },
]

/* ================================================================== */
/*  DATA: PT100 Resistance Table                                       */
/* ================================================================== */

interface PT100Row {
  tempC: number
  resistance: string
}

const pt100Table: PT100Row[] = [
  { tempC: -200, resistance: '18.52' },
  { tempC: -150, resistance: '39.72' },
  { tempC: -100, resistance: '60.26' },
  { tempC: -50, resistance: '80.31' },
  { tempC: -40, resistance: '84.27' },
  { tempC: -30, resistance: '88.22' },
  { tempC: -20, resistance: '92.16' },
  { tempC: -10, resistance: '96.09' },
  { tempC: 0, resistance: '100.00' },
  { tempC: 10, resistance: '103.90' },
  { tempC: 20, resistance: '107.79' },
  { tempC: 25, resistance: '109.73' },
  { tempC: 30, resistance: '111.67' },
  { tempC: 40, resistance: '115.54' },
  { tempC: 50, resistance: '119.40' },
  { tempC: 60, resistance: '123.24' },
  { tempC: 70, resistance: '127.07' },
  { tempC: 80, resistance: '130.89' },
  { tempC: 90, resistance: '134.70' },
  { tempC: 100, resistance: '138.51' },
  { tempC: 125, resistance: '148.94' },
  { tempC: 150, resistance: '157.33' },
  { tempC: 200, resistance: '175.86' },
  { tempC: 250, resistance: '194.10' },
  { tempC: 300, resistance: '212.05' },
  { tempC: 350, resistance: '229.72' },
  { tempC: 400, resistance: '247.09' },
  { tempC: 450, resistance: '264.18' },
  { tempC: 500, resistance: '280.98' },
  { tempC: 600, resistance: '313.71' },
  { tempC: 700, resistance: '345.28' },
  { tempC: 800, resistance: '375.70' },
  { tempC: 850, resistance: '390.48' },
]

/* ================================================================== */
/*  DATA: RTD Troubleshooting Guide                                    */
/* ================================================================== */

interface RTDFault {
  symptom: string
  likelyCause: string
  test: string
  fix: string
  color: string
}

const rtdFaults: RTDFault[] = [
  {
    symptom: 'Reads 0\Ω (shorted element)',
    likelyCause: 'RTD element has failed internally or moisture has entered the sensor and created a short path.',
    test: 'Disconnect RTD leads at transmitter. Measure resistance between RTD leads with multimeter.',
    fix: 'Replace RTD sensor. Check thermowell seal and connection head gasket for moisture entry points.',
    color: '#ef4444',
  },
  {
    symptom: 'Reads open circuit (infinite \Ω)',
    likelyCause: 'Broken RTD element, broken lead wire, loose terminal, or corroded connection.',
    test: 'Measure resistance at each junction point from transmitter back to sensor to isolate the break.',
    fix: 'Repair or replace broken wire/connection. If element is open, replace sensor.',
    color: '#ef4444',
  },
  {
    symptom: 'Reading is too high (positive error)',
    likelyCause: 'In 2-wire configuration: lead wire resistance adding to measurement. Also: wrong RTD type configured (PT100 vs PT1000).',
    test: 'Measure actual RTD resistance at sensor head. Compare to reading at transmitter terminals. Difference = lead resistance.',
    fix: 'Upgrade to 3-wire or 4-wire connection. Or use PT1000 to minimize lead resistance effect. Verify sensor type in transmitter config.',
    color: '#f59e0b',
  },
  {
    symptom: 'Reading drifts slowly over time',
    likelyCause: 'Sensor contamination, moisture ingress, insulation degradation. Long-term element drift at high temperatures.',
    test: 'Compare reading to a known reference thermometer. Check insulation resistance (megger leads to ground, should be >100 M\Ω).',
    fix: 'Replace sensor. Seal connection head. Consider ceramic insulated RTD for high temperature applications.',
    color: '#a855f7',
  },
  {
    symptom: 'Reading is intermittent or noisy',
    likelyCause: 'Loose connection, intermittent break in lead wire, EMI from nearby VFD or power cable.',
    test: 'Wiggle test on wires while monitoring resistance. Check routing near power cables. Verify shield grounding.',
    fix: 'Tighten all terminals. Re-route signal cables away from power cables. Ground shield at one end only.',
    color: '#3b82f6',
  },
]

/* ================================================================== */
/*  DATA: Thermocouples                                                */
/* ================================================================== */

interface TCType {
  type: string
  metals: string
  range: string
  accuracy: string
  color_pos_csa: string
  color_neg_csa: string
  color_jacket_csa: string
  application: string
  tint: string
}

const tcTypes: TCType[] = [
  {
    type: 'J',
    metals: 'Iron (+) / Constantan (-)',
    range: '-210 to +760\°C',
    accuracy: '\±2.2\°C or \±0.75%',
    color_pos_csa: 'White',
    color_neg_csa: 'Red',
    color_jacket_csa: 'Black',
    application: 'General purpose. Not for oxidizing atmospheres above 500\°C. Iron oxidizes.',
    tint: '#f59e0b',
  },
  {
    type: 'K',
    metals: 'Chromel (+) / Alumel (-)',
    range: '-200 to +1260\°C',
    accuracy: '\±2.2\°C or \±0.75%',
    color_pos_csa: 'Yellow',
    color_neg_csa: 'Red',
    color_jacket_csa: 'Yellow',
    application: 'Most common industrial TC. Wide range. Used extensively in mining kilns, smelters, dryers.',
    tint: '#22c55e',
  },
  {
    type: 'T',
    metals: 'Copper (+) / Constantan (-)',
    range: '-200 to +370\°C',
    accuracy: '\±1.0\°C or \±0.75%',
    color_pos_csa: 'Blue',
    color_neg_csa: 'Red',
    color_jacket_csa: 'Blue',
    application: 'Low temperature. Food, HVAC, environmental monitoring. Resistant to moisture.',
    tint: '#3b82f6',
  },
  {
    type: 'E',
    metals: 'Chromel (+) / Constantan (-)',
    range: '-200 to +900\°C',
    accuracy: '\±1.7\°C or \±0.5%',
    color_pos_csa: 'Purple',
    color_neg_csa: 'Red',
    color_jacket_csa: 'Purple',
    application: 'Highest EMF output. Good for cryogenic. Non-magnetic.',
    tint: '#a855f7',
  },
  {
    type: 'N',
    metals: 'Nicrosil (+) / Nisil (-)',
    range: '-200 to +1300\°C',
    accuracy: '\±2.2\°C or \±0.75%',
    color_pos_csa: 'Orange',
    color_neg_csa: 'Red',
    color_jacket_csa: 'Orange',
    application: 'Improved K type. Better stability at high temp. Less drift. Preferred for new installations.',
    tint: '#f97316',
  },
]

/* ================================================================== */
/*  DATA: Pressure / Level / Flow Sensors                              */
/* ================================================================== */

interface SensorInfo {
  name: string
  category: 'Pressure' | 'Level' | 'Flow'
  principle: string
  typicalRange: string
  output: string
  advantages: string
  limitations: string
  miningUse: string
  wiring: string
  color: string
}

const sensors: SensorInfo[] = [
  // Pressure
  {
    name: 'Strain Gauge (Piezo-resistive)',
    category: 'Pressure',
    principle: 'Diaphragm deflection changes resistance of bonded strain gauges in Wheatstone bridge.',
    typicalRange: '0-15 PSI to 0-60,000 PSI',
    output: '4-20 mA, 0-5V, 0-10V',
    advantages: 'High accuracy, wide range, fast response, relatively inexpensive.',
    limitations: 'Temperature sensitive, needs compensation. Overpressure can damage diaphragm.',
    miningUse: 'Hydraulic pressure on equipment, compressed air systems, water pipelines.',
    wiring: '2-wire (4-20mA loop powered) or 3-wire (powered + signal + common).',
    color: '#3b82f6',
  },
  {
    name: 'Capacitance Pressure',
    category: 'Pressure',
    principle: 'Diaphragm between two fixed plates forms capacitor. Pressure changes capacitance.',
    typicalRange: '0-0.5 inH2O to 0-6000 PSI',
    output: '4-20 mA with HART',
    advantages: 'Very stable, excellent for low pressures and differential pressure. Self-diagnostics.',
    limitations: 'More expensive, complex electronics. Can drift if isolating diaphragm is damaged.',
    miningUse: 'DP level measurement on slurry tanks, filter differential pressure.',
    wiring: '2-wire loop powered (4-20mA). Shield to transmitter ground only.',
    color: '#3b82f6',
  },
  // Level
  {
    name: 'Differential Pressure (DP) Level',
    category: 'Level',
    principle: 'Measures hydrostatic pressure at bottom of vessel. Level = pressure / (density x gravity).',
    typicalRange: '0-100% tank level',
    output: '4-20 mA with HART',
    advantages: 'Well understood, reliable, works with most liquids. Wet or dry leg for closed tanks.',
    limitations: 'Affected by density changes. Capillary systems affected by temperature. Impulse lines can plug.',
    miningUse: 'Thickener level, acid tanks, water tanks. Must account for slurry density.',
    wiring: '2-wire loop powered. Keep impulse lines free of air (liquid) or condensate (gas).',
    color: '#22c55e',
  },
  {
    name: 'Radar (Guided Wave)',
    category: 'Level',
    principle: 'Microwave pulse travels down probe. Reflects off liquid surface. Time of flight = distance.',
    typicalRange: '0-30m (0-100 ft)',
    output: '4-20 mA with HART or Foundation Fieldbus',
    advantages: 'Not affected by density, temperature, or pressure changes. Works in foam and turbulence.',
    limitations: 'Probe can accumulate buildup. Not ideal for very viscous materials on probe.',
    miningUse: 'Slurry tanks, thickeners, tailings. Excellent for changing density.',
    wiring: '2-wire loop powered (4-20mA). Shielded twisted pair. Keep away from VFD cables.',
    color: '#22c55e',
  },
  {
    name: 'Radar (Non-Contact / FMCW)',
    category: 'Level',
    principle: 'Antenna emits continuous frequency sweep. Reflected signal frequency difference = distance.',
    typicalRange: '0-40m (0-130 ft)',
    output: '4-20 mA with HART',
    advantages: 'No moving parts, no contact with process. Works through dust, vapour, foam.',
    limitations: 'Requires proper antenna selection. False echoes from internals. More expensive.',
    miningUse: 'Ore bins, silos, crusher feed hoppers. No contact with abrasive material.',
    wiring: '2-wire (4-20mA) or 4-wire (powered separately). Proper grounding critical.',
    color: '#22c55e',
  },
  {
    name: 'Ultrasonic Level',
    category: 'Level',
    principle: 'Transducer emits sound pulse. Reflects off surface. Time of flight x speed of sound = distance.',
    typicalRange: '0-15m (0-50 ft) typical',
    output: '4-20 mA, relay outputs',
    advantages: 'Non-contact, no moving parts, inexpensive. Good for open tanks and sumps.',
    limitations: 'Affected by foam, dust, vapour, temperature. Speed of sound varies with temperature.',
    miningUse: 'Sump level, clarifier, settling ponds. Must shield from dust and turbulence.',
    wiring: '2-wire (4-20mA) or 3-wire with separate power. Temperature compensation probe.',
    color: '#22c55e',
  },
  {
    name: 'Capacitance Level',
    category: 'Level',
    principle: 'Probe and vessel wall form capacitor. Dielectric constant of process changes capacitance.',
    typicalRange: '0-6m (0-20 ft) typical',
    output: '4-20 mA, relay (point level)',
    advantages: 'Simple, rugged, no moving parts. Works as point or continuous level.',
    limitations: 'Affected by buildup/coating on probe. Dielectric constant must be known and stable.',
    miningUse: 'Bin level for solids, point level in sumps. RF admittance type handles coating.',
    wiring: '2-wire (4-20mA). Probe insulation critical. Proper ground connection to vessel.',
    color: '#22c55e',
  },
  // Flow
  {
    name: 'Magnetic Flow (Mag Meter)',
    category: 'Flow',
    principle: 'Faraday\'s law: conductive fluid flowing through magnetic field generates voltage proportional to velocity.',
    typicalRange: '0.3-12 m/s velocity',
    output: '4-20 mA with HART, pulse output',
    advantages: 'No obstruction, no pressure drop. Works with slurries, dirty fluids. Very accurate.',
    limitations: 'Fluid must be conductive (>5 \µS/cm). Full pipe required. Liner must match fluid.',
    miningUse: 'Slurry flow, process water, reagent dosing. Primary flow meter in mining.',
    wiring: '4-wire (separate power supply). Signal cable must be shielded. Ground rings or electrodes.',
    color: '#a855f7',
  },
  {
    name: 'Vortex Flow Meter',
    category: 'Flow',
    principle: 'Bluff body sheds vortices proportional to flow velocity (von Karman effect). Sensor detects vortex frequency.',
    typicalRange: 'DN15-DN300, gas/liquid/steam',
    output: '4-20 mA with HART, pulse output',
    advantages: 'No moving parts, wide turndown, works with steam. Low maintenance.',
    limitations: 'Minimum flow required (Reynolds number). Sensitive to vibration. Straight pipe run needed.',
    miningUse: 'Steam flow, compressed air, clean process water. Not for slurries.',
    wiring: '2-wire (4-20mA) or 3-wire. Must be isolated from pipe vibration.',
    color: '#a855f7',
  },
  {
    name: 'Turbine Flow Meter',
    category: 'Flow',
    principle: 'Rotor spins proportional to flow velocity. Magnetic pickup generates frequency signal.',
    typicalRange: '0.5-15 m/s',
    output: 'Pulse / frequency, 4-20 mA (with transmitter)',
    advantages: 'High accuracy for clean fluids, fast response time, wide flow range.',
    limitations: 'Moving parts wear. Not for slurries or dirty fluids. Strainer required.',
    miningUse: 'Clean water, fuel metering, reagent flow. Not for process slurry.',
    wiring: '2-wire (pickup coil) or 3-wire (powered). Shielded cable for long runs.',
    color: '#a855f7',
  },
  {
    name: 'Differential Pressure (Orifice Plate)',
    category: 'Flow',
    principle: 'Orifice creates pressure drop proportional to flow squared. DP transmitter measures drop.',
    typicalRange: 'Wide range, DN25+',
    output: '4-20 mA with HART (from DP transmitter)',
    advantages: 'Well understood, inexpensive. Accepted standard. No special fluids required.',
    limitations: 'Permanent pressure loss. Square root relationship limits turndown to ~4:1. Impulse lines plug.',
    miningUse: 'Ventilation air flow, gas flow, steam flow measurement.',
    wiring: '2-wire (4-20mA) loop powered DP transmitter. Square root extraction in DCS/PLC.',
    color: '#a855f7',
  },
  {
    name: 'Coriolis Flow Meter',
    category: 'Flow',
    principle: 'Vibrating tube: fluid mass causes twist proportional to mass flow rate. Also measures density.',
    typicalRange: 'DN6-DN350, any fluid',
    output: '4-20 mA with HART, Modbus, pulse',
    advantages: 'Measures mass flow directly. Also gives density and temperature. Very accurate.',
    limitations: 'Expensive. Large sizes are very heavy. Can be affected by gas bubbles in liquid.',
    miningUse: 'Reagent dosing, fuel measurement, density measurement of slurry streams.',
    wiring: '4-wire (separate power). Digital comm preferred for multi-variable output.',
    color: '#a855f7',
  },
]

/* ================================================================== */
/*  DATA: Signal Conditioning                                          */
/* ================================================================== */

interface SignalDevice {
  name: string
  function: string
  inputSignal: string
  outputSignal: string
  application: string
  wiringNotes: string
  color: string
}

const signalDevices: SignalDevice[] = [
  {
    name: 'Signal Isolator',
    function: 'Provides galvanic isolation between input and output. Breaks ground loops.',
    inputSignal: '4-20 mA',
    outputSignal: '4-20 mA (isolated)',
    application: 'Eliminate ground loops between field instruments and control room. Common when connecting to different PLC racks or between buildings.',
    wiringNotes: 'Input loop powered or externally powered. Output is isolated and can source or sink. DIN rail mount.',
    color: '#3b82f6',
  },
  {
    name: 'Current-to-Voltage Converter',
    function: 'Converts 4-20 mA current signal to voltage output.',
    inputSignal: '4-20 mA',
    outputSignal: '0-5V, 0-10V, or 1-5V',
    application: 'Interface 4-20mA field devices to voltage-input PLC modules or data loggers. Common in older or mixed systems.',
    wiringNotes: 'Simple: 250\Ω precision resistor converts 4-20mA to 1-5V. Active converters provide isolation and variable output.',
    color: '#22c55e',
  },
  {
    name: 'Signal Splitter',
    function: 'Takes one input signal and produces two or more isolated output signals.',
    inputSignal: '4-20 mA',
    outputSignal: '2x 4-20 mA (isolated from each other)',
    application: 'Send one transmitter signal to both a PLC and a local display/recorder. Or to two separate control systems.',
    wiringNotes: 'Loop powered or externally powered. Check loop loading: each output adds to total loop resistance.',
    color: '#a855f7',
  },
  {
    name: 'RTD/TC Input Isolator',
    function: 'Converts RTD or thermocouple input directly to 4-20 mA output.',
    inputSignal: 'RTD (2/3/4-wire) or TC (J/K/T/E/N)',
    outputSignal: '4-20 mA',
    application: 'Field-mount head transmitter. Converts sensor signal near the point of measurement for long cable runs to control room.',
    wiringNotes: 'Mounts in sensor connection head. Eliminates long TC extension wire runs. Uses standard 2-wire cable to control room.',
    color: '#f59e0b',
  },
  {
    name: 'Zener Barrier (Intrinsic Safety)',
    function: 'Limits energy (voltage and current) to intrinsically safe level using zener diodes, resistors, and fuses.',
    inputSignal: 'Varies (passes through)',
    outputSignal: 'Energy-limited version of input',
    application: 'Protects hazardous area instruments by clamping fault energy. Required for IS installations in mines.',
    wiringNotes: 'MUST have dedicated IS ground bus (\≤1\Ω to earth). Shunt type: diverts excess energy to ground. Consumes power.',
    color: '#ef4444',
  },
  {
    name: 'Galvanic Isolator (IS Barrier)',
    function: 'Provides galvanic isolation AND energy limitation for intrinsic safety. No IS ground needed.',
    inputSignal: '4-20 mA, digital, TC, RTD',
    outputSignal: 'Isolated, energy-limited',
    application: 'Preferred over zener barriers in mining. No dedicated IS ground required. Better signal quality.',
    wiringNotes: 'Powered from safe side. No IS ground bus needed. Transformer/optical isolation. DIN rail mount.',
    color: '#ef4444',
  },
  {
    name: 'Voltage-to-Current Converter',
    function: 'Converts voltage signal to 4-20 mA current loop signal.',
    inputSignal: '0-5V, 0-10V, 1-5V',
    outputSignal: '4-20 mA',
    application: 'Interface voltage-output devices (older PLCs, VFDs) to current loop instruments or remote I/O.',
    wiringNotes: 'Externally powered. Check input impedance. Some provide isolation.',
    color: '#06b6d4',
  },
  {
    name: 'Frequency-to-Current Converter',
    function: 'Converts pulse/frequency signal to proportional 4-20 mA.',
    inputSignal: 'Pulse, frequency (Hz)',
    outputSignal: '4-20 mA',
    application: 'Convert turbine meter pulse output or encoder signal to analog for PLC analog input.',
    wiringNotes: 'Set input frequency range and output range. Provide appropriate input termination.',
    color: '#06b6d4',
  },
]

/* ================================================================== */
/*  DATA: P&ID Symbols & ISA Tag Numbering                             */
/* ================================================================== */

interface PIDSymbol {
  tag: string
  letterBreakdown: string
  description: string
  symbol: string
  category: string
  color: string
}

const pidSymbols: PIDSymbol[] = [
  // Temperature
  { tag: 'TE', letterBreakdown: 'T=Temperature, E=Element', description: 'Temperature sensing element (RTD, thermocouple, thermistor)', symbol: 'Circle', category: 'Temperature', color: '#ef4444' },
  { tag: 'TT', letterBreakdown: 'T=Temperature, T=Transmitter', description: 'Temperature transmitter (converts sensor signal to 4-20mA)', symbol: 'Circle', category: 'Temperature', color: '#ef4444' },
  { tag: 'TI', letterBreakdown: 'T=Temperature, I=Indicator', description: 'Temperature indicator (local gauge or display)', symbol: 'Circle', category: 'Temperature', color: '#ef4444' },
  { tag: 'TIC', letterBreakdown: 'T=Temperature, I=Indicating, C=Controller', description: 'Temperature indicating controller (DCS/PLC control loop)', symbol: 'Circle w/ horizontal line', category: 'Temperature', color: '#ef4444' },
  { tag: 'TAH', letterBreakdown: 'T=Temperature, A=Alarm, H=High', description: 'Temperature high alarm', symbol: 'Circle', category: 'Temperature', color: '#ef4444' },
  { tag: 'TSH', letterBreakdown: 'T=Temperature, S=Switch, H=High', description: 'Temperature high switch (trips at setpoint)', symbol: 'Circle', category: 'Temperature', color: '#ef4444' },
  // Pressure
  { tag: 'PE', letterBreakdown: 'P=Pressure, E=Element', description: 'Pressure sensing element', symbol: 'Circle', category: 'Pressure', color: '#3b82f6' },
  { tag: 'PT', letterBreakdown: 'P=Pressure, T=Transmitter', description: 'Pressure transmitter', symbol: 'Circle', category: 'Pressure', color: '#3b82f6' },
  { tag: 'PI', letterBreakdown: 'P=Pressure, I=Indicator', description: 'Pressure indicator (gauge)', symbol: 'Circle', category: 'Pressure', color: '#3b82f6' },
  { tag: 'PIC', letterBreakdown: 'P=Pressure, I=Indicating, C=Controller', description: 'Pressure indicating controller', symbol: 'Circle w/ horizontal line', category: 'Pressure', color: '#3b82f6' },
  { tag: 'PDT', letterBreakdown: 'P=Pressure, D=Differential, T=Transmitter', description: 'Differential pressure transmitter (used for flow & level)', symbol: 'Circle', category: 'Pressure', color: '#3b82f6' },
  { tag: 'PSV', letterBreakdown: 'P=Pressure, S=Safety, V=Valve', description: 'Pressure safety valve (relief valve)', symbol: 'Circle', category: 'Pressure', color: '#3b82f6' },
  // Flow
  { tag: 'FE', letterBreakdown: 'F=Flow, E=Element', description: 'Flow element (orifice plate, venturi, flow tube)', symbol: 'Circle', category: 'Flow', color: '#a855f7' },
  { tag: 'FT', letterBreakdown: 'F=Flow, T=Transmitter', description: 'Flow transmitter (mag meter, vortex, coriolis)', symbol: 'Circle', category: 'Flow', color: '#a855f7' },
  { tag: 'FI', letterBreakdown: 'F=Flow, I=Indicator', description: 'Flow indicator (rotameter, local display)', symbol: 'Circle', category: 'Flow', color: '#a855f7' },
  { tag: 'FIC', letterBreakdown: 'F=Flow, I=Indicating, C=Controller', description: 'Flow indicating controller', symbol: 'Circle w/ horizontal line', category: 'Flow', color: '#a855f7' },
  { tag: 'FCV', letterBreakdown: 'F=Flow, C=Control, V=Valve', description: 'Flow control valve (final control element)', symbol: 'Circle w/ valve', category: 'Flow', color: '#a855f7' },
  // Level
  { tag: 'LE', letterBreakdown: 'L=Level, E=Element', description: 'Level sensing element (float, displacer, probe)', symbol: 'Circle', category: 'Level', color: '#22c55e' },
  { tag: 'LT', letterBreakdown: 'L=Level, T=Transmitter', description: 'Level transmitter', symbol: 'Circle', category: 'Level', color: '#22c55e' },
  { tag: 'LI', letterBreakdown: 'L=Level, I=Indicator', description: 'Level indicator (sight glass, local gauge)', symbol: 'Circle', category: 'Level', color: '#22c55e' },
  { tag: 'LIC', letterBreakdown: 'L=Level, I=Indicating, C=Controller', description: 'Level indicating controller', symbol: 'Circle w/ horizontal line', category: 'Level', color: '#22c55e' },
  { tag: 'LSH', letterBreakdown: 'L=Level, S=Switch, H=High', description: 'Level high switch (used for pump control or alarm)', symbol: 'Circle', category: 'Level', color: '#22c55e' },
  { tag: 'LSL', letterBreakdown: 'L=Level, S=Switch, L=Low', description: 'Level low switch (dry run protection)', symbol: 'Circle', category: 'Level', color: '#22c55e' },
  // Analytical
  { tag: 'AE', letterBreakdown: 'A=Analysis, E=Element', description: 'Analytical element (pH probe, conductivity, O2 sensor)', symbol: 'Circle', category: 'Analytical', color: '#f59e0b' },
  { tag: 'AT', letterBreakdown: 'A=Analysis, T=Transmitter', description: 'Analytical transmitter (pH, DO, turbidity, gas detection)', symbol: 'Circle', category: 'Analytical', color: '#f59e0b' },
  { tag: 'AIC', letterBreakdown: 'A=Analysis, I=Indicating, C=Controller', description: 'Analytical indicating controller (pH control loop)', symbol: 'Circle w/ horizontal line', category: 'Analytical', color: '#f59e0b' },
]

interface ISALetter {
  letter: string
  firstLetter: string
  succeeding: string
}

const isaLetters: ISALetter[] = [
  { letter: 'A', firstLetter: 'Analysis', succeeding: 'Alarm' },
  { letter: 'B', firstLetter: 'Burner/Combustion', succeeding: 'User choice' },
  { letter: 'C', firstLetter: 'User choice', succeeding: 'Controller' },
  { letter: 'D', firstLetter: 'User choice', succeeding: 'Differential' },
  { letter: 'E', firstLetter: 'Voltage', succeeding: 'Element (primary)' },
  { letter: 'F', firstLetter: 'Flow', succeeding: 'Ratio (fraction)' },
  { letter: 'G', firstLetter: 'User choice', succeeding: 'Glass/Gauge' },
  { letter: 'H', firstLetter: 'Hand', succeeding: 'High' },
  { letter: 'I', firstLetter: 'Current', succeeding: 'Indicator' },
  { letter: 'J', firstLetter: 'Power', succeeding: 'Scan' },
  { letter: 'K', firstLetter: 'Time', succeeding: 'Control station' },
  { letter: 'L', firstLetter: 'Level', succeeding: 'Low / Light' },
  { letter: 'M', firstLetter: 'User choice', succeeding: 'Momentary' },
  { letter: 'N', firstLetter: 'User choice', succeeding: 'User choice' },
  { letter: 'O', firstLetter: 'User choice', succeeding: 'Orifice' },
  { letter: 'P', firstLetter: 'Pressure', succeeding: 'Point (test)' },
  { letter: 'Q', firstLetter: 'Quantity', succeeding: 'Totalizer' },
  { letter: 'R', firstLetter: 'Radiation', succeeding: 'Recorder' },
  { letter: 'S', firstLetter: 'Speed/Frequency', succeeding: 'Switch / Safety' },
  { letter: 'T', firstLetter: 'Temperature', succeeding: 'Transmitter' },
  { letter: 'U', firstLetter: 'Multivariable', succeeding: 'Multifunction' },
  { letter: 'V', firstLetter: 'Vibration', succeeding: 'Valve' },
  { letter: 'W', firstLetter: 'Weight/Force', succeeding: 'Well' },
  { letter: 'X', firstLetter: 'Unclassified', succeeding: 'Unclassified' },
  { letter: 'Y', firstLetter: 'Event/State', succeeding: 'Relay/Compute' },
  { letter: 'Z', firstLetter: 'Position/Dimension', succeeding: 'Driver/Actuator' },
]

/* ================================================================== */
/*  DATA: HART Protocol                                                */
/* ================================================================== */

interface HARTFact {
  title: string
  detail: string
}

const hartFacts: HARTFact[] = [
  { title: 'What is HART?', detail: 'Highway Addressable Remote Transducer. A digital communication protocol superimposed on the standard 4-20 mA analog signal. Uses FSK (Frequency Shift Keying) modulation.' },
  { title: 'Signal Type', detail: 'HART uses Bell 202 standard: 1200 Hz = logic "1" (mark), 2200 Hz = logic "0" (space). The digital signal is superimposed on the DC analog signal with a peak amplitude of \±0.5 mA.' },
  { title: 'No Interference', detail: 'The average value of the HART AC signal is zero, so it does not affect the 4-20 mA analog reading. Both analog and digital communications work simultaneously.' },
  { title: 'Communication Modes', detail: 'Point-to-point: normal 4-20mA + HART. Multidrop: all devices at 4 mA, communication by polling (address 1-15). Burst mode: device sends data continuously without polling.' },
  { title: 'Loop Resistance', detail: 'HART requires minimum 250\Ω loop resistance for communication. If PLC input impedance is too low, add a 250\Ω resistor in series. Maximum loop resistance ~1100\Ω.' },
  { title: 'Cable Requirements', detail: 'Shielded twisted pair recommended. Maximum cable length: ~3000m (1500m typical for best reliability). Single twisted pair only, no T-splices for reliable communication.' },
  { title: 'Device Variables', detail: 'PV (Primary Variable), SV (Secondary Variable), TV (Tertiary Variable), QV (Quaternary Variable). A pressure transmitter might also report sensor temperature as SV.' },
  { title: 'Configuration Data', detail: 'Device tag, descriptor, date, assembly number, sensor type, measurement range (URV/LRV), damping, output function (linear, square root), engineering units.' },
  { title: 'Handheld Communicator', detail: 'Connects in parallel across any point in the 4-20mA loop (at the transmitter terminals or at the marshalling panel). Requires 250\Ω minimum resistance between communicator and power supply.' },
  { title: 'Diagnostic Capabilities', detail: 'Device status, loop current verification, sensor diagnostics, configuration change counter, operating hours. Enables predictive maintenance.' },
  { title: 'HART 7 / WirelessHART', detail: 'HART 7 added WirelessHART (IEEE 802.15.4 mesh network at 2.4 GHz). Same HART commands, no wiring needed. Good for retrofit and hard-to-reach locations in mines.' },
]

/* ================================================================== */
/*  DATA: Troubleshooting                                              */
/* ================================================================== */

interface TroubleshootStep {
  step: number
  title: string
  detail: string
  tools: string
}

const systematicApproach: TroubleshootStep[] = [
  { step: 1, title: 'Gather Information', detail: 'Check alarm history, operator observations, recent maintenance, process changes. What changed? What was the last known good reading?', tools: 'HMI/SCADA history, logbook' },
  { step: 2, title: 'Verify the Problem', detail: 'Is the instrument reading wrong, or is the process actually at that value? Compare with local gauges, other instruments, or process knowledge.', tools: 'Local PI gauge, sight glass, multimeter' },
  { step: 3, title: 'Check at the Transmitter', detail: 'Measure mA output at the transmitter terminals. Compare to what the PLC/DCS shows. This isolates field vs. control room issues.', tools: 'mA clamp meter, process calibrator' },
  { step: 4, title: 'Check the Signal Path', detail: 'Measure mA at the marshalling panel, PLC input card, and compare. Look for differences indicating wiring issues.', tools: 'Multimeter, loop calibrator' },
  { step: 5, title: 'Inspect Wiring & Connections', detail: 'Check for loose terminals, corroded connections, damaged cable, moisture in junction boxes. Measure wire resistance end-to-end.', tools: 'Multimeter (resistance mode), visual inspection' },
  { step: 6, title: 'Verify Power Supply', detail: 'Measure loop voltage at transmitter. Typical: 24 VDC supply, minus voltage drops across loop components. Transmitter needs minimum voltage (usually 12-15 VDC).', tools: 'Multimeter (voltage mode)' },
  { step: 7, title: 'Check Configuration', detail: 'Use HART communicator to verify transmitter configuration: range (LRV/URV), engineering units, damping, sensor type, calibration.', tools: 'HART communicator, laptop with HART modem' },
  { step: 8, title: 'Calibration Check', detail: 'Apply known input (pressure, temperature, simulation) and verify output matches. As-found/as-left documentation.', tools: 'Process calibrator, pressure source, RTD simulator' },
]

interface CommonFault {
  fault: string
  symptoms: string
  possibleCauses: string
  remedy: string
  color: string
}

const commonFaults: CommonFault[] = [
  {
    fault: 'Open Loop (0 mA)',
    symptoms: 'PLC reads 0 mA or below 3.8 mA (under-range). Bad PV or sensor failure alarm.',
    possibleCauses: 'Broken wire, blown fuse, loose terminal, transmitter failure, wrong wiring polarity.',
    remedy: 'Check continuity of loop wiring. Check fuse at IS barrier. Verify power supply voltage at transmitter. Check for reversed polarity.',
    color: '#ef4444',
  },
  {
    fault: 'Saturated High (>20.5 mA)',
    symptoms: 'PLC reads above 20.5 mA or over-range. Process value pegged at maximum.',
    possibleCauses: 'Sensor failure (shorted RTD), over-range process condition, wrong transmitter configuration (URV too low).',
    remedy: 'Verify actual process value. Check sensor resistance/mV. Verify transmitter URV setting. Check for moisture in sensor.',
    color: '#f59e0b',
  },
  {
    fault: 'Erratic / Noisy Signal',
    symptoms: 'Reading fluctuates rapidly. PLC trend shows spikes or noise. Intermittent alarms.',
    possibleCauses: 'Loose connection, damaged cable insulation, electromagnetic interference (near VFDs), ground loop, wet splice.',
    remedy: 'Check and tighten all terminals. Verify shield grounding (one end only). Route cables away from power cables. Add signal isolator if needed.',
    color: '#a855f7',
  },
  {
    fault: 'Grounded Signal',
    symptoms: 'Reading shifts when you touch the junction box. Offset error. Intermittent fluctuations.',
    possibleCauses: 'Insulation failure on signal wire touching conduit or junction box. Moisture in conduit. Shield grounded at both ends.',
    remedy: 'Megger signal wires to ground. Check for moisture. Verify shield is grounded at one end only. Replace damaged cable.',
    color: '#3b82f6',
  },
  {
    fault: 'Wrong Scaling / Offset',
    symptoms: 'Reading is consistently off by a fixed amount. Process operators say "it always reads 5 degrees high."',
    possibleCauses: 'Incorrect LRV/URV in transmitter or PLC. Wrong sensor type configured. Zero not calibrated. Wrong engineering units.',
    remedy: 'Verify transmitter range with HART communicator. Check PLC analog input scaling parameters. Perform zero and span calibration.',
    color: '#22c55e',
  },
  {
    fault: 'Slow Response',
    symptoms: 'Reading lags behind process changes. Operator says "it takes 5 minutes to show the change."',
    possibleCauses: 'Damping set too high in transmitter. Thermowell thermal lag. Plugged impulse lines. Filter in PLC/DCS set too high.',
    remedy: 'Check damping setting in transmitter (reduce to 1-2 seconds for most applications). Check impulse lines. Reduce PLC input filter.',
    color: '#06b6d4',
  },
  {
    fault: 'Fixed at 4 mA or 20 mA',
    symptoms: 'Signal stuck at exactly 4.000 mA or 20.000 mA. Does not change with process.',
    possibleCauses: 'Transmitter in manual/fixed output mode. Simulation mode left on. Sensor disconnected (transmitter driving to fallback value).',
    remedy: 'Check transmitter mode via HART. Verify sensor connections at transmitter. Take out of simulation/manual mode.',
    color: '#f59e0b',
  },
  {
    fault: 'Reading Jumps Between Two Values',
    symptoms: 'Reading alternates between two distinct values (e.g., toggles between 35% and 72%). Not random noise.',
    possibleCauses: 'Intermittent connection at terminal block. Two signals accidentally cross-wired. Incorrect channel assignment in multiplexed I/O.',
    remedy: 'Check terminal tightness. Verify wiring point-to-point against drawings. Check PLC channel configuration. Look for pinched cable.',
    color: '#a855f7',
  },
  {
    fault: 'Signal Reads Correctly at Transmitter But Wrong at PLC',
    symptoms: 'mA measurement at transmitter matches process, but PLC displays incorrect value.',
    possibleCauses: 'PLC analog input scaling is wrong (LRV/URV mismatch). Input card resolution or type mismatch. Broken wire between transmitter and PLC.',
    remedy: 'Verify PLC analog input configuration (raw counts to engineering units scaling). Check input card type matches signal type. Measure mA at PLC terminals.',
    color: '#06b6d4',
  },
  {
    fault: 'Transmitter Reads Ambient Temperature',
    symptoms: 'Temperature transmitter reads ambient temperature instead of process temperature. Value matches air temperature in the area.',
    possibleCauses: 'Sensor disconnected from transmitter (transmitter reports CJC or internal temperature). Thermowell not making contact with process. Air gap in thermowell.',
    remedy: 'Verify sensor is connected at transmitter terminals. Check thermowell insertion depth. Add thermal compound in thermowell. Verify sensor type matches transmitter configuration.',
    color: '#f59e0b',
  },
]

/* ================================================================== */
/*  DATA: Calibration Procedures                                       */
/* ================================================================== */

interface CalibrationStep {
  step: number
  action: string
  detail: string
}

const calibrationProcedure: CalibrationStep[] = [
  { step: 1, action: 'Prepare documentation', detail: 'Record instrument tag, make/model, serial number, range, and due date. Prepare as-found/as-left calibration sheet.' },
  { step: 2, action: 'Verify process isolation', detail: 'Isolate transmitter from process if applying simulated input. Close isolation valves. Follow LOTO procedures if required.' },
  { step: 3, action: 'Connect test equipment', detail: 'Connect loop calibrator in series to read mA. Connect pressure source, RTD simulator, or TC simulator as appropriate for the instrument type.' },
  { step: 4, action: 'Record as-found at 0%', detail: 'Apply zero input (0 PSI, 0\°C, etc. or LRV value). Record the mA output. Expected: 4.000 mA \± tolerance.' },
  { step: 5, action: 'Record as-found at 25%', detail: 'Apply 25% of range input. Record mA output. Expected: 8.000 mA \± tolerance.' },
  { step: 6, action: 'Record as-found at 50%', detail: 'Apply 50% of range input. Record mA output. Expected: 12.000 mA \± tolerance.' },
  { step: 7, action: 'Record as-found at 75%', detail: 'Apply 75% of range input. Record mA output. Expected: 16.000 mA \± tolerance.' },
  { step: 8, action: 'Record as-found at 100%', detail: 'Apply 100% of range input (URV). Record mA output. Expected: 20.000 mA \± tolerance.' },
  { step: 9, action: 'Evaluate as-found data', detail: 'If all points within tolerance, no adjustment needed. Record as-found = as-left. If out of tolerance, proceed to adjustment.' },
  { step: 10, action: 'Adjust zero (4 mA)', detail: 'Apply LRV input. Adjust transmitter zero until output reads 4.000 mA. Use HART trim or analog zero screw.' },
  { step: 11, action: 'Adjust span (20 mA)', detail: 'Apply URV input. Adjust transmitter span until output reads 20.000 mA. Use HART trim or analog span screw.' },
  { step: 12, action: 'Repeat as-left 5-point check', detail: 'Apply 0%, 25%, 50%, 75%, 100% and record as-left values. All points must be within tolerance.' },
  { step: 13, action: 'Restore to service', detail: 'Reconnect to process. Open isolation valves. Verify PLC/DCS reads correctly. Clear any alarms generated during calibration.' },
]

/* ================================================================== */
/*  DATA: Mining Instrumentation                                       */
/* ================================================================== */

interface GasDetector {
  gas: string
  formula: string
  twa: string
  stel: string
  idlh: string
  alarmLow: string
  alarmHigh: string
  sensorType: string
  notes: string
  color: string
}

const gasDetectors: GasDetector[] = [
  {
    gas: 'Carbon Monoxide',
    formula: 'CO',
    twa: '25 ppm',
    stel: '100 ppm',
    idlh: '1200 ppm',
    alarmLow: '25 ppm',
    alarmHigh: '100 ppm',
    sensorType: 'Electrochemical cell',
    notes: 'Product of incomplete combustion. Odorless, colorless. Common in underground mines from diesel equipment, blasting, and fires. Heaviest exposure during re-entry after blasting.',
    color: '#ef4444',
  },
  {
    gas: 'Hydrogen Sulphide',
    formula: 'H\₂S',
    twa: '10 ppm',
    stel: '15 ppm',
    idlh: '100 ppm',
    alarmLow: '10 ppm',
    alarmHigh: '15 ppm',
    sensorType: 'Electrochemical cell',
    notes: 'Rotten egg smell at low concentrations, but olfactory fatigue at >100 ppm (cannot smell it). Heavier than air. Found in sulfide ore bodies and near acid drainage.',
    color: '#f59e0b',
  },
  {
    gas: 'Oxygen',
    formula: 'O\₂',
    twa: '19.5-23.0%',
    stel: 'N/A',
    idlh: '<16% (O\₂ deficient)',
    alarmLow: '19.5% (deficient)',
    alarmHigh: '23.0% (enriched)',
    sensorType: 'Electrochemical (galvanic cell)',
    notes: 'Normal air: 20.9%. Below 19.5% is oxygen-deficient atmosphere. Above 23% increases fire/explosion risk. Consumed by oxidation of sulfide ores, diesel engines, blasting.',
    color: '#3b82f6',
  },
  {
    gas: 'Methane',
    formula: 'CH\₄',
    twa: 'N/A',
    stel: 'N/A',
    idlh: 'LEL = 5.0%',
    alarmLow: '1.0% (20% LEL)',
    alarmHigh: '2.5% (50% LEL)',
    sensorType: 'Catalytic bead (pellistor) or infrared',
    notes: 'Explosive range: 5-15% in air. Lighter than air, accumulates at roof. Required monitoring in all Ontario underground mines per O. Reg. 854. Power must be de-energized at 2.5% (50% LEL).',
    color: '#22c55e',
  },
  {
    gas: 'Nitrogen Dioxide',
    formula: 'NO\₂',
    twa: '3 ppm',
    stel: '5 ppm',
    idlh: '20 ppm',
    alarmLow: '3 ppm',
    alarmHigh: '5 ppm',
    sensorType: 'Electrochemical cell',
    notes: 'Produced by blasting (nitrous fumes) and diesel exhaust. Reddish-brown, heavier than air. Extremely irritating to lungs. Delayed pulmonary edema possible.',
    color: '#a855f7',
  },
  {
    gas: 'Sulphur Dioxide',
    formula: 'SO\₂',
    twa: '2 ppm',
    stel: '5 ppm',
    idlh: '100 ppm',
    alarmLow: '2 ppm',
    alarmHigh: '5 ppm',
    sensorType: 'Electrochemical cell',
    notes: 'Produced by combustion of sulfide ores, smelting operations, diesel exhaust with high-sulfur fuel. Strong irritant. Heavier than air.',
    color: '#f97316',
  },
]

interface MiningInstrument {
  name: string
  parameter: string
  description: string
  location: string
  signal: string
  regulation: string
  color: string
}

const miningInstruments: MiningInstrument[] = [
  {
    name: 'Anemometer (Vane Type)',
    parameter: 'Air Velocity',
    description: 'Rotating vane measures air velocity in mine ventilation airways. Digital display with averaging function.',
    location: 'Main ventilation drifts, raises, stopes, and at each level entrance.',
    signal: 'Handheld spot readings or fixed installation with 4-20 mA output.',
    regulation: 'O. Reg. 854 s.183-185: Minimum air velocity requirements for underground workplaces.',
    color: '#06b6d4',
  },
  {
    name: 'Differential Pressure Transmitter (Vent)',
    parameter: 'Ventilation Pressure',
    description: 'Measures pressure differential across ventilation doors, regulators, fans, and between levels.',
    location: 'Across main fans, ventilation doors, regulators, bulkheads.',
    signal: '4-20 mA to surface SCADA. Range: 0-2000 Pa typical.',
    regulation: 'Required for ventilation monitoring system per mine ventilation plan.',
    color: '#3b82f6',
  },
  {
    name: 'Ground Fault Monitor (GFM)',
    parameter: 'Ground Fault Current',
    description: 'Zero-sequence CT monitoring. Detects leakage current from phase conductors to ground. Trips at 100 mA or less on >300V systems.',
    location: 'At every transformer secondary, motor starter, and trailing cable connection.',
    signal: 'Relay output (trip/alarm). Some with 4-20mA for leakage trending.',
    regulation: 'O. Reg. 854 s.153: Ground fault protection mandatory for all underground mine electrical installations.',
    color: '#ef4444',
  },
  {
    name: 'Ground Continuity Monitor (GCM)',
    parameter: 'Ground Conductor Integrity',
    description: 'Pilot wire system monitors continuity of equipment grounding conductor in trailing cables. Opens contactor if ground conductor breaks.',
    location: 'On all mobile/portable equipment with trailing cables.',
    signal: 'Pilot wire circuit (typically 40-80 VDC). Trip contact to main contactor.',
    regulation: 'O. Reg. 854 s.153(3): Ground check monitor required on medium voltage trailing cables.',
    color: '#ef4444',
  },
  {
    name: 'Seismic Monitor',
    parameter: 'Ground Vibration / Microseismicity',
    description: 'Geophones or accelerometers detect rockburst precursors and blast vibrations. Triaxial sensors for full measurement.',
    location: 'Throughout the mine in rock pillars, near active stopes, on surface.',
    signal: 'Digital (Ethernet/fiber) to surface processing computer. High sample rate.',
    regulation: 'Required in burst-prone mines per O. Reg. 854 and ground control management plan.',
    color: '#a855f7',
  },
  {
    name: 'Stench Gas System',
    parameter: 'Emergency Notification',
    description: 'Ethyl mercaptan injection into ventilation system. Distinctive foul odor alerts all underground workers to evacuate.',
    location: 'Injection at main intake fan(s) on surface.',
    signal: 'Solenoid valve triggered by emergency stop system. Manual and auto trigger.',
    regulation: 'O. Reg. 854 s.17(3): Stench gas or equivalent emergency warning system required in underground mines.',
    color: '#f59e0b',
  },
  {
    name: 'Conveyor Belt Monitoring',
    parameter: 'Belt Speed, Alignment, Rip Detection',
    description: 'Speed switch monitors belt velocity. Belt sway switches detect misalignment. Embedded sensors detect rips.',
    location: 'Head and tail pulleys, along belt length, at transfer points.',
    signal: 'Speed: pulse/relay. Sway: limit switch contact. Rip: inductive loop to PLC.',
    regulation: 'O. Reg. 854 s.196: Conveyor belt safety devices required including emergency stop cords.',
    color: '#22c55e',
  },
  {
    name: 'Dewatering Pump Instrumentation',
    parameter: 'Level, Flow, Pressure, Vibration',
    description: 'Sump level transmitter (ultrasonic/pressure), discharge pressure, flow totalizer, bearing vibration monitoring.',
    location: 'Mine sumps at each level, main pump stations, settling ponds.',
    signal: '4-20 mA for level/pressure/flow. Vibration: 4-20 mA or digital to PLC.',
    regulation: 'O. Reg. 854 s.86-88: Water management requirements for underground mines.',
    color: '#3b82f6',
  },
  {
    name: 'Refuge Station Monitoring',
    parameter: 'Air Quality, Pressure, Communication',
    description: 'Monitors CO, CO2, O2, temperature, and positive pressure inside underground refuge stations. Includes communication system to surface.',
    location: 'Each refuge station / safe haven underground.',
    signal: 'Independent monitoring system with surface telemetry. Battery backup required.',
    regulation: 'O. Reg. 854 s.17.1: Refuge stations must be equipped with atmospheric monitoring and communication.',
    color: '#ef4444',
  },
  {
    name: 'Shaft Conveyance Monitoring',
    parameter: 'Speed, Position, Overtravel, Rope Condition',
    description: 'Encoder for speed/position, overtravel limit switches, slack rope detection, rope load cells, safety circuits for hoist conveyances.',
    location: 'Shaft headframe, hoist room, shaft stations at each level.',
    signal: 'Encoder: pulse/digital. Limit switches: relay. Load cells: 4-20 mA. All to hoist PLC.',
    regulation: 'O. Reg. 854 Part IX: Detailed requirements for shaft hoisting equipment safety devices.',
    color: '#a855f7',
  },
  {
    name: 'Backfill Plant Instrumentation',
    parameter: 'Flow, Density, Pressure, Level',
    description: 'Monitors cement content, slurry density (nuclear or Coriolis), pipe pressure, tank levels, and flow rates for paste or hydraulic backfill.',
    location: 'Surface backfill plant, pipeline to underground stopes.',
    signal: '4-20 mA for analog. Coriolis: HART/Modbus for multi-variable. Density: nuclear gauge with RS-485.',
    regulation: 'O. Reg. 854 s.92-94: Backfill operations requirements, pipeline pressure monitoring.',
    color: '#22c55e',
  },
  {
    name: 'Dust Monitoring (Particulate)',
    parameter: 'Airborne Particulate Concentration',
    description: 'Real-time dust monitors (nephelometer or optical) measure respirable dust concentration in mg/m\³. Critical for silicosis prevention.',
    location: 'Crusher areas, ore passes, dry drilling areas, conveyor transfer points.',
    signal: '4-20 mA or Modbus to SCADA. Alarm relay outputs for high dust levels.',
    regulation: 'O. Reg. 854 s.186: Dust control requirements. ACGIH TLV for respirable silica: 0.025 mg/m\³.',
    color: '#f59e0b',
  },
]

/* ================================================================== */
/*  COMPONENT                                                          */
/* ================================================================== */

export default function InstrumentationPage() {
  const [tab, setTab] = useState<TabKey>('mA')

  /* --- 4-20 mA Calculator State --- */
  const [rangeMin, setRangeMin] = useState('0')
  const [rangeMax, setRangeMax] = useState('100')
  const [rangeUnit, setRangeUnit] = useState('PSI')
  const [calcMode, setCalcMode] = useState<'maToPV' | 'pvToMa'>('maToPV')
  const [maInput, setMaInput] = useState('12')
  const [pvInput, setPvInput] = useState('50')

  /* --- P&ID Filter State --- */
  const [pidCategory, setPidCategory] = useState<string>('All')

  /* --- Mining Sub-Tab State --- */
  const [miningSubTab, setMiningSubTab] = useState<'gas' | 'instruments'>('gas')

  /* --- Loop Loading Calculator State --- */
  const [loopSupplyV, setLoopSupplyV] = useState('24')
  const [loopTxMinV, setLoopTxMinV] = useState('12')
  const [loopPlcR, setLoopPlcR] = useState('250')
  const [loopCableR, setLoopCableR] = useState('50')
  const [loopBarrierR, setLoopBarrierR] = useState('0')
  const [loopOtherR, setLoopOtherR] = useState('0')

  /* ---- Calculator Functions ---- */
  const calcPVFromMA = (): string => {
    const lo = parseFloat(rangeMin)
    const hi = parseFloat(rangeMax)
    const ma = parseFloat(maInput)
    if (isNaN(lo) || isNaN(hi) || isNaN(ma)) return '--'
    if (hi === lo) return '--'
    const pct = (ma - 4) / 16
    const pv = lo + pct * (hi - lo)
    return pv.toFixed(2)
  }

  const calcMAFromPV = (): string => {
    const lo = parseFloat(rangeMin)
    const hi = parseFloat(rangeMax)
    const pv = parseFloat(pvInput)
    if (isNaN(lo) || isNaN(hi) || isNaN(pv)) return '--'
    if (hi === lo) return '--'
    const pct = (pv - lo) / (hi - lo)
    const ma = 4 + pct * 16
    return ma.toFixed(3)
  }

  const calcPercent = (): string => {
    if (calcMode === 'maToPV') {
      const ma = parseFloat(maInput)
      if (isNaN(ma)) return '--'
      return ((ma - 4) / 16 * 100).toFixed(1)
    } else {
      const lo = parseFloat(rangeMin)
      const hi = parseFloat(rangeMax)
      const pv = parseFloat(pvInput)
      if (isNaN(lo) || isNaN(hi) || isNaN(pv) || hi === lo) return '--'
      return ((pv - lo) / (hi - lo) * 100).toFixed(1)
    }
  }

  /* ---- P&ID Filter ---- */
  const pidCategories = ['All', ...Array.from(new Set(pidSymbols.map(s => s.category)))]
  const filteredPID = pidCategory === 'All' ? pidSymbols : pidSymbols.filter(s => s.category === pidCategory)

  return (
    <PageWrapper title="Instrumentation">
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ========== Tab Navigation ========== */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button
              key={t.key}
              style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ================================================================ */}
        {/*  TAB 1: 4-20 mA Loops                                           */}
        {/* ================================================================ */}
        {tab === 'mA' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={sectionTitle}>4-20 mA Current Loops</div>

            {/* How It Works */}
            <div style={card}>
              <div style={subHeading}>How 4-20 mA Works</div>
              <div style={bodyText}>
                A 4-20 mA current loop transmits a process measurement as a
                variable current signal over a pair of wires. The signal is
                proportional to the measured value: <strong>4 mA = 0% of
                range</strong> (LRV) and <strong>20 mA = 100% of range</strong>
                {' '}(URV). The choice of 4 mA as zero (instead of 0 mA) is
                deliberate: a broken wire reads 0 mA, which is
                distinguishable from a valid zero reading of 4 mA.
              </div>
              <div style={{ ...bodyText, marginTop: 8 }}>
                <strong>Key formula:</strong>
              </div>
              <div style={{ ...resultBox, marginTop: 6, fontSize: 14 }}>
                mA = 4 + (PV - LRV) / (URV - LRV) x 16
              </div>
              <div style={{ ...resultBox, marginTop: 6, fontSize: 14 }}>
                PV = LRV + (mA - 4) / 16 x (URV - LRV)
              </div>
              <div style={{ ...resultBox, marginTop: 6, fontSize: 14 }}>
                % of range = (mA - 4) / 16 x 100
              </div>
            </div>

            {/* Loop-Powered vs Externally Powered */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={cardHL('#3b82f6')}>
                <div style={subHeading}>Loop-Powered (2-Wire)</div>
                <div style={bodyText}>
                  The transmitter draws its operating power from the same
                  4-20 mA loop. A 24 VDC power supply energizes the loop.
                  The transmitter modulates the current to represent the
                  measurement. Maximum power available is limited (typically
                  {'<'}40 mA x minimum operating voltage). This is the most
                  common configuration for simple transmitters.
                </div>
                <div style={tipBox}>
                  <strong>Wiring:</strong> 24 VDC (+) &rarr; PLC analog input (+) &rarr;
                  field wire &rarr; transmitter (+) &rarr; transmitter (-) &rarr;
                  field wire &rarr; PLC input (-) &rarr; 24 VDC (-).
                  PLC reads current in series.
                </div>
              </div>
              <div style={cardHL('#22c55e')}>
                <div style={subHeading}>Externally Powered (4-Wire)</div>
                <div style={bodyText}>
                  The transmitter has its own dedicated power supply
                  (typically 120 VAC or 24 VDC). The 4-20 mA output is a
                  separate circuit that sources or sinks current. This allows
                  higher power consumption for features like backlit displays,
                  complex calculations, or driving multiple loads.
                </div>
                <div style={tipBox}>
                  <strong>Wiring:</strong> Separate power wires to
                  transmitter. Signal output (+/-) connects to PLC analog
                  input. Check if transmitter is sourcing or sinking.
                </div>
              </div>
            </div>

            {/* Live Calculator */}
            <div style={{ ...card, border: '2px solid var(--primary)' }}>
              <div style={{ ...sectionTitle, marginBottom: 10 }}>
                Live 4-20 mA Calculator
              </div>

              {/* Range inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={labelStyle}>Range Min (LRV)</div>
                  <input
                    type="number"
                    value={rangeMin}
                    onChange={e => setRangeMin(e.target.value)}
                    style={inputStyle}
                    inputMode="decimal"
                  />
                </div>
                <div>
                  <div style={labelStyle}>Range Max (URV)</div>
                  <input
                    type="number"
                    value={rangeMax}
                    onChange={e => setRangeMax(e.target.value)}
                    style={inputStyle}
                    inputMode="decimal"
                  />
                </div>
                <div>
                  <div style={labelStyle}>Unit</div>
                  <input
                    type="text"
                    value={rangeUnit}
                    onChange={e => setRangeUnit(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Quick-fill from common ranges */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ ...labelStyle, marginBottom: 6 }}>Quick Fill (tap to load range):</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    { label: '0-100 PSI', min: '0', max: '100', unit: 'PSI' },
                    { label: '0-500 PSI', min: '0', max: '500', unit: 'PSI' },
                    { label: '0-500\°F', min: '0', max: '500', unit: '\°F' },
                    { label: '-40-150\°C', min: '-40', max: '150', unit: '\°C' },
                    { label: '0-100%', min: '0', max: '100', unit: '%' },
                    { label: '0-500 GPM', min: '0', max: '500', unit: 'GPM' },
                    { label: '0-200 inH2O', min: '0', max: '200', unit: 'inH\₂O' },
                    { label: '0-14 pH', min: '0', max: '14', unit: 'pH' },
                    { label: '0-1800 RPM', min: '0', max: '1800', unit: 'RPM' },
                    { label: '0-30 ft', min: '0', max: '30', unit: 'ft' },
                  ].map((qf, i) => (
                    <button
                      key={i}
                      onClick={() => { setRangeMin(qf.min); setRangeMax(qf.max); setRangeUnit(qf.unit) }}
                      style={{
                        minHeight: 36,
                        padding: '4px 12px',
                        borderRadius: 18,
                        fontSize: 11,
                        fontWeight: 600,
                        border: '1px solid var(--divider)',
                        background: 'var(--input-bg)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {qf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  style={calcMode === 'maToPV' ? pillActive : pillBase}
                  onClick={() => setCalcMode('maToPV')}
                >
                  mA &rarr; Process Value
                </button>
                <button
                  style={calcMode === 'pvToMa' ? pillActive : pillBase}
                  onClick={() => setCalcMode('pvToMa')}
                >
                  Process Value &rarr; mA
                </button>
              </div>

              {/* Input */}
              {calcMode === 'maToPV' ? (
                <div style={{ marginBottom: 12 }}>
                  <div style={labelStyle}>Enter mA (4.000 - 20.000)</div>
                  <input
                    type="number"
                    value={maInput}
                    onChange={e => setMaInput(e.target.value)}
                    style={inputStyle}
                    step="0.001"
                    min="0"
                    max="24"
                    inputMode="decimal"
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  <div style={labelStyle}>Enter Process Value ({rangeUnit})</div>
                  <input
                    type="number"
                    value={pvInput}
                    onChange={e => setPvInput(e.target.value)}
                    style={inputStyle}
                    inputMode="decimal"
                  />
                </div>
              )}

              {/* Results */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {calcMode === 'maToPV' ? (
                  <>
                    <div style={resultBox}>
                      Process Value: {calcPVFromMA()} {rangeUnit}
                    </div>
                    <div style={resultBox}>
                      Percent of Range: {calcPercent()}%
                    </div>
                    <div style={{
                      ...resultBox,
                      background: parseFloat(maInput) < 3.8
                        ? 'rgba(255,107,107,0.15)'
                        : parseFloat(maInput) > 20.5
                          ? 'rgba(255,152,0,0.15)'
                          : 'var(--input-bg)',
                    }}>
                      Status: {
                        parseFloat(maInput) < 3.8
                          ? 'UNDER-RANGE / FAULT (open loop?)'
                          : parseFloat(maInput) > 20.5
                            ? 'OVER-RANGE / FAULT (sensor failure?)'
                            : parseFloat(maInput) < 4
                              ? 'Below 4 mA (below zero)'
                              : parseFloat(maInput) > 20
                                ? 'Above 20 mA (above span)'
                                : 'Normal'
                      }
                    </div>
                  </>
                ) : (
                  <>
                    <div style={resultBox}>
                      Output: {calcMAFromPV()} mA
                    </div>
                    <div style={resultBox}>
                      Percent of Range: {calcPercent()}%
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Common Ranges Table */}
            <div style={card}>
              <div style={subHeading}>Common 4-20 mA Ranges</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Parameter</th>
                      <th style={tableHeader}>Range</th>
                      <th style={tableHeader}>Application</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commonRanges.map((r, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, color: r.color, fontWeight: 600 }}>{r.parameter}</td>
                        <td style={tableCellMono}>{r.low} - {r.high} {r.unit}</td>
                        <td style={tableCell}>{r.application}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Reference */}
            <div style={tipBox}>
              <strong>Quick mA Reference Points:</strong><br />
              4 mA = 0% &nbsp;|&nbsp; 8 mA = 25% &nbsp;|&nbsp; 12 mA = 50% &nbsp;|&nbsp; 16 mA = 75% &nbsp;|&nbsp; 20 mA = 100%
            </div>

            {/* Detailed mA-to-Percent Reference Table */}
            <div style={card}>
              <div style={subHeading}>mA-to-Percent Reference Table</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>mA</th>
                      <th style={tableHeader}>% Range</th>
                      <th style={tableHeader}>Common Check Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { ma: '3.6', pct: '-2.5%', note: 'NAMUR NE43 low fault (sensor failure downscale)' },
                      { ma: '3.8', pct: '-1.25%', note: 'Under-range alarm setpoint (typical)' },
                      { ma: '4.000', pct: '0%', note: 'Zero / LRV (Lower Range Value)' },
                      { ma: '6.000', pct: '12.5%', note: '' },
                      { ma: '8.000', pct: '25%', note: '25% calibration check point' },
                      { ma: '10.000', pct: '37.5%', note: '' },
                      { ma: '12.000', pct: '50%', note: '50% calibration check point (mid-span)' },
                      { ma: '14.000', pct: '62.5%', note: '' },
                      { ma: '16.000', pct: '75%', note: '75% calibration check point' },
                      { ma: '18.000', pct: '87.5%', note: '' },
                      { ma: '20.000', pct: '100%', note: 'Full span / URV (Upper Range Value)' },
                      { ma: '20.5', pct: '103.1%', note: 'Over-range alarm setpoint (typical)' },
                      { ma: '21.0', pct: '106.25%', note: 'NAMUR NE43 high fault (sensor failure upscale)' },
                    ].map((row, i) => (
                      <tr key={i} style={{
                        background: row.ma === '3.6' || row.ma === '3.8' ? 'rgba(255,107,107,0.06)'
                          : row.ma === '20.5' || row.ma === '21.0' ? 'rgba(255,152,0,0.06)'
                          : 'transparent',
                      }}>
                        <td style={tableCellMono}>{row.ma}</td>
                        <td style={tableCellMono}>{row.pct}</td>
                        <td style={{ ...tableCell, fontSize: 12 }}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loop Voltage Budget */}
            <div style={card}>
              <div style={subHeading}>4-20 mA Loop Voltage Budget</div>
              <div style={bodyText}>
                In a 2-wire loop-powered system, the 24 VDC supply voltage is shared among all
                devices in the loop. Each device drops some voltage. The transmitter requires a
                minimum operating voltage (typically 12-15 VDC).
              </div>
              <div style={{ ...resultBox, marginTop: 8, fontSize: 13 }}>
                V_available = V_supply - V_PLC_drop - V_cable_drop - V_barrier_drop
              </div>
              <div style={{ ...bodyText, marginTop: 8 }}>
                <strong>Typical voltage drops at 20 mA:</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                {[
                  { device: 'PLC analog input (250\Ω)', drop: '5.0V' },
                  { device: 'Signal isolator', drop: '2.0-4.0V' },
                  { device: 'IS barrier (zener)', drop: '5.0-7.0V' },
                  { device: 'IS barrier (galvanic)', drop: '2.0-3.0V' },
                  { device: 'Cable resistance (500m x 2 x 44\Ω/km)', drop: '0.9V' },
                  { device: 'HART resistor (250\Ω)', drop: '5.0V' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 8px', fontSize: 13,
                    borderBottom: '1px solid var(--divider)',
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.device}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>{item.drop}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={warningBox}>
              <strong>Fault Detection:</strong> A reading of 0 mA indicates an open loop (broken wire
              or disconnected transmitter). Most systems alarm below 3.8 mA (under-range) and above
              20.5 mA (over-range / NAMUR NE43 standard). Some transmitters can be configured to
              drive to 3.6 mA or 21.0 mA on sensor failure.
            </div>

            {/* NAMUR NE43 Standard */}
            <div style={card}>
              <div style={subHeading}>NAMUR NE43 Fault Signal Standard</div>
              <div style={bodyText}>
                NAMUR NE43 defines standard signal levels for indicating transmitter faults.
                This allows the control system to distinguish between a valid process reading
                and a device failure.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {[
                  { range: '3.6 mA', meaning: 'Sensor failure / diagnostic fault (downscale)', color: '#ef4444' },
                  { range: '3.8 - 4.0 mA', meaning: 'Below zero (under-range but sensor OK)', color: '#f59e0b' },
                  { range: '4.0 - 20.0 mA', meaning: 'Normal operating range (0-100%)', color: '#22c55e' },
                  { range: '20.0 - 20.5 mA', meaning: 'Above span (over-range but sensor OK)', color: '#f59e0b' },
                  { range: '21.0 mA', meaning: 'Sensor failure / diagnostic fault (upscale)', color: '#ef4444' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '8px',
                    borderLeft: `3px solid ${item.color}`,
                    background: `${item.color}08`,
                    borderRadius: '0 4px 4px 0',
                    fontSize: 13, lineHeight: 1.5,
                  }}>
                    <span style={{
                      fontWeight: 700, color: 'var(--primary)',
                      fontFamily: 'var(--font-mono)', minWidth: 120, flexShrink: 0,
                    }}>
                      {item.range}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/*  TAB 2: RTDs & Thermocouples                                     */}
        {/* ================================================================ */}
        {tab === 'rtdtc' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={sectionTitle}>RTDs (Resistance Temperature Detectors)</div>

            {/* RTD Types */}
            {rtdTypes.map(r => (
              <div key={r.name} style={cardHL(r.color)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{r.name}</div>
                  <span style={tagPill(r.color + '22', r.color)}>{r.material}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong>Resistance:</strong> {r.resistance}<br />
                  <strong>Range:</strong> {r.range}<br />
                  <strong>Accuracy:</strong> {r.accuracy}<br />
                  <strong>Use:</strong> {r.application}
                </div>
              </div>
            ))}

            {/* RTD Wiring */}
            <div style={{ ...sectionTitle, marginTop: 8 }}>RTD Wiring Configurations</div>
            {rtdWiringTypes.map(w => (
              <div key={w.wires} style={card}>
                <div style={subHeading}>{w.wires}-Wire RTD</div>
                <div style={bodyText}>{w.description}</div>
                <div style={{ ...bodyText, marginTop: 6 }}>
                  <strong>Accuracy:</strong> {w.accuracy}
                </div>
                <div style={{ ...bodyText, marginTop: 4 }}>
                  <strong>Use Case:</strong> {w.use}
                </div>
                <div style={{
                  background: 'var(--input-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text)',
                  marginTop: 8,
                  whiteSpace: 'pre',
                  overflowX: 'auto',
                  lineHeight: 1.6,
                }}>
                  {w.diagram}
                </div>
              </div>
            ))}

            {/* RTD Troubleshooting */}
            <div style={tipBox}>
              <strong>RTD Troubleshooting Tips:</strong><br />
              PT100 reads ~100\Ω at 0\°C, ~138.5\Ω at 100\°C. If you read 0\Ω, the element is shorted.
              If you read infinity (open), the element is broken. Measure resistance at the transmitter
              terminals with power disconnected. Compare to PT100 resistance table.
            </div>

            {/* PT100 Resistance Table */}
            <div style={card}>
              <div style={subHeading}>PT100 Resistance vs Temperature Table (IEC 60751)</div>
              <div style={{ ...bodyText, marginBottom: 8 }}>
                Use this table to verify RTD readings with a multimeter. Disconnect the RTD
                from the transmitter, measure resistance across the element leads, and compare
                to expected values. PT1000 values are 10x these values.
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 300 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Temp (\°C)</th>
                      <th style={tableHeader}>PT100 (\Ω)</th>
                      <th style={tableHeader}>PT1000 (\Ω)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pt100Table.map((row, i) => (
                      <tr key={i} style={{
                        background: row.tempC === 0 ? 'rgba(255,215,0,0.08)'
                          : row.tempC === 100 ? 'rgba(255,215,0,0.06)' : 'transparent',
                      }}>
                        <td style={tableCellMono}>{row.tempC}\°C</td>
                        <td style={tableCellMono}>{row.resistance} \Ω</td>
                        <td style={tableCellMono}>{(parseFloat(row.resistance) * 10).toFixed(1)} \Ω</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RTD Fault Diagnosis */}
            <div style={{ ...sectionTitle, marginTop: 8 }}>RTD Fault Diagnosis Guide</div>
            {rtdFaults.map((f, i) => (
              <div key={i} style={cardHL(f.color)}>
                <div style={{ fontSize: 15, fontWeight: 700, color: f.color, marginBottom: 6 }}>
                  {f.symptom}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                  <strong style={{ color: 'var(--text)' }}>Likely Cause:</strong> {f.likelyCause}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                  <strong style={{ color: 'var(--text)' }}>How to Test:</strong> {f.test}
                </div>
                <div style={tipBox}>
                  <strong>Fix:</strong> {f.fix}
                </div>
              </div>
            ))}

            {/* RTD vs TC Comparison */}
            <div style={card}>
              <div style={subHeading}>When to Use RTD vs Thermocouple</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Feature</th>
                      <th style={tableHeader}>RTD</th>
                      <th style={tableHeader}>Thermocouple</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Temperature Range', '-200 to +850\°C', '-200 to +1800\°C'],
                      ['Accuracy', 'Higher (\±0.1\°C possible)', 'Lower (\±1-2.2\°C typical)'],
                      ['Response Time', 'Slower (thermal mass)', 'Faster (small junction)'],
                      ['Long-term Stability', 'Excellent', 'Subject to drift'],
                      ['Cost', 'Higher', 'Lower'],
                      ['Lead Wire', 'Standard copper', 'Must use TC extension wire'],
                      ['Vibration Resistance', 'Good (wire-wound) to poor (thin film)', 'Excellent'],
                      ['Self-Heating', 'Yes (from excitation current)', 'No (generates own EMF)'],
                      ['Mining Preference', 'Process control, moderate temps', 'High temp (kilns, smelters)'],
                    ].map(([feature, rtd, tc], i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, fontWeight: 600 }}>{feature}</td>
                        <td style={tableCell}>{rtd}</td>
                        <td style={tableCell}>{tc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Thermocouples */}
            <div style={{ ...sectionTitle, marginTop: 8 }}>Thermocouples</div>

            <div style={card}>
              <div style={subHeading}>How Thermocouples Work</div>
              <div style={bodyText}>
                A thermocouple generates a small voltage (millivolts) based on
                the temperature difference between the measurement junction
                (hot end) and the reference junction (cold end). This is the
                Seebeck effect. The voltage is non-linear and specific to
                each thermocouple type. The transmitter or input card
                applies cold junction compensation (CJC) to account for the
                temperature at the terminals.
              </div>
            </div>

            {/* TC Types */}
            {tcTypes.map(tc => (
              <div key={tc.type} style={cardHL(tc.tint)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Type {tc.type}</div>
                  <span style={tagPill(tc.tint + '22', tc.tint)}>{tc.range}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong>Metals:</strong> {tc.metals}<br />
                  <strong>Accuracy:</strong> {tc.accuracy}<br />
                  <strong>Use:</strong> {tc.application}
                </div>
                <div style={{
                  display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>CSA Colors:</span>
                  <span style={tagPill('rgba(255,255,255,0.1)', 'var(--text)')}>
                    (+) {tc.color_pos_csa}
                  </span>
                  <span style={tagPill('rgba(255,107,107,0.2)', '#ff6b6b')}>
                    (-) {tc.color_neg_csa}
                  </span>
                  <span style={tagPill('rgba(255,255,255,0.05)', 'var(--text-secondary)')}>
                    Jacket: {tc.color_jacket_csa}
                  </span>
                </div>
              </div>
            ))}

            {/* CSA Color Code Note */}
            <div style={warningBox}>
              <strong>CSA vs ANSI Color Codes:</strong> Canada uses CSA
              C96.1 color coding which differs from ANSI (US). The negative
              lead is always <strong>RED</strong> in CSA standard (opposite
              of ANSI where red is positive for Type J/K). Always verify
              which standard is used on your site! Using the wrong extension
              wire polarity causes measurement errors.
            </div>

            <div style={tipBox}>
              <strong>TC Troubleshooting:</strong><br />
              Measure mV at the transmitter with the TC disconnected and short the
              terminals together. You should read ambient temperature (CJC reading).
              If reading is way off, the transmitter CJC is faulty. Check for
              corrosion at connections and verify extension wire matches TC type.
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/*  TAB 3: Pressure / Level / Flow                                  */}
        {/* ================================================================ */}
        {tab === 'plf' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={sectionTitle}>Pressure, Level & Flow Sensors</div>

            <div style={card}>
              <div style={bodyText}>
                Process sensors convert physical measurements into electrical
                signals (typically 4-20 mA) for monitoring and control.
                Selecting the right sensor depends on the process fluid,
                conditions, accuracy requirements, and environment. Mining
                applications often deal with abrasive slurries, extreme
                temperatures, and hazardous atmospheres.
              </div>
            </div>

            {/* Sensor categories */}
            {(['Pressure', 'Level', 'Flow'] as const).map(cat => (
              <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{
                  ...sectionTitle,
                  fontSize: 14,
                  padding: '8px 12px',
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--divider)',
                }}>
                  {cat === 'Pressure' ? 'Pressure Sensors' : cat === 'Level' ? 'Level Sensors' : 'Flow Sensors'}
                </div>
                {sensors
                  .filter(s => s.category === cat)
                  .map(s => (
                    <div key={s.name} style={cardHL(s.color)}>
                      <div style={subHeading}>{s.name}</div>
                      <div style={{ ...bodyText, marginBottom: 8 }}>
                        <strong>Principle:</strong> {s.principle}
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '6px 16px',
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        marginBottom: 8,
                      }}>
                        <div><strong>Range:</strong> {s.typicalRange}</div>
                        <div><strong>Output:</strong> {s.output}</div>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
                        <strong style={{ color: '#22c55e' }}>Advantages:</strong> {s.advantages}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
                        <strong style={{ color: '#ef4444' }}>Limitations:</strong> {s.limitations}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
                        <strong style={{ color: '#f59e0b' }}>Mining Use:</strong> {s.miningUse}
                      </div>
                      <div style={tipBox}>
                        <strong>Wiring:</strong> {s.wiring}
                      </div>
                    </div>
                  ))}
              </div>
            ))}

            <div style={warningBox}>
              <strong>Mining Slurry Considerations:</strong> Slurry (ore + water mixture)
              is abrasive and has variable density. Avoid sensors with small orifices
              (impulse lines plug), moving parts (wear), or direct contact probes in heavy
              slurry. Magnetic flow meters, non-contact radar, and flush-diaphragm pressure
              transmitters are preferred.
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/*  TAB 4: Signal Conditioning                                      */}
        {/* ================================================================ */}
        {tab === 'signal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={sectionTitle}>Signal Conditioning Devices</div>

            <div style={card}>
              <div style={bodyText}>
                Signal conditioning devices sit between field instruments and
                control systems. They isolate, convert, split, or protect
                signals. Critical in mining for noise rejection, intrinsic
                safety, and interfacing legacy systems.
              </div>
            </div>

            {signalDevices.map(d => (
              <div key={d.name} style={cardHL(d.color)}>
                <div style={subHeading}>{d.name}</div>
                <div style={{ ...bodyText, marginBottom: 8 }}>{d.function}</div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px 16px',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: 8,
                }}>
                  <div><strong>Input:</strong> {d.inputSignal}</div>
                  <div><strong>Output:</strong> {d.outputSignal}</div>
                </div>
                <div style={{ ...bodyText, marginBottom: 6 }}>
                  <strong>Application:</strong> {d.application}
                </div>
                <div style={tipBox}>
                  <strong>Wiring Notes:</strong> {d.wiringNotes}
                </div>
              </div>
            ))}

            {/* IS Barrier Comparison */}
            <div style={{ ...card, border: '2px solid #ef4444' }}>
              <div style={{ ...subHeading, color: '#ef4444' }}>
                Zener Barrier vs Galvanic Isolator
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Feature</th>
                      <th style={tableHeader}>Zener Barrier</th>
                      <th style={tableHeader}>Galvanic Isolator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['IS Ground Bus', 'REQUIRED (\≤1\Ω)', 'NOT required'],
                      ['Isolation', 'None (shunt type)', 'Full galvanic isolation'],
                      ['Power Loss', 'Significant voltage drop', 'Minimal'],
                      ['Cost', 'Lower', 'Higher'],
                      ['Signal Quality', 'Ground loops possible', 'Excellent (no ground loops)'],
                      ['Fuse', 'Internal fuse (replace unit if blown)', 'No fuse needed'],
                      ['Preferred For', 'Simple, low-cost installations', 'Mining, critical loops, no IS ground'],
                    ].map(([feature, zener, galvanic], i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, fontWeight: 600 }}>{feature}</td>
                        <td style={tableCell}>{zener}</td>
                        <td style={tableCell}>{galvanic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loop Loading */}
            <div style={card}>
              <div style={subHeading}>Loop Loading Calculation</div>
              <div style={bodyText}>
                Every device in a 4-20 mA loop adds resistance. The total loop
                resistance must not exceed what the power supply and transmitter
                can drive.
              </div>
              <div style={{ ...resultBox, marginTop: 8, fontSize: 13 }}>
                Max Loop R = (V_supply - V_transmitter_min) / 0.020 A
              </div>
              <div style={{ ...bodyText, marginTop: 8 }}>
                Example: 24V supply, transmitter needs 12V minimum:<br />
                Max Loop R = (24 - 12) / 0.020 = <strong>600\Ω</strong><br />
                PLC input (250\Ω) + cable (50\Ω) + isolator (100\Ω) = 400\Ω &lt; 600\Ω OK
              </div>
            </div>

            {/* Live Loop Loading Calculator */}
            <div style={{ ...card, border: '2px solid var(--primary)' }}>
              <div style={{ ...sectionTitle, marginBottom: 10 }}>
                Live Loop Loading Calculator
              </div>
              <div style={{ ...bodyText, marginBottom: 12 }}>
                Enter your loop component values to verify the transmitter will have enough
                voltage to operate. All values calculated at 20 mA (worst case).
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={labelStyle}>Supply Voltage (V)</div>
                  <input type="number" value={loopSupplyV} onChange={e => setLoopSupplyV(e.target.value)} style={inputStyle} inputMode="decimal" />
                </div>
                <div>
                  <div style={labelStyle}>Tx Min Voltage (V)</div>
                  <input type="number" value={loopTxMinV} onChange={e => setLoopTxMinV(e.target.value)} style={inputStyle} inputMode="decimal" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={labelStyle}>PLC Input R (\Ω)</div>
                  <input type="number" value={loopPlcR} onChange={e => setLoopPlcR(e.target.value)} style={inputStyle} inputMode="decimal" />
                </div>
                <div>
                  <div style={labelStyle}>Cable R (\Ω)</div>
                  <input type="number" value={loopCableR} onChange={e => setLoopCableR(e.target.value)} style={inputStyle} inputMode="decimal" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={labelStyle}>Barrier R (\Ω)</div>
                  <input type="number" value={loopBarrierR} onChange={e => setLoopBarrierR(e.target.value)} style={inputStyle} inputMode="decimal" />
                </div>
                <div>
                  <div style={labelStyle}>Other R (\Ω)</div>
                  <input type="number" value={loopOtherR} onChange={e => setLoopOtherR(e.target.value)} style={inputStyle} inputMode="decimal" />
                </div>
              </div>

              {(() => {
                const vs = parseFloat(loopSupplyV) || 0
                const vtMin = parseFloat(loopTxMinV) || 0
                const rPlc = parseFloat(loopPlcR) || 0
                const rCable = parseFloat(loopCableR) || 0
                const rBarrier = parseFloat(loopBarrierR) || 0
                const rOther = parseFloat(loopOtherR) || 0
                const rTotal = rPlc + rCable + rBarrier + rOther
                const vDrop = rTotal * 0.020
                const vAtTx = vs - vDrop
                const maxR = vs > vtMin ? (vs - vtMin) / 0.020 : 0
                const ok = vAtTx >= vtMin
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={resultBox}>Total Loop Resistance: {rTotal.toFixed(0)} \Ω</div>
                    <div style={resultBox}>Max Allowable Loop R: {maxR.toFixed(0)} \Ω</div>
                    <div style={resultBox}>Voltage Drop at 20 mA: {vDrop.toFixed(2)} V</div>
                    <div style={resultBox}>Voltage at Transmitter: {vAtTx.toFixed(2)} V</div>
                    <div style={{
                      ...resultBox,
                      background: ok ? 'rgba(34,197,94,0.12)' : 'rgba(255,107,107,0.15)',
                      color: ok ? '#22c55e' : '#ef4444',
                    }}>
                      Status: {ok
                        ? `OK \— Transmitter has ${(vAtTx - vtMin).toFixed(1)}V margin`
                        : `FAIL \— Needs ${vtMin}V, only gets ${vAtTx.toFixed(1)}V`
                      }
                    </div>
                  </div>
                )
              })()}
            </div>

            <div style={tipBox}>
              <strong>250\Ω Resistor Rule:</strong> A 250\Ω precision resistor converts 4-20 mA
              to 1-5V (Ohm's law: V = I x R). This is the simplest current-to-voltage conversion.
              Many PLC analog inputs have a 250\Ω input impedance built in. HART communication
              requires minimum 250\Ω in the loop.
            </div>

            {/* Common Signal Conversions */}
            <div style={card}>
              <div style={subHeading}>Common Signal Conversion Quick Reference</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>From</th>
                      <th style={tableHeader}>To</th>
                      <th style={tableHeader}>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['4-20 mA', '1-5 V', '250\Ω precision resistor in series'],
                      ['4-20 mA', '0-5 V', 'Active converter (I/V converter IC)'],
                      ['4-20 mA', '0-10 V', '500\Ω resistor or active converter'],
                      ['0-10 V', '4-20 mA', 'Active V/I converter module'],
                      ['RTD', '4-20 mA', 'Head-mount temperature transmitter'],
                      ['TC (mV)', '4-20 mA', 'TC transmitter with CJC'],
                      ['Pulse/Hz', '4-20 mA', 'Frequency-to-current converter'],
                      ['4-20 mA', '2x 4-20 mA', 'Signal splitter (active, isolated)'],
                      ['4-20 mA', '4-20 mA (iso)', 'Galvanic signal isolator'],
                      ['Modbus', '4-20 mA', 'Protocol converter / gateway'],
                    ].map(([from, to, method], i) => (
                      <tr key={i}>
                        <td style={tableCellMono}>{from}</td>
                        <td style={tableCellMono}>{to}</td>
                        <td style={tableCell}>{method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/*  TAB 5: P&ID Symbols & ISA Tag Numbering                         */}
        {/* ================================================================ */}
        {tab === 'pid' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={sectionTitle}>P&ID Instrument Symbols (ISA S5.1)</div>

            {/* Symbol Legend */}
            <div style={card}>
              <div style={subHeading}>Reading Instrument Bubbles</div>
              <div style={bodyText}>
                On P&ID drawings, instruments are shown as circles (bubbles)
                with letter/number codes inside. A <strong>horizontal line
                through the circle</strong> means the instrument is mounted in
                the main control panel or DCS/SCADA. A <strong>dashed horizontal
                line</strong> means mounted behind the panel (not operator
                accessible). <strong>No line</strong> means field-mounted.
              </div>
              <div style={{ ...bodyText, marginTop: 8 }}>
                The <strong>first letter</strong> identifies the measured
                variable (T=Temperature, P=Pressure, F=Flow, L=Level, A=Analysis).
                <strong> Succeeding letters</strong> identify the function
                (T=Transmitter, I=Indicator, C=Controller, S=Switch, E=Element,
                V=Valve, A=Alarm, H=High, L=Low).
              </div>
              <div style={{ ...bodyText, marginTop: 8 }}>
                The <strong>tag number</strong> format is: letter code + loop
                number (e.g., TT-101 = Temperature Transmitter, loop 101).
              </div>
            </div>

            {/* Category filter */}
            <div style={pillRow}>
              {pidCategories.map(c => (
                <button
                  key={c}
                  style={pidCategory === c ? pillActive : pillBase}
                  onClick={() => setPidCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Symbols list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredPID.map(s => (
                <div key={s.tag} style={{
                  ...card,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  borderLeft: `4px solid ${s.color}`,
                  padding: '12px 14px',
                }}>
                  {/* Tag bubble */}
                  <div style={{
                    minWidth: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: `2px solid ${s.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: 14,
                    color: s.color,
                    flexShrink: 0,
                  }}>
                    {s.tag}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 2,
                    }}>
                      {s.letterBreakdown}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
                      {s.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ISA Letter Table */}
            <div style={card}>
              <div style={subHeading}>ISA S5.1 Letter Designations</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 360 }}>
                  <thead>
                    <tr>
                      <th style={{ ...tableHeader, width: 50 }}>Letter</th>
                      <th style={tableHeader}>First Letter (Measured Variable)</th>
                      <th style={tableHeader}>Succeeding Letter (Function)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isaLetters.map(l => (
                      <tr key={l.letter}>
                        <td style={tableCellMono}>{l.letter}</td>
                        <td style={tableCell}>{l.firstLetter}</td>
                        <td style={tableCell}>{l.succeeding}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={tipBox}>
              <strong>Reading Example:</strong> Tag "FIC-301" = F (Flow) + I (Indicating)
              + C (Controller), loop 301. This is a flow indicating controller on loop 301.
              If the circle has a horizontal line through it, it is on the main control panel.
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/*  TAB 6: HART Protocol                                            */}
        {/* ================================================================ */}
        {tab === 'hart' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={sectionTitle}>HART Protocol Basics</div>

            {hartFacts.map((f, i) => (
              <div key={i} style={cardHL(i < 3 ? '#3b82f6' : i < 6 ? '#22c55e' : i < 9 ? '#a855f7' : '#f59e0b')}>
                <div style={subHeading}>{f.title}</div>
                <div style={bodyText}>{f.detail}</div>
              </div>
            ))}

            {/* HART Connection Diagram */}
            <div style={card}>
              <div style={subHeading}>HART Communicator Connection</div>
              <div style={{
                background: 'var(--input-bg)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text)',
                lineHeight: 1.8,
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}>
{`  24 VDC (+) ----[ 250R ]----+---- PLC AI (+)
                             |
                        [HART Comm]
                        (in parallel)
                             |
  Field (+) ----[Transmitter]---- Field (-)
                             |
  24 VDC (-) ----------------+---- PLC AI (-)`}
              </div>
              <div style={{ ...bodyText, marginTop: 8 }}>
                The HART communicator connects in <strong>parallel</strong> across
                the transmitter terminals or at the marshalling panel. The 250\Ω
                resistance must be between the communicator and the power supply
                (not between the communicator and the transmitter).
              </div>
            </div>

            {/* Common HART Commands */}
            <div style={card}>
              <div style={subHeading}>Common HART Configuration Tasks</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { task: 'Read PV', desc: 'View the current process value and loop current' },
                  { task: 'Set Range (LRV/URV)', desc: 'Configure lower and upper range values for 4-20 mA span' },
                  { task: 'Trim DAC Output', desc: 'Calibrate the 4 mA and 20 mA output points to match a reference meter' },
                  { task: 'Trim Sensor Input', desc: 'Adjust the sensor reading to match a known reference (field calibration)' },
                  { task: 'Set Damping', desc: 'Adjust signal smoothing (seconds). Reduce for fast processes, increase for noisy signals' },
                  { task: 'Set Transfer Function', desc: 'Linear or square root (for DP flow transmitters)' },
                  { task: 'Write Tag/Descriptor', desc: 'Set the device tag (8 chars max), descriptor (16 chars), and date' },
                  { task: 'Loop Test', desc: 'Force a specific mA output to verify PLC reads correctly' },
                  { task: 'Diagnostics', desc: 'Check sensor status, electronics status, configuration change counter' },
                  { task: 'Multi-drop Address', desc: 'Set device address (0=normal, 1-15=multidrop mode)' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '8px 0',
                    borderBottom: '1px solid var(--divider)',
                    fontSize: 13, lineHeight: 1.5,
                  }}>
                    <span style={{
                      fontWeight: 700, color: 'var(--primary)',
                      fontFamily: 'var(--font-mono)', minWidth: 160, flexShrink: 0,
                    }}>
                      {item.task}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={tipBox}>
              <strong>HART in Mining:</strong> HART communicators are essential for
              commissioning and troubleshooting instruments underground. Many mines
              use handheld communicators (like Emerson 475/375 or Beamex MC6) for
              field configuration. WirelessHART is gaining popularity for
              retrofit installations in hard-to-reach locations.
            </div>

            <div style={warningBox}>
              <strong>HART Loop Resistance:</strong> If you cannot communicate with
              a transmitter, check that there is at least 250\Ω between the
              communicator connection point and the power supply. Some PLC input
              cards have very low input impedance ({'<'}250\Ω), requiring an
              external resistor in series.
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/*  TAB 7: Troubleshooting                                          */}
        {/* ================================================================ */}
        {tab === 'trouble' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={sectionTitle}>Troubleshooting Instrument Loops</div>

            {/* Systematic Approach */}
            <div style={card}>
              <div style={subHeading}>Systematic Troubleshooting Approach</div>
              <div style={bodyText}>
                Follow these steps in order. Resist the urge to jump to conclusions.
                Most instrument faults are wiring related.
              </div>
            </div>

            {systematicApproach.map(s => (
              <div key={s.step} style={{
                ...card,
                borderLeft: '4px solid var(--primary)',
                display: 'flex',
                gap: 12,
              }}>
                <div style={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                }}>
                  {s.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                    {s.detail}
                  </div>
                  <div style={{
                    fontSize: 12, color: 'var(--primary)', fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    Tools: {s.tools}
                  </div>
                </div>
              </div>
            ))}

            {/* Common Faults */}
            <div style={{ ...sectionTitle, marginTop: 8 }}>Common Faults & Remedies</div>

            {commonFaults.map(f => (
              <div key={f.fault} style={cardHL(f.color)}>
                <div style={{ fontSize: 15, fontWeight: 700, color: f.color, marginBottom: 6 }}>
                  {f.fault}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
                  <strong style={{ color: 'var(--text)' }}>Symptoms:</strong> {f.symptoms}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
                  <strong style={{ color: 'var(--text)' }}>Possible Causes:</strong> {f.possibleCauses}
                </div>
                <div style={tipBox}>
                  <strong>Remedy:</strong> {f.remedy}
                </div>
              </div>
            ))}

            {/* Loop Calibrator */}
            <div style={{ ...card, border: '2px solid var(--primary)' }}>
              <div style={{ ...subHeading, color: 'var(--primary)' }}>
                Using a Loop Calibrator
              </div>
              <div style={bodyText}>
                A loop calibrator (e.g., Fluke 789, Beamex MC6) is the
                primary tool for instrument loop testing. It can:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {[
                  { mode: 'Source mA', desc: 'Generate a known current to test PLC/DCS input and scaling. Disconnect transmitter and connect calibrator in its place.' },
                  { mode: 'Simulate mA', desc: 'Same as source but uses the loop power supply. Calibrator sinks current from the 24V supply.' },
                  { mode: 'Read mA', desc: 'Measure actual loop current (in series). Compare to PLC reading to verify input card.' },
                  { mode: 'Source V', desc: 'Generate voltage signal (0-10V) for testing voltage inputs.' },
                  { mode: 'Source TC (mV)', desc: 'Simulate thermocouple millivolts with CJC compensation for testing TC inputs.' },
                  { mode: 'Source RTD (\Ω)', desc: 'Simulate RTD resistance for testing RTD inputs. Select PT100, PT1000, etc.' },
                  { mode: 'Source Pressure', desc: 'With pressure module: apply known pressure to test pressure transmitter calibration.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '8px 0',
                    borderBottom: '1px solid var(--divider)',
                    fontSize: 13, lineHeight: 1.5,
                  }}>
                    <span style={{
                      fontWeight: 700, color: 'var(--primary)',
                      fontFamily: 'var(--font-mono)', minWidth: 130, flexShrink: 0,
                    }}>
                      {item.mode}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={warningBox}>
              <strong>Calibration Documentation:</strong> Always record
              as-found and as-left values during calibration. As-found values
              show the instrument's condition before adjustment. As-left values
              confirm proper calibration. This is required for ISO 9001, quality
              audits, and regulatory compliance in mining operations.
            </div>

            <div style={tipBox}>
              <strong>25% Step Test:</strong> When checking a 4-20 mA loop,
              apply 4.0, 8.0, 12.0, 16.0, and 20.0 mA (0%, 25%, 50%, 75%,
              100%). Verify the PLC/DCS reads correctly at each point. This
              catches both zero and span errors, and reveals any linearity
              issues.
            </div>

            {/* Calibration Procedure */}
            <div style={{ ...card, border: '2px solid #22c55e' }}>
              <div style={{ ...subHeading, color: '#22c55e' }}>
                5-Point Calibration Procedure
              </div>
              <div style={{ ...bodyText, marginBottom: 10 }}>
                Standard procedure for calibrating a 4-20 mA transmitter. Follow your
                site-specific procedures and document all as-found/as-left values.
              </div>
              {calibrationProcedure.map(s => (
                <div key={s.step} style={{
                  display: 'flex', gap: 10, padding: '8px 0',
                  borderBottom: '1px solid var(--divider)',
                  fontSize: 13, lineHeight: 1.5,
                }}>
                  <span style={{
                    minWidth: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 12, flexShrink: 0,
                  }}>
                    {s.step}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{s.action}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tolerance Table */}
            <div style={card}>
              <div style={subHeading}>Typical Calibration Tolerances</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 350 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Instrument Type</th>
                      <th style={tableHeader}>Typical Tolerance</th>
                      <th style={tableHeader}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Pressure transmitter', '\±0.1% of span', '0.04 mA on a 16 mA span'],
                      ['Temperature transmitter', '\±0.25% of span', 'Includes sensor error'],
                      ['DP flow transmitter', '\±0.1% of span', 'Before square root extraction'],
                      ['Level transmitter', '\±0.2% of span', 'Varies with technology'],
                      ['pH analyzer', '\±0.1 pH', 'Buffer calibration required'],
                      ['Safety instrument (SIS)', '\±0.5% of span', 'Per SIL requirements, tighter may apply'],
                    ].map(([type, tol, notes], i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, fontWeight: 600 }}>{type}</td>
                        <td style={tableCellMono}>{tol}</td>
                        <td style={{ ...tableCell, fontSize: 12 }}>{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Essential Test Equipment */}
            <div style={card}>
              <div style={subHeading}>Essential Instrumentation Test Equipment</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { tool: 'Fluke 789 ProcessMeter', use: 'Combined DMM and loop calibrator. Source, simulate, and measure mA. Essential for every instrument technician.' },
                  { tool: 'Beamex MC6', use: 'Multifunction documenting calibrator. Pressure, temperature, mA, V, RTD, TC simulation with automatic documentation.' },
                  { tool: 'Fluke 87V TRMS DMM', use: 'General purpose multimeter for voltage, current, resistance, frequency measurements.' },
                  { tool: 'Emerson 475 HART Communicator', use: 'Configure and diagnose HART transmitters in the field. View diagnostics, trim, and change parameters.' },
                  { tool: 'Fluke 1587 Insulation Tester', use: 'Megger for checking cable insulation resistance. Essential for finding ground faults and moisture.' },
                  { tool: 'Druck DPI 620G', use: 'Advanced pressure calibrator with HART communication. Generates and measures pressure with documenting capability.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '8px 0',
                    borderBottom: '1px solid var(--divider)',
                    fontSize: 13, lineHeight: 1.5,
                  }}>
                    <span style={{
                      fontWeight: 700, color: 'var(--primary)',
                      fontFamily: 'var(--font-mono)', minWidth: 140, flexShrink: 0,
                      fontSize: 12,
                    }}>
                      {item.tool}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.use}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={warningBox}>
              <strong>Mining Calibration Requirements:</strong> Ontario Regulation 854
              requires that safety-critical instruments (gas detectors, ground fault relays,
              ventilation monitors) be tested and calibrated at prescribed intervals. All
              calibration records must be maintained on site and available for inspection
              by Ministry of Labour inspectors.
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/*  TAB 8: Mining Instrumentation                                   */}
        {/* ================================================================ */}
        {tab === 'mining' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={sectionTitle}>Mining Instrumentation</div>

            {/* Sub-tab toggle */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={miningSubTab === 'gas' ? pillActive : pillBase}
                onClick={() => setMiningSubTab('gas')}
              >
                Gas Detection
              </button>
              <button
                style={miningSubTab === 'instruments' ? pillActive : pillBase}
                onClick={() => setMiningSubTab('instruments')}
              >
                Mine Instruments
              </button>
            </div>

            {/* Gas Detection */}
            {miningSubTab === 'gas' && (
              <>
                <div style={card}>
                  <div style={bodyText}>
                    Gas detection is critical in underground mining. Ontario
                    Regulation 854 (Mines and Mining Plants) mandates gas
                    testing before entry and continuous monitoring in certain
                    areas. All underground mine workers must carry a personal
                    multi-gas detector capable of detecting O2, CO, H2S, and
                    combustible gases.
                  </div>
                </div>

                {gasDetectors.map(g => (
                  <div key={g.formula} style={cardHL(g.color)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                        {g.gas}
                      </div>
                      <span style={tagPill(g.color + '22', g.color)}>
                        {g.formula}
                      </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
                        <thead>
                          <tr>
                            <th style={{ ...tableHeader, fontSize: 10 }}>TWA</th>
                            <th style={{ ...tableHeader, fontSize: 10 }}>STEL</th>
                            <th style={{ ...tableHeader, fontSize: 10 }}>IDLH</th>
                            <th style={{ ...tableHeader, fontSize: 10 }}>Alarm Low</th>
                            <th style={{ ...tableHeader, fontSize: 10 }}>Alarm High</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={tableCellMono}>{g.twa}</td>
                            <td style={tableCellMono}>{g.stel}</td>
                            <td style={{ ...tableCellMono, color: '#ef4444' }}>{g.idlh}</td>
                            <td style={tableCellMono}>{g.alarmLow}</td>
                            <td style={{ ...tableCellMono, color: '#ef4444' }}>{g.alarmHigh}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                      <strong>Sensor Type:</strong> {g.sensorType}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {g.notes}
                    </div>
                  </div>
                ))}

                {/* Gas Detection Terms */}
                <div style={card}>
                  <div style={subHeading}>Key Gas Detection Terms</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { term: 'TWA', def: 'Time-Weighted Average: maximum average concentration over 8-hour shift.' },
                      { term: 'STEL', def: 'Short-Term Exposure Limit: maximum 15-minute average. Not more than 4 times per shift.' },
                      { term: 'IDLH', def: 'Immediately Dangerous to Life or Health: concentration requiring immediate evacuation.' },
                      { term: 'LEL', def: 'Lower Explosive Limit: minimum concentration in air that can ignite. 100% LEL = explosive.' },
                      { term: '%LEL', def: 'Percentage of the Lower Explosive Limit. Alarm at 10-25% LEL. Evacuate at 50% LEL.' },
                      { term: 'CJC', def: 'Cold Junction Compensation: correction applied for thermocouple reference temperature.' },
                      { term: 'Bump Test', def: 'Expose detector to known gas to verify sensors respond. Do before each use.' },
                      { term: 'Calibration', def: 'Expose to certified span gas and adjust reading. Required per manufacturer schedule.' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 10, padding: '8px 0',
                        borderBottom: '1px solid var(--divider)',
                        fontSize: 13, lineHeight: 1.5,
                      }}>
                        <span style={{
                          fontWeight: 700, color: 'var(--primary)',
                          fontFamily: 'var(--font-mono)', minWidth: 90, flexShrink: 0,
                        }}>
                          {item.term}
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.def}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={warningBox}>
                  <strong>O. Reg. 854 s.22.1:</strong> Before entering any underground
                  workplace, a competent worker must test the atmosphere for oxygen
                  content, combustible gas, and any other hazardous gas likely to be
                  present. Power must be de-energized if methane exceeds 1.25% (25% LEL)
                  and personnel withdrawn at 2.5% (50% LEL).
                </div>

                <div style={tipBox}>
                  <strong>Bump Test vs Calibration:</strong> A bump test is a quick
                  functional check (expose to gas, verify alarm triggers). It does NOT
                  adjust the reading. Calibration uses certified span gas and adjusts
                  the sensor reading to match. Both are required but on different
                  schedules (bump test: daily/before use; calibration: per manufacturer,
                  typically monthly or after a failed bump test).
                </div>
              </>
            )}

            {/* Mine Instruments */}
            {miningSubTab === 'instruments' && (
              <>
                <div style={card}>
                  <div style={bodyText}>
                    Underground mines rely on a wide array of instrumentation
                    for safety and process control. Ontario Regulation 854
                    (Mines and Mining Plants) mandates specific monitoring
                    requirements. These instruments feed into SCADA systems
                    on surface for centralized monitoring.
                  </div>
                </div>

                {miningInstruments.map(m => (
                  <div key={m.name} style={cardHL(m.color)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                        {m.name}
                      </div>
                      <span style={tagPill(m.color + '22', m.color)}>
                        {m.parameter}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
                      {m.description}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                      <strong>Location:</strong> {m.location}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 4 }}>
                      <strong>Signal:</strong> {m.signal}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: 'var(--primary)',
                      fontWeight: 600,
                      background: 'var(--input-bg)',
                      borderRadius: 4,
                      padding: '6px 10px',
                      marginTop: 4,
                    }}>
                      {m.regulation}
                    </div>
                  </div>
                ))}

                {/* Ventilation Monitoring */}
                <div style={{ ...card, border: '2px solid #06b6d4' }}>
                  <div style={{ ...subHeading, color: '#06b6d4' }}>
                    Ventilation Monitoring System
                  </div>
                  <div style={bodyText}>
                    Ontario mines must maintain adequate ventilation per O. Reg. 854
                    Part VII. A ventilation monitoring system typically includes:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {[
                      'Air velocity sensors at key locations (main airways, stopes, raises)',
                      'Differential pressure transmitters across fans and regulators',
                      'Temperature and humidity sensors throughout the mine',
                      'Gas detection sensors (CO, NO2, H2S, CH4, O2) at strategic points',
                      'Fan status monitoring (running/stopped, vibration, bearing temperature)',
                      'Ventilation door position monitoring (open/closed limit switches)',
                      'Surface SCADA display with alarm management and trending',
                      'Emergency ventilation reversal capability with monitoring',
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 8, fontSize: 13,
                        color: 'var(--text-secondary)', lineHeight: 1.5,
                        padding: '4px 0',
                      }}>
                        <span style={{ color: '#06b6d4', fontWeight: 700, flexShrink: 0 }}>
                          {'\•'}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ground Fault Monitoring */}
                <div style={{ ...card, border: '2px solid #ef4444' }}>
                  <div style={{ ...subHeading, color: '#ef4444' }}>
                    Ground Fault Monitoring (GFM)
                  </div>
                  <div style={bodyText}>
                    Ground fault protection is mandatory for all underground mine
                    electrical installations (O. Reg. 854 s.153). The system must:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {[
                      'Detect leakage current from phase conductors to ground',
                      'Trip circuits operating above 300V at 100 mA or less ground fault',
                      'Trip within 200 milliseconds of fault detection',
                      'Be tested monthly with records maintained',
                      'Use zero-sequence CT (core balance) sensing method',
                      'Ground check monitors (GCM) required on medium voltage trailing cables',
                      'Pilot wire system monitors ground conductor continuity',
                      'Opens main contactor if equipment ground conductor breaks',
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 8, fontSize: 13,
                        color: 'var(--text-secondary)', lineHeight: 1.5,
                        padding: '4px 0',
                      }}>
                        <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>
                          {'\•'}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={warningBox}>
                  <strong>Critical Safety:</strong> All underground mine electrical
                  installations must have ground fault protection. A ground fault in a
                  wet underground environment can be lethal. Ground fault relays must be
                  tested monthly per O. Reg. 854 s.153(2). Never bypass or defeat ground
                  fault protection under any circumstances.
                </div>
              </>
            )}
          </div>
        )}

        {/* ========== Footer Reference ========== */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong>{' '}
          ISA S5.1 (Instrumentation Symbols & Identification),
          ISA S51.1 (Process Instrumentation Terminology),
          IEC 62591 (WirelessHART),
          HART Communication Foundation,
          Ontario Regulation 854 (Mines and Mining Plants),
          CEC Section 18 (Hazardous Locations),
          CSA C96.1 (Thermocouple Color Codes),
          IEC 60751 (RTD Standards),
          NAMUR NE43 (Signal Level for Fault Information),
          Ontario OHSA (Occupational Health & Safety Act)
        </div>

      </div>
    </PageWrapper>
  )
}
