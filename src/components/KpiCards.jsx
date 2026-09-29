import { formatUSD, formatNumber } from '../utils/dataProcessing'

export default function KpiCards({ kpis }) {
  const items = [
    { label: '총 거래 건수', value: `${formatNumber(kpis.count)}건` },
    { label: '총 매출액', value: formatUSD(kpis.totalAmount) },
    { label: '총 거래량', value: `${formatNumber(kpis.totalVolume)}톤` },
    { label: '평균 영업이익률', value: `${kpis.avgMargin.toFixed(2)}%` },
  ]

  return (
    <section className="kpi-grid">
      {items.map((item) => (
        <div className="kpi-card" key={item.label}>
          <p className="kpi-card__label">{item.label}</p>
          <p className="kpi-card__value">{item.value}</p>
        </div>
      ))}
    </section>
  )
}
