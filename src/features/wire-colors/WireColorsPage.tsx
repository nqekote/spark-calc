import { useState } from 'react'
import Header from '../../layout/Header'

/* ---------- Data ---------- */

type TabKey = 'power' | 'control' | 'thermocouple' | 'industrial'

interface ColorEntry {
  color: string
  hex: string
  purpose: string
  cec?: string
}

const powerColors: ColorEntry[] = [
  { color: 'Black',  hex: '#1a1a1a', purpose: 'Phase A (ungrounded)', cec: 'Rule 4-036' },
  { color: 'Red',    hex: '#dc2626', purpose: 'Phase B (ungrounded)', cec: 'Rule 4-036' },
  { color: 'Blue',   hex: '#2563eb', purpose: 'Phase C (ungrounded)', cec: 'Rule 4-036' },
  { color: 'White',  hex: '#e5e5e5', purpose: 'Neutral (grounded)', cec: 'Rule 4-028' },
  { color: 'Green',  hex: '#16a34a', purpose: 'Equipment ground', cec: 'Rule 10-028' },
  { color: 'Green/Yellow', hex: '#16a34a', purpose: 'Bonding conductor', cec: 'Rule 10-028' },
  { color: 'Orange', hex: '#ea580c', purpose: 'Delta high-leg (208V)', cec: 'Rule 4-036' },
  { color: 'Grey',   hex: '#6b7280', purpose: 'Neutral (alt. color for 277/480V)', cec: 'Rule 4-028' },
]

const singlePhaseColors: ColorEntry[] = [
  { color: 'Black',  hex: '#1a1a1a', purpose: 'Hot (Line 1)', cec: 'Rule 4-036' },
  { color: 'Red',    hex: '#dc2626', purpose: 'Hot (Line 2, 240V circuits)', cec: 'Rule 4-036' },
  { color: 'White',  hex: '#e5e5e5', purpose: 'Neutral', cec: 'Rule 4-028' },
  { color: 'Green',  hex: '#16a34a', purpose: 'Equipment ground', cec: 'Rule 10-028' },
  { color: 'Blue',   hex: '#2563eb', purpose: 'Traveller (3-way switch)', cec: 'Common practice' },
]

const controlColors: ColorEntry[] = [
  { color: 'Red',    hex: '#dc2626', purpose: 'AC hot / ungrounded control', cec: 'NFPA 79' },
  { color: 'Black',  hex: '#1a1a1a', purpose: 'AC line power (L1, L2, L3)' },
  { color: 'Blue',   hex: '#2563eb', purpose: 'DC positive (ungrounded)' },
  { color: 'White',  hex: '#e5e5e5', purpose: 'DC negative (grounded return)' },
  { color: 'Yellow', hex: '#eab308', purpose: 'Interlock circuits, safety' },
  { color: 'Green',  hex: '#16a34a', purpose: 'Equipment grounding' },
  { color: 'Green/Yellow', hex: '#16a34a', purpose: 'Safety ground / bonding' },
  { color: 'Orange', hex: '#ea580c', purpose: 'Variable speed drive output' },
  { color: 'Purple', hex: '#9333ea', purpose: 'External source / backup power' },
]

const thermocoupleColors: ColorEntry[] = [
  { color: 'Blue (+) / Red (\u2212)', hex: '#2563eb', purpose: 'Type T (Copper / Constantan)', cec: '\u221240 to 370\u00B0C' },
  { color: 'Yellow (+) / Red (\u2212)', hex: '#eab308', purpose: 'Type K (Chromel / Alumel)', cec: '\u221240 to 1260\u00B0C' },
  { color: 'Purple (+) / Red (\u2212)', hex: '#9333ea', purpose: 'Type E (Chromel / Constantan)', cec: '\u221240 to 870\u00B0C' },
  { color: 'Black (+) / Red (\u2212)', hex: '#1a1a1a', purpose: 'Type J (Iron / Constantan)', cec: '\u221240 to 760\u00B0C' },
  { color: 'Green (+) / Red (\u2212)', hex: '#16a34a', purpose: 'Type R/S (Platinum)', cec: '0 to 1480\u00B0C' },
]

const miningColors: ColorEntry[] = [
  { color: 'Black',  hex: '#1a1a1a', purpose: 'Phase A \u2014 3-phase power' },
  { color: 'Red',    hex: '#dc2626', purpose: 'Phase B \u2014 3-phase power' },
  { color: 'Blue',   hex: '#2563eb', purpose: 'Phase C \u2014 3-phase power' },
  { color: 'White',  hex: '#e5e5e5', purpose: 'Neutral / grounded conductor' },
  { color: 'Green',  hex: '#16a34a', purpose: 'Equipment ground' },
  { color: 'Green/Yellow', hex: '#16a34a', purpose: 'Ground check conductor (GCC)', cec: 'Reg. 854' },
  { color: 'Orange', hex: '#ea580c', purpose: 'Ground fault relay pilot / monitoring' },
  { color: 'Yellow', hex: '#eab308', purpose: 'Remote stop / E-stop circuits' },
]

/* ---------- Tab definitions ---------- */

const tabs: { key: TabKey; label: string }[] = [
  { key: 'power', label: 'Power' },
  { key: 'control', label: 'Control' },
  { key: 'thermocouple', label: 'T/C' },
  { key: 'industrial', label: 'Mining' },
]

/* ---------- Helpers ---------- */

function ColorSwatch({ hex, dual }: { hex: string; dual?: boolean }) {
  const isLight = hex === '#e5e5e5' || hex === '#eab308'
  if (dual) {
    return (
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        border: `1px solid ${isLight ? 'var(--divider)' : hex}`,
        overflow: 'hidden', display: 'flex',
      }}>
        <div style={{ flex: 1, background: hex }} />
        <div style={{ flex: 1, background: '#16a34a' }} />
      </div>
    )
  }
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: hex,
      border: `1px solid ${isLight ? 'var(--divider)' : hex + '60'}`,
    }} />
  )
}

function ColorRow({ entry }: { entry: ColorEntry }) {
  const isGreenYellow = entry.color === 'Green/Yellow'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--divider)',
    }}>
      <ColorSwatch hex={entry.hex} dual={isGreenYellow} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: 'var(--text)',
          fontFamily: 'var(--font-display)',
        }}>
          {entry.color}
        </div>
        <div style={{
          fontSize: 12, color: 'var(--text-secondary)',
          fontFamily: 'var(--font-display)',
        }}>
          {entry.purpose}
        </div>
      </div>
      {entry.cec && (
        <div style={{
          fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)',
          background: 'var(--surface-elevated)',
          padding: '3px 8px', borderRadius: 'var(--radius-full)',
          flexShrink: 0, whiteSpace: 'nowrap',
        }}>
          {entry.cec}
        </div>
      )}
    </div>
  )
}

/* ---------- Component ---------- */

export default function WireColorsPage() {
  const [tab, setTab] = useState<TabKey>('power')

  const renderContent = () => {
    switch (tab) {
      case 'power':
        return (
          <>
            <SectionHeader title="3-Phase (120/208V & 277/480V)" />
            {powerColors.map((e, i) => <ColorRow key={i} entry={e} />)}
            <div style={{ height: 20 }} />
            <SectionHeader title="Single-Phase (120/240V)" />
            {singlePhaseColors.map((e, i) => <ColorRow key={i} entry={e} />)}
          </>
        )
      case 'control':
        return (
          <>
            <SectionHeader title="Control & Automation Wiring" />
            {controlColors.map((e, i) => <ColorRow key={i} entry={e} />)}
          </>
        )
      case 'thermocouple':
        return (
          <>
            <SectionHeader title="Thermocouple Extension Wire (ANSI)" />
            <div style={{
              fontSize: 11, color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-display)',
              marginBottom: 8,
            }}>
              Negative lead is always <strong style={{ color: '#dc2626' }}>RED</strong> in North American standard
            </div>
            {thermocoupleColors.map((e, i) => <ColorRow key={i} entry={e} />)}
          </>
        )
      case 'industrial':
        return (
          <>
            <SectionHeader title="Mining & Heavy Industrial" />
            <div style={{
              fontSize: 11, color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-display)',
              marginBottom: 8,
            }}>
              Ontario Reg. 854 and site-specific standards may apply
            </div>
            {miningColors.map((e, i) => <ColorRow key={i} entry={e} />)}
          </>
        )
    }
  }

  return (
    <>
      <Header title="Wire Colors" />
      <div style={{ padding: '16px 16px 120px' }}>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 4,
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          padding: 3, marginBottom: 16,
          border: '1px solid var(--divider)',
        }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, fontSize: 12, fontWeight: tab === t.key ? 700 : 500,
                fontFamily: 'var(--font-display)',
                color: tab === t.key ? '#000' : 'var(--text-secondary)',
                background: tab === t.key ? 'var(--primary)' : 'transparent',
                border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '8px 0', transition: 'all 150ms ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)',
          padding: '12px 14px',
        }}>
          {renderContent()}
        </div>

        {/* CEC Note */}
        <div style={{
          marginTop: 16, padding: '12px 14px',
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: 'var(--primary)',
            fontFamily: 'var(--font-display)', marginBottom: 6,
          }}>
            CEC Color Code Notes
          </div>
          <div style={{
            fontSize: 12, color: 'var(--text-secondary)',
            fontFamily: 'var(--font-display)', lineHeight: 1.6,
          }}>
            The CEC mandates <strong style={{ color: 'var(--text)' }}>white or grey</strong> for grounded (neutral) conductors and <strong style={{ color: 'var(--text)' }}>green</strong> (or green/yellow) for bonding/grounding conductors. Phase colors (black, red, blue) are convention, not code requirement, but are standard practice across Ontario. Always verify site-specific color standards.
          </div>
        </div>
      </div>
    </>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: 13, fontWeight: 700, color: 'var(--primary)',
      fontFamily: 'var(--font-display)',
      letterSpacing: '0.3px', marginBottom: 8,
    }}>
      {title}
    </div>
  )
}
