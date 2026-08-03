'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Plus, X } from 'lucide-react';

export default function NewQuotePage() {
  const { addQuote, clients, packages, items } = useStore();
  const router = useRouter();
  
  const [selectedClient, setSelectedClient] = useState('');
  const [projectName, setProjectName] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [customItems, setCustomItems] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);

  

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackage(pkgId);
    if (pkgId) {
      const pkg = packages.find(p => p.id === pkgId);
      if (pkg && pkg.items) {
        setCustomItems(pkg.items.map((i: any, index: number) => ({...i, _id: (i.id || i.name) + '-' + Date.now() + '-' + index})));
      }
    } else {
      setCustomItems([]);
    }
  };

  const handleSave = () => {
    if (!selectedClient || !projectName) {
      alert("Vui lòng nhập tên dự án và chọn khách hàng.");
      return;
    }
    
    setIsLoading(true);
    const client = clients.find(c => c.id === selectedClient);
    const totalPrice = customItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    
    // Generate ID immediately and navigate, doing Firestore setDoc in background
    const id = addQuote({
      projectName,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email || '',
      clientPhone: client.phone || '',
      clientAddress: client.address || '',
      packageId: selectedPackage,
      items: customItems,
      totalPrice,
      status: 'Bản nháp',
      createdAt: Date.now()
    });

    // Navigate immediately
    router.push(`/quote/${id}`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 ">Tạo Báo Giá Mới</h2>
          <p className="text-slate-900">Tạo báo giá từ các gói đã có hoặc tùy chỉnh từng hạng mục.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.back()} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Hủy</button>
          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 hover:shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Đang tạo...' : 'Tạo Báo Giá'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 shrink-0">
          <div>
            <label className="block text-xs font-semibold text-slate-900  mb-2">Tên dự án *</label>
            <input 
              type="text" 
              value={projectName} 
              onChange={e => setProjectName(e.target.value)} 
              placeholder="VD: Thiết kế Website Doanh nghiệp" 
              className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm font-medium" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-900  mb-2">Khách hàng *</label>
            <select 
              value={selectedClient} 
              onChange={e => setSelectedClient(e.target.value)} 
              className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm font-medium bg-white"
            >
              <option value="">-- Chọn khách hàng --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {selectedClient && clients.find(c => c.id === selectedClient) && (
              <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-slate-900 text-xs font-semibold  w-16 shrink-0 mt-0.5">Email</span> 
                  <span className="font-medium text-slate-900 break-all">{clients.find(c => c.id === selectedClient)?.email || '—'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-900 text-xs font-semibold  w-16 shrink-0 mt-0.5">SĐT</span> 
                  <span className="font-medium text-slate-900">{clients.find(c => c.id === selectedClient)?.phone || '—'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-900 text-xs font-semibold  w-16 shrink-0 mt-0.5">Địa chỉ</span> 
                  <span className="font-medium text-slate-900">{clients.find(c => c.id === selectedClient)?.address || '—'}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-900  mb-2">Chọn từ Gói có sẵn (Tùy chọn)</label>
            <select 
              value={selectedPackage} 
              onChange={e => handlePackageSelect(e.target.value)} 
              className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 focus:bg-white focus:shadow-sm outline-none text-sm font-medium bg-indigo-50/50"
            >
              <option value="">-- Không chọn gói, tự tạo tùy chỉnh --</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {new Intl.NumberFormat('en-US').format(p.totalPrice)}đ</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 bg-white flex-1 overflow-y-auto">
          <h3 className="font-bold text-slate-900 mb-4  text-xs tracking-wider">Hạng mục Báo giá</h3>
          
          <div className="space-y-3">
            {customItems.length === 0 ? (
              <div className="p-8 border-dashed border-slate-200 bg-white text-center text-slate-900 text-sm">
                Chưa có hạng mục nào. Hãy chọn một Gói báo giá ở trên để tải danh sách hạng mục.
              </div>
            ) : (
              customItems.map((item, index) => (
                <div key={item._id || index} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm relative group">
                  <button 
                    onClick={() => setCustomItems(customItems.filter(i => i._id !== item._id))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full hidden group-hover:flex items-center justify-center font-bold text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    {item.estimatedTime && <p className="text-xs text-slate-900 mt-1">Thời gian: {item.estimatedTime} ngày</p>}
                  </div>
                  <div className="w-48 text-right">
                    <span className="font-mono font-bold text-slate-900">{new Intl.NumberFormat('en-US').format(item.price)}đ</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-6 bg-white border-t border border-slate-200 shrink-0 flex justify-end">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900  mb-1">Tổng cộng (Chưa VAT)</p>
            <p className="text-3xl font-bold font-mono text-indigo-700">
              {new Intl.NumberFormat('en-US').format(customItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0))}đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
