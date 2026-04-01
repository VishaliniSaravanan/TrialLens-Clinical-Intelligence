import re


def _find(text: str, patterns: list[str]) -> float | None:
    for pat in patterns:
        m = re.search(pat, text, re.I)
        if m:
            try:
                return float(m.group(1).replace(",", ""))
            except (ValueError, IndexError):
                pass
    return None


def _find_str(text: str, patterns: list[str]) -> str | None:
    for pat in patterns:
        m = re.search(pat, text, re.I)
        if m:
            try:
                return m.group(1).strip()
            except IndexError:
                pass
    return None


def extract_sample_size(text: str) -> int | None:
    v = _find(text, [
        r"n\s*=\s*(\d[\d,]*)",
        r"(\d[\d,]+)\s+(?:patients|participants|subjects|individuals|volunteers)\s+"
        r"(?:were|enrolled|randomized|recruited|included)",
        r"enrolled\s+(\d[\d,]+)",
        r"total\s+of\s+(\d[\d,]+)\s+(?:patients|participants|subjects)",
        r"sample\s+size\s+(?:of\s+)?(\d[\d,]+)",
        r"(\d[\d,]+)\s+(?:patients|participants)\s+were\s+randomized",
    ])
    return int(v) if v else None


def extract_primary_pvalue(text: str) -> float | None:
    patterns = [
        r"p\s*[=<]\s*(0\.\d+)",
        r"p[\s\-]value\s*(?:of\s*|was\s*|=\s*|<\s*)(0\.\d+)",
        r"p\s*<\s*(0\.0+[1-9]\d*)",
    ]
    for pat in patterns:
        m = re.search(pat, text, re.I)
        if m:
            try:
                return float(m.group(1))
            except ValueError:
                pass
    return None


def extract_all_pvalues(text: str) -> list[float]:
    found = re.findall(r"p\s*[=<]\s*(0\.\d+)", text, re.I)
    vals = []
    for f in found:
        try:
            vals.append(float(f))
        except ValueError:
            pass
    return sorted(set(vals))[:10]


def extract_confidence_interval(text: str) -> str | None:
    m = re.search(
        r"(?:95%?\s*)?(?:CI|confidence\s+interval)\s*[:\s]*"
        r"(\d+\.?\d*)\s*(?:to|[-])\s*(\d+\.?\d*)",
        text, re.I,
    )
    if m:
        return f"{m.group(1)}-{m.group(2)}"
    return None


def extract_hazard_ratio(text: str) -> float | None:
    return _find(text, [
        r"hazard\s+ratio\s*(?:of\s*|=\s*|was\s*)?(\d+\.?\d*)",
        r"\bHR\s*[=:]\s*(\d+\.?\d*)",
    ])


def extract_odds_ratio(text: str) -> float | None:
    return _find(text, [
        r"odds\s+ratio\s*(?:of\s*|=\s*|was\s*)?(\d+\.?\d*)",
        r"\bOR\s*[=:]\s*(\d+\.?\d*)",
    ])


def extract_relative_risk(text: str) -> float | None:
    return _find(text, [
        r"relative\s+risk\s*(?:of\s*|=\s*|was\s*)?(\d+\.?\d*)",
        r"\bRR\s*[=:]\s*(\d+\.?\d*)",
        r"risk\s+ratio\s*(?:of\s*|=\s*)?(\d+\.?\d*)",
    ])


def extract_effect_size(text: str) -> float | None:
    return _find(text, [
        r"effect\s+size\s*(?:of\s*|=\s*|was\s*)?(\d+\.?\d*)",
        r"Cohen[s]*\s+d\s*[=:]\s*(\d+\.?\d*)",
        r"standardized\s+mean\s+difference\s*[=:]\s*(\d+\.?\d*)",
    ])


def extract_primary_endpoint(text: str) -> str | None:
    return _find_str(text, [
        r"primary\s+(?:end\s*point|outcome|endpoint)\s+(?:was|were|is)\s+([^.]{10,80})",
        r"primary\s+(?:end\s*point|outcome)\s*:\s*([^.\n]{10,80})",
    ])


def extract_secondary_endpoints(text: str) -> list[str]:
    found = re.findall(
        r"secondary\s+(?:end\s*points?|outcomes?)\s+(?:included?|were|are)\s+([^.]{10,120})",
        text, re.I,
    )
    return [f.strip() for f in found[:5]]


def extract_efficacy_rate(text: str) -> float | None:
    return _find(text, [
        r"(?:overall\s+)?(?:response|efficacy|success)\s+rate\s+(?:of\s+)?(\d+\.?\d*)\s*%",
        r"(\d+\.?\d*)\s*%\s+(?:response|responders|responded)",
        r"(\d+\.?\d*)\s*%\s+reduction\s+in\s+(?:primary|the\s+primary)",
    ])


def extract_adverse_event_rate(text: str) -> float | None:
    return _find(text, [
        r"adverse\s+events?\s+(?:occurred\s+in|reported\s+in|in)\s+(\d+\.?\d*)\s*%",
        r"(\d+\.?\d*)\s*%\s+(?:of\s+patients\s+)?experienced\s+adverse",
        r"(?:any\s+)?adverse\s+events?\s*[:\s]*(\d+\.?\d*)\s*%",
    ])


def extract_serious_adverse_rate(text: str) -> float | None:
    return _find(text, [
        r"serious\s+adverse\s+events?\s+(?:in|occurred\s+in)\s+(\d+\.?\d*)\s*%",
        r"(\d+\.?\d*)\s*%\s+(?:of\s+(?:patients|participants)\s+)?(?:had\s+)?serious\s+adverse",
        r"SAE[s]?\s*[:\s]*(\d+\.?\d*)\s*%",
    ])


def extract_discontinuation_rate(text: str) -> float | None:
    return _find(text, [
        r"discontinued\s+(?:treatment\s+)?(?:due\s+to\s+)?(?:adverse\s+events?)?\s*"
        r"(?:in|at)\s+(\d+\.?\d*)\s*%",
        r"(?:withdrawal|discontinuation)\s+rate\s+(?:of\s+)?(\d+\.?\d*)\s*%",
        r"(\d+\.?\d*)\s*%\s+withdrew\s+(?:from|due\s+to)",
    ])


def extract_study_design(text: str) -> str:
    lower = text.lower()
    if "randomized controlled" in lower or "randomised controlled" in lower:
        return "Randomized Controlled Trial (RCT)"
    if "double blind" in lower or "double-blind" in lower:
        return "Double-Blind RCT"
    if "open label" in lower or "open-label" in lower:
        return "Open-Label Trial"
    if "phase 3" in lower or "phase iii" in lower:
        return "Phase III Trial"
    if "phase 2" in lower or "phase ii" in lower:
        return "Phase II Trial"
    if "phase 1" in lower or "phase i" in lower:
        return "Phase I Trial"
    if "meta-analysis" in lower or "meta analysis" in lower:
        return "Meta-Analysis"
    if "systematic review" in lower:
        return "Systematic Review"
    if "cohort" in lower:
        return "Cohort Study"
    if "case-control" in lower or "case control" in lower:
        return "Case-Control Study"
    if "observational" in lower:
        return "Observational Study"
    return "Not Specified"


def extract_blinding(text: str) -> str:
    lower = text.lower()
    if "double blind" in lower or "double-blind" in lower:
        return "Double-blind"
    if "single blind" in lower or "single-blind" in lower:
        return "Single-blind"
    if "triple blind" in lower or "triple-blind" in lower:
        return "Triple-blind"
    if "open label" in lower or "unblinded" in lower:
        return "Open-label (unblinded)"
    return "Not reported"


def extract_follow_up_duration(text: str) -> str | None:
    return _find_str(text, [
        r"follow.?up\s+(?:period\s+)?(?:of\s+)?(\d+\s*(?:weeks?|months?|years?))",
        r"followed\s+(?:up\s+)?for\s+(\d+\s*(?:weeks?|months?|years?))",
        r"median\s+follow.?up\s+(?:of\s+)?(\d+\.?\d*\s*(?:weeks?|months?|years?))",
    ])


def extract_drug_name(text: str) -> str | None:
    m = re.search(
        r"(?:treated\s+with|received|administered|treatment\s+with|drug\s+name[:\s]+)"
        r"\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
        text,
    )
    if m:
        return m.group(1).strip()
    return None


def extract_dosage(text: str) -> str | None:
    return _find_str(text, [
        r"(\d+\s*(?:mg|mcg|g|ml|IU)(?:\s*/\s*(?:day|kg|week|dose))?)",
    ])


def extract_comparator(text: str) -> str | None:
    return _find_str(text, [
        r"compared\s+(?:to|with|against)\s+([A-Za-z][A-Za-z\s]+?)(?:\s+in|\s+for|\.|,)",
        r"(?:vs\.?|versus)\s+([A-Za-z][A-Za-z\s]+?)(?:\s+in|\s+for|\.|,)",
    ])


def extract_disease_area(text: str) -> str:
    lower = text.lower()
    AREAS = {
        "Oncology": [
            "cancer", "tumor", "tumour", "oncology", "carcinoma",
            "lymphoma", "leukemia", "melanoma", "chemotherapy",
        ],
        "Cardiology": [
            "cardiovascular", "cardiac", "heart failure", "hypertension",
            "myocardial", "atrial fibrillation", "stroke",
        ],
        "Neurology": [
            "alzheimer", "parkinson", "multiple sclerosis", "epilepsy",
            "dementia", "neurological", "migraine",
        ],
        "Infectious Disease": [
            "covid", "hiv", "hepatitis", "tuberculosis", "influenza",
            "antibiotic", "antiviral", "infection", "bacterial",
        ],
        "Endocrinology": [
            "diabetes", "insulin", "glycemic", "thyroid", "obesity",
            "metabolic syndrome",
        ],
        "Pulmonology": [
            "asthma", "copd", "respiratory", "pulmonary", "lung",
        ],
        "Rheumatology": [
            "arthritis", "rheumatoid", "lupus", "autoimmune", "inflammatory",
        ],
        "Psychiatry": [
            "depression", "anxiety", "schizophrenia", "bipolar",
            "psychiatric", "antidepressant",
        ],
        "Gastroenterology": [
            "crohn", "colitis", "ibd", "gastric", "hepatic", "liver",
        ],
    }
    best, best_count = "General Medicine", 0
    for area, keywords in AREAS.items():
        count = sum(1 for kw in keywords if kw in lower)
        if count > best_count:
            best_count = count
            best = area
    return best


def score_evidence_quality(metrics: dict) -> dict:
    design = metrics.get("study_design", "")
    design_scores = {
        "Systematic Review": 95,
        "Meta-Analysis": 95,
        "Double-Blind RCT": 90,
        "Randomized Controlled Trial (RCT)": 85,
        "Phase III Trial": 80,
        "Open-Label Trial": 65,
        "Phase II Trial": 60,
        "Cohort Study": 55,
        "Case-Control Study": 45,
        "Phase I Trial": 40,
        "Observational Study": 35,
    }
    score = float(design_scores.get(design, 50))

    if "Double-blind" in metrics.get("blinding", ""):
        score = min(100.0, score + 5)

    n = metrics.get("sample_size")
    if n:
        if n >= 1000:
            score = min(100.0, score + 8)
        elif n >= 500:
            score = min(100.0, score + 5)
        elif n >= 100:
            score = min(100.0, score + 2)
        elif n < 30:
            score = max(0.0, score - 10)

    pv = metrics.get("primary_pvalue")
    if pv is not None:
        if pv < 0.001:
            score = min(100.0, score + 5)
        elif pv < 0.05:
            score = min(100.0, score + 2)
        elif pv >= 0.05:
            score = max(0.0, score - 10)

    if metrics.get("adverse_event_rate") is not None:
        score = min(100.0, score + 3)

    level = (
        "1a" if score >= 90
        else "1b" if score >= 80
        else "2a" if score >= 70
        else "2b" if score >= 60
        else "3" if score >= 50
        else "4"
    )
    labels = {
        "1a": "Systematic Review / Meta-Analysis",
        "1b": "High-quality RCT",
        "2a": "Well-designed RCT",
        "2b": "Lower-quality RCT",
        "3": "Cohort / Case-Control",
        "4": "Case series / Expert opinion",
    }
    rating = "A" if score >= 80 else "B" if score >= 65 else "C" if score >= 50 else "D"

    return {
        "score": round(score, 1),
        "level": level,
        "label": labels.get(level, "Unknown"),
        "rating": rating,
    }


def extract_all(text: str) -> dict:
    metrics = {
        "sample_size": extract_sample_size(text),
        "primary_pvalue": extract_primary_pvalue(text),
        "all_pvalues": extract_all_pvalues(text),
        "confidence_interval": extract_confidence_interval(text),
        "hazard_ratio": extract_hazard_ratio(text),
        "odds_ratio": extract_odds_ratio(text),
        "relative_risk": extract_relative_risk(text),
        "effect_size": extract_effect_size(text),
        "primary_endpoint": extract_primary_endpoint(text),
        "secondary_endpoints": extract_secondary_endpoints(text),
        "efficacy_rate": extract_efficacy_rate(text),
        "adverse_event_rate": extract_adverse_event_rate(text),
        "serious_adverse_rate": extract_serious_adverse_rate(text),
        "discontinuation_rate": extract_discontinuation_rate(text),
        "study_design": extract_study_design(text),
        "blinding": extract_blinding(text),
        "follow_up_duration": extract_follow_up_duration(text),
        "drug_name": extract_drug_name(text),
        "dosage": extract_dosage(text),
        "comparator": extract_comparator(text),
        "disease_area": extract_disease_area(text),
    }
    metrics["evidence_quality"] = score_evidence_quality(metrics)
    return metrics
