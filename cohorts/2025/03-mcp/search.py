import os
import requests
import zipfile
import io
from minsearch import Index

ZIP_URL = "https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"
ZIP_NAME = "fastmcp-main.zip"


def download_zip_if_needed(path=ZIP_NAME, url=ZIP_URL):
    if os.path.exists(path):
        print(f"Zip already exists: {path}")
        return path
    print(f"Downloading {url} -> {path}")
    r = requests.get(url, stream=True, timeout=60)
    r.raise_for_status()
    with open(path, "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    print("Download complete")
    return path


def iter_md_files_from_zip(zip_path):
    docs = []
    with zipfile.ZipFile(zip_path, 'r') as z:
        for name in z.namelist():
            if name.endswith('/'):
                continue
            if not (name.lower().endswith('.md') or name.lower().endswith('.mdx')):
                continue
            data = z.read(name)
            try:
                text = data.decode('utf-8')
            except Exception:
                text = data.decode('latin-1', errors='replace')
            # remove first path segment
            if '/' in name:
                _, rest = name.split('/', 1)
            else:
                rest = name
            docs.append({'filename': rest, 'content': text})
    return docs


def build_index(docs):
    # docs: list of {'filename', 'content'}
    index = Index(text_fields=["content"], keyword_fields=["filename"])
    index.fit(docs)
    return index


def search_index(index, query, top_k=5):
    # minsearch Index.search(query, num_results=...) returns list of results
    try:
        results = index.search(query, num_results=top_k)
    except TypeError:
        # fallback: different signature
        results = index.search(query)[:top_k]
    # Normalize result entries: try to extract payload/filename/content
    out = []
    for r in results:
        # r may be dict-like
        if isinstance(r, dict):
            payload = r.get('payload') or r.get('doc') or r
            filename = None
            content = None
            # payload could be the stored document
            if isinstance(payload, dict):
                filename = payload.get('filename')
                content = payload.get('content')
            # fallback to r keys
            if not filename:
                filename = r.get('filename') or (payload.get('filename') if isinstance(payload, dict) else None)
            if not content:
                content = r.get('content') or (payload.get('content') if isinstance(payload, dict) else None)
            out.append({'filename': filename, 'content': content, 'raw': r})
        else:
            out.append({'filename': None, 'content': str(r), 'raw': r})
    return out


if __name__ == '__main__':
    zip_path = download_zip_if_needed()
    docs = iter_md_files_from_zip(zip_path)
    print(f"Found {len(docs)} markdown/mdx files")
    index = build_index(docs)
    q = "demo"
    print(f"Searching for '{q}'...")
    hits = search_index(index, q, top_k=5)
    for i,h in enumerate(hits,1):
        print(f"{i}. {h.get('filename')}: snippet -> { (h.get('content') or '')[:200].replace('\n',' ') }")
