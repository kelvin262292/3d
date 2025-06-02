$body = @{
    email = "testuser@example.com"
    password = "TestPassword123!"
} | ConvertTo-Json

Write-Host "Testing with Invoke-WebRequest..."
Write-Host "Body: $body"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "SUCCESS!"
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Content: $($response.Content)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    }
}

Write-Host "Done."