import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartCard from './ChartCard'
import { formatCompact, formatUSD } from '../utils/dataProcessing'

export default function RegionalSalesChart({ data }) {
  return (
    <ChartCard title="지역별 매출" subtitle="도착지 국가 기준, 매출 상위 지역">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#eeeeee" vertical={false} />
          <XAxis
            dataKey="region"
            tick={{ fontSize: 12, fill: '#7a7a7a' }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCompact}
            tick={{ fontSize: 12, fill: '#7a7a7a' }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,102,204,0.06)' }}
            formatter={(value) => [formatUSD(value), '매출액']}
            contentStyle={{ borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 13 }}
          />
          <Bar dataKey="amount" fill="#0066cc" radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
