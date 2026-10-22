@echo off
title Share Dashboard Online (Cloudflare Tunnel)
echo ======================================================================
echo Starting Cloudflare Tunnel to share Dashboard online...
echo Make sure "python run.py" is running first!
echo ======================================================================
bin\cloudflared.exe tunnel --url http://localhost:8000
pause
