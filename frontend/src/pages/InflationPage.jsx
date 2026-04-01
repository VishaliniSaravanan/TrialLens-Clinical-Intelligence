// ── InflationPage.jsx ─────────────────────────────────────────────────────────
// Save as src/pages/InflationPage.jsx

import { useState } from 'react'
import { AlertTriangle, ShieldCheck, Info, ChevronDown, ChevronUp } from 'lucide-react'

export default function InflationPage({ data, paperId }) {
  if (!paperId) return <Empty icon="⚠" title="No paper loaded" desc="Upload a paper first." />
  const inf  = data?.inflation || {}
  const contradictions = inf.contradictions || []
  const vague = inf.vague_claims || []
  const score = inf.inflation_score || 0
  const level = inf.inflation_level || 'LOW'
  const scoreColor = level === 'HIGH' ? 'var(--red)' : level === 'MEDIUM' ? 'var(--orange)' : 'var(--green)'

  return (
    <div className="fade-up" style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Summary */}
      <div className="card">
        <div className="card-header">
          <AlertTriangle size={15} style={{ color: scoreColor }} />
          <span style={{ fontWeight:600 }}>Abstract Inflation Analysis</span>
          <span className={`badge ${level==='HIGH'?'badge-red':level==='MEDIUM'?'badge-orange':'badge-green'}`} style={{ marginLeft:'auto' }}>
            {level} INFLATION
          </span>
        </div>
        <div className="card-body">
          <div style={{ display:'flex', gap:24, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ color:'var(--text2)' }}>Inflation Score</span>
                <span className="mono" style={{ fontWeight:700, color:scoreColor }}>{score}/100</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${score}%`, background:scoreColor }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text3)', marginTop:4 }}>
                <span>Accurate</span><span>Moderate</span><span>Inflated</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { label:'Contradictions', value:contradictions.length, color:contradictions.length>0?'var(--red)':'var(--green)' },
                { label:'Vague Claims',   value:vague.length,          color:vague.length>2?'var(--orange)':'var(--green)' },
                { label:'Total Claims',   value:inf.claim_count||0,    color:'var(--accent)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign:'center', padding:'10px 14px', background:'var(--surface2)', borderRadius:8 }}>
                  <div className="mono" style={{ fontSize:22, fontWeight:700, color }}>{value}</div>
                  <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contradictions */}
      <div className="card">
        <div className="card-header">
          <AlertTriangle size={14} style={{ color:'var(--red)' }} />
          <span style={{ fontWeight:600 }}>Abstract vs Results Contradictions</span>
          <span className="badge badge-red" style={{ marginLeft:'auto' }}>{contradictions.length}</span>
        </div>
        <div className="card-body">
          {contradictions.length === 0 ? (
            <div style={{ display:'flex', gap:10, alignItems:'center', color:'var(--green)', padding:8 }}>
              <ShieldCheck size={18} />
              <span style={{ fontWeight:500 }}>No abstract-results contradictions detected</span>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {contradictions.map((c, i) => <ContraBlock key={i} c={c} index={i} />)}
            </div>
          )}
        </div>
      </div>

      {/* Vague claims */}
      <div className="card">
        <div className="card-header">
          <Info size={14} style={{ color:'var(--orange)' }} />
          <span style={{ fontWeight:600 }}>Vague / Marketing Language</span>
          <span className="badge badge-orange" style={{ marginLeft:'auto' }}>{vague.length}</span>
        </div>
        <div className="card-body">
          {vague.length === 0
            ? <div style={{ color:'var(--text3)', fontSize:13 }}>No vague claims detected.</div>
            : vague.map((v, i) => (
              <div key={i} className="vague-block">
                <span className="mono" style={{ color:'var(--orange)', marginRight:8, fontSize:11 }}>#{i+1}</span>
                <span style={{ fontSize:13, color:'var(--text2)' }}>{v}</span>
              </div>
            ))
          }
        </div>
      </div>

      <div className="alert alert-info" style={{ fontSize:12 }}>
        <Info size={14} style={{ flexShrink:0 }} />
        <div>
          <strong>Methodology:</strong> Abstract claims are matched against results/discussion sentences using
          clinical contradiction patterns. Detected when abstract uses strong positive language
          (significant improvement, safe and effective) but results show non-significance, adverse events,
          or call for further studies.
        </div>
      </div>
    </div>
  )
}

function ContraBlock({ c, index }) {
  const [open, setOpen] = useState(false)
  const sc = c.severity === 'high' ? 'var(--red)' : 'var(--orange)'
  return (
    <div className="inflation-block">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }} onClick={() => setOpen(!open)}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span className="badge badge-red">#{index+1}</span>
          <span className="badge" style={{ background:'transparent', border:`1px solid ${sc}`, color:sc }}>
            {c.severity?.toUpperCase()} SEVERITY
          </span>
          <span style={{ fontSize:12, color:'var(--text2)' }}>{c.claim?.slice(0, 70)}…</span>
        </div>
        {open ? <ChevronUp size={14} style={{ color:'var(--text3)' }}/> : <ChevronDown size={14} style={{ color:'var(--text3)' }}/>}
      </div>
      {open && (
        <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ padding:'10px 12px', background:'rgba(56,189,248,0.08)', border:'1px solid rgba(56,189,248,0.2)', borderRadius:6 }}>
            <div className="label" style={{ color:'var(--accent)', marginBottom:4 }}>Abstract Claim</div>
            <p style={{ fontSize:13, margin:0, color:'var(--text2)' }}>{c.claim}</p>
          </div>
          <div style={{ padding:'10px 12px', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:6 }}>
            <div className="label" style={{ color:'var(--red)', marginBottom:4 }}>Contradicting Evidence</div>
            <p style={{ fontSize:13, margin:0, color:'var(--text2)' }}>{c.evidence}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Empty({ icon, title, desc }) {
  return (
    <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--text3)' }}>
      <div style={{ fontSize:32, marginBottom:10 }}>{icon}</div>
      <div style={{ fontWeight:600, color:'var(--text2)', marginBottom:4 }}>{title}</div>
      {desc && <div style={{ fontSize:13 }}>{desc}</div>}
    </div>
  )
}
