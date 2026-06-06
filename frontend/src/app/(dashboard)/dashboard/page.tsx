"use client";

import { StatsCard } from '@/components/dashboard/StatsCard';
import { Users, FileText, CheckSquare, DollarSign, Activity, FileSpreadsheet, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const recentActivities = [
    { id: 1, type: 'approval', title: 'Quotation Awarded', description: 'Tech Solutions Inc. awarded for RFQ-2026-001', time: '2 hours ago', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 2, type: 'po', title: 'Purchase Order Issued', description: 'PO-2026-042 sent to Tech Solutions Inc.', time: '4 hours ago', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 3, type: 'rfq', title: 'New RFQ Published', description: 'Warehouse Racking System (RFQ-2026-002)', time: 'Yesterday', icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 4, type: 'vendor', title: 'Vendor Registered', description: 'Global Logistics Partners submitted profile', time: 'Yesterday', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-primary/10 via-card to-card p-8 rounded-3xl border border-primary/20 shadow-sm relative overflow-hidden"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-primary">{user?.first_name || 'Procurement Officer'}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Here is an overview of your procurement operations today.</p>
        </div>

        <Link 
          href="/rfqs/create"
          className="relative z-10 px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center"
        >
          <FileText className="w-5 h-5 mr-2" /> Quick RFQ
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Vendors" 
          value="24" 
          icon={Users} 
          trend="12%" 
          trendUp={true}
          delay={0.1}
        />
        <StatsCard 
          title="Open RFQs" 
          value="12" 
          icon={FileText} 
          trend="8%" 
          trendUp={true}
          delay={0.2}
        />
        <StatsCard 
          title="Pending Approvals" 
          value="5" 
          icon={CheckSquare} 
          trend="2%" 
          trendUp={false}
          delay={0.3}
        />
        <StatsCard 
          title="Total PO Value" 
          value="$245K" 
          icon={DollarSign} 
          trend="18%" 
          trendUp={true}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links / Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" /> Active Workflows
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Review Quotations", count: 12, href: "/quotations", icon: FileSpreadsheet, color: "bg-indigo-500" },
              { title: "Authorize POs", count: 3, href: "/approvals", icon: ShieldCheck, color: "bg-emerald-500" },
              { title: "Process Invoices", count: 8, href: "/invoices", icon: DollarSign, color: "bg-amber-500" },
              { title: "Vendor Onboarding", count: 2, href: "/vendors", icon: Users, color: "bg-blue-500" },
            ].map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                <Link href={action.href} className="flex items-center p-5 glass-panel rounded-2xl hover:border-primary/30 transition-all group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${action.color} shadow-md`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.count} items require attention</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 rounded-2xl h-full border border-border"
          >
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center">
              Recent Activity
            </h2>
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex relative">
                  {index !== recentActivities.length - 1 && (
                    <div className="absolute top-10 left-5 bottom-0 w-px bg-border -ml-px" />
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${activity.bg} ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-4 pb-2">
                    <h4 className="text-sm font-bold text-foreground">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 mb-1">{activity.description}</p>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors">
              View All Activity
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
