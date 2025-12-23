"""Simple MCP client wrappers to call FastMCP FunctionTool objects synchronously.

This module imports the tool objects from `server.py` and exposes easy-to-use
synchronous functions for the assistant or other scripts to call.
"""
import asyncio
from typing import Any, Dict

import server


def _run_tool(tool, args: Any):
    """Run a FastMCP FunctionTool synchronously.

    Args may be:
    - a dict of argument name -> value
    - a list/tuple of positional args

    Returns the ToolResult object from FastMCP; caller can inspect `.content`.
    """
    if isinstance(args, (list, tuple)):
        payload = list(args)
    elif isinstance(args, dict):
        payload = args
    else:
        # single value -> pass as the first positional argument
        payload = {"url": args} if isinstance(args, str) else [args]

    return asyncio.run(tool.run(payload))


def fetch_webpage(url: str) -> str:
    """Fetch a web page using the `fetch_webpage` MCP tool and return the text content.

    Returns the plain string content (prefers `.content`, then `.structured_content`, else str(ToolResult)).
    """
    tool = server.fetch_webpage
    result = _run_tool(tool, {"url": url})

    # Prefer `.content`, fall back to `.structured_content` or `.meta` as string
    text = getattr(result, "content", None)
    if text is None:
        text = getattr(result, "structured_content", None)
    if text is None:
        text = getattr(result, "meta", None)
    if text is None:
        text = str(result)

    # If structured content is a list/dict, convert to string
    if isinstance(text, list):
        text = "\n\n".join(map(str, text))
    elif isinstance(text, dict):
        import json

        text = json.dumps(text, ensure_ascii=False, indent=2)

    return text


def call_tool(tool_name: str, args: Any) -> Any:
    """Generic caller that looks up a tool on `server` by name and runs it.

    Returns the raw ToolResult object.
    """
    tool = getattr(server, tool_name, None)
    if tool is None:
        raise AttributeError(f"No tool named {tool_name} in server module")
    return _run_tool(tool, args)
