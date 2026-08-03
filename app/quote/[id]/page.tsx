'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ArrowLeft, Download, Check, FileText } from 'lucide-react';
import { AdomLogo } from '@/components/AdomLogo';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { quotes, updateQuote, clients } = useStore();

  const quote = quotes.find(q => q.id === params?.id);
  const client = quote ? clients.find(c => c.id === quote.clientId) : null;

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
        <p className="text-slate-500 font-medium">Báo giá không tồn tại hoặc đã bị xóa.</p>
        <button onClick={() => router.push('/dashboard/quotes')} className="text-indigo-600 font-bold hover:underline text-sm">
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
    window.print();
  };

  const subTotal = quote.totalPrice || 0;
  const vatRate = 0.08;
  const vatAmount = subTotal * vatRate;
  const grandTotal = subTotal + vatAmount;

  return (
    <div className="max-w-4xl mx-auto py-8 print:py-0 print:max-w-none print:w-full print:mx-0">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-fixed-top-bar {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            height: 6mm !important;
            background-color: #A6CE39 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            z-index: 99999 !important;
          }
          .print-page-wrapper {
            padding: 14mm 12mm 12mm 12mm !important;
            margin: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          thead {
            display: table-header-group !important;
          }
          tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:w-full {
            width: 100% !important;
            max-width: none !important;
          }
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Repeating Green Header Bar on Top of EVERY Printed Page */}
      <div className="print-fixed-top-bar hidden print:block" />

      {/* Action Bar (Hidden when printing) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button 
          onClick={() => router.push('/dashboard/quotes')} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadPdf} 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Tải PDF / In ngay
          </button>
          {quote.status !== 'Đã duyệt' && (
            <button 
              onClick={() => updateStatus('Đã duyệt')}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Chốt báo giá
            </button>
          )}
        </div>
      </div>

      {/* Main Quote Canvas (Designed specifically for A4 PDF layout) */}
      <div className="bg-white shadow-sm border border-slate-200 mx-auto print:border-none print:shadow-none print:w-full rounded-2xl print:rounded-none" style={{ maxWidth: '210mm' }}>
        
        {/* Screen-only 6mm Brand Bar at top of card preview */}
        <div className="h-[6mm] w-full bg-[#A6CE39] shrink-0 rounded-t-2xl print:hidden" />

        <div className="bg-white p-8 sm:p-12 print-page-wrapper print:p-0 print:w-full">
          
          {/* Header Columns */}
          <div className="grid grid-cols-2 gap-8 mb-6 border-b border-slate-100 pb-6 break-inside-avoid">
            {/* Left Column - Client */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">KHÁCH HÀNG</h3>
              <div className="flex flex-col gap-1.5 mb-2">
                <div className="h-14 flex items-center justify-start">
                  {client?.logo ? (
                    <img src={client.logo} alt={quote.clientName} className="w-14 h-14 object-contain rounded-xl border border-slate-100 p-1 bg-slate-50" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                </div>
                <p className="font-bold text-slate-900 text-base">{quote.clientCompany || quote.clientName}</p>
              </div>
              <div className="space-y-0.5 text-xs text-slate-500">
                {quote.clientAddress && <p>{quote.clientAddress}</p>}
                {quote.clientPhone && <p>SĐT: {quote.clientPhone}</p>}
                {quote.clientEmail && <p>Email: {quote.clientEmail}</p>}
              </div>
            </div>
            
            {/* Right Column - Provider */}
            <div className="text-right flex flex-col items-end">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 w-full text-right">ĐƠN VỊ BÁO GIÁ</h3>
              <div className="flex flex-col items-end gap-1.5 mb-2 w-full">
                <div className="h-14 flex items-center justify-end w-full">
                  <div className="w-36">
                    <AdomLogo className="w-full h-auto" align="right" />
                  </div>
                </div>
                <p className="font-bold text-slate-900 text-base">ADOM Creative</p>
              </div>
              <div className="space-y-0.5 text-xs text-slate-500 w-full text-right">
                <p>Số 2 liền kề 6 KĐT Đại Thanh, xã Đại Thanh, Hà Nội</p>
                <p>Hotline: 0985048267</p>
                <p>Email: creative.adom@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6 break-inside-avoid">
            <h1 className="text-2xl font-black text-[#A6CE39] mb-1 uppercase tracking-tight">BÁO GIÁ DỊCH VỤ THIẾT KẾ</h1>
            <p className="text-xs text-slate-500">
              Mã báo giá <span className="font-mono font-bold uppercase">#{String(quote.id || '').split('-')[0] || String(quote.id || '').slice(0,8)}</span> · Dự án: <span className="font-semibold text-slate-800">{quote.projectName}</span>
            </p>
          </div>

          {/* Table */}
          <div className="mb-6">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-2.5 font-bold text-xs text-slate-700 uppercase tracking-wider">STT</th>
                  <th className="py-2.5 font-bold text-xs text-slate-700 uppercase tracking-wider">TÊN HẠNG MỤC</th>
                  <th className="py-2.5 font-bold text-xs text-slate-700 uppercase tracking-wider text-center w-28">THỜI GIAN</th>
                  <th className="py-2.5 font-bold text-xs text-slate-700 uppercase tracking-wider text-right w-36">ĐƠN GIÁ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quote.items?.map((item: any, index: number) => (
                  <tr key={index} className="break-inside-avoid">
                    <td className="py-3 text-xs text-slate-400 font-mono w-8">{index + 1}</td>
                    <td className="py-3 font-semibold text-slate-800">{item.name}</td>
                    <td className="py-3 text-center text-slate-500 text-xs">{item.estimatedTime ? `${item.estimatedTime} ngày` : '—'}</td>
                    <td className="py-3 text-right font-bold text-slate-900 font-mono">
                      {new Intl.NumberFormat('en-US').format(item.price)}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[11px] italic text-slate-400 mt-3 break-inside-avoid">
              * Đơn giá nêu trên chưa bao gồm 8% thuế VAT.
            </div>
          </div>

          {/* Totals & Signatures */}
          <div className="break-inside-avoid">
            <div className="flex justify-end mb-6">
              <div className="w-72">
                <div className="flex justify-between py-1.5 text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-mono font-medium">{new Intl.NumberFormat('en-US').format(subTotal)}đ</span>
                </div>
                <div className="flex justify-between py-1.5 text-sm text-slate-600">
                  <span>Thuế VAT (8%)</span>
                  <span className="font-mono font-medium">
                    {new Intl.NumberFormat('en-US').format(vatAmount)}đ
                  </span>
                </div>
                <div className="flex justify-between py-2.5 text-base font-black text-[#A6CE39] border-t-2 border-slate-900 mt-1">
                  <span>Tổng cộng</span>
                  <span className="font-mono text-[#A6CE39]">{new Intl.NumberFormat('en-US').format(grandTotal)}đ</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end mb-8">
              <p className="text-xs text-slate-500 mb-4" suppressHydrationWarning>
                Hà Nội, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
              </p>
              <h4 className="font-bold text-[#0B1527] text-sm uppercase mb-1">CÔNG TY ADOM CREATIVE</h4>
              <p className="text-[10px] text-slate-400 italic">(Ký, ghi rõ họ tên)</p>
            </div>
          </div>

          {/* ĐIỀU KHOẢN THƯƠNG MẠI */}
          <div className="border-t border-slate-100 pt-6 mt-4">
            <h2 className="text-sm font-bold text-[#0B1527] uppercase tracking-wider mb-4 break-inside-avoid">ĐIỀU KHOẢN THƯƠNG MẠI</h2>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="break-inside-avoid">
                <h4 className="font-bold text-slate-700 mb-1 uppercase text-[11px]">1. THANH TOÁN</h4>
                <p>- Đặt cọc 50% giá trị báo giá ngay sau khi hai bên xác nhận.</p>
                <p>- Thanh toán 50% còn lại trong vòng 3 ngày kể từ khi bàn giao file thiết kế hoàn chỉnh.</p>
              </div>

              <div className="break-inside-avoid">
                <h4 className="font-bold text-slate-700 mb-1 uppercase text-[11px]">2. TIẾN ĐỘ THỰC HIỆN</h4>
                <p>- Thời gian hoàn thành được tính từ ngày nhận đủ tài liệu cần thiết và tiền cọc.</p>
                <p>- Miễn phí tối đa 2 lần chỉnh sửa cho mỗi hạng mục. Từ lần thứ 3 áp dụng phụ phí theo thoả thuận riêng.</p>
              </div>

              <div className="break-inside-avoid">
                <h4 className="font-bold text-slate-700 mb-1 uppercase text-[11px]">3. BÀN GIAO & BẢN QUYỀN</h4>
                <p>- File thiết kế gốc (AI/PSD/Figma) được bàn giao sau khi khách hàng thanh toán đầy đủ.</p>
                <p>- Bản quyền thiết kế thuộc về khách hàng kể từ thời điểm hoàn tất thanh toán.</p>
              </div>

              <div className="break-inside-avoid">
                <h4 className="font-bold text-slate-700 mb-1 uppercase text-[11px]">4. HIỆU LỰC BÁO GIÁ</h4>
                <p>- Báo giá có hiệu lực trong vòng 15 ngày kể từ ngày phát hành.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
