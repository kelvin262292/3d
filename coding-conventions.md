# Quy ước mã hóa dự án 3D

## TypeScript
- Sử dụng type thay vì interface khi có thể
- Tên biến và hàm theo kiểu camelCase
- Tên lớp và component theo kiểu PascalCase
- Tên file theo kiểu kebab-case (ví dụ: product-details.tsx)
- Giới hạn 80 ký tự trên một dòng
- Thụt lề 2 khoảng trắng
- Luôn sử dụng const/let thay vì var
- Tránh sử dụng any, sử dụng unknown hoặc union types thay thế
- Sử dụng destructuring khi truy cập nhiều thuộc tính của object
- Sử dụng optional chaining (?.) và nullish coalescing (??)

## React
- Mỗi component trong một file riêng biệt
- Tên component luôn bắt đầu bằng chữ hoa
- Props nên được gán giá trị mặc định nếu có thể
- Sử dụng React.FC type cho function components
- Phân tách component khi file vượt quá 100 dòng
- Sử dụng hooks theo đúng thứ tự (theo nguyên tắc ESLint)
- Không đặt state trong props
- Sử dụng memoization hợp lý (React.memo, useMemo, useCallback)

## CSS
- Sử dụng Tailwind CSS theo nguyên tắc 'Mobile First'
- Hạn chế sử dụng !important
- Sử dụng class theo thứ tự logic (layout -> positioning -> styling)
- Đặt class Tailwind theo thứ tự alphabet
- Cho phép tối đa 1 class mỗi dòng trong file CSS thông thường
- Sử dụng biến CSS cho màu sắc và kích thước chính

## File structure
- Giữ cấu trúc thư mục phẳng nhất có thể
- Đặt các component chung trong thư mục /components
- Đặt các hook chia sẻ trong thư mục /hooks
- Đặt các hàm tiện ích trong thư mục /lib
- Đặt kiểu dữ liệu trong thư mục /types
- Đặt API services trong thư mục /services

## Testing
- Viết test cho tất cả component và hàm quan trọng
- Tỷ lệ coverage tối thiểu 80%
- Sử dụng Playwright cho end-to-end testing
- Viết test cases cho cả trường hợp thành công và thất bại
- Sử dụng fixture data cho test

## Documentation
- Viết JSDoc cho tất cả public API
- Ghi chú rõ ràng cho các đoạn code phức tạp
- Cập nhật README.md khi thêm tính năng mới
- Duy trì CHANGELOG.md với các thay đổi quan trọng
- Ghi chú lý do thay đổi trong commit messages