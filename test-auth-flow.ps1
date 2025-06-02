# Test complete authentication flow
Write-Host "Testing complete authentication flow..." -ForegroundColor Green

# Test login first
$email = $env:TEST_EMAIL ?? "demo@example.com"
$password = $env:TEST_PASSWORD ?? "password123"

$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json
    email = $email
    password = $password
} | ConvertTo-Json
    email = $email
    password = $password
} | ConvertTo-Json

Write-Host "Step 1: Testing login..." -ForegroundColor Yellow
Write-Host "Body: $loginBody"

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -SessionVariable session
    
    Write-Host "Login Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Login Response: $($loginResponse.Content)" -ForegroundColor Green
    
    # Extract cookies for next request
    $cookies = $loginResponse.Headers['Set-Cookie']
    Write-Host "Cookies received: $cookies" -ForegroundColor Cyan
    
    # Test /api/auth/me with session
    Write-Host "`nStep 2: Testing /api/auth/me..." -ForegroundColor Yellow
    
    $meResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" `
        -Method GET `
        -WebSession $session
    
    Write-Host "Me Status: $($meResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Me Response: $($meResponse.Content)" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Status Description: $($_.Exception.Response.StatusDescr    }
}

Write-Host "Done." -ForegroundColor Green