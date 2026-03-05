import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/*  Overcurrent Coordination Reference                                 */
/*  CEC-based reference for Ontario electrical apprentices              */
/* ------------------------------------------------------------------ */

type TabKey = 'fundamentals' | 'breakers' | 'fuses' | 'study' | 'cec'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'fundamentals', label: 'Fundamentals' },
  { key: 'breakers', label: 'Breaker Curves' },
  { key: 'fuses', label: 'Fuse Coordination' },
  { key: 'study', label: 'Coord. Study' },
  { key: 'cec', label: 'CEC Rules' },
]

/* ------------------------------------------------------------------ */
/*  Shared Styles                                                      */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex', gap: 6, overflowX: 'auto',
  WebkitOverflowScrolling: 'touch', padding: '12px 16px 8px',
  scrollbarWidth: 'none',
}

const pillBase: React.CSSProperties = {
  flexShrink: 0, minHeight: 44, padding: '0 14px',
  borderRadius: 22, fontSize: 12, fontWeight: 600,
  border: '2px solid var(--divider)', background: 'transparent',
  color: 'var(--text-secondary)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
}

const pillActive: React.CSSProperties = {
  ...pillBase, background: 'var(--primary)',
  color: '#000', border: '2px solid var(--primary)',
}

const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)', padding: 14,
}

const sectionHeading: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--primary)',
  textTransform: 'uppercase', letterSpacing: 0.5, margin: '18px 0 8px',
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono, "SF Mono", "Consolas", monospace)',
}

const bodyText: React.CSSProperties = {
  fontSize: 14, lineHeight: 1.6, color: 'var(--text)', margin: '6px 0',
}

const noteBox: React.CSSProperties = {
  ...card, borderLeft: '3px solid var(--primary)', padding: 12,
  marginTop: 10, marginBottom: 10,
}

const warnBox: React.CSSProperties = {
  ...card, borderLeft: '3px solid #ff6b6b', padding: 12,
  marginTop: 10, marginBottom: 10,
}

const tableCell: React.CSSProperties = {
  padding: '8px 10px', fontSize: 13, borderBottom: '1px solid var(--divider)',
  color: 'var(--text)',
}

const tableHeader: React.CSSProperties = {
  ...tableCell, fontWeight: 700, color: 'var(--primary)',
  fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.3,
  background: 'rgba(255,215,0,0.05)',
}

const selectStyle: React.CSSProperties = {
  width: '100%', minHeight: 56, padding: '0 16px',
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)', color: 'var(--text)',
  fontSize: 15, boxSizing: 'border-box',
}

const inputStyle: React.CSSProperties = {
  width: '100%', minHeight: 56, padding: '0 16px',
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)', color: 'var(--text)',
  fontSize: 15, boxSizing: 'border-box',
  ...mono,
}

const resultBox: React.CSSProperties = {
  background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
  borderRadius: 'var(--radius)', padding: 14, marginTop: 10,
}

const label: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
  marginBottom: 4, display: 'block',
}

const bulletList: React.CSSProperties = {
  margin: '6px 0', paddingLeft: 20, fontSize: 14,
  lineHeight: 1.7, color: 'var(--text)',
}

/* ------------------------------------------------------------------ */
/*  Fuse Selectivity Ratio Data                                        */
/* ------------------------------------------------------------------ */

interface FuseRatio {
  upstream: string
  downstream: string
  ratio: number
  coordinated: boolean
}

const fuseSelectivityData: FuseRatio[] = [
  { upstream: '100A Class J', downstream: '30A Class J', ratio: 3.33, coordinated: true },
  { upstream: '100A Class J', downstream: '60A Class J', ratio: 1.67, coordinated: false },
  { upstream: '200A Class J', downstream: '100A Class J', ratio: 2.0, coordinated: true },
  { upstream: '200A Class J', downstream: '150A Class J', ratio: 1.33, coordinated: false },
  { upstream: '400A Class J', downstream: '200A Class J', ratio: 2.0, coordinated: true },
  { upstream: '600A Class J', downstream: '200A Class J', ratio: 3.0, coordinated: true },
  { upstream: '600A Class J', downstream: '400A Class J', ratio: 1.5, coordinated: false },
  { upstream: '100A Class RK1', downstream: '30A Class RK1', ratio: 3.33, coordinated: true },
  { upstream: '100A Class RK1', downstream: '60A Class RK1', ratio: 1.67, coordinated: false },
  { upstream: '200A Class RK1', downstream: '100A Class RK1', ratio: 2.0, coordinated: true },
  { upstream: '400A Class RK1', downstream: '200A Class RK1', ratio: 2.0, coordinated: true },
  { upstream: '100A Class RK5', downstream: '30A Class RK5', ratio: 3.33, coordinated: true },
  { upstream: '200A Class RK5', downstream: '60A Class RK5', ratio: 3.33, coordinated: true },
  { upstream: '200A Class RK5', downstream: '100A Class RK5', ratio: 2.0, coordinated: false },
  { upstream: '100A Class CC', downstream: '30A Class CC', ratio: 3.33, coordinated: true },
  { upstream: '60A Class CC', downstream: '30A Class CC', ratio: 2.0, coordinated: true },
]

/* ------------------------------------------------------------------ */
/*  Breaker Frame Data                                                 */
/* ------------------------------------------------------------------ */

interface BreakerFrame {
  frame: string
  tripRange: string
  aic: string
  type: string
  typicalUse: string
}

const breakerFrames: BreakerFrame[] = [
  { frame: '100A', tripRange: '15-100A', aic: '10-65 kA', type: 'Thermal-Magnetic', typicalUse: 'Branch circuits, small panels' },
  { frame: '225A', tripRange: '70-225A', aic: '22-65 kA', type: 'Thermal-Magnetic', typicalUse: 'Sub-panels, small feeders' },
  { frame: '400A', tripRange: '250-400A', aic: '25-65 kA', type: 'Thermal-Mag / Electronic', typicalUse: 'Distribution panels, feeders' },
  { frame: '600A', tripRange: '250-600A', aic: '25-100 kA', type: 'Electronic Trip', typicalUse: 'Main breakers, large feeders' },
  { frame: '800A', tripRange: '400-800A', aic: '42-100 kA', type: 'Electronic Trip', typicalUse: 'Switchboard mains, large feeders' },
  { frame: '1200A', tripRange: '400-1200A', aic: '42-100 kA', type: 'Electronic Trip', typicalUse: 'Switchgear, main distribution' },
  { frame: '1600A', tripRange: '800-1600A', aic: '65-100 kA', type: 'Electronic Trip', typicalUse: 'Main switchgear, service entrance' },
  { frame: '2000A', tripRange: '800-2000A', aic: '65-100 kA', type: 'Electronic Trip', typicalUse: 'Main switchgear, large facilities' },
  { frame: '3000A', tripRange: '1600-3000A', aic: '65-200 kA', type: 'Electronic Trip', typicalUse: 'Utility service, main switchgear' },
  { frame: '4000A', tripRange: '2000-4000A', aic: '100-200 kA', type: 'Electronic Trip', typicalUse: 'Large utility switchgear' },
]

/* ------------------------------------------------------------------ */
/*  Fuse Class Comparison                                              */
/* ------------------------------------------------------------------ */

interface FuseClass {
  cls: string
  speed: string
  currentLimiting: boolean
  selectivityRatio: string
  voltageRating: string
  typicalUse: string
  aic: string
}

const fuseClasses: FuseClass[] = [
  { cls: 'Class J', speed: 'Very Fast', currentLimiting: true, selectivityRatio: '2:1', voltageRating: '600V', typicalUse: 'Motor circuits, panels, MCCs', aic: '200 kA' },
  { cls: 'Class RK1', speed: 'Fast', currentLimiting: true, selectivityRatio: '2:1', voltageRating: '600V', typicalUse: 'General purpose, replacement', aic: '200 kA' },
  { cls: 'Class RK5', speed: 'Medium', currentLimiting: true, selectivityRatio: '3:1', voltageRating: '600V', typicalUse: 'General purpose, economy', aic: '200 kA' },
  { cls: 'Class CC', speed: 'Very Fast', currentLimiting: true, selectivityRatio: '2:1', voltageRating: '600V', typicalUse: 'Control circuits, small loads', aic: '200 kA' },
  { cls: 'Class T', speed: 'Very Fast', currentLimiting: true, selectivityRatio: '2:1', voltageRating: '600V', typicalUse: 'Compact panels, space-limited', aic: '200 kA' },
  { cls: 'Class L', speed: 'Fast', currentLimiting: true, selectivityRatio: '2:1', voltageRating: '600V', typicalUse: 'Mains 601-6000A', aic: '200 kA' },
]

/* ------------------------------------------------------------------ */
/*  Standard OC Device Ratings (CEC Table 13 excerpt)                  */
/* ------------------------------------------------------------------ */

const standardRatings = [
  15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
  110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500,
  600, 700, 800, 1000, 1200, 1600, 2000, 2500, 3000, 4000, 5000, 6000,
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OCCoordinationPage() {
  const nav = useNavigate()
  const [tab, setTab] = useState<TabKey>('fundamentals')

  // Breaker curve interactive state
  const [selectedBreakerType, setSelectedBreakerType] = useState<string>('thermal-mag')

  // Fuse coordination interactive state
  const [upstreamFuseClass, setUpstreamFuseClass] = useState<string>('Class J')
  const [upstreamFuseSize, setUpstreamFuseSize] = useState<number>(200)
  const [downstreamFuseSize, setDownstreamFuseSize] = useState<number>(100)

  // Coordination study calculator state
  const [mainBreakerSize, setMainBreakerSize] = useState<number>(1200)
  const [feederBreakerSize, setFeederBreakerSize] = useState<number>(400)
  const [branchBreakerSize, setBranchBreakerSize] = useState<number>(100)
  const [availableFaultCurrent, setAvailableFaultCurrent] = useState<number>(42000)

  // Expanded card states
  const [expandedFund, setExpandedFund] = useState<number | null>(null)
  const [expandedBreaker, setExpandedBreaker] = useState<number | null>(null)
  const [expandedFuse, setExpandedFuse] = useState<number | null>(null)
  const [expandedStudy, setExpandedStudy] = useState<number | null>(null)
  const [expandedCec, setExpandedCec] = useState<number | null>(null)

  /* ---- Computed values ---- */
  const fuseRatio = downstreamFuseSize > 0 ? upstreamFuseSize / downstreamFuseSize : 0
  const requiredRatio = upstreamFuseClass === 'Class RK5' ? 3.0 : 2.0
  const fusesCoordinated = fuseRatio >= requiredRatio

  const mainToFeederRatio = feederBreakerSize > 0 ? mainBreakerSize / feederBreakerSize : 0
  const feederToBranchRatio = branchBreakerSize > 0 ? feederBreakerSize / branchBreakerSize : 0
  const mainFeederCoord = mainToFeederRatio >= 2.0
  const feederBranchCoord = feederToBranchRatio >= 2.0
  const overallCoord = mainFeederCoord && feederBranchCoord

  const faultCurrentKA = availableFaultCurrent / 1000

  /* ---- Helper to render expandable cards ---- */
  function ExpandCard({ idx, expanded, setExpanded, title, children }: {
    idx: number; expanded: number | null; setExpanded: (v: number | null) => void
    title: string; children: React.ReactNode
  }) {
    const open = expanded === idx
    return (
      <div style={{ ...card, marginBottom: 10, cursor: 'pointer' }}
        onClick={() => setExpanded(open ? null : idx)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
          <span style={{ color: 'var(--primary)', fontSize: 18, transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9662;</span>
        </div>
        {open && <div onClick={e => e.stopPropagation()} style={{ marginTop: 10 }}>{children}</div>}
      </div>
    )
  }

  /* ================================================================ */
  /*  TAB 1: FUNDAMENTALS                                              */
  /* ================================================================ */
  function renderFundamentals() {
    return (
      <div style={{ padding: '0 16px' }}>
        <ExpandCard idx={0} expanded={expandedFund} setExpanded={setExpandedFund}
          title="What Is Coordination?">
          <p style={bodyText}>
            Overcurrent coordination (selectivity) ensures that when a fault occurs, only the
            protective device closest to the fault operates, while all upstream devices remain
            closed. This minimizes the extent of a power outage and isolates only the faulted
            section of the electrical system.
          </p>
          <div style={noteBox}>
            <p style={{ ...bodyText, margin: 0, fontWeight: 600, color: 'var(--primary)' }}>
              Why It Matters
            </p>
            <ul style={bulletList}>
              <li>Prevents unnecessary blackouts to unaffected loads</li>
              <li>Protects critical systems (healthcare, fire alarm, emergency lighting)</li>
              <li>Reduces equipment damage from prolonged fault exposure</li>
              <li>Required by CEC for healthcare and emergency systems</li>
              <li>Minimizes arc flash energy by ensuring fastest device trips first</li>
            </ul>
          </div>
          <p style={bodyText}>
            <strong>Example:</strong> A short circuit on a 20A branch circuit should trip only
            the 20A breaker, not the 225A feeder breaker or the 1200A main. Without
            coordination, the feeder or main breaker could trip, shutting down the entire floor
            or building.
          </p>
        </ExpandCard>

        <ExpandCard idx={1} expanded={expandedFund} setExpanded={setExpandedFund}
          title="Time-Current Characteristic (TCC) Curves">
          <p style={bodyText}>
            A TCC curve is a graph that plots the operating time of a protective device versus
            the fault current magnitude. The vertical axis shows time (seconds, on a log scale)
            and the horizontal axis shows current (amperes, also on a log scale).
          </p>
          <div style={{ ...card, background: 'rgba(255,215,0,0.04)', marginTop: 10 }}>
            <p style={{ ...sectionHeading, margin: '0 0 8px' }}>Reading a TCC Curve</p>
            <ol style={{ ...bulletList, paddingLeft: 24, listStyleType: 'decimal' }}>
              <li>Identify the device on the curve (each device is a separate band)</li>
              <li>Find the fault current value on the horizontal axis (amps)</li>
              <li>Draw a vertical line up to where it intersects the curve</li>
              <li>Read the trip time on the vertical axis (seconds)</li>
              <li>For coordination, curves should NOT overlap at any current value</li>
            </ol>
          </div>
          <p style={bodyText}>
            Each device appears as a band (not a line) because there is a tolerance range
            between the minimum and maximum trip times. For coordination, the total clearing
            time curve of the downstream device must be below the minimum melting time curve
            of the upstream device at all current values.
          </p>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Log-Log Scale:</strong> Both axes use logarithmic scales. This means
              each major division represents a 10x change. A current of 100A is one division
              from 1000A, not nine divisions.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={2} expanded={expandedFund} setExpanded={setExpandedFund}
          title="Overcurrent Device Types">
          <p style={sectionHeading}>Circuit Breakers</p>
          <div style={{ ...card, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '0 0 6px' }}>
              Thermal-Magnetic (MCCB)
            </p>
            <p style={{ ...bodyText, margin: 0 }}>
              Uses a bimetallic strip for overload (thermal) and an electromagnet for short
              circuit (magnetic/instantaneous). Fixed trip characteristics. Common in branch
              circuit and small feeder applications up to 400A frame.
            </p>
          </div>
          <div style={{ ...card, marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '0 0 6px' }}>
              Electronic Trip (LSI / LSIG)
            </p>
            <p style={{ ...bodyText, margin: 0 }}>
              Uses current transformers and a microprocessor to sense and control trip
              characteristics. Adjustable long-time, short-time, instantaneous, and ground
              fault settings. Common in 400A+ frame sizes. Essential for coordination studies
              because settings can be tuned to achieve selectivity.
            </p>
          </div>

          <p style={sectionHeading}>Fuses</p>
          {fuseClasses.map(f => (
            <div key={f.cls} style={{ ...card, marginBottom: 6, padding: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{f.cls}</span>
                <span style={{
                  ...mono, fontSize: 11, padding: '2px 8px', borderRadius: 4,
                  background: f.currentLimiting ? 'rgba(74,222,128,0.15)' : 'rgba(255,107,107,0.15)',
                  color: f.currentLimiting ? '#4ade80' : '#ff6b6b',
                }}>
                  {f.speed} | AIC: {f.aic}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {f.typicalUse} | Selectivity ratio: {f.selectivityRatio}
              </p>
            </div>
          ))}
        </ExpandCard>

        <ExpandCard idx={3} expanded={expandedFund} setExpanded={setExpandedFund}
          title="Instantaneous vs Time-Delay">
          <p style={bodyText}>
            Overcurrent protective devices respond to faults in two distinct ways depending on
            the magnitude of the overcurrent:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <div style={{ ...card, padding: 10 }}>
              <p style={{ fontWeight: 700, color: '#ff6b6b', fontSize: 13, margin: '0 0 4px' }}>
                INSTANTANEOUS
              </p>
              <ul style={{ ...bulletList, fontSize: 12, paddingLeft: 16 }}>
                <li>Trips in &lt;1 cycle (0.016s)</li>
                <li>High fault currents only</li>
                <li>Magnetic element in breakers</li>
                <li>Single-element fuses</li>
                <li>Fixed in thermal-mag breakers</li>
                <li>Adjustable in electronic trip</li>
              </ul>
            </div>
            <div style={{ ...card, padding: 10 }}>
              <p style={{ fontWeight: 700, color: '#4ade80', fontSize: 13, margin: '0 0 4px' }}>
                TIME-DELAY
              </p>
              <ul style={{ ...bulletList, fontSize: 12, paddingLeft: 16 }}>
                <li>Trips after intentional delay</li>
                <li>Lower overcurrents (overloads)</li>
                <li>Thermal element in breakers</li>
                <li>Dual-element fuses</li>
                <li>Allows motor starting inrush</li>
                <li>Inverse-time curve shape</li>
              </ul>
            </div>
          </div>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Coordination tip:</strong> Upstream devices need longer time delays than
              downstream devices at the same fault current. This is the fundamental principle
              of time-graded coordination.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={4} expanded={expandedFund} setExpanded={setExpandedFund}
          title="Let-Through Energy (I²t)">
          <p style={bodyText}>
            I²t (ampere-squared seconds) represents the thermal energy a protective device
            allows to pass through to the downstream circuit during a fault. It is a measure
            of the destructive capability of the fault current.
          </p>
          <div style={{ ...card, background: 'rgba(255,215,0,0.04)', marginTop: 8 }}>
            <p style={{ ...mono, fontSize: 14, color: 'var(--primary)', textAlign: 'center', margin: '8px 0' }}>
              I²t = I² x t (A²s)
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
              Where I = fault current (A) and t = clearing time (s)
            </p>
          </div>
          <ul style={bulletList}>
            <li><strong>Lower I²t = less damage</strong> to conductors, equipment, and reduced arc flash energy</li>
            <li>Current-limiting fuses have very low I²t because they clear in less than half a cycle</li>
            <li>For coordination, the downstream device total I²t must be less than the upstream device minimum melting I²t</li>
            <li>Conductor damage threshold: I²t must not exceed the cable withstand rating</li>
          </ul>
          <div style={warnBox}>
            <p style={{ fontSize: 13, color: '#ff6b6b', fontWeight: 600, margin: '0 0 4px' }}>
              Cable Protection
            </p>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              The I²t let-through of the protective device must not exceed the I²t
              withstand of the protected cable. Exceeding this value causes insulation damage,
              conductor annealing, or fire.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={5} expanded={expandedFund} setExpanded={setExpandedFund}
          title="Fully Rated vs Series Rated Systems">
          <div style={{ display: 'grid', gap: 8, marginTop: 4 }}>
            <div style={{ ...card, borderLeft: '3px solid #4ade80' }}>
              <p style={{ fontWeight: 700, color: '#4ade80', fontSize: 14, margin: '0 0 6px' }}>
                Fully Rated System
              </p>
              <ul style={{ ...bulletList, fontSize: 13 }}>
                <li>Each device individually rated for the maximum available fault current</li>
                <li>Every breaker AIC rating &ge; available fault current at that point</li>
                <li>Preferred approach -- independent protection at each level</li>
                <li>No restrictions on replacement devices</li>
                <li>Required for most critical applications</li>
              </ul>
            </div>
            <div style={{ ...card, borderLeft: '3px solid #ff8c00' }}>
              <p style={{ fontWeight: 700, color: '#ff8c00', fontSize: 14, margin: '0 0 6px' }}>
                Series Rated System (CEC Rule 14-014)
              </p>
              <ul style={{ ...bulletList, fontSize: 13 }}>
                <li>Upstream device protects downstream device with lower AIC rating</li>
                <li>Must be tested and listed as a combination by the manufacturer</li>
                <li>Downstream breaker AIC can be lower than available fault current</li>
                <li>Strict replacement requirements -- only listed combinations allowed</li>
                <li>Label required: &quot;CAUTION: Series Rated System&quot;</li>
                <li>Not permitted where selective coordination is required</li>
              </ul>
            </div>
          </div>
          <div style={warnBox}>
            <p style={{ fontSize: 13, color: '#ff6b6b', fontWeight: 600, margin: '0 0 4px' }}>
              Series Rating Restrictions
            </p>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              Series rated systems are NOT permitted for healthcare essential electrical
              systems, emergency systems requiring selective coordination, or where the
              downstream device must operate independently. CEC Rule 14-014 requires the
              combination to be tested and labelled.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={6} expanded={expandedFund} setExpanded={setExpandedFund}
          title="Selective Coordination Requirements">
          <p style={bodyText}>
            Selective coordination means that a fault on any circuit will be isolated by the
            protective device immediately upstream of the fault, without causing any other
            device to open. This is required by code in specific applications:
          </p>
          <div style={{ ...card, marginTop: 8, marginBottom: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Application</th>
                  <th style={tableHeader}>Requirement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tableCell}>Healthcare Essential Electrical System</td>
                  <td style={tableCell}>Full selective coordination required for life safety
                    and critical branch</td>
                </tr>
                <tr>
                  <td style={tableCell}>Emergency Systems</td>
                  <td style={tableCell}>Selective coordination from the load to the alternate
                    power source (generator)</td>
                </tr>
                <tr>
                  <td style={tableCell}>Fire Alarm Circuits</td>
                  <td style={tableCell}>Must not be interrupted by faults on other circuits</td>
                </tr>
                <tr>
                  <td style={tableCell}>Elevator Circuits</td>
                  <td style={tableCell}>Selective coordination for shunt-trip and elevator
                    power feeders</td>
                </tr>
                <tr>
                  <td style={tableCell}>Critical Operations (Data Centers)</td>
                  <td style={tableCell}>Full selective coordination to maintain uptime</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ExpandCard>

        <ExpandCard idx={7} expanded={expandedFund} setExpanded={setExpandedFund}
          title="Coordination Diagram">
          <p style={{ ...bodyText, marginBottom: 10 }}>
            A typical power distribution system with three levels of protection:
          </p>
          {/* ASCII diagram of coordination */}
          <div style={{
            ...card, ...mono, fontSize: 11, lineHeight: 1.5, padding: 14,
            overflowX: 'auto', whiteSpace: 'pre', color: 'var(--text)',
            background: 'rgba(0,0,0,0.3)',
          }}>
{`  UTILITY TRANSFORMER
         |
    +---------+
    | 1200A   |  Main Breaker (Upstream)
    | Main CB |  Longest time delay
    +---------+  Must have highest AIC
         |
    =====|===== BUS (e.g., 42kA available)
    |         |
+------+ +------+
| 400A | | 225A |  Feeder Breakers (Mid-stream)
| Fdr1 | | Fdr2 |  Medium time delay
+------+ +------+  AIC >= bus fault current
    |         |
  ==|==     ==|==  SUB-PANELS
  |   |     |   |
+--+ +--+ +--+ +--+
|20| |30| |20| |15|  Branch Breakers (Downstream)
|A | |A | |A | |A |  Fastest trip time
+--+ +--+ +--+ +--+  AIC >= panel fault current
 |    |    |    |
LOADS LOADS LOADS LOADS

COORDINATION RULE:
  Main trips SLOWER than Feeders
  Feeders trip SLOWER than Branch
  At ALL fault current levels

TCC CURVE REQUIREMENT:
  Branch curve | Feeder curve | Main curve
  (leftmost)   | (middle)     | (rightmost)
  fastest      | medium       | slowest`}
          </div>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Key:</strong> In a properly coordinated system, the TCC curves do not
              overlap at any fault current level up to the maximum available fault current. The
              downstream device always clears the fault before the upstream device begins to
              respond.
            </p>
          </div>
        </ExpandCard>
      </div>
    )
  }

  /* ================================================================ */
  /*  TAB 2: BREAKER CURVES                                            */
  /* ================================================================ */
  function renderBreakerCurves() {
    const breakerTypeInfo: Record<string, {
      desc: string; regions: { name: string; color: string; range: string; detail: string }[]
    }> = {
      'thermal-mag': {
        desc: 'Thermal-magnetic breakers have a fixed inverse-time curve for overloads (thermal element) and a fixed instantaneous trip point (magnetic element). Limited adjustability.',
        regions: [
          { name: 'THERMAL REGION', color: '#4ade80', range: '100-500% rated', detail: 'Inverse time curve. Higher current = faster trip. Bimetallic strip heats and bends. Trip time: 4s to 120s depending on current.' },
          { name: 'MAGNETIC REGION', color: '#ff6b6b', range: '500-1300% rated', detail: 'Instantaneous trip. Electromagnet pulls trip bar. Trip time: 0.01-0.03 seconds (less than 2 cycles at 60Hz).' },
          { name: 'TRANSITION ZONE', color: '#ffd700', range: '~500% rated', detail: 'Band between thermal and magnetic regions. Some overlap in trip times. Width depends on breaker design tolerance.' },
        ],
      },
      'electronic-lsi': {
        desc: 'Electronic trip units with Long-time, Short-time, and Instantaneous (LSI) settings. Fully adjustable pickup and delay for each region. Standard for 400A+ frames.',
        regions: [
          { name: 'LONG-TIME (L)', color: '#4ade80', range: '0.5-1.0x sensor', detail: 'Adjustable pickup: 0.5x to 1.0x sensor rating. Adjustable delay: 4-24 seconds at 6x pickup. Protects against sustained overloads.' },
          { name: 'SHORT-TIME (S)', color: '#ffd700', range: '1.5-10x sensor', detail: 'Adjustable pickup: 1.5x to 10x sensor rating. Adjustable delay: 0.1-0.4 seconds. Allows downstream devices to clear faults first.' },
          { name: 'INSTANTANEOUS (I)', color: '#ff6b6b', range: '2-40x sensor', detail: 'Adjustable pickup: 2x to 40x sensor rating. No intentional delay (<0.02s). Last resort protection for high-level faults.' },
        ],
      },
      'electronic-lsig': {
        desc: 'Electronic trip with Ground Fault (LSIG) adds a dedicated ground fault pickup and delay. Required for services over 1000A at 150V-to-ground per CEC Rule 14-102.',
        regions: [
          { name: 'LONG-TIME (L)', color: '#4ade80', range: '0.5-1.0x sensor', detail: 'Overload protection. Adjustable pickup and delay. Protects conductors from sustained overloads that could damage insulation.' },
          { name: 'SHORT-TIME (S)', color: '#ffd700', range: '1.5-10x sensor', detail: 'Short circuit delay region. Enables selective coordination with downstream devices by delaying trip on medium-level faults.' },
          { name: 'INSTANTANEOUS (I)', color: '#ff6b6b', range: '2-40x sensor', detail: 'High-level fault protection. Fastest trip for maximum fault currents. Sometimes disabled (set to OFF) for maximum coordination.' },
          { name: 'GROUND FAULT (G)', color: '#a78bfa', range: '0.2-1.0x sensor', detail: 'Adjustable pickup: 0.2x to 1.0x sensor. Adjustable delay: 0.1-1.0 seconds. Detects ground faults below phase overcurrent settings. Max setting per CEC: 1200A pickup, 1 second delay.' },
        ],
      },
    }

    const info = breakerTypeInfo[selectedBreakerType]

    return (
      <div style={{ padding: '0 16px' }}>
        {/* Breaker type selector */}
        <p style={sectionHeading}>Select Breaker Type</p>
        <select style={selectStyle} value={selectedBreakerType}
          onChange={e => setSelectedBreakerType(e.target.value)}>
          <option value="thermal-mag">Thermal-Magnetic (MCCB)</option>
          <option value="electronic-lsi">Electronic Trip (LSI)</option>
          <option value="electronic-lsig">Electronic Trip (LSIG)</option>
        </select>

        {/* Description */}
        <p style={{ ...bodyText, marginTop: 12 }}>{info.desc}</p>

        {/* Visual TCC representation */}
        <p style={sectionHeading}>Trip Curve Regions</p>
        <div style={{
          ...card, padding: 0, overflow: 'hidden', marginBottom: 12,
        }}>
          {/* Y-axis header */}
          <div style={{
            display: 'flex', alignItems: 'center', padding: '8px 12px',
            background: 'rgba(255,215,0,0.06)', borderBottom: '1px solid var(--divider)',
          }}>
            <span style={{ ...mono, fontSize: 11, color: 'var(--text-secondary)' }}>
              TIME (s) -- log scale
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ ...mono, fontSize: 11, color: 'var(--text-secondary)' }}>
              CURRENT (A) -- log scale &rarr;
            </span>
          </div>

          {info.regions.map((r, i) => (
            <div key={i} style={{
              padding: 12, borderBottom: i < info.regions.length - 1 ? '1px solid var(--divider)' : 'none',
              borderLeft: `3px solid ${r.color}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: r.color, fontSize: 13 }}>{r.name}</span>
                <span style={{ ...mono, fontSize: 11, color: 'var(--text-secondary)',
                  background: 'rgba(255,255,255,0.05)', borderRadius: 4, padding: '2px 8px',
                }}>{r.range}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                {r.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Visual curve shape -- ASCII art */}
        <p style={sectionHeading}>Typical TCC Curve Shape</p>
        <div style={{
          ...card, ...mono, fontSize: 10, lineHeight: 1.4, padding: 12,
          overflowX: 'auto', whiteSpace: 'pre', color: 'var(--text)',
          background: 'rgba(0,0,0,0.3)',
        }}>
          {selectedBreakerType === 'thermal-mag' ? `
  1000s |
       |.
  100s | .
       |  .          THERMAL REGION
   10s |   ..         (inverse time)
       |     ...
    1s |        ....
       |            .....
  0.1s |_________________|
       |                 |  MAGNETIC REGION
 0.01s |=================|  (instantaneous)
       |_________________|_____________
       1x    5x    10x   13x   20x
              Multiple of rated current
` : selectedBreakerType === 'electronic-lsi' ? `
  1000s |
       |
  100s |_____
       |     |  LONG-TIME PICKUP (adj)
   10s |     |____
       |          |  LONG-TIME DELAY (adj)
    1s |          |
       |__________|
  0.3s |          |  SHORT-TIME DELAY (adj)
       |__________|____
  0.1s |               |  SHORT-TIME PICKUP (adj)
       |_______________|
 0.01s |===============|  INSTANTANEOUS (adj)
       |_______________|_____________
       0.5x  2x   5x   10x   40x
              Multiple of sensor rating
` : `
  1000s |
       |
  100s |_____
       |     |  L: LONG-TIME
   10s |     |____
       |          |
    1s |          |
       |__________|
  0.3s |          |  S: SHORT-TIME
       |__________|____
  0.1s |               |
       |_______________|
 0.01s |===============|  I: INSTANTANEOUS
       |_______________|_____________
       0.5x  2x   5x   10x   40x

  GROUND FAULT (separate curve):
    1s |_____
       |     |  G: adjustable pickup
  0.1s |     |      0.2x to 1.0x sensor
       |_____|      0.1s to 1.0s delay
              (phase current axis)
`}
        </div>

        <ExpandCard idx={0} expanded={expandedBreaker} setExpanded={setExpandedBreaker}
          title="MCCB Trip Settings Explained">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Setting</th>
                  <th style={tableHeader}>Function</th>
                  <th style={tableHeader}>Adjustable?</th>
                  <th style={tableHeader}>Range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600, color: '#4ade80' }}>Long-Time Pickup</td>
                  <td style={tableCell}>Overload threshold</td>
                  <td style={tableCell}>Electronic: Yes</td>
                  <td style={{ ...tableCell, ...mono }}>0.5-1.0x sensor</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600, color: '#4ade80' }}>Long-Time Delay</td>
                  <td style={tableCell}>Overload response time</td>
                  <td style={tableCell}>Electronic: Yes</td>
                  <td style={{ ...tableCell, ...mono }}>4-24 sec @ 6x</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600, color: '#ffd700' }}>Short-Time Pickup</td>
                  <td style={tableCell}>Fault delay threshold</td>
                  <td style={tableCell}>Electronic: Yes</td>
                  <td style={{ ...tableCell, ...mono }}>1.5-10x sensor</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600, color: '#ffd700' }}>Short-Time Delay</td>
                  <td style={tableCell}>Fault response time</td>
                  <td style={tableCell}>Electronic: Yes</td>
                  <td style={{ ...tableCell, ...mono }}>0.1-0.4 sec</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600, color: '#ff6b6b' }}>Instantaneous</td>
                  <td style={tableCell}>Immediate trip level</td>
                  <td style={tableCell}>Electronic: Yes, T-M: Fixed</td>
                  <td style={{ ...tableCell, ...mono }}>2-40x sensor</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600, color: '#a78bfa' }}>Ground Fault</td>
                  <td style={tableCell}>GF detection threshold</td>
                  <td style={tableCell}>LSIG only</td>
                  <td style={{ ...tableCell, ...mono }}>0.2-1.0x, max 1200A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ExpandCard>

        <ExpandCard idx={1} expanded={expandedBreaker} setExpanded={setExpandedBreaker}
          title="Standard Breaker Frame Sizes">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Frame</th>
                  <th style={tableHeader}>Trip Range</th>
                  <th style={tableHeader}>AIC</th>
                  <th style={tableHeader}>Type</th>
                  <th style={tableHeader}>Typical Use</th>
                </tr>
              </thead>
              <tbody>
                {breakerFrames.map(b => (
                  <tr key={b.frame}>
                    <td style={{ ...tableCell, ...mono, fontWeight: 600, color: 'var(--primary)' }}>{b.frame}</td>
                    <td style={{ ...tableCell, ...mono }}>{b.tripRange}</td>
                    <td style={{ ...tableCell, ...mono }}>{b.aic}</td>
                    <td style={tableCell}>{b.type}</td>
                    <td style={{ ...tableCell, fontSize: 12 }}>{b.typicalUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ExpandCard>

        <ExpandCard idx={2} expanded={expandedBreaker} setExpanded={setExpandedBreaker}
          title="How to Read a TCC Curve (Step by Step)">
          <ol style={{ ...bulletList, listStyleType: 'decimal', paddingLeft: 24 }}>
            <li><strong>Identify the axes:</strong> X-axis is current in amperes (log scale). Y-axis is time in seconds (log scale). Both typically span several decades.</li>
            <li><strong>Find your device:</strong> Each device is shown as a shaded band (not a single line). The left edge is minimum trip time, the right edge is maximum trip time.</li>
            <li><strong>Locate the fault current:</strong> Draw a vertical line at the expected fault current value on the X-axis.</li>
            <li><strong>Read trip time:</strong> Where your vertical line intersects the device band, read across to the Y-axis for the trip time range.</li>
            <li><strong>Check coordination:</strong> The downstream device band must be entirely to the left of and below the upstream device band at all current values up to the maximum fault current.</li>
            <li><strong>Identify overlap:</strong> If bands overlap at any current level, the devices are NOT selectively coordinated at that fault current. Both may trip simultaneously.</li>
            <li><strong>Check instantaneous region:</strong> Particular attention to the instantaneous region where thermal-magnetic breakers have a flat (very fast) response. This is the most common area where coordination fails.</li>
          </ol>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Common mistake:</strong> Reading the TCC curve at the wrong current
              base. Always verify whether the curve is plotted in amperes or multiples of the
              device rating. Manufacturer curves may use either convention.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={3} expanded={expandedBreaker} setExpanded={setExpandedBreaker}
          title="Breaker Coordination Rules of Thumb">
          <ul style={bulletList}>
            <li><strong>2:1 Rule:</strong> Upstream breaker should be at least 2x the rating of the downstream breaker for basic coordination with thermal-magnetic breakers</li>
            <li><strong>Instantaneous Overlap:</strong> Thermal-magnetic breakers of adjacent sizes almost always overlap in the instantaneous region -- true selective coordination requires electronic trip units or fuses</li>
            <li><strong>Short-Time Delay:</strong> Using short-time delay on the upstream breaker (instead of instantaneous) is the most effective way to achieve coordination</li>
            <li><strong>Zone Selective Interlocking (ZSI):</strong> Allows upstream breakers to trip instantaneously only when the downstream breaker does not detect the fault, combining fast protection with coordination</li>
            <li><strong>Same Manufacturer:</strong> Coordination is easier to verify when all breakers are from the same manufacturer -- published tested combinations are available</li>
            <li><strong>Ground Fault Coordination:</strong> Ground fault settings must also be coordinated -- the upstream GF delay must exceed the downstream GF clearing time</li>
          </ul>
          <div style={warnBox}>
            <p style={{ fontSize: 13, color: '#ff6b6b', fontWeight: 600, margin: '0 0 4px' }}>
              Arc Flash Impact
            </p>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              Adding time delays to upstream breakers for coordination increases arc flash
              incident energy at those locations. Always recalculate arc flash hazard after
              adjusting coordination settings. Consider arc-reduction maintenance switches for
              maintenance conditions.
            </p>
          </div>
        </ExpandCard>
      </div>
    )
  }

  /* ================================================================ */
  /*  TAB 3: FUSE COORDINATION                                         */
  /* ================================================================ */
  function renderFuseCoordination() {
    return (
      <div style={{ padding: '0 16px' }}>
        <ExpandCard idx={0} expanded={expandedFuse} setExpanded={setExpandedFuse}
          title="Fuse Time-Current Characteristics">
          <p style={bodyText}>
            Fuses have two characteristic curves on a TCC plot:
          </p>
          <div style={{ display: 'grid', gap: 8, marginTop: 6 }}>
            <div style={{ ...card, borderLeft: '3px solid #4ade80', padding: 10 }}>
              <p style={{ fontWeight: 700, color: '#4ade80', fontSize: 13, margin: '0 0 4px' }}>
                Minimum Melting Time
              </p>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                The minimum time for the fuse element to begin melting at a given current.
                This is the left edge of the fuse band on a TCC curve. Below this current,
                the fuse will carry the load indefinitely.
              </p>
            </div>
            <div style={{ ...card, borderLeft: '3px solid #ff6b6b', padding: 10 }}>
              <p style={{ fontWeight: 700, color: '#ff6b6b', fontSize: 13, margin: '0 0 4px' }}>
                Total Clearing Time
              </p>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                The maximum time for the fuse to completely interrupt the circuit, including
                melting time plus arcing time. This is the right edge of the fuse band.
                Always use total clearing time for the downstream device when checking
                coordination.
              </p>
            </div>
          </div>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Coordination Rule:</strong> The total clearing time of the downstream
              fuse must be less than the minimum melting time of the upstream fuse at all
              overcurrent values up to the maximum available fault current.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={1} expanded={expandedFuse} setExpanded={setExpandedFuse}
          title="Fuse Selectivity Ratios">
          <p style={bodyText}>
            Fuse manufacturers publish selectivity ratios that guarantee coordination between
            upstream and downstream fuses of the same class. If the ampere ratio meets the
            minimum, the fuses are selectively coordinated at all fault currents.
          </p>
          <div style={{ ...card, marginTop: 8, marginBottom: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Fuse Class</th>
                  <th style={tableHeader}>Min Ratio</th>
                  <th style={tableHeader}>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Class J</td>
                  <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>2:1</td>
                  <td style={tableCell}>200A upstream / 100A downstream = 2.0 (coordinated)</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Class RK1</td>
                  <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>2:1</td>
                  <td style={tableCell}>200A upstream / 100A downstream = 2.0 (coordinated)</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Class RK5</td>
                  <td style={{ ...tableCell, ...mono, color: '#ff8c00' }}>3:1</td>
                  <td style={tableCell}>300A upstream / 100A downstream = 3.0 (coordinated)</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Class CC</td>
                  <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>2:1</td>
                  <td style={tableCell}>60A upstream / 30A downstream = 2.0 (coordinated)</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Class T</td>
                  <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>2:1</td>
                  <td style={tableCell}>200A upstream / 100A downstream = 2.0 (coordinated)</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Class L</td>
                  <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>2:1</td>
                  <td style={tableCell}>1200A upstream / 600A downstream = 2.0 (coordinated)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={warnBox}>
            <p style={{ fontSize: 13, color: '#ff6b6b', fontWeight: 600, margin: '0 0 4px' }}>
              Mixed Fuse Classes
            </p>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              Selectivity ratios only apply between fuses of the same class. When mixing
              fuse classes (e.g., Class L upstream with Class J downstream), you must compare
              the actual TCC curves to verify coordination. Consult manufacturer data.
            </p>
          </div>
        </ExpandCard>

        {/* Interactive Fuse Coordination Checker */}
        <p style={sectionHeading}>Fuse Coordination Checker</p>
        <div style={{ ...card, marginBottom: 12 }}>
          <p style={label}>Upstream Fuse Class</p>
          <select style={selectStyle} value={upstreamFuseClass}
            onChange={e => setUpstreamFuseClass(e.target.value)}>
            <option value="Class J">Class J (ratio 2:1)</option>
            <option value="Class RK1">Class RK1 (ratio 2:1)</option>
            <option value="Class RK5">Class RK5 (ratio 3:1)</option>
            <option value="Class CC">Class CC (ratio 2:1)</option>
            <option value="Class T">Class T (ratio 2:1)</option>
            <option value="Class L">Class L (ratio 2:1)</option>
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div>
              <p style={label}>Upstream Size (A)</p>
              <input type="number" style={inputStyle} value={upstreamFuseSize}
                onChange={e => setUpstreamFuseSize(Number(e.target.value))} min={1} />
            </div>
            <div>
              <p style={label}>Downstream Size (A)</p>
              <input type="number" style={inputStyle} value={downstreamFuseSize}
                onChange={e => setDownstreamFuseSize(Number(e.target.value))} min={1} />
            </div>
          </div>

          <div style={{
            ...resultBox, marginTop: 12,
            border: fusesCoordinated
              ? '1px solid rgba(74,222,128,0.4)'
              : '1px solid rgba(255,107,107,0.4)',
            background: fusesCoordinated
              ? 'rgba(74,222,128,0.08)'
              : 'rgba(255,107,107,0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                Ampere Ratio:
              </span>
              <span style={{ ...mono, fontSize: 18, fontWeight: 700,
                color: fusesCoordinated ? '#4ade80' : '#ff6b6b' }}>
                {fuseRatio.toFixed(2)}:1
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 14, color: 'var(--text)' }}>Required Ratio:</span>
              <span style={{ ...mono, fontSize: 14, color: 'var(--text-secondary)' }}>
                {requiredRatio.toFixed(1)}:1 ({upstreamFuseClass})
              </span>
            </div>
            <div style={{
              marginTop: 10, padding: '8px 12px', borderRadius: 8, textAlign: 'center',
              background: fusesCoordinated ? 'rgba(74,222,128,0.15)' : 'rgba(255,107,107,0.15)',
              color: fusesCoordinated ? '#4ade80' : '#ff6b6b',
              fontWeight: 700, fontSize: 15,
            }}>
              {fusesCoordinated ? 'COORDINATED' : 'NOT COORDINATED'}
            </div>
            {!fusesCoordinated && (
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, textAlign: 'center' }}>
                Increase upstream size to at least{' '}
                <span style={{ ...mono, color: 'var(--primary)' }}>
                  {Math.ceil(downstreamFuseSize * requiredRatio)}A
                </span>{' '}
                for coordination
              </p>
            )}
          </div>
        </div>

        {/* Pre-built selectivity lookup */}
        <ExpandCard idx={2} expanded={expandedFuse} setExpanded={setExpandedFuse}
          title="Selectivity Lookup Table">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 440 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Upstream</th>
                  <th style={tableHeader}>Downstream</th>
                  <th style={{ ...tableHeader, textAlign: 'center' }}>Ratio</th>
                  <th style={{ ...tableHeader, textAlign: 'center' }}>Coord?</th>
                </tr>
              </thead>
              <tbody>
                {fuseSelectivityData.map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{r.upstream}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{r.downstream}</td>
                    <td style={{ ...tableCell, ...mono, textAlign: 'center' }}>{r.ratio.toFixed(2)}</td>
                    <td style={{
                      ...tableCell, textAlign: 'center', fontWeight: 700,
                      color: r.coordinated ? '#4ade80' : '#ff6b6b',
                    }}>
                      {r.coordinated ? 'YES' : 'NO'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ExpandCard>

        <ExpandCard idx={3} expanded={expandedFuse} setExpanded={setExpandedFuse}
          title="Fuse Class Speed Comparison">
          <p style={bodyText}>
            Different fuse classes clear faults at different speeds. Faster fuses provide
            better current limitation and lower I²t, but may not ride through motor
            starting inrush without nuisance blowing.
          </p>
          <div style={{ ...card, marginTop: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Class</th>
                  <th style={tableHeader}>Speed</th>
                  <th style={tableHeader}>Current Limiting</th>
                  <th style={tableHeader}>AIC</th>
                </tr>
              </thead>
              <tbody>
                {fuseClasses.map(f => (
                  <tr key={f.cls}>
                    <td style={{ ...tableCell, fontWeight: 600 }}>{f.cls}</td>
                    <td style={{
                      ...tableCell, fontWeight: 600,
                      color: f.speed === 'Very Fast' ? '#4ade80'
                        : f.speed === 'Fast' ? '#ffd700' : '#ff8c00',
                    }}>{f.speed}</td>
                    <td style={{ ...tableCell, ...mono }}>
                      {f.currentLimiting ? 'Yes' : 'No'}
                    </td>
                    <td style={{ ...tableCell, ...mono }}>{f.aic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ExpandCard>

        <ExpandCard idx={4} expanded={expandedFuse} setExpanded={setExpandedFuse}
          title="Current-Limiting Fuses: Peak Let-Through">
          <p style={bodyText}>
            Current-limiting fuses interrupt the fault before the first current peak is
            reached. They limit both the peak current and the I²t energy that reaches
            downstream equipment.
          </p>
          <div style={{ ...card, marginTop: 8, marginBottom: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Fuse Rating</th>
                  <th style={tableHeader}>Avail. Fault</th>
                  <th style={tableHeader}>Peak Let-Through</th>
                  <th style={tableHeader}>Reduction</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rating: '30A Class J', fault: '50,000A', peak: '4,500A', reduction: '91%' },
                  { rating: '60A Class J', fault: '50,000A', peak: '8,000A', reduction: '84%' },
                  { rating: '100A Class J', fault: '50,000A', peak: '12,000A', reduction: '76%' },
                  { rating: '200A Class J', fault: '50,000A', peak: '20,000A', reduction: '60%' },
                  { rating: '400A Class J', fault: '50,000A', peak: '32,000A', reduction: '36%' },
                  { rating: '600A Class J', fault: '50,000A', peak: '42,000A', reduction: '16%' },
                  { rating: '100A Class RK1', fault: '50,000A', peak: '15,000A', reduction: '70%' },
                  { rating: '200A Class RK1', fault: '50,000A', peak: '26,000A', reduction: '48%' },
                  { rating: '100A Class RK5', fault: '50,000A', peak: '30,000A', reduction: '40%' },
                  { rating: '200A Class RK5', fault: '50,000A', peak: '45,000A', reduction: '10%' },
                ].map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{r.rating}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{r.fault}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{r.peak}</td>
                    <td style={{ ...tableCell, ...mono, fontWeight: 600, color: '#4ade80' }}>{r.reduction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            Values are approximate and vary by manufacturer. Always consult specific
            manufacturer let-through data (Ip and I²t curves) for engineering calculations.
          </p>
        </ExpandCard>

        <ExpandCard idx={5} expanded={expandedFuse} setExpanded={setExpandedFuse}
          title="Dual-Element vs Single-Element Fuses">
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ ...card, borderLeft: '3px solid #4ade80', padding: 10 }}>
              <p style={{ fontWeight: 700, color: '#4ade80', fontSize: 14, margin: '0 0 6px' }}>
                Dual-Element (Time-Delay)
              </p>
              <ul style={{ ...bulletList, fontSize: 13 }}>
                <li>Two elements in series: overload element + short circuit element</li>
                <li>Time delay on overloads allows motor starting inrush (5-10x FLC for 10-30s)</li>
                <li>Still current-limiting on short circuits</li>
                <li>Can be sized closer to motor FLC (125-175%)</li>
                <li>Identified by &quot;D&quot; suffix or &quot;time-delay&quot; marking</li>
                <li>Use for motor circuits, transformer primaries, capacitor circuits</li>
              </ul>
            </div>
            <div style={{ ...card, borderLeft: '3px solid #ff8c00', padding: 10 }}>
              <p style={{ fontWeight: 700, color: '#ff8c00', fontSize: 14, margin: '0 0 6px' }}>
                Single-Element (Fast-Acting)
              </p>
              <ul style={{ ...bulletList, fontSize: 13 }}>
                <li>One element: responds quickly to all overcurrents</li>
                <li>No time delay -- trips on motor inrush if sized close to FLC</li>
                <li>Must be oversized for motor circuits (250-300%)</li>
                <li>Best for resistive loads, lighting, heating</li>
                <li>Provides faster fault clearing but less coordination flexibility</li>
                <li>Lower cost than dual-element</li>
              </ul>
            </div>
          </div>
        </ExpandCard>

        <ExpandCard idx={6} expanded={expandedFuse} setExpanded={setExpandedFuse}
          title="Fuse-Breaker Coordination">
          <p style={bodyText}>
            When a fuse is upstream of a circuit breaker (or vice versa), coordination must
            be verified by comparing actual TCC curves. Simple ampere ratios do not apply
            to mixed device types.
          </p>
          <div style={{ ...card, marginTop: 8 }}>
            <p style={{ ...sectionHeading, margin: '0 0 8px' }}>Common Configurations</p>
            <div style={{ display: 'grid', gap: 6 }}>
              {[
                { config: 'Fuse (upstream) + Breaker (downstream)', note: 'Most common. Fuse provides current limiting that protects breaker. Verify breaker total clearing is below fuse minimum melting time at all fault currents.' },
                { config: 'Breaker (upstream) + Fuse (downstream)', note: 'Less common. Fuse typically clears faster than breaker for high faults. Verify fuse total clearing is below breaker minimum trip time.' },
                { config: 'Class L fuse (main) + Class J fuse (feeder)', note: 'Good coordination. Both are current limiting. Use manufacturer selectivity tables for mixed-class verification.' },
                { config: 'Class J fuse (feeder) + MCCB (branch)', note: 'Very common in commercial/industrial. Fuse minimum melting must exceed breaker total clearing at all currents.' },
              ].map((c, i) => (
                <div key={i} style={{ ...card, padding: 10 }}>
                  <p style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 13, margin: '0 0 4px' }}>
                    {c.config}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                    {c.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Series Rating with Fuses:</strong> A current-limiting fuse upstream of a
              breaker can provide a series rating, allowing the breaker to have a lower AIC
              than the available fault current. The fuse limits the let-through current to
              within the breaker&#39;s interrupting capacity. The combination must be tested and
              listed per CEC Rule 14-014.
            </p>
          </div>
        </ExpandCard>
      </div>
    )
  }

  /* ================================================================ */
  /*  TAB 4: COORDINATION STUDY                                        */
  /* ================================================================ */
  function renderCoordinationStudy() {
    return (
      <div style={{ padding: '0 16px' }}>
        <ExpandCard idx={0} expanded={expandedStudy} setExpanded={setExpandedStudy}
          title="When Is a Coordination Study Required?">
          <ul style={bulletList}>
            <li><strong>Healthcare facilities:</strong> CEC and CSA Z32 require selective coordination for the essential electrical system (life safety and critical branch)</li>
            <li><strong>Emergency systems:</strong> Selective coordination required from the load to the alternate power source</li>
            <li><strong>Buildings over 600V:</strong> Generally required by the authority having jurisdiction (AHJ)</li>
            <li><strong>Large commercial/industrial:</strong> Recommended practice for systems over 1000A service</li>
            <li><strong>Data centers:</strong> Industry standard (Uptime Institute Tier requirements)</li>
            <li><strong>Process facilities:</strong> Where unexpected shutdowns cause safety or financial impact</li>
            <li><strong>Building code:</strong> Ontario Building Code may require for specific occupancies</li>
            <li><strong>Insurance requirements:</strong> FM Global and other insurers may require coordination studies</li>
          </ul>
        </ExpandCard>

        <ExpandCard idx={1} expanded={expandedStudy} setExpanded={setExpandedStudy}
          title="Step-by-Step Coordination Study Process">
          <ol style={{ ...bulletList, listStyleType: 'decimal', paddingLeft: 24 }}>
            <li>
              <strong>Collect system data:</strong> Single-line diagram, equipment nameplate data, cable sizes and lengths, transformer impedance data, utility available fault current at service entrance.
            </li>
            <li>
              <strong>Perform short circuit study:</strong> Calculate available fault current at each bus in the system using the point-to-point method or software. Document bolted 3-phase and line-to-ground fault values.
            </li>
            <li>
              <strong>Select protective devices:</strong> Choose breaker frame sizes, trip units, and fuse classes/sizes that provide adequate protection for the connected conductors and equipment.
            </li>
            <li>
              <strong>Plot TCC curves:</strong> Plot all devices in the coordination path on a single TCC plot, from the utility source down to the smallest branch circuit device.
            </li>
            <li>
              <strong>Adjust settings:</strong> Set electronic trip unit pickups and delays to achieve separation between adjacent device curves. Start from the load side and work upstream.
            </li>
            <li>
              <strong>Verify coordination:</strong> Confirm that at every fault current level up to the maximum available, the downstream device clears the fault before the upstream device begins to respond.
            </li>
            <li>
              <strong>Check equipment protection:</strong> Verify that conductor damage curves, transformer damage curves, and motor thermal limits are protected by the selected device settings.
            </li>
            <li>
              <strong>Document findings:</strong> Prepare coordination study report with TCC plots, short circuit values, recommended settings, and any areas where coordination is not achieved.
            </li>
          </ol>
        </ExpandCard>

        {/* Interactive Coordination Calculator */}
        <p style={sectionHeading}>Coordination Calculator</p>
        <div style={{ ...card, marginBottom: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
            Enter breaker sizes to check basic coordination ratios:
          </p>

          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <p style={label}>Main Breaker Size (A)</p>
              <input type="number" style={inputStyle} value={mainBreakerSize}
                onChange={e => setMainBreakerSize(Number(e.target.value))} min={1} />
            </div>
            <div>
              <p style={label}>Feeder Breaker Size (A)</p>
              <input type="number" style={inputStyle} value={feederBreakerSize}
                onChange={e => setFeederBreakerSize(Number(e.target.value))} min={1} />
            </div>
            <div>
              <p style={label}>Branch Breaker Size (A)</p>
              <input type="number" style={inputStyle} value={branchBreakerSize}
                onChange={e => setBranchBreakerSize(Number(e.target.value))} min={1} />
            </div>
            <div>
              <p style={label}>Available Fault Current at Main (A)</p>
              <input type="number" style={inputStyle} value={availableFaultCurrent}
                onChange={e => setAvailableFaultCurrent(Number(e.target.value))} min={1} />
            </div>
          </div>

          {/* Results */}
          <div style={{ marginTop: 14 }}>
            <p style={{ ...sectionHeading, margin: '0 0 8px' }}>Results</p>

            {/* Main to Feeder */}
            <div style={{
              ...card, padding: 10, marginBottom: 8,
              borderLeft: `3px solid ${mainFeederCoord ? '#4ade80' : '#ff6b6b'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>Main &rarr; Feeder</span>
                <span style={{
                  ...mono, fontSize: 15, fontWeight: 700,
                  color: mainFeederCoord ? '#4ade80' : '#ff6b6b',
                }}>
                  {mainToFeederRatio.toFixed(2)}:1
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {mainBreakerSize}A / {feederBreakerSize}A
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: mainFeederCoord ? '#4ade80' : '#ff6b6b',
                }}>
                  {mainFeederCoord ? 'PASS (>=2:1)' : 'FAIL (<2:1)'}
                </span>
              </div>
            </div>

            {/* Feeder to Branch */}
            <div style={{
              ...card, padding: 10, marginBottom: 8,
              borderLeft: `3px solid ${feederBranchCoord ? '#4ade80' : '#ff6b6b'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>Feeder &rarr; Branch</span>
                <span style={{
                  ...mono, fontSize: 15, fontWeight: 700,
                  color: feederBranchCoord ? '#4ade80' : '#ff6b6b',
                }}>
                  {feederToBranchRatio.toFixed(2)}:1
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {feederBreakerSize}A / {branchBreakerSize}A
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: feederBranchCoord ? '#4ade80' : '#ff6b6b',
                }}>
                  {feederBranchCoord ? 'PASS (>=2:1)' : 'FAIL (<2:1)'}
                </span>
              </div>
            </div>

            {/* Fault Current Check */}
            <div style={{
              ...card, padding: 10, marginBottom: 8,
              borderLeft: '3px solid var(--primary)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>Available Fault Current</span>
                <span style={{ ...mono, fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
                  {faultCurrentKA.toFixed(1)} kA
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                All devices must have AIC rating &ge; {faultCurrentKA.toFixed(1)} kA at their location
              </p>
            </div>

            {/* Overall Result */}
            <div style={{
              padding: '12px 16px', borderRadius: 'var(--radius)', textAlign: 'center',
              background: overallCoord ? 'rgba(74,222,128,0.12)' : 'rgba(255,107,107,0.12)',
              border: `1px solid ${overallCoord ? 'rgba(74,222,128,0.3)' : 'rgba(255,107,107,0.3)'}`,
            }}>
              <p style={{
                fontSize: 16, fontWeight: 700, margin: '0 0 4px',
                color: overallCoord ? '#4ade80' : '#ff6b6b',
              }}>
                {overallCoord ? 'BASIC COORDINATION ACHIEVED' : 'COORDINATION NOT ACHIEVED'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                {overallCoord
                  ? 'Ampere ratios meet minimum 2:1 requirement. Verify with actual TCC curves for full coordination.'
                  : 'One or more ratios below 2:1. Increase upstream or decrease downstream device sizes.'}
              </p>
            </div>
          </div>

          <div style={{ ...noteBox, marginTop: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Note:</strong> This calculator checks basic ampere ratios only. True
              selective coordination requires TCC curve analysis with actual device
              characteristics, including instantaneous trip overlap. A 2:1 ampere ratio is a
              necessary but not sufficient condition for coordination with thermal-magnetic
              breakers.
            </p>
          </div>
        </div>

        <ExpandCard idx={2} expanded={expandedStudy} setExpanded={setExpandedStudy}
          title="Short Circuit Impact on Coordination">
          <p style={bodyText}>
            The available fault current at each point in the system directly impacts whether
            devices can coordinate. As fault current increases, devices respond faster, and
            the time separation between adjacent devices shrinks.
          </p>
          <ul style={bulletList}>
            <li><strong>Low fault current (&lt;5kA):</strong> Devices typically in their inverse-time (thermal) region. Coordination is usually easy to achieve.</li>
            <li><strong>Medium fault current (5-25kA):</strong> Some devices may enter their instantaneous region. Coordination becomes more challenging.</li>
            <li><strong>High fault current (&gt;25kA):</strong> Most devices in their instantaneous region. Thermal-magnetic breakers often cannot coordinate. Electronic trip units with short-time delay or fuses needed.</li>
          </ul>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Key point:</strong> Available fault current decreases as you move
              downstream due to cable impedance. A 42kA fault at the main panel might reduce
              to 18kA at a downstream sub-panel 30m away on a small conductor.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={3} expanded={expandedStudy} setExpanded={setExpandedStudy}
          title="Common Coordination Problems and Solutions">
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              {
                problem: 'Thermal-magnetic breakers overlap in instantaneous region',
                solution: 'Replace upstream breaker with electronic trip unit that has adjustable short-time delay. Or use current-limiting fuses upstream.',
                severity: 'high',
              },
              {
                problem: 'Ground fault settings on main and feeder overlap',
                solution: 'Set upstream GF delay to at least 6 cycles longer than downstream GF clearing time. CEC limits main GF to max 1200A pickup, 1 second delay.',
                severity: 'medium',
              },
              {
                problem: 'Generator fault current too low for breaker coordination',
                solution: 'Generator fault current is typically 3-10x rated current. Use fuses or adjust breaker settings for the lower fault current on emergency source.',
                severity: 'high',
              },
              {
                problem: 'Motor contribution adds to fault current',
                solution: 'Motor contribution (typically 4-6x motor FLC) adds to available fault current at the bus. Include motor contribution in short circuit calculations.',
                severity: 'low',
              },
              {
                problem: 'Transformer secondary main and largest feeder too close in size',
                solution: 'Consider using fuses for the main protection and breakers for feeders. Or use electronic trip unit on the main with short-time delay.',
                severity: 'medium',
              },
              {
                problem: 'Arc flash energy too high due to coordination delays',
                solution: 'Implement zone-selective interlocking (ZSI), arc-reduction maintenance switches, or optical arc flash relays to reduce clearing time during maintenance.',
                severity: 'high',
              },
            ].map((item, i) => (
              <div key={i} style={{
                ...card, padding: 10,
                borderLeft: `3px solid ${item.severity === 'high' ? '#ff6b6b' : item.severity === 'medium' ? '#ff8c00' : '#ffd700'}`,
              }}>
                <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, margin: '0 0 4px' }}>
                  {item.problem}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: '#4ade80' }}>Solution:</strong> {item.solution}
                </p>
              </div>
            ))}
          </div>
        </ExpandCard>

        <ExpandCard idx={4} expanded={expandedStudy} setExpanded={setExpandedStudy}
          title="Industry Software Tools">
          <p style={bodyText}>
            Professional coordination studies use specialized software to plot TCC curves,
            calculate fault currents, and verify coordination across the entire system:
          </p>
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            {[
              { name: 'ETAP', desc: 'Enterprise-level power system analysis. TCC plotting, arc flash, short circuit, load flow, motor starting. Widely used in large industrial and utility applications.' },
              { name: 'SKM Power*Tools', desc: 'Comprehensive power systems analysis. Popular in North America for coordination studies. Includes device libraries for major manufacturers.' },
              { name: 'EasyPower', desc: 'User-friendly power system software. Good for coordination, arc flash, and short circuit. Drag-and-drop interface suitable for smaller engineering firms.' },
              { name: 'EDSA Paladin', desc: 'Real-time power monitoring and analysis platform. Includes arc flash and coordination analysis capabilities.' },
              { name: 'Manufacturer Tools', desc: 'Schneider Electric (Coordination Panel Builder), Eaton (COMplete), ABB (DOCWin), Siemens (SIMARIS design). Free or low-cost, limited to that manufacturer\'s devices.' },
            ].map((tool, i) => (
              <div key={i} style={{ ...card, padding: 10 }}>
                <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14, margin: '0 0 4px' }}>
                  {tool.name}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </ExpandCard>

        <ExpandCard idx={5} expanded={expandedStudy} setExpanded={setExpandedStudy}
          title="Available Fault Current at Each Level">
          <p style={bodyText}>
            Fault current decreases as it travels through transformers, conductors, and
            connections. Understanding the available fault current at each level is essential
            for selecting devices with adequate interrupting capacity and verifying
            coordination.
          </p>
          <div style={{
            ...card, ...mono, fontSize: 11, lineHeight: 1.5, padding: 14,
            overflowX: 'auto', whiteSpace: 'pre', color: 'var(--text)',
            background: 'rgba(0,0,0,0.3)',
          }}>
{`UTILITY SOURCE .................. 200,000A (200 kA)
      |
  TRANSFORMER (1000 kVA, 5.75%Z)
      |
  MAIN BUS ....................... 42,000A (42 kA)
      |
  FEEDER (3/0 Cu, 30m in EMT)
      |
  PANEL A ........................ 28,000A (28 kA)
      |
  BRANCH (10 AWG Cu, 25m in EMT)
      |
  LOAD ........................... 8,500A (8.5 kA)

KEY FACTORS REDUCING FAULT CURRENT:
  - Transformer impedance (%Z)
  - Cable impedance (R + jX per metre)
  - Connection resistance
  - Cable length (longer = more impedance)`}
          </div>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>AIC Rule:</strong> Every protective device must have an interrupting
              capacity (AIC) rating equal to or greater than the available fault current at
              its location (CEC Rule 14-012). Failure to meet this requirement is a code
              violation and a serious safety hazard.
            </p>
          </div>
        </ExpandCard>
      </div>
    )
  }

  /* ================================================================ */
  /*  TAB 5: CEC REQUIREMENTS                                         */
  /* ================================================================ */
  function renderCECRequirements() {
    return (
      <div style={{ padding: '0 16px' }}>
        <ExpandCard idx={0} expanded={expandedCec} setExpanded={setExpandedCec}
          title="CEC Rule 14-010: General Overcurrent Protection">
          <p style={bodyText}>
            CEC Section 14 establishes the requirements for overcurrent protection of
            conductors, equipment, and circuits. Rule 14-010 requires that overcurrent
            protection be provided for all ungrounded conductors.
          </p>
          <ul style={bulletList}>
            <li>Every ungrounded conductor must have overcurrent protection at the point where it receives its supply (Rule 14-010)</li>
            <li>Overcurrent device must be rated or set at not more than the ampacity of the conductor it protects (with specific exceptions for motor and transformer circuits)</li>
            <li>Overcurrent devices must be located at the point where the conductor receives its supply, unless exceptions in Rule 14-010 apply</li>
            <li>Tap conductors without overcurrent protection at the point of supply are permitted under specific conditions (Rule 14-100)</li>
            <li>The next higher standard rating of overcurrent device is permitted when conductor ampacity does not match a standard rating (Rule 14-104)</li>
          </ul>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Next Higher Standard Rating:</strong> Per Rule 14-104, where the ampacity
              of a conductor does not correspond to a standard overcurrent device rating from
              Table 13, the next higher standard rating is permitted for circuits up to 800A.
              For circuits over 800A, the next lower standard rating must be used.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={1} expanded={expandedCec} setExpanded={setExpandedCec}
          title="CEC Rule 14-012: Interrupting Capacity">
          <p style={bodyText}>
            Every overcurrent device must have an interrupting capacity (AIC) sufficient for
            the maximum fault current available at its line terminals.
          </p>
          <div style={warnBox}>
            <p style={{ fontSize: 13, color: '#ff6b6b', fontWeight: 600, margin: '0 0 6px' }}>
              Critical CEC Requirement
            </p>
            <ul style={{ ...bulletList, fontSize: 13, margin: 0 }}>
              <li>Interrupting rating must equal or exceed available fault current at the device location</li>
              <li>If no AIC is marked on the device, it is assumed to be 5,000A (for fuses) or 5,000A for breakers unless otherwise listed</li>
              <li>Both 3-phase and single-phase fault currents must be considered</li>
              <li>Motor contribution to fault current must be included</li>
              <li>Series-rated systems (Rule 14-014) allow a lower downstream AIC when the upstream device limits fault current, but must be tested and listed as a combination</li>
            </ul>
          </div>
          <div style={{ ...card, marginTop: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: '0 0 6px' }}>
              Common AIC Ratings
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[5, 10, 14, 18, 22, 25, 35, 42, 50, 65, 100, 200].map(v => (
                <span key={v} style={{
                  ...mono, fontSize: 12, padding: '4px 10px', borderRadius: 4,
                  background: 'rgba(255,215,0,0.1)', color: 'var(--primary)',
                  border: '1px solid rgba(255,215,0,0.2)',
                }}>
                  {v} kA
                </span>
              ))}
            </div>
          </div>
        </ExpandCard>

        <ExpandCard idx={2} expanded={expandedCec} setExpanded={setExpandedCec}
          title="CEC Table 13: Standard OC Device Ratings">
          <p style={bodyText}>
            CEC Table 13 lists the standard ampere ratings for overcurrent devices (fuses
            and circuit breakers):
          </p>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8,
            padding: 12, ...card,
          }}>
            {standardRatings.map(r => (
              <span key={r} style={{
                ...mono, fontSize: 12, padding: '4px 10px', borderRadius: 4,
                background: 'rgba(255,215,0,0.06)',
                color: 'var(--text)',
                border: '1px solid var(--divider)',
                minWidth: 48, textAlign: 'center',
              }}>
                {r}A
              </span>
            ))}
          </div>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Application:</strong> When conductor ampacity falls between standard
              ratings, use the next higher rating for circuits 800A and below (Rule 14-104).
              For circuits above 800A, use the next lower standard rating.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={3} expanded={expandedCec} setExpanded={setExpandedCec}
          title="Series Rating (CEC Rule 14-014)">
          <p style={bodyText}>
            A series-rated system uses an upstream current-limiting device to protect a
            downstream device with a lower interrupting capacity than the available fault
            current.
          </p>
          <ul style={bulletList}>
            <li><strong>Testing required:</strong> The combination must be tested and listed by a recognized testing laboratory (CSA, UL)</li>
            <li><strong>Same manufacturer:</strong> Both devices must typically be from the same manufacturer or the combination must be specifically listed</li>
            <li><strong>Labelling:</strong> Equipment must be clearly labelled &quot;CAUTION - Series Rated System - {'{'}Upstream Device{'}'} Required&quot;</li>
            <li><strong>Replacement restriction:</strong> Only identical replacement devices may be used -- substitution violates the series rating</li>
            <li><strong>Not for selective coordination:</strong> Series-rated systems do not provide selective coordination. Both devices may trip on a downstream fault.</li>
            <li><strong>Motor circuit exception:</strong> Series-rated motor circuit combinations have additional requirements per CEC Rule 28</li>
          </ul>
          <div style={warnBox}>
            <p style={{ fontSize: 13, color: '#ff6b6b', fontWeight: 600, margin: '0 0 4px' }}>
              Prohibited Applications
            </p>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              Series-rated systems are not permitted for healthcare essential electrical
              systems, emergency systems requiring selective coordination, or elevator
              circuits requiring selective coordination.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={4} expanded={expandedCec} setExpanded={setExpandedCec}
          title="Ground Fault Protection (CEC Rule 14-102)">
          <p style={bodyText}>
            CEC Rule 14-102 requires ground fault protection (GFP) for specific
            installations:
          </p>
          <div style={{ ...card, marginTop: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Requirement</th>
                  <th style={tableHeader}>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>When Required</td>
                  <td style={tableCell}>Services rated 1000A or more, at more than 150V to ground (includes 347/600V and 277/480V wye systems)</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Maximum Pickup</td>
                  <td style={{ ...tableCell, ...mono }}>1200A</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Maximum Delay</td>
                  <td style={{ ...tableCell, ...mono }}>1.0 second at any current &ge; 3000A</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Testing</td>
                  <td style={tableCell}>Must be performance tested when first installed (Rule 14-102(3))</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Second Level</td>
                  <td style={tableCell}>Where a feeder disconnect is rated 1000A+ and downstream of GFP main, a second level of GFP is required. Must coordinate with main GFP.</td>
                </tr>
                <tr>
                  <td style={{ ...tableCell, fontWeight: 600 }}>Exemptions</td>
                  <td style={tableCell}>Fire pumps, continuous industrial process where shutdown is more hazardous than a ground fault</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={noteBox}>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              <strong>Coordination of GFP Levels:</strong> When two levels of GFP exist, the
              downstream device must clear the ground fault before the upstream device trips.
              This requires the upstream GFP delay to exceed the downstream GFP total clearing
              time by at least 6 cycles (0.1s) separation.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={5} expanded={expandedCec} setExpanded={setExpandedCec}
          title="Emergency System Coordination">
          <p style={bodyText}>
            Emergency systems (life safety, fire alarm, exit lighting) require selective
            coordination to ensure that a fault on one emergency circuit does not interrupt
            other emergency circuits.
          </p>
          <ul style={bulletList}>
            <li>Selective coordination required from each emergency load back to the alternate power source (generator or UPS)</li>
            <li>Must be coordinated on both the normal and emergency power sources</li>
            <li>Generator fault current is typically much lower than utility fault current -- coordination must work at both levels</li>
            <li>Transfer switch creates two separate coordination paths that must both be verified</li>
            <li>Electronic trip breakers with adjustable settings are often required to achieve coordination</li>
            <li>Current-limiting fuses can simplify emergency system coordination</li>
          </ul>
          <div style={{
            ...card, ...mono, fontSize: 11, lineHeight: 1.5, padding: 14,
            overflowX: 'auto', whiteSpace: 'pre', color: 'var(--text)',
            background: 'rgba(0,0,0,0.3)', marginTop: 8,
          }}>
{`  NORMAL SOURCE    EMERGENCY SOURCE
  (Utility)        (Generator)
      |                  |
      +---[ATS Switch]---+
              |
        +----------+
        |  Emerg.  |
        |  Panel   |
        +----------+
         |   |   |
        Exit Fire Life
        Ltg  Alm  Safety

  Must coordinate on BOTH paths:
  - Utility -> ATS -> Panel -> Branch
  - Generator -> ATS -> Panel -> Branch`}
          </div>
        </ExpandCard>

        <ExpandCard idx={6} expanded={expandedCec} setExpanded={setExpandedCec}
          title="Healthcare Facility Requirements">
          <p style={bodyText}>
            Healthcare facilities in Ontario must comply with CEC Section 24 and CSA Z32 for
            electrical systems. The essential electrical system has specific overcurrent
            coordination requirements:
          </p>
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <div style={{ ...card, borderLeft: '3px solid #ff6b6b', padding: 10 }}>
              <p style={{ fontWeight: 700, color: '#ff6b6b', fontSize: 13, margin: '0 0 4px' }}>
                Life Safety Branch
              </p>
              <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                Full selective coordination required. Includes exit lighting, fire alarm,
                medical gas alarms, communication systems. Must coordinate on both normal
                and emergency power sources.
              </p>
            </div>
            <div style={{ ...card, borderLeft: '3px solid #ff8c00', padding: 10 }}>
              <p style={{ fontWeight: 700, color: '#ff8c00', fontSize: 13, margin: '0 0 4px' }}>
                Critical Branch
              </p>
              <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                Full selective coordination required. Includes patient care areas, nurse
                call, operating rooms, ICU, special care areas. A fault on one circuit must
                not disrupt other critical branch circuits.
              </p>
            </div>
            <div style={{ ...card, borderLeft: '3px solid #ffd700', padding: 10 }}>
              <p style={{ fontWeight: 700, color: '#ffd700', fontSize: 13, margin: '0 0 4px' }}>
                Equipment Branch
              </p>
              <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>
                Selective coordination recommended but not always mandatory. Includes
                HVAC for patient areas, elevators, supply and exhaust ventilation for
                operating rooms.
              </p>
            </div>
          </div>
        </ExpandCard>

        <ExpandCard idx={7} expanded={expandedCec} setExpanded={setExpandedCec}
          title="Arc Flash Impact of Coordination Choices">
          <p style={bodyText}>
            Coordination settings directly affect arc flash incident energy. Adding time
            delays to achieve coordination increases the duration of an arc fault, which
            increases the arc flash energy at that equipment.
          </p>
          <div style={{ ...card, marginTop: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Coordination Choice</th>
                  <th style={tableHeader}>Arc Flash Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tableCell}>Adding short-time delay to upstream breaker</td>
                  <td style={{ ...tableCell, color: '#ff6b6b' }}>Increases arc flash energy at upstream equipment. May increase PPE category.</td>
                </tr>
                <tr>
                  <td style={tableCell}>Using current-limiting fuses</td>
                  <td style={{ ...tableCell, color: '#4ade80' }}>Reduces arc flash energy significantly. Clears in less than half a cycle.</td>
                </tr>
                <tr>
                  <td style={tableCell}>Zone Selective Interlocking (ZSI)</td>
                  <td style={{ ...tableCell, color: '#4ade80' }}>Allows instantaneous trip on local faults while maintaining coordination for downstream faults.</td>
                </tr>
                <tr>
                  <td style={tableCell}>Arc-reduction maintenance switch</td>
                  <td style={{ ...tableCell, color: '#4ade80' }}>Switches to instantaneous trip during maintenance, reducing arc energy. Sacrifices coordination temporarily.</td>
                </tr>
                <tr>
                  <td style={tableCell}>Increasing ground fault delay</td>
                  <td style={{ ...tableCell, color: '#ff8c00' }}>Moderate increase in arc energy for ground faults. GF usually limited to 1200A pickup.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={warnBox}>
            <p style={{ fontSize: 13, color: '#ff6b6b', fontWeight: 600, margin: '0 0 4px' }}>
              Always Recalculate
            </p>
            <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              After completing a coordination study and adjusting device settings, always
              recalculate arc flash incident energy. Updated arc flash labels must be applied
              to all affected equipment per CSA Z462.
            </p>
          </div>
        </ExpandCard>

        <ExpandCard idx={8} expanded={expandedCec} setExpanded={setExpandedCec}
          title="Common CEC Violations">
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              {
                violation: 'AIC rating less than available fault current',
                rule: 'Rule 14-012',
                consequence: 'Device may explode on fault, releasing arc blast energy. Serious safety hazard.',
                fix: 'Replace with device rated for available fault current, or add upstream current-limiting device (series rating per Rule 14-014).',
              },
              {
                violation: 'Overcurrent device rated above conductor ampacity',
                rule: 'Rule 14-010',
                consequence: 'Conductor can overheat and cause fire before the device trips.',
                fix: 'Reduce device rating to match conductor ampacity, or increase conductor size.',
              },
              {
                violation: 'Missing ground fault protection on 1000A+ service',
                rule: 'Rule 14-102',
                consequence: 'Arcing ground faults may not be detected, leading to equipment damage and fire.',
                fix: 'Install GFP relay or electronic trip breaker with GF function. Maximum 1200A pickup, 1 second delay.',
              },
              {
                violation: 'GFP not performance tested at initial installation',
                rule: 'Rule 14-102(3)',
                consequence: 'GFP may not function correctly. Wiring errors or CT orientation issues could prevent proper operation.',
                fix: 'Perform primary injection test to verify GFP trips within specified time and current settings.',
              },
              {
                violation: 'Series rated system without proper labelling',
                rule: 'Rule 14-014',
                consequence: 'Maintenance personnel may replace device with incorrect substitute, invalidating the series rating.',
                fix: 'Apply permanent label identifying the series-rated combination and required upstream device.',
              },
              {
                violation: 'Emergency system devices not selectively coordinated',
                rule: 'CEC Section 46',
                consequence: 'A fault on one emergency circuit could trip the upstream device and interrupt all emergency power.',
                fix: 'Perform coordination study. Use electronic trip breakers or fuses to achieve selective coordination.',
              },
              {
                violation: 'Overcurrent device not accessible',
                rule: 'Rule 14-010',
                consequence: 'Cannot reset or operate the device in an emergency or during maintenance.',
                fix: 'Relocate device to an accessible location or provide remote operating mechanism.',
              },
              {
                violation: 'Tap conductors exceed length or ampacity limits',
                rule: 'Rule 14-100',
                consequence: 'Unprotected conductor length may allow fault to damage conductor before upstream device clears.',
                fix: 'Limit tap length per Rule 14-100 (3m for 10-ft tap rule, 7.5m for 25-ft tap rule with conditions).',
              },
            ].map((item, i) => (
              <div key={i} style={{ ...card, padding: 10, borderLeft: '3px solid #ff6b6b' }}>
                <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, margin: '0 0 2px' }}>
                  {item.violation}
                </p>
                <p style={{ ...mono, fontSize: 11, color: 'var(--primary)', margin: '0 0 4px' }}>
                  {item.rule}
                </p>
                <p style={{ fontSize: 12, color: '#ff6b6b', margin: '0 0 4px', lineHeight: 1.4 }}>
                  {item.consequence}
                </p>
                <p style={{ fontSize: 12, color: '#4ade80', margin: 0, lineHeight: 1.4 }}>
                  <strong>Fix:</strong> {item.fix}
                </p>
              </div>
            ))}
          </div>
        </ExpandCard>
      </div>
    )
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '18px 16px 10px',
        borderBottom: '1px solid var(--divider)',
        background: 'var(--surface)',
      }}>
        <button onClick={() => nav(-1)} style={{
          background: 'none', border: 'none', color: 'var(--primary)',
          fontSize: 22, cursor: 'pointer', padding: 4,
        }}>
          &#8592;
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          Overcurrent Coordination
        </h1>
      </div>

      {/* Tab pills */}
      <div style={pillRow}>
        {tabs.map(t => (
          <button key={t.key}
            style={tab === t.key ? pillActive : pillBase}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'fundamentals' && renderFundamentals()}
      {tab === 'breakers' && renderBreakerCurves()}
      {tab === 'fuses' && renderFuseCoordination()}
      {tab === 'study' && renderCoordinationStudy()}
      {tab === 'cec' && renderCECRequirements()}
    </div>
  )
}
