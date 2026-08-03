'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function NewPackagePage() {
  const { addPackage, items } = useStore();
  const router = useRouter();
  
  const [loadingItems, setLoadingItems] = useState(true);
  
  useEffect(() => {
    setLoadingItems(false);
  }, []);
  
  const [packageName, setPackageName] = useState('');
  const [budget, setBudget] = useState('');
  const [scale, setScale] = useState('');
  
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  
  

  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    if (itemData) {
      const item = JSON.parse(itemData);
      setSelectedItems(prev => [...prev, { ...item, _id: (item.id || item.name) + '-' + Date.now() + Math.random() }]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item._id !== id));
  };

  const handlePriceChange = (id: string, newPriceStr: string) => {
    const numericValue = Number(newPriceStr.replace(/[^0-9]/g, ''));
    setSelectedItems(prev => prev.map(item => 
      item._id === id ? { ...item, price: numericValue } : item
    ));
  };

  const totalPrice = selectedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!packageName.trim()) {
      alert("Vui lòng nhập tên gói");
      return;
    }
    
    setIsSaving(true);
    
    // We don't await addDoc so the UI responds immediately.
    addPackage({
      name: packageName,
      budget,
      scale,
      items: selectedItems,
      totalPrice,
      totalTime: selectedItems.length * 5 + ' Ngày làm việc',
      createdAt: Date.now()
    });
    // Navigate immediately for instantaneous feel.
    router.push('/dashboard/packages');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 ">Xây dựng Gói Báo Giá Mới</h2>
          <p className="text-slate-900">Kéo thả hạng mục từ thư viện vào gói của bạn để tự động tính toán ngân sách.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.back()} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Hủy</button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu Gói & Tiếp tục'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 shrink-0 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-900  mb-1">Tên Gói *</label>
          <input type="text" value={packageName} onChange={e => setPackageName(e.target.value)} placeholder="VD: BR-SME-ADVANCED" className="w-full px-3 py-2 border border-slate-200 shadow-inner bg-white/80 focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-900  mb-1">Ngân sách dự kiến</label>
          <input 
            type="text" 
            value={budget} 
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '');
              setBudget(val ? Number(val).toLocaleString('en-US') : '');
            }} 
            placeholder="VD: Cao cấp" 
            className="w-full px-3 py-2 border border-slate-200 shadow-inner bg-white/80 focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-900  mb-1">Quy mô doanh nghiệp</label>
          <input type="text" value={scale} onChange={e => setScale(e.target.value)} placeholder="VD: SME" className="w-full px-3 py-2 border border-slate-200 shadow-inner bg-white/80 focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
        </div>
      </div>
      
      <div className="flex flex-1 gap-6 overflow-hidden min-h-[400px]">
        {/* Left Column: Thư viện Hạng mục thiết kế */}
        <div className="w-1/3 flex flex-col border border-slate-200 rounded-xl overflow-hidden shadow-sm shrink-0">
          <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-xs  text-slate-900">Thư viện hạng mục thiết kế</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {loadingItems ? (
              <p className="text-sm text-slate-900 text-center py-4">Đang tải dữ liệu...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-slate-900 text-center py-4">Chưa có hạng mục nào trong thư viện.</p>
            ) : (
              items.map(item => (
                <div 
                  key={item.id || item.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="p-3 border border-slate-200 rounded-xl hover:border-indigo-400 cursor-move transition-colors group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold group-hover:text-slate-900">{item.name}</p>
                  </div>
                  <div className="flex justify-between mt-3 text-xs font-medium">
                    <span className="text-slate-900 underline">{new Intl.NumberFormat('en-US').format(item.price)}đ</span>
                    <span>{item.estimatedTime ? `${item.estimatedTime} ngày` : '-'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right Column: Gói Hiện tại */}
        <div 
          className="flex-1 flex flex-col border-indigo-100 rounded-xl bg-indigo-50/20 overflow-hidden shrink-0"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="p-4 bg-white border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-slate-900">Gói Hiện tại: {packageName || 'Chưa đặt tên'}</h3>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold">ĐANG CHỈNH SỬA</span>
            </div>
            <div className="flex gap-4 items-center text-xs">
              <span className="text-slate-900 italic">Đã chọn ({selectedItems.length})</span>
            </div>
          </div>
          
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {selectedItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-200 flex items-center relative group">
                <button 
                  onClick={() => removeItem(item._id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full hidden group-hover:flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
                <div className="w-8 h-8 flex items-center justify-center text-slate-300 mr-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-32">
                    <label className="text-[8px]  text-gray-500 block mb-1">Giá tùy chỉnh</label>
                    <input 
                      type="text" 
                      value={new Intl.NumberFormat('en-US').format(item.price)} 
                      onChange={(e) => handlePriceChange(item._id, e.target.value)}
                      className="w-full border-none p-0 text-sm font-mono font-bold text-slate-900 focus:ring-0 outline-none bg-transparent" 
                    />
                  </div>
                  <div className="w-24 text-right">
                    <label className="text-[8px]  text-gray-500 block mb-1">Thời gian</label>
                    <span className="text-sm font-medium text-slate-900">{item.estimatedTime ? `${item.estimatedTime} ngày` : '-'}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-dashed border-indigo-200 rounded-xl h-24 flex items-center justify-center text-indigo-400 text-xs font-medium bg-white/50">
              + Thả hạng mục vào đây
            </div>
          </div>
          
          <div className="p-6 bg-white border-t border border-slate-200 rounded-b-2xl flex items-center justify-between shrink-0">
            <div className="flex gap-12">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-900  font-bold tracking-widest">Thời gian (ngày)</p>
                <p className="text-xl font-medium text-slate-900">~ {selectedItems.length * 5} <span className="text-sm text-slate-900 font-normal">Ngày làm việc</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-900  font-bold tracking-widest">Tổng ngân sách (Chưa VAT)</p>
                <p className="text-3xl font-bold font-mono text-slate-900">{new Intl.NumberFormat('en-US').format(totalPrice)}<span className="text-sm text-slate-900 font-normal ml-1">VNĐ</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
