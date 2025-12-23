#!/usr/bin/env python3
"""Test script for the fetch_webpage tool"""

import requests

def fetch_webpage(url: str) -> str:
    """
    Download and extract the content of a web page using Jina Reader API.
    
    Args:
        url: The URL of the web page to fetch
        
    Returns:
        The extracted content of the web page in markdown format
    """
    try:
        # Use Jina Reader API to fetch and parse the webpage
        jina_url = f"https://r.jina.ai/{url}"
        headers = {
            "Accept": "application/json"
        }
        
        response = requests.get(jina_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Extract the content from the response
        data = response.json()
        
        # Try different keys where content might be stored
        content = data.get("content", "") or data.get("data", "") or data.get("text", "")
        
        # If still empty, return the entire JSON for debugging
        if not content:
            # For Jina API, the content might be in a different structure
            if "data" in data and isinstance(data["data"], dict):
                content = data["data"].get("content", str(data))
            else:
                content = str(data)
        
        if isinstance(content, dict):
            content = str(content)
            
        return content
        
    except requests.exceptions.Timeout:
        return f"Error: Request timed out while fetching {url}"
    except requests.exceptions.RequestException as e:
        return f"Error fetching {url}: {str(e)}"
    except ValueError as e:
        return f"Error parsing response from {url}: {str(e)}"

def test_fetch_webpage():
    """Test the fetch_webpage function with a real URL"""
    
    print("Testing fetch_webpage tool...")
    print("=" * 80)
    
    # Test with a simple, reliable URL
    url = "https://example.com"
    print(f"\nFetching content from: {url}")
    print("-" * 80)
    
    result = fetch_webpage(url)
    
    # Check if result is an error or actual content
    if result.startswith("Error"):
        print(f"❌ Test FAILED: {result}")
    else:
        print(f"✅ Test PASSED")
        print(f"\nContent length: {len(result)} characters")
        print(f"\nFirst 500 characters of content:")
        print(result[:500])
        print("\n...")
    
    print("\n" + "=" * 80)
    
    # Test with another URL
    print("\nTesting with GitHub README...")
    print("-" * 80)
    url2 = "https://github.com/astral-sh/uv"
    print(f"Fetching content from: {url2}")
    
    result2 = fetch_webpage(url2)
    
    if result2.startswith("Error"):
        print(f"❌ Test FAILED: {result2}")
    else:
        print(f"✅ Test PASSED")
        print(f"\nContent length: {len(result2)} characters")
        print(f"\nFirst 500 characters of content:")
        print(result2[:500])
        print("\n...")

if __name__ == "__main__":
    test_fetch_webpage()
