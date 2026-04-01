import re
from trial_parser import detect_section

TARGET_MAX = 600


def _approx_tokens(text: str) -> int:
    return max(1, len(text) // 4)


def semantic_chunk(pages: list[dict], paper_id: str, disease_area: str) -> list[dict]:
    chunks = []
    section_buffers: dict[str, list] = {}

    for page in pages:
        sec = page["section"]
        if sec not in section_buffers:
            section_buffers[sec] = []
        section_buffers[sec].append({
            "page": page["page"],
            "text": page["text"],
            "tables": page["tables"],
        })

    for section, page_group in section_buffers.items():
        for pg in page_group:
            for table in pg["tables"]:
                ttext = table["text"].strip()
                if len(ttext) > 30:
                    chunks.append({
                        "text": f"[TABLE] {ttext}",
                        "section": section,
                        "page": pg["page"],
                        "paper_id": paper_id,
                        "disease_area": disease_area,
                        "chunk_type": "table",
                    })

        combined = " ".join(pg["text"] for pg in page_group)
        sentences = re.split(r"(?<=[.!?])\s+", combined)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 15]
        buffer = []
        buffer_len = 0
        start_page = page_group[0]["page"] if page_group else 1

        for sent in sentences:
            sl = _approx_tokens(sent)
            if buffer_len + sl > TARGET_MAX and buffer:
                ct = " ".join(buffer).strip()
                if len(ct) > 50:
                    chunks.append({
                        "text": ct,
                        "section": section,
                        "page": start_page,
                        "paper_id": paper_id,
                        "disease_area": disease_area,
                        "chunk_type": "text",
                    })
                buffer = [sent]
                buffer_len = sl
            else:
                buffer.append(sent)
                buffer_len += sl

        if buffer:
            ct = " ".join(buffer).strip()
            if len(ct) > 50:
                chunks.append({
                    "text": ct,
                    "section": section,
                    "page": start_page,
                    "paper_id": paper_id,
                    "disease_area": disease_area,
                    "chunk_type": "text",
                })

    return chunks
