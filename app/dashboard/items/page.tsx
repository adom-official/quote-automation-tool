'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Plus, CheckSquare, X, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function ItemsPage() {
  const { items, addItem, updateItem, deleteItem } = useStore();
  const loading = false;
  
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numericPrice = Number(price.replace(/[^0-9]/g, ''));

    addItem({
      name,
      price: numericPrice,
      estimatedTime
    });
    
    setShowForm(false);
    setName('');
    setPrice('');
    setEstimatedTime('');
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setName(item.name || '');
    setPrice(item.price ? new Intl.NumberFormat('en-US').format(item.price) : '');
    setEstimatedTime(item.estimatedTime || '');
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setName('');
    setPrice('');
    setEstimatedTime('');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (rawValue) {
      setPrice(new Intl.NumberFormat('en-US').format(Number(rawValue)));
    } else {
      setPrice('');
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !name.trim()) return;

    const numericPrice = Number(price.replace(/[^0-9]/g, ''));

    updateItem(editingItem.id, {
      name,
      price: numericPrice,
      estimatedTime
    });

    closeEditModal();
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    deleteItem(itemToDelete.id);
    setItemToDelete(null);
    if (editingItem && editingItem.id === itemToDelete.id) {
      closeEditModal();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 ">Hạng mục thiết kế</h2>
          <p className="text-slate-900 text-sm mt-1">Quản lý các hạng mục thiết kế lẻ để thêm vào báo giá.</p>
        </div>
        <div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Hủy' : 'Tạo hạng mục mới'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shrink-0">
          <h3 className="font-bold text-slate-900 mb-4">Thêm hạng mục mới</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900  mb-1">Tên hạng mục *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-900  mb-1">Đơn giá (VNĐ)</label>
              <input type="text" value={price} onChange={handlePriceChange} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-900  mb-1">Thời gian (ngày)</label>
              <input type="text" value={estimatedTime} onChange={e => setEstimatedTime(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
            </div>
            
            <div className="md:col-span-1 flex justify-end mt-2 items-end">
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-sm w-full">
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 font-bold">Hạng mục</th>
              <th className="px-6 py-4 font-bold">Thời gian</th>
              <th className="px-6 py-4 font-bold text-right">Đơn giá</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-900">Đang tải dữ liệu...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-900">Chưa có hạng mục nào.</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.id} onClick={() => openEditModal(item)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {item.estimatedTime ? `${item.estimatedTime} ngày` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-slate-900">
                      {new Intl.NumberFormat('en-US').format(item.price || 0)}đ
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-md w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-900">Chỉnh sửa Hạng Mục</h3>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Tên hạng mục *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Đơn giá (VNĐ)</label>
                  <input type="text" value={price} onChange={handlePriceChange} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Thời gian (ngày)</label>
                  <input type="text" value={estimatedTime} onChange={e => setEstimatedTime(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm text-slate-900" />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setItemToDelete(editingItem)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
                <div className="flex gap-2">
                  <button type="button" onClick={closeEditModal} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Hủy</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-sm ">Lưu</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Xóa hạng mục"
        message="Bạn có chắc chắn muốn xóa hạng mục này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
