$body = @{
    email = "testuser@example.com"
    password = "TestPassword123!"
} | ConvertTo-Json

$outputFile = "c:\Users\AB\Documents\3d\api-test-result.txt"

"Testing login API..." | Out-File -FilePath $outputFile
"Request body: $body" | Out-File -FilePath $outputFile -Append

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
    "SUCCESS: Login API worked!" | Out-File -FilePath $outputFile -Append
    "Response: $($response | ConvertTo-Json -Depth 3)" | Out-File -FilePath $outputFile -Append
} catch {
    "ERROR: $($_.Exception.Message)" | Out-File -FilePath $outputFile -Append
    if ($_.Exception.Response) {
        "Status Code: $($_.Exception.Response.StatusCode)" | Out-File -FilePath $outputFile -Append
        "Status Description: $($_.Exception.Response.StatusDescription)" | Out-File -FilePath $outputFile -Append
    }
}

"Test completed." | Out-File -FilePath $outputFile -Append
Write-Host "Results saved to: $outputFile"