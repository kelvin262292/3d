try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/products?featured=true&limit=4' -UseBasicParsing
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response Content:"
    Write-Host $response.Content
} catch {
    Write-Host "Error occurred:"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Error Message: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}