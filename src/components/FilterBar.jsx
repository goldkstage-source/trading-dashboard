export default function FilterBar({ search, onSearch, division, onDivision, divisions, resultCount }) {
  return (
    <section className="filter-bar">
      <div className="filter-bar__search-wrap">
        <svg
          className="filter-bar__search-icon"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="filter-bar__search"
          type="text"
          placeholder="고객사, 제품군, 원산지, 비고로 검색"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <select
        className="filter-bar__select"
        value={division}
        onChange={(e) => onDivision(e.target.value)}
      >
        <option value="전체">전체 사업부문</option>
        {divisions.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <span className="filter-bar__count">{resultCount.toLocaleString('ko-KR')}건 표시</span>
    </section>
  )
}
