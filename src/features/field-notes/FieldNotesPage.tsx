import { useState, useCallback, useMemo } from 'react'
import Header from '../../layout/Header'
import { useLocalStorage } from '../../core/storage/useLocalStorage'

/* ---------- Types ---------- */

interface Note {
  id: string
  title: string
  body: string
  tag: NoteTag
  created: string
  updated: string
  pinned: boolean
}

type NoteTag = 'general' | 'measurement' | 'issue' | 'wiring' | 'safety' | 'todo'

const TAG_META: Record<NoteTag, { label: string; color: string; bg: string }> = {
  general:     { label: 'General',     color: 'var(--text-secondary)', bg: 'var(--surface-elevated)' },
  measurement: { label: 'Measurement', color: '#3b82f6',  bg: 'rgba(59,130,246,0.12)' },
  issue:       { label: 'Issue',       color: '#ef4444',  bg: 'rgba(239,68,68,0.12)' },
  wiring:      { label: 'Wiring',      color: '#10b981',  bg: 'rgba(16,185,129,0.12)' },
  safety:      { label: 'Safety',      color: '#f59e0b',  bg: 'rgba(245,158,11,0.12)' },
  todo:        { label: 'To-Do',       color: '#8b5cf6',  bg: 'rgba(139,92,246,0.12)' },
}

const ALL_TAGS = Object.keys(TAG_META) as NoteTag[]

const STORAGE_KEY = 'spark-field-notes'

/* ---------- Helpers ---------- */

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

/* ---------- Component ---------- */

export default function FieldNotesPage() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterTag, setFilterTag] = useState<NoteTag | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Editor state
  const [edTitle, setEdTitle] = useState('')
  const [edBody, setEdBody] = useState('')
  const [edTag, setEdTag] = useState<NoteTag>('general')

  const startNew = useCallback(() => {
    setEdTitle('')
    setEdBody('')
    setEdTag('general')
    setEditingId('__new__')
  }, [])

  const startEdit = useCallback((note: Note) => {
    setEdTitle(note.title)
    setEdBody(note.body)
    setEdTag(note.tag)
    setEditingId(note.id)
  }, [])

  const save = useCallback(() => {
    const now = new Date().toISOString()
    if (editingId === '__new__') {
      const newNote: Note = {
        id: makeId(),
        title: edTitle.trim() || 'Untitled Note',
        body: edBody,
        tag: edTag,
        created: now,
        updated: now,
        pinned: false,
      }
      setNotes(prev => [newNote, ...prev])
    } else {
      setNotes(prev => prev.map(n =>
        n.id === editingId
          ? { ...n, title: edTitle.trim() || 'Untitled Note', body: edBody, tag: edTag, updated: now }
          : n
      ))
    }
    setEditingId(null)
  }, [editingId, edTitle, edBody, edTag, setNotes])

  const cancel = useCallback(() => setEditingId(null), [])

  const togglePin = useCallback((id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }, [setNotes])

  const deleteNote = useCallback((id: string) => {
    if (confirm('Delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id))
    }
  }, [setNotes])

  const exportNotes = useCallback(() => {
    const text = notes.map(n => {
      const lines: string[] = []
      lines.push(`## ${n.title}`)
      lines.push(`Tag: ${TAG_META[n.tag].label} | ${new Date(n.created).toLocaleDateString('en-CA')}`)
      if (n.body) { lines.push(''); lines.push(n.body) }
      lines.push('')
      return lines.join('\n')
    }).join('\n---\n\n')

    const header = `# SparkCalc Field Notes\nExported: ${new Date().toLocaleDateString('en-CA')}\n\n---\n\n`
    const blob = new Blob([header + text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `field-notes-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [notes])

  // Filtered & sorted notes
  const filteredNotes = useMemo(() => {
    let list = notes
    if (filterTag !== 'all') {
      list = list.filter(n => n.tag === filterTag)
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q)
      )
    }
    // Pinned first, then by updated date
    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.updated).getTime() - new Date(a.updated).getTime()
    })
  }, [notes, filterTag, searchTerm])

  // ── Editor overlay ──
  if (editingId) {
    return (
      <>
        <Header title={editingId === '__new__' ? 'New Note' : 'Edit Note'} />
        <div style={{ padding: '16px 16px 120px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Title */}
            <input
              type="text"
              placeholder="Note title..."
              value={edTitle}
              onChange={e => setEdTitle(e.target.value)}
              autoFocus
              style={{
                fontSize: 18, fontWeight: 700, color: 'var(--text)',
                fontFamily: 'var(--font-display)',
                background: 'var(--surface)', border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius)', padding: '12px 14px',
                outline: 'none',
              }}
            />

            {/* Tag selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ALL_TAGS.map(tag => {
                const meta = TAG_META[tag]
                const active = edTag === tag
                return (
                  <button
                    key={tag}
                    onClick={() => setEdTag(tag)}
                    style={{
                      fontSize: 11, fontWeight: active ? 700 : 500,
                      fontFamily: 'var(--font-display)', letterSpacing: '0.3px',
                      color: active ? meta.color : 'var(--text-tertiary)',
                      background: active ? meta.bg : 'transparent',
                      border: `1px solid ${active ? meta.color + '40' : 'var(--divider)'}`,
                      borderRadius: 'var(--radius-full)', padding: '5px 12px',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {meta.label}
                  </button>
                )
              })}
            </div>

            {/* Body */}
            <textarea
              placeholder="Write your note here...&#10;&#10;Measurements, observations, issues, wire runs, panel notes..."
              value={edBody}
              onChange={e => setEdBody(e.target.value)}
              rows={12}
              style={{
                fontSize: 14, color: 'var(--text)',
                fontFamily: 'var(--font-mono)', lineHeight: 1.6,
                background: 'var(--surface)', border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius)', padding: '12px 14px',
                outline: 'none', resize: 'vertical', minHeight: 200,
              }}
            />

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={save}
                style={{
                  flex: 1, fontSize: 14, fontWeight: 700, color: '#000',
                  fontFamily: 'var(--font-display)',
                  background: 'var(--primary)', border: 'none',
                  borderRadius: 'var(--radius)', padding: '14px 0',
                }}
              >
                {editingId === '__new__' ? 'Save Note' : 'Update Note'}
              </button>
              <button
                onClick={cancel}
                style={{
                  fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  background: 'var(--surface)', border: '1px solid var(--divider)',
                  borderRadius: 'var(--radius)', padding: '14px 20px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Main list view ──
  return (
    <>
      <Header title="Field Notes" />
      <div style={{ padding: '16px 16px 120px' }}>

        {/* Top bar: count + new + export */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: 'var(--primary)',
            background: 'var(--primary-subtle)', fontFamily: 'var(--font-display)',
            padding: '5px 12px', borderRadius: 'var(--radius-full)',
            letterSpacing: '0.3px',
          }}>
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {notes.length > 0 && (
              <button
                onClick={exportNotes}
                aria-label="Export notes"
                style={{
                  fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-display)', padding: '5px 12px',
                  borderRadius: 'var(--radius-full)', border: '1px solid var(--divider)',
                  background: 'var(--surface)',
                }}
              >
                Export
              </button>
            )}
            <button
              onClick={startNew}
              style={{
                fontSize: 12, fontWeight: 700, color: '#000',
                fontFamily: 'var(--font-display)', padding: '5px 14px',
                borderRadius: 'var(--radius-full)', border: 'none',
                background: 'var(--primary)',
              }}
            >
              + New Note
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
            stroke="var(--text-tertiary)" strokeWidth={2.5} strokeLinecap="round"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx={11} cy={11} r={8} /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', fontSize: 13, color: 'var(--text)',
              fontFamily: 'var(--font-display)',
              background: 'var(--surface)', border: '1px solid var(--divider)',
              borderRadius: 'var(--radius)', padding: '10px 12px 10px 36px',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Tag filter chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          <button
            onClick={() => setFilterTag('all')}
            style={{
              fontSize: 11, fontWeight: filterTag === 'all' ? 700 : 500,
              fontFamily: 'var(--font-display)',
              color: filterTag === 'all' ? 'var(--primary)' : 'var(--text-tertiary)',
              background: filterTag === 'all' ? 'var(--primary-subtle)' : 'transparent',
              border: `1px solid ${filterTag === 'all' ? 'var(--primary)' + '30' : 'var(--divider)'}`,
              borderRadius: 'var(--radius-full)', padding: '5px 12px',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            All
          </button>
          {ALL_TAGS.map(tag => {
            const meta = TAG_META[tag]
            const active = filterTag === tag
            return (
              <button
                key={tag}
                onClick={() => setFilterTag(active ? 'all' : tag)}
                style={{
                  fontSize: 11, fontWeight: active ? 700 : 500,
                  fontFamily: 'var(--font-display)',
                  color: active ? meta.color : 'var(--text-tertiary)',
                  background: active ? meta.bg : 'transparent',
                  border: `1px solid ${active ? meta.color + '40' : 'var(--divider)'}`,
                  borderRadius: 'var(--radius-full)', padding: '5px 12px',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {meta.label}
              </button>
            )
          })}
        </div>

        {/* Empty state */}
        {filteredNotes.length === 0 && (
          <div style={{ padding: '48px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              {notes.length === 0 ? '📝' : '🔍'}
            </div>
            <div style={{
              fontSize: 16, fontWeight: 600, color: 'var(--text)',
              fontFamily: 'var(--font-display)', marginBottom: 6,
            }}>
              {notes.length === 0 ? 'No notes yet' : 'No matching notes'}
            </div>
            <div style={{
              fontSize: 14, color: 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
            }}>
              {notes.length === 0
                ? 'Tap "+ New Note" to start recording measurements, observations, or issues from the field.'
                : 'Try a different search term or tag filter.'}
            </div>
          </div>
        )}

        {/* Notes list */}
        <div style={{ display: 'grid', gap: 8 }}>
          {filteredNotes.map(note => {
            const meta = TAG_META[note.tag]
            return (
              <div key={note.id} style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                border: `1px solid ${note.pinned ? 'var(--primary)' + '30' : 'var(--divider)'}`,
                overflow: 'hidden',
              }}>
                {/* Card header — tappable to edit */}
                <button
                  onClick={() => startEdit(note)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '12px 14px', width: '100%', textAlign: 'left',
                    background: 'transparent', minHeight: 56,
                  }}
                >
                  {/* Pin indicator */}
                  {note.pinned && (
                    <div style={{
                      fontSize: 12, flexShrink: 0, marginTop: 2,
                      color: 'var(--primary)',
                    }}>
                      📌
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 600, color: 'var(--text)',
                        fontFamily: 'var(--font-display)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        flex: 1, minWidth: 0,
                      }}>
                        {note.title}
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: meta.color,
                        background: meta.bg, padding: '2px 8px',
                        borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-display)',
                        letterSpacing: '0.3px', flexShrink: 0,
                      }}>
                        {meta.label}
                      </span>
                    </div>
                    {note.body && (
                      <div style={{
                        fontSize: 12, color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {note.body.split('\n')[0]}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-display)', fontWeight: 500,
                    whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2,
                  }}>
                    {relativeTime(note.updated)}
                  </div>
                </button>

                {/* Quick actions */}
                <div style={{
                  display: 'flex', gap: 0,
                  borderTop: '1px solid var(--divider)',
                }}>
                  <button
                    onClick={() => togglePin(note.id)}
                    style={{
                      flex: 1, fontSize: 11, fontWeight: 500,
                      fontFamily: 'var(--font-display)',
                      color: note.pinned ? 'var(--primary)' : 'var(--text-tertiary)',
                      background: 'transparent', border: 'none',
                      padding: '8px 0',
                    }}
                  >
                    {note.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <div style={{ width: 1, background: 'var(--divider)' }} />
                  <button
                    onClick={() => {
                      const text = `${note.title}\n${TAG_META[note.tag].label}\n\n${note.body}`
                      if (navigator.share) {
                        navigator.share({ title: note.title, text }).catch(() => {})
                      } else {
                        navigator.clipboard.writeText(text).catch(() => {})
                      }
                    }}
                    style={{
                      flex: 1, fontSize: 11, fontWeight: 500,
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-tertiary)',
                      background: 'transparent', border: 'none',
                      padding: '8px 0',
                    }}
                  >
                    Share
                  </button>
                  <div style={{ width: 1, background: 'var(--divider)' }} />
                  <button
                    onClick={() => deleteNote(note.id)}
                    style={{
                      flex: 1, fontSize: 11, fontWeight: 500,
                      fontFamily: 'var(--font-display)',
                      color: '#ef4444',
                      background: 'transparent', border: 'none',
                      padding: '8px 0',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
