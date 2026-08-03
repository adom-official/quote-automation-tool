'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Package as PackageIcon, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function PackagesPage() {
  const { packages, updatePackage, deletePackage, items } = useStore();
  const loading = false;
  
  const [editingPackage, setEditingPackage] = useState<any>(null);
  
  const [editName, setEditName] = useState('');
  const [editScale, setEditScale] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editSelectedItems, setEditSelectedItems] = useState<any[]>([]);
  
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  

  

  const openEditModal = (pkg: any) => {
    setEditingPackage(pkg);
    setEditName(pkg.name || '');
    setEditScale(pkg.scale || '');
    const cleanBudget = (pkg.budget || '').toString().replace(/\D/g, '');
    setEditBudget(cleanBudget ? Number(cleanBudget).toLocaleString('en-US') : '');
    setEditSelectedItems(pkg.items || []);
  };

  const handleToggleItem = (item: any) => {
    const isSelected = editSelectedItems.some(i => (i.id && i.id === item.id) || i.name === item.name);
    
    if (isSelected) {
      setEditSelectedItems(editSelectedItems.filter(i => {
        if (i.id && item.id) return i.id !== item.id;
        return i.name !== item.name;
      }));
    } else {
      setEditSelectedItems([...editSelectedItems, { ...item, _id: (item.id || item.name) + '-' + Date.now() + Math.random() }]);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage || !editName.trim()) return;

    const totalPrice = editSelectedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const totalTime = editSelectedItems.length * 5 + ' Ngày làm việc';

    updatePackage(editingPackage.id, {
      name: editName,
      scale: editScale,
      budget: editBudget,
      items: editSelectedItems,
      totalPrice,
      totalTime
    });
    
    setEditingPackage(null);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    deletePackage(itemToDelete.id);
    if (editingPackage && editingPackage.id === itemToDelete.id) {
      setEditingPackage(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 ">Quản lý Gói Báo Giá</h2>
          <p className="text-slate-900 text-sm mt-1">Quản lý các gói dịch vụ được đóng gói sẵn để sử dụng trong báo giá.</p>
        </div>
        <div>
          <Link 
            href="/dashboard/packages/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo gói báo giá mới
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 font-bold">Tên Gói</th>
              <th className="px-6 py-4 font-bold">Quy mô / Ngân sách</th>
              <th className="px-6 py-4 font-bold">Tổng thời gian</th>
              <th className="px-6 py-4 font-bold text-right">Tổng giá</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-900">Đang tải dữ liệu...</td></tr>
            ) : packages.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-900">Chưa có gói báo giá nào.</td></tr>
            ) : (
              packages.map(pkg => (
                <tr key={pkg.id} onClick={() => openEditModal(pkg)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                        <PackageIcon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900">{pkg.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {pkg.scale} / {pkg.budget}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {pkg.totalTime}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-slate-900">
                      {new Intl.NumberFormat('en-US').format(pkg.totalPrice)}đ
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-md w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-bold text-slate-900">Chỉnh sửa Gói Báo Giá</h3>
              <button onClick={() => setEditingPackage(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Tên gói *</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Quy mô</label>
                  <input type="text" value={editScale} onChange={e => setEditScale(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Ngân sách</label>
                  <input 
                    type="text" 
                    value={editBudget} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setEditBudget(val ? Number(val).toLocaleString('en-US') : '');
                    }} 
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-2">Hạng mục thiết kế</label>
                <div className="border border-slate-200 rounded-xl max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-900">Chưa có hạng mục nào trong thư viện</div>
                  ) : (
                    items.map(item => {
                      const isSelected = editSelectedItems.some(i => (i.id && i.id === item.id) || i.name === item.name);
                      return (
                        <label key={item.id || item.name} className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleToggleItem(item)}
                              className="rounded text-slate-900 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-slate-900">{item.name}</span>
                          </div>
                          <span className="text-sm font-mono text-slate-900">{new Intl.NumberFormat('en-US').format(item.price)}đ</span>
                        </label>
                      );
                    })
                  )}
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-900">Đã chọn: <strong className="text-slate-900">{editSelectedItems.length}</strong> hạng mục</span>
                  <span className="text-slate-900">Tổng giá trị: <strong className="text-slate-900">
                    {new Intl.NumberFormat('en-US').format(editSelectedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0))}đ
                  </strong></span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setItemToDelete(editingPackage)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingPackage(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Hủy</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-sm ">Lưu thay đổi</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Xóa gói báo giá"
        message="Bạn có chắc chắn muốn xóa gói báo giá này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
