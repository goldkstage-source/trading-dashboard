// Column names as they appear in the source workbook.
export const COLS = {
  DATE: '거래일',
  ID: '거래번호',
  DIVISION: '사업부문',
  PRODUCT: '제품군',
  ORIGIN: '원산지',
  DESTINATION: '도착지',
  CUSTOMER: '고객사',
  VOLUME: '거래량(톤)',
  UNIT_PRICE: '단가(USD)',
  AMOUNT: '총액(USD)',
  DEAL_TYPE: '거래유형',
  BRANCH: '담당지점',
  PAYMENT: '결제조건',
  MARGIN: '영업이익률(%)',
  NOTE: '비고',
}

export function toNumber(v) {
  if (typeof v === 'number') return v
  if (v == null || v === '') return 0
  const n = parseFloat(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

function excelSerialToDate(serial) {
  const epoch = Date.UTC(1899, 11, 30)
  return new Date(epoch + serial * 86400000)
}

export function parseRowDate(v) {
  if (v == null) return null
  if (v instanceof Date) return v
  if (typeof v === 'number') return excelSerialToDate(v)
  const s = String(v).trim()
  if (!s) return null
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

export function computeKpis(rows) {
  const count = rows.length
  const totalAmount = rows.reduce((s, r) => s + toNumber(r[COLS.AMOUNT]), 0)
  const totalVolume = rows.reduce((s, r) => s + toNumber(r[COLS.VOLUME]), 0)
  const avgMargin = count === 0
    ? 0
    : rows.reduce((s, r) => s + toNumber(r[COLS.MARGIN]), 0) / count
  return { count, totalAmount, totalVolume, avgMargin }
}

export function groupByRegion(rows, topN = 8) {
  const map = new Map()
  rows.forEach((r) => {
    const region = r[COLS.DESTINATION] || '미상'
    map.set(region, (map.get(region) || 0) + toNumber(r[COLS.AMOUNT]))
  })
  return Array.from(map, ([region, amount]) => ({ region, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, topN)
}

export function groupByQuarter(rows) {
  const map = new Map()
  rows.forEach((r) => {
    const d = parseRowDate(r[COLS.DATE])
    if (!d) return
    const q = Math.floor(d.getUTCMonth() / 3) + 1
    const key = `${d.getUTCFullYear()} Q${q}`
    map.set(key, (map.get(key) || 0) + toNumber(r[COLS.AMOUNT]))
  })
  return Array.from(map, ([quarter, amount]) => ({ quarter, amount })).sort((a, b) =>
    a.quarter.localeCompare(b.quarter)
  )
}

export function groupByCorporation(rows, topN = 10) {
  const map = new Map()
  rows.forEach((r) => {
    const corp = r[COLS.BRANCH] || '미상'
    const amount = toNumber(r[COLS.AMOUNT])
    const profit = (amount * toNumber(r[COLS.MARGIN])) / 100
    const prev = map.get(corp) || { amount: 0, profit: 0 }
    map.set(corp, { amount: prev.amount + amount, profit: prev.profit + profit })
  })
  return Array.from(map, ([corp, v]) => ({ corp, profit: v.profit, amount: v.amount }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, topN)
}

export function formatUSD(n) {
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`
  return `${sign}$${abs.toFixed(0)}`
}

export function formatNumber(n) {
  return new Intl.NumberFormat('ko-KR').format(Math.round(n))
}

export function formatCompact(n) {
  return new Intl.NumberFormat('ko-KR', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}
