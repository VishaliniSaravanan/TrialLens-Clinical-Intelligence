# TrialLens — Clinical Research Intelligence Platform

> Upload any clinical trial PDF and get a full intelligence report in under 30 seconds.

TrialLens is an AI-powered platform that automatically extracts, analyses, and benchmarks clinical trial papers. Feed it any RCT, meta-analysis, or systematic review and it returns structured metrics, abstract inflation scores, evidence quality ratings, a semantic query engine, and an interactive discourse knowledge graph — all in one unified dashboard.

---

## Overview

Clinical trial papers are dense, jargon-heavy, and often written with optimistic framing. TrialLens cuts through the noise by running a full NLP pipeline the moment you upload a paper:

1. **Parse** — Extracts text and tables from PDF, DOCX, TXT, or HTML
2. **Segment** — Detects IMRAD sections (Introduction, Methods, Results, Discussion, Adverse, Statistics)
3. **Embed** — Chunks the paper semantically and indexes it into a local Qdrant vector store
4. **Extract** — Pulls 25+ quantitative metrics using regex and pattern matching
5. **Score** — Rates evidence quality on the Oxford CEBM hierarchy (Levels 1a–4, Grades A–D)
6. **Analyse** — Detects abstract inflation by comparing abstract claims against results/discussion sentences
7. **Benchmark** — Compares your paper against typical values for the detected disease area
8. **Graph** — Builds a force-directed discourse graph of claims, supporting evidence, and contradictions

---

## Features

| Feature | Description |
|---|---|
| **Trial Metrics** | Sample size, p-values, confidence intervals, hazard ratio, odds ratio, effect size, efficacy rate, adverse event rates, study design, blinding, follow-up duration, drug name, dosage, comparator |
| **Abstract Inflation** | Detects when the abstract makes stronger claims than the results support — flags contradictions and vague/marketing language with severity scores |
| **Evidence Quality** | Scores each paper on the Oxford CEBM evidence hierarchy; outputs Level (1a–4) and Grade (A–D) rating |
| **IMRAD Detection** | Segments the paper into Introduction / Methods / Results / Discussion / Adverse / Statistics sections automatically |
| **Benchmarking** | Compares sample size, efficacy, adverse event rate, and p-value against typical values for the detected disease area (Oncology, Cardiology, Neurology, and 7 more) |
| **Research Query (HyperRAG)** | Graph-augmented vector search — ask any natural language question about the paper and get section-attributed answers |
| **Knowledge Graph** | Force-directed discourse graph showing claim nodes, supporting evidence, contradiction edges, and vague claim nodes |
| **Paper Library** | Drop PDFs into `trial_papers/` for one-click batch analysis without re-uploading |
| **URL Fetch** | Paste any PubMed, arXiv, or journal URL — the backend auto-detects and downloads the embedded PDF |
| **Multi-format Support** | Accepts `.pdf`, `.docx`, `.txt`, and `.html` input files up to 50 MB |

---

## Tech Stack & Tools

### Backend
| Layer | Technology |
|---|---|
| API Framework | [Flask](https://flask.palletsprojects.com/) + Flask-CORS |
| PDF Parsing | [PyMuPDF](https://pymupdf.readthedocs.io/) (`pymupdf >= 1.24`) |
| Vector Store | [Qdrant](https://qdrant.tech/) (local on-disk mode) |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` via HuggingFace Transformers |
| Knowledge Graph | [NetworkX](https://networkx.org/) directed/undirected graphs |
| Metric Extraction | Custom regex pipeline (25+ clinical patterns) |
| Chunking Strategy | IMRAD-aware semantic chunking (~600 token target) |
| Evidence Scoring | Oxford CEBM hierarchy implementation |
| Inflation Detection | Rule-based contradiction pattern matching (8 rule pairs) |
| Benchmarking | Hardcoded disease-area norms (10 therapeutic areas) |
| Production Server | [Gunicorn](https://gunicorn.org/) |

### Frontend
| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Charts | [Recharts](https://recharts.org/) — Radar, Bar, Line charts |
| Knowledge Graph | Custom HTML5 Canvas force-directed simulation |
| Icons | [Lucide React](https://lucide.dev/) |
| HTTP Client | Native `fetch` API |
| Styling | Custom CSS with design tokens (CSS variables) |

---

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend

```bash
cd triallens/backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt

mkdir trial_papers

python app.py
```

The Flask API will start on **http://localhost:5002**

> **First run note:** On first startup, the `sentence-transformers/all-MiniLM-L6-v2` model (~90 MB) will be downloaded from HuggingFace. Subsequent starts are instant.

### Frontend

```bash
cd triallens/frontend
npm install
npm run dev
```

The React app will start on **http://localhost:5173**

Open your browser at `http://localhost:5173` — you should see the TrialLens landing page.

---

## Using the Paper Library

Drop your clinical trial PDFs directly into the library folder:

```
triallens/backend/trial_papers/
```

The filename becomes the paper title automatically — no renaming needed.

**Example:**
```
NEJM_Diabetes_RCT_2023.pdf  →  "NEJM Diabetes RCT 2023"
lancet_oncology_2024.pdf    →  "lancet oncology 2024"
```

Then open the app, go to **Upload Paper → Paper Library**, click **Refresh**, select your paper's disease area, and hit **Analyse**.

---

## API Reference

All endpoints are served from `http://localhost:5002`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/analyze` | Analyse an uploaded file (multipart/form-data) |
| `POST` | `/api/library/analyze` | Analyse a file from the local library |
| `GET` | `/api/library` | List all files in the paper library |
| `GET` | `/api/fetch_paper?url=` | Fetch a PDF from a remote URL |
| `POST` | `/api/query` | HyperRAG semantic search query |
| `GET` | `/api/inflation/<paper_id>` | Get discourse graph + inflation data |
| `GET` | `/api/compare/<paper_id>` | Get benchmarking comparison data |
| `GET` | `/api/graph/<paper_id>` | Get knowledge graph nodes and edges |
| `GET` | `/api/papers` | List all analysed papers in session |
| `GET` | `/api/paper_text/<paper_id>` | Get raw extracted text for a paper |

---

## File Structure

```
triallens/
├── backend/
│   ├── app.py                  Flask API server (port 5002)
│   ├── config.py               Qdrant client + collection initialisation
│   ├── trial_parser.py         PDF parser, IMRAD section detection, metric extraction
│   ├── trial_metrics.py        Quantitative metric extraction (25+ fields)
│   ├── abstract_inflator.py    Abstract inflation detector + discourse graph builder
│   ├── trial_compare.py        Disease area benchmarking + peer comparison
│   ├── trial_chunker.py        IMRAD-aware semantic chunking
│   ├── trial_vector.py         Qdrant vector store — indexing + search
│   ├── trial_hyperrag.py       HyperRAG knowledge graph + graph-augmented retrieval
│   ├── requirements.txt
│   └── trial_papers/           ← Drop your PDFs here for the library
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx             Root component + navigation state
        ├── main.jsx
        ├── index.css           Design system (CSS variables, shared components)
        ├── pages/
        │   ├── LandingPage.jsx     Hero + feature overview
        │   ├── UploadPage.jsx      File upload, URL fetch, library browser
        │   ├── MetricsPage.jsx     Trial metrics dashboard + charts
        │   ├── InflationPage.jsx   Abstract inflation + contradiction viewer
        │   ├── QueryPage.jsx       HyperRAG semantic search interface
        │   ├── ComparePage.jsx     Benchmarking charts + peer comparison
        │   └── GraphPage.jsx       Force-directed knowledge graph
        └── utils/
            └── api.js              Typed API client for all backend endpoints
```

---

## Technical Workflow

```
PDF / DOCX / TXT / HTML
        │
        ▼
  ┌─────────────┐
  │ trial_parser │  PyMuPDF extraction → IMRAD section labelling
  └──────┬──────┘
         │ pages[] with section tags
         ▼
  ┌──────────────┐
  │ trial_chunker │  Sentence-boundary splitting, ~600-token chunks
  └──────┬───────┘
         │ chunks[]
         ├──────────────────────────────┐
         ▼                              ▼
  ┌─────────────┐              ┌────────────────┐
  │ trial_vector │  MiniLM-L6  │ trial_hyperrag  │
  │  (Qdrant)   │  embeddings  │  (NetworkX)    │
  └──────┬──────┘              └───────┬────────┘
         │ vector index                │ knowledge graph
         └──────────────┬─────────────┘
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
  ┌────────────┐  ┌───────────┐  ┌──────────────────┐
  │trial_metrics│  │abstract_  │  │  trial_compare   │
  │extract_all()│  │inflator   │  │  (benchmarking)  │
  └─────┬───────┘  └─────┬─────┘  └───────┬──────────┘
        │                │                 │
        └────────────────┴─────────────────┘
                         │
                         ▼
                   Flask API (app.py)
                         │
                         ▼
                  React Frontend
          Metrics · Inflation · Query · Graph · Compare
```

---

## Disease Area Benchmarks

TrialLens includes hardcoded reference values for 10 therapeutic areas. These are used by the benchmarking module to contextualise your paper's metrics.

| Area | Typical n | Typical Efficacy | Typical Adverse Rate | Typical p-value |
|---|---|---|---|---|
| Oncology | 400 | 45% | 65% | 0.03 |
| Cardiology | 2,000 | 30% | 40% | 0.02 |
| Infectious Disease | 500 | 70% | 30% | 0.01 |
| Neurology | 300 | 35% | 50% | 0.04 |
| Endocrinology | 800 | 55% | 35% | 0.02 |
| Pulmonology | 400 | 40% | 45% | 0.03 |
| Rheumatology | 350 | 48% | 55% | 0.03 |
| Psychiatry | 250 | 50% | 45% | 0.03 |
| Gastroenterology | 300 | 42% | 40% | 0.03 |
| General Medicine | 300 | 45% | 40% | 0.04 |

---

## Supported Paper Types

TrialLens validates uploads against a set of clinical keywords. The following study types are supported:

- Randomised Controlled Trials (RCT)
- Double-Blind / Open-Label Trials
- Phase I / II / III Trials
- Meta-Analyses
- Systematic Reviews
- Cohort Studies
- Case-Control Studies
- Observational Studies

---

