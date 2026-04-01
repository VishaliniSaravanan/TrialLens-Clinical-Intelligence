from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import traceback
import os
import io
import re
import requests as req_lib

app = Flask(__name__)
CORS(app)

MAX_FILE_SIZE_MB = 50
MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE

LOCAL_LIBRARY_FOLDER = os.environ.get(
    "TRIAL_LIBRARY_PATH",
    os.path.join(os.path.dirname(__file__), "trial_papers"),
)

SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".html", ".docx"}
ANALYZED: dict[str, dict] = {}

CLINICAL_KEYWORDS = [
    "clinical trial", "randomized", "randomised", "patients", "placebo",
    "efficacy", "adverse", "p-value", "p value", "confidence interval",
    "sample size", "methodology", "treatment", "therapy", "drug",
    "outcomes", "endpoint", "blinded", "cohort", "abstract",
    "results", "discussion", "conclusion", "statistical", "dose", "safety",
    "participants", "phase", "protocol", "enrollment", "follow-up",
]


def _ext(filename: str) -> str:
    return os.path.splitext(filename.lower())[1]


def _friendly(filename: str) -> str:
    n = os.path.splitext(filename)[0]
    n = re.sub(r"[_\-]+", " ", n)
    return re.sub(r"\s+", " ", n).strip()


def _validate_paper(text: str) -> tuple[bool, str]:
    lower = text.lower()
    hits = [kw for kw in CLINICAL_KEYWORDS if kw in lower]
    if len(hits) < 4:
        return False, (
            f"Only {len(hits)} clinical research keyword(s) found. "
            "Please upload a clinical trial paper or medical research article."
        )
    return True, f"Clinical paper confirmed ({len(hits)} keywords matched)."


def _parse_html_bytes(file_bytes: bytes) -> str:
    from html.parser import HTMLParser

    class _E(HTMLParser):
        def __init__(self):
            super().__init__()
            self.parts = []
            self._skip = False

        def handle_starttag(self, tag, _):
            if tag in ("script", "style", "head", "nav", "footer"):
                self._skip = True
            if tag in ("p", "h1", "h2", "h3", "h4", "li", "tr", "div"):
                self.parts.append("\n")

        def handle_endtag(self, tag):
            if tag in ("script", "style", "head", "nav", "footer"):
                self._skip = False

        def handle_data(self, data):
            if not self._skip and data.strip():
                self.parts.append(data)

    p = _E()
    p.feed(file_bytes.decode("utf-8", errors="replace"))
    return " ".join(p.parts)


def _bytes_to_doc(file_bytes: bytes, filename: str) -> tuple[str, dict]:
    ext = _ext(filename)

    if ext == ".pdf":
        from trial_parser import extract_document
        doc = extract_document(file_bytes)
        return doc["full_text"], doc

    if ext in (".docx", ".doc"):
        try:
            import docx as docx_lib
            d = docx_lib.Document(io.BytesIO(file_bytes))
            text = "\n".join(p.text.strip() for p in d.paragraphs if p.text.strip())
        except ImportError:
            import zipfile
            try:
                with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
                    xml = z.read("word/document.xml").decode("utf-8", errors="ignore")
                text = " ".join(re.findall(r"<w:t[^>]*>([^<]+)</w:t>", xml))
            except Exception:
                text = file_bytes.decode("utf-8", errors="ignore")
        return text, _wrap_text(text, filename)

    if ext == ".html":
        text = _parse_html_bytes(file_bytes)
        return text, _wrap_text(text, filename)

    for enc in ("utf-8", "latin-1", "cp1252"):
        try:
            text = file_bytes.decode(enc)
            return text, _wrap_text(text, filename)
        except UnicodeDecodeError:
            pass
    text = file_bytes.decode("utf-8", errors="replace")
    return text, _wrap_text(text, filename)


def _wrap_text(full_text: str, filename: str) -> dict:
    from trial_parser import detect_section

    words = full_text.split()
    chunk_size = 500
    pages = []
    for i in range(0, max(1, len(words)), chunk_size):
        chunk = " ".join(words[i : i + chunk_size])
        pages.append({
            "page": len(pages) + 1,
            "text": chunk,
            "section": detect_section(chunk),
            "tables": [],
            "char_count": len(chunk),
        })
    if not pages:
        pages = [{"page": 1, "text": "", "section": "general", "tables": [], "char_count": 0}]
    return {
        "full_text": full_text,
        "pages": pages,
        "tables": [],
        "metadata": {
            "page_count": len(pages),
            "total_chars": len(full_text),
            "table_count": 0,
            "title": filename,
            "author": "",
            "created": "",
        },
    }


def _run_pipeline(full_text: str, doc: dict, paper_id: str, disease_area: str, ext: str):
    from trial_chunker import semantic_chunk
    chunks = semantic_chunk(doc["pages"], paper_id, disease_area)

    from trial_vector import delete_paper, index_chunks
    delete_paper(paper_id)
    indexed = index_chunks(chunks)

    from trial_hyperrag import build_graph
    build_graph(chunks, paper_id)

    from trial_metrics import extract_all
    metrics = extract_all(full_text)

    from abstract_inflator import build_discourse_graph
    inflation = build_discourse_graph(full_text, paper_id)

    from trial_compare import register_paper
    register_paper(paper_id, metrics, inflation)

    result = {
        "success": True,
        "paper_id": paper_id,
        "disease_area": disease_area,
        "file_format": ext,
        "page_count": doc["metadata"]["page_count"],
        "chunk_count": len(chunks),
        "indexed_count": indexed,
        "table_count": doc["metadata"]["table_count"],
        "metrics": metrics,
        "inflation": inflation,
        "_fullText": full_text[:120000],
    }
    ANALYZED[paper_id] = result
    return jsonify(result)


@app.errorhandler(413)
def too_large(_):
    return jsonify({"error": f"File too large. Maximum {MAX_FILE_SIZE_MB} MB."}), 413


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "version": "1.0", "app": "TrialLens"})


@app.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        file = request.files.get("file")
        paper_id = request.form.get("paper_id", "").strip()
        disease_area = request.form.get("disease_area", "General Medicine").strip()

        if not file:
            return jsonify({"error": "No file uploaded"}), 400
        if not paper_id:
            return jsonify({"error": "Paper ID / title required"}), 400

        filename = file.filename or "paper.pdf"
        file_bytes = file.read()

        if len(file_bytes) > MAX_FILE_SIZE:
            return jsonify({"error": f"File too large. Maximum {MAX_FILE_SIZE_MB} MB."}), 413

        extension = _ext(filename)
        if extension not in SUPPORTED_EXTENSIONS:
            return jsonify({
                "error": f'Unsupported format "{extension}". Accepted: .pdf .txt .html .docx'
            }), 415

        full_text, doc = _bytes_to_doc(file_bytes, filename)

        ok, reason = _validate_paper(full_text)
        if not ok:
            return jsonify({
                "error": "Please upload a clinical trial paper. " + reason,
                "validation": False,
            }), 422

        return _run_pipeline(full_text, doc, paper_id, disease_area, extension)

    except Exception as e:
        traceback.print_exc()
        err = str(e)
        if "EOF" in err or "cannot identify" in err:
            err = "The PDF appears corrupted or empty."
        elif "password" in err.lower() or "encrypted" in err.lower():
            err = "The PDF is password-protected. Please upload an unlocked version."
        return jsonify({"error": err}), 500


@app.route("/api/library")
def library():
    folder = LOCAL_LIBRARY_FOLDER
    os.makedirs(folder, exist_ok=True)
    files = []
    for fname in sorted(os.listdir(folder)):
        ext = _ext(fname)
        if ext not in SUPPORTED_EXTENSIONS:
            continue
        size_mb = round(os.path.getsize(os.path.join(folder, fname)) / 1024 / 1024, 2)
        files.append({
            "filename": fname,
            "paper_name": _friendly(fname),
            "size_mb": size_mb,
            "ext": ext,
        })
    return jsonify({"files": files, "folder": folder})


@app.route("/api/library/analyze", methods=["POST"])
def library_analyze():
    data = request.json or {}
    filename = data.get("filename", "").strip()
    disease_area = data.get("disease_area", "General Medicine").strip()

    if not filename:
        return jsonify({"error": "filename required"}), 400

    safe = os.path.basename(filename)
    path = os.path.join(LOCAL_LIBRARY_FOLDER, safe)

    if not os.path.isfile(path):
        return jsonify({"error": f"File not found: {safe}"}), 404

    paper_id = _friendly(safe)
    ext = _ext(safe)

    try:
        with open(path, "rb") as f:
            file_bytes = f.read()

        if len(file_bytes) > MAX_FILE_SIZE:
            return jsonify({"error": f"File too large ({len(file_bytes)//1024//1024} MB)."}), 413

        full_text, doc = _bytes_to_doc(file_bytes, safe)

        ok, reason = _validate_paper(full_text)
        if not ok:
            return jsonify({
                "error": "Not a clinical paper. " + reason,
                "validation": False,
            }), 422

        return _run_pipeline(full_text, doc, paper_id, disease_area, ext)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/fetch_paper")
def fetch_paper():
    url = request.args.get("url", "").strip()
    if not url:
        return jsonify({"error": "url required"}), 400
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (TrialLens/1.0)",
            "Accept": "application/pdf,text/html,*/*",
        }
        r = req_lib.get(url, headers=headers, timeout=30, stream=True, allow_redirects=True)

        if r.status_code == 404:
            return jsonify({"error": "Page not found (404)."}), 404
        if r.status_code in (401, 403):
            return jsonify({"error": f"Access denied ({r.status_code})."}), 403
        if r.status_code >= 400:
            return jsonify({"error": f"HTTP {r.status_code}"}), 502

        ct = r.headers.get("Content-Type", "").lower()
        chunks_data = []
        total = 0

        for chunk in r.iter_content(65536):
            total += len(chunk)
            if total > MAX_FILE_SIZE:
                return jsonify({"error": "Remote file too large."}), 413
            chunks_data.append(chunk)

        file_bytes = b"".join(chunks_data)

        if "html" in ct and ".pdf" not in url.lower():
            html_text = file_bytes.decode("utf-8", errors="replace")
            ESG_HINTS = [
                "clinical", "trial", "study", "research", "paper", "pdf",
                "journal", "abstract", "pubmed",
            ]
            hrefs = re.findall(r'href=["\']([^"\']+)["\']', html_text, re.I)
            scored = []
            for href in hrefs:
                hl = href.lower()
                if ".pdf" not in hl:
                    continue
                score = sum(1 for h in ESG_HINTS if h in hl)
                if score > 0:
                    scored.append((score, href))

            if scored:
                from urllib.parse import urljoin
                scored.sort(key=lambda x: -x[0])
                pdf_url = urljoin(url, scored[0][1])
                r2 = req_lib.get(pdf_url, headers=headers, timeout=30,
                                 stream=True, allow_redirects=True)
                if r2.status_code == 200:
                    pdf_chunks = []
                    pt = 0
                    for chunk in r2.iter_content(65536):
                        pt += len(chunk)
                        if pt > MAX_FILE_SIZE:
                            break
                        pdf_chunks.append(chunk)
                    file_bytes = b"".join(pdf_chunks)
                    fname = pdf_url.rstrip("/").split("/")[-1].split("?")[0] or "paper.pdf"
                    return Response(
                        file_bytes,
                        content_type="application/pdf",
                        headers={
                            "Content-Disposition": f'attachment; filename="{fname}"',
                            "X-Detected-Filename": fname,
                        },
                    )

        fname = url.rstrip("/").split("/")[-1].split("?")[0] or "paper.pdf"
        return Response(
            file_bytes,
            content_type=ct or "application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{fname}"',
                "X-Detected-Filename": fname,
            },
        )

    except req_lib.exceptions.Timeout:
        return jsonify({"error": "Request timed out (30 s)."}), 504
    except req_lib.exceptions.ConnectionError as e:
        return jsonify({"error": f"Cannot connect: {e}"}), 502
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/query", methods=["POST"])
def query():
    try:
        data = request.json or {}
        question = data.get("question", "").strip()
        paper_id = data.get("paper_id") or None
        section = data.get("section") or None

        if not question:
            return jsonify({"error": "No question provided"}), 400

        from trial_hyperrag import hyperrag_query
        chunks = hyperrag_query(question, paper_id, k=5)

        if not chunks:
            return jsonify({"answer": "No relevant information found.", "chunks": [], "chunk_count": 0})

        parts = [
            f'[{c.get("section", "").upper()} | Page {c.get("page", "")}]\n{c.get("text", "")}'
            for c in chunks
        ]
        return jsonify({
            "answer": "\n\n---\n\n".join(parts),
            "chunks": chunks,
            "chunk_count": len(chunks),
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/inflation/<paper_id>")
def inflation(paper_id):
    try:
        from abstract_inflator import get_discourse_export
        return jsonify(get_discourse_export(paper_id))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/compare/<paper_id>")
def compare(paper_id):
    try:
        from trial_compare import get_comparison
        return jsonify(get_comparison(paper_id))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/graph/<paper_id>")
def graph(paper_id):
    try:
        from trial_hyperrag import get_graph_export
        return jsonify(get_graph_export(paper_id))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/papers")
def papers():
    return jsonify({
        "papers": list(ANALYZED.keys()),
        "details": {
            k: {
                "disease_area": v.get("metrics", {}).get("disease_area"),
                "study_design": v.get("metrics", {}).get("study_design"),
                "evidence_rating": v.get("metrics", {}).get("evidence_quality", {}).get("rating"),
                "sample_size": v.get("metrics", {}).get("sample_size"),
            }
            for k, v in ANALYZED.items()
        },
    })


@app.route("/api/paper_text/<paper_id>")
def paper_text(paper_id):
    if paper_id not in ANALYZED:
        return jsonify({"error": "Not analyzed"}), 404
    return jsonify({"paper_id": paper_id, "text": ANALYZED[paper_id].get("_fullText", "")})


if __name__ == "__main__":
    app.run(debug=True, port=5002, use_reloader=False)
