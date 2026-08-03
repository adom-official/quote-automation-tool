'use client';

import { useState } from 'react';
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
    
    // Ensure all items in package have estimatedTime if missing
    const pkgItems = (pkg.items || []).map((i: any) => ({
      ...i,
      estimatedTime: i.estimatedTime ?? 5
    }));
    setEditSelectedItems(pkgItems);
  };

  const handleToggleItem = (item: any) => {
    const isSelected = editSelectedItems.some(i => (i.id && i.id === item.id) || i.name === item.name);
    
    if (isSelected) {
      setEditSelectedItems(editSelectedItems.filter(i => {
        if (i.id && item.id) return i.id !== item.id;
        return i.name !== item.name;
      }));
    } else {
      setEditSelectedItems([...editSelectedItems, { 
        ...item, 
        estimatedTime: item.estimatedTime ?? 5,
        _id: (item.id || item.name) + '-' + Date.now() + Math.random() 
      }]);
    }
  };

  const handleItemTimeChange = (itemIdOrName: string, newTime: string) => {
    setEditSelectedItems(prev => prev.map(i => {
      const isMatch = (i.id && i.id === itemIdOrName) || i.name === itemIdOrName;
      if (isMatch) {
        return { ...i, estimatedTime: newTime };
      }
      return i;
    }));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage || !editName.trim()) return;

    const totalPrice = editSelectedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const totalDays = editSelectedItems.reduce((sum, item) => sum + (Number(item.estimatedTime) || 5), 0);
    const totalTime = `${totalDays} Ngày làm việc`;

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

  const totalEditDays = editSelectedItems.reduce((sum, item) => sum + (Number(item.estimatedTime) || 5), 0);
  const totalEditPrice = editSelectedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
            ) : packages.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Chưa có gói báo giá nào.</td></tr>
            ) : (
              packages.map(pkg => (
                <tr key={pkg.id} onClick={() => openEditModal(pkg)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0 font-bold">
                        <PackageIcon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900">{pkg.name}</span>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-bold text-slate-900 text-base">Chỉnh sửa Gói Báo Giá</h3>
              <button onClick={() => setEditingPackage(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tên gói *</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-medium transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Quy mô</label>
                  <input type="text" value={editScale} onChange={e => setEditScale(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-medium transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Ngân sách</label>
                  <input 
                    type="text" 
                    value={editBudget} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setEditBudget(val ? Number(val).toLocaleString('en-US') : '');
                    }} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-medium transition-all" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Hạng mục thiết kế</label>
                  <span className="text-xs text-slate-400">Tích chọn & chỉnh sửa thời gian thực hiện (ngày)</span>
                </div>
                <div className="border border-slate-200 rounded-xl max-h-64 overflow-y-auto divide-y divide-slate-100 bg-white">
                  {items.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">Chưa có hạng mục nào trong thư viện</div>
                  ) : (
                    items.map(item => {
                      const selectedObj = editSelectedItems.find(i => (i.id && i.id === item.id) || i.name === item.name);
                      const isSelected = !!selectedObj;

                      return (
                        <div key={item.id || item.name} className={`flex items-center justify-between p-3 transition-colors ${isSelected ? 'bg-indigo-50/30' : 'hover:bg-slate-50/80'}`}>
                          <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 pr-2">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => handleToggleItem(item)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm font-semibold text-slate-900 truncate">{item.name}</span>
                          </label>

                          <div className="flex items-center gap-3 shrink-0">
                            {isSelected ? (
                              <div className="flex items-center gap-1.5 bg-white border border-indigo-200 rounded-lg px-2.5 py-1 shadow-2xs">
                                <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Thời gian:</span>
                                <input 
                                  type="number" 
                                  min="1"
                                  value={selectedObj.estimatedTime ?? item.estimatedTime ?? 5} 
                                  onChange={(e) => handleItemTimeChange(item.id || item.name, e.target.value)}
                                  className="w-12 text-xs font-bold text-center border-none p-0 focus:ring-0 outline-none text-indigo-700 bg-transparent"
                                  placeholder="Ngày"
                                />
                                <span className="text-[11px] font-medium text-slate-500">ngày</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">
                                {item.estimatedTime ? `${item.estimatedTime} ngày` : '5 ngày'}
                              </span>
                            )}

                            <span className="text-sm font-mono font-bold text-slate-900 w-28 text-right">
                              {new Intl.NumberFormat('en-US').format(item.price)}đ
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-3 flex flex-wrap justify-between items-center text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 gap-2">
                  <span>Đã chọn: <strong className="text-slate-900">{editSelectedItems.length}</strong> hạng mục</span>
                  <span>Tổng thời gian: <strong className="text-indigo-600 font-mono text-sm">{totalEditDays} ngày làm việc</strong></span>
                  <span>Tổng giá trị: <strong className="text-slate-900 font-mono text-sm">{new Intl.NumberFormat('en-US').format(totalEditPrice)}đ</strong></span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setItemToDelete(editingPackage)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Xóa gói
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingPackage(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">Hủy</button>
                  <button type="submit" className="px-6 py-2 bg-[#A6CE39] hover:bg-[#95ba33] text-slate-900 rounded-xl text-sm font-bold shadow-sm transition-colors">Lưu thay đổi</button>
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
