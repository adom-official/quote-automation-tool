import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900 font-sans selection:bg-yellow-300 print:h-auto print:overflow-visible print:block">
      <div className="print:hidden shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col relative z-0 h-screen overflow-hidden bg-slate-50 print:bg-white print:h-auto print:overflow-visible print:block">
        <div className="print:hidden">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 print:p-0 print:m-0 print:overflow-visible print:h-auto print:block">
          <div className="max-w-7xl mx-auto h-full print:max-w-none print:w-full print:h-auto print:block">
            {children}
          </div>
        </main>
      </div>
      <div className="print:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
