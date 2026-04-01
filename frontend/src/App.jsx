import { useState, useEffect } from 'react'
import {
  Upload, BarChart2, Search, AlertTriangle, Network,
  GitCompare, Wifi, WifiOff, ChevronRight, Microscope, Home
} from 'lucide-react'
import { healthCheck } from './utils/api'
import LandingPage     from './pages/LandingPage'
import UploadPage      from './pages/UploadPage'
import MetricsPage     from './pages/MetricsPage'
import QueryPage       from './pages/QueryPage'
import InflationPage   from './pages/InflationPage'
import ComparePage     from './pages/ComparePage'
import GraphPage       from './pages/GraphPage'

const NAV = [
  { key: 'upload',    label: 'Upload Paper',       icon: Upload,        group: 'START'       },
  { key: 'metrics',   label: 'Trial Metrics',      icon: BarChart2,     group: 'ANALYSIS'    },
  { key: 'query',     label: 'Research Query',     icon: Search,        group: 'ANALYSIS'    },
  { key: 'inflation', label: 'Abstract Inflation', icon: AlertTriangle, group: 'ANALYSIS'    },
  { key: 'compare',   label: 'Benchmarking',       icon: GitCompare,    group: 'INTELLIGENCE' },
  { key: 'graph',     label: 'Knowledge Graph',    icon: Network,       group: 'INTELLIGENCE' },
]

export default function App() {
  const [showLanding,  setShowLanding]  = useState(true)
  const [page,         setPage]         = useState('upload')
  const [analysisData, setAnalysisData] = useState(null)
  const [backend,      setBackend]      = useState(null)

  useEffect(() => {
    healthCheck().then(() => setBackend(true)).catch(() => setBackend(false))
  }, [])

  const handleAnalyzed = (result) => {
    setAnalysisData(result)
    setPage('metrics')
  }

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />
  }

  const paperId = analysisData?.paper_id
  const groups  = [...new Set(NAV.map(n => n.group))]

  const renderPage = () => {
    switch (page) {
      case 'upload':    return <UploadPage onAnalyzed={handleAnalyzed} />
      case 'metrics':   return <MetricsPage data={analysisData} />
      case 'query':     return <QueryPage paperId={paperId} />
      case 'inflation': return <InflationPage data={analysisData} paperId={paperId} />
      case 'compare':   return <ComparePage data={analysisData} paperId={paperId} />
      case 'graph':     return <GraphPage paperId={paperId} />
      default:          return null
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f7ff', fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      
      {/* Sidebar */}
      <div style={{
        width: 248, minWidth: 248, background: 'rgba(255,255,255,0.92)',
        borderRight: '1px solid rgba(14,165,233,0.12)',
        height: '100vh', overflowY: 'auto', position: 'sticky', top: 0,
        backdropFilter: 'blur(18px)', display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(14,165,233,0.06)',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(14,165,233,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(14,165,233,0.35)',
            }}>
              <Microscope size={18} style={{ color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px', color: '#0c1f3f' }}>TrialLens</div>
              <div style={{ fontSize: 10, color: '#0ea5e9', fontWeight: 700, letterSpacing: '0.05em' }}>CLINICAL INTELLIGENCE</div>
            </div>
          </div>
          <button onClick={() => setShowLanding(true)} style={{
            marginTop: 12, width: '100%', background: 'rgba(14,165,233,0.06)',
            border: '1px solid rgba(14,165,233,0.15)', borderRadius: 8,
            padding: '7px 12px', fontSize: 12, fontWeight: 600, color: '#0369a1',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'inherit',
          }}>
            <Home size={12} /> Back to Home
          </button>
        </div>

        {/* Active paper */}
        {paperId && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(14,165,233,0.1)', background: 'rgba(14,165,233,0.04)' }}>
            <div style={{ fontSize: 10, color: '#0ea5e9', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Active Paper</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0c1f3f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{paperId}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {analysisData?.metrics?.disease_area} · {analysisData?.metrics?.study_design?.split('(')[0].trim()}
            </div>
            {analysisData?.metrics?.evidence_quality && (
              <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(14,165,233,0.1)', color: '#0284c7' }}>
                  Level {analysisData.metrics.evidence_quality.level} · Rating {analysisData.metrics.evidence_quality.rating}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
          {groups.map(group => (
            <div key={group} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: '#94a3b8', padding: '8px 8px 4px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                {group}
              </div>
              {NAV.filter(n => n.group === group).map(({ key, label, icon: Icon }) => {
                const isActive = page === key
                const isLocked = key !== 'upload' && !paperId
                return (
                  <button key={key} onClick={() => !isLocked && setPage(key)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                    padding: '10px 12px', borderRadius: 10, border: 'none',
                    cursor: isLocked ? 'default' : 'pointer', marginBottom: 2,
                    background: isActive ? 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(6,182,212,0.08))' : 'transparent',
                    color: isActive ? '#0284c7' : isLocked ? '#c8d8e8' : '#475569',
                    fontWeight: isActive ? 700 : 500, fontSize: 14,
                    textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                    borderLeft: isActive ? '3px solid #0ea5e9' : '3px solid transparent',
                  }}>
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{label}</span>
                    {isActive  && <ChevronRight size={12} />}
                    {isLocked  && <span style={{ fontSize: 9, color: '#c8d8e8', fontWeight: 700, fontFamily: 'monospace' }}>LOCKED</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Status */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(14,165,233,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
            {backend === null ? null : backend
              ? <><Wifi size={12} style={{ color: '#10b981' }} /><span style={{ color: '#10b981' }}>Backend Online</span></>
              : <><WifiOff size={12} style={{ color: '#f87171' }} /><span style={{ color: '#f87171' }}>Backend Offline</span></>
            }
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          height: 56, background: 'rgba(255,255,255,0.88)',
          borderBottom: '1px solid rgba(14,165,233,0.1)',
          display: 'flex', alignItems: 'center', padding: '0 28px', gap: 10, flexShrink: 0,
          position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(16px)',
          boxShadow: '0 2px 12px rgba(14,165,233,0.06)',
        }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#0c1f3f', letterSpacing: '-0.3px' }}>
            {NAV.find(n => n.key === page)?.label}
          </span>
          {paperId && page !== 'upload' && (
            <>
              <span style={{ color: '#cbd5e1', margin: '0 4px' }}>/</span>
              <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>{paperId}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 99, background: 'rgba(6,182,212,0.1)', color: '#0284c7', border: '1px solid rgba(6,182,212,0.2)', marginLeft: 4 }}>
                {analysisData?.metrics?.disease_area}
              </span>
            </>
          )}
        </div>

        <div style={{ flex: 1, padding: 28, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  )
}