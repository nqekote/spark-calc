import { useState } from 'react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

const phaseOptions = [
  { value: 'single', label: 'Single Phase' },
  { value: 'three', label: 'Three Phase' },
]

const impedanceOptions = [
  { value: 'lte6', label: '\≤6%' },
  { value: 'gt6', label: '>6% and \≤10%' },
]

const standardSizes = [
  15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125,
  150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600, 700, 800,
  1000, 1200, 1600, 2000,
]

/**
 * Find the largest standard size that does not exceed maxAmps.
 * If no standard size is <= maxAmps, return the next size up (smallest standard size > maxAmps).
 * Per CEC: if the calculated max doesn't correspond to a standard size, the next standard size up is permitted.
 */
function findStandardSize(maxAmps: number): number {
  // Find largest standard size <= maxAmps
  let bestFit: number | null = null
  for (const size of standardSizes) {
    if (size <= maxAmps) {
      bestFit = size
    }
  }
  if (bestFit !== null) return bestFit

  // If none fit, return the smallest standard size (next size up)
  return standardSizes[0]
}

/**
 * If the calculated max doesn't exactly match a standard size,
 * the next standard size up is permitted per CEC.
 */
function findNextStandardSizeUp(maxAmps: number): number {
  for (const size of standardSizes) {
    if (size >= maxAmps) {
      return size
    }
  }
  return standardSizes[standardSizes.length - 1]
}

export default function TransformerOCPPage() {
  const [kva, setKva] = useState('')
  const [primaryVoltage, setPrimaryVoltage] = useState('')
  const [secondaryVoltage, setSecondaryVoltage] = useState('')
  const [phase, setPhase] = useState('single')
  const [impedance, setImpedance] = useState('lte6')

  const kvaVal = parseFloat(kva)
  const vPri = parseFloat(primaryVoltage)
  const vSec = parseFloat(secondaryVoltage)

  const hasInputs = !isNaN(kvaVal) && !isNaN(vPri) && !isNaN(vSec) && vPri > 0 && vSec > 0 && kvaVal > 0

  let primaryFLA = NaN
  let secondaryFLA = NaN
  let maxPrimaryOCP = NaN
  let maxSecondaryOCP = NaN
  let stdPrimaryOCP = NaN
  let stdSecondaryOCP = NaN
  let formula = ''

  if (hasInputs) {
    const multiplier = phase === 'three' ? Math.sqrt(3) : 1

    primaryFLA = (kvaVal * 1000) / (vPri * multiplier)
    secondaryFLA = (kvaVal * 1000) / (vSec * multiplier)

    // CEC Rule 26-252: Primary protection max 125%
    // With secondary protection: primary can go to 250% (impedance <=6%) or 225% (impedance >6%)
    // Secondary protection: max 125% (or 167% if impedance <=6% and <=750V)

    const primaryMaxPercent = impedance === 'lte6' ? 2.50 : 2.25
    const secondaryMaxPercent = impedance === 'lte6' ? 1.67 : 1.25

    maxPrimaryOCP = primaryFLA * primaryMaxPercent
    maxSecondaryOCP = secondaryFLA * secondaryMaxPercent

    // Per CEC: if 125% doesn't correspond to standard size, next size up is permitted
    stdPrimaryOCP = findNextStandardSizeUp(primaryFLA * 1.25)
    // But cannot exceed the max allowed
    if (stdPrimaryOCP > maxPrimaryOCP) {
      stdPrimaryOCP = findStandardSize(maxPrimaryOCP)
    }
    // Also ensure primary OCP does not exceed the max with secondary protection
    const maxPriStd = findStandardSize(maxPrimaryOCP)
    if (stdPrimaryOCP > maxPriStd) {
      stdPrimaryOCP = maxPriStd
    }

    stdSecondaryOCP = findNextStandardSizeUp(secondaryFLA * 1.25)
    if (stdSecondaryOCP > maxSecondaryOCP) {
      stdSecondaryOCP = findStandardSize(maxSecondaryOCP)
    }

    if (phase === 'single') {
      formula = `FLA = kVA × 1000 / V = ${fmt(kvaVal)} × 1000 / ${fmt(vPri)} = ${fmt(primaryFLA)} A (primary)`
    } else {
      formula = `FLA = kVA × 1000 / (V × \√3) = ${fmt(kvaVal)} × 1000 / (${fmt(vPri)} × 1.732) = ${fmt(primaryFLA)} A (primary)`
    }
  }

  const results = hasInputs
    ? [
        { label: 'Primary FLA', value: fmt(primaryFLA), unit: 'A' },
        { label: 'Secondary FLA', value: fmt(secondaryFLA), unit: 'A' },
        {
          label: 'Max Primary OCP',
          value: fmt(maxPrimaryOCP),
          unit: 'A',
        },
        {
          label: 'Standard Primary OCP',
          value: fmt(stdPrimaryOCP),
          unit: 'A',
          highlight: true,
        },
        {
          label: 'Max Secondary OCP',
          value: fmt(maxSecondaryOCP),
          unit: 'A',
        },
        {
          label: 'Standard Secondary OCP',
          value: fmt(stdSecondaryOCP),
          unit: 'A',
          highlight: true,
        },
      ]
    : [
        { label: 'Primary FLA', value: '—', unit: 'A' },
        { label: 'Secondary FLA', value: '—', unit: 'A' },
        { label: 'Max Primary OCP', value: '—', unit: 'A' },
        { label: 'Standard Primary OCP', value: '—', unit: 'A' },
        { label: 'Max Secondary OCP', value: '—', unit: 'A' },
        { label: 'Standard Secondary OCP', value: '—', unit: 'A' },
      ]

  return (
    <>
      <Header title="Transformer OCP" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InputField
          label="Transformer Rating"
          unit="kVA"
          value={kva}
          onChange={setKva}
          placeholder="Enter kVA"
        />
        <InputField
          label="Primary Voltage"
          unit="V"
          value={primaryVoltage}
          onChange={setPrimaryVoltage}
          placeholder="Enter voltage"
        />
        <InputField
          label="Secondary Voltage"
          unit="V"
          value={secondaryVoltage}
          onChange={setSecondaryVoltage}
          placeholder="Enter voltage"
        />
        <SegmentedControl options={phaseOptions} value={phase} onChange={setPhase} />
        <SelectField
          label="Impedance"
          value={impedance}
          onChange={setImpedance}
          options={impedanceOptions}
        />
        <ResultDisplay results={results} formula={hasInputs ? formula : undefined} />
        <InfoBox title="CEC Rule 26-252">
          For transformers rated 750V or less, primary overcurrent protection shall not exceed
          125% of the primary full-load current. If 125% does not correspond to a standard
          overcurrent device rating, the next higher standard rating is permitted. When secondary
          protection is provided, primary protection may be increased to 250% (impedance {'\≤'}6%)
          or 225% (impedance {'>'}6%). Secondary protection shall not exceed 125% of secondary FLA,
          or 167% for transformers with impedance {'\≤'}6%.
        </InfoBox>
      </div>
    </>
  )
}
