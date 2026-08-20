@echo off
REM Food Freshness App Startup Script for Windows Command Prompt

echo =====================================
echo Food Freshness Application Startup
echo =====================================
echo.

REM Get the root directory
set rootDir=%~dp0
set rootDir=%rootDir:~0,-1%

REM Create logs directory
if not exist "%rootDir%\logs" mkdir "%rootDir%\logs"

echo Root Directory: %rootDir%
echo Logs Directory: %rootDir%\logs
echo.

REM Start AI Engine (Python)
echo Starting AI Engine on port 8000...
cd /d "%rootDir%\Image Analysis & Freshness"
start "AI Engine" python main.py

REM Wait for AI Engine to start
timeout /t 3 /nobreak

REM Start Backend (Node.js)
echo Starting Backend on port 5000...
cd /d "%rootDir%\backend"
start "Backend" node server.js

REM Wait for Backend to start
timeout /t 2 /nobreak

REM Start Frontend (Vite dev server)
echo Starting Frontend on port 5173...
cd /d "%rootDir%\frontend"
start "Frontend" cmd /k npm run dev

echo.
echo =====================================
echo All services started successfully!
echo =====================================
echo.
echo Access your application:
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:5000
echo   AI Engine: http://localhost:8000
echo.
echo Close these windows to stop the services.
echo.
pause
