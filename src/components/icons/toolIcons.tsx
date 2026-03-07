/* ══════════════════════════════════════════════════════════════════
   Tool Icon Registry — SVG stroke icons for every feature
   All icons: viewBox 0 0 24 24, stroke currentColor, strokeWidth 1.5
   ══════════════════════════════════════════════════════════════════ */
import type { SVGProps } from 'react'

type IC = (props: SVGProps<SVGSVGElement>) => React.JSX.Element

const s = { fill: 'none' as const, stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

/* ── Calculators ── */
const OhmsLaw: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M6 18c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M6 18h12" />
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v3" />
  </svg>
)

const Bolt: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M13 2L4.5 13H12l-1 9L20.5 11H13l0-9z" fill="currentColor" fillOpacity="0.1" />
    <path d="M13 2L4.5 13H12l-1 9L20.5 11H13l0-9z" />
  </svg>
)

const VoltageDrop: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 3v14" />
    <path d="M7 13l5 5 5-5" />
    <path d="M4 21h16" />
    <path d="M8 3h8" />
  </svg>
)

const PowerFactor: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M2 12c2 0 3-4 5-4s3 8 5 8 3-8 5-8 3 4 5 4" />
    <path d="M12 4l3 3-3 3" strokeDasharray="2 2" />
  </svg>
)

const ShortCircuit: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.15" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
)

const Lighting: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M9 18h6M10 22h4" />
    <path d="M12 2a7 7 0 00-4 12.7V16h8v-1.3A7 7 0 0012 2z" fill="currentColor" fillOpacity="0.08" />
    <path d="M12 2a7 7 0 00-4 12.7V16h8v-1.3A7 7 0 0012 2z" />
  </svg>
)

const Transformer: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M7 6c1.66 0 3 1.79 3 4s-1.34 4-3 4" />
    <path d="M7 6c-1.66 0-3 1.79-3 4s1.34 4 3 4" />
    <path d="M17 6c1.66 0 3 1.79 3 4s-1.34 4-3 4" />
    <path d="M17 6c-1.66 0-3 1.79-3 4s1.34 4 3 4" />
    <path d="M12 4v16" strokeDasharray="2 2" />
    <path d="M4 4v2M4 18v2M20 4v2M20 18v2" />
  </svg>
)

const Disconnect: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="12" cy="17" r="2" />
    <path d="M12 15V6" />
    <path d="M6 6h4" />
    <path d="M14 6h4" />
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
)

const Generator: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 10l-1 2.5h2L12 15" />
    <path d="M7 6V4M17 6V4" />
  </svg>
)

const BoxFill: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="15" cy="9" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="9" cy="15" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="15" cy="15" r="1.5" fill="currentColor" fillOpacity="0.3" />
  </svg>
)

const Residential: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V20h14V9.5" />
    <path d="M10 20v-6h4v6" />
  </svg>
)

const ChartBar: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="4" y="12" width="4" height="8" rx="1" fill="currentColor" fillOpacity="0.1" />
    <rect x="10" y="6" width="4" height="14" rx="1" fill="currentColor" fillOpacity="0.1" />
    <rect x="16" y="9" width="4" height="11" rx="1" fill="currentColor" fillOpacity="0.1" />
    <rect x="4" y="12" width="4" height="8" rx="1" />
    <rect x="10" y="6" width="4" height="14" rx="1" />
    <rect x="16" y="9" width="4" height="11" rx="1" />
  </svg>
)

const Fire: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 22c4.42 0 7-3.13 7-7 0-3-2-5.5-4-7.5L12 4l-3 3.5C7 9.5 5 12 5 15c0 3.87 2.58 7 7 7z" fill="currentColor" fillOpacity="0.08" />
    <path d="M12 22c4.42 0 7-3.13 7-7 0-3-2-5.5-4-7.5L12 4l-3 3.5C7 9.5 5 12 5 15c0 3.87 2.58 7 7 7z" />
    <path d="M12 22c2 0 3-1.5 3-3.5 0-1.5-1-2.5-2-3.5l-1-1-1 1c-1 1-2 2-2 3.5 0 2 1 3.5 3 3.5z" />
  </svg>
)

const Ground: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 3v10" />
    <path d="M5 13h14" />
    <path d="M7 17h10" />
    <path d="M9 21h6" />
  </svg>
)

/* ── Wire & Cable ── */
const Ampacity: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 21a9 9 0 010-18" />
    <path d="M12 21a9 9 0 000-18" />
    <path d="M12 3v1M12 20v1" />
    <path d="M12 12l-4 5" strokeWidth="2" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

const WireSizing: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="10" cy="10" r="2" fill="currentColor" fillOpacity="0.2" />
    <circle cx="15" cy="10" r="2" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="15" r="2" fill="currentColor" fillOpacity="0.2" />
  </svg>
)

const CablePlug: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M8 7V3M16 7V3" />
    <rect x="6" y="7" width="12" height="6" rx="2" />
    <path d="M12 13v5" />
    <path d="M8 22h8" />
    <path d="M10 18h4" />
  </svg>
)

const TeckCable: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M6 4v16" strokeWidth="3" strokeOpacity="0.15" />
    <path d="M6 4v16" />
    <rect x="2" y="8" width="8" height="4" rx="1" />
    <path d="M10 10h8" />
    <circle cx="21" cy="10" r="2" />
  </svg>
)

const TransformerOcp: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M8 6c1.1 0 2 1.34 2 3s-.9 3-2 3" />
    <path d="M8 6c-1.1 0-2 1.34-2 3s.9 3 2 3" />
    <path d="M16 6c1.1 0 2 1.34 2 3s-.9 3-2 3" />
    <path d="M16 6c-1.1 0-2 1.34-2 3s.9 3 2 3" />
    <path d="M4 17h16" />
    <path d="M12 13v4" />
    <path d="M7 20l5-3 5 3" />
  </svg>
)

const Wrench: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
)

const Burial: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M3 10h18" />
    <path d="M12 10v8" />
    <path d="M9 15l3 3 3-3" />
    <path d="M5 6h2M9 4h2M13 7h3M18 5h2" strokeOpacity="0.4" />
    <path d="M8 21h8" strokeDasharray="2 2" />
  </svg>
)

const CableTray: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M2 16h20" />
    <path d="M4 16v4M20 16v4" />
    <path d="M6 12h2v4M10 10h2v6M14 11h2v5M18 12h2v4" strokeOpacity="0.6" />
    <path d="M2 20h20" />
  </svg>
)

const ConduitFill: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="10" cy="11" r="1.8" fill="currentColor" fillOpacity="0.25" />
    <circle cx="14" cy="11" r="1.8" fill="currentColor" fillOpacity="0.25" />
    <circle cx="12" cy="14.5" r="1.8" fill="currentColor" fillOpacity="0.25" />
  </svg>
)

const ConduitBend: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M5 20V12a7 7 0 017-7h7" strokeWidth="2.5" strokeOpacity="0.12" />
    <path d="M5 20V12a7 7 0 017-7h7" />
    <path d="M16 2l3 3-3 3" />
  </svg>
)

const WireColors: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M6 4v16" strokeWidth="2" />
    <path d="M10 4v16" strokeWidth="2" strokeOpacity="0.7" />
    <path d="M14 4v16" strokeWidth="2" strokeOpacity="0.5" />
    <path d="M18 4v16" strokeWidth="2" strokeOpacity="0.3" />
    <path d="M3 12h18" strokeDasharray="2 2" strokeOpacity="0.3" />
  </svg>
)

const Raceway: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M4 8h16M4 16h16" />
    <path d="M8 4v16M16 4v16" strokeDasharray="3 3" />
    <path d="M4 12h16" strokeOpacity="0.3" />
  </svg>
)

const FeederOcp: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="6" y="3" width="12" height="18" rx="2" />
    <path d="M10 9h4" strokeWidth="2" />
    <circle cx="12" cy="15" r="2" />
    <path d="M12 13v-1" />
  </svg>
)

/* ── Motors & Drives ── */
const Motor: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1" />
    <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
  </svg>
)

const BranchCircuit: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 3v6" />
    <path d="M12 9l-6 6v4" />
    <path d="M12 9v10" />
    <path d="M12 9l6 6v4" />
    <circle cx="6" cy="20" r="1" fill="currentColor" />
    <circle cx="12" cy="20" r="1" fill="currentColor" />
    <circle cx="18" cy="20" r="1" fill="currentColor" />
  </svg>
)

const MotorOcp: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" strokeWidth="2" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
)

const PlayStart: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8l6 4-6 4V8z" fill="currentColor" fillOpacity="0.15" />
    <path d="M10 8l6 4-6 4V8z" />
  </svg>
)

const VfdWave: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M2 12h3l2-6 3 12 3-12 3 12 2-6h4" />
    <rect x="3" y="3" width="18" height="18" rx="2" strokeOpacity="0.3" />
  </svg>
)

const HighVoltage: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 2v4M12 18v4" />
    <path d="M5 6h14" />
    <path d="M7 6v4l5 4 5-4V6" />
    <path d="M12 14v4" />
    <path d="M8 22h8" />
  </svg>
)

/* ── Safety ── */
const ArcFlash: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 22s7-3.5 7-8.5V6l-7-3-7 3v7.5c0 5 7 8.5 7 8.5z" fill="currentColor" fillOpacity="0.06" />
    <path d="M12 22s7-3.5 7-8.5V6l-7-3-7 3v7.5c0 5 7 8.5 7 8.5z" />
    <path d="M12.5 8l-2 4h3l-2 4" strokeWidth="1.8" />
  </svg>
)

const Lock: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
  </svg>
)

const Warning: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 3L2 21h20L12 3z" fill="currentColor" fillOpacity="0.08" />
    <path d="M12 3L2 21h20L12 3z" />
    <path d="M12 10v4" strokeWidth="2" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
)

const Hazardous: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 3a7 7 0 00-7 7c0 3 2 5 4 6h6c2-1 4-3 4-6a7 7 0 00-7-7z" fill="currentColor" fillOpacity="0.06" />
    <path d="M12 3a7 7 0 00-7 7c0 3 2 5 4 6h6c2-1 4-3 4-6a7 7 0 00-7-7z" />
    <path d="M7 19h10M8 22h8" />
    <path d="M12 7v4M10 9h4" />
  </svg>
)

const Graduation: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 3L1 9l11 6 9-5v7" />
    <path d="M5 12.5v5c0 1.38 3.13 3.5 7 3.5s7-2.12 7-3.5v-5" />
  </svg>
)

/* ── Reference ── */
const Formula: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h5M8 16h7" />
    <path d="M16 14l2 2-2 2" strokeOpacity="0.5" />
  </svg>
)

const Book: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
)

const Scroll: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M8 3H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h3" />
    <path d="M16 3h3a2 2 0 012 2v1M16 21h3a2 2 0 002-2V8" />
    <path d="M8 3v18h8V3H8z" fill="currentColor" fillOpacity="0.05" />
    <path d="M8 3v18h8V3H8z" />
    <path d="M11 8h3M11 12h3M11 16h2" strokeOpacity="0.5" />
  </svg>
)

const Converter: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M7 10H3l4-4" />
    <path d="M3 10h18" />
    <path d="M17 14h4l-4 4" />
    <path d="M21 14H3" />
  </svg>
)

const SearchBolt: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="10" cy="10" r="7" />
    <path d="M21 21l-4.35-4.35" />
    <path d="M10.5 6l-2 4h3l-2 4" strokeWidth="1.8" />
  </svg>
)

const Multimeter: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 6a3 3 0 013 3" />
    <path d="M12 6a3 3 0 00-3 3" />
    <path d="M12 6v4" />
    <path d="M9 16h6" />
    <circle cx="12" cy="16" r="0.5" fill="currentColor" />
  </svg>
)

const ControlCircuit: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M7 12h10" strokeOpacity="0.3" />
    <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.15" />
  </svg>
)

const Plc: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M8 5V3M12 5V3M16 5V3M8 19v2M12 19v2M16 19v2" />
    <path d="M8 9h2v2H8zM14 9h2v2h-2z" fill="currentColor" fillOpacity="0.2" />
    <path d="M8 13h8" strokeOpacity="0.4" />
  </svg>
)

const Antenna: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 12v8" />
    <path d="M8 20h8" />
    <circle cx="12" cy="8" r="2" fill="currentColor" fillOpacity="0.15" />
    <circle cx="12" cy="8" r="2" />
    <path d="M7 4a7.07 7.07 0 010 8" />
    <path d="M17 4a7.07 7.07 0 000 8" />
  </svg>
)

const ChartLine: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M3 20h18" />
    <path d="M3 20V4" />
    <path d="M6 16l4-5 4 3 4-7" strokeWidth="1.8" />
    <circle cx="6" cy="16" r="1" fill="currentColor" />
    <circle cx="10" cy="11" r="1" fill="currentColor" />
    <circle cx="14" cy="14" r="1" fill="currentColor" />
    <circle cx="18" cy="7" r="1" fill="currentColor" />
  </svg>
)

const ShieldCheck: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.06" />
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const Battery: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="2" y="7" width="18" height="10" rx="2" />
    <path d="M20 10h2v4h-2" />
    <path d="M6 10v4M10 10v4M14 10v4" strokeOpacity="0.4" />
  </svg>
)

const Sun: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
  </svg>
)

const Emergency: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M12 3a4 4 0 014 4v2H8V7a4 4 0 014-4z" fill="currentColor" fillOpacity="0.1" />
    <path d="M12 3a4 4 0 014 4v2H8V7a4 4 0 014-4z" />
    <rect x="4" y="9" width="16" height="8" rx="2" />
    <path d="M8 17v4M16 17v4" />
    <path d="M10 13h4" />
  </svg>
)

const Relay: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v8M8 12h8" strokeWidth="1.2" />
    <path d="M6 6l2 2M16 6l-2 2M6 18l2-2M16 18l-2-2" strokeOpacity="0.4" />
  </svg>
)

const Bell: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
    <path d="M12 2v2" />
  </svg>
)

const Conductor: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M4 4v16" strokeWidth="2" />
    <path d="M9 4c0 3-2 5-2 8s2 5 2 8" />
    <path d="M14 4c0 3 2 5 2 8s-2 5-2 8" />
    <path d="M20 4v16" strokeWidth="2" />
  </svg>
)

/* ── Mining ── */
const Pickaxe: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M14 4l-4 4" strokeWidth="2" />
    <path d="M6 6l4 4" />
    <path d="M10 10L4 20" strokeWidth="1.8" />
    <path d="M14 4l6-1-1 6-4-4" fill="currentColor" fillOpacity="0.1" />
    <path d="M14 4l6-1-1 6" />
  </svg>
)

/* ── Tools ── */
const Clipboard: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 2h6v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V2z" />
    <path d="M9 11h6M9 15h4" />
  </svg>
)

const Timer: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2.5" />
    <path d="M10 2h4" />
    <path d="M12 2v2" />
    <path d="M19.3 6.7l1-1" />
  </svg>
)

const SingleLine: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <path d="M4 12h4" />
    <rect x="8" y="10" width="4" height="4" rx="0.5" />
    <path d="M12 12h4" />
    <circle cx="18" cy="12" r="2" />
    <path d="M20 12h2" />
    <path d="M4 6h16" strokeOpacity="0.2" />
    <path d="M4 18h16" strokeOpacity="0.2" />
  </svg>
)

const CecLookup: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 7h8M8 11h5" />
    <circle cx="16" cy="16" r="3" />
    <path d="M18.5 18.5L21 21" />
  </svg>
)

const SymbolsRef: IC = p => (
  <svg viewBox="0 0 24 24" {...s} {...p}>
    <circle cx="8" cy="8" r="3" />
    <rect x="14" y="5" width="6" height="6" rx="1" />
    <path d="M5 17l3-3 3 3 3-3 3 3" />
  </svg>
)

/* ── Export map ── */
export const toolIcons: Record<string, IC> = {
  // Calculators
  'ohms-law': OhmsLaw,
  'bolt': Bolt,
  'voltage-drop': VoltageDrop,
  'power-factor': PowerFactor,
  'short-circuit': ShortCircuit,
  'lighting': Lighting,
  'transformer': Transformer,
  'disconnect': Disconnect,
  'generator': Generator,
  'box-fill': BoxFill,
  'residential': Residential,
  'chart-bar': ChartBar,
  'fire': Fire,
  'ground': Ground,
  // Wire & Cable
  'ampacity': Ampacity,
  'wire-sizing': WireSizing,
  'cable-plug': CablePlug,
  'teck-cable': TeckCable,
  'transformer-ocp': TransformerOcp,
  'wrench': Wrench,
  'burial': Burial,
  'cable-tray': CableTray,
  'conduit-fill': ConduitFill,
  'conduit-bend': ConduitBend,
  'wire-colors': WireColors,
  'raceway': Raceway,
  'feeder-ocp': FeederOcp,
  // Motors & Drives
  'motor': Motor,
  'branch-circuit': BranchCircuit,
  'motor-ocp': MotorOcp,
  'play-start': PlayStart,
  'vfd-wave': VfdWave,
  'high-voltage': HighVoltage,
  // Safety
  'arc-flash': ArcFlash,
  'lock': Lock,
  'warning': Warning,
  'hazardous': Hazardous,
  'graduation': Graduation,
  // Reference
  'formula': Formula,
  'book': Book,
  'scroll': Scroll,
  'cec-lookup': CecLookup,
  'symbols-ref': SymbolsRef,
  'converter': Converter,
  'search-bolt': SearchBolt,
  'multimeter': Multimeter,
  'control-circuit': ControlCircuit,
  'plc': Plc,
  'antenna': Antenna,
  'chart-line': ChartLine,
  'shield-check': ShieldCheck,
  'battery': Battery,
  'sun': Sun,
  'emergency': Emergency,
  'relay': Relay,
  'bell': Bell,
  'conductor': Conductor,
  // Mining
  'pickaxe': Pickaxe,
  // Tools
  'clipboard': Clipboard,
  'timer': Timer,
  'single-line': SingleLine,
}
