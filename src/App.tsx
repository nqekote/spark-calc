import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './core/theme/ThemeContext'
import AppShell from './layout/AppShell'
import HomePage from './layout/HomePage'
import CategoryPage, { type CalcItem } from './layout/CategoryPage'

// Lazy-loaded calculator pages
const OhmsLawPage = React.lazy(() => import('./features/ohms-law/OhmsLawPage'))
const PowerCalcPage = React.lazy(() => import('./features/power-calc/PowerCalcPage'))
const VoltageDropPage = React.lazy(() => import('./features/voltage-drop/VoltageDropPage'))
const PowerFactorPage = React.lazy(() => import('./features/power-factor/PowerFactorPage'))
const BendingPage = React.lazy(() => import('./features/conduit-bending/BendingPage'))
const ConduitFillPage = React.lazy(() => import('./features/conduit-fill/ConduitFillPage'))
const AmpacityPage = React.lazy(() => import('./features/ampacity/AmpacityPage'))
const WireSizingPage = React.lazy(() => import('./features/wire-sizing/WireSizingPage'))
const TransformerOCPPage = React.lazy(() => import('./features/overcurrent-transformer/TransformerOCPPage'))
const FeederOCPPage = React.lazy(() => import('./features/overcurrent-feeder/FeederOCPPage'))
const MotorFLCPage = React.lazy(() => import('./features/motor-flc/MotorFLCPage'))
const MotorBranchPage = React.lazy(() => import('./features/motor-branch/MotorBranchPage'))
const MotorOCPPage = React.lazy(() => import('./features/overcurrent-motor/MotorOCPPage'))
const BoxFillPage = React.lazy(() => import('./features/box-fill/BoxFillPage'))
const ResidentialDemandPage = React.lazy(() => import('./features/residential-demand/ResidentialDemandPage'))
const CECReferencePage = React.lazy(() => import('./features/cec-reference/CECReferencePage'))
const MaterialListPage = React.lazy(() => import('./features/material-list/MaterialListPage'))

// New reference & utility pages
const RacewaySpacingPage = React.lazy(() => import('./features/raceway-spacing/RacewaySpacingPage'))
const GroundingConductorPage = React.lazy(() => import('./features/grounding-conductor/GroundingConductorPage'))
const GfciAfciPage = React.lazy(() => import('./features/gfci-afci/GfciAfciPage'))
const UnitConverterPage = React.lazy(() => import('./features/unit-converter/UnitConverterPage'))
const BurialDepthsPage = React.lazy(() => import('./features/burial-depths/BurialDepthsPage'))
const TorqueSpecsPage = React.lazy(() => import('./features/torque-specs/TorqueSpecsPage'))

// Mining-specific pages
const MiningSafetyPage = React.lazy(() => import('./features/mining-safety/MiningSafetyPage'))
const HazardousAreasPage = React.lazy(() => import('./features/hazardous-areas/HazardousAreasPage'))
const CableTrayPage = React.lazy(() => import('./features/cable-tray/CableTrayPage'))
const MinePowerPage = React.lazy(() => import('./features/mine-power/MinePowerPage'))

// Category items
const electricalItems: CalcItem[] = [
  { to: '/electrical/ohms-law', title: "Ohm's Law", subtitle: 'Voltage, current & resistance', icon: '\u03A9' },
  { to: '/electrical/power', title: 'Power Calculator', subtitle: 'Watts, VA & power formulas', icon: '\u26A1' },
  { to: '/electrical/voltage-drop', title: 'Voltage Drop', subtitle: 'Wire length & voltage loss', icon: '\u2193' },
  { to: '/electrical/power-factor', title: 'Power Factor', subtitle: 'PF correction & analysis', icon: '\u223C' },
  { to: '/electrical/gfci-afci', title: 'GFCI / AFCI', subtitle: 'Protection requirements', icon: '\u26A1' },
]

const conduitItems: CalcItem[] = [
  { to: '/conduit/bending', title: 'EMT Bending', subtitle: 'Offsets, saddles & kicks', icon: '\u2312' },
  { to: '/conduit/fill', title: 'Conduit Fill', subtitle: 'CEC conduit fill calculations', icon: '\u25CE' },
  { to: '/conduit/raceway-spacing', title: 'Raceway Spacing', subtitle: 'Support distances & clamps', icon: '\u2393' },
  { to: '/conduit/burial-depths', title: 'Burial Depths', subtitle: 'Minimum cover requirements', icon: '\u2B07' },
  { to: '/conduit/cable-tray', title: 'Cable Tray Sizing', subtitle: 'Tray fill calculator', icon: '\u25A4' },
]

const wireItems: CalcItem[] = [
  { to: '/wire/ampacity', title: 'Ampacity Lookup', subtitle: 'Wire ampacity tables', icon: '\u1D2C' },
  { to: '/wire/sizing', title: 'Wire Sizing', subtitle: 'Conductor sizing tool', icon: '\u2338' },
  { to: '/wire/grounding', title: 'Grounding Conductor', subtitle: 'CEC Table 17 sizing', icon: '\u23DA' },
  { to: '/wire/ocp-transformer', title: 'Transformer OCP', subtitle: 'Transformer overcurrent protection', icon: '\u2397' },
  { to: '/wire/ocp-feeder', title: 'Feeder OCP', subtitle: 'Feeder overcurrent protection', icon: '\u2393' },
  { to: '/wire/torque-specs', title: 'Torque Specs', subtitle: 'Termination torque values', icon: '\uD83D\uDD27' },
]

const motorItems: CalcItem[] = [
  { to: '/motors/flc', title: 'Motor FLC Tables', subtitle: 'Full load current reference', icon: '\u2699' },
  { to: '/motors/branch', title: 'Motor Branch Circuit', subtitle: 'Branch circuit sizing', icon: '\u2442' },
  { to: '/motors/ocp', title: 'Motor OCP', subtitle: 'Motor overcurrent protection', icon: '\u26D4' },
]

const referenceItems: CalcItem[] = [
  { to: '/reference/box-fill', title: 'Box Fill', subtitle: 'Junction box fill calculations', icon: '\u25A3' },
  { to: '/reference/residential', title: 'Residential Demand', subtitle: 'Dwelling unit load calc', icon: '\u2302' },
  { to: '/reference/cec', title: 'CEC Reference', subtitle: 'Canadian Electrical Code tables', icon: '\uD83D\uDCD6' },
  { to: '/reference/unit-converter', title: 'Unit Converter', subtitle: 'AWG↔mm², °C↔°F, m↔ft', icon: '\uD83D\uDD04' },
  { to: '/materials', title: 'Material Lists', subtitle: 'Job material tracking & notes', icon: '\uD83D\uDCCB' },
]

const miningItems: CalcItem[] = [
  { to: '/mining/safety', title: 'Mining Electrical Safety', subtitle: 'Lockout, grounding, PPE, arc flash', icon: '\u26A0\uFE0F' },
  { to: '/mining/hazardous-areas', title: 'Hazardous Areas', subtitle: 'Zone & Class classification', icon: '\uD83D\uDCA8' },
  { to: '/mining/power', title: 'Mine Power Systems', subtitle: 'Equipment, voltages, troubleshooting', icon: '\u26CF' },
  { to: '/mining/cable-tray', title: 'Cable Tray Sizing', subtitle: 'Tray fill calculator (TECK90)', icon: '\u25A4' },
]

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '40vh',
    }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid var(--divider)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Electrical */}
            <Route path="/electrical" element={<CategoryPage title="Electrical" items={electricalItems} />} />
            <Route path="/electrical/ohms-law" element={<OhmsLawPage />} />
            <Route path="/electrical/power" element={<PowerCalcPage />} />
            <Route path="/electrical/voltage-drop" element={<VoltageDropPage />} />
            <Route path="/electrical/power-factor" element={<PowerFactorPage />} />
            <Route path="/electrical/gfci-afci" element={<GfciAfciPage />} />

            {/* Conduit */}
            <Route path="/conduit" element={<CategoryPage title="Conduit" items={conduitItems} />} />
            <Route path="/conduit/bending" element={<BendingPage />} />
            <Route path="/conduit/fill" element={<ConduitFillPage />} />
            <Route path="/conduit/raceway-spacing" element={<RacewaySpacingPage />} />
            <Route path="/conduit/burial-depths" element={<BurialDepthsPage />} />
            <Route path="/conduit/cable-tray" element={<CableTrayPage />} />

            {/* Wire & Protection */}
            <Route path="/wire" element={<CategoryPage title="Wire & Protection" items={wireItems} />} />
            <Route path="/wire/ampacity" element={<AmpacityPage />} />
            <Route path="/wire/sizing" element={<WireSizingPage />} />
            <Route path="/wire/grounding" element={<GroundingConductorPage />} />
            <Route path="/wire/ocp-transformer" element={<TransformerOCPPage />} />
            <Route path="/wire/ocp-feeder" element={<FeederOCPPage />} />
            <Route path="/wire/torque-specs" element={<TorqueSpecsPage />} />

            {/* Motors */}
            <Route path="/motors" element={<CategoryPage title="Motors" items={motorItems} />} />
            <Route path="/motors/flc" element={<MotorFLCPage />} />
            <Route path="/motors/branch" element={<MotorBranchPage />} />
            <Route path="/motors/ocp" element={<MotorOCPPage />} />

            {/* Reference */}
            <Route path="/reference" element={<CategoryPage title="Reference" items={referenceItems} />} />
            <Route path="/reference/box-fill" element={<BoxFillPage />} />
            <Route path="/reference/residential" element={<ResidentialDemandPage />} />
            <Route path="/reference/cec" element={<CECReferencePage />} />
            <Route path="/reference/unit-converter" element={<UnitConverterPage />} />

            {/* Mining */}
            <Route path="/mining" element={<CategoryPage title="Mining" items={miningItems} />} />
            <Route path="/mining/safety" element={<MiningSafetyPage />} />
            <Route path="/mining/hazardous-areas" element={<HazardousAreasPage />} />
            <Route path="/mining/power" element={<MinePowerPage />} />
            <Route path="/mining/cable-tray" element={<CableTrayPage />} />

            {/* Material Lists */}
            <Route path="/materials" element={<MaterialListPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </ThemeProvider>
  )
}
