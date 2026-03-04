import { useState, useEffect, useMemo, useCallback } from 'react'
import Header from '../../layout/Header'

type CardCategory = 'CEC Rules' | 'Electrical Theory' | 'Motor Controls' | 'Safety (CSA Z462)' | 'Ontario Regulations'

interface Flashcard {
  id: number
  question: string
  answer: string
  category: CardCategory
}

interface Progress {
  correct: number
  incorrect: number
  seen: number[]
}

const STORAGE_KEY = 'sparkCalc_examProgress'
const allCategories: CardCategory[] = [
  'CEC Rules',
  'Electrical Theory',
  'Motor Controls',
  'Safety (CSA Z462)',
  'Ontario Regulations',
]

const flashcards: Flashcard[] = [
  // CEC Rules (15 cards)
  { id: 1, question: 'What is the maximum voltage drop allowed on a branch circuit?', answer: '3% on branch circuit, 5% total from service entrance to point of utilization (CEC Rule 8-102).', category: 'CEC Rules' },
  { id: 2, question: 'What size bonding conductor is required for a 200A service?', answer: '6 AWG copper (CEC Table 17).', category: 'CEC Rules' },
  { id: 3, question: 'What is the minimum burial depth for direct-buried cable under a driveway?', answer: '600mm (CEC Table 53).', category: 'CEC Rules' },
  { id: 4, question: 'What is the demand factor for the first 5000W of a residential service calculation?', answer: '100% for the first 5000W (CEC Rule 8-200).', category: 'CEC Rules' },
  { id: 5, question: 'What is the maximum number of conductors allowed in 3/4" (21mm) EMT?', answer: 'Depends on wire type and fill tables. Example: 3 x #12 THHN at 40% fill (CEC Table 8).', category: 'CEC Rules' },
  { id: 6, question: 'What is the minimum height for a residential service mast above a roof?', answer: '1.0m minimum above the roof surface (CEC Rule 6-116).', category: 'CEC Rules' },
  { id: 7, question: 'What is the maximum overcurrent protection for #14 AWG copper wire?', answer: '15 amperes (CEC Rule 14-104 and Table 13).', category: 'CEC Rules' },
  { id: 8, question: 'At what current rating must a disconnect be capable of being locked open?', answer: 'All disconnects must be capable of being locked open (CEC Rule 14-402).', category: 'CEC Rules' },
  { id: 9, question: 'What is the standard residential branch circuit voltage in Ontario?', answer: '120V single-phase from a 120/240V service (CEC Rule 8-102).', category: 'CEC Rules' },
  { id: 10, question: 'What is the minimum service size for a single dwelling in Ontario?', answer: '100A minimum (CEC Rule 8-200(1)(a)).', category: 'CEC Rules' },
  { id: 11, question: 'What is the maximum distance between supports for NMD90 cable?', answer: '1.5m between supports, and within 300mm of each box (CEC Rule 12-510).', category: 'CEC Rules' },
  { id: 12, question: 'What size bonding conductor is needed for a 100A sub-panel?', answer: '8 AWG copper (CEC Table 17).', category: 'CEC Rules' },
  { id: 13, question: 'How many receptacles are permitted on a 15A residential branch circuit?', answer: '12 receptacles maximum (CEC Rule 26-724(a)).', category: 'CEC Rules' },
  { id: 14, question: 'What is the conduit fill percentage for 3 or more conductors?', answer: '40% maximum fill (CEC Table 8).', category: 'CEC Rules' },
  { id: 15, question: 'What is the minimum clearance for a 120/240V service entrance above a walkway?', answer: '3.0m minimum (CEC Rule 6-112).', category: 'CEC Rules' },

  // Electrical Theory (12 cards)
  { id: 16, question: 'What is the formula for three-phase power?', answer: 'P = \√3 \× V_L \× I_L \× PF (where V_L is line voltage, I_L is line current, PF is power factor).', category: 'Electrical Theory' },
  { id: 17, question: 'In a balanced wye system, what is the relationship between line and phase voltage?', answer: 'V_Line = \√3 \× V_Phase. For a 208V system, V_Phase = 120V.', category: 'Electrical Theory' },
  { id: 18, question: 'What is the power factor of a purely resistive load?', answer: 'Power factor = 1.0 (unity). Voltage and current are in phase.', category: 'Electrical Theory' },
  { id: 19, question: 'How many watts are in one horsepower?', answer: '746 watts = 1 HP.', category: 'Electrical Theory' },
  { id: 20, question: 'What is the formula for transformer turns ratio?', answer: 'Np/Ns = Vp/Vs = Is/Ip (primary turns/secondary turns = primary voltage/secondary voltage).', category: 'Electrical Theory' },
  { id: 21, question: 'What is the synchronous speed of a 4-pole motor at 60 Hz?', answer: 'Ns = 120f/P = 120 \× 60/4 = 1800 RPM.', category: 'Electrical Theory' },
  { id: 22, question: 'In a delta connection, what is the relationship between line current and phase current?', answer: 'I_Line = \√3 \× I_Phase. Line voltage equals phase voltage.', category: 'Electrical Theory' },
  { id: 23, question: 'What is the formula for capacitive reactance?', answer: 'Xc = 1 / (2\πfC) where f is frequency in Hz and C is capacitance in farads.', category: 'Electrical Theory' },
  { id: 24, question: 'What is the formula for inductive reactance?', answer: 'XL = 2\πfL where f is frequency in Hz and L is inductance in henries.', category: 'Electrical Theory' },
  { id: 25, question: 'What is impedance in an AC circuit?', answer: 'Z = \√(R\² + (XL - Xc)\²). Impedance is the total opposition to current flow in an AC circuit, measured in ohms.', category: 'Electrical Theory' },
  { id: 26, question: 'What is the relationship between kW, kVA, and kVAR?', answer: 'kVA\² = kW\² + kVAR\² (power triangle). kW = kVA \× PF.', category: 'Electrical Theory' },
  { id: 27, question: 'What happens to current when you double the voltage across a fixed resistance?', answer: 'Current doubles. I = V/R (Ohm\'s Law). Doubling V with constant R doubles I.', category: 'Electrical Theory' },

  // Motor Controls (10 cards)
  { id: 28, question: 'What is the maximum overcurrent protection for a motor with FLC of 40A using an inverse time breaker?', answer: '250% of FLC = 100A. Next standard size up if calculated value does not match a standard breaker (CEC Rule 28-200, Table 29).', category: 'Motor Controls' },
  { id: 29, question: 'What size overload relay heater is required for a motor?', answer: 'Overload protection must not exceed 115% of motor nameplate FLA for standard motors, 125% for motors with service factor 1.15 or higher (CEC Rule 28-306).', category: 'Motor Controls' },
  { id: 30, question: 'What is the minimum conductor size for a single motor branch circuit?', answer: '125% of motor FLC (CEC Rule 28-106). Use FLC from CEC Table 44, 45, or 46, not the nameplate.', category: 'Motor Controls' },
  { id: 31, question: 'What is the difference between a NEMA Size 1 and Size 2 starter?', answer: 'Size 1: up to 10 HP at 460V. Size 2: up to 25 HP at 460V. Size determines the contactor rating and physical size.', category: 'Motor Controls' },
  { id: 32, question: 'What is a VFD and what is its primary purpose?', answer: 'Variable Frequency Drive. Controls motor speed by varying the frequency and voltage supplied to the motor. Provides soft starting, energy savings, and precise speed control.', category: 'Motor Controls' },
  { id: 33, question: 'Why must you use CEC Table values for motor FLC instead of nameplate values?', answer: 'CEC Tables (44, 45, 46) provide standardized FLC values for sizing branch circuit conductors and overcurrent protection. Nameplate values may vary between manufacturers.', category: 'Motor Controls' },
  { id: 34, question: 'What is the purpose of a motor starter overload relay?', answer: 'Protects the motor from sustained overcurrent (overload) conditions. Trips the contactor to disconnect the motor before insulation damage occurs. Does NOT protect against short circuits.', category: 'Motor Controls' },
  { id: 35, question: 'In a star-delta (wye-delta) starter, what happens to the starting current?', answer: 'Starting current is reduced to 1/3 of the direct-on-line (DOL) value. Motor starts in wye (lower voltage per winding), then switches to delta for full speed.', category: 'Motor Controls' },
  { id: 36, question: 'What is motor slip and what is a typical value?', answer: 'Slip is the difference between synchronous speed and actual rotor speed, expressed as a percentage. Typical slip for induction motors is 2-5%. Slip = (Ns - N) / Ns \× 100.', category: 'Motor Controls' },
  { id: 37, question: 'What is the purpose of a disconnect switch on a motor circuit?', answer: 'Provides a visible, lockable means of disconnecting the motor for maintenance. Must be within sight of the motor and controller, or be capable of being locked open (CEC Rule 28-602).', category: 'Motor Controls' },

  // Safety (CSA Z462) (8 cards)
  { id: 38, question: 'What is the arc flash PPE Category 2 minimum rating?', answer: '8 cal/cm\² minimum arc rating for PPE Category 2 (CSA Z462 Table 4A).', category: 'Safety (CSA Z462)' },
  { id: 39, question: 'What voltage is the threshold for requiring arc flash PPE in CSA Z462?', answer: 'Greater than 50V AC or 100V DC. Below these thresholds, the shock hazard is considered minimal for normal conditions.', category: 'Safety (CSA Z462)' },
  { id: 40, question: 'What are the two main hazards of electrical work covered by CSA Z462?', answer: 'Shock hazard (contact with energized conductors) and arc flash hazard (release of thermal energy from an arc fault).', category: 'Safety (CSA Z462)' },
  { id: 41, question: 'What is the limited approach boundary?', answer: 'The distance from an exposed energized part within which a shock hazard exists. For 208-600V, it is typically 1.0m (CSA Z462 Table 2A).', category: 'Safety (CSA Z462)' },
  { id: 42, question: 'What is the restricted approach boundary?', answer: 'The distance from an exposed energized part within which an increased risk of shock exists due to electrical arc-over. Requires additional PPE and a qualified person.', category: 'Safety (CSA Z462)' },
  { id: 43, question: 'What PPE Category applies to voltage testing on a 600V panelboard?', answer: 'PPE Category 1 (minimum 4 cal/cm\²) for voltage testing on a panelboard up to 600V with one transformer in the supply (CSA Z462 Table 4A).', category: 'Safety (CSA Z462)' },
  { id: 44, question: 'What is an Energized Electrical Work Permit (EEWP)?', answer: 'A documented authorization to perform work on or near energized conductors when de-energizing is infeasible. Must include hazard analysis, PPE requirements, and justification for not de-energizing.', category: 'Safety (CSA Z462)' },
  { id: 45, question: 'What are the steps of Lockout/Tagout (LOTO)?', answer: '1. Notify affected personnel. 2. Identify energy sources. 3. Isolate energy sources. 4. Apply locks and tags. 5. Release stored energy. 6. Verify zero energy state (test for absence of voltage).', category: 'Safety (CSA Z462)' },

  // Ontario Regulations (10 cards)
  { id: 46, question: 'What is the ground fault protection trip time required in Ontario mines?', answer: 'Ground fault protection must trip in \≤200ms at \≤100mA on all underground distribution systems (Ontario Mining Regs O. Reg 854).', category: 'Ontario Regulations' },
  { id: 47, question: 'How many total hours are required for the Ontario 309A Construction & Maintenance Electrician certification?', answer: '9000 hours total over 5 levels (approximately 1800 hours per level), plus 720 hours of in-school training (3 sessions of 240 hours each).', category: 'Ontario Regulations' },
  { id: 48, question: 'What is the maximum voltage for portable tools in Ontario underground mines?', answer: '250V for portable hand-held tools underground. 750V maximum for portable or mobile equipment connected by trailing cable.', category: 'Ontario Regulations' },
  { id: 49, question: 'Who is responsible for issuing Electrical Safety Authority (ESA) permits in Ontario?', answer: 'The Electrical Safety Authority (ESA) is the regulator. Licensed Electrical Contractors (LECs) pull ESA permits. Only LECs and authorized persons can do electrical work.', category: 'Ontario Regulations' },
  { id: 50, question: 'What is the minimum distance for approach to overhead power lines during crane operation in Ontario?', answer: '3.0m minimum for lines up to 750V. 6.0m for lines over 750V up to 150kV (O. Reg 213/91, Construction Projects).', category: 'Ontario Regulations' },
  { id: 51, question: 'What are the requirements for a ground check system on trailing cables in Ontario mines?', answer: 'A pilot or ground check conductor must continuously monitor the grounding conductor integrity. If the ground circuit is broken, the power must automatically disconnect within 200ms.', category: 'Ontario Regulations' },
  { id: 52, question: 'What frequency is standard in Ontario and how does it affect motor speed?', answer: '60 Hz. Synchronous speed = 120f/P. A 4-pole motor runs at approximately 1725-1770 RPM (synchronous speed 1800 RPM minus slip).', category: 'Ontario Regulations' },
  { id: 53, question: 'What is the OESC and how does it relate to the CEC in Ontario?', answer: 'Ontario Electrical Safety Code (OESC) is the Ontario adoption of the Canadian Electrical Code (CEC) with Ontario-specific amendments. It is enforced by the ESA.', category: 'Ontario Regulations' },
  { id: 54, question: 'What type of cable is most commonly used for power distribution in Ontario mines?', answer: 'TECK90 for permanent installations (interlocking aluminum armour, 1000V). Type W or G-GC trailing cables for mobile equipment. SHD-GC for high-voltage mobile equipment (>5kV).', category: 'Ontario Regulations' },
  { id: 55, question: 'What is the maximum overcurrent protection for a transformer primary in the CEC?', answer: 'Primary protection: 125% of primary FLC for transformers with secondary protection. 300% of primary FLC for transformers 600V or less without secondary protection, if rated current is 9A or more (CEC Rule 26-252).', category: 'Ontario Regulations' },
]

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { correct: 0, incorrect: 0, seen: [] }
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const pillStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 12px',
  borderRadius: 'var(--radius)',
  border: 'none',
  background: active ? 'var(--primary)' : 'var(--surface)',
  color: active ? '#000' : 'var(--text-secondary)',
  fontWeight: active ? 700 : 500,
  fontSize: 12,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  minHeight: 'var(--touch-min)',
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'var(--font-sans)',
})

export default function ExamPrepPage() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [category, setCategory] = useState<CardCategory | 'All'>('All')
  const [shuffled, setShuffled] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const deck = useMemo(() => {
    let cards = category === 'All' ? flashcards : flashcards.filter((c) => c.category === category)
    if (shuffled) cards = shuffleArray(cards)
    return cards
  }, [category, shuffled])

  const currentCard = deck[currentIndex] || null
  const total = deck.length

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    setCurrentIndex(0)
    setFlipped(false)
  }, [category, shuffled])

  const markAnswer = useCallback(
    (correct: boolean) => {
      if (!currentCard) return
      setProgress((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
        seen: [...new Set([...prev.seen, currentCard.id])],
      }))
      setFlipped(false)
      if (currentIndex < total - 1) {
        setCurrentIndex((i) => i + 1)
      }
    },
    [currentCard, currentIndex, total]
  )

  const resetProgress = () => {
    setProgress({ correct: 0, incorrect: 0, seen: [] })
    setCurrentIndex(0)
    setFlipped(false)
  }

  const goNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1)
      setFlipped(false)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      setFlipped(false)
    }
  }

  const sessionTotal = progress.correct + progress.incorrect
  const accuracy = sessionTotal > 0 ? Math.round((progress.correct / sessionTotal) * 100) : 0

  return (
    <>
      <Header title="Exam Prep" />
      <div style={{ padding: '0 16px 120px' }}>
        {/* Score bar */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            padding: 12,
            marginTop: 12,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Correct</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#4caf50' }}>
              {progress.correct}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Incorrect</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#f44336' }}>
              {progress.incorrect}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Accuracy</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
              {accuracy}%
            </div>
          </div>
          <button
            onClick={resetProgress}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--divider)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 12,
              cursor: 'pointer',
              minHeight: 40,
              fontFamily: 'var(--font-sans)',
            }}
          >
            Reset
          </button>
        </div>

        {/* Category filter */}
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
          <button onClick={() => setCategory('All')} style={pillStyle(category === 'All')}>
            All ({flashcards.length})
          </button>
          {allCategories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} style={pillStyle(category === cat)}>
              {cat} ({flashcards.filter((c) => c.category === cat).length})
            </button>
          ))}
        </div>

        {/* Shuffle toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setShuffled(!shuffled)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius)',
              border: shuffled ? '2px solid var(--primary)' : '1px solid var(--divider)',
              background: shuffled ? 'var(--primary-dim)' : 'transparent',
              color: shuffled ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: 'var(--touch-min)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {shuffled ? '\✓ Shuffled' : 'Shuffle'}
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--input-bg)', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${total > 0 ? ((currentIndex + 1) / total) * 100 : 0}%`,
              background: 'var(--primary)',
              borderRadius: 2,
              transition: 'width 0.3s',
            }}
          />
        </div>

        {/* Flashcard */}
        {currentCard ? (
          <div
            onClick={() => setFlipped(!flipped)}
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              padding: 24,
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              border: flipped ? '2px solid var(--primary)' : '1px solid var(--divider)',
              transition: 'border 0.2s',
              position: 'relative',
            }}
          >
            {/* Category badge */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-dim)',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {currentCard.category}
            </div>

            {/* Tap hint */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontSize: 10,
                color: 'var(--text-secondary)',
              }}
            >
              {flipped ? 'Tap to see question' : 'Tap to reveal answer'}
            </div>

            {!flipped ? (
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: 'var(--text)',
                  lineHeight: 1.6,
                  textAlign: 'center',
                  padding: '16px 0',
                }}
              >
                {currentCard.question}
              </div>
            ) : (
              <div
                style={{
                  fontSize: 15,
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.7,
                  textAlign: 'center',
                  padding: '16px 0',
                  fontWeight: 600,
                }}
              >
                {currentCard.answer}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: 'var(--text-secondary)',
              fontSize: 14,
            }}
          >
            No cards in this category.
          </div>
        )}

        {/* Answer buttons (only when flipped) */}
        {currentCard && flipped && (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                markAnswer(false)
              }}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 'var(--radius)',
                border: '2px solid #f44336',
                background: 'transparent',
                color: '#f44336',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                minHeight: 'var(--touch-min)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Incorrect
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                markAnswer(true)
              }}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 'var(--radius)',
                border: '2px solid #4caf50',
                background: 'transparent',
                color: '#4caf50',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                minHeight: 'var(--touch-min)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Correct
            </button>
          </div>
        )}

        {/* Navigation */}
        {currentCard && (
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: 'var(--surface)',
                color: currentIndex === 0 ? 'var(--text-secondary)' : 'var(--text)',
                fontSize: 14,
                fontWeight: 600,
                cursor: currentIndex === 0 ? 'default' : 'pointer',
                opacity: currentIndex === 0 ? 0.4 : 1,
                minHeight: 'var(--touch-min)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              \← Previous
            </button>
            <button
              onClick={goNext}
              disabled={currentIndex >= total - 1}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: 'var(--surface)',
                color: currentIndex >= total - 1 ? 'var(--text-secondary)' : 'var(--text)',
                fontSize: 14,
                fontWeight: 600,
                cursor: currentIndex >= total - 1 ? 'default' : 'pointer',
                opacity: currentIndex >= total - 1 ? 0.4 : 1,
                minHeight: 'var(--touch-min)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Next \→
            </button>
          </div>
        )}

        {/* Cards seen */}
        <div
          style={{
            marginTop: 20,
            fontSize: 12,
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          {progress.seen.length} of {flashcards.length} unique cards seen this session
        </div>
      </div>
    </>
  )
}
