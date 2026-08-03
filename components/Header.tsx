'use client';

import { AdomLogo } from './AdomLogo';
import { Search, Bell, FileText, User, Box, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { quotes, clients, items } = useStore();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 z-20 sticky top-0 shrink-0 gap-4">
      {/* Mobile Logo */}
      <div className="md:hidden font-semibold text-xl text-slate-900 shrink-0">
        <AdomLogo className="w-[100px]" />
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
      
      <div className="flex items-center gap-4 md:gap-6 ml-auto">
        <Link href="/dashboard/quotes/new" className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
          Tạo báo giá nhanh
        </Link>
        <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="hidden md:block h-6 w-px bg-slate-200"></div>
        
        <Link href="/dashboard/settings" className="flex items-center gap-3 hover:bg-slate-50 p-1.5 md:pr-4 rounded-xl transition-all">
          <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
            AD
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-900 leading-none mb-1">Admin User</p>
            <p className="text-[11px] text-slate-500 font-medium leading-none">admin@crm.com</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
