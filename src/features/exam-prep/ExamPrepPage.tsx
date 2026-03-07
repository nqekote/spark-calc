/* ══════════════════════════════════════════════
   309A Exam Prep — Full Practice System
   ══════════════════════════════════════════════ */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Header from '../../layout/Header'
import {
  type ExamView, type ExamCategory, type Difficulty, type ExamSession, type ExamAnswer,
  ALL_CATEGORIES, CATEGORY_COLORS,
} from './examTypes'
import { examQuestions, questionsByCategory } from './examQuestions'
import {
  loadExamProgress, saveExamProgress,
  updateQuestionRecord, updateStreak, getStudyQueue, addExamSession,
} from './examStorage'

/* ── Shared styles ── */

const pill = (active: boolean, color?: string): React.CSSProperties => ({
  padding: '8px 14px', borderRadius: 'var(--radius)', border: 'none',
  background: active ? (color || 'var(--primary)') : 'var(--surface)',
  color: active ? '#000' : 'var(--text-secondary)',
  fontWeight: active ? 700 : 500, fontSize: 12, cursor: 'pointer',
  whiteSpace: 'nowrap', minHeight: 'var(--touch-min)',
  display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-sans)',
  transition: 'background 0.15s, color 0.15s',
})

const card: React.CSSProperties = {
  background: 'var(--surface)', borderRadius: 'var(--radius)',
  padding: 16, border: '1px solid var(--divider)',
}

const btnPrimary: React.CSSProperties = {
  padding: '14px 24px', borderRadius: 'var(--radius)', border: 'none',
  background: 'var(--primary)', color: '#000', fontSize: 15, fontWeight: 700,
  cursor: 'pointer', minHeight: 'var(--touch-min)', fontFamily: 'var(--font-sans)',
  width: '100%', textAlign: 'center',
}

const btnSecondary: React.CSSProperties = {
  ...btnPrimary,
  background: 'var(--surface)', color: 'var(--text)',
  border: '1px solid var(--divider)',
}

const label: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
}

export default function ExamPrepPage() {
  const [view, setView] = useState<ExamView>('dashboard')
  const [progress, setProgress] = useState(() => loadExamProgress())

  // Persist on change
  useEffect(() => { saveExamProgress(progress) }, [progress])

  return (
    <>
      <Header title="309A Exam Prep" />
      <div style={{ padding: '0 16px 120px' }}>
        {view === 'dashboard' && (
          <Dashboard progress={progress} setProgress={setProgress} setView={setView} />
        )}
        {view === 'study' && (
          <StudyMode progress={progress} setProgress={setProgress} setView={setView} />
        )}
        {view === 'exam-setup' && (
          <ExamSetup setView={setView} />
        )}
        {view === 'exam-active' && (
          <ActiveExam progress={progress} setProgress={setProgress} setView={setView} />
        )}
        {view === 'exam-review' && (
          <ExamReview progress={progress} setProgress={setProgress} setView={setView} />
        )}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════ */

function Dashboard({ progress, setProgress, setView }: {
  progress: ReturnType<typeof loadExamProgress>
  setProgress: React.Dispatch<React.SetStateAction<ReturnType<typeof loadExamProgress>>>
  setView: (v: ExamView) => void
}) {
  const { studyStats, streak, questionRecords, examSessions } = progress
  const totalQ = examQuestions.length
  const accuracy = studyStats.totalQuestionsAttempted > 0
    ? Math.round((studyStats.totalCorrect / studyStats.totalQuestionsAttempted) * 100) : 0
  const mastered = Object.values(questionRecords).filter(r => r.consecutiveCorrect >= 3).length
  const bookmarked = Object.values(questionRecords).filter(r => r.bookmarked).length

  // Category accuracy
  const catStats = useMemo(() => {
    const stats: Record<string, { attempted: number; correct: number }> = {}
    for (const cat of ALL_CATEGORIES) stats[cat] = { attempted: 0, correct: 0 }
    for (const rec of Object.values(questionRecords)) {
      const q = examQuestions.find(eq => eq.id === rec.questionId)
      if (q) {
        stats[q.category].attempted += rec.attempts
        stats[q.category].correct += rec.correct
      }
    }
    return stats
  }, [questionRecords])

  const recentExams = examSessions.slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard label="Questions Attempted" value={studyStats.totalQuestionsAttempted} sub={`of ${totalQ} total`} />
        <StatCard label="Accuracy" value={`${accuracy}%`} sub={studyStats.totalQuestionsAttempted > 0 ? `${studyStats.totalCorrect} correct` : 'No data yet'} color={accuracy >= 70 ? '#22c55e' : accuracy > 0 ? '#ef4444' : undefined} />
        <StatCard label="Study Streak" value={`${streak.currentStreak} day${streak.currentStreak !== 1 ? 's' : ''}`} sub={`Best: ${streak.longestStreak} days`} />
        <StatCard label="Mastered" value={mastered} sub={`${bookmarked} bookmarked`} color="var(--primary)" />
      </div>

      {/* Category Accuracy */}
      <div style={card}>
        <div style={label}>Category Performance</div>
        {ALL_CATEGORIES.map(cat => {
          const s = catStats[cat]
          const pct = s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : -1
          return (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{cat}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {pct >= 0 && pct < 60 && (
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#ef444420', color: '#ef4444' }}>WEAK</span>
                  )}
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: pct >= 70 ? '#22c55e' : pct >= 0 ? '#ef4444' : 'var(--text-secondary)' }}>
                    {pct >= 0 ? `${pct}%` : '--'}
                  </span>
                </div>
              </div>
              <div style={{ height: 4, background: 'var(--input-bg)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: pct >= 0 ? `${pct}%` : '0%', background: CATEGORY_COLORS[cat], borderRadius: 2, transition: 'width 0.3s' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Exams */}
      {recentExams.length > 0 && (
        <div style={card}>
          <div style={label}>Recent Practice Exams</div>
          {recentExams.map(exam => (
            <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--divider)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                  {exam.totalQuestions} Questions
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {new Date(exam.date).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: exam.passed ? '#22c55e' : '#ef4444' }}>
                  {exam.score}%
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                  background: exam.passed ? '#22c55e20' : '#ef444420',
                  color: exam.passed ? '#22c55e' : '#ef4444',
                }}>
                  {exam.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button onClick={() => setView('study')} style={{ ...btnPrimary, flex: 1 }}>
          Study Mode
        </button>
        <button onClick={() => setView('exam-setup')} style={{ ...btnSecondary, flex: 1 }}>
          Practice Exam
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          if (confirm('Reset all exam progress? This cannot be undone.')) {
            localStorage.removeItem('sparkCalc_examProgress_v2')
            setProgress(loadExamProgress())
          }
        }}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', padding: 8, textAlign: 'center', fontFamily: 'var(--font-sans)' }}
      >
        Reset All Progress
      </button>
    </div>
  )
}

function StatCard({ label: l, value, sub, color }: { label: string; value: string | number; sub: string; color?: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{l}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: color || 'var(--text)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   STUDY MODE
   ═══════════════════════════════════════════════ */

function StudyMode({ progress, setProgress, setView }: {
  progress: ReturnType<typeof loadExamProgress>
  setProgress: React.Dispatch<React.SetStateAction<ReturnType<typeof loadExamProgress>>>
  setView: (v: ExamView) => void
}) {
  const [catFilter, setCatFilter] = useState<ExamCategory | 'All'>('All')
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'all'>('all')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const startTimeRef = useRef(Date.now())

  // Build filtered question pool
  const pool = useMemo(() => {
    let qs = catFilter === 'All' ? examQuestions : (questionsByCategory.get(catFilter) || [])
    if (diffFilter !== 'all') qs = qs.filter(q => q.difficulty === diffFilter)
    return qs
  }, [catFilter, diffFilter])

  // Spaced repetition queue
  const queue = useMemo(() => {
    const ids = pool.map(q => q.id)
    return getStudyQueue(ids, progress.questionRecords, ids.length)
  }, [pool, progress.questionRecords])

  const [queueIndex, setQueueIndex] = useState(0)
  const currentId = queue[queueIndex]
  const currentQ = currentId != null ? examQuestions.find(q => q.id === currentId) : undefined

  // Reset queue index when filters change
  useEffect(() => { setQueueIndex(0); setSelectedAnswer(null); setShowExplanation(false) }, [catFilter, diffFilter])

  const isBookmarked = currentQ ? progress.questionRecords[currentQ.id]?.bookmarked ?? false : false

  const handleAnswer = useCallback((optIndex: number) => {
    if (selectedAnswer !== null || !currentQ) return
    setSelectedAnswer(optIndex)
    setShowExplanation(true)
    const wasCorrect = optIndex === currentQ.correctIndex

    setProgress(prev => ({
      ...prev,
      questionRecords: updateQuestionRecord(prev.questionRecords, currentQ.id, wasCorrect),
      streak: updateStreak(prev.streak),
      studyStats: {
        ...prev.studyStats,
        totalQuestionsAttempted: prev.studyStats.totalQuestionsAttempted + 1,
        totalCorrect: prev.studyStats.totalCorrect + (wasCorrect ? 1 : 0),
        totalStudyTimeMs: prev.studyStats.totalStudyTimeMs + (Date.now() - startTimeRef.current),
      },
    }))
    startTimeRef.current = Date.now()
  }, [selectedAnswer, currentQ, setProgress])

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQueueIndex(i => Math.min(i + 1, queue.length - 1))
    startTimeRef.current = Date.now()
  }, [queue.length])

  const toggleBookmark = useCallback(() => {
    if (!currentQ) return
    setProgress(prev => {
      const existing = prev.questionRecords[currentQ.id]
      return {
        ...prev,
        questionRecords: {
          ...prev.questionRecords,
          [currentQ.id]: {
            questionId: currentQ.id,
            attempts: existing?.attempts ?? 0,
            correct: existing?.correct ?? 0,
            lastSeen: existing?.lastSeen ?? Date.now(),
            nextDue: existing?.nextDue ?? Date.now(),
            bookmarked: !isBookmarked,
            consecutiveCorrect: existing?.consecutiveCorrect ?? 0,
          },
        },
      }
    })
  }, [currentQ, isBookmarked, setProgress])

  return (
    <div style={{ marginTop: 12 }}>
      {/* Back button */}
      <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>
        ← Dashboard
      </button>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '4px 0 8px', scrollbarWidth: 'none' }}>
        <button onClick={() => setCatFilter('All')} style={pill(catFilter === 'All')}>All</button>
        {ALL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)} style={pill(catFilter === cat, CATEGORY_COLORS[cat])}>
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {(['all', 'apprentice', 'journeyperson', 'master'] as const).map(d => (
          <button key={d} onClick={() => setDiffFilter(d)} style={pill(diffFilter === d)}>
            {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, height: 4, background: 'var(--input-bg)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: queue.length > 0 ? `${((queueIndex + 1) / queue.length) * 100}%` : '0%', background: 'var(--primary)', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          {queue.length > 0 ? `${queueIndex + 1}/${queue.length}` : '0/0'}
        </span>
      </div>

      {/* Question card */}
      {currentQ ? (
        <>
          <div style={{ ...card, position: 'relative' }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: CATEGORY_COLORS[currentQ.category] + '20', color: CATEGORY_COLORS[currentQ.category], textTransform: 'uppercase' }}>
                {currentQ.category}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{currentQ.difficulty}</span>
                <button onClick={toggleBookmark} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}>
                  {isBookmarked ? '★' : '☆'}
                </button>
              </div>
            </div>

            {/* Question text */}
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.6, marginBottom: 16 }}>
              {currentQ.question}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentQ.options.map((opt, idx) => {
                let bg = 'var(--input-bg)'
                let border = '1px solid var(--divider)'
                let textColor = 'var(--text)'
                if (selectedAnswer !== null) {
                  if (idx === currentQ.correctIndex) {
                    bg = '#22c55e18'; border = '2px solid #22c55e'; textColor = '#22c55e'
                  } else if (idx === selectedAnswer && idx !== currentQ.correctIndex) {
                    bg = '#ef444418'; border = '2px solid #ef4444'; textColor = '#ef4444'
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    style={{
                      padding: '12px 14px', borderRadius: 'var(--radius)', border, background: bg,
                      color: textColor, fontSize: 14, fontWeight: 500, cursor: selectedAnswer !== null ? 'default' : 'pointer',
                      textAlign: 'left', fontFamily: 'var(--font-sans)', minHeight: 'var(--touch-min)',
                      display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 13, opacity: 0.6 }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Explanation panel */}
          {showExplanation && (
            <div style={{ ...card, marginTop: 10, borderColor: 'var(--primary)', borderWidth: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Explanation</div>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
                {currentQ.explanation}
              </div>
              {currentQ.cecRef && (
                <div style={{ marginTop: 8, fontSize: 11, padding: '4px 8px', borderRadius: 4, background: 'var(--primary-dim)', color: 'var(--primary)', display: 'inline-block', fontWeight: 600 }}>
                  CEC Rule {currentQ.cecRef}
                </div>
              )}
              <button onClick={nextQuestion} style={{ ...btnPrimary, marginTop: 12 }}>
                {queueIndex < queue.length - 1 ? 'Next Question' : 'Finish'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 14 }}>
          No questions match your filters.
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   EXAM SETUP
   ═══════════════════════════════════════════════ */

// Store config in module scope so ActiveExam can read it
let examConfig = {
  questionCount: 20,
  timeLimitMin: 30,
  categories: [...ALL_CATEGORIES] as ExamCategory[],
  difficulty: 'mixed' as Difficulty | 'mixed',
}

function ExamSetup({ setView }: { setView: (v: ExamView) => void }) {
  const [count, setCount] = useState(examConfig.questionCount)
  const [time, setTime] = useState(examConfig.timeLimitMin)
  const [cats, setCats] = useState<ExamCategory[]>([...examConfig.categories])
  const [diff, setDiff] = useState<Difficulty | 'mixed'>(examConfig.difficulty)

  const toggleCat = (c: ExamCategory) => {
    setCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  const availableCount = useMemo(() => {
    let qs = examQuestions.filter(q => cats.includes(q.category))
    if (diff !== 'mixed') qs = qs.filter(q => q.difficulty === diff)
    return qs.length
  }, [cats, diff])

  const startExam = () => {
    examConfig = { questionCount: Math.min(count, availableCount), timeLimitMin: time, categories: cats, difficulty: diff }
    setView('exam-active')
  }

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', padding: '4px 0', fontFamily: 'var(--font-sans)', textAlign: 'left' }}>
        ← Dashboard
      </button>

      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Practice Exam Setup</div>

      {/* Question count */}
      <div>
        <div style={label}>Number of Questions</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[10, 20, 30, 50, 75].map(n => (
            <button key={n} onClick={() => setCount(n)} style={pill(count === n)}>{n}</button>
          ))}
        </div>
      </div>

      {/* Time limit */}
      <div>
        <div style={label}>Time Limit (minutes)</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[15, 30, 45, 60, 90, 0].map(t => (
            <button key={t} onClick={() => setTime(t)} style={pill(time === t)}>
              {t === 0 ? 'No Limit' : `${t} min`}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div style={{ ...label, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Categories</span>
          <button
            onClick={() => setCats(cats.length === ALL_CATEGORIES.length ? [] : [...ALL_CATEGORIES])}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, cursor: 'pointer', fontWeight: 600, padding: 0, fontFamily: 'var(--font-sans)' }}
          >
            {cats.length === ALL_CATEGORIES.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ALL_CATEGORIES.map(c => (
            <button key={c} onClick={() => toggleCat(c)} style={pill(cats.includes(c), CATEGORY_COLORS[c])}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <div style={label}>Difficulty</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['mixed', 'apprentice', 'journeyperson', 'master'] as const).map(d => (
            <button key={d} onClick={() => setDiff(d)} style={pill(diff === d)}>
              {d === 'mixed' ? 'Mixed' : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Available count + start */}
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
        {availableCount} questions available
      </div>

      <button
        onClick={startExam}
        disabled={cats.length === 0 || availableCount === 0}
        style={{ ...btnPrimary, opacity: cats.length === 0 || availableCount === 0 ? 0.4 : 1 }}
      >
        Start Exam ({Math.min(count, availableCount)} questions{time > 0 ? `, ${time} min` : ''})
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   ACTIVE EXAM
   ═══════════════════════════════════════════════ */

// Store completed session in module scope for review
let lastSession: ExamSession | null = null

function ActiveExam({ setProgress, setView }: {
  progress: ReturnType<typeof loadExamProgress>
  setProgress: React.Dispatch<React.SetStateAction<ReturnType<typeof loadExamProgress>>>
  setView: (v: ExamView) => void
}) {
  // Build exam questions on mount
  const [questions] = useState(() => {
    let pool = examQuestions.filter(q => examConfig.categories.includes(q.category))
    if (examConfig.difficulty !== 'mixed') pool = pool.filter(q => q.difficulty === examConfig.difficulty)
    // Shuffle and take
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, examConfig.questionCount)
  })

  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const startTimeRef = useRef(Date.now())
  const timeLimitMs = examConfig.timeLimitMin * 60 * 1000
  const [timeLeft, setTimeLeft] = useState(timeLimitMs)

  // Timer
  useEffect(() => {
    if (timeLimitMs === 0 || submitted) return
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = Math.max(0, timeLimitMs - elapsed)
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
        submitExam()
      }
    }, 1000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted])

  const selectAnswer = useCallback((optIdx: number) => {
    if (submitted) return
    setAnswers(prev => {
      const next = [...prev]
      next[currentIdx] = optIdx
      return next
    })
  }, [currentIdx, submitted])

  const submitExam = useCallback(() => {
    if (submitted) return
    setSubmitted(true)
    const elapsed = Date.now() - startTimeRef.current
    const examAnswers: ExamAnswer[] = questions.map((q, i) => ({
      questionId: q.id,
      selectedIndex: answers[i],
      correct: answers[i] === q.correctIndex,
      timeSpentMs: Math.round(elapsed / questions.length),
    }))
    const correctCount = examAnswers.filter(a => a.correct).length
    const score = Math.round((correctCount / questions.length) * 100)

    const session: ExamSession = {
      id: crypto.randomUUID(),
      date: Date.now(),
      categories: examConfig.categories,
      difficulty: examConfig.difficulty,
      totalQuestions: questions.length,
      timeLimitSeconds: examConfig.timeLimitMin * 60,
      timeUsedSeconds: Math.round(elapsed / 1000),
      answers: examAnswers,
      score,
      passed: score >= 70,
    }
    lastSession = session

    setProgress(prev => {
      let records = { ...prev.questionRecords }
      for (const a of examAnswers) {
        if (a.selectedIndex !== null) {
          records = updateQuestionRecord(records, a.questionId, a.correct)
        }
      }
      return {
        ...prev,
        questionRecords: records,
        examSessions: addExamSession(prev.examSessions, session),
        streak: updateStreak(prev.streak),
        studyStats: {
          totalQuestionsAttempted: prev.studyStats.totalQuestionsAttempted + examAnswers.filter(a => a.selectedIndex !== null).length,
          totalCorrect: prev.studyStats.totalCorrect + correctCount,
          totalStudyTimeMs: prev.studyStats.totalStudyTimeMs + elapsed,
        },
      }
    })
    setView('exam-review')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, questions, answers, setProgress, setView])

  const unanswered = answers.filter(a => a === null).length
  const currentQ = questions[currentIdx]

  const formatTime = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000)
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (!currentQ) return null

  return (
    <div style={{ marginTop: 12 }}>
      {/* Timer + progress row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          Q{currentIdx + 1}/{questions.length}
        </span>
        {timeLimitMs > 0 && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700,
            color: timeLeft < 300_000 ? '#ef4444' : 'var(--text)',
          }}>
            {formatTime(timeLeft)}
          </span>
        )}
      </div>

      {/* Answer status dots */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            style={{
              width: 24, height: 24, borderRadius: '50%', border: i === currentIdx ? '2px solid var(--primary)' : '1px solid var(--divider)',
              background: answers[i] !== null ? 'var(--primary)' : 'transparent',
              cursor: 'pointer', padding: 0, fontSize: 9, fontWeight: 700,
              color: answers[i] !== null ? '#000' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div style={card}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: CATEGORY_COLORS[currentQ.category] + '20', color: CATEGORY_COLORS[currentQ.category], textTransform: 'uppercase', marginBottom: 12, display: 'inline-block' }}>
          {currentQ.category}
        </span>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.6, marginBottom: 16 }}>
          {currentQ.question}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => selectAnswer(idx)}
              style={{
                padding: '12px 14px', borderRadius: 'var(--radius)',
                border: answers[currentIdx] === idx ? '2px solid var(--primary)' : '1px solid var(--divider)',
                background: answers[currentIdx] === idx ? 'var(--primary-dim)' : 'var(--input-bg)',
                color: answers[currentIdx] === idx ? 'var(--primary)' : 'var(--text)',
                fontSize: 14, fontWeight: answers[currentIdx] === idx ? 600 : 500,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)',
                minHeight: 'var(--touch-min)', display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 13, opacity: 0.6 }}>
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button
          onClick={() => { if (currentIdx > 0) setCurrentIdx(i => i - 1) }}
          disabled={currentIdx === 0}
          style={{ ...btnSecondary, flex: 1, opacity: currentIdx === 0 ? 0.4 : 1 }}
        >
          Previous
        </button>
        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            style={{ ...btnPrimary, flex: 1 }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => {
              if (unanswered > 0) {
                if (!confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`)) return
              }
              submitExam()
            }}
            style={{ ...btnPrimary, flex: 1, background: '#22c55e' }}
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   EXAM REVIEW
   ═══════════════════════════════════════════════ */

function ExamReview({ progress, setView }: {
  progress: ReturnType<typeof loadExamProgress>
  setProgress: React.Dispatch<React.SetStateAction<ReturnType<typeof loadExamProgress>>>
  setView: (v: ExamView) => void
}) {
  const session = lastSession
  const [filter, setFilter] = useState<'all' | 'wrong' | 'bookmarked'>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  if (!session) {
    return (
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>No exam to review.</div>
        <button onClick={() => setView('dashboard')} style={btnPrimary}>Dashboard</button>
      </div>
    )
  }

  const correctCount = session.answers.filter(a => a.correct).length
  const wrongCount = session.answers.filter(a => !a.correct).length

  // Category breakdown
  const catBreakdown = useMemo(() => {
    const map: Record<string, { total: number; correct: number }> = {}
    for (const a of session.answers) {
      const q = examQuestions.find(eq => eq.id === a.questionId)
      if (!q) continue
      if (!map[q.category]) map[q.category] = { total: 0, correct: 0 }
      map[q.category].total++
      if (a.correct) map[q.category].correct++
    }
    return map
  }, [session])

  const filteredAnswers = useMemo(() => {
    if (filter === 'wrong') return session.answers.filter(a => !a.correct)
    if (filter === 'bookmarked') return session.answers.filter(a => progress.questionRecords[a.questionId]?.bookmarked)
    return session.answers
  }, [session, filter, progress.questionRecords])

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}m ${s}s`
  }

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Score header */}
      <div style={{ ...card, textAlign: 'center', padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700, color: session.passed ? '#22c55e' : '#ef4444' }}>
          {session.score}%
        </div>
        <div style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: 4, marginTop: 8,
          background: session.passed ? '#22c55e20' : '#ef444420',
          color: session.passed ? '#22c55e' : '#ef4444',
          fontSize: 13, fontWeight: 700,
        }}>
          {session.passed ? 'PASSED' : 'FAILED'} (70% required)
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Correct</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#22c55e' }}>{correctCount}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Wrong</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#ef4444' }}>{wrongCount}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Time</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
              {formatDuration(session.timeUsedSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div style={card}>
        <div style={label}>Category Breakdown</div>
        {Object.entries(catBreakdown).map(([cat, data]) => {
          const pct = Math.round((data.correct / data.total) * 100)
          return (
            <div key={cat} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: 'var(--text)' }}>{cat}</span>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: pct >= 70 ? '#22c55e' : '#ef4444' }}>
                  {data.correct}/{data.total} ({pct}%)
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--input-bg)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: CATEGORY_COLORS[cat as ExamCategory] || 'var(--primary)', borderRadius: 2 }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => setFilter('all')} style={pill(filter === 'all')}>All ({session.answers.length})</button>
        <button onClick={() => setFilter('wrong')} style={pill(filter === 'wrong')}>Wrong ({wrongCount})</button>
        <button onClick={() => setFilter('bookmarked')} style={pill(filter === 'bookmarked')}>Bookmarked</button>
      </div>

      {/* Question-by-question review */}
      {filteredAnswers.map((ans) => {
        const q = examQuestions.find(eq => eq.id === ans.questionId)
        if (!q) return null
        const isExpanded = expandedId === q.id
        return (
          <div
            key={q.id}
            onClick={() => setExpandedId(isExpanded ? null : q.id)}
            style={{ ...card, cursor: 'pointer', borderColor: ans.correct ? '#22c55e40' : '#ef444440' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: ans.correct ? '#22c55e20' : '#ef444420', color: ans.correct ? '#22c55e' : '#ef4444',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>
                {ans.correct ? '✓' : '✗'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5 }}>
                  {q.question}
                </div>
                {!ans.correct && (
                  <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>
                    Your answer: {ans.selectedIndex !== null ? q.options[ans.selectedIndex] : 'Skipped'}
                  </div>
                )}
                {isExpanded && (
                  <div style={{ marginTop: 10, padding: 10, background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 6 }}>
                      Correct: {q.options[q.correctIndex]}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>
                      {q.explanation}
                    </div>
                    {q.cecRef && (
                      <div style={{ marginTop: 6, fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'var(--primary-dim)', color: 'var(--primary)', display: 'inline-block', fontWeight: 600 }}>
                        CEC Rule {q.cecRef}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button onClick={() => setView('dashboard')} style={{ ...btnSecondary, flex: 1 }}>Dashboard</button>
        <button onClick={() => setView('exam-setup')} style={{ ...btnPrimary, flex: 1 }}>Retry</button>
      </div>
      {wrongCount > 0 && (
        <button
          onClick={() => {
            // Set exam config to only weak categories
            const weakCats = new Set<ExamCategory>()
            for (const a of session.answers) {
              if (!a.correct) {
                const q = examQuestions.find(eq => eq.id === a.questionId)
                if (q) weakCats.add(q.category)
              }
            }
            examConfig.categories = [...weakCats]
            setView('exam-setup')
          }}
          style={{ ...btnSecondary, color: '#ef4444', borderColor: '#ef444440' }}
        >
          Study Weak Areas ({wrongCount} wrong)
        </button>
      )}
    </div>
  )
}
