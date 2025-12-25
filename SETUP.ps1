# Quick Start Script for Windows PowerShell

# Run this script from the newsly root directory to set up both frontend and backend

Write-Host "========================================" -ForegroundColor Green
Write-Host "Newsly React Application Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Create .env files if they don't exist
Write-Host "`nSetting up environment files..." -ForegroundColor Yellow

if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating backend/.env..." -ForegroundColor Cyan
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✓ Created backend/.env" -ForegroundColor Green
} else {
    Write-Host "✓ backend/.env already exists" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env")) {
    Write-Host "Creating frontend/.env..." -ForegroundColor Cyan
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✓ Created frontend/.env" -ForegroundColor Green
} else {
    Write-Host "✓ frontend/.env already exists" -ForegroundColor Green
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
Push-Location backend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
}
Pop-Location

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
Push-Location frontend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
}
Pop-Location

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open two PowerShell terminals" -ForegroundColor Cyan
Write-Host "2. Terminal 1: cd backend && npm run dev" -ForegroundColor Cyan
Write-Host "3. Terminal 2: cd frontend && npm start" -ForegroundColor Cyan
Write-Host "`nApplication will be available at http://localhost:3000" -ForegroundColor Green
