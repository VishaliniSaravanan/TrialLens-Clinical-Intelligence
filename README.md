# TrialLens - Clinical Research Intelligence Platform

Upload any clinical trial PDF and get a full intelligence report.

## What it does

| Feature | Description |
|---|---|
| Trial Metrics | Sample size, p-values, confidence intervals, hazard ratio, odds ratio, effect size, efficacy rate, adverse event rates, study design, blinding, follow-up, drug name, dosage |
| Abstract Inflation | Detects when the abstract makes stronger claims than results support |
| Evidence Quality | Scores each paper on the Oxford CEBM evidence hierarchy, gives A/B/C/D rating |
| IMRAD Detection | Segments paper into Introduction / Methods / Results / Discussion / Adverse / Statistics |
| Benchmarking | Compares against typical values for the disease area |
| Research Query | HyperRAG vector search - ask anything about the paper |
| Knowledge Graph | Discourse graph showing claims, evidence, contradictions |

## Setup

### Backend

```
cd triallens/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
mkdir trial_papers
python app.py
```

Runs on http://localhost:5002

### Frontend

```
cd triallens/frontend
npm install
npm run dev
```

Runs on http://localhost:5173

## Using the library

Drop your clinical trial PDFs into:
```
triallens/backend/trial_papers/
```

The filename becomes the paper title automatically.
Example: NEJM_Diabetes_RCT_2023.pdf becomes "NEJM Diabetes RCT 2023"

## File structure

```
triallens/
  backend/
    app.py                Flask API (port 5002)
    trial_parser.py       PDF parser + IMRAD section detection
    trial_metrics.py      Quantitative metric extraction
    abstract_inflator.py  Abstract inflation detector
    trial_compare.py      Disease area benchmarking
    trial_chunker.py      Section-aware semantic chunking
    trial_vector.py       Qdrant vector store
    trial_hyperrag.py     HyperRAG knowledge graph
    config.py             Qdrant config
    requirements.txt
    trial_papers/         Drop your PDFs here
  frontend/
    src/
      App.jsx
      main.jsx
      index.css
      pages/
        UploadPage.jsx
        MetricsPage.jsx
        InflationPage.jsx
        LandingPage.jsx
        ComparePage.jsx
        QueryPage.jsx
        GraphPage.jsx
      utils/
        api.js
    index.html
    package.json
    vite.config.js
```
