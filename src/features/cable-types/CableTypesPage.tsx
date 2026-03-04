import { useState } from 'react'
import Header from '../../layout/Header'

interface CableType {
  name: string
  nickname?: string
  voltage: string
  temp: string
  uses: string
  locations: string
  conductor: string
  armour: string
  cecRule: string
  sizes: string
  miningUse: boolean
  description: string
}

const cableTypes: CableType[] = [
  {
    name: 'NMD90',
    nickname: 'Loomex',
    voltage: '300V max',
    temp: '90\°C',
    uses: 'Residential branch circuits, lighting, receptacles in houses',
    locations: 'Dry locations only. Must be concealed (inside walls, ceilings, attics). Not for exposed runs.',
    conductor: 'Copper',
    armour: 'None \— PVC outer jacket',
    cecRule: 'CEC Rule 4-004, 12-100 to 12-120',
    sizes: '14\–8 AWG (2 or 3 conductor with ground)',
    miningUse: false,
    description:
      'Standard residential wiring cable. Two or three insulated conductors with a bare bonding conductor, all wrapped in a PVC jacket. Not permitted for exposed runs, wet locations, or commercial/industrial use. Never used in mining.',
  },
  {
    name: 'TECK90',
    nickname: 'Mining workhorse',
    voltage: '1000V (600V and 1000V ratings available)',
    temp: '90\°C',
    uses: 'Primary power cable in Ontario mines, industrial plants, cable tray installations, direct burial, exposed runs on mine walls',
    locations: 'Wet and dry locations, cable trays, direct burial, exposed runs, hazardous locations (Class I Div 2 with appropriate glands)',
    conductor: 'Copper (standard) or Aluminum (larger sizes)',
    armour: 'Interlocking aluminum armour with PVC outer jacket',
    cecRule: 'CEC Rule 4-004, 12-600 to 12-618, CSA C22.2 No. 131',
    sizes: '14 AWG to 750 kcmil',
    miningUse: true,
    description:
      'The go-to cable for Ontario mining and heavy industrial. The interlocking aluminum armour provides excellent mechanical protection. Approved for cable tray, direct burial, and exposed installations. The armour can serve as an equipment bonding conductor when properly terminated with approved TECK connectors. Available in multi-conductor configurations (2C, 3C, 4C, 3C+G). Most common cable seen underground in Ontario mines.',
  },
  {
    name: 'AC90',
    nickname: 'BX',
    voltage: '600V',
    temp: '90\°C',
    uses: 'Commercial and industrial branch circuits, feeder runs in dry locations',
    locations: 'Dry locations only. Not for direct burial or wet areas.',
    conductor: 'Copper or Aluminum',
    armour: 'Aluminum interlocking armour',
    cecRule: 'CEC Rule 12-400 to 12-414',
    sizes: '14 AWG to 1000 kcmil',
    miningUse: false,
    description:
      'Armoured cable for commercial and industrial dry locations. Similar to TECK90 but without the PVC outer jacket, making it unsuitable for wet locations. The aluminum armour provides mechanical protection and serves as the bonding conductor. Commonly used in office buildings, retail, and light industrial.',
  },
  {
    name: 'ACWU90',
    nickname: undefined,
    voltage: '600V',
    temp: '90\°C',
    uses: 'Underground feeders, outdoor installations, wet industrial areas',
    locations: 'Wet and dry locations, direct burial, exposed outdoor runs',
    conductor: 'Copper or Aluminum',
    armour: 'Aluminum interlocking armour with moisture barrier and PVC jacket',
    cecRule: 'CEC Rule 12-400 to 12-414',
    sizes: '14 AWG to 1000 kcmil',
    miningUse: false,
    description:
      'Essentially AC90 with added protection for wet locations. The moisture barrier under the armour and PVC outer jacket allow it to be used in wet areas and direct burial. Good for outdoor commercial and industrial feeders where TECK90 is not required.',
  },
  {
    name: 'SHD-GC',
    nickname: 'Mining trailing cable (>5kV)',
    voltage: '5kV to 25kV',
    temp: '90\°C',
    uses: 'Trailing cable for large mobile mining equipment: draglines, shovels, continuous miners, highwall miners',
    locations: 'Mining operations \— surface and underground. Must be used with proper strain relief and cable handling equipment.',
    conductor: 'Copper (tinned or bare)',
    armour: 'No metallic armour \— heavy rubber outer jacket with individual conductor shielding',
    cecRule: 'CSA C22.2 No. 96, Ontario Mining Regs (O. Reg 854), CEC Section 76',
    sizes: '6 AWG to 500 kcmil (various conductor counts)',
    miningUse: true,
    description:
      'Shield, Heavy-Duty, Ground Check cable. Designed specifically for high-voltage trailing cables on mobile mining equipment. Each conductor is individually shielded with a semi-conducting layer and copper tape/wire shield. The ground check conductor is a critical safety feature that continuously monitors the integrity of the grounding circuit \— if the ground check is broken, the system trips. The heavy rubber jacket provides excellent flexibility and mechanical protection for cables that are dragged across rough terrain.',
  },
  {
    name: 'Type W / G-GC',
    nickname: 'Mining trailing cable (<5kV)',
    voltage: '600V to 2000V',
    temp: '90\°C',
    uses: 'Trailing cable for mobile mining equipment under 5kV: shuttle cars, LHD (scoop trams), bolters, drills, roof bolters',
    locations: 'Mining operations. Portable power connections for mobile equipment.',
    conductor: 'Copper (finely stranded for flexibility)',
    armour: 'No metallic armour \— heavy rubber outer jacket',
    cecRule: 'CSA C22.2 No. 96, Ontario Mining Regs (O. Reg 854), CEC Section 76',
    sizes: '8 AWG to 4/0 AWG (various conductor counts)',
    miningUse: true,
    description:
      'Portable/trailing cable for lower-voltage mobile mining equipment. Type W is for general portable use. G-GC adds a ground check conductor for ground fault monitoring, which is mandatory in Ontario mines. The highly flexible rubber construction withstands repeated flexing, impact, and abrasion. Must be inspected daily for cuts and damage per Ontario mining regulations.',
  },
  {
    name: 'RW90',
    nickname: undefined,
    voltage: '600V',
    temp: '90\°C wet and dry',
    uses: 'Building wire in conduit, raceways, cable trays. Used for single-conductor runs.',
    locations: 'Wet and dry locations (in raceway or supported)',
    conductor: 'Copper',
    armour: 'None \— single conductor with XLPE or EPR insulation',
    cecRule: 'CEC Table 19, Rule 4-004',
    sizes: '14 AWG to 750 kcmil',
    miningUse: false,
    description:
      'Single-conductor building wire rated for wet and dry locations at 90\°C. The most common single-conductor wire for conduit runs in commercial and industrial installations. XLPE (cross-linked polyethylene) insulation provides excellent thermal and moisture resistance. Used where conduit is the wiring method of choice.',
  },
  {
    name: 'T90 / TWN75',
    nickname: 'Building wire',
    voltage: '600V',
    temp: 'T90: 90\°C dry / TWN75: 75\°C wet',
    uses: 'General building wire in conduit and raceways',
    locations: 'T90: Dry locations only. TWN75: Wet or dry locations at 75\°C rating.',
    conductor: 'Copper',
    armour: 'None \— single conductor with thermoplastic (PVC) insulation',
    cecRule: 'CEC Table 19, Rule 4-004',
    sizes: '14 AWG to 1000 kcmil',
    miningUse: false,
    description:
      'Standard thermoplastic insulated building wire. T90 is rated 90\°C in dry locations. TWN75 is the same wire but derated to 75\°C when used in wet locations. Often used interchangeably with RW90 in conduit runs, though RW90 maintains its 90\°C rating in wet locations. Less expensive than XLPE-insulated alternatives.',
  },
  {
    name: 'NMWU',
    nickname: 'Underground Loomex',
    voltage: '300V max',
    temp: '60\°C (wet)',
    uses: 'Residential underground feeders, outdoor lighting circuits, landscape wiring',
    locations: 'Wet locations, direct burial, underground residential',
    conductor: 'Copper',
    armour: 'None \— PVC outer jacket rated for direct burial',
    cecRule: 'CEC Rule 12-012, 12-100',
    sizes: '14\–8 AWG',
    miningUse: false,
    description:
      'Underground feeder cable for residential applications. Similar to NMD90 but with a moisture-resistant jacket suitable for direct burial. Used for runs from the house to a detached garage, outdoor receptacles, landscape lighting, and other residential underground applications. Not for commercial or industrial use. Must be buried to CEC-specified depths.',
  },
]

const comparisonHeaders = ['Cable', 'Voltage', 'Temp', 'Armour', 'Wet OK', 'Mining']

export default function CableTypesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showTable, setShowTable] = useState(true)

  const toggle = (name: string) => {
    setExpanded(expanded === name ? null : name)
  }

  return (
    <>
      <Header title="Cable Types" />
      <div style={{ padding: '0 16px 120px' }}>
        {/* Toggle comparison table */}
        <button
          onClick={() => setShowTable(!showTable)}
          style={{
            width: '100%',
            padding: '12px 16px',
            marginTop: 12,
            marginBottom: 8,
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
          {showTable ? '\▼' : '\▶'} Comparison Table
        </button>

        {/* Comparison table */}
        {showTable && (
          <div
            style={{
              overflowX: 'auto',
              marginBottom: 16,
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
            }}
          >
            <table
              style={{
                width: '100%',
                minWidth: 600,
                borderCollapse: 'collapse',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <thead>
                <tr>
                  {comparisonHeaders.map((h) => (
                    <th
                      key={h}
                      style={{
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
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cableTypes.map((c, i) => (
                  <tr
                    key={c.name}
                    style={{
                      background: i % 2 === 0 ? 'transparent' : 'var(--surface)',
                    }}
                  >
                    <td
                      style={{
                        padding: '8px',
                        fontWeight: 700,
                        color: 'var(--text)',
                        borderBottom: '1px solid var(--divider)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.name}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        color: 'var(--text-secondary)',
                        borderBottom: '1px solid var(--divider)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.voltage}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        color: 'var(--text-secondary)',
                        borderBottom: '1px solid var(--divider)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.temp}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        color: 'var(--text-secondary)',
                        borderBottom: '1px solid var(--divider)',
                      }}
                    >
                      {c.armour.length > 30 ? c.armour.slice(0, 30) + '...' : c.armour}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        borderBottom: '1px solid var(--divider)',
                        color: c.locations.toLowerCase().includes('wet') ? '#4caf50' : '#f44336',
                        fontWeight: 700,
                      }}
                    >
                      {c.locations.toLowerCase().includes('wet') ? 'Yes' : 'No'}
                    </td>
                    <td
                      style={{
                        padding: '8px',
                        borderBottom: '1px solid var(--divider)',
                        color: c.miningUse ? '#4caf50' : 'var(--text-secondary)',
                        fontWeight: c.miningUse ? 700 : 400,
                      }}
                    >
                      {c.miningUse ? '\✓ Yes' : '\—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Cable type cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cableTypes.map((c) => {
            const isOpen = expanded === c.name
            return (
              <div
                key={c.name}
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius)',
                  border: c.miningUse ? '1px solid var(--primary)' : '1px solid var(--divider)',
                  overflow: 'hidden',
                }}
              >
                {/* Header - always visible */}
                <button
                  onClick={() => toggle(c.name)}
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
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', width: 20 }}>
                    {isOpen ? '\▼' : '\▶'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: c.miningUse ? 'var(--primary)' : 'var(--text)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {c.name}
                      </span>
                      {c.nickname && (
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          ({c.nickname})
                        </span>
                      )}
                      {c.miningUse && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            background: 'var(--primary-dim)',
                            color: 'var(--primary)',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}
                        >
                          Mining
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {c.voltage} &bull; {c.temp}
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div
                    style={{
                      padding: '0 16px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        borderTop: '1px solid var(--divider)',
                        paddingTop: 12,
                        fontSize: 14,
                        color: 'var(--text)',
                        lineHeight: 1.6,
                      }}
                    >
                      {c.description}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {([
                        ['Voltage Rating', c.voltage],
                        ['Temperature Rating', c.temp],
                        ['Sizes', c.sizes],
                        ['Typical Uses', c.uses],
                        ['Permitted Locations', c.locations],
                        ['Conductor Material', c.conductor],
                        ['Armour Type', c.armour],
                        ['CEC Reference', c.cecRule],
                      ] as const).map(([label, value]) => (
                        <div key={label}>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: 'var(--text-secondary)',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              marginBottom: 2,
                            }}
                          >
                            {label}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
