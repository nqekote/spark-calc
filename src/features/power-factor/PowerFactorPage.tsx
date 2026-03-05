import { useState } from 'react'
import InputField from '../../components/InputField'
import ResultDisplay from '../../components/ResultDisplay'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

export default function PowerFactorPage() {
  const [realPower, setRealPower] = useState('')
  const [currentPF, setCurrentPF] = useState('')
  const [desiredPF, setDesiredPF] = useState('')

  const kW = parseFloat(realPower)
  const pfOld = parseFloat(currentPF)
  const pfNew = parseFloat(desiredPF)

  const hasInputs =
    !isNaN(kW) &&
    !isNaN(pfOld) &&
    !isNaN(pfNew) &&
    pfOld > 0 &&
    pfOld <= 1 &&
    pfNew > 0 &&
    pfNew <= 1 &&
    pfNew > pfOld

  let currentKVAR = NaN
  let desiredKVAR = NaN
  let requiredKVAR = NaN
  let currentKVA = NaN
  let newKVA = NaN
  let savingsPercent = NaN
  let formula = ''

  if (hasInputs) {
    const thetaOld = Math.acos(pfOld)
    const thetaNew = Math.acos(pfNew)

    currentKVAR = kW * Math.tan(thetaOld)
    desiredKVAR = kW * Math.tan(thetaNew)
    requiredKVAR = kW * (Math.tan(thetaOld) - Math.tan(thetaNew))
    currentKVA = kW / pfOld
    newKVA = kW / pfNew
    savingsPercent = ((currentKVA - newKVA) / currentKVA) * 100

    formula = `Required kVAR = kW × (tan(arccos(PF\₁)) \− tan(arccos(PF\₂))) = ${fmt(kW)} × (${fmt(Math.tan(thetaOld))} \− ${fmt(Math.tan(thetaNew))}) = ${fmt(requiredKVAR)} kVAR`
  }

  const results = hasInputs
    ? [
        { label: 'Current kVAR', value: fmt(currentKVAR), unit: 'kVAR' },
        { label: 'Desired kVAR', value: fmt(desiredKVAR), unit: 'kVAR' },
        { label: 'Required Capacitor', value: fmt(requiredKVAR), unit: 'kVAR', highlight: true },
        { label: 'Current kVA', value: fmt(currentKVA), unit: 'kVA' },
        { label: 'New kVA', value: fmt(newKVA), unit: 'kVA' },
        { label: 'Current Savings', value: fmt(savingsPercent, 1), unit: '%' },
      ]
    : [
        { label: 'Current kVAR', value: '—', unit: 'kVAR' },
        { label: 'Desired kVAR', value: '—', unit: 'kVAR' },
        { label: 'Required Capacitor', value: '—', unit: 'kVAR' },
        { label: 'Current kVA', value: '—', unit: 'kVA' },
        { label: 'New kVA', value: '—', unit: 'kVA' },
        { label: 'Current Savings', value: '—', unit: '%' },
      ]

  return (
    <>
      <Header title="Power Factor Correction" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InputField
          label="Real Power"
          unit="kW"
          value={realPower}
          onChange={setRealPower}
          placeholder="Enter real power"
        />
        <InputField
          label="Current Power Factor"
          unit=""
          value={currentPF}
          onChange={setCurrentPF}
          placeholder="e.g. 0.75"
        />
        <InputField
          label="Desired Power Factor"
          unit=""
          value={desiredPF}
          onChange={setDesiredPF}
          placeholder="e.g. 0.95"
        />
        <ResultDisplay results={results} formula={hasInputs ? formula : undefined} />
        <InfoBox title="Why Power Factor Correction Matters">
          A low power factor means your electrical system draws more current than necessary to
          deliver the same real power. This results in higher utility bills (demand charges),
          increased losses in cables and transformers, and reduced capacity of your electrical
          infrastructure. By adding capacitor banks to offset reactive power, you can raise the
          power factor closer to unity (1.0), reducing apparent power (kVA) and the associated
          costs. Most utilities penalize power factors below 0.90.
        </InfoBox>
      </div>
    </>
  )
}
