import {  Home, FileText, User  } from 'lucide-react';

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: FileText, label: 'Items', href: '/admin/items' },
    { icon: FileText, label: 'Offers', href: '/admin/offer' },
    { icon: User, label: 'Cashiers', href: '/admin/cashiers' },
  ];

export default menuItems;
