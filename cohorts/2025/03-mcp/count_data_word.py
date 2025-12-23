from server import _fetch_webpage_impl

url = "https://datatalks.club/"
print(f"Fetching: {url}")
print("=" * 80)

content = _fetch_webpage_impl(url)

# Count occurrences of "data" (case-insensitive)
count_lower = content.lower().count("data")
count_exact = content.count("data")
count_Data = content.count("Data")
count_DATA = content.count("DATA")

print(f"\n✅ Content retrieved ({len(content)} characters)")
print(f"\nWord count for 'data':")
print(f"  - Case-insensitive 'data': {count_lower} occurrences")
print(f"  - Exact 'data': {count_exact}")
print(f"  - 'Data' (capitalized): {count_Data}")
print(f"  - 'DATA' (all caps): {count_DATA}")

# Show some context snippets
import re
pattern = re.compile(r'.{0,50}data.{0,50}', re.IGNORECASE)
matches = pattern.findall(content)

if matches:
    print(f"\n📌 Sample matches (showing first 5):")
    for i, match in enumerate(matches[:5], 1):
        print(f"  {i}. ...{match}...")
