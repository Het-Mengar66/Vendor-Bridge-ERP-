"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, FileSpreadsheet, CheckSquare, ShoppingCart, Receipt, BarChart2, Activity } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Vendors', href: '/vendors', icon: Users },
  { name: 'RFQs', href: '/rfqs', icon: FileText },
  { name: 'Quotations', href: '/quotations', icon: FileSpreadsheet },
  { name: 'Approvals', href: '/approvals', icon: CheckSquare },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
  { name: 'Activity', href: '/activity', icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4 py-5 border-b">
        <span className="text-xl font-bold text-blue-600">VendorBridge</span>
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1 bg-white">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
