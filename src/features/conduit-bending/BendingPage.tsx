import { useState } from 'react'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'
import ResultDisplay from '../../components/ResultDisplay'
import InfoBox from '../../components/InfoBox'
import Header from '../../layout/Header'
import { fmt } from '../../core/utils/formatters'

type BendType = 'offset' | '3pt' | '4pt' | 'stub' | 'back' | 'kick' | 'rolling'

const bendTabs: { value: BendType; label: string }[] = [
  { value: 'offset', label: 'Offset' },
  { value: '3pt', label: '3pt Saddle' },
  { value: '4pt', label: '4pt Saddle' },
  { value: 'stub', label: '90° Stub' },
  { value: 'back', label: 'Back-to-Back' },
  { value: 'kick', label: 'Kick' },
  { value: 'rolling', label: 'Rolling Offset' },
]

const angleOptions = [
  { value: '10', label: '10°' },
  { value: '15', label: '15°' },
  { value: '22.5', label: '22.5°' },
  { value: '30', label: '30°' },
  { value: '45', label: '45°' },
  { value: '60', label: '60°' },
]

const multipliers: Record<string, number> = {
  '10': 5.759, '15': 3.864, '22.5': 2.613, '30': 2.0, '45': 1.414, '60': 1.155,
}

const shrinkagePerInch: Record<string, number> = {
  '10': 1 / 16, '15': 1 / 8, '22.5': 3 / 16, '30': 1 / 4, '45': 3 / 8, '60': 1 / 2,
}

const pipeSizeOptions = [
  { value: '0.5', label: '1/2"' },
  { value: '0.75', label: '3/4"' },
  { value: '1', label: '1"' },
  { value: '1.25', label: '1-1/4"' },
]

const deducts: Record<string, number> = {
  '0.5': 5, '0.75': 6, '1': 8, '1.25': 11,
}

/* ---------- SVG diagrams ---------- */

function OffsetSVG({ height, spacing }: { height: string; spacing: string }) {
  return (
    <svg viewBox="0 0 300 160" style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto' }}>
      {/* conduit */}
      <path d="M20 130 L100 130 L150 50 L250 50" fill="none" stroke="#ffd700" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {/* dimension: offset height */}
      <line x1={260} y1={50} x2={260} y2={130} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={255} y1={50} x2={265} y2={50} stroke="#fff" strokeWidth={1.5} />
      <line x1={255} y1={130} x2={265} y2={130} stroke="#fff" strokeWidth={1.5} />
      <text x={270} y={95} fill="#fff" fontSize={11} textAnchor="start">{height || '?'}"</text>
      {/* mark positions */}
      <circle cx={100} cy={130} r={4} fill="#ff4444" />
      <circle cx={150} cy={50} r={4} fill="#ff4444" />
      <line x1={100} y1={140} x2={150} y2={140} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <text x={125} y={155} fill="#fff" fontSize={10} textAnchor="middle">{spacing || '?'}"</text>
      {/* labels */}
      <text x={90} y={122} fill="#ff4444" fontSize={9} textAnchor="end">Mark 1</text>
      <text x={160} y={45} fill="#ff4444" fontSize={9}>Mark 2</text>
    </svg>
  )
}

function ThreePointSVG({ height }: { height: string }) {
  return (
    <svg viewBox="0 0 300 140" style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto' }}>
      <path d="M20 100 L80 100 L110 40 L150 100 L200 100 L260 100" fill="none" stroke="#ffd700" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {/* obstacle */}
      <rect x={95} y={65} width={30} height={50} rx={4} fill="none" stroke="#666" strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={110} y={90} fill="#666" fontSize={8} textAnchor="middle">pipe</text>
      {/* marks */}
      <circle cx={80} cy={100} r={3.5} fill="#ff4444" />
      <circle cx={110} cy={40} r={3.5} fill="#ff4444" />
      <circle cx={150} cy={100} r={3.5} fill="#ff4444" />
      {/* height dim */}
      <line x1={50} y1={40} x2={50} y2={100} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={45} y1={40} x2={55} y2={40} stroke="#fff" strokeWidth={1.5} />
      <line x1={45} y1={100} x2={55} y2={100} stroke="#fff" strokeWidth={1.5} />
      <text x={35} y={75} fill="#fff" fontSize={10} textAnchor="end">{height || '?'}"</text>
      {/* labels */}
      <text x={110} y={30} fill="#ff4444" fontSize={9} textAnchor="middle">45° center</text>
      <text x={68} y={118} fill="#ff4444" fontSize={9} textAnchor="middle">22.5°</text>
      <text x={162} y={118} fill="#ff4444" fontSize={9} textAnchor="middle">22.5°</text>
    </svg>
  )
}

function FourPointSVG({ height }: { height: string }) {
  return (
    <svg viewBox="0 0 300 140" style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto' }}>
      <path d="M10 100 L60 100 L85 45 L130 45 L155 100 L220 100 L280 100" fill="none" stroke="#ffd700" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {/* obstacle */}
      <rect x={85} y={55} width={45} height={60} rx={4} fill="none" stroke="#666" strokeWidth={1.5} strokeDasharray="4 3" />
      {/* marks */}
      <circle cx={60} cy={100} r={3.5} fill="#ff4444" />
      <circle cx={85} cy={45} r={3.5} fill="#ff4444" />
      <circle cx={130} cy={45} r={3.5} fill="#ff4444" />
      <circle cx={155} cy={100} r={3.5} fill="#ff4444" />
      {/* height */}
      <line x1={40} y1={45} x2={40} y2={100} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={35} y1={45} x2={45} y2={45} stroke="#fff" strokeWidth={1.5} />
      <line x1={35} y1={100} x2={45} y2={100} stroke="#fff" strokeWidth={1.5} />
      <text x={28} y={78} fill="#fff" fontSize={10} textAnchor="end">{height || '?'}"</text>
      {/* labels */}
      <text x={60} y={118} fill="#ff4444" fontSize={9} textAnchor="middle">Outer</text>
      <text x={85} y={38} fill="#ff4444" fontSize={9} textAnchor="middle">Inner</text>
      <text x={130} y={38} fill="#ff4444" fontSize={9} textAnchor="middle">Inner</text>
      <text x={155} y={118} fill="#ff4444" fontSize={9} textAnchor="middle">Outer</text>
    </svg>
  )
}

function StubSVG({ stubHeight, markPos }: { stubHeight: string; markPos: string }) {
  return (
    <svg viewBox="0 0 300 180" style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto' }}>
      {/* conduit */}
      <path d="M30 160 L120 160 L120 30" fill="none" stroke="#ffd700" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {/* stub height */}
      <line x1={140} y1={30} x2={140} y2={160} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={135} y1={30} x2={145} y2={30} stroke="#fff" strokeWidth={1.5} />
      <line x1={135} y1={160} x2={145} y2={160} stroke="#fff" strokeWidth={1.5} />
      <text x={150} y={100} fill="#fff" fontSize={11}>{stubHeight || '?'}"</text>
      {/* mark */}
      <circle cx={80} cy={160} r={4} fill="#ff4444" />
      <text x={80} y={150} fill="#ff4444" fontSize={9} textAnchor="middle">Mark at {markPos || '?'}"</text>
      {/* floor line */}
      <line x1={15} y1={165} x2={200} y2={165} stroke="#666" strokeWidth={1} strokeDasharray="3 3" />
      <text x={200} y={175} fill="#666" fontSize={9}>floor</text>
    </svg>
  )
}

function BackToBackSVG({ dist }: { dist: string }) {
  return (
    <svg viewBox="0 0 300 180" style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto' }}>
      {/* U-shape conduit */}
      <path d="M60 20 L60 140 L220 140 L220 20" fill="none" stroke="#ffd700" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {/* distance between stubs */}
      <line x1={60} y1={10} x2={220} y2={10} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={60} y1={5} x2={60} y2={15} stroke="#fff" strokeWidth={1.5} />
      <line x1={220} y1={5} x2={220} y2={15} stroke="#fff" strokeWidth={1.5} />
      <text x={140} y={8} fill="#fff" fontSize={11} textAnchor="middle">{dist || '?'}"</text>
      {/* marks */}
      <circle cx={60} cy={60} r={4} fill="#ff4444" />
      <circle cx={220} cy={60} r={4} fill="#ff4444" />
      <text x={45} y={58} fill="#ff4444" fontSize={9} textAnchor="end">1st</text>
      <text x={235} y={58} fill="#ff4444" fontSize={9}>2nd</text>
    </svg>
  )
}

function KickSVG() {
  return (
    <svg viewBox="0 0 300 180" style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto' }}>
      {/* conduit with kick bend then 90 */}
      <path d="M20 160 L80 160 L130 100 L130 30" fill="none" stroke="#ffd700" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {/* kick height */}
      <line x1={145} y1={100} x2={145} y2={160} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={140} y1={160} x2={150} y2={160} stroke="#fff" strokeWidth={1.5} />
      <line x1={140} y1={100} x2={150} y2={100} stroke="#fff" strokeWidth={1.5} />
      <text x={155} y={135} fill="#fff" fontSize={10}>kick</text>
      {/* stub height */}
      <line x1={160} y1={30} x2={160} y2={100} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={155} y1={30} x2={165} y2={30} stroke="#fff" strokeWidth={1.5} />
      <line x1={155} y1={100} x2={165} y2={100} stroke="#fff" strokeWidth={1.5} />
      <text x={170} y={70} fill="#fff" fontSize={10}>stub</text>
      {/* marks */}
      <circle cx={80} cy={160} r={4} fill="#ff4444" />
      <circle cx={130} cy={100} r={4} fill="#ff4444" />
    </svg>
  )
}

function RollingOffsetSVG({ h, v }: { h: string; v: string }) {
  return (
    <svg viewBox="0 0 300 180" style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto' }}>
      {/* 3D perspective conduit path */}
      <path d="M30 150 L90 150 L200 50 L270 50" fill="none" stroke="#ffd700" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {/* vertical offset */}
      <line x1={250} y1={50} x2={250} y2={150} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={245} y1={50} x2={255} y2={50} stroke="#fff" strokeWidth={1.5} />
      <line x1={245} y1={150} x2={255} y2={150} stroke="#fff" strokeWidth={1.5} />
      <text x={260} y={105} fill="#fff" fontSize={10}>{v || 'V'}"</text>
      {/* horizontal offset */}
      <line x1={90} y1={165} x2={200} y2={165} stroke="#fff" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={90} y1={160} x2={90} y2={170} stroke="#fff" strokeWidth={1.5} />
      <line x1={200} y1={160} x2={200} y2={170} stroke="#fff" strokeWidth={1.5} />
      <text x={145} y={178} fill="#fff" fontSize={10} textAnchor="middle">{h || 'H'}"</text>
      {/* hypotenuse label */}
      <text x={130} y={85} fill="#ffd700" fontSize={10} textAnchor="middle" transform="rotate(-42,130,85)">true offset</text>
    </svg>
  )
}

/* ---------- Bend calculators ---------- */

function OffsetCalc() {
  const [height, setHeight] = useState('')
  const [angle, setAngle] = useState('30')

  const h = parseFloat(height)
  const m = multipliers[angle]
  const s = shrinkagePerInch[angle]

  const dist = !isNaN(h) ? h * m : NaN
  const shrink = !isNaN(h) ? h * s : NaN
  const travel = !isNaN(h) ? h / Math.sin((parseFloat(angle) * Math.PI) / 180) : NaN

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <OffsetSVG height={height} spacing={!isNaN(dist) ? fmt(dist) : ''} />
      <InputField label="Offset Height" unit="in" value={height} onChange={setHeight} placeholder="e.g. 6" />
      <SelectField label="Bend Angle" value={angle} onChange={setAngle} options={angleOptions} />
      <ResultDisplay
        results={[
          { label: 'Distance Between Marks', value: !isNaN(dist) ? fmt(dist) : '—', unit: 'in', highlight: true },
          { label: 'Shrinkage', value: !isNaN(shrink) ? fmt(shrink, 3) : '—', unit: 'in' },
          { label: 'Travel (Conduit Used)', value: !isNaN(travel) ? fmt(travel) : '—', unit: 'in' },
        ]}
        formula={!isNaN(dist) ? `${height}" × ${m} = ${fmt(dist)}"` : undefined}
      />
      <InfoBox title="Offset Bending">
        <p>An offset bend moves the conduit to a different plane while keeping it parallel. The multiplier converts the offset height to the distance between bend marks on the conduit.</p>
        <p style={{ marginTop: 8 }}>Shrinkage is the amount the conduit "loses" in overall length due to the bends. Add the shrinkage to your measurements to compensate.</p>
      </InfoBox>
    </div>
  )
}

function ThreePointSaddleCalc() {
  const [height, setHeight] = useState('')
  const [pipeSize, setPipeSize] = useState('0.5')

  const h = parseFloat(height)
  const markSpacing = !isNaN(h) ? h * 2.613 : NaN
  const shrink = !isNaN(h) ? h * (3 / 8) : NaN

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ThreePointSVG height={height} />
      <InputField label="Saddle Height" unit="in" value={height} onChange={setHeight} placeholder="e.g. 4" />
      <SelectField label="Pipe Size" value={pipeSize} onChange={setPipeSize} options={pipeSizeOptions} />
      <ResultDisplay
        results={[
          { label: 'Mark Spacing from Center', value: !isNaN(markSpacing) ? fmt(markSpacing) : '—', unit: 'in', highlight: true },
          { label: 'Total Shrinkage', value: !isNaN(shrink) ? fmt(shrink, 3) : '—', unit: 'in' },
          { label: 'Center Bend', value: '45°', unit: '' },
          { label: 'Outer Bends', value: '22.5°', unit: '' },
        ]}
        formula={!isNaN(markSpacing) ? `${height}" × 2.613 = ${fmt(markSpacing)}"` : undefined}
      />
      <InfoBox title="3-Point Saddle">
        <p>A 3-point saddle bends the conduit over an obstacle. The center bend is 45° and the two outer bends are 22.5° each. Mark the center of the obstacle on the conduit, then measure outward in both directions by the calculated mark spacing.</p>
      </InfoBox>
    </div>
  )
}

function FourPointSaddleCalc() {
  const [height, setHeight] = useState('')
  const [angle, setAngle] = useState('22.5')

  const h = parseFloat(height)
  const m = multipliers[angle]
  const s = shrinkagePerInch[angle]
  const outerSpacing = !isNaN(h) ? h * m : NaN
  const innerSpacing = !isNaN(h) ? h * m : NaN
  const shrink = !isNaN(h) ? h * s * 2 : NaN

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FourPointSVG height={height} />
      <InputField label="Saddle Height" unit="in" value={height} onChange={setHeight} placeholder="e.g. 3" />
      <SelectField
        label="Bend Angle"
        value={angle}
        onChange={setAngle}
        options={[
          { value: '22.5', label: '22.5°' },
          { value: '30', label: '30°' },
        ]}
      />
      <ResultDisplay
        results={[
          { label: 'Outer Mark Spacing', value: !isNaN(outerSpacing) ? fmt(outerSpacing) : '—', unit: 'in', highlight: true },
          { label: 'Inner Mark Spacing', value: !isNaN(innerSpacing) ? fmt(innerSpacing) : '—', unit: 'in' },
          { label: 'Total Shrinkage', value: !isNaN(shrink) ? fmt(shrink, 3) : '—', unit: 'in' },
        ]}
        formula={!isNaN(outerSpacing) ? `${height}" × ${m} = ${fmt(outerSpacing)}"` : undefined}
      />
      <InfoBox title="4-Point Saddle">
        <p>A 4-point saddle uses four equal bends to raise the conduit over a wide obstacle and bring it back down. All four bends are at the same angle. Mark the center of the obstacle, then measure outward for the inner and outer marks using the calculated spacing.</p>
      </InfoBox>
    </div>
  )
}

function StubUpCalc() {
  const [stubHeight, setStubHeight] = useState('')
  const [pipeSize, setPipeSize] = useState('0.5')

  const h = parseFloat(stubHeight)
  const deduct = deducts[pipeSize]
  const markPos = !isNaN(h) ? h - deduct : NaN

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StubSVG stubHeight={stubHeight} markPos={!isNaN(markPos) ? fmt(markPos) : ''} />
      <InputField label="Desired Stub Height" unit="in" value={stubHeight} onChange={setStubHeight} placeholder="e.g. 12" />
      <SelectField label="Pipe Size" value={pipeSize} onChange={setPipeSize} options={pipeSizeOptions} />
      <ResultDisplay
        results={[
          { label: 'Mark Position from End', value: !isNaN(markPos) && markPos > 0 ? fmt(markPos) : markPos <= 0 ? 'Too short' : '—', unit: markPos > 0 ? 'in' : '', highlight: true },
          { label: 'Deduct', value: fmt(deduct), unit: 'in' },
        ]}
        formula={!isNaN(markPos) && markPos > 0 ? `${stubHeight}" − ${deduct}" = ${fmt(markPos)}"` : undefined}
      />
      <InfoBox title="90° Stub-Up">
        <p>A stub-up is a 90° bend where the conduit goes from horizontal to vertical. The deduct accounts for the bend radius which adds to the stub height. Subtract the deduct from your desired stub height to find where to place your bender's mark.</p>
        <p style={{ marginTop: 8 }}>Deducts: 1/2"=5", 3/4"=6", 1"=8", 1-1/4"=11"</p>
      </InfoBox>
    </div>
  )
}

function BackToBackCalc() {
  const [distance, setDistance] = useState('')
  const [pipeSize, setPipeSize] = useState('0.5')

  const d = parseFloat(distance)
  const deduct = deducts[pipeSize]
  const secondMark = !isNaN(d) ? d - deduct : NaN

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BackToBackSVG dist={distance} />
      <InputField label="Distance Between Stubs" unit="in" value={distance} onChange={setDistance} placeholder="e.g. 24" />
      <SelectField label="Pipe Size" value={pipeSize} onChange={setPipeSize} options={pipeSizeOptions} />
      <ResultDisplay
        results={[
          { label: 'Second Bend Mark', value: !isNaN(secondMark) && secondMark > 0 ? fmt(secondMark) : secondMark <= 0 ? 'Too short' : '—', unit: secondMark > 0 ? 'in' : '', highlight: true },
          { label: 'Deduct per Bend', value: fmt(deduct), unit: 'in' },
        ]}
        formula={!isNaN(secondMark) && secondMark > 0 ? `${distance}" − ${deduct}" = ${fmt(secondMark)}"` : undefined}
      />
      <InfoBox title="Back-to-Back 90°">
        <p>A back-to-back bend creates a U-shape with two 90° bends. Make the first stub-up normally. For the second bend, measure from the end of the first stub and subtract the deduct to place the second mark.</p>
      </InfoBox>
    </div>
  )
}

function KickCalc() {
  const [kickHeight, setKickHeight] = useState('')
  const [stubHeight, setStubHeight] = useState('')
  const [pipeSize, setPipeSize] = useState('0.5')

  const kh = parseFloat(kickHeight)
  const sh = parseFloat(stubHeight)
  const deduct = deducts[pipeSize]

  // Calculate kick angle using arctangent
  const hasInputs = !isNaN(kh) && !isNaN(sh) && sh > 0
  const kickAngle = hasInputs ? Math.atan(kh / sh) * (180 / Math.PI) : NaN
  const travel = hasInputs ? Math.sqrt(kh * kh + sh * sh) : NaN
  const stubMark = !isNaN(sh) ? sh - deduct : NaN

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <KickSVG />
      <InputField label="Kick Height" unit="in" value={kickHeight} onChange={setKickHeight} placeholder="e.g. 6" />
      <InputField label="Stub Height" unit="in" value={stubHeight} onChange={setStubHeight} placeholder="e.g. 12" />
      <SelectField label="Pipe Size" value={pipeSize} onChange={setPipeSize} options={pipeSizeOptions} />
      <ResultDisplay
        results={[
          { label: 'Kick Angle', value: !isNaN(kickAngle) ? fmt(kickAngle, 1) : '—', unit: '°', highlight: true },
          { label: 'Stub Mark from End', value: !isNaN(stubMark) && stubMark > 0 ? fmt(stubMark) : '—', unit: 'in' },
          { label: 'Travel Length', value: !isNaN(travel) ? fmt(travel) : '—', unit: 'in' },
          { label: 'Deduct', value: fmt(deduct), unit: 'in' },
        ]}
        formula={hasInputs ? `Kick angle = atan(${kickHeight}" / ${stubHeight}") = ${fmt(kickAngle, 1)}°` : undefined}
      />
      <InfoBox title="Kick 90°">
        <p>A kick bend combines an offset with a 90° stub-up. This lets you stub up and simultaneously shift the conduit over horizontally. The kick angle is calculated from the desired horizontal offset (kick height) and the stub height.</p>
      </InfoBox>
    </div>
  )
}

function RollingOffsetCalc() {
  const [horizontal, setHorizontal] = useState('')
  const [vertical, setVertical] = useState('')
  const [angle, setAngle] = useState('30')

  const h = parseFloat(horizontal)
  const v = parseFloat(vertical)
  const m = multipliers[angle]
  const s = shrinkagePerInch[angle]

  const rollingOffset = !isNaN(h) && !isNaN(v) ? Math.sqrt(h * h + v * v) : NaN
  const dist = !isNaN(rollingOffset) ? rollingOffset * m : NaN
  const shrink = !isNaN(rollingOffset) ? rollingOffset * s : NaN

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RollingOffsetSVG h={horizontal} v={vertical} />
      <InputField label="Horizontal Offset" unit="in" value={horizontal} onChange={setHorizontal} placeholder="e.g. 8" />
      <InputField label="Vertical Offset" unit="in" value={vertical} onChange={setVertical} placeholder="e.g. 6" />
      <SelectField label="Bend Angle" value={angle} onChange={setAngle} options={angleOptions} />
      <ResultDisplay
        results={[
          { label: 'True Offset (Hypotenuse)', value: !isNaN(rollingOffset) ? fmt(rollingOffset) : '—', unit: 'in', highlight: true },
          { label: 'Distance Between Marks', value: !isNaN(dist) ? fmt(dist) : '—', unit: 'in' },
          { label: 'Shrinkage', value: !isNaN(shrink) ? fmt(shrink, 3) : '—', unit: 'in' },
        ]}
        formula={!isNaN(rollingOffset) ? `√(${horizontal}² + ${vertical}²) = ${fmt(rollingOffset)}" × ${m} = ${fmt(dist)}"` : undefined}
      />
      <InfoBox title="Rolling Offset">
        <p>A rolling offset moves the conduit both horizontally and vertically at the same time. First calculate the true offset (hypotenuse) from the horizontal and vertical offsets, then apply the standard offset multiplier for your chosen bend angle.</p>
      </InfoBox>
    </div>
  )
}

/* ---------- Main page ---------- */

export default function BendingPage() {
  const [bendType, setBendType] = useState<BendType>('offset')

  const renderCalc = () => {
    switch (bendType) {
      case 'offset': return <OffsetCalc />
      case '3pt': return <ThreePointSaddleCalc />
      case '4pt': return <FourPointSaddleCalc />
      case 'stub': return <StubUpCalc />
      case 'back': return <BackToBackCalc />
      case 'kick': return <KickCalc />
      case 'rolling': return <RollingOffsetCalc />
    }
  }

  return (
    <>
      <Header title="Conduit Bending" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Horizontal scrolling tab bar */}
        <div style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          margin: '0 -16px',
          padding: '0 16px',
        }}>
          <div style={{
            display: 'flex', gap: 6,
            background: 'var(--input-bg)',
            borderRadius: 'var(--radius-sm)',
            padding: 4,
            minWidth: 'max-content',
          }}>
            {bendTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setBendType(tab.value)}
                style={{
                  minHeight: 56,
                  padding: '8px 14px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: bendType === tab.value ? 'var(--primary)' : 'transparent',
                  color: bendType === tab.value ? '#000' : 'var(--text-secondary)',
                  transition: 'all .15s',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {renderCalc()}
      </div>
    </>
  )
}
