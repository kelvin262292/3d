# Script cài đặt và chạy MCP
Write-Host "Bắt đầu cài đặt MCP..."

# Cài đặt các dependencies cần thiết
npm install -g @smithery/cli

# Khởi động các MCP server
Write-Host "Khởi động các MCP server..."

# Hàm helper để chạy MCP server
function Start-MCPServer {
    param (
        [string]$ServerName,
        [string]$Package,
        [string]$Key,
        [string]$Profile = ""
    )
    
    $args = @(
        "/c",
        "npx",
        "-y",
        "@smithery/cli@latest",
        "run",
        $Package,
        "--key",
        $Key
    )
    
    if ($Profile) {
        $args += @("--profile", $Profile)
    }
    
    Write-Host "Khởi động $ServerName..."
    Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList $args
}

# Khởi động từng server
Start-MCPServer -ServerName "Filesystem MCP Server" -Package "@cyanheads/filesystem-mcp-server" -Key "9eaf9d55-4491-4639-9be5-b3e27b9cbc84"
Start-MCPServer -ServerName "Firecrawl MCP Server" -Package "@Krieg2065/firecrawl-mcp-server" -Key "9eaf9d55-4491-4639-9be5-b3e27b9cbc84" -Profile "sufficient-marlin-M3WykT"
Start-MCPServer -ServerName "Tavily MCP Server" -Package "mcp-tavily" -Key "9eaf9d55-4491-4639-9be5-b3e27b9cbc84" -Profile "sufficient-marlin-M3WykT"
Start-MCPServer -ServerName "Context7 MCP Server" -Package "@upstash/context7-mcp" -Key "9eaf9d55-4491-4639-9be5-b3e27b9cbc84" -Profile "sufficient-marlin-M3WykT"
Start-MCPServer -ServerName "Sequential Thinking MCP Server" -Package "@smithery-ai/server-sequential-thinking" -Key "9eaf9d55-4491-4639-9be5-b3e27b9cbc84"
Start-MCPServer -ServerName "Fetch MCP Server" -Package "fetch-mcp" -Key "9eaf9d55-4491-4639-9be5-b3e27b9cbc84"
Start-MCPServer -ServerName "Playwright MCP Server" -Package "@cloudflare/playwright-mcp" -Key "f227f917-cc87-45c4-964b-e17d00b0ee51"

Write-Host "Đã khởi động tất cả MCP server thành công!" 