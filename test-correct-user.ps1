$body = @{
    email = "demo@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "Testing with correct user credentials..."
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
        $errorContent = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorContent)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody"
    }
}

Write-Host "Done."