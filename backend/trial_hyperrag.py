import networkx as nx
from trial_vector import search

PAPER_GRAPHS: dict[str, nx.Graph] = {}
PAPER_CHUNKS: dict[str, list[dict]] = {}

RELATED_SECTIONS = {
    ("methods", "results"): 0.9,
    ("methods", "statistics"): 0.85,
    ("abstract", "results"): 0.9,
    ("abstract", "conclusion"): 0.8,
    ("results", "discussion"): 0.85,
    ("results", "adverse"): 0.8,
    ("statistics", "results"): 0.9,
    ("introduction", "conclusion"): 0.7,
}


def build_graph(chunks: list[dict], paper_id: str) -> None:
    G = nx.Graph()
    for i, chunk in enumerate(chunks):
        G.add_node(
            i,
            text=chunk["text"],
            section=chunk.get("section", ""),
            page=chunk.get("page", 0),
        )

    sec_idx: dict[str, list[int]] = {}
    for i, chunk in enumerate(chunks):
        sec = chunk.get("section", "general")
        sec_idx.setdefault(sec, []).append(i)

    for sec, indices in sec_idx.items():
        for j in range(len(indices) - 1):
            G.add_edge(indices[j], indices[j + 1], weight=1.0, relation="sequential")

    for (s1, s2), w in RELATED_SECTIONS.items():
        n1s = [i for i, c in enumerate(chunks) if c.get("section") == s1][:3]
        n2s = [i for i, c in enumerate(chunks) if c.get("section") == s2][:3]
        for n1 in n1s:
            for n2 in n2s:
                G.add_edge(n1, n2, weight=w, relation="cross_section")

    PAPER_GRAPHS[paper_id] = G
    PAPER_CHUNKS[paper_id] = chunks


def hyperrag_query(query: str, paper_id: str = None, k: int = 4) -> list[dict]:
    hits = search(query, k=k, paper_id=paper_id)
    seen: set[str] = set()
    context: list[dict] = []

    for h in hits:
        t = h.get("text", "")
        if t and t not in seen:
            seen.add(t)
            context.append(h)

    if paper_id and paper_id in PAPER_GRAPHS:
        G = PAPER_GRAPHS[paper_id]
        chunks = PAPER_CHUNKS[paper_id]
        t2i = {c["text"]: i for i, c in enumerate(chunks)}
        init_nodes = [t2i[h["text"]] for h in hits if h.get("text") in t2i]
        expanded = set(init_nodes)

        for node in init_nodes:
            if node in G:
                for nb in G.neighbors(node):
                    if nb not in expanded and len(expanded) < k + 8:
                        expanded.add(nb)
                        nt = chunks[nb]["text"] if nb < len(chunks) else ""
                        if nt and nt not in seen:
                            seen.add(nt)
                            context.append(chunks[nb])

    return context[:8]


def get_graph_export(paper_id: str) -> dict:
    if paper_id not in PAPER_GRAPHS:
        return {"nodes": [], "edges": []}
    G = PAPER_GRAPHS[paper_id]
    chunks = PAPER_CHUNKS.get(paper_id, [])
    nodes = [
        {
            "id": nid,
            "label": f"C{nid}",
            "section": d.get("section", ""),
            "text": d.get("text", "")[:100],
            "page": d.get("page", 0),
        }
        for nid, d in list(G.nodes(data=True))[:80]
    ]
    edges = [
        {
            "source": u,
            "target": v,
            "relation": d.get("relation", ""),
            "weight": d.get("weight", 1.0),
        }
        for u, v, d in list(G.edges(data=True))[:150]
    ]
    return {"nodes": nodes, "edges": edges}
