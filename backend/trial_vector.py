import uuid
from config import client, COLLECTION
from qdrant_client.http.models import (
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    FilterSelector,
)

_tok = None
_model = None


def _load():
    global _tok, _model
    if _tok is None:
        from transformers import AutoTokenizer, AutoModel
        _tok = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        _model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        _model.eval()


def _embed(text: str) -> list[float]:
    import torch
    _load()
    tokens = _tok([text], return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        out = _model(**tokens)
    return out.last_hidden_state.mean(dim=1).squeeze().numpy().tolist()


def _embed_batch(texts: list[str]) -> list[list[float]]:
    import torch
    _load()
    tokens = _tok(texts, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        out = _model(**tokens)
    return out.last_hidden_state.mean(dim=1).numpy().tolist()


def index_chunks(chunks: list[dict]) -> int:
    if not chunks:
        return 0
    texts = [c["text"] for c in chunks]
    vectors = _embed_batch(texts)
    points = [
        PointStruct(id=str(uuid.uuid4()), vector=vec, payload=chunk)
        for chunk, vec in zip(chunks, vectors)
    ]
    for i in range(0, len(points), 100):
        client.upsert(collection_name=COLLECTION, points=points[i : i + 100])
    return len(points)


def search(
    query: str,
    k: int = 6,
    paper_id: str = None,
    section: str = None,
) -> list[dict]:
    vec = _embed(query)
    must = []
    if paper_id:
        must.append(FieldCondition(key="paper_id", match=MatchValue(value=paper_id)))
    if section:
        must.append(FieldCondition(key="section", match=MatchValue(value=section)))
    qf = Filter(must=must) if must else None
    resp = client.query_points(
        collection_name=COLLECTION,
        query=vec,
        limit=k,
        query_filter=qf,
        with_payload=True,
    )
    return [pt.payload for pt in resp.points]


def delete_paper(paper_id: str) -> None:
    try:
        client.delete(
            collection_name=COLLECTION,
            points_selector=FilterSelector(
                filter=Filter(
                    must=[FieldCondition(key="paper_id", match=MatchValue(value=paper_id))]
                )
            ),
        )
    except Exception:
        pass
