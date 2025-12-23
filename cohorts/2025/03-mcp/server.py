# server.py
from fastmcp import FastMCP
import requests

mcp = FastMCP("Demo 🚀")

def _fetch_webpage_impl(url: str) -> str:
    """
    Core implementation: Download and extract the content of a web page using Jina Reader API.
    
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

@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool
def fetch_webpage(url: str) -> str:
    """
    Download and extract the content of a web page using Jina Reader API.
    
    Args:
        url: The URL of the web page to fetch
        
    Returns:
        The extracted content of the web page
    """
    return _fetch_webpage_impl(url)

if __name__ == "__main__":
    mcp.run()