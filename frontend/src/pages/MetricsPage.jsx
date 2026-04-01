import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
         BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const TT = {
  contentStyle: {
    background: '#fff', border: '1.5px solid rgba(14,165,233,0.2)',
    borderRadius: 10, fontSize: 13, fontFamily: 'Plus Jakarta Sans',
    color: '#0c1f3f', boxShadow: '0 4px 20px rgba(14,165,233,0.12)',
  }
}

function MetricBlock({ label, value, unit, color, highlight }) {
  const isNA = value === null || value === undefined
  return (
    <div className="metric-block" style={{ border: highlight ? `1.5px solid ${color || 'var(--accent)'}` : undefined, boxShadow: highlight ? `0 4px 16px ${color || 'var(--accent)'}22` : undefined }}>
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{ color: isNA ? 'var(--text4)' : (color || 'var(--text)') }}>
        {isNA ? '—' : value}
        {!isNA && unit && <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text4)', marginLeft: 4 }}>{unit}</span>}
      </div>
    </div>
  )
}

function EvidenceRing({ score, size = 110 }) {
  const r = size * 0.38; const circ = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, score))
  const offset = circ - (pct/100)*circ
  const color = pct >= 80 ? '#10b981' : pct >= 65 ? '#0ea5e9' : pct >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ position:'relative', width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ position:'absolute', inset:0, transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(203,213,225,0.5)" strokeWidth={size*0.08}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.08}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 1.2s ease' }}/>
      </svg>
      <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ fontFamily:'DM Mono,monospace', fontSize:size*0.22, fontWeight:900, color, lineHeight:1 }}>{pct}</div>
        <div style={{ fontSize:size*0.1, color:'var(--text4)', marginTop:1, fontWeight:600 }}>/100</div>
      </div>
    </div>
  )
}

export default function MetricsPage({ data }) {
  if (!data) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color:'var(--text3)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔬</div>
        <div style={{ fontWeight:800, color:'var(--text)', marginBottom:8, fontSize:22, letterSpacing:'-0.5px' }}>No paper analyzed yet</div>
        <div style={{ fontSize:15, color:'var(--text3)' }}>Upload a clinical trial paper to see metrics.</div>
      </div>
    </div>
  )

  const m   = data.metrics || {}
  const eq  = m.evidence_quality || {}
  const inf = data.inflation || {}

  const ratingColor = eq.rating === 'A' ? '#10b981' : eq.rating === 'B' ? '#0ea5e9' :
                      eq.rating === 'C' ? '#f59e0b' : '#ef4444'

  const pvalues = (m.all_pvalues || []).map((p, i) => ({ name: `p${i+1}`, value: p }))

  const radarData = [
    { subject:'Sample Size',   A: Math.min(100, ((m.sample_size||0)/20)) },
    { subject:'Evidence Lvl',  A: eq.score||50 },
    { subject:'Efficacy',      A: m.efficacy_rate||0 },
    { subject:'Safety',        A: m.adverse_event_rate ? Math.max(0,100-m.adverse_event_rate) : 50 },
    { subject:'Transparency',  A: [m.primary_endpoint,m.confidence_interval,m.adverse_event_rate].filter(Boolean).length*33 },
    { subject:'Reliability',   A: inf.inflation_score ? Math.max(0,100-inf.inflation_score) : 70 },
  ]

  return (
    <div className="fade-up" style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Header card */}
      <div className="card">
        <div className="card-body">
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
            <div>
              <div style={{ fontSize:24, fontWeight:900, fontFamily:'Instrument Serif, serif', letterSpacing:'-0.5px', marginBottom:8, color:'var(--text)' }}>
                {data.paper_id}
              </div>
              <div style={{ color:'var(--text3)', fontSize:15, marginBottom:14 }}>
                {m.disease_area} · {m.study_design} · {data.page_count} pages · {data.chunk_count} chunks
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span className="badge" style={{ background:`${ratingColor}15`, color:ratingColor, border:`1.5px solid ${ratingColor}33`, fontSize:13, padding:'4px 12px' }}>
                  Rating {eq.rating||'—'}
                </span>
                <span className="badge badge-teal" style={{ fontSize:13 }}>Level {eq.level||'—'} Evidence</span>
                <span className="badge badge-blue" style={{ fontSize:13 }}>{m.blinding||'Blinding unknown'}</span>
                {m.drug_name && <span className="badge badge-indigo" style={{ fontSize:13 }}>{m.drug_name}</span>}
              </div>
            </div>
            <EvidenceRing score={eq.score||50} size={110} />
          </div>
          {eq.label && (
            <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(14,165,233,0.05)', borderRadius:10, fontSize:14, color:'var(--text2)', border:'1px solid rgba(14,165,233,0.12)' }}>
              <strong style={{ color:'var(--accent2)' }}>Evidence Level:</strong>{' '}
              {eq.label} — {eq.level} ({eq.score}/100)
            </div>
          )}
        </div>
      </div>

      {/* Study design */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:12 }}>
        <MetricBlock label="Study Design"   value={m.study_design?.split('(')[0]?.trim()} color="var(--accent2)" />
        <MetricBlock label="Sample Size (n)" value={m.sample_size?.toLocaleString()}       color="var(--teal)"   />
        <MetricBlock label="Blinding"        value={m.blinding} />
        <MetricBlock label="Follow-up"       value={m.follow_up_duration} />
        <MetricBlock label="Disease Area"    value={m.disease_area}  color="var(--indigo)" />
        <MetricBlock label="Comparator"      value={m.comparator} />
      </div>

      {/* Statistical results */}
      <div>
        <div className="label" style={{ marginBottom:12, fontSize:12 }}>Statistical Results</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:12 }}>
          <MetricBlock label="Primary p-value" value={m.primary_pvalue!=null?m.primary_pvalue.toFixed(4):null}
            color={m.primary_pvalue<0.05?'var(--green)':'var(--red)'} highlight={m.primary_pvalue!=null} />
          <MetricBlock label="95% CI"       value={m.confidence_interval} color="var(--accent2)" />
          <MetricBlock label="Hazard Ratio"  value={m.hazard_ratio?.toFixed(3)}  color="var(--teal)"   />
          <MetricBlock label="Odds Ratio"    value={m.odds_ratio?.toFixed(3)}    color="var(--indigo)" />
          <MetricBlock label="Relative Risk" value={m.relative_risk?.toFixed(3)} />
          <MetricBlock label="Effect Size"   value={m.effect_size?.toFixed(3)}   />
        </div>
      </div>

      {/* Efficacy & Safety */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div>
          <div className="label" style={{ marginBottom:12, fontSize:12 }}>Efficacy</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <MetricBlock label="Overall Efficacy Rate" value={m.efficacy_rate} unit="%"
              color="var(--green)" highlight={m.efficacy_rate!=null} />
            {m.primary_endpoint && (
              <div className="metric-block">
                <div className="metric-label">Primary Endpoint</div>
                <div style={{ fontSize:14, color:'var(--text2)', marginTop:6, lineHeight:1.55 }}>
                  {m.primary_endpoint.slice(0,120)}{m.primary_endpoint?.length>120?'…':''}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="label" style={{ marginBottom:12, fontSize:12 }}>Safety Profile</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <MetricBlock label="Adverse Event Rate" value={m.adverse_event_rate} unit="%"
              color={m.adverse_event_rate>60?'var(--red)':m.adverse_event_rate>30?'var(--orange)':'var(--green)'} />
            <MetricBlock label="Serious Adverse Events" value={m.serious_adverse_rate} unit="%"
              color={m.serious_adverse_rate>15?'var(--red)':'var(--orange)'} />
            <MetricBlock label="Discontinuation Rate" value={m.discontinuation_rate} unit="%" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card">
          <div className="card-header"><span className="label" style={{ fontSize:12 }}>Trial Quality Radar</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(14,165,233,0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize:12, fill:'#64748b', fontWeight:600 }} />
                <Radar dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.10} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="label" style={{ fontSize:12 }}>Reported p-values</span></div>
          <div className="card-body">
            {pvalues.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={pvalues} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(203,213,225,0.5)" />
                    <XAxis dataKey="name" tick={{ fontSize:12, fill:'#64748b', fontWeight:600 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0,0.1]} tick={{ fontSize:11, fill:'#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip {...TT} formatter={v=>[v.toFixed(4),'p-value']} />
                    <Bar dataKey="value" radius={[6,6,0,0]} fill="#0ea5e9"
                      label={({ x, y, value }) => (
                        <text x={x} y={y-5} fill={value<0.05?'#10b981':'#ef4444'}
                          fontSize={11} textAnchor="middle" fontWeight={700}>{value<0.05?'✓':'✗'}</text>
                      )}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display:'flex', gap:14, fontSize:12, marginTop:8, fontWeight:600 }}>
                  <span style={{ color:'var(--green)' }}>✓ p &lt; 0.05 significant</span>
                  <span style={{ color:'var(--red)' }}>✗ p ≥ 0.05 non-significant</span>
                </div>
              </>
            ) : (
              <div style={{ height:160, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text3)', fontSize:14 }}>
                No p-values extracted
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inflation summary */}
      {inf.inflation_score > 0 && (
        <div className="card" style={{ borderLeft:`3px solid ${inf.inflation_level==='HIGH'?'var(--red)':inf.inflation_level==='MEDIUM'?'var(--orange)':'var(--green)'}` }}>
          <div className="card-body" style={{ display:'flex', gap:20, alignItems:'center' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:6, color:'var(--text)' }}>Abstract Inflation Score</div>
              <div style={{ fontSize:14, color:'var(--text2)', lineHeight:1.55 }}>
                {inf.contradiction_count||0} contradiction(s) detected between abstract claims and actual results.
                {' '}{inf.vague_count||0} vague/marketing claims identified.
              </div>
            </div>
            <div style={{ textAlign:'center', flexShrink:0, background:`${inf.inflation_level==='HIGH'?'rgba(239,68,68,0.06)':inf.inflation_level==='MEDIUM'?'rgba(245,158,11,0.06)':'rgba(16,185,129,0.06)'}`, borderRadius:14, padding:'14px 20px', border:`1.5px solid ${inf.inflation_level==='HIGH'?'rgba(239,68,68,0.2)':inf.inflation_level==='MEDIUM'?'rgba(245,158,11,0.2)':'rgba(16,185,129,0.2)'}` }}>
              <div style={{ fontFamily:'DM Mono,monospace', fontSize:32, fontWeight:900, lineHeight:1,
                color:inf.inflation_level==='HIGH'?'var(--red)':inf.inflation_level==='MEDIUM'?'var(--orange)':'var(--green)' }}>
                {inf.inflation_score}
              </div>
              <div style={{ fontSize:11, color:'var(--text4)', fontWeight:700, letterSpacing:'0.05em', marginTop:4 }}>{inf.inflation_level} INFLATION</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}