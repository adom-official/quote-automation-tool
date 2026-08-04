'use client';

import { AdomLogo } from './AdomLogo';
import { Search, Bell, FileText, User, Box, ArrowRight, X, Menu, LayoutDashboard, Users, Package, CheckSquare, Settings, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { quotes, clients, items } = useStore();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const isAdmin = session?.user?.email === 'admin@adom.com';

  const navLinks = [
    { href: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { href: '/dashboard/clients', label: 'Khách hàng', icon: Users },
    { href: '/dashboard/items', label: 'Hạng mục thiết kế', icon: CheckSquare },
    { href: '/dashboard/packages', label: 'Gói báo giá', icon: Package },
    { href: '/dashboard/quotes', label: 'Danh sách Báo giá', icon: FileText },
    ...(isAdmin ? [{ href: '/dashboard/users', label: 'Quản lý User', icon: Settings }] : []),
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  const matchingQuotes = cleanQuery
    ? quotes.filter((q: any) => {
        const idMatch = (q.id || '').toLowerCase().includes(cleanQuery);
        const nameMatch = (q.projectName || '').toLowerCase().includes(cleanQuery);
        const clientMatch = (q.clientName || '').toLowerCase().includes(cleanQuery) || (q.clientCompany || '').toLowerCase().includes(cleanQuery);
        const itemMatch = (q.items || []).some((item: any) => (item.name || '').toLowerCase().includes(cleanQuery));
        return idMatch || nameMatch || clientMatch || itemMatch;
      }).slice(0, 5)
    : [];

  const matchingClients = cleanQuery
    ? clients.filter((c: any) => {
        return (c.name || '').toLowerCase().includes(cleanQuery) ||
               (c.company || '').toLowerCase().includes(cleanQuery) ||
               (c.email || '').toLowerCase().includes(cleanQuery) ||
               (c.phone || '').toLowerCase().includes(cleanQuery);
      }).slice(0, 3)
    : [];

  const matchingItems = cleanQuery
    ? items.filter((i: any) => (i.name || '').toLowerCase().includes(cleanQuery) || (i.category || '').toLowerCase().includes(cleanQuery)).slice(0, 3)
    : [];

  const hasResults = matchingQuotes.length > 0 || matchingClients.length > 0 || matchingItems.length > 0;

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 z-20 sticky top-0 shrink-0 gap-4">
        {/* Mobile Hamburger & Logo */}
        <div className="md:hidden flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center cursor-pointer"
            aria-label="Mở menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <AdomLogo className="w-[95px]" />
        </div>

        <div className="flex-1 max-w-xl hidden sm:block relative" ref={searchRef}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Tìm mã báo giá, tên dự án, hạng mục, khách hàng..." 
              className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Instant Search Dropdown Results */}
          {isOpen && cleanQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
              {!hasResults ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  Không tìm thấy kết quả phù hợp với "<span className="font-semibold text-slate-700">{query}</span>"
                </div>
              ) : (
                <div className="p-2 divide-y divide-slate-100">
                  {/* Matching Quotes */}
                  {matchingQuotes.length > 0 && (
                    <div className="p-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Báo Giá ({matchingQuotes.length})</div>
                      <div className="space-y-1">
                        {matchingQuotes.map((q: any) => (
                          <div
                            key={q.id}
                            onClick={() => {
                              setIsOpen(false);
                              router.push(`/quote/${q.id}`);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {q.projectName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Mã: <span className="font-mono uppercase font-medium">{q.id.substring(0, 8)}</span> · Khách: {q.clientName}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-900 font-mono">
                                {new Intl.NumberFormat('en-US').format(q.totalPrice || 0)}đ
                              </p>
                              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {q.status || 'Bản nháp'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Clients */}
                  {matchingClients.length > 0 && (
                    <div className="p-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Khách Hàng ({matchingClients.length})</div>
                      <div className="space-y-1">
                        {matchingClients.map((c: any) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setIsOpen(false);
                              router.push('/dashboard/clients');
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {c.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {c.company ? `${c.company} · ` : ''}{c.phone || c.email || ''}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Items */}
                  {matchingItems.length > 0 && (
                    <div className="p-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Hạng Mục Thiết Kế ({matchingItems.length})</div>
                      <div className="space-y-1">
                        {matchingItems.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setIsOpen(false);
                              router.push('/dashboard/items');
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                <Box className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {item.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Danh mục: {item.category || 'Mặc định'}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-slate-900 font-mono">
                              {new Intl.NumberFormat('en-US').format(item.price || 0)}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <Link href="/dashboard/quotes/new" className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
            Tạo báo giá nhanh
          </Link>
          <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <div className="hidden md:block h-6 w-px bg-slate-200"></div>
          
          <Link href="/dashboard/settings" className="flex items-center gap-3 hover:bg-slate-50 p-1 rounded-xl transition-all">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
              AD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900 leading-none mb-1">Admin User</p>
              <p className="text-[11px] text-slate-500 font-medium leading-none">creative.adom@gmail.com</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Hamburger Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200" 
            onClick={() => setMobileMenuOpen(false)} 
          />

          {/* Sliding Menu Sheet */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <AdomLogo className="w-28" align="left" />
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1.5 py-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href + '/'));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all",
                      isActive 
                        ? "bg-indigo-50 text-indigo-700 shadow-2xs font-bold" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Action */}
            <div className="pt-2 pb-4">
              <Link
                href="/dashboard/quotes/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Tạo báo giá nhanh
              </Link>
            </div>

            {/* Drawer Footer User Profile */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  AD
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-900 leading-tight truncate">{session?.user?.name || 'ADOM Creative'}</p>
                  <p className="text-xs text-slate-500 font-medium truncate">{session?.user?.email || 'creative.adom@gmail.com'}</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/login' });
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-xl w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
