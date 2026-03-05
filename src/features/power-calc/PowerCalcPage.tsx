import InputField from '../../components/InputField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'
import { useSessionStorage } from '../../core/hooks/useSessionStorage'

const phaseOptions = [
  { value: 'single', label: 'Single Phase' },
  { value: 'three', label: 'Three Phase' },
]

export default function PowerCalcPage() {
  const [phase, setPhase] = useSessionStorage('pwr-phase', 'single')
  const [voltage, setVoltage] = useSessionStorage('pwr-voltage', '')
  const [current, setCurrent] = useSessionStorage('pwr-current', '')
  const [pf, setPf] = useSessionStorage('pwr-pf', '1.0')

  const V = parseFloat(voltage)
  const I = parseFloat(current)
  const PF = parseFloat(pf)
  const hasInputs = !isNaN(V) && !isNaN(I) && !isNaN(PF)

  let watts = NaN
  let va = NaN
  let kva = NaN
  let kw = NaN
  let formula = ''

  if (hasInputs) {
    const multiplier = phase === 'three' ? Math.sqrt(3) : 1

    va = V * I * multiplier
    watts = V * I * PF * multiplier
    kva = va / 1000
    kw = watts / 1000

    if (phase === 'single') {
      formula = `W = V × I × PF = ${fmt(V)} × ${fmt(I)} × ${fmt(PF)} = ${fmt(watts)} W`
    } else {
      formula = `W = V × I × PF × √3 = ${fmt(V)} × ${fmt(I)} × ${fmt(PF)} × 1.732 = ${fmt(watts)} W`
    }
  }

  const results = hasInputs
    ? [
        { label: 'Watts', value: fmt(watts), unit: 'W', highlight: true },
        { label: 'Volt-Amps', value: fmt(va), unit: 'VA' },
        { label: 'Kilowatts', value: fmt(kw, 3), unit: 'kW' },
        { label: 'Kilo Volt-Amps', value: fmt(kva, 3), unit: 'kVA' },
      ]
    : [
        { label: 'Watts', value: '—', unit: 'W' },
        { label: 'Volt-Amps', value: '—', unit: 'VA' },
        { label: 'Kilowatts', value: '—', unit: 'kW' },
        { label: 'Kilo Volt-Amps', value: '—', unit: 'kVA' },
      ]

  return (
    <>
      <Header title="Power Calculator" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={phaseOptions} value={phase} onChange={setPhase} />
        <InputField
          label="Voltage"
          unit="V"
          value={voltage}
          onChange={setVoltage}
          placeholder="Enter voltage"
        />
        <InputField
          label="Current"
          unit="A"
          value={current}
          onChange={setCurrent}
          placeholder="Enter current"
        />
        <InputField
          label="Power Factor"
          unit=""
          value={pf}
          onChange={setPf}
          placeholder="0.0 - 1.0"
        />
        <ResultDisplay results={results} formula={hasInputs ? formula : undefined} title="Power Calc" />
      </div>
    </>
  )
}
