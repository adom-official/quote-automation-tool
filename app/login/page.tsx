'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { AdomLogo } from '@/components/AdomLogo';
import { Loader2, ShieldAlert } from 'lucide-react';

// Input Validation Schema bằng Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải từ 6 ký tự trở lên" }),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams?.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (urlError === 'AccessDenied') {
      setError('Tài khoản Google của bạn chưa được cấp quyền truy cập vào hệ thống.');
    } else if (urlError) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin hoặc thử lại.');
    }
  }, [urlError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error?.issues?.[0]?.message || 'Lỗi xác thực');
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email hoặc mật khẩu không đúng.");
        setIsLoading(false);
      } else if (res?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError("Không thể kết nối đến máy chủ xác thực.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(`Có lỗi xảy ra: ${err?.message || "Vui lòng thử lại."}`);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err: any) {
      setError('Không thể khởi tạo đăng nhập Google.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-center mb-6">
        <AdomLogo className="w-40" />
      </div>
      
      <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Đăng nhập</h1>
      <p className="text-sm text-slate-500 text-center mb-6">Hệ thống bảo mật quản lý báo giá ADOM Studio</p>

      {error && (
        <div className="mb-6 p-3.5 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="leading-snug">{error}</div>
        </div>
      )}

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
        className="w-full py-2.5 px-4 mb-6 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
      >
        {isGoogleLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Đăng nhập với Google</span>
      </button>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <span className="relative px-3 bg-white text-xs font-medium text-slate-400 uppercase tracking-wider">
          Hoặc mật khẩu quản trị
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="admin@adom.com"
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="••••••••"
            disabled={isLoading || isGoogleLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
