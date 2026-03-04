import { useState, useEffect, useMemo } from 'react'
import Header from '../../layout/Header'

interface HourEntry {
  id: string
  date: string
  hours: number
  description: string
  type: 'field' | 'school'
}

type ViewMode = 'log' | 'summary' | 'export'

const STORAGE_KEY = 'sparkCalc_hourLog'
const TOTAL_REQUIRED = 9000
const HOURS_PER_LEVEL = 1800
const TOTAL_SCHOOL_HOURS = 720
const SCHOOL_HOURS_PER_SESSION = 240

const levels = [
  { level: 1, start: 0, end: 1800 },
  { level: 2, start: 1800, end: 3600 },
  { level: 3, start: 3600, end: 5400 },
  { level: 4, start: 5400, end: 7200 },
  { level: 5, start: 7200, end: 9000 },
]

function loadEntries(): HourEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveEntries(entries: HourEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function formatDate(d: string): string {
  const [y, m, day] = d.split('-')
  return `${m}/${day}/${y}`
}

function getWeekKey(d: string): string {
  const date = new Date(d + 'T00:00:00')
  const jan1 = new Date(date.getFullYear(), 0, 1)
  const diff = date.getTime() - jan1.getTime()
  const week = Math.ceil((diff / 86400000 + jan1.getDay() + 1) / 7)
  return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`
}

function getMonthKey(d: string): string {
  return d.slice(0, 7)
}

const pillStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '10px 8px',
  borderRadius: 'var(--radius)',
  border: 'none',
  background: active ? 'var(--primary)' : 'var(--surface)',
  color: active ? '#000' : 'var(--text-secondary)',
  fontWeight: active ? 700 : 500,
  fontSize: 13,
  cursor: 'pointer',
  minHeight: 'var(--touch-min)',
  fontFamily: 'var(--font-sans)',
  textAlign: 'center' as const,
})

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--input-border)',
  background: 'var(--input-bg)',
  color: 'var(--text)',
  fontSize: 15,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  boxSizing: 'border-box',
  minHeight: 'var(--touch-min)',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius)',
  padding: 14,
}

export default function HourTrackerPage() {
  const [entries, setEntries] = useState<HourEntry[]>(loadEntries)
  const [view, setView] = useState<ViewMode>('log')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [hours, setHours] = useState('')
  const [description, setDescription] = useState('')
  const [entryType, setEntryType] = useState<'field' | 'school'>('field')
  const [summaryMode, setSummaryMode] = useState<'weekly' | 'monthly'>('weekly')

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const totalHours = useMemo(() => entries.reduce((s, e) => s + e.hours, 0), [entries])
  const fieldHours = useMemo(
    () => entries.filter((e) => e.type === 'field').reduce((s, e) => s + e.hours, 0),
    [entries]
  )
  const schoolHours = useMemo(
    () => entries.filter((e) => e.type === 'school').reduce((s, e) => s + e.hours, 0),
    [entries]
  )

  const currentLevel = useMemo(() => {
    for (const l of levels) {
      if (totalHours < l.end) return l
    }
    return levels[levels.length - 1]
  }, [totalHours])

  const hoursInCurrentLevel = Math.min(totalHours - currentLevel.start, HOURS_PER_LEVEL)
  const levelProgress = Math.min((hoursInCurrentLevel / HOURS_PER_LEVEL) * 100, 100)
  const overallProgress = Math.min((totalHours / TOTAL_REQUIRED) * 100, 100)
  const hoursToNextLevel = Math.max(currentLevel.end - totalHours, 0)
  const hoursToJourneyman = Math.max(TOTAL_REQUIRED - totalHours, 0)
  const schoolSessions = Math.floor(schoolHours / SCHOOL_HOURS_PER_SESSION)

  const addEntry = () => {
    const h = parseFloat(hours)
    if (!date || isNaN(h) || h <= 0) return
    const entry: HourEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date,
      hours: h,
      description: description.trim() || 'No description',
      type: entryType,
    }
    setEntries((prev) => [entry, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
    setHours('')
    setDescription('')
  }

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const summaryData = useMemo(() => {
    const keyFn = summaryMode === 'weekly' ? getWeekKey : getMonthKey
    const map = new Map<string, { total: number; field: number; school: number; count: number }>()
    for (const e of entries) {
      const key = keyFn(e.date)
      const cur = map.get(key) || { total: 0, field: 0, school: 0, count: 0 }
      cur.total += e.hours
      cur[e.type] += e.hours
      cur.count++
      map.set(key, cur)
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [entries, summaryMode])

  const exportText = useMemo(() => {
    const lines = [
      '=== SparkCalc Hour Tracker Export ===',
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      `Total Hours: ${totalHours.toFixed(1)}`,
      `Field Hours: ${fieldHours.toFixed(1)}`,
      `School Hours: ${schoolHours.toFixed(1)} (${schoolSessions} of 3 sessions)`,
      `Current Level: ${currentLevel.level}`,
      `Hours to Next Level: ${hoursToNextLevel.toFixed(1)}`,
      `Hours to Journeyman: ${hoursToJourneyman.toFixed(1)}`,
      '',
      '--- Entry Log ---',
    ]
    for (const e of [...entries].sort((a, b) => a.date.localeCompare(b.date))) {
      lines.push(`${e.date} | ${e.hours}h | ${e.type} | ${e.description}`)
    }
    return lines.join('\n')
  }, [entries, totalHours, fieldHours, schoolHours, schoolSessions, currentLevel, hoursToNextLevel, hoursToJourneyman])

  return (
    <>
      <Header title="Hour Tracker" />
      <div style={{ padding: '0 16px 120px' }}>
        {/* Progress overview */}
        <div style={{ ...cardStyle, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Overall Progress</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>
              {totalHours.toFixed(1)} / {TOTAL_REQUIRED}h
            </div>
          </div>
          {/* Overall bar */}
          <div style={{ height: 8, background: 'var(--input-bg)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${overallProgress}%`,
                background: 'var(--primary)',
                borderRadius: 4,
                transition: 'width 0.3s',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Level {currentLevel.level} ({currentLevel.start}\–{currentLevel.end}h)
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
              {hoursInCurrentLevel.toFixed(1)} / {HOURS_PER_LEVEL}h
            </div>
          </div>
          {/* Level bar */}
          <div style={{ height: 6, background: 'var(--input-bg)', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${levelProgress}%`,
                background: levelProgress >= 100 ? '#4caf50' : 'var(--primary)',
                borderRadius: 3,
                transition: 'width 0.3s',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>Next Level</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                {hoursToNextLevel.toFixed(0)}h
              </div>
            </div>
            <div style={{ width: 1, background: 'var(--divider)' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>Journeyman</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                {hoursToJourneyman.toFixed(0)}h
              </div>
            </div>
            <div style={{ width: 1, background: 'var(--divider)' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>School</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                {schoolHours.toFixed(0)}h
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                {schoolSessions}/3 sessions
              </div>
            </div>
          </div>
        </div>

        {/* View tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 16, marginBottom: 12 }}>
          {([
            { value: 'log', label: 'Log' },
            { value: 'summary', label: 'Summary' },
            { value: 'export', label: 'Export' },
          ] as const).map((t) => (
            <button key={t.value} onClick={() => setView(t.value)} style={pillStyle(view === t.value)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Log view */}
        {view === 'log' && (
          <>
            {/* Add entry form */}
            <div
              style={{
                ...cardStyle,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Add Entry</div>

              {/* Type toggle */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setEntryType('field')}
                  style={pillStyle(entryType === 'field')}
                >
                  Field Work
                </button>
                <button
                  onClick={() => setEntryType('school')}
                  style={pillStyle(entryType === 'school')}
                >
                  In-School
                </button>
              </div>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />

              <input
                inputMode="decimal"
                placeholder="Hours worked"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Job site / description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={inputStyle}
              />

              <button
                onClick={addEntry}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  background: 'var(--primary)',
                  color: '#000',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  minHeight: 'var(--touch-min)',
                  fontFamily: 'var(--font-sans)',
                  opacity: !hours || isNaN(parseFloat(hours)) || parseFloat(hours) <= 0 ? 0.5 : 1,
                }}
                disabled={!hours || isNaN(parseFloat(hours)) || parseFloat(hours) <= 0}
              >
                Add {entryType === 'field' ? 'Field' : 'School'} Hours
              </button>
            </div>

            {/* Entry list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {entries.length === 0 && (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)', fontSize: 14 }}>
                  No entries yet. Start logging your hours above.
                </div>
              )}
              {entries.map((e) => (
                <div
                  key={e.id}
                  style={{
                    ...cardStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          background: e.type === 'school' ? '#1565c044' : 'var(--primary-dim)',
                          color: e.type === 'school' ? '#42a5f5' : 'var(--primary)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {e.type}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {formatDate(e.date)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--text)',
                        marginTop: 4,
                        lineHeight: 1.3,
                      }}
                    >
                      {e.description}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--primary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {e.hours}h
                  </div>
                  <button
                    onClick={() => deleteEntry(e.id)}
                    style={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'transparent',
                      color: '#f44336',
                      cursor: 'pointer',
                      fontSize: 18,
                      minHeight: 'var(--touch-min)',
                      minWidth: 'var(--touch-min)',
                      padding: 0,
                    }}
                    aria-label="Delete entry"
                  >
                    \×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Summary view */}
        {view === 'summary' && (
          <>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              <button
                onClick={() => setSummaryMode('weekly')}
                style={pillStyle(summaryMode === 'weekly')}
              >
                Weekly
              </button>
              <button
                onClick={() => setSummaryMode('monthly')}
                style={pillStyle(summaryMode === 'monthly')}
              >
                Monthly
              </button>
            </div>

            {summaryData.length === 0 && (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)', fontSize: 14 }}>
                No data to summarize yet.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {summaryData.map(([key, data]) => (
                <div key={key} style={cardStyle}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--text)',
                      }}
                    >
                      {key}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'var(--primary)',
                      }}
                    >
                      {data.total.toFixed(1)}h
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>Field: {data.field.toFixed(1)}h</span>
                    <span>School: {data.school.toFixed(1)}h</span>
                    <span>{data.count} entries</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Export view */}
        {view === 'export' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Copy the text below and paste it wherever needed. This is a summary of all your logged hours.
            </div>
            <pre
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                padding: 16,
                fontSize: 12,
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 1.6,
                border: '1px solid var(--divider)',
                maxHeight: 500,
                overflowY: 'auto',
              }}
            >
              {exportText}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(exportText).catch(() => {})
              }}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: 'var(--primary)',
                color: '#000',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                minHeight: 'var(--touch-min)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Copy to Clipboard
            </button>

            {/* Level breakdown */}
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 8 }}>
              Level Breakdown
            </div>
            {levels.map((l) => {
              const hoursInLevel = Math.max(0, Math.min(totalHours - l.start, HOURS_PER_LEVEL))
              const pct = (hoursInLevel / HOURS_PER_LEVEL) * 100
              const status =
                totalHours >= l.end ? 'Complete' : totalHours >= l.start ? 'In Progress' : 'Not Started'
              return (
                <div key={l.level} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      Level {l.level}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color:
                          status === 'Complete'
                            ? '#4caf50'
                            : status === 'In Progress'
                            ? 'var(--primary)'
                            : 'var(--text-secondary)',
                      }}
                    >
                      {status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {l.start}\–{l.end}h
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text)',
                      }}
                    >
                      {hoursInLevel.toFixed(0)} / {HOURS_PER_LEVEL}h
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: 'var(--input-bg)',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: status === 'Complete' ? '#4caf50' : 'var(--primary)',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              )
            })}

            {/* School tracking */}
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 8 }}>
              In-School Training
            </div>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>School Hours</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {schoolHours.toFixed(0)} / {TOTAL_SCHOOL_HOURS}h
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: 'var(--input-bg)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min((schoolHours / TOTAL_SCHOOL_HOURS) * 100, 100)}%`,
                    background: '#42a5f5',
                    borderRadius: 3,
                  }}
                />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {schoolSessions} of 3 in-school sessions completed ({SCHOOL_HOURS_PER_SESSION}h each).
                {schoolSessions < 3 && (
                  <>
                    {' '}
                    {TOTAL_SCHOOL_HOURS - schoolHours}h of school remaining.
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
