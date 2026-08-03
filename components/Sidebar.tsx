'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Package, CheckSquare, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { AdomLogo } from './AdomLogo';
import { signOut, useSession } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Kiểm tra quyền Admin từ session thay vì localStorage để bảo mật
  const isAdmin = session?.user?.email === 'admin@adom.com';

  const links = [
    { href: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { href: '/dashboard/clients', label: 'Khách hàng', icon: Users },
    { href: '/dashboard/items', label: 'Hạng mục', icon: CheckSquare },
    { href: '/dashboard/packages', label: 'Gói báo giá', icon: Package },
    { href: '/dashboard/quotes', label: 'Báo giá', icon: FileText },
    ...(isAdmin ? [{ href: '/dashboard/users', label: 'Quản lý User', icon: Settings }] : []),
  ];

  return (
    <div className="hidden md:flex w-64 bg-white border-r border-slate-200 h-screen flex-col z-10 shrink-0">
      <div className="p-8 flex items-center justify-start border-b border-slate-200 text-slate-900">
        <AdomLogo className="w-full max-w-[210px]" align="left" />
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href + '/'));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl",
                isActive 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
          Đăng xuất
        </button>
      </div>
      <div className="px-8 pb-6 pt-2 text-xs text-slate-900 font-bold">
        © 2026 ADOM
      </div>
    </div>
  );
}
