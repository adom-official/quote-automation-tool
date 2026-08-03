# Hướng dẫn Cài đặt & Triển khai

Dự án Quản lý Báo Giá & Khách Hàng.

## Yêu cầu môi trường

- Node.js 18+
- npm hoặc yarn

## Cài đặt biến môi trường

1. Copy file `.env.example` thành `.env`
   ```bash
   cp .env.example .env
   ```
2. Cập nhật các giá trị trong `.env` cho phù hợp.
   - `NEXTAUTH_SECRET`: Sử dụng lệnh `openssl rand -base64 32` để tạo chuỗi ngẫu nhiên.
   - `NEXTAUTH_URL`: Địa chỉ URL của web (VD: `http://localhost:3000` khi chạy ở local).

## Hướng dẫn Deploy lên Vercel

1. Đăng nhập vào [Vercel](https://vercel.com/) và tạo project mới từ GitHub.
2. Trong phần cấu hình **Environment Variables**, thêm các biến sau (giống file `.env`):
   - `NEXTAUTH_URL` (URL mặc định của Vercel project)
   - `NEXTAUTH_SECRET`
   - Bất kỳ biến kết nối DB nào sau này (`DATABASE_URL`, v.v...)
3. Nhấn **Deploy**. Vercel sẽ tự động cài đặt dependency (`npm install`) và build project (`npm run build`).

## Cấu trúc thư mục (Kiến trúc chuẩn)

- `/app`: Chứa các route, pages, layouts (App Router Next.js 13+).
- `/app/api`: Chứa các Server API Routes (REST endpoints).
- `/components`: Chứa các Client/Server Components giao diện tái sử dụng.
- `/lib`: Chứa thư viện, hàm tiện ích, cấu hình store (Zustand), database.
- `/types`: (Nên tạo nếu cần) Khai báo các interface/types dùng chung.
