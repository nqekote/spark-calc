import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Hazardous Area Classification Data - CEC Section 18/20            */
/* ------------------------------------------------------------------ */

type TabKey = 'zones' | 'classes' | 'equipment' | 'common'

interface ZoneInfo {
  zone: string
  description: string
  examples: string
  equipmentReq: string
  color: string
}

interface ClassGroup {
  classNum: string
  title: string
  description: string
  divisions: { div: string; detail: string }[]
  groups: { group: string; substances: string }[]
}

interface EquipmentMarking {
  marking: string
  meaning: string
}

interface CommonArea {
  location: string
  classification: string
  notes: string
  mining?: boolean
}

const zones: ZoneInfo[] = [
  {
    zone: 'Zone 0',
    description: 'Explosive gas/vapour present continuously or for long periods',
    examples: 'Inside fuel tanks, inside vented process vessels',
    equipmentReq: 'Intrinsically safe only (Ex ia)',
    color: '#ff3c3c',
  },
  {
    zone: 'Zone 1',
    description: 'Explosive gas/vapour likely during normal operation',
    examples: 'Near fuel dispensers, around open vents, near pump seals',
    equipmentReq: 'Explosion-proof (Ex d), increased safety (Ex e), or intrinsically safe (Ex ib)',
    color: '#ff8c00',
  },
  {
    zone: 'Zone 2',
    description: 'Explosive gas/vapour not likely, only under abnormal conditions',
    examples: 'Surrounding Zone 1 areas, near flanged connections',
    equipmentReq: 'Non-sparking (Ex nA), restricted breathing (Ex nR), or energy limited (Ex nL)',
    color: '#ffd700',
  },
  {
    zone: 'Zone 20',
    description: 'Combustible dust cloud present continuously or frequently',
    examples: 'Inside dust collectors, inside silos, inside hoppers',
    equipmentReq: 'Protection by enclosure (Ex tD)',
    color: '#ff3c3c',
  },
  {
    zone: 'Zone 21',
    description: 'Combustible dust cloud likely during normal operation',
    examples: 'Near dust-producing machinery, around conveyor transfer points',
    equipmentReq: 'Dust ignition-proof (Ex tD), pressurized (Ex pD)',
    color: '#ff8c00',
  },
  {
    zone: 'Zone 22',
    description: 'Combustible dust cloud not likely, only under abnormal conditions',
    examples: 'Areas near Zone 21, around bagging operations',
    equipmentReq: 'Dust-tight enclosures, restricted breathing',
    color: '#ffd700',
  },
]

const classGroups: ClassGroup[] = [
  {
    classNum: 'Class I',
    title: 'Flammable Gases & Vapours',
    description: 'Locations where flammable gases or vapours may be present in sufficient quantities to be ignitable.',
    divisions: [
      { div: 'Division 1', detail: 'Hazardous concentrations exist during normal operations, maintenance, or during frequent repair' },
      { div: 'Division 2', detail: 'Hazardous concentrations only under abnormal conditions (failure, rupture, breakdown)' },
    ],
    groups: [
      { group: 'A', substances: 'Acetylene' },
      { group: 'B', substances: 'Hydrogen, butadiene, propylene oxide' },
      { group: 'C', substances: 'Ethylene, carbon monoxide, hydrogen sulphide' },
      { group: 'D', substances: 'Propane, gasoline, natural gas, diesel vapour, methane' },
    ],
  },
  {
    classNum: 'Class II',
    title: 'Combustible Dusts',
    description: 'Locations where combustible dust may be present. Very relevant to mining — ore dust, coal dust, sulfide dust.',
    divisions: [
      { div: 'Division 1', detail: 'Dust clouds exist during normal operations or cause conductive deposits on equipment' },
      { div: 'Division 2', detail: 'Dust deposits present but not normally suspended, or only under abnormal conditions' },
    ],
    groups: [
      { group: 'E', substances: 'Metal dusts: aluminum, magnesium, titanium' },
      { group: 'F', substances: 'Carbonaceous dusts: coal, coke, carbon black' },
      { group: 'G', substances: 'Grain, flour, wood, plastic, chemical dusts, sulfide ore dust' },
    ],
  },
  {
    classNum: 'Class III',
    title: 'Ignitible Fibres & Flyings',
    description: 'Locations where easily ignitible fibres or flyings are present but not normally in suspension.',
    divisions: [
      { div: 'Division 1', detail: 'Fibres manufactured, handled, or used in the area' },
      { div: 'Division 2', detail: 'Fibres stored or handled (not manufactured)' },
    ],
    groups: [
      { group: '—', substances: 'Cotton, rayon, sawdust, wood shavings, textile fibres' },
    ],
  },
]

const equipmentMarkings: EquipmentMarking[] = [
  { marking: 'Ex d', meaning: 'Flameproof / Explosion-proof enclosure' },
  { marking: 'Ex e', meaning: 'Increased safety (no sparks in normal use)' },
  { marking: 'Ex i (ia/ib)', meaning: 'Intrinsically safe (energy limited)' },
  { marking: 'Ex p', meaning: 'Pressurized enclosure' },
  { marking: 'Ex n', meaning: 'Non-sparking / Non-incendive' },
  { marking: 'Ex tD', meaning: 'Protection by enclosure (dust)' },
  { marking: 'Ex m', meaning: 'Encapsulation (sealed in resin)' },
  { marking: 'T1 (450\°C)', meaning: 'Lowest temperature class' },
  { marking: 'T2 (300\°C)', meaning: 'Common for most applications' },
  { marking: 'T3 (200\°C)', meaning: 'Gasoline, diesel applications' },
  { marking: 'T4 (135\°C)', meaning: 'Acetaldehyde, diethyl ether' },
  { marking: 'T5 (100\°C)', meaning: 'Carbon disulphide' },
  { marking: 'T6 (85\°C)', meaning: 'Most restrictive class' },
]

const commonAreas: CommonArea[] = [
  { location: 'Underground mine face (gassy mine)', classification: 'Class I, Div 1, Group D', notes: 'Methane present — all electrical intrinsically safe or explosion-proof', mining: true },
  { location: 'Mine crusher station', classification: 'Class II, Div 1, Group G', notes: 'Ore dust accumulation — dust-ignition-proof equipment required', mining: true },
  { location: 'Mine conveyor transfer points', classification: 'Class II, Div 1, Group G', notes: 'Dust clouds from ore transfer', mining: true },
  { location: 'Mine ore storage bins/silos', classification: 'Class II, Div 1, Group G (Zone 20 inside)', notes: 'Dust accumulation inside, dust clouds during filling', mining: true },
  { location: 'Mine surface fuel station', classification: 'Class I, Div 1, Group D (within 6m)', notes: 'Gasoline/diesel vapour — CEC Rule 20-002', mining: true },
  { location: 'Mine battery charging room', classification: 'Class I, Div 1, Group B', notes: 'Hydrogen gas from charging lead-acid batteries', mining: true },
  { location: 'Mine assay lab / chem lab', classification: 'Class I, Div 1 or 2 (varies)', notes: 'Depends on solvents used — consult SDS', mining: true },
  { location: 'Mine ventilation raise', classification: 'Typically unclassified', notes: 'Unless methane-bearing ore body or exhaust from classified area', mining: true },
  { location: 'Gas station pump island', classification: 'Class I, Div 1, Group D', notes: 'Within 1.2m of nozzle, extending to grade', mining: false },
  { location: 'Spray paint booth', classification: 'Class I, Div 1, Group D', notes: 'Interior of booth during operation', mining: false },
  { location: 'Grain elevator', classification: 'Class II, Div 1, Group G', notes: 'Grain dust in legs, bins, conveyor enclosures', mining: false },
  { location: 'Propane storage', classification: 'Class I, Div 1, Group D', notes: 'Within 4.5m of container — CEC Rule 20-110', mining: false },
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

const tabs: { key: TabKey; label: string }[] = [
  { key: 'zones', label: 'Zones' },
  { key: 'classes', label: 'Classes & Groups' },
  { key: 'equipment', label: 'Markings' },
  { key: 'common', label: 'Common Areas' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HazardousAreasPage() {
  const [tab, setTab] = useState<TabKey>('zones')
  const [showMiningOnly, setShowMiningOnly] = useState(true)

  return (
    <>
      <Header title="Hazardous Areas" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tab pills */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button key={t.key} style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Zones Tab */}
        {tab === 'zones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--primary)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              IEC Zone System (CEC Section 18)
            </div>
            {zones.map(z => (
              <div key={z.zone} style={{
                background: 'var(--surface)', border: '1px solid var(--divider)',
                borderRadius: 'var(--radius)', padding: '14px',
                borderLeft: `4px solid ${z.color}`,
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: z.color, marginBottom: 4 }}>
                  {z.zone}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text)', marginBottom: 8, lineHeight: 1.5 }}>
                  {z.description}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>Examples:</strong> {z.examples}
                </div>
                <div style={{
                  fontSize: 13, color: 'var(--primary)',
                  background: 'var(--input-bg)', borderRadius: 4,
                  padding: '6px 10px', marginTop: 6,
                }}>
                  <strong>Equipment:</strong> {z.equipmentReq}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Classes & Groups Tab */}
        {tab === 'classes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {classGroups.map(cg => (
              <div key={cg.classNum} style={{
                background: 'var(--surface)', border: '1px solid var(--divider)',
                borderRadius: 'var(--radius)', overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--divider)',
                  background: 'var(--input-bg)',
                }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                    {cg.classNum} — {cg.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                    {cg.description}
                  </div>
                </div>

                <div style={{ padding: '12px 14px' }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
                    textTransform: 'uppercase', marginBottom: 8,
                  }}>
                    Divisions
                  </div>
                  {cg.divisions.map(d => (
                    <div key={d.div} style={{
                      padding: '8px 0', fontSize: 14, lineHeight: 1.5,
                      borderBottom: '1px solid var(--divider)',
                    }}>
                      <strong style={{ color: 'var(--text)' }}>{d.div}:</strong>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>{d.detail}</span>
                    </div>
                  ))}

                  <div style={{
                    fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
                    textTransform: 'uppercase', marginTop: 12, marginBottom: 8,
                  }}>
                    Groups
                  </div>
                  {cg.groups.map(g => (
                    <div key={g.group} style={{
                      display: 'flex', gap: 10, padding: '8px 0',
                      fontSize: 14, borderBottom: '1px solid var(--divider)',
                      alignItems: 'baseline',
                    }}>
                      <span style={{
                        fontWeight: 700, color: 'var(--primary)',
                        fontFamily: 'var(--font-mono)', minWidth: 40,
                      }}>
                        {g.group}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {g.substances}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Equipment Markings Tab */}
        {tab === 'equipment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--primary)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              Equipment Protection & Temperature Markings
            </div>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--divider)',
              borderRadius: 'var(--radius)', overflow: 'hidden',
            }}>
              {equipmentMarkings.map((m, i) => (
                <div key={m.marking} style={{
                  display: 'flex', gap: 12, padding: '12px 14px',
                  borderBottom: i < equipmentMarkings.length - 1 ? '1px solid var(--divider)' : undefined,
                  alignItems: 'center', minHeight: 48,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                    color: 'var(--primary)', fontSize: 14, minWidth: 100,
                    flexShrink: 0,
                  }}>
                    {m.marking}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {m.meaning}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Areas Tab */}
        {tab === 'common' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Mining filter toggle */}
            <button
              onClick={() => setShowMiningOnly(!showMiningOnly)}
              style={{
                minHeight: 48, padding: '0 16px', borderRadius: 24,
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                border: showMiningOnly ? '2px solid var(--primary)' : '2px solid var(--divider)',
                background: showMiningOnly ? 'var(--primary)' : 'transparent',
                color: showMiningOnly ? '#000' : 'var(--text-secondary)',
                alignSelf: 'flex-start',
              }}
            >
              {showMiningOnly ? '\⛏ Mining Only' : 'Show All Areas'}
            </button>

            {(showMiningOnly ? commonAreas.filter(a => a.mining) : commonAreas).map((area, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--divider)',
                borderRadius: 'var(--radius)', padding: '14px',
                borderLeft: area.mining ? '4px solid #ff8c00' : '4px solid var(--primary)',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                  {area.mining && <span style={{ marginRight: 6 }}>{'\⛏'}</span>}
                  {area.location}
                </div>
                <div style={{
                  display: 'inline-block', background: 'var(--input-bg)',
                  borderRadius: 4, padding: '3px 8px', fontSize: 13,
                  fontWeight: 600, color: 'var(--primary)',
                  fontFamily: 'var(--font-mono)', marginBottom: 6,
                }}>
                  {area.classification}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {area.notes}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reference note */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)', padding: '12px 14px',
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong> CEC Section 18 (Hazardous Locations),
          CEC Section 20 (Flammable Liquid/Gas Locations), O. Reg. 854 (Mines & Mining Plants),
          CSA C22.2 No. 60079 (Explosive Atmospheres Equipment)
        </div>
      </div>
    </>
  )
}
