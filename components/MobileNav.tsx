'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Package, CheckSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function MobileNav() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    const mock = localStorage.getItem('mockUser');
    if (mock || (user && JSON.parse(user).email === 'adom@admin.com')) {
      setIsAdmin(true);
    }
  }, []);

  const links = [
    { href: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { href: '/dashboard/clients', label: 'Khách', icon: Users },
    { href: '/dashboard/items', label: 'Hạng mục', icon: CheckSquare },
    { href: '/dashboard/quotes', label: 'Báo giá', icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-50 flex items-center justify-around px-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href + '/'));
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Icon className={cn("w-5 h-5")} />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
