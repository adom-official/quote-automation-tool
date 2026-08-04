'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function NewQuotePage() {
  const { addQuote, clients, packages } = useStore();
  const router = useRouter();
  
  const [selectedClient, setSelectedClient] = useState('');
  const [projectName, setProjectName] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [customItems, setCustomItems] = useState<any[]>([]);
  const [includeVat, setIncludeVat] = useState(true);
  const [isClientDetailsExpanded, setIsClientDetailsExpanded] = useState(false);
  
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
    const subTotal = customItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    
    const id = addQuote({
      projectName,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email || '',
      clientPhone: client.phone || '',
      clientAddress: client.address || '',
      packageId: selectedPackage,
      items: customItems,
      totalPrice: subTotal,
      includeVat: includeVat,
      status: 'Bản nháp',
      createdAt: Date.now()
    });

    router.push(`/quote/${id}`);
  };

  const currentClient = clients.find(c => c.id === selectedClient);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4 sm:mb-6 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">Tạo Báo Giá Mới</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Tạo báo giá từ các gói đã có hoặc tùy chỉnh từng hạng mục.</p>
        </div>
        <div className="flex gap-2 items-center w-full sm:w-auto justify-end shrink-0">
          <button onClick={() => router.back()} className="px-3 sm:px-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap">Hủy</button>
          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isLoading ? 'Đang tạo...' : 'Tạo Báo Giá'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tên dự án *</label>
            <input 
              type="text" 
              value={projectName} 
              onChange={e => setProjectName(e.target.value)} 
              placeholder="VD: Thiết kế Bộ nhận diện thương hiệu ADOM" 
              className="w-full px-3.5 py-2 sm:py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm font-medium transition-all" 
            />
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Khách hàng *</label>
            <select 
              value={selectedClient} 
              onChange={e => setSelectedClient(e.target.value)} 
              className="w-full px-3.5 py-2 sm:py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              <option value="">-- Chọn khách hàng --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
              ))}
            </select>

            {/* Collapsible Client Details */}
            {currentClient && (
              <div className="mt-2 bg-white border border-slate-200 rounded-xl text-xs overflow-hidden transition-all shadow-2xs">
                <div 
                  onClick={() => setIsClientDetailsExpanded(!isClientDetailsExpanded)}
                  className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors select-none"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-slate-700 text-xs">{currentClient.name}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 truncate text-[11px]">{currentClient.email || currentClient.phone || 'Chưa có SĐT/Email'}</span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium text-[11px] shrink-0 ml-2">
                    {isClientDetailsExpanded ? (
                      <>Thu gọn <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Chi tiết <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>

                {isClientDetailsExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-1.5 text-slate-600 bg-slate-50/50 text-xs">
                    <div><span className="font-semibold text-slate-500">Email:</span> {currentClient.email || '—'}</div>
                    <div><span className="font-semibold text-slate-500">SĐT:</span> {currentClient.phone || '—'}</div>
                    <div><span className="font-semibold text-slate-500">Địa chỉ:</span> {currentClient.address || '—'}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Chọn từ Gói có sẵn (Tùy chọn)</label>
            <select 
              value={selectedPackage} 
              onChange={e => handlePackageSelect(e.target.value)} 
              className="w-full px-3.5 py-2 sm:py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm font-medium transition-all"
            >
              <option value="">-- Không chọn gói, tự tạo tùy chỉnh --</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {new Intl.NumberFormat('en-US').format(p.totalPrice)}đ</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">Hạng mục Báo giá ({customItems.length})</h3>
          </div>
          
          <div className="space-y-3">
            {customItems.length === 0 ? (
              <div className="p-6 sm:p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center text-slate-500 text-xs sm:text-sm">
                Chưa có hạng mục nào. Hãy chọn một Gói báo giá ở trên để tự động tải danh sách hạng mục.
              </div>
            ) : (
              customItems.map((item, index) => (
                <div key={item._id || index} className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 shadow-2xs relative group hover:border-slate-300 transition-all">
                  <button 
                    onClick={() => setCustomItems(customItems.filter(i => i._id !== item._id))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xs opacity-80 hover:opacity-100 hover:scale-110 transition-all z-10"
                    title="Xóa hạng mục này"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 pr-4">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</p>
                    {item.estimatedTime && <p className="text-[11px] text-slate-500 mt-0.5">Thời gian thực hiện: {item.estimatedTime} ngày</p>}
                  </div>
                  <div className="w-full sm:w-44 text-right">
                    <span className="font-mono font-bold text-slate-900 text-sm sm:text-base">{new Intl.NumberFormat('en-US').format(item.price)}đ</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all">
              <input 
                type="checkbox"
                checked={includeVat}
                onChange={(e) => setIncludeVat(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Xuất VAT (8%)
              </span>
            </label>
            <span className="text-[11px] sm:text-xs text-slate-500">
              {includeVat ? '• Đã bao gồm 8% thuế VAT vào tổng giá trị' : '• Không cộng 8% VAT vào tổng giá trị'}
            </span>
          </div>

          <div className="text-right w-full sm:w-auto">
            {(() => {
              const subTotal = customItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
              const vatAmount = includeVat ? subTotal * 0.08 : 0;
              const grandTotal = subTotal + vatAmount;

              return (
                <>
                  {includeVat ? (
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-0.5">
                        Tạm tính: <span className="font-mono">{new Intl.NumberFormat('en-US').format(subTotal)}đ</span> | VAT (8%): <span className="font-mono">{new Intl.NumberFormat('en-US').format(vatAmount)}đ</span>
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-0.5">Tổng cộng (Đã gồm VAT)</p>
                      <p className="text-xl sm:text-2xl font-bold font-mono text-[#A6CE39]">
                        {new Intl.NumberFormat('en-US').format(grandTotal)}đ
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-0.5">Tổng cộng (Không VAT)</p>
                      <p className="text-xl sm:text-2xl font-bold font-mono text-[#A6CE39]">
                        {new Intl.NumberFormat('en-US').format(subTotal)}đ
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
