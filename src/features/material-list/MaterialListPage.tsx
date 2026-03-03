import { useState, useEffect, useCallback } from 'react'
import Header from '../../layout/Header'

// ── Types ──────────────────────────────────────────────────
interface MaterialItem {
  id: string
  name: string
  quantity: string
  unit: string
  notes: string
  checked: boolean
}

interface Job {
  id: string
  name: string
  createdAt: number
  items: MaterialItem[]
  archived: boolean
}

// ── Storage ────────────────────────────────────────────────
const STORAGE_KEY = 'sparkCalc_materialJobs'

function loadJobs(): Job[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveJobs(jobs: Job[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// ── Common units for electrical work ───────────────────────
const COMMON_UNITS = [
  { value: 'pcs', label: 'pcs' },
  { value: 'ft', label: 'ft' },
  { value: 'm', label: 'm' },
  { value: 'rolls', label: 'rolls' },
  { value: 'boxes', label: 'boxes' },
  { value: 'bags', label: 'bags' },
  { value: 'lengths', label: 'lengths' },
  { value: 'coils', label: 'coils' },
  { value: 'pairs', label: 'pairs' },
  { value: 'sets', label: 'sets' },
  { value: '', label: '—' },
]

// ── Quick-add presets for common electrical materials ──────
const MATERIAL_PRESETS = [
  '14/2 NMD90', '14/3 NMD90', '12/2 NMD90', '12/3 NMD90',
  '1/2" EMT', '3/4" EMT', '1" EMT',
  '1/2" EMT Connectors', '3/4" EMT Connectors', '1" EMT Connectors',
  '1/2" EMT Couplings', '3/4" EMT Couplings',
  'Red Marrettes', 'Yellow Marrettes', 'Orange Marrettes',
  'Single Gang Box', 'Double Gang Box', '4" Square Box',
  '4" Square Mud Ring (1G)', '4" Square Mud Ring (2G)',
  'Single Receptacle', 'Duplex Receptacle', 'GFCI Receptacle',
  'Single Pole Switch', '3-Way Switch', '4-Way Switch',
  'Decora Plate (1G)', 'Decora Plate (2G)',
  '#12 T90 White', '#12 T90 Red', '#12 T90 Blue', '#12 T90 Black', '#12 T90 Green',
  '#10 T90 White', '#10 T90 Black', '#10 T90 Green',
  'Cable Staples', 'Cable Ties', 'Electrical Tape',
  '1/2" PVC Connectors', '3/4" PVC Connectors',
  '#8 Green Ground Screws',
  'Wire Pulling Lube', 'Fire Caulk',
]

// ── Components ─────────────────────────────────────────────

function AddItemForm({ onAdd }: { onAdd: (item: Omit<MaterialItem, 'id' | 'checked'>) => void }) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('pcs')
  const [notes, setNotes] = useState('')
  const [showPresets, setShowPresets] = useState(false)
  const [presetFilter, setPresetFilter] = useState('')

  const filteredPresets = MATERIAL_PRESETS.filter(p =>
    p.toLowerCase().includes(presetFilter.toLowerCase())
  )

  const handleSubmit = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), quantity, unit, notes })
    setName('')
    setQuantity('')
    setUnit('pcs')
    setNotes('')
  }

  const handlePresetSelect = (preset: string) => {
    setName(preset)
    setShowPresets(false)
    setPresetFilter('')
  }

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius)',
      border: '1px solid var(--divider)', padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
        Add Material
      </div>

      {/* Material name with preset toggle */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            placeholder="Material name..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              flex: 1, height: 48,
              background: 'var(--input-bg)', border: '2px solid var(--input-border)',
              borderRadius: 'var(--radius-sm)', padding: '0 12px',
              fontSize: 16, color: 'var(--text)',
            }}
          />
          <button
            onClick={() => setShowPresets(!showPresets)}
            style={{
              width: 48, height: 48, borderRadius: 'var(--radius-sm)',
              background: showPresets ? 'var(--primary)' : 'var(--input-bg)',
              color: showPresets ? '#000' : 'var(--text-secondary)',
              border: `2px solid ${showPresets ? 'var(--primary)' : 'var(--input-border)'}`,
              fontSize: 20, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Common materials"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
          </button>
        </div>

        {/* Preset dropdown */}
        {showPresets && (
          <div style={{
            position: 'absolute', top: 54, left: 0, right: 0, zIndex: 50,
            background: 'var(--surface)', border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-sm)',
            maxHeight: 250, overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <input
              type="text"
              placeholder="Filter materials..."
              value={presetFilter}
              onChange={e => setPresetFilter(e.target.value)}
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '10px 12px', fontSize: 14,
                background: 'var(--input-bg)', border: 'none',
                borderBottom: '1px solid var(--divider)',
                color: 'var(--text)', outline: 'none',
              }}
            />
            {filteredPresets.map(p => (
              <button
                key={p}
                onClick={() => handlePresetSelect(p)}
                style={{
                  width: '100%', padding: '10px 12px', textAlign: 'left',
                  fontSize: 14, color: 'var(--text)',
                  background: 'transparent', border: 'none',
                  borderBottom: '1px solid var(--divider)',
                  cursor: 'pointer', minHeight: 40,
                }}
              >
                {p}
              </button>
            ))}
            {filteredPresets.length === 0 && (
              <div style={{ padding: 12, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
                No matches
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quantity + Unit row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Qty"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          style={{
            width: 80, height: 48,
            background: 'var(--input-bg)', border: '2px solid var(--input-border)',
            borderRadius: 'var(--radius-sm)', padding: '0 10px',
            fontSize: 16, color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
          }}
        />
        <select
          value={unit}
          onChange={e => setUnit(e.target.value)}
          style={{
            width: 90, height: 48,
            background: 'var(--input-bg)', border: '2px solid var(--input-border)',
            borderRadius: 'var(--radius-sm)', padding: '0 8px',
            fontSize: 14, color: 'var(--text)', appearance: 'none',
          }}
        >
          {COMMON_UNITS.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{
            flex: 1, height: 48,
            background: 'var(--input-bg)', border: '2px solid var(--input-border)',
            borderRadius: 'var(--radius-sm)', padding: '0 10px',
            fontSize: 14, color: 'var(--text)',
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        style={{
          width: '100%', height: 48,
          background: name.trim() ? 'var(--primary)' : 'var(--input-bg)',
          color: name.trim() ? '#000' : 'var(--text-secondary)',
          border: 'none', borderRadius: 'var(--radius-sm)',
          fontSize: 15, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'default',
          transition: 'all .15s',
        }}
      >
        + Add to List
      </button>
    </div>
  )
}

function MaterialItemRow({
  item,
  onToggle,
  onDelete,
  onEdit,
}: {
  item: MaterialItem
  onToggle: () => void
  onDelete: () => void
  onEdit: (updated: MaterialItem) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [editQty, setEditQty] = useState(item.quantity)
  const [editNotes, setEditNotes] = useState(item.notes)

  const handleSave = () => {
    onEdit({ ...item, name: editName, quantity: editQty, notes: editNotes })
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{
        padding: 10, background: 'var(--input-bg)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex', flexDirection: 'column', gap: 8,
        border: '2px solid var(--primary)',
      }}>
        <input
          value={editName}
          onChange={e => setEditName(e.target.value)}
          style={{
            height: 40, background: 'var(--surface)',
            border: '1px solid var(--divider)', borderRadius: 6,
            padding: '0 10px', fontSize: 14, color: 'var(--text)',
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={editQty}
            onChange={e => setEditQty(e.target.value)}
            placeholder="Qty"
            style={{
              width: 70, height: 40, background: 'var(--surface)',
              border: '1px solid var(--divider)', borderRadius: 6,
              padding: '0 8px', fontSize: 14, color: 'var(--text)',
            }}
          />
          <input
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
            placeholder="Notes"
            style={{
              flex: 1, height: 40, background: 'var(--surface)',
              border: '1px solid var(--divider)', borderRadius: 6,
              padding: '0 8px', fontSize: 14, color: 'var(--text)',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleSave} style={{
            flex: 1, height: 40, background: 'var(--primary)', color: '#000',
            border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13,
          }}>Save</button>
          <button onClick={() => setEditing(false)} style={{
            flex: 1, height: 40, background: 'var(--surface)', color: 'var(--text)',
            border: '1px solid var(--divider)', borderRadius: 6, fontSize: 13,
          }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 8px',
      borderBottom: '1px solid var(--divider)',
      opacity: item.checked ? 0.5 : 1,
      transition: 'opacity .2s',
    }}>
      {/* Checkbox */}
      <button
        onClick={onToggle}
        style={{
          width: 32, height: 32, flexShrink: 0,
          borderRadius: 6,
          border: `2px solid ${item.checked ? 'var(--primary)' : 'var(--input-border)'}`,
          background: item.checked ? 'var(--primary)' : 'transparent',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {item.checked && (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={3} strokeLinecap="round">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        )}
      </button>

      {/* Material info */}
      <div style={{ flex: 1, minWidth: 0 }} onClick={() => setEditing(true)}>
        <div style={{
          fontSize: 15, fontWeight: 500, color: 'var(--text)',
          textDecoration: item.checked ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.name}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          {item.quantity && (
            <span style={{
              fontSize: 12, color: 'var(--primary)',
              fontFamily: 'var(--font-mono)', fontWeight: 600,
            }}>
              {item.quantity} {item.unit}
            </span>
          )}
          {item.notes && (
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              {item.notes}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        style={{
          width: 32, height: 32, flexShrink: 0,
          border: 'none', background: 'transparent',
          color: 'var(--text-secondary)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────

export default function MaterialListPage() {
  const [jobs, setJobs] = useState<Job[]>(loadJobs)
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [showNewJob, setShowNewJob] = useState(false)
  const [newJobName, setNewJobName] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [confirmDeleteJob, setConfirmDeleteJob] = useState<string | null>(null)

  // Persist on every change
  useEffect(() => { saveJobs(jobs) }, [jobs])

  const activeJob = jobs.find(j => j.id === activeJobId) ?? null
  const visibleJobs = jobs.filter(j => showArchived ? j.archived : !j.archived)

  const updateJobs = useCallback((fn: (prev: Job[]) => Job[]) => {
    setJobs(prev => fn(prev))
  }, [])

  // ── Job CRUD ──────────────────────────────────────────
  const createJob = () => {
    if (!newJobName.trim()) return
    const job: Job = {
      id: uid(),
      name: newJobName.trim(),
      createdAt: Date.now(),
      items: [],
      archived: false,
    }
    updateJobs(prev => [job, ...prev])
    setActiveJobId(job.id)
    setNewJobName('')
    setShowNewJob(false)
  }

  const archiveJob = (id: string) => {
    updateJobs(prev => prev.map(j => j.id === id ? { ...j, archived: !j.archived } : j))
    if (activeJobId === id) setActiveJobId(null)
  }

  const deleteJob = (id: string) => {
    updateJobs(prev => prev.filter(j => j.id !== id))
    if (activeJobId === id) setActiveJobId(null)
    setConfirmDeleteJob(null)
  }

  const duplicateJob = (id: string) => {
    const source = jobs.find(j => j.id === id)
    if (!source) return
    const copy: Job = {
      ...source,
      id: uid(),
      name: `${source.name} (copy)`,
      createdAt: Date.now(),
      items: source.items.map(i => ({ ...i, id: uid(), checked: false })),
      archived: false,
    }
    updateJobs(prev => [copy, ...prev])
    setActiveJobId(copy.id)
  }

  // ── Item CRUD ─────────────────────────────────────────
  const addItem = (item: Omit<MaterialItem, 'id' | 'checked'>) => {
    if (!activeJobId) return
    const newItem: MaterialItem = { ...item, id: uid(), checked: false }
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId ? { ...j, items: [...j.items, newItem] } : j
    ))
  }

  const toggleItem = (itemId: string) => {
    if (!activeJobId) return
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId
        ? { ...j, items: j.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) }
        : j
    ))
  }

  const deleteItem = (itemId: string) => {
    if (!activeJobId) return
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId
        ? { ...j, items: j.items.filter(i => i.id !== itemId) }
        : j
    ))
  }

  const editItem = (updated: MaterialItem) => {
    if (!activeJobId) return
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId
        ? { ...j, items: j.items.map(i => i.id === updated.id ? updated : i) }
        : j
    ))
  }

  const clearChecked = () => {
    if (!activeJobId) return
    updateJobs(prev => prev.map(j =>
      j.id === activeJobId
        ? { ...j, items: j.items.filter(i => !i.checked) }
        : j
    ))
  }

  // ── Render: Job Detail View ───────────────────────────
  if (activeJob) {
    const unchecked = activeJob.items.filter(i => !i.checked)
    const checked = activeJob.items.filter(i => i.checked)
    const totalItems = activeJob.items.length
    const checkedCount = checked.length

    return (
      <>
        <Header title={activeJob.name} />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 100 }}>

          {/* Progress bar */}
          {totalItems > 0 && (
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6,
              }}>
                <span>{checkedCount} of {totalItems} collected</span>
                <span>{totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0}%</span>
              </div>
              <div style={{
                height: 6, background: 'var(--input-bg)',
                borderRadius: 3, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  background: checkedCount === totalItems ? '#22c55e' : 'var(--primary)',
                  width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%`,
                  transition: 'width .3s ease',
                }} />
              </div>
            </div>
          )}

          {/* Add item form */}
          <AddItemForm onAdd={addItem} />

          {/* Unchecked items */}
          {unchecked.length > 0 && (
            <div style={{
              background: 'var(--surface)', borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)', overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 12px', fontSize: 12, fontWeight: 600,
                color: 'var(--text-secondary)', textTransform: 'uppercase',
                letterSpacing: 0.5, borderBottom: '1px solid var(--divider)',
              }}>
                Needed ({unchecked.length})
              </div>
              {unchecked.map(item => (
                <MaterialItemRow
                  key={item.id}
                  item={item}
                  onToggle={() => toggleItem(item.id)}
                  onDelete={() => deleteItem(item.id)}
                  onEdit={editItem}
                />
              ))}
            </div>
          )}

          {/* Checked items */}
          {checked.length > 0 && (
            <div style={{
              background: 'var(--surface)', borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)', overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 12px', fontSize: 12, fontWeight: 600,
                color: 'var(--text-secondary)', textTransform: 'uppercase',
                letterSpacing: 0.5, borderBottom: '1px solid var(--divider)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span>Collected ({checked.length})</span>
                <button onClick={clearChecked} style={{
                  fontSize: 11, color: 'var(--error, #ef4444)', background: 'none',
                  border: 'none', cursor: 'pointer', fontWeight: 600,
                  padding: '4px 8px',
                }}>
                  Clear All
                </button>
              </div>
              {checked.map(item => (
                <MaterialItemRow
                  key={item.id}
                  item={item}
                  onToggle={() => toggleItem(item.id)}
                  onDelete={() => deleteItem(item.id)}
                  onEdit={editItem}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {totalItems === 0 && (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: 'var(--text-secondary)',
            }}>
              <svg width={48} height={48} viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.3, marginBottom: 12 }}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17 12h-4V8h-2v4H7v2h4v4h2v-4h4z"/>
              </svg>
              <div style={{ fontSize: 15, fontWeight: 500 }}>No materials yet</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Add materials above or use the preset list
              </div>
            </div>
          )}

          {/* Back to jobs button */}
          <button
            onClick={() => setActiveJobId(null)}
            style={{
              width: '100%', height: 48,
              background: 'var(--input-bg)', color: 'var(--text-secondary)',
              border: '1px solid var(--divider)', borderRadius: 'var(--radius-sm)',
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            All Jobs
          </button>
        </div>
      </>
    )
  }

  // ── Render: Job List View ─────────────────────────────
  return (
    <>
      <Header title="Material Lists" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 100 }}>

        {/* New Job button / form */}
        {showNewJob ? (
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius)',
            border: '2px solid var(--primary)', padding: 14,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>New Job</div>
            <input
              type="text"
              placeholder="Job name or address..."
              value={newJobName}
              onChange={e => setNewJobName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createJob()}
              autoFocus
              style={{
                height: 48, background: 'var(--input-bg)',
                border: '2px solid var(--input-border)',
                borderRadius: 'var(--radius-sm)', padding: '0 14px',
                fontSize: 16, color: 'var(--text)',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={createJob} disabled={!newJobName.trim()} style={{
                flex: 1, height: 48, background: newJobName.trim() ? 'var(--primary)' : 'var(--input-bg)',
                color: newJobName.trim() ? '#000' : 'var(--text-secondary)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontSize: 15, fontWeight: 700, cursor: newJobName.trim() ? 'pointer' : 'default',
              }}>Create Job</button>
              <button onClick={() => { setShowNewJob(false); setNewJobName('') }} style={{
                width: 48, height: 48, background: 'var(--input-bg)',
                color: 'var(--text-secondary)', border: '1px solid var(--divider)',
                borderRadius: 'var(--radius-sm)', fontSize: 18, cursor: 'pointer',
              }}>&times;</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewJob(true)}
            style={{
              width: '100%', height: 56,
              background: 'var(--primary)', color: '#000',
              border: 'none', borderRadius: 'var(--radius)',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            New Job
          </button>
        )}

        {/* Active/Archived toggle */}
        <div style={{
          display: 'flex', gap: 4, background: 'var(--input-bg)',
          borderRadius: 'var(--radius-sm)', padding: 4,
        }}>
          <button onClick={() => setShowArchived(false)} style={{
            flex: 1, height: 40, borderRadius: 6,
            background: !showArchived ? 'var(--primary)' : 'transparent',
            color: !showArchived ? '#000' : 'var(--text-secondary)',
            border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Active ({jobs.filter(j => !j.archived).length})</button>
          <button onClick={() => setShowArchived(true)} style={{
            flex: 1, height: 40, borderRadius: 6,
            background: showArchived ? 'var(--primary)' : 'transparent',
            color: showArchived ? '#000' : 'var(--text-secondary)',
            border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Archived ({jobs.filter(j => j.archived).length})</button>
        </div>

        {/* Job cards */}
        {visibleJobs.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            color: 'var(--text-secondary)',
          }}>
            <svg width={56} height={56} viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.2, marginBottom: 16 }}>
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
            <div style={{ fontSize: 16, fontWeight: 500 }}>
              {showArchived ? 'No archived jobs' : 'No jobs yet'}
            </div>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              {showArchived
                ? 'Archived jobs will appear here'
                : 'Create a job to start tracking materials'
              }
            </div>
          </div>
        )}

        {visibleJobs.map(job => {
          const totalItems = job.items.length
          const checkedCount = job.items.filter(i => i.checked).length
          const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0
          const dateStr = new Date(job.createdAt).toLocaleDateString('en-CA', {
            month: 'short', day: 'numeric', year: 'numeric',
          })

          return (
            <div key={job.id} style={{
              background: 'var(--surface)', borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)', overflow: 'hidden',
            }}>
              {/* Job card header - clickable to open */}
              <button
                onClick={() => setActiveJobId(job.id)}
                style={{
                  width: '100%', padding: '14px 14px 10px', textAlign: 'left',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{job.name}</span>
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span>{dateStr}</span>
                  <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                  {totalItems > 0 && (
                    <span style={{ color: progress === 100 ? '#22c55e' : 'var(--primary)', fontWeight: 600 }}>
                      {progress}% collected
                    </span>
                  )}
                </div>
                {/* Mini progress bar */}
                {totalItems > 0 && (
                  <div style={{
                    height: 4, background: 'var(--input-bg)',
                    borderRadius: 2, overflow: 'hidden', width: '100%',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: progress === 100 ? '#22c55e' : 'var(--primary)',
                      width: `${progress}%`,
                      transition: 'width .3s ease',
                    }} />
                  </div>
                )}
              </button>

              {/* Job actions row */}
              <div style={{
                display: 'flex', borderTop: '1px solid var(--divider)',
              }}>
                <button onClick={() => duplicateJob(job.id)} style={{
                  flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 500,
                  color: 'var(--text-secondary)', background: 'transparent',
                  border: 'none', cursor: 'pointer',
                  borderRight: '1px solid var(--divider)',
                }}>Duplicate</button>
                <button onClick={() => archiveJob(job.id)} style={{
                  flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 500,
                  color: 'var(--text-secondary)', background: 'transparent',
                  border: 'none', cursor: 'pointer',
                  borderRight: '1px solid var(--divider)',
                }}>{job.archived ? 'Restore' : 'Archive'}</button>
                {confirmDeleteJob === job.id ? (
                  <button onClick={() => deleteJob(job.id)} style={{
                    flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700,
                    color: '#ef4444', background: 'transparent',
                    border: 'none', cursor: 'pointer',
                  }}>Confirm Delete</button>
                ) : (
                  <button onClick={() => setConfirmDeleteJob(job.id)} style={{
                    flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 500,
                    color: 'var(--text-secondary)', background: 'transparent',
                    border: 'none', cursor: 'pointer',
                  }}>Delete</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
