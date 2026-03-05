import InputField from '../../components/InputField'
import ResultDisplay from '../../components/ResultDisplay'
import SegmentedControl from '../../components/SegmentedControl'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'
import { useSessionStorage } from '../../core/hooks/useSessionStorage'

type SolveFor = 'V' | 'I' | 'R' | 'P'

const solveOptions: { value: SolveFor; label: string }[] = [
  { value: 'V', label: 'Voltage' },
  { value: 'I', label: 'Current' },
  { value: 'R', label: 'Resistance' },
  { value: 'P', label: 'Power' },
]

function getInputLabels(solveFor: SolveFor): { label1: string; unit1: string; label2: string; unit2: string } {
  switch (solveFor) {
    case 'V':
      return { label1: 'Current (I)', unit1: 'A', label2: 'Resistance (R)', unit2: '\Ω' }
    case 'I':
      return { label1: 'Voltage (V)', unit1: 'V', label2: 'Resistance (R)', unit2: '\Ω' }
    case 'R':
      return { label1: 'Voltage (V)', unit1: 'V', label2: 'Current (I)', unit2: 'A' }
    case 'P':
      return { label1: 'Voltage (V)', unit1: 'V', label2: 'Current (I)', unit2: 'A' }
  }
}

function calculate(solveFor: SolveFor, val1: number, val2: number) {
  let voltage: number | null = null
  let current: number | null = null
  let resistance: number | null = null
  let power: number | null = null
  let formula = ''

  switch (solveFor) {
    case 'V': {
      const I = val1
      const R = val2
      voltage = I * R
      current = I
      resistance = R
      power = I * I * R
      formula = `V = I \× R = ${fmt(I)} \× ${fmt(R)} = ${fmt(voltage)} V`
      break
    }
    case 'I': {
      const V = val1
      const R = val2
      if (R === 0) return null
      voltage = V
      resistance = R
      current = V / R
      power = V * V / R
      formula = `I = V / R = ${fmt(V)} / ${fmt(R)} = ${fmt(current)} A`
      break
    }
    case 'R': {
      const V = val1
      const I = val2
      if (I === 0) return null
      voltage = V
      current = I
      resistance = V / I
      power = V * I
      formula = `R = V / I = ${fmt(V)} / ${fmt(I)} = ${fmt(resistance)} \Ω`
      break
    }
    case 'P': {
      const V = val1
      const I = val2
      voltage = V
      current = I
      resistance = I !== 0 ? V / I : null
      power = V * I
      formula = `P = V \× I = ${fmt(V)} \× ${fmt(I)} = ${fmt(power)} W`
      break
    }
  }

  return { voltage, current, resistance, power, formula }
}

export default function OhmsLawPage() {
  const [solveFor, setSolveFor] = useSessionStorage<SolveFor>('ohms-solve', 'V')
  const [input1, setInput1] = useSessionStorage('ohms-in1', '')
  const [input2, setInput2] = useSessionStorage('ohms-in2', '')

  const labels = getInputLabels(solveFor)
  const v1 = parseFloat(input1)
  const v2 = parseFloat(input2)
  const hasInputs = !isNaN(v1) && !isNaN(v2)
  const result = hasInputs ? calculate(solveFor, v1, v2) : null

  const results = result
    ? [
        {
          label: 'Voltage',
          value: result.voltage != null ? fmt(result.voltage) : '\—',
          unit: 'V',
          highlight: solveFor === 'V',
        },
        {
          label: 'Current',
          value: result.current != null ? fmt(result.current) : '\—',
          unit: 'A',
          highlight: solveFor === 'I',
        },
        {
          label: 'Resistance',
          value: result.resistance != null ? fmt(result.resistance) : '\—',
          unit: '\Ω',
          highlight: solveFor === 'R',
        },
        {
          label: 'Power',
          value: result.power != null ? fmt(result.power) : '\—',
          unit: 'W',
          highlight: solveFor === 'P',
        },
      ]
    : [
        { label: 'Voltage', value: '\—', unit: 'V' },
        { label: 'Current', value: '\—', unit: 'A' },
        { label: 'Resistance', value: '\—', unit: '\Ω' },
        { label: 'Power', value: '\—', unit: 'W' },
      ]

  const handleSolveChange = (v: string) => {
    setSolveFor(v as SolveFor)
    setInput1('')
    setInput2('')
  }

  return (
    <>
      <Header title="Ohm's Law" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SegmentedControl options={solveOptions} value={solveFor} onChange={handleSolveChange} />
        <InputField
          label={labels.label1}
          unit={labels.unit1}
          value={input1}
          onChange={setInput1}
          placeholder="Enter value"
        />
        <InputField
          label={labels.label2}
          unit={labels.unit2}
          value={input2}
          onChange={setInput2}
          placeholder="Enter value"
        />
        <ResultDisplay results={results} formula={result?.formula} />
      </div>
    </>
  )
}
