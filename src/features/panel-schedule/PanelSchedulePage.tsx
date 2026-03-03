import { useState, useEffect, useMemo, useCallback } from 'react'
import Header from '../../layout/Header'

interface Circuit {
  id: string
  circuitNumber: number
  breakerSize: number
  description: string
  load: number
  loadUnit: 'watts' | 'amps'
  poles: 1 | 2 | 3
}

interface Panel {
  id: string
  name: string
  mainBreaker: number
  voltage: string
  busRating: number
  phases: 'single' | 'three'
  maxCircuits: number
  circuits: Circuit[]
}

const STORAGE_KEY = 'sparkCalc_panels'
const BREAKER_SIZES = [15, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const MAIN_SIZES = [100, 125, 200, 225, 400, 600]
const VOLTAGE_OPTIONS = ['120/240', '120/208', '347/600']
const PHASE_OPTIONS: { value: 'single' | 'three'; label: string }[] = [
  { value: 'single', label: 'Single Phase' },
  { value: 'three', label: 'Three Phase' },
]

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function loadPanels(): Panel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePanels(panels: Panel[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(panels))
}

function getNextCircuitNumber(circuits: Circuit[], phases: 'single' | 'three', poles: number): number {
  const used = new Set<number>()
  for (const c of circuits) {
    for (let p = 0; p < c.poles; p++) {
      used.add(c.circuitNumber + p * 2)
    }
  }
  // Try odd numbers first (left side), then even (right side)
  const maxSlots = phases === 'three' ? 42 : 40
  for (let n = 1; n <= maxSlots; n += 2) {
    let fits = true
    for (let p = 0; p < poles; p++) {
      if (used.has(n + p * 2)) { fits = false; break }
    }
    if (fits && n + (poles - 1) * 2 <= maxSlots) return n
  }
  for (let n = 2; n <= maxSlots; n += 2) {
    let fits = true
    for (let p = 0; p < poles; p++) {
      if (used.has(n + p * 2)) { fits = false; break }
    }
    if (fits && n + (poles - 1) * 2 <= maxSlots) return n
  }
  return 1
}

function getLineVoltage(voltageStr: string): number {
  const parts = voltageStr.split('/')
  return parseInt(parts[1] || parts[0])
}

function getPhaseVoltage(voltageStr: string): number {
  const parts = voltageStr.split('/')
  return parseInt(parts[0])
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--input-border)',
  background: 'var(--input-bg)',
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  boxSizing: 'border-box',
  minHeight: 'var(--touch-min)',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'auto' as const,
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius)',
  padding: 14,
}

const btnStyle = (primary?: boolean): React.CSSProperties => ({
  padding: '10px 16px',
  borderRadius: 'var(--radius)',
  border: primary ? 'none' : '1px solid var(--divider)',
  background: primary ? 'var(--primary)' : 'transparent',
  color: primary ? '#000' : 'var(--text)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  minHeight: 'var(--touch-min)',
  fontFamily: 'var(--font-sans)',
})

export default function PanelSchedulePage() {
  const [panels, setPanels] = useState<Panel[]>(loadPanels)
  const [activePanelId, setActivePanelId] = useState<string | null>(panels[0]?.id || null)
  const [showNewPanel, setShowNewPanel] = useState(false)
  const [showAddCircuit, setShowAddCircuit] = useState(false)
  const [editingCircuitId, setEditingCircuitId] = useState<string | null>(null)

  // New panel form
  const [newName, setNewName] = useState('Panel A')
  const [newMain, setNewMain] = useState(200)
  const [newVoltage, setNewVoltage] = useState('120/208')
  const [newPhases, setNewPhases] = useState<'single' | 'three'>('three')

  // Circuit form
  const [circBreakerSize, setCircBreakerSize] = useState(20)
  const [circDescription, setCircDescription] = useState('')
  const [circLoad, setCircLoad] = useState('')
  const [circLoadUnit, setCircLoadUnit] = useState<'watts' | 'amps'>('watts')
  const [circPoles, setCircPoles] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    savePanels(panels)
  }, [panels])

  const activePanel = useMemo(
    () => panels.find((p) => p.id === activePanelId) || null,
    [panels, activePanelId]
  )

  const totalLoad = useMemo(() => {
    if (!activePanel) return { watts: 0, amps: 0 }
    let totalWatts = 0
    const vLine = getLineVoltage(activePanel.voltage)
    const vPhase = getPhaseVoltage(activePanel.voltage)
    for (const c of activePanel.circuits) {
      if (c.loadUnit === 'watts') {
        totalWatts += c.load
      } else {
        const v = c.poles > 1 ? vLine : vPhase
        totalWatts += c.load * v
      }
    }
    const totalAmps = activePanel.phases === 'three'
      ? totalWatts / (Math.sqrt(3) * vLine)
      : totalWatts / vLine
    return { watts: totalWatts, amps: totalAmps }
  }, [activePanel])

  const loadingPercent = activePanel
    ? (totalLoad.amps / activePanel.mainBreaker) * 100
    : 0

  const usedSpaces = useMemo(() => {
    if (!activePanel) return 0
    return activePanel.circuits.reduce((s, c) => s + c.poles, 0)
  }, [activePanel])

  const maxSpaces = activePanel ? activePanel.maxCircuits : 42
  const availableSpaces = maxSpaces - usedSpaces

  const createPanel = useCallback(() => {
    const panel: Panel = {
      id: generateId(),
      name: newName.trim() || 'Panel',
      mainBreaker: newMain,
      voltage: newVoltage,
      busRating: newMain,
      phases: newPhases,
      maxCircuits: newPhases === 'three' ? 42 : 40,
      circuits: [],
    }
    setPanels((prev) => [...prev, panel])
    setActivePanelId(panel.id)
    setShowNewPanel(false)
    setNewName('Panel ' + String.fromCharCode(65 + panels.length + 1))
  }, [newName, newMain, newVoltage, newPhases, panels.length])

  const deletePanel = useCallback(
    (id: string) => {
      setPanels((prev) => prev.filter((p) => p.id !== id))
      if (activePanelId === id) {
        setActivePanelId(panels.find((p) => p.id !== id)?.id || null)
      }
    },
    [activePanelId, panels]
  )

  const addCircuit = useCallback(() => {
    if (!activePanel) return
    const loadVal = parseFloat(circLoad)
    if (isNaN(loadVal) || loadVal < 0) return

    const circuit: Circuit = {
      id: generateId(),
      circuitNumber: getNextCircuitNumber(activePanel.circuits, activePanel.phases, circPoles),
      breakerSize: circBreakerSize,
      description: circDescription.trim() || 'Unnamed circuit',
      load: loadVal,
      loadUnit: circLoadUnit,
      poles: circPoles,
    }

    setPanels((prev) =>
      prev.map((p) =>
        p.id === activePanel.id
          ? { ...p, circuits: [...p.circuits, circuit].sort((a, b) => a.circuitNumber - b.circuitNumber) }
          : p
      )
    )
    setCircDescription('')
    setCircLoad('')
    setShowAddCircuit(false)
  }, [activePanel, circBreakerSize, circDescription, circLoad, circLoadUnit, circPoles])

  const updateCircuit = useCallback(
    (circuitId: string) => {
      if (!activePanel) return
      const loadVal = parseFloat(circLoad)
      if (isNaN(loadVal) || loadVal < 0) return

      setPanels((prev) =>
        prev.map((p) =>
          p.id === activePanel.id
            ? {
                ...p,
                circuits: p.circuits.map((c) =>
                  c.id === circuitId
                    ? {
                        ...c,
                        breakerSize: circBreakerSize,
                        description: circDescription.trim() || 'Unnamed circuit',
                        load: loadVal,
                        loadUnit: circLoadUnit,
                        poles: circPoles,
                      }
                    : c
                ),
              }
            : p
        )
      )
      setEditingCircuitId(null)
      setCircDescription('')
      setCircLoad('')
    },
    [activePanel, circBreakerSize, circDescription, circLoad, circLoadUnit, circPoles]
  )

  const deleteCircuit = useCallback(
    (circuitId: string) => {
      if (!activePanel) return
      setPanels((prev) =>
        prev.map((p) =>
          p.id === activePanel.id
            ? { ...p, circuits: p.circuits.filter((c) => c.id !== circuitId) }
            : p
        )
      )
    },
    [activePanel]
  )

  const startEditCircuit = (c: Circuit) => {
    setEditingCircuitId(c.id)
    setCircBreakerSize(c.breakerSize)
    setCircDescription(c.description)
    setCircLoad(String(c.load))
    setCircLoadUnit(c.loadUnit)
    setCircPoles(c.poles)
  }

  // Build bus layout
  const busLayout = useMemo(() => {
    if (!activePanel) return { left: [] as (Circuit | null)[], right: [] as (Circuit | null)[] }
    const rows = Math.ceil(maxSpaces / 2)
    const left: (Circuit | null)[] = new Array(rows).fill(null)
    const right: (Circuit | null)[] = new Array(rows).fill(null)

    // Map circuit numbers to row/side
    for (const c of activePanel.circuits) {
      const num = c.circuitNumber
      if (num % 2 === 1) {
        // Odd = left side
        const row = Math.floor((num - 1) / 2)
        if (row < rows) left[row] = c
      } else {
        // Even = right side
        const row = Math.floor((num - 2) / 2)
        if (row < rows) right[row] = c
      }
    }
    return { left, right }
  }, [activePanel, maxSpaces])

  const renderCircuitForm = (isEdit: boolean, circuitId?: string) => (
    <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
        {isEdit ? 'Edit Circuit' : 'Add Circuit'}
      </div>

      <input
        type="text"
        placeholder="Description (e.g., Kitchen Receptacles)"
        value={circDescription}
        onChange={(e) => setCircDescription(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            Breaker (A)
          </label>
          <select value={circBreakerSize} onChange={(e) => setCircBreakerSize(Number(e.target.value))} style={selectStyle}>
            {BREAKER_SIZES.map((s) => (
              <option key={s} value={s}>{s}A</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            Poles
          </label>
          <select value={circPoles} onChange={(e) => setCircPoles(Number(e.target.value) as 1 | 2 | 3)} style={selectStyle}>
            <option value={1}>1 Pole</option>
            <option value={2}>2 Pole</option>
            {activePanel?.phases === 'three' && <option value={3}>3 Pole</option>}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 2 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            Load
          </label>
          <input
            inputMode="decimal"
            placeholder="Load value"
            value={circLoad}
            onChange={(e) => setCircLoad(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            Unit
          </label>
          <select value={circLoadUnit} onChange={(e) => setCircLoadUnit(e.target.value as 'watts' | 'amps')} style={selectStyle}>
            <option value="watts">Watts</option>
            <option value="amps">Amps</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => {
            if (isEdit && circuitId) updateCircuit(circuitId)
            else addCircuit()
          }}
          style={btnStyle(true)}
        >
          {isEdit ? 'Update' : 'Add Circuit'}
        </button>
        <button
          onClick={() => {
            setShowAddCircuit(false)
            setEditingCircuitId(null)
            setCircDescription('')
            setCircLoad('')
          }}
          style={btnStyle()}
        >
          Cancel
        </button>
      </div>
    </div>
  )

  const renderBusCell = (c: Circuit | null, num: number, side: 'left' | 'right') => {
    let displayLoad = ''
    if (c) {
      if (c.loadUnit === 'watts') {
        displayLoad = `${c.load}W`
      } else {
        displayLoad = `${c.load}A`
      }
    }
    const isEditing = c?.id === editingCircuitId

    return (
      <div
        key={`${side}-${num}`}
        style={{
          display: 'flex',
          flexDirection: side === 'left' ? 'row' : 'row-reverse',
          alignItems: 'center',
          gap: 4,
          padding: '4px 6px',
          minHeight: 32,
          borderBottom: '1px solid var(--divider)',
          background: isEditing ? 'var(--primary-dim)' : 'transparent',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-secondary)',
            width: 20,
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          {num}
        </span>
        {c ? (
          <>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--primary)',
                width: 28,
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              {c.breakerSize}
            </span>
            <span
              style={{
                fontSize: 11,
                color: 'var(--text)',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: side === 'left' ? 'left' : 'right',
              }}
            >
              {c.description}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-secondary)',
                flexShrink: 0,
              }}
            >
              {displayLoad}
            </span>
          </>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1, textAlign: 'center', opacity: 0.4 }}>
            \u2014
          </span>
        )}
      </div>
    )
  }

  return (
    <>
      <Header title="Panel Schedule" />
      <div style={{ padding: '0 16px 120px' }}>
        {/* Panel selector */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            padding: '12px 0',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {panels.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePanelId(p.id)
                setShowAddCircuit(false)
                setEditingCircuitId(null)
              }}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius)',
                border: activePanelId === p.id ? '2px solid var(--primary)' : '1px solid var(--divider)',
                background: activePanelId === p.id ? 'var(--primary-dim)' : 'var(--surface)',
                color: activePanelId === p.id ? 'var(--primary)' : 'var(--text)',
                fontWeight: activePanelId === p.id ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minHeight: 'var(--touch-min)',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => setShowNewPanel(true)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius)',
              border: '1px dashed var(--divider)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minHeight: 'var(--touch-min)',
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'var(--font-sans)',
            }}
          >
            + New Panel
          </button>
        </div>

        {/* New panel form */}
        {showNewPanel && (
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Create New Panel</div>

            <input
              type="text"
              placeholder="Panel name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={inputStyle}
            />

            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Main Breaker
                </label>
                <select value={newMain} onChange={(e) => setNewMain(Number(e.target.value))} style={selectStyle}>
                  {MAIN_SIZES.map((s) => (
                    <option key={s} value={s}>{s}A</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Voltage
                </label>
                <select value={newVoltage} onChange={(e) => setNewVoltage(e.target.value)} style={selectStyle}>
                  {VOLTAGE_OPTIONS.map((v) => (
                    <option key={v} value={v}>{v}V</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Phases
              </label>
              <select value={newPhases} onChange={(e) => setNewPhases(e.target.value as 'single' | 'three')} style={selectStyle}>
                {PHASE_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={createPanel} style={btnStyle(true)}>
                Create Panel
              </button>
              <button onClick={() => setShowNewPanel(false)} style={btnStyle()}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Active panel details */}
        {activePanel && (
          <>
            {/* Panel info header */}
            <div style={{ ...cardStyle, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                    {activePanel.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {activePanel.mainBreaker}A Main &bull; {activePanel.voltage}V &bull;{' '}
                    {activePanel.phases === 'three' ? '3\u03D5' : '1\u03D5'}
                  </div>
                </div>
                <button
                  onClick={() => deletePanel(activePanel.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #f44336',
                    background: 'transparent',
                    color: '#f44336',
                    fontSize: 12,
                    cursor: 'pointer',
                    minHeight: 36,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Delete
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    background: 'var(--input-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 10,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 2 }}>
                    Total Load
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    {totalLoad.watts.toFixed(0)}W
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                    {totalLoad.amps.toFixed(1)}A
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: 'var(--input-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 10,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 2 }}>
                    Loading
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: loadingPercent > 100 ? '#f44336' : loadingPercent > 80 ? '#ff9800' : '#4caf50',
                    }}
                  >
                    {loadingPercent.toFixed(1)}%
                  </div>
                  {loadingPercent > 80 && (
                    <div style={{ fontSize: 10, color: loadingPercent > 100 ? '#f44336' : '#ff9800', fontWeight: 700 }}>
                      {loadingPercent > 100 ? 'OVERLOADED' : 'WARNING >80%'}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    flex: 1,
                    background: 'var(--input-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 10,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 2 }}>
                    Spaces
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    {availableSpaces}/{maxSpaces}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>available</div>
                </div>
              </div>

              {/* Loading bar */}
              <div style={{ height: 6, background: 'var(--input-bg)', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(loadingPercent, 100)}%`,
                    background: loadingPercent > 100 ? '#f44336' : loadingPercent > 80 ? '#ff9800' : '#4caf50',
                    borderRadius: 3,
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>

            {/* Bus layout visualization */}
            <div
              style={{
                ...cardStyle,
                marginBottom: 12,
                padding: 0,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '8px 0',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  borderBottom: '1px solid var(--divider)',
                  background: 'var(--input-bg)',
                }}
              >
                Bus Layout \u2014 Left (Odd) | Right (Even)
              </div>
              <div style={{ display: 'flex' }}>
                {/* Left bus */}
                <div style={{ flex: 1, borderRight: '2px solid var(--primary)' }}>
                  {busLayout.left.map((c, i) => renderBusCell(c, i * 2 + 1, 'left'))}
                </div>
                {/* Right bus */}
                <div style={{ flex: 1 }}>
                  {busLayout.right.map((c, i) => renderBusCell(c, i * 2 + 2, 'right'))}
                </div>
              </div>
            </div>

            {/* Add circuit button / form */}
            {showAddCircuit ? (
              renderCircuitForm(false)
            ) : editingCircuitId ? (
              renderCircuitForm(true, editingCircuitId)
            ) : (
              <button
                onClick={() => {
                  setCircDescription('')
                  setCircLoad('')
                  setCircBreakerSize(20)
                  setCircPoles(1)
                  setCircLoadUnit('watts')
                  setShowAddCircuit(true)
                }}
                style={{
                  ...btnStyle(true),
                  width: '100%',
                  marginBottom: 12,
                  textAlign: 'center',
                }}
              >
                + Add Circuit
              </button>
            )}

            {/* Circuit list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {activePanel.circuits.length === 0 && (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
                  No circuits yet. Add your first circuit above.
                </div>
              )}
              {activePanel.circuits.map((c) => {
                const vLine = getLineVoltage(activePanel.voltage)
                const vPhase = getPhaseVoltage(activePanel.voltage)
                const loadWatts = c.loadUnit === 'watts' ? c.load : c.load * (c.poles > 1 ? vLine : vPhase)
                const loadAmps = c.loadUnit === 'amps' ? c.load : c.load / (c.poles > 1 ? vLine : vPhase)

                return (
                  <div
                    key={c.id}
                    style={{
                      ...cardStyle,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      border: editingCircuitId === c.id ? '1px solid var(--primary)' : undefined,
                    }}
                  >
                    {/* Circuit number */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--primary)',
                        flexShrink: 0,
                      }}
                    >
                      {c.circuitNumber}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--text)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.description}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {c.breakerSize}A &bull; {c.poles}P &bull; {loadWatts.toFixed(0)}W / {loadAmps.toFixed(1)}A
                      </div>
                    </div>

                    <button
                      onClick={() => startEditCircuit(c)}
                      style={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: 14,
                        padding: 0,
                      }}
                      aria-label="Edit circuit"
                    >
                      \u270E
                    </button>

                    <button
                      onClick={() => deleteCircuit(c.id)}
                      style={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: '#f44336',
                        cursor: 'pointer',
                        fontSize: 16,
                        padding: 0,
                      }}
                      aria-label="Delete circuit"
                    >
                      \u00D7
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* No panels message */}
        {panels.length === 0 && !showNewPanel && (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: 'var(--text-secondary)',
              fontSize: 14,
            }}
          >
            No panels created yet. Tap "+ New Panel" above to get started.
          </div>
        )}
      </div>
    </>
  )
}
