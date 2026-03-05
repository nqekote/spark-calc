import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Multimeter & Test Equipment Reference                              */
/*  Ontario Mining Electrician — SparkCalc                             */
/* ------------------------------------------------------------------ */

type TabKey = 'voltage' | 'current' | 'resistance' | 'specialty' | 'safety'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'voltage', label: 'Voltage' },
  { key: 'current', label: 'Current' },
  { key: 'resistance', label: 'Resistance' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'safety', label: 'Safety' },
]

/* ------------------------------------------------------------------ */
/*  Data — Voltage Tab                                                 */
/* ------------------------------------------------------------------ */

interface VoltageRow {
  system: string
  nominal: string
  min: string
  max: string
  notes: string
}

const canadianVoltages: VoltageRow[] = [
  { system: '1φ Residential', nominal: '120V', min: '114V', max: '126V', notes: 'L-N, standard outlets' },
  { system: '1φ Residential', nominal: '240V', min: '228V', max: '252V', notes: 'L-L, ranges/dryers' },
  { system: '3φ Wye 120/208V', nominal: '208V', min: '197V', max: '218V', notes: 'L-L, commercial' },
  { system: '3φ Delta', nominal: '240V', min: '228V', max: '252V', notes: 'L-L, older industrial' },
  { system: '3φ Wye 347/600V', nominal: '347V', min: '330V', max: '364V', notes: 'L-N, lighting in commercial/industrial' },
  { system: '3φ Wye 347/600V', nominal: '480V', min: '456V', max: '504V', notes: 'L-L, US industrial (seen in some Canadian mines)' },
  { system: '3φ Wye 347/600V', nominal: '600V', min: '570V', max: '630V', notes: 'L-L, Canadian industrial/mining standard' },
  { system: 'DC Control', nominal: '24VDC', min: '20V', max: '28V', notes: 'PLC I/O, sensors, solenoids' },
  { system: 'DC Control', nominal: '48VDC', min: '42V', max: '54V', notes: 'Telecom, some mine controls' },
  { system: 'DC Control', nominal: '125VDC', min: '105V', max: '140V', notes: 'Substation battery banks, trip coils' },
]

/* ------------------------------------------------------------------ */
/*  Data — Current Tab                                                 */
/* ------------------------------------------------------------------ */

interface MotorAmpRow {
  hp: string
  v208: string
  v480: string
  v600: string
}

const motorAmps: MotorAmpRow[] = [
  { hp: '1', v208: '4.6', v480: '2.1', v600: '1.7' },
  { hp: '2', v208: '6.8', v480: '3.0', v600: '2.4' },
  { hp: '3', v208: '9.6', v480: '4.2', v600: '3.4' },
  { hp: '5', v208: '15.2', v480: '6.6', v600: '5.3' },
  { hp: '7.5', v208: '22', v480: '9.6', v600: '7.7' },
  { hp: '10', v208: '28', v480: '12.2', v600: '9.8' },
  { hp: '15', v208: '42', v480: '18.4', v600: '14.7' },
  { hp: '20', v208: '54', v480: '23.5', v600: '18.8' },
  { hp: '25', v208: '68', v480: '29.4', v600: '23.5' },
  { hp: '30', v208: '80', v480: '34.8', v600: '27.8' },
  { hp: '40', v208: '104', v480: '45.2', v600: '36.2' },
  { hp: '50', v208: '130', v480: '56.5', v600: '45.2' },
  { hp: '60', v208: '154', v480: '67', v600: '53.6' },
  { hp: '75', v208: '192', v480: '83.5', v600: '66.8' },
  { hp: '100', v208: '248', v480: '108', v600: '86.4' },
  { hp: '125', v208: '312', v480: '135', v600: '108' },
  { hp: '150', v208: '360', v480: '156', v600: '125' },
  { hp: '200', v208: '480', v480: '208', v600: '167' },
]

/* ------------------------------------------------------------------ */
/*  Data — Resistance Tab                                              */
/* ------------------------------------------------------------------ */

interface MeggerRow {
  voltageClass: string
  testVoltage: string
  minInsulation: string
  notes: string
}

const meggerValues: MeggerRow[] = [
  { voltageClass: '120V', testVoltage: '500V DC', minInsulation: '1 MΩ', notes: 'Residential/control wiring' },
  { voltageClass: '240V', testVoltage: '500V DC', minInsulation: '1 MΩ', notes: 'Single phase power' },
  { voltageClass: '600V', testVoltage: '1000V DC', minInsulation: '2 MΩ', notes: 'Standard mine power — 1 MΩ/kV + 1 MΩ' },
  { voltageClass: '1000V', testVoltage: '1000V DC', minInsulation: '2 MΩ', notes: 'Low voltage switchgear' },
  { voltageClass: '2400V', testVoltage: '2500V DC', minInsulation: '3.4 MΩ', notes: 'Medium voltage distribution' },
  { voltageClass: '4160V', testVoltage: '2500V DC', minInsulation: '5.16 MΩ', notes: 'Medium voltage mine feeders' },
  { voltageClass: '5000V', testVoltage: '2500V DC', minInsulation: '6 MΩ', notes: 'Common trailing cable voltage' },
  { voltageClass: '13.8kV', testVoltage: '5000V DC', minInsulation: '14.8 MΩ', notes: 'Primary distribution' },
  { voltageClass: '25kV', testVoltage: '5000V DC', minInsulation: '26 MΩ', notes: 'Utility supply' },
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

const tableWrap: React.CSSProperties = {
  overflowX: 'auto', WebkitOverflowScrolling: 'touch',
  borderRadius: 'var(--radius-sm)', border: '1px solid var(--divider)',
}
const th: React.CSSProperties = {
  padding: '12px 12px', fontSize: 12, fontWeight: 700,
  color: 'var(--text-secondary)', textTransform: 'uppercase',
  letterSpacing: 0.3, textAlign: 'left', whiteSpace: 'nowrap',
  background: 'var(--surface)', borderBottom: '2px solid var(--divider)',
}
const td: React.CSSProperties = {
  padding: '12px 12px', fontSize: 14, color: 'var(--text)',
  whiteSpace: 'nowrap', borderBottom: '1px solid var(--divider)',
}
const tdMono: React.CSSProperties = {
  ...td, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)',
}

const sectionLabel: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--primary)',
  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
}

const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)', padding: '14px',
}

const cardGold: React.CSSProperties = {
  ...card, borderLeft: '4px solid var(--primary)',
}

const cardDanger: React.CSSProperties = {
  background: 'rgba(255, 60, 60, 0.08)',
  border: '1px solid rgba(255, 60, 60, 0.3)',
  borderRadius: 'var(--radius)', padding: '14px',
  borderLeft: '4px solid #ff3c3c',
}

const cardCaution: React.CSSProperties = {
  background: 'rgba(255, 140, 0, 0.08)',
  border: '1px solid rgba(255, 140, 0, 0.3)',
  borderRadius: 'var(--radius)', padding: '14px',
  borderLeft: '4px solid #ff8c00',
}

const cardInfo: React.CSSProperties = {
  background: 'rgba(255, 215, 0, 0.06)',
  border: '1px solid rgba(255, 215, 0, 0.25)',
  borderRadius: 'var(--radius)', padding: '14px',
  borderLeft: '4px solid #ffd700',
}

const tipTag: React.CSSProperties = {
  display: 'inline-block', background: 'var(--input-bg)',
  borderRadius: 4, padding: '2px 8px', fontSize: 11,
  fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)',
  marginBottom: 8,
}

const dangerTag: React.CSSProperties = {
  ...tipTag, color: '#ff3c3c',
}

const cautionTag: React.CSSProperties = {
  ...tipTag, color: '#ff8c00',
}

const body14: React.CSSProperties = {
  fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6,
}

const heading: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6, lineHeight: 1.3,
}

const miningTip: React.CSSProperties = {
  background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)',
  padding: '10px 12px', marginTop: 10, fontSize: 13,
  color: 'var(--text-secondary)', lineHeight: 1.5,
  borderLeft: '3px solid var(--primary)',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MultimeterPage() {
  const [tab, setTab] = useState<TabKey>('voltage')

  return (
    <>
      <Header title="Multimeter & Test Equipment" />
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

        {/* ============================================================ */}
        {/*  TAB 1 — VOLTAGE                                             */}
        {/* ============================================================ */}
        {tab === 'voltage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Canadian Standard Voltages Table */}
            <div style={sectionLabel}>Canadian Standard Voltages</div>
            <div style={tableWrap}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
                <thead>
                  <tr>
                    <th style={th}>System</th>
                    <th style={th}>Nominal</th>
                    <th style={th}>Min ({'±'}5%)</th>
                    <th style={th}>Max ({'±'}5%)</th>
                    <th style={th}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {canadianVoltages.map((v, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                      <td style={{ ...td, fontWeight: 500 }}>{v.system}</td>
                      <td style={tdMono}>{v.nominal}</td>
                      <td style={td}>{v.min}</td>
                      <td style={td}>{v.max}</td>
                      <td style={{ ...td, color: 'var(--text-secondary)', fontSize: 13 }}>{v.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AC Voltage Measurement */}
            <div style={sectionLabel}>AC Voltage Measurement</div>
            <div style={cardGold}>
              <div style={heading}>How to Measure AC Voltage</div>
              <div style={body14}>
                1. Set meter to AC Voltage (V~) and select appropriate range{'\n'}
                2. Insert black lead into COM jack, red lead into V/{'Ω'} jack{'\n'}
                3. Touch probes to the two points to measure across (L-L, L-N, or L-G){'\n'}
                4. Read the RMS voltage on the display
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> In Ontario mines at 600V, always verify your meter is CAT III 600V rated minimum. At main service entrance or utility connections, use CAT IV rated equipment.
              </div>
            </div>

            {/* 3-Phase Voltage Verification */}
            <div style={cardGold}>
              <div style={heading}>3-Phase Voltage Verification</div>
              <div style={body14}>
                Measure all three line-to-line voltages and compare:{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>L1-L2:</strong> should equal nominal (e.g., 600V){'\n'}
                <strong style={{ color: 'var(--text)' }}>L2-L3:</strong> should equal nominal{'\n'}
                <strong style={{ color: 'var(--text)' }}>L1-L3:</strong> should equal nominal{'\n\n'}
                All three readings should be within 2-3% of each other. If one phase is significantly higher or lower, the system has a voltage imbalance. Greater than 2% imbalance causes motor overheating (approximately 25% temperature rise per 1% voltage imbalance).
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> Voltage imbalance is common on long mine feeder runs. Check at the motor terminals, not just the MCC. Voltage drop over hundreds of metres of trailing cable can create imbalance at the equipment.
              </div>
            </div>

            {/* DC Voltage */}
            <div style={sectionLabel}>DC Voltage Measurement</div>
            <div style={cardGold}>
              <div style={heading}>DC Voltage Applications</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>PLC I/O (24VDC):</strong> Measure between signal terminal and 0V common. Active signal should read 22-26VDC. Below 20V may not register as logic HIGH.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Control Circuits:</strong> Relay coils, solenoid valves, proximity sensors. Check voltage at the device to confirm adequate supply after wire voltage drop.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Battery Systems:</strong> Measure individual cell voltages and total string voltage. A cell more than 0.5V below average indicates a failing cell.
              </div>
            </div>

            {/* Phantom/Ghost Voltage */}
            <div style={sectionLabel}>Phantom (Ghost) Voltage</div>
            <div style={cardCaution}>
              <div style={cautionTag}>CAUTION</div>
              <div style={heading}>What Is Ghost Voltage?</div>
              <div style={body14}>
                Ghost voltage (phantom voltage) occurs when a high-impedance digital multimeter reads voltage on a circuit that is supposed to be de-energized. The meter picks up induced voltage from nearby energized conductors through capacitive coupling.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Why it happens:</strong> High-impedance meters (10 M{'Ω'} input) draw almost no current. Long wire runs in the same conduit as energized conductors act as capacitors, coupling voltage onto the supposedly dead wire. The meter displays this as a real voltage (often 30-80V or more).{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>How to verify:</strong>{'\n'}
                {'•'} Use a low-impedance meter (LoZ mode) or a solenoid tester (wiggy). These draw enough current to collapse a ghost voltage but will still read a real voltage.{'\n'}
                {'•'} Most quality meters have a LoZ or Low-Z function — use it any time you are verifying de-energization.{'\n'}
                {'•'} A ghost voltage will drop to near zero on a LoZ meter. A real voltage will hold steady.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> In mines, cable runs of 300+ metres in the same tray or conduit are common. Ghost voltage is a frequent issue. Always use LoZ or a wiggy when verifying lockout/tagout. Never rely on a standard digital reading alone to confirm de-energization.
              </div>
            </div>

            {/* Phase Rotation */}
            <div style={sectionLabel}>Phase Rotation</div>
            <div style={cardGold}>
              <div style={heading}>Checking Phase Rotation</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>Why it matters:</strong> Incorrect phase rotation reverses motor direction. This can damage equipment, injure workers, and cause pumps/fans to run backwards.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Procedure:</strong>{'\n'}
                1. Connect phase rotation meter leads to L1, L2, L3{'\n'}
                2. Meter indicates clockwise (ABC) or counter-clockwise (CBA){'\n'}
                3. If rotation is wrong, swap any two phases at the disconnect or starter{'\n'}
                4. Re-test to confirm correct rotation before starting the motor{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>When to check:</strong>{'\n'}
                {'•'} After any new installation or reconnection{'\n'}
                {'•'} After utility work on the supply{'\n'}
                {'•'} After replacing a transformer{'\n'}
                {'•'} After swapping any cables or bus connections
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> Some mine VFDs and soft starters will fault on incorrect phase rotation. Check rotation at the supply before powering the drive. On trailing cables that get disconnected and reconnected, always verify rotation.
              </div>
            </div>

            {/* Voltage Tips */}
            <div style={sectionLabel}>Voltage Measurement Tips</div>
            <div style={cardInfo}>
              <div style={tipTag}>KEY INFO</div>
              <div style={heading}>Test the Tester</div>
              <div style={body14}>
                Before and after every voltage test on a circuit you believe is de-energized, test your meter on a known live source. This is the test-verify-test method and it confirms your meter is functioning correctly. A faulty meter showing 0V on a live circuit has killed electricians.
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2 — CURRENT                                             */}
        {/* ============================================================ */}
        {tab === 'current' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Clamp Meter Usage */}
            <div style={sectionLabel}>Clamp Meter Usage</div>
            <div style={cardGold}>
              <div style={heading}>AC Clamp Meters</div>
              <div style={body14}>
                Standard clamp meters use a current transformer (CT) to measure AC current. Clamp around a single conductor only — clamping around a cable with multiple conductors will read zero (or near zero) because the magnetic fields cancel.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Procedure:</strong>{'\n'}
                1. Select AC Amps (A~) on the meter{'\n'}
                2. Open the jaw and clamp around ONE conductor{'\n'}
                3. Centre the conductor in the jaw for best accuracy{'\n'}
                4. Read the current — allow a few seconds for the reading to stabilize
              </div>
            </div>

            <div style={cardGold}>
              <div style={heading}>DC Clamp Meters (Hall Effect)</div>
              <div style={body14}>
                DC current requires a Hall effect clamp meter. Standard CT clamps cannot measure DC.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Common DC applications in mines:</strong>{'\n'}
                {'•'} Battery charger output current{'\n'}
                {'•'} DC drive motor current (older mine hoists, trolley systems){'\n'}
                {'•'} Solar/battery bank monitoring{'\n'}
                {'•'} DC welding circuits{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Zero the meter:</strong> With jaws closed and no conductor, press the zero/null button before measuring. DC clamp meters are sensitive to drift.
              </div>
            </div>

            {/* Motor Current */}
            <div style={sectionLabel}>Reading Motor Current</div>
            <div style={cardGold}>
              <div style={heading}>3-Phase Motor Current Check</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>Always measure all 3 phases.</strong> Compare each reading to the motor nameplate FLA (Full Load Amps).{'\n\n'}
                {'•'} All three phases should be within 5% of each other{'\n'}
                {'•'} Current above FLA = motor is overloaded{'\n'}
                {'•'} Current well below FLA = motor is lightly loaded (check for mechanical issues like uncoupled load){'\n'}
                {'•'} One phase significantly different = possible winding fault, connection issue, or supply voltage imbalance
              </div>
            </div>

            {/* Single-Phasing */}
            <div style={cardDanger}>
              <div style={dangerTag}>DANGER</div>
              <div style={heading}>Detecting Single-Phasing</div>
              <div style={body14}>
                Single-phasing occurs when one phase of a 3-phase supply is lost. The motor continues to run on two phases but draws excessive current, rapidly overheating.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>How to detect:</strong>{'\n'}
                {'•'} One phase reads zero or near-zero amps{'\n'}
                {'•'} The other two phases read significantly above FLA (up to 1.73x){'\n'}
                {'•'} Motor runs rough, hums loudly, or runs hot{'\n'}
                {'•'} Motor will not start (stalls and draws locked rotor amps on 2 phases){'\n\n'}
                <strong style={{ color: '#ff3c3c' }}>Action: </strong>
                Shut down immediately. Check fuses, breakers, contactors, and cable connections for the lost phase.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> Underground, single-phasing commonly results from a blown fuse in the mine power centre or a failed contactor pole. Check the contactor fingers for pitting and wear.
              </div>
            </div>

            {/* In-Rush Current */}
            <div style={sectionLabel}>In-Rush Current</div>
            <div style={cardGold}>
              <div style={heading}>Capturing In-Rush (Starting) Current</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>Typical starting current values:</strong>{'\n'}
                {'•'} Direct On-Line (DOL): 6-8x FLA{'\n'}
                {'•'} Star-Delta: 2-3x FLA (during star){'\n'}
                {'•'} Soft Starter: 2-4x FLA (adjustable){'\n'}
                {'•'} VFD: 1.0-1.5x FLA (current-limited){'\n\n'}
                <strong style={{ color: 'var(--text)' }}>How to capture:</strong> Use the MIN/MAX or INRUSH function on your clamp meter. Clamp on before starting the motor, enable inrush capture, then start the motor. The meter records the peak current.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> High in-rush on long trailing cables can cause significant voltage dip at the motor terminals. This is why VFDs and soft starters are increasingly common on large mine equipment — they reduce in-rush and minimize voltage sag on the mine distribution system.
              </div>
            </div>

            {/* Ground Fault Current */}
            <div style={sectionLabel}>Ground Fault Current Measurement</div>
            <div style={cardInfo}>
              <div style={tipTag}>KEY TECHNIQUE</div>
              <div style={heading}>Zero-Sequence Clamp Test</div>
              <div style={body14}>
                Wrap ALL phase conductors AND the neutral (if present) through the clamp meter jaw together. Under normal conditions, the currents cancel out and the reading is zero.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Any reading above zero = ground fault current.</strong>{'\n\n'}
                {'•'} 0 mA: No ground fault{'\n'}
                {'•'} 1-5 mA: Normal leakage on long runs or with VFDs{'\n'}
                {'•'} 5-30 mA: Investigate — degraded insulation likely{'\n'}
                {'•'} {'>'}30 mA: Significant fault — locate and repair{'\n\n'}
                Do NOT include the equipment grounding conductor in the clamp — only the current-carrying conductors.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> Ontario mines require ground fault protection on all circuits. This clamp technique helps identify which feeder has the fault when the ground fault relay trips. Use it for troubleshooting nuisance GFP trips caused by insulation degradation on aging trailing cables.
              </div>
            </div>

            {/* Low Current Measurement */}
            <div style={cardGold}>
              <div style={heading}>Low Current Measurement (Coil Method)</div>
              <div style={body14}>
                For very small currents below your clamp meter's resolution, coil the conductor through the clamp jaw multiple times.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Formula: Actual Current = Displayed Reading / Number of Turns</strong>{'\n\n'}
                Example: You coil a wire through the clamp 10 times. The meter reads 3.5A. Actual current = 3.5 / 10 = 0.35A.{'\n\n'}
                This is useful for measuring small control circuit currents, ground fault leakage currents, or verifying low-current sensor loops (4-20mA).
              </div>
            </div>

            {/* Motor Amps Table */}
            <div style={sectionLabel}>3-Phase Motor FLA Reference (CEC Table D16)</div>
            <div style={tableWrap}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                <thead>
                  <tr>
                    <th style={th}>HP</th>
                    <th style={th}>208V</th>
                    <th style={th}>480V</th>
                    <th style={th}>600V</th>
                  </tr>
                </thead>
                <tbody>
                  {motorAmps.map((m, i) => (
                    <tr key={m.hp} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                      <td style={{ ...td, fontWeight: 600 }}>{m.hp}</td>
                      <td style={tdMono}>{m.v208}A</td>
                      <td style={tdMono}>{m.v480}A</td>
                      <td style={tdMono}>{m.v600}A</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, padding: '0 4px' }}>
              Values are approximate for standard 3-phase squirrel cage induction motors. Always use the motor nameplate FLA for protection sizing. 600V is the Ontario mining standard.
            </div>

            {/* Amp Interpretation */}
            <div style={sectionLabel}>Amp Reading Interpretation</div>
            <div style={card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#4ade80', fontSize: 18, flexShrink: 0 }}>{'●'}</span>
                  <div style={body14}><strong style={{ color: 'var(--text)' }}>Below FLA:</strong> Normal operation, motor not fully loaded</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--primary)', fontSize: 18, flexShrink: 0 }}>{'●'}</span>
                  <div style={body14}><strong style={{ color: 'var(--text)' }}>At FLA:</strong> Motor fully loaded — verify this is expected</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#ff8c00', fontSize: 18, flexShrink: 0 }}>{'●'}</span>
                  <div style={body14}><strong style={{ color: 'var(--text)' }}>1-1.15x FLA:</strong> Overloaded — check mechanical load, low voltage</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#ff3c3c', fontSize: 18, flexShrink: 0 }}>{'●'}</span>
                  <div style={body14}><strong style={{ color: 'var(--text)' }}>Above 1.15x FLA:</strong> Serious overload — investigate immediately. Check for mechanical binding, bearing failure, misalignment, or electrical fault</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#ff3c3c', fontSize: 18, flexShrink: 0 }}>{'●'}</span>
                  <div style={body14}><strong style={{ color: 'var(--text)' }}>Unbalanced phases ({'>'}5% difference):</strong> Winding fault, bad connection, or supply voltage imbalance</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3 — RESISTANCE                                          */}
        {/* ============================================================ */}
        {tab === 'resistance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Continuity */}
            <div style={sectionLabel}>Continuity Testing</div>
            <div style={cardDanger}>
              <div style={dangerTag}>DANGER</div>
              <div style={heading}>Circuit MUST Be De-Energized</div>
              <div style={body14}>
                <strong style={{ color: '#ff3c3c' }}>NEVER perform continuity or resistance measurements on an energized circuit.</strong> The meter applies a small test voltage — connecting to a live circuit will damage the meter and can cause a shock or arc flash hazard.
              </div>
            </div>

            <div style={cardGold}>
              <div style={heading}>Continuity Test Procedure</div>
              <div style={body14}>
                1. Verify circuit is de-energized and locked out{'\n'}
                2. Set meter to continuity mode (audible beep){'\n'}
                3. Touch probes to both ends of the conductor or connection{'\n'}
                4. A good connection reads near 0 {'Ω'} with a continuous beep{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Expected readings:</strong>{'\n'}
                {'•'} Good wire connection: {'\u003C'} 0.5 {'Ω'}{'\n'}
                {'•'} Good splice or terminal: {'\u003C'} 1.0 {'Ω'}{'\n'}
                {'•'} Long cable run (300m): up to 2-5 {'Ω'} depending on wire size{'\n'}
                {'•'} Open circuit: OL (overload) — no continuity
              </div>
            </div>

            {/* Motor Winding Resistance */}
            <div style={sectionLabel}>Motor Winding Resistance</div>
            <div style={cardGold}>
              <div style={heading}>Phase-to-Phase Winding Check</div>
              <div style={body14}>
                Measure resistance between motor terminals:{'\n'}
                {'•'} T1-T2, T2-T3, T1-T3{'\n\n'}
                All three readings should be within 5% of each other. A significant difference indicates a winding fault (shorted turns, open winding, or bad connection).{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Typical winding resistance values:</strong>{'\n'}
                {'•'} Small motors (1-10 HP): 1-20 {'Ω'}{'\n'}
                {'•'} Medium motors (15-50 HP): 0.1-5 {'Ω'}{'\n'}
                {'•'} Large motors (75-200 HP): 0.01-1 {'Ω'}{'\n\n'}
                Use a quality meter with milliohm resolution for large motors. Temperature affects readings — ensure motor is at ambient temperature, or apply temperature correction.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> For large mine motors (crushers, hoists, mill drives), consider using a micro-ohmmeter or 4-wire Kelvin measurement for more accurate low-resistance readings. Lead resistance on a standard meter can introduce significant error.
              </div>
            </div>

            {/* Insulation Resistance (Megger) */}
            <div style={sectionLabel}>Insulation Resistance (Megger Testing)</div>
            <div style={cardInfo}>
              <div style={tipTag}>KEY INFO</div>
              <div style={heading}>Megger Test Procedure</div>
              <div style={body14}>
                1. De-energize, lock out, and verify zero energy{'\n'}
                2. Disconnect the cable or motor from all connected equipment{'\n'}
                3. Discharge any stored capacitance (short phases to ground briefly){'\n'}
                4. Connect megger leads: LINE to conductor under test, EARTH to ground{'\n'}
                5. Apply test voltage for 1 minute (standard test duration){'\n'}
                6. Read insulation resistance in megohms (M{'Ω'}){'\n'}
                7. After test, discharge the cable/winding to ground before handling{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Minimum Acceptable Value (Rule of Thumb):</strong>{'\n'}
                <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  R(min) = (kV rating {'×'} 1 M{'Ω'}) + 1 M{'Ω'}
                </strong>{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Temperature effect:</strong> Insulation resistance halves for every 10{'°'}C rise. Always record ambient temperature. Correct readings to a common reference (usually 40{'°'}C) for trending.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Moisture effect:</strong> Wet insulation reads dramatically lower. If readings are low, try drying out the winding/cable with a space heater or by running a small current through it, then re-test.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> Underground mines are wet environments. Megger trailing cables and motor windings regularly — weekly for critical equipment, monthly for general plant. Trend the readings. A gradual decline indicates insulation degradation before a fault occurs.
              </div>
            </div>

            {/* Megger Values Table */}
            <div style={sectionLabel}>Insulation Resistance Minimum Values (IEEE 43)</div>
            <div style={tableWrap}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                <thead>
                  <tr>
                    <th style={th}>Cable/Motor Rating</th>
                    <th style={th}>Test Voltage</th>
                    <th style={th}>Min Insulation R</th>
                    <th style={th}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {meggerValues.map((m, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                      <td style={{ ...td, fontWeight: 500 }}>{m.voltageClass}</td>
                      <td style={tdMono}>{m.testVoltage}</td>
                      <td style={tdMono}>{m.minInsulation}</td>
                      <td style={{ ...td, color: 'var(--text-secondary)', fontSize: 13 }}>{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, padding: '0 4px' }}>
              Values are minimum acceptable at 40{'°'}C. New equipment should read 100x these minimums or higher. Readings just above minimum warrant monitoring and trending.
            </div>

            {/* Ground Resistance */}
            <div style={sectionLabel}>Ground Resistance Testing</div>
            <div style={cardGold}>
              <div style={heading}>Fall-of-Potential Method</div>
              <div style={body14}>
                The standard 3-point test for grounding electrode resistance:{'\n\n'}
                1. Drive a current stake (C) at least 30m from the electrode under test{'\n'}
                2. Drive a potential stake (P) at 62% of the distance between the electrode and C{'\n'}
                3. The tester injects current through C and measures voltage at P{'\n'}
                4. R = V/I (the tester calculates and displays this){'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Acceptable values:</strong>{'\n'}
                {'•'} CEC Rule 10-700: Maximum 25 {'Ω'} for grounding electrodes{'\n'}
                {'•'} Preferred: Below 5 {'Ω'} for commercial/industrial{'\n'}
                {'•'} Mining best practice: Below 5 {'Ω'} for mine ground beds{'\n'}
                {'•'} Sensitive equipment (data centres, PLC rooms): Below 1 {'Ω'}
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> Rock has very high resistivity. Achieving low ground resistance in Canadian Shield rock can be challenging. Mine ground beds often use multiple driven rods, buried ring conductors, or ground enhancement materials (GEM). Test annually and after any ground fault event.
              </div>
            </div>

            {/* Diode Check */}
            <div style={sectionLabel}>Diode Check Mode</div>
            <div style={cardGold}>
              <div style={heading}>Testing Diodes & Rectifiers</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>Forward bias:</strong> Red lead to anode, black to cathode. Good silicon diode reads 0.5-0.7V. Germanium diode reads 0.2-0.3V.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Reverse bias:</strong> Swap leads. Should read OL (no conduction).{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Fault indicators:</strong>{'\n'}
                {'•'} Reads 0V in both directions = shorted diode{'\n'}
                {'•'} Reads OL in both directions = open diode{'\n'}
                {'•'} Reads a voltage in both directions = leaky diode{'\n\n'}
                Use this mode for testing SCRs (gate-cathode junction), relay suppression diodes, and rectifier bridges in battery chargers or DC drives.
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4 — SPECIALTY                                           */}
        {/* ============================================================ */}
        {tab === 'specialty' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Megger / Insulation Tester */}
            <div style={sectionLabel}>Megger / Insulation Tester</div>
            <div style={cardDanger}>
              <div style={dangerTag}>SAFETY WARNING</div>
              <div style={heading}>High Voltage Test Equipment</div>
              <div style={body14}>
                Meggers apply dangerous DC voltage to the circuit under test. Treat the test leads as energized during and after the test (stored charge).{'\n\n'}
                {'•'} <strong style={{ color: 'var(--text)' }}>Always discharge</strong> cables and motor windings to ground after testing{'\n'}
                {'•'} Never megger while anyone else is working on the circuit{'\n'}
                {'•'} Post warning signs: "Insulation Testing in Progress"
              </div>
            </div>

            <div style={cardGold}>
              <div style={heading}>Test Voltage Selection</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>500V DC:</strong> For circuits rated up to 250V (control wiring, 120V circuits){'\n'}
                <strong style={{ color: 'var(--text)' }}>1000V DC:</strong> For circuits rated 250V-600V (standard mine power at 600V){'\n'}
                <strong style={{ color: 'var(--text)' }}>2500V DC:</strong> For circuits rated 600V-5kV (medium voltage trailing cables){'\n'}
                <strong style={{ color: 'var(--text)' }}>5000V DC:</strong> For circuits rated 5kV-25kV (mine primary distribution){'\n\n'}
                Never apply a test voltage higher than recommended for the insulation class — you can damage good insulation.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> For 600V mine trailing cables and motor windings, the 1000V DC test is your standard go-to. Always megger trailing cables after splicing, after any damage repair, and on a routine schedule.
              </div>
            </div>

            {/* Power Quality Analyzer */}
            <div style={sectionLabel}>Power Quality Analyzer</div>
            <div style={cardGold}>
              <div style={heading}>What It Measures</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>Total Harmonic Distortion (THD):</strong> Percentage of harmonic content in the voltage or current waveform. IEEE 519 limits: 5% THD for voltage at the PCC (Point of Common Coupling). VFDs are a major source of harmonics in mines.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Power Factor:</strong> Ratio of real power (kW) to apparent power (kVA). Target: above 0.90. Low PF means you are paying for reactive power. Causes: induction motors at light load, long cable runs, uncompensated systems.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Individual Harmonics:</strong> Identifies which harmonic orders are present (3rd, 5th, 7th, 11th, 13th are most common with VFDs). Helps size harmonic filters.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Voltage Events:</strong> Sags, swells, transients, interruptions. Logs over time to identify intermittent problems.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> Mines with many VFDs on crushers, mills, and conveyors often have significant harmonic issues. A power quality study helps identify the need for harmonic filters or active front-end drives. Also useful for diagnosing nuisance relay trips.
              </div>
            </div>

            {/* Thermal Imager */}
            <div style={sectionLabel}>Thermal Imager</div>
            <div style={cardGold}>
              <div style={heading}>Electrical Issues Visible on Thermal</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>Loose connections:</strong> Hot spots at terminals, bus bars, lugs. A loose connection has higher resistance, generating heat. Often 20-80{'°'}C above ambient.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Overloaded conductors:</strong> Entire cable length shows elevated temperature. Compare to adjacent cables on the same load.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Failed breakers/contactors:</strong> One pole hotter than the others indicates pitted contacts or internal failure.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Unbalanced loads:</strong> One phase conductor noticeably hotter than the others. Investigate load distribution.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Failing bearings:</strong> Motor bearing housings show elevated temperature before failure.
              </div>
            </div>

            <div style={cardInfo}>
              <div style={tipTag}>EMISSIVITY REFERENCE</div>
              <div style={heading}>Emissivity Settings for Common Materials</div>
              <div style={body14}>
                {'•'} Oxidized copper bus bar: 0.65-0.80{'\n'}
                {'•'} Polished/clean copper: 0.05 (very reflective — readings unreliable){'\n'}
                {'•'} Painted surfaces: 0.90-0.95 (best for thermal imaging){'\n'}
                {'•'} Oxidized steel: 0.80-0.90{'\n'}
                {'•'} Rubber/plastic insulation: 0.90-0.95{'\n'}
                {'•'} Aluminum (oxidized): 0.20-0.40 (unreliable — use electrical tape target){'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Pro tip:</strong> For shiny or low-emissivity surfaces, apply a small patch of black electrical tape and measure the tape surface. This gives a consistent emissivity of ~0.95.
              </div>
            </div>

            {/* Phase Rotation Meter */}
            <div style={sectionLabel}>Phase Rotation Meter</div>
            <div style={cardGold}>
              <div style={heading}>Checking Phase Sequence</div>
              <div style={body14}>
                1. Connect leads to L1 (Red), L2 (Yellow/White), L3 (Blue) per your colour standard{'\n'}
                2. Power on the meter — it indicates ABC (clockwise) or CBA (counter-clockwise){'\n'}
                3. Record the rotation at the supply{'\n'}
                4. Verify motor leads match the desired rotation{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Why it matters:</strong> Incorrect rotation reverses pumps, fans, and conveyors. A crusher running backwards can cause catastrophic mechanical damage. Some equipment (compressors, elevators) has phase-loss/phase-reversal relays that will prevent starting if rotation is wrong.
              </div>
            </div>

            {/* Earth/Ground Resistance Tester */}
            <div style={sectionLabel}>Earth/Ground Resistance Tester</div>
            <div style={cardGold}>
              <div style={heading}>3-Point vs 4-Point Methods</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>3-Point (Fall of Potential):</strong> Tests the resistance of a single grounding electrode. Standard method for verifying ground rod installations. Requires disconnecting the electrode from the system.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>4-Point (Wenner Method):</strong> Measures soil resistivity. Four stakes driven at equal spacing in a straight line. Used for designing ground bed systems — determines how many rods are needed and optimal spacing.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Clamp-on Method:</strong> Does not require disconnecting the electrode. Measures the loop impedance of the grounding system. Limited accuracy compared to fall-of-potential but useful for quick checks and for electrodes that cannot be easily disconnected.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> Use the 4-point Wenner method when designing new mine ground beds on the Canadian Shield. Precambrian rock has extremely high resistivity (10,000+ {'Ω'}{'·'}m). You may need deep-driven rods, multiple electrodes in parallel, or ground enhancement material to achieve acceptable resistance.
              </div>
            </div>

            {/* Loop Impedance Tester */}
            <div style={sectionLabel}>Loop Impedance Tester</div>
            <div style={cardGold}>
              <div style={heading}>Earth Fault Loop Impedance</div>
              <div style={body14}>
                Measures the total impedance of the fault loop from the point of measurement back to the transformer. Used to calculate prospective fault current (PFC).{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Why it matters:</strong> The fault loop impedance determines how much current will flow during a ground fault. This current must be sufficient to trip the overcurrent protective device within the required time (0.4s for 120V circuits, 5s for fixed equipment).{'\n\n'}
                <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  PFC = Supply Voltage / Loop Impedance
                </strong>{'\n\n'}
                Example: 600V system, loop impedance 0.5{'Ω'}: PFC = 600 / 0.5 = 1200A. Verify this exceeds the overcurrent device trip threshold.
              </div>
            </div>

            {/* LCR Meter */}
            <div style={sectionLabel}>LCR Meter</div>
            <div style={cardGold}>
              <div style={heading}>Capacitor & Inductor Testing</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>Power Factor Correction Capacitors:</strong>{'\n'}
                {'•'} Measure capacitance — should be within 5% of nameplate{'\n'}
                {'•'} Check dissipation factor (DF) — high DF indicates deteriorating dielectric{'\n'}
                {'•'} Capacitors swell or leak oil when failing — visual inspection first{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Motor Start Capacitors:</strong>{'\n'}
                {'•'} Measure capacitance and compare to label value{'\n'}
                {'•'} Start caps are electrolytic — they dry out over time{'\n'}
                {'•'} A weak start cap causes slow starts, humming, or failure to start{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Inductors/Reactors:</strong>{'\n'}
                {'•'} Measure inductance to verify correct value{'\n'}
                {'•'} Check for shorted turns (lower than expected inductance){'\n'}
                {'•'} Common in harmonic filters and line reactors for VFDs
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> Power factor correction capacitor banks are common at mine substations to avoid utility demand charges. Failed caps reduce PF correction and can cause harmonic resonance. Check cap banks annually with an LCR meter.
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 5 — SAFETY                                              */}
        {/* ============================================================ */}
        {tab === 'safety' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* CAT Ratings */}
            <div style={sectionLabel}>CAT Ratings Explained</div>
            <div style={cardDanger}>
              <div style={dangerTag}>CRITICAL SAFETY</div>
              <div style={heading}>Measurement Categories (IEC 61010)</div>
              <div style={body14}>
                CAT ratings indicate the transient voltage (spike) withstand capability of the meter. <strong style={{ color: '#ff3c3c' }}>Higher CAT number = closer to the power source = higher transient energy.</strong> A meter rated for a lower category can explode if exposed to transients from a higher category location.
              </div>
            </div>

            <div style={card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(100, 200, 100, 0.08)', borderLeft: '4px solid #4ade80' }}>
                  <div style={{ fontWeight: 700, color: '#4ade80', fontSize: 14, marginBottom: 4 }}>CAT I — Low Energy</div>
                  <div style={body14}>Protected electronic equipment, signal-level circuits. Example: measuring inside a PLC cabinet on low-voltage signal wires (after power conditioning).</div>
                </div>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 215, 0, 0.06)', borderLeft: '4px solid #ffd700' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14, marginBottom: 4 }}>CAT II — Receptacle Level</div>
                  <div style={body14}>Single-phase receptacle outlets, plug-connected equipment. Example: testing voltage at a wall receptacle or appliance cord.</div>
                </div>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 140, 0, 0.08)', borderLeft: '4px solid #ff8c00' }}>
                  <div style={{ fontWeight: 700, color: '#ff8c00', fontSize: 14, marginBottom: 4 }}>CAT III — Distribution Level</div>
                  <div style={body14}>3-phase distribution panels, bus bars, motor control centres, permanently installed equipment. <strong>This is your minimum for mine panel work at 600V.</strong></div>
                </div>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 60, 60, 0.08)', borderLeft: '4px solid #ff3c3c' }}>
                  <div style={{ fontWeight: 700, color: '#ff3c3c', fontSize: 14, marginBottom: 4 }}>CAT IV — Origin of Supply</div>
                  <div style={body14}>Service entrance, utility connections, outdoor conductors, main switchgear primary side. Required at the mine main substation and service entrance.</div>
                </div>
              </div>
            </div>

            <div style={cardCaution}>
              <div style={cautionTag}>MINING REQUIREMENT</div>
              <div style={heading}>Minimum Meter Rating for Mining</div>
              <div style={body14}>
                {'•'} Working in MCCs, power centres, distribution panels: <strong style={{ color: 'var(--text)' }}>CAT III 600V minimum</strong>{'\n'}
                {'•'} Main service entrance, utility supply: <strong style={{ color: 'var(--text)' }}>CAT IV 600V</strong>{'\n'}
                {'•'} Medium voltage (above 600V): <strong style={{ color: 'var(--text)' }}>CAT III 1000V</strong> or as rated{'\n\n'}
                Always check BOTH the voltage AND the CAT rating. A CAT II 1000V meter is NOT safer than a CAT III 600V meter at a 600V distribution panel — the CAT rating matters more than the voltage rating for transient protection.
              </div>
            </div>

            {/* Lead Inspection */}
            <div style={sectionLabel}>Test Lead Inspection</div>
            <div style={cardGold}>
              <div style={heading}>What to Inspect Before Every Use</div>
              <div style={body14}>
                {'•'} <strong style={{ color: 'var(--text)' }}>Insulation:</strong> No cracks, cuts, or melted spots. Replace if damaged — do not tape over damage{'\n'}
                {'•'} <strong style={{ color: 'var(--text)' }}>Probe tips:</strong> Shrouded/finger guards in place. Exposed metal should be minimal (recessed tips preferred){'\n'}
                {'•'} <strong style={{ color: 'var(--text)' }}>Connections:</strong> Probe plugs fully seated in meter jacks, no loose or intermittent connections{'\n'}
                {'•'} <strong style={{ color: 'var(--text)' }}>CAT rating:</strong> Leads must be rated at least as high as the meter itself. Using CAT II leads on a CAT III meter defeats the protection{'\n'}
                {'•'} <strong style={{ color: 'var(--text)' }}>Fuse check:</strong> Verify the meter's input fuses are correct rating and type (ceramic, high-rupture-capacity). Never substitute with lower-rated fuses
              </div>
            </div>

            {/* Test-Verify-Test */}
            <div style={sectionLabel}>Test-Verify-Test Procedure</div>
            <div style={cardDanger}>
              <div style={dangerTag}>CRITICAL PROCEDURE</div>
              <div style={heading}>Three-Step Verification Method</div>
              <div style={body14}>
                <strong style={{ color: '#ff3c3c' }}>This procedure must be followed EVERY TIME you verify de-energization.</strong>{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Step 1 — TEST:</strong> Test your meter on a known live source (a proven voltage source or plug-in tester). Confirm the meter displays the correct voltage.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Step 2 — VERIFY:</strong> Test the circuit you believe is de-energized. Check L1-L2, L2-L3, L1-L3, L1-G, L2-G, L3-G. All should read zero.{'\n\n'}
                <strong style={{ color: 'var(--text)' }}>Step 3 — TEST:</strong> Re-test your meter on the known live source again. Confirm it still reads correctly. This proves the meter did not fail between Step 1 and Step 2.{'\n\n'}
                Only when all three steps are completed can you confirm the circuit is de-energized and safe to work on.
              </div>
              <div style={miningTip}>
                <strong>Mining Tip:</strong> O. Reg. 854, s. 159 requires verification of de-energization with a properly rated tester. The test-verify-test method satisfies this requirement. Keep a known live source (proving unit) accessible in each electrical room.
              </div>
            </div>

            {/* Arc Flash */}
            <div style={sectionLabel}>Arc Flash Considerations</div>
            <div style={cardDanger}>
              <div style={dangerTag}>ARC FLASH HAZARD</div>
              <div style={heading}>Taking Readings on Energized Equipment</div>
              <div style={body14}>
                Opening a panel cover to take voltage or current readings on energized equipment exposes you to arc flash hazard. Before proceeding:{'\n\n'}
                {'•'} Check the arc flash label on the equipment — note the incident energy (cal/cm{'²'}) and the arc flash boundary{'\n'}
                {'•'} Wear appropriate PPE for the rated incident energy category{'\n'}
                {'•'} Use remote reading equipment where possible (CTs, external monitoring){'\n'}
                {'•'} Stand to the side of the panel, not directly in front{'\n'}
                {'•'} Use one hand where possible — keep the other hand away from the equipment{'\n'}
                {'•'} Ensure probe tips are properly shrouded to minimize arc initiation
              </div>
            </div>

            {/* NFPA 70E / CSA Z462 */}
            <div style={sectionLabel}>PPE Requirements (CSA Z462 / NFPA 70E)</div>
            <div style={cardCaution}>
              <div style={cautionTag}>PPE REQUIREMENTS</div>
              <div style={heading}>Minimum PPE for Voltage Testing</div>
              <div style={body14}>
                <strong style={{ color: 'var(--text)' }}>Voltage testing on energized equipment requires:</strong>{'\n\n'}
                {'•'} Arc-rated clothing appropriate to the incident energy level{'\n'}
                {'•'} Safety glasses or arc-rated face shield (depends on incident energy){'\n'}
                {'•'} Voltage-rated gloves with leather protectors (for the voltage being tested){'\n'}
                {'•'} Leather work boots (CSA approved for mining){'\n'}
                {'•'} Hard hat with arc-rated liner (required in mines){'\n'}
                {'•'} Hearing protection (arc blast can exceed 140 dB){'\n\n'}
                <strong style={{ color: 'var(--text)' }}>CSA Z462 PPE Categories:</strong>{'\n'}
                Cat 1 (4 cal/cm{'²'}): Arc-rated shirt and pants, safety glasses, leather gloves{'\n'}
                Cat 2 (8 cal/cm{'²'}): Add arc-rated face shield and balaclava{'\n'}
                Cat 3 (25 cal/cm{'²'}): Full arc flash suit with hood{'\n'}
                Cat 4 (40 cal/cm{'²'}): Full arc flash suit with hood, double-layer
              </div>
            </div>

            {/* Lockout/Tagout */}
            <div style={sectionLabel}>Lockout/Tagout for Test Equipment</div>
            <div style={cardGold}>
              <div style={heading}>When Connecting Test Leads to De-Energized Equipment</div>
              <div style={body14}>
                When you need to connect test equipment (megger, micro-ohmmeter, or other instruments) to de-energized equipment:{'\n\n'}
                {'•'} The circuit must be locked out and tagged by YOU before connecting any leads{'\n'}
                {'•'} Verify de-energization using the test-verify-test method{'\n'}
                {'•'} Connect your test leads AFTER confirming zero energy{'\n'}
                {'•'} Post additional warning signs if applying test voltage (megger){'\n'}
                {'•'} Notify all other workers in the area before applying test voltage{'\n'}
                {'•'} Never leave test leads connected and unattended
              </div>
            </div>

            {/* What NOT To Do */}
            <div style={sectionLabel}>Common Dangerous Mistakes</div>
            <div style={cardDanger}>
              <div style={dangerTag}>DO NOT</div>
              <div style={heading}>Dangerous Meter Mistakes That Can Kill</div>
              <div style={body14}>
                <strong style={{ color: '#ff3c3c' }}>{'✗'} Wrong mode:</strong> Measuring voltage while the meter is set to current (amps) mode creates a dead short through the meter's low-impedance current shunt. This causes an arc flash/explosion.{'\n\n'}
                <strong style={{ color: '#ff3c3c' }}>{'✗'} Wrong CAT rating:</strong> Using a CAT II meter on a 600V distribution panel. A transient spike can blow through the meter's protection, causing an explosion in your hands.{'\n\n'}
                <strong style={{ color: '#ff3c3c' }}>{'✗'} Leads in amp jacks:</strong> Leaving test leads in the 10A or mA jacks and then measuring voltage. Same result as wrong mode — dead short.{'\n\n'}
                <strong style={{ color: '#ff3c3c' }}>{'✗'} Worn/damaged leads:</strong> Cracked insulation can arc to your hand. Exposed conductor at the probe tip can contact adjacent bus bars.{'\n\n'}
                <strong style={{ color: '#ff3c3c' }}>{'✗'} Wrong fuses:</strong> Replacing blown HRC ceramic fuses with standard glass fuses. The glass fuse cannot interrupt the available fault current and will explode.{'\n\n'}
                <strong style={{ color: '#ff3c3c' }}>{'✗'} No PPE:</strong> Taking readings on an open energized panel without arc-rated PPE, safety glasses, and voltage-rated gloves.{'\n\n'}
                <strong style={{ color: '#ff3c3c' }}>{'✗'} Assuming dead:</strong> Not verifying de-energization with a meter. "Someone said they turned it off" is not verification. Test it yourself, every time.
              </div>
            </div>

            {/* Reference note */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--divider)',
              borderRadius: 'var(--radius-sm)', padding: '12px 14px',
              fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              <strong style={{ color: 'var(--text)' }}>References:</strong> IEC 61010 (Meter Safety Standards), CSA Z462 (Workplace Electrical Safety), NFPA 70E (Standard for Electrical Safety in the Workplace), O. Reg. 854 (Mines and Mining Plants), CEC Section 2 (General Rules), IEEE 43 (Insulation Resistance Testing)
            </div>

          </div>
        )}

        {/* Footer note — all tabs */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)', padding: '12px 14px',
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>Disclaimer:</strong> This is a field reference only. Always follow your site-specific procedures, manufacturer instructions, and applicable codes (CEC, CSA Z462, O. Reg. 854). Test equipment should be calibrated regularly and inspected before each use.
        </div>

      </div>
    </>
  )
}
