try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
    Write-Host "Server is running - Status: $($response.StatusCode)"
    Write-Host "Content length: $($response.Content.Length)"
} catch {
    Write-Host "Server connection failed: $($_.Exception.Message)"
}