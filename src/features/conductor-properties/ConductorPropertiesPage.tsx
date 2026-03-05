import { useState, useMemo } from 'react'
import PageWrapper from '../../layout/PageWrapper'

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────────── */

type TabId =
  | 'gauge'
  | 'resistance'
  | 'materials'
  | 'insulation'
  | 'derating'
  | 'selection'

interface TabDef {
  id: TabId
  label: string
  shortLabel: string
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS  (tabs)
   ───────────────────────────────────────────────────────────────────────────── */

const TABS: TabDef[] = [
  { id: 'gauge', label: 'Wire Gauge Reference', shortLabel: 'Gauge' },
  { id: 'resistance', label: 'Resistance & Reactance', shortLabel: 'R & X' },
  { id: 'materials', label: 'Conductor Materials', shortLabel: 'Materials' },
  { id: 'insulation', label: 'Insulation Types', shortLabel: 'Insulation' },
  { id: 'derating', label: 'Temperature Derating', shortLabel: 'Derating' },
  { id: 'selection', label: 'Selection Guide', shortLabel: 'Selection' },
]

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED INLINE-STYLE HELPERS
   ───────────────────────────────────────────────────────────────────────────── */

const sectionCard: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--divider)',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--primary)',
  marginBottom: 4,
}

const bodyText: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
}

const thStyle: React.CSSProperties = {
  background: 'var(--surface)',
  color: 'var(--primary)',
  padding: '10px 8px',
  textAlign: 'left',
  borderBottom: '2px solid var(--divider)',
  whiteSpace: 'nowrap',
  fontWeight: 700,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  position: 'sticky',
  top: 0,
  zIndex: 2,
}

const tdStyle: React.CSSProperties = {
  padding: '7px 8px',
  borderBottom: '1px solid var(--divider)',
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text)',
  whiteSpace: 'nowrap',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: 'var(--font-mono)',
  minHeight: 'var(--touch-min)',
  boxSizing: 'border-box',
  outline: 'none',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23a0a0b0'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
}

const resultBox: React.CSSProperties = {
  background: 'var(--input-bg)',
  border: '1px solid var(--primary)',
  borderRadius: 'var(--radius-sm)',
  padding: '14px 16px',
  textAlign: 'center',
}

const resultValue: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: 'var(--primary)',
  fontFamily: 'var(--font-mono)',
}

const resultLabel: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-secondary)',
  marginTop: 2,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
}

const formulaBox: React.CSSProperties = {
  background: 'var(--input-bg)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
}

const badgeStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  fontSize: 10,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 'var(--radius-sm)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  background: color === 'gold' ? 'var(--primary-dim)' : color === 'green' ? '#1b5e20' : color === 'red' ? '#b71c1c' : '#1a237e',
  color: color === 'gold' ? 'var(--primary)' : '#fff',
})

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL TABLE WRAPPER
   ───────────────────────────────────────────────────────────────────────────── */

function ScrollTable({ children, minWidth = 700 }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)', border: '1px solid var(--divider)' }}>
      <table
        style={{
          width: '100%',
          minWidth,
          borderCollapse: 'collapse',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {children}
      </table>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — WIRE GAUGE TABLE
   ───────────────────────────────────────────────────────────────────────────── */

interface GaugeRow {
  size: string
  diamMM: number
  areaMM2: number
  dcResCu20: number
  dcResAl20: number
  weightCuKgKm: number
  weightAlKgKm: number
  ampFreeAir75: number
  ampFreeAir90: number
}

const gaugeData: GaugeRow[] = [
  { size: '18 AWG', diamMM: 1.02, areaMM2: 0.823, dcResCu20: 21.3, dcResAl20: 35.0, weightCuKgKm: 7.3, weightAlKgKm: 2.5, ampFreeAir75: 14, ampFreeAir90: 18 },
  { size: '16 AWG', diamMM: 1.29, areaMM2: 1.31, dcResCu20: 13.4, dcResAl20: 22.0, weightCuKgKm: 11.6, weightAlKgKm: 3.9, ampFreeAir75: 18, ampFreeAir90: 24 },
  { size: '14 AWG', diamMM: 1.63, areaMM2: 2.08, dcResCu20: 8.44, dcResAl20: 13.9, weightCuKgKm: 18.5, weightAlKgKm: 6.3, ampFreeAir75: 25, ampFreeAir90: 30 },
  { size: '12 AWG', diamMM: 2.05, areaMM2: 3.31, dcResCu20: 5.31, dcResAl20: 8.72, weightCuKgKm: 29.4, weightAlKgKm: 10.0, ampFreeAir75: 30, ampFreeAir90: 40 },
  { size: '10 AWG', diamMM: 2.59, areaMM2: 5.26, dcResCu20: 3.34, dcResAl20: 5.49, weightCuKgKm: 46.8, weightAlKgKm: 15.9, ampFreeAir75: 40, ampFreeAir90: 55 },
  { size: '8 AWG', diamMM: 3.26, areaMM2: 8.37, dcResCu20: 2.10, dcResAl20: 3.45, weightCuKgKm: 74.4, weightAlKgKm: 25.3, ampFreeAir75: 60, ampFreeAir90: 70 },
  { size: '6 AWG', diamMM: 4.11, areaMM2: 13.3, dcResCu20: 1.32, dcResAl20: 2.17, weightCuKgKm: 118, weightAlKgKm: 40.1, ampFreeAir75: 80, ampFreeAir90: 95 },
  { size: '4 AWG', diamMM: 5.19, areaMM2: 21.2, dcResCu20: 0.831, dcResAl20: 1.36, weightCuKgKm: 188, weightAlKgKm: 63.8, ampFreeAir75: 105, ampFreeAir90: 120 },
  { size: '3 AWG', diamMM: 5.83, areaMM2: 26.7, dcResCu20: 0.659, dcResAl20: 1.08, weightCuKgKm: 237, weightAlKgKm: 80.5, ampFreeAir75: 120, ampFreeAir90: 140 },
  { size: '2 AWG', diamMM: 6.54, areaMM2: 33.6, dcResCu20: 0.523, dcResAl20: 0.859, weightCuKgKm: 299, weightAlKgKm: 101, ampFreeAir75: 140, ampFreeAir90: 160 },
  { size: '1 AWG', diamMM: 7.35, areaMM2: 42.4, dcResCu20: 0.415, dcResAl20: 0.681, weightCuKgKm: 376, weightAlKgKm: 128, ampFreeAir75: 165, ampFreeAir90: 185 },
  { size: '1/0 AWG', diamMM: 8.25, areaMM2: 53.5, dcResCu20: 0.329, dcResAl20: 0.540, weightCuKgKm: 475, weightAlKgKm: 161, ampFreeAir75: 195, ampFreeAir90: 215 },
  { size: '2/0 AWG', diamMM: 9.27, areaMM2: 67.4, dcResCu20: 0.261, dcResAl20: 0.429, weightCuKgKm: 599, weightAlKgKm: 203, ampFreeAir75: 225, ampFreeAir90: 250 },
  { size: '3/0 AWG', diamMM: 10.40, areaMM2: 85.0, dcResCu20: 0.207, dcResAl20: 0.340, weightCuKgKm: 755, weightAlKgKm: 256, ampFreeAir75: 260, ampFreeAir90: 290 },
  { size: '4/0 AWG', diamMM: 11.68, areaMM2: 107, dcResCu20: 0.164, dcResAl20: 0.269, weightCuKgKm: 953, weightAlKgKm: 323, ampFreeAir75: 300, ampFreeAir90: 340 },
  { size: '250 kcmil', diamMM: 12.70, areaMM2: 127, dcResCu20: 0.139, dcResAl20: 0.228, weightCuKgKm: 1125, weightAlKgKm: 382, ampFreeAir75: 340, ampFreeAir90: 375 },
  { size: '300 kcmil', diamMM: 13.91, areaMM2: 152, dcResCu20: 0.116, dcResAl20: 0.190, weightCuKgKm: 1350, weightAlKgKm: 459, ampFreeAir75: 375, ampFreeAir90: 420 },
  { size: '350 kcmil', diamMM: 15.03, areaMM2: 177, dcResCu20: 0.0991, dcResAl20: 0.163, weightCuKgKm: 1575, weightAlKgKm: 535, ampFreeAir75: 420, ampFreeAir90: 455 },
  { size: '400 kcmil', diamMM: 16.06, areaMM2: 203, dcResCu20: 0.0868, dcResAl20: 0.143, weightCuKgKm: 1800, weightAlKgKm: 611, ampFreeAir75: 455, ampFreeAir90: 495 },
  { size: '500 kcmil', diamMM: 17.96, areaMM2: 253, dcResCu20: 0.0694, dcResAl20: 0.114, weightCuKgKm: 2250, weightAlKgKm: 764, ampFreeAir75: 515, ampFreeAir90: 570 },
  { size: '600 kcmil', diamMM: 19.67, areaMM2: 304, dcResCu20: 0.0578, dcResAl20: 0.0950, weightCuKgKm: 2700, weightAlKgKm: 917, ampFreeAir75: 575, ampFreeAir90: 640 },
  { size: '750 kcmil', diamMM: 22.00, areaMM2: 380, dcResCu20: 0.0463, dcResAl20: 0.0760, weightCuKgKm: 3375, weightAlKgKm: 1146, ampFreeAir75: 655, ampFreeAir90: 730 },
]

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — METRIC mm2 TO AWG CONVERSION
   ───────────────────────────────────────────────────────────────────────────── */

interface MetricConversion {
  metricMM2: number
  nearestAWG: string
  awgMM2: number
  notes: string
}

const metricConversions: MetricConversion[] = [
  { metricMM2: 0.5, nearestAWG: '20 AWG', awgMM2: 0.518, notes: 'Common metric control wire' },
  { metricMM2: 0.75, nearestAWG: '18 AWG', awgMM2: 0.823, notes: 'Thermostat, signal wire' },
  { metricMM2: 1.0, nearestAWG: '18 AWG', awgMM2: 0.823, notes: 'European lighting standard' },
  { metricMM2: 1.5, nearestAWG: '16 AWG', awgMM2: 1.31, notes: 'IEC lighting circuits (10A)' },
  { metricMM2: 2.5, nearestAWG: '14/12 AWG', awgMM2: 2.08, notes: 'IEC power circuits (16A)' },
  { metricMM2: 4.0, nearestAWG: '12/10 AWG', awgMM2: 3.31, notes: 'IEC power circuits (20A)' },
  { metricMM2: 6.0, nearestAWG: '10 AWG', awgMM2: 5.26, notes: 'Stove/dryer circuits (IEC)' },
  { metricMM2: 10.0, nearestAWG: '8 AWG', awgMM2: 8.37, notes: 'Sub-panels, feeders (IEC)' },
  { metricMM2: 16.0, nearestAWG: '6 AWG', awgMM2: 13.3, notes: 'Larger feeders' },
  { metricMM2: 25.0, nearestAWG: '4 AWG', awgMM2: 21.2, notes: 'Service entrance' },
  { metricMM2: 35.0, nearestAWG: '2 AWG', awgMM2: 33.6, notes: 'Large feeders' },
  { metricMM2: 50.0, nearestAWG: '1/0 AWG', awgMM2: 53.5, notes: 'Industrial feeders' },
  { metricMM2: 70.0, nearestAWG: '2/0 AWG', awgMM2: 67.4, notes: 'Large industrial' },
  { metricMM2: 95.0, nearestAWG: '3/0 AWG', awgMM2: 85.0, notes: 'High-current feeders' },
  { metricMM2: 120.0, nearestAWG: '4/0 AWG', awgMM2: 107, notes: 'Service entrance' },
  { metricMM2: 150.0, nearestAWG: '300 kcmil', awgMM2: 152, notes: 'Parallel runs' },
  { metricMM2: 185.0, nearestAWG: '350 kcmil', awgMM2: 177, notes: 'Large parallel feeders' },
  { metricMM2: 240.0, nearestAWG: '500 kcmil', awgMM2: 253, notes: 'Heavy industrial' },
]

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — AC RESISTANCE & REACTANCE (CEC Table 9 style)
   ───────────────────────────────────────────────────────────────────────────── */

interface ACResRow {
  size: string
  dcResCu: number
  acResCu: number
  skinFactor: number
  xlPVC: number
  xlSteel: number
}

const acResData: ACResRow[] = [
  { size: '14 AWG', dcResCu: 8.44, acResCu: 8.44, skinFactor: 1.000, xlPVC: 0.190, xlSteel: 0.240 },
  { size: '12 AWG', dcResCu: 5.31, acResCu: 5.31, skinFactor: 1.000, xlPVC: 0.177, xlSteel: 0.223 },
  { size: '10 AWG', dcResCu: 3.34, acResCu: 3.34, skinFactor: 1.000, xlPVC: 0.164, xlSteel: 0.207 },
  { size: '8 AWG', dcResCu: 2.10, acResCu: 2.10, skinFactor: 1.000, xlPVC: 0.151, xlSteel: 0.190 },
  { size: '6 AWG', dcResCu: 1.32, acResCu: 1.32, skinFactor: 1.001, xlPVC: 0.141, xlSteel: 0.177 },
  { size: '4 AWG', dcResCu: 0.831, acResCu: 0.832, skinFactor: 1.001, xlPVC: 0.131, xlSteel: 0.167 },
  { size: '3 AWG', dcResCu: 0.659, acResCu: 0.660, skinFactor: 1.001, xlPVC: 0.128, xlSteel: 0.164 },
  { size: '2 AWG', dcResCu: 0.523, acResCu: 0.524, skinFactor: 1.002, xlPVC: 0.125, xlSteel: 0.157 },
  { size: '1 AWG', dcResCu: 0.415, acResCu: 0.416, skinFactor: 1.003, xlPVC: 0.121, xlSteel: 0.151 },
  { size: '1/0 AWG', dcResCu: 0.329, acResCu: 0.331, skinFactor: 1.005, xlPVC: 0.118, xlSteel: 0.148 },
  { size: '2/0 AWG', dcResCu: 0.261, acResCu: 0.263, skinFactor: 1.008, xlPVC: 0.115, xlSteel: 0.144 },
  { size: '3/0 AWG', dcResCu: 0.207, acResCu: 0.210, skinFactor: 1.013, xlPVC: 0.112, xlSteel: 0.141 },
  { size: '4/0 AWG', dcResCu: 0.164, acResCu: 0.167, skinFactor: 1.020, xlPVC: 0.108, xlSteel: 0.135 },
  { size: '250 kcmil', dcResCu: 0.139, acResCu: 0.143, skinFactor: 1.026, xlPVC: 0.105, xlSteel: 0.131 },
  { size: '300 kcmil', dcResCu: 0.116, acResCu: 0.120, skinFactor: 1.034, xlPVC: 0.102, xlSteel: 0.128 },
  { size: '350 kcmil', dcResCu: 0.0991, acResCu: 0.104, skinFactor: 1.043, xlPVC: 0.100, xlSteel: 0.125 },
  { size: '400 kcmil', dcResCu: 0.0868, acResCu: 0.0919, skinFactor: 1.059, xlPVC: 0.098, xlSteel: 0.122 },
  { size: '500 kcmil', dcResCu: 0.0694, acResCu: 0.0753, skinFactor: 1.085, xlPVC: 0.095, xlSteel: 0.118 },
  { size: '600 kcmil', dcResCu: 0.0578, acResCu: 0.0641, skinFactor: 1.109, xlPVC: 0.092, xlSteel: 0.114 },
  { size: '750 kcmil', dcResCu: 0.0463, acResCu: 0.0530, skinFactor: 1.145, xlPVC: 0.088, xlSteel: 0.109 },
]

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — INSULATION TYPES
   ───────────────────────────────────────────────────────────────────────────── */

interface InsulationType {
  name: string
  tempRating: string
  voltageRating: string
  jacket: string
  wetDry: string
  cecRef: string
  typicalUse: string
  notes: string
}

const insulationTypes: InsulationType[] = [
  { name: 'TW', tempRating: '60\°C', voltageRating: '600V', jacket: 'PVC (thermoplastic)', wetDry: 'Wet & Dry', cecRef: 'CEC Table 19', typicalUse: 'General building wire in conduit; older installations', notes: 'Lowest temperature rating. Being phased out in favor of higher-rated insulations. Ampacity limited by 60\°C column.' },
  { name: 'TWU', tempRating: '60\°C (wet)', voltageRating: '600V', jacket: 'PVC with moisture-resistant compounds', wetDry: 'Wet & Dry, Underground', cecRef: 'CEC Table 19', typicalUse: 'Underground residential services, direct burial', notes: 'Moisture-resistant version of TW. Suitable for direct burial. Must use 60\°C ampacity column.' },
  { name: 'RW90', tempRating: '90\°C', voltageRating: '600V', jacket: 'XLPE (cross-linked polyethylene)', wetDry: 'Wet & Dry', cecRef: 'CEC Table 19, Rule 4-004', typicalUse: 'Primary single-conductor building wire for conduit/raceway in commercial and industrial', notes: 'Most common single-conductor wire for new installations. XLPE provides excellent moisture and thermal resistance. 90\°C rating in both wet and dry locations.' },
  { name: 'RWU90', tempRating: '90\°C', voltageRating: '600V', jacket: 'XLPE with UV-resistant jacket', wetDry: 'Wet, Dry, Underground', cecRef: 'CEC Table 19', typicalUse: 'Underground single-conductor runs, direct burial', notes: 'Underground-rated version of RW90. Suitable for direct burial without conduit. XLPE insulation resists soil chemicals and moisture.' },
  { name: 'T90 Nylon', tempRating: '90\°C (dry)', voltageRating: '600V', jacket: 'PVC with nylon outer sheath', wetDry: 'Dry only (75\°C wet as TWN75)', cecRef: 'CEC Table 19, Rule 4-004', typicalUse: 'Building wire in conduit, dry commercial/industrial applications', notes: 'The nylon jacket adds mechanical protection and allows easier pulling through conduit. 90\°C in dry, derated to 75\°C in wet as TWN75. Lower cost than XLPE.' },
  { name: 'NMD90', tempRating: '90\°C (dry)', voltageRating: '300V', jacket: 'PVC outer jacket', wetDry: 'Dry only', cecRef: 'CEC Rule 4-004, 12-100 to 12-120', typicalUse: 'Residential branch circuits, lighting, receptacles. Only in concealed locations in frame construction.', notes: 'Must be concealed (walls, ceilings). Not for exposed runs, wet locations, or commercial/industrial. Ampacity limited by 90\°C column but derated for bundling in studs.' },
  { name: 'TECK90', tempRating: '90\°C', voltageRating: '600V / 1000V', jacket: 'PVC over interlocking aluminum armour', wetDry: 'Wet & Dry', cecRef: 'CEC Rule 12-600 to 12-618, CSA C22.2 No. 131', typicalUse: 'Ontario mines, industrial plants, cable tray, direct burial, exposed runs', notes: 'Workhorse cable for mining and heavy industrial. Armour provides mechanical protection and serves as bonding conductor with proper TECK connectors. Available 2C, 3C, 4C+G.' },
  { name: 'AC90', tempRating: '90\°C', voltageRating: '600V', jacket: 'Interlocking aluminum armour (no outer jacket)', wetDry: 'Dry only', cecRef: 'CEC Rule 12-400 to 12-414', typicalUse: 'Commercial branch circuits and feeders in dry locations', notes: 'No PVC outer jacket, so not suitable for wet locations. Armour is bonding conductor. Commonly called BX. Lower cost than TECK90 for dry installations.' },
  { name: 'ACWU90', tempRating: '90\°C', voltageRating: '600V', jacket: 'Interlocking aluminum armour with PVC outer jacket', wetDry: 'Wet & Dry', cecRef: 'CEC Rule 12-400 to 12-414', typicalUse: 'Outdoor and wet commercial/industrial installations, direct burial', notes: 'AC90 plus moisture barrier and PVC jacket for wet locations. Good alternative to TECK90 where 1000V rating is not needed.' },
  { name: 'SHD-GC', tempRating: '90\°C', voltageRating: '5kV to 25kV', jacket: 'Heavy-duty rubber (CPE or EPDM)', wetDry: 'Mining trailing cable', cecRef: 'CSA C22.2 No. 96, O.Reg 854, CEC s.76', typicalUse: 'Trailing cable for large mobile mining equipment (draglines, shovels, continuous miners)', notes: 'Each conductor individually shielded. Ground check conductor monitors grounding integrity. Heavy rubber jacket for flexibility and abrasion resistance.' },
  { name: 'DLO', tempRating: '90\°C (wet), 125\°C (dry)', voltageRating: '600V / 2000V', jacket: 'EPR/EPDM rubber insulation with CPE jacket', wetDry: 'Wet & Dry', cecRef: 'CSA C22.2 No. 96', typicalUse: 'Mining power connections, locomotive cables, welding leads, high-temp environments', notes: 'Diesel Locomotive cable. Extra-flexible tinned copper. Excellent for high-temperature applications. Common in mine substations and switchgear connections.' },
  { name: 'XHHW', tempRating: '90\°C (dry), 75\°C (wet)', voltageRating: '600V', jacket: 'XLPE (cross-linked polyethylene)', wetDry: 'Wet & Dry (at different ratings)', cecRef: 'CEC Table 19', typicalUse: 'Building wire alternative to RW90 in commercial/industrial', notes: 'Similar to RW90 but rated 75\°C in wet locations vs 90\°C. May be slightly less expensive. Check ampacity column for wet vs dry.' },
  { name: 'RPV90', tempRating: '90\°C', voltageRating: '600V / 1000V / 2000V', jacket: 'XLPE with UV-resistant jacket, sunlight resistant', wetDry: 'Wet & Dry, Outdoor exposed', cecRef: 'CEC Rule 64-060, CSA C22.2 No. 271', typicalUse: 'Solar photovoltaic installations; DC and AC circuits in solar arrays', notes: 'Specifically designed for solar PV systems. UV resistant, sunlight resistant. Available in 1000V and 2000V DC ratings. Must be used with PV-rated connectors (MC4 etc).' },
]

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — CEC TABLE 5A TEMPERATURE CORRECTION FACTORS
   ───────────────────────────────────────────────────────────────────────────── */

interface TempCorrRow {
  ambientRange: string
  ambientMin: number
  ambientMax: number
  factor60: number | null
  factor75: number | null
  factor90: number | null
}

const tempCorrData: TempCorrRow[] = [
  { ambientRange: '10\°C or less', ambientMin: -40, ambientMax: 10, factor60: 1.29, factor75: 1.20, factor90: 1.15 },
  { ambientRange: '11\–20\°C', ambientMin: 11, ambientMax: 20, factor60: 1.22, factor75: 1.15, factor90: 1.12 },
  { ambientRange: '21\–25\°C', ambientMin: 21, ambientMax: 25, factor60: 1.15, factor75: 1.11, factor90: 1.08 },
  { ambientRange: '26\–30\°C', ambientMin: 26, ambientMax: 30, factor60: 1.00, factor75: 1.00, factor90: 1.00 },
  { ambientRange: '31\–35\°C', ambientMin: 31, ambientMax: 35, factor60: 0.82, factor75: 0.87, factor90: 0.90 },
  { ambientRange: '36\–40\°C', ambientMin: 36, ambientMax: 40, factor60: 0.71, factor75: 0.75, factor90: 0.82 },
  { ambientRange: '41\–45\°C', ambientMin: 41, ambientMax: 45, factor60: 0.58, factor75: 0.62, factor90: 0.71 },
  { ambientRange: '46\–50\°C', ambientMin: 46, ambientMax: 50, factor60: null, factor75: 0.46, factor90: 0.58 },
  { ambientRange: '51\–55\°C', ambientMin: 51, ambientMax: 55, factor60: null, factor75: null, factor90: 0.41 },
]

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — CEC TABLE 5C BUNDLING FACTORS
   ───────────────────────────────────────────────────────────────────────────── */

interface BundleRow {
  range: string
  min: number
  max: number
  factor: number
}

const bundleData: BundleRow[] = [
  { range: '1\–3 conductors', min: 1, max: 3, factor: 1.00 },
  { range: '4\–6 conductors', min: 4, max: 6, factor: 0.80 },
  { range: '7\–9 conductors', min: 7, max: 9, factor: 0.70 },
  { range: '10\–24 conductors', min: 10, max: 24, factor: 0.70 },
  { range: '25\–42 conductors', min: 25, max: 42, factor: 0.60 },
  { range: '43 and above', min: 43, max: Infinity, factor: 0.50 },
]

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — CONDUCTOR MATERIAL PROPERTIES
   ───────────────────────────────────────────────────────────────────────────── */

interface MaterialProp {
  property: string
  copper: string
  aluminum: string
  copperClad: string
}

const materialProps: MaterialProp[] = [
  { property: 'Conductivity (% IACS)', copper: '100%', aluminum: '61%', copperClad: '80\–85%' },
  { property: 'Resistivity (Ω\·mm\²/m at 20\°C)', copper: '0.01724', aluminum: '0.02828', copperClad: '0.0206' },
  { property: 'Density (g/cm\³)', copper: '8.89', aluminum: '2.70', copperClad: '6.30' },
  { property: 'Weight (relative to copper)', copper: '1.00', aluminum: '0.30', copperClad: '0.71' },
  { property: 'Tensile Strength (MPa)', copper: '220\–400', aluminum: '75\–200', copperClad: '280\–350' },
  { property: 'Melting Point (\°C)', copper: '1083', aluminum: '660', copperClad: '~1000' },
  { property: 'Thermal Expansion (per \°C)', copper: '17 × 10\⁻\⁶', aluminum: '23 × 10\⁻\⁶', copperClad: '18 × 10\⁻\⁶' },
  { property: 'Temp Coefficient (\α at 20\°C)', copper: '0.00393', aluminum: '0.00403', copperClad: '~0.0039' },
  { property: 'Relative Cost (approx.)', copper: 'High', aluminum: 'Low (~35% of Cu)', copperClad: 'Medium' },
  { property: 'Size for Same Ampacity', copper: '1×', aluminum: '~1.6× larger', copperClad: '~1.2× larger' },
]

/* ─────────────────────────────────────────────────────────────────────────────
   HELPER — format number
   ───────────────────────────────────────────────────────────────────────────── */

function fmt(n: number, decimals = 2): string {
  if (Number.isInteger(n) && decimals <= 2) return n.toString()
  return n.toFixed(decimals)
}

/* =============================================================================
   TAB 1 — WIRE GAUGE REFERENCE
   ============================================================================= */

function WireGaugeTab() {
  const [showMetric, setShowMetric] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* AWG Table */}
      <div style={sectionCard}>
        <div style={sectionTitle}>AWG / kcmil Wire Gauge Table</div>
        <p style={bodyText}>
          Complete reference from 18 AWG to 750 kcmil. DC resistance at 20{'\°'}C, weight per kilometer,
          and free-air ampacity at 75{'\°'}C and 90{'\°'}C insulation ratings. Values based on solid
          copper and aluminum conductors per CEC and NEC standards.
        </p>
      </div>

      <ScrollTable minWidth={950}>
        <thead>
          <tr>
            <th style={thStyle}>Size</th>
            <th style={thStyle}>Dia (mm)</th>
            <th style={thStyle}>Area (mm{'\²'})</th>
            <th style={{ ...thStyle, color: '#ff9800' }}>R<sub>DC</sub> Cu ({'Ω'}/km)</th>
            <th style={{ ...thStyle, color: '#90caf9' }}>R<sub>DC</sub> Al ({'Ω'}/km)</th>
            <th style={thStyle}>Wt Cu (kg/km)</th>
            <th style={thStyle}>Wt Al (kg/km)</th>
            <th style={{ ...thStyle, color: 'var(--primary)' }}>Amps 75{'\°'}C</th>
            <th style={{ ...thStyle, color: '#4caf50' }}>Amps 90{'\°'}C</th>
          </tr>
        </thead>
        <tbody>
          {gaugeData.map((r, i) => (
            <tr key={r.size} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
              <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--text)' }}>{r.size}</td>
              <td style={tdStyle}>{fmt(r.diamMM)}</td>
              <td style={tdStyle}>{r.areaMM2 >= 100 ? r.areaMM2.toFixed(0) : fmt(r.areaMM2, 3)}</td>
              <td style={{ ...tdStyle, color: '#ff9800' }}>{r.dcResCu20 < 0.1 ? r.dcResCu20.toFixed(4) : fmt(r.dcResCu20, 3)}</td>
              <td style={{ ...tdStyle, color: '#90caf9' }}>{r.dcResAl20 < 0.1 ? r.dcResAl20.toFixed(4) : fmt(r.dcResAl20, 3)}</td>
              <td style={tdStyle}>{r.weightCuKgKm >= 100 ? r.weightCuKgKm.toFixed(0) : fmt(r.weightCuKgKm)}</td>
              <td style={tdStyle}>{r.weightAlKgKm >= 100 ? r.weightAlKgKm.toFixed(0) : fmt(r.weightAlKgKm)}</td>
              <td style={{ ...tdStyle, color: 'var(--primary)', fontWeight: 600 }}>{r.ampFreeAir75}</td>
              <td style={{ ...tdStyle, color: '#4caf50', fontWeight: 600 }}>{r.ampFreeAir90}</td>
            </tr>
          ))}
        </tbody>
      </ScrollTable>

      {/* Metric Conversion Toggle */}
      <button
        onClick={() => setShowMetric(!showMetric)}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius)',
          color: 'var(--primary)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: 'var(--touch-min)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {showMetric ? '\▼' : '\▶'} Metric mm{'\²'} to AWG Conversion Table
      </button>

      {showMetric && (
        <ScrollTable minWidth={550}>
          <thead>
            <tr>
              <th style={thStyle}>Metric (mm{'\²'})</th>
              <th style={thStyle}>Nearest AWG/kcmil</th>
              <th style={thStyle}>AWG Area (mm{'\²'})</th>
              <th style={thStyle}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {metricConversions.map((r, i) => (
              <tr key={r.metricMM2} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--primary)' }}>{r.metricMM2}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{r.nearestAWG}</td>
                <td style={tdStyle}>{r.awgMM2}</td>
                <td style={{ ...tdStyle, whiteSpace: 'normal', color: 'var(--text-secondary)' }}>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </ScrollTable>
      )}

      {/* Notes */}
      <div style={sectionCard}>
        <div style={sectionTitle}>Key Notes</div>
        <ul style={{ ...bodyText, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>AWG numbers get smaller as wire gets bigger. After 1 AWG comes 1/0, 2/0, 3/0, 4/0, then kcmil sizes.</li>
          <li>Each 3 AWG sizes doubles the cross-sectional area (e.g. 10 AWG is roughly 2x the area of 14 AWG).</li>
          <li>Each 6 AWG sizes halves the DC resistance.</li>
          <li>Free-air ampacities are higher than in-conduit because convection cooling is not restricted.</li>
          <li>kcmil = thousand circular mils. 1 kcmil = 0.5067 mm{'\²'}.</li>
          <li>In Ontario mining, TECK90 cables typically use 90{'\°'}C ampacity column per CEC Table 2 (copper).</li>
        </ul>
      </div>
    </div>
  )
}

/* =============================================================================
   TAB 2 — RESISTANCE & REACTANCE
   ============================================================================= */

function ResistanceReactanceTab() {
  const [baseRes, setBaseRes] = useState('1.32')
  const [baseTemp, setBaseTemp] = useState('20')
  const [targetTemp, setTargetTemp] = useState('75')
  const [material, setMaterial] = useState<'copper' | 'aluminum'>('copper')

  const alpha = material === 'copper' ? 0.00393 : 0.00403
  const Rbase = parseFloat(baseRes)
  const Tbase = parseFloat(baseTemp)
  const Ttarget = parseFloat(targetTemp)

  const validCalc = !isNaN(Rbase) && !isNaN(Tbase) && !isNaN(Ttarget) && Rbase > 0
  const correctedRes = validCalc ? Rbase * (1 + alpha * (Ttarget - Tbase)) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Concept Overview */}
      <div style={sectionCard}>
        <div style={sectionTitle}>AC Resistance vs DC Resistance</div>
        <p style={bodyText}>
          AC resistance is always equal to or greater than DC resistance. Two effects increase AC resistance:
        </p>
        <div style={{ ...bodyText, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <div>
            <strong style={{ color: 'var(--primary)' }}>Skin Effect:</strong> AC current tends to flow near the
            conductor surface, reducing the effective cross-section. Becomes significant above 2/0 AWG. At 750 kcmil,
            the skin effect factor is approximately 1.15, meaning AC resistance is 15% higher than DC.
          </div>
          <div>
            <strong style={{ color: 'var(--primary)' }}>Proximity Effect:</strong> Magnetic fields from adjacent
            conductors distort current distribution, further increasing effective resistance. More significant at
            close spacings and large conductor sizes. Typical values add 1-5% above skin effect alone.
          </div>
        </div>
      </div>

      {/* AC Resistance Table */}
      <div style={sectionCard}>
        <div style={sectionTitle}>AC Resistance and Reactance at 60 Hz (Copper, {'Ω'}/km at 75{'\°'}C)</div>
        <p style={bodyText}>
          Based on CEC Table 9 data. R<sub>AC</sub> includes skin effect. Reactance (X<sub>L</sub>) shown for
          PVC conduit and steel conduit at standard spacings.
        </p>
      </div>

      <ScrollTable minWidth={700}>
        <thead>
          <tr>
            <th style={thStyle}>Size</th>
            <th style={thStyle}>R<sub>DC</sub> ({'Ω'}/km)</th>
            <th style={thStyle}>R<sub>AC</sub> ({'Ω'}/km)</th>
            <th style={thStyle}>Skin Factor</th>
            <th style={thStyle}>X<sub>L</sub> PVC ({'Ω'}/km)</th>
            <th style={thStyle}>X<sub>L</sub> Steel ({'Ω'}/km)</th>
          </tr>
        </thead>
        <tbody>
          {acResData.map((r, i) => (
            <tr key={r.size} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
              <td style={{ ...tdStyle, fontWeight: 700 }}>{r.size}</td>
              <td style={tdStyle}>{r.dcResCu < 0.1 ? r.dcResCu.toFixed(4) : fmt(r.dcResCu, 3)}</td>
              <td style={{ ...tdStyle, color: 'var(--primary)' }}>{r.acResCu < 0.1 ? r.acResCu.toFixed(4) : fmt(r.acResCu, 3)}</td>
              <td style={{ ...tdStyle, color: r.skinFactor > 1.02 ? '#ff9800' : 'var(--text-secondary)' }}>{fmt(r.skinFactor, 3)}</td>
              <td style={tdStyle}>{fmt(r.xlPVC, 3)}</td>
              <td style={tdStyle}>{fmt(r.xlSteel, 3)}</td>
            </tr>
          ))}
        </tbody>
      </ScrollTable>

      {/* Temperature Resistance Calculator */}
      <div style={sectionCard}>
        <div style={sectionTitle}>Temperature Resistance Correction Calculator</div>
        <p style={bodyText}>
          Conductor resistance changes with temperature. Use this calculator to correct a known resistance at one
          temperature to a different operating temperature.
        </p>
        <div style={formulaBox}>
          R<sub>T</sub> = R<sub>base</sub> {'×'} [1 + {'\α'} {'×'} (T<sub>target</sub> - T<sub>base</sub>)]
          <br />
          Where {'\α'}<sub>Cu</sub> = 0.00393/{'\°'}C, {'\α'}<sub>Al</sub> = 0.00403/{'\°'}C (at 20{'\°'}C)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={labelStyle}>Material</div>
            <select style={selectStyle} value={material} onChange={e => setMaterial(e.target.value as 'copper' | 'aluminum')}>
              <option value="copper">Copper ({'\α'}=0.00393)</option>
              <option value="aluminum">Aluminum ({'\α'}=0.00403)</option>
            </select>
          </div>
          <div>
            <div style={labelStyle}>Base Resistance ({'Ω'}/km)</div>
            <input style={inputStyle} type="number" step="any" value={baseRes} onChange={e => setBaseRes(e.target.value)} placeholder="1.32" />
          </div>
          <div>
            <div style={labelStyle}>Base Temperature ({'\°'}C)</div>
            <input style={inputStyle} type="number" step="any" value={baseTemp} onChange={e => setBaseTemp(e.target.value)} placeholder="20" />
          </div>
          <div>
            <div style={labelStyle}>Target Temperature ({'\°'}C)</div>
            <input style={inputStyle} type="number" step="any" value={targetTemp} onChange={e => setTargetTemp(e.target.value)} placeholder="75" />
          </div>
        </div>

        {correctedRes !== null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={resultBox}>
              <div style={resultValue}>{fmt(correctedRes, 4)} {'Ω'}/km</div>
              <div style={resultLabel}>Corrected Resistance at {Ttarget}{'\°'}C</div>
            </div>
            <div style={formulaBox}>
              R = {fmt(Rbase, 4)} {'×'} [1 + {alpha} {'×'} ({Ttarget} - {Tbase})]
              {' = '}{fmt(Rbase, 4)} {'×'} {fmt(1 + alpha * (Ttarget - Tbase), 4)}
              {' = '}{fmt(correctedRes, 4)} {'Ω'}/km
            </div>
          </div>
        )}
      </div>

      {/* Notes on Reactance */}
      <div style={sectionCard}>
        <div style={sectionTitle}>Reactance Notes</div>
        <ul style={{ ...bodyText, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Reactance (X<sub>L</sub>) is inductive and depends on conductor spacing, not conductor material.</li>
          <li>Steel conduit has higher reactance than PVC because the magnetic steel increases inductance.</li>
          <li>For voltage drop calculations: V<sub>drop</sub> = I {'×'} L {'×'} (R{'\·'}cos{'\θ'} + X<sub>L</sub>{'\·'}sin{'\θ'})</li>
          <li>At unity power factor, reactance has zero contribution to voltage drop.</li>
          <li>CEC Table 9 provides impedance values for both copper and aluminum in various conduit types.</li>
          <li>For larger conductors (above 4/0), reactance becomes a more significant portion of total impedance.</li>
        </ul>
      </div>
    </div>
  )
}

/* =============================================================================
   TAB 3 — CONDUCTOR MATERIALS
   ============================================================================= */

function ConductorMaterialsTab() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Comparison Table */}
      <div style={sectionCard}>
        <div style={sectionTitle}>Copper vs Aluminum vs Copper-Clad Aluminum</div>
        <p style={bodyText}>
          Side-by-side comparison of the three main conductor materials used in electrical installations.
        </p>
      </div>

      <ScrollTable minWidth={600}>
        <thead>
          <tr>
            <th style={thStyle}>Property</th>
            <th style={{ ...thStyle, color: '#ff9800' }}>Copper</th>
            <th style={{ ...thStyle, color: '#90caf9' }}>Aluminum</th>
            <th style={{ ...thStyle, color: '#ce93d8' }}>Copper-Clad Al</th>
          </tr>
        </thead>
        <tbody>
          {materialProps.map((r, i) => (
            <tr key={r.property} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
              <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--text)', whiteSpace: 'normal', fontFamily: 'var(--font-sans)' }}>{r.property}</td>
              <td style={{ ...tdStyle, color: '#ff9800' }}>{r.copper}</td>
              <td style={{ ...tdStyle, color: '#90caf9' }}>{r.aluminum}</td>
              <td style={{ ...tdStyle, color: '#ce93d8' }}>{r.copperClad}</td>
            </tr>
          ))}
        </tbody>
      </ScrollTable>

      {/* Detail Cards */}
      {([
        {
          id: 'termination',
          title: 'Aluminum Termination Requirements',
          content: [
            'Anti-oxidant compound (e.g., Penetrox, No-Ox-Id) MUST be applied to all aluminum connections before termination.',
            'Aluminum forms an oxide layer instantly when exposed to air. This oxide is resistive and causes hot spots at connections.',
            'Wire brush or abrade the aluminum surface before applying anti-oxidant to break through existing oxide.',
            'Use only connectors rated CU/AL or AL-CU. Never use copper-only rated connectors for aluminum wire.',
            'Torque to manufacturer specifications. Under-torqued connections will loosen due to aluminum cold flow (creep).',
            'Re-torque aluminum connections after 24 hours of initial energization (thermal cycling causes settling).',
            'Never use aluminum wire smaller than 8 AWG for power circuits (CEC restriction). Most authorities prohibit AL below 6 AWG.',
            'Aluminum is not permitted for equipment bonding conductors in Ontario mining installations.',
          ],
        },
        {
          id: 'connectors',
          title: 'Compatible Connectors (CU/AL Rated)',
          content: [
            'CU/AL rated connectors are dual-rated for both copper and aluminum conductors.',
            'Mechanical set-screw connectors: Must be marked "AL-CU" or "CU-AL" on the connector body.',
            'Compression connectors: Use specific CU or AL dies and barrels; never mix.',
            'Irreversible compression (crimped) connections are preferred for aluminum in industrial applications.',
            'Split-bolt connectors: Only if specifically rated CU/AL. Apply anti-oxidant compound first.',
            'Wire nuts (Marettes): Must be rated for aluminum. Purple Marettes are AL-rated; standard ones are not.',
            'Lugs on breakers and equipment: Check rating stamp on the lug. Many are rated 75\°C CU/AL.',
            'Mining: TECK cable connectors (e.g., Thomas & Betts, Appleton) are typically CU-only. Verify before using AL TECK.',
          ],
        },
        {
          id: 'galvanic',
          title: 'Galvanic Corrosion',
          content: [
            'When copper and aluminum make direct contact in the presence of moisture, galvanic corrosion occurs.',
            'Aluminum is anodic (it corrodes). Copper is cathodic (it accelerates the aluminum corrosion).',
            'The galvanic potential between copper and aluminum is approximately 0.6V in saltwater.',
            'Prevent by: using bi-metallic connectors, anti-oxidant compound, or separating metals with a dielectric barrier.',
            'In outdoor installations, water running off copper surfaces onto aluminum will cause rapid corrosion.',
            'Never direct-splice copper to aluminum wire without a proper bi-metallic splice or Marette rated for mixed metals.',
            'In mining environments with acidic water, galvanic corrosion is accelerated. Use copper conductors where possible.',
          ],
        },
        {
          id: 'tinned',
          title: 'Tinned Copper for Chemical Environments',
          content: [
            'Tinned copper has a thin layer of tin applied over the copper conductor.',
            'Provides protection against corrosion from sulfur, rubber compounds, and chemical environments.',
            'Required for rubber-insulated cables (the sulfur in rubber vulcanization attacks bare copper).',
            'Standard in marine and offshore applications where saltwater exposure is constant.',
            'Used in mining where acid mine drainage or chemical processing creates corrosive atmospheres.',
            'DLO (Diesel Locomotive) cable uses tinned copper for chemical resistance in mine environments.',
            'SHD-GC trailing cables typically use tinned copper conductors for longevity.',
            'Slightly higher resistance than bare copper (~2-3%) due to the tin layer, but negligible in practice.',
            'Solderability is improved with tinned copper (important for electronic connections).',
          ],
        },
        {
          id: 'copperclad',
          title: 'Copper-Clad Aluminum (CCA)',
          content: [
            'CCA has a copper layer bonded to an aluminum core (typically 10-15% copper by volume).',
            'Offers a compromise between copper conductivity and aluminum weight savings.',
            'Conductivity is approximately 80-85% of pure copper (better than aluminum at 61%).',
            'Weight is about 71% of pure copper (heavier than pure aluminum).',
            'CCA can be terminated with standard copper-rated connectors (the contact surface is copper).',
            'Does NOT require anti-oxidant compound (copper outer layer protects against oxidation).',
            'Not widely used in Canadian electrical installations. More common in telecommunications.',
            'Not permitted by CEC for branch circuit wiring. May be acceptable for specific applications.',
            'Verify local authority having jurisdiction (AHJ) approval before specifying CCA.',
          ],
        },
      ] as const).map(card => {
        const isOpen = expanded === card.id
        return (
          <div key={card.id} style={{ ...sectionCard, padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => setExpanded(isOpen ? null : card.id)}
              style={{
                width: '100%',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: 'var(--touch-min)',
                color: 'var(--text)',
              }}
            >
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', width: 20 }}>{isOpen ? '\▼' : '\▶'}</span>
              <span style={{ ...sectionTitle, margin: 0, flex: 1 }}>{card.title}</span>
            </button>
            {isOpen && (
              <ul style={{ ...bodyText, padding: '0 16px 16px 44px', margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {card.content.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* =============================================================================
   TAB 4 — INSULATION TYPES
   ============================================================================= */

function InsulationTypesTab() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterMining, setFilterMining] = useState(false)

  const miningTypes = ['TECK90', 'SHD-GC', 'DLO']
  const displayTypes = filterMining ? insulationTypes.filter(t => miningTypes.includes(t.name)) : insulationTypes

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Overview Card */}
      <div style={sectionCard}>
        <div style={sectionTitle}>Conductor Insulation Reference</div>
        <p style={bodyText}>
          Complete reference for conductor insulation types used in Ontario electrical and mining installations.
          Each entry covers temperature rating, voltage class, where it is permitted per CEC, and jacket material.
        </p>
      </div>

      {/* Filter */}
      <button
        onClick={() => setFilterMining(!filterMining)}
        style={{
          padding: '12px 16px',
          background: filterMining ? 'var(--primary-dim)' : 'var(--surface)',
          border: filterMining ? '1px solid var(--primary)' : '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          color: filterMining ? 'var(--primary)' : 'var(--text-secondary)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: 'var(--touch-min)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {filterMining ? '\✓ Showing Mining Types Only' : 'Show Mining Types Only'}
      </button>

      {/* Quick Comparison Table */}
      <ScrollTable minWidth={750}>
        <thead>
          <tr>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Temp</th>
            <th style={thStyle}>Voltage</th>
            <th style={thStyle}>Wet/Dry</th>
            <th style={thStyle}>Jacket</th>
            <th style={thStyle}>CEC Ref</th>
          </tr>
        </thead>
        <tbody>
          {displayTypes.map((t, i) => (
            <tr key={t.name} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
              <td style={{ ...tdStyle, fontWeight: 700, color: miningTypes.includes(t.name) ? 'var(--primary)' : 'var(--text)' }}>
                {t.name}
                {miningTypes.includes(t.name) && <span style={{ ...badgeStyle('gold'), marginLeft: 6 }}>Mining</span>}
              </td>
              <td style={tdStyle}>{t.tempRating}</td>
              <td style={tdStyle}>{t.voltageRating}</td>
              <td style={{ ...tdStyle, color: t.wetDry.includes('Wet') ? '#4caf50' : '#ff9800' }}>{t.wetDry}</td>
              <td style={{ ...tdStyle, whiteSpace: 'normal', fontSize: 11 }}>{t.jacket}</td>
              <td style={{ ...tdStyle, fontSize: 11 }}>{t.cecRef}</td>
            </tr>
          ))}
        </tbody>
      </ScrollTable>

      {/* Expandable Detail Cards */}
      {displayTypes.map(t => {
        const isOpen = expanded === t.name
        const isMining = miningTypes.includes(t.name)
        return (
          <div
            key={t.name}
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              border: isMining ? '1px solid var(--primary)' : '1px solid var(--divider)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : t.name)}
              style={{
                width: '100%',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: 'var(--touch-min)',
                color: 'var(--text)',
              }}
            >
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', width: 20 }}>{isOpen ? '\▼' : '\▶'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: isMining ? 'var(--primary)' : 'var(--text)' }}>
                    {t.name}
                  </span>
                  {isMining && <span style={badgeStyle('gold')}>Mining</span>}
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.tempRating}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{t.typicalUse.slice(0, 80)}{t.typicalUse.length > 80 ? '...' : ''}</div>
              </div>
            </button>

            {isOpen && (
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 12 }} />
                {([
                  ['Temperature Rating', t.tempRating],
                  ['Voltage Rating', t.voltageRating],
                  ['Wet/Dry', t.wetDry],
                  ['Jacket Material', t.jacket],
                  ['Typical Use', t.typicalUse],
                  ['CEC Reference', t.cecRef],
                  ['Notes', t.notes],
                ] as const).map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Jacket Materials Reference */}
      <div style={sectionCard}>
        <div style={sectionTitle}>Jacket Material Quick Reference</div>
        <ScrollTable minWidth={500}>
          <thead>
            <tr>
              <th style={thStyle}>Abbreviation</th>
              <th style={thStyle}>Material</th>
              <th style={thStyle}>Properties</th>
              <th style={thStyle}>Common Use</th>
            </tr>
          </thead>
          <tbody>
            {([
              ['PVC', 'Polyvinyl Chloride', 'Low cost, flame retardant, flexible', 'NMD90, TECK90 outer, building wire'],
              ['XLPE', 'Cross-Linked Polyethylene', 'High temp, moisture resistant, excellent dielectric', 'RW90, RWU90, RPV90, MV cables'],
              ['PE', 'Polyethylene', 'Low moisture absorption, good for underground', 'Underground direct burial, telecom'],
              ['CPE', 'Chlorinated Polyethylene', 'Chemical resistant, oil resistant, UV stable', 'Mining trailing cables, DLO'],
              ['EPR / EPDM', 'Ethylene Propylene Rubber', 'Very flexible, excellent at high temps', 'DLO, mining power, welding leads'],
              ['Nylon', 'Polyamide', 'Tough outer sheath, mechanical protection', 'T90 Nylon (protects PVC insulation)'],
            ] as const).map(([abbr, mat, props, use], i) => (
              <tr key={abbr} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--primary)' }}>{abbr}</td>
                <td style={{ ...tdStyle, whiteSpace: 'normal', fontFamily: 'var(--font-sans)' }}>{mat}</td>
                <td style={{ ...tdStyle, whiteSpace: 'normal', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>{props}</td>
                <td style={{ ...tdStyle, whiteSpace: 'normal', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>{use}</td>
              </tr>
            ))}
          </tbody>
        </ScrollTable>
      </div>
    </div>
  )
}

/* =============================================================================
   TAB 5 — TEMPERATURE DERATING
   ============================================================================= */

function TemperatureDeratingTab() {
  const [baseAmpacity, setBaseAmpacity] = useState('115')
  const [insRating, setInsRating] = useState<'60' | '75' | '90'>('75')
  const [ambientTemp, setAmbientTemp] = useState('40')
  const [numConductors, setNumConductors] = useState('3')

  const ampBase = parseFloat(baseAmpacity)
  const ambTemp = parseFloat(ambientTemp)
  const numCond = parseInt(numConductors, 10)

  // Find temperature correction factor
  const getTempFactor = (): number | null => {
    if (isNaN(ambTemp)) return null
    for (const row of tempCorrData) {
      if (ambTemp >= row.ambientMin && ambTemp <= row.ambientMax) {
        if (insRating === '60') return row.factor60
        if (insRating === '75') return row.factor75
        return row.factor90
      }
    }
    return null
  }

  // Find bundling factor
  const getBundleFactor = (): number => {
    if (isNaN(numCond) || numCond < 1) return 1.0
    for (const row of bundleData) {
      if (numCond >= row.min && numCond <= row.max) return row.factor
    }
    return 0.50
  }

  const tempFactor = getTempFactor()
  const bundleFactor = getBundleFactor()
  const validCalc = !isNaN(ampBase) && ampBase > 0 && tempFactor !== null
  const correctedAmp = validCalc ? ampBase * tempFactor * bundleFactor : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Calculator */}
      <div style={sectionCard}>
        <div style={sectionTitle}>Ampacity Derating Calculator</div>
        <p style={bodyText}>
          Enter the base ampacity at 30{'\°'}C (from CEC Table 2 or 4), insulation temperature rating,
          actual ambient temperature, and number of current-carrying conductors in the raceway.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={labelStyle}>Base Ampacity at 30{'\°'}C (A)</div>
            <input style={inputStyle} type="number" step="any" value={baseAmpacity} onChange={e => setBaseAmpacity(e.target.value)} placeholder="115" />
          </div>
          <div>
            <div style={labelStyle}>Insulation Rating</div>
            <select style={selectStyle} value={insRating} onChange={e => setInsRating(e.target.value as '60' | '75' | '90')}>
              <option value="60">60{'\°'}C (TW)</option>
              <option value="75">75{'\°'}C (RW75, TWN75)</option>
              <option value="90">90{'\°'}C (RW90, TECK90)</option>
            </select>
          </div>
          <div>
            <div style={labelStyle}>Ambient Temp ({'\°'}C)</div>
            <input style={inputStyle} type="number" step="any" value={ambientTemp} onChange={e => setAmbientTemp(e.target.value)} placeholder="40" />
          </div>
          <div>
            <div style={labelStyle}>Conductors in Raceway</div>
            <input style={inputStyle} type="number" step="1" min="1" value={numConductors} onChange={e => setNumConductors(e.target.value)} placeholder="3" />
          </div>
        </div>

        {correctedAmp !== null && tempFactor !== null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div style={resultBox}>
                <div style={{ ...resultValue, fontSize: 18 }}>{fmt(tempFactor)}</div>
                <div style={resultLabel}>Temp Factor (Table 5A)</div>
              </div>
              <div style={resultBox}>
                <div style={{ ...resultValue, fontSize: 18 }}>{fmt(bundleFactor)}</div>
                <div style={resultLabel}>Bundle Factor (Table 5C)</div>
              </div>
              <div style={{ ...resultBox, border: '2px solid var(--primary)' }}>
                <div style={resultValue}>{fmt(correctedAmp)} A</div>
                <div style={resultLabel}>Corrected Ampacity</div>
              </div>
            </div>
            <div style={formulaBox}>
              Corrected = {fmt(ampBase)} A {'×'} {fmt(tempFactor)} {'×'} {fmt(bundleFactor)} = {fmt(correctedAmp)} A
            </div>
          </div>
        ) : tempFactor === null && !isNaN(ambTemp) ? (
          <div style={{ ...resultBox, border: '1px solid var(--error)' }}>
            <div style={{ color: 'var(--error)', fontSize: 14, fontWeight: 600 }}>
              {insRating === '60' && ambTemp > 45 ? 'Conductor cannot be used above 45\°C at 60\°C rating' :
               insRating === '75' && ambTemp > 50 ? 'Conductor cannot be used above 50\°C at 75\°C rating' :
               'Temperature out of range for this insulation rating'}
            </div>
          </div>
        ) : null}
      </div>

      {/* Table 5A */}
      <div style={sectionCard}>
        <div style={sectionTitle}>CEC Table 5A -- Ambient Temperature Correction Factors</div>
        <p style={bodyText}>
          Multiply the base ampacity (from Tables 2 or 4 at 30{'\°'}C) by the correction factor for the actual
          ambient temperature. A dash indicates the conductor cannot be used at that temperature.
        </p>
      </div>

      <ScrollTable minWidth={500}>
        <thead>
          <tr>
            <th style={thStyle}>Ambient Temp Range</th>
            <th style={{ ...thStyle, color: '#ff6b6b' }}>60{'\°'}C Insulation</th>
            <th style={{ ...thStyle, color: '#ff9800' }}>75{'\°'}C Insulation</th>
            <th style={{ ...thStyle, color: '#4caf50' }}>90{'\°'}C Insulation</th>
          </tr>
        </thead>
        <tbody>
          {tempCorrData.map((r, i) => {
            const isBase = r.ambientMin === 26
            return (
              <tr key={r.ambientRange} style={{
                background: isBase ? 'rgba(255,215,0,0.08)' : i % 2 === 0 ? 'transparent' : 'var(--surface)',
              }}>
                <td style={{ ...tdStyle, fontWeight: isBase ? 700 : 400, color: isBase ? 'var(--primary)' : 'var(--text)' }}>
                  {r.ambientRange} {isBase ? '(base)' : ''}
                </td>
                <td style={{ ...tdStyle, color: r.factor60 === null ? 'var(--error)' : r.factor60 < 1 ? '#ff6b6b' : '#4caf50' }}>
                  {r.factor60 !== null ? fmt(r.factor60) : '—'}
                </td>
                <td style={{ ...tdStyle, color: r.factor75 === null ? 'var(--error)' : r.factor75 < 1 ? '#ff9800' : '#4caf50' }}>
                  {r.factor75 !== null ? fmt(r.factor75) : '—'}
                </td>
                <td style={{ ...tdStyle, color: r.factor90 === null ? 'var(--error)' : r.factor90 < 1 ? '#ff9800' : '#4caf50' }}>
                  {r.factor90 !== null ? fmt(r.factor90) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </ScrollTable>

      {/* Table 5C */}
      <div style={sectionCard}>
        <div style={sectionTitle}>CEC Table 5C -- Bundling / Grouping Derating Factors</div>
        <p style={bodyText}>
          When more than 3 current-carrying conductors are installed in a raceway or cable, the ampacity must
          be reduced. Only current-carrying conductors count (not bonding conductors). For 3-phase balanced
          circuits, the neutral is not a current-carrying conductor.
        </p>
      </div>

      <ScrollTable minWidth={400}>
        <thead>
          <tr>
            <th style={thStyle}>Number of Conductors</th>
            <th style={thStyle}>Derating Factor</th>
            <th style={thStyle}>Ampacity Retained</th>
          </tr>
        </thead>
        <tbody>
          {bundleData.map((r, i) => (
            <tr key={r.range} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{r.range}</td>
              <td style={{ ...tdStyle, color: r.factor < 1 ? '#ff9800' : '#4caf50', fontWeight: 700 }}>{fmt(r.factor)}</td>
              <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{(r.factor * 100).toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </ScrollTable>

      {/* Mining-specific note */}
      <div style={{ ...sectionCard, borderColor: 'var(--primary)' }}>
        <div style={sectionTitle}>Mining Considerations</div>
        <ul style={{ ...bodyText, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Underground mines in Ontario can have ambient temperatures of 30{'\°'}C to 45{'\°'}C or higher at depth.</li>
          <li>Use 90{'\°'}C rated cables (TECK90) to maximize ampacity in elevated temperatures.</li>
          <li>Multi-conductor TECK90 cables already account for internal conductor grouping in their ampacity ratings.</li>
          <li>When multiple TECK cables are bundled in cable tray, additional derating per Table 5C is required.</li>
          <li>Trailing cables (SHD-GC, Type W) have their own ampacity tables in CSA C22.2 No. 96; do not use Table 5A/5C.</li>
          <li>Always verify ambient temperature with the mine ventilation department. Deep levels can exceed 40{'\°'}C.</li>
        </ul>
      </div>
    </div>
  )
}

/* =============================================================================
   TAB 6 — CONDUCTOR SELECTION GUIDE
   ============================================================================= */

interface SelectionResult {
  wireType: string
  insulation: string
  minSize: string
  notes: string[]
  cecRules: string[]
}

function ConductorSelectionTab() {
  const [application, setApplication] = useState('building')
  const [voltage, setVoltage] = useState('120/208')
  const [current, setCurrent] = useState('80')
  const [ambTemp, setAmbTemp] = useState('30')
  const [numConductors, setNumConductors] = useState('3')
  const [location, setLocation] = useState('dry')
  const [showDecisionTree, setShowDecisionTree] = useState(false)

  // Ampacity tables (simplified, copper, at 75 and 90 deg C in conduit)
  const ampacityTable75: [string, number][] = [
    ['14 AWG', 15], ['12 AWG', 20], ['10 AWG', 30], ['8 AWG', 45],
    ['6 AWG', 65], ['4 AWG', 85], ['3 AWG', 100], ['2 AWG', 115],
    ['1 AWG', 130], ['1/0 AWG', 150], ['2/0 AWG', 175], ['3/0 AWG', 200],
    ['4/0 AWG', 230], ['250 kcmil', 255], ['300 kcmil', 285], ['350 kcmil', 310],
    ['400 kcmil', 335], ['500 kcmil', 380], ['600 kcmil', 420], ['750 kcmil', 475],
  ]
  const ampacityTable90: [string, number][] = [
    ['14 AWG', 15], ['12 AWG', 25], ['10 AWG', 35], ['8 AWG', 50],
    ['6 AWG', 70], ['4 AWG', 90], ['3 AWG', 105], ['2 AWG', 120],
    ['1 AWG', 140], ['1/0 AWG', 155], ['2/0 AWG', 185], ['3/0 AWG', 210],
    ['4/0 AWG', 245], ['250 kcmil', 270], ['300 kcmil', 300], ['350 kcmil', 330],
    ['400 kcmil', 355], ['500 kcmil', 405], ['600 kcmil', 455], ['750 kcmil', 515],
  ]

  const result = useMemo((): SelectionResult | null => {
    const amps = parseFloat(current)
    const amb = parseFloat(ambTemp)
    const nCond = parseInt(numConductors, 10)
    if (isNaN(amps) || amps <= 0) return null

    // Determine insulation and wire type based on application
    let wireType = ''
    let insulation = ''
    let useTable: [string, number][] = ampacityTable75
    let tempRating: '60' | '75' | '90' = '75'
    const cecRules: string[] = []
    const notes: string[] = []

    switch (application) {
      case 'building':
        if (location === 'wet') {
          wireType = 'RW90 in conduit'
          insulation = 'RW90 (XLPE, 90\°C wet/dry)'
          useTable = ampacityTable90
          tempRating = '90'
          cecRules.push('CEC Rule 4-004, Table 2, Table 19')
          notes.push('RW90 maintains 90\°C rating in wet locations')
        } else {
          wireType = 'T90 Nylon or RW90 in conduit'
          insulation = 'T90 Nylon (PVC/Nylon, 90\°C dry)'
          useTable = ampacityTable90
          tempRating = '90'
          cecRules.push('CEC Rule 4-004, Table 2, Table 19')
          notes.push('T90 Nylon provides easy pulling and 90\°C rating in dry locations')
        }
        notes.push('Standard building wire method for commercial/industrial')
        break

      case 'feeder':
        wireType = 'RW90 in conduit or TECK90'
        insulation = 'RW90 (XLPE) or TECK90 (90\°C)'
        useTable = ampacityTable90
        tempRating = '90'
        cecRules.push('CEC Rule 4-004, 14-100, Table 2')
        notes.push('For feeders over 200A, consider parallel conductors')
        notes.push('TECK90 eliminates the need for conduit in exposed runs')
        if (location === 'wet') {
          notes.push('Use RW90 or TECK90 for wet locations')
        }
        break

      case 'motor':
        wireType = 'RW90 in conduit or TECK90'
        insulation = 'RW90 (90\°C) or TECK90 (90\°C)'
        useTable = ampacityTable90
        tempRating = '90'
        cecRules.push('CEC Rule 28-104, 28-106, Table 2')
        notes.push('Motor circuit conductors must be sized for 125% of motor FLC (CEC Rule 28-106)')
        notes.push('Use Table 36/38 for motor FLC, NOT the nameplate')
        notes.push('Ensure conductor ampacity exceeds motor OCP device rating')
        break

      case 'teck':
        wireType = 'TECK90'
        insulation = 'TECK90 (interlocking AL armour, PVC jacket, 90\°C)'
        useTable = ampacityTable90
        tempRating = '90'
        cecRules.push('CEC Rule 12-600 to 12-618, CSA C22.2 No. 131')
        notes.push('Armour serves as equipment bonding conductor with approved TECK connectors')
        notes.push('Available in 600V and 1000V ratings')
        notes.push('Suitable for cable tray, direct burial, exposed runs, wet/dry locations')
        if (location === 'wet') {
          notes.push('TECK90 is rated for wet locations without derating')
        }
        break

      case 'mining':
        wireType = 'TECK90 (permanent) or SHD-GC/Type W (trailing)'
        insulation = 'TECK90 (90\°C, 1000V) for permanent; SHD-GC for HV trailing'
        useTable = ampacityTable90
        tempRating = '90'
        cecRules.push('CEC Section 76, O.Reg 854 (Mines & Mining Plants)')
        cecRules.push('CSA C22.2 No. 96, CSA M421')
        notes.push('Use TECK90-1000V for permanent mine wiring')
        notes.push('SHD-GC required for mobile equipment above 5kV')
        notes.push('Type W / G-GC for mobile equipment under 5kV')
        notes.push('Ground check conductor mandatory on all trailing cables in Ontario mines')
        notes.push('All mine electrical installations require ESA approval per O.Reg 854')
        if (amb === 30) {
          notes.push('Verify actual ambient temperature at depth. Deep mines can exceed 40\°C.')
        }
        break

      default:
        return null
    }

    // Calculate derating factors
    let tempFactor = 1.0
    for (const row of tempCorrData) {
      if (amb >= row.ambientMin && amb <= row.ambientMax) {
        const tr = tempRating as string
        const f = tr === '60' ? row.factor60 : tr === '75' ? row.factor75 : row.factor90
        if (f !== null) tempFactor = f
        else {
          notes.push('WARNING: Ambient temperature exceeds insulation capability. Select higher-rated insulation.')
          return { wireType, insulation, minSize: 'N/A', notes, cecRules }
        }
        break
      }
    }

    let bundleFactor = 1.0
    for (const row of bundleData) {
      if (nCond >= row.min && nCond <= row.max) {
        bundleFactor = row.factor
        break
      }
    }

    // Required ampacity before derating
    const requiredAmpacity = amps / (tempFactor * bundleFactor)

    // Find minimum wire size
    let minSize = 'Exceeds 750 kcmil -- use parallel conductors'
    for (const [size, amp] of useTable) {
      if (amp >= requiredAmpacity) {
        minSize = size
        break
      }
    }

    // Motor circuit 125% sizing note
    if (application === 'motor') {
      notes.unshift(`Required ampacity after 125% motor sizing: ${fmt(amps)} A (already factored into input)`)
    }

    if (tempFactor !== 1.0) {
      notes.push(`Temperature correction factor: ${fmt(tempFactor)} (Table 5A at ${amb}\°C)`)
    }
    if (bundleFactor !== 1.0) {
      notes.push(`Bundling derating factor: ${fmt(bundleFactor)} (Table 5C for ${nCond} conductors)`)
    }
    if (tempFactor !== 1.0 || bundleFactor !== 1.0) {
      notes.push(`Conductor must support ${fmt(requiredAmpacity)} A before derating to deliver ${fmt(amps)} A`)
    }

    // Minimum sizing rules
    if (application === 'building') {
      if (amps <= 15) notes.push('14 AWG minimum for 15A circuits per CEC Rule 14-104')
      if (amps <= 20) notes.push('14 AWG minimum for 20A circuits per CEC Rule 14-104')
    }

    return { wireType, insulation, minSize, notes, cecRules }
  }, [application, voltage, current, ambTemp, numConductors, location])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={sectionCard}>
        <div style={sectionTitle}>Interactive Conductor Selection</div>
        <p style={bodyText}>
          Select your application, conditions, and required current. The tool will recommend wire type, insulation,
          and minimum size with derating applied. Always verify with your local Authority Having Jurisdiction (AHJ)
          and the current edition of the CEC.
        </p>
      </div>

      {/* Input Form */}
      <div style={sectionCard}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={labelStyle}>Application</div>
            <select style={selectStyle} value={application} onChange={e => setApplication(e.target.value)}>
              <option value="building">Building Wire (branch circuit)</option>
              <option value="feeder">Feeder</option>
              <option value="motor">Motor Circuit</option>
              <option value="teck">TECK Cable (industrial)</option>
              <option value="mining">Mining Installation</option>
            </select>
          </div>
          <div>
            <div style={labelStyle}>System Voltage</div>
            <select style={selectStyle} value={voltage} onChange={e => setVoltage(e.target.value)}>
              <option value="120/208">120/208V 3-phase</option>
              <option value="120/240">120/240V single-phase</option>
              <option value="347/600">347/600V 3-phase</option>
              <option value="600">600V 3-phase</option>
              <option value="1000">1000V (mining)</option>
              <option value="4160">4160V (mining HV)</option>
            </select>
          </div>
          <div>
            <div style={labelStyle}>Required Current (A)</div>
            <input style={inputStyle} type="number" step="any" value={current} onChange={e => setCurrent(e.target.value)} placeholder="80" />
          </div>
          <div>
            <div style={labelStyle}>Ambient Temperature ({'\°'}C)</div>
            <input style={inputStyle} type="number" step="any" value={ambTemp} onChange={e => setAmbTemp(e.target.value)} placeholder="30" />
          </div>
          <div>
            <div style={labelStyle}>Conductors in Raceway</div>
            <input style={inputStyle} type="number" step="1" min="1" value={numConductors} onChange={e => setNumConductors(e.target.value)} placeholder="3" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={labelStyle}>Location</div>
            <select style={selectStyle} value={location} onChange={e => setLocation(e.target.value)}>
              <option value="dry">Dry location</option>
              <option value="wet">Wet location</option>
              <option value="underground">Underground / Direct burial</option>
              <option value="cabletray">Cable tray</option>
              <option value="exposed">Exposed (surface mounted)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div style={{ ...sectionCard, borderColor: 'var(--primary)', gap: 14 }}>
          <div style={{ ...sectionTitle, fontSize: 16 }}>Recommendation</div>

          <div style={{ ...resultBox, border: '2px solid var(--primary)' }}>
            <div style={{ ...resultValue, fontSize: 24 }}>{result.minSize}</div>
            <div style={resultLabel}>Minimum Conductor Size</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={resultBox}>
              <div style={{ ...resultValue, fontSize: 14, whiteSpace: 'normal', lineHeight: 1.4 }}>{result.wireType}</div>
              <div style={resultLabel}>Wire Type</div>
            </div>
            <div style={resultBox}>
              <div style={{ ...resultValue, fontSize: 14, whiteSpace: 'normal', lineHeight: 1.4 }}>{result.insulation}</div>
              <div style={resultLabel}>Insulation</div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div style={{ ...labelStyle, marginBottom: 8 }}>Design Notes</div>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {result.notes.map((n, i) => (
                <li key={i} style={{ color: n.startsWith('WARNING') ? 'var(--error)' : 'var(--text-secondary)' }}>{n}</li>
              ))}
            </ul>
          </div>

          {/* CEC Rules */}
          <div>
            <div style={{ ...labelStyle, marginBottom: 8 }}>CEC References</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {result.cecRules.map((r, i) => (
                <span key={i} style={badgeStyle('blue')}>{r}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decision Tree */}
      <button
        onClick={() => setShowDecisionTree(!showDecisionTree)}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius)',
          color: 'var(--primary)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: 'var(--touch-min)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {showDecisionTree ? '\▼' : '\▶'} Conductor Selection Decision Tree
      </button>

      {showDecisionTree && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Step 1 */}
          <div style={sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
                color: '#000', fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>1</span>
              <span style={sectionTitle}>Determine the Load Current</span>
            </div>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 44, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Branch circuit: Calculate total connected load per CEC Rule 8-200</li>
              <li>Motor circuit: Use Table 36 or 38 FLC, then multiply by 125% (CEC 28-106)</li>
              <li>Feeder: Sum all branch circuit loads with demand factors (CEC Tables 14-18)</li>
              <li>Mining: Determine kVA/load, calculate current at operating voltage</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div style={sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
                color: '#000', fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>2</span>
              <span style={sectionTitle}>Select the Wiring Method</span>
            </div>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 44, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li><strong>Conduit + single conductors</strong> -- Building wire (RW90, T90 Nylon)</li>
              <li><strong>Armoured cable</strong> -- TECK90 (wet/dry), AC90 (dry), ACWU90 (wet/dry)</li>
              <li><strong>Non-metallic</strong> -- NMD90 (residential dry concealed only)</li>
              <li><strong>Trailing cable</strong> -- SHD-GC (above 5kV), Type W/G-GC (below 5kV)</li>
              <li><strong>Solar PV</strong> -- RPV90 (UV resistant, DC rated)</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div style={sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
                color: '#000', fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>3</span>
              <span style={sectionTitle}>Apply Derating Factors</span>
            </div>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 44, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Table 5A: Ambient temperature correction (base is 30{'\°'}C)</li>
              <li>Table 5C: Bundling derating (more than 3 current-carrying conductors)</li>
              <li>Required ampacity = Load current {'\÷'} (temp factor {'×'} bundle factor)</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div style={sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
                color: '#000', fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>4</span>
              <span style={sectionTitle}>Select Conductor Size from Tables</span>
            </div>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 44, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>CEC Table 2 (copper) or Table 4 (aluminum)</li>
              <li>Use the column matching the termination temperature rating (usually 75{'\°'}C)</li>
              <li>Select the smallest conductor with ampacity {'\≥'} required ampacity</li>
              <li>If using 90{'\°'}C column for derating, final ampacity must not exceed 75{'\°'}C column value</li>
            </ul>
          </div>

          {/* Step 5 */}
          <div style={sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
                color: '#000', fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>5</span>
              <span style={sectionTitle}>Verify Voltage Drop</span>
            </div>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 44, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>CEC Rule 8-102: Max 5% total voltage drop (3% branch, 2% feeder recommended)</li>
              <li>V<sub>drop</sub> = I {'×'} L {'×'} 2 {'×'} R / 1000 (single-phase)</li>
              <li>If voltage drop exceeds limits, upsize the conductor</li>
              <li>Long runs in mining often require oversizing for voltage drop</li>
            </ul>
          </div>

          {/* Step 6 */}
          <div style={sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
                color: '#000', fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>6</span>
              <span style={sectionTitle}>Final Checks</span>
            </div>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 44, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Overcurrent protection must not exceed conductor ampacity (CEC 14-104)</li>
              <li>Verify termination temperature rating matches equipment (most equipment is 75{'\°'}C)</li>
              <li>Check conduit fill does not exceed 40% (CEC Table 8)</li>
              <li>For mining: Verify compliance with O.Reg 854 and site-specific standards</li>
              <li>For aluminum: Ensure anti-oxidant, proper torque, and CU/AL rated connectors</li>
              <li>Document all calculations for the permit application and inspection</li>
            </ul>
          </div>
        </div>
      )}

      {/* Key CEC Rules Quick Reference */}
      <div style={sectionCard}>
        <div style={sectionTitle}>Key CEC Rules Quick Reference</div>
        <ScrollTable minWidth={500}>
          <thead>
            <tr>
              <th style={thStyle}>Rule</th>
              <th style={thStyle}>Topic</th>
              <th style={thStyle}>Key Point</th>
            </tr>
          </thead>
          <tbody>
            {([
              ['4-004', 'Conductor types', 'Lists permitted insulation types and their applications'],
              ['8-102', 'Voltage drop', 'Max 5% from source to point of use; 3% branch recommended'],
              ['8-104', 'Conductor sizing', 'Conductor ampacity must meet or exceed the load'],
              ['12-100', 'NMD90', 'Non-metallic sheathed cable, residential concealed wiring'],
              ['12-400', 'AC90/ACWU90', 'Armoured cable rules for commercial/industrial'],
              ['12-600', 'TECK90', 'Rules for TECK cable installation and termination'],
              ['14-100', 'Feeders', 'Feeder conductor sizing and overcurrent protection'],
              ['14-104', 'OCP vs conductor', 'OCP must not exceed conductor ampacity'],
              ['28-106', 'Motor conductors', '125% of motor FLC for conductor sizing'],
              ['Table 2', 'Cu ampacity', 'Copper conductor ampacity (not more than 3 in raceway, 30\°C)'],
              ['Table 4', 'Al ampacity', 'Aluminum conductor ampacity'],
              ['Table 5A', 'Temp correction', 'Ambient temperature correction factors'],
              ['Table 5C', 'Bundling', 'Conductor grouping/bundling derating factors'],
              ['Table 9', 'R, X, Z', 'AC resistance, reactance, and impedance per meter'],
              ['Section 76', 'Mines', 'Special rules for mines and mining plants'],
            ] as const).map(([rule, topic, point], i) => (
              <tr key={rule} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--primary)' }}>{rule}</td>
                <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: 'normal', fontFamily: 'var(--font-sans)' }}>{topic}</td>
                <td style={{ ...tdStyle, whiteSpace: 'normal', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>{point}</td>
              </tr>
            ))}
          </tbody>
        </ScrollTable>
      </div>
    </div>
  )
}

/* =============================================================================
   MAIN PAGE COMPONENT
   ============================================================================= */

export default function ConductorPropertiesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('gauge')

  const renderTab = () => {
    switch (activeTab) {
      case 'gauge': return <WireGaugeTab />
      case 'resistance': return <ResistanceReactanceTab />
      case 'materials': return <ConductorMaterialsTab />
      case 'insulation': return <InsulationTypesTab />
      case 'derating': return <TemperatureDeratingTab />
      case 'selection': return <ConductorSelectionTab />
    }
  }

  return (
    <PageWrapper title="Conductor Properties">
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 4,
          paddingBottom: 4,
          marginBottom: 8,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: '0 0 auto',
                padding: '10px 16px',
                minHeight: 'var(--touch-min)',
                minWidth: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? 'var(--primary)' : 'var(--surface)',
                color: isActive ? '#000' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--divider)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s',
              }}
            >
              {tab.shortLabel}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {renderTab()}
    </PageWrapper>
  )
}
