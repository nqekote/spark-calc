import { useState, useMemo, useCallback } from 'react'
import PageWrapper from '../../layout/PageWrapper'
import { cecRules, decisionTrees, type CECRuleEntry, type DecisionTree, type TreeNode, type TreeResult } from './cecRulesData'

/* ══════════════════════════════════════════════
   CEC Smart Code Lookup
   Two modes: search + interactive decision trees
   ══════════════════════════════════════════════ */

type Mode = 'search' | 'trees'

/* ── Search helpers ── */

function scoreMatch(rule: CECRuleEntry, terms: string[]): number {
  let score = 0
  const haystack = (
    rule.rule + ' ' + rule.title + ' ' + rule.description + ' ' +
    rule.section + ' ' + rule.keywords.join(' ') + ' ' +
    (rule.tips?.join(' ') ?? '')
  ).toLowerCase()

  for (const t of terms) {
    if (rule.rule.toLowerCase().includes(t)) score += 10
    if (rule.title.toLowerCase().includes(t)) score += 5
    if (rule.keywords.some(k => k.includes(t))) score += 4
    if (rule.section.toLowerCase().includes(t)) score += 2
    if (haystack.includes(t)) score += 1
  }
  return score
}

function searchRules(query: string): CECRuleEntry[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []

  const scored = cecRules
    .map(r => ({ rule: r, score: scoreMatch(r, terms) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.map(s => s.rule)
}

/* ── Section badges grouped ── */

const sectionColors: Record<string, string> = {
  General: '#6b7280',
  Conductors: '#3b82f6',
  Services: '#8b5cf6',
  'Circuit Loading': '#f59e0b',
  'Grounding & Bonding': '#10b981',
  'Wiring Methods': '#06b6d4',
  'Protection & Control': '#ef4444',
  'Low Voltage Circuits': '#94a3b8',
  'Equipment Installation': '#14b8a6',
  Transformers: '#f97316',
  Motors: '#22c55e',
  Lighting: '#facc15',
  'GFCI & AFCI': '#ec4899',
  'Fire Alarm': '#dc2626',
  'High Voltage': '#7c3aed',
  'Cranes & Hoists': '#78716c',
  Welders: '#fb923c',
  'Emergency Power': '#e11d48',
  Heating: '#f97316',
  'Renewable Energy': '#eab308',
  'Pools & Spas': '#0ea5e9',
  Temporary: '#a855f7',
  'Hazardous Locations': '#f59e0b',
  'Gas Stations': '#b45309',
  'EV Charging': '#22d3ee',
  Interconnection: '#818cf8',
  Mining: '#d97706',
}

/* ── Components ── */

function RuleCard({ rule }: { rule: CECRuleEntry }) {
  const [expanded, setExpanded] = useState(false)
  const badgeColor = sectionColors[rule.section] ?? 'var(--primary)'

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--divider)',
        borderLeft: `3px solid ${badgeColor}`,
        borderRadius: 8,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 4 }}>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: badgeColor,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {rule.rule}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1 }}>
          {rule.title}
        </span>
        <svg
          width={14} height={14} viewBox="0 0 24 24" fill="currentColor"
          style={{
            color: 'var(--text-secondary)',
            flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
            marginTop: 2,
          }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {/* Description always visible */}
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {rule.description}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Section badge */}
          <div>
            <span style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
              background: badgeColor + '20',
              color: badgeColor,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
              {rule.section}
            </span>
          </div>

          {/* Tips */}
          {rule.tips && rule.tips.length > 0 && (
            <div style={{
              background: 'var(--bg)',
              borderRadius: 6,
              padding: '10px 12px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Field Tips
              </div>
              {rule.tips.map((tip, i) => (
                <div key={i} style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, paddingLeft: 12, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>•</span>
                  {tip}
                </div>
              ))}
            </div>
          )}

          {/* Related Rules */}
          {rule.relatedRules && rule.relatedRules.length > 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Related: {rule.relatedRules.map(r => (
                <span key={r} style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  padding: '1px 6px',
                  background: 'var(--bg)',
                  borderRadius: 4,
                  marginLeft: 4,
                  color: 'var(--text)',
                }}>
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ResultPanel({ result, onBack }: { result: TreeResult; onBack: () => void }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '2px solid var(--primary)',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Result header */}
      <div style={{
        background: 'rgba(255,107,44,0.08)',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth={2}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" />
          <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
          Code Rules Found
        </span>
      </div>

      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Rules */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {result.rules.map(r => (
            <span key={r} style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              padding: '4px 10px',
              background: 'rgba(255,107,44,0.12)',
              color: 'var(--primary)',
              borderRadius: 6,
              border: '1px solid rgba(255,107,44,0.25)',
            }}>
              Rule {r}
            </span>
          ))}
        </div>

        {/* Summary */}
        <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
          {result.summary}
        </div>

        {/* Tips */}
        {result.tips && result.tips.length > 0 && (
          <div style={{
            background: 'var(--bg)',
            borderRadius: 6,
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Field Tips
            </div>
            {result.tips.map((tip, i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, paddingLeft: 12, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>•</span>
                {tip}
              </div>
            ))}
          </div>
        )}

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: '100%',
            padding: '10px 16px',
            background: 'var(--bg)',
            border: '1px solid var(--divider)',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text)',
            cursor: 'pointer',
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Start Over
        </button>
      </div>
    </div>
  )
}

function TreeWizard({ tree }: { tree: DecisionTree }) {
  const [path, setPath] = useState<string[]>([tree.rootNodeId])
  const [result, setResult] = useState<TreeResult | null>(null)

  const currentNodeId = path[path.length - 1]
  const currentNode: TreeNode | undefined = tree.nodes[currentNodeId]

  const handleOption = useCallback((option: typeof currentNode.options[number]) => {
    if (option.next === null && option.result) {
      setResult(option.result)
    } else if (option.next) {
      setPath(prev => [...prev, option.next!])
    }
  }, [])

  const handleBack = useCallback(() => {
    if (result) {
      setResult(null)
    } else if (path.length > 1) {
      setPath(prev => prev.slice(0, -1))
    }
  }, [result, path])

  const handleReset = useCallback(() => {
    setPath([tree.rootNodeId])
    setResult(null)
  }, [tree.rootNodeId])

  if (result) {
    return <ResultPanel result={result} onBack={handleReset} />
  }

  if (!currentNode) return null

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--divider)',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Progress breadcrumbs */}
      {path.length > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '8px 14px',
          borderBottom: '1px solid var(--divider)',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              color: 'var(--primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 0',
              fontWeight: 600,
            }}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 4 }}>
            Step {path.length} of ~{path.length + 1}
          </span>
        </div>
      )}

      {/* Question */}
      <div style={{ padding: '16px 14px 8px' }}>
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.4,
        }}>
          {currentNode.question}
        </div>
      </div>

      {/* Options */}
      <div style={{ padding: '8px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {currentNode.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOption(option)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 14px',
              background: 'var(--bg)',
              border: '1.5px solid var(--divider)',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s',
              minHeight: 48,
            }}
          >
            <span>{option.label}</span>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round">
              {option.next === null
                ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
                : <path d="M9 18l6-6-6-6" />
              }
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Main Page ── */

export default function CECLookupPage() {
  const [mode, setMode] = useState<Mode>('search')
  const [search, setSearch] = useState('')
  const [activeTree, setActiveTree] = useState<string | null>(null)

  const results = useMemo(() => searchRules(search), [search])

  const sections = useMemo(() => {
    if (search.trim()) return null
    const map = new Map<string, CECRuleEntry[]>()
    for (const r of cecRules) {
      const list = map.get(r.section) ?? []
      list.push(r)
      map.set(r.section, list)
    }
    return map
  }, [search])

  const selectedTree = activeTree
    ? decisionTrees.find(t => t.id === activeTree) ?? null
    : null

  return (
    <PageWrapper title="CEC Code Lookup">
      {/* Mode Toggle */}
      <div style={{
        display: 'flex',
        gap: 0,
        background: 'var(--surface)',
        border: '1px solid var(--divider)',
        borderRadius: 10,
        padding: 3,
      }}>
        {(['search', 'trees'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setActiveTree(null) }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              background: mode === m ? 'var(--primary)' : 'transparent',
              color: mode === m ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            {m === 'search' ? '🔍 Search Rules' : '🌲 Decision Trees'}
          </button>
        ))}
      </div>

      {/* ═══ SEARCH MODE ═══ */}
      {mode === 'search' && (
        <>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <svg
              width={18} height={18} viewBox="0 0 24 24" fill="none"
              stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx={11} cy={11} r={8} />
              <line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Try "motor overload" or "conduit fill" or "28-306"...'
              style={{
                width: '100%',
                height: 52,
                background: 'var(--input-bg)',
                border: '2px solid var(--input-border)',
                borderRadius: 10,
                padding: '0 16px 0 44px',
                fontSize: 15,
                color: 'var(--text)',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--bg)',
                  border: '1px solid var(--divider)',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Search Results */}
          {search.trim() && (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                {results.length} rule{results.length !== 1 ? 's' : ''} found
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.map(r => <RuleCard key={r.rule} rule={r} />)}
              </div>
              {results.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  color: 'var(--text-secondary)',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                  <div style={{ fontSize: 14 }}>No matching rules found.</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>Try different keywords or a rule number like "28-306".</div>
                </div>
              )}
            </>
          )}

          {/* Browse by Section (no search) */}
          {!search.trim() && sections && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                Browse all {cecRules.length} rules by section
              </div>
              {Array.from(sections.entries()).map(([section, rules]) => (
                <SectionGroup key={section} section={section} rules={rules} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══ DECISION TREE MODE ═══ */}
      {mode === 'trees' && !selectedTree && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Answer a few questions to find the exact CEC rule you need.
          </div>
          {decisionTrees.map(tree => (
            <button
              key={tree.id}
              onClick={() => setActiveTree(tree.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '14px 16px',
                background: 'var(--surface)',
                border: '1.5px solid var(--divider)',
                borderRadius: 10,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s',
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{tree.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                  {tree.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {tree.description}
                </div>
              </div>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {mode === 'trees' && selectedTree && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => setActiveTree(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Decision Trees
          </button>

          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
            {selectedTree.icon} {selectedTree.title}
          </div>

          <TreeWizard key={selectedTree.id} tree={selectedTree} />
        </div>
      )}
    </PageWrapper>
  )
}

/* ── Section group collapsible ── */

function SectionGroup({ section, rules }: { section: string; rules: CECRuleEntry[] }) {
  const [open, setOpen] = useState(false)
  const color = sectionColors[section] ?? 'var(--primary)'

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--divider)',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', flex: 1 }}>
          {section}
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}>
          {rules.length}
        </span>
        <svg
          width={14} height={14} viewBox="0 0 24 24" fill="currentColor"
          style={{
            color: 'var(--text-secondary)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rules.map(r => <RuleCard key={r.rule} rule={r} />)}
        </div>
      )}
    </div>
  )
}
