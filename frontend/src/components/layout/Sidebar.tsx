"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, FileSpreadsheet, CheckSquare, ShoppingCart, Receipt, BarChart2, BarChart3, DollarSign, Activity, ShieldCheck, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Vendors', href: '/vendors', icon: Users },
  { name: 'RFQs', href: '/rfqs', icon: FileText },
  { name: 'Quotations', href: '/quotations', icon: FileSpreadsheet },
  { name: 'Approvals', href: '/approvals', icon: CheckSquare },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
  { name: 'Invoices', href: '/invoices', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'AI Copilot', href: '/ai-copilot', icon: Bot, isSpecial: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-grow border-r border-border bg-card/80 backdrop-blur-xl overflow-y-auto z-10 transition-colors shadow-sm">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-foreground tracking-tight">VendorBridge</span>
      </div>
      
      <div className="mt-6 flex-grow flex flex-col px-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Main Menu
        </div>
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon
                  className={`relative mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                    isActive ? 'text-primary drop-shadow-sm' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                  aria-hidden="true"
                />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 w-12 h-12 bg-primary/20 rounded-full blur-xl" />
          <h4 className="text-sm font-semibold text-foreground mb-1">Need help?</h4>
          <p className="text-xs text-muted-foreground mb-3">Check our documentation or contact support.</p>
          <button className="w-full text-xs font-medium bg-background border border-border hover:bg-secondary transition-colors py-1.5 rounded-lg text-foreground">
            View Docs
          </button>
        </div>
      </div>
    </div>
  );
}
