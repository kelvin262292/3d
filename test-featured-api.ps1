try {
    Write-Host "Testing Featured Products API..." -ForegroundColor Green
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/products/featured?limit=4" -Method GET -UseBasicParsing
    
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Yellow
    Write-Host "Content Type: $($response.Headers['Content-Type'])" -ForegroundColor Yellow
    Write-Host "Response Body:" -ForegroundColor Cyan
    Write-Host $response.Content
    
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
}