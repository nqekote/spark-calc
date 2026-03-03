import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Mining Electrical Safety Data - Ontario Mining Regs & CEC          */
/* ------------------------------------------------------------------ */

type SectionKey = 'lockout' | 'grounding' | 'cables' | 'inspection' | 'emergency' | 'ppe'

interface SafetyRule {
  title: string
  rule: string
  detail: string
  critical?: boolean
}

interface Section {
  key: SectionKey
  label: string
  icon: string
  rules: SafetyRule[]
}

const sections: Section[] = [
  {
    key: 'lockout',
    label: 'Lockout/Tagout',
    icon: '\uD83D\uDD12',
    rules: [
      {
        title: 'Personal Lock Required',
        rule: 'O. Reg. 854, s. 160',
        detail: 'Every worker performing electrical work must apply their own personal lock and tag. No worker shall rely on another worker\'s lock.',
        critical: true,
      },
      {
        title: 'Zero Energy Verification',
        rule: 'O. Reg. 854, s. 159',
        detail: 'After locking out, verify de-energization with a properly rated voltage tester. Test the tester on a known live source before and after.',
        critical: true,
      },
      {
        title: 'Multiple Worker Lockout',
        rule: 'O. Reg. 854, s. 160(2)',
        detail: 'When multiple workers are involved, each must apply their own lock. A group lockout box or hasp may be used.',
      },
      {
        title: 'Stored Energy',
        rule: 'CEC Rule 2-304',
        detail: 'Capacitors, springs, hydraulic/pneumatic pressure, and elevated loads must be discharged or restrained before work begins.',
      },
      {
        title: 'Re-energization Procedure',
        rule: 'O. Reg. 854, s. 161',
        detail: 'Before removing locks: verify all workers clear, all tools removed, guards replaced, and notify all affected workers.',
      },
      {
        title: 'Boundaries of Approach',
        rule: 'CSA Z462',
        detail: 'Limited Approach: qualified workers only. Restricted Approach: requires PPE. Prohibited Approach: treated as direct contact.',
        critical: true,
      },
    ],
  },
  {
    key: 'grounding',
    label: 'Mine Grounding',
    icon: '\u23DA',
    rules: [
      {
        title: 'Ground Fault Protection',
        rule: 'O. Reg. 854, s. 153',
        detail: 'All underground mine electrical installations must have ground fault protection. Systems > 300V must trip at 100mA or less.',
        critical: true,
      },
      {
        title: 'Trailing Cable Grounding',
        rule: 'O. Reg. 854, s. 153(3)',
        detail: 'Trailing cables must include a grounding conductor. Ground check monitors are required on medium voltage trailing cables.',
      },
      {
        title: 'Ground Beds',
        rule: 'CEC Rule 10-700',
        detail: 'Mine ground beds must achieve maximum 5 ohms resistance. Test annually and after any ground fault event.',
      },
      {
        title: 'Bonding on Portable Equipment',
        rule: 'O. Reg. 854, s. 153(4)',
        detail: 'All portable and mobile mining equipment must have equipment grounding conductors continuous back to the source.',
      },
      {
        title: 'Ground Fault Relay Testing',
        rule: 'O. Reg. 854, s. 153(2)',
        detail: 'Ground fault relays must be tested monthly. Records of testing must be kept. Relay must trip within 200ms.',
      },
    ],
  },
  {
    key: 'cables',
    label: 'Mine Cables',
    icon: '\uD83D\uDD0C',
    rules: [
      {
        title: 'Trailing Cable Inspection',
        rule: 'O. Reg. 854, s. 154',
        detail: 'Trailing cables must be inspected daily before each shift. Look for: jacket damage, exposed conductors, splice condition, connector integrity.',
        critical: true,
      },
      {
        title: 'Cable Splicing',
        rule: 'O. Reg. 854, s. 155',
        detail: 'Mine cable splices must be made with approved kits. Maximum 3 splices per trailing cable. Splices must maintain original insulation rating.',
      },
      {
        title: 'Cable Types for Mining',
        rule: 'CEC Rule 12-612',
        detail: 'Underground mines: Type SHD-GC (shield, heavy-duty, ground check) for >5kV. Type G-GC or W for <5kV mobile equipment.',
      },
      {
        title: 'Cable Support Underground',
        rule: 'O. Reg. 854, s. 156',
        detail: 'Cables in mine shafts must be supported at intervals not exceeding 3m. Use approved cable hangers. No cable ties on power cables.',
      },
      {
        title: 'Cable Protection - Surface',
        rule: 'O. Reg. 854, s. 157',
        detail: 'Cables crossing roadways must be elevated or placed in approved cable troughs. Minimum 4m overhead clearance for mobile equipment.',
      },
      {
        title: 'Ampacity Derating Underground',
        rule: 'CEC Table 5A',
        detail: 'Ambient temperature in mines can exceed 30\u00B0C. Apply temperature correction factors per CEC Table 5A. Deep mines may require 45\u00B0C ambient rating.',
      },
    ],
  },
  {
    key: 'inspection',
    label: 'Inspections',
    icon: '\uD83D\uDD0D',
    rules: [
      {
        title: 'Electrical Room Inspection',
        rule: 'O. Reg. 854, s. 152',
        detail: 'Electrical rooms inspected monthly. Check: ventilation, signage, fire extinguishers, clearances (1m min front, 0.6m sides), lock accessibility.',
      },
      {
        title: 'Transformer Inspections',
        rule: 'O. Reg. 854, s. 152(3)',
        detail: 'Mine transformers: check oil level, temperature, pressure, silica gel, and bushing condition monthly. Oil test annually.',
      },
      {
        title: 'Switchgear Maintenance',
        rule: 'CSA Z463',
        detail: 'Mine switchgear requires annual maintenance: thermal scanning, contact resistance testing, insulation resistance testing, relay calibration.',
      },
      {
        title: 'High-Pot Testing',
        rule: 'O. Reg. 854, s. 153',
        detail: 'Trailing cables and portable equipment cables must undergo insulation resistance testing after any repair. Min 1 megohm per kV + 1 megohm.',
      },
      {
        title: 'Record Keeping',
        rule: 'O. Reg. 854, s. 21',
        detail: 'All electrical inspections, tests, and maintenance must be documented. Records kept for minimum 2 years. Available for MOL inspector review.',
        critical: true,
      },
    ],
  },
  {
    key: 'emergency',
    label: 'Emergency',
    icon: '\u26A0\uFE0F',
    rules: [
      {
        title: 'Arc Flash Incident Energy',
        rule: 'CSA Z462-21',
        detail: 'Arc flash analysis required for all mine electrical equipment > 240V. Labels must show incident energy (cal/cm\u00B2), boundary distances, and required PPE.',
        critical: true,
      },
      {
        title: 'Underground Fire Procedure',
        rule: 'O. Reg. 854, s. 17',
        detail: 'Electrical fire: de-energize first, then use CO\u2082 or dry chemical. NEVER use water on energized equipment. Evacuate to fresh air.',
        critical: true,
      },
      {
        title: 'Electrical Contact Rescue',
        rule: 'O. Reg. 854, s. 22',
        detail: 'Do NOT touch the victim if still in contact with energized equipment. De-energize source, use non-conductive rescue hooks, call emergency.',
        critical: true,
      },
      {
        title: 'Emergency Power - Underground',
        rule: 'O. Reg. 854, s. 74',
        detail: 'Emergency lighting and communications must remain operational during power failure. Battery backup minimum 4 hours for underground mines.',
      },
      {
        title: 'Methane Detection Integration',
        rule: 'O. Reg. 854, s. 184',
        detail: 'In gassy mines, methane monitors must be interlocked with electrical systems. At 1% CH\u2084, power to face equipment must disconnect automatically.',
        critical: true,
      },
    ],
  },
  {
    key: 'ppe',
    label: 'PPE / Arc Flash',
    icon: '\uD83E\uDDEA',
    rules: [
      {
        title: 'Arc Flash PPE Categories',
        rule: 'CSA Z462, Table 1',
        detail: 'Cat 1: 4 cal/cm\u00B2 (arc-rated shirt + pants, safety glasses, leather gloves). Cat 2: 8 cal/cm\u00B2 (add face shield, balaclava). Cat 3: 25 cal/cm\u00B2 (arc flash suit). Cat 4: 40 cal/cm\u00B2 (full arc flash suit with hood).',
        critical: true,
      },
      {
        title: 'Voltage-Rated Gloves',
        rule: 'CSA Z462',
        detail: 'Class 00: 500V max. Class 0: 1000V max. Class 1: 7500V max. Class 2: 17000V max. Class 3: 26500V max. Class 4: 36000V max. Test every 6 months.',
        critical: true,
      },
      {
        title: 'Insulated Tools',
        rule: 'CSA Z462, s. 4.3.6',
        detail: 'Tools used on or near energized equipment must be insulated and rated for the voltage. IEC 60900 standard. Inspect before each use.',
      },
      {
        title: 'Mining-Specific PPE',
        rule: 'O. Reg. 854, s. 2',
        detail: 'In addition to arc flash PPE: hard hat (CSA Z94.1), safety boots (CSA Z195), high-visibility vest, hearing protection, dust mask if applicable.',
      },
      {
        title: 'Rubber Matting',
        rule: 'CSA Z462',
        detail: 'Insulating rubber mats required in front of all switchgear. Class dependent on voltage. Inspect quarterly for cuts, holes, and deterioration.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
}

const pillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 48,
  padding: '0 16px',
  borderRadius: 24,
  fontSize: 13,
  fontWeight: 600,
  border: '2px solid var(--divider)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  whiteSpace: 'nowrap',
}

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: 'var(--primary)',
  color: '#000',
  border: '2px solid var(--primary)',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MiningSafetyPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>('lockout')
  const [search, setSearch] = useState('')

  const section = sections.find(s => s.key === activeSection)!

  const filteredRules = search.trim()
    ? section.rules.filter(
        r =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.detail.toLowerCase().includes(search.toLowerCase()) ||
          r.rule.toLowerCase().includes(search.toLowerCase())
      )
    : section.rules

  return (
    <>
      <Header title="Mining Electrical Safety" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Warning banner */}
        <div style={{
          background: 'rgba(255, 60, 60, 0.1)',
          border: '1px solid rgba(255, 60, 60, 0.3)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{'\u26A0\uFE0F'}</span>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
            <strong>Safety reference only.</strong> Always follow your mine's specific procedures,
            O. Reg. 854, CSA Z462, and your company's Safe Work Procedures. When in doubt, ask your supervisor.
          </div>
        </div>

        {/* Section pills */}
        <div style={pillRow}>
          {sections.map(s => (
            <button
              key={s.key}
              style={activeSection === s.key ? pillActive : pillBase}
              onClick={() => { setActiveSection(s.key); setSearch('') }}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg
            width={18} height={18} viewBox="0 0 24 24"
            fill="none" stroke="var(--text-secondary)" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${section.label.toLowerCase()} rules...`}
            style={{
              width: '100%', boxSizing: 'border-box',
              minHeight: 56, padding: '0 16px 0 44px',
              background: 'var(--input-bg)',
              border: '2px solid var(--input-border)',
              borderRadius: 'var(--radius)',
              fontSize: 16, color: 'var(--text)',
            }}
          />
        </div>

        {/* Rules list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredRules.map((rule, idx) => (
            <div key={idx} style={{
              background: 'var(--surface)',
              border: rule.critical
                ? '1px solid rgba(255, 60, 60, 0.3)'
                : '1px solid var(--divider)',
              borderRadius: 'var(--radius)',
              padding: '14px 14px',
              borderLeft: rule.critical ? '4px solid #ff3c3c' : '4px solid var(--primary)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8,
                marginBottom: 6,
              }}>
                <div style={{
                  fontSize: 15, fontWeight: 700, color: 'var(--text)',
                  lineHeight: 1.3,
                }}>
                  {rule.critical && <span style={{ color: '#ff3c3c', marginRight: 6 }}>{'\u25CF'}</span>}
                  {rule.title}
                </div>
              </div>
              <div style={{
                display: 'inline-block',
                background: 'var(--input-bg)',
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--primary)',
                fontFamily: 'var(--font-mono)',
                marginBottom: 8,
              }}>
                {rule.rule}
              </div>
              <div style={{
                fontSize: 14, color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {rule.detail}
              </div>
            </div>
          ))}
          {filteredRules.length === 0 && (
            <div style={{
              padding: '32px 16px', textAlign: 'center',
              color: 'var(--text-secondary)', fontSize: 15,
            }}>
              No rules match "{search}"
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: '#ff3c3c', fontSize: 14 }}>{'\u25CF'}</span>
            <span><strong>Critical safety rules</strong> — violation can result in serious injury or death</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--primary)', fontSize: 14 }}>{'\u25CF'}</span>
            <span><strong>Standard rules</strong> — important for compliance and best practice</span>
          </div>
        </div>
      </div>
    </>
  )
}
