/* ══════════════════════════════════════════════
   309A Exam Prep — Storage & Spaced Repetition
   ══════════════════════════════════════════════ */

import type { ExamProgress, QuestionRecord, ExamSession } from './examTypes'

const STORAGE_KEY = 'sparkCalc_examProgress_v2'
const LEGACY_KEY = 'sparkCalc_examProgress'

function createDefault(): ExamProgress {
  return {
    version: 2,
    questionRecords: {},
    examSessions: [],
    streak: { currentStreak: 0, longestStreak: 0, lastStudyDate: '' },
    studyStats: { totalQuestionsAttempted: 0, totalCorrect: 0, totalStudyTimeMs: 0 },
  }
}

export function loadExamProgress(): ExamProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)

    // Migrate from legacy flashcard format
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const old = JSON.parse(legacy) as { correct: number; incorrect: number; seen: number[] }
      const migrated = createDefault()
      migrated.studyStats.totalQuestionsAttempted = old.correct + old.incorrect
      migrated.studyStats.totalCorrect = old.correct
      for (const id of old.seen) {
        migrated.questionRecords[id] = {
          questionId: id, attempts: 1, correct: 0,
          lastSeen: Date.now(), nextDue: Date.now(),
          bookmarked: false, consecutiveCorrect: 0,
        }
      }
      return migrated
    }
  } catch { /* ignore */ }
  return createDefault()
}

export function saveExamProgress(p: ExamProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

/* ── Spaced Repetition (simplified SM-2) ── */

// Intervals: wrong=1min, 1=1day, 2=3days, 3=7days, 4=14days, 5+=30days
const INTERVALS_MS = [
  60_000,
  86_400_000,
  259_200_000,
  604_800_000,
  1_209_600_000,
  2_592_000_000,
]

function getNextDue(consecutiveCorrect: number): number {
  const idx = Math.min(consecutiveCorrect, INTERVALS_MS.length - 1)
  return Date.now() + INTERVALS_MS[idx]
}

export function updateQuestionRecord(
  records: Record<number, QuestionRecord>,
  questionId: number,
  wasCorrect: boolean,
  bookmarked?: boolean,
): Record<number, QuestionRecord> {
  const existing = records[questionId]
  const consecutive = wasCorrect ? (existing?.consecutiveCorrect ?? 0) + 1 : 0

  return {
    ...records,
    [questionId]: {
      questionId,
      attempts: (existing?.attempts ?? 0) + 1,
      correct: (existing?.correct ?? 0) + (wasCorrect ? 1 : 0),
      lastSeen: Date.now(),
      nextDue: getNextDue(consecutive),
      bookmarked: bookmarked ?? existing?.bookmarked ?? false,
      consecutiveCorrect: consecutive,
    },
  }
}

/* ── Streak ── */

export function updateStreak(streak: ExamProgress['streak']): ExamProgress['streak'] {
  const today = new Date().toISOString().slice(0, 10)
  if (streak.lastStudyDate === today) return streak

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  const newStreak = streak.lastStudyDate === yesterday
    ? streak.currentStreak + 1
    : 1

  return {
    currentStreak: newStreak,
    longestStreak: Math.max(streak.longestStreak, newStreak),
    lastStudyDate: today,
  }
}

/* ── Study Queue (spaced repetition priority) ── */

export function getStudyQueue(
  allIds: number[],
  records: Record<number, QuestionRecord>,
  limit = 20,
): number[] {
  const now = Date.now()
  const due: { id: number; priority: number }[] = []
  const unseen: number[] = []
  const notDue: { id: number; nextDue: number }[] = []

  for (const id of allIds) {
    const rec = records[id]
    if (!rec) {
      unseen.push(id)
    } else if (rec.nextDue <= now) {
      const overdue = (now - rec.nextDue) / 86_400_000
      const wrongRate = rec.attempts > 0 ? 1 - rec.correct / rec.attempts : 0.5
      due.push({ id, priority: overdue + wrongRate * 10 })
    } else {
      notDue.push({ id, nextDue: rec.nextDue })
    }
  }

  due.sort((a, b) => b.priority - a.priority)
  const shuffled = [...unseen].sort(() => Math.random() - 0.5)
  notDue.sort((a, b) => a.nextDue - b.nextDue)

  const queue: number[] = []
  for (const d of due) if (queue.length < limit) queue.push(d.id)
  for (const id of shuffled) if (queue.length < limit) queue.push(id)
  for (const d of notDue) if (queue.length < limit) queue.push(d.id)
  return queue
}

/* ── Session management ── */

export function addExamSession(sessions: ExamSession[], s: ExamSession): ExamSession[] {
  return [s, ...sessions].slice(0, 50)
}
