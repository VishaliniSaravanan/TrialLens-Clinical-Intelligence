import os
from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, Distance

COLLECTION = "triallens"
EMBED_DIM  = 384

DB_PATH = os.environ.get("QDRANT_PATH", os.path.join(os.path.dirname(__file__), "qdrant_db"))
os.makedirs(DB_PATH, exist_ok=True)

client = QdrantClient(path=DB_PATH)


def init_collection():
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION not in existing:
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=EMBED_DIM, distance=Distance.COSINE),
        )


init_collection()
