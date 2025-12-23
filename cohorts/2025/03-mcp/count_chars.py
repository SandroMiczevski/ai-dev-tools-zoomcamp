from server import _fetch_webpage_impl

url = "https://github.com/alexeygrigorev/minsearch"
print(f"Fetching: {url}")

content = _fetch_webpage_impl(url)
char_count = len(content)

print(f"✅ Content retrieved")
print(f"Character count: {char_count:,}")
print(f"\nFirst 500 characters:")
print("-" * 80)
print(content[:500])
print("-" * 80)
