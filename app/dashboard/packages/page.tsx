'use client';

import { useStore } from '@/lib/store';
import { Plus, Package as PackageIcon, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PackagesPage() {
  const { packages } = useStore();
  const router = useRouter();
  const loading = false;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Gói Báo Giá</h2>
          <p className="text-slate-500 text-sm mt-1">Quản lý các gói dịch vụ được đóng gói sẵn để sử dụng trong báo giá.</p>
        </div>
        <div>
          <Link 
            href="/dashboard/packages/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo gói báo giá mới
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-bold">Tên Gói</th>
              <th className="px-6 py-4 font-bold">Quy mô / Ngân sách</th>
              <th className="px-6 py-4 font-bold">Tổng thời gian</th>
              <th className="px-6 py-4 font-bold text-right">Tổng giá</th>
              <th className="px-6 py-4 font-bold text-center w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
            ) : packages.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Chưa có gói báo giá nào.</td></tr>
            ) : (
              packages.map(pkg => (
                <tr 
                  key={pkg.id} 
                  onClick={() => router.push(`/dashboard/packages/${pkg.id}/edit`)} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0 font-bold">
                        <PackageIcon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{pkg.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {pkg.scale || '—'} / {pkg.budget || '—'}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                      {pkg.totalTime || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-slate-900">
                      {new Intl.NumberFormat('en-US').format(pkg.totalPrice)}đ
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/packages/${pkg.id}/edit`);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Sửa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
