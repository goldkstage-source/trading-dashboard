import * as XLSX from 'xlsx'

/**
 * Reads a .xlsx File in the browser and returns the first sheet's data.
 * Automatically locates the real header row even when the sheet has
 * title/banner rows above the actual table (common in office exports).
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[firstSheetName]

        const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true })

        let headerIdx = raw.findIndex(
          (row) => Array.isArray(row) && row.includes('거래일') && row.includes('거래번호')
        )
        if (headerIdx === -1) {
          headerIdx = raw.findIndex(
            (row) => Array.isArray(row) && row.filter((c) => c !== null && c !== '').length >= 3
          )
        }
        if (headerIdx === -1) headerIdx = 0

        const headers = (raw[headerIdx] || []).map((h) => (h == null ? '' : String(h).trim()))

        const rows = raw
          .slice(headerIdx + 1)
          .filter((row) => Array.isArray(row) && row.some((cell) => cell !== null && cell !== ''))
          .map((row) => {
            const obj = {}
            headers.forEach((h, i) => {
              if (h) obj[h] = row[i] === undefined ? null : row[i]
            })
            return obj
          })

        resolve({ sheetName: firstSheetName, headers: headers.filter(Boolean), rows })
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}
