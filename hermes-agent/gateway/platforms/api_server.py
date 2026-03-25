"""
OpenAI-compatible API server platform adapter.
Exposes an HTTP server for Hermes OS.
"""
import asyncio
import json
import logging
import os
import sqlite3
import time
import uuid
from typing import Any, Dict, List, Optional

try:
    from aiohttp import web
    AIOHTTP_AVAILABLE = True
except ImportError:
    AIOHTTP_AVAILABLE = False
    web = None

logger = logging.getLogger(__name__)

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8642

async def chat_completions(request):
    data = await request.json()
    logger.info(f"Chat request: {data}")
    response_data = {
        "id": f"chatcmpl-{uuid.uuid4()}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": "hermes-agent",
        "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hermes Agent Backend connected and alive."}, "finish_reason": "stop"}]
    }
    return web.json_response(response_data)

async def health_check(request):
    return web.json_response({"status": "ok", "agent": "hermes-agent-x"})

def create_app():
    app = web.Application()
    app.router.add_post("/v1/chat/completions", chat_completions)
    app.router.add_get("/api/status", health_check)
    app.router.add_get("/health", health_check)
    return app

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    app = create_app()
    web.run_app(app, host=DEFAULT_HOST, port=DEFAULT_PORT)
