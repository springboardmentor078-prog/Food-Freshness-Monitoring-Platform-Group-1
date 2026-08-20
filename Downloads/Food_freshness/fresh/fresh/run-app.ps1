# Food Freshness App Startup Script
# This script starts all three services: Backend, Frontend, and AI Engine

Write-Host "Food Freshness Application Startup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Get the root directory
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Create output directory for logs
$logsDir = "$rootDir\logs"
if (!(Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir | Out-Null
}

Write-Host "Root Directory: $rootDir" -ForegroundColor Green
Write-Host "Logs Directory: $logsDir" -ForegroundColor Green
Write-Host ""

# Start AI Engine
Write-Host "Starting AI Engine on port 8000..." -ForegroundColor Yellow
$aiDir = "$rootDir\Image Analysis & Freshness"
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "$aiDir\main.py" -WorkingDirectory $aiDir -RedirectStandardOutput "$logsDir\ai-engine.log" -RedirectStandardError "$logsDir\ai-engine-error.log"
Start-Sleep -Seconds 3

# Start Backend
Write-Host "Starting Backend on port 5000..." -ForegroundColor Yellow
$backendDir = "$rootDir\backend"
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $backendDir -RedirectStandardOutput "$logsDir\backend.log" -RedirectStandardError "$logsDir\backend-error.log"
Start-Sleep -Seconds 2

# Start Frontend Dev Server
Write-Host "Starting Frontend on port 5173..." -ForegroundColor Yellow
$frontendDir = "$rootDir\frontend"
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $frontendDir -RedirectStandardOutput "$logsDir\frontend.log" -RedirectStandardError "$logsDir\frontend-error.log"

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "  AI Engine: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Logs are available in: $logsDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
