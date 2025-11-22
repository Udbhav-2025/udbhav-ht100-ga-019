# .env configuration
Write-Host "🚀 Setting up Agentic Marketer..." -ForegroundColor Cyan

# Check if .env exists
if (!(Test-Path .env)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit .env file and add your API keys!" -ForegroundColor Yellow
    Write-Host "   - MONGODB_URI" -ForegroundColor Gray
    Write-Host "   - OPENAI_API_KEY or ANTHROPIC_API_KEY" -ForegroundColor Gray
    Write-Host "   - STABILITY_API_KEY" -ForegroundColor Gray
    Write-Host ""
    pause
}

# Check Node version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check MongoDB
Write-Host ""
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
Write-Host "⚠️  Make sure MongoDB is running (mongod) or using MongoDB Atlas" -ForegroundColor Yellow

Write-Host ""
Write-Host "✓ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your API keys" -ForegroundColor White
Write-Host "2. Start MongoDB: mongod" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host "4. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
