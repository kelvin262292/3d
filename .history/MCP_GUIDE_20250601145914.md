# Hướng dẫn sử dụng MCP (Model-Controller-Presenter)

## Giới thiệu
MCP là một công cụ hỗ trợ phát triển được tích hợp vào dự án để giúp quản lý và tự động hóa các quy trình phát triển.

## Cài đặt
1. Đảm bảo đã cài đặt Node.js và pnpm
2. Chạy lệnh sau để cài đặt MCP:
```bash
pnpm add -D @smither/cli
```

## Cấu hình
File cấu hình MCP được lưu trong `mcp.config.js`. File này chứa các thiết lập cho:
- Tên dự án
- Công cụ kiểm thử (Playwright)
- Công cụ linting (ESLint)
- Công cụ type checking (TypeScript)
- Các script tùy chỉnh

## Các lệnh MCP
- `pnpm mcp:init`: Khởi tạo cấu hình MCP
- `pnpm mcp:test`: Chạy kiểm thử
- `pnpm mcp:lint`: Kiểm tra lỗi code
- `pnpm mcp:build`: Build dự án
- `pnpm mcp:dev`: Chạy môi trường phát triển

## Quy trình làm việc
1. Sử dụng `pnpm mcp:dev` để bắt đầu phát triển
2. MCP sẽ tự động:
   - Kiểm tra lỗi code
   - Chạy kiểm thử
   - Build dự án
   - Theo dõi thay đổi

## Xử lý lỗi
Nếu gặp lỗi khi sử dụng MCP:
1. Kiểm tra file `mcp.config.js`
2. Đảm bảo đã cài đặt đầy đủ dependencies
3. Xem log lỗi trong terminal
4. Kiểm tra phiên bản Node.js và pnpm

## Liên hệ hỗ trợ
Nếu cần hỗ trợ thêm, vui lòng tạo issue trong repository của dự án. 