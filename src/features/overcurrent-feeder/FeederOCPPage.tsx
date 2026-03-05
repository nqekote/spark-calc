import { useState } from 'react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

type TempRating = '60' | '75' | '90'

const materialOptions = [
  { value: 'copper', label: 'Copper' },
  { value: 'aluminum', label: 'Aluminum' },
]

const tempRatingOptions = [
  { value: '60', label: '60°C' },
  { value: '75', label: '75°C' },
  { value: '90', label: '90°C' },
]

const loadTypeOptions = [
  { value: 'continuous', label: 'Continuous' },
  { value: 'non-continuous', label: 'Non-continuous' },
]

const wireSizes = [
  '14', '12', '10', '8', '6', '4', '3', '2', '1',
  '1/0', '2/0', '3/0', '4/0',
  '250', '300', '350', '400', '500', '600', '750', '1000',
]

// CEC Table 2 - Copper ampacities [60, 75, 90]
const copperAmpacity: Record<string, [number, number, number]> = {
  '14': [15, 15, 15], '12': [20, 20, 25], '10': [30, 30, 35],
  '8': [40, 45, 50], '6': [55, 65, 70], '4': [70, 85, 90],
  '3': [80, 100, 105], '2': [95, 115, 120], '1': [110, 130, 140],
  '1/0': [125, 150, 155], '2/0': [145, 175, 185], '3/0': [165, 200, 210],
  '4/0': [195, 230, 245], '250': [215, 255, 270], '300': [240, 285, 300],
  '350': [260, 310, 330], '400': [280, 335, 355], '500': [320, 380, 405],
  '600': [355, 420, 455], '750': [400, 475, 515], '1000': [455, 545, 590],
}

// CEC Table 4 - Aluminum ampacities [60, 75, 90]
const aluminumAmpacity: Record<string, [number, number, number]> = {
  '12': [15, 15, 20], '10': [25, 25, 30],
  '8': [30, 35, 40], '6': [40, 50, 55], '4': [55, 65, 70],
  '3': [65, 75, 80], '2': [75, 90, 95], '1': [85, 100, 110],
  '1/0': [100, 120, 125], '2/0': [115, 135, 145], '3/0': [130, 155, 165],
  '4/0': [155, 180, 195], '250': [170, 205, 215], '300': [190, 230, 240],
  '350': [210, 250, 265], '400': [225, 270, 285], '500': [260, 310, 330],
  '600': [285, 340, 370], '750': [320, 385, 410], '1000': [375, 445, 480],
}

// Temperature correction factors [60, 75, 90] by ambient temp range
const tempCorrectionRanges: { min: number; max: number; factors: [number | null, number | null, number | null] }[] = [
  { min: 11, max: 20, factors: [1.26, 1.18, 1.14] },
  { min: 21, max: 25, factors: [1.14, 1.10, 1.07] },
  { min: 26, max: 30, factors: [1.00, 1.00, 1.00] },
  { min: 31, max: 35, factors: [0.87, 0.88, 0.91] },
  { min: 36, max: 40, factors: [0.71, 0.75, 0.82] },
  { min: 41, max: 45, factors: [0.50, 0.58, 0.71] },
  { min: 46, max: 50, factors: [null, 0.33, 0.58] },
  { min: 51, max: 55, factors: [null, null, 0.41] },
]

// Bundling derating factors
const bundlingRanges: { min: number; max: number; factor: number }[] = [
  { min: 1, max: 3, factor: 1.00 },
  { min: 4, max: 6, factor: 0.80 },
  { min: 7, max: 9, factor: 0.70 },
  { min: 10, max: 24, factor: 0.70 },
  { min: 25, max: 42, factor: 0.60 },
  { min: 43, max: Infinity, factor: 0.50 },
]

const standardOCPSizes = [
  15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125,
  150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600,
]

function getTempRatingIndex(rating: TempRating): number {
  return rating === '60' ? 0 : rating === '75' ? 1 : 2
}

function getTempCorrectionFactor(ambientTemp: number, rating: TempRating): number | null {
  const idx = getTempRatingIndex(rating)
  for (const range of tempCorrectionRanges) {
    if (ambientTemp >= range.min && ambientTemp <= range.max) {
      return range.factors[idx]
    }
  }
  return null
}

function getBundlingFactor(conductors: number): number {
  for (const range of bundlingRanges) {
    if (conductors >= range.min && conductors <= range.max) {
      return range.factor
    }
  }
  return 0.50
}

function formatSize(s: string): string {
  return s.includes('/') || parseInt(s) >= 250 ? `${s} kcmil` : `${s} AWG`
}

function getCorrectedAmpacity(
  size: string,
  material: string,
  rating: TempRating,
  ambTemp: number,
  numConductors: number
): number | null {
  const table = material === 'copper' ? copperAmpacity : aluminumAmpacity
  const entry = table[size]
  if (!entry) return null

  const ratingIdx = getTempRatingIndex(rating)
  const baseAmp = entry[ratingIdx]
  const tempFactor = getTempCorrectionFactor(ambTemp, rating)
  const bundleFactor = getBundlingFactor(Math.round(numConductors))

  if (tempFactor === null) return null
  return baseAmp * tempFactor * bundleFactor
}

/** Find largest standard OCP size that does not exceed maxAmps */
function findStandardOCP(maxAmps: number): number | null {
  let best: number | null = null
  for (const size of standardOCPSizes) {
    if (size <= maxAmps) {
      best = size
    }
  }
  return best
}

/** Find next standard OCP size down from the recommended */
function findNextSizeDown(ocpSize: number): number | null {
  const idx = standardOCPSizes.indexOf(ocpSize)
  if (idx > 0) return standardOCPSizes[idx - 1]
  return null
}

export default function FeederOCPPage() {
  const [loadCurrent, setLoadCurrent] = useState('')
  const [material, setMaterial] = useState('copper')
  const [tempRating, setTempRating] = useState<TempRating>('75')
  const [ambientTemp, setAmbientTemp] = useState('30')
  const [conductors, setConductors] = useState('3')
  const [loadType, setLoadType] = useState('continuous')

  const loadA = parseFloat(loadCurrent)
  const ambTemp = parseFloat(ambientTemp)
  const numConductors = parseFloat(conductors)

  const hasInputs = !isNaN(loadA) && !isNaN(ambTemp) && !isNaN(numConductors) && loadA > 0

  const table = material === 'copper' ? copperAmpacity : aluminumAmpacity
  const availableSizes = wireSizes.filter(s => s in table)

  let designCurrent = NaN
  let minWireSize: string | null = null
  let wireAmpacity: number | null = null
  let recommendedOCP: number | null = null
  let nextSizeDown: number | null = null
  let formula = ''

  if (hasInputs) {
    // Continuous loads require 125% sizing
    designCurrent = loadType === 'continuous' ? loadA * 1.25 : loadA

    // Find minimum wire size that can handle the design current
    for (const size of availableSizes) {
      const corrected = getCorrectedAmpacity(size, material, tempRating, ambTemp, numConductors)
      if (corrected !== null && corrected >= designCurrent) {
        minWireSize = size
        wireAmpacity = corrected
        break
      }
    }

    // OCP device rating <= conductor ampacity
    if (wireAmpacity !== null) {
      recommendedOCP = findStandardOCP(wireAmpacity)
      if (recommendedOCP !== null) {
        nextSizeDown = findNextSizeDown(recommendedOCP)
      }
    }

    if (loadType === 'continuous') {
      formula = `Design Current = ${fmt(loadA)} A × 125% = ${fmt(designCurrent)} A`
    } else {
      formula = `Design Current = ${fmt(loadA)} A (non-continuous)`
    }
  }

  const results = hasInputs
    ? [
        {
          label: 'Design Current',
          value: fmt(designCurrent),
          unit: 'A',
        },
        {
          label: 'Minimum Wire Size',
          value: minWireSize !== null ? formatSize(minWireSize) : 'No suitable wire',
          highlight: true,
        },
        {
          label: 'Wire Ampacity',
          value: wireAmpacity !== null ? fmt(wireAmpacity) : '—',
          unit: 'A',
        },
        {
          label: 'Recommended OCP Size',
          value: recommendedOCP !== null ? fmt(recommendedOCP) : '—',
          unit: 'A',
          highlight: true,
        },
        {
          label: 'Next Size Down OCP',
          value: nextSizeDown !== null ? fmt(nextSizeDown) : '—',
          unit: 'A',
        },
      ]
    : [
        { label: 'Design Current', value: '—', unit: 'A' },
        { label: 'Minimum Wire Size', value: '—' },
        { label: 'Wire Ampacity', value: '—', unit: 'A' },
        { label: 'Recommended OCP Size', value: '—', unit: 'A' },
        { label: 'Next Size Down OCP', value: '—', unit: 'A' },
      ]

  return (
    <>
      <Header title="Feeder OCP" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InputField
          label="Total Load Current"
          unit="A"
          value={loadCurrent}
          onChange={setLoadCurrent}
          placeholder="Enter current"
        />
        <SegmentedControl options={materialOptions} value={material} onChange={setMaterial} />
        <SelectField
          label="Temperature Rating"
          value={tempRating}
          onChange={v => setTempRating(v as TempRating)}
          options={tempRatingOptions}
        />
        <InputField
          label="Ambient Temperature"
          unit={'°C'}
          value={ambientTemp}
          onChange={setAmbientTemp}
          placeholder="30"
        />
        <InputField
          label="Conductors in Raceway"
          unit=""
          value={conductors}
          onChange={setConductors}
          placeholder="3"
        />
        <SegmentedControl options={loadTypeOptions} value={loadType} onChange={setLoadType} />
        <ResultDisplay results={results} formula={hasInputs ? formula : undefined} title="Feeder OCP" />
        <InfoBox title="CEC Rule 14-104">
          Feeder conductors shall have an allowable ampacity not less than the load to be
          served. For continuous loads, conductors must be sized at 125% of the continuous
          load current. The overcurrent protection device rating shall not exceed the ampacity
          of the conductors being protected.
        </InfoBox>
      </div>
    </>
  )
}
