import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from './ChartCard'
import { formatCompact, formatUSD } from '../utils/dataProcessing'

const START = [29, 58, 99] // #1d3a63
const END = [111, 177, 255] // #6fb1ff

function rampColor(i, total) {
  const t = total <= 1 ? 0 : i / (total - 1)
  const rgb = START.map((s, idx) => Math.round(s + (END[idx] - s) * t))
  return `rgb(${rgb.join(',')})`
}

export default function CorporateProfitChart({ data }) {
  return (
    <ChartCard title="법인(담당지점)별 영업이익" subtitle="총액 × 영업이익률 합산, 상위 10개 법인">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
        >
          <CartesianGrid stroke="#eeeeee" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={formatCompact}
            tick={{ fontSize: 12, fill: '#7a7a7a' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="corp"
            width={92}
            tick={{ fontSize: 12, fill: '#1d1d1f' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,102,204,0.06)' }}
            formatter={(value) => [formatUSD(value), '영업이익']}
            contentStyle={{ borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 13 }}
          />
          <Bar dataKey="profit" radius={[0, 6, 6, 0]} maxBarSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill={rampColor(i, data.length)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
