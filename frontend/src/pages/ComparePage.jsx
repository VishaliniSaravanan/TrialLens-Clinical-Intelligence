import { useState, useEffect } from 'react'
import { getComparison } from '../utils/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'
import { Loader2 } from 'lucide-react'

const TT = { contentStyle:{background:'#0a1628',border:'1px solid #1e3a5f',borderRadius:8,fontSize:12,fontFamily:'Noto Sans'} }

export default function ComparePage({ data, paperId }) {
  const [comp, setComp] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!paperId) return
    setLoading(true)
    getComparison(paperId).then(setComp).catch(console.error).finally(() => setLoading(false))
  }, [paperId])

  if (!paperId) return <Empty />
  if (loading)  return <div style={{display:'flex',gap:10,alignItems:'center',color:'var(--text2)',padding:20}}><Loader2 size={16} className="spin"/> Loading benchmarks…</div>
  if (!comp || comp.error) return <div style={{color:'var(--text3)',padding:20}}>No comparison data available.</div>

  const bench = comp.benchmark || {}
  const comparisons = comp.comparisons || {}
  const peers = comp.peers || []
  const allPapers = comp.all_papers || []

  const compData = Object.entries(comparisons)
    .filter(([, v]) => v)
    .map(([key, v]) => ({
      name: key.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase()),
      paper: v.value, benchmark: v.benchmark, status: v.status,
    }))

  const peerData = allPapers.map(p => ({
    name: (p.paper_id||'').slice(0,20),
    score: p.evidence_score || 0,
    highlight: p.paper_id === paperId,
  }))

  return (
    <div className="fade-up" style={{display:'flex',flexDirection:'column',gap:16}}>

      {/* Header */}
      <div className="card">
        <div className="card-body">
          <div style={{fontSize:16,fontWeight:700,marginBottom:4,fontFamily:'Instrument Serif,serif'}}>
            {paperId}
          </div>
          <div style={{color:'var(--text2)',fontSize:13,marginBottom:10}}>
            Disease area: <strong>{comp.disease_area}</strong> · Benchmarked against {allPapers.length} paper(s)
          </div>
          <div style={{padding:'8px 12px',background:'var(--surface2)',borderRadius:8,fontSize:12,color:'var(--text2)'}}>
            <strong style={{color:'var(--accent)'}}>Benchmark source:</strong>{' '}
            Typical values for {comp.disease_area} trials:{' '}
            n≈{bench.typical_sample_size}, efficacy≈{bench.typical_efficacy_rate}%,
            adverse≈{bench.typical_adverse_rate}%, follow-up: {bench.median_follow_up}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="card">
        <div className="card-header"><span className="label">vs. Disease Area Benchmarks</span></div>
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead>
              <tr><th>Metric</th><th>This Paper</th><th>Area Benchmark</th><th>vs Benchmark</th><th>% Diff</th></tr>
            </thead>
            <tbody>
              {Object.entries(comparisons).filter(([,v]) => v).map(([key, v]) => (
                <tr key={key}>
                  <td style={{fontWeight:500}}>{key.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</td>
                  <td className="mono" style={{color:'var(--accent)'}}>{v.value?.toLocaleString?.() ?? v.value}</td>
                  <td className="mono" style={{color:'var(--text3)'}}>{v.benchmark?.toLocaleString?.() ?? v.benchmark}</td>
                  <td>
                    <span className={`badge ${v.status==='better'?'badge-green':'badge-red'}`}>
                      {v.status === 'better' ? '✓ Better' : '✗ Below'}
                    </span>
                  </td>
                  <td className="mono" style={{color:v.status==='better'?'var(--green)':'var(--red)'}}>
                    {v.pct_diff > 0 ? '+' : ''}{v.pct_diff}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts row */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {/* Bar comparison */}
        {compData.length > 0 && (
          <div className="card">
            <div className="card-header"><span className="label">Paper vs Benchmark</span></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={compData} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.08)" />
                  <XAxis dataKey="name" tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip {...TT} />
                  <Bar dataKey="paper"     fill="#38bdf8" name="This Paper"  radius={[3,3,0,0]} />
                  <Bar dataKey="benchmark" fill="#475569" name="Benchmark"   radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Peer scores */}
        {peerData.length > 0 && (
          <div className="card">
            <div className="card-header"><span className="label">Evidence Scores — All Papers</span></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={peerData} layout="vertical" barSize={12}>
                  <CartesianGrid horizontal={false} stroke="rgba(99,179,237,0.08)" />
                  <XAxis type="number" domain={[0,100]} tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false} width={100} />
                  <Tooltip {...TT} />
                  <Bar dataKey="score" radius={[0,3,3,0]}>
                    {peerData.map((entry, i) => (
                      <Cell key={i} fill={entry.highlight ? '#38bdf8' : '#334155'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Peers table */}
      {peers.length > 0 && (
        <div className="card">
          <div className="card-header"><span className="label">Other {comp.disease_area} Papers</span></div>
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>Paper</th><th>Design</th><th>n</th><th>Evidence Score</th><th>Inflation</th></tr></thead>
              <tbody>
                {peers.map((p,i) => (
                  <tr key={i}>
                    <td style={{fontWeight:500,maxWidth:200}}>{(p.paper_id||'').slice(0,40)}</td>
                    <td style={{fontSize:12,color:'var(--text3)'}}>{p.study_design||'—'}</td>
                    <td className="mono">{p.sample_size?.toLocaleString()||'—'}</td>
                    <td>
                      <span className={`badge rating-${(p.evidence_rating||'c').toLowerCase()}`}
                        style={{background:'transparent'}}>
                        {p.evidence_score} ({p.evidence_rating||'—'})
                      </span>
                    </td>
                    <td className="mono" style={{color:p.inflation_score>50?'var(--red)':p.inflation_score>25?'var(--orange)':'var(--green)'}}>
                      {p.inflation_score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function Empty() {
  return (
    <div style={{textAlign:'center',padding:'40px 20px',color:'var(--text3)'}}>
      <div style={{fontSize:32,marginBottom:10}}>📊</div>
      <div style={{fontWeight:600,color:'var(--text2)',marginBottom:4}}>No paper loaded</div>
      <div style={{fontSize:13}}>Upload a paper to benchmark against disease area norms.</div>
    </div>
  )
}
