# Quick Test for Cognitive Engine
# Copy and paste this into PowerShell to test the Cognitive Engine

# Test 1: Basic positive signal
curl.exe -X POST http://localhost:3001/api/cognitive-analysis `
-H "Content-Type: application/json" `
-d '{\"userId\": \"test_user_1\", \"message\": \"She sent me how are you this morning - is this a good sign?\"}'

Write-Host "`n`n=== Test Complete! ===" -ForegroundColor Green
Write-Host "The response shows:" -ForegroundColor Yellow
Write-Host "  - Golden Crush Analysis (verdict, score, signals)" -ForegroundColor Cyan
Write-Host "  - Cognitive Diagnosis (profile, state, relationship stage)" -ForegroundColor Cyan
Write-Host "  - Strategy (tactics to use)" -ForegroundColor Cyan
Write-Host "  - Execution (exact message to send)" -ForegroundColor Cyan
Write-Host "  - Prediction (what to expect)" -ForegroundColor Cyan
