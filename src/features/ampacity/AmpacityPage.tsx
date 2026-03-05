import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'
import { useSessionStorage } from '../../core/hooks/useSessionStorage'

type TempRating = '60' | '75' | '90'

const materialOptions = [
  { value: 'copper', label: 'Copper' },
  { value: 'aluminum', label: 'Aluminum' },
]

const wireSizes = [
  '14', '12', '10', '8', '6', '4', '3', '2', '1',
  '1/0', '2/0', '3/0', '4/0',
  '250', '300', '350', '400', '500', '600', '750', '1000',
]

const tempRatingOptions = [
  { value: '60', label: '60\°C' },
  { value: '75', label: '75\°C' },
  { value: '90', label: '90\°C' },
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

export default function AmpacityPage() {
  const [material, setMaterial] = useSessionStorage('amp-material', 'copper')
  const [wireSize, setWireSize] = useSessionStorage('amp-wiresize', '12')
  const [tempRating, setTempRating] = useSessionStorage<TempRating>('amp-temp', '75')
  const [ambientTemp, setAmbientTemp] = useSessionStorage('amp-ambient', '30')
  const [conductors, setConductors] = useSessionStorage('amp-conductors', '3')

  const ambTemp = parseFloat(ambientTemp)
  const numConductors = parseFloat(conductors)

  const table = material === 'copper' ? copperAmpacity : aluminumAmpacity
  const ampacityEntry = table[wireSize]

  const availableSizes = material === 'copper'
    ? wireSizes
    : wireSizes.filter(s => s in aluminumAmpacity)

  const sizeOptions = availableSizes.map(s => ({
    value: s,
    label: s.includes('/') || parseInt(s) >= 250 ? `${s} kcmil` : `${s} AWG`,
  }))

  // Ensure wireSize is valid for the selected material
  const effectiveSize = ampacityEntry ? wireSize : availableSizes[0] || '12'
  if (!ampacityEntry && effectiveSize !== wireSize) {
    // will render with the default on next cycle
  }

  const ratingIdx = getTempRatingIndex(tempRating)
  const baseAmpacity = ampacityEntry ? ampacityEntry[ratingIdx] : null

  const hasInputs = !isNaN(ambTemp) && !isNaN(numConductors) && baseAmpacity !== null
  const tempFactor = hasInputs ? getTempCorrectionFactor(ambTemp, tempRating) : null
  const bundleFactor = hasInputs ? getBundlingFactor(Math.round(numConductors)) : null

  const correctedAmpacity = baseAmpacity !== null && tempFactor !== null && bundleFactor !== null
    ? baseAmpacity * tempFactor * bundleFactor
    : null

  const formula = correctedAmpacity !== null && baseAmpacity !== null && tempFactor !== null && bundleFactor !== null
    ? `Corrected = ${baseAmpacity} A × ${fmt(tempFactor)} × ${fmt(bundleFactor)} = ${fmt(correctedAmpacity)} A`
    : undefined

  const results = baseAmpacity !== null
    ? [
        { label: 'Base Ampacity', value: fmt(baseAmpacity), unit: 'A' },
        { label: 'Temp Correction Factor', value: tempFactor !== null ? fmt(tempFactor) : '—' },
        { label: 'Bundling Derating Factor', value: bundleFactor !== null ? fmt(bundleFactor) : '—' },
        {
          label: 'Corrected Ampacity',
          value: correctedAmpacity !== null ? fmt(correctedAmpacity) : '—',
          unit: 'A',
          highlight: true,
        },
      ]
    : [
        { label: 'Base Ampacity', value: '—', unit: 'A' },
        { label: 'Temp Correction Factor', value: '—' },
        { label: 'Bundling Derating Factor', value: '—' },
        { label: 'Corrected Ampacity', value: '—', unit: 'A' },
      ]

  return (
    <>
      <Header title="CEC Ampacity" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={materialOptions} value={material} onChange={setMaterial} />
        <SelectField
          label="Wire Size"
          value={effectiveSize}
          onChange={v => setWireSize(v)}
          options={sizeOptions}
        />
        <SelectField
          label="Temperature Rating"
          value={tempRating}
          onChange={v => setTempRating(v as TempRating)}
          options={tempRatingOptions}
        />
        <InputField
          label="Ambient Temperature"
          unit="\°C"
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
        <ResultDisplay results={results} formula={formula} />
        <InfoBox title="CEC Tables 2/4, 5A, 5C">
          Ampacity is based on a 30\°C ambient temperature with not more than 3 current-carrying
          conductors in a raceway. When conditions differ, correction factors from Table 5A
          (temperature) and Table 5C (bundling/grouping) must be applied. The corrected ampacity
          is the base value multiplied by both factors.
        </InfoBox>
      </div>
    </>
  )
}
