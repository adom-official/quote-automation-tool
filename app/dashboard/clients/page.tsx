'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Building2, Mail, Phone, MapPin, X, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useStore();
  const loading = false;
  
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState('');
  
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addClient({
      name,
      email,
      phone,
      address,
      logo,
      });
    
    setShowForm(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setLogo('');
  };

  const openEditModal = (client: any) => {
    setEditingClient(client);
    setName(client.name || '');
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setAddress(client.address || '');
    setLogo(client.logo || '');
  };

  const closeEditModal = () => {
    setEditingClient(null);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setLogo('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !name.trim()) return;

    updateClient(editingClient.id, {
      name,
      email,
      phone,
      address,
      logo
    });

    closeEditModal();
  };

  const handleDelete = () => {
    if (!itemToDelete || !isAdmin) return;
    deleteClient(itemToDelete.id); setItemToDelete(null);
    if (editingClient && editingClient.id === itemToDelete.id) {
      closeEditModal();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 ">Quản lý Khách hàng</h2>
          <p className="text-slate-900 text-sm mt-1">Lưu trữ thông tin công ty khách hàng để sử dụng cho các báo giá.</p>
        </div>
        <div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Hủy' : 'Tạo khách hàng mới'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shrink-0">
          <h3 className="font-bold text-slate-900 mb-4">Thêm khách hàng mới</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900  mb-1">Tên công ty / Khách hàng *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-900  mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-900  mb-1">Số điện thoại / Hotline</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-900  mb-1">Địa chỉ</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-900  mb-1">Link Logo/Avatar Khách Hàng (Tùy chọn)</label>
              <input type="text" value={logo} onChange={e => setLogo(e.target.value)} placeholder="https://example.com/logo.png" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-sm ">
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
              <th className="px-6 py-4 font-bold">Khách hàng</th>
              <th className="px-6 py-4 font-bold">Liên hệ</th>
              <th className="px-6 py-4 font-bold">Địa chỉ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-900">Đang tải dữ liệu...</td></tr>
            ) : clients.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-900">Chưa có khách hàng nào. Hãy tạo khách hàng đầu tiên.</td></tr>
            ) : (
              clients.map(client => (
                <tr key={client.id} onClick={() => openEditModal(client)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    {client.email && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-3.5 h-3.5 text-gray-500" /> <span>{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-gray-500" /> <span>{client.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {client.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" /> <span className="line-clamp-1">{client.address}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-md w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-900">Chỉnh sửa Khách Hàng</h3>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Tên công ty / Khách hàng *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900  mb-1">Số điện thoại / Hotline</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Địa chỉ</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Link Logo/Avatar Khách Hàng (Tùy chọn)</label>
                <input type="text" value={logo} onChange={e => setLogo(e.target.value)} placeholder="https://example.com/logo.png" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                {isAdmin ? (
                  <button type="button" onClick={() => setItemToDelete(editingClient)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                ) : <div></div>}
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
        title="Xóa khách hàng"
        message="Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
