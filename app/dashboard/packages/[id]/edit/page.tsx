'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Plus, X, Trash2, ArrowLeft } from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function EditPackagePage() {
  const params = useParams();
  const router = useRouter();
  const { packages, updatePackage, deletePackage, items } = useStore();
  
  const packageId = params?.id as string;
  const pkg = packages.find(p => p.id === packageId);

  const [packageName, setPackageName] = useState('');
  const [budget, setBudget] = useState('');
  const [scale, setScale] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (pkg) {
      setPackageName(pkg.name || '');
      setBudget(pkg.budget || '');
      setScale(pkg.scale || '');
      if (pkg.items && Array.isArray(pkg.items)) {
        setSelectedItems(pkg.items.map((item: any, index: number) => ({
          ...item,
          estimatedTime: item.estimatedTime ?? 5,
          _id: item._id || (item.id || item.name) + '-' + Date.now() + '-' + index
        })));
      }
    }
  }, [pkg]);

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
        <p className="text-slate-500 font-medium">Gói báo giá không tồn tại hoặc đã bị xóa.</p>
        <button onClick={() => router.push('/dashboard/packages')} className="text-indigo-600 font-bold hover:underline text-sm">
          Quay lại danh sách gói
        </button>
      </div>
    );
  }

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 1000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const addItemToPackage = (item: any) => {
    setSelectedItems(prev => [...prev, {
      ...item,
      estimatedTime: item.estimatedTime ?? 5,
      _id: (item.id || item.name) + '-' + Date.now() + '-' + Math.random()
    }]);
    showToast(`Item "${item.name}" đã được thêm thành công`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    if (itemData) {
      try {
        const item = JSON.parse(itemData);
        addItemToPackage(item);
      } catch (err) {
        console.error("Invalid dropped item", err);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeItem = (id: string, name?: string) => {
    setSelectedItems(prev => prev.filter(item => item._id !== id));
    if (name) {
      showToast(`Item "${name}" đã được xóa thành công`);
    } else {
      showToast(`Item đã được xóa thành công`);
    }
  };

  const handlePriceChange = (id: string, newPriceStr: string) => {
    const numericValue = Number(newPriceStr.replace(/[^0-9]/g, ''));
    setSelectedItems(prev => prev.map(item => 
      item._id === id ? { ...item, price: numericValue } : item
    ));
  };

  const handleTimeChange = (id: string, newTimeStr: string) => {
    setSelectedItems(prev => prev.map(item => 
      item._id === id ? { ...item, estimatedTime: newTimeStr } : item
    ));
  };

  const totalPrice = selectedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const totalDays = selectedItems.reduce((sum, item) => sum + (Number(item.estimatedTime) || 5), 0);

  const handleSave = () => {
    if (!packageName.trim()) {
      alert("Vui lòng nhập tên gói");
      return;
    }
    
    setIsSaving(true);
    
    updatePackage(packageId, {
      name: packageName,
      budget,
      scale,
      items: selectedItems,
      totalPrice,
      totalTime: totalDays + ' Ngày làm việc'
    });

    router.push('/dashboard/packages');
  };

  const handleDelete = () => {
    deletePackage(packageId);
    router.push('/dashboard/packages');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4 sm:mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => router.push('/dashboard/packages')} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">Chỉnh sửa Gói Báo Giá</h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm pl-7">Kéo thả hoặc nhấp chọn hạng mục từ thư viện để thêm/sửa gói báo giá.</p>
        </div>
        <div className="flex gap-2 items-center w-full sm:w-auto justify-end shrink-0">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="px-3 sm:px-4 py-2 border border-red-200 text-red-600 rounded-xl text-xs sm:text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Xóa gói</span>
          </button>
          <button onClick={() => router.push('/dashboard/packages')} className="px-3 sm:px-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap">Hủy</button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-4 sm:px-5 py-2 bg-[#A6CE39] hover:bg-[#95ba33] text-slate-900 rounded-xl text-xs sm:text-sm font-bold shadow-sm disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </div>

      {/* Package Meta Info Inputs */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xs border border-slate-200 mb-4 sm:mb-6 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tên Gói *</label>
          <input type="text" value={packageName} onChange={e => setPackageName(e.target.value)} placeholder="VD: BR-SME-ADVANCED" className="w-full px-3 py-1.5 sm:py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-xs sm:text-sm font-medium transition-all" />
        </div>
        <div>
          <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Ngân sách dự kiến</label>
          <input 
            type="text" 
            value={budget} 
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '');
              setBudget(val ? Number(val).toLocaleString('en-US') : '');
            }} 
            placeholder="VD: Cao cấp" 
            className="w-full px-3 py-1.5 sm:py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-xs sm:text-sm font-medium transition-all" 
          />
        </div>
        <div>
          <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Quy mô doanh nghiệp</label>
          <input type="text" value={scale} onChange={e => setScale(e.target.value)} placeholder="VD: SME" className="w-full px-3 py-1.5 sm:py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-xs sm:text-sm font-medium transition-all" />
        </div>
      </div>
      
      {/* Interactive Builder Area */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 lg:gap-6 overflow-y-auto lg:overflow-hidden min-h-0">
        {/* Left Column: Thư viện Hạng mục thiết kế */}
        <div className="w-full lg:w-80 flex flex-col border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white shrink-0 max-h-64 lg:max-h-none">
          <div className="p-3 sm:p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Thư viện hạng mục</h3>
            <span className="text-[10px] sm:text-[11px] text-slate-400">Nhấp + để thêm</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
            {items.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 text-center py-4">Chưa có hạng mục nào trong thư viện.</p>
            ) : (
              items.map(item => (
                <div 
                  key={item.id || item.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => addItemToPackage(item)}
                  className="p-3 border border-slate-200 rounded-xl hover:border-indigo-400 bg-white cursor-pointer transition-all group hover:shadow-2xs relative"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors pr-6">{item.name}</p>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addItemToPackage(item);
                      }}
                      className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all absolute right-3 top-3"
                      title="Thêm vào gói"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs font-medium">
                    <span className="font-mono font-bold text-slate-900">{new Intl.NumberFormat('en-US').format(item.price)}đ</span>
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold">{item.estimatedTime ? `${item.estimatedTime} ngày` : '5 ngày'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right Column: Gói Hiện tại */}
        <div 
          className="w-full lg:flex-1 flex flex-col border border-indigo-200 rounded-2xl bg-indigo-50/20 overflow-hidden shrink-0 min-h-[350px] lg:min-h-0"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="p-3 sm:p-4 bg-white border-b border-indigo-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 truncate pr-2">
              <h3 className="font-bold text-xs sm:text-base text-slate-900 truncate">Gói Hiện tại: {packageName || 'Chưa đặt tên'}</h3>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0">Đang chỉnh sửa</span>
            </div>
            <div className="flex gap-2 items-center text-xs shrink-0">
              <span className="text-slate-500 font-semibold text-xs">Đã chọn ({selectedItems.length})</span>
            </div>
          </div>
          
          <div className="flex-1 p-3 sm:p-6 space-y-3 overflow-y-auto">
            {selectedItems.map((item) => (
              <div key={item._id} className="bg-white p-3 sm:p-4 rounded-xl shadow-2xs border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative group hover:border-indigo-300 transition-all">
                <button 
                  onClick={() => removeItem(item._id, item.name)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xs opacity-80 hover:opacity-100 hover:scale-110 transition-all z-10"
                  title="Xóa hạng mục"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 pr-4">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 justify-between sm:justify-end">
                  <div className="w-28 sm:w-32">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5 sm:mb-1">Giá (VNĐ)</label>
                    <input 
                      type="text" 
                      value={new Intl.NumberFormat('en-US').format(item.price)} 
                      onChange={(e) => handlePriceChange(item._id, e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50/50" 
                    />
                  </div>
                  <div className="w-20 sm:w-28 text-right">
                    <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5 sm:mb-1">Thời gian</label>
                    <input 
                      type="number"
                      min="1" 
                      value={item.estimatedTime ?? 5} 
                      onChange={(e) => handleTimeChange(item._id, e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-center text-indigo-700 focus:ring-1 focus:ring-indigo-500 outline-none bg-indigo-50/50" 
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-indigo-200 rounded-xl h-20 sm:h-24 flex items-center justify-center text-indigo-500 text-xs font-bold bg-white/50 select-none p-3 text-center">
              + Nhấp hoặc kéo thả hạng mục từ thư viện để thêm vào gói
            </div>
          </div>
          
          <div className="p-3 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex gap-4 sm:gap-8">
              <div className="space-y-0.5">
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tổng thời gian</p>
                <p className="text-sm sm:text-lg font-bold font-mono text-indigo-600">{totalDays} <span className="text-xs text-slate-500 font-normal">ngày</span></p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tổng ngân sách</p>
                <p className="text-base sm:text-xl font-bold font-mono text-slate-900">{new Intl.NumberFormat('en-US').format(totalPrice)} <span className="text-xs text-slate-500 font-normal">VNĐ</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xóa gói báo giá"
        message="Bạn có chắc chắn muốn xóa gói báo giá này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Toast Notification (1s duration on mobile & desktop) */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md transition-all flex items-center gap-2 border border-slate-700/50 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none max-w-[90vw] text-center">
          <span className="w-2 h-2 rounded-full bg-[#A6CE39] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
