'use client';
import { SeedData } from '@/components/SeedData';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Building2, FileText, TrendingUp, DollarSign, Package as PackageIcon, ArrowUpRight } from 'lucide-react';
import { format, subMonths, isAfter, startOfMonth } from 'date-fns';


export default function Dashboard() {
  const { clients, packages, quotes } = useStore();
  
  const stats = {
    clients: clients.length,
    packages: packages.length,
    quotes: quotes.length,
    revenue: quotes.filter(q => q.status === 'Đã duyệt').reduce((acc, q) => acc + (q.totalPrice || 0), 0),
    approvedQuotes: quotes.filter(q => q.status === 'Đã duyệt').length
  };

  
  
  

  return (
    <div className="h-full flex flex-col space-y-8 overflow-y-auto pb-8"><SeedData />
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900 ">Tổng quan</h2>
        <p className="text-slate-900 font-bold text-sm mt-2 border-l-4 border-[#FFE851] pl-3 ">Hoạt động kinh doanh và báo giá của bạn.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 ">Khách hàng</h3>
            <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center text-slate-900">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-5xl font-semibold text-slate-900">{stats.clients}</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 ">Gói Báo Giá</h3>
            <div className="w-10 h-10 bg-rose-50 text-rose-600 border border-slate-200 flex items-center justify-center text-slate-900">
              <PackageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-5xl font-semibold text-slate-900">{stats.packages}</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 ">Tổng Báo Giá</h3>
            <div className="w-10 h-10 bg-sky-50 text-sky-600 border border-slate-200 flex items-center justify-center text-slate-900">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-1">
            <p className="text-5xl font-semibold text-slate-900">{stats.quotes}</p>
            <span className="text-sm text-slate-900 font-bold  bg-sky-50 text-sky-600 inline-block w-max px-2 border border-slate-200">{stats.approvedQuotes} đã duyệt</span>
          </div>
        </div>

        <div className="bg-emerald-50 text-emerald-600 p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 ">Doanh thu duyệt</h3>
            <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center text-slate-900">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-2xl font-bold text-slate-900 tracking-tighter">{new Intl.NumberFormat('en-US').format(stats.revenue)}đ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
