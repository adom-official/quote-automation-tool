import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Nếu muốn add logic kiểm tra role admin, có thể làm ở đây
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Yêu cầu phải có token (đã đăng nhập)
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Route Guard: Áp dụng middleware chặn mọi requests vào "/dashboard" và các trang con
export const config = {
  matcher: ["/dashboard/:path*"],
};
