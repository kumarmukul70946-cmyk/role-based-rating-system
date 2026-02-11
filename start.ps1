Write-Host "Starting FullStack Intern Challenge Project..." -ForegroundColor Green

# Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install it first."
    exit 1
}

# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run start:dev" -WorkingDirectory ".\backend" -NoNewWindow
# Note: In a real script we might want separate windows or background jobs.
# For simplicity, let's just use Start-Process which opens a new window by default usually or verify behavior.
# Actually, npm run start:dev in same window blocks. 
# Let's use Start-Process to open new windows.

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev"

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Both services should be starting in new windows." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend: http://localhost:3000"
Write-Host "Ensure your PostgreSQL database is running!" -ForegroundColor Yellow
