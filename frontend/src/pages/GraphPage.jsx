// ── GraphPage.jsx ─────────────────────────────────────────────────────────────
// Save as src/pages/GraphPage.jsx

import { useState, useEffect, useRef } from 'react'
import { Network, RefreshCw, Loader2 } from 'lucide-react'
import { getInflation } from '../utils/api'

const SECTION_COLORS = {
  abstract:'#38bdf8', methods:'#2dd4bf', results:'#4ade80',
  discussion:'#818cf8', adverse:'#f87171', statistics:'#fb923c',
  conclusion:'#facc15', general:'#94a3b8', introduction:'#e879f9',
}

function ForceGraph({ nodes, edges, colorFn, height=360, onNodeClick }) {
  const canvasRef = useRef()
  const simRef    = useRef({ nodes:[], edges:[], running:true })

  useEffect(() => {
    if (!nodes?.length) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.offsetWidth || 700, H = height
    canvas.width = W; canvas.height = H

    const simNodes = nodes.map(n => ({
      ...n, x: W/2+(Math.random()-.5)*W*.6, y: H/2+(Math.random()-.5)*H*.6, vx:0, vy:0
    }))
    const nodeMap = Object.fromEntries(simNodes.map(n => [n.id, n]))
    simRef.current = { nodes: simNodes, edges, running: true }

    let frame=0, raf
    const tick = () => {
      const ns = simRef.current.nodes, es = simRef.current.edges
      if (frame < 280) {
        for (let i=0;i<ns.length;i++) for (let j=i+1;j<ns.length;j++) {
          const dx=ns[j].x-ns[i].x, dy=ns[j].y-ns[i].y, d=Math.sqrt(dx*dx+dy*dy)+1
          const f=Math.min(500,800/(d*d))
          ns[i].vx-=f*dx/d; ns[i].vy-=f*dy/d; ns[j].vx+=f*dx/d; ns[j].vy+=f*dy/d
        }
        for (const e of es) {
          const a=nodeMap[e.source],b=nodeMap[e.target]; if(!a||!b) continue
          const dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy)+1,f=(d-85)*.016
          a.vx+=f*dx/d;a.vy+=f*dy/d;b.vx-=f*dx/d;b.vy-=f*dy/d
        }
        for (const n of ns) {
          n.vx+=(W/2-n.x)*.004; n.vy+=(H/2-n.y)*.004
          n.vx*=.84; n.vy*=.84
          n.x=Math.max(16,Math.min(W-16,n.x+n.vx))
          n.y=Math.max(16,Math.min(H-16,n.y+n.vy))
        }
        frame++
      }
      ctx.clearRect(0,0,W,H)
      ctx.fillStyle='rgba(8,14,28,0.65)'; ctx.fillRect(0,0,W,H)
      for (const e of es) {
        const a=nodeMap[e.source],b=nodeMap[e.target]; if(!a||!b) continue
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y)
        ctx.strokeStyle=e.relation==='contradicts'?'#f87171':e.relation==='supports'?'#4ade80':'rgba(99,179,237,0.2)'
        ctx.lineWidth=1.2; ctx.stroke()
      }
      for (const n of ns) {
        const color=colorFn?colorFn(n):'#38bdf8'
        ctx.beginPath(); ctx.arc(n.x,n.y,5,0,Math.PI*2)
        ctx.fillStyle=color; ctx.fill()
        ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1.5; ctx.stroke()
        if (ns.length < 35) {
          ctx.fillStyle='rgba(232,244,248,0.6)'; ctx.font='10px Noto Sans'
          ctx.fillText((n.label||'').slice(0,18), n.x+8, n.y+4)
        }
      }
      if (simRef.current.running) raf=requestAnimationFrame(tick)
    }
    raf=requestAnimationFrame(tick)
    const handleClick = (evt) => {
      if (!onNodeClick) return
      const rect=canvas.getBoundingClientRect(), x=evt.clientX-rect.left, y=evt.clientY-rect.top
      let closest=null, best=Infinity
      for (const n of simRef.current.nodes) {
        const d=(n.x-x)**2+(n.y-y)**2
        if (d<best){best=d;closest=n}
      }
      if (closest && best<=18*18) onNodeClick(closest)
    }
    canvas.addEventListener('click',handleClick)
    return () => { simRef.current.running=false; cancelAnimationFrame(raf); canvas.removeEventListener('click',handleClick) }
  }, [nodes,edges])

  return <canvas ref={canvasRef} className="graph-canvas" style={{height,display:'block'}}/>
}

export default function GraphPage({ paperId }) {
  const [data,         setData]         = useState(null)
  const [loading,      setLoading]      = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)

  const load = async () => {
    if (!paperId) return
    setLoading(true)
    try { setData(await getInflation(paperId)) }
    catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (paperId) load() }, [paperId])

  if (!paperId) return (
    <div style={{textAlign:'center',padding:'40px 20px',color:'var(--text3)'}}>
      <div style={{fontSize:32,marginBottom:10}}>🕸</div>
      <div style={{fontWeight:600,color:'var(--text2)',marginBottom:4}}>No paper loaded</div>
      <div style={{fontSize:13}}>Upload a paper to view its knowledge graph.</div>
    </div>
  )

  const colorFn = (n) =>
    n.type==='claim'    ? '#38bdf8' :
    n.type==='evidence' ? '#4ade80' :
    n.type==='vague'    ? '#fb923c' : '#94a3b8'

  return (
    <div className="fade-up" style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="card">
        <div className="card-header">
          <Network size={14} style={{color:'var(--accent)'}}/>
          <span style={{fontWeight:600}}>Discourse Knowledge Graph</span>
          <button className="btn btn-secondary" style={{marginLeft:'auto',padding:'4px 10px',fontSize:11}} onClick={load}>
            <RefreshCw size={11} className={loading?'spin':''}/> Refresh
          </button>
        </div>
        <div className="card-body">
          {/* Legend */}
          <div style={{display:'flex',gap:12,marginBottom:12,fontSize:11,flexWrap:'wrap'}}>
            {[['#38bdf8','Claim'],['#4ade80','Supporting Evidence'],['#fb923c','Vague'],
              ['#f87171','Contradiction edge'],['#4ade80','Support edge']].map(([c,l])=>(
              <span key={l} style={{display:'flex',alignItems:'center',gap:4,color:'var(--text3)'}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:c,display:'inline-block'}}/>
                {l}
              </span>
            ))}
          </div>
          {data && (
            <div style={{display:'flex',gap:16,marginBottom:10,fontSize:12,color:'var(--text2)'}}>
              <span><strong className="mono">{data.nodes?.length||0}</strong> nodes</span>
              <span><strong className="mono">{data.edges?.length||0}</strong> edges</span>
              <span><strong className="mono">{data.contradictions?.length||0}</strong> contradictions</span>
            </div>
          )}
          {loading ? (
            <div style={{height:360,display:'flex',alignItems:'center',justifyContent:'center',gap:10,color:'var(--text3)',background:'rgba(8,14,28,0.65)',borderRadius:8}}>
              <Loader2 size={16} className="spin"/> Building graph…
            </div>
          ) : data?.nodes?.length ? (
            <>
              <ForceGraph
                nodes={data.nodes.map(n=>({id:n.id,label:n.label,type:n.type}))}
                edges={data.edges.map(e=>({source:e.source,target:e.target,relation:e.relation}))}
                colorFn={colorFn} height={360} onNodeClick={setSelectedNode}
              />
              {selectedNode && (
                <div style={{marginTop:10,padding:'8px 12px',background:'var(--surface2)',borderRadius:8,fontSize:12}}>
                  <div style={{fontWeight:600,marginBottom:4,color:colorFn(selectedNode)}}>
                    {selectedNode.type?.toUpperCase()} NODE
                  </div>
                  <div style={{color:'var(--text2)',lineHeight:1.6}}>{selectedNode.label}</div>
                </div>
              )}
            </>
          ) : (
            <div style={{height:360,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text3)',background:'rgba(8,14,28,0.65)',borderRadius:8}}>
              No graph data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
