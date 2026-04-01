REGISTRY: dict[str, dict] = {}

DISEASE_BENCHMARKS = {
    "Oncology": {
        "typical_sample_size": 400,
        "typical_efficacy_rate": 45.0,
        "typical_adverse_rate": 65.0,
        "typical_pvalue": 0.03,
        "median_follow_up": "24 months",
        "common_designs": ["Phase III Trial", "Double-Blind RCT"],
    },
    "Cardiology": {
        "typical_sample_size": 2000,
        "typical_efficacy_rate": 30.0,
        "typical_adverse_rate": 40.0,
        "typical_pvalue": 0.02,
        "median_follow_up": "36 months",
        "common_designs": ["Double-Blind RCT", "Randomized Controlled Trial (RCT)"],
    },
    "Infectious Disease": {
        "typical_sample_size": 500,
        "typical_efficacy_rate": 70.0,
        "typical_adverse_rate": 30.0,
        "typical_pvalue": 0.01,
        "median_follow_up": "6 months",
        "common_designs": ["Double-Blind RCT", "Phase III Trial"],
    },
    "Neurology": {
        "typical_sample_size": 300,
        "typical_efficacy_rate": 35.0,
        "typical_adverse_rate": 50.0,
        "typical_pvalue": 0.04,
        "median_follow_up": "18 months",
        "common_designs": ["Double-Blind RCT", "Phase III Trial"],
    },
    "Endocrinology": {
        "typical_sample_size": 800,
        "typical_efficacy_rate": 55.0,
        "typical_adverse_rate": 35.0,
        "typical_pvalue": 0.02,
        "median_follow_up": "12 months",
        "common_designs": ["Double-Blind RCT", "Randomized Controlled Trial (RCT)"],
    },
    "Pulmonology": {
        "typical_sample_size": 400,
        "typical_efficacy_rate": 40.0,
        "typical_adverse_rate": 45.0,
        "typical_pvalue": 0.03,
        "median_follow_up": "12 months",
        "common_designs": ["Double-Blind RCT"],
    },
    "Rheumatology": {
        "typical_sample_size": 350,
        "typical_efficacy_rate": 48.0,
        "typical_adverse_rate": 55.0,
        "typical_pvalue": 0.03,
        "median_follow_up": "24 months",
        "common_designs": ["Double-Blind RCT", "Randomized Controlled Trial (RCT)"],
    },
    "Psychiatry": {
        "typical_sample_size": 250,
        "typical_efficacy_rate": 50.0,
        "typical_adverse_rate": 45.0,
        "typical_pvalue": 0.03,
        "median_follow_up": "8 weeks",
        "common_designs": ["Double-Blind RCT"],
    },
    "Gastroenterology": {
        "typical_sample_size": 300,
        "typical_efficacy_rate": 42.0,
        "typical_adverse_rate": 40.0,
        "typical_pvalue": 0.03,
        "median_follow_up": "12 months",
        "common_designs": ["Double-Blind RCT"],
    },
    "General Medicine": {
        "typical_sample_size": 300,
        "typical_efficacy_rate": 45.0,
        "typical_adverse_rate": 40.0,
        "typical_pvalue": 0.04,
        "median_follow_up": "12 months",
        "common_designs": ["Randomized Controlled Trial (RCT)"],
    },
}


def register_paper(paper_id: str, metrics: dict, inflation: dict) -> None:
    REGISTRY[paper_id] = {
        "paper_id": paper_id,
        "disease_area": metrics.get("disease_area", "General Medicine"),
        "study_design": metrics.get("study_design"),
        "sample_size": metrics.get("sample_size"),
        "primary_pvalue": metrics.get("primary_pvalue"),
        "efficacy_rate": metrics.get("efficacy_rate"),
        "adverse_rate": metrics.get("adverse_event_rate"),
        "evidence_score": metrics.get("evidence_quality", {}).get("score"),
        "evidence_rating": metrics.get("evidence_quality", {}).get("rating"),
        "inflation_score": inflation.get("inflation_score", 0),
        "drug_name": metrics.get("drug_name"),
        "blinding": metrics.get("blinding"),
    }


def get_comparison(paper_id: str) -> dict:
    if paper_id not in REGISTRY:
        return {"error": "Paper not registered"}

    entry = REGISTRY[paper_id]
    disease_area = entry.get("disease_area", "General Medicine")
    bench = DISEASE_BENCHMARKS.get(disease_area, DISEASE_BENCHMARKS["General Medicine"])
    peers = [v for k, v in REGISTRY.items() if v.get("disease_area") == disease_area and k != paper_id]

    def vs_bench(val, bench_val, lower_better=False):
        if val is None or bench_val is None:
            return None
        if lower_better:
            status = "better" if val < bench_val else "worse"
            pct = round((bench_val - val) / max(1, bench_val) * 100, 1)
        else:
            status = "better" if val > bench_val else "worse"
            pct = round((val - bench_val) / max(1, bench_val) * 100, 1)
        return {
            "value": val,
            "benchmark": bench_val,
            "status": status,
            "pct_diff": pct,
        }

    comparisons = {
        "sample_size": vs_bench(entry.get("sample_size"), bench["typical_sample_size"]),
        "efficacy_rate": vs_bench(entry.get("efficacy_rate"), bench["typical_efficacy_rate"]),
        "adverse_rate": vs_bench(
            entry.get("adverse_rate"), bench["typical_adverse_rate"], lower_better=True
        ),
        "pvalue": vs_bench(
            entry.get("primary_pvalue"), bench["typical_pvalue"], lower_better=True
        ),
    }

    return {
        "paper_id": paper_id,
        "disease_area": disease_area,
        "benchmark": bench,
        "comparisons": comparisons,
        "peers": peers[:8],
        "all_papers": list(REGISTRY.values()),
    }


def get_all_papers() -> list[dict]:
    return list(REGISTRY.values())
