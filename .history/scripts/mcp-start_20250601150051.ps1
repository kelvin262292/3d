# Script khởi động MCP
Write-Host "Đang khởi động MCP..." -ForegroundColor Green

# Kiểm tra Node.js
$nodeVersion = node -v
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan

# Kiểm tra pnpm
$pnpmVersion = pnpm -v
Write-Host "pnpm version: $pnpmVersion" -ForegroundColor Cyan

# Cài đặt MCP nếu chưa có
if (-not (Test-Path "node_modules/@smither/cli")) {
    Write-Host "Đang cài đặt MCP..." -ForegroundColor Yellow
    pnpm add -D @smither/cli
}

# Khởi tạo MCP
Write-Host "Đang khởi tạo MCP..." -ForegroundColor Yellow
pnpm mcp:init

# Kiểm tra cấu hình
if (Test-Path "mcp.config.js") {
    Write-Host "Cấu hình MCP đã sẵn sàng" -ForegroundColor Green
} else {
    Write-Host "Lỗi: Không tìm thấy file cấu hình MCP" -ForegroundColor Red
    exit 1
}

# Khởi động môi trường phát triển
Write-Host "Đang khởi động môi trường phát triển..." -ForegroundColor Green
pnpm mcp:dev 