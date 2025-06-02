$body = @{
    email = "testuser@example.com"
    password = "TestPassword123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Output "Success:"
    Write-Output $response
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Output "Status Code: $($_.Exception.Response.StatusCode)"
    }
}