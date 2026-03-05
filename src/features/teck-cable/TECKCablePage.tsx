import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  TECK90 Cable Reference - Comprehensive field guide                 */
/*  For Ontario mining electricians                                     */
/* ------------------------------------------------------------------ */

type TabKey = 'specs' | 'gland' | 'install' | 'troubleshoot' | 'compare'

/* ==================== DATA ==================== */

interface CableSpec {
  size: string
  conductors: string
  odMm: number
  weightKgKm: number
  ampFreeAir: number
  ampTray: number
}

const cableSpecs: CableSpec[] = [
  // 2-conductor
  { size: '14 AWG', conductors: '2C', odMm: 15.0, weightKgKm: 290, ampFreeAir: 25, ampTray: 20 },
  { size: '12 AWG', conductors: '2C', odMm: 15.8, weightKgKm: 340, ampFreeAir: 30, ampTray: 25 },
  { size: '10 AWG', conductors: '2C', odMm: 17.0, weightKgKm: 420, ampFreeAir: 40, ampTray: 35 },
  { size: '8 AWG', conductors: '2C', odMm: 19.5, weightKgKm: 580, ampFreeAir: 55, ampTray: 45 },
  { size: '6 AWG', conductors: '2C', odMm: 21.5, weightKgKm: 750, ampFreeAir: 75, ampTray: 60 },
  // 3-conductor
  { size: '14 AWG', conductors: '3C', odMm: 15.5, weightKgKm: 320, ampFreeAir: 25, ampTray: 20 },
  { size: '12 AWG', conductors: '3C', odMm: 16.3, weightKgKm: 380, ampFreeAir: 30, ampTray: 25 },
  { size: '10 AWG', conductors: '3C', odMm: 17.8, weightKgKm: 490, ampFreeAir: 40, ampTray: 35 },
  { size: '8 AWG', conductors: '3C', odMm: 20.5, weightKgKm: 680, ampFreeAir: 55, ampTray: 45 },
  { size: '6 AWG', conductors: '3C', odMm: 23.0, weightKgKm: 900, ampFreeAir: 75, ampTray: 60 },
  { size: '4 AWG', conductors: '3C', odMm: 25.5, weightKgKm: 1150, ampFreeAir: 95, ampTray: 80 },
  { size: '3 AWG', conductors: '3C', odMm: 26.8, weightKgKm: 1300, ampFreeAir: 110, ampTray: 90 },
  { size: '2 AWG', conductors: '3C', odMm: 28.5, weightKgKm: 1480, ampFreeAir: 130, ampTray: 105 },
  { size: '1 AWG', conductors: '3C', odMm: 31.0, weightKgKm: 1750, ampFreeAir: 150, ampTray: 120 },
  { size: '1/0 AWG', conductors: '3C', odMm: 33.5, weightKgKm: 2100, ampFreeAir: 170, ampTray: 140 },
  { size: '2/0 AWG', conductors: '3C', odMm: 35.5, weightKgKm: 2450, ampFreeAir: 195, ampTray: 155 },
  { size: '3/0 AWG', conductors: '3C', odMm: 38.0, weightKgKm: 2900, ampFreeAir: 225, ampTray: 180 },
  { size: '4/0 AWG', conductors: '3C', odMm: 41.0, weightKgKm: 3400, ampFreeAir: 260, ampTray: 205 },
  { size: '250 MCM', conductors: '3C', odMm: 44.0, weightKgKm: 3950, ampFreeAir: 290, ampTray: 230 },
  { size: '350 MCM', conductors: '3C', odMm: 49.5, weightKgKm: 5200, ampFreeAir: 350, ampTray: 280 },
  { size: '500 MCM', conductors: '3C', odMm: 57.0, weightKgKm: 7100, ampFreeAir: 430, ampTray: 345 },
  // 4-conductor
  { size: '14 AWG', conductors: '4C', odMm: 16.5, weightKgKm: 370, ampFreeAir: 25, ampTray: 20 },
  { size: '12 AWG', conductors: '4C', odMm: 17.5, weightKgKm: 440, ampFreeAir: 30, ampTray: 25 },
  { size: '10 AWG', conductors: '4C', odMm: 19.5, weightKgKm: 580, ampFreeAir: 40, ampTray: 35 },
  { size: '8 AWG', conductors: '4C', odMm: 22.5, weightKgKm: 820, ampFreeAir: 55, ampTray: 45 },
  { size: '6 AWG', conductors: '4C', odMm: 25.0, weightKgKm: 1080, ampFreeAir: 75, ampTray: 60 },
  { size: '4 AWG', conductors: '4C', odMm: 28.0, weightKgKm: 1420, ampFreeAir: 95, ampTray: 80 },
  { size: '2 AWG', conductors: '4C', odMm: 31.5, weightKgKm: 1850, ampFreeAir: 130, ampTray: 105 },
  { size: '1/0 AWG', conductors: '4C', odMm: 37.0, weightKgKm: 2650, ampFreeAir: 170, ampTray: 140 },
  { size: '2/0 AWG', conductors: '4C', odMm: 39.5, weightKgKm: 3100, ampFreeAir: 195, ampTray: 155 },
  { size: '3/0 AWG', conductors: '4C', odMm: 42.5, weightKgKm: 3700, ampFreeAir: 225, ampTray: 180 },
  { size: '4/0 AWG', conductors: '4C', odMm: 45.5, weightKgKm: 4350, ampFreeAir: 260, ampTray: 205 },
  // 3-conductor + ground
  { size: '14 AWG', conductors: '3C+G', odMm: 16.0, weightKgKm: 350, ampFreeAir: 25, ampTray: 20 },
  { size: '12 AWG', conductors: '3C+G', odMm: 17.0, weightKgKm: 420, ampFreeAir: 30, ampTray: 25 },
  { size: '10 AWG', conductors: '3C+G', odMm: 19.0, weightKgKm: 550, ampFreeAir: 40, ampTray: 35 },
  { size: '8 AWG', conductors: '3C+G', odMm: 22.0, weightKgKm: 780, ampFreeAir: 55, ampTray: 45 },
  { size: '6 AWG', conductors: '3C+G', odMm: 24.5, weightKgKm: 1020, ampFreeAir: 75, ampTray: 60 },
  { size: '4 AWG', conductors: '3C+G', odMm: 27.0, weightKgKm: 1320, ampFreeAir: 95, ampTray: 80 },
  { size: '2 AWG', conductors: '3C+G', odMm: 30.5, weightKgKm: 1720, ampFreeAir: 130, ampTray: 105 },
  { size: '1/0 AWG', conductors: '3C+G', odMm: 36.0, weightKgKm: 2500, ampFreeAir: 170, ampTray: 140 },
  { size: '2/0 AWG', conductors: '3C+G', odMm: 38.5, weightKgKm: 2950, ampFreeAir: 195, ampTray: 155 },
  { size: '3/0 AWG', conductors: '3C+G', odMm: 41.0, weightKgKm: 3500, ampFreeAir: 225, ampTray: 180 },
  { size: '4/0 AWG', conductors: '3C+G', odMm: 44.0, weightKgKm: 4100, ampFreeAir: 260, ampTray: 205 },
]

interface GlandEntry {
  cableSize: string
  conductors: string
  cableOdMin: number
  cableOdMax: number
  armorOdMin: number
  armorOdMax: number
  glandTradeSize: string
  torqueNm: string
}

const glandData: GlandEntry[] = [
  { cableSize: '14 AWG', conductors: '3C', cableOdMin: 14.5, cableOdMax: 16.5, armorOdMin: 12.0, armorOdMax: 14.0, glandTradeSize: '1/2"', torqueNm: '20-27' },
  { cableSize: '12 AWG', conductors: '3C', cableOdMin: 15.3, cableOdMax: 17.3, armorOdMin: 12.5, armorOdMax: 14.5, glandTradeSize: '1/2"', torqueNm: '20-27' },
  { cableSize: '10 AWG', conductors: '3C', cableOdMin: 16.8, cableOdMax: 18.8, armorOdMin: 14.0, armorOdMax: 16.0, glandTradeSize: '1/2"', torqueNm: '20-27' },
  { cableSize: '8 AWG', conductors: '3C', cableOdMin: 19.5, cableOdMax: 21.5, armorOdMin: 16.5, armorOdMax: 18.5, glandTradeSize: '3/4"', torqueNm: '35-41' },
  { cableSize: '6 AWG', conductors: '3C', cableOdMin: 22.0, cableOdMax: 24.0, armorOdMin: 19.0, armorOdMax: 21.0, glandTradeSize: '3/4"', torqueNm: '35-41' },
  { cableSize: '4 AWG', conductors: '3C', cableOdMin: 24.5, cableOdMax: 26.5, armorOdMin: 21.0, armorOdMax: 23.5, glandTradeSize: '1"', torqueNm: '47-54' },
  { cableSize: '3 AWG', conductors: '3C', cableOdMin: 25.8, cableOdMax: 27.8, armorOdMin: 22.5, armorOdMax: 24.5, glandTradeSize: '1"', torqueNm: '47-54' },
  { cableSize: '2 AWG', conductors: '3C', cableOdMin: 27.5, cableOdMax: 29.5, armorOdMin: 24.0, armorOdMax: 26.0, glandTradeSize: '1"', torqueNm: '47-54' },
  { cableSize: '1 AWG', conductors: '3C', cableOdMin: 30.0, cableOdMax: 32.0, armorOdMin: 26.5, armorOdMax: 28.5, glandTradeSize: '1-1/4"', torqueNm: '68-75' },
  { cableSize: '1/0 AWG', conductors: '3C', cableOdMin: 32.5, cableOdMax: 34.5, armorOdMin: 28.5, armorOdMax: 31.0, glandTradeSize: '1-1/4"', torqueNm: '68-75' },
  { cableSize: '2/0 AWG', conductors: '3C', cableOdMin: 34.5, cableOdMax: 36.5, armorOdMin: 30.5, armorOdMax: 33.0, glandTradeSize: '1-1/2"', torqueNm: '75-82' },
  { cableSize: '3/0 AWG', conductors: '3C', cableOdMin: 37.0, cableOdMax: 39.0, armorOdMin: 33.0, armorOdMax: 35.5, glandTradeSize: '1-1/2"', torqueNm: '75-82' },
  { cableSize: '4/0 AWG', conductors: '3C', cableOdMin: 40.0, cableOdMax: 42.0, armorOdMin: 35.5, armorOdMax: 38.0, glandTradeSize: '2"', torqueNm: '95-102' },
  { cableSize: '250 MCM', conductors: '3C', cableOdMin: 43.0, cableOdMax: 45.0, armorOdMin: 38.0, armorOdMax: 41.0, glandTradeSize: '2"', torqueNm: '95-102' },
  { cableSize: '350 MCM', conductors: '3C', cableOdMin: 48.5, cableOdMax: 50.5, armorOdMin: 43.0, armorOdMax: 46.0, glandTradeSize: '2-1/2"', torqueNm: '122-136' },
  { cableSize: '500 MCM', conductors: '3C', cableOdMin: 56.0, cableOdMax: 58.0, armorOdMin: 50.0, armorOdMax: 53.0, glandTradeSize: '3"', torqueNm: '163-176' },
]

interface ComparisonEntry {
  cable: string
  voltage: string
  temp: string
  armor: string
  wetRated: boolean
  miningUse: string
  pros: string
  cons: string
}

const comparisonData: ComparisonEntry[] = [
  { cable: 'TECK90', voltage: '600V / 1000V', temp: '90\°C', armor: 'Interlocked aluminum + PVC jacket', wetRated: true, miningUse: 'Primary power cable for fixed installations', pros: 'Armor protection, wet-rated, armor as bonding, cable tray approved, direct burial', cons: 'Heavier than non-armored, requires gland termination, higher cost' },
  { cable: 'AC90', voltage: '600V', temp: '90\°C', armor: 'Interlocked aluminum (no outer jacket)', wetRated: false, miningUse: 'Dry areas only - offices, control rooms', pros: 'Lower cost than TECK, armor bonding, widely available', cons: 'Dry locations only, no outer jacket means no moisture protection' },
  { cable: 'ACWU90', voltage: '600V', temp: '90\°C', armor: 'Interlocked aluminum + moisture barrier + PVC', wetRated: true, miningUse: 'Alternative to TECK in some wet areas', pros: 'Wet-rated, armor bonding, available in large sizes', cons: 'Less common in mining, less mechanical protection than TECK' },
  { cable: 'SHD-GC', voltage: '5kV - 25kV', temp: '90\°C', armor: 'Heavy rubber jacket (no metal armor)', wetRated: true, miningUse: 'Trailing cable for mobile equipment >5kV', pros: 'Highly flexible, ground check monitoring, designed for dragging', cons: 'No mechanical armor, expensive, requires special terminations' },
  { cable: 'NMD90', voltage: '300V', temp: '90\°C', armor: 'None - PVC jacket only', wetRated: false, miningUse: 'Not permitted in mining', pros: 'Low cost, easy to work with, standard residential cable', cons: 'No armor, dry only, concealed only, 300V max, not for industrial' },
  { cable: 'RW90/THWN', voltage: '600V', temp: '90\°C', armor: 'None - single conductor, insulation only', wetRated: true, miningUse: 'In conduit/raceway systems', pros: 'Flexible routing in conduit, wet-rated, many sizes available', cons: 'Requires conduit, no standalone mechanical protection, labor-intensive' },
]

/* ==================== STYLES ==================== */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
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
  gap: 4,
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

const cardTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 10,
}

const tableWrapStyle: React.CSSProperties = {
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--divider)',
}

const thStyle: React.CSSProperties = {
  padding: '10px 10px',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: 0.3,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  background: 'var(--surface)',
  borderBottom: '2px solid var(--divider)',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 10px',
  fontSize: 13,
  color: 'var(--text)',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--divider)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 56,
  padding: '0 16px',
  background: 'var(--input-bg)',
  border: '2px solid var(--input-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 16,
  color: 'var(--text)',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  paddingRight: 40,
}

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid var(--divider)',
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  display: 'block',
}

const stepStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  padding: '10px 0',
  borderBottom: '1px solid var(--divider)',
}

const stepNumStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: 'var(--primary)',
  color: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  fontWeight: 700,
  flexShrink: 0,
}

const warningBoxStyle: React.CSSProperties = {
  background: 'rgba(255, 60, 60, 0.1)',
  border: '1px solid rgba(255, 60, 60, 0.3)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  fontSize: 13,
  color: 'var(--text)',
  lineHeight: 1.5,
}

const tipBoxStyle: React.CSSProperties = {
  background: 'rgba(255, 215, 0, 0.08)',
  border: '1px solid rgba(255, 215, 0, 0.25)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  fontSize: 13,
  color: 'var(--text)',
  lineHeight: 1.5,
}

/* ==================== COMPONENT ==================== */

export default function TECKCablePage() {
  const [tab, setTab] = useState<TabKey>('specs')
  const [specFilter, setSpecFilter] = useState<string>('3C')
  const [glandSize, setGlandSize] = useState<string>('10 AWG')
  const [glandConductors, setGlandConductors] = useState<string>('3C')
  const [bendOd, setBendOd] = useState<string>('')

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'specs', label: 'Specs' },
    { key: 'gland', label: 'Gland Sizing' },
    { key: 'install', label: 'Installation' },
    { key: 'troubleshoot', label: 'Troubleshooting' },
    { key: 'compare', label: 'Comparison' },
  ]

  const filteredSpecs = cableSpecs.filter(s => s.conductors === specFilter)

  const matchedGland = glandData.find(g => g.cableSize === glandSize && g.conductors === glandConductors)

  const bendOdNum = parseFloat(bendOd)
  const minBendRadius = bendOdNum > 0 ? bendOdNum * 12 : 0

  /* ---------- Specs Tab ---------- */
  function renderSpecs() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Construction Overview */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>TECK90 Construction</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text)' }}>Conductors:</strong> Annealed copper, Class B stranding</div>
            <div><strong style={{ color: 'var(--text)' }}>Insulation:</strong> XLPE (cross-linked polyethylene), rated 90{'\°'}C wet and dry</div>
            <div><strong style={{ color: 'var(--text)' }}>Inner Jacket:</strong> PVC, provides additional moisture barrier</div>
            <div><strong style={{ color: 'var(--text)' }}>Armor:</strong> Interlocked aluminum alloy, provides mechanical protection and bonding path</div>
            <div><strong style={{ color: 'var(--text)' }}>Outer Jacket:</strong> PVC, sunlight and moisture resistant (black standard)</div>
            <div><strong style={{ color: 'var(--text)' }}>Voltage Rating:</strong> 600V and 1000V (most common ratings)</div>
            <div><strong style={{ color: 'var(--text)' }}>Temperature:</strong> 90{'\°'}C wet/dry &mdash; the "90" in TECK90 is the temperature rating</div>
            <div><strong style={{ color: 'var(--text)' }}>CSA Markings:</strong> CSA C22.2 No. 131, cCSAus listed, rated voltage, conductor size, date of manufacture</div>
          </div>
        </div>

        {/* Conductor config filter */}
        <div>
          <label style={labelStyle}>Conductor Configuration</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['2C', '3C', '4C', '3C+G'].map(cfg => (
              <button key={cfg} onClick={() => setSpecFilter(cfg)} style={{
                minHeight: 44,
                padding: '0 16px',
                borderRadius: 22,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                border: specFilter === cfg ? '2px solid var(--primary)' : '2px solid var(--divider)',
                background: specFilter === cfg ? 'var(--primary)' : 'transparent',
                color: specFilter === cfg ? '#000' : 'var(--text-secondary)',
              }}>
                {cfg}
              </button>
            ))}
          </div>
        </div>

        {/* Specs table */}
        <div style={tableWrapStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
            <thead>
              <tr>
                <th style={thStyle}>Size</th>
                <th style={thStyle}>Config</th>
                <th style={thStyle}>OD (mm)</th>
                <th style={thStyle}>Wt (kg/km)</th>
                <th style={{ ...thStyle, color: 'var(--primary)' }}>Free Air (A)</th>
                <th style={{ ...thStyle, color: 'var(--primary)' }}>Tray (A)</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecs.map((s, i) => (
                <tr key={s.size + s.conductors} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{s.size}</td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{s.conductors}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{s.odMm.toFixed(1)}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{s.weightKgKm}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>{s.ampFreeAir}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>{s.ampTray}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ampacity note */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>Ampacity Note:</strong> Values shown are for 75{'\°'}C column per CEC Table 2 (copper conductors). Free air values assume single cable with no grouping derating. Tray values assume single-layer installation. Apply CEC Table 5C correction factors when cables are grouped or bundled. Always verify with manufacturer data and the latest CEC edition.
        </div>
      </div>
    )
  }

  /* ---------- Gland Sizing Tab ---------- */
  function renderGland() {
    const allSizes = [...new Set(glandData.map(g => g.cableSize))]
    const allConductors = [...new Set(glandData.map(g => g.conductors))]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Gland calculator */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Gland Size Calculator</div>

          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Cable Size</label>
            <select value={glandSize} onChange={e => setGlandSize(e.target.value)} style={selectStyle}>
              {allSizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Conductors</label>
            <select value={glandConductors} onChange={e => setGlandConductors(e.target.value)} style={selectStyle}>
              {allConductors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {matchedGland ? (
            <div style={{
              background: 'var(--input-bg)',
              border: '2px solid var(--primary)',
              borderRadius: 'var(--radius-sm)',
              padding: 14,
              marginTop: 8,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 10 }}>
                Result
              </div>
              <div style={infoRowStyle}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Gland Trade Size</span>
                <span style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>{matchedGland.glandTradeSize}</span>
              </div>
              <div style={infoRowStyle}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Cable OD Range</span>
                <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{matchedGland.cableOdMin} - {matchedGland.cableOdMax} mm</span>
              </div>
              <div style={infoRowStyle}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Armor OD Range</span>
                <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{matchedGland.armorOdMin} - {matchedGland.armorOdMax} mm</span>
              </div>
              <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Locknut Torque</span>
                <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{matchedGland.torqueNm} N{'\·'}m</span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
              No gland data for this size/conductor combination. Select a 3C configuration for the full reference.
            </div>
          )}
        </div>

        {/* Gland types */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Common TECK Gland Types</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>CGB (Cable Gland Body)</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                Most common TECK connector in mining. Compression-style fitting that grips the interlocked armor. Available in aluminum and steel. Provides bonding through armor contact. Used in junction boxes, panels, and enclosures. Thomas &amp; Betts / ABB is the dominant brand.
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--divider)' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>TMC (TECK Mini Connector)</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                Compact version of the CGB for tight spaces. Same compression principle but shorter body. Good for crowded junction boxes. Smaller sizes (14 AWG to 4 AWG typically). Faster installation due to simpler design.
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--divider)' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>DERA (Double-Ended Right Angle)</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                90-degree entry connector for TECK cable. Used when cable must enter an enclosure from the side. Common on motor junction boxes and equipment mounted near walls. Larger profile but eliminates the need for a separate cable bend at the enclosure.
              </div>
            </div>
          </div>
        </div>

        {/* Full gland reference table */}
        <div style={cardTitleStyle}>Gland Reference Table (3C TECK90)</div>
        <div style={tableWrapStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr>
                <th style={thStyle}>Cable Size</th>
                <th style={thStyle}>Cable OD (mm)</th>
                <th style={thStyle}>Armor OD (mm)</th>
                <th style={{ ...thStyle, color: 'var(--primary)' }}>Gland Size</th>
                <th style={thStyle}>Torque (N{'\·'}m)</th>
              </tr>
            </thead>
            <tbody>
              {glandData.map((g, i) => (
                <tr key={g.cableSize} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{g.cableSize}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{g.cableOdMin}-{g.cableOdMax}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{g.armorOdMin}-{g.armorOdMax}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>{g.glandTradeSize}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{g.torqueNm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gland tips */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Gland Installation Tips</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text)' }}>Armor Trimming:</strong> Leave 25-38mm (1"-1.5") of armor extending past the outer jacket cut. The armor must fully engage in the gland cone. Too short and the gland cannot grip; too long and it interferes with conductor routing.</div>
            <div><strong style={{ color: 'var(--text)' }}>Grounding the Armor:</strong> The CGB gland bonds the aluminum armor to the enclosure through metal-to-metal contact. Ensure the locknut is tight against a clean, unpainted knockout surface. Use a bonding bushing if the enclosure has a painted surface around the knockout.</div>
            <div><strong style={{ color: 'var(--text)' }}>Jacket Stripping:</strong> Strip outer PVC jacket back approximately 75-100mm (3"-4") from the cable end for standard glands. Adjust based on the specific gland body length. Score the jacket carefully with a utility knife &mdash; do not cut into the armor.</div>
            <div><strong style={{ color: 'var(--text)' }}>Inner Jacket:</strong> After removing the armor section, strip the inner PVC jacket back just enough to separate the conductors for termination. Leave as much inner jacket intact as possible for moisture protection.</div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- Installation Tab ---------- */
  function renderInstall() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Bending radius calculator */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Bending Radius Calculator</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
            CEC Rule 12-614: Minimum bending radius for TECK90 cable is <strong style={{ color: 'var(--text)' }}>12 times the overall cable diameter</strong>.
          </div>
          <label style={labelStyle}>Cable Overall Diameter (mm)</label>
          <input
            type="text"
            inputMode="decimal"
            value={bendOd}
            onChange={e => setBendOd(e.target.value)}
            placeholder="e.g., 28.5"
            style={inputStyle}
          />
          {minBendRadius > 0 && (
            <div style={{
              marginTop: 12,
              background: 'var(--input-bg)',
              border: '2px solid var(--primary)',
              borderRadius: 'var(--radius-sm)',
              padding: 14,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Minimum Bending Radius</div>
              <div style={{ fontSize: 24, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                {minBendRadius.toFixed(0)} mm
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                ({(minBendRadius / 25.4).toFixed(1)}" / {(minBendRadius / 1000).toFixed(3)} m)
              </div>
            </div>
          )}
        </div>

        {/* Quick reference bending radii */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Common Bending Radii (3C TECK90)</div>
          <div style={tableWrapStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 340 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Cable Size</th>
                  <th style={thStyle}>OD (mm)</th>
                  <th style={{ ...thStyle, color: 'var(--primary)' }}>Min Bend (mm)</th>
                  <th style={{ ...thStyle, color: 'var(--primary)' }}>Min Bend (in)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: '10 AWG', od: 17.8, bend: 214 },
                  { size: '6 AWG', od: 23.0, bend: 276 },
                  { size: '4 AWG', od: 25.5, bend: 306 },
                  { size: '2 AWG', od: 28.5, bend: 342 },
                  { size: '1/0 AWG', od: 33.5, bend: 402 },
                  { size: '2/0 AWG', od: 35.5, bend: 426 },
                  { size: '3/0 AWG', od: 38.0, bend: 456 },
                  { size: '4/0 AWG', od: 41.0, bend: 492 },
                  { size: '250 MCM', od: 44.0, bend: 528 },
                  { size: '350 MCM', od: 49.5, bend: 594 },
                  { size: '500 MCM', od: 57.0, bend: 684 },
                ].map((r, i) => (
                  <tr key={r.size} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{r.size}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{r.od}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>{r.bend}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{(r.bend / 25.4).toFixed(1)}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support spacing */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Support &amp; Strap Spacing</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
            Per CEC Rule 12-612, TECK90 cable must be supported at the following intervals:
          </div>
          <div style={infoRowStyle}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Horizontal runs</span>
            <span style={{ fontSize: 16, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>1.5 m (5 ft)</span>
          </div>
          <div style={infoRowStyle}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Vertical runs</span>
            <span style={{ fontSize: 16, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>2.0 m (6.5 ft)</span>
          </div>
          <div style={infoRowStyle}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Within 300mm of each box/fitting</span>
            <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>Required</span>
          </div>
          <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Cable tray (single layer)</span>
            <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>No tie-down needed</span>
          </div>
        </div>

        {/* Pulling tension */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Pulling Tension Limits</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text)' }}>Maximum sidewall pressure:</strong> 890 N/m (60 lbs/ft) of bend radius</div>
            <div><strong style={{ color: 'var(--text)' }}>Maximum pulling tension on copper:</strong> 53 MPa (8000 psi) on conductor cross-section area</div>
            <div><strong style={{ color: 'var(--text)' }}>Pull by armor:</strong> Never pull TECK cable by the armor alone. Use a proper pulling grip on the conductors or a manufacturer-approved pulling eye.</div>
            <div><strong style={{ color: 'var(--text)' }}>Pulling lubricant:</strong> Use approved cable-pulling lubricant (e.g., Ideal Yellow 77, Greenlee Winter Gel). Apply generously, especially for longer runs and runs with bends.</div>
          </div>
        </div>

        {/* Cable tray notes */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Cable Tray Installation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text)' }}>Single layer:</strong> TECK cables should be laid in a single layer in cable tray where possible. This maximizes ampacity and avoids derating.</div>
            <div><strong style={{ color: 'var(--text)' }}>Stacked/bundled:</strong> When cables are stacked or bundled in tray, apply CEC Table 5C derating factors. For 4-6 cables grouped, derate to 80%. For 7-24 cables, derate to 70%.</div>
            <div><strong style={{ color: 'var(--text)' }}>Fill calculation:</strong> Maximum 40% fill of tray cross-section for multiconductor cables (CEC Rule 12-2202).</div>
            <div><strong style={{ color: 'var(--text)' }}>Tray type:</strong> Ladder tray is preferred in mining for ventilation. Ventilated trough also acceptable. Solid-bottom tray requires additional derating.</div>
            <div><strong style={{ color: 'var(--text)' }}>Separation:</strong> Maintain separation between power cables (&gt;30V) and control/signal cables. Use dividers or separate trays per CEC Rule 12-904.</div>
          </div>
        </div>

        {/* Termination procedure */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Termination Procedure</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={stepStyle}>
              <div style={stepNumStyle}>1</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Strip Outer Jacket</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                  Measure back 75-100mm from the cable end. Score the PVC outer jacket circumferentially with a utility knife. Do not cut into the aluminum armor. Slide the jacket off the end. For longer gland bodies, increase strip length accordingly.
                </div>
              </div>
            </div>
            <div style={stepStyle}>
              <div style={stepNumStyle}>2</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Cut the Armor</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                  Use a proper armor cutter (e.g., Roto-Split) &mdash; <strong style={{ color: '#ff3c3c' }}>NEVER use a hacksaw</strong>, as it will damage the inner jacket and conductors. Cut the armor leaving 25-38mm extending past the outer jacket. Twist off the cut section and deburr the armor edge with pliers.
                </div>
              </div>
            </div>
            <div style={stepStyle}>
              <div style={stepNumStyle}>3</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Remove Inner Jacket</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                  Carefully score and remove the PVC inner jacket from the exposed conductor area. Take care not to nick the conductor insulation. Leave as much inner jacket intact as possible up to where the conductors need to separate.
                </div>
              </div>
            </div>
            <div style={stepStyle}>
              <div style={stepNumStyle}>4</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Fan Out Conductors</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                  Separate the conductors gently. If a filler is present, cut it back flush with the inner jacket. Maintain the conductor color coding: Black, Red, Blue (3-phase), White (neutral), Green (ground) per CEC.
                </div>
              </div>
            </div>
            <div style={stepStyle}>
              <div style={stepNumStyle}>5</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Install Gland Body</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                  Slide the gland nut and compression ring onto the cable before inserting through the knockout. Insert the cable through the gland body. The armor end must seat fully into the gland cone. Tighten the compression nut to clamp the armor securely.
                </div>
              </div>
            </div>
            <div style={{ ...stepStyle, borderBottom: 'none' }}>
              <div style={stepNumStyle}>6</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Torque Locknut</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
                  Tighten the locknut against the enclosure wall to the specified torque. This creates the bonding connection between the cable armor and the enclosure. Ensure metal-to-metal contact &mdash; remove paint from knockout area if necessary. Verify the cable cannot rotate or pull out.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety warning */}
        <div style={warningBoxStyle}>
          <strong>Sharp Armor Edges:</strong> Cut aluminum armor has razor-sharp edges. Always wear leather gloves when handling cut TECK cable. Deburr armor ends immediately after cutting. Improperly deburred armor can slice through conductor insulation and cause ground faults.
        </div>
      </div>
    )
  }

  /* ---------- Troubleshooting Tab ---------- */
  function renderTroubleshoot() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Insulation resistance testing */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Insulation Resistance Testing (Megger)</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
            Test each conductor to ground (armor) and conductor to conductor. Disconnect all loads and devices before testing.
          </div>
          <div style={tableWrapStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Cable Voltage Rating</th>
                  <th style={thStyle}>Test Voltage (DC)</th>
                  <th style={{ ...thStyle, color: 'var(--primary)' }}>Min Acceptable (M{'Ω'})</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rating: '600V', testV: '1000V DC', minMohm: '100' },
                  { rating: '1000V', testV: '2500V DC', minMohm: '100' },
                  { rating: '5kV (SHD-GC ref)', testV: '5000V DC', minMohm: '1000' },
                ].map((r, i) => (
                  <tr key={r.rating} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{r.rating}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{r.testV}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>{r.minMohm} M{'Ω'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Rule of thumb: Minimum 1 M{'Ω'} per kV of rated voltage + 1 M{'Ω'}. New cable should read significantly higher. Temperature and humidity affect readings &mdash; correct to 40{'\°'}C baseline. Readings that decrease over 60 seconds indicate moisture ingress.
          </div>
        </div>

        {/* Armor continuity */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Armor Continuity Testing</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text)' }}>Method:</strong> Use a low-resistance ohmmeter or milliohmmeter. Test end-to-end on the aluminum armor.</div>
            <div><strong style={{ color: 'var(--text)' }}>Expected values:</strong> Less than 1 {'Ω'} for short runs (&lt;30m). For longer runs, approximately 0.03-0.05 {'Ω'}/m for typical TECK armor. A reading above 1 {'Ω'} for short runs suggests a damaged or broken armor interlock.</div>
            <div><strong style={{ color: 'var(--text)' }}>Gland connection:</strong> Also test from armor to enclosure through the gland. This should read near zero. A high reading indicates a poor bonding connection at the gland &mdash; retorque or clean the contact surfaces.</div>
          </div>
        </div>

        {/* Common failure modes */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Common Failure Modes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                mode: 'Moisture Ingress',
                symptoms: 'Decreasing insulation resistance over time, nuisance ground fault trips, corrosion at terminations',
                cause: 'Damaged outer jacket, improperly sealed glands, submerged cable without proper rating',
                fix: 'Replace damaged cable section. Ensure glands are properly torqued and sealed. Use compound-filled glands in wet environments.',
              },
              {
                mode: 'Mechanical Damage',
                symptoms: 'Visible dents or crush marks on armor, intermittent ground faults, reduced insulation resistance at damage point',
                cause: 'Impact from equipment, vehicles, or falling material. Cable not properly protected or supported.',
                fix: 'Cut out damaged section and splice (if code permits) or replace the run. Add mechanical protection (guard plates, conduit sleeves) at vulnerable points.',
              },
              {
                mode: 'Armor Corrosion',
                symptoms: 'White powdery deposits on aluminum armor, increased armor resistance, armor breaks during bending',
                cause: 'Exposure to chemicals, concrete, alkaline water, or dissimilar metal contact (galvanic corrosion)',
                fix: 'Replace corroded cable. Avoid direct contact with concrete. Use PVC-jacketed TECK (standard) and isolate from copper/steel at contact points.',
              },
              {
                mode: 'Insulation Breakdown',
                symptoms: 'Phase-to-ground or phase-to-phase faults, overcurrent device tripping, smoke or burn marks',
                cause: 'Overloading, thermal aging, manufacturing defect, physical damage to insulation during installation',
                fix: 'Identify and replace failed cable. Verify circuit loading is within ampacity. Check for derating factors that may have been overlooked.',
              },
            ].map((f, i) => (
              <div key={i} style={{
                borderLeft: '4px solid var(--primary)',
                paddingLeft: 12,
                paddingBottom: 8,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{f.mode}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 2 }}>
                  <strong style={{ color: 'var(--text)' }}>Symptoms:</strong> {f.symptoms}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 2 }}>
                  <strong style={{ color: 'var(--text)' }}>Cause:</strong> {f.cause}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text)' }}>Fix:</strong> {f.fix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thermal imaging */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Thermal Imaging Tips</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text)' }}>Connections:</strong> Scan all TECK gland terminations under load. Temperature difference of more than 10{'\°'}C between similar connections indicates a problem. More than 40{'\°'}C above ambient is critical.</div>
            <div><strong style={{ color: 'var(--text)' }}>Cable runs:</strong> Hot spots along a cable run may indicate damaged armor causing eddy current heating, or a high-resistance splice point.</div>
            <div><strong style={{ color: 'var(--text)' }}>Load requirement:</strong> Cable should be at minimum 40% of rated load for meaningful thermal scans. Scan under typical operating conditions for best results.</div>
            <div><strong style={{ color: 'var(--text)' }}>Emissivity:</strong> Set emissivity to 0.90-0.95 for PVC jacket surface. For bare aluminum armor, use 0.05-0.10 (highly reflective &mdash; thermal readings of bare armor are unreliable).</div>
          </div>
        </div>

        {/* Hi-pot and VLF */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Hi-Pot &amp; VLF Testing</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <div>
              <strong style={{ color: 'var(--text)' }}>DC Hi-Pot (600V TECK90):</strong>
              <div>Test voltage: Typically 2x rated voltage + 1000V = 2200V DC for acceptance testing. Maintenance test: 60% of acceptance value (1320V DC). Apply for 1 minute. No breakdown = pass.</div>
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>DC Hi-Pot (1000V TECK90):</strong>
              <div>Test voltage: 3000V DC for acceptance. Maintenance test: 1800V DC. Apply for 1 minute.</div>
            </div>
            <div>
              <strong style={{ color: 'var(--text)' }}>VLF Testing (Very Low Frequency):</strong>
              <div>Preferred over DC for XLPE-insulated cables on longer runs (&gt;100m). VLF at 0.1 Hz stresses the insulation more uniformly than DC. Test at 3x U0 for acceptance (1800V peak for 600V cables). VLF detects water trees and insulation defects that DC testing may miss.</div>
            </div>
          </div>
        </div>

        <div style={tipBoxStyle}>
          <strong>Testing Tip:</strong> Always discharge the cable after DC or VLF testing. XLPE insulation retains charge &mdash; ground each conductor for at least 4x the test duration before handling. Use a proper discharge resistor (never short directly).
        </div>
      </div>
    )
  }

  /* ---------- Comparison Tab ---------- */
  function renderCompare() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Quick comparison table */}
        <div style={cardTitleStyle}>Cable Comparison for Mining</div>
        <div style={tableWrapStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr>
                <th style={thStyle}>Cable</th>
                <th style={thStyle}>Voltage</th>
                <th style={thStyle}>Armor</th>
                <th style={thStyle}>Wet</th>
                <th style={thStyle}>Mining Use</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((c, i) => (
                <tr key={c.cable} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: c.cable === 'TECK90' ? 'var(--primary)' : 'var(--text)' }}>{c.cable}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{c.voltage}</td>
                  <td style={{ ...tdStyle, fontSize: 12, whiteSpace: 'normal', minWidth: 120 }}>{c.armor}</td>
                  <td style={{ ...tdStyle, color: c.wetRated ? '#4caf50' : '#f44336', fontWeight: 700 }}>{c.wetRated ? 'Yes' : 'No'}</td>
                  <td style={{ ...tdStyle, fontSize: 12, whiteSpace: 'normal', minWidth: 140 }}>{c.miningUse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed comparison cards */}
        {comparisonData.map(c => (
          <div key={c.cable} style={{
            ...cardStyle,
            borderLeft: c.cable === 'TECK90' ? '4px solid var(--primary)' : '4px solid var(--divider)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: c.cable === 'TECK90' ? 'var(--primary)' : 'var(--text)',
              }}>
                {c.cable}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.voltage} &bull; {c.temp}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, lineHeight: 1.5 }}>
              <div>
                <span style={{ color: '#4caf50', marginRight: 6 }}>+</span>
                <span style={{ color: 'var(--text-secondary)' }}>{c.pros}</span>
              </div>
              <div>
                <span style={{ color: '#f44336', marginRight: 6 }}>&ndash;</span>
                <span style={{ color: 'var(--text-secondary)' }}>{c.cons}</span>
              </div>
            </div>
          </div>
        ))}

        {/* CEC Rules */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>CEC Rules for TECK Cable</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text)' }}>Rule 12-610:</strong> TECK cable shall be installed in accordance with Rules 12-610 to 12-618. Permitted for exposed and concealed wiring in commercial, industrial, and mining installations.</div>
            <div><strong style={{ color: 'var(--text)' }}>Rule 12-612:</strong> Support intervals &mdash; horizontal 1.5m, vertical 2.0m. Secured within 300mm of every box, cabinet, or fitting.</div>
            <div><strong style={{ color: 'var(--text)' }}>Rule 12-614:</strong> Bending radius &mdash; minimum 12x overall cable diameter. Applies during and after installation.</div>
            <div><strong style={{ color: 'var(--text)' }}>Rule 12-616:</strong> Splices and taps permitted only in accessible junction boxes. Use approved connectors rated for the cable type and size.</div>
            <div><strong style={{ color: 'var(--text)' }}>Rule 12-618:</strong> TECK cable may be used in cable tray per Section 12 requirements. Single-layer preferred for maintaining ampacity.</div>
            <div><strong style={{ color: 'var(--text)' }}>Rule 10-616:</strong> The interlocking armor of TECK cable may serve as the equipment bonding conductor when terminated with approved glands (CGB type).</div>
          </div>
        </div>

        {/* Why TECK in mining */}
        <div style={{
          ...cardStyle,
          border: '2px solid var(--primary)',
        }}>
          <div style={cardTitleStyle}>Why TECK90 is Preferred in Mining</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <div><strong style={{ color: 'var(--text)' }}>Mechanical protection:</strong> The interlocked aluminum armor protects conductors from impact, crushing, and abrasion common in mining environments. Equipment, vehicles, and falling rock are constant hazards.</div>
            <div><strong style={{ color: 'var(--text)' }}>Moisture resistance:</strong> The PVC outer jacket and inner jacket provide a double moisture barrier. Mines are inherently wet environments with standing water, dripping, and high humidity.</div>
            <div><strong style={{ color: 'var(--text)' }}>Bonding through armor:</strong> The aluminum armor serves as an effective equipment bonding conductor when properly terminated. This eliminates the need for a separate bonding conductor in many installations, simplifying cable routing.</div>
            <div><strong style={{ color: 'var(--text)' }}>Versatility:</strong> TECK90 is approved for cable tray, direct burial, exposed runs, and even hazardous locations (with appropriate glands). One cable type handles most fixed installation needs in a mine.</div>
            <div><strong style={{ color: 'var(--text)' }}>Temperature rating:</strong> The 90{'\°'}C rating handles the elevated ambient temperatures found in deep mines. Combined with XLPE insulation, it resists thermal degradation over long service life.</div>
            <div><strong style={{ color: 'var(--text)' }}>Ontario standard:</strong> TECK90 is the de facto standard cable for fixed installations in Ontario mining operations. Electricians, maintenance crews, and supply chains are all built around TECK cable. Glands, tools, and training are universally available.</div>
          </div>
        </div>
      </div>
    )
  }

  /* ==================== MAIN RENDER ==================== */

  return (
    <>
      <Header title="TECK90 Cable Reference" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tab pills */}
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

        {/* Tab content */}
        {tab === 'specs' && renderSpecs()}
        {tab === 'gland' && renderGland()}
        {tab === 'install' && renderInstall()}
        {tab === 'troubleshoot' && renderTroubleshoot()}
        {tab === 'compare' && renderCompare()}

        {/* Footer note */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>Reference Only:</strong> This is a field reference guide. Always verify specifications with the cable manufacturer's data sheets and the current edition of the Canadian Electrical Code. Cable dimensions and ampacities may vary by manufacturer. Follow your mine's specific Safe Work Procedures for all cable installation and testing work.
        </div>
      </div>
    </>
  )
}
