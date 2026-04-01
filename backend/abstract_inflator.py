import re
import networkx as nx

PAPER_DG: dict[str, dict] = {}

CLAIM_PATTERNS = [
    r"(?:significantly|substantially|markedly|dramatically)\s+"
    r"(?:improved?|reduced?|decreased?|increased?|demonstrated?|showed?)",
    r"(?:superior|better|more\s+effective|highly\s+effective)\s+(?:to|than|compared)",
    r"(?:novel|first|breakthrough|unprecedented)\s+(?:treatment|therapy|approach|finding)",
    r"(?:demonstrated?|showed?|proved?|confirmed?)\s+(?:significant|clear|strong)\s+efficacy",
    r"safe\s+and\s+effective|well\s+tolerated\s+and\s+effective",
    r"(?:promising|encouraging|favorable)\s+(?:results?|outcomes?|profile)",
    r"no\s+(?:significant\s+)?(?:serious\s+)?adverse\s+events?\s+(?:were\s+)?(?:observed|reported|noted)",
    r"(?:cure|curative|disease.free|complete\s+response)\s+(?:was|were|in)\s+\d+",
]

CONTRADICT_PATTERNS = [
    r"did\s+not\s+(?:significantly|substantially)|failed\s+to\s+(?:show|demonstrate|reach)",
    r"no\s+significant\s+difference|not\s+statistically\s+significant",
    r"p\s*[=>]\s*0\.0[5-9]",
    r"(?:however|although|despite|nevertheless|in\s+contrast),?\s+.{10,80}"
    r"(?:did\s+not|was\s+not|were\s+not|failed)",
    r"serious\s+adverse\s+events?\s+(?:occurred|reported|observed)\s+in\s+\d+",
    r"(?:discontinued|withdrew|dropped\s+out)\s+(?:due\s+to|because\s+of)\s+"
    r"(?:adverse|toxicity|side\s+effects?)",
    r"(?:small\s+sample|limited\s+(?:by|sample)|underpowered|pilot\s+study)",
    r"(?:bias|confound|limitation)\s+(?:may|could|should)\s+(?:affect|limit|reduce)",
    r"long.?term\s+(?:safety|efficacy)\s+(?:remains?|is)\s+(?:unknown|unclear|unestablished)",
    r"(?:further\s+(?:studies?|research|trials?)|larger\s+(?:studies?|trials?))\s+"
    r"(?:are\s+)?(?:needed|required|warranted|necessary)",
]

VAGUE_PATTERNS = [
    r"(?:may|might|could)\s+(?:represent|offer|provide)\s+(?:a\s+)?(?:new|novel|promising)",
    r"has\s+(?:the\s+)?potential\s+to\s+(?:improve|transform|revolutionize|change)",
    r"opens?\s+new\s+avenues?|paves?\s+the\s+way|represents?\s+a\s+step\s+forward",
    r"warrants?\s+further\s+(?:investigation|study|research)",
    r"(?:encouraging|promising|favorable)\s+(?:preliminary|initial|early)\s+(?:results?|data|evidence)",
]

CONTRADICTION_RULES = [
    (
        r"significantly\s+(?:improved?|reduced?|decreased?)",
        r"did\s+not\s+significantly|not\s+statistically\s+significant",
    ),
    (
        r"safe\s+and\s+effective|well\s+tolerated",
        r"serious\s+adverse\s+events?|discontinued\s+due\s+to",
    ),
    (
        r"superior\s+(?:to|than)",
        r"no\s+significant\s+difference|failed\s+to\s+demonstrate",
    ),
    (
        r"no\s+serious\s+adverse\s+events?",
        r"serious\s+adverse\s+events?\s+(?:occurred|reported)\s+in\s+\d+",
    ),
    (
        r"(?:complete|partial)\s+response\s+in\s+\d+",
        r"(?:did\s+not\s+reach|failed\s+to\s+meet)\s+(?:primary|the\s+primary)",
    ),
    (
        r"long.?term\s+(?:benefit|efficacy|safety)",
        r"long.?term\s+(?:safety|efficacy)\s+(?:remains?|is)\s+(?:unknown|unclear)",
    ),
    (
        r"significantly\s+reduced?\s+(?:risk|mortality|recurrence)",
        r"p\s*[=>]\s*0\.0[5-9]",
    ),
    (
        r"novel\s+(?:treatment|therapy|approach)",
        r"(?:further\s+studies?|larger\s+trials?)\s+(?:are\s+)?(?:needed|required)",
    ),
]


def _split_sentences(text: str) -> list[str]:
    sents = re.split(r"(?<=[.!?])\s+", text)
    return [s.strip() for s in sents if len(s.strip()) > 20]


def build_discourse_graph(text: str, paper_id: str) -> dict:
    G = nx.DiGraph()
    sentences = _split_sentences(text)
    claims, evidences, vague = [], [], []

    for sent in sentences:
        low = sent.lower()
        is_claim = any(re.search(p, low) for p in CLAIM_PATTERNS)
        is_contra = any(re.search(p, low) for p in CONTRADICT_PATTERNS)
        is_vague = any(re.search(p, low) for p in VAGUE_PATTERNS)

        if is_claim:
            claims.append(sent)
            G.add_node(sent, type="claim")
        if is_contra:
            evidences.append(sent)
            G.add_node(sent, type="evidence")
        if is_vague and not is_claim:
            vague.append(sent)
            G.add_node(sent, type="vague")

    contradictions = []
    for claim in claims:
        for evidence in evidences:
            for c_pat, e_pat in CONTRADICTION_RULES:
                if re.search(c_pat, claim, re.I) and re.search(e_pat, evidence, re.I):
                    G.add_edge(evidence, claim, relation="contradicts")
                    contradictions.append({
                        "claim": claim[:300],
                        "evidence": evidence[:300],
                        "rule": c_pat[:50],
                        "severity": (
                            "high"
                            if any(
                                k in claim.lower()
                                for k in ("safe", "superior", "no adverse", "cure")
                            )
                            else "medium"
                        ),
                    })

    for claim in claims:
        for evidence in evidences:
            if not G.has_edge(evidence, claim):
                cw = set(re.findall(r"\b\w{4,}\b", claim.lower()))
                ew = set(re.findall(r"\b\w{4,}\b", evidence.lower()))
                if len(cw & ew) > 3:
                    G.add_edge(evidence, claim, relation="supports")

    inflation_score = min(100, len(contradictions) * 30 + len(vague) * 5)

    result = {
        "contradictions": contradictions[:20],
        "vague_claims": vague[:15],
        "claims": claims[:20],
        "evidences": evidences[:20],
        "claim_count": len(claims),
        "evidence_count": len(evidences),
        "vague_count": len(vague),
        "contradiction_count": len(contradictions),
        "inflation_score": inflation_score,
        "inflation_level": (
            "HIGH" if inflation_score >= 60
            else "MEDIUM" if inflation_score >= 25
            else "LOW"
        ),
    }
    PAPER_DG[paper_id] = {"graph": G, **result}
    return result


def get_discourse_export(paper_id: str) -> dict:
    if paper_id not in PAPER_DG:
        return {
            "nodes": [], "edges": [], "inflation_score": 0,
            "contradictions": [], "vague_claims": [],
        }
    data = PAPER_DG[paper_id]
    G = data["graph"]
    node_list = list(G.nodes(data=True))
    node_index = {n: i for i, (n, _) in enumerate(node_list)}
    nodes = [
        {"id": i, "label": n[:60], "type": d.get("type", ""), "full": n[:200]}
        for i, (n, d) in enumerate(node_list[:80])
    ]
    edges = [
        {
            "source": node_index[u],
            "target": node_index[v],
            "relation": d.get("relation", ""),
        }
        for u, v, d in G.edges(data=True)
        if u in node_index and v in node_index
    ]
    return {
        "nodes": nodes[:80],
        "edges": edges[:120],
        "inflation_score": data.get("inflation_score", 0),
        "contradictions": data.get("contradictions", []),
        "vague_claims": data.get("vague_claims", []),
        "inflation_level": data.get("inflation_level", "LOW"),
    }
