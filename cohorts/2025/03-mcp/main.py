import os
import pickle
from server import _fetch_webpage_impl
from search import download_zip_if_needed, iter_md_files_from_zip, build_index, search_index

# Global index cache
_INDEX = None
INDEX_CACHE_FILE = "fastmcp_index.pkl"


def load_or_build_index():
    """Load cached index or build fresh from zip."""
    global _INDEX
    if _INDEX is not None:
        return _INDEX
    
    # Try loading from cache
    if os.path.exists(INDEX_CACHE_FILE):
        print(f"Loading cached index from {INDEX_CACHE_FILE}...")
        with open(INDEX_CACHE_FILE, "rb") as f:
            _INDEX = pickle.load(f)
        return _INDEX
    
    # Build fresh
    print("Building index from fastmcp zip...")
    zip_path = download_zip_if_needed()
    docs = iter_md_files_from_zip(zip_path)
    print(f"Found {len(docs)} markdown/mdx files")
    _INDEX = build_index(docs)
    
    # Cache for next time
    with open(INDEX_CACHE_FILE, "wb") as f:
        pickle.dump(_INDEX, f)
    print(f"Cached index to {INDEX_CACHE_FILE}")
    return _INDEX


def search_fastmcp_docs(query: str, top_k: int = 5) -> str:
    """Search FastMCP documentation and return formatted results."""
    index = load_or_build_index()
    hits = search_index(index, query, top_k=top_k)
    
    result_lines = [f"Found {len(hits)} results for '{query}':\n"]
    for i, h in enumerate(hits, 1):
        filename = h.get('filename') or 'unknown'
        content = (h.get('content') or '')[:300].replace('\n', ' ')
        result_lines.append(f"{i}. {filename}")
        result_lines.append(f"   Snippet: {content}")
        result_lines.append("")
    
    return "\n".join(result_lines)


def fetch_webpage_tool(url: str = "https://github.com/alexeygrigorev/minsearch"):
    """Fetch web page and return character count."""
    print(f"Fetching content from: {url}")
    print("-" * 80)
    
    result = _fetch_webpage_impl(url)
    char_count = len(result)
    
    print(f"✅ Content retrieved")
    print(f"Character count: {char_count:,}")
    print(f"\nFirst 300 characters:")
    print(result[:300])
    return f"Fetched {char_count} characters"


def main():
    print("Hello from 03-mcp!")
    print("\n" + "=" * 80)
    print("TOOL: Search FastMCP documentation")
    print("=" * 80)
    query = "fastmcp server"
    print(f"\nSearching for: '{query}'")
    results = search_fastmcp_docs(query, top_k=5)
    print(results)


if __name__ == "__main__":
    main()

