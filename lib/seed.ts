import { useStore } from '@/lib/store';

export const seedInitialData = () => {
  const { clients, items, packages, quotes, addClient, addItem, addPackage, addQuote } = useStore.getState();
  
  if (clients.length === 0 && items.length === 0 && packages.length === 0) {
    const defaultClients = [
      {
        name: 'Công ty CP Tập đoàn T-Holding',
        email: 'contact@t-holding.com',
        phone: '0901234567',
        company: 'T-Holding',
        address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      },
      {
        name: 'Trần Văn An (TechCorp)',
        email: 'an.tran@techcorp.vn',
        phone: '0987654321',
        company: 'TechCorp Vietnam',
        address: '456 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
      },
      {
        name: 'Lê Thị Bình (EcoShop)',
        email: 'binh.le@ecoshop.com',
        phone: '0912345678',
        company: 'EcoShop',
        address: '789 Lê Lợi, Quận 1, TP.HCM',
      }
    ];

    defaultClients.forEach(c => addClient(c));

    const defaultItems = [
      { name: 'Thiết kế Logo cơ bản', price: 2500000, estimatedTime: 3 },
      { name: 'Thiết kế Logo cao cấp (Brand Identity)', price: 8000000, estimatedTime: 10 },
      { name: 'Thiết kế Namecard', price: 500000, estimatedTime: 1 },
      { name: 'Thiết kế Profile Công ty (20 trang)', price: 6000000, estimatedTime: 7 },
      { name: 'Thiết kế Brochure (Gấp 3)', price: 1500000, estimatedTime: 2 },
      { name: 'Thiết kế Banner Website', price: 800000, estimatedTime: 1 },
      { name: 'Thiết kế Băng rôn / Standee', price: 1000000, estimatedTime: 1 },
      { name: 'Thiết kế Bao bì sản phẩm', price: 4000000, estimatedTime: 5 },
      { name: 'Thiết kế Giao diện Website (Trang chủ)', price: 5000000, estimatedTime: 5 },
      { name: 'Thiết kế Giao diện Website (Trang con)', price: 1500000, estimatedTime: 2 }
    ];

    defaultItems.forEach(i => addItem(i));

    const defaultPackages = [
      {
        name: 'Gói Nhận diện Thương hiệu Cơ bản',
        description: 'Bao gồm logo và namecard dành cho doanh nghiệp nhỏ.',
        totalPrice: 3000000,
        items: [
          { name: 'Thiết kế Logo cơ bản', price: 2500000, estimatedTime: 3 },
          { name: 'Thiết kế Namecard', price: 500000, estimatedTime: 1 }
        ]
      },
      {
        name: 'Gói Thiết kế Website & Truyền thông',
        description: 'Gói thiết kế giao diện web cơ bản và banner quảng cáo.',
        totalPrice: 7300000,
        items: [
          { name: 'Thiết kế Giao diện Website (Trang chủ)', price: 5000000, estimatedTime: 5 },
          { name: 'Thiết kế Giao diện Website (Trang con)', price: 1500000, estimatedTime: 2 },
          { name: 'Thiết kế Banner Website', price: 800000, estimatedTime: 1 }
        ]
      }
    ];

    defaultPackages.forEach(p => addPackage(p));
  }
};
