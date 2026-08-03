'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ArrowLeft, Download, Check, Clock, FileText, Loader2 } from 'lucide-react';
import { AdomLogo } from '@/components/AdomLogo';
import { useRef, useState } from 'react';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { quotes, updateQuote, clients } = useStore();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showIframeWarning, setShowIframeWarning] = useState(false);

  const quote = quotes.find(q => q.id === params?.id);
  const client = quote ? clients.find(c => c.id === quote.clientId) : null;

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-slate-500">Báo giá không tồn tại hoặc đã bị xóa.</p>
        <button onClick={() => router.push('/dashboard/quotes')} className="text-indigo-600 font-medium hover:underline">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const updateStatus = (status: string) => {
    updateQuote(quote.id, { status });
  };

  const handleDownloadPdf = () => {
    if (typeof window === 'undefined') return;
    
    // Kiểm tra xem ứng dụng có đang chạy trong iframe không
    if (window.self !== window.top) {
      setShowIframeWarning(true);
      setTimeout(() => setShowIframeWarning(false), 5000);
      return;
    }
    
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 print:py-0 print:max-w-none print:w-full print:mx-0">
      {showIframeWarning && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-start gap-3 print:hidden">
          <div className="mt-0.5 font-bold text-amber-500">!</div>
          <div className="text-sm">
            <p className="font-semibold mb-1">Không thể tải PDF trong chế độ xem trước (Preview)</p>
            <p>Vui lòng mở ứng dụng trong một tab mới bằng cách nhấn vào <strong>biểu tượng ô vuông có mũi tên</strong> ở góc trên màn hình, sau đó thử lại.</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button onClick={() => router.push('/dashboard/quotes')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Quay lại</span>
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadPdf} 
            disabled={isDownloading}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${
              downloadSuccess 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tạo file...
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Đã xong
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Tải PDF
              </>
            )}
          </button>
          {quote.status !== 'Đã duyệt' && (
            <button 
              onClick={() => updateStatus('Đã duyệt')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              Chốt báo giá
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 mx-auto overflow-hidden print:border-none print:shadow-none print:w-full" style={{ maxWidth: '210mm' }}>
        <div ref={contentRef} className="bg-white p-10 sm:p-12 print:p-12 print:w-full">
          
          {/* Header Columns */}
          <div className="grid grid-cols-2 gap-8 mb-6 border-b border-slate-100 pb-4 print:break-inside-avoid">
            {/* Left Column - Client */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">KHÁCH HÀNG</h3>
              <div className="flex flex-col gap-2 mb-2">
                <div className="h-16 flex items-center justify-start">
                  {client?.logo ? (
                    <img src={client.logo} alt={quote.clientName} className="w-16 h-16 object-contain rounded-xl border border-slate-100 p-1.5 bg-slate-50" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                </div>
                <p className="font-bold text-slate-900 text-base">{quote.clientCompany || quote.clientName}</p>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <p>{quote.clientAddress || '---'}</p>
                <p>{quote.clientPhone || '---'}</p>
                <p>{quote.clientEmail || '---'}</p>
              </div>
            </div>
            
            {/* Right Column - Provider */}
            <div className="text-right flex flex-col items-end">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 w-full text-right">ĐƠN VỊ BÁO GIÁ</h3>
              <div className="flex flex-col items-end gap-2 mb-2 w-full">
                <div className="h-16 flex items-center justify-end w-full">
                  <div className="w-40">
                    <AdomLogo className="w-full h-auto" align="right" />
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-base">ADOM Design Studio</p>
              </div>
              <div className="space-y-1 text-xs text-slate-500 w-full text-right">
                <p>88 Xã Đàn, Đống Đa, Hà Nội</p>
                <p>0909 888 999</p>
                <p>hello@adomstudio.vn</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6 print:break-inside-avoid">
            <h1 className="text-2xl font-bold text-[#0B1527] mb-1 uppercase tracking-tight">BÁO GIÁ DỊCH VỤ THIẾT KẾ</h1>
            <p className="text-xs text-slate-400">
              Mã báo giá <span className="uppercase">#{String(quote.id || '').split('-')[0] || String(quote.id || '').slice(0,6)}</span> · Dự án: {quote.projectName}
            </p>
          </div>

          {/* Table */}
          <div className="mb-8">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 font-bold text-xs text-slate-500 uppercase tracking-wider border-b-2 border-slate-800">TÊN HẠNG MỤC</th>
                  <th className="py-3 font-bold text-xs text-slate-500 uppercase tracking-wider border-b-2 border-slate-800 text-center w-32">THỜI GIAN</th>
                  <th className="py-3 font-bold text-xs text-slate-500 uppercase tracking-wider border-b-2 border-slate-800 text-right w-40">ĐƠN GIÁ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quote.items?.map((item: any, index: number) => (
                  <tr key={index} className="print:break-inside-avoid">
                    <td className="py-4 font-semibold text-slate-800">{item.name}</td>
                    <td className="py-4 text-center text-slate-500">{item.estimatedTime} ngày</td>
                    <td className="py-4 text-right font-bold text-slate-800">
                      {new Intl.NumberFormat('en-US').format(item.price)}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[10px] italic text-slate-400 mt-4 print:break-inside-avoid">
              * Đơn giá nêu trên chưa bao gồm thuế VAT.
            </div>
          </div>

          {/* Totals & Signatures */}
          <div className="print:break-inside-avoid">
            <div className="flex justify-end mb-8">
              <div className="w-72">
                <div className="flex justify-between py-2 text-sm text-slate-500">
                  <span>Tạm tính</span>
                  <span>{new Intl.NumberFormat('en-US').format(quote.totalPrice || 0)}đ</span>
                </div>
                <div className="flex justify-between py-2 text-sm text-slate-500">
                  <span>VAT (8%)</span>
                  <span>{new Intl.NumberFormat('en-US').format((quote.totalPrice || 0) * 0.08)}đ</span>
                </div>
                <div className="flex justify-between py-3 text-lg font-black text-[#0B1527] border-t-2 border-slate-800 mt-2">
                  <span>Tổng cộng</span>
                  <span>{new Intl.NumberFormat('en-US').format((quote.totalPrice || 0) * 1.08)}đ</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end mb-10">
              <p className="text-xs text-slate-500 mb-6" suppressHydrationWarning>
                Hà Nội, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
              </p>
              <h4 className="font-bold text-[#0B1527] text-sm uppercase mb-1">CÔNG TY ADOM DESIGN STUDIO</h4>
              <p className="text-[10px] text-slate-400 italic">(Ký, ghi rõ họ tên)</p>
            </div>
          </div>

          {/* ĐIỀU KHOẢN THƯƠNG MẠI */}
          <div className="border-t border-slate-100 pt-10 mt-6 print:break-before-auto">
            <h2 className="text-lg font-bold text-[#0B1527] uppercase tracking-tight mb-6 print:break-inside-avoid">ĐIỀU KHOẢN THƯƠNG MẠI</h2>

            <div className="space-y-6 text-sm text-slate-600 mb-8">
              <div className="print:break-inside-avoid">
                <h4 className="font-medium text-slate-500 mb-2 uppercase">1. THANH TOÁN</h4>
                <p>- Đặt cọc 50% giá trị báo giá ngay sau khi hai bên xác nhận.</p>
                <p>- Thanh toán 50% còn lại trong vòng 3 ngày kể từ khi bàn giao file thiết kế hoàn chỉnh.</p>
              </div>

              <div className="print:break-inside-avoid">
                <h4 className="font-medium text-slate-500 mb-2 uppercase">2. TIẾN ĐỘ THỰC HIỆN</h4>
                <p>- Thời gian hoàn thành được tính từ ngày nhận đủ tài liệu cần thiết và tiền cọc.</p>
                <p>- Miễn phí tối đa 2 lần chỉnh sửa cho mỗi hạng mục. Từ lần thứ 3 áp dụng phụ phí theo thoả thuận riêng.</p>
              </div>

              <div className="print:break-inside-avoid">
                <h4 className="font-medium text-slate-500 mb-2 uppercase">3. BÀN GIAO & BẢN QUYỀN</h4>
                <p>- File thiết kế gốc (AI/PSD) được bàn giao sau khi khách hàng thanh toán đầy đủ.</p>
                <p>- Bản quyền thiết kế thuộc về khách hàng kể từ thời điểm hoàn tất thanh toán.</p>
              </div>

              <div className="print:break-inside-avoid">
                <h4 className="font-medium text-slate-500 mb-2 uppercase">4. HIỆU LỰC BÁO GIÁ</h4>
                <p>- Báo giá có hiệu lực trong vòng 15 ngày kể từ ngày phát hành.</p>
                <p>- Đơn giá nêu trên chưa bao gồm thuế VAT.</p>
              </div>

              <div className="print:break-inside-avoid">
                <h4 className="font-medium text-slate-500 mb-2 uppercase">5. HUỶ DỰ ÁN</h4>
                <p>- Nếu khách hàng huỷ dự án sau khi đã đặt cọc, khoản cọc sẽ không được hoàn lại.</p>
              </div>

              <div className="print:break-inside-avoid">
                <h4 className="font-medium text-slate-500 mb-4 uppercase">6. THÔNG TIN THANH TOÁN</h4>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white p-2 border border-slate-200 rounded-xl shrink-0 flex items-center justify-center">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=001100223344" alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>Vietcombank – CN Hà Nội – STK 0011 0022 3344 – ADOM DESIGN STUDIO</p>
                    <p>MST: 0109 xxx xxx</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
