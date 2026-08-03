'use client';

import { useState } from 'react';
import { Camera, User, Lock, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full pb-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900  tracking-tight">Cài đặt Tài khoản</h2>
        <p className="text-slate-900 text-sm mt-1">Quản lý thông tin cá nhân và bảo mật của bạn.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-white border border-slate-200 rounded-xl p-2 shadow-sm shrink-0">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'profile' ? 'bg-white text-slate-900 border border-slate-200 shadow-sm ' : 'text-slate-900 hover:bg-slate-50/40 border border-transparent'}`}
          >
            <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-slate-900' : ''}`} />
            Thông tin chung
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'security' ? 'bg-white text-slate-900 border border-slate-200 shadow-sm ' : 'text-slate-900 hover:bg-slate-50/40 border border-transparent'}`}
          >
            <Lock className={`w-4 h-4 ${activeTab === 'security' ? 'text-slate-900' : ''}`} />
            Bảo mật & Mật khẩu
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {activeTab === 'profile' ? (
            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Thông tin chung</h3>
              
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-bold border-4 border-white shadow-sm">
                    AD
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-gray-700 hover:text-slate-900 shadow-sm transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Ảnh đại diện</h4>
                  <p className="text-sm text-slate-900 mt-1">Nên sử dụng ảnh vuông, kích thước tối đa 2MB.</p>
                </div>
              </div>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900  mb-1">Họ và Tên</label>
                    <input type="text" defaultValue="Admin User" className="w-full px-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900  mb-1">Email</label>
                    <input type="email" defaultValue="admin@crm.com" className="w-full px-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Số điện thoại</label>
                  <input type="tel" defaultValue="0987654321" className="w-full px-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
                </div>
                
                <div className="pt-6">
                  <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-sm transition-colors">
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Đổi mật khẩu</h3>
              
              <form className="space-y-5 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Mật khẩu hiện tại</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Mật khẩu mới</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Xác nhận mật khẩu mới</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
                </div>
                
                <div className="pt-6">
                  <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-sm transition-colors">
                    <Lock className="w-4 h-4" />
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
