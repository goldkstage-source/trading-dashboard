export default function Navbar({ hasData, onReset, fileName }) {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__dot" />
        Global Trading Ledger
      </div>
      {hasData && (
        <div className="navbar__actions">
          <span className="navbar__filename">{fileName}</span>
          <button className="btn btn--dark-utility" onClick={onReset}>
            새 파일 업로드
          </button>
        </div>
      )}
    </header>
  )
}
