@echo off
cd /d "%~dp0"
echo Starting AI Ticket System...
start "" "http://localhost:5173"
call npm run dev
pause
