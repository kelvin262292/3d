# Script kiểm tra trạng thái MCP
Write-Host "Kiểm tra trạng thái MCP..." -ForegroundColor Green

# Kiểm tra Node.js
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js chưa được cài đặt" -ForegroundColor Red
    exit 1
}

# Kiểm tra pnpm
try {
    $pnpmVersion = pnpm -v
    Write-Host "✓ pnpm version: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ pnpm chưa được cài đặt" -ForegroundColor Red
    exit 1
}

# Kiểm tra MCP
if (Test-Path "node_modules/@smither/cli") {
    Write-Host "✓ MCP đã được cài đặt" -ForegroundColor Green
} else {
    Write-Host "✗ MCP chưa được cài đặt" -ForegroundColor Yellow
    Write-Host "Đang cài đặt MCP..." -ForegroundColor Yellow
    pnpm add -D @smither/cli
}

# Kiểm tra cấu hình
if (Test-Path "mcp.config.js") {
    Write-Host "✓ File cấu hình MCP đã tồn tại" -ForegroundColor Green
} else {
    Write-Host "✗ File cấu hình MCP chưa tồn tại" -ForegroundColor Yellow
    Write-Host "Đang tạo file cấu hình..." -ForegroundColor Yellow
    pnpm mcp:init
}

# Kiểm tra các script
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$requiredScripts = @("mcp:init", "mcp:test", "mcp:lint", "mcp:build", "mcp:dev")
$missingScripts = @()

foreach ($script in $requiredScripts) {
    if (-not $packageJson.scripts.$script) {
        $missingScripts += $script
    }
}

if ($missingScripts.Count -eq 0) {
    Write-Host "✓ Tất cả script MCP đã được cấu hình" -ForegroundColor Green
} else {
    Write-Host "✗ Thiếu các script: $($missingScripts -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "`nMCP đã sẵn sàng để sử dụng!" -ForegroundColor Green
Write-Host "Bạn có thể chạy các lệnh sau:" -ForegroundColor Cyan
Write-Host "- pnpm mcp:dev    : Khởi động môi trường phát triển" -ForegroundColor Cyan
Write-Host "- pnpm mcp:test   : Chạy kiểm thử" -ForegroundColor Cyan
Write-Host "- pnpm mcp:lint   : Kiểm tra lỗi code" -ForegroundColor Cyan
Write-Host "- pnpm mcp:build  : Build dự án" -ForegroundColor Cyan 