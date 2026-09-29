import { toNumber } from '../utils/dataProcessing'

export default function DataTable({ headers, rows }) {
  return (
    <section className="table-card">
      <div className="table-card__header">
        <h3 className="chart-card__title">원본 데이터</h3>
        <p className="chart-card__subtitle">첫 번째 시트 전체 컬럼 · {rows.length.toLocaleString('ko-KR')}건</p>
      </div>
      <div className="table-card__scroll">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {headers.map((h) => (
                  <td key={h} className={isNumericColumn(h) ? 'data-table__num' : undefined}>
                    {formatCell(h, row[h])}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="data-table__empty">
                  조건에 맞는 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function isNumericColumn(h) {
  return /\(톤\)|\(USD\)|\(%\)/.test(h)
}

function formatCell(h, value) {
  if (value == null || value === '') return '-'
  if (isNumericColumn(h)) {
    const n = toNumber(value)
    return n.toLocaleString('ko-KR', { maximumFractionDigits: 2 })
  }
  return String(value)
}
