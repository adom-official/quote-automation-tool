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

  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const addItemToPackage = (item: any) => {
    setSelectedItems(prev => [...prev, {
      ...item,
      estimatedTime: item.estimatedTime ?? 5,
      _id: (item.id || item.name) + '-' + Date.now() + '-' + Math.random()
    }]);
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

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item._id !== id));
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
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => router.push('/dashboard/packages')} className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900">Chỉnh sửa Gói Báo Giá</h2>
          </div>
          <p className="text-slate-500 text-sm pl-7">Kéo thả hoặc nhấp chọn hạng mục từ thư viện để thêm/sửa gói báo giá.</p>
        </div>
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-1.5 mr-2"
          >
            <Trash2 className="w-4 h-4" />
            Xóa gói
          </button>
          <button onClick={() => router.push('/dashboard/packages')} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">Hủy</button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-5 py-2 bg-[#A6CE39] hover:bg-[#95ba33] text-slate-900 rounded-xl text-sm font-bold shadow-sm disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tên Gói *</label>
          <input type="text" value={packageName} onChange={e => setPackageName(e.target.value)} placeholder="VD: BR-SME-ADVANCED" className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm font-medium transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Ngân sách dự kiến</label>
          <input 
            type="text" 
            value={budget} 
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '');
              setBudget(val ? Number(val).toLocaleString('en-US') : '');
            }} 
            placeholder="VD: Cao cấp" 
            className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm font-medium transition-all" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Quy mô doanh nghiệp</label>
          <input type="text" value={scale} onChange={e => setScale(e.target.value)} placeholder="VD: SME" className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm font-medium transition-all" />
        </div>
      </div>
      
      <div className="flex flex-1 gap-6 overflow-hidden min-h-[400px]">
        {/* Left Column: Thư viện Hạng mục thiết kế */}
        <div className="w-1/3 flex flex-col border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white shrink-0">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Thư viện hạng mục thiết kế</h3>
            <span className="text-[11px] text-slate-400">Kéo hoặc nhấp + để thêm</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Chưa có hạng mục nào trong thư viện.</p>
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
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors pr-6">{item.name}</p>
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
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-semibold">{item.estimatedTime ? `${item.estimatedTime} ngày` : '5 ngày'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right Column: Gói Hiện tại */}
        <div 
          className="flex-1 flex flex-col border border-indigo-200 rounded-2xl bg-indigo-50/20 overflow-hidden shrink-0"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="p-4 bg-white border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-900">Gói Hiện tại: {packageName || 'Chưa đặt tên'}</h3>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[10px] font-bold uppercase tracking-wider">Đang chỉnh sửa</span>
            </div>
            <div className="flex gap-4 items-center text-xs">
              <span className="text-slate-500 font-semibold">Đã chọn ({selectedItems.length})</span>
            </div>
          </div>
          
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {selectedItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-xl shadow-2xs border border-indigo-100 flex items-center justify-between relative group hover:border-indigo-300 transition-all">
                <button 
                  onClick={() => removeItem(item._id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xs opacity-80 hover:opacity-100 hover:scale-110 transition-all"
                  title="Xóa hạng mục"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 pr-4">
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-32">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Giá (VNĐ)</label>
                    <input 
                      type="text" 
                      value={new Intl.NumberFormat('en-US').format(item.price)} 
                      onChange={(e) => handlePriceChange(item._id, e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 text-sm font-mono font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50/50" 
                    />
                  </div>
                  <div className="w-28 text-right">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Thời gian (ngày)</label>
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
            
            <div className="border-2 border-dashed border-indigo-200 rounded-xl h-24 flex items-center justify-center text-indigo-500 text-xs font-bold bg-white/50 select-none">
              + Kéo thả hoặc nhấp hạng mục từ thư viện bên trái để thêm vào gói này
            </div>
          </div>
          
          <div className="p-5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex gap-8">
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tổng thời gian</p>
                <p className="text-lg font-bold font-mono text-indigo-600">{totalDays} <span className="text-xs text-slate-500 font-normal">ngày làm việc</span></p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tổng ngân sách (Chưa VAT)</p>
                <p className="text-xl font-bold font-mono text-slate-900">{new Intl.NumberFormat('en-US').format(totalPrice)} <span className="text-xs text-slate-500 font-normal">VNĐ</span></p>
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
    </div>
  );
}
