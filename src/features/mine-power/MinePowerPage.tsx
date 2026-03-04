import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Mine Power Distribution Quick Reference                            */
/* ------------------------------------------------------------------ */

type TabKey = 'voltages' | 'equipment' | 'formulas' | 'troubleshoot'

interface VoltageLevel {
  level: string
  voltage: string
  use: string
  protection: string
  color: string
}

interface MineEquipment {
  name: string
  typicalHP: string
  voltage: string
  typicalFLA: string
  notes: string
  category: string
}

interface Formula {
  name: string
  formula: string
  description: string
  example: string
}

interface TroubleshootItem {
  symptom: string
  causes: string[]
  checks: string[]
}

const voltageLevels: VoltageLevel[] = [
  {
    level: 'HV Distribution',
    voltage: '4160V / 13.8kV',
    use: 'Main mine power feed from utility, primary distribution to substations',
    protection: 'Relay-protected switchgear, differential protection, ground fault at 100mA',
    color: '#ff3c3c',
  },
  {
    level: 'MV Distribution',
    voltage: '2400V / 4160V',
    use: 'Large motors (crushers, hoists, fans, pumps), underground distribution',
    protection: 'VFDs, soft starters, ground fault protection, trailing cable monitors',
    color: '#ff8c00',
  },
  {
    level: 'LV Power',
    voltage: '600V / 575V',
    use: 'Most mine equipment: conveyors, compressors, smaller pumps, bolters, loaders',
    protection: 'Motor starters, MCCBs, ground fault at 100mA, trailing cable monitors',
    color: '#ffd700',
  },
  {
    level: 'LV Control',
    voltage: '120V / 240V',
    use: 'Lighting, controls, instrumentation, convenience power, battery chargers',
    protection: 'GFCI required underground (CEC), breaker panels, isolation transformers',
    color: '#4caf50',
  },
  {
    level: 'Intrinsically Safe',
    voltage: '12V / 24V DC',
    use: 'Gas detection, communications, PLC I/O in hazardous areas',
    protection: 'IS barriers, zener barriers, galvanic isolators',
    color: '#2196f3',
  },
]

const mineEquipment: MineEquipment[] = [
  { name: 'Underground Crusher', typicalHP: '200-500', voltage: '4160V', typicalFLA: '28-69A', notes: 'VFD common, high inrush', category: 'Processing' },
  { name: 'Conveyor Drive', typicalHP: '50-250', voltage: '575V', typicalFLA: '52-236A', notes: 'Multiple drives, regenerative braking', category: 'Processing' },
  { name: 'Mine Hoist', typicalHP: '500-5000+', voltage: '4160V/13.8kV', typicalFLA: '69-350A', notes: 'DC or AC VFD, dynamic braking, critical load', category: 'Hoisting' },
  { name: 'Main Vent Fan', typicalHP: '250-2000', voltage: '4160V', typicalFLA: '35-278A', notes: 'Critical — must run continuously', category: 'Ventilation' },
  { name: 'Auxiliary Fan', typicalHP: '15-75', voltage: '575V', typicalFLA: '16-74A', notes: 'Multiple per heading, reversible', category: 'Ventilation' },
  { name: 'Dewatering Pump', typicalHP: '50-500', voltage: '575V/4160V', typicalFLA: '52-69A', notes: 'Submersible, critical for safety', category: 'Pumping' },
  { name: 'Sump Pump', typicalHP: '5-25', voltage: '575V', typicalFLA: '6-25A', notes: 'Auto float switch, duplex common', category: 'Pumping' },
  { name: 'Jumbo Drill', typicalHP: '75-150', voltage: '575V', typicalFLA: '74-142A', notes: 'Trailing cable, high demand cycling', category: 'Development' },
  { name: 'LHD (Scoop)', typicalHP: '100-300', voltage: '575V', typicalFLA: '95-284A', notes: 'Battery or trailing cable, regenerative', category: 'Development' },
  { name: 'Bolter', typicalHP: '25-75', voltage: '575V', typicalFLA: '25-74A', notes: 'Trailing cable, intermittent load', category: 'Development' },
  { name: 'Shotcrete Machine', typicalHP: '50-100', voltage: '575V', typicalFLA: '52-95A', notes: 'High starting torque', category: 'Development' },
  { name: 'Air Compressor', typicalHP: '100-500', voltage: '575V/4160V', typicalFLA: '95-69A', notes: 'VFD for energy savings, constant load', category: 'Utilities' },
  { name: 'Battery Charger', typicalHP: '25-75 kW', voltage: '575V in / DC out', typicalFLA: '25-75A', notes: 'Harmonic distortion concern, ventilation req\'d', category: 'Utilities' },
  { name: 'Refuge Station', typicalHP: '5-10', voltage: '120V', typicalFLA: '42-83A', notes: 'Battery backup essential, life safety', category: 'Safety' },
]

const formulas: Formula[] = [
  {
    name: 'Motor FLA (3-Phase)',
    formula: 'FLA = HP × 746 / (V × \√3 × PF × Eff)',
    description: 'Calculate full load amps for a 3-phase motor',
    example: '100HP @ 575V, PF=0.85, Eff=0.92: FLA = 100×746/(575×1.732×0.85×0.92) = 96.2A',
  },
  {
    name: 'Voltage Drop',
    formula: 'VD = (2 × L × I × R) / 1000',
    description: 'Voltage drop in single conductor cable. L in metres, R in \Ω/km',
    example: '200m run, 95A, #1/0 Cu (0.397 \Ω/km): VD = 2×200×95×0.397/1000 = 15.1V (2.6%)',
  },
  {
    name: 'Transformer Sizing',
    formula: 'kVA = (V × I × \√3) / 1000',
    description: 'Required transformer kVA for known load',
    example: '575V, 500A load: kVA = 575×500×1.732/1000 = 498 kVA → use 500 kVA',
  },
  {
    name: 'Short Circuit (Approx)',
    formula: 'Isc = kVA × 1000 / (V × \√3 × Z%)',
    description: 'Approximate available fault current at transformer secondary',
    example: '1000 kVA, 575V, 5.75% Z: Isc = 1000×1000/(575×1.732×0.0575) = 17,451A',
  },
  {
    name: 'Cable Derating',
    formula: 'Adjusted Amp = Table Amp × TCF × BCF',
    description: 'TCF = Temperature Correction Factor, BCF = Bundling Correction Factor',
    example: '#2 Cu at 45°C ambient, 6 cables bundled: 130A × 0.87 × 0.70 = 79.2A',
  },
  {
    name: 'kW to HP',
    formula: 'HP = kW / 0.746',
    description: 'Convert kilowatts to horsepower',
    example: '75 kW motor = 75/0.746 = 100.5 HP',
  },
  {
    name: 'Ground Fault Trip Time',
    formula: 'Must trip \≤ 200ms at \≤ 100mA',
    description: 'Ontario mine regulation for ground fault protection on portable equipment',
    example: 'All trailing cable equipment and portable tools underground must have GFP meeting this spec',
  },
]

const troubleshootItems: TroubleshootItem[] = [
  {
    symptom: 'Motor won\'t start',
    causes: ['Overload tripped', 'Ground fault relay tripped', 'Control circuit fault', 'Mechanical binding', 'Low voltage at MCC'],
    checks: ['Check overload relay, reset if tripped', 'Check ground fault indicator on starter', 'Verify control voltage at contactor coil', 'Try to rotate shaft by hand if safe', 'Measure voltage at motor terminals'],
  },
  {
    symptom: 'Motor runs hot',
    causes: ['Overloaded', 'Low voltage (below 90%)', 'Single phasing', 'Poor ventilation', 'High ambient temperature'],
    checks: ['Measure current on all 3 phases', 'Check voltage at motor terminals', 'Look for open fuse or contactor tip', 'Inspect cooling fan and vents', 'Check ambient temp — apply derating'],
  },
  {
    symptom: 'Ground fault alarm',
    causes: ['Damaged cable insulation', 'Water in junction box', 'Failed motor winding', 'Damaged connector', 'Insulation degradation over time'],
    checks: ['Megger the cable (1M\Ω/kV + 1M\Ω minimum)', 'Inspect all J-boxes for moisture', 'Megger motor windings phase-to-ground', 'Inspect all connectors and plugs', 'Check insulation resistance trend records'],
  },
  {
    symptom: 'Breaker trips repeatedly',
    causes: ['Short circuit downstream', 'Overloaded circuit', 'Defective breaker', 'Ground fault', 'Inrush current from large motor'],
    checks: ['Disconnect loads, megger circuit', 'Compare load current to breaker rating', 'Try spare breaker of same rating', 'Run ground fault locator', 'Check if reduced voltage starter is working'],
  },
  {
    symptom: 'Voltage imbalance',
    causes: ['Unbalanced loading', 'Open connection on utility', 'Transformer tap mismatch', 'High-resistance connection', 'Single-phase load on 3-phase bus'],
    checks: ['Measure voltage on all 3 phases at bus', 'Check main connections for heat', 'Verify transformer tap positions match', 'Use thermal camera on connections', 'Review single-phase load distribution'],
  },
  {
    symptom: 'VFD fault / alarm',
    causes: ['Overcurrent', 'Overvoltage', 'Ground fault', 'Overtemperature', 'Communication loss'],
    checks: ['Read fault code on VFD display', 'Check DC bus voltage', 'Megger motor and cable', 'Check VFD room temperature / fans', 'Verify fiber or Ethernet connections'],
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

const tabItems: { key: TabKey; label: string }[] = [
  { key: 'voltages', label: 'Voltage Levels' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'formulas', label: 'Formulas' },
  { key: 'troubleshoot', label: 'Troubleshoot' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MinePowerPage() {
  const [tab, setTab] = useState<TabKey>('voltages')
  const [equipFilter, setEquipFilter] = useState('All')
  const [expandedTrouble, setExpandedTrouble] = useState<number | null>(null)

  const equipCategories = ['All', ...Array.from(new Set(mineEquipment.map(e => e.category)))]
  const filteredEquipment = equipFilter === 'All'
    ? mineEquipment
    : mineEquipment.filter(e => e.category === equipFilter)

  return (
    <>
      <Header title="Mine Power Systems" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tab pills */}
        <div style={pillRow}>
          {tabItems.map(t => (
            <button key={t.key} style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Voltage Levels */}
        {tab === 'voltages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Typical Mine Power Distribution
            </div>
            {voltageLevels.map(v => (
              <div key={v.level} style={{
                background: 'var(--surface)', border: '1px solid var(--divider)',
                borderRadius: 'var(--radius)', padding: '14px',
                borderLeft: `4px solid ${v.color}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{v.level}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                    color: v.color, fontSize: 15,
                  }}>
                    {v.voltage}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                  {v.use}
                </div>
                <div style={{
                  fontSize: 13, background: 'var(--input-bg)', borderRadius: 4,
                  padding: '6px 10px', color: 'var(--text-secondary)', lineHeight: 1.4,
                }}>
                  <strong style={{ color: 'var(--text)' }}>Protection:</strong> {v.protection}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Equipment */}
        {tab === 'equipment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Category filter */}
            <div style={pillRow}>
              {equipCategories.map(cat => (
                <button key={cat}
                  style={equipFilter === cat ? { ...pillBase, background: 'var(--primary-dim)', color: '#000', borderColor: 'var(--primary-dim)', fontWeight: 700, fontSize: 12 } : { ...pillBase, fontSize: 12 }}
                  onClick={() => setEquipFilter(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            {filteredEquipment.map((eq, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--divider)',
                borderRadius: 'var(--radius)', padding: '12px 14px',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                  {eq.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 13 }}>
                  <div><span style={{ color: 'var(--text-secondary)' }}>HP:</span> <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{eq.typicalHP}</span></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Voltage:</span> <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{eq.voltage}</span></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>FLA:</span> <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{eq.typicalFLA}</span></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Type:</span> <span style={{ color: 'var(--text)' }}>{eq.category}</span></div>
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--text-secondary)', marginTop: 6,
                  fontStyle: 'italic', lineHeight: 1.4,
                }}>
                  {eq.notes}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulas */}
        {tab === 'formulas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Essential Mine Electrical Formulas
            </div>
            {formulas.map((f, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--divider)',
                borderRadius: 'var(--radius)', padding: '14px',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                  {f.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600,
                  color: 'var(--primary)', padding: '8px 12px',
                  background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)',
                  marginBottom: 8,
                }}>
                  {f.formula}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
                  {f.description}
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--text-secondary)',
                  background: 'rgba(255,215,0,0.05)',
                  border: '1px solid rgba(255,215,0,0.15)',
                  borderRadius: 4, padding: '6px 10px', lineHeight: 1.5,
                }}>
                  <strong style={{ color: 'var(--primary)' }}>Example:</strong> {f.example}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Troubleshoot */}
        {tab === 'troubleshoot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Common Mine Electrical Troubleshooting
            </div>
            {troubleshootItems.map((item, idx) => {
              const isExpanded = expandedTrouble === idx
              return (
                <div key={idx} style={{
                  background: 'var(--surface)', border: '1px solid var(--divider)',
                  borderRadius: 'var(--radius)', overflow: 'hidden',
                }}>
                  <button onClick={() => setExpandedTrouble(isExpanded ? null : idx)} style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '14px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    minHeight: 56,
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', textAlign: 'left' }}>
                      {'\⚠\uFE0F'} {item.symptom}
                    </span>
                    <span style={{
                      color: 'var(--text-secondary)', fontSize: 20,
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform .2s',
                    }}>
                      {'\▼'}
                    </span>
                  </button>
                  {isExpanded && (
                    <div style={{ padding: '0 14px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#ff3c3c', textTransform: 'uppercase', marginBottom: 6 }}>
                        Possible Causes
                      </div>
                      {item.causes.map((c, i) => (
                        <div key={i} style={{
                          fontSize: 14, color: 'var(--text-secondary)', padding: '4px 0',
                          paddingLeft: 16, position: 'relative', lineHeight: 1.4,
                        }}>
                          <span style={{ position: 'absolute', left: 0, color: '#ff3c3c' }}>{'\•'}</span>
                          {c}
                        </div>
                      ))}

                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginTop: 12, marginBottom: 6 }}>
                        Checks / Actions
                      </div>
                      {item.checks.map((c, i) => (
                        <div key={i} style={{
                          fontSize: 14, color: 'var(--text-secondary)', padding: '4px 0',
                          paddingLeft: 24, position: 'relative', lineHeight: 1.4,
                        }}>
                          <span style={{
                            position: 'absolute', left: 0,
                            fontFamily: 'var(--font-mono)', fontWeight: 700,
                            color: 'var(--primary)', fontSize: 12,
                          }}>
                            {i + 1}.
                          </span>
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Reference */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)', padding: '12px 14px',
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong> CEC Section 76 (Temporary Wiring),
          O. Reg. 854 (Mines & Mining Plants), CSA M421 (Use of Electricity in Mines),
          CEC Table 44/45 (Motor FLC)
        </div>
      </div>
    </>
  )
}
