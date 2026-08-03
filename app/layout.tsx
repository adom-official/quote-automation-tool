import './globals.css';
import Providers from '@/components/Providers';
import ClientOnly from '@/components/ClientOnly';

export const metadata = {
  title: 'Quản lý Báo Giá & Khách Hàng',
  description: 'Hệ thống quản lý báo giá và khách hàng',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`bg-slate-50 text-slate-900 antialiased`} suppressHydrationWarning>
        <Providers>
          <ClientOnly>
            {children}
          </ClientOnly>
        </Providers>
      </body>
    </html>
  );
}
