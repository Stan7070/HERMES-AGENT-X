\"\"\"
Gateway Runner for Hermes Agent X.
Controls the API Server lifecycle.
\"\"\"
import asyncio
import logging
import signal
import sys
from pathlib import Path

# Add parent to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from aiohttp import web
from gateway.platforms.api_server import create_app, DEFAULT_PORT, DEFAULT_HOST

logger = logging.getLogger("hermes_gateway")

async def shutdown(app):
    logger.info("Gateway shutting down...")
    tasks = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]
    [task.cancel() for task in tasks]
    await asyncio.gather(*tasks, return_exceptions=True)
    asyncio.get_event_loop().stop()

def main():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s | %(name)s | %(levelname)s | %(message)s'
    )
    
    logger.info(f"🚀 Starting Hermes Agent X Gateway on http://{DEFAULT_HOST}:{DEFAULT_PORT}")
    
    app = create_app()
    app.on_cleanup.append(shutdown)
    
    web.run_app(app, host=DEFAULT_HOST, port=DEFAULT_PORT)

if __name__ == "__main__":
    main()
