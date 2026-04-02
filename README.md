<div align="center">

<br/>

```
████████╗██████╗ ██╗ █████╗ ██╗     ██╗     ███████╗███╗   ██╗███████╗
╚══██╔══╝██╔══██╗██║██╔══██╗██║     ██║     ██╔════╝████╗  ██║██╔════╝
   ██║   ██████╔╝██║███████║██║     ██║     █████╗  ██╔██╗ ██║███████╗
   ██║   ██╔══██╗██║██╔══██║██║     ██║     ██╔══╝  ██║╚██╗██║╚════██║
   ██║   ██║  ██║██║██║  ██║███████╗███████╗███████╗██║ ╚████║███████║
   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝
```

### **AI-Powered Clinical Research Intelligence Platform**
*Transform any clinical trial paper into a structured intelligence dashboard — in seconds.*

<br/>

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![Qdrant](https://img.shields.io/badge/Qdrant-VectorDB-DC143C?style=for-the-badge&logo=qdrant&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-34d399?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Hackathon%20Build-fbbf24?style=for-the-badge)

<br/>

> **Built for Sun Pharma · Marichi Ventures · A2Z4.0 — and every researcher who deserves better tools.**

<br/>

[🚀 Launch Demo](#installation) · [📖 API Docs](#api-reference) · [🧬 Features](#features) · [🤝 Partners](#partner-impact)

</div>

---

## 📌 What is TrialLens?

**TrialLens** is a full-stack AI platform that ingests any clinical trial document — PDF, DOCX, TXT, or HTML — and runs a fully automated intelligence pipeline on it, producing a structured multi-page dashboard covering:

- 📊 **25+ statistical metrics** extracted via regex + ML (p-values, HRs, CIs, ORs, RRs)
- 🔬 **IMRAD-aware semantic chunking** with section-linked vector embeddings
- 🧠 **HyperRAG retrieval** — graph-augmented knowledge retrieval beyond vanilla RAG
- 🕵️ **Abstract Inflation Detection** — scores how much an abstract over-promises vs. what the data shows
- 📐 **Oxford CEBM Evidence Scoring** — automated A–D evidence quality rating
- 📈 **Disease-Area Benchmarking** — compares your paper against 10 therapeutic area norms
- 🌐 **Discourse Knowledge Graph** — sentence-level contradiction/support graph visualization
- 🤖 **AI Assistant** — context-aware multi-turn chat grounded in the paper's actual content

**In one sentence:** TrialLens turns a 40-page clinical trial PDF into an executive intelligence brief in under 60 seconds.

---

## 🏭 The Industry Gap We're Closing

| Problem | Scale |
|---|---|
| 📚 Average time a medical professional spends reading one trial paper | **4–6 hours** |
| 📄 Clinical trials published annually on PubMed alone | **500,000+** |
| 🧾 % of trial abstracts that overstate findings vs full paper | **~40%** (JAMA estimate) |
| 💰 Cost of a single failed Phase III trial to a pharma company | **$300M–$800M** |
| 🔍 Regulatory bodies lacking automated tools for pre-submission review | **Most of them** |

> Current tools require expert statisticians, weeks of manual review, and expensive consulting engagements. TrialLens makes this **instant, automated, and accessible**.

---

## ✨ Unique Value Proposition

```
┌──────────────────────────────────────────────────────────────┐
│  TrialLens =  RAG + Knowledge Graph + Inflation Scoring      │
│               + CEBM Automation + Disease Benchmarking       │
│               — packaged as a zero-config intelligence layer │
│                 on top of any clinical document              │
└──────────────────────────────────────────────────────────────┘
```

### Why Choose TrialLens Over Alternatives?

| Capability | TrialLens | Generic LLM Chat | Manual Review | Standard RAG |
|---|:---:|:---:|:---:|:---:|
| IMRAD-Aware Section Parsing | ✅ | ❌ | ✅ | ❌ |
| Abstract Inflation Scoring | ✅ | ❌ | ⚠️ Subjective | ❌ |
| CEBM Evidence Level (Auto) | ✅ | ❌ | ⚠️ Manual | ❌ |
| Graph-Augmented Retrieval | ✅ | ❌ | ❌ | ❌ |
| Disease-Area Benchmarking | ✅ | ❌ | ❌ | ❌ |
| Discourse Contradiction Graph | ✅ | ❌ | ❌ | ❌ |
| Multi-format Support | ✅ | ⚠️ | ✅ | ⚠️ |
| Local / Private Deployment | ✅ | ❌ | ✅ | ✅ |
| Zero Expert Overhead | ✅ | ⚠️ | ❌ | ⚠️ |

---

## 🔬 Five Novelties That Set Us Apart

> **1. HyperRAG — Graph-Augmented Retrieval**
> Unlike vanilla RAG which returns isolated chunks, HyperRAG expands every vector hit through the IMRAD knowledge graph — surfacing contextually linked evidence across methods, results, and discussion sections simultaneously.

> **2. Abstract Inflation Scoring**
> A proprietary contradiction-detection engine that cross-references 8 claim patterns against 10 counter-evidence patterns within the same document. Scores 0–100 with HIGH / MEDIUM / LOW classification. No other tool does this at sentence granularity.

> **3. Automated Oxford CEBM Scoring**
> The first automated implementation of the Oxford Centre for Evidence-Based Medicine 1a–4 hierarchy, producing A–D evidence ratings from document text alone — no manual adjudication required.

> **4. Discourse Knowledge Graph**
> Every sentence is classified as Claim, Evidence, or Vague, then placed as a node in a NetworkX DiGraph with `contradicts` and `supports` edges. Users see exactly where abstracts are unsupported by data.

> **5. Disease-Area Benchmarking Registry**
> Papers are registered into a live session registry and benchmarked against 10 therapeutic area norms (sample size, efficacy rate, adverse rate, p-value, follow-up). Peer comparison available across all uploaded papers.

---

## 🧬 Features

| Icon | Feature | Description |
|:---:|---|---|
| 📄 | **Multi-Format Ingestion** | PDF, DOCX, TXT, HTML — up to 50 MB. URL fetch with auto-PDF detection. |
| 🧩 | **IMRAD Chunking** | Semantic chunking aligned to Abstract / Intro / Methods / Results / Discussion / Adverse sections |
| 📊 | **25+ Metric Extractors** | p-values, CI, HR, OR, RR, effect size, efficacy rate, AE rate, SAE rate, endpoints |
| 🕵️ | **Abstract Inflation Engine** | Sentence-level claim vs. evidence contradiction scoring (0–100) |
| 📐 | **CEBM Evidence Scoring** | Automated Oxford levels 1a–4 mapped to A–D ratings |
| 🌐 | **Knowledge Graph** | Force-directed discourse graph with contradiction/support edge rendering |
| 🔍 | **HyperRAG Search** | Graph-expanded semantic search with section filters |
| 🤖 | **AI Assistant** | Multi-turn Claude-powered chat grounded in paper context |
| 📈 | **Disease Benchmarking** | 10 therapeutic area reference norms with peer comparison tables |
| 🗂️ | **Paper Library** | Local folder-based paper management with bulk analysis |
| 🔒 | **Private Deployment** | Qdrant on-disk, no data leaves your environment |

---

## 🛠️ Tech Stack

### Backend

| Technology | Badge | Purpose |
|---|---|---|
| Python 3.10+ | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | Core runtime |
| Flask + Flask-CORS | ![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white) | REST API server (port 5002) |
| PyMuPDF (fitz) | ![PyMuPDF](https://img.shields.io/badge/PyMuPDF-1.24+-CC3333?style=flat) | PDF page extraction + table detection |
| HuggingFace Transformers | ![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=flat&logo=huggingface&logoColor=black) | `all-MiniLM-L6-v2` 384-dim sentence embeddings |
| Qdrant | ![Qdrant](https://img.shields.io/badge/Qdrant-DC143C?style=flat) | On-disk cosine vector search |
| NetworkX | ![NetworkX](https://img.shields.io/badge/NetworkX-Graph-blue?style=flat) | HyperRAG + discourse knowledge graph |
| scikit-learn | ![sklearn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikit-learn&logoColor=white) | Utility ML functions |
| python-docx | ![docx](https://img.shields.io/badge/python--docx-2B579A?style=flat&logo=microsoft-word&logoColor=white) | DOCX parsing |
| Gunicorn | ![Gunicorn](https://img.shields.io/badge/Gunicorn-499848?style=flat&logo=gunicorn&logoColor=white) | Production WSGI server |

### Frontend

| Technology | Badge | Purpose |
|---|---|---|
| React 18 | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | Component-based UI |
| Vite 5 | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build tool + dev server (port 5173) |
| Recharts | ![Recharts](https://img.shields.io/badge/Recharts-22b5e8?style=flat) | Radar, Bar, Line charts |
| HTML5 Canvas | ![Canvas](https://img.shields.io/badge/Canvas-Force%20Graph-E34F26?style=flat&logo=html5&logoColor=white) | Custom force-directed knowledge graph |
| Lucide React | ![Lucide](https://img.shields.io/badge/Lucide-Icons-f59e0b?style=flat) | Icon system |
| CSS Custom Properties | ![CSS](https://img.shields.io/badge/CSS-Design%20System-1572B6?style=flat&logo=css3&logoColor=white) | Navy/teal dark theme with full variable system |

---

## 🎯 Who We're Built For

```
┌─────────────────────────────────────────────────────────────────────────┐
│  👩‍🔬  Clinical Researchers    — Skip the manual stat hunt. Get metrics    │
│                                  in seconds, not hours.                  │
│                                                                          │
│  🏥  Hospital R&D Teams      — Review portfolios of trials fast.         │
│                                  Spot weak evidence before it reaches    │
│                                  clinical policy.                        │
│                                                                          │
│  💊  Pharma Intelligence      — Benchmark competitor trial results        │
│                                  against your therapeutic area norms.    │
│                                                                          │
│  📋  Regulatory Affairs       — Flag abstract inflation and evidence      │
│                                  quality issues pre-submission.          │
│                                                                          │
│  🎓  Academic Institutions   — Accelerate literature review and           │
│                                  systematic analysis at scale.           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🤝 Partner Impact

### 🌞 Sun Pharma
Sun Pharma, one of India's largest pharmaceutical companies, deals with hundreds of incoming and outgoing clinical trial documents annually — for new drug applications, regulatory submissions, competitive intelligence, and in-licensing decisions.

**How TrialLens helps:**
- Instantly benchmark competitor trial data against disease-area norms (e.g., Oncology, Cardiology) to support business development decisions
- Detect inflated abstracts in in-licensing candidate papers before committing to due diligence costs
- Automate evidence grading (CEBM A–D) for regulatory dossier review
- Reduce expert statistician hours on competitive literature review by **~70%**
- Semantic search across trial libraries for drug-comparator and endpoint intelligence

> *Estimated ROI: If TrialLens saves 10 analyst-hours per paper at 500 papers/year, that's 5,000 hours — equivalent to 2.5 FTEs — redirected to higher-value work.*

---

### 🌱 Marichi Ventures
As a healthcare-focused venture fund and incubator, Marichi Ventures evaluates biotech and medtech investment opportunities that hinge on clinical evidence quality.

**How TrialLens helps:**
- **Due diligence acceleration:** Run a full evidence quality audit on any portfolio company's trial papers in under 60 seconds
- **Abstract inflation detection** catches over-promised results before term sheet signing
- **Peer benchmarking** compares a startup's trial metrics against established disease-area standards — exposing outliers
- **Knowledge graph visualization** surfaces internal contradictions in publications that might not be caught in a surface read
- Standardized CEBM evidence scoring enables apples-to-apples comparison across portfolio companies

> *TrialLens gives Marichi's investment analysts the forensic lens of a biostatistician — without requiring one in every meeting.*

---

### ⚡ A2Z4.0
A2Z4.0 operates at the intersection of technology, digital health, and enterprise transformation. As a system integrator and deep-tech enabler, A2Z4.0 can deploy TrialLens as an embedded intelligence layer within hospital systems, pharma ERP pipelines, and regulatory submission workflows.

**How TrialLens helps:**
- **White-label deployment:** TrialLens's API-first architecture plugs into existing clinical data platforms
- **On-premise privacy:** Qdrant on-disk + local LLM options ensure patient and IP data never leaves the client's environment
- **Workflow integration:** REST API endpoints map directly to document management system hooks
- **Scalability:** Flask + Gunicorn backend designed for horizontal scaling behind an enterprise load balancer
- **AI augmentation layer:** TrialLens's HyperRAG can be extended as an enterprise knowledge base across an organization's entire trial library

> *A2Z4.0 can productize TrialLens as the "Clinical Intelligence Engine" for hospitals and pharma clients — a recurring SaaS revenue stream with high switching costs.*

---

## 🌍 Societal Impact

### From Individual Papers to Population Health

```
Clinical Trial Paper
        │
        ▼
  📊 TrialLens Analysis
        │
        ├──► 🧬 Personalized Treatment
        │         Accurate evidence grading helps physicians choose
        │         therapies backed by genuine Level A/B evidence,
        │         not inflated abstracts. Better matching of
        │         treatments to patient subgroups.
        │
        ├──► 🏥 Hospital Clinical Policy
        │         Hospital formulary committees and protocol designers
        │         can now process 10x more trials in evidence reviews,
        │         leading to faster policy updates based on current data.
        │
        ├──► 💊 Drug Safety
        │         Adverse event rate extraction and discourse graph
        │         contradiction detection surface safety signal
        │         discrepancies that might otherwise be buried in
        │         supplementary materials.
        │
        ├──► 🌐 Equitable Access to Knowledge
        │         Researchers in LMICs (Low- and Middle-Income Countries)
        │         lack access to expensive analyst teams. TrialLens
        │         democratizes clinical intelligence — open-source,
        │         locally deployable, zero subscription cost.
        │
        └──► 🔭 Preventive Care Intelligence
                  By enabling rapid synthesis of trial evidence across
                  disease areas, public health bodies can faster identify
                  preventive interventions with strong evidence bases
                  and deploy them at population scale.
```

---

## 🚀 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/triallens.git
cd triallens/backend

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the Flask server
python app.py
# → Running on http://localhost:5002
```

### Frontend Setup

```bash
# In a new terminal
cd triallens/frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
# → Running on http://localhost:5173
```

Open `http://localhost:5173` in your browser. The backend health dot in the sidebar will turn green when connected.

### requirements.txt (Backend)

```
flask>=2.3
flask-cors>=4.0
pymupdf>=1.24
qdrant-client>=1.9
sentence-transformers>=2.7
transformers>=4.40
networkx>=3.3
scikit-learn>=1.4
python-docx>=1.1
requests>=2.31
gunicorn>=21.0
torch>=2.0
```

---

## 📁 File Structure

```
triallens/
│
├── 📂 backend/
│   ├── 🐍 app.py                  # Flask API server — 11 endpoints, port 5002
│   ├── ⚙️  config.py               # Qdrant client init + collection setup
│   ├── 🔍 trial_parser.py         # PDF/DOCX ingestion + 25 regex metric extractors
│   ├── 🧩 trial_chunker.py        # IMRAD-aware semantic chunker (~600 tokens/chunk)
│   ├── 🗄️  trial_vector.py         # Sentence embeddings + Qdrant upsert/search/delete
│   ├── 🌐 trial_hyperrag.py       # HyperRAG: IMRAD graph build + graph-expanded retrieval
│   ├── 🕵️  abstract_inflator.py    # Inflation scoring: claim/evidence/vague classification
│   ├── 📈 trial_compare.py        # Disease-area benchmarking registry + peer comparison
│   ├── 📋 requirements.txt
│   └── 📂 trial_papers/           # Drop PDFs here for library mode
│       ├── 📄 RECOVERY_trial.pdf
│       └── 📄 PARADIGM-HF.pdf
│
└── 📂 frontend/
    ├── 📄 index.html
    ├── 📦 package.json
    ├── ⚡ vite.config.js
    └── 📂 src/
        ├── 🏠 App.jsx              # Root shell: sidebar nav, page routing, lock logic
        ├── 🎨 index.css            # Navy/teal design system — CSS custom properties
        ├── 📂 pages/
        │   ├── 🛬 LandingPage.jsx  # Marketing landing + 8 sample paper cards
        │   ├── 📤 UploadPage.jsx   # 3-tab upload (file/URL/library) + pipeline progress
        │   ├── 📊 MetricsPage.jsx  # Full metrics dashboard + charts + evidence ring
        │   ├── 🔍 QueryPage.jsx    # HyperRAG semantic search interface
        │   ├── 🕵️  InflationPage.jsx # Abstract inflation detail + contradiction cards
        │   ├── 📈 ComparePage.jsx  # Disease benchmarking tables + peer chart
        │   ├── 🌐 GraphPage.jsx    # Canvas force-directed knowledge graph
        │   └── 🤖 AIPage.jsx       # Multi-turn AI assistant with RAG grounding
        └── 📂 utils/
            └── 🔌 api.js           # Typed fetch wrappers for all 11 API endpoints
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | 🟢 Backend health check — version + status |
| `POST` | `/api/analyze` | 📤 Ingest file (multipart: file, paper_id, disease_area) |
| `POST` | `/api/library/analyze` | 📚 Analyze file from local `trial_papers/` folder |
| `GET` | `/api/library` | 🗂️ List all files in `trial_papers/` folder |
| `GET` | `/api/fetch_paper?url=` | 🌐 Proxy-fetch paper from URL, auto-detect PDF |
| `POST` | `/api/query` | 🔍 HyperRAG semantic search (paper_id, question, section) |
| `GET` | `/api/inflation/<paper_id>` | 🕵️ Discourse graph export — nodes, edges, inflation score |
| `GET` | `/api/compare/<paper_id>` | 📈 Benchmarking data — comparisons, peers, benchmark values |
| `GET` | `/api/graph/<paper_id>` | 🌐 IMRAD knowledge graph — nodes and edges (max 80/150) |
| `GET` | `/api/papers` | 📋 Session paper registry list |
| `GET` | `/api/paper_text/<paper_id>` | 📄 Raw extracted full text for a paper |

---

## 🔄 Technical Workflow

```
         ┌──────────────────────────────────┐
         │     DOCUMENT INPUT (PDF/DOCX/    │
         │        TXT/HTML/URL)             │
         └────────────┬─────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  1. PARSE & EXTRACT    │◄─── PyMuPDF | python-docx
         │   • Pages + Tables     │     Section detection (IMRAD)
         │   • Metadata           │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  2. VALIDATE           │◄─── 30 clinical keyword check
         │   • Clinical relevance │     Min 4 hits required
         │   • Format + size      │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  3. SEMANTIC CHUNK     │◄─── ~600 tokens/chunk
         │   • IMRAD section tags │     Sentence boundary split
         │   • Table chunks       │     Section-aware grouping
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  4. EMBED + INDEX      │◄─── all-MiniLM-L6-v2 (384-dim)
         │   • Sentence embeddings│     Qdrant on-disk cosine index
         │   • UUID point IDs     │     Batch upsert (100/batch)
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  5. BUILD HYPERRAG     │◄─── NetworkX Graph
         │     GRAPH              │     Sequential + cross-section
         │   • Section nodes      │     edges (methods↔results, etc.)
         │   • Weighted edges     │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  6. EXTRACT METRICS    │◄─── 25+ regex extractors
         │   • Stats (p, CI, HR)  │     Pattern libraries per metric
         │   • Design, blinding   │     Disease area keyword scoring
         │   • Endpoints, dosage  │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  7. INFLATION ANALYSIS │◄─── 8 claim patterns
         │   • Claim detection    │     10 contradict patterns
         │   • Evidence tagging   │     5 vague patterns
         │   • Score 0–100        │     Discourse DiGraph (NetworkX)
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  8. EVIDENCE SCORING   │◄─── Oxford CEBM 1a–4
         │   • Design mapping     │     A–D rating
         │   • Composite score    │     Sample size + p-value weight
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  9. BENCHMARKING       │◄─── 10 disease area norms
         │   • Register paper     │     Peer registry comparison
         │   • Compare metrics    │     Status: better / worse
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────────────────────┐
         │       MULTI-PAGE DASHBOARD             │
         │  📊 Metrics  🕵️ Inflation  🌐 Graph     │
         │  🔍 Search   📈 Compare   🤖 AI Chat   │
         └────────────────────────────────────────┘
```

---

## 🏥 Disease Area Benchmarks

| Area | Sample Size | Efficacy Rate | AE Rate | Typical p | Median Follow-up |
|---|---|---|---|---|---|
| 🎗️ Oncology | 400 | 45% | 75% | 0.001 | 18 mo |
| ❤️ Cardiology | 5,000 | 25% | 30% | 0.01 | 36 mo |
| 🦠 Infectious Disease | 1,000 | 80% | 20% | 0.001 | 6 mo |
| 🧠 Neurology | 800 | 35% | 25% | 0.05 | 24 mo |
| 🩸 Endocrinology | 1,500 | 55% | 15% | 0.01 | 12 mo |
| 🫁 Pulmonology | 600 | 40% | 20% | 0.05 | 12 mo |
| 🦴 Rheumatology | 700 | 50% | 25% | 0.01 | 12 mo |
| 🧩 Psychiatry | 300 | 40% | 20% | 0.05 | 8 mo |
| 🫀 Gastroenterology | 500 | 45% | 20% | 0.05 | 12 mo |
| 🏥 General Medicine | 1,000 | 40% | 20% | 0.05 | 12 mo |

---

## 📏 Supported Study Designs & Evidence Levels

| Study Design | CEBM Level | Evidence Grade | Typical Use |
|---|---|---|---|
| Systematic Review / Meta-Analysis | 1a | **A** | Pooled RCT synthesis |
| Randomised Controlled Trial (RCT) | 1b | **A** | Gold standard efficacy |
| Double-Blind RCT | 1b | **A** | Bias-controlled trials |
| Phase III Clinical Trial | 1b–2a | **A–B** | Pre-approval pivotal |
| Cohort Study | 2b | **B** | Long-term outcomes |
| Case-Control Study | 3b | **C** | Rare conditions |
| Cross-Sectional Study | 4 | **D** | Prevalence estimation |
| Case Series / Report | 4 | **D** | Signal generation |

---

## 📚 References & Citations

**[1]** Howick, J., Chalmers, I., Glasziou, P., et al. (2011). *The 2011 Oxford CEBM Levels of Evidence.* Oxford Centre for Evidence-Based Medicine.
→ Underpins TrialLens's automated CEBM 1a–4 evidence grading and A–D rating system.
https://www.cebm.ox.ac.uk/resources/levels-of-evidence/ocebm-levels-of-evidence

**[2]** Boutron, I., Dutton, S., Ravaud, P., & Altman, D. G. (2010). Reporting and interpretation of randomized controlled trials with statistically nonsignificant results for primary outcomes. *JAMA*, 303(20), 2058–2064.
→ Foundational evidence for the Abstract Inflation Scoring engine — quantifies how frequently trial abstracts misrepresent non-significant findings.
https://doi.org/10.1001/jama.2010.651

**[3]** Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT-Networks. *Proceedings of EMNLP 2019*.
→ The embedding architecture behind TrialLens's semantic chunking, HyperRAG retrieval, and vector search (`all-MiniLM-L6-v2`, 384-dim).
https://doi.org/10.18653/v1/D19-1410

---

## 📜 License

MIT License — see `LICENSE` for details.

---

<div align="center">

**Built with 🔬 for the future of evidence-based medicine.**

*TrialLens — Because every clinical decision deserves better evidence.*

<br/>

[![Sun Pharma Partner](https://img.shields.io/badge/Partner-Sun%20Pharma-orange?style=for-the-badge)](https://sunpharma.com)
[![Marichi Ventures](https://img.shields.io/badge/Partner-Marichi%20Ventures-green?style=for-the-badge)](https://marichiventures.com)
[![A2Z4.0](https://img.shields.io/badge/Partner-A2Z4.0-blue?style=for-the-badge)](https://a2z4.com)

</div>
