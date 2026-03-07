/* ══════════════════════════════════════════════
   309A Exam Prep — Type Definitions
   ══════════════════════════════════════════════ */

export type ExamCategory =
  | 'CEC Code'
  | 'Electrical Theory'
  | 'Motors & Transformers'
  | 'Wiring Methods'
  | 'Safety & OHSA'
  | 'Trade Math'
  | 'Blueprint Reading'
  | 'Controls & Devices'

export type Difficulty = 'apprentice' | 'journeyperson' | 'master'

export interface ExamQuestion {
  id: number
  question: string
  options: [string, string, string, string]
  correctIndex: number // 0-3
  explanation: string
  category: ExamCategory
  difficulty: Difficulty
  cecRef?: string   // e.g. '8-102' — maps to cecRulesData
  tags?: string[]
}

export interface QuestionRecord {
  questionId: number
  attempts: number
  correct: number
  lastSeen: number          // Date.now()
  nextDue: number           // Date.now() for spaced repetition
  bookmarked: boolean
  consecutiveCorrect: number
}

export interface ExamAnswer {
  questionId: number
  selectedIndex: number | null  // null = skipped
  correct: boolean
  timeSpentMs: number
}

export interface ExamSession {
  id: string
  date: number
  categories: ExamCategory[]
  difficulty: Difficulty | 'mixed'
  totalQuestions: number
  timeLimitSeconds: number
  timeUsedSeconds: number
  answers: ExamAnswer[]
  score: number   // 0-100
  passed: boolean // score >= 70
}

export interface ExamProgress {
  version: 2
  questionRecords: Record<number, QuestionRecord>
  examSessions: ExamSession[]
  streak: {
    currentStreak: number
    longestStreak: number
    lastStudyDate: string // 'YYYY-MM-DD'
  }
  studyStats: {
    totalQuestionsAttempted: number
    totalCorrect: number
    totalStudyTimeMs: number
  }
}

export type ExamView = 'dashboard' | 'study' | 'exam-setup' | 'exam-active' | 'exam-review'

export const ALL_CATEGORIES: ExamCategory[] = [
  'CEC Code', 'Electrical Theory', 'Motors & Transformers',
  'Wiring Methods', 'Safety & OHSA', 'Trade Math',
  'Blueprint Reading', 'Controls & Devices',
]

export const CATEGORY_COLORS: Record<ExamCategory, string> = {
  'CEC Code': '#3b82f6',
  'Electrical Theory': '#8b5cf6',
  'Motors & Transformers': '#22c55e',
  'Wiring Methods': '#06b6d4',
  'Safety & OHSA': '#ef4444',
  'Trade Math': '#f59e0b',
  'Blueprint Reading': '#ec4899',
  'Controls & Devices': '#f97316',
}
