import { AdomLogo } from './AdomLogo';
import { Search, Bell, Settings, User } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shrink-0 gap-4">
      {/* Mobile Logo */}
      <div className="md:hidden font-semibold text-xl text-slate-900 shrink-0">
        <AdomLogo className="w-[100px]" />
      </div>

      <div className="flex-1 max-w-xl hidden sm:block">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-900" />
          <input 
            type="text" 
            placeholder="TÌM KIẾM..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 font-bold text-sm focus:outline-none focus:shadow-sm transition-shadow placeholder:text-gray-500 "
          />
        </div>
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
