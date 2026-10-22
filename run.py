"""
Entry point to run the Provincial Budget Intelligence Dashboard FastAPI Server.
Run: python run.py
"""

import os
import sys
import socket
import uvicorn

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def get_local_ip():
    """Detects primary local LAN IP address."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    local_ip = get_local_ip()
    print("======================================================================")
    print("Starting Provincial Budget Intelligence Dashboard Server (FastAPI)")
    print(f"Local browser:   http://localhost:{port}")
    print(f"Other computers: http://{local_ip}:{port}")
    print("======================================================================")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
