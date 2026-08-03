'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Plus, User, Mail, Shield, X, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useStore();
  const loading = false;
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [allowedAreas, setAllowedAreas] = useState<string[]>(['dashboard', 'clients', 'items', 'packages', 'quotes', 'users']);
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name,
      email,
      role,
      allowedAreas,
      });
    
    setShowCreateModal(false);
    resetForm();
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setName(user.name || '');
    setEmail(user.email || '');
    setRole(user.role || 'user');
    setAllowedAreas(user.allowedAreas || []);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('user');
    setAllowedAreas(['dashboard', 'clients', 'items', 'packages', 'quotes', 'users']);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !name.trim()) return;

    updateUser(editingUser.id, {
      name,
      email,
      role,
      allowedAreas
    });

    setEditingUser(null);
  };

  const handleDelete = () => {
    if (!itemToDelete || !isSystemAdmin) return;
    deleteUser(itemToDelete.id);
    setItemToDelete(null);
    if (editingUser && editingUser.id === itemToDelete.id) {
      setEditingUser(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 ">Quản lý Người dùng</h2>
          <p className="text-slate-900 text-sm mt-1">Cấp quyền truy cập hệ thống CRM cho nhân viên.</p>
        </div>
        <div>
          <button 
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo người dùng mới
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 font-bold">Người dùng</th>
              <th className="px-6 py-4 font-bold">Phân quyền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-900">Đang tải dữ liệu...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-900">Chưa có người dùng nào.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} onClick={() => openEditModal(user)} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-900">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-3.5 h-3.5 text-gray-500" /> <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.email === 'adom@admin.com' || user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-gray-700'}`}>
                      {user.email === 'adom@admin.com' || user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-900">Tạo người dùng mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-sm mb-4">
                Người dùng mới sẽ có thể đăng nhập bằng email này và tự tạo mật khẩu lần đầu.
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Tên người dùng *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Nhập tên hiển thị" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Phân quyền</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm bg-white mb-4">
                  <option value="user">Người dùng (User)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
                <label className="block text-xs font-semibold text-slate-900  mb-2">Quyền truy cập chức năng hệ thống</label>
                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
                  {[{id: 'dashboard', label: 'Dashboard'}, {id: 'clients', label: 'Khách hàng'}, {id: 'items', label: 'Hạng mục thiết kế'}, {id: 'packages', label: 'Gói báo giá'}, {id: 'quotes', label: 'Báo giá'}, {id: 'users', label: 'Người dùng'}].map(area => (
                    <label key={area.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={allowedAreas.includes(area.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAllowedAreas([...allowedAreas, area.id]);
                          } else {
                            setAllowedAreas(allowedAreas.filter(a => a !== area.id));
                          }
                        }}
                        className="rounded text-slate-900 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-900">{area.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-sm ">Tạo mới</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-900">Chỉnh sửa người dùng</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Tên người dùng *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900  mb-1">Phân quyền</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm bg-white mb-4">
                  <option value="user">Người dùng (User)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
                <label className="block text-xs font-semibold text-slate-900  mb-2">Quyền truy cập chức năng hệ thống</label>
                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
                  {[{id: 'dashboard', label: 'Dashboard'}, {id: 'clients', label: 'Khách hàng'}, {id: 'items', label: 'Hạng mục thiết kế'}, {id: 'packages', label: 'Gói báo giá'}, {id: 'quotes', label: 'Báo giá'}, {id: 'users', label: 'Người dùng'}].map(area => (
                    <label key={area.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={allowedAreas.includes(area.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAllowedAreas([...allowedAreas, area.id]);
                          } else {
                            setAllowedAreas(allowedAreas.filter(a => a !== area.id));
                          }
                        }}
                        className="rounded text-slate-900 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-900">{area.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                {isSystemAdmin ? (
                  <button type="button" onClick={() => setItemToDelete(editingUser)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                ) : <div></div>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Hủy</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-sm ">Lưu</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
