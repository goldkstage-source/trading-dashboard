import { useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import UploadPanel from './components/UploadPanel'
import KpiCards from './components/KpiCards'
import FilterBar from './components/FilterBar'
import RegionalSalesChart from './components/RegionalSalesChart'
import QuarterlyTrendChart from './components/QuarterlyTrendChart'
import CorporateProfitChart from './components/CorporateProfitChart'
import DataTable from './components/DataTable'
import { parseExcelFile } from './utils/excelParser'
import {
  COLS,
  computeKpis,
  groupByCorporation,
  groupByQuarter,
  groupByRegion,
  parseRowDate,
} from './utils/dataProcessing'
import './App.css'

export default function App() {
  const [sheet, setSheet] = useState(null) // { sheetName, headers, rows }
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [division, setDivision] = useState('전체')

  const handleFile = async (file) => {
    setIsLoading(true)
    setError('')
    try {
      const parsed = await parseExcelFile(file)
      // Drop trailing summary/total rows (e.g. "GRAND TOTAL") that carry no real transaction date.
      const dataRows = parsed.rows.filter((r) => parseRowDate(r[COLS.DATE]) !== null)
      if (!dataRows.length) {
        setError('첫 번째 시트에서 데이터를 찾지 못했습니다. 파일 형식을 확인해주세요.')
      } else {
        setSheet({ ...parsed, rows: dataRows })
        setFileName(file.name)
        setSearch('')
        setDivision('전체')
      }
    } catch (err) {
      console.error(err)
      setError('파일을 읽는 중 오류가 발생했습니다. .xlsx 파일이 맞는지 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const divisions = useMemo(() => {
    if (!sheet) return []
    return Array.from(new Set(sheet.rows.map((r) => r[COLS.DIVISION]).filter(Boolean)))
  }, [sheet])

  const filteredRows = useMemo(() => {
    if (!sheet) return []
    const term = search.trim().toLowerCase()
    return sheet.rows.filter((row) => {
      if (division !== '전체' && row[COLS.DIVISION] !== division) return false
      if (!term) return true
      return [
        COLS.CUSTOMER,
        COLS.PRODUCT,
        COLS.ORIGIN,
        COLS.DESTINATION,
        COLS.DIVISION,
        COLS.BRANCH,
        COLS.NOTE,
      ].some((key) => String(row[key] ?? '').toLowerCase().includes(term))
    })
  }, [sheet, search, division])

  const kpis = useMemo(() => computeKpis(filteredRows), [filteredRows])
  const regionData = useMemo(() => groupByRegion(filteredRows), [filteredRows])
  const quarterData = useMemo(() => groupByQuarter(filteredRows), [filteredRows])
  const corpData = useMemo(() => groupByCorporation(filteredRows), [filteredRows])

  const hasData = Boolean(sheet)

  return (
    <div className="app">
      <Navbar hasData={hasData} fileName={fileName} onReset={() => setSheet(null)} />

      {!hasData && <UploadPanel onFile={handleFile} isLoading={isLoading} error={error} />}

      {hasData && (
        <main className="dashboard">
          <KpiCards kpis={kpis} />

          <FilterBar
            search={search}
            onSearch={setSearch}
            division={division}
            onDivision={setDivision}
            divisions={divisions}
            resultCount={filteredRows.length}
          />

          <section className="chart-grid">
            <RegionalSalesChart data={regionData} />
            <QuarterlyTrendChart data={quarterData} />
            <CorporateProfitChart data={corpData} />
          </section>

          <DataTable headers={sheet.headers} rows={filteredRows} />
        </main>
      )}
    </div>
  )
}
