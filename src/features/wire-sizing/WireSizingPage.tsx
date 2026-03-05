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

export default function WireSizingPage() {
  const [material, setMaterial] = useState('copper')
  const [requiredCurrent, setRequiredCurrent] = useState('')
  const [tempRating, setTempRating] = useState<TempRating>('75')
  const [ambientTemp, setAmbientTemp] = useState('30')
  const [conductors, setConductors] = useState('3')

  const reqCurrent = parseFloat(requiredCurrent)
  const ambTemp = parseFloat(ambientTemp)
  const numConductors = parseFloat(conductors)

  const hasInputs = !isNaN(reqCurrent) && !isNaN(ambTemp) && !isNaN(numConductors) && reqCurrent > 0

  const table = material === 'copper' ? copperAmpacity : aluminumAmpacity
  const availableSizes = wireSizes.filter(s => s in table)

  // Find recommended wire size
  let recommendedSize: string | null = null
  let recommendedAmpacity: number | null = null
  let nextSizeUp: string | null = null
  let nextSizeUpAmpacity: number | null = null

  if (hasInputs) {
    for (let i = 0; i < availableSizes.length; i++) {
      const size = availableSizes[i]
      const corrected = getCorrectedAmpacity(size, material, tempRating, ambTemp, numConductors)
      if (corrected !== null && corrected >= reqCurrent) {
        recommendedSize = size
        recommendedAmpacity = corrected
        // Get next size up
        if (i + 1 < availableSizes.length) {
          nextSizeUp = availableSizes[i + 1]
          nextSizeUpAmpacity = getCorrectedAmpacity(nextSizeUp, material, tempRating, ambTemp, numConductors)
        }
        break
      }
    }
  }

  // Build nearby sizes table
  const nearbySizes: { size: string; ampacity: string }[] = []
  if (hasInputs) {
    let startIdx = 0
    if (recommendedSize) {
      const recIdx = availableSizes.indexOf(recommendedSize)
      startIdx = Math.max(0, recIdx - 2)
    }
    const endIdx = Math.min(availableSizes.length, startIdx + 6)
    for (let i = startIdx; i < endIdx; i++) {
      const size = availableSizes[i]
      const corrected = getCorrectedAmpacity(size, material, tempRating, ambTemp, numConductors)
      nearbySizes.push({
        size: formatSize(size),
        ampacity: corrected !== null ? `${fmt(corrected)} A` : '—',
      })
    }
  }

  const results = hasInputs && recommendedSize !== null
    ? [
        {
          label: 'Recommended Wire Size',
          value: formatSize(recommendedSize),
          highlight: true,
        },
        {
          label: 'Corrected Ampacity',
          value: recommendedAmpacity !== null ? fmt(recommendedAmpacity) : '—',
          unit: 'A',
        },
        ...(nextSizeUp !== null
          ? [{
              label: 'Next Size Up',
              value: `${formatSize(nextSizeUp)}${nextSizeUpAmpacity !== null ? ` (${fmt(nextSizeUpAmpacity)} A)` : ''}`,
            }]
          : []),
      ]
    : hasInputs
      ? [{ label: 'Recommended Wire Size', value: 'No suitable wire found' }]
      : [
          { label: 'Recommended Wire Size', value: '—' },
          { label: 'Corrected Ampacity', value: '—', unit: 'A' },
        ]

  return (
    <>
      <Header title="Wire Sizing" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={materialOptions} value={material} onChange={setMaterial} />
        <InputField
          label="Required Current"
          unit="A"
          value={requiredCurrent}
          onChange={setRequiredCurrent}
          placeholder="Enter current"
        />
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
        <ResultDisplay results={results} title="Wire Sizing" />

        {nearbySizes.length > 0 && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--divider)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              borderBottom: '1px solid var(--divider)',
            }}>
              Nearby Wire Sizes
            </div>
            {nearbySizes.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  fontSize: 14,
                  fontFamily: 'var(--font-mono)',
                  borderBottom: i < nearbySizes.length - 1 ? '1px solid var(--divider)' : undefined,
                  background: row.size === (recommendedSize ? formatSize(recommendedSize) : '')
                    ? 'rgba(var(--primary-rgb, 255,193,7), 0.1)'
                    : undefined,
                  color: row.size === (recommendedSize ? formatSize(recommendedSize) : '')
                    ? 'var(--primary)'
                    : 'var(--text)',
                  fontWeight: row.size === (recommendedSize ? formatSize(recommendedSize) : '') ? 700 : 400,
                }}
              >
                <span>{row.size}</span>
                <span>{row.ampacity}</span>
              </div>
            ))}
          </div>
        )}

        <InfoBox title="CEC Rule 4-006">
          Conductors shall be sized to carry the load current plus any applicable correction
          factors for ambient temperature (Table 5A) and conductor bundling (Table 5C).
          The corrected ampacity of the selected conductor must meet or exceed the required
          load current.
        </InfoBox>
      </div>
    </>
  )
}
