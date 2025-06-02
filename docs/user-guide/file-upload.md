# File Upload User Guide

## Giới thiệu

Hệ thống upload file cho phép bạn tải lên hình ảnh và mô hình 3D một cách dễ dàng và an toàn. Hướng dẫn này sẽ giúp bạn hiểu cách sử dụng tính năng upload file hiệu quả.

## Các loại file được hỗ trợ

### Hình ảnh
- **Định dạng**: JPG, JPEG, PNG, WebP, GIF
- **Kích thước tối đa**: 50MB
- **Khuyến nghị**: Sử dụng JPG cho ảnh sản phẩm, PNG cho ảnh có nền trong suốt

### Mô hình 3D
- **Định dạng**: GLB, GLTF, OBJ, FBX, DAE
- **Kích thước tối đa**: 50MB
- **Khuyến nghị**: Sử dụng GLB cho hiệu suất tốt nhất

## Cách sử dụng

### 1. Truy cập trang upload
- Đi đến `/test-upload` để test tính năng
- Hoặc sử dụng component upload trong các trang khác

### 2. Chọn loại file
Hệ thống cung cấp 3 chế độ upload:

#### Upload hình ảnh
- Chỉ chấp nhận file ảnh
- Tối đa 5 files cùng lúc
- Hiển thị preview ảnh

#### Upload mô hình 3D
- Chỉ chấp nhận file 3D
- Tối đa 3 files cùng lúc
- Hiển thị thông tin file

#### Upload hỗn hợp
- Chấp nhận cả ảnh và mô hình 3D
- Tối đa 10 files cùng lúc
- Phân loại tự động

### 3. Thêm file

#### Cách 1: Kéo thả (Drag & Drop)
1. Kéo file từ máy tính
2. Thả vào vùng upload (có viền đứt nét)
3. File sẽ được thêm vào danh sách

#### Cách 2: Click để chọn
1. Click vào vùng upload
2. Chọn file từ hộp thoại
3. File sẽ được thêm vào danh sách

### 4. Quản lý file

#### Xem thông tin file
- **Tên file**: Hiển thị tên gốc
- **Kích thước**: Hiển thị dung lượng (KB/MB)
- **Loại**: Icon cho biết loại file
- **Preview**: Xem trước ảnh (chỉ với file ảnh)

#### Xóa file
- Click nút "X" bên cạnh file
- File sẽ bị xóa khỏi danh sách

### 5. Upload file

1. **Kiểm tra danh sách**: Đảm bảo tất cả file cần thiết đã được thêm
2. **Click "Upload Files"**: Bắt đầu quá trình upload
3. **Theo dõi tiến độ**: Thanh progress bar hiển thị tiến độ
4. **Chờ hoàn thành**: Thông báo thành công sẽ xuất hiện

## Trạng thái upload

### Đang chờ (Pending)
- File đã được chọn nhưng chưa upload
- Icon: Đồng hồ màu xám

### Đang upload (Uploading)
- File đang được tải lên
- Hiển thị thanh tiến độ
- Icon: Mũi tên xoay

### Thành công (Success)
- File đã upload thành công
- Icon: Dấu tick màu xanh
- Hiển thị URL file

### Lỗi (Error)
- Upload thất bại
- Icon: Dấu X màu đỏ
- Hiển thị thông báo lỗi

## Xử lý lỗi thường gặp

### File quá lớn
**Lỗi**: "File size too large. Maximum size: 50MB"

**Giải pháp**:
- Nén file trước khi upload
- Sử dụng công cụ tối ưu hóa ảnh
- Với mô hình 3D: giảm độ phân giải hoặc số polygon

### Định dạng không được hỗ trợ
**Lỗi**: "Invalid file type"

**Giải pháp**:
- Kiểm tra danh sách định dạng được hỗ trợ
- Chuyển đổi file sang định dạng phù hợp
- Đảm bảo extension file đúng

### Quá nhiều file
**Lỗi**: "Too many files"

**Giải pháp**:
- Giảm số lượng file
- Upload theo batch nhỏ hơn
- Kiểm tra giới hạn cho từng loại upload

### Lỗi mạng
**Lỗi**: "Network error" hoặc "Upload failed"

**Giải pháp**:
- Kiểm tra kết nối internet
- Thử lại sau vài phút
- Refresh trang và upload lại

### Lỗi xác thực
**Lỗi**: "Unauthorized"

**Giải pháp**:
- Đăng nhập lại
- Kiểm tra session còn hiệu lực
- Refresh trang

## Mẹo sử dụng hiệu quả

### Tối ưu hóa file

#### Hình ảnh
- **Độ phân giải**: 1920x1080 cho ảnh sản phẩm
- **Chất lượng**: 80-90% cho JPG
- **Định dạng**: JPG cho ảnh thường, PNG cho ảnh có trong suốt

#### Mô hình 3D
- **Định dạng**: GLB cho hiệu suất tốt nhất
- **Polygon**: Giữ dưới 50K triangles
- **Texture**: Tối đa 2048x2048px

### Quy trình upload hiệu quả

1. **Chuẩn bị file trước**:
   - Đặt tên file có ý nghĩa
   - Tối ưu hóa kích thước
   - Kiểm tra định dạng

2. **Upload theo batch**:
   - Nhóm file cùng loại
   - Upload từng nhóm nhỏ
   - Kiểm tra kết quả từng batch

3. **Kiểm tra sau upload**:
   - Xác nhận URL hoạt động
   - Test hiển thị file
   - Lưu thông tin file quan trọng

## Bảo mật và quyền riêng tư

### File được bảo vệ
- Tất cả file được scan virus
- Chỉ định dạng an toàn được chấp nhận
- File được lưu trữ an toàn trên Cloudinary

### Quyền truy cập
- Cần đăng nhập để upload
- File public có thể xem được qua URL
- Admin có thể quản lý tất cả file

### Xóa file
- File có thể được xóa bởi người upload
- Admin có thể xóa bất kỳ file nào
- File bị xóa không thể khôi phục

## Hỗ trợ kỹ thuật

### Thông tin debug
Khi gặp lỗi, hãy cung cấp:
- Tên file và kích thước
- Thông báo lỗi chính xác
- Thời gian xảy ra lỗi
- Trình duyệt đang sử dụng

### Liên hệ hỗ trợ
- Email: support@3dstore.com
- Ticket system: /help
- Documentation: /docs

## FAQ

### Q: Tại sao file upload chậm?
A: Tốc độ upload phụ thuộc vào:
- Kích thước file
- Tốc độ internet
- Tải server
- Vị trí địa lý

### Q: Có thể upload file từ URL không?
A: Hiện tại chỉ hỗ trợ upload file từ máy tính. Tính năng upload từ URL sẽ được bổ sung trong tương lai.

### Q: File có bị nén không?
A: 
- Hình ảnh: Có thể bị nén tự động để tối ưu
- Mô hình 3D: Không bị nén, giữ nguyên chất lượng

### Q: Có giới hạn số file upload mỗi ngày không?
A: Hiện tại chưa có giới hạn, nhưng có thể được áp dụng trong tương lai tùy theo gói dịch vụ.

### Q: File có được backup không?
A: Có, tất cả file được backup tự động trên Cloudinary với độ tin cậy 99.9%.