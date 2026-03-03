export function fmt(n: number, decimals = 2): string {
  if (!isFinite(n)) return '—'
  return n.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: decimals })
}

export function fmtPercent(n: number): string {
  return `${fmt(n, 1)}%`
}

export function roundUp(n: number, increment: number): number {
  return Math.ceil(n / increment) * increment
}
