import { useRef, useState } from 'react'

export default function UploadPanel({ onFile, isLoading, error }) {
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = (files) => {
    const file = files?.[0]
    if (!file) return
    if (!/\.xlsx$/i.test(file.name)) return
    onFile(file)
  }

  return (
    <section className="upload-hero">
      <p className="upload-hero__eyebrow">TRADING DASHBOARD</p>
      <h1 className="upload-hero__title">거래 데이터를 업로드하세요</h1>
      <p className="upload-hero__lead">
        .xlsx 파일을 올리면 브라우저에서 바로 표와 차트로 정리해 드립니다.
      </p>

      <div
        className={`upload-hero__dropzone${isDragOver ? ' upload-hero__dropzone--over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        <p className="upload-hero__dropzone-text">
          파일을 이곳에 끌어다 놓거나 아래 버튼으로 선택하세요
        </p>
        <button
          className="btn btn--primary btn--large"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? '불러오는 중…' : '.xlsx 파일 선택'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="upload-hero__error">{error}</p>}
    </section>
  )
}
