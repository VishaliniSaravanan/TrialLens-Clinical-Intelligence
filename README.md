<div align="center">

<h1>
<span style="color:#1d6fa5; font-size:3em; font-weight:900; letter-spacing:2px;">Trial</span><span style="color:#4fa3ff; font-size:3em; font-weight:900; letter-spacing:2px;">Lens</span>
</h1>

<h3 style="color:#2d8fd4; font-weight:700;">🔬 AI-Powered Clinical Research Intelligence Platform</h3>

*Drop any clinical trial paper. Get a full intelligence dashboard in seconds.*

<br/>

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![Qdrant](https://img.shields.io/badge/Qdrant-VectorDB-DC143C?style=for-the-badge&logo=qdrant&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-34d399?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Hackathon%20Build-fbbf24?style=for-the-badge)

</div>

---

## 📌 Overview

**TrialLens** ingests clinical trial documents (PDF, DOCX, TXT, HTML) and runs a 9-stage automated pipeline — extracting 25+ statistical metrics, scoring abstract integrity, rating evidence quality, and surfacing a discourse knowledge graph. Everything outputs to a structured multi-page dashboard.

> One paper. Under 60 seconds. Executive-grade analysis.

---

## 🏭 The Problem

| Bottleneck | Scale |
|---|---|
| Time to manually review one trial paper | **4–6 hours** |
| Trials published on PubMed annually | **500,000+** |
| Abstracts that overstate findings | **~40%** *(JAMA)* |
| Cost of a failed Phase III trial | **$300M–$800M** |

---

## ✨ What Makes TrialLens Different

| Capability | TrialLens | Generic LLM | Standard RAG | Manual |
|---|:---:|:---:|:---:|:---:|
| IMRAD-aware section parsing | ✅ | ❌ | ❌ | ✅ |
| Abstract inflation scoring | ✅ | ❌ | ❌ | ⚠️ |
| Automated CEBM evidence grade | ✅ | ❌ | ❌ | ⚠️ |
| Graph-augmented retrieval (HyperRAG) | ✅ | ❌ | ❌ | ❌ |
| Disease-area benchmarking | ✅ | ❌ | ❌ | ❌ |
| Discourse contradiction graph | ✅ | ❌ | ❌ | ❌ |
| Local / private deployment | ✅ | ❌ | ✅ | ✅ |

---

## 🔬 Core Novelties

**1. HyperRAG** — Graph-augmented retrieval. Every vector hit is expanded through the IMRAD knowledge graph, surfacing linked evidence across methods, results, and discussion together.

**2. Abstract Inflation Scoring** — Matches 8 claim patterns against 10 counter-evidence patterns at sentence level. Scores 0–100 (HIGH / MEDIUM / LOW). No other tool does this automatically.

**3. Automated Oxford CEBM Grading** — Maps study design, sample size, and p-values to CEBM levels 1a–4, producing an A–D evidence rating without manual adjudication.

**4. Discourse Knowledge Graph** — Each sentence is classified as Claim, Evidence, or Vague and placed in a directed graph with `contradicts` / `supports` edges — making hidden contradictions visible.

**5. Disease-Area Benchmarking** — Papers are scored against 10 therapeutic area reference norms and ranked against all other uploaded papers in the same area.

---

## 🧬 Features

| | Feature | Description |
|:---:|---|---|
| 📄 | Multi-Format Ingestion | PDF, DOCX, TXT, HTML · URL fetch · up to 50 MB |
| 🧩 | IMRAD Chunking | ~600 token chunks tagged to Abstract / Methods / Results / Discussion / Adverse |
| 📊 | 25+ Metric Extractors | p-values, CI, HR, OR, RR, effect size, efficacy, AE rate, endpoints |
| 🕵️ | Abstract Inflation Engine | Sentence-level contradiction scoring, 0–100 |
| 📐 | CEBM Evidence Scoring | Automated Oxford 1a–4 → A–D rating |
| 🌐 | Knowledge Graph | Canvas force-directed graph: claim / evidence / vague nodes + edges |
| 🔍 | HyperRAG Search | Graph-expanded semantic search with section filter |
| 🤖 | AI Assistant | Multi-turn Claude chat grounded in paper context |
| 📈 | Disease Benchmarking | 10 area norms · peer comparison table |
| 🔒 | Private Deployment | Qdrant on-disk · no data leaves your environment |

---

## 🛠️ Tech Stack

### Backend

| Technology | Badge | Purpose |
|---|---|---|
| Python 3.10+ | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | Core runtime |
| Flask + Flask-CORS | ![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white) | REST API · port 5002 |
| PyMuPDF | ![PyMuPDF](https://img.shields.io/badge/PyMuPDF-1.24+-CC3333?style=flat) | PDF extraction + table detection |
| HuggingFace Transformers | ![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=flat&logo=huggingface&logoColor=black) | `all-MiniLM-L6-v2` · 384-dim embeddings |
| Qdrant | ![Qdrant](https://img.shields.io/badge/Qdrant-DC143C?style=flat) | On-disk cosine vector search |
| NetworkX | ![NetworkX](https://img.shields.io/badge/NetworkX-Graph-4B8BBE?style=flat) | HyperRAG + discourse graph |
| scikit-learn | ![sklearn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikit-learn&logoColor=white) | ML utilities |
| python-docx | ![docx](https://img.shields.io/badge/python--docx-2B579A?style=flat&logo=microsoft-word&logoColor=white) | DOCX parsing |
| Gunicorn | ![Gunicorn](https://img.shields.io/badge/Gunicorn-499848?style=flat&logo=gunicorn&logoColor=white) | Production WSGI server |

### Frontend

| Technology | Badge | Purpose |
|---|---|---|
| React 18 | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | UI components |
| Vite 5 | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build tool · port 5173 |
| Recharts | ![Recharts](https://img.shields.io/badge/Recharts-22b5e8?style=flat) | Radar, Bar, Line charts |
| HTML5 Canvas | ![Canvas](https://img.shields.io/badge/Canvas-Force%20Graph-E34F26?style=flat&logo=html5&logoColor=white) | Force-directed knowledge graph |
| Lucide React | ![Lucide](https://img.shields.io/badge/Lucide-Icons-f59e0b?style=flat) | Icon system |
| CSS Custom Properties | ![CSS](https://img.shields.io/badge/CSS-Design%20System-1572B6?style=flat&logo=css3&logoColor=white) | Navy/teal dark theme |

---

## 🎯 Who It's For

| Persona | How TrialLens Helps |
|---|---|
| 👩‍🔬 Clinical Researchers | Replace hours of manual stat hunting with instant extraction |
| 💊 Pharma Intelligence Teams | Benchmark competitor trials against disease-area norms |
| 📋 Regulatory Affairs | Flag abstract inflation and weak evidence before submission |
| 🏥 Hospital R&D | Fast-track evidence review for clinical policy decisions |
| 🌱 VC / Investment Analysts | Audit trial quality during biotech due diligence |

---

## 🤝 Partners

**🌞 Sun Pharma** — Speeds up competitive intelligence and regulatory review across large trial portfolios.

**🌱 Marichi Ventures** — Supports evidence quality checks during biotech investment screening.

**⚡ A2Z4.0** — API-first design enables white-label deployment within existing clinical data platforms.

---

## 🌍 Societal Impact

- **Personalized treatment** — Accurate CEBM grading helps clinicians choose therapies backed by genuine evidence.
- **Drug safety** — AE extraction and contradiction detection surface hidden safety signals.
- **Equitable access** — Open-source, locally deployable — no subscription cost for researchers in LMICs.
- **Preventive care** — Faster evidence synthesis helps public health bodies identify and scale interventions.

---

## 🚀 Installation

### Backend

```bash
git clone https://github.com/your-org/triallens.git
cd triallens/backend

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
python app.py
# → http://localhost:5002
```

### Frontend

```bash
cd triallens/frontend
npm install
npm run dev
# → http://localhost:5173
```

### requirements.txt

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
├── 📂 backend/
│   ├── 🐍 app.py                  # Flask API · 11 endpoints · port 5002
│   ├── ⚙️  config.py               # Qdrant init + collection setup
│   ├── 🔍 trial_parser.py         # Ingestion + 25 metric extractors
│   ├── 🧩 trial_chunker.py        # IMRAD semantic chunker
│   ├── 🗄️  trial_vector.py         # Embeddings + Qdrant upsert/search
│   ├── 🌐 trial_hyperrag.py       # HyperRAG graph build + retrieval
│   ├── 🕵️  abstract_inflator.py    # Inflation scoring + discourse graph
│   ├── 📈 trial_compare.py        # Disease-area benchmarking registry
│   ├── 📋 requirements.txt
│   └── 📂 trial_papers/           # Drop PDFs here for library mode
│
└── 📂 frontend/
    ├── 📄 index.html
    ├── 📦 package.json
    ├── ⚡ vite.config.js
    └── 📂 src/
        ├── 🏠 App.jsx              # Root shell · sidebar · routing
        ├── 🎨 index.css            # Design system · CSS variables
        └── 📂 pages/
            ├── 🛬 LandingPage.jsx  # Landing + 8 sample paper cards
            ├── 📤 UploadPage.jsx   # File / URL / Library tabs + pipeline
            ├── 📊 MetricsPage.jsx  # Full metrics dashboard
            ├── 🔍 QueryPage.jsx    # HyperRAG semantic search
            ├── 🕵️  InflationPage.jsx # Abstract inflation detail
            ├── 📈 ComparePage.jsx  # Benchmarking + peer chart
            ├── 🌐 GraphPage.jsx    # Canvas knowledge graph
            └── 🤖 AIPage.jsx       # Multi-turn AI assistant
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | 🟢 Health check |
| `POST` | `/api/analyze` | 📤 Ingest file (multipart) |
| `POST` | `/api/library/analyze` | 📚 Analyze from `trial_papers/` |
| `GET` | `/api/library` | 🗂️ List local paper library |
| `GET` | `/api/fetch_paper?url=` | 🌐 Proxy-fetch + auto-detect PDF |
| `POST` | `/api/query` | 🔍 HyperRAG semantic search |
| `GET` | `/api/inflation/<paper_id>` | 🕵️ Discourse graph + inflation score |
| `GET` | `/api/compare/<paper_id>` | 📈 Benchmarking + peer data |
| `GET` | `/api/graph/<paper_id>` | 🌐 IMRAD knowledge graph |
| `GET` | `/api/papers` | 📋 Session paper list |
| `GET` | `/api/paper_text/<paper_id>` | 📄 Raw extracted text |

---

## 🔄 Technical Workflow

```
  INPUT (PDF / DOCX / TXT / HTML / URL)
          │
          ▼
  1. PARSE ──────────── PyMuPDF · python-docx · IMRAD section detection
          │
          ▼
  2. VALIDATE ────────── 30 clinical keywords · min 4 hits · 50 MB limit
          │
          ▼
  3. CHUNK ───────────── ~600 tokens · sentence boundaries · section tags
          │
          ▼
  4. EMBED + INDEX ───── all-MiniLM-L6-v2 · Qdrant cosine · batch 100
          │
          ▼
  5. BUILD HYPERRAG ──── NetworkX graph · section nodes · weighted edges
          │
          ▼
  6. EXTRACT METRICS ─── 25+ regex extractors · p · CI · HR · OR · RR
          │
          ▼
  7. INFLATION SCORE ─── claim vs evidence patterns · score 0–100
          │
          ▼
  8. EVIDENCE GRADE ──── Oxford CEBM 1a–4 → A–D rating
          │
          ▼
  9. BENCHMARK ────────── 10 disease area norms · peer registry
          │
          ▼
  DASHBOARD  📊 Metrics · 🕵️ Inflation · 🌐 Graph · 🔍 Search · 🤖 AI
```

---

## 🏥 Disease Area Benchmarks

| Area | Sample Size | Efficacy | AE Rate | Typical p | Follow-up |
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

## 📏 Evidence Levels

| Study Design | CEBM Level | Grade |
|---|---|---|
| Systematic Review / Meta-Analysis | 1a | **A** |
| Randomised Controlled Trial | 1b | **A** |
| Double-Blind RCT | 1b | **A** |
| Phase III Clinical Trial | 1b–2a | **A–B** |
| Cohort Study | 2b | **B** |
| Case-Control Study | 3b | **C** |
| Cross-Sectional Study | 4 | **D** |
| Case Series / Report | 4 | **D** |

---

## 📚 References

**[1]** Howick, J. et al. (2011). *The 2011 Oxford CEBM Levels of Evidence.* — Basis for automated CEBM grading.
https://www.cebm.ox.ac.uk/resources/levels-of-evidence/ocebm-levels-of-evidence

**[2]** Boutron, I. et al. (2010). Reporting of RCTs with non-significant results. *JAMA*, 303(20). — Basis for Abstract Inflation Scoring.
https://doi.org/10.1001/jama.2010.651

**[3]** Reimers, N. & Gurevych, I. (2019). Sentence-BERT. *EMNLP 2019.* — Embedding model for HyperRAG and semantic search.
https://doi.org/10.18653/v1/D19-1410

---

## 📜 License

MIT — see `LICENSE` for details.

---

<div align="center">

**TrialLens — Because every clinical decision deserves better evidence.**

[![Sun Pharma](https://img.shields.io/badge/Partner-Sun%20Pharma-orange?style=for-the-badge)](https://sunpharma.com)
[![Marichi Ventures](https://img.shields.io/badge/Partner-Marichi%20Ventures-green?style=for-the-badge)](https://marichiventures.com)
[![A2Z4.0](https://img.shields.io/badge/Partner-A2Z4.0-blue?style=for-the-badge)](https://a2z4.com)

</div>
