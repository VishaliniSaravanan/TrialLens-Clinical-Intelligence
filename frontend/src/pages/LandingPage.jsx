import { useState, useEffect } from 'react'
import { ArrowRight, Shield, Zap, BarChart2, Search, Network, GitCompare, Upload, Star, ChevronDown } from 'lucide-react'

const SAMPLE_PAPERS = [
  {
    id: 'NCT-2024-CARDIO-001',
    title: 'Efficacy of Sacubitril/Valsartan in Heart Failure with Reduced Ejection Fraction',
    disease: 'Cardiology',
    rating: 'A',
    score: 91,
    design: 'Double-Blind RCT',
    n: 4822,
    year: 2024,
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1409077',
    pvalue: 0.001,
    summary: 'Landmark PARADIGM-HF trial demonstrating 20% relative risk reduction in CV death/HF hospitalization.',
  },
  {
    id: 'NCT-2023-ONCO-047',
    title: 'Pembrolizumab plus Chemotherapy for Metastatic Non-Small Cell Lung Cancer',
    disease: 'Oncology',
    rating: 'A',
    score: 88,
    design: 'Phase III Trial',
    n: 1274,
    year: 2023,
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1905234',
    pvalue: 0.0001,
    summary: 'KEYNOTE-189 showing PD-1 blockade + chemo improves OS in metastatic NSCLC regardless of PD-L1 expression.',
  },
  {
    id: 'NCT-2023-NEURO-012',
    title: 'Lecanemab in Early Alzheimer\'s Disease: CLARITY AD Trial',
    disease: 'Neurology',
    rating: 'B',
    score: 79,
    design: 'Double-Blind RCT',
    n: 1795,
    year: 2023,
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2212948',
    pvalue: 0.045,
    summary: 'Anti-amyloid antibody reducing clinical decline by 27% in early Alzheimer\'s; ARIA adverse events noted.',
  },
  {
    id: 'NCT-2022-ENDO-033',
    title: 'Semaglutide 2.4 mg for Chronic Weight Management (STEP 1 Trial)',
    disease: 'Endocrinology',
    rating: 'A',
    score: 93,
    design: 'Double-Blind RCT',
    n: 1961,
    year: 2022,
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2032183',
    pvalue: 0.0001,
    summary: 'GLP-1 agonist achieving 14.9% mean weight reduction vs 2.4% placebo over 68 weeks.',
  },
  {
    id: 'NCT-2024-INFECT-019',
    title: 'mRNA-1273 Vaccine Efficacy Against COVID-19 (COVE Trial)',
    disease: 'Infectious Disease',
    rating: 'A',
    score: 96,
    design: 'Phase III Trial',
    n: 30420,
    year: 2024,
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2035389',
    pvalue: 0.0001,
    summary: '94.1% efficacy against symptomatic COVID-19; robust immunogenicity across all age groups.',
  },
  {
    id: 'NCT-2023-RHEUMA-008',
    title: 'Upadacitinib vs Adalimumab in Active Rheumatoid Arthritis (SELECT-COMPARE)',
    disease: 'Rheumatology',
    rating: 'A',
    score: 85,
    design: 'Double-Blind RCT',
    n: 1629,
    year: 2023,
    url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(19)61213-1/fulltext',
    pvalue: 0.003,
    summary: 'JAK1-selective inhibitor demonstrating superior ACR50 response vs adalimumab at 12 weeks.',
  },
]

const FEATURES = [
  { icon: BarChart2, title: 'Trial Metrics Engine', desc: 'Extract 20+ clinical metrics automatically — p-values, hazard ratios, CIs, effect sizes from any PDF upload.' },
  { icon: Search, title: 'Semantic RAG Query', desc: 'Ask natural language questions. Our HyperRAG searches across sections with graph-expanded context retrieval.' },
  { icon: Shield, title: 'Abstract Inflation Detector', desc: 'AI pattern-matches abstract claims vs. actual results to flag contradictions and vague marketing language.' },
  { icon: GitCompare, title: 'Disease Benchmarking', desc: 'Compare your trial against disease-area norms across sample size, efficacy, adverse rates and p-values.' },
  { icon: Network, title: 'Knowledge Graph', desc: 'Visualize discourse relationships between claims, evidence, and contradictions in an interactive force graph.' },
  { icon: Zap, title: 'Evidence Quality Scoring', desc: 'Automated Level 1a–4 evidence grading with A–D ratings using Oxford CEBM methodology.' },
]

const ratingColor = r => r === 'A' ? '#22d3ee' : r === 'B' ? '#34d399' : r === 'C' ? '#fb923c' : '#f87171'
const diseaseColor = d => ({
  Cardiology:'#f43f5e', Oncology:'#a78bfa', Neurology:'#60a5fa',
  Endocrinology:'#34d399', 'Infectious Disease':'#fbbf24', Rheumatology:'#fb7185'
}[d] || '#94a3b8')

export default function LandingPage({ onEnterApp }) {
  const [hovered, setHovered] = useState(null)
  const [added, setAdded] = useState([])
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const addPaper = (paper) => {
    setAdded(prev => prev.includes(paper.id) ? prev : [...prev, paper.id])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7ff', fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", color: '#0f2744' }}>
      
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(240,247,255,0.88)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
          }}>
            <span style={{ fontSize: 18 }}>🔬</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px', color: '#0369a1' }}>TrialLens</span>
          <span style={{ fontSize: 11, background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: 99, fontWeight: 700, marginLeft: 4 }}>BETA</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onEnterApp} style={{
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 24px', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
            transition: 'all 0.2s',
          }}>
            Launch App <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 130, paddingBottom: 80, textAlign: 'center', position: 'relative', overflow: 'hidden', padding: '130px 40px 100px' }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', top: -200, left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)', bottom: 0, right: '10%' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', top: 100, left: '5%' }} />
        </div>

        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 24, color: '#0c1f3f' }}>
            Clinical Trial Intelligence<br />
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Powered by AI
            </span>
          </h1>
          <p style={{ fontSize: 20, color: '#475569', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.6, fontWeight: 400 }}>
            Upload any clinical trial PDF. Get instant metrics extraction, abstract inflation detection, knowledge graphs, and disease-area benchmarking — all in one platform.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onEnterApp} style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: '#fff', border: 'none', borderRadius: 14, padding: '16px 36px',
              fontWeight: 800, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 8px 30px rgba(14,165,233,0.4)',
              transition: 'all 0.2s', letterSpacing: '-0.3px',
            }}>
              <Upload size={18} /> Upload Papers to Start
            </button>
            <button onClick={() => document.getElementById('library').scrollIntoView({ behavior: 'smooth' })} style={{
              background: 'rgba(14,165,233,0.08)', color: '#0369a1',
              border: '1.5px solid rgba(14,165,233,0.25)', borderRadius: 14,
              padding: '16px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Browse Library <ChevronDown size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {[['6+', 'Disease Areas'], ['20+', 'Auto-extracted Metrics'], ['Real-time', 'Inflation Detection'], ['Graph-based', 'Semantic Search']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#0369a1', letterSpacing: '-0.5px' }}>{v}</div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1.5px', color: '#0c1f3f', marginBottom: 12 }}>Everything You Need to Win</h2>
          <p style={{ fontSize: 17, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>Six powerful modules working together to give you the deepest clinical trial analysis available.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{
              background: hovered === i ? 'rgba(14,165,233,0.06)' : '#fff',
              border: hovered === i ? '1.5px solid rgba(14,165,233,0.35)' : '1.5px solid rgba(203,213,225,0.7)',
              borderRadius: 18, padding: '28px 28px 24px',
              transition: 'all 0.2s', cursor: 'default',
              boxShadow: hovered === i ? '0 8px 30px rgba(14,165,233,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(6,182,212,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '1px solid rgba(14,165,233,0.2)' }}>
                <Icon size={20} style={{ color: '#0ea5e9' }} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', marginBottom: 8, color: '#0c1f3f' }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Paper Library */}
      <section id="library" style={{ padding: '80px 40px', background: 'linear-gradient(180deg, #f0f7ff 0%, #e8f4fd 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1.5px', color: '#0c1f3f', marginBottom: 8 }}>📚 Sample Paper Library</h2>
              <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>Add landmark clinical trials to your analysis workspace — or upload your own PDFs.</p>
            </div>
            {added.length > 0 && (
              <button onClick={onEnterApp} style={{
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff',
                border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700,
                fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
              }}>
                Analyze {added.length} Paper{added.length > 1 ? 's' : ''} <ArrowRight size={14} />
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {SAMPLE_PAPERS.map((paper) => {
              const isAdded = added.includes(paper.id)
              const dc = diseaseColor(paper.disease)
              return (
                <div key={paper.id} style={{
                  background: '#fff', borderRadius: 18,
                  border: isAdded ? `2px solid ${dc}` : '1.5px solid rgba(203,213,225,0.7)',
                  padding: '22px 22px 18px',
                  boxShadow: isAdded ? `0 4px 20px ${dc}22` : '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{ background: `${dc}18`, color: dc, borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 700, border: `1px solid ${dc}33` }}>{paper.disease}</span>
                        <span style={{ background: `${ratingColor(paper.rating)}15`, color: ratingColor(paper.rating), borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 700, border: `1px solid ${ratingColor(paper.rating)}33` }}>Rating {paper.rating}</span>
                        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 99, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{paper.year}</span>
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0c1f3f', lineHeight: 1.4, margin: 0 }}>{paper.title}</h3>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'center', background: `${ratingColor(paper.rating)}12`, borderRadius: 12, padding: '8px 12px', border: `1px solid ${ratingColor(paper.rating)}25` }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: ratingColor(paper.rating), lineHeight: 1, fontFamily: 'monospace' }}>{paper.score}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>SCORE</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55, margin: 0 }}>{paper.summary}</p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                    {[['n', paper.n.toLocaleString()], ['Design', paper.design.split(' ').slice(0,2).join(' ')], ['p', paper.pvalue]].map(([k, v]) => (
                      <span key={k} style={{ color: '#64748b' }}><span style={{ fontWeight: 700, color: '#0369a1', fontFamily: 'monospace' }}>{k}=</span>{v}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button onClick={() => { addPaper(paper); }} style={{
                      flex: 1, background: isAdded ? `${dc}15` : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      color: isAdded ? dc : '#fff',
                      border: isAdded ? `1.5px solid ${dc}40` : 'none',
                      borderRadius: 10, padding: '10px 16px', fontWeight: 700, fontSize: 13,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      {isAdded ? '✓ Added to Library' : '+ Add to Library'}
                    </button>
                    <a href={paper.url} target="_blank" rel="noreferrer" style={{
                      background: '#f1f5f9', color: '#0369a1', border: '1.5px solid #e2e8f0',
                      borderRadius: 10, padding: '10px 14px', fontWeight: 700, fontSize: 13,
                      textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      PDF ↗
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* URL Import section */}
      <section style={{ padding: '80px 40px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 12, color: '#0c1f3f' }}>Import via URL</h2>
        <p style={{ color: '#64748b', fontSize: 16, marginBottom: 32 }}>Paste any PubMed, NEJM, or arXiv URL and we'll fetch and analyze the paper automatically inside the app.</p>
        <button onClick={onEnterApp} style={{
          background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', color: '#fff',
          border: 'none', borderRadius: 14, padding: '16px 40px', fontWeight: 800,
          fontSize: 16, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 30px rgba(14,165,233,0.35)', letterSpacing: '-0.3px',
        }}>
          Open Full App <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(203,213,225,0.5)', padding: '24px 40px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
        TrialLens · Clinical Trial Intelligence Platform · Built for Researchers & Hackathon Champions
      </footer>
    </div>
  )
}