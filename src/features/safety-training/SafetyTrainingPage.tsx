import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/*  Electrical Safety Training  CSA Z462 Reference                    */
/*  Comprehensive reference for Ontario electrical apprentices         */
/*  Standards: CSA Z462, NFPA 70E, IEEE 1584, Ontario OHSA           */
/* ------------------------------------------------------------------ */

type TabKey = 'overview' | 'shock' | 'arcflash' | 'safework' | 'training'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'CSA Z462' },
  { key: 'shock', label: 'Shock' },
  { key: 'arcflash', label: 'Arc Flash' },
  { key: 'safework', label: 'Safe Work' },
  { key: 'training', label: 'Training' },
]

/* ---- shared styles ---- */

const card: React.CSSProperties = {
  background: 'var(--surface)', borderRadius: 'var(--radius)',
  padding: 16, marginBottom: 14, border: '1px solid var(--divider)',
}
const sectionTitle: React.CSSProperties = {
  fontSize: 17, fontWeight: 700, color: 'var(--primary)', margin: '0 0 10px 0',
}
const subTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: '12px 0 6px 0',
}
const bodyText: React.CSSProperties = {
  fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 8px 0',
}
const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 13 }
const listItem: React.CSSProperties = {
  fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6,
  padding: '2px 0 2px 8px', borderLeft: '2px solid var(--divider)', marginBottom: 4,
}
const warnBox: React.CSSProperties = {
  background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)',
  borderRadius: 8, padding: 12, marginBottom: 10,
}
const infoBox: React.CSSProperties = {
  background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
  borderRadius: 8, padding: 12, marginBottom: 10,
}
const inputStyle: React.CSSProperties = {
  background: 'var(--bg)', border: '1px solid var(--divider)', borderRadius: 8,
  color: 'var(--text)', padding: '10px 12px', fontSize: 15, fontFamily: 'monospace',
  width: '100%', minHeight: 'var(--touch-min)', boxSizing: 'border-box',
}
const btnStyle: React.CSSProperties = {
  background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 8,
  padding: '12px 20px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
  minHeight: 56,
}
const thStyle: React.CSSProperties = {
  padding: '8px 6px', fontSize: 12, fontWeight: 600, color: 'var(--primary)',
  textAlign: 'left' as const, borderBottom: '1px solid var(--divider)', whiteSpace: 'nowrap' as const,
}
const tdStyle: React.CSSProperties = {
  padding: '7px 6px', fontSize: 13, color: 'var(--text-secondary)',
  borderBottom: '1px solid var(--divider)', fontFamily: 'monospace',
}

/* ---- data: approach boundaries CSA Z462 Table 4 ---- */

const boundaryData = [
  { voltage: '0-50V', limited: 'Not specified', restricted: 'Not specified', prohibited: 'Not specified' },
  { voltage: '51-150V', limited: '3.0 m (10 ft)', restricted: '0.3 m (1 ft)', prohibited: '25 mm (1 in)' },
  { voltage: '151-750V', limited: '3.0 m (10 ft)', restricted: '0.3 m (1 ft)', prohibited: '25 mm (1 in)' },
  { voltage: '751V-15kV', limited: '3.0 m (10 ft)', restricted: '0.7 m (2 ft 2 in)', prohibited: '0.2 m (7 in)' },
  { voltage: '15.1-36kV', limited: '3.0 m (10 ft)', restricted: '0.8 m (2 ft 7 in)', prohibited: '0.3 m (10 in)' },
  { voltage: '36.1-46kV', limited: '3.0 m (10 ft)', restricted: '0.8 m (2 ft 9 in)', prohibited: '0.4 m (1 ft 5 in)' },
  { voltage: '46.1-72.5kV', limited: '3.0 m (10 ft)', restricted: '1.0 m (3 ft 2 in)', prohibited: '0.6 m (2 ft 2 in)' },
  { voltage: '72.6-121kV', limited: '3.3 m (10 ft 8 in)', restricted: '1.0 m (3 ft 4 in)', prohibited: '0.8 m (2 ft 10 in)' },
  { voltage: '138-145kV', limited: '3.4 m (11 ft)', restricted: '1.2 m (3 ft 10 in)', prohibited: '1.0 m (3 ft 2 in)' },
  { voltage: '161-169kV', limited: '3.6 m (11 ft 8 in)', restricted: '1.3 m (4 ft 3 in)', prohibited: '1.1 m (3 ft 7 in)' },
  { voltage: '230-242kV', limited: '4.0 m (13 ft)', restricted: '1.7 m (5 ft 8 in)', prohibited: '1.6 m (5 ft 3 in)' },
]

/* ---- data: rubber glove classes ---- */

const gloveClasses = [
  { cls: '00', acV: 500, dcV: 750, proofAC: 2500, proofDC: 10000, color: '#e8d5b7', use: 'Low voltage up to 500V AC; 120/208/240V residential/commercial' },
  { cls: '0', acV: 1000, dcV: 1500, proofAC: 5000, proofDC: 20000, color: '#f87171', use: 'Up to 1000V AC; standard for 600V industrial work in Ontario' },
  { cls: '1', acV: 7500, dcV: 11250, proofAC: 10000, proofDC: 40000, color: '#fbbf24', use: 'Medium voltage; utility metering, 4.16kV switchgear' },
  { cls: '2', acV: 17000, dcV: 25500, proofAC: 20000, proofDC: 50000, color: '#4ade80', use: 'Medium voltage; 13.8kV distribution switchgear' },
  { cls: '3', acV: 26500, dcV: 39750, proofAC: 30000, proofDC: 60000, color: '#60a5fa', use: '25kV utility distribution work' },
  { cls: '4', acV: 36000, dcV: 54000, proofAC: 40000, proofDC: 70000, color: '#c084fc', use: '34.5kV transmission and substation work' },
]

/* ---- data: PPE categories CSA Z462 Table 6 ---- */

const ppeCats = [
  {
    cat: 1, arc: 4, color: '#4ade80',
    equip: [
      'Arc-rated long-sleeve shirt and pants (min 4 cal/cm²)',
      'Arc-rated face shield or balaclava', 'Safety glasses or goggles',
      'Hard hat (non-melting)', 'Hearing protection (ear canal inserts)',
      'Heavy-duty leather gloves', 'Leather work boots',
    ],
    tasks: [
      'Reading panel meters on 120V panelboards',
      'Circuit breaker operation with covers on',
      'Opening hinged covers on 120V equipment (verified <10kA)',
      'Cable terminations in low-energy control circuits',
    ],
  },
  {
    cat: 2, arc: 8, color: '#ffd700',
    equip: [
      'Arc-rated long-sleeve shirt and pants (min 8 cal/cm²)',
      'Arc-rated flash suit hood or face shield + balaclava',
      'Arc-rated hard hat liner', 'Safety glasses (under face shield/hood)',
      'Hearing protection (under balaclava)',
      'Heavy-duty leather gloves', 'Leather work boots',
    ],
    tasks: [
      'Operating CBs or contactors on 208-600V with covers on',
      'Voltage testing on 208/240V panelboards',
      'Opening hinged covers on 240V equipment',
      'Removal/installation of CBs in 600V MCCs',
    ],
  },
  {
    cat: 3, arc: 25, color: '#ff8c00',
    equip: [
      'Arc-rated flash suit jacket and pants (min 25 cal/cm²)',
      'Arc-rated flash suit hood with lens', 'Arc-rated hard hat liner',
      'Safety glasses (under hood)', 'Hearing protection (under hood)',
      'Arc-rated gloves or rubber insulating gloves + leather protectors',
      'Leather work boots',
    ],
    tasks: [
      'Racking in/out starters or breakers in 600V MCCs',
      'Voltage testing on 600V with covers removed',
      'Insertion/removal of fuses in 600V equipment',
      'Work within restricted approach boundary of 600V high fault current',
    ],
  },
  {
    cat: 4, arc: 40, color: '#ff4444',
    equip: [
      'Arc-rated flash suit (jacket, pants, hood) min 40 cal/cm²',
      'Arc-rated flash suit hood with full face lens',
      'Hard hat + arc-rated liner (under hood)', 'Safety glasses (under hood)',
      'Hearing protection (under hood)',
      'Arc-rated rubber insulating gloves + leather protectors',
      'Leather work boots (arc-rated covers if available)',
    ],
    tasks: [
      'Work on 600V equipment with very high fault currents (>65kA)',
      'Energized work on 4.16kV+ medium voltage switchgear',
      'Racking in/out medium voltage breakers',
      'Voltage testing at medium voltage with covers removed',
    ],
  },
]

/* ---- data: current effects on the body ---- */

const currentEffects: { current: string; effect: string; sev: string }[] = [
  { current: '1 mA', effect: 'Slight tingling sensation (perception threshold)', sev: 'low' },
  { current: '5 mA', effect: 'Slight shock; not painful. Average person can let go.', sev: 'low' },
  { current: '6-16 mA', effect: 'Painful shock; muscular control may be lost (let-go threshold)', sev: 'med' },
  { current: '17-99 mA', effect: 'Respiratory arrest; severe muscle contractions. Cannot let go.', sev: 'high' },
  { current: '100-200 mA', effect: 'Ventricular fibrillation; likely fatal without CPR/AED', sev: 'fatal' },
  { current: '200+ mA', effect: 'Severe burns, cardiac arrest; internal organ damage', sev: 'fatal' },
  { current: '1 A+', effect: 'Cardiac arrest, severe tissue destruction; almost always fatal', sev: 'fatal' },
]

/* ---- data: CAT ratings ---- */

const catRatings = [
  { cat: 'CAT I', desc: 'Electronic equipment; low-energy circuits', use: 'Signal-level electronics, telecom, low-voltage data', trans: 'Lowest' },
  { cat: 'CAT II', desc: 'Single-phase receptacle-connected loads', use: 'Appliances, portable tools, outlets >10m from CAT III', trans: 'Moderate' },
  { cat: 'CAT III', desc: 'Three-phase distribution; fixed wiring', use: 'Panelboards, bus ducts, feeders, motor disconnects', trans: 'High' },
  { cat: 'CAT IV', desc: 'Three-phase at utility origin; outdoor conductors', use: 'Service entrance, utility meters, outdoor lines', trans: 'Highest' },
]

/* ---- data: quiz ---- */

const quizQuestions = [
  {
    id: 1,
    q: 'What is the primary Canadian standard for workplace electrical safety?',
    opts: ['CEC (C22.1)', 'CSA Z462', 'NFPA 70E', 'IEEE 1584'],
    ans: 1,
    why: 'CSA Z462 is the Canadian standard for workplace electrical safety, developed specifically for protecting workers from electrical hazards including shock, arc flash, and arc blast.',
    ref: 'CSA Z462, Clause 1',
  },
  {
    id: 2,
    q: 'What is the limited approach boundary for 600V equipment per CSA Z462?',
    opts: ['1.0 m (3 ft 6 in)', '1.5 m (5 ft)', '3.0 m (10 ft)', '4.5 m (15 ft)'],
    ans: 2,
    why: 'The limited approach boundary for 51V to 750V is 3.0 m (10 ft). Only qualified persons may enter this boundary.',
    ref: 'CSA Z462, Table 4',
  },
  {
    id: 3,
    q: 'What is the minimum arc rating for PPE Category 2?',
    opts: ['4 cal/cm²', '8 cal/cm²', '25 cal/cm²', '40 cal/cm²'],
    ans: 1,
    why: 'PPE Category 2 requires a minimum arc thermal performance value (ATPV) of 8 cal/cm².',
    ref: 'CSA Z462, Table 6',
  },
  {
    id: 4,
    q: 'Which class of rubber insulating gloves is rated for use up to 1000V AC?',
    opts: ['Class 00', 'Class 0', 'Class 1', 'Class 2'],
    ans: 1,
    why: 'Class 0 rubber insulating gloves are rated for maximum use voltage of 1000V AC, standard for 600V industrial work.',
    ref: 'CSA Z462 / ASTM D120',
  },
  {
    id: 5,
    q: 'After lockout/tagout, what must be done before starting work?',
    opts: [
      'Wait 5 minutes for capacitors to discharge',
      'Verify absence of voltage with an adequately rated test instrument',
      'Visual inspection only is sufficient',
      'Call the utility company',
    ],
    ans: 1,
    why: 'After LOTO, absence of voltage must be verified at each phase conductor using an adequately rated, properly maintained test instrument. This is a critical life-safety step.',
    ref: 'CSA Z462, Clause 6',
  },
  {
    id: 6,
    q: 'What current level through the body can cause ventricular fibrillation?',
    opts: ['1 mA', '16 mA', '100 mA', '1 A'],
    ans: 2,
    why: 'As little as 100 mA (0.1 A) through the heart can cause ventricular fibrillation, a potentially fatal condition.',
    ref: 'CSA Z462, Annex K',
  },
  {
    id: 7,
    q: 'When is energized electrical work permitted under CSA Z462?',
    opts: [
      'Whenever it is faster than de-energizing',
      'Only when de-energizing introduces greater hazard or is infeasible',
      'During regular business hours only',
      'Whenever the supervisor approves',
    ],
    ans: 1,
    why: 'CSA Z462 requires equipment to be in an electrically safe work condition before work begins. Energized work is only permitted when de-energizing introduces additional or greater hazard, or when the task is infeasible de-energized.',
    ref: 'CSA Z462, Clause 4.1.3',
  },
  {
    id: 8,
    q: 'What CAT rating must a multimeter have for use on a 600V panelboard?',
    opts: ['CAT I', 'CAT II', 'CAT III', 'CAT IV'],
    ans: 2,
    why: 'Panelboards are part of three-phase distribution and fixed wiring, requiring at minimum CAT III rated instruments.',
    ref: 'CSA Z462, Clause 6 / IEC 61010',
  },
  {
    id: 9,
    q: 'What is the first step in the CSA Z462 risk assessment procedure?',
    opts: ['Select PPE', 'Identify hazards', 'Determine if equipment can be de-energized', 'Complete the energized work permit'],
    ans: 1,
    why: 'The first step is always to identify the electrical hazards present. Only after identification can you properly assess risk and determine controls.',
    ref: 'CSA Z462, Clause 4.1.5',
  },
  {
    id: 10,
    q: 'Under Ontario OHSA, who has primary responsibility for worker safety from electrical hazards?',
    opts: ['The worker only', 'The electrical contractor only', 'The employer (constructor in construction)', 'The Ministry of Labour only'],
    ans: 2,
    why: 'Under Ontario OHSA, the employer (or constructor on construction projects) has the primary duty to ensure workplace safety, including protection from electrical hazards.',
    ref: 'Ontario OHSA, Section 25',
  },
]

/* ---- data: case studies (anonymized) ---- */

const caseStudies = [
  {
    title: 'Arc Flash During MCC Racking (600V)',
    desc: 'An electrician was racking in a motor starter in a 600V MCC when an arc flash occurred. The worker suffered second-degree burns to hands and face.',
    cause: 'Worker was not wearing Category 3 PPE. A foreign object (washer) in the starter compartment created a phase-to-ground fault during racking.',
    lesson: 'Always inspect cubicle before racking. Wear minimum PPE Category 3 for 600V MCC racking. Use remote racking devices where available.',
  },
  {
    title: 'Shock Incident: Testing Without Gloves',
    desc: 'An apprentice received a 347V shock while testing voltage in a lighting panel. Contact was made when a test probe slipped from the terminal.',
    cause: 'No rubber insulating gloves worn during voltage testing. Test probes lacked proper finger guards. Worker standing on wet concrete floor.',
    lesson: 'Always wear rated rubber insulating gloves when voltage testing. Use instruments with proper probe guards. Ensure dry, insulated footing.',
  },
  {
    title: 'Failure to Verify Absence of Voltage',
    desc: 'A journeyperson was replacing a contactor that had been locked out. Upon touching line-side conductors, they received a 600V shock across both hands.',
    cause: 'Wrong disconnect was locked out due to mislabeled equipment. Worker did not verify absence of voltage before starting work.',
    lesson: 'ALWAYS verify absence of voltage even after LOTO. Test your tester before and after use (live-dead-live). Never trust labels alone.',
  },
  {
    title: 'Arc Flash from Dropped Tool',
    desc: 'An electrician dropped a non-insulated wrench into live 480V switchgear. The resulting arc flash caused severe injuries to the worker and a bystander.',
    cause: 'Non-insulated tools used on energized equipment. No barricades established. Second worker was inside the arc flash boundary without PPE.',
    lesson: 'Use insulated tools rated for the voltage. Establish barricades at the arc flash boundary. All personnel within the boundary must wear appropriate PPE.',
  },
]

/* ================================================================== */
/*  TAB CONTENT RENDERERS                                             */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  TAB 1: CSA Z462 Overview                                          */
/* ------------------------------------------------------------------ */

function OverviewTab() {
  return (
    <div>
      {/* What is CSA Z462 */}
      <div style={card}>
        <h2 style={sectionTitle}>What is CSA Z462?</h2>
        <p style={bodyText}>
          CSA Z462 (Workplace Electrical Safety) is the Canadian national standard that establishes
          requirements for protecting workers from the hazards of electrical energy, including shock,
          arc flash, and arc blast. It is developed by the Canadian Standards Association and is
          updated on a three-year cycle.
        </p>
        <p style={bodyText}>
          In Ontario, CSA Z462 is referenced by the Ontario Occupational Health and Safety Act (OHSA)
          and its regulations as a recognized best practice. While not directly cited as a regulation,
          employers who follow CSA Z462 demonstrate due diligence in protecting workers from
          electrical hazards. Courts and the Ministry of Labour regularly reference CSA Z462 as the
          applicable standard of care.
        </p>
        <div style={infoBox}>
          <p style={{ ...bodyText, margin: 0, color: 'var(--primary)' }}>
            Key Point: CSA Z462 covers workplace electrical safety practices. The Canadian Electrical
            Code (CEC, CSA C22.1) covers installation requirements. Both must be followed.
          </p>
        </div>
      </div>

      {/* Relationship to other standards */}
      <div style={card}>
        <h2 style={sectionTitle}>Relationship to Other Standards</h2>
        <h3 style={subTitle}>CSA Z462 vs NFPA 70E</h3>
        <p style={bodyText}>
          CSA Z462 is the Canadian counterpart to NFPA 70E (used in the United States). They share
          the same technical basis but CSA Z462 is adapted for Canadian electrical systems (e.g.,
          600V class vs 480V, metric measurements, Canadian regulatory framework).
        </p>
        <h3 style={subTitle}>Relationship to OSHA</h3>
        <p style={bodyText}>
          US OSHA (29 CFR 1910 Subpart S) mandates NFPA 70E compliance for American workplaces.
          In Ontario, the equivalent regulatory authority is the Ontario Ministry of Labour, which
          enforces the OHSA and its regulations. CSA Z462 is the recognized Canadian standard that
          fulfills the general duty clause obligations under OHSA.
        </p>
        <h3 style={subTitle}>Ontario OHSA</h3>
        <p style={bodyText}>
          The Ontario Occupational Health and Safety Act (OHSA) establishes the legal framework.
          Key sections for electrical workers include:
        </p>
        <div style={listItem}>Section 25: Employer duties (provide information, instruction, supervision)</div>
        <div style={listItem}>Section 27: Supervisor duties (ensure safe work procedures)</div>
        <div style={listItem}>Section 28: Worker duties (follow safe procedures, report hazards)</div>
        <div style={listItem}>O. Reg. 851: Industrial Establishments (electrical safety provisions)</div>
        <div style={listItem}>O. Reg. 213/91: Construction Projects (electrical safety on construction sites)</div>
        <h3 style={subTitle}>IEEE 1584</h3>
        <p style={bodyText}>
          IEEE 1584 (Guide for Performing Arc Flash Hazard Calculations) provides the detailed
          engineering calculation methods referenced by CSA Z462 for determining incident energy
          and arc flash boundaries.
        </p>
      </div>

      {/* Employer vs worker responsibilities */}
      <div style={card}>
        <h2 style={sectionTitle}>Employer vs Worker Responsibilities</h2>
        <h3 style={subTitle}>Employer Responsibilities</h3>
        <div style={listItem}>Establish and maintain an electrical safety program (ESP)</div>
        <div style={listItem}>Conduct hazard assessments and risk analyses for all electrical work</div>
        <div style={listItem}>Provide appropriate PPE and ensure workers are trained in its use</div>
        <div style={listItem}>Ensure only qualified persons perform work on or near energized parts</div>
        <div style={listItem}>Provide and enforce lockout/tagout procedures and equipment</div>
        <div style={listItem}>Maintain equipment labeling (arc flash and shock hazard labels)</div>
        <div style={listItem}>Document training, incidents, and safety program audits</div>
        <div style={listItem}>Provide rescue equipment and training for electrical emergencies</div>

        <h3 style={subTitle}>Worker Responsibilities</h3>
        <div style={listItem}>Follow the electrical safety program and safe work procedures</div>
        <div style={listItem}>Use PPE as required by the hazard assessment</div>
        <div style={listItem}>Report unsafe conditions and near-miss incidents</div>
        <div style={listItem}>Participate in training and maintain competency</div>
        <div style={listItem}>Refuse unsafe work per Ontario OHSA Section 43</div>
        <div style={listItem}>Inspect PPE before each use and report defects</div>
      </div>

      {/* Qualified vs unqualified persons */}
      <div style={card}>
        <h2 style={sectionTitle}>Qualified vs Unqualified Persons</h2>
        <h3 style={subTitle}>Qualified Person (CSA Z462 Definition)</h3>
        <p style={bodyText}>
          A person who has demonstrated skills and knowledge related to the construction and
          operation of electrical equipment and installations and has received safety training to
          identify and avoid the hazards involved. In Ontario, this typically means a licensed
          electrician (309A or 442A) or an apprentice working under direct supervision.
        </p>
        <div style={infoBox}>
          <p style={{ ...bodyText, margin: 0 }}>
            Qualified persons must be trained in and familiar with: (a) the specific equipment being
            worked on, (b) the skills and techniques necessary to distinguish exposed energized
            parts, (c) the skills to determine nominal voltage, (d) approach boundaries, and
            (e) the decision-making process for safe work.
          </p>
        </div>

        <h3 style={subTitle}>Unqualified Person</h3>
        <p style={bodyText}>
          A person who is not a qualified person. Unqualified persons must be kept outside the
          limited approach boundary unless they are accompanied by a qualified person and are
          protected from all electrical hazards.
        </p>

        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>Boundary</th>
                <th style={thStyle}>Qualified</th>
                <th style={thStyle}>Unqualified</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Outside Limited</td>
                <td style={tdStyle}>May enter freely</td>
                <td style={tdStyle}>May enter freely</td>
              </tr>
              <tr>
                <td style={tdStyle}>Limited Approach</td>
                <td style={tdStyle}>May enter with proper PPE</td>
                <td style={tdStyle}>Must be escorted by qualified person</td>
              </tr>
              <tr>
                <td style={tdStyle}>Restricted Approach</td>
                <td style={tdStyle}>Energized work permit + PPE required</td>
                <td style={tdStyle}>NOT permitted to enter</td>
              </tr>
              <tr>
                <td style={tdStyle}>Prohibited Approach</td>
                <td style={tdStyle}>Same as direct contact with live parts</td>
                <td style={tdStyle}>NOT permitted to enter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Electrical safety program */}
      <div style={card}>
        <h2 style={sectionTitle}>Electrical Safety Program (ESP) Requirements</h2>
        <p style={bodyText}>
          CSA Z462 Clause 4.1.1 requires every employer to implement and document an electrical
          safety program. The ESP must include the following elements:
        </p>
        <div style={listItem}>1. Electrical safety program principles and controls (awareness, self-discipline, auditing)</div>
        <div style={listItem}>2. Hazard identification and risk assessment procedures</div>
        <div style={listItem}>3. Job safety planning and job briefing procedures</div>
        <div style={listItem}>4. Lockout/tagout procedures specific to electrical work</div>
        <div style={listItem}>5. Procedures for working on or near energized electrical equipment</div>
        <div style={listItem}>6. Shock and arc flash hazard analysis documentation</div>
        <div style={listItem}>7. PPE selection, use, care, and maintenance procedures</div>
        <div style={listItem}>8. Training requirements and documentation</div>
        <div style={listItem}>9. Emergency response procedures (rescue, CPR/AED)</div>
        <div style={listItem}>10. Incident investigation and documentation procedures</div>
        <div style={listItem}>11. Program auditing (minimum every 3 years per CSA Z462 Clause 4.1.1.4)</div>
      </div>

      {/* Risk assessment procedure */}
      <div style={card}>
        <h2 style={sectionTitle}>Risk Assessment Procedure (Step by Step)</h2>
        <p style={bodyText}>
          CSA Z462 Clause 4.1.5 requires a risk assessment before any task involving work on or
          near electrical equipment. Follow these steps:
        </p>
        {[
          { step: '1', title: 'Identify Hazards', desc: 'Determine if shock hazard, arc flash hazard, or arc blast hazard exists. Review single-line diagrams, equipment labels, and maintenance records.' },
          { step: '2', title: 'Assess Risk', desc: 'Evaluate the likelihood and severity of injury from each hazard. Consider the task being performed, equipment condition, and environmental factors.' },
          { step: '3', title: 'Determine if Equipment Can Be De-energized', desc: 'CSA Z462 requires all conductors and circuit parts to be in an electrically safe work condition BEFORE work begins, unless de-energizing creates greater hazard or is infeasible.' },
          { step: '4', title: 'Apply Hierarchy of Risk Controls', desc: 'Elimination > Substitution > Engineering Controls > Awareness > Administrative Controls > PPE. PPE is always the LAST resort.' },
          { step: '5', title: 'Determine Approach Boundaries', desc: 'Using CSA Z462 Table 4, determine the limited, restricted, and prohibited approach boundaries for the voltage level.' },
          { step: '6', title: 'Determine Arc Flash Boundary', desc: 'Using CSA Z462 Table 6 (PPE category method) or IEEE 1584 calculations, determine the arc flash boundary and required PPE.' },
          { step: '7', title: 'Select PPE', desc: 'Based on the hazard analysis, select shock protection PPE (rubber gloves, insulated tools) and arc flash PPE (arc-rated clothing, face protection).' },
          { step: '8', title: 'Complete Energized Work Permit (if applicable)', desc: 'If energized work is justified, complete the EEWP with all required approvals before work begins.' },
          { step: '9', title: 'Conduct Job Briefing', desc: 'Brief all workers on hazards identified, PPE required, approach boundaries, emergency procedures, and specific task procedures.' },
          { step: '10', title: 'Document', desc: 'Record the risk assessment, controls selected, and any deviations. Maintain records per CSA Z462 and Ontario OHSA requirements.' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 10, padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>Step {s.step}: {s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Hierarchy of risk controls */}
      <div style={card}>
        <h2 style={sectionTitle}>Hierarchy of Risk Controls</h2>
        <p style={bodyText}>
          CSA Z462 requires application of controls in this order, from most effective to least:
        </p>
        {[
          { level: 'Elimination', color: '#4ade80', desc: 'Remove the hazard entirely. Example: de-energize the equipment before work.' },
          { level: 'Substitution', color: '#86efac', desc: 'Replace with something less hazardous. Example: use battery-powered tools instead of line-powered near energized parts.' },
          { level: 'Engineering Controls', color: '#ffd700', desc: 'Isolate people from the hazard. Example: install insulated barriers, remote racking devices, current-limiting fuses.' },
          { level: 'Awareness', color: '#fbbf24', desc: 'Provide warnings. Example: arc flash labels, barricade tape, safety signs at approach boundaries.' },
          { level: 'Administrative Controls', color: '#ff8c00', desc: 'Change the way people work. Example: written safe work procedures, job briefings, energized work permits, training.' },
          { level: 'PPE', color: '#ff4444', desc: 'Protect the worker. Example: arc-rated clothing, rubber insulating gloves, face shields. ALWAYS the last line of defense.' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
            <div style={{ minWidth: 28, height: 28, borderRadius: 14, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000', flexShrink: 0 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.level}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* When energized work is permitted */}
      <div style={card}>
        <h2 style={sectionTitle}>When Energized Work is Permitted</h2>
        <div style={warnBox}>
          <p style={{ ...bodyText, margin: 0, color: '#ff6b6b', fontWeight: 600 }}>
            CSA Z462 Clause 4.1.3: The default requirement is that all conductors and circuit parts
            shall be put into an electrically safe work condition before work is performed.
          </p>
        </div>
        <p style={bodyText}>Energized work is permitted ONLY when one of these conditions is met:</p>
        <h3 style={subTitle}>Condition 1: Greater or Additional Hazard</h3>
        <p style={bodyText}>
          De-energizing would create a greater hazard or additional hazard to workers. Examples:
          interruption of life-support equipment, deactivation of emergency alarm systems,
          shutdown of hazardous location ventilation.
        </p>
        <h3 style={subTitle}>Condition 2: Infeasible</h3>
        <p style={bodyText}>
          The task to be performed is infeasible in a de-energized state. Examples: voltage testing
          (must be energized to test), diagnostics that require equipment to be running, process
          verification during commissioning.
        </p>
        <h3 style={subTitle}>Requirements for Energized Work</h3>
        <div style={listItem}>Completed Energized Electrical Work Permit (EEWP) signed by responsible authority</div>
        <div style={listItem}>Documented justification for why de-energizing is not possible</div>
        <div style={listItem}>Complete shock and arc flash hazard analysis</div>
        <div style={listItem}>Appropriate PPE selected and worn by all workers within boundaries</div>
        <div style={listItem}>Job briefing completed with all workers</div>
        <div style={listItem}>Qualified persons performing the work</div>
        <div style={listItem}>Barricades and attendants at approach boundaries</div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TAB 2: Shock Hazard                                                */
/* ------------------------------------------------------------------ */

function ShockTab() {
  const [calcVoltage, setCalcVoltage] = useState('')

  const getBoundary = (v: number) => {
    if (v <= 50) return { limited: 'Not specified', restricted: 'Not specified', prohibited: 'Not specified' }
    if (v <= 750) return { limited: '3.0 m (10 ft)', restricted: '0.3 m (1 ft)', prohibited: '25 mm (1 in)' }
    if (v <= 15000) return { limited: '3.0 m (10 ft)', restricted: '0.7 m (2 ft 2 in)', prohibited: '0.2 m (7 in)' }
    if (v <= 36000) return { limited: '3.0 m (10 ft)', restricted: '0.8 m (2 ft 7 in)', prohibited: '0.3 m (10 in)' }
    if (v <= 46000) return { limited: '3.0 m (10 ft)', restricted: '0.8 m (2 ft 9 in)', prohibited: '0.4 m (1 ft 5 in)' }
    if (v <= 72500) return { limited: '3.0 m (10 ft)', restricted: '1.0 m (3 ft 2 in)', prohibited: '0.6 m (2 ft 2 in)' }
    if (v <= 121000) return { limited: '3.3 m (10 ft 8 in)', restricted: '1.0 m (3 ft 4 in)', prohibited: '0.8 m (2 ft 10 in)' }
    if (v <= 145000) return { limited: '3.4 m (11 ft)', restricted: '1.2 m (3 ft 10 in)', prohibited: '1.0 m (3 ft 2 in)' }
    if (v <= 169000) return { limited: '3.6 m (11 ft 8 in)', restricted: '1.3 m (4 ft 3 in)', prohibited: '1.1 m (3 ft 7 in)' }
    return { limited: '4.0 m (13 ft)', restricted: '1.7 m (5 ft 8 in)', prohibited: '1.6 m (5 ft 3 in)' }
  }

  const v = parseFloat(calcVoltage)
  const boundaryResult = !isNaN(v) && v > 0 ? getBoundary(v) : null

  const sevColor = (s: string) => {
    if (s === 'low') return '#4ade80'
    if (s === 'med') return '#fbbf24'
    if (s === 'high') return '#ff8c00'
    return '#ff4444'
  }

  return (
    <div>
      {/* Shock hazard analysis */}
      <div style={card}>
        <h2 style={sectionTitle}>Shock Hazard Analysis</h2>
        <p style={bodyText}>
          A shock hazard analysis per CSA Z462 Clause 4.1.5.1 must determine:
        </p>
        <div style={listItem}>The voltage to which personnel will be exposed</div>
        <div style={listItem}>The approach boundary distances (limited, restricted, prohibited)</div>
        <div style={listItem}>The PPE required to protect against shock (rubber gloves, insulated tools)</div>
        <p style={bodyText}>
          The shock hazard analysis must be updated when equipment changes, modifications are made,
          or at least every 5 years.
        </p>
      </div>

      {/* Approach boundaries explanation */}
      <div style={card}>
        <h2 style={sectionTitle}>Approach Boundaries</h2>
        <h3 style={subTitle}>Limited Approach Boundary</h3>
        <p style={bodyText}>
          The distance from an exposed energized conductor or circuit part within which a shock
          hazard exists. An unqualified person may cross the limited approach boundary only when
          continuously escorted by a qualified person. At this boundary, inadvertent movement could
          bring a person closer to the energized parts.
        </p>
        <h3 style={subTitle}>Restricted Approach Boundary</h3>
        <p style={bodyText}>
          The distance from an exposed energized conductor or circuit part within which there is
          an increased likelihood of electric shock due to the close proximity. Only qualified
          persons with appropriate PPE and an energized work permit may cross this boundary.
        </p>
        <h3 style={subTitle}>Prohibited Approach Boundary</h3>
        <p style={bodyText}>
          The distance from an exposed energized conductor or circuit part which is considered
          the same as making contact with the energized part. Crossing this boundary is equivalent
          to touching the live conductor.
        </p>
      </div>

      {/* Approach boundary table */}
      <div style={card}>
        <h2 style={sectionTitle}>Approach Boundary Distances (CSA Z462 Table 4)</h2>
        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <thead>
              <tr>
                <th style={thStyle}>Voltage</th>
                <th style={thStyle}>Limited</th>
                <th style={thStyle}>Restricted</th>
                <th style={thStyle}>Prohibited</th>
              </tr>
            </thead>
            <tbody>
              {boundaryData.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, color: 'var(--text)', fontWeight: 600 }}>{row.voltage}</td>
                  <td style={tdStyle}>{row.limited}</td>
                  <td style={tdStyle}>{row.restricted}</td>
                  <td style={tdStyle}>{row.prohibited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Boundary calculator */}
      <div style={card}>
        <h2 style={sectionTitle}>Shock Protection Boundary Calculator</h2>
        <p style={bodyText}>Enter the system voltage to determine the approach boundaries:</p>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>System Voltage (V)</label>
          <input
            type="number"
            value={calcVoltage}
            onChange={e => setCalcVoltage(e.target.value)}
            placeholder="e.g., 600"
            style={inputStyle}
          />
        </div>
        {boundaryResult && (
          <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
              Boundaries for <span style={{ ...mono, color: 'var(--primary)' }}>{v}V</span>:
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--divider)' }}>
                <span style={{ fontSize: 13, color: '#4ade80' }}>Limited Approach</span>
                <span style={{ ...mono, color: 'var(--text)' }}>{boundaryResult.limited}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--divider)' }}>
                <span style={{ fontSize: 13, color: '#fbbf24' }}>Restricted Approach</span>
                <span style={{ ...mono, color: 'var(--text)' }}>{boundaryResult.restricted}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ fontSize: 13, color: '#ff4444' }}>Prohibited Approach</span>
                <span style={{ ...mono, color: 'var(--text)' }}>{boundaryResult.prohibited}</span>
              </div>
            </div>
            {v <= 50 && (
              <div style={{ ...infoBox, marginTop: 10 }}>
                <p style={{ ...bodyText, margin: 0, fontSize: 13 }}>
                  Voltages 50V and below: Approach boundaries are not specified by CSA Z462.
                  However, hazards may still exist under certain conditions (wet locations,
                  high available fault current).
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rubber glove classes */}
      <div style={card}>
        <h2 style={sectionTitle}>Rubber Insulating Glove Classes</h2>
        <p style={bodyText}>Per ASTM D120 / CSA Z462. Always wear leather protectors over rubber gloves.</p>
        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <thead>
              <tr>
                <th style={thStyle}>Class</th>
                <th style={thStyle}>Max AC (V)</th>
                <th style={thStyle}>Max DC (V)</th>
                <th style={thStyle}>Proof AC (V)</th>
                <th style={thStyle}>Typical Use</th>
              </tr>
            </thead>
            <tbody>
              {gloveClasses.map((g, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, color: g.color, fontWeight: 700 }}>{g.cls}</td>
                  <td style={tdStyle}>{g.acV.toLocaleString()}</td>
                  <td style={tdStyle}>{g.dcV.toLocaleString()}</td>
                  <td style={tdStyle}>{g.proofAC.toLocaleString()}</td>
                  <td style={{ ...tdStyle, fontFamily: 'inherit', fontSize: 12, maxWidth: 200 }}>{g.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...infoBox, marginTop: 10 }}>
          <p style={{ ...bodyText, margin: 0, fontSize: 13 }}>
            Glove Inspection: Before each use, visually inspect for damage, then air-test by rolling
            from gauntlet toward fingers. Check for holes, cuts, ozone damage, or UV degradation.
            Rubber gloves must be electrically retested every 6 months per ASTM D120.
          </p>
        </div>
      </div>

      {/* Insulated tools */}
      <div style={card}>
        <h2 style={sectionTitle}>Insulated Tool Requirements</h2>
        <p style={bodyText}>
          CSA Z462 Clause 4.3.2.5 requires insulated tools when working within the restricted
          approach boundary of exposed energized conductors or circuit parts operating at 50V or
          more. Requirements:
        </p>
        <div style={listItem}>Tools must be rated for the voltage (minimum 1000V per IEC 60900)</div>
        <div style={listItem}>Two layers of insulation: inner layer + colored outer layer</div>
        <div style={listItem}>Inspect before each use for damage to insulation</div>
        <div style={listItem}>Replace immediately if outer layer is breached (inner layer exposed)</div>
        <div style={listItem}>Do not use tape to repair insulation on tools</div>
        <div style={listItem}>Store in protective cases to prevent damage</div>
        <div style={listItem}>Follow manufacturer inspection and replacement schedules</div>
      </div>

      {/* Ground fault protection */}
      <div style={card}>
        <h2 style={sectionTitle}>Ground Fault Protection</h2>
        <p style={bodyText}>
          Ground fault protection devices detect current leaking to ground and quickly disconnect
          the circuit, reducing the duration of exposure to shock hazard.
        </p>
        <h3 style={subTitle}>GFCI (Ground Fault Circuit Interrupter)</h3>
        <p style={bodyText}>
          Trips at 5 mA of ground fault current within 25 milliseconds. Required by CEC for
          receptacles in wet locations, bathrooms, kitchens, outdoors, and construction sites.
          GFCI protection is a critical shock-prevention measure but does not replace the need
          for proper PPE and safe work procedures.
        </p>
        <h3 style={subTitle}>Ground Fault Protection of Equipment (GFPE)</h3>
        <p style={bodyText}>
          Required on services over 150V to ground, over 1000A per CEC Rule 14-102.
          Typically set at 1200A with maximum 1-second delay. Protects equipment from arcing
          ground faults but does NOT protect personnel from shock.
        </p>
      </div>

      {/* First aid for electrical shock */}
      <div style={card}>
        <h2 style={sectionTitle}>First Aid for Electrical Shock</h2>
        <div style={warnBox}>
          <p style={{ ...bodyText, margin: 0, color: '#ff6b6b', fontWeight: 600 }}>
            DANGER: Never touch a person who is in contact with an energized conductor.
            De-energize the circuit first, or use an insulated device to separate the person.
          </p>
        </div>
        {[
          { step: '1', text: 'Ensure scene safety. De-energize the source or use an insulated hook/board to separate the victim from the energized conductor.' },
          { step: '2', text: 'Call 911 immediately. State "electrical contact injury" so appropriate resources are dispatched.' },
          { step: '3', text: 'Check for responsiveness. Tap shoulders and shout. If unresponsive, check for breathing.' },
          { step: '4', text: 'If no breathing or only gasping, begin CPR immediately. 30 compressions, 2 breaths. Push hard (5 cm / 2 inches), push fast (100-120/min).' },
          { step: '5', text: 'Apply AED as soon as available. Follow voice prompts. AED can analyze heart rhythm and deliver shock if needed for ventricular fibrillation.' },
          { step: '6', text: 'Continue CPR until EMS arrives or victim shows signs of life. Do NOT stop unless relieved by trained responder.' },
          { step: '7', text: 'Monitor for secondary injuries: burns (check entry and exit points), fractures from falls or muscle contractions, spinal injury.' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <div style={{ minWidth: 26, height: 26, borderRadius: 13, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000', flexShrink: 0 }}>{s.step}</div>
            <p style={{ ...bodyText, margin: 0 }}>{s.text}</p>
          </div>
        ))}
      </div>

      {/* Effects of current on the body */}
      <div style={card}>
        <h2 style={sectionTitle}>Effects of Current on the Human Body</h2>
        <p style={bodyText}>
          The severity of electrical shock depends on current magnitude, path through the body,
          and duration. Remember: It is CURRENT, not voltage, that kills. However, higher voltage
          drives more current through body resistance (typically 1000-100,000 ohms dry skin).
        </p>
        {currentEffects.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, padding: '6px 10px', background: 'var(--bg)', borderRadius: 8, borderLeft: `3px solid ${sevColor(item.sev)}` }}>
            <div style={{ ...mono, minWidth: 80, color: sevColor(item.sev), fontWeight: 700 }}>{item.current}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.effect}</div>
          </div>
        ))}
        <div style={{ ...infoBox, marginTop: 10 }}>
          <p style={{ ...bodyText, margin: 0, fontSize: 13 }}>
            Ohm's Law applied: At 120V across 1000 ohm body resistance = 120 mA (potentially fatal).
            At 600V across 1000 ohm = 600 mA (almost certainly fatal). This is why voltage levels
            commonly found in Ontario industrial settings (347/600V) are extremely dangerous.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TAB 3: Arc Flash                                                   */
/* ------------------------------------------------------------------ */

function ArcFlashTab() {
  const [ppeVoltage, setPpeVoltage] = useState('')
  const [ppeFault, setPpeFault] = useState('')
  const [ppeClearing, setPpeClearing] = useState('')
  const [ppeResult, setPpeResult] = useState<null | { cat: number; energy: string; boundary: string }>(null)

  const calcPPE = () => {
    const voltage = parseFloat(ppeVoltage)
    const fault = parseFloat(ppeFault)
    const clearing = parseFloat(ppeClearing)
    if (isNaN(voltage) || isNaN(fault) || isNaN(clearing)) return
    if (voltage <= 0 || fault <= 0 || clearing <= 0) return

    // Simplified IEEE 1584 estimation for educational purposes
    // For 600V class: E = 4.184 * Cf * En * (t/0.2) * (610^x / D^x)
    // Simplified: incident energy proportional to V * I * t
    // This is an approximation for training; real calculations require IEEE 1584 software
    const Cf = voltage <= 1000 ? 1.0 : 1.5
    const normEnergy = voltage <= 600
      ? 0.0093 * fault * clearing * Cf
      : 0.012 * fault * clearing * Cf
    const energy = Math.round(normEnergy * 10) / 10

    // Arc flash boundary (distance where incident energy = 1.2 cal/cm2)
    const boundaryM = Math.round(Math.sqrt(energy / 1.2) * 3.048 * 10) / 10
    const boundaryFt = Math.round(boundaryM * 3.281 * 10) / 10

    let cat = 1
    if (energy > 4 && energy <= 8) cat = 1
    else if (energy > 8 && energy <= 25) cat = 2
    else if (energy > 25 && energy <= 40) cat = 3
    else if (energy > 40) cat = 4
    if (energy <= 4) cat = 1

    setPpeResult({
      cat,
      energy: `${energy} cal/cm²`,
      boundary: `${boundaryM} m (${boundaryFt} ft)`,
    })
  }

  return (
    <div>
      {/* Arc flash hazard analysis basics */}
      <div style={card}>
        <h2 style={sectionTitle}>Arc Flash Hazard Analysis</h2>
        <p style={bodyText}>
          An arc flash hazard analysis per CSA Z462 Clause 4.1.5.2 must determine the arc flash
          boundary, the incident energy at the working distance, and the PPE required. Two methods
          are permitted:
        </p>
        <h3 style={subTitle}>Method 1: Incident Energy Analysis (IEEE 1584)</h3>
        <p style={bodyText}>
          Uses detailed calculations per IEEE 1584 to determine actual incident energy at the
          working distance. This method is more accurate and may allow reduced PPE in some cases.
          Required data: system voltage, available fault current (bolted and arcing), clearing
          time, working distance, electrode configuration, enclosure size.
        </p>
        <h3 style={subTitle}>Method 2: PPE Category Method (CSA Z462 Table 6)</h3>
        <p style={bodyText}>
          A simplified table-based method. If the task and equipment parameters match the table
          conditions, the required PPE category can be read directly from CSA Z462 Table 6.
          This method is conservative but simpler to apply.
        </p>
        <div style={warnBox}>
          <p style={{ ...bodyText, margin: 0, color: '#ff6b6b', fontWeight: 600 }}>
            If incident energy exceeds 40 cal/cm², the equipment CANNOT be worked on while
            energized. The hazard level is too high for any available PPE.
          </p>
        </div>
      </div>

      {/* PPE Categories 1-4 */}
      <div style={card}>
        <h2 style={sectionTitle}>PPE Categories 1-4 (CSA Z462 Table 6)</h2>
        {ppeCats.map((p, idx) => (
          <div key={idx} style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8, borderLeft: `4px solid ${p.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#000' }}>{p.cat}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: p.color }}>PPE Category {p.cat}</div>
                <div style={{ ...mono, fontSize: 12, color: 'var(--text-secondary)' }}>Min Arc Rating: {p.arc} cal/cm{'²'}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Required Equipment:</div>
            {p.equip.map((e, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '2px 0 2px 10px', borderLeft: `2px solid ${p.color}40`, lineHeight: 1.5 }}>{e}</div>
            ))}
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: '8px 0 4px' }}>Typical Tasks:</div>
            {p.tasks.map((t, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '2px 0 2px 10px', borderLeft: '2px solid var(--divider)', lineHeight: 1.5 }}>{t}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Incident energy calculation (simplified) */}
      <div style={card}>
        <h2 style={sectionTitle}>Incident Energy Estimation (Simplified)</h2>
        <p style={bodyText}>
          The full IEEE 1584-2018 calculation involves detailed parameters. The simplified
          formula below provides a rough estimate for educational purposes:
        </p>
        <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <div style={{ ...mono, color: 'var(--primary)', fontSize: 14, textAlign: 'center' as const, lineHeight: 1.8 }}>
            E = K x V x I_bf x t x D_factor<br />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              E = incident energy (cal/cm{'²'}), V = voltage (kV), I_bf = bolted fault (kA),
              t = clearing time (sec), K = system factor, D = distance factor
            </span>
          </div>
        </div>
        <p style={bodyText}>
          For accurate results, always use IEEE 1584-2018 software or qualified engineering
          analysis. The PPE category method (Table 6) is an acceptable alternative when
          parameters fall within table limits.
        </p>
      </div>

      {/* Interactive PPE selector */}
      <div style={card}>
        <h2 style={sectionTitle}>PPE Category Estimator</h2>
        <p style={bodyText}>
          Enter system parameters for an estimated PPE category. For reference only; always
          use a detailed analysis for actual work.
        </p>
        <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>System Voltage (V)</label>
            <input type="number" value={ppeVoltage} onChange={e => setPpeVoltage(e.target.value)} placeholder="e.g., 600" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Available Fault Current (kA)</label>
            <input type="number" value={ppeFault} onChange={e => setPpeFault(e.target.value)} placeholder="e.g., 42" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Clearing Time (seconds)</label>
            <input type="number" value={ppeClearing} onChange={e => setPpeClearing(e.target.value)} placeholder="e.g., 0.05" style={inputStyle} />
          </div>
          <button onClick={calcPPE} style={btnStyle}>Calculate PPE Category</button>
        </div>
        {ppeResult && (
          <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, borderLeft: `4px solid ${ppeCats[ppeResult.cat - 1]?.color || '#ffd700'}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: ppeCats[ppeResult.cat - 1]?.color || 'var(--primary)', marginBottom: 6 }}>
              PPE Category {ppeResult.cat}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Estimated Incident Energy:</span>
                <span style={{ ...mono, color: 'var(--text)' }}>{ppeResult.energy}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Min Arc Rating Required:</span>
                <span style={{ ...mono, color: 'var(--text)' }}>{ppeCats[ppeResult.cat - 1]?.arc} cal/cm{'²'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Estimated Arc Flash Boundary:</span>
                <span style={{ ...mono, color: 'var(--text)' }}>{ppeResult.boundary}</span>
              </div>
            </div>
            <div style={{ ...warnBox, marginTop: 10 }}>
              <p style={{ ...bodyText, margin: 0, fontSize: 12, color: '#ff6b6b' }}>
                This is a simplified estimate for educational purposes only. Always use
                IEEE 1584-2018 calculations or CSA Z462 Table 6 for actual work decisions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Arc-rated clothing */}
      <div style={card}>
        <h2 style={sectionTitle}>Arc-Rated Clothing Requirements</h2>
        <div style={listItem}>All clothing must have an arc rating (ATPV or EBT) that meets or exceeds the incident energy</div>
        <div style={listItem}>ATPV (Arc Thermal Performance Value): the incident energy on material that results in 50% probability of second-degree burn</div>
        <div style={listItem}>EBT (Energy Breakopen Threshold): the incident energy that results in material breakopen</div>
        <div style={listItem}>Clothing with the lower ATPV or EBT value is used as the arc rating</div>
        <div style={listItem}>Non-melting natural fibers (cotton, wool) may be worn as underlayers</div>
        <div style={listItem}>NEVER wear meltable fabrics (polyester, nylon, acetate) as they can melt and cause severe burns even under arc-rated clothing</div>
        <div style={listItem}>FR (flame resistant) is NOT the same as AR (arc rated). Clothing must be specifically arc-rated per ASTM F1506</div>
        <div style={listItem}>Layering: multiple arc-rated layers provide additive protection</div>
        <div style={listItem}>Clothing must be maintained per manufacturer instructions; laundering affects arc rating over time</div>
      </div>

      {/* Equipment labeling */}
      <div style={card}>
        <h2 style={sectionTitle}>Equipment Labeling (CSA Z462)</h2>
        <p style={bodyText}>
          CSA Z462 Clause 4.2.5 requires electrical equipment that may be worked on while energized
          to be field-marked with a label containing arc flash and shock hazard information.
        </p>
        <h3 style={subTitle}>Arc Flash Label Must Include:</h3>
        <div style={listItem}>Nominal system voltage</div>
        <div style={listItem}>Arc flash boundary</div>
        <div style={listItem}>At least one of: available incident energy and working distance, OR minimum arc rating of PPE, OR required PPE category</div>
        <div style={listItem}>Date of analysis</div>
        <h3 style={subTitle}>Additional Recommended Information:</h3>
        <div style={listItem}>Available fault current (bolted)</div>
        <div style={listItem}>Clearing time and protective device information</div>
        <div style={listItem}>Limited approach boundary</div>
        <div style={listItem}>Restricted approach boundary</div>
        <div style={listItem}>Required PPE equipment list</div>
        <div style={listItem}>Equipment identification</div>

        <h3 style={subTitle}>Sample Arc Flash Label Format</h3>
        <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '3px solid #ff4444', color: '#000', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6 }}>
          <div style={{ textAlign: 'center' as const, fontWeight: 700, fontSize: 14, color: '#ff0000', borderBottom: '2px solid #ff0000', paddingBottom: 4, marginBottom: 6 }}>
            WARNING: ARC FLASH AND SHOCK HAZARD
          </div>
          <div>Equipment ID: MCC-1A-001</div>
          <div>Nominal Voltage: 600V</div>
          <div>Arc Flash Boundary: 1.8 m (6 ft)</div>
          <div>Incident Energy: 12.5 cal/cm{'²'} at 455 mm</div>
          <div>PPE Category: 3</div>
          <div>Limited Approach: 3.0 m (10 ft)</div>
          <div>Restricted Approach: 0.3 m (1 ft)</div>
          <div>Fault Current: 42 kA</div>
          <div>Clearing Time: 0.05 sec (3 cycles)</div>
          <div>Date of Analysis: 2024-01-15</div>
        </div>
      </div>

      {/* Common arc flash scenarios */}
      <div style={card}>
        <h2 style={sectionTitle}>Common Arc Flash Scenarios and Prevention</h2>
        {[
          { scenario: 'Racking in/out motor starters or breakers', risk: 'Mechanical failure or misalignment can create phase-to-phase or phase-to-ground fault', prevention: 'Use remote racking devices. Wear minimum Cat 3 PPE. Inspect cubicle before racking. Stand to the side.' },
          { scenario: 'Working in energized panelboards', risk: 'Tool slip, dropped hardware, or contact between phases', prevention: 'De-energize whenever possible. Use insulated tools. Install insulated barriers between phases. Wear appropriate PPE.' },
          { scenario: 'Voltage testing on energized equipment', risk: 'Test probe slip, improper CAT-rated instruments, exposed conductors', prevention: 'Use properly rated test instruments (CAT III/IV). Wear rubber gloves and arc-rated PPE. Use probe tip covers.' },
          { scenario: 'Cable pulling near energized circuits', risk: 'Cable contacts energized parts, insulation damage exposes conductors', prevention: 'De-energize adjacent circuits when possible. Use cable guides and pulling grips. Maintain safe distances.' },
          { scenario: 'Equipment failure / deterioration', risk: 'Corroded connections, vermin damage, moisture ingress create arcing faults', prevention: 'Regular thermographic surveys. Preventive maintenance program. Replace aging equipment. Keep enclosures sealed.' },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 10, background: 'var(--bg)', borderRadius: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{item.scenario}</div>
            <div style={{ fontSize: 12, color: '#ff8c00', marginBottom: 4 }}>Risk: {item.risk}</div>
            <div style={{ fontSize: 12, color: '#4ade80' }}>Prevention: {item.prevention}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TAB 4: Safe Work Practices                                         */
/* ------------------------------------------------------------------ */

function SafeWorkTab() {
  const [eewpChecks, setEewpChecks] = useState<boolean[]>(new Array(12).fill(false))

  const toggleCheck = (idx: number) => {
    setEewpChecks(prev => {
      const next = [...prev]
      next[idx] = !next[idx]
      return next
    })
  }

  const eewpItems = [
    'Description of circuit/equipment to be worked on',
    'Justification for energized work (why it cannot be de-energized)',
    'Description of work to be performed',
    'Results of shock hazard analysis (voltage, boundaries)',
    'Results of arc flash hazard analysis (incident energy, PPE category)',
    'Shock protection PPE requirements specified',
    'Arc flash protection PPE requirements specified',
    'Means to restrict access to work area (barricades, attendants)',
    'Evidence of job briefing completion',
    'Approval signature of responsible management (not the worker)',
    'Energized work start date/time and completion date/time',
    'All workers have read and signed the permit',
  ]

  return (
    <div>
      {/* EEWP template/checklist */}
      <div style={card}>
        <h2 style={sectionTitle}>Energized Electrical Work Permit (EEWP)</h2>
        <p style={bodyText}>
          Per CSA Z462 Clause 4.1.3.3, an Energized Electrical Work Permit must be completed
          before any justified energized work. The permit documents the hazards, controls, and
          approvals. Use this checklist to verify all required elements:
        </p>
        <div style={{ ...warnBox, marginBottom: 12 }}>
          <p style={{ ...bodyText, margin: 0, color: '#ff6b6b', fontWeight: 600, fontSize: 13 }}>
            The EEWP must be approved by a responsible person (supervisor/manager) who is NOT
            the person performing the energized work.
          </p>
        </div>
        {eewpItems.map((item, i) => (
          <button
            key={i}
            onClick={() => toggleCheck(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 12px', marginBottom: 4, background: eewpChecks[i] ? 'rgba(74,222,128,0.08)' : 'var(--bg)',
              border: `1px solid ${eewpChecks[i] ? 'rgba(74,222,128,0.3)' : 'var(--divider)'}`,
              borderRadius: 8, cursor: 'pointer', textAlign: 'left' as const,
              minHeight: 56, color: 'inherit',
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              border: `2px solid ${eewpChecks[i] ? '#4ade80' : 'var(--divider)'}`,
              background: eewpChecks[i] ? '#4ade80' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#000', fontWeight: 700,
            }}>
              {eewpChecks[i] ? '✓' : ''}
            </div>
            <span style={{ fontSize: 13, color: eewpChecks[i] ? 'var(--text)' : 'var(--text-secondary)', lineHeight: 1.4 }}>
              {i + 1}. {item}
            </span>
          </button>
        ))}
        <div style={{ marginTop: 10, padding: 10, background: 'var(--bg)', borderRadius: 8, textAlign: 'center' as const }}>
          <span style={{ ...mono, fontSize: 14, color: eewpChecks.every(c => c) ? '#4ade80' : 'var(--text-secondary)' }}>
            {eewpChecks.filter(c => c).length} / {eewpChecks.length} items checked
            {eewpChecks.every(c => c) ? ' — PERMIT READY' : ''}
          </span>
        </div>
      </div>

      {/* De-energized work procedures */}
      <div style={card}>
        <h2 style={sectionTitle}>De-energized Work Procedures</h2>
        <p style={bodyText}>
          CSA Z462 Clause 5 establishes the process for creating an Electrically Safe Work
          Condition (ESWC). This is the PREFERRED method for all electrical work.
        </p>
        {[
          { step: '1', title: 'Identify Sources', desc: 'Identify all sources of electrical supply to the equipment. Review single-line diagrams, panel schedules, and equipment documentation. Consider multiple feeds, backfeed potential, and stored energy sources.' },
          { step: '2', title: 'Notify', desc: 'Notify all affected personnel that the equipment will be de-energized. Coordinate with operations, building management, and other trades as needed.' },
          { step: '3', title: 'Open Disconnecting Means', desc: 'Open all disconnecting means for each source of supply. Operate the disconnect handles to the OFF position. Where possible, visually verify that blades are fully open.' },
          { step: '4', title: 'Apply Lockout/Tagout', desc: 'Apply individual locks and tags to each disconnecting means. Each worker must apply their own lock. Tags must identify the worker, date, and reason for lockout.' },
          { step: '5', title: 'Release Stored Energy', desc: 'Discharge capacitors, release springs, block open pneumatic/hydraulic actuators. Stored energy can be lethal even after disconnecting supply. Wait appropriate time for capacitor discharge (5 time constants).' },
          { step: '6', title: 'Verify Absence of Voltage', desc: 'Using a properly rated test instrument, verify absence of voltage between all phase conductors and between each phase and ground. Use live-dead-live method: test on known live source, test the de-energized equipment, test on known live source again.' },
          { step: '7', title: 'Apply Grounds (if required)', desc: 'Where the possibility of induced voltage or stored energy exists, apply temporary protective grounds per CSA Z462 Clause 5.3. Required for medium and high voltage work.' },
          { step: '8', title: 'Work May Begin', desc: 'Only after all steps are completed and verified may work begin on the equipment. The equipment is now in an Electrically Safe Work Condition.' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 8, padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>Step {s.step}: {s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Lockout/Tagout per CSA Z462 */}
      <div style={card}>
        <h2 style={sectionTitle}>Lockout/Tagout per CSA Z462</h2>
        <div style={infoBox}>
          <p style={{ ...bodyText, margin: 0, fontSize: 13 }}>
            CSA Z462 LOTO differs from generic LOTO (CSA Z460) in that it is specifically
            designed for electrical hazards and includes additional requirements such as
            verification of absence of voltage and temporary protective grounding.
          </p>
        </div>
        <h3 style={subTitle}>Key Differences from Generic LOTO</h3>
        <div style={listItem}>Requires verification of absence of voltage (not just lock + tag)</div>
        <div style={listItem}>Addresses stored energy specific to electrical systems (capacitors, inductors, UPS)</div>
        <div style={listItem}>Requires temporary protective grounding for certain voltage levels</div>
        <div style={listItem}>Specifies approach boundaries during the LOTO process itself</div>
        <div style={listItem}>Addresses complex electrical scenarios (multiple sources, backfeed, VFDs)</div>

        <h3 style={subTitle}>Individual Employee Control</h3>
        <p style={bodyText}>
          Each worker exposed to the electrical hazard must apply their own lock. Group LOTO is
          permitted only under a documented procedure with a principal person in charge who
          maintains overall responsibility and uses a lock box or similar system.
        </p>

        <h3 style={subTitle}>Lock Requirements</h3>
        <div style={listItem}>Locks must be individually keyed (no master keys)</div>
        <div style={listItem}>Each worker must have their own uniquely keyed lock</div>
        <div style={listItem}>Locks must be durable enough to prevent unauthorized removal</div>
        <div style={listItem}>Tags must identify: worker name, date/time applied, reason</div>
        <div style={listItem}>Only the person who applied the lock may remove it</div>
      </div>

      {/* Verification of absence of voltage */}
      <div style={card}>
        <h2 style={sectionTitle}>Verification of Absence of Voltage</h2>
        <div style={warnBox}>
          <p style={{ ...bodyText, margin: 0, color: '#ff6b6b', fontWeight: 600 }}>
            This is the single most critical life-safety step. More electricians are killed by
            failure to verify absence of voltage than any other procedural error.
          </p>
        </div>
        <h3 style={subTitle}>Live-Dead-Live Method</h3>
        {[
          { step: '1', title: 'Test Your Tester (LIVE)', desc: 'Verify your test instrument is working correctly by testing on a known energized source of similar voltage. This confirms the instrument, leads, and batteries are functioning.' },
          { step: '2', title: 'Test the Equipment (DEAD)', desc: 'Test between all phase conductors (A-B, B-C, A-C) and between each phase and ground (A-G, B-G, C-G, N-G). All readings must show zero voltage.' },
          { step: '3', title: 'Test Your Tester Again (LIVE)', desc: 'Immediately re-verify your test instrument on the same known energized source. This confirms the instrument did not fail between step 1 and step 2.' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 8, padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>Step {s.step}: {s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
        <div style={{ ...infoBox, marginTop: 10 }}>
          <p style={{ ...bodyText, margin: 0, fontSize: 13 }}>
            Important: The test instrument must be adequately rated for the voltage of the circuit
            being tested (CAT III or CAT IV as appropriate). Proximity detectors (tic-tracers)
            are NOT acceptable as the sole means of verifying absence of voltage.
          </p>
        </div>
      </div>

      {/* Temporary protective grounding */}
      <div style={card}>
        <h2 style={sectionTitle}>Temporary Protective Grounding</h2>
        <p style={bodyText}>
          CSA Z462 Clause 5.3 covers temporary protective grounding. Grounds are applied to
          protect workers from induced voltages, stored energy, or accidental re-energization.
        </p>
        <h3 style={subTitle}>When Required</h3>
        <div style={listItem}>Work on medium voltage ({'>'}1000V) de-energized equipment</div>
        <div style={listItem}>Where induced voltage from parallel circuits is possible</div>
        <div style={listItem}>Where accidental re-energization is possible and cannot be eliminated by LOTO alone</div>
        <div style={listItem}>Long cable runs where capacitive charge may exist</div>
        <h3 style={subTitle}>Application Procedure</h3>
        <div style={listItem}>1. Verify absence of voltage at the grounding location</div>
        <div style={listItem}>2. Connect the grounding cable to the ground bus FIRST</div>
        <div style={listItem}>3. Then connect to each phase conductor (using hot stick for MV)</div>
        <div style={listItem}>4. Grounds must be visible from the work location</div>
        <div style={listItem}>5. Removal: disconnect from phase conductors first, then ground bus</div>
        <div style={listItem}>6. Grounding cables must be rated for the available fault current</div>
      </div>

      {/* Barricades and safety signs */}
      <div style={card}>
        <h2 style={sectionTitle}>Barricades and Safety Signs</h2>
        <p style={bodyText}>
          CSA Z462 requires the use of barricades, safety signs, and attendants to control
          access to areas with electrical hazards.
        </p>
        <div style={listItem}>Barricades must be placed at the limited approach boundary or arc flash boundary (whichever is greater)</div>
        <div style={listItem}>Barricade tape must include appropriate danger/warning marking</div>
        <div style={listItem}>Safety signs must comply with ANSI Z535 or CSA Z321 format</div>
        <div style={listItem}>An attendant may be used instead of or in addition to barricades</div>
        <div style={listItem}>Attendant must be knowledgeable of approach boundaries and authorized to warn/remove persons</div>
        <div style={listItem}>Conductive barricade materials must not be used near energized parts</div>
      </div>

      {/* Test instrument safety */}
      <div style={card}>
        <h2 style={sectionTitle}>Test Instrument Safety (CAT Ratings)</h2>
        <p style={bodyText}>
          Test instruments are rated by Measurement Category (CAT I-IV) per IEC 61010. Higher
          CAT ratings indicate greater transient withstand capability. Always use the correct
          CAT rating for the measurement location.
        </p>
        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <thead>
              <tr>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Typical Use</th>
                <th style={thStyle}>Transient</th>
              </tr>
            </thead>
            <tbody>
              {catRatings.map((c, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, color: 'var(--primary)', fontWeight: 700 }}>{c.cat}</td>
                  <td style={{ ...tdStyle, fontFamily: 'inherit', fontSize: 12 }}>{c.desc}</td>
                  <td style={{ ...tdStyle, fontFamily: 'inherit', fontSize: 12 }}>{c.use}</td>
                  <td style={tdStyle}>{c.trans}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...warnBox, marginTop: 10 }}>
          <p style={{ ...bodyText, margin: 0, color: '#ff6b6b', fontSize: 13 }}>
            NEVER use a lower CAT-rated instrument at a higher CAT location. A CAT II meter used
            on a panelboard (CAT III location) may explode during a transient event. Using improper
            test instruments is a leading cause of electrical injuries.
          </p>
        </div>
        <h3 style={subTitle}>Test Lead Safety</h3>
        <div style={listItem}>Use test leads rated for the same CAT and voltage as the meter</div>
        <div style={listItem}>Inspect leads before each use for damage, exposed conductors, or worn insulation</div>
        <div style={listItem}>Use shrouded/recessed banana plugs to prevent accidental contact</div>
        <div style={listItem}>Use probe tip covers to limit exposed metal to 4 mm or less</div>
        <div style={listItem}>Do not use damaged leads; replace immediately</div>
      </div>

      {/* Job briefing requirements */}
      <div style={card}>
        <h2 style={sectionTitle}>Job Briefing Requirements</h2>
        <p style={bodyText}>
          CSA Z462 Clause 4.1.7 requires a job briefing before each task involving electrical
          hazards. The briefing must cover:
        </p>
        <div style={listItem}>Hazards associated with the job (shock, arc flash, arc blast)</div>
        <div style={listItem}>Approach boundaries and arc flash boundary</div>
        <div style={listItem}>Energized work procedures and EEWP (if applicable)</div>
        <div style={listItem}>PPE requirements and proper use</div>
        <div style={listItem}>Safe work practices specific to the task</div>
        <div style={listItem}>Emergency procedures (rescue plan, emergency contacts, AED location)</div>
        <div style={listItem}>Work procedure changes that may affect safety</div>
        <p style={bodyText}>
          For repetitive or similar tasks, a brief discussion is acceptable if all workers are
          experienced. For complex or unusual tasks, a detailed briefing is required. The
          briefing should be documented.
        </p>
      </div>

      {/* Common unsafe practices */}
      <div style={card}>
        <h2 style={sectionTitle}>Common Unsafe Practices to Avoid</h2>
        {[
          'Working energized when de-energization is possible ("it will be faster")',
          'Failure to verify absence of voltage after LOTO',
          'Using non-insulated tools near energized conductors',
          'Wearing meltable synthetic clothing (polyester, nylon) near electrical hazards',
          'Working without required PPE ("just a quick check")',
          'Using wrong CAT-rated test instruments',
          'Not inspecting rubber gloves before use',
          'Locking out the wrong disconnect due to poor labeling',
          'Reaching over or across exposed energized parts',
          'Storing conductive materials on top of electrical equipment',
          'Working alone on energized equipment without rescue plan',
          'Removing panel covers without verifying equipment condition first',
          'Using metal ladders near energized electrical equipment',
          'Bypassing safety interlocks or door latches on switchgear',
          'Failure to conduct a job briefing before work',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
            <span style={{ color: '#ff4444', fontSize: 14, flexShrink: 0, lineHeight: 1.6 }}>X</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Case studies */}
      <div style={card}>
        <h2 style={sectionTitle}>Incident Case Studies (Anonymized)</h2>
        <p style={bodyText}>
          The following case studies are based on real incidents. Names and locations have been
          changed. These illustrate common failure patterns in electrical safety.
        </p>
        {caseStudies.map((cs, i) => (
          <div key={i} style={{ marginBottom: 14, padding: 12, background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid #ff8c00' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{cs.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>{cs.desc}</div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: '#ff6b6b', fontWeight: 600 }}>Root Cause: </span>
              <span style={{ color: 'var(--text-secondary)' }}>{cs.cause}</span>
            </div>
            <div style={{ fontSize: 13 }}>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>Lesson: </span>
              <span style={{ color: 'var(--text-secondary)' }}>{cs.lesson}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TAB 5: Training and Compliance                                     */
/* ------------------------------------------------------------------ */

function TrainingTab() {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [auditChecks, setAuditChecks] = useState<boolean[]>(new Array(15).fill(false))

  const handleQuizAnswer = (qId: number, optIdx: number) => {
    if (quizSubmitted) return
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }))
  }

  const submitQuiz = () => {
    if (Object.keys(quizAnswers).length < quizQuestions.length) return
    setQuizSubmitted(true)
  }

  const resetQuiz = () => {
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  const quizScore = quizSubmitted
    ? quizQuestions.filter(q => quizAnswers[q.id] === q.ans).length
    : 0

  const toggleAudit = (i: number) => {
    setAuditChecks(prev => { const n = [...prev]; n[i] = !n[i]; return n })
  }

  const auditItems = [
    'Electrical Safety Program (ESP) document exists and is current',
    'ESP has been audited within the last 3 years',
    'Hazard assessments completed for all electrical tasks',
    'Arc flash labels installed on all applicable equipment',
    'Arc flash study completed or updated within 5 years',
    'LOTO procedures documented and specific to electrical work',
    'Energized Work Permit (EEWP) template available and used',
    'All electrical workers have current CSA Z462 training',
    'Training records maintained and accessible',
    'PPE inventory adequate and inspected per schedule',
    'Rubber gloves tested within 6-month interval',
    'Test instruments rated and maintained appropriately',
    'Emergency response/rescue procedures documented',
    'Job briefing process documented and followed',
    'Incident investigation and near-miss reporting in place',
  ]

  return (
    <div>
      {/* Required training */}
      <div style={card}>
        <h2 style={sectionTitle}>Required Training for Electrical Workers</h2>
        <p style={bodyText}>
          CSA Z462 Clause 4.1.8 requires that all employees who face a risk of electrical hazard
          be trained to understand the specific hazards associated with electrical energy.
        </p>
        <h3 style={subTitle}>Qualified Person Training Must Include:</h3>
        <div style={listItem}>Skills and techniques to distinguish exposed energized parts from other parts</div>
        <div style={listItem}>Skills and techniques to determine nominal voltage of exposed energized parts</div>
        <div style={listItem}>Approach distances and corresponding voltages</div>
        <div style={listItem}>Decision-making process for the specific task to be performed</div>
        <div style={listItem}>Shock hazard analysis and arc flash hazard analysis procedures</div>
        <div style={listItem}>PPE selection, use, care, and maintenance</div>
        <div style={listItem}>Safe work practices (LOTO, EEWP, verification of absence of voltage)</div>
        <div style={listItem}>Emergency response procedures including CPR and AED use</div>
        <div style={listItem}>Rescue procedures for electrical incidents</div>

        <h3 style={subTitle}>Unqualified Person Training Must Include:</h3>
        <div style={listItem}>Basic electrical safety awareness</div>
        <div style={listItem}>Recognition of electrical hazards and potential consequences</div>
        <div style={listItem}>Understanding of approach boundaries and limitations</div>
        <div style={listItem}>Procedures for reporting electrical hazards</div>
      </div>

      {/* Training frequency */}
      <div style={card}>
        <h2 style={sectionTitle}>Training Frequency and Documentation</h2>
        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <thead>
              <tr>
                <th style={thStyle}>Training Type</th>
                <th style={thStyle}>Frequency</th>
                <th style={thStyle}>Reference</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'CSA Z462 Awareness', freq: 'At hire + every 3 years minimum', ref: 'CSA Z462 Cl. 4.1.8' },
                { type: 'CPR / First Aid', freq: 'Every 3 years (Ontario requirement)', ref: 'WSIB Reg. 1101' },
                { type: 'AED Training', freq: 'Every 3 years (with CPR renewal)', ref: 'CSA Z462 Cl. 4.1.8' },
                { type: 'LOTO Procedures', freq: 'At hire + when procedures change', ref: 'CSA Z462 Cl. 5' },
                { type: 'Arc Flash PPE', freq: 'At hire + when PPE changes', ref: 'CSA Z462 Cl. 4.1.8' },
                { type: 'Emergency Rescue', freq: 'Annually recommended', ref: 'CSA Z462 Cl. 4.1.8' },
                { type: 'Equipment-Specific', freq: 'Before working on new equipment', ref: 'CSA Z462 Cl. 4.1.8' },
                { type: 'Retraining', freq: 'When deficiencies observed or after incidents', ref: 'CSA Z462 Cl. 4.1.8.4' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontFamily: 'inherit', color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{r.type}</td>
                  <td style={{ ...tdStyle, fontFamily: 'inherit', fontSize: 12 }}>{r.freq}</td>
                  <td style={{ ...tdStyle, fontSize: 11 }}>{r.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ontario-specific regulations */}
      <div style={card}>
        <h2 style={sectionTitle}>Ontario-Specific Regulations</h2>
        <h3 style={subTitle}>Occupational Health and Safety Act (OHSA)</h3>
        <p style={bodyText}>
          The OHSA is the primary legislation governing workplace safety in Ontario. It establishes
          the Internal Responsibility System (IRS) where employers, supervisors, and workers all
          share responsibility for workplace safety.
        </p>

        <h3 style={subTitle}>O. Reg. 851: Industrial Establishments</h3>
        <div style={listItem}>Section 40: Lockout procedures required before maintenance on machinery</div>
        <div style={listItem}>Section 41: Electrical equipment must be properly grounded</div>
        <div style={listItem}>Section 42: Work on energized equipment requires protection from electrical shock and burn</div>
        <div style={listItem}>Section 42.1: Electrical installations must comply with Ontario Electrical Safety Code (OESC/CEC)</div>

        <h3 style={subTitle}>O. Reg. 213/91: Construction Projects</h3>
        <div style={listItem}>Section 181-195: Electrical hazards on construction sites</div>
        <div style={listItem}>Section 182: Overhead powerline minimum distances (3m for {'<'}750V, 6m for 750V-150kV)</div>
        <div style={listItem}>Section 190: GFCI protection required for portable tools on construction sites</div>
        <div style={listItem}>Section 191: Temporary wiring requirements</div>

        <h3 style={subTitle}>O. Reg. 854: Mines and Mining Plants</h3>
        <div style={listItem}>Sections 155-183: Electrical safety in mines</div>
        <div style={listItem}>Specific requirements for trailing cables, mine power centres, and underground electrical installations</div>
        <div style={listItem}>Additional grounding and bonding requirements for mining environments</div>

        <h3 style={subTitle}>Ontario Electrical Safety Code (OESC)</h3>
        <p style={bodyText}>
          The OESC adopts the Canadian Electrical Code (CEC) with Ontario-specific amendments.
          It governs electrical installation standards and is enforced by the Electrical Safety
          Authority (ESA). The OESC covers installation; CSA Z462 covers work practices.
        </p>
      </div>

      {/* Competency assessment */}
      <div style={card}>
        <h2 style={sectionTitle}>Competency Assessment</h2>
        <p style={bodyText}>
          CSA Z462 Clause 4.1.8.3 requires verification that employees can demonstrate competency
          in the work practices they are required to perform. Assessment methods include:
        </p>
        <div style={listItem}>Written examinations on electrical safety principles</div>
        <div style={listItem}>Practical demonstrations of PPE selection and use</div>
        <div style={listItem}>Observed performance of LOTO procedures on actual equipment</div>
        <div style={listItem}>Verification of ability to read and interpret arc flash labels</div>
        <div style={listItem}>Demonstration of proper test instrument selection and use</div>
        <div style={listItem}>Practical verification of live-dead-live testing procedure</div>
        <div style={listItem}>Emergency response simulation (rescue procedures)</div>
        <p style={bodyText}>
          Competency must be re-verified when procedures change, after incidents, or when
          supervisors observe deficiencies in safe work practices.
        </p>
      </div>

      {/* Record keeping */}
      <div style={card}>
        <h2 style={sectionTitle}>Record Keeping Requirements</h2>
        <p style={bodyText}>
          Ontario OHSA and CSA Z462 require maintenance of the following records:
        </p>
        <div style={listItem}>Training records for each worker (date, topic, trainer, duration)</div>
        <div style={listItem}>Competency assessment records</div>
        <div style={listItem}>Hazard assessments and risk analyses</div>
        <div style={listItem}>Arc flash study reports and updates</div>
        <div style={listItem}>Energized Electrical Work Permits (completed)</div>
        <div style={listItem}>LOTO procedure documents</div>
        <div style={listItem}>PPE inspection and test records (rubber glove retest dates)</div>
        <div style={listItem}>Test instrument calibration records</div>
        <div style={listItem}>Incident and near-miss investigation reports</div>
        <div style={listItem}>Safety program audit reports</div>
        <div style={listItem}>Job briefing documentation</div>
        <div style={{ ...infoBox, marginTop: 8 }}>
          <p style={{ ...bodyText, margin: 0, fontSize: 13 }}>
            Retention: Ontario OHSA does not specify a minimum retention period for safety records,
            but industry best practice is a minimum of 5 years. Some organizations retain records
            for the duration of employment plus 5 years.
          </p>
        </div>
      </div>

      {/* Audit checklist */}
      <div style={card}>
        <h2 style={sectionTitle}>Electrical Safety Program Audit Checklist</h2>
        <p style={bodyText}>
          CSA Z462 Clause 4.1.1.4 requires auditing of the electrical safety program at
          intervals not exceeding 3 years. Use this checklist:
        </p>
        {auditItems.map((item, i) => (
          <button
            key={i}
            onClick={() => toggleAudit(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 12px', marginBottom: 4,
              background: auditChecks[i] ? 'rgba(74,222,128,0.08)' : 'var(--bg)',
              border: `1px solid ${auditChecks[i] ? 'rgba(74,222,128,0.3)' : 'var(--divider)'}`,
              borderRadius: 8, cursor: 'pointer', textAlign: 'left' as const,
              minHeight: 56, color: 'inherit',
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              border: `2px solid ${auditChecks[i] ? '#4ade80' : 'var(--divider)'}`,
              background: auditChecks[i] ? '#4ade80' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#000', fontWeight: 700,
            }}>
              {auditChecks[i] ? '✓' : ''}
            </div>
            <span style={{ fontSize: 13, color: auditChecks[i] ? 'var(--text)' : 'var(--text-secondary)', lineHeight: 1.4 }}>{item}</span>
          </button>
        ))}
        <div style={{ marginTop: 10, padding: 10, background: 'var(--bg)', borderRadius: 8, textAlign: 'center' as const }}>
          <span style={{ ...mono, fontSize: 14, color: auditChecks.every(c => c) ? '#4ade80' : 'var(--text-secondary)' }}>
            {auditChecks.filter(c => c).length} / {auditChecks.length} items compliant
            {auditChecks.every(c => c) ? ' — PROGRAM COMPLIANT' : ''}
          </span>
        </div>
      </div>

      {/* Emergency response */}
      <div style={card}>
        <h2 style={sectionTitle}>Emergency Response Procedures</h2>
        <p style={bodyText}>
          CSA Z462 requires employers to establish and document emergency response procedures
          for electrical incidents. Key elements:
        </p>
        <h3 style={subTitle}>Rescue Plan Requirements</h3>
        <div style={listItem}>A rescue plan must exist for every location where energized work is performed</div>
        <div style={listItem}>At least one person trained in CPR and AED must be present or immediately available</div>
        <div style={listItem}>Rescue equipment must be available at the work location (insulated rescue hook, blanket)</div>
        <div style={listItem}>Emergency contact numbers posted at the work location</div>
        <div style={listItem}>Route to nearest hospital/trauma center known and documented</div>

        <h3 style={subTitle}>Rescue Equipment</h3>
        <div style={listItem}>Insulated rescue hook (rated for the system voltage)</div>
        <div style={listItem}>Class E hard hat</div>
        <div style={listItem}>Insulating blanket (for covering energized parts during rescue)</div>
        <div style={listItem}>AED (Automated External Defibrillator) on site</div>
        <div style={listItem}>First aid kit with burn treatment supplies</div>
        <div style={listItem}>Emergency eyewash station (if chemical/thermal burns possible)</div>

        <h3 style={subTitle}>Rescue Training</h3>
        <p style={bodyText}>
          Workers performing energized work must be trained in rescue procedures specific to
          electrical incidents. This includes: safe approach to a shock victim, use of insulated
          rescue equipment, CPR for electrical contact injuries, and AED operation. Training
          should include practical simulations at least annually.
        </p>
      </div>

      {/* Interactive Quiz */}
      <div style={card}>
        <h2 style={sectionTitle}>Electrical Safety Knowledge Quiz</h2>
        <p style={bodyText}>
          Test your knowledge of CSA Z462 and electrical safety. Select the best answer for
          each question, then submit to see your results.
        </p>

        {quizQuestions.map((q, qi) => {
          const isAnswered = quizAnswers[q.id] !== undefined
          const isCorrect = quizSubmitted && quizAnswers[q.id] === q.ans
          const isWrong = quizSubmitted && isAnswered && quizAnswers[q.id] !== q.ans

          return (
            <div key={qi} style={{
              marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8,
              borderLeft: `3px solid ${quizSubmitted ? (isCorrect ? '#4ade80' : isWrong ? '#ff4444' : 'var(--divider)') : (isAnswered ? 'var(--primary)' : 'var(--divider)')}`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.5 }}>
                {q.id}. {q.q}
              </div>
              {q.opts.map((opt, oi) => {
                const isSelected = quizAnswers[q.id] === oi
                const showCorrect = quizSubmitted && oi === q.ans
                const showWrong = quizSubmitted && isSelected && oi !== q.ans

                return (
                  <button
                    key={oi}
                    onClick={() => handleQuizAnswer(q.id, oi)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '10px 12px', marginBottom: 4, cursor: quizSubmitted ? 'default' : 'pointer',
                      background: showCorrect ? 'rgba(74,222,128,0.1)' : showWrong ? 'rgba(255,68,68,0.1)' : isSelected ? 'rgba(255,215,0,0.08)' : 'transparent',
                      border: `1px solid ${showCorrect ? '#4ade80' : showWrong ? '#ff4444' : isSelected ? 'var(--primary)' : 'var(--divider)'}`,
                      borderRadius: 8, textAlign: 'left' as const, minHeight: 48, color: 'inherit',
                    }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                      border: `2px solid ${showCorrect ? '#4ade80' : showWrong ? '#ff4444' : isSelected ? 'var(--primary)' : 'var(--divider)'}`,
                      background: isSelected ? (showCorrect ? '#4ade80' : showWrong ? '#ff4444' : 'var(--primary)') : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: isSelected ? '#000' : 'var(--text-secondary)',
                    }}>
                      {String.fromCharCode(65 + oi)}
                    </div>
                    <span style={{ fontSize: 13, color: showCorrect ? '#4ade80' : showWrong ? '#ff6b6b' : 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {opt}
                    </span>
                  </button>
                )
              })}

              {quizSubmitted && (
                <div style={{
                  marginTop: 8, padding: 8, borderRadius: 6,
                  background: isCorrect ? 'rgba(74,222,128,0.08)' : 'rgba(255,68,68,0.08)',
                  border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.2)' : 'rgba(255,68,68,0.2)'}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isCorrect ? '#4ade80' : '#ff6b6b', marginBottom: 4 }}>
                    {isCorrect ? 'Correct!' : `Incorrect — Correct answer: ${String.fromCharCode(65 + q.ans)}`}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{q.why}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, fontStyle: 'italic' }}>Ref: {q.ref}</div>
                </div>
              )}
            </div>
          )
        })}

        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          {!quizSubmitted ? (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              style={{
                ...btnStyle, flex: 1,
                opacity: Object.keys(quizAnswers).length < quizQuestions.length ? 0.5 : 1,
              }}
            >
              Submit Quiz ({Object.keys(quizAnswers).length}/{quizQuestions.length} answered)
            </button>
          ) : (
            <>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 12, borderRadius: 8, background: quizScore >= 8 ? 'rgba(74,222,128,0.1)' : quizScore >= 6 ? 'rgba(255,215,0,0.1)' : 'rgba(255,68,68,0.1)',
                border: `1px solid ${quizScore >= 8 ? '#4ade80' : quizScore >= 6 ? 'var(--primary)' : '#ff4444'}`,
              }}>
                <span style={{ ...mono, fontSize: 18, fontWeight: 700, color: quizScore >= 8 ? '#4ade80' : quizScore >= 6 ? 'var(--primary)' : '#ff4444' }}>
                  {quizScore} / {quizQuestions.length}
                  {quizScore >= 8 ? ' — Excellent' : quizScore >= 6 ? ' — Review Needed' : ' — Study Required'}
                </span>
              </div>
              <button onClick={resetQuiz} style={{ ...btnStyle, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--divider)' }}>
                Reset
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function SafetyTrainingPage() {
  const nav = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />
      case 'shock': return <ShockTab />
      case 'arcflash': return <ArcFlashTab />
      case 'safework': return <SafeWorkTab />
      case 'training': return <TrainingTab />
      default: return null
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '18px 16px 10px',
        borderBottom: '1px solid var(--divider)',
        background: 'var(--surface)',
      }}>
        <button
          onClick={() => nav(-1)}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 22, cursor: 'pointer', padding: 4 }}
        >
          {'←'}
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          Electrical Safety (CSA Z462)
        </h1>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex', overflowX: 'auto' as const, gap: 2,
        padding: '8px 12px', background: 'var(--surface)',
        borderBottom: '1px solid var(--divider)',
        WebkitOverflowScrolling: 'touch',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
              background: activeTab === tab.key ? 'rgba(255,215,0,0.1)' : 'transparent',
              border: activeTab === tab.key ? '1px solid rgba(255,215,0,0.3)' : '1px solid transparent',
              borderRadius: 8,
              cursor: 'pointer',
              whiteSpace: 'nowrap' as const,
              minHeight: 44,
              flexShrink: 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '14px 12px' }}>
        {renderTab()}
      </div>

      {/* Disclaimer Footer */}
      <div style={{ padding: '12px 16px', textAlign: 'center' as const }}>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          This reference is for educational purposes only. Always consult the current edition of
          CSA Z462, applicable Ontario regulations, and your employer's electrical safety program
          for actual work decisions. Standards are updated periodically; verify all information
          against the latest published editions.
        </p>
      </div>
    </div>
  )
}
