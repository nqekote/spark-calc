import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './core/theme/ThemeContext'
import AppShell from './layout/AppShell'
import HomePage from './layout/HomePage'
import CategoryPage, { type CalcItem } from './layout/CategoryPage'
import ErrorBoundary from './components/ErrorBoundary'

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

// Reference & utility pages
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

// New calculators (batch 2)
const TransformerSizingPage = React.lazy(() => import('./features/transformer-sizing/TransformerSizingPage'))
const ShortCircuitPage = React.lazy(() => import('./features/short-circuit/ShortCircuitPage'))
const LightingCalcPage = React.lazy(() => import('./features/lighting-calc/LightingCalcPage'))
const DisconnectSizingPage = React.lazy(() => import('./features/disconnect-sizing/DisconnectSizingPage'))
const GeneratorSizingPage = React.lazy(() => import('./features/generator-sizing/GeneratorSizingPage'))

// New references & tools (batch 2)
const FormulasPage = React.lazy(() => import('./features/formulas/FormulasPage'))
const CableTypesPage = React.lazy(() => import('./features/cable-types/CableTypesPage'))
const HourTrackerPage = React.lazy(() => import('./features/hour-tracker/HourTrackerPage'))
const ExamPrepPage = React.lazy(() => import('./features/exam-prep/ExamPrepPage'))
const PanelSchedulePage = React.lazy(() => import('./features/panel-schedule/PanelSchedulePage'))

// Batch 3: PLC, TECK, Troubleshooting, Multimeter, Control Circuits
const PLCBasicsPage = React.lazy(() => import('./features/plc-basics/PLCBasicsPage'))
const TECKCablePage = React.lazy(() => import('./features/teck-cable/TECKCablePage'))
const TroubleshootingPage = React.lazy(() => import('./features/troubleshooting/TroubleshootingPage'))
const MultimeterPage = React.lazy(() => import('./features/multimeter/MultimeterPage'))
const ControlCircuitsPage = React.lazy(() => import('./features/control-circuits/ControlCircuitsPage'))

// Batch 4: Safety, VFD, Grounding, Motor Starters, Fire Alarm
const ArcFlashPage = React.lazy(() => import('./features/arc-flash/ArcFlashPage'))
const LOTOPage = React.lazy(() => import('./features/loto/LOTOPage'))
const VFDReferencePage = React.lazy(() => import('./features/vfd-reference/VFDReferencePage'))
const GroundingSystemsPage = React.lazy(() => import('./features/grounding-systems/GroundingSystemsPage'))
const MotorStartersPage = React.lazy(() => import('./features/motor-starters/MotorStartersPage'))
const FireAlarmPage = React.lazy(() => import('./features/fire-alarm/FireAlarmPage'))

// Batch 5: Symbols, Instrumentation, Medium Voltage, Power Quality, Code Requirements
const ElectricalSymbolsPage = React.lazy(() => import('./features/electrical-symbols/ElectricalSymbolsPage'))
const InstrumentationPage = React.lazy(() => import('./features/instrumentation/InstrumentationPage'))
const MediumVoltagePage = React.lazy(() => import('./features/medium-voltage/MediumVoltagePage'))
const PowerQualityPage = React.lazy(() => import('./features/power-quality/PowerQualityPage'))
const CodeRequirementsPage = React.lazy(() => import('./features/code-requirements/CodeRequirementsPage'))

// Batch 6: Conductor Properties, Wiring Methods, Industrial Comms
const ConductorPropertiesPage = React.lazy(() => import('./features/conductor-properties/ConductorPropertiesPage'))
const WiringMethodsPage = React.lazy(() => import('./features/wiring-methods/WiringMethodsPage'))
const IndustrialCommsPage = React.lazy(() => import('./features/industrial-comms/IndustrialCommsPage'))

// Batch 7: Battery/UPS, Solar, Emergency Power, OC Coordination, Safety Training
const BatteryUPSPage = React.lazy(() => import('./features/battery-ups/BatteryUPSPage'))
const SolarRenewablePage = React.lazy(() => import('./features/solar-renewable/SolarRenewablePage'))
const EmergencyPowerPage = React.lazy(() => import('./features/emergency-power/EmergencyPowerPage'))
const OCCoordinationPage = React.lazy(() => import('./features/oc-coordination/OCCoordinationPage'))
const SafetyTrainingPage = React.lazy(() => import('./features/safety-training/SafetyTrainingPage'))

// Batch 8: Transformer Loading, Ground Fault, Portable Sub, Testing, Relays, Single-Line, Switchgear
const TransformerLoadingPage = React.lazy(() => import('./features/transformer-loading/TransformerLoadingPage'))
const GroundFaultPage = React.lazy(() => import('./features/ground-fault/GroundFaultPage'))
const PortableSubstationPage = React.lazy(() => import('./features/portable-substation/PortableSubstationPage'))
const TestingGuidePage = React.lazy(() => import('./features/testing-guide/TestingGuidePage'))
const ProtectiveRelaysPage = React.lazy(() => import('./features/protective-relays/ProtectiveRelaysPage'))
const SingleLinePage = React.lazy(() => import('./features/single-line/SingleLinePage'))
const SwitchgearPage = React.lazy(() => import('./features/switchgear/SwitchgearPage'))

// Utility pages
const HistoryPage = React.lazy(() => import('./features/history/HistoryPage'))
const FieldNotesPage = React.lazy(() => import('./features/field-notes/FieldNotesPage'))
const WireColorsPage = React.lazy(() => import('./features/wire-colors/WireColorsPage'))
const CECLookupPage = React.lazy(() => import('./features/cec-lookup/CECLookupPage'))

// Category items
const electricalItems: CalcItem[] = [
  { to: '/electrical/ohms-law', title: "Ohm's Law", subtitle: 'Voltage, current & resistance', icon: '\u03A9' },
  { to: '/electrical/power', title: 'Power Calculator', subtitle: 'Watts, VA & power formulas', icon: '\u26A1' },
  { to: '/electrical/voltage-drop', title: 'Voltage Drop', subtitle: 'Wire length & voltage loss', icon: '\u2193' },
  { to: '/electrical/power-factor', title: 'Power Factor', subtitle: 'PF correction & analysis', icon: '\u223C' },
  { to: '/electrical/gfci-afci', title: 'GFCI / AFCI', subtitle: 'Protection requirements', icon: '\uD83D\uDEE1' },
  { to: '/electrical/short-circuit', title: 'Short Circuit', subtitle: 'Available fault current', icon: '\uD83D\uDCA5' },
  { to: '/electrical/lighting', title: 'Lighting Calculator', subtitle: 'Lux, lumens & fixture count', icon: '\uD83D\uDCA1' },
  { to: '/electrical/transformer-sizing', title: 'Transformer Sizing', subtitle: 'kVA sizing & standard sizes', icon: '\u2394' },
  { to: '/electrical/disconnect', title: 'Disconnect Sizing', subtitle: 'HP-rated switch selection', icon: '\u2393' },
  { to: '/electrical/generator', title: 'Generator Sizing', subtitle: 'Backup power calculator', icon: '\u26A1' },
  { to: '/electrical/oc-coordination', title: 'OC Coordination', subtitle: 'Breaker & fuse selectivity', icon: '\uD83D\uDCCA' },
  { to: '/electrical/transformer-loading', title: 'Transformer Loading', subtitle: 'Loading, derating & life calc', icon: '\uD83D\uDD25' },
  { to: '/electrical/ground-fault', title: 'Ground Fault', subtitle: 'GF current & NGR sizing', icon: '\u23DA' },
]

const wireItems: CalcItem[] = [
  { to: '/wire/teck-cable', title: 'TECK90 Cable Guide', subtitle: 'Specs, glands, installation', icon: '\uD83D\uDD29' },
  { to: '/wire/ampacity', title: 'Ampacity Lookup', subtitle: 'Wire ampacity tables', icon: '\u1D2C' },
  { to: '/wire/sizing', title: 'Wire Sizing', subtitle: 'Conductor sizing tool', icon: '\u2338' },
  { to: '/wire/grounding', title: 'Grounding Conductor', subtitle: 'CEC Table 17 sizing', icon: '\u23DA' },
  { to: '/wire/cable-types', title: 'Cable Types', subtitle: 'NMD90, TECK90, AC90, SHD-GC', icon: '\uD83D\uDD0C' },
  { to: '/wire/ocp-transformer', title: 'Transformer OCP', subtitle: 'Transformer overcurrent protection', icon: '\u2397' },
  { to: '/wire/ocp-feeder', title: 'Feeder OCP', subtitle: 'Feeder overcurrent protection', icon: '\u2393' },
  { to: '/wire/torque-specs', title: 'Torque Specs', subtitle: 'Termination torque values', icon: '\uD83D\uDD27' },
  { to: '/conduit/fill', title: 'Conduit Fill', subtitle: 'CEC conduit fill calculations', icon: '\u25CE' },
  { to: '/conduit/bending', title: 'EMT Bending', subtitle: 'Offsets, saddles & kicks', icon: '\u2312' },
  { to: '/conduit/raceway-spacing', title: 'Raceway Spacing', subtitle: 'Support distances & clamps', icon: '\u2393' },
  { to: '/conduit/burial-depths', title: 'Burial Depths', subtitle: 'Minimum cover requirements', icon: '\u2B07' },
  { to: '/conduit/cable-tray', title: 'Cable Tray Sizing', subtitle: 'Tray fill calculator', icon: '\u25A4' },
  { to: '/wire/colors', title: 'Wire Colors', subtitle: 'Canadian color codes', icon: '\uD83C\uDFA8' },
]

const motorItems: CalcItem[] = [
  { to: '/motors/flc', title: 'Motor FLC Tables', subtitle: 'Full load current reference', icon: '\u2699' },
  { to: '/motors/branch', title: 'Motor Branch Circuit', subtitle: 'Branch circuit sizing', icon: '\u2442' },
  { to: '/motors/ocp', title: 'Motor OCP', subtitle: 'Motor overcurrent protection', icon: '\u26D4' },
  { to: '/motors/starters', title: 'Motor Starters', subtitle: 'DOL, star-delta, soft start, VFD', icon: '\u25B6' },
  { to: '/motors/vfd', title: 'VFD Reference', subtitle: 'Parameters, faults, sizing', icon: '\u223F' },
  { to: '/motors/medium-voltage', title: 'Medium Voltage', subtitle: 'MV switchgear, cable, protection', icon: '\u26A1' },
]

const referenceItems: CalcItem[] = [
  { to: '/reference/formulas', title: 'Formulas Cheat Sheet', subtitle: 'All electrical formulas', icon: '\uD83D\uDCDD' },
  { to: '/reference/box-fill', title: 'Box Fill', subtitle: 'Junction box fill calculations', icon: '\u25A3' },
  { to: '/reference/residential', title: 'Residential Demand', subtitle: 'Dwelling unit load calc', icon: '\u2302' },
  { to: '/reference/cec', title: 'CEC Reference', subtitle: 'Canadian Electrical Code tables', icon: '\uD83D\uDCD6' },
  { to: '/reference/unit-converter', title: 'Unit Converter', subtitle: 'AWG\u2194mm\u00B2, \u00B0C\u2194\u00B0F, m\u2194ft', icon: '\uD83D\uDD04' },
  { to: '/reference/troubleshooting', title: 'Troubleshooting', subtitle: 'Motors, controls, power, grounding', icon: '\uD83D\uDD0D' },
  { to: '/reference/multimeter', title: 'Multimeter Guide', subtitle: 'Voltage, current, resistance, safety', icon: '\uD83D\uDCCF' },
  { to: '/reference/control-circuits', title: 'Control Circuits', subtitle: 'Schematics, symbols, disconnects', icon: '\u2B61' },
  { to: '/reference/plc-basics', title: 'PLC Basics', subtitle: 'I/O, ladder logic, protocols', icon: '\uD83E\uDDE0' },
  { to: '/reference/grounding-systems', title: 'Grounding Systems', subtitle: 'HRG, solidly grounded, testing', icon: '\u23DA' },
  { to: '/reference/fire-alarm', title: 'Fire Alarm', subtitle: 'Systems, devices, wiring, inspection', icon: '\uD83D\uDD14' },
  { to: '/reference/electrical-symbols', title: 'Electrical Symbols', subtitle: 'Schematic, one-line, control symbols', icon: '\uD83D\uDD0C' },
  { to: '/reference/instrumentation', title: 'Instrumentation', subtitle: '4-20mA, RTDs, P&ID, HART', icon: '\uD83D\uDCE1' },
  { to: '/reference/power-quality', title: 'Power Quality', subtitle: 'Harmonics, THD, K-factor calculator', icon: '\uD83D\uDCC8' },
  { to: '/reference/code-requirements', title: 'CEC Code by Task', subtitle: 'Rules for disconnects, TECK, motors', icon: '\uD83D\uDCDC' },
  { to: '/reference/cec-lookup', title: 'CEC Code Lookup', subtitle: 'Smart search & decision trees', icon: '\u26A1' },
  { to: '/reference/conductor-properties', title: 'Conductor Properties', subtitle: 'AWG, resistance, derating, selection', icon: '\uD83E\uDDF5' },
  { to: '/reference/wiring-methods', title: 'Wiring Methods', subtitle: 'EMT, TECK, cable tray, burial', icon: '\uD83D\uDD27' },
  { to: '/reference/industrial-comms', title: 'Industrial Comms', subtitle: 'RS-485, Ethernet, fiber, Modbus', icon: '\uD83D\uDCE1' },
  { to: '/reference/battery-ups', title: 'Battery & UPS', subtitle: 'UPS types, sizing, CEC Sec 64', icon: '\uD83D\uDD0B' },
  { to: '/reference/solar-renewable', title: 'Solar & Renewable', subtitle: 'PV, inverters, ESS, CEC', icon: '\u2600' },
  { to: '/reference/emergency-power', title: 'Emergency Power', subtitle: 'ATS, generators, CEC Sec 46', icon: '\uD83D\uDEA8' },
  { to: '/reference/protective-relays', title: 'Protective Relays', subtitle: 'ANSI devices, 50/51, settings', icon: '\u26A1' },
  { to: '/reference/switchgear', title: 'Switchgear', subtitle: 'MV/LV types, racking, testing', icon: '\uD83D\uDD27' },
  { to: '/reference/portable-substation', title: 'Portable Substations', subtitle: 'Install, relocate, maintain', icon: '\u2394' },
]

const safetyItems: CalcItem[] = [
  { to: '/safety/arc-flash', title: 'Arc Flash', subtitle: 'PPE categories, boundaries, labels', icon: '\u26A1' },
  { to: '/safety/loto', title: 'Lockout / Tagout', subtitle: 'Procedures, energy sources, mining', icon: '\uD83D\uDD12' },
  { to: '/mining/safety', title: 'Mining Electrical Safety', subtitle: 'Lockout, grounding, PPE, arc flash', icon: '\u26A0\uFE0F' },
  { to: '/safety/training', title: 'CSA Z462 Safety', subtitle: 'Shock, arc flash, PPE, training', icon: '\uD83C\uDF93' },
]

const miningItems: CalcItem[] = [
  { to: '/mining/safety', title: 'Mining Electrical Safety', subtitle: 'Lockout, grounding, PPE, arc flash', icon: '\u26A0\uFE0F' },
  { to: '/mining/hazardous-areas', title: 'Hazardous Areas', subtitle: 'Zone & Class classification', icon: '\uD83D\uDCA8' },
  { to: '/mining/power', title: 'Mine Power Systems', subtitle: 'Equipment, voltages, troubleshooting', icon: '\u26CF' },
  { to: '/mining/cable-tray', title: 'Cable Tray Sizing', subtitle: 'Tray fill calculator (TECK90)', icon: '\u25A4' },
  { to: '/reference/portable-substation', title: 'Portable Substations', subtitle: 'Install, relocate, maintain', icon: '\u2394' },
]

const toolsItems: CalcItem[] = [
  { to: '/materials', title: 'Material Lists', subtitle: 'Job material tracking & notes', icon: '\uD83D\uDCCB' },
  { to: '/tools/panel-schedule', title: 'Panel Schedule', subtitle: 'Digital panel schedule builder', icon: '\uD83D\uDCCA' },
  { to: '/tools/hour-tracker', title: 'Hour Tracker', subtitle: 'Apprentice hour logging', icon: '\u23F1' },
  { to: '/tools/exam-prep', title: 'Exam Prep', subtitle: '309A certification prep', icon: '\uD83C\uDF93' },
  { to: '/tools/single-line', title: 'Single-Line Builder', subtitle: 'Diagram builder & symbols', icon: '\u2500' },
  { to: '/tools/field-notes', title: 'Field Notes', subtitle: 'On-site journal & measurements', icon: '\uD83D\uDCDD' },
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

// Prefetch popular routes during idle time
const prefetchRoutes = () => {
  const chunks = [
    () => import('./features/voltage-drop/VoltageDropPage'),
    () => import('./features/ohms-law/OhmsLawPage'),
    () => import('./features/conduit-fill/ConduitFillPage'),
    () => import('./features/ampacity/AmpacityPage'),
    () => import('./features/teck-cable/TECKCablePage'),
    () => import('./features/troubleshooting/TroubleshootingPage'),
    () => import('./features/loto/LOTOPage'),
  ]
  let i = 0
  const next = () => {
    if (i < chunks.length) {
      chunks[i]().catch(() => {})
      i++
      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(next)
      } else {
        setTimeout(next, 200)
      }
    }
  }
  next()
}

// Start prefetching after initial paint
if ('requestIdleCallback' in window) {
  (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(prefetchRoutes)
} else {
  setTimeout(prefetchRoutes, 2000)
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />

            {/* Electrical */}
            <Route path="/electrical" element={<CategoryPage title="Electrical" items={electricalItems} />} />
            <Route path="/electrical/ohms-law" element={<OhmsLawPage />} />
            <Route path="/electrical/power" element={<PowerCalcPage />} />
            <Route path="/electrical/voltage-drop" element={<VoltageDropPage />} />
            <Route path="/electrical/power-factor" element={<PowerFactorPage />} />
            <Route path="/electrical/gfci-afci" element={<GfciAfciPage />} />
            <Route path="/electrical/short-circuit" element={<ShortCircuitPage />} />
            <Route path="/electrical/lighting" element={<LightingCalcPage />} />
            <Route path="/electrical/transformer-sizing" element={<TransformerSizingPage />} />
            <Route path="/electrical/disconnect" element={<DisconnectSizingPage />} />
            <Route path="/electrical/generator" element={<GeneratorSizingPage />} />
            <Route path="/electrical/oc-coordination" element={<OCCoordinationPage />} />
            <Route path="/electrical/transformer-loading" element={<TransformerLoadingPage />} />
            <Route path="/electrical/ground-fault" element={<GroundFaultPage />} />

            {/* Wire & Cable (includes conduit) */}
            <Route path="/wire" element={<CategoryPage title="Wire & Cable" items={wireItems} />} />
            <Route path="/conduit" element={<CategoryPage title="Wire & Cable" items={wireItems} />} />
            <Route path="/wire/ampacity" element={<AmpacityPage />} />
            <Route path="/wire/sizing" element={<WireSizingPage />} />
            <Route path="/wire/grounding" element={<GroundingConductorPage />} />
            <Route path="/wire/cable-types" element={<CableTypesPage />} />
            <Route path="/wire/ocp-transformer" element={<TransformerOCPPage />} />
            <Route path="/wire/ocp-feeder" element={<FeederOCPPage />} />
            <Route path="/wire/torque-specs" element={<TorqueSpecsPage />} />
            <Route path="/wire/teck-cable" element={<TECKCablePage />} />
            <Route path="/conduit/bending" element={<BendingPage />} />
            <Route path="/conduit/fill" element={<ConduitFillPage />} />
            <Route path="/conduit/raceway-spacing" element={<RacewaySpacingPage />} />
            <Route path="/conduit/burial-depths" element={<BurialDepthsPage />} />
            <Route path="/conduit/cable-tray" element={<CableTrayPage />} />
            <Route path="/wire/colors" element={<WireColorsPage />} />

            {/* Motors */}
            <Route path="/motors" element={<CategoryPage title="Motors" items={motorItems} />} />
            <Route path="/motors/flc" element={<MotorFLCPage />} />
            <Route path="/motors/branch" element={<MotorBranchPage />} />
            <Route path="/motors/ocp" element={<MotorOCPPage />} />
            <Route path="/motors/starters" element={<MotorStartersPage />} />
            <Route path="/motors/vfd" element={<VFDReferencePage />} />
            <Route path="/motors/medium-voltage" element={<MediumVoltagePage />} />

            {/* Reference */}
            <Route path="/reference" element={<CategoryPage title="Reference" items={referenceItems} />} />
            <Route path="/reference/formulas" element={<FormulasPage />} />
            <Route path="/reference/box-fill" element={<BoxFillPage />} />
            <Route path="/reference/residential" element={<ResidentialDemandPage />} />
            <Route path="/reference/cec" element={<CECReferencePage />} />
            <Route path="/reference/unit-converter" element={<UnitConverterPage />} />
            <Route path="/reference/troubleshooting" element={<TroubleshootingPage />} />
            <Route path="/reference/multimeter" element={<MultimeterPage />} />
            <Route path="/reference/control-circuits" element={<ControlCircuitsPage />} />
            <Route path="/reference/plc-basics" element={<PLCBasicsPage />} />
            <Route path="/reference/grounding-systems" element={<GroundingSystemsPage />} />
            <Route path="/reference/fire-alarm" element={<FireAlarmPage />} />
            <Route path="/reference/electrical-symbols" element={<ElectricalSymbolsPage />} />
            <Route path="/reference/instrumentation" element={<InstrumentationPage />} />
            <Route path="/reference/power-quality" element={<PowerQualityPage />} />
            <Route path="/reference/code-requirements" element={<CodeRequirementsPage />} />
            <Route path="/reference/cec-lookup" element={<CECLookupPage />} />
            <Route path="/reference/conductor-properties" element={<ConductorPropertiesPage />} />
            <Route path="/reference/wiring-methods" element={<WiringMethodsPage />} />
            <Route path="/reference/industrial-comms" element={<IndustrialCommsPage />} />
            <Route path="/reference/battery-ups" element={<BatteryUPSPage />} />
            <Route path="/reference/solar-renewable" element={<SolarRenewablePage />} />
            <Route path="/reference/emergency-power" element={<EmergencyPowerPage />} />
            <Route path="/reference/protective-relays" element={<ProtectiveRelaysPage />} />
            <Route path="/reference/switchgear" element={<SwitchgearPage />} />
            <Route path="/reference/portable-substation" element={<PortableSubstationPage />} />
            <Route path="/reference/testing-guide" element={<TestingGuidePage />} />

            {/* Safety */}
            <Route path="/safety" element={<CategoryPage title="Safety" items={safetyItems} />} />
            <Route path="/safety/arc-flash" element={<ArcFlashPage />} />
            <Route path="/safety/loto" element={<LOTOPage />} />
            <Route path="/safety/training" element={<SafetyTrainingPage />} />

            {/* Mining */}
            <Route path="/mining" element={<CategoryPage title="Mining" items={miningItems} />} />
            <Route path="/mining/safety" element={<MiningSafetyPage />} />
            <Route path="/mining/hazardous-areas" element={<HazardousAreasPage />} />
            <Route path="/mining/power" element={<MinePowerPage />} />
            <Route path="/mining/cable-tray" element={<CableTrayPage />} />

            {/* Tools */}
            <Route path="/tools" element={<CategoryPage title="Tools" items={toolsItems} />} />
            <Route path="/tools/panel-schedule" element={<PanelSchedulePage />} />
            <Route path="/tools/hour-tracker" element={<HourTrackerPage />} />
            <Route path="/tools/exam-prep" element={<ExamPrepPage />} />
            <Route path="/materials" element={<MaterialListPage />} />
            <Route path="/tools/single-line" element={<SingleLinePage />} />
            <Route path="/tools/field-notes" element={<FieldNotesPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AppShell>
    </ThemeProvider>
  )
}
