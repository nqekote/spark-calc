import { useState } from 'react'
import PageWrapper from '../../layout/PageWrapper'

/* ================================================================== */
/*  Industrial Communications Reference                                */
/*  Target: Ontario electrical / mining apprentices (309A / MM)        */
/*  Covers: Serial, Ethernet, Fiber, Wireless, Troubleshooting, Mining */
/* ================================================================== */

type TabKey = 'serial' | 'ethernet' | 'fiber' | 'wireless' | 'troubleshoot' | 'mining'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'serial', label: 'Serial Comms' },
  { key: 'ethernet', label: 'Ind. Ethernet' },
  { key: 'fiber', label: 'Fiber Optics' },
  { key: 'wireless', label: 'Wireless' },
  { key: 'troubleshoot', label: 'Troubleshoot' },
  { key: 'mining', label: 'Mining Comms' },
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
  minHeight: 56,
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
  fontSize: 12,
}
const pre: React.CSSProperties = {
  background: 'var(--input-bg)',
  borderRadius: 'var(--radius-sm)',
  padding: 12,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  lineHeight: 1.5,
  color: 'var(--text)',
  overflowX: 'auto',
  whiteSpace: 'pre',
  margin: 0,
  border: '1px solid var(--divider)',
}
const warnBox: React.CSSProperties = {
  background: 'rgba(234,179,8,0.08)',
  border: '1px solid rgba(234,179,8,0.3)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  fontSize: 13,
  color: '#eab308',
  lineHeight: 1.5,
}
const tipBox: React.CSSProperties = {
  background: 'rgba(59,130,246,0.08)',
  border: '1px solid rgba(59,130,246,0.3)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  fontSize: 13,
  color: '#60a5fa',
  lineHeight: 1.5,
}
/* ================================================================== */
/*  TAB 1 -- SERIAL COMMUNICATIONS                                     */
/* ================================================================== */

function SerialCommsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ---------- RS-232 vs RS-422 vs RS-485 ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Serial Standards Comparison</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Specification</th>
                <th style={tableHeader}>RS-232</th>
                <th style={tableHeader}>RS-422</th>
                <th style={tableHeader}>RS-485</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCell}>Signalling</td>
                <td style={tableCell}>Single-ended (unbalanced)</td>
                <td style={tableCell}>Differential (balanced)</td>
                <td style={tableCell}>Differential (balanced)</td>
              </tr>
              <tr>
                <td style={tableCell}>Max Distance</td>
                <td style={tableCellMono}>15 m (50 ft)</td>
                <td style={tableCellMono}>1200 m (4000 ft)</td>
                <td style={tableCellMono}>1200 m (4000 ft)</td>
              </tr>
              <tr>
                <td style={tableCell}>Max Nodes</td>
                <td style={tableCellMono}>1 TX / 1 RX</td>
                <td style={tableCellMono}>1 TX / 10 RX</td>
                <td style={tableCellMono}>32 (up to 256 w/ repeaters)</td>
              </tr>
              <tr>
                <td style={tableCell}>Topology</td>
                <td style={tableCell}>Point-to-point</td>
                <td style={tableCell}>Multi-drop (1 master)</td>
                <td style={tableCell}>Multi-drop / multi-master</td>
              </tr>
              <tr>
                <td style={tableCell}>Common Baud Rates</td>
                <td style={tableCellMono}>9600, 19200, 115200</td>
                <td style={tableCellMono}>9600 - 10 Mbps</td>
                <td style={tableCellMono}>9600, 19200, 38400, 115200</td>
              </tr>
              <tr>
                <td style={tableCell}>Cable Type</td>
                <td style={tableCell}>DB9 / DB25, shielded</td>
                <td style={tableCell}>Twisted pair, shielded</td>
                <td style={tableCell}>Twisted pair, shielded</td>
              </tr>
              <tr>
                <td style={tableCell}>Termination</td>
                <td style={tableCell}>Not required</td>
                <td style={tableCellMono}>120 ohm at each end</td>
                <td style={tableCellMono}>120 ohm at each end</td>
              </tr>
              <tr>
                <td style={tableCell}>Duplex</td>
                <td style={tableCell}>Full duplex</td>
                <td style={tableCell}>Full duplex (4 wire)</td>
                <td style={tableCell}>Half duplex (2 wire) or full (4 wire)</td>
              </tr>
              <tr>
                <td style={tableCell}>Mining Use</td>
                <td style={tableCell}>Legacy PLCs, programming ports</td>
                <td style={tableCell}>PLC-to-PLC links</td>
                <td style={tableCell}>Modbus RTU networks, VFDs, meters</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- RS-232 DB9 Pin Assignments ---------- */}
      <div style={cardHL('#3b82f6')}>
        <div style={sectionTitle}>RS-232 DB9 Pin Assignments</div>
        <pre style={pre}>{`DB9 Male (DTE - PC/PLC side)
  Pin 1  DCD  Data Carrier Detect
  Pin 2  RXD  Receive Data
  Pin 3  TXD  Transmit Data
  Pin 4  DTR  Data Terminal Ready
  Pin 5  GND  Signal Ground
  Pin 6  DSR  Data Set Ready
  Pin 7  RTS  Request To Send
  Pin 8  CTS  Clear To Send
  Pin 9  RI   Ring Indicator

Null-modem cable (most common for PLC programming):
  Device A          Device B
  TXD (3) --------> RXD (2)
  RXD (2) <-------- TXD (3)
  GND (5) --------> GND (5)
  DTR (4) --+       DTR (4) --+
  DSR (6) --+       DSR (6) --+
  RTS (7) --+       RTS (7) --+
  CTS (8) --+       CTS (8) --+`}</pre>
      </div>

      {/* ---------- RS-485 Wiring ---------- */}
      <div style={cardHL('#22c55e')}>
        <div style={sectionTitle}>RS-485 Two-Wire Wiring</div>
        <pre style={pre}>{`RS-485 Two-Wire (Half-Duplex) Multi-Drop Bus
==============================================

  120 ohm                                 120 ohm
  termination                             termination
     |                                       |
  [Master]---+---[Slave 1]---+---[Slave 2]---+---[Slave N]
     |       |       |       |       |       |       |
     A  -----+-------A-------+-------A-------+-------A----
     B  -----+-------B-------+-------B-------+-------B----
    GND -----+------GND------+------GND------+------GND---

  A = D+ (non-inverting)    Typically connected to terminal "+"
  B = D- (inverting)        Typically connected to terminal "-"
  GND = Signal reference    ALWAYS connect ground reference

  IMPORTANT: Daisy-chain topology only. NO star/T-stubs.
  Use 120 ohm resistor at FIRST and LAST device only.
  Shield: ground at ONE end only to prevent ground loops.`}</pre>
        <div style={{ ...warnBox, marginTop: 10 }}>
          <strong>Common Pitfall:</strong> Some manufacturers swap A/B labeling. If communication
          fails, try swapping A and B wires. Allen-Bradley labels them as D+ and D-. Siemens
          uses A (green) and B (red). Always check the device manual.
        </div>
      </div>

      {/* ---------- RS-485 Four-Wire ---------- */}
      <div style={cardHL('#22c55e')}>
        <div style={sectionTitle}>RS-485 Four-Wire (Full-Duplex)</div>
        <pre style={pre}>{`RS-485 Four-Wire (Full-Duplex)
==============================================

  [Master]                     [Slave 1]    [Slave 2]
   TX+ ----+----120R----+------- RX+ -------- RX+
   TX- ----+----        +------- RX- -------- RX-
   RX+ ----+----120R----+------- TX+ -------- TX+
   RX- ----+----        +------- TX- -------- TX-
   GND ----+------------+------- GND -------- GND

  Master transmit pair connects to all slave receive pairs
  Master receive pair connects to all slave transmit pairs
  120 ohm termination at each end of EACH pair`}</pre>
      </div>

      {/* ---------- Modbus RTU / ASCII ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Modbus Protocol Overview</div>
        <div style={bodyText}>
          <p>
            <strong>Modbus</strong> is an open serial communication protocol developed by Modicon
            (now Schneider Electric) in 1979. It is the de facto standard for industrial serial
            communication and is used extensively in mining, water treatment, HVAC, and power systems.
          </p>
          <p style={{ marginTop: 8 }}>
            <strong>Master/Slave architecture:</strong> One master device initiates all communication.
            Slave devices respond only when addressed. Each slave has a unique address (1-247).
            Address 0 is reserved for broadcast messages (no response expected).
          </p>
        </div>
      </div>

      <div style={cardHL('#a855f7')}>
        <div style={sectionTitle}>Modbus RTU vs ASCII</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Feature</th>
                <th style={tableHeader}>Modbus RTU</th>
                <th style={tableHeader}>Modbus ASCII</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCell}>Encoding</td>
                <td style={tableCell}>Binary (8-bit)</td>
                <td style={tableCell}>ASCII hex characters</td>
              </tr>
              <tr>
                <td style={tableCell}>Frame Start</td>
                <td style={tableCell}>3.5 char silence</td>
                <td style={tableCellMono}>: (colon, 0x3A)</td>
              </tr>
              <tr>
                <td style={tableCell}>Frame End</td>
                <td style={tableCell}>3.5 char silence</td>
                <td style={tableCellMono}>CR LF (0x0D 0x0A)</td>
              </tr>
              <tr>
                <td style={tableCell}>Error Check</td>
                <td style={tableCell}>CRC-16</td>
                <td style={tableCell}>LRC (Longitudinal)</td>
              </tr>
              <tr>
                <td style={tableCell}>Efficiency</td>
                <td style={tableCell}>Higher throughput</td>
                <td style={tableCell}>~50% lower throughput</td>
              </tr>
              <tr>
                <td style={tableCell}>Usage</td>
                <td style={tableCell}>Most common in industry</td>
                <td style={tableCell}>Legacy, older equipment</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Modbus RTU Frame ---------- */}
      <div style={cardHL('#a855f7')}>
        <div style={sectionTitle}>Modbus RTU Frame Structure</div>
        <pre style={pre}>{`Modbus RTU Frame
================================
| Slave Addr | Function | Data      | CRC-16  |
|  1 byte    | 1 byte   | N bytes   | 2 bytes |

Example: Read 10 Holding Registers starting at address 40001

  Master Request:
  [01] [03] [00 00] [00 0A] [C5 CD]
   |    |     |       |       |
   |    |     |       |       +-- CRC-16 checksum
   |    |     |       +-- Quantity: 10 registers
   |    |     +-- Starting address: 0x0000 (register 40001)
   |    +-- Function code: 03 (Read Holding Registers)
   +-- Slave address: 01

  Slave Response:
  [01] [03] [14] [data...20 bytes] [CRC]
   |    |    |
   |    |    +-- Byte count: 20 (10 registers x 2 bytes)
   |    +-- Function code echo
   +-- Slave address echo`}</pre>
      </div>

      {/* ---------- Function Codes ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Common Modbus Function Codes</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Code</th>
                <th style={tableHeader}>Name</th>
                <th style={tableHeader}>Data Type</th>
                <th style={tableHeader}>Access</th>
                <th style={tableHeader}>Register Range</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCellMono}>01</td>
                <td style={tableCell}>Read Coils</td>
                <td style={tableCell}>Discrete Output (1-bit)</td>
                <td style={tableCell}>Read</td>
                <td style={tableCellMono}>00001 - 09999</td>
              </tr>
              <tr>
                <td style={tableCellMono}>02</td>
                <td style={tableCell}>Read Discrete Inputs</td>
                <td style={tableCell}>Discrete Input (1-bit)</td>
                <td style={tableCell}>Read</td>
                <td style={tableCellMono}>10001 - 19999</td>
              </tr>
              <tr>
                <td style={tableCellMono}>03</td>
                <td style={tableCell}>Read Holding Registers</td>
                <td style={tableCell}>Analog Output (16-bit)</td>
                <td style={tableCell}>Read</td>
                <td style={tableCellMono}>40001 - 49999</td>
              </tr>
              <tr>
                <td style={tableCellMono}>04</td>
                <td style={tableCell}>Read Input Registers</td>
                <td style={tableCell}>Analog Input (16-bit)</td>
                <td style={tableCell}>Read</td>
                <td style={tableCellMono}>30001 - 39999</td>
              </tr>
              <tr>
                <td style={tableCellMono}>05</td>
                <td style={tableCell}>Write Single Coil</td>
                <td style={tableCell}>Discrete Output (1-bit)</td>
                <td style={tableCell}>Write</td>
                <td style={tableCellMono}>00001 - 09999</td>
              </tr>
              <tr>
                <td style={tableCellMono}>06</td>
                <td style={tableCell}>Write Single Register</td>
                <td style={tableCell}>Analog Output (16-bit)</td>
                <td style={tableCell}>Write</td>
                <td style={tableCellMono}>40001 - 49999</td>
              </tr>
              <tr>
                <td style={tableCellMono}>15 (0x0F)</td>
                <td style={tableCell}>Write Multiple Coils</td>
                <td style={tableCell}>Discrete Output (1-bit)</td>
                <td style={tableCell}>Write</td>
                <td style={tableCellMono}>00001 - 09999</td>
              </tr>
              <tr>
                <td style={tableCellMono}>16 (0x10)</td>
                <td style={tableCell}>Write Multiple Registers</td>
                <td style={tableCell}>Analog Output (16-bit)</td>
                <td style={tableCell}>Write</td>
                <td style={tableCellMono}>40001 - 49999</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Modbus Register Addressing ---------- */}
      <div style={cardHL('#f59e0b')}>
        <div style={sectionTitle}>Modbus Register Addressing</div>
        <div style={bodyText}>
          <p>
            <strong>0-based vs 1-based addressing:</strong> The Modbus specification uses 0-based
            addressing in the protocol data unit (PDU), but device documentation often uses 1-based
            "register numbers." This is the #1 source of Modbus configuration errors.
          </p>
        </div>
        <pre style={{ ...pre, marginTop: 8 }}>{`Address Mapping (the "off-by-one" trap):

  Register Number   Protocol Address   Type
  00001             0x0000             Coil (Discrete Out)
  00002             0x0001             Coil
  10001             0x0000             Discrete Input
  30001             0x0000             Input Register
  40001             0x0000             Holding Register
  40002             0x0001             Holding Register

  If docs say "Register 40001" --> use address 0 in your config
  If docs say "Register 40100" --> use address 99 in your config

  Some software (e.g., Modbus Poll) adds the offset automatically.
  Some (e.g., AB MSG instruction) expects 0-based. ALWAYS CHECK.`}</pre>
      </div>

      {/* ---------- Common Modbus Issues ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Common Modbus Troubleshooting</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              issue: 'No response from slave',
              causes: 'Wrong slave address, wrong COM port, baud rate mismatch, parity mismatch, cable fault, A/B swapped, missing termination resistor',
              fix: 'Verify all serial parameters match exactly. Check with oscilloscope or protocol analyzer. Try address 1 first.',
            },
            {
              issue: 'CRC errors',
              causes: 'Electrical noise, incorrect baud rate, cable too long without termination, ground loop, incorrect parity setting',
              fix: 'Add 120 ohm termination, use shielded cable, verify ground reference, reduce baud rate, check cable distance.',
            },
            {
              issue: 'Intermittent timeouts',
              causes: 'Marginal cable, loose connections, EMI from VFDs/motors, response timeout too short, bus contention',
              fix: 'Increase timeout (250-500ms minimum). Route cables away from power. Check all terminal screws. Add ferrites.',
            },
            {
              issue: 'Wrong data values',
              causes: 'Off-by-one register address, wrong data type (INT vs FLOAT), byte/word order (big/little endian), scaling factor',
              fix: 'Check register map carefully. Try offset +/- 1. Check if float uses 2 registers. Verify byte order in docs.',
            },
            {
              issue: 'Exception response 0x02 (Illegal Data Address)',
              causes: 'Requested register does not exist on slave, address out of range, off-by-one error',
              fix: 'Verify register address in device manual. Remember 0-based vs 1-based. Check register count.',
            },
            {
              issue: 'Exception response 0x01 (Illegal Function)',
              causes: 'Device does not support the function code used, trying to write to read-only register',
              fix: 'Check which function codes the device supports. Use FC03 for holding registers, FC04 for input registers.',
            },
          ].map((item, i) => (
            <div key={i} style={cardHL('#ef4444')}>
              <div style={subHeading}>{item.issue}</div>
              <div style={{ ...bodyText, fontSize: 13 }}>
                <strong>Causes:</strong> {item.causes}
              </div>
              <div style={{ ...bodyText, fontSize: 13, marginTop: 4 }}>
                <strong>Fix:</strong> {item.fix}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Baud Rate / Distance relationship ---------- */}
      <div style={card}>
        <div style={sectionTitle}>RS-485 Baud Rate vs Distance</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>Baud Rate</th>
                <th style={tableHeader}>Max Distance</th>
                <th style={tableHeader}>Typical Use</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['9,600', '1,200 m (4,000 ft)', 'Most common for Modbus RTU in industrial'],
                ['19,200', '1,200 m (4,000 ft)', 'Faster polling, still long distance'],
                ['38,400', '600 m (2,000 ft)', 'Medium distance applications'],
                ['57,600', '300 m (1,000 ft)', 'Shorter runs, faster throughput'],
                ['115,200', '150 m (500 ft)', 'Short distance, high speed'],
              ].map(([baud, dist, use], i) => (
                <tr key={i}>
                  <td style={tableCellMono}>{baud}</td>
                  <td style={tableCellMono}>{dist}</td>
                  <td style={tableCell}>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...tipBox, marginTop: 10 }}>
          <strong>Rule of Thumb:</strong> For RS-485 in mining, use 9600 baud for maximum distance
          reliability. Cable must be Belden 3105A or equivalent: shielded twisted pair, 24 AWG,
          characteristic impedance 120 ohm.
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  TAB 2 -- INDUSTRIAL ETHERNET                                       */
/* ================================================================== */

function IndustrialEthernetTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ---------- Protocol Comparison ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Industrial Ethernet Protocols</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Protocol</th>
                <th style={tableHeader}>Developer</th>
                <th style={tableHeader}>Layer</th>
                <th style={tableHeader}>Cycle Time</th>
                <th style={tableHeader}>Common PLCs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCell}><strong>EtherNet/IP</strong></td>
                <td style={tableCell}>ODVA / Rockwell</td>
                <td style={tableCell}>Application (TCP/UDP)</td>
                <td style={tableCellMono}>~10 ms</td>
                <td style={tableCell}>Allen-Bradley, Omron</td>
              </tr>
              <tr>
                <td style={tableCell}><strong>PROFINET</strong></td>
                <td style={tableCell}>Siemens / PI</td>
                <td style={tableCell}>Layer 2 (RT) / TCP</td>
                <td style={tableCellMono}>~1 ms (RT), &lt;1 ms (IRT)</td>
                <td style={tableCell}>Siemens S7-1500/1200</td>
              </tr>
              <tr>
                <td style={tableCell}><strong>Modbus TCP</strong></td>
                <td style={tableCell}>Schneider Electric</td>
                <td style={tableCell}>Application (TCP)</td>
                <td style={tableCellMono}>~10-100 ms</td>
                <td style={tableCell}>Schneider M340/M580, many</td>
              </tr>
              <tr>
                <td style={tableCell}><strong>EtherCAT</strong></td>
                <td style={tableCell}>Beckhoff</td>
                <td style={tableCell}>Layer 2 (processing on the fly)</td>
                <td style={tableCellMono}>&lt;100 us</td>
                <td style={tableCell}>Beckhoff, Omron NJ/NX</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- EtherNet/IP ---------- */}
      <div style={cardHL('#3b82f6')}>
        <div style={sectionTitle}>EtherNet/IP (CIP over Ethernet)</div>
        <div style={bodyText}>
          <p>
            <strong>EtherNet/IP</strong> uses standard TCP/IP and UDP/IP, making it compatible with
            standard Ethernet infrastructure. It uses CIP (Common Industrial Protocol) at the
            application layer -- the same protocol used by DeviceNet and ControlNet.
          </p>
          <p style={{ marginTop: 6 }}>
            <strong>Key features:</strong> Producer/Consumer model for I/O data (implicit messaging
            via UDP multicast), Client/Server for configuration (explicit messaging via TCP).
            Port 44818 (TCP) for explicit, Port 2222 (UDP) for implicit I/O.
          </p>
          <p style={{ marginTop: 6 }}>
            <strong>In mining:</strong> Most common protocol in Ontario mines using Allen-Bradley
            ControlLogix/CompactLogix. Used for VFD communication, remote I/O, drives, PowerFlex
            drives, and SCADA integration.
          </p>
        </div>
      </div>

      {/* ---------- PROFINET ---------- */}
      <div style={cardHL('#22c55e')}>
        <div style={sectionTitle}>PROFINET</div>
        <div style={bodyText}>
          <p>
            <strong>PROFINET</strong> operates at Layer 2 for real-time I/O (RT) and uses standard
            TCP/IP for non-time-critical data. PROFINET IRT (Isochronous Real-Time) provides
            deterministic sub-millisecond communication for motion control.
          </p>
          <p style={{ marginTop: 6 }}>
            <strong>Key features:</strong> Device names (not IP addresses) for identification.
            Built-in diagnostics. Supports ring topology natively with MRP (Media Redundancy Protocol).
            Uses GSD/GSDML files for device configuration.
          </p>
          <p style={{ marginTop: 6 }}>
            <strong>In mining:</strong> Common in mines using Siemens S7-1500/1200 systems. Used
            for conveyor drives, process control, and ET200 remote I/O stations.
          </p>
        </div>
      </div>

      {/* ---------- Modbus TCP ---------- */}
      <div style={cardHL('#a855f7')}>
        <div style={sectionTitle}>Modbus TCP</div>
        <div style={bodyText}>
          <p>
            <strong>Modbus TCP</strong> encapsulates Modbus RTU frames in TCP/IP packets.
            Port 502. No CRC needed (TCP handles error detection). Same function codes as RTU.
            Simple to implement -- many devices support it as a secondary protocol.
          </p>
        </div>
        <pre style={{ ...pre, marginTop: 8 }}>{`Modbus TCP Frame (MBAP Header + PDU):
======================================
| Transaction ID | Protocol ID | Length | Unit ID | FC | Data |
|    2 bytes     |   2 bytes   |2 bytes | 1 byte  | 1  | N    |
|    (seq #)     |   (0x0000)  |        | (slave) |    |      |

  vs Modbus RTU:
  | Slave Addr | FC | Data | CRC |

  Key difference: No CRC in TCP. Unit ID replaces Slave Address.
  Supports up to 247 devices per TCP connection.
  Multiple simultaneous TCP connections allowed.`}</pre>
      </div>

      {/* ---------- Topology ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Network Topologies</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={cardHL('#3b82f6')}>
            <div style={subHeading}>Star Topology</div>
            <pre style={pre}>{`         [Switch]
        /  |   |  \\
      /    |   |    \\
  [PLC] [HMI] [VFD] [I/O]

  Pros: Easy to add/remove devices, one device
        failure doesn't affect others
  Cons: Single point of failure at switch,
        more cable required
  Use:  Standard for most EtherNet/IP, Modbus TCP`}</pre>
          </div>

          <div style={cardHL('#22c55e')}>
            <div style={subHeading}>Ring Topology (MRP/DLR)</div>
            <pre style={pre}>{`      [Switch A] -------- [Switch B]
         |                    |
      [PLC]                [VFD]
         |                    |
      [Switch C] -------- [Switch D]

  MRP: Media Redundancy Protocol (PROFINET)
  DLR: Device Level Ring (EtherNet/IP)

  Pros: Redundant path, one link failure
        does not stop communication
  Cons: More complex, requires managed switches
        or DLR-capable devices
  Use:  Critical mining infrastructure, conveyors`}</pre>
          </div>

          <div style={cardHL('#f59e0b')}>
            <div style={subHeading}>Linear / Daisy-Chain</div>
            <pre style={pre}>{`  [PLC]---[Device 1]---[Device 2]---[Device 3]

  Pros: Minimal cabling, easy to install
  Cons: Single point of failure, latency increases
  Use:  EtherCAT (by design), some PROFINET
        devices with built-in 2-port switches`}</pre>
          </div>
        </div>
      </div>

      {/* ---------- Managed vs Unmanaged ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Managed vs Unmanaged Switches</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Feature</th>
                <th style={tableHeader}>Unmanaged</th>
                <th style={tableHeader}>Managed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Configuration', 'None (plug & play)', 'Web/CLI/SNMP configurable'],
                ['VLANs', 'Not supported', 'Full VLAN support'],
                ['IGMP Snooping', 'No', 'Yes - critical for EtherNet/IP multicast'],
                ['QoS (Priority)', 'No', 'Yes - prioritize PLC traffic'],
                ['Port Mirroring', 'No', 'Yes - for diagnostics'],
                ['Ring Protocols', 'No', 'MRP, RSTP, DLR supervisor'],
                ['Diagnostics', 'Link LEDs only', 'Port stats, alarms, SNMP traps'],
                ['Cost', 'Low ($50-200)', 'Higher ($300-2000+)'],
                ['Mining Use', 'Small non-critical networks', 'All production networks'],
              ].map(([feat, un, man], i) => (
                <tr key={i}>
                  <td style={tableCell}><strong>{feat}</strong></td>
                  <td style={tableCell}>{un}</td>
                  <td style={tableCell}>{man}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...warnBox, marginTop: 10 }}>
          <strong>IGMP Snooping:</strong> Essential for EtherNet/IP networks. Without it, multicast
          I/O traffic floods all ports, consuming bandwidth and causing packet loss. Always enable
          on managed switches carrying EtherNet/IP implicit messaging.
        </div>
      </div>

      {/* ---------- VLANs and QoS ---------- */}
      <div style={cardHL('#f59e0b')}>
        <div style={sectionTitle}>VLANs and QoS Basics</div>
        <div style={bodyText}>
          <p>
            <strong>VLAN (Virtual LAN):</strong> Logically segments a physical network. Isolates
            control traffic from office/IT traffic. Common setup: VLAN 10 = PLC/I/O network,
            VLAN 20 = HMI/SCADA, VLAN 30 = IT/Office. Traffic between VLANs requires a Layer 3
            switch or router.
          </p>
          <p style={{ marginTop: 8 }}>
            <strong>QoS (Quality of Service):</strong> Prioritizes industrial traffic over
            non-critical data. Set PLC I/O traffic to highest priority (DSCP EF or Queue 7).
            Prevents large file transfers or video from starving real-time control packets.
          </p>
        </div>
      </div>

      {/* ---------- Cable Categories ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Ethernet Cable Categories</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Category</th>
                <th style={tableHeader}>Speed</th>
                <th style={tableHeader}>Bandwidth</th>
                <th style={tableHeader}>Max Distance</th>
                <th style={tableHeader}>Industrial Use</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Cat5e', '1 Gbps', '100 MHz', '100 m (328 ft)', 'Minimum for new installs'],
                ['Cat6', '1 Gbps (10G to 55m)', '250 MHz', '100 m (328 ft)', 'Recommended standard'],
                ['Cat6A', '10 Gbps', '500 MHz', '100 m (328 ft)', 'Future-proof, backbone'],
              ].map(([cat, speed, bw, dist, use], i) => (
                <tr key={i}>
                  <td style={tableCellMono}>{cat}</td>
                  <td style={tableCellMono}>{speed}</td>
                  <td style={tableCellMono}>{bw}</td>
                  <td style={tableCellMono}>{dist}</td>
                  <td style={tableCell}>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Shielded vs Unshielded ---------- */}
      <div style={cardHL('#ef4444')}>
        <div style={sectionTitle}>Shielded vs Unshielded Cable</div>
        <div style={bodyText}>
          <p>
            <strong>UTP (Unshielded):</strong> Standard for office environments. Lower cost, easier
            to terminate. Acceptable for control cabinets with minimal EMI.
          </p>
          <p style={{ marginTop: 6 }}>
            <strong>STP/FTP (Shielded):</strong> Required for industrial environments near VFDs,
            motors, welders, and high-voltage cables. Foil shield (F/UTP) or braided shield (S/FTP).
            Ground shield at ONE end only to prevent ground loops (per IEEE 802.3 recommendation,
            though manufacturer guidance may differ).
          </p>
          <p style={{ marginTop: 6 }}>
            <strong>In mining:</strong> Always use shielded cable (minimum F/UTP, prefer S/FTP).
            Use industrial-rated cable with continuous flex rating for areas with vibration.
            Oil/chemical resistant jacket required in processing plants.
          </p>
        </div>
      </div>

      {/* ---------- Industrial Connectors ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Industrial Connectors</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={cardHL('#3b82f6')}>
            <div style={subHeading}>M12 D-coded (4-pin)</div>
            <div style={{ ...bodyText, fontSize: 13 }}>
              Standard industrial Ethernet connector. IP67 rated when mated. Used on remote I/O
              modules, sensors with Ethernet interface, field switches. Supports 100 Mbps
              (Fast Ethernet). Common on Turck, Phoenix Contact, and Siemens field devices.
            </div>
          </div>
          <div style={cardHL('#22c55e')}>
            <div style={subHeading}>M12 X-coded (8-pin)</div>
            <div style={{ ...bodyText, fontSize: 13 }}>
              Supports 10 Gbps Ethernet. Used for backbone connections in harsh environments.
              Larger than D-coded. IP67. Becoming more common in new installations that need
              Cat6A performance with IP67 protection.
            </div>
          </div>
          <div style={cardHL('#a855f7')}>
            <div style={subHeading}>RJ45 Industrial (IP20/IP67)</div>
            <div style={{ ...bodyText, fontSize: 13 }}>
              Standard 8P8C connector in ruggedized housing. IP20 inside cabinets (standard RJ45).
              IP67 variants with screw-lock housing available from Harting, Phoenix Contact.
              Easiest to terminate but least robust without housing.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  TAB 3 -- FIBER OPTICS                                              */
/* ================================================================== */

function FiberOpticsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ---------- Single-mode vs Multimode ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Single-Mode vs Multimode Fiber</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Specification</th>
                <th style={tableHeader}>Single-Mode (OS1/OS2)</th>
                <th style={tableHeader}>Multimode</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCell}>Core Diameter</td>
                <td style={tableCellMono}>9 um</td>
                <td style={tableCellMono}>50 um or 62.5 um</td>
              </tr>
              <tr>
                <td style={tableCell}>Light Source</td>
                <td style={tableCell}>Laser (1310/1550 nm)</td>
                <td style={tableCell}>LED or VCSEL (850/1300 nm)</td>
              </tr>
              <tr>
                <td style={tableCell}>Max Distance</td>
                <td style={tableCellMono}>Up to 80+ km</td>
                <td style={tableCellMono}>300 m to 550 m (10G)</td>
              </tr>
              <tr>
                <td style={tableCell}>Bandwidth</td>
                <td style={tableCell}>Virtually unlimited</td>
                <td style={tableCell}>Limited by modal dispersion</td>
              </tr>
              <tr>
                <td style={tableCell}>Cost</td>
                <td style={tableCell}>Higher optics, cheaper cable</td>
                <td style={tableCell}>Lower optics, cable varies</td>
              </tr>
              <tr>
                <td style={tableCell}>Jacket Color</td>
                <td style={tableCell}>Yellow (OS2), Orange (OS1)</td>
                <td style={tableCell}>Orange (OM1/2), Aqua (OM3/4), Lime (OM5)</td>
              </tr>
              <tr>
                <td style={tableCell}>Mining Use</td>
                <td style={tableCell}>Surface-to-underground backbone, long shafts</td>
                <td style={tableCell}>Within buildings, short inter-panel runs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Multimode Grades ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Multimode Fiber Grades (OM1 - OM5)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 650 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Grade</th>
                <th style={tableHeader}>Core</th>
                <th style={tableHeader}>1G Distance</th>
                <th style={tableHeader}>10G Distance</th>
                <th style={tableHeader}>Jacket</th>
                <th style={tableHeader}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['OM1', '62.5 um', '275 m', '33 m', 'Orange', 'Legacy, not recommended for new installs'],
                ['OM2', '50 um', '550 m', '82 m', 'Orange', 'Legacy, being phased out'],
                ['OM3', '50 um', '550 m', '300 m', 'Aqua', 'Laser-optimized, good standard choice'],
                ['OM4', '50 um', '550 m', '400 m', 'Aqua', 'Enhanced OM3, recommended minimum'],
                ['OM5', '50 um', '550 m', '400 m', 'Lime green', 'SWDM support for 40/100G'],
              ].map(([grade, core, g1, g10, jacket, notes], i) => (
                <tr key={i}>
                  <td style={tableCellMono}>{grade}</td>
                  <td style={tableCellMono}>{core}</td>
                  <td style={tableCellMono}>{g1}</td>
                  <td style={tableCellMono}>{g10}</td>
                  <td style={tableCell}>{jacket}</td>
                  <td style={tableCell}>{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Connectors ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Fiber Optic Connectors</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              name: 'SC (Subscriber Connector)',
              desc: 'Square push-pull design. 2.5 mm ferrule. Most common in industrial and telecom. Easy to mate/unmate. Preferred for industrial panels due to secure latching.',
              color: '#3b82f6',
            },
            {
              name: 'LC (Lucent Connector)',
              desc: 'Small form factor, 1.25 mm ferrule. Half the size of SC. Most common in data centers and modern switches/SFP modules. Latching tab like RJ45. Becoming standard for new industrial installations.',
              color: '#22c55e',
            },
            {
              name: 'ST (Straight Tip)',
              desc: 'Bayonet twist-lock, 2.5 mm ferrule. Older style, still found in legacy industrial and mining installations. Being replaced by SC/LC in new builds. Secure locking mechanism good for vibration.',
              color: '#f59e0b',
            },
            {
              name: 'MPO/MTP (Multi-fiber)',
              desc: '12 or 24 fiber in one connector. Used for high-density backbone (40G/100G). Rarely needed in mining but common in data centers and large control rooms.',
              color: '#a855f7',
            },
          ].map((c, i) => (
            <div key={i} style={cardHL(c.color)}>
              <div style={subHeading}>{c.name}</div>
              <div style={{ ...bodyText, fontSize: 13 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Loss Budget ---------- */}
      <div style={cardHL('#f59e0b')}>
        <div style={sectionTitle}>Fiber Loss Budget Calculation</div>
        <pre style={pre}>{`Loss Budget = Transmitter Power - Receiver Sensitivity
             = Available power for losses in the link

Typical Loss Values:
  Connector loss:     0.3 - 0.5 dB per mated pair
  Splice (fusion):    0.05 - 0.1 dB per splice
  Splice (mechanical):0.2 - 0.5 dB per splice
  Fiber attenuation:
    Multimode 850nm:  3.5 dB/km
    Multimode 1300nm: 1.5 dB/km
    Single-mode 1310: 0.35 dB/km
    Single-mode 1550: 0.22 dB/km
  Safety margin:      3 dB (always include)

Example: 2 km single-mode link at 1310nm
  2 connectors:     2 x 0.3 dB  = 0.6 dB
  2 splices:        2 x 0.1 dB  = 0.2 dB
  Fiber loss:       2 x 0.35    = 0.7 dB
  Safety margin:                  3.0 dB
  ----------------------------------------
  Total budget needed:            4.5 dB

  If TX power = -10 dBm, RX sensitivity = -20 dBm
  Available = 10 dB > 4.5 dB required --> PASS`}</pre>
      </div>

      {/* ---------- When to Use Fiber ---------- */}
      <div style={card}>
        <div style={sectionTitle}>When to Use Fiber Optic Cable</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            {
              reason: 'EMI/Noise Immunity',
              detail: 'Fiber is completely immune to electromagnetic interference. Required near VFDs, arc furnaces, high-voltage switchgear, and substations. No need for shielding or grounding considerations.',
            },
            {
              reason: 'Distance Beyond 100m',
              detail: 'Copper Ethernet is limited to 100m. Fiber extends to 550m (multimode 10G) or 80+ km (single-mode). Essential for mine shafts, long conveyor runs, and between surface buildings.',
            },
            {
              reason: 'Ground Loop Isolation',
              detail: 'Fiber provides galvanic isolation between buildings/panels. Eliminates ground potential differences that damage equipment. Critical between buildings with separate electrical services.',
            },
            {
              reason: 'Lightning/Surge Protection',
              detail: 'Fiber cannot conduct surge energy. Ideal for outdoor runs, between buildings, and any path exposed to lightning. No need for surge protectors on the data link.',
            },
            {
              reason: 'Security',
              detail: 'Fiber cannot be tapped without detection (signal loss). No electromagnetic emissions to intercept. Important for security-critical mine systems.',
            },
          ].map((item, i) => (
            <div key={i} style={cardHL('#22c55e')}>
              <div style={subHeading}>{item.reason}</div>
              <div style={{ ...bodyText, fontSize: 13 }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Cleaning and Testing ---------- */}
      <div style={cardHL('#ef4444')}>
        <div style={sectionTitle}>Fiber Cleaning and Testing</div>
        <div style={bodyText}>
          <p>
            <strong>Rule #1:</strong> ALWAYS inspect and clean fiber before connecting. A single
            dust particle on a fiber end face can cause 1+ dB loss. Use a fiber inspection scope
            (200x-400x magnification) and IEC 61300-3-35 pass/fail criteria.
          </p>
          <p style={{ marginTop: 8 }}>
            <strong>Cleaning methods:</strong> Dry wipe first (lint-free wipe, one direction).
            If contamination persists, use IPA (isopropyl alcohol, 99%+) on a cleaning wipe,
            then dry wipe. For connectors inside adapters, use a click-cleaner (IBC brand or
            equivalent). NEVER blow on a connector with your breath.
          </p>
          <p style={{ marginTop: 8 }}>
            <strong>OTDR Testing:</strong> Optical Time Domain Reflectometer sends a pulse of
            light and measures reflections. Shows fiber length, splice locations, connector losses,
            bends, and breaks on a distance-based trace. Essential for qualifying new installations
            and troubleshooting faults. Record baseline OTDR traces at commissioning for future
            comparison. In mining, test after any ground movement or blast event.
          </p>
        </div>
      </div>

      {/* ---------- Mining Fiber Applications ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Mining Fiber Optic Applications</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            {
              app: 'Surface-to-Underground Backbone',
              detail: 'Single-mode fiber down main shaft or decline. Typically armored cable (steel wire armored or dielectric). Carries SCADA, voice, video, tracking, and safety systems. Redundant paths via separate shafts recommended.',
              color: '#3b82f6',
            },
            {
              app: 'Level-to-Level Connections',
              detail: 'Multimode or single-mode between mining levels via bore holes or ramps. Industrial-rated armored cable. Media converters at each end to connect to copper Ethernet switches on each level.',
              color: '#22c55e',
            },
            {
              app: 'Conveyor Backbone',
              detail: 'Fiber along long conveyor runs (often >100m). Connects remote I/O, belt scales, pull-cord switches, and alignment sensors back to central PLC. Use armored/ruggedized cable rated for the environment.',
              color: '#f59e0b',
            },
            {
              app: 'Substation Interconnect',
              detail: 'Fiber between main and satellite substations. Carries protection relay data (IEC 61850/GOOSE), SCADA polling, and power quality monitoring. Immune to high-voltage switching transients.',
              color: '#a855f7',
            },
          ].map((item, i) => (
            <div key={i} style={cardHL(item.color)}>
              <div style={subHeading}>{item.app}</div>
              <div style={{ ...bodyText, fontSize: 13 }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Cable Types ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Fiber Cable Types for Industrial / Mining</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 550 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Cable Type</th>
                <th style={tableHeader}>Construction</th>
                <th style={tableHeader}>Application</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Tight-buffered', '900 um buffer on each fiber, PVC/LSZH jacket', 'Indoor, within panels, short patch cords'],
                ['Loose-tube', 'Fibers in gel-filled tubes, water-blocking', 'Outdoor, underground, duct runs'],
                ['Armored (SWA)', 'Steel wire armor over loose-tube', 'Direct burial, mine shafts, high-risk areas'],
                ['Dielectric', 'All-dielectric (no metal), Kevlar strength', 'Near HV, lightning-prone areas, shaft cables'],
                ['Breakout', 'Individual jacketed fibers, easy to terminate', 'Short indoor runs, patch panels'],
                ['ADSS', 'All-Dielectric Self-Supporting', 'Aerial runs on mine surface, between buildings'],
              ].map(([type, construct, app], i) => (
                <tr key={i}>
                  <td style={tableCell}><strong>{type}</strong></td>
                  <td style={tableCell}>{construct}</td>
                  <td style={tableCell}>{app}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  TAB 4 -- WIRELESS INDUSTRIAL                                       */
/* ================================================================== */

function WirelessIndustrialTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ---------- WiFi in Industrial ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Industrial WiFi</div>
        <div style={bodyText}>
          <p>
            Industrial WiFi uses the same IEEE 802.11 standards as consumer WiFi but with
            industrial-grade access points (APs), ruggedized enclosures (IP67), and careful
            RF planning. Common for mobile equipment, HMI tablets, and areas where cabling
            is impractical.
          </p>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>2.4 GHz vs 5 GHz Band</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Feature</th>
                <th style={tableHeader}>2.4 GHz</th>
                <th style={tableHeader}>5 GHz</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Channels (non-overlapping)', '3 (1, 6, 11)', '24+ (varies by region)'],
                ['Range', 'Longer (better penetration)', 'Shorter (more attenuation)'],
                ['Throughput', 'Lower (more congested)', 'Higher (more bandwidth)'],
                ['Interference', 'High (microwaves, Bluetooth, other APs)', 'Lower (less crowded)'],
                ['Wall Penetration', 'Better', 'Worse'],
                ['Best For', 'Coverage over large areas, through walls', 'High throughput, dense AP environments'],
                ['Mining Surface', 'Good for general coverage', 'Good for offices, processing plants'],
                ['Underground', 'Primary choice (better penetration)', 'Limited use (high attenuation in rock)'],
              ].map(([feat, ghz24, ghz5], i) => (
                <tr key={i}>
                  <td style={tableCell}><strong>{feat}</strong></td>
                  <td style={tableCell}>{ghz24}</td>
                  <td style={tableCell}>{ghz5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- AP Planning ---------- */}
      <div style={cardHL('#3b82f6')}>
        <div style={sectionTitle}>Access Point Planning</div>
        <div style={bodyText}>
          <p><strong>Site survey:</strong> Always perform a physical RF site survey before installation.
            Use tools like Ekahau or AirMagnet. Predictive surveys (software only) are insufficient
            for industrial environments due to metal structures, moving equipment, and variable
            conditions.</p>
          <p style={{ marginTop: 6 }}><strong>Coverage overlap:</strong> Design for 15-20% overlap
            between APs for seamless roaming. Use -67 dBm minimum signal strength for reliable
            data, -75 dBm for basic connectivity.</p>
          <p style={{ marginTop: 6 }}><strong>Channel planning:</strong> Assign non-overlapping
            channels. For 2.4 GHz: channels 1, 6, 11. For 5 GHz: use DFS channels if allowed,
            avoid co-channel interference.</p>
          <p style={{ marginTop: 6 }}><strong>AP density:</strong> Metal buildings require more APs
            than open areas. Concrete and rock attenuate significantly. Plan for 30-50m range
            in typical industrial buildings, less in metal-heavy environments.</p>
        </div>
      </div>

      {/* ---------- Bluetooth / BLE ---------- */}
      <div style={cardHL('#22c55e')}>
        <div style={sectionTitle}>Bluetooth / BLE for Industrial Sensors</div>
        <div style={bodyText}>
          <p><strong>Bluetooth Low Energy (BLE):</strong> Used for wireless sensor tags,
            condition monitoring, and asset tracking. Very low power (years on coin cell battery).
            Range: 10-50m typical, up to 200m line of sight.</p>
          <p style={{ marginTop: 6 }}><strong>Industrial uses:</strong> Temperature/humidity sensors,
            vibration monitoring on motors/bearings, personnel tracking beacons, tool tracking.
            Typically transmits readings every 1-60 seconds to BLE gateways connected to the wired
            network.</p>
          <p style={{ marginTop: 6 }}><strong>Limitations:</strong> Low bandwidth (1-2 Mbps),
            not suitable for real-time control, interference from WiFi on 2.4 GHz band. Point-to-point
            or broadcast only (no mesh in classic BLE, though Bluetooth Mesh standard exists).</p>
        </div>
      </div>

      {/* ---------- ISA100 / WirelessHART ---------- */}
      <div style={card}>
        <div style={sectionTitle}>ISA100.11a and WirelessHART</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Feature</th>
                <th style={tableHeader}>WirelessHART</th>
                <th style={tableHeader}>ISA100.11a</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Standard', 'IEC 62591', 'IEC 62734'],
                ['Radio', '2.4 GHz, IEEE 802.15.4', '2.4 GHz, IEEE 802.15.4'],
                ['Topology', 'Mesh (self-healing)', 'Mesh and Star'],
                ['Update Rate', '1-60 sec typical', '100ms-60 sec configurable'],
                ['Channel Hopping', 'Yes (15 channels)', 'Yes (15 channels)'],
                ['Security', 'AES-128 encryption', 'AES-128 encryption'],
                ['Coexistence', 'Blacklisting WiFi channels', 'Configurable channel lists'],
                ['Use Case', 'Process instrumentation retrofit', 'Flexible, multiple app types'],
                ['Mining', 'Wireless level/pressure sensors', 'Ventilation monitoring sensors'],
              ].map(([feat, wh, isa], i) => (
                <tr key={i}>
                  <td style={tableCell}><strong>{feat}</strong></td>
                  <td style={tableCell}>{wh}</td>
                  <td style={tableCell}>{isa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...tipBox, marginTop: 10 }}>
          Both WirelessHART and ISA100.11a are designed for monitoring and slow-loop control,
          NOT for fast real-time control. They are ideal for adding measurement points where
          running cable is impractical or too expensive (e.g., remote tanks, hard-to-reach
          equipment in mines).
        </div>
      </div>

      {/* ---------- LoRa ---------- */}
      <div style={cardHL('#a855f7')}>
        <div style={sectionTitle}>LoRa / LoRaWAN for Remote Monitoring</div>
        <div style={bodyText}>
          <p><strong>LoRa (Long Range):</strong> Low-power, wide-area network (LPWAN) technology.
            Sub-GHz radio (915 MHz in North America). Range: 2-15 km line-of-sight, 1-5 km urban/industrial.</p>
          <p style={{ marginTop: 6 }}><strong>Key characteristics:</strong> Very low data rate
            (0.3-50 kbps), extremely low power (10+ year battery life), license-free spectrum.
            Ideal for sending small amounts of data (sensor readings, alarms) at low frequency.</p>
          <p style={{ marginTop: 6 }}><strong>Mining applications:</strong> Remote water level
            monitoring at tailings ponds, weather stations, environmental sensors (dust, noise),
            remote pump stations, pit slope monitoring. Gateway on surface connects sensors to
            SCADA via cellular or Ethernet backhaul.</p>
        </div>
      </div>

      {/* ---------- Cellular Gateways ---------- */}
      <div style={cardHL('#f59e0b')}>
        <div style={sectionTitle}>Cellular Gateways (LTE/5G)</div>
        <div style={bodyText}>
          <p><strong>Use case:</strong> Remote sites without wired infrastructure. Connects remote
            PLCs, RTUs, and sensors to central SCADA via cellular network. Common for remote pump
            stations, water treatment, remote mine exploration camps.</p>
          <p style={{ marginTop: 6 }}><strong>Typical setup:</strong> Industrial cellular router
            (e.g., Sierra Wireless, Cradlepoint, Moxa) with Ethernet/serial ports. VPN tunnel to
            SCADA server for security. Dual SIM for carrier redundancy. External antenna for
            remote locations.</p>
          <p style={{ marginTop: 6 }}><strong>Considerations:</strong> Latency (50-200ms typical),
            data costs, coverage gaps in remote mining areas. Not suitable for fast real-time control.
            Good for monitoring, alarm reporting, and remote access. Always use VPN -- never expose
            industrial protocols directly to the internet.</p>
        </div>
      </div>

      {/* ---------- Mesh Networking ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Mesh Networking</div>
        <div style={bodyText}>
          <p><strong>Self-healing mesh:</strong> Each node can route data through multiple paths.
            If one node fails or a path is blocked, traffic automatically re-routes. Essential for
            dynamic industrial environments where equipment moves and conditions change.</p>
          <p style={{ marginTop: 6 }}><strong>Industrial mesh examples:</strong> Rajant Kinetic Mesh
            (used in mining for mobile equipment), WirelessHART sensor networks, Cisco Industrial
            Wireless. Some use multiple radios (2.4 + 5 GHz) for increased bandwidth and redundancy.</p>
        </div>
      </div>

      {/* ---------- Antenna Types ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Antenna Types for Industrial Wireless</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            {
              type: 'Omnidirectional',
              pattern: '360 deg horizontal, narrow vertical',
              gain: '2-9 dBi',
              use: 'General coverage APs, indoor mounting, mesh nodes. Most common for underground mining WiFi.',
              color: '#3b82f6',
            },
            {
              type: 'Directional (Panel/Patch)',
              pattern: '60-120 deg beam',
              gain: '8-14 dBi',
              use: 'Point-to-area coverage, mounting on walls to cover specific zones. Good for long tunnels.',
              color: '#22c55e',
            },
            {
              type: 'Yagi',
              pattern: '30-60 deg narrow beam',
              gain: '10-18 dBi',
              use: 'Point-to-point links, long tunnel coverage, connecting buildings. High gain for distance.',
              color: '#f59e0b',
            },
            {
              type: 'Parabolic Dish',
              pattern: '5-15 deg very narrow beam',
              gain: '20-30 dBi',
              use: 'Long-distance point-to-point backhaul (1-50 km). Mine site to town, between pit and plant.',
              color: '#a855f7',
            },
          ].map((a, i) => (
            <div key={i} style={cardHL(a.color)}>
              <div style={subHeading}>{a.type}</div>
              <div style={{ ...bodyText, fontSize: 13 }}>
                <strong>Pattern:</strong> {a.pattern}<br />
                <strong>Gain:</strong> {a.gain}<br />
                <strong>Use:</strong> {a.use}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Signal Propagation ---------- */}
      <div style={cardHL('#ef4444')}>
        <div style={sectionTitle}>Signal Propagation in Metal Buildings / Underground</div>
        <div style={bodyText}>
          <p><strong>Metal buildings (processing plants, mills):</strong> Steel walls, pipe racks,
            and equipment create severe multipath and shadowing. WiFi range may be reduced to
            10-20m. Use more APs with lower power to create smaller cells. Diversity antennas
            help with multipath. 2.4 GHz penetrates metal structures better than 5 GHz.</p>
          <p style={{ marginTop: 8 }}><strong>Underground mines:</strong> Rock and concrete
            attenuate signals rapidly. Tunnels act as waveguides (signal follows the tunnel but
            dies quickly around corners). Typical WiFi range in a straight tunnel: 100-200m with
            directional antenna, but drops to near zero around a 90-degree turn. Solutions include
            leaky feeder cable (see Mining tab), distributed AP systems with fiber backbone, and
            directional antennas aimed down tunnels.</p>
          <p style={{ marginTop: 8 }}><strong>Fresnel Zone:</strong> For outdoor point-to-point
            links, ensure 60% of the first Fresnel zone is clear of obstructions. For a 1 km link
            at 2.4 GHz, the Fresnel zone radius at midpoint is approximately 5.6 m. Stockpiles,
            buildings, and terrain can block the signal even if there is visual line-of-sight.</p>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  TAB 5 -- NETWORK TROUBLESHOOTING                                   */
/* ================================================================== */

function NetworkTroubleshootingTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ---------- Basic Network Tools ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Essential Network Diagnostic Commands</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={cardHL('#3b82f6')}>
            <div style={subHeading}>ping</div>
            <pre style={pre}>{`ping 192.168.1.1          # Basic connectivity test
ping -t 192.168.1.1       # Continuous ping (Ctrl+C to stop)
ping -n 100 192.168.1.1   # Send 100 pings (check for drops)
ping -l 1472 192.168.1.1  # Test MTU (1472 + 28 = 1500)

What ping tells you:
  Reply      = Device reachable, network path OK
  Timeout    = Device down, firewall blocking, route problem
  TTL        = How many hops away (starts 128/64, decrements)
  Time       = Round-trip latency (should be <10ms on LAN)
  % Loss     = Packet loss (>0% = problem)`}</pre>
          </div>

          <div style={cardHL('#22c55e')}>
            <div style={subHeading}>tracert (traceroute)</div>
            <pre style={pre}>{`tracert 192.168.2.1       # Windows
traceroute 192.168.2.1    # Linux

Shows every router hop between you and destination.
Useful for finding where packets stop in a routed network.

Example output:
  1   <1ms   192.168.1.1    (your gateway)
  2    2ms   10.0.0.1       (core switch)
  3    *      *              (timeout = problem here)`}</pre>
          </div>

          <div style={cardHL('#a855f7')}>
            <div style={subHeading}>ipconfig / ifconfig</div>
            <pre style={pre}>{`ipconfig                  # Show IP config (Windows)
ipconfig /all             # Show detailed config + MAC + DHCP
ipconfig /release         # Release DHCP lease
ipconfig /renew           # Request new DHCP lease
ifconfig                  # Linux equivalent (or "ip addr")

Key info to check:
  IP Address   - Is it correct for this network?
  Subnet Mask  - Does it match other devices?
  Gateway      - Is the default gateway correct?
  DNS          - Can names resolve?
  DHCP         - Is it DHCP or static? (industrial = static)`}</pre>
          </div>

          <div style={cardHL('#f59e0b')}>
            <div style={subHeading}>arp / nslookup / netstat</div>
            <pre style={pre}>{`arp -a                    # Show ARP table (IP-to-MAC mapping)
                          # Useful for finding duplicate IPs
                          # Two MACs for same IP = IP CONFLICT

nslookup hostname         # DNS resolution test
                          # Rarely used in industrial but good to know

netstat -an               # Show all connections and listening ports
                          # Verify Modbus TCP port 502 is listening
                          # Check EtherNet/IP port 44818 status`}</pre>
          </div>
        </div>
      </div>

      {/* ---------- IP Addressing Basics ---------- */}
      <div style={card}>
        <div style={sectionTitle}>IP Addressing Basics for Industrial Networks</div>
        <pre style={pre}>{`IP Address Structure (IPv4):
  192.168.1.100 / 255.255.255.0  (or /24)
  |___________|   |_____________|
    Host ID         Subnet Mask

Common Industrial Subnets:
  /24 = 255.255.255.0   = 254 hosts  (most common)
  /16 = 255.255.0.0     = 65,534 hosts
  /8  = 255.0.0.0       = 16 million hosts

Private IP Ranges (RFC 1918):
  10.0.0.0    - 10.255.255.255    /8    (Class A)
  172.16.0.0  - 172.31.255.255    /12   (Class B)
  192.168.0.0 - 192.168.255.255   /16   (Class C)

Typical Industrial Network Scheme:
  192.168.1.1     - Gateway/Router
  192.168.1.2-10  - Managed switches
  192.168.1.11-20 - PLCs and controllers
  192.168.1.21-50 - HMIs and SCADA stations
  192.168.1.51-99 - VFDs and drives
  192.168.1.100+  - Remote I/O, instruments

Rules for industrial networks:
  1. ALWAYS use static IPs (no DHCP for controllers)
  2. Document every IP address assignment
  3. Keep control network separate from IT network
  4. Use same subnet mask on ALL devices
  5. Default gateway only needed if routing between subnets`}</pre>
      </div>

      {/* ---------- Subnet Quick Reference ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Subnet Quick Reference</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>CIDR</th>
                <th style={tableHeader}>Subnet Mask</th>
                <th style={tableHeader}>Usable Hosts</th>
                <th style={tableHeader}>Typical Use</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['/30', '255.255.255.252', '2', 'Point-to-point link'],
                ['/28', '255.255.255.240', '14', 'Small device group'],
                ['/27', '255.255.255.224', '30', 'Control panel subnet'],
                ['/26', '255.255.255.192', '62', 'Department subnet'],
                ['/25', '255.255.255.128', '126', 'Medium network'],
                ['/24', '255.255.255.0', '254', 'Standard industrial subnet'],
                ['/16', '255.255.0.0', '65,534', 'Large site network'],
              ].map(([cidr, mask, hosts, use], i) => (
                <tr key={i}>
                  <td style={tableCellMono}>{cidr}</td>
                  <td style={tableCellMono}>{mask}</td>
                  <td style={tableCellMono}>{hosts}</td>
                  <td style={tableCell}>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Common Issues ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Common Network Issues and Solutions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              issue: 'IP Address Conflict',
              symptoms: 'Intermittent connectivity, random disconnections, "address conflict" popup',
              diagnose: 'Check ARP table (arp -a). Two different MAC addresses for the same IP = conflict. Ping the IP and check who responds.',
              fix: 'Identify both devices using MAC address lookup. Change one device to unused IP. Update IP documentation. Consider IP management spreadsheet.',
              color: '#ef4444',
            },
            {
              issue: 'Cable Fault (Open / Short)',
              symptoms: 'No link light, link light blinking erratically, high packet loss',
              diagnose: 'Check link LEDs on switch and device. Use cable tester (Fluke LinkIQ). Visual inspection for damaged connectors, crushed cable, tight bends.',
              fix: 'Replace cable or re-terminate connectors. Maintain minimum bend radius (4x cable OD for Cat6). Keep away from power cables. Use cable management.',
              color: '#f59e0b',
            },
            {
              issue: 'Switch Port Failure',
              symptoms: 'No link on one port, other ports work fine. Device works on different port.',
              diagnose: 'Move cable to a different port. Check port status on managed switch (admin disabled? err-disabled?). Check port statistics for errors.',
              fix: 'Reboot switch if needed. Re-enable port if admin disabled. Check for err-disable recovery settings. Replace switch if hardware failure.',
              color: '#a855f7',
            },
            {
              issue: 'VLAN Misconfiguration',
              symptoms: 'Device has link but cannot communicate with devices on same VLAN. Can see some devices but not others.',
              diagnose: 'Verify VLAN assignment on switch port. Check trunk port configuration. Verify device is on correct VLAN. Compare with working ports.',
              fix: 'Assign correct VLAN to switch port. Ensure trunk ports carry required VLANs. Verify VLAN consistency across all switches in path.',
              color: '#3b82f6',
            },
            {
              issue: 'Wrong Subnet Mask',
              symptoms: 'Can ping some devices but not others on "same" network. Gateway unreachable.',
              diagnose: 'Compare subnet mask on problem device with working devices. Calculate network/broadcast addresses for each. Devices must be in same subnet to communicate.',
              fix: 'Set identical subnet mask on all devices in the same network. Most common: 255.255.255.0 (/24). Document the standard for each VLAN.',
              color: '#22c55e',
            },
            {
              issue: 'Duplex Mismatch',
              symptoms: 'Very slow communication, high collision count, late collisions on port stats.',
              diagnose: 'Check port speed/duplex on both ends. One side says 100/Full, other says 100/Half = mismatch. Auto-negotiate can sometimes fail.',
              fix: 'Set both ends to same speed/duplex. Prefer auto-negotiate on both, or hard-set both. NEVER set one to auto and other to fixed.',
              color: '#ef4444',
            },
          ].map((item, i) => (
            <div key={i} style={cardHL(item.color)}>
              <div style={subHeading}>{item.issue}</div>
              <div style={{ ...bodyText, fontSize: 13 }}>
                <strong>Symptoms:</strong> {item.symptoms}
              </div>
              <div style={{ ...bodyText, fontSize: 13, marginTop: 4 }}>
                <strong>Diagnose:</strong> {item.diagnose}
              </div>
              <div style={{ ...bodyText, fontSize: 13, marginTop: 4 }}>
                <strong>Fix:</strong> {item.fix}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Cable Testing ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Cable Testing with Fluke Tools</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={cardHL('#3b82f6')}>
            <div style={subHeading}>Fluke LinkIQ Cable+Network Tester</div>
            <div style={{ ...bodyText, fontSize: 13 }}>
              <strong>Capabilities:</strong> Cable length measurement, wiremap (open, short,
              crossed pairs, split pairs), PoE testing, switch advertisement (speed, duplex, VLAN),
              nearest switch identification, network connectivity test.
            </div>
            <div style={{ ...bodyText, fontSize: 13, marginTop: 6 }}>
              <strong>When to use:</strong> First-line troubleshooting. Quick pass/fail for cable
              runs. Verify new cable installations. Identify which switch port a cable connects to.
              Not a certification tool but excellent for daily troubleshooting.
            </div>
          </div>

          <div style={cardHL('#22c55e')}>
            <div style={subHeading}>Fluke MicroScanner PoE</div>
            <div style={{ ...bodyText, fontSize: 13 }}>
              <strong>Capabilities:</strong> Wiremap, cable length (TDR), cable ID (with remote IDs),
              PoE detection and voltage measurement, tone generator for cable tracing.
            </div>
            <div style={{ ...bodyText, fontSize: 13, marginTop: 6 }}>
              <strong>When to use:</strong> Pocket-sized for daily carry. Patch panel identification,
              cable tracing, quick wiremap verification. Essential tool for any industrial
              electrician working with network cabling.
            </div>
          </div>

          <div style={cardHL('#f59e0b')}>
            <div style={subHeading}>Cable Test Results - What They Mean</div>
            <pre style={pre}>{`Wiremap Tests:
  PASS      = All 8 wires correctly connected
  OPEN      = Broken wire or no connection on pin(s)
  SHORT     = Two or more wires touching
  CROSSED   = Pairs swapped (e.g., T568A on one end, T568B on other)
  SPLIT     = One pair mixed across two pairs (causes crosstalk)

Length Test:
  0 m       = Open or no cable connected
  < 1 m     = Possible short near connector
  > 100 m   = Exceeds Ethernet maximum (consider fiber)
  Varies    = Different lengths per pair = intermittent fault`}</pre>
          </div>
        </div>
      </div>

      {/* ---------- Wireshark Basics ---------- */}
      <div style={cardHL('#a855f7')}>
        <div style={sectionTitle}>Wireshark / Protocol Analyzer Basics</div>
        <div style={bodyText}>
          <p><strong>Wireshark</strong> is a free, open-source protocol analyzer. Captures and
            decodes all network traffic on the selected interface. Essential for diagnosing
            protocol-level issues that ping and cable testers cannot detect.</p>
        </div>
        <pre style={{ ...pre, marginTop: 8 }}>{`Common Wireshark Filters for Industrial:

  Modbus TCP:
    modbus                      # All Modbus traffic
    tcp.port == 502             # Modbus TCP port
    modbus.func_code == 3       # Read Holding Registers only
    modbus.exception_code       # Only exception responses

  EtherNet/IP:
    enip                        # All EtherNet/IP traffic
    tcp.port == 44818           # Explicit messaging
    udp.port == 2222            # Implicit I/O messaging
    cip                         # CIP layer details

  PROFINET:
    pn_io                       # PROFINET I/O
    pn_dcp                      # PROFINET Discovery (DCP)

  General:
    ip.addr == 192.168.1.10     # All traffic to/from IP
    eth.addr == aa:bb:cc:dd:ee  # Filter by MAC address
    tcp.analysis.retransmission # Retransmissions (network issue)
    icmp                        # Ping traffic only

  How to capture industrial traffic:
    1. Connect laptop to mirror/SPAN port on managed switch
    2. Or use inline tap (network TAP device)
    3. Or connect to same unmanaged switch (not ideal)
    4. Start capture, reproduce the problem
    5. Stop capture, apply filter, analyze`}</pre>
      </div>

      {/* ---------- Troubleshooting Flowchart ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Network Troubleshooting Flowchart</div>
        <pre style={pre}>{`Device not communicating?
  |
  +-- Check link LEDs on device and switch port
  |     |
  |     +-- No link LED?
  |     |     +-- Check cable with tester
  |     |     +-- Try different port on switch
  |     |     +-- Try different cable
  |     |     +-- Check device power
  |     |
  |     +-- Link LED OK?
  |           +-- Ping the device
  |                 |
  |                 +-- Ping fails?
  |                 |     +-- Check IP address/subnet
  |                 |     +-- Check for IP conflict (arp -a)
  |                 |     +-- Check VLAN assignment
  |                 |     +-- Check firewall/ACL rules
  |                 |     +-- Try ping from different device
  |                 |
  |                 +-- Ping works but protocol fails?
  |                       +-- Check port number (502, 44818)
  |                       +-- Check protocol parameters
  |                       +-- Use Wireshark to capture
  |                       +-- Check device configuration
  |                       +-- Check for exception responses`}</pre>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  TAB 6 -- MINING COMMUNICATIONS                                     */
/* ================================================================== */

function MiningCommsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ---------- Leaky Feeder Systems ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Leaky Feeder Systems</div>
        <div style={bodyText}>
          <p>
            <strong>Leaky feeder</strong> (radiating cable) is the backbone of underground mine
            communication. It is a coaxial cable with slots cut in the outer conductor at regular
            intervals, allowing RF energy to "leak" out and provide radio coverage throughout tunnels
            and drifts.
          </p>
        </div>
        <pre style={{ ...pre, marginTop: 8 }}>{`Leaky Feeder System Layout:
==============================================

  Surface Base   Head-End      Line         Line
   Station       Amplifier   Amplifier    Amplifier
      |              |            |            |
  ----+==============+=====//=====+=====//=====+=====>
      |   Coax Feed  | Leaky Feeder Cable (slotted)
      |              |    |    |    |    |    |
      |              |   radio signals leak out
      |              |
  Repeater connects to surface radio system

  Components:
    Head-end amplifier: Boosts signal entering the mine
    Line amplifiers: Every 350-500m to compensate cable loss
    Leaky feeder cable: 1-1/4" or 1-5/8" radiating coax
    Splitters: To branch into side drifts
    Terminators: At cable ends to prevent reflections

  Frequencies:
    VHF: 150-174 MHz (most common in Ontario mines)
    UHF: 450-470 MHz (higher frequency, more loss)
    Some systems carry data channels alongside voice`}</pre>
        <div style={{ ...warnBox, marginTop: 10 }}>
          <strong>Maintenance:</strong> Leaky feeder systems require regular signal level testing.
          Damaged cable (from blasting, equipment contact, or rock fall) causes dead zones. Carry a
          field strength meter during inspections. Report and repair damage immediately -- miners
          depend on this system for emergency communication.
        </div>
      </div>

      {/* ---------- Mine WiFi ---------- */}
      <div style={cardHL('#3b82f6')}>
        <div style={sectionTitle}>Mine WiFi Systems</div>
        <div style={bodyText}>
          <p>
            Modern mines supplement or replace leaky feeder with WiFi access points on fiber backbone.
            APs are mounted every 100-200m (straight tunnel) with directional antennas aimed down
            the tunnel. Fiber backbone carries data back to surface network.
          </p>
          <p style={{ marginTop: 6 }}>
            <strong>Typical architecture:</strong> Fiber backbone from surface to each level.
            Industrial Ethernet switches at distribution points. WiFi APs (IP67 rated, hazloc
            certified where required) connected via Ethernet drops from the switch. Controller-based
            system (e.g., Cisco, Rajant) for centralized management and seamless roaming.
          </p>
          <p style={{ marginTop: 6 }}>
            <strong>Applications:</strong> Voice over WiFi (VoWiFi) phones, tablet-based dispatching,
            equipment telemetry, real-time tracking, video monitoring at critical points (chutes,
            conveyors), remote PLC access for maintenance.
          </p>
        </div>
      </div>

      {/* ---------- PED / Collision Avoidance ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Proximity Detection (PED) and Collision Avoidance</div>
        <div style={bodyText}>
          <p>
            <strong>PED (Proximity Evaluation Device)</strong> systems detect when personnel are
            near mobile equipment and can slow or stop the equipment to prevent contact. Required
            under Ontario mining regulations for specified equipment types.
          </p>
        </div>
        <div style={{ overflowX: 'auto', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Technology</th>
                <th style={tableHeader}>Range</th>
                <th style={tableHeader}>How It Works</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['RFID-based', '1-15 m adjustable', 'Personnel wear active RFID tags. Readers on equipment detect tags and calculate range. Can provide zone-based warnings and stop commands.'],
                ['Magnetic Field', '1-50 m adjustable', 'Low-frequency magnetic field generated by equipment. Personal detectors sense field strength to determine proximity. Works through rock walls.'],
                ['Radar-based', '5-100 m', 'Equipment-mounted radar scans for objects. Can detect untagged personnel and obstacles. Good for surface mining.'],
                ['UWB (Ultra-Wideband)', '0.5-50 m', 'Centimeter-level accuracy. Uses time-of-flight measurement. Good for both PED and general tracking. Newser technology gaining adoption.'],
                ['Camera/LiDAR', '5-50 m', 'Visual or laser-based detection. AI-powered person recognition. Can distinguish people from equipment/walls.'],
              ].map(([tech, range, how], i) => (
                <tr key={i}>
                  <td style={tableCell}><strong>{tech}</strong></td>
                  <td style={tableCellMono}>{range}</td>
                  <td style={tableCell}>{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <pre style={{ ...pre, marginTop: 10 }}>{`Typical PED System Architecture:
==============================================

  [Personnel Tag]     [Personnel Tag]
       |                    |
       |  RF signal         |
       v                    v
  [Antenna/Reader on Vehicle]
       |
  [PED Controller on Vehicle]
       |          |           |
  [Warning   [Slow/Stop   [Data Logger/
   Light]     Interlock]   Telemetry]
       |
  [Central Server] <-- tracks all events
       |
  [Safety Dashboard / Reports]`}</pre>
      </div>

      {/* ---------- Underground Tracking / Tagging ---------- */}
      <div style={cardHL('#22c55e')}>
        <div style={sectionTitle}>Underground Tracking and Tagging</div>
        <div style={bodyText}>
          <p>
            <strong>Personnel and vehicle tracking</strong> is essential for emergency mustering,
            productivity monitoring, and ventilation-on-demand. The system must know who/what is
            in the mine and their approximate location at all times.
          </p>
          <p style={{ marginTop: 6 }}>
            <strong>Technology options:</strong>
          </p>
          <ul style={{ ...bodyText, fontSize: 13, paddingLeft: 20 }}>
            <li><strong>RFID readers at choke points:</strong> Tags detected at fixed reader
              locations (level entrances, refuge stations, headings). Zone-level accuracy. Most
              common and most reliable. Low infrastructure cost.</li>
            <li style={{ marginTop: 4 }}><strong>WiFi-based tracking:</strong> Uses WiFi signal
              strength or time-of-flight from multiple APs to triangulate position. Room-level
              accuracy (5-15m). Requires WiFi infrastructure already in place.</li>
            <li style={{ marginTop: 4 }}><strong>UWB real-time location:</strong> Centimeter to
              meter-level accuracy. Higher infrastructure cost but precise tracking. Good for
              automated equipment and high-value areas.</li>
          </ul>
        </div>
      </div>

      {/* ---------- SCADA for Mine Operations ---------- */}
      <div style={card}>
        <div style={sectionTitle}>SCADA for Mine Ventilation and Dewatering</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={cardHL('#3b82f6')}>
            <div style={subHeading}>Mine Ventilation SCADA</div>
            <div style={{ ...bodyText, fontSize: 13 }}>
              <strong>Monitored:</strong> Main fan speed/status, booster fan operation, door
              positions (open/closed), air velocity at key points, gas levels (CO, NO2, SO2, CH4),
              temperature, humidity, differential pressure across doors and regulators.
            </div>
            <div style={{ ...bodyText, fontSize: 13, marginTop: 4 }}>
              <strong>Controlled:</strong> Fan speed (via VFD), door actuators, regulators,
              ventilation-on-demand (VOD) logic based on vehicle/personnel tracking and gas levels.
            </div>
            <div style={{ ...bodyText, fontSize: 13, marginTop: 4 }}>
              <strong>Communication:</strong> Typically Modbus RTU/TCP or EtherNet/IP from remote
              I/O stations at each fan/door back to central SCADA server via mine fiber network.
              Redundant communication paths required for critical safety systems.
            </div>
          </div>

          <div style={cardHL('#22c55e')}>
            <div style={subHeading}>Mine Dewatering SCADA</div>
            <div style={{ ...bodyText, fontSize: 13 }}>
              <strong>Monitored:</strong> Sump water levels (ultrasonic or pressure transmitters),
              pump running status, pump motor current, discharge pressure, flow rate, pipeline
              pressure, settling pond levels.
            </div>
            <div style={{ ...bodyText, fontSize: 13, marginTop: 4 }}>
              <strong>Controlled:</strong> Pump start/stop (via PLC), pump speed (via VFD for
              variable-speed pumps), valve positions, automatic pump sequencing based on level.
            </div>
            <div style={{ ...bodyText, fontSize: 13, marginTop: 4 }}>
              <strong>Communication:</strong> Remote pump stations often use Modbus RTU over RS-485
              (longer runs) or Modbus TCP/EtherNet/IP where Ethernet is available. Critical pumps
              require redundant communication and local automatic control capability (run on local
              level switch if communication is lost).
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Voice Communication Systems ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Voice Communication Systems</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            {
              system: 'Leaky Feeder Radio',
              desc: 'Traditional VHF/UHF radio over leaky feeder cable. Push-to-talk handheld radios. Group channels and private channels. Most proven and reliable underground voice system.',
              color: '#3b82f6',
            },
            {
              system: 'VoIP / WiFi Phones',
              desc: 'Voice over IP phones connected to mine WiFi network. Integration with surface phone system (PBX). Requires WiFi coverage and sufficient bandwidth. Growing adoption in modern mines.',
              color: '#22c55e',
            },
            {
              system: 'Page / Party Line',
              desc: 'Hardwired page phones at fixed locations (stations, pump rooms, refuge stations). Always available regardless of other system status. Required at specific locations per regulations.',
              color: '#f59e0b',
            },
            {
              system: 'Through-the-Earth (TTE)',
              desc: 'Very low frequency (VLF) communication that penetrates rock. Used for emergency communication when all other systems fail. Limited to text messaging. Required for mine rescue scenarios.',
              color: '#ef4444',
            },
          ].map((v, i) => (
            <div key={i} style={cardHL(v.color)}>
              <div style={subHeading}>{v.system}</div>
              <div style={{ ...bodyText, fontSize: 13 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Refuge Station Requirements ---------- */}
      <div style={cardHL('#ef4444')}>
        <div style={sectionTitle}>Refuge Station Communication - O.Reg. 854</div>
        <div style={bodyText}>
          <p>
            Ontario Regulation 854 (Mines and Mining Plants) sets requirements for refuge stations
            in underground mines. Communication is a critical component.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          <div style={card}>
            <div style={subHeading}>Communication Requirements at Refuge Stations</div>
            <div style={{ ...bodyText, fontSize: 13 }}>
              <ul style={{ paddingLeft: 20 }}>
                <li>Two-way voice communication with surface must be available from each refuge
                  station.</li>
                <li style={{ marginTop: 4 }}>Communication system must be independent of the
                  main mine power supply (battery backup or alternative power source required).</li>
                <li style={{ marginTop: 4 }}>A hardwired telephone (page phone) is typically the
                  baseline, with radio and/or WiFi phone as secondary.</li>
                <li style={{ marginTop: 4 }}>Communication equipment must be tested regularly as
                  part of refuge station inspection procedures.</li>
                <li style={{ marginTop: 4 }}>The system must be operable by trapped miners without
                  specialized training -- simple, clearly labeled controls.</li>
                <li style={{ marginTop: 4 }}>Consider through-the-earth (TTE) text messaging as
                  a backup for scenarios where cable-based and RF systems are damaged.</li>
              </ul>
            </div>
          </div>
          <div style={warnBox}>
            <strong>O.Reg. 854 Reference:</strong> Review Section 17.5 (Underground Refuge Stations)
            and Section 17.2 (Communication Systems) for specific requirements applicable to your
            mine type. Requirements may differ between hardrock and softrock operations. Always
            verify current regulation version with the Ontario Chief Mining Engineer.
          </div>
        </div>
      </div>

      {/* ---------- SCADA Architecture Diagram ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Typical Mine Communication Architecture</div>
        <pre style={pre}>{`Mine Communication Network - Typical Architecture
====================================================

SURFACE:
  [SCADA Server] [Tracking Server] [Phone PBX]
       |               |                |
  =====+=======+=======+=======+========+=========
       |       |       |       |    SURFACE NETWORK
  [Managed] [Safety] [WiFi]  [Radio]
  [Switch ] [System] [Ctrl ] [Base ]
       |               |       |
  =====+=======+=======+=======+==================
                    |
               FIBER TO UNDERGROUND
               (armored, redundant paths)
                    |
UNDERGROUND:  ======+=========+=========+=====
                    |         |         |
  Level 1:    [Managed]  [WiFi AP] [Leaky Feeder]
              [Switch ]      |     [Amplifier   ]
                 |           |         |
              [PLC/IO]  [Tracking]  [Radios]
              [VFD   ]  [Readers ]
              [Meters]
                    |
               FIBER TO NEXT LEVEL
                    |
  Level 2:    [Managed]  [WiFi AP] [Leaky Feeder]
              [Switch ]      |     [Amplifier   ]
                 |           |         |
              [Pumps ]  [PED Tags]  [Page Phones]
              [Fans  ]  [Readers ]  [at stations]
              [Doors ]

  Each level typically has:
    - Managed Ethernet switch (fiber uplink)
    - WiFi access points (fiber or Ethernet to switch)
    - Leaky feeder branch with line amplifier
    - PLC/Remote I/O for local equipment
    - Tracking readers at choke points
    - Page phones at key locations
    - Refuge station with redundant comms`}</pre>
      </div>

      {/* ---------- Communication Standards in Mining ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Communication Standards and Best Practices</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            {
              title: 'Redundancy',
              detail: 'Critical safety communication systems require redundant paths. Use diverse routing (different shafts or boreholes) for fiber backbone. Automatic failover between primary and backup paths. Leaky feeder and WiFi/page phone provide backup to each other.',
            },
            {
              title: 'Power Independence',
              detail: 'Communication systems must operate during power outages. UPS on all network equipment (minimum 4 hours per O.Reg. guidelines). Battery backup for leaky feeder amplifiers. Consider separate emergency power circuits for communication infrastructure.',
            },
            {
              title: 'Hazardous Area Compliance',
              detail: 'Underground equipment may need to be rated for the environment. Check CEC Section 18 requirements for the specific mine. Intrinsically safe (IS) or explosion-proof (XP) equipment in areas with potential combustible dust or gas. WiFi APs and switches must carry appropriate certifications.',
            },
            {
              title: 'Environmental Protection',
              detail: 'Underground conditions are harsh: humidity (near 100%), dust, vibration, corrosive water, temperature extremes. All equipment must be rated IP65/IP67 minimum. Use stainless steel or painted enclosures. Seal all conduit entries. Protect fiber with armored cable or conduit.',
            },
            {
              title: 'Documentation',
              detail: 'Maintain updated network drawings showing all equipment locations, IP addresses, fiber paths, and leaky feeder routes. Record baseline signal levels and network performance. Document all changes. This documentation is critical for troubleshooting and for mine rescue teams.',
            },
          ].map((item, i) => (
            <div key={i} style={card}>
              <div style={subHeading}>{item.title}</div>
              <div style={{ ...bodyText, fontSize: 13 }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Quick Reference: Mining Comm Frequencies ---------- */}
      <div style={card}>
        <div style={sectionTitle}>Mining Communication Frequency Quick Reference</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                <th style={tableHeader}>System</th>
                <th style={tableHeader}>Frequency Range</th>
                <th style={tableHeader}>Underground Behavior</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Through-the-Earth (TTE)', '300 Hz - 9 kHz (VLF)', 'Penetrates hundreds of meters of rock. Very low data rate (text only).'],
                ['Leaky Feeder VHF', '148 - 174 MHz', 'Guided along cable. 350-500m between amplifiers. Most common in Ontario.'],
                ['Leaky Feeder UHF', '450 - 470 MHz', 'Higher loss in cable, shorter amp spacing. Better for data.'],
                ['WiFi 2.4 GHz', '2.400 - 2.483 GHz', 'Good tunnel penetration, limited range around corners (100-200m straight).'],
                ['WiFi 5 GHz', '5.150 - 5.875 GHz', 'More bandwidth, poor penetration, very short range around corners.'],
                ['RFID (LF)', '125 - 134 kHz', 'Short range tracking tags (1-2m). Good penetration through rock/equipment.'],
                ['RFID (UHF)', '860 - 960 MHz', 'Longer range tracking (5-15m). Affected by metal and water.'],
                ['UWB', '3.1 - 10.6 GHz', 'Very precise location. Limited range. Growing adoption for PED/tracking.'],
              ].map(([sys, freq, behavior], i) => (
                <tr key={i}>
                  <td style={tableCell}><strong>{sys}</strong></td>
                  <td style={tableCellMono}>{freq}</td>
                  <td style={tableCell}>{behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */

export default function IndustrialCommsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('serial')

  const renderTab = () => {
    switch (activeTab) {
      case 'serial':
        return <SerialCommsTab />
      case 'ethernet':
        return <IndustrialEthernetTab />
      case 'fiber':
        return <FiberOpticsTab />
      case 'wireless':
        return <WirelessIndustrialTab />
      case 'troubleshoot':
        return <NetworkTroubleshootingTab />
      case 'mining':
        return <MiningCommsTab />
    }
  }

  return (
    <PageWrapper title="Industrial Communications">
      {/* Tab pills */}
      <div style={pillRow}>
        {tabs.map((t) => (
          <button
            key={t.key}
            style={activeTab === t.key ? pillActive : pillBase}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      {renderTab()}
    </PageWrapper>
  )
}
