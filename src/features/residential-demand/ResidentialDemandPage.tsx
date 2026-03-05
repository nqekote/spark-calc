import { useState } from 'react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

const yesNoOptions = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
]

const voltageOptions = [
  { value: '240', label: '120/240V Single Phase' },
]

const standardServiceSizes = [60, 100, 125, 150, 200, 225, 300, 400]

function nextServiceSize(amps: number): number {
  for (const size of standardServiceSizes) {
    if (size >= amps) return size
  }
  return Math.ceil(amps / 50) * 50
}

export default function ResidentialDemandPage() {
  const [floorArea, setFloorArea] = useState('')
  const [rangeRating, setRangeRating] = useState('12000')
  const [numApplianceCircuits, setNumApplianceCircuits] = useState('2')
  const [laundryWatts, setLaundryWatts] = useState('1500')
  const [hasWaterHeater, setHasWaterHeater] = useState('no')
  const [waterHeaterWatts, setWaterHeaterWatts] = useState('3000')
  const [hasDryer, setHasDryer] = useState('no')
  const [dryerWatts, setDryerWatts] = useState('5000')
  const [hasAC, setHasAC] = useState('no')
  const [acWatts, setACWatts] = useState('')
  const [hasHeat, setHasHeat] = useState('no')
  const [heatWatts, setHeatWatts] = useState('')
  const [evChargerWatts, setEvChargerWatts] = useState('0')
  const [hotTubWatts, setHotTubWatts] = useState('0')
  const [otherWatts, setOtherWatts] = useState('0')
  const [serviceVoltage, setServiceVoltage] = useState('240')

  const area = parseFloat(floorArea)
  const range = parseFloat(rangeRating)
  const appCircuits = parseFloat(numApplianceCircuits)
  const laundry = parseFloat(laundryWatts)
  const waterHeater = hasWaterHeater === 'yes' ? parseFloat(waterHeaterWatts) : 0
  const dryer = hasDryer === 'yes' ? parseFloat(dryerWatts) : 0
  const ac = hasAC === 'yes' ? parseFloat(acWatts) : 0
  const heat = hasHeat === 'yes' ? parseFloat(heatWatts) : 0
  const evCharger = parseFloat(evChargerWatts) || 0
  const hotTub = parseFloat(hotTubWatts) || 0
  const other = parseFloat(otherWatts) || 0
  const voltage = parseFloat(serviceVoltage)

  const hasArea = !isNaN(area) && area > 0

  // Step 1: General Lighting & Receptacles
  const lightingLoad = hasArea ? area * 75 : NaN
  const applianceLoad = !isNaN(appCircuits) ? appCircuits * 1500 : NaN
  const laundryLoad = !isNaN(laundry) ? laundry : NaN
  const totalLightingRaw = hasArea && !isNaN(applianceLoad) && !isNaN(laundryLoad)
    ? lightingLoad + applianceLoad + laundryLoad
    : NaN

  let lightingDemand = NaN
  if (!isNaN(totalLightingRaw)) {
    const first5000 = Math.min(totalLightingRaw, 5000)
    const remainder = Math.max(totalLightingRaw - 5000, 0)
    lightingDemand = first5000 * 1.0 + remainder * 0.35
  }

  // Step 2: Range demand
  let rangeDemand = NaN
  if (!isNaN(range)) {
    if (range <= 12000) {
      rangeDemand = 6000
    } else {
      rangeDemand = 6000 + (range - 12000) * 0.4
    }
  }

  // Step 3: Fixed appliances (water heater, dryer, etc.)
  const fixedAppliances: { label: string; watts: number }[] = []
  if (waterHeater > 0 && !isNaN(waterHeater)) fixedAppliances.push({ label: 'Water heater', watts: waterHeater })
  if (dryer > 0 && !isNaN(dryer)) fixedAppliances.push({ label: 'Dryer', watts: dryer })
  if (evCharger > 0) fixedAppliances.push({ label: 'EV charger', watts: evCharger })
  if (hotTub > 0) fixedAppliances.push({ label: 'Hot tub / pool heater', watts: hotTub })
  if (other > 0) fixedAppliances.push({ label: 'Other fixed loads', watts: other })

  const fixedDemandFactor = fixedAppliances.length >= 4 ? 0.75 : 1.0
  const fixedTotal = fixedAppliances.reduce((sum, a) => sum + a.watts, 0)
  const fixedDemand = fixedTotal * fixedDemandFactor

  // Step 4: Heating vs Cooling (take the larger)
  const acVal = !isNaN(ac) ? ac : 0
  const heatVal = !isNaN(heat) ? heat : 0
  const hvacDemand = Math.max(acVal, heatVal)
  const hvacLabel = acVal >= heatVal && acVal > 0 ? 'A/C (larger)' : heatVal > 0 ? 'Electric heat (larger)' : 'Heating/Cooling'

  // Total demand
  const canCalculate = !isNaN(lightingDemand) && !isNaN(rangeDemand)
  const totalDemand = canCalculate
    ? lightingDemand + rangeDemand + fixedDemand + hvacDemand
    : NaN

  const serviceCurrent = !isNaN(totalDemand) ? totalDemand / voltage : NaN
  const recommendedSize = !isNaN(serviceCurrent) ? nextServiceSize(Math.ceil(serviceCurrent)) : NaN

  const results = canCalculate
    ? [
        { label: 'General lighting demand', value: fmt(lightingDemand, 0), unit: 'W' },
        { label: 'Range demand', value: fmt(rangeDemand, 0), unit: 'W' },
        ...fixedAppliances.map(a => ({
          label: `${a.label} (${fixedAppliances.length >= 4 ? '75%' : '100%'})`,
          value: fmt(a.watts * fixedDemandFactor, 0),
          unit: 'W',
        })),
        { label: hvacLabel, value: fmt(hvacDemand, 0), unit: 'W' },
        { label: 'TOTAL DEMAND', value: fmt(totalDemand, 0), unit: 'W', highlight: true },
        { label: `Service current @ ${voltage}V`, value: fmt(serviceCurrent, 1), unit: 'A', highlight: true },
        { label: 'Recommended service size', value: `${recommendedSize}`, unit: 'A', highlight: true },
      ]
    : [
        { label: 'General lighting demand', value: '—', unit: 'W' },
        { label: 'Range demand', value: '—', unit: 'W' },
        { label: 'Fixed appliance demand', value: '—', unit: 'W' },
        { label: 'Heating/Cooling demand', value: '—', unit: 'W' },
        { label: 'TOTAL DEMAND', value: '—', unit: 'W' },
        { label: 'Service current', value: '—', unit: 'A' },
        { label: 'Recommended service size', value: '—', unit: 'A' },
      ]

  const formula = canCalculate
    ? `Lighting: first 5000W @ 100% + remainder @ 35% | Range: ≤12kW = 6000W flat | Service: ${fmt(totalDemand, 0)}W ÷ ${voltage}V = ${fmt(serviceCurrent, 1)}A`
    : undefined

  return (
    <>
      <Header title="Residential Demand" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          fontSize: 13, color: 'var(--text-secondary)',
          padding: '8px 12px', background: 'var(--surface)',
          borderRadius: 8, borderLeft: '3px solid var(--primary)',
        }}>
          CEC Rule 8-200 simplified residential service demand calculation
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>
          General Lighting & Area
        </div>
        <InputField
          label="Floor area"
          unit="m²"
          value={floorArea}
          onChange={setFloorArea}
          placeholder="Enter floor area"
        />
        <InputField
          label="Small appliance branch circuits"
          value={numApplianceCircuits}
          onChange={setNumApplianceCircuits}
          placeholder="2"
        />
        <InputField
          label="Laundry circuit"
          unit="W"
          value={laundryWatts}
          onChange={setLaundryWatts}
          placeholder="1500"
        />

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>
          Range
        </div>
        <InputField
          label="Electric range rating"
          unit="W"
          value={rangeRating}
          onChange={setRangeRating}
          placeholder="12000"
        />

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>
          Fixed Appliances
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>Electric water heater?</span>
          <SegmentedControl options={yesNoOptions} value={hasWaterHeater} onChange={setHasWaterHeater} />
        </div>
        {hasWaterHeater === 'yes' && (
          <InputField label="Water heater" unit="W" value={waterHeaterWatts} onChange={setWaterHeaterWatts} placeholder="3000" />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>Electric dryer?</span>
          <SegmentedControl options={yesNoOptions} value={hasDryer} onChange={setHasDryer} />
        </div>
        {hasDryer === 'yes' && (
          <InputField label="Dryer" unit="W" value={dryerWatts} onChange={setDryerWatts} placeholder="5000" />
        )}

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>
          Heating & Cooling
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>Air conditioning?</span>
          <SegmentedControl options={yesNoOptions} value={hasAC} onChange={setHasAC} />
        </div>
        {hasAC === 'yes' && (
          <InputField label="A/C load" unit="W" value={acWatts} onChange={setACWatts} placeholder="Enter watts" />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>Electric heat?</span>
          <SegmentedControl options={yesNoOptions} value={hasHeat} onChange={setHasHeat} />
        </div>
        {hasHeat === 'yes' && (
          <InputField label="Electric heat" unit="W" value={heatWatts} onChange={setHeatWatts} placeholder="Enter watts" />
        )}

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>
          Additional Loads
        </div>
        <InputField
          label="EV charger"
          unit="W"
          value={evChargerWatts}
          onChange={setEvChargerWatts}
          placeholder="0"
        />
        <InputField
          label="Hot tub / pool heater"
          unit="W"
          value={hotTubWatts}
          onChange={setHotTubWatts}
          placeholder="0"
        />
        <InputField
          label="Other fixed loads"
          unit="W"
          value={otherWatts}
          onChange={setOtherWatts}
          placeholder="0"
        />

        <SelectField
          label="Service voltage"
          value={serviceVoltage}
          onChange={setServiceVoltage}
          options={voltageOptions}
        />

        <ResultDisplay results={results} formula={formula} title="Residential Demand" />

        {canCalculate && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: 'rgba(59, 130, 246, 0.12)',
            border: '2px solid var(--primary)',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--primary)',
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            Minimum service: {recommendedSize}A @ {voltage}V
          </div>
        )}

        <InfoBox title="CEC Rule 8-200 — Residential Demand">
          <p>This calculator uses a simplified CEC Rule 8-200 method for estimating residential service demand:</p>
          <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
            <li style={{ marginBottom: 4 }}><strong>General lighting:</strong> Floor area × 75 W/m² + appliance circuits (1500W each) + laundry. First 5000W at 100%, remainder at 35%.</li>
            <li style={{ marginBottom: 4 }}><strong>Range:</strong> Up to 12kW rated = 6000W flat demand. Above 12kW, add 40% of the excess.</li>
            <li style={{ marginBottom: 4 }}><strong>Fixed appliances:</strong> If fewer than 4, apply at 100%. If 4 or more, apply at 75% each.</li>
            <li style={{ marginBottom: 4 }}><strong>Heating/Cooling:</strong> Use the larger of A/C or electric heat at 100%.</li>
            <li style={{ marginBottom: 4 }}><strong>Service current:</strong> Total demand ÷ 240V for single-phase.</li>
          </ul>
          <p style={{ marginTop: 8, fontStyle: 'italic' }}>This is a simplified calculation for exam preparation and estimation purposes. Actual installations should be calculated per the full CEC requirements by a qualified electrician.</p>
        </InfoBox>
      </div>
    </>
  )
}
