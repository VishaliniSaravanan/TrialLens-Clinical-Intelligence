// ── QueryPage.jsx ─────────────────────────────────────────────────────────────
// Save as src/pages/QueryPage.jsx

import { useState } from 'react'
import { Search, BookOpen, AlertCircle, Loader2 } from 'lucide-react'
import { queryPaper } from '../utils/api'

const SECTIONS = ['Any','abstract','introduction','methods','results',
                  'discussion','conclusion','adverse','statistics']

const SAMPLES = [
  "What was the primary endpoint and was it met?",
  "What adverse events were reported and at what rates?",
  "What was the sample size and were there any power calculation issues?",
  "How does this compare to existing treatments?",
  "What are the main limitations of this study?",
  "Were there any serious adverse events requiring discontinuation?",
  "What statistical methods were used?",
  "What was the confidence interval for the primary outcome?",
  "What does the discussion say about generalizability?",
  "Were the results consistent across subgroups?",
]

export default function QueryPage({ paperId }) {
  const [question, setQuestion] = useState('')
  const [section,  setSection]  = useState('Any')
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null)
  const [error,    setError]    = useState(null)

  const doQuery = async (q) => {
    const qText = q || question
    if (!qText.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const sec = section === 'Any' ? null : section
      const res = await queryPaper(qText, paperId || null, sec)
      setResult({ ...res, question: qText })
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="fade-up" style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="card">
        <div className="card-header">
          <Search size={15} style={{color:'var(--accent)'}}/>
          <span style={{fontWeight:600}}>Research Query Engine</span>
          {paperId && <span className="badge badge-teal" style={{marginLeft:'auto'}}>{paperId}</span>}
        </div>
        <div className="card-body" style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={{display:'flex',gap:8}}>
            <input value={question} onChange={e=>setQuestion(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&doQuery()}
              placeholder="Ask anything about this clinical trial..." style={{flex:1}}/>
            <select value={section} onChange={e=>setSection(e.target.value)} style={{width:140,flexShrink:0}}>
              {SECTIONS.map(s=><option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary" onClick={()=>doQuery()}
              disabled={!question.trim()||loading} style={{flexShrink:0}}>
              {loading ? <Loader2 size={14} className="spin"/> : <Search size={14}/>}
              Search
            </button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {SAMPLES.map((q,i)=>(
              <button key={i} className="btn btn-secondary" style={{padding:'4px 10px',fontSize:11}}
                onClick={()=>{setQuestion(q);doQuery(q)}}>
                {q.slice(0,42)}{q.length>42?'…':''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="card" style={{padding:20}}>
          <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}>
            <Loader2 size={16} className="spin" style={{color:'var(--accent)'}}/>
            <span style={{color:'var(--text2)'}}>Searching through trial sections…</span>
          </div>
          {[80,60,90].map((w,i)=>(
            <div key={i} style={{height:12,background:'var(--surface2)',borderRadius:4,marginBottom:8,width:`${w}%`}}/>
          ))}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={14} style={{flexShrink:0}}/>{error}
        </div>
      )}

      {result && (
        <div className="card fade-up">
          <div className="card-header">
            <BookOpen size={14} style={{color:'var(--accent)'}}/>
            <span style={{fontWeight:600}}>Results</span>
            <span className="badge badge-blue" style={{marginLeft:'auto'}}>{result.chunk_count} chunks</span>
          </div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:8}}>
            <div style={{padding:'8px 12px',background:'var(--accent-light)',borderRadius:6,
              fontSize:13,fontWeight:500,color:'var(--accent)',marginBottom:4}}>
              Q: {result.question}
            </div>
            {result.chunks.map((chunk, i) => (
              <ChunkBlock key={i} chunk={chunk} index={i} />
            ))}
          </div>
        </div>
      )}

      {!paperId && !result && !loading && (
        <div style={{textAlign:'center',padding:'40px 20px',color:'var(--text3)'}}>
          <div style={{fontSize:32,marginBottom:10}}>🔬</div>
          <div style={{fontWeight:600,color:'var(--text2)',marginBottom:4}}>No paper loaded</div>
          <div style={{fontSize:13}}>Upload a paper to query it.</div>
        </div>
      )}
    </div>
  )
}

function ChunkBlock({ chunk, index }) {
  const [expanded, setExpanded] = useState(false)
  const sectionColors = {
    abstract:'var(--accent)', methods:'var(--teal)', results:'var(--green)',
    discussion:'var(--indigo)', adverse:'var(--red)', statistics:'var(--orange)',
    conclusion:'var(--yellow)',
  }
  const sc = sectionColors[chunk.section] || 'var(--text3)'
  return (
    <div className="chunk-block" style={{borderLeftColor:sc}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
        <span className="badge badge-blue">#{index+1}</span>
        {chunk.section && (
          <span className="badge" style={{background:`${sc}22`,color:sc,border:`1px solid ${sc}44`,textTransform:'uppercase',letterSpacing:'0.05em'}}>
            {chunk.section}
          </span>
        )}
        {chunk.page && <span style={{fontSize:11,color:'var(--text3)'}}>p.{chunk.page}</span>}
        <button style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:'var(--text3)',fontSize:11}}
          onClick={()=>setExpanded(!expanded)}>
          {expanded?'collapse':'expand'}
        </button>
      </div>
      <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.65,margin:0,
        overflow:expanded?'visible':'hidden',
        display:expanded?'block':'-webkit-box',
        WebkitLineClamp:expanded?'unset':3,
        WebkitBoxOrient:'vertical'}}>
        {chunk.text}
      </p>
    </div>
  )
}
