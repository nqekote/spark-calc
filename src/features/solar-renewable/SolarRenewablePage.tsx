import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/*  Solar & Renewable Energy Reference – Ontario Electrical Apprentice */
/*  CEC Section 64, Ontario-specific data, interactive calculators     */
/* ------------------------------------------------------------------ */

type TabKey = 'pvbasics' | 'cec64' | 'inverters' | 'battery' | 'install'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'pvbasics', label: 'Solar PV' },
  { key: 'cec64', label: 'CEC S.64' },
  { key: 'inverters', label: 'Inverters' },
  { key: 'battery', label: 'Battery' },
  { key: 'install', label: 'Install' },
]

/* ====================== SHARED STYLES ============================= */
/* All styles use inline CSS with CSS variables from the app theme    */

const card: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius)',
  padding: 16,
  marginBottom: 14,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: 'var(--primary)',
  margin: '0 0 10px',
}

const subTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: 'var(--text)',
  margin: '14px 0 8px',
}

const body: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  margin: 0,
}

const mono: React.CSSProperties = {
  fontFamily: 'monospace',
  color: 'var(--primary)',
}

const tblWrap: React.CSSProperties = {
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  marginTop: 8,
}

const tbl: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
}

const th: React.CSSProperties = {
  background: 'rgba(255,215,0,0.1)',
  color: 'var(--primary)',
  padding: '8px 10px',
  textAlign: 'left',
  fontWeight: 600,
  borderBottom: '1px solid var(--divider)',
  whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '7px 10px',
  borderBottom: '1px solid var(--divider)',
  color: 'var(--text-secondary)',
  verticalAlign: 'top',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 'var(--touch-min)',
  padding: '10px 12px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--divider)',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontSize: 16,
  fontFamily: 'monospace',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  color: 'var(--text-secondary)',
  marginBottom: 4,
  fontWeight: 500,
}

const resultBox: React.CSSProperties = {
  background: 'rgba(255,215,0,0.08)',
  border: '1px solid rgba(255,215,0,0.25)',
  borderRadius: 'var(--radius)',
  padding: 14,
  marginTop: 10,
}

const resultLabel: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
  marginBottom: 2,
}

const resultValue: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  fontFamily: 'monospace',
  color: 'var(--primary)',
}

const bulletList: React.CSSProperties = {
  margin: '6px 0',
  paddingLeft: 20,
  color: 'var(--text-secondary)',
  fontSize: 14,
  lineHeight: 1.7,
}

const warnBox: React.CSSProperties = {
  background: 'rgba(255,60,60,0.08)',
  border: '1px solid rgba(255,60,60,0.3)',
  borderRadius: 'var(--radius)',
  padding: 12,
  marginTop: 10,
  fontSize: 13,
  color: '#ff6b6b',
  lineHeight: 1.55,
}

const tipBox: React.CSSProperties = {
  background: 'rgba(34,197,94,0.08)',
  border: '1px solid rgba(34,197,94,0.3)',
  borderRadius: 'var(--radius)',
  padding: 12,
  marginTop: 10,
  fontSize: 13,
  color: '#4ade80',
  lineHeight: 1.55,
}

const codeBox: React.CSSProperties = {
  background: 'rgba(255,215,0,0.06)',
  border: '1px solid var(--divider)',
  borderRadius: 8,
  padding: 12,
  fontFamily: 'monospace',
  fontSize: 13,
  color: 'var(--primary)',
  lineHeight: 1.6,
  overflowX: 'auto',
  margin: '8px 0',
}

/* ================================================================== */
/*  TAB 1 — SOLAR PV BASICS                                          */
/* ================================================================== */

function PVBasicsTab() {
  /* String sizing calculator state */
  const [vocMod, setVocMod] = useState('49.5')
  const [vmpMod, setVmpMod] = useState('41.2')
  const [tempCoeffVoc, setTempCoeffVoc] = useState('-0.27')
  const [tempCoeffVmp, setTempCoeffVmp] = useState('-0.34')
  const [coldTemp, setColdTemp] = useState('-30')
  const [hotTemp, setHotTemp] = useState('50')
  const [invMinV, setInvMinV] = useState('150')
  const [invMaxV, setInvMaxV] = useState('500')

  /* Calculations */
  const vocF = parseFloat(vocMod) || 0
  const vmpF = parseFloat(vmpMod) || 0
  const tcVocF = parseFloat(tempCoeffVoc) || 0
  const tcVmpF = parseFloat(tempCoeffVmp) || 0
  const coldF = parseFloat(coldTemp) || 0
  const hotF = parseFloat(hotTemp) || 0
  const invMinF = parseFloat(invMinV) || 0
  const invMaxF = parseFloat(invMaxV) || 0

  const stcTemp = 25
  const deltaCold = coldF - stcTemp
  const deltaHot = hotF - stcTemp

  const vocCold = vocF * (1 + (tcVocF / 100) * deltaCold)
  const vmpHot = vmpF * (1 + (tcVmpF / 100) * deltaHot)

  const maxModules = invMaxF > 0 && vocCold > 0 ? Math.floor(invMaxF / vocCold) : 0
  const minModules = invMinF > 0 && vmpHot > 0 ? Math.ceil(invMinF / vmpHot) : 0

  return (
    <div>
      {/* How PV Cells Work */}
      <div style={card}>
        <h2 style={sectionTitle}>How Photovoltaic Cells Work</h2>
        <p style={body}>
          A photovoltaic (PV) cell converts sunlight directly into electricity using the
          photovoltaic effect. The cell is made of semiconductor material (typically silicon)
          with two layers:
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>N-type layer (top):</strong> Silicon doped with phosphorus, creating an excess of electrons (negative charge carriers)</li>
          <li><strong style={{ color: 'var(--text)' }}>P-type layer (bottom):</strong> Silicon doped with boron, creating "holes" (positive charge carriers)</li>
          <li><strong style={{ color: 'var(--text)' }}>P-N Junction:</strong> Where the two layers meet, an electric field forms. When photons hit the cell, they knock electrons free, and the electric field pushes them through an external circuit</li>
          <li><strong style={{ color: 'var(--text)' }}>Anti-reflective coating:</strong> Reduces light reflection to increase absorption</li>
          <li><strong style={{ color: 'var(--text)' }}>Metal contacts:</strong> Front grid (thin lines) and rear contact collect current</li>
        </ul>
        <p style={{ ...body, marginTop: 10 }}>
          A single cell produces approximately <span style={mono}>0.5 - 0.6 V DC</span>. Cells are
          connected in series within a module to achieve usable voltage (typically 30-40V for
          a 60-cell module or 37-46V for a 72-cell module).
        </p>
      </div>

      {/* Module vs String vs Array */}
      <div style={card}>
        <h2 style={sectionTitle}>PV System Terminology</h2>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Term</th>
                <th style={th}>Definition</th>
                <th style={th}>Typical Values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...td, color: 'var(--primary)', fontWeight: 600 }}>Cell</td>
                <td style={td}>Smallest PV unit; one semiconductor wafer</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>0.5V, 8-10A</td>
              </tr>
              <tr>
                <td style={{ ...td, color: 'var(--primary)', fontWeight: 600 }}>Module (Panel)</td>
                <td style={td}>Group of cells wired in series, encapsulated in glass/EVA/backsheet with frame and junction box</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>30-50V, 300-600W</td>
              </tr>
              <tr>
                <td style={{ ...td, color: 'var(--primary)', fontWeight: 600 }}>String</td>
                <td style={td}>Modules wired in series to increase voltage to match inverter input window</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>150-600V DC typical</td>
              </tr>
              <tr>
                <td style={{ ...td, color: 'var(--primary)', fontWeight: 600 }}>Array</td>
                <td style={td}>All strings and modules in the complete PV system, including parallel-connected strings</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>1 kW - MW scale</td>
              </tr>
              <tr>
                <td style={{ ...td, color: 'var(--primary)', fontWeight: 600 }}>Combiner Box</td>
                <td style={td}>Enclosure where parallel strings are combined; contains fuses and disconnects</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>2-32 strings</td>
              </tr>
              <tr>
                <td style={{ ...td, color: 'var(--primary)', fontWeight: 600 }}>Inverter</td>
                <td style={td}>Converts DC from array to AC for building loads or grid export</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>3-100+ kW</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mono vs Poly vs Thin Film */}
      <div style={card}>
        <h2 style={sectionTitle}>PV Module Technology Comparison</h2>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Parameter</th>
                <th style={th}>Monocrystalline</th>
                <th style={th}>Polycrystalline</th>
                <th style={th}>Thin-Film (CdTe/CIGS)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Efficiency', '20-24%', '15-20%', '10-13%'],
                ['Appearance', 'Black/dark, uniform', 'Blue, speckled', 'Dark, uniform'],
                ['Temp. Coefficient', '-0.3 to -0.4%/C', '-0.35 to -0.45%/C', '-0.2 to -0.25%/C'],
                ['Cost (per Watt)', 'Highest', 'Moderate', 'Lowest'],
                ['Space Needed (10kW)', '~45 m2', '~55 m2', '~80 m2'],
                ['Lifespan', '25-30+ years', '25-30 years', '20-25 years'],
                ['Low-Light Performance', 'Good', 'Fair', 'Best'],
                ['Degradation Rate', '0.3-0.5%/yr', '0.5-0.7%/yr', '0.5-1.0%/yr'],
                ['Best For', 'Limited roof space', 'Budget installs', 'Large ground mounts'],
                ['Ontario Market Share', '~85%', '~10%', '~5%'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row[0]}</td>
                  <td style={td}>{row[1]}</td>
                  <td style={td}>{row[2]}</td>
                  <td style={td}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={tipBox}>
          <strong>Ontario Trend:</strong> Nearly all new residential and commercial installations
          use monocrystalline PERC or TOPCon modules. Half-cut cell designs (120 or 144 cells)
          are standard, improving shade tolerance and reducing resistive losses.
        </div>
      </div>

      {/* STC and NOCT */}
      <div style={card}>
        <h2 style={sectionTitle}>Standard Test Conditions (STC) &amp; NOCT</h2>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Parameter</th>
                <th style={th}>STC</th>
                <th style={th}>NOCT / NMOT</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Irradiance</td><td style={{ ...td, fontFamily: 'monospace' }}>1000 W/m2</td><td style={{ ...td, fontFamily: 'monospace' }}>800 W/m2</td></tr>
              <tr><td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Cell Temperature</td><td style={{ ...td, fontFamily: 'monospace' }}>25 C</td><td style={{ ...td, fontFamily: 'monospace' }}>~45 C (varies by module)</td></tr>
              <tr><td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Air Mass</td><td style={{ ...td, fontFamily: 'monospace' }}>AM 1.5</td><td style={{ ...td, fontFamily: 'monospace' }}>AM 1.5</td></tr>
              <tr><td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Wind Speed</td><td style={{ ...td, fontFamily: 'monospace' }}>N/A (lab)</td><td style={{ ...td, fontFamily: 'monospace' }}>1 m/s</td></tr>
              <tr><td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Purpose</td><td style={td}>Nameplate rating comparison</td><td style={td}>More realistic field performance</td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ ...body, marginTop: 10 }}>
          Module datasheets always show ratings at STC. Real-world output is typically
          <span style={mono}> 10-20% lower </span> than STC due to higher cell temperatures,
          lower irradiance, soiling, and system losses. NOCT values give a more realistic
          estimate of field performance. The CEC requires calculations to use STC values
          for worst-case voltage and current calculations (cold temperature for Voc, hot
          temperature for Vmp).
        </p>
      </div>

      {/* Temperature Coefficients */}
      <div style={card}>
        <h2 style={sectionTitle}>Temperature Coefficients</h2>
        <p style={body}>
          PV module electrical characteristics change with temperature. Datasheets provide
          three temperature coefficients referenced to STC (25 C):
        </p>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Coefficient</th>
                <th style={th}>Symbol</th>
                <th style={th}>Typical Range</th>
                <th style={th}>Effect</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Temp Coeff of Pmax</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>gamma (%/ C)</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>-0.30 to -0.45</td>
                <td style={td}>Power decreases as temp rises</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Temp Coeff of Voc</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>beta (%/ C)</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>-0.25 to -0.35</td>
                <td style={td}>Voltage increases in cold, decreases in heat</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Temp Coeff of Isc</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>alpha (%/ C)</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>+0.03 to +0.06</td>
                <td style={td}>Current increases slightly in heat</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={codeBox}>
          Adjusted Voc = Voc_STC x [1 + (beta/100) x (T_cell - 25)]<br />
          Adjusted Vmp = Vmp_STC x [1 + (beta_Vmp/100) x (T_cell - 25)]<br /><br />
          Example: Voc = 49.5V, beta = -0.27%/ C, T_cell = -30 C<br />
          Adjusted Voc = 49.5 x [1 + (-0.0027) x (-30 - 25)]<br />
          Adjusted Voc = 49.5 x [1 + (-0.0027 x -55)]<br />
          Adjusted Voc = 49.5 x 1.1485 = 56.85V
        </div>
        <div style={warnBox}>
          <strong>Critical for string sizing:</strong> In Ontario, record cold of -40 C or below
          is possible. Voc INCREASES in cold weather. If you underestimate cold-temperature Voc,
          string voltage can exceed inverter maximum input voltage, destroying the inverter.
          Always use the coldest expected temperature for your region.
        </div>
      </div>

      {/* Ontario Solar Irradiance */}
      <div style={card}>
        <h2 style={sectionTitle}>Ontario Solar Irradiance Data</h2>
        <p style={body}>
          Peak Sun Hours (PSH) represent equivalent hours of 1000 W/m2 irradiance per day.
          Values below are annual averages for south-facing, latitude-tilt installations.
        </p>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Location</th>
                <th style={th}>Annual PSH</th>
                <th style={th}>Best Month</th>
                <th style={th}>Worst Month</th>
                <th style={th}>Design Temp Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Toronto / GTA', '3.6 - 4.0', 'June (5.5)', 'Dec (1.8)', '-25 to +45 C'],
                ['Ottawa', '3.5 - 3.9', 'June (5.4)', 'Dec (1.6)', '-30 to +45 C'],
                ['Sudbury', '3.3 - 3.7', 'June (5.2)', 'Dec (1.4)', '-35 to +45 C'],
                ['Thunder Bay', '3.4 - 3.8', 'June (5.3)', 'Dec (1.3)', '-38 to +45 C'],
                ['Windsor', '3.8 - 4.2', 'June (5.6)', 'Dec (1.9)', '-22 to +48 C'],
                ['Kingston', '3.5 - 3.9', 'June (5.3)', 'Dec (1.7)', '-28 to +45 C'],
                ['Timmins', '3.2 - 3.5', 'June (5.0)', 'Dec (1.2)', '-40 to +42 C'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row[0]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[1]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[2]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[3]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={tipBox}>
          <strong>Resource:</strong> Use NRCan&apos;s PVGIS or RETScreen tool for site-specific
          irradiance data. For CEC compliance, use Environment Canada weather data for
          minimum/maximum ambient temperatures in your design calculations.
        </div>
      </div>

      {/* String Sizing Explanation */}
      <div style={card}>
        <h2 style={sectionTitle}>String Sizing Methodology</h2>
        <p style={body}>
          String sizing determines how many modules to wire in series. The string voltage must
          stay within the inverter&apos;s MPPT voltage window under ALL temperature conditions:
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>Maximum voltage check (cold):</strong> Voc at coldest expected temperature must NOT exceed inverter maximum DC input voltage</li>
          <li><strong style={{ color: 'var(--text)' }}>Minimum voltage check (hot):</strong> Vmp at hottest expected cell temperature must NOT fall below inverter minimum MPPT voltage</li>
          <li><strong style={{ color: 'var(--text)' }}>CEC requirement:</strong> Maximum system voltage must not exceed 600V for residential or 1000V for commercial/utility (CEC Rule 64-060)</li>
        </ul>
        <div style={codeBox}>
          Max modules = floor(Inverter_Vmax / Voc_cold)<br />
          Min modules = ceil(Inverter_MPPT_min / Vmp_hot)<br /><br />
          Valid string size: Min modules &lt;= N &lt;= Max modules
        </div>
      </div>

      {/* Interactive String Sizing Calculator */}
      <div style={card}>
        <h2 style={sectionTitle}>String Sizing Calculator</h2>
        <p style={{ ...body, marginBottom: 12 }}>
          Enter module datasheet values and site temperature range to determine the valid
          number of modules per string for your inverter.
        </p>

        <h3 style={subTitle}>Module Datasheet Values (STC)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Voc (V)</label>
            <input style={inputStyle} type="number" step="0.1" value={vocMod} onChange={e => setVocMod(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Vmp (V)</label>
            <input style={inputStyle} type="number" step="0.1" value={vmpMod} onChange={e => setVmpMod(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Temp Coeff Voc (%/C)</label>
            <input style={inputStyle} type="number" step="0.01" value={tempCoeffVoc} onChange={e => setTempCoeffVoc(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Temp Coeff Vmp (%/C)</label>
            <input style={inputStyle} type="number" step="0.01" value={tempCoeffVmp} onChange={e => setTempCoeffVmp(e.target.value)} />
          </div>
        </div>

        <h3 style={subTitle}>Site Temperature Range</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Min Ambient Temp (C)</label>
            <input style={inputStyle} type="number" step="1" value={coldTemp} onChange={e => setColdTemp(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Max Cell Temp (C)</label>
            <input style={inputStyle} type="number" step="1" value={hotTemp} onChange={e => setHotTemp(e.target.value)} />
          </div>
        </div>

        <h3 style={subTitle}>Inverter Specifications</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Min MPPT Voltage (V)</label>
            <input style={inputStyle} type="number" step="1" value={invMinV} onChange={e => setInvMinV(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Max DC Input Voltage (V)</label>
            <input style={inputStyle} type="number" step="1" value={invMaxV} onChange={e => setInvMaxV(e.target.value)} />
          </div>
        </div>

        {/* Results */}
        <div style={resultBox}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={resultLabel}>Voc at {coldTemp} C (cold)</div>
              <div style={resultValue}>{vocCold.toFixed(2)} V</div>
            </div>
            <div>
              <div style={resultLabel}>Vmp at {hotTemp} C (hot)</div>
              <div style={resultValue}>{vmpHot.toFixed(2)} V</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={resultLabel}>Max Modules per String</div>
              <div style={resultValue}>{maxModules}</div>
            </div>
            <div>
              <div style={resultLabel}>Min Modules per String</div>
              <div style={resultValue}>{minModules}</div>
            </div>
          </div>

          {minModules > 0 && maxModules > 0 && minModules <= maxModules && (
            <div style={{ background: 'rgba(34,197,94,0.1)', borderRadius: 8, padding: 10, marginTop: 8 }}>
              <div style={{ fontSize: 13, color: '#4ade80', fontWeight: 600, marginBottom: 4 }}>
                Valid String Sizes
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 16, color: '#4ade80' }}>
                {Array.from({ length: maxModules - minModules + 1 }, (_, i) => minModules + i).join(', ')} modules
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                String voltage range: {(minModules * vmpHot).toFixed(1)}V (hot) to {(maxModules * vocCold).toFixed(1)}V (cold)
              </div>
            </div>
          )}

          {minModules > maxModules && minModules > 0 && maxModules > 0 && (
            <div style={warnBox}>
              <strong>No valid string size!</strong> The inverter voltage window is too narrow for
              this module and temperature range. Consider a different inverter or module.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  TAB 2 — CEC SECTION 64 (PV SYSTEMS)                              */
/* ================================================================== */

function CEC64Tab() {
  return (
    <div>
      {/* Disconnecting Means */}
      <div style={card}>
        <h2 style={sectionTitle}>Disconnecting Means (Rule 64-058)</h2>
        <p style={body}>
          CEC Section 64 requires specific disconnecting means for photovoltaic systems.
          These requirements ensure safe isolation for maintenance, emergency response,
          and firefighter safety.
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>PV Source Circuit Disconnect:</strong> Required for each source circuit (string). Must disconnect all ungrounded conductors simultaneously. Rated for maximum circuit voltage and current.</li>
          <li><strong style={{ color: 'var(--text)' }}>PV Output Circuit Disconnect:</strong> Required between array and inverter. Must be accessible, lockable in the open position, and rated for DC duty.</li>
          <li><strong style={{ color: 'var(--text)' }}>Inverter AC Disconnect:</strong> Required between inverter and panelboard/grid connection point. Must be visible and accessible to utility workers.</li>
          <li><strong style={{ color: 'var(--text)' }}>Equipment Disconnect:</strong> Each inverter, charge controller, and battery system requires its own disconnect means.</li>
          <li><strong style={{ color: 'var(--text)' }}>Grouping:</strong> Disconnects must be grouped where practical (Rule 64-058(3)). Maximum 6 operations to disconnect all sources.</li>
        </ul>
        <div style={warnBox}>
          <strong>DC Switch Rating:</strong> Standard AC switches and breakers must NOT be used for
          DC PV circuits. DC switches must be specifically rated for DC voltage and DC current
          interrupting capacity. DC arcs do not have zero-crossing like AC, making them harder
          to extinguish.
        </div>
      </div>

      {/* Overcurrent Protection */}
      <div style={card}>
        <h2 style={sectionTitle}>Overcurrent Protection (Rules 64-062, 64-064)</h2>
        <p style={body}>
          PV systems require overcurrent protection to prevent backfeed from parallel strings
          and to protect conductors from fault currents.
        </p>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Requirement</th>
                <th style={th}>CEC Rule</th>
                <th style={th}>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Series String Fuses</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>64-064</td>
                <td style={td}>Required when 3 or more strings are paralleled. Fuse rating not less than 1.56 x Isc of string, not more than module max series fuse rating on datasheet.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Combiner Box Fuses</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>64-064</td>
                <td style={td}>Touch-safe fuse holders rated for DC. Must be accessible for replacement. Fuses must be rated for DC voltage of the string (not AC voltage).</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>2-String Systems</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>64-064(2)</td>
                <td style={td}>String fuses NOT required when only 2 strings are paralleled, provided conductors are rated for the Isc of the other string.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>Inverter Input OCP</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>64-062</td>
                <td style={td}>DC breaker or fused disconnect between combiner and inverter. Sized for combined output of all parallel strings x 1.25.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>AC Breaker Size</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>64-062</td>
                <td style={td}>Inverter output breaker: rated at 1.25 x inverter max continuous output current. Must be at load end of panel (120% rule for backfeed).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={codeBox}>
          String Fuse Rating:<br />
          Min = Isc x 1.56 (= 1.25 x 1.25)<br />
          Max = Module max series fuse rating (from datasheet)<br /><br />
          Example: Isc = 10.5A, Max series fuse = 20A<br />
          Min fuse = 10.5 x 1.56 = 16.38A → use 18A or 20A<br />
          Verify: 20A &lt;= 20A datasheet max → OK
        </div>
      </div>

      {/* Grounding and Bonding */}
      <div style={card}>
        <h2 style={sectionTitle}>Grounding &amp; Bonding (Rules 64-060, 64-068, 10-400)</h2>
        <p style={body}>
          Proper grounding and bonding of PV systems protects against shock hazards, lightning
          damage, and ensures proper operation of ground fault protection devices.
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>Equipment Grounding:</strong> All exposed non-current-carrying metal parts must be bonded: module frames, racking, combiner boxes, inverter enclosures, junction boxes, conduit.</li>
          <li><strong style={{ color: 'var(--text)' }}>Grounding Electrode:</strong> PV array must be connected to grounding electrode system per Rule 10-700. Separate grounding electrode for array allowed but must be bonded to building electrode system.</li>
          <li><strong style={{ color: 'var(--text)' }}>Equipment Grounding Conductor (EGC):</strong> Sized per Table 16, based on OCP device rating. Must be run with circuit conductors. Copper or listed copper-clad aluminum.</li>
          <li><strong style={{ color: 'var(--text)' }}>Module Bonding:</strong> Use listed lay-in lugs, WEEB clips, or listed grounding clips at each module-to-rail connection. Anodized aluminum frames require star washers or rated connectors that penetrate the oxide layer.</li>
          <li><strong style={{ color: 'var(--text)' }}>Ungrounded Systems:</strong> Most modern inverters use transformerless (ungrounded/non-isolated) topology. CEC Rule 64-060 permits ungrounded PV arrays when used with listed equipment incorporating ground fault protection.</li>
        </ul>
        <div style={tipBox}>
          <strong>Ontario Practice:</strong> Most residential string inverters are now transformerless
          (ungrounded DC bus). The EGC still bonds all metal parts. The DC conductors are both
          "ungrounded" (neither positive nor negative is bonded to the grounding system).
        </div>
      </div>

      {/* Rapid Shutdown */}
      <div style={card}>
        <h2 style={sectionTitle}>Rapid Shutdown Requirements</h2>
        <p style={body}>
          Rapid shutdown systems reduce DC voltage on the roof to safe levels for firefighter
          access. While NEC 2017+ mandates module-level shutdown, the CEC approach differs:
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>CEC 2024 (Section 64):</strong> PV systems must have a readily accessible disconnect means that de-energizes all PV conductors in or on a building. Rapid shutdown initiated within 10 seconds of activating the disconnect.</li>
          <li><strong style={{ color: 'var(--text)' }}>Array Boundary:</strong> Conductors within the array boundary must be reduced to 80V or less within 30 seconds of rapid shutdown initiation.</li>
          <li><strong style={{ color: 'var(--text)' }}>Outside Array Boundary:</strong> Conductors leaving the array boundary (e.g., rooftop conduit runs to inverter) must be reduced to 30V within 30 seconds.</li>
          <li><strong style={{ color: 'var(--text)' }}>Compliance Methods:</strong> Module-level power electronics (MLPEs) like microinverters or DC power optimizers inherently meet rapid shutdown. String inverters may require additional rapid shutdown devices.</li>
          <li><strong style={{ color: 'var(--text)' }}>Initiation:</strong> Rapid shutdown must be initiated by the PV system disconnect, the service disconnect, or a listed rapid shutdown switch mounted near the service entrance.</li>
        </ul>
        <div style={warnBox}>
          <strong>Firefighter Safety:</strong> Even after rapid shutdown, modules still produce
          voltage when exposed to light. Individual modules can produce up to 50-80V DC in
          sunlight. Only module-level shutdown (MLPEs) can reduce voltage at each module.
          Educate fire departments about your installation.
        </div>
      </div>

      {/* Wire Sizing DC */}
      <div style={card}>
        <h2 style={sectionTitle}>DC Wire Sizing (Rules 64-060, 64-062)</h2>
        <p style={body}>
          PV DC circuit conductors must be sized for continuous duty. The CEC treats PV as
          a continuous load, requiring 125% multiplier applied twice (for continuous duty and
          for OCP coordination), resulting in the 156% factor.
        </p>
        <div style={codeBox}>
          Minimum Ampacity = Isc x 1.56<br /><br />
          Where: 1.56 = 1.25 (continuous load) x 1.25 (OCP coordination)<br />
          Isc = Short-circuit current from module datasheet (STC)<br /><br />
          Example: Module Isc = 10.50A<br />
          Min ampacity = 10.50 x 1.56 = 16.38A<br />
          Select conductor from Table 19: #12 AWG RW90 = 20A → OK
        </div>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Wire Type</th>
                <th style={th}>Voltage Rating</th>
                <th style={th}>Temp Rating</th>
                <th style={th}>Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>PV Wire (RPVU)</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>600V or 1000V</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>90 C wet</td>
                <td style={td}>Exposed outdoor runs, module-to-module, module-to-combiner. Sunlight resistant, direct burial rated.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>USE-2</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>600V</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>90 C wet</td>
                <td style={td}>Underground service entrance. Can be used for PV exposed outdoor wiring.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>RW90 / RWU90</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>600V</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>90 C</td>
                <td style={td}>In conduit runs from array to inverter. Standard building wire. Must be in raceway when used in building.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>TECK90</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>600V or 1000V</td>
                <td style={{ ...td, fontFamily: 'monospace' }}>90 C</td>
                <td style={td}>Armored cable for exposed runs. Good for commercial rooftop. Provides physical protection without conduit.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={tipBox}>
          <strong>Conduit Fill for PV:</strong> PV DC circuits in conduit follow standard CEC
          Table D16 for conduit fill. Derate ampacity per Table 5C when more than 3 current-carrying
          conductors in a raceway. Each PV string has 2 current-carrying conductors (+ and -).
          The EGC is NOT counted for derating but IS counted for conduit fill.
        </div>
      </div>

      {/* Labeling and Signage */}
      <div style={card}>
        <h2 style={sectionTitle}>Labeling &amp; Signage (Rule 64-058, 64-060)</h2>
        <p style={body}>
          PV installations require specific labels to warn of hazards and identify system
          components. All labels must be durable, weather-resistant, and maintained legible
          for the life of the system.
        </p>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Location</th>
                <th style={th}>Required Label Content</th>
                <th style={th}>CEC Rule</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Main Service Panel', 'WARNING: DUAL POWER SOURCE - SOLAR PV SYSTEM. Do not work on this panel without disconnecting PV source.', '64-058(5)'],
                ['PV Disconnect', 'SOLAR PV SYSTEM DISCONNECT. Rated voltage and current.', '64-058'],
                ['Inverter', 'PV system rating (kW), operating voltage, max current', '64-058'],
                ['Combiner Box', 'WARNING: MULTIPLE SOURCES. Fuse ratings, string count, max voltage', '64-064'],
                ['Conduit (DC)', 'WARNING: PHOTOVOLTAIC POWER SOURCE (red label or red marking at all accessible points)', '64-060'],
                ['Meter Base', 'WARNING: DUAL POWER SOURCE. Solar PV system installed at this address.', '64-058(5)'],
                ['Rapid Shutdown Initiation', 'RAPID SHUTDOWN SWITCH FOR SOLAR PV SYSTEM', '64-058'],
                ['Point of Interconnection', 'Maximum output: [kW]. Interconnection type: [net metering/FIT]', '64-058'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row[0]}</td>
                  <td style={td}>{row[1]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Working Space */}
      <div style={card}>
        <h2 style={sectionTitle}>Working Space Requirements (Rule 2-308)</h2>
        <p style={body}>
          PV equipment such as inverters, disconnects, and combiner boxes require adequate
          working space per CEC Rule 2-308, the same as any other electrical equipment:
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>Depth:</strong> Minimum 1.0 m (3.3 ft) clear space in front of equipment for voltages up to 750V</li>
          <li><strong style={{ color: 'var(--text)' }}>Width:</strong> Minimum 750 mm (30 in) or width of equipment, whichever is greater</li>
          <li><strong style={{ color: 'var(--text)' }}>Height:</strong> Minimum 2.0 m (6.6 ft) headroom</li>
          <li><strong style={{ color: 'var(--text)' }}>Illumination:</strong> Adequate lighting required at all switchgear and panel locations</li>
          <li><strong style={{ color: 'var(--text)' }}>Access:</strong> No storage permitted in required working space</li>
        </ul>
      </div>

      {/* Arc Fault Protection */}
      <div style={card}>
        <h2 style={sectionTitle}>DC Arc Fault Protection (AFCI)</h2>
        <p style={body}>
          DC arc faults in PV systems are a significant fire hazard. Unlike AC arcs, DC arcs
          are sustained (no zero-crossing) and can generate extreme heat, especially at
          loose connections or damaged conductors.
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>CEC Requirement:</strong> PV systems on buildings must include listed DC arc-fault circuit protection. This can be integrated into the inverter or provided as a separate device.</li>
          <li><strong style={{ color: 'var(--text)' }}>Detection Methods:</strong> Monitors DC current waveform for high-frequency noise signatures characteristic of arcing. Advanced systems use machine learning algorithms.</li>
          <li><strong style={{ color: 'var(--text)' }}>Response:</strong> On detecting an arc fault, the system must de-energize the faulted circuit within 2.5 seconds. Most inverters will shut down and display a fault code.</li>
          <li><strong style={{ color: 'var(--text)' }}>Common Causes of DC Arcs:</strong> Damaged MC4 connectors, loose terminal connections, rodent damage to wire insulation, mechanical damage to conductors under racking, corroded junction box terminals.</li>
          <li><strong style={{ color: 'var(--text)' }}>Prevention:</strong> Proper torque on all connections, use listed MC4 connectors (no mixing brands), secure all conductors with UV-rated cable ties, inspect for damage during commissioning.</li>
        </ul>
        <div style={warnBox}>
          <strong>Field Safety:</strong> A series DC arc fault can occur at any point in the
          string. Parallel arc faults occur between positive and negative or positive/negative
          and ground. Both types generate temperatures exceeding 3000 C (5400 F) and can ignite
          roofing materials within seconds.
        </div>
      </div>

      {/* CEC Section 64 Quick Reference */}
      <div style={card}>
        <h2 style={sectionTitle}>CEC Section 64 Quick Reference Summary</h2>
        <p style={body}>
          Key rules from CEC Section 64 that every PV installer must know. Always refer to the
          current edition of the Canadian Electrical Code for the complete and authoritative text.
        </p>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Rule</th>
                <th style={th}>Subject</th>
                <th style={th}>Key Requirement</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['64-050', 'Scope', 'Applies to all solar PV systems, including standalone, grid-interactive, and hybrid systems. Covers DC and AC portions of PV installation.'],
                ['64-052', 'Component Listing', 'All PV system components must be listed (certified) by an accredited testing laboratory (CSA, UL, ETL). No field-assembled or unlisted equipment.'],
                ['64-054', 'Installation', 'PV systems must be installed per manufacturer instructions and CEC requirements. Qualified persons only.'],
                ['64-056', 'Maximum Voltage', 'PV source and output circuits: max 600V for dwelling units, 1000V for other occupancies. Voltage calculated at lowest expected ambient temperature.'],
                ['64-058', 'Disconnecting Means', 'Required for PV output, each inverter, and at point of connection. Lockable open. Grouped at readily accessible location. Max 6 motions to disconnect all sources.'],
                ['64-060', 'Wiring Methods', 'PV source circuits: PV wire, USE-2, or conductors in approved raceway. DC conductors must be identified (red for positive per convention). All PV DC raceways and cables marked with WARNING labels.'],
                ['64-062', 'Overcurrent Protection', 'Required for PV output circuits and inverter output circuits. Sized for continuous duty (125% of max current). AC breaker at load end of bus for backfeed (120% rule).'],
                ['64-064', 'Series Fusing', 'Required when 3+ strings paralleled. Fuse rating: min 1.56 x Isc, max = module series fuse rating. Touch-safe DC fuse holders required.'],
                ['64-066', 'Grounding', 'Equipment grounding per Section 10. All exposed metal parts bonded. Grounding electrode conductor sized per Table 16. Array bonded to building ground system.'],
                ['64-068', 'Ground Fault Protection', 'Required for grounded DC systems. Must detect ground fault, interrupt fault current, and indicate fault condition. Ungrounded systems exempt if using listed equipment with built-in GFP.'],
                ['64-070', 'Arc Fault Protection', 'DC AFCI required for PV systems on or in buildings. Must detect and interrupt series and parallel arc faults. Can be inverter-integrated or standalone device.'],
                ['64-072', 'Rapid Shutdown', 'Systems on buildings must have rapid shutdown. Initiation at readily accessible location. Array boundary: 80V within 30s. Outside boundary: 30V within 30s.'],
                ['64-074', 'Bipolar Systems', 'Additional requirements for systems exceeding 600V using bipolar configurations. Requires listed bipolar modules and equipment.'],
                ['64-076', 'Connection to Other Sources', 'PV systems connected to utility must meet anti-islanding and interconnection standards (CSA C22.2 No. 107.1 / IEEE 1547).'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{row[0]}</td>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{row[1]}</td>
                  <td style={td}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={tipBox}>
          <strong>ESA Inspections:</strong> The Electrical Safety Authority (ESA) inspects all PV
          installations in Ontario. Common inspection checkpoints: proper disconnecting means
          at all required locations, correct labeling, wire sizing verification (156% Isc factor),
          rapid shutdown function test, grounding/bonding continuity, and proper conduit fill. Have
          your commissioning report, equipment listings, and manufacturer instructions available
          for the inspector. ESA Notification of Work must be filed before starting installation.
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  TAB 3 — INVERTERS & GRID-TIE                                     */
/* ================================================================== */

function InvertersTab() {
  /* System sizing calculator state */
  const [roofArea, setRoofArea] = useState('50')
  const [tilt, setTilt] = useState('30')
  const [azimuth, setAzimuth] = useState('180')
  const [moduleWatts, setModuleWatts] = useState('400')
  const [moduleArea, setModuleArea] = useState('1.92')
  const [psh, setPsh] = useState('3.8')
  const [derateFactor, setDerateFactor] = useState('0.82')

  const roofF = parseFloat(roofArea) || 0
  const moduleWF = parseFloat(moduleWatts) || 0
  const moduleAF = parseFloat(moduleArea) || 0
  const pshF = parseFloat(psh) || 0
  const derateF = parseFloat(derateFactor) || 0

  /* Tilt/azimuth adjustment factor */
  const tiltF = parseFloat(tilt) || 0
  const azimuthF = parseFloat(azimuth) || 0
  const optimalTilt = 42 /* approx latitude tilt for southern Ontario */
  const tiltLoss = 1 - Math.abs(tiltF - optimalTilt) * 0.004
  const azimuthLoss = 1 - Math.abs(azimuthF - 180) * 0.002
  const orientFactor = Math.max(0.5, Math.min(1, tiltLoss * azimuthLoss))

  const numModules = moduleAF > 0 ? Math.floor(roofF / moduleAF) : 0
  const systemKw = (numModules * moduleWF) / 1000
  const annualKwh = systemKw * pshF * 365 * derateF * orientFactor

  return (
    <div>
      {/* Inverter Comparison */}
      <div style={card}>
        <h2 style={sectionTitle}>Inverter Technology Comparison</h2>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Feature</th>
                <th style={th}>String Inverter</th>
                <th style={th}>Microinverter</th>
                <th style={th}>Power Optimizer + String Inv</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Location', 'Wall-mounted (garage/basement)', 'Behind each module', 'Optimizer at module, inverter on wall'],
                ['DC/AC Conversion', 'Central (one inverter)', 'At each module', 'Optimizer conditions DC, inverter converts'],
                ['MPPT', 'Per string (1-2 MPPT inputs)', 'Per module', 'Per module (via optimizer)'],
                ['Typical Efficiency', '96-98%', '95-97%', '97-99% (combined)'],
                ['Shade Tolerance', 'Poor (weakest module limits string)', 'Excellent (module-level)', 'Very good (module-level)'],
                ['Monitoring', 'String-level', 'Module-level', 'Module-level'],
                ['Rapid Shutdown', 'Requires add-on devices', 'Inherent compliance', 'Inherent compliance'],
                ['Cost (installed)', 'Lowest', 'Highest', 'Middle'],
                ['Warranty', '10-15 years (extendable)', '25 years typical', '25 year optimizer, 12 year inverter'],
                ['Typical Brands', 'Fronius, SMA, Canadian Solar', 'Enphase IQ7/IQ8', 'SolarEdge + P-series optimizers'],
                ['Best For', 'Unshaded, uniform arrays', 'Complex roofs, shading', 'Mixed conditions, monitoring needs'],
                ['Ontario Market', '~30% residential', '~40% residential', '~30% residential'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row[0]}</td>
                  <td style={td}>{row[1]}</td>
                  <td style={td}>{row[2]}</td>
                  <td style={td}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid-Tie Requirements */}
      <div style={card}>
        <h2 style={sectionTitle}>Grid-Tie Requirements (CSA C22.2 No. 107.1)</h2>
        <p style={body}>
          All grid-connected inverters in Canada must be listed to CSA C22.2 No. 107.1
          (General Use Power Supplies) or UL 1741 with Canadian certification. This standard
          ensures safe operation when connected to the utility grid.
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>Voltage &amp; Frequency Limits:</strong> Inverter must disconnect within specified time if grid voltage or frequency goes outside normal range (typically 106-132V for 120V nominal, 59.3-60.5 Hz)</li>
          <li><strong style={{ color: 'var(--text)' }}>Reconnection:</strong> After grid returns to normal, inverter must wait a minimum of 5 minutes (300 seconds) before reconnecting and ramping up power</li>
          <li><strong style={{ color: 'var(--text)' }}>Power Quality:</strong> Total harmonic distortion (THD) must be less than 5% at rated output. Individual harmonics limited per IEEE 519.</li>
          <li><strong style={{ color: 'var(--text)' }}>DC Injection:</strong> DC current injected into AC grid must not exceed 0.5% of rated inverter output current</li>
          <li><strong style={{ color: 'var(--text)' }}>Certification Mark:</strong> Look for CSA, cUL, or cETL mark on inverter nameplate. No uncertified inverters may be connected to the Ontario grid.</li>
        </ul>
      </div>

      {/* Anti-Islanding */}
      <div style={card}>
        <h2 style={sectionTitle}>Anti-Islanding Protection</h2>
        <p style={body}>
          Islanding occurs when a PV system continues to energize a section of the utility
          grid after the utility has disconnected. This creates a severe safety hazard for
          line workers who expect de-energized lines.
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>Passive Methods:</strong> Monitor voltage and frequency for anomalies. Under/over voltage protection (OVP/UVP) and under/over frequency protection (OFP/UFP) detect most islanding conditions.</li>
          <li><strong style={{ color: 'var(--text)' }}>Active Methods:</strong> Inverter deliberately introduces small perturbations (frequency shift, impedance measurement) to detect if utility is present. If grid is absent, perturbation grows rapidly and triggers shutdown.</li>
          <li><strong style={{ color: 'var(--text)' }}>Detection Time:</strong> Must detect and cease energizing within 2 seconds of utility loss (CSA C22.2 No. 107.1 / IEEE 1547)</li>
          <li><strong style={{ color: 'var(--text)' }}>Testing:</strong> Anti-islanding is factory-tested as part of inverter certification. Field verification confirms proper protection settings are enabled.</li>
        </ul>
        <div style={warnBox}>
          <strong>Worker Safety:</strong> Never assume a PV system is de-energized just because the
          grid is down. The inverter may have failed to detect the outage, or there may be stored
          energy in the DC system. Always follow lockout/tagout procedures and verify absence
          of voltage on both AC and DC sides.
        </div>
      </div>

      {/* Power Factor */}
      <div style={card}>
        <h2 style={sectionTitle}>Power Factor &amp; Utility Interconnection</h2>
        <p style={body}>
          Ontario utilities (Hydro One, Toronto Hydro, local distribution companies) have
          specific requirements for PV system interconnection:
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>Power Factor:</strong> Grid-tied inverters must operate at unity power factor (PF = 1.0) or within 0.95 leading to 0.95 lagging. Modern smart inverters can provide reactive power support when required by the utility.</li>
          <li><strong style={{ color: 'var(--text)' }}>Voltage Regulation:</strong> PV system must not cause voltage at the point of common coupling (PCC) to exceed the utility service voltage range (+/- 5% of nominal).</li>
          <li><strong style={{ color: 'var(--text)' }}>Connection Type:</strong> Residential systems up to 10 kW typically connect at 240V single-phase. Commercial systems over 10 kW may require three-phase connection. Systems over 500 kW require utility impact assessment.</li>
          <li><strong style={{ color: 'var(--text)' }}>Metering:</strong> Bidirectional meter required for net metering. Utility installs a revenue-grade meter at their cost for net metering agreements.</li>
        </ul>
      </div>

      {/* Net Metering Ontario */}
      <div style={card}>
        <h2 style={sectionTitle}>Net Metering in Ontario</h2>
        <p style={body}>
          Ontario&apos;s Net Metering program allows customers to generate electricity for their
          own use and receive credits for surplus energy exported to the grid.
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>Eligibility:</strong> Available to all rate classes. System must be 500 kW or less and primarily for the customer&apos;s own use.</li>
          <li><strong style={{ color: 'var(--text)' }}>How Credits Work:</strong> Surplus energy exported to the grid generates kWh credits on your bill. Credits offset future electricity consumption (not delivery, regulatory, or debt retirement charges). Credits roll forward for up to 12 months.</li>
          <li><strong style={{ color: 'var(--text)' }}>Annual Settlement:</strong> At the 12-month anniversary, any remaining credits are paid out at the wholesale market price (HOEP), which is significantly lower than the retail rate. This is why oversizing is discouraged.</li>
          <li><strong style={{ color: 'var(--text)' }}>Connection Process:</strong> (1) Apply to LDC for connection authorization. (2) Install system per ESA requirements. (3) ESA inspection and approval. (4) LDC installs bidirectional meter. (5) Execute net metering agreement with LDC.</li>
          <li><strong style={{ color: 'var(--text)' }}>ESA Notification:</strong> Electrical Safety Authority must be notified. The installer files a Notification of Work. ESA inspection is required before system energization.</li>
        </ul>
        <div style={tipBox}>
          <strong>Sizing Tip:</strong> For maximum financial benefit under net metering, size the
          system to cover approximately 90-100% of annual electricity consumption. Do NOT oversize,
          as surplus credits at year-end are settled at the low wholesale rate (~2-4 cents/kWh)
          rather than the retail rate you offset (~12-18 cents/kWh).
        </div>
      </div>

      {/* System Sizing Calculator */}
      <div style={card}>
        <h2 style={sectionTitle}>System Sizing Calculator</h2>
        <p style={{ ...body, marginBottom: 12 }}>
          Estimate PV system size and annual production based on available roof area and site
          conditions. Uses Ontario-specific solar resource data.
        </p>

        <h3 style={subTitle}>Roof / Array Parameters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Available Roof Area (m2)</label>
            <input style={inputStyle} type="number" step="1" value={roofArea} onChange={e => setRoofArea(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Roof Tilt (degrees)</label>
            <input style={inputStyle} type="number" step="1" value={tilt} onChange={e => setTilt(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Azimuth (180 = due south)</label>
            <input style={inputStyle} type="number" step="1" value={azimuth} onChange={e => setAzimuth(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Peak Sun Hours (daily avg)</label>
            <input style={inputStyle} type="number" step="0.1" value={psh} onChange={e => setPsh(e.target.value)} />
          </div>
        </div>

        <h3 style={subTitle}>Module &amp; System Parameters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Module Wattage (W)</label>
            <input style={inputStyle} type="number" step="5" value={moduleWatts} onChange={e => setModuleWatts(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Module Area (m2)</label>
            <input style={inputStyle} type="number" step="0.01" value={moduleArea} onChange={e => setModuleArea(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>System Derate Factor</label>
            <input style={inputStyle} type="number" step="0.01" value={derateFactor} onChange={e => setDerateFactor(e.target.value)} />
          </div>
        </div>

        <div style={resultBox}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={resultLabel}>Modules That Fit</div>
              <div style={resultValue}>{numModules}</div>
            </div>
            <div>
              <div style={resultLabel}>System Size (DC)</div>
              <div style={resultValue}>{systemKw.toFixed(2)} kW</div>
            </div>
            <div>
              <div style={resultLabel}>Orientation Factor</div>
              <div style={resultValue}>{(orientFactor * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div style={resultLabel}>Est. Annual Production</div>
              <div style={resultValue}>{annualKwh.toFixed(0)} kWh</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10 }}>
            Derate factor accounts for inverter efficiency, wiring losses, soiling, snow, module
            mismatch, and degradation. Typical value: 0.78-0.85 for Ontario.
          </div>
        </div>
      </div>

      {/* Common Inverter Faults */}
      <div style={card}>
        <h2 style={sectionTitle}>Common Inverter Faults &amp; Troubleshooting</h2>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Fault Code / Condition</th>
                <th style={th}>Likely Cause</th>
                <th style={th}>Troubleshooting Steps</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Isolation Fault / Ground Fault', 'Damaged conductor insulation, water in junction box, pinched wire under racking', 'Measure insulation resistance between each conductor and ground. Disconnect strings one at a time to isolate. Inspect JBs, connectors, and conduit entries for moisture.'],
                ['DC Over-Voltage', 'String Voc exceeds inverter max (cold weather), too many modules in string', 'Verify string Voc at current temperature. Count modules per string. Recalculate with coldest expected temperature.'],
                ['DC Under-Voltage', 'Blown string fuse, disconnected MC4, module failure, heavy shading', 'Check DC voltage at combiner and each string. Inspect fuses. Check MC4 connections. Look for broken module bypass diode.'],
                ['Arc Fault (AFCI Trip)', 'Loose connection, damaged wire, deteriorated MC4, cracked connector', 'Inspect all DC connections for damage, discoloration, heat marks. Check MC4 connector engagement (click test). Verify torque on all terminals.'],
                ['Grid Voltage / Frequency Fault', 'Utility voltage out of range, transformer tap setting, poor grid connection', 'Measure voltage at PCC. Compare to utility nominal. Check for loose neutral connections. Verify inverter voltage/frequency trip settings match utility requirements.'],
                ['Over-Temperature', 'Poor ventilation, direct sun on inverter, ambient temp too high', 'Verify adequate clearance around inverter. Add shade structure if in direct sun. Check ventilation fans (if equipped). Clean air filters.'],
                ['Communication Error', 'Lost WiFi, gateway failure, monitoring hardware fault', 'Power cycle monitoring gateway. Check WiFi signal strength. Verify network settings. Update firmware if available.'],
                ['AC Overcurrent', 'Undersized AC breaker, inverter output exceeds breaker rating', 'Verify AC breaker matches inverter output. Check for harmonics or power factor issues. Inspect AC wiring connections.'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: '#ff6b6b', whiteSpace: 'nowrap' }}>{row[0]}</td>
                  <td style={td}>{row[1]}</td>
                  <td style={td}>{row[2]}</td>
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
/*  TAB 4 — BATTERY STORAGE (ESS)                                    */
/* ================================================================== */

function BatteryTab() {
  /* Battery sizing calculator */
  const [dailyKwh, setDailyKwh] = useState('30')
  const [backupHrs, setBackupHrs] = useState('8')
  const [avgLoadKw, setAvgLoadKw] = useState('3.5')
  const [dod, setDod] = useState('90')
  const [roundTrip, setRoundTrip] = useState('90')

  const backupF = parseFloat(backupHrs) || 0
  const avgLoadF = parseFloat(avgLoadKw) || 0
  const dodF = (parseFloat(dod) || 90) / 100
  const rtF = (parseFloat(roundTrip) || 90) / 100

  const energyNeeded = avgLoadF * backupF
  const batteryCapacity = dodF > 0 && rtF > 0 ? energyNeeded / (dodF * rtF) : 0
  const powerwallEquiv = batteryCapacity > 0 ? Math.ceil(batteryCapacity / 13.5) : 0

  return (
    <div>
      {/* ESS Overview */}
      <div style={card}>
        <h2 style={sectionTitle}>Energy Storage Systems (ESS) Overview</h2>
        <p style={body}>
          Battery energy storage systems are increasingly paired with solar PV in Ontario
          to provide backup power, load shifting, and self-consumption optimization. The
          electrician&apos;s role includes installation, wiring, commissioning, and understanding
          the CEC requirements specific to ESS.
        </p>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Battery Chemistry</th>
                <th style={th}>Energy Density</th>
                <th style={th}>Cycle Life</th>
                <th style={th}>Round-Trip Eff.</th>
                <th style={th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Lithium Iron Phosphate (LFP)', '90-160 Wh/kg', '4000-10000', '92-98%', 'Safest Li-ion, longest life, most common for residential ESS'],
                ['Lithium NMC', '150-220 Wh/kg', '1000-3000', '90-95%', 'Higher energy density but higher thermal runaway risk'],
                ['Lead-Acid (AGM)', '30-50 Wh/kg', '300-700', '80-85%', 'Legacy technology, low cost, low depth of discharge (50%)'],
                ['Saltwater (Sodium-ion)', '30-60 Wh/kg', '3000+', '80-88%', 'Non-toxic, recyclable, heavy and bulky'],
                ['Flow Battery (Vanadium)', '15-35 Wh/L', '10000+', '65-80%', 'Commercial/utility scale, long duration storage'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row[0]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[1]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[2]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[3]}</td>
                  <td style={td}>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AC-coupled vs DC-coupled */}
      <div style={card}>
        <h2 style={sectionTitle}>AC-Coupled vs DC-Coupled Systems</h2>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Feature</th>
                <th style={th}>AC-Coupled</th>
                <th style={th}>DC-Coupled</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Architecture', 'PV inverter + separate battery inverter, connected on AC bus', 'PV and battery share a single hybrid inverter, connected on DC bus'],
                ['PV Inverter', 'Standard grid-tie inverter (existing or new)', 'Hybrid inverter with MPPT and battery charge controller built in'],
                ['Conversion Steps (PV to Battery)', 'PV DC→AC (PV inverter) → AC→DC (battery inverter) = 2 conversions', 'PV DC→DC (charge controller) = 1 conversion'],
                ['Efficiency (PV to Battery)', '85-90% (double conversion loss)', '95-98% (single conversion)'],
                ['Retrofit Suitability', 'Excellent - add battery to existing PV system', 'Poor - requires replacing existing PV inverter'],
                ['New Install', 'Good for modular approach', 'Best for new installs (simpler, more efficient)'],
                ['Backup Capability', 'Both inverters needed for backup operation', 'Single inverter handles backup'],
                ['Cost', 'Higher (two inverters)', 'Lower (single hybrid inverter)'],
                ['Example Products', 'Enphase IQ Battery, Tesla Powerwall, Sonnen', 'SolarEdge Energy Hub, Sol-Ark, Victron MultiPlus'],
                ['CEC Wiring', 'Separate AC circuits for PV inverter and battery inverter', 'DC wiring from PV to hybrid inverter includes battery branch'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row[0]}</td>
                  <td style={td}>{row[1]}</td>
                  <td style={td}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CEC ESS Requirements */}
      <div style={card}>
        <h2 style={sectionTitle}>CEC Requirements for ESS (Section 64, Rule 64-900 series)</h2>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>Disconnecting Means:</strong> Each battery system requires a disconnect means that opens all ungrounded conductors simultaneously. Must be lockable and accessible. Disconnect must be located between the battery and all other equipment.</li>
          <li><strong style={{ color: 'var(--text)' }}>Overcurrent Protection:</strong> Battery circuit conductors must be protected by OCP devices rated for the maximum discharge current. Battery short-circuit current can be extremely high (thousands of amps from lithium cells).</li>
          <li><strong style={{ color: 'var(--text)' }}>Wire Sizing:</strong> Size conductors for maximum charge/discharge current x 1.25 for continuous duty. Use temperature rating appropriate for battery room environment.</li>
          <li><strong style={{ color: 'var(--text)' }}>Ventilation:</strong> Battery rooms or enclosures must have adequate ventilation per manufacturer requirements. Lithium batteries produce less off-gassing than lead-acid but still require ventilation for thermal management.</li>
          <li><strong style={{ color: 'var(--text)' }}>Working Space:</strong> Minimum working clearances per Rule 2-308 apply. Additional clearances may be required by manufacturer for thermal management.</li>
          <li><strong style={{ color: 'var(--text)' }}>Signage:</strong> Battery locations must be labeled with: battery type, nominal voltage, maximum current, and emergency procedures. Signage must be visible to emergency responders.</li>
          <li><strong style={{ color: 'var(--text)' }}>Listings:</strong> ESS equipment must be listed to UL 9540 (Energy Storage Systems) or equivalent CSA standard. Individual battery modules listed to UL 1973.</li>
          <li><strong style={{ color: 'var(--text)' }}>Ground Fault Protection:</strong> Required for battery systems. Must detect and indicate ground faults. Some systems require automatic disconnection on ground fault detection.</li>
        </ul>
      </div>

      {/* Battery Sizing Calculator */}
      <div style={card}>
        <h2 style={sectionTitle}>Battery Sizing Calculator</h2>
        <p style={{ ...body, marginBottom: 12 }}>
          Determine the battery capacity needed based on backup duration and average load.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Daily Energy Use (kWh)</label>
            <input style={inputStyle} type="number" step="1" value={dailyKwh} onChange={e => setDailyKwh(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Backup Duration (hours)</label>
            <input style={inputStyle} type="number" step="1" value={backupHrs} onChange={e => setBackupHrs(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Average Load During Backup (kW)</label>
            <input style={inputStyle} type="number" step="0.1" value={avgLoadKw} onChange={e => setAvgLoadKw(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Depth of Discharge (%)</label>
            <input style={inputStyle} type="number" step="1" value={dod} onChange={e => setDod(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Round-Trip Efficiency (%)</label>
            <input style={inputStyle} type="number" step="1" value={roundTrip} onChange={e => setRoundTrip(e.target.value)} />
          </div>
        </div>

        <div style={resultBox}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={resultLabel}>Energy Needed</div>
              <div style={resultValue}>{energyNeeded.toFixed(1)} kWh</div>
            </div>
            <div>
              <div style={resultLabel}>Required Battery Capacity</div>
              <div style={resultValue}>{batteryCapacity.toFixed(1)} kWh</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={resultLabel}>Equivalent Tesla Powerwalls (13.5 kWh each)</div>
            <div style={resultValue}>{powerwallEquiv}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10 }}>
            Capacity accounts for depth of discharge and round-trip efficiency losses.
            Actual sizing should also consider peak surge requirements (motor starting, etc.)
            and battery power rating (kW) in addition to energy capacity (kWh).
          </div>
        </div>
      </div>

      {/* Common Residential Systems */}
      <div style={card}>
        <h2 style={sectionTitle}>Common Residential ESS Products</h2>
        <div style={tblWrap}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Product</th>
                <th style={th}>Capacity</th>
                <th style={th}>Power</th>
                <th style={th}>Chemistry</th>
                <th style={th}>Coupling</th>
                <th style={th}>Warranty</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Tesla Powerwall 3', '13.5 kWh', '11.5 kW cont.', 'LFP', 'DC-coupled', '10 yr'],
                ['Enphase IQ 5P', '5 kWh', '3.84 kW', 'LFP', 'AC-coupled', '15 yr'],
                ['SolarEdge Home Battery', '9.7 kWh', '5 kW', 'LFP', 'DC-coupled', '10 yr'],
                ['Sonnen ecoLinx', '12-20 kWh', '8 kW', 'LFP', 'AC-coupled', '10 yr'],
                ['Generac PWRcell', '9-18 kWh', '9 kW', 'NMC', 'DC-coupled', '10 yr'],
                ['BYD Battery-Box', '5.1-12.8 kWh', '5.1 kW', 'LFP', 'DC-coupled', '10 yr'],
                ['Franklin WH aPower', '13.6 kWh', '10 kW', 'LFP', 'AC + DC', '12 yr'],
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row[0]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[1]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[2]}</td>
                  <td style={td}>{row[3]}</td>
                  <td style={td}>{row[4]}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{row[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety */}
      <div style={card}>
        <h2 style={sectionTitle}>Battery Safety: Thermal Runaway &amp; Fire Suppression</h2>
        <p style={body}>
          Lithium-ion battery thermal runaway is a cascading exothermic reaction that can
          lead to fire, explosion, and release of toxic gases. Understanding this hazard is
          critical for safe ESS installation and maintenance.
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: '#ff6b6b' }}>Thermal Runaway Stages:</strong> (1) Internal short circuit or overcharge causes cell heating above 80 C. (2) SEI layer decomposes at 120 C, releasing flammable gases. (3) Separator melts at 130-150 C causing larger internal short. (4) Cathode decomposition at 180+ C releases oxygen, sustaining fire. (5) Cascading failure to adjacent cells.</li>
          <li><strong style={{ color: '#ff6b6b' }}>Toxic Gases Released:</strong> Hydrogen fluoride (HF), carbon monoxide (CO), hydrogen cyanide (HCN), sulfur dioxide (SO2). SCBA required for any battery fire response.</li>
          <li><strong style={{ color: '#ff6b6b' }}>Fire Suppression:</strong> Water is the recommended suppression agent for lithium-ion fires (provides cooling). Do NOT use dry chemical or CO2 as primary suppression. Large quantities of water needed to cool cells below thermal runaway threshold.</li>
          <li><strong style={{ color: 'var(--text)' }}>Prevention Measures:</strong> Install BMS (Battery Management System) that monitors cell voltage, temperature, and current. Never exceed manufacturer charge/discharge ratings. Maintain proper ventilation and clearances. Avoid physical damage during installation.</li>
          <li><strong style={{ color: 'var(--text)' }}>Installation Location:</strong> Do not install in living spaces. Preferred locations: garage, utility room, or outdoor (weather-rated enclosure). Maintain clearance from combustible materials. Provide fire-rated separation where required by building code.</li>
        </ul>
        <div style={warnBox}>
          <strong>Emergency Response:</strong> If a battery is making unusual noises (hissing,
          popping), emitting smoke or unusual odours, or the enclosure is abnormally hot —
          evacuate the area immediately and call 911. Do NOT attempt to disconnect or fight
          the fire without proper PPE including SCBA.
        </div>
      </div>

      {/* Integration */}
      <div style={card}>
        <h2 style={sectionTitle}>ESS Integration with Solar PV &amp; Grid</h2>
        <p style={body}>
          A fully integrated system combines PV generation, battery storage, and grid
          connection with intelligent energy management:
        </p>
        <ul style={bulletList}>
          <li><strong style={{ color: 'var(--text)' }}>Self-Consumption Mode:</strong> PV charges battery during the day, battery discharges to loads in evening. Grid supplements only when needed. Maximizes self-consumption ratio.</li>
          <li><strong style={{ color: 'var(--text)' }}>Backup / Islanding Mode:</strong> During grid outage, inverter disconnects from grid and forms a microgrid using PV + battery. Critical loads panel feeds only essential circuits. Automatic transfer switch (ATS) or built-in transfer mechanism manages the transition.</li>
          <li><strong style={{ color: 'var(--text)' }}>Time-of-Use Optimization:</strong> In Ontario, TOU rates have off-peak, mid-peak, and on-peak pricing. Battery charges during off-peak and discharges during on-peak to reduce costs.</li>
          <li><strong style={{ color: 'var(--text)' }}>Critical Loads Panel:</strong> A separate sub-panel for circuits that need backup power (fridge, lighting, well pump, communications). Sized based on battery power output rating. Connected to inverter backup output.</li>
          <li><strong style={{ color: 'var(--text)' }}>Wiring Considerations:</strong> AC-coupled systems require separate circuit from battery inverter to critical loads panel. DC-coupled hybrid inverters integrate backup output. Transfer mechanism must meet CEC anti-islanding requirements.</li>
        </ul>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  TAB 5 — INSTALLATION                                              */
/* ================================================================== */

function InstallTab() {
  const [expandedSection, setExpandedSection] = useState<string | null>('roof')

  const toggle = (key: string) => {
    setExpandedSection(prev => prev === key ? null : key)
  }

  const sectionBtn = (key: string, label: string) => (
    <button
      onClick={() => toggle(key)}
      style={{
        width: '100%',
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: expandedSection === key ? 'rgba(255,215,0,0.08)' : 'var(--surface)',
        border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)',
        color: expandedSection === key ? 'var(--primary)' : 'var(--text)',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        marginBottom: 8,
      }}
    >
      {label}
      <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: expandedSection === key ? 'rotate(180deg)' : 'none' }}>
        {expandedSection === key ? '−' : '+'}
      </span>
    </button>
  )

  return (
    <div>
      {/* Roof Mounting */}
      {sectionBtn('roof', 'Roof Mounting Systems')}
      {expandedSection === 'roof' && (
        <div style={card}>
          <h2 style={sectionTitle}>Roof Mount: Rail Systems, Flashing &amp; Structural</h2>
          <ul style={bulletList}>
            <li><strong style={{ color: 'var(--text)' }}>Rail Systems:</strong> Aluminum rails attach to roof rafters via L-feet or standoff mounts. Rails run perpendicular to rafters, modules clamp to rails. Common brands: IronRidge, Unirac, SnapNrack. Rail spacing determined by module frame mounting hole pattern and wind/snow loads.</li>
            <li><strong style={{ color: 'var(--text)' }}>Flashing Types:</strong> (1) Comp shingle: aluminum flashing slides under shingle, lag bolt into rafter, sealed with roofing sealant. (2) Standing seam metal: S-5! clamps grip seam without penetration. (3) Flat/membrane: ballasted racking or adhesive mount to avoid penetrations.</li>
            <li><strong style={{ color: 'var(--text)' }}>Structural Considerations:</strong> Verify roof can support additional dead load of 2.5-4 PSF (12-20 kg/m2). Check rafter size, spacing, span. Older homes may need structural engineer assessment. Snow load + PV weight must not exceed roof design capacity.</li>
            <li><strong style={{ color: 'var(--text)' }}>Ontario Snow Loads:</strong> Ground snow loads range from 1.0 kPa (southern Ontario) to 3.5+ kPa (northern Ontario). Roof snow load factor depends on slope, exposure, and importance category. Arrays must withstand snow sliding and accumulation.</li>
            <li><strong style={{ color: 'var(--text)' }}>Lag Bolt Specs:</strong> Typical 5/16" x 4" stainless steel lag into rafter center. Minimum 1.5" thread engagement in rafter. Pre-drill pilot hole. Apply sealant under flashing base. Torque to manufacturer specification.</li>
            <li><strong style={{ color: 'var(--text)' }}>Setbacks:</strong> Maintain clearances from roof edges, ridges, valleys, and vents as required by local building code and fire code. Typically 18" (450mm) from ridge for firefighter access, 36" (900mm) pathway on one side for access.</li>
          </ul>
        </div>
      )}

      {/* Ground Mount */}
      {sectionBtn('ground', 'Ground Mount Systems')}
      {expandedSection === 'ground' && (
        <div style={card}>
          <h2 style={sectionTitle}>Ground Mount Systems</h2>
          <ul style={bulletList}>
            <li><strong style={{ color: 'var(--text)' }}>Foundation Types:</strong> (1) Driven piles (ground screws or I-beams) — most common, fast install, no concrete. (2) Concrete piers/footings — for rocky ground or high load requirements. (3) Ballasted ground mount — no ground penetration, weighted with concrete blocks.</li>
            <li><strong style={{ color: 'var(--text)' }}>Racking:</strong> Fixed-tilt racking angled at latitude (Ontario: 42-48 degrees) facing due south. Single-axis trackers increase production 15-25% but add complexity and cost. Rows spaced to minimize inter-row shading (typically 2-3x module height).</li>
            <li><strong style={{ color: 'var(--text)' }}>Underground Wiring:</strong> PV wire or USE-2 rated for direct burial, or conductors in schedule 40 PVC conduit. Burial depth per CEC Table 53: minimum 600mm for direct burial cable, 450mm for rigid conduit. Sand bedding recommended for direct burial.</li>
            <li><strong style={{ color: 'var(--text)' }}>Grounding:</strong> Ground mount racking must be bonded to grounding electrode. Driven ground rod at array location bonded back to building grounding system. Ground rod resistance should be 25 ohms or less.</li>
            <li><strong style={{ color: 'var(--text)' }}>Permits:</strong> Ground mounts may require building permit (structure), electrical permit (ESA), and site plan approval. Check zoning bylaws for setback from property lines. Agricultural properties may have specific rules.</li>
            <li><strong style={{ color: 'var(--text)' }}>Vegetation Management:</strong> Maintain clear area under and around array. Gravel, landscape fabric, or regular mowing. Shade from growing vegetation is a common cause of underperformance in ground mounts.</li>
          </ul>
        </div>
      )}

      {/* Electrical Connections */}
      {sectionBtn('electrical', 'Electrical Connections')}
      {expandedSection === 'electrical' && (
        <div style={card}>
          <h2 style={sectionTitle}>Electrical Connections</h2>
          <h3 style={subTitle}>MC4 Connectors</h3>
          <ul style={bulletList}>
            <li>MC4 (Multi-Contact 4mm) is the industry standard PV connector. Male and female connectors lock together with an audible click. IP67 rated (waterproof).</li>
            <li><strong style={{ color: '#ff6b6b' }}>NEVER mix connector brands.</strong> MC4 connectors from different manufacturers (Staubli, Amphenol, Renogy, etc.) may look similar but have different tolerances. Cross-brand connections are a leading cause of DC arc faults and fires.</li>
            <li>Crimping tool required: use manufacturer-specified crimp die. Strip wire 8-10mm. Crimp, then pull-test (minimum 40N / 9 lbs). Insert into connector housing until click.</li>
            <li>To disconnect MC4: use MC4 disconnect tool (spanners). Never pry apart with screwdrivers. Disconnect under load only if absolutely necessary — DC arcs are dangerous.</li>
          </ul>
          <h3 style={subTitle}>Junction Boxes</h3>
          <ul style={bulletList}>
            <li>Module junction boxes (J-boxes) contain bypass diodes and wire terminations. Located on the back of each module.</li>
            <li>External junction boxes may be used for string home-runs or transitions from PV wire to building wire. Must be rated for outdoor use (NEMA 3R minimum for outdoor, 4X for coastal).</li>
            <li>All connections in J-boxes must use listed terminal blocks or wire nuts rated for the conductor size and current. Torque to specification.</li>
          </ul>
          <h3 style={subTitle}>Combiner Boxes</h3>
          <ul style={bulletList}>
            <li>Combine multiple parallel strings into a single output circuit. Contains string fuses (when required), disconnect switch, and monitoring CTs (optional).</li>
            <li>Rated for maximum system voltage (string Voc x temperature correction) and combined string current. NEMA 4X enclosure for outdoor installation.</li>
            <li>Strain relief required for all cable entries. Use PV-rated cable glands for MC4 cable entries. Conduit connection for output circuit.</li>
          </ul>
        </div>
      )}

      {/* Conduit and Wire Management */}
      {sectionBtn('conduit', 'Conduit Runs & Wire Management')}
      {expandedSection === 'conduit' && (
        <div style={card}>
          <h2 style={sectionTitle}>Conduit Runs &amp; Wire Management</h2>
          <ul style={bulletList}>
            <li><strong style={{ color: 'var(--text)' }}>Rooftop Conduit:</strong> EMT or rigid PVC (Schedule 40 or 80) for runs from array to building penetration. Support every 1.5m (5ft) for EMT, 1.0m (3ft) for PVC. Use UV-rated straps. Conduit bodies at direction changes over 90 degrees cumulative.</li>
            <li><strong style={{ color: 'var(--text)' }}>Building Penetration:</strong> Seal all roof and wall penetrations with appropriate flashing and sealant. Use a junction box at the transition point. Maintain fire separation ratings at all penetrations through fire-rated assemblies.</li>
            <li><strong style={{ color: 'var(--text)' }}>Wire Management on Array:</strong> PV wire from modules secured to racking with UV-rated cable ties or wire clips. Maintain minimum bend radius (10x cable diameter for PV wire). Keep wires away from roof surface to prevent heat damage and allow airflow.</li>
            <li><strong style={{ color: 'var(--text)' }}>Drip Loops:</strong> Form drip loops on all wire runs before entering conduit or enclosures to prevent water intrusion. Loops should be below the entry point.</li>
            <li><strong style={{ color: 'var(--text)' }}>Expansion Joints:</strong> On long conduit runs, provide expansion fittings for thermal expansion. PVC expands significantly: approximately 3.5mm per metre per 50 C temperature change.</li>
            <li><strong style={{ color: 'var(--text)' }}>Conductor Identification:</strong> DC positive = red, DC negative = black (or marked), EGC = green or bare. Label all conductors at both ends with permanent markers or label tape. Identify string numbers at combiner box.</li>
          </ul>
        </div>
      )}

      {/* Commissioning */}
      {sectionBtn('commission', 'Commissioning & Testing')}
      {expandedSection === 'commission' && (
        <div style={card}>
          <h2 style={sectionTitle}>Commissioning Procedures &amp; Testing</h2>
          <p style={body}>
            A systematic commissioning process verifies that the PV system is installed correctly
            and operates safely before energization. Document all test results.
          </p>
          <div style={tblWrap}>
            <table style={tbl}>
              <thead>
                <tr>
                  <th style={th}>Step</th>
                  <th style={th}>Test / Action</th>
                  <th style={th}>Expected Result</th>
                  <th style={th}>Instrument</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1', 'Visual inspection of all components', 'No damage, proper labeling, correct wiring', 'Eyes, checklist'],
                  ['2', 'Verify all disconnects are OPEN', 'All circuits de-energized', 'Visual'],
                  ['3', 'Measure string Voc (each string)', 'Within expected range for temp', 'DC voltmeter (CAT III)'],
                  ['4', 'Verify string polarity', 'Positive and negative correct', 'DC voltmeter'],
                  ['5', 'Measure string Isc (each string)', 'Within 5% of expected for irradiance', 'DC clamp meter'],
                  ['6', 'Insulation resistance test', '>1 M-ohm (500V DC megger)', 'Insulation tester / megger'],
                  ['7', 'Continuity test of EGC', '<1 ohm end to end', 'Low-ohm meter'],
                  ['8', 'Verify grounding electrode bond', 'Continuous path to electrode', 'Low-ohm meter'],
                  ['9', 'Energize inverter', 'Successful startup, no fault codes', 'Inverter display'],
                  ['10', 'Verify AC output voltage and frequency', '240V +/- 5%, 60 Hz +/- 0.5', 'AC voltmeter, freq meter'],
                  ['11', 'Verify production (irradiance-corrected)', 'Within 90% of expected', 'Inverter monitoring'],
                  ['12', 'Test rapid shutdown', 'DC voltage drops per requirements', 'DC voltmeter, timer'],
                  ['13', 'Test GFCI / ground fault detection', 'Inverter detects simulated fault', 'Per manufacturer procedure'],
                  ['14', 'Document and photograph', 'Complete commissioning report', 'Camera, forms'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...td, fontFamily: 'monospace', textAlign: 'center' }}>{row[0]}</td>
                    <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row[1]}</td>
                    <td style={td}>{row[2]}</td>
                    <td style={td}>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Common Mistakes */}
      {sectionBtn('mistakes', 'Common Installation Mistakes')}
      {expandedSection === 'mistakes' && (
        <div style={card}>
          <h2 style={sectionTitle}>Common Installation Mistakes</h2>
          <div style={tblWrap}>
            <table style={tbl}>
              <thead>
                <tr>
                  <th style={th}>Mistake</th>
                  <th style={th}>Consequence</th>
                  <th style={th}>Prevention</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Mixing MC4 connector brands', 'Increased contact resistance, overheating, DC arc fault, fire', 'Use single brand throughout. Verify compatibility. Inspect all factory pre-terminated leads.'],
                  ['Insufficient torque on terminals', 'Loose connections develop resistance, overheat, arc fault', 'Use calibrated torque wrench/driver. Follow manufacturer specs. Document torque values.'],
                  ['Wrong string size (too many modules)', 'Cold-weather Voc exceeds inverter max, destroys inverter', 'Always calculate Voc at coldest expected temperature. Leave safety margin.'],
                  ['Non-DC-rated switch on DC circuit', 'Switch fails to interrupt DC arc, fire hazard', 'Verify all DC switches/breakers are DC-rated for the system voltage.'],
                  ['No rapid shutdown compliance', 'Code violation, firefighter safety risk', 'Use MLPEs or install listed rapid shutdown devices. Test at commissioning.'],
                  ['Improper roof penetration sealing', 'Water leak, roof damage, interior damage', 'Use manufacturer flashing kits. Apply sealant properly. Install in dry conditions.'],
                  ['Undersized conductors', 'Overheating, fire, code violation, voltage drop', 'Apply 156% factor to Isc. Derate for conduit fill and temperature. Check voltage drop.'],
                  ['Reversed polarity on strings', 'Inverter damage, blown fuses, potential fire', 'Verify polarity of every string before paralleling. Use consistent color coding.'],
                  ['Missing or incorrect labels', 'ESA inspection failure, safety hazard for responders', 'Install all required labels before ESA inspection. Use durable UV-rated labels.'],
                  ['No expansion fittings in conduit', 'Conduit pulls apart at joints, exposed conductors', 'Install expansion fittings per code on all long runs exposed to temperature variation.'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...td, fontWeight: 600, color: '#ff6b6b' }}>{row[0]}</td>
                    <td style={td}>{row[1]}</td>
                    <td style={td}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance Schedule */}
      {sectionBtn('maintenance', 'Maintenance Schedule')}
      {expandedSection === 'maintenance' && (
        <div style={card}>
          <h2 style={sectionTitle}>PV System Maintenance Schedule</h2>
          <div style={tblWrap}>
            <table style={tbl}>
              <thead>
                <tr>
                  <th style={th}>Frequency</th>
                  <th style={th}>Task</th>
                  <th style={th}>Details</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Monthly', 'Monitor production', 'Compare actual vs expected production via monitoring portal. Investigate drops over 10%.'],
                  ['Quarterly', 'Visual inspection from ground', 'Look for cracked modules, debris, bird nesting, visible damage, vegetation growth near ground mounts.'],
                  ['Semi-Annual', 'Clean modules (if needed)', 'Ontario usually gets adequate rainfall. Clean only if soiling is visible. Use soft brush and deionized water. Never use abrasive cleaners or pressure washers.'],
                  ['Annual', 'Infrared thermography scan', 'Use IR camera to scan array during peak production. Hot spots indicate failing cells, loose connections, or bypass diode issues.'],
                  ['Annual', 'Electrical inspection', 'Check all accessible connections for tightness and corrosion. Inspect conduit and wiring for damage. Verify grounding continuity. Check combiner box fuses.'],
                  ['Annual', 'Inverter inspection', 'Check for error codes/history. Clean air filters (if equipped). Verify ventilation. Check for moisture intrusion. Record firmware version.'],
                  ['Annual', 'Verify rapid shutdown', 'Test rapid shutdown function per commissioning procedure. Verify response time meets requirements.'],
                  ['5 Years', 'Full re-commissioning', 'Repeat all commissioning tests. Insulation resistance, string Voc/Isc, ground fault test. Update documentation.'],
                  ['As Needed', 'Snow removal', 'Generally not recommended (risk of module damage). If required, use soft foam tools only. Never use metal shovels or salt.'],
                  ['As Needed', 'Storm damage assessment', 'After severe weather, inspect for hail damage, wind uplift, fallen debris. Document and file insurance claim if needed.'],
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...td, fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{row[0]}</td>
                    <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row[1]}</td>
                    <td style={td}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tools Needed */}
      {sectionBtn('tools', 'Tools for PV Installation')}
      {expandedSection === 'tools' && (
        <div style={card}>
          <h2 style={sectionTitle}>Tools Needed for PV Installation</h2>

          <h3 style={subTitle}>Electrical Tools</h3>
          <ul style={bulletList}>
            <li>Digital multimeter (CAT III 600V minimum, DC voltage and current)</li>
            <li>DC clamp meter (for Isc measurement without breaking circuit)</li>
            <li>Insulation resistance tester / Megger (500V or 1000V DC)</li>
            <li>MC4 crimping tool (manufacturer-specific die set)</li>
            <li>MC4 disconnect tool / assembly spanners</li>
            <li>Wire strippers (10-14 AWG for PV wire)</li>
            <li>Cable cutters (for PV wire and copper conductors)</li>
            <li>Torque wrench (small, for terminal connections)</li>
            <li>Torque screwdriver (for MC4 and terminal blocks)</li>
            <li>Fish tape or pull string (for conduit runs)</li>
            <li>Conduit bender (EMT, 1/2" to 1")</li>
            <li>Label maker (Brother P-touch or similar, UV-rated tape)</li>
          </ul>

          <h3 style={subTitle}>Structural / Roofing Tools</h3>
          <ul style={bulletList}>
            <li>Impact driver with socket adapter (for lag bolts)</li>
            <li>Drill with 3/16" pilot bit (for lag bolt holes)</li>
            <li>Stud finder (for locating rafters from attic or through sheathing)</li>
            <li>Chalk line (for rail alignment)</li>
            <li>Speed square and torpedo level</li>
            <li>Tape measure (minimum 25 ft / 7.5m)</li>
            <li>Roofing sealant and caulk gun</li>
            <li>Tin snips (for flashing modification)</li>
            <li>Socket set (for racking hardware, typically 1/2" and 9/16")</li>
            <li>Module mid-clamps and end-clamps (sized for module frame)</li>
          </ul>

          <h3 style={subTitle}>Safety Equipment</h3>
          <ul style={bulletList}>
            <li>Fall protection harness (rated for worker weight + tools)</li>
            <li>Roof anchor or ridge hook (temporary or permanent)</li>
            <li>Self-retracting lifeline (SRL) or rope grab system</li>
            <li>Hard hat (Type 1 Class E minimum)</li>
            <li>Safety glasses (ANSI Z87.1)</li>
            <li>Electrically rated gloves (Class 00 for DC work up to 500V)</li>
            <li>Arc flash PPE (for AC work at service panel, based on incident energy analysis)</li>
            <li>Non-slip roofing shoes or boots</li>
            <li>Ladder (rated for weight, proper angle, secured at top)</li>
            <li>First aid kit and emergency contact information</li>
          </ul>

          <h3 style={subTitle}>Test &amp; Documentation</h3>
          <ul style={bulletList}>
            <li>Solar irradiance meter / pyranometer (for performance verification)</li>
            <li>IR camera or thermal imager (for hot spot detection)</li>
            <li>Camera / phone (for documentation and as-built photos)</li>
            <li>Commissioning forms and checklists</li>
            <li>Manufacturer installation manuals (for all equipment)</li>
            <li>CEC codebook (current edition)</li>
            <li>ESA Notification of Work forms</li>
          </ul>

          <h3 style={subTitle}>Ontario Apprentice Tips</h3>
          <ul style={bulletList}>
            <li><strong style={{ color: 'var(--text)' }}>WHMIS:</strong> Know the SDS for all chemicals used on site including roofing sealants, flux, and battery electrolytes. PV wire insulation can release toxic fumes if burned during an arc fault event.</li>
            <li><strong style={{ color: 'var(--text)' }}>Working at Heights:</strong> Ontario requires mandatory Working at Heights training (minimum one-day course from approved provider) before performing any rooftop PV work. Certificate valid for 3 years. Must be carried on site.</li>
            <li><strong style={{ color: 'var(--text)' }}>Scope of Work:</strong> As an electrical apprentice, you work under the supervision of a licensed electrician (309A or 442A). PV installation is within the scope of construction and maintenance electricians. Roofing work (flashing, shingles) may require a licensed roofer depending on the contractor and municipality.</li>
            <li><strong style={{ color: 'var(--text)' }}>ESA Requirements:</strong> Only licensed electrical contractors (ECRA/ESA licence) can perform electrical work and pull permits. Ensure your employer holds the appropriate licence. The master electrician on the licence is responsible for code compliance.</li>
            <li><strong style={{ color: 'var(--text)' }}>Documentation Habit:</strong> Take photos at every stage of installation, especially before covering connections or closing enclosures. Photograph all labels, nameplate data, and test results. This protects you, your employer, and the customer.</li>
            <li><strong style={{ color: 'var(--text)' }}>Continuing Education:</strong> The solar industry evolves quickly. Stay current with CEC code cycle updates (published every 3 years), new module and inverter technologies, and changes to Ontario net metering policies. Many manufacturers offer free online training and certification programs that count toward continuing education hours.</li>
          </ul>
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function SolarRenewablePage() {
  const nav = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('pvbasics')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '18px 16px 10px',
        borderBottom: '1px solid var(--divider)',
        background: 'var(--surface)',
      }}>
        <button
          onClick={() => nav(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: 22,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          Solar &amp; Renewable Energy
        </h1>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        gap: 4,
        padding: '10px 12px 6px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--divider)',
      }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              minHeight: 42,
              padding: '8px 14px',
              borderRadius: 20,
              border: activeTab === t.key ? '1.5px solid var(--primary)' : '1px solid var(--divider)',
              background: activeTab === t.key ? 'rgba(255,215,0,0.12)' : 'transparent',
              color: activeTab === t.key ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === t.key ? 700 : 500,
              fontSize: 13,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '14px 12px' }}>
        {activeTab === 'pvbasics' && <PVBasicsTab />}
        {activeTab === 'cec64' && <CEC64Tab />}
        {activeTab === 'inverters' && <InvertersTab />}
        {activeTab === 'battery' && <BatteryTab />}
        {activeTab === 'install' && <InstallTab />}
      </div>
    </div>
  )
}
