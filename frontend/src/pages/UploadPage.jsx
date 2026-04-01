import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload, FileText, Zap, CheckCircle, AlertCircle,
  Globe, X, Download, AlertTriangle, FolderOpen, RefreshCw, Loader2,
} from 'lucide-react'
import { analyzePaper, getLibrary, analyzeLibrary, fetchPaper } from '../utils/api'

const DISEASE_AREAS = [
  'General Medicine','Oncology','Cardiology','Neurology','Infectious Disease',
  'Endocrinology','Pulmonology','Rheumatology','Psychiatry','Gastroenterology',
  'Nephrology','Hematology','Dermatology','Ophthalmology','Orthopedics',
]

const PIPELINE_STEPS = [
  'PDF parsing and IMRAD section detection',
  'Clinical content validation',
  'Semantic chunking by section',
  'Embedding generation',
  'Vector indexing',
  'HyperRAG graph construction',
  'Trial metrics extraction',
  'Abstract inflation analysis',
  'Evidence quality scoring',
  'Disease area benchmarking',
]

const CLINICAL_KEYWORDS = [
  'clinical trial','randomized','patients','placebo','efficacy','adverse',
  'p-value','confidence interval','sample size','methodology','treatment',
  'therapy','drug','outcomes','endpoint','blinded','cohort','abstract',
  'results','discussion','conclusion','statistical','dose','safety',
  'participants','phase','protocol','enrollment','follow-up',
]

const AREA_HUE = {
  Oncology:45, Cardiology:0, Neurology:260, 'Infectious Disease':160,
  Endocrinology:30, Pulmonology:200, Rheumatology:280, Psychiatry:300,
  Gastroenterology:130, 'General Medicine':210,
}

export default function UploadPage({ onAnalyzed }) {
  const [mode,         setMode]         = useState('upload')
  const [file,         setFile]         = useState(null)
  const [paperId,      setPaperId]      = useState('')
  const [diseaseArea,  setDiseaseArea]  = useState('General Medicine')
  const [loading,      setLoading]      = useState(false)
  const [progress,     setProgress]     = useState(0)
  const [step,         setStep]         = useState(0)
  const [error,        setError]        = useState(null)
  const [done,         setDone]         = useState(false)
  const [drag,         setDrag]         = useState(false)
  const [fetchUrl,     setFetchUrl]     = useState('')
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchStatus,  setFetchStatus]  = useState(null)
  const [fileValid,    setFileValid]    = useState(null)
  const [validMsg,     setValidMsg]     = useState('')
  const [searchQuery,  setSearchQuery]  = useState('')
  const [libFiles,     setLibFiles]     = useState([])
  const [libLoading,   setLibLoading]   = useState(false)
  const [libError,     setLibError]     = useState(null)
  const [libFolder,    setLibFolder]    = useState('')
  const [libAreas,     setLibAreas]     = useState({})
  const [libAnalyzing, setLibAnalyzing] = useState(null)

  const inputRef = useRef()

  const loadLibrary = useCallback(async () => {
    setLibLoading(true); setLibError(null)
    try {
      const data = await getLibrary()
      setLibFiles(data.files || [])
      setLibFolder(data.folder || '')
    } catch (e) {
      setLibError(e.message)
    } finally {
      setLibLoading(false)
    }
  }, [])

  useEffect(() => { if (mode === 'library') loadLibrary() }, [mode, loadLibrary])

  const validateFile = useCallback(async (f) => {
    if (!f) return false
    const sizeMB = f.size / 1024 / 1024
    if (sizeMB > 50) {
      setFileValid('invalid')
      setValidMsg(`File too large (${sizeMB.toFixed(1)} MB). Max 50 MB.`)
      return false
    }
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!['.pdf', '.txt', '.html', '.docx'].includes(ext)) {
      setFileValid('invalid')
      setValidMsg(`Unsupported format "${ext}". Please upload PDF, TXT, HTML, or DOCX.`)
      return false
    }
    if (f.type === 'text/plain') {
      try {
        const text = await f.slice(0, 15000).text()
        const hits = CLINICAL_KEYWORDS.filter(kw => text.toLowerCase().includes(kw))
        if (hits.length < 3) {
          setFileValid('invalid')
          setValidMsg('This does not appear to be a clinical trial paper. Please upload a research article.')
          return false
        }
      } catch (_) {}
    }
    setFileValid('valid')
    setValidMsg('File accepted.')
    return true
  }, [])

  const handleFileSelect = async (f) => {
    if (!f) return
    setFileValid(null); setValidMsg(''); setError(null)
    const ok = await validateFile(f)
    if (ok !== false) {
      setFile(f)
      if (!paperId) {
        setPaperId(f.name.replace(/\.[^.]+$/, '').replace(/[_\-]+/g, ' ').trim())
      }
    } else {
      setFile(null)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFileSelect(f)
  }

  const doFetch = async () => {
    if (!fetchUrl.trim()) return
    setFetchLoading(true); setFetchStatus(null); setError(null)
    setFile(null); setFileValid(null)
    try {
      let url = fetchUrl.trim()
      if (!url.startsWith('http')) url = 'https://' + url
      const res = await fetchPaper(url)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const blob  = await res.blob()
      const fname = res.headers.get('X-Detected-Filename') || 'paper.pdf'
      const f     = new File([blob], fname, { type: blob.type || 'application/pdf' })
      await handleFileSelect(f)
      setFetchStatus('success')
    } catch (e) {
      setFetchStatus('error')
      setError(e.message)
    } finally {
      setFetchLoading(false)
    }
  }

  const analyzeLibraryFile = async (entry) => {
    setLibAnalyzing(entry.filename); setError(null)
    const area = libAreas[entry.filename] || 'General Medicine'
    try {
      const data = await analyzeLibrary(entry.filename, area)
      if (data.error) throw new Error(data.error)
      onAnalyzed(data)
    } catch (e) {
      setError(`${entry.paper_name}: ${e.message}`)
    } finally {
      setLibAnalyzing(null)
    }
  }

  const simulate = () => {
    let s = 0
    const iv = setInterval(() => {
      s++; setStep(s)
      if (s >= PIPELINE_STEPS.length) clearInterval(iv)
    }, 700)
    return iv
  }

  const handleAnalyze = async () => {
    if (!file || !paperId.trim() || fileValid === 'invalid') return
    setLoading(true); setError(null); setDone(false); setStep(0); setProgress(0)
    const iv = simulate()
    try {
      const result = await analyzePaper(file, paperId.trim(), diseaseArea, setProgress)
      if (result.validation === false) {
        setFileValid('invalid'); setValidMsg(result.error || 'Not a clinical paper.')
        setError(result.error)
        return
      }
      clearInterval(iv); setDone(true)
      setTimeout(() => onAnalyzed(result), 600)
    } catch (e) {
      clearInterval(iv)
      setError(e.response?.data?.error || e.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const filtered  = libFiles.filter(f =>
    f.paper_name.toLowerCase().includes(searchQuery.toLowerCase()))
  const canAnalyze = file && paperId.trim() && !loading && fileValid !== 'invalid'

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 12px' }} className="fade-up">

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Instrument Serif, serif', marginBottom: 6 }}>
          Upload Clinical Paper
        </div>
        <div style={{ color: 'var(--text2)', fontSize: 13 }}>
          Upload a clinical trial, systematic review, or medical research article.
          The full intelligence pipeline runs automatically.
        </div>
      </div>

      <div className="tab-nav" style={{ marginBottom: 20 }}>
        <button className={`tab-item ${mode === 'upload'  ? 'active' : ''}`} onClick={() => setMode('upload')}>
          <Upload size={13} /> File Upload
        </button>
        <button className={`tab-item ${mode === 'fetch'   ? 'active' : ''}`} onClick={() => setMode('fetch')}>
          <Globe size={13} /> Fetch from URL
        </button>
        <button className={`tab-item ${mode === 'library' ? 'active' : ''}`} onClick={() => setMode('library')}>
          <FolderOpen size={13} /> Paper Library
          {libFiles.length > 0 && (
            <span style={{ marginLeft: 5, fontSize: 9, background: 'rgba(56,189,248,0.2)',
              color: 'var(--accent)', padding: '1px 5px', borderRadius: 99,
              fontFamily: 'DM Mono, monospace' }}>
              {libFiles.length}
            </span>
          )}
        </button>
      </div>

      {/* File upload */}
      {mode === 'upload' && (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${drag ? 'var(--accent)'
                : file && fileValid === 'valid'   ? 'var(--teal)'
                : file && fileValid === 'invalid' ? 'var(--red)'
                : 'var(--border2)'}`,
              borderRadius: 10, padding: '36px 32px', textAlign: 'center',
              cursor: 'pointer',
              background: drag ? 'var(--accent-light)'
                : file && fileValid === 'valid'   ? 'var(--teal-light)'
                : file && fileValid === 'invalid' ? 'var(--red-light)'
                : 'var(--surface2)',
              transition: 'all 0.2s', marginBottom: 12,
            }}
          >
            <input ref={inputRef} type="file" accept=".pdf,.txt,.html,.docx"
              style={{ display: 'none' }}
              onChange={e => handleFileSelect(e.target.files[0])} />
            {file ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <FileText size={24} style={{ color: fileValid === 'invalid' ? 'var(--red)' : 'var(--teal)', flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600 }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                    {' · '}
                    {file.name.split('.').pop().toUpperCase()}
                  </div>
                </div>
                <button onClick={e => {
                  e.stopPropagation(); setFile(null); setFileValid(null); setValidMsg('')
                }} style={{ background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text3)', padding: 4, marginLeft: 8 }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div>
                <Upload size={32} style={{ color: 'var(--text3)', margin: '0 auto 10px' }} />
                <div style={{ fontWeight: 600, fontSize: 15 }}>Drop paper here or click to browse</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
                  Clinical trials, systematic reviews, meta-analyses, observational studies
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {['.PDF', '.DOCX', '.TXT', '.HTML'].map(ext => (
                    <span key={ext} className="badge badge-blue" style={{ fontSize: 10 }}>{ext}</span>
                  ))}
                  <span className="badge badge-orange" style={{ fontSize: 10 }}>MAX 50 MB</span>
                </div>
              </div>
            )}
          </div>

          {fileValid && (
            <div className={`alert ${fileValid === 'valid' ? 'alert-success' : 'alert-error'}`}
              style={{ marginBottom: 12, fontSize: 13 }}>
              {fileValid === 'valid'
                ? <CheckCircle size={14} style={{ flexShrink: 0 }} />
                : <AlertCircle  size={14} style={{ flexShrink: 0 }} />}
              {validMsg}
            </div>
          )}
        </>
      )}

      {/* URL fetch */}
      {mode === 'fetch' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <Globe size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontWeight: 600 }}>Fetch Paper from URL</span>
            <span className="badge badge-teal" style={{ marginLeft: 'auto', fontSize: 10 }}>
              PubMed / arXiv / Journal sites
            </span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65 }}>
              Paste a direct PDF link or a journal webpage URL.
              The server will find and download the embedded PDF automatically.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={fetchUrl} onChange={e => setFetchUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doFetch()}
                placeholder="https://www.nejm.org/doi/full/10.xxxx  or  direct .pdf link"
                style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={doFetch}
                disabled={!fetchUrl.trim() || fetchLoading} style={{ flexShrink: 0 }}>
                {fetchLoading ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
                Fetch
              </button>
            </div>
            {fetchStatus === 'success' && file && (
              <div className="alert alert-success" style={{ fontSize: 13 }}>
                <CheckCircle size={14} style={{ flexShrink: 0 }} />
                Downloaded: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            {fetchStatus === 'error' && (
              <div className="alert alert-error" style={{ fontSize: 13 }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} /> {error}
              </div>
            )}
            <div style={{ padding: '9px 12px', background: 'var(--surface2)', borderRadius: 8,
              fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.7 }}>
              Direct PDF link downloads immediately.
              A journal webpage is scanned for PDF links and the best match is downloaded.
              If no PDF is found, visible text is extracted from the page.
            </div>
          </div>
        </div>
      )}

      {/* Library */}
      {mode === 'library' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <FolderOpen size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontWeight: 600 }}>Paper Library</span>
            <span className="badge badge-blue" style={{ marginLeft: 6 }}>
              {libFiles.length} paper{libFiles.length !== 1 ? 's' : ''}
            </span>
            <button className="btn btn-secondary" onClick={loadLibrary} disabled={libLoading}
              style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: 11 }}>
              <RefreshCw size={11} className={libLoading ? 'spin' : ''} /> Refresh
            </button>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {libFolder && (
              <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono, monospace',
                padding: '6px 10px', background: 'var(--surface2)', borderRadius: 6 }}>
                {libFolder}
              </div>
            )}

            {libError && (
              <div className="alert alert-error" style={{ fontSize: 13 }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} /> {libError}
              </div>
            )}

            {libLoading && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center',
                color: 'var(--text2)', padding: 12 }}>
                <Loader2 size={14} className="spin" /> Scanning trial_papers folder...
              </div>
            )}

            {!libLoading && !libError && libFiles.length === 0 && (
              <div style={{ padding: '28px 20px', background: 'rgba(56,189,248,0.05)',
                border: '1px dashed var(--accent)', borderRadius: 10, textAlign: 'center' }}>
                <FolderOpen size={30} style={{ color: 'var(--accent)', margin: '0 auto 10px' }} />
                <div style={{ fontWeight: 600, marginBottom: 6 }}>No papers in library folder</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
                  Copy your downloaded clinical trial PDFs into the trial_papers folder.
                  The filename becomes the paper title automatically. Then click Refresh.
                </div>
              </div>
            )}

            {libFiles.length > 0 && (
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search ${libFiles.length} papers...`} />
            )}

            {filtered.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 10, maxHeight: 460, overflowY: 'auto', paddingRight: 4,
              }}>
                {filtered.map((entry, i) => {
                  const hue         = AREA_HUE[libAreas[entry.filename] || 'General Medicine'] ?? 210
                  const isAnalyzing = libAnalyzing === entry.filename
                  const area        = libAreas[entry.filename] || 'General Medicine'
                  return (
                    <div key={i} style={{
                      padding: '12px 14px', borderRadius: 10,
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      display: 'flex', flexDirection: 'column', gap: 8,
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                      onMouseOver={e => {
                        e.currentTarget.style.borderColor = 'var(--accent)'
                        e.currentTarget.style.boxShadow  = '0 0 0 1px rgba(56,189,248,0.12)'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.boxShadow  = 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                          background: `hsl(${hue}, 55%, 15%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: 15, color: `hsl(${hue}, 80%, 70%)`,
                        }}>
                          {entry.paper_name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap',
                            overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {entry.paper_name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                            {entry.ext.replace('.', '').toUpperCase()} · {entry.size_mb} MB
                          </div>
                        </div>
                      </div>

                      <select value={area}
                        onChange={e => setLibAreas(a => ({ ...a, [entry.filename]: e.target.value }))}
                        style={{ fontSize: 11, padding: '4px 8px' }}>
                        {DISEASE_AREAS.map(a => <option key={a}>{a}</option>)}
                      </select>

                      <button className="btn btn-primary"
                        style={{ justifyContent: 'center', padding: '7px 12px', fontSize: 12 }}
                        onClick={() => analyzeLibraryFile(entry)}
                        disabled={!!libAnalyzing}>
                        {isAnalyzing
                          ? <><Loader2 size={12} className="spin" /> Analyzing...</>
                          : <><Zap size={12} /> Analyze Paper</>}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {filtered.length === 0 && libFiles.length > 0 && (
              <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 20, fontSize: 13 }}>
                No papers match "{searchQuery}"
              </div>
            )}

            {error && mode === 'library' && (
              <div className="alert alert-error" style={{ fontSize: 13 }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} /> {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Not-clinical banner */}
      {fileValid === 'invalid' && mode !== 'library' && (
        <div style={{
          padding: '18px 20px', borderRadius: 10, marginBottom: 16,
          background: 'rgba(248,113,113,0.08)', border: '1.5px solid rgba(248,113,113,0.3)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertTriangle size={22} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--red)', marginBottom: 4 }}>
              Please Upload a Clinical Trial Paper
            </div>
            <div style={{ fontSize: 13, color: 'rgba(252,165,165,0.9)', lineHeight: 1.7 }}>
              {validMsg || 'This file does not appear to be a clinical research article.'}
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['RCT', 'Phase III Trial', 'Meta-Analysis', 'Systematic Review', 'Cohort Study'].map(t => (
                <span key={t} className="badge badge-red" style={{ fontSize: 10 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paper ID and disease area */}
      {mode !== 'library' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <div className="label" style={{ marginBottom: 5 }}>Paper Title / ID *</div>
            <input value={paperId} onChange={e => setPaperId(e.target.value)}
              placeholder="e.g. Smith et al. 2023 NEJM Diabetes RCT" />
          </div>
          <div>
            <div className="label" style={{ marginBottom: 5 }}>Disease Area</div>
            <select value={diseaseArea} onChange={e => setDiseaseArea(e.target.value)}>
              {DISEASE_AREAS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Pipeline progress */}
      {loading && (
        <div className="card" style={{ marginBottom: 16, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Loader2 size={14} className="spin" style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Running clinical analysis pipeline...</span>
            <span className="mono" style={{ marginLeft: 'auto', color: 'var(--accent)' }}>{progress}%</span>
          </div>
          {progress > 0 && progress < 100 && (
            <div className="progress-bar" style={{ height: 8, marginBottom: 14 }}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: 'var(--accent)' }} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {PIPELINE_STEPS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: i <= step ? 1 : 0.3, transition: 'opacity 0.3s',
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  background: i < step   ? 'var(--teal)'
                            : i === step ? 'var(--accent)'
                            : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i < step   && <span style={{ color: '#040911', fontSize: 9 }}>v</span>}
                  {i === step && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                </div>
                <span style={{ fontSize: 12, color: i === step ? 'var(--text)' : 'var(--text2)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && mode !== 'library' && fileValid !== 'invalid' && (
        <div className="alert alert-error" style={{ marginBottom: 12 }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
        </div>
      )}

      {done && (
        <div className="alert alert-success" style={{ marginBottom: 12 }}>
          <CheckCircle size={15} style={{ flexShrink: 0 }} /> Analysis complete. Loading dashboard...
        </div>
      )}

      {mode !== 'library' && (
        <button className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', fontSize: 14 }}
          onClick={handleAnalyze}
          disabled={!canAnalyze}>
          {loading
            ? <><Loader2 size={14} className="spin" /> Analyzing...</>
            : !file
            ? <><Upload size={14} /> Select a Paper to Analyze</>
            : fileValid === 'invalid'
            ? <><AlertCircle size={14} /> Invalid File</>
            : <><Zap size={14} /> Run Full Clinical Analysis</>}
        </button>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginTop: 20 }}>
        {[
          ['IMRAD', 'Section Detection', 'Section-aware parsing'],
          ['Stats', 'Trial Metrics',     'p-values, CI, effect size'],
          ['Infl', 'Abstract Inflation', 'Overclaim detection'],
          ['CEBM', 'Evidence Quality',   'Oxford CEBM scoring'],
          ['Bench','Benchmarking',       'Disease area norms'],
          ['Graph','Knowledge Graph',    'Cross-section links'],
        ].map(([abbr, title, desc]) => (
          <div key={title} className="card" style={{ padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--accent)', marginBottom: 3 }}>
              {abbr}
            </div>
            <div style={{ fontWeight: 600, fontSize: 12 }}>{title}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
