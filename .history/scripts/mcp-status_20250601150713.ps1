# Script kiểm tra trạng thái MCP
Write-Host "Kiểm tra trạng thái các MCP server..."

# Kiểm tra các process đang chạy
$processes = Get-Process | Where-Object { $_.ProcessName -like "*node*" -or $_.ProcessName -like "*npx*" }

Write-Host "`nDanh sách các MCP server đang chạy:"
foreach ($process in $processes) {
    Write-Host "- $($process.ProcessName) (PID: $($process.Id))"
}

# Kiểm tra các port đang được sử dụng
Write-Host "`nKiểm tra các port đang được sử dụng:"
netstat -ano | findstr "LISTENING" | findstr "node"

Write-Host "`nKiểm tra trạng thái hoàn tất!" 