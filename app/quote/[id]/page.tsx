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
        @media screen {
          thead.print-header-top {
            display: none !important;
          }
        }
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          div, main {
            overflow: visible !important;
          }
          thead.print-header-top {
            display: table-header-group !important;
          }
          thead.print-header-top tr,
          thead.print-header-top th {
            height: 6mm !important;
            background-color: #A6CE39 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
          }
          .print-quote-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          tr, .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print\:hidden {
            display: none !important;
          }
          .print\:border-none {
            border: none !important;
          }
          .print\:shadow-none {
            box-shadow: none !important;
          }
          .print\:w-full {
            width: 100% !important;
            max-width: none !important;
          }
        }
      `}</style>

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
      <div className="bg-white shadow-sm border border-slate-200 mx-auto print:border-none print:shadow-none print:w-full rounded-2xl print:rounded-none overflow-hidden print:overflow-visible" style={{ maxWidth: '210mm' }}>
        
        {/* Screen-only 6mm Brand Bar at top of card preview */}
        <div className="h-[6mm] w-full bg-[#A6CE39] shrink-0 rounded-t-2xl print:hidden" />

        {/* Print-compatible Table Wrapper (repeats top green bar on top of EVERY printed page natively across Chrome & Mobile Safari) */}
        <table className="w-full border-collapse p-0 m-0 border-none print-quote-table">
          <thead className="print-header-top">
            <tr>
              <th className="p-0 border-none m-0 font-normal bg-[#A6CE39] h-[6mm]" style={{ backgroundColor: '#A6CE39', height: '6mm', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                <div 
                  className="w-full bg-[#A6CE39]" 
                  style={{ 
                    height: '6mm', 
                    width: '100%', 
                    backgroundColor: '#A6CE39', 
                    WebkitPrintColorAdjust: 'exact', 
                    printColorAdjust: 'exact' 
                  }} 
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-0 border-none">
                <div className="bg-white p-6 sm:p-12 print:p-[8mm_12mm_12mm_12mm] print:w-full">
                  
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

                  {/* ĐIỀU KHOẢN THƯƠNG MẠI GÓI THIẾT KẾ LOGO STANDARD */}
                  <div className="border-t border-slate-100 pt-6 mt-4">
                    <h2 className="text-xs sm:text-sm font-bold text-[#0B1527] uppercase tracking-wider mb-4 break-inside-avoid">
                      ĐIỀU KHOẢN THƯƠNG MẠI GÓI THIẾT KẾ LOGO STANDARD
                    </h2>

                    <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
                      <div className="break-inside-avoid">
                        <p>
                          <span className="font-bold text-slate-900">Điều khoản 1.</span> Quý khách sau khi xác nhận sử dụng dịch vụ sẽ tạm ứng 50% chi phí, 50% còn lại Quý khách vui lòng thanh toán trước khi chúng tôi bàn giao file gốc.
                        </p>
                      </div>

                      <div className="break-inside-avoid">
                        <p>
                          <span className="font-bold text-slate-900">Điều khoản 2.</span> Trước khi thực hiện công việc thiết kế, hai bên cần thống nhất định hướng thiết kế trong file “Brief Logo”.
                        </p>
                      </div>

                      <div className="break-inside-avoid space-y-2">
                        <p>
                          <span className="font-bold text-slate-900">Điều khoản 3.</span> Sau 4 ngày làm việc (không tính thứ 7, Chủ nhật), ADOM sẽ đề xuất 3 phương án logo.
                        </p>
                        <div className="pl-4 sm:pl-6 space-y-2 border-l-2 border-slate-200 ml-1">
                          <p className="break-inside-avoid">
                            <span className="font-bold text-slate-900">A,</span> Quý khách chọn 1 phương án để phát triển tiếp; Quý khách có 3 lần chỉnh sửa, mỗi lần chỉnh sửa không quá 30% tổng thể (ví dụ màu sắc, kiểu chữ, bố cục,…)
                          </p>
                          <p className="break-inside-avoid">
                            <span className="font-bold text-slate-900">B,</span> Nếu quý khách không đồng ý với cả 3 phương án: nếu do ADOM chưa bám sát yêu cầu ban đầu, chúng tôi sẽ tiếp tục đề xuất thêm phương án thứ 4 và không tính thêm phí; Trong trường hợp Quý khách vẫn không đồng ý với phương án tiếp theo ADOM đưa ra, chúng tôi có quyền đơn phương chấm dứt công việc và chi phí tạm ứng được chi trả cho số ngày làm việc vừa qua.
                          </p>
                          <p className="break-inside-avoid">
                            <span className="font-bold text-slate-900">C,</span> Đối với trường hợp Quý khách muốn chỉnh sửa hơn 3 lần trên phương án đã chọn ADOM sẽ tính thêm phí từ lần thứ 4 trở đi (chúng tôi sẽ báo giá phù hợp với yêu cầu của Quý khách).
                          </p>
                          <p className="break-inside-avoid">
                            <span className="font-bold text-slate-900">D,</span> Mỗi lần gửi duyệt, Quý khách vui lòng phản hồi trong tối đa 5 ngày; quá hạn coi như đã duyệt phương án.
                          </p>
                        </div>
                      </div>

                      <div className="break-inside-avoid">
                        <p>
                          <span className="font-bold text-slate-900">Điều khoản 4.</span> File gốc chỉ bàn giao khi đã thanh toán đủ 100%.
                        </p>
                      </div>

                      <div className="break-inside-avoid">
                        <p>
                          <span className="font-bold text-slate-900">Điều khoản 5.</span> Báo giá có hiệu lực 15 ngày kể từ ngày phát hành.
                        </p>
                      </div>

                      <div className="break-inside-avoid">
                        <p>
                          <span className="font-bold text-slate-900">Điều khoản 6.</span> Trong trường hợp Quý khách đã tạm ứng, ADOM đã triển khai công việc mà Quý khách huỷ dự án thì chúng tôi không hoàn lại phí tạm ứng.
                        </p>
                      </div>

                      <div className="break-inside-avoid">
                        <p>
                          <span className="font-bold text-slate-900">Điều khoản 7.</span> Trong trường hợp Quý khách đổi định hướng thiết kế so với Brief ban đầu ADOM sẽ tính là dự án mới và chúng tôi sẽ có báo giá mới.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
