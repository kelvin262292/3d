# Script cài đặt và chạy MCP
Write-Host "Bắt đầu cài đặt MCP..."

# Cài đặt các dependencies cần thiết
npm install -g @smithery/cli

# Khởi động các MCP server
Write-Host "Khởi động các MCP server..."

# Filesystem MCP Server
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npx -y @smithery/cli@latest run @cyanheads/filesystem-mcp-server --key 9eaf9d55-4491-4639-9be5-b3e27b9cbc84"

# Firecrawl MCP Server
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npx -y @smithery/cli@latest run @Krieg2065/firecrawl-mcp-server --key 9eaf9d55-4491-4639-9be5-b3e27b9cbc84 --profile sufficient-marlin-M3WykT"

# Tavily MCP Server
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npx -y @smithery/cli@latest run mcp-tavily --key 9eaf9d55-4491-4639-9be5-b3e27b9cbc84 --profile sufficient-marlin-M3WykT"

# Context7 MCP Server
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npx -y @smithery/cli@latest run @upstash/context7-mcp --key 9eaf9d55-4491-4639-9be5-b3e27b9cbc84 --profile sufficient-marlin-M3WykT"

# Sequential Thinking MCP Server
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npx -y @smithery/cli@latest run @smithery-ai/server-sequential-thinking --key 9eaf9d55-4491-4639-9be5-b3e27b9cbc84"

# Fetch MCP Server
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npx -y @smithery/cli@latest run fetch-mcp --key 9eaf9d55-4491-4639-9be5-b3e27b9cbc84"

# Playwright MCP Server
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npx -y @smithery/cli@latest run @cloudflare/playwright-mcp --key f227f917-cc87-45c4-964b-e17d00b0ee51"

Write-Host "Đã khởi động tất cả MCP server thành công!" 