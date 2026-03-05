import { useState } from 'react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

const cableSizeOptions = [
  { value: '14', label: '14 AWG' },
  { value: '12', label: '12 AWG' },
  { value: '10', label: '10 AWG' },
  { value: '8', label: '8 AWG' },
  { value: '6', label: '6 AWG' },
  { value: '4', label: '4 AWG' },
  { value: '3', label: '3 AWG' },
  { value: '2', label: '2 AWG' },
  { value: '1', label: '1 AWG' },
  { value: '1/0', label: '1/0 AWG' },
  { value: '2/0', label: '2/0 AWG' },
  { value: '3/0', label: '3/0 AWG' },
  { value: '4/0', label: '4/0 AWG' },
  { value: '250', label: '250 kcmil' },
  { value: '300', label: '300 kcmil' },
  { value: '350', label: '350 kcmil' },
  { value: '400', label: '400 kcmil' },
  { value: '500', label: '500 kcmil' },
]

// Cable impedance (Z) in ohms per 1000ft at 60Hz - copper in steel conduit (approximate)
// Used for point-to-point fault current reduction calculation
const cableImpedance: Record<string, number> = {
  '14': 3.140,
  '12': 1.980,
  '10': 1.240,
  '8': 0.786,
  '6': 0.510,
  '4': 0.321,
  '3': 0.254,
  '2': 0.201,
  '1': 0.160,
  '1/0': 0.128,
  '2/0': 0.102,
  '3/0': 0.0810,
  '4/0': 0.0642,
  '250': 0.0552,
  '300': 0.0464,
  '350': 0.0401,
  '400': 0.0356,
  '500': 0.0293,
}

// Circular mils for each cable size
const circularMils: Record<string, number> = {
  '14': 4110,
  '12': 6530,
  '10': 10380,
  '8': 16510,
  '6': 26240,
  '4': 41740,
  '3': 52620,
  '2': 66360,
  '1': 83690,
  '1/0': 105600,
  '2/0': 133100,
  '3/0': 167800,
  '4/0': 211600,
  '250': 250000,
  '300': 300000,
  '350': 350000,
  '400': 400000,
  '500': 500000,
}

const STANDARD_AIC = [10, 14, 18, 22, 25, 35, 42, 50, 65, 100]
const METERS_TO_FEET = 3.281

function getAicColor(faultKa: number): string {
  if (faultKa <= 10) return '#4ade80'   // green
  if (faultKa <= 25) return '#facc15'   // yellow
  if (faultKa <= 50) return '#fb923c'   // orange
  return '#f87171'                       // red
}

function getMinAic(faultKa: number): number {
  for (const aic of STANDARD_AIC) {
    if (aic >= faultKa) return aic
  }
  return STANDARD_AIC[STANDARD_AIC.length - 1]
}

export default function ShortCircuitPage() {
  const [kva, setKva] = useState('')
  const [primaryVoltage, setPrimaryVoltage] = useState('')
  const [secondaryVoltage, setSecondaryVoltage] = useState('')
  const [impedance, setImpedance] = useState('5.75')
  const [cableLength, setCableLength] = useState('')
  const [cableSize, setCableSize] = useState('4/0')

  const kvaVal = parseFloat(kva)
  const vSec = parseFloat(secondaryVoltage)
  const zPct = parseFloat(impedance)
  const lengthM = parseFloat(cableLength)
  const hasBasicInputs = !isNaN(kvaVal) && kvaVal > 0 && !isNaN(vSec) && vSec > 0 && !isNaN(zPct) && zPct > 0
  const hasCableInputs = !isNaN(lengthM) && lengthM > 0

  // Fault current at transformer secondary
  let iscTransformer = NaN
  let iscPanel = NaN
  let formulaXfmr = ''
  let formulaPanel = ''

  if (hasBasicInputs) {
    // Isc = (kVA × 1000) / (V_secondary × √3 × Z%)
    // Z% is expressed as decimal (e.g., 5.75% = 0.0575)
    const zDecimal = zPct / 100
    iscTransformer = (kvaVal * 1000) / (vSec * Math.sqrt(3) * zDecimal)
    formulaXfmr = `Isc = (${fmt(kvaVal, 0)} × 1000) / (${fmt(vSec, 0)} × √3 × ${fmt(zDecimal, 4)}) = ${fmt(iscTransformer, 0)} A`

    if (hasCableInputs) {
      // Point-to-point method
      // Convert cable length from meters to feet
      const lengthFt = lengthM * METERS_TO_FEET
      const CM = circularMils[cableSize]
      const Z = cableImpedance[cableSize]

      if (CM && Z) {
        // f = (1.732 × L × Z) / (V_secondary) for 3-phase
        // Isc_panel = Isc_transformer / (1 + f)
        const f = (Math.sqrt(3) * lengthFt * Z) / vSec
        iscPanel = iscTransformer / (1 + f)
        formulaPanel = `f = (√3 × ${fmt(lengthFt, 0)} × ${fmt(Z, 4)}) / ${fmt(vSec, 0)} = ${fmt(f, 4)}  |  Isc(panel) = ${fmt(iscTransformer, 0)} / (1 + ${fmt(f, 4)}) = ${fmt(iscPanel, 0)} A`
      }
    }
  }

  const iscXfmrKa = iscTransformer / 1000
  const iscPanelKa = !isNaN(iscPanel) ? iscPanel / 1000 : NaN

  const results = hasBasicInputs
    ? [
        { label: 'Fault Current @ Transformer', value: fmt(iscTransformer, 0), unit: 'A', highlight: true },
        { label: 'Fault Current @ Transformer', value: fmt(iscXfmrKa, 2), unit: 'kA' },
        ...(hasCableInputs && !isNaN(iscPanel)
          ? [
              { label: 'Fault Current @ Panel', value: fmt(iscPanel, 0), unit: 'A' },
              { label: 'Fault Current @ Panel', value: fmt(iscPanelKa, 2), unit: 'kA' },
            ]
          : []),
        { label: 'Min. AIC Rating Required', value: `${getMinAic(hasCableInputs && !isNaN(iscPanelKa) ? iscPanelKa : iscXfmrKa)}`, unit: 'kA' },
      ]
    : [
        { label: 'Fault Current @ Transformer', value: '—', unit: 'A' },
        { label: 'Fault Current @ Panel', value: '—', unit: 'A' },
        { label: 'Min. AIC Rating Required', value: '—', unit: 'kA' },
      ]

  const fullFormula = hasBasicInputs
    ? formulaXfmr + (formulaPanel ? '\n' + formulaPanel : '')
    : undefined

  // Determine the critical fault value for color coding
  const criticalKa = hasBasicInputs
    ? (hasCableInputs && !isNaN(iscPanelKa) ? Math.max(iscXfmrKa, iscPanelKa) : iscXfmrKa)
    : 0

  return (
    <>
      <Header title="Short Circuit / AFC" />
      <div style={{ padding: '0 16px 120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <InputField
            label="Transformer kVA"
            unit="kVA"
            value={kva}
            onChange={setKva}
            placeholder="e.g. 1000"
          />

          <InputField
            label="Primary Voltage"
            unit="V"
            value={primaryVoltage}
            onChange={setPrimaryVoltage}
            placeholder="e.g. 13800"
          />

          <InputField
            label="Secondary Voltage"
            unit="V"
            value={secondaryVoltage}
            onChange={setSecondaryVoltage}
            placeholder="e.g. 600"
          />

          <InputField
            label="Transformer Impedance"
            unit="%"
            value={impedance}
            onChange={setImpedance}
            placeholder="Default 5.75"
          />

          <div style={{
            borderTop: '1px solid var(--divider)',
            paddingTop: 16,
            marginTop: 4,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
              Downstream Cable (Optional)
            </div>
          </div>

          <InputField
            label="Cable Length"
            unit="m"
            value={cableLength}
            onChange={setCableLength}
            placeholder="One-way length in meters"
          />

          <SelectField
            label="Cable Size"
            value={cableSize}
            onChange={setCableSize}
            options={cableSizeOptions}
          />

          <ResultDisplay results={results} formula={fullFormula} title="Short Circuit" />

          {/* Fault level severity indicator */}
          {hasBasicInputs && (
            <div style={{
              background: 'var(--surface)',
              border: `2px solid ${getAicColor(criticalKa)}`,
              borderRadius: 'var(--radius)',
              padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: getAicColor(criticalKa),
                  flexShrink: 0,
                }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {criticalKa <= 10 && 'Low Fault Level'}
                  {criticalKa > 10 && criticalKa <= 25 && 'Moderate Fault Level'}
                  {criticalKa > 25 && criticalKa <= 50 && 'High Fault Level'}
                  {criticalKa > 50 && 'Very High Fault Level — Verify AIC Ratings'}
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {criticalKa > 10 &&
                  'Ensure all panelboards, switchgear, and overcurrent devices have adequate interrupting ratings (AIC) at or above the available fault current.'}
                {criticalKa <= 10 &&
                  'Standard 10 kA AIC rated equipment is sufficient at this fault level.'}
              </div>
            </div>
          )}

          {/* Standard AIC Ratings Reference */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--input-border)',
            borderRadius: 'var(--radius)',
            padding: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
              Standard AIC Ratings (kA)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STANDARD_AIC.map(aic => {
                const isRequired = hasBasicInputs && aic === getMinAic(
                  hasCableInputs && !isNaN(iscPanelKa) ? iscPanelKa : iscXfmrKa
                )
                return (
                  <span key={aic} style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isRequired ? 700 : 400,
                    background: isRequired ? 'var(--primary)' : 'var(--input-bg)',
                    color: isRequired ? '#000' : 'var(--text-secondary)',
                    border: isRequired ? '2px solid var(--primary)' : '1px solid var(--divider)',
                  }}>
                    {aic} kA
                  </span>
                )
              })}
            </div>
          </div>

          <InfoBox title="Available Fault Current (AFC)">
            Available fault current is the maximum short-circuit current that can flow at a given
            point in the electrical system. All overcurrent protective devices and equipment must
            have an interrupting rating (AIC) equal to or greater than the available fault current.
            CEC Rule 14-012 requires that equipment intended to interrupt current at fault levels
            shall have an interrupting rating not less than the available fault current. The
            point-to-point method estimates fault current reduction due to cable impedance
            between the transformer and downstream equipment. Always verify calculations with
            a qualified engineer for critical installations.
          </InfoBox>
        </div>
      </div>
    </>
  )
}
