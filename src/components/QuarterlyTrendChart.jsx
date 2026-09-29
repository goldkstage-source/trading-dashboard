import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from './ChartCard'
import { formatCompact, formatUSD } from '../utils/dataProcessing'

export default function QuarterlyTrendChart({ data }) {
  return (
    <ChartCard title="분기별 매출 추이" subtitle="거래일 기준 분기 합계">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="quarterFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0066cc" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#0066cc" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eeeeee" vertical={false} />
          <XAxis
            dataKey="quarter"
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
            formatter={(value) => [formatUSD(value), '매출액']}
            contentStyle={{ borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 13 }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#0066cc"
            strokeWidth={2.5}
            fill="url(#quarterFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
