'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Plus, FileText, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function QuotesPage() {
  const { quotes, deleteQuote } = useStore();
  const loading = false;
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  

  const handleDelete = async () => {
    if (!itemToDelete) return;
    deleteQuote(itemToDelete);
    setItemToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Đã gửi': return 'bg-blue-100 text-blue-700';
      case 'Đã duyệt': return 'bg-green-100 text-green-700';
      case 'Từ chối': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-900';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 ">Quản lý Báo Giá</h2>
          <p className="text-slate-900 text-sm mt-1">Tạo và quản lý các báo giá gửi cho khách hàng.</p>
        </div>
        <div>
          <Link 
            href="/dashboard/quotes/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo báo giá mới
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 font-bold">Mã BG / Tên dự án</th>
              <th className="px-6 py-4 font-bold">Khách hàng</th>
              <th className="px-6 py-4 font-bold">Trạng thái</th>
              <th className="px-6 py-4 font-bold">Tổng tiền</th>
              <th className="px-6 py-4 font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-900">Đang tải dữ liệu...</td></tr>
            ) : quotes.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-900">Chưa có báo giá nào.</td></tr>
            ) : (
              quotes.map(quote => (
                <tr key={quote.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{quote.projectName}</span>
                        <span className="text-xs text-slate-900">{quote.id.substring(0, 8).toUpperCase()} - {quote.createdAt?.toDate ? format(quote.createdAt.toDate(), 'dd/MM/yyyy') : ''}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-medium">
                    {quote.clientName}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(quote.status || 'Bản nháp')}`}>
                      {quote.status || 'Bản nháp'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-900">
                      {new Intl.NumberFormat('en-US').format(quote.totalPrice || 0)}đ
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setItemToDelete(quote.id);
                      }} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link href={`/quote/${quote.id}`} className="p-2 text-gray-500 hover:text-slate-900 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-1">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Xóa báo giá"
        message="Bạn có chắc chắn muốn xóa báo giá này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
