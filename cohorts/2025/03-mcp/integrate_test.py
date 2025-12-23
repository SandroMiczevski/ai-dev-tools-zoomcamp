from mcp_client import fetch_webpage

url = "https://datatalks.club/"
print(f"Fetching via mcp_client.fetch_webpage: {url}")
text = fetch_webpage(url)
print(f"Length: {len(text)} chars")
print("Occurrences of 'data' (case-insensitive):", text.lower().count('data'))
