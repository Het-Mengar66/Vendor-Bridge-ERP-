"use client";

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Users, FileText, CheckSquare, DollarSign, Activity, FileSpreadsheet, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [statsRes, logsRes] = await Promise.all([
          api.get('/reports/dashboard-stats'),
          api.get('/activity/logs?filter=all')
        ]);
        setStats(statsRes.data);
        setActivities(logsRes.data.slice(0, 5)); // show top 5
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval': return ShieldCheck;
      case 'po': return ShoppingCart;
      case 'rfq': return FileText;
      case 'vendor': return Users;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'approval': return { text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'po': return { text: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'rfq': return { text: 'text-indigo-500', bg: 'bg-indigo-500/10' };
      case 'vendor': return { text: 'text-amber-500', bg: 'bg-amber-500/10' };
      default: return { text: 'text-gray-500', bg: 'bg-gray-500/10' };
    }
  };

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
        {user?.role === 'vendor' ? (
          <>
            <StatsCard title="Open RFQs" value={stats ? stats.active_rfqs.toString() : "0"} icon={FileText} trend="New assignments" trendUp={true} delay={0.1} />
            <StatsCard title="Submitted Quotes" value="0" icon={FileSpreadsheet} trend="Awaiting review" trendUp={true} delay={0.2} />
            <StatsCard title="Won Contracts" value="0" icon={CheckSquare} trend="0%" trendUp={true} delay={0.3} />
            <StatsCard title="Total Earnings" value="$0" icon={DollarSign} trend="0%" trendUp={true} delay={0.4} />
          </>
        ) : (
          <>
            <StatsCard title="Active Vendors" value={stats ? stats.vendor_count.toString() : "0"} icon={Users} trend="12%" trendUp={true} delay={0.1} />
            <StatsCard title="Open RFQs" value={stats ? stats.active_rfqs.toString() : "0"} icon={FileText} trend="8%" trendUp={true} delay={0.2} />
            <StatsCard title="Pending Approvals" value={stats ? stats.pending_approvals.toString() : "0"} icon={CheckSquare} trend="2%" trendUp={false} delay={0.3} />
            <StatsCard title="Total PO Value" value={stats ? formatCurrency(stats.total_spent) : "$0"} icon={DollarSign} trend="18%" trendUp={true} delay={0.4} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links / Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" /> Active Workflows
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(user?.role === 'vendor' ? [
              { title: "View Open RFQs", count: stats?.active_rfqs || 0, href: "/rfqs", icon: FileText, color: "bg-indigo-500" },
              { title: "My Quotations", count: 0, href: "/quotations", icon: FileSpreadsheet, color: "bg-blue-500" },
              { title: "My Purchase Orders", count: 0, href: "/purchase-orders", icon: ShoppingCart, color: "bg-emerald-500" },
              { title: "Update Profile", count: 1, href: "/vendors", icon: Users, color: "bg-amber-500" },
            ] : [
              { title: "Review Quotations", count: 12, href: "/quotations", icon: FileSpreadsheet, color: "bg-indigo-500" },
              { title: "Authorize POs", count: stats?.pending_approvals || 0, href: "/approvals", icon: ShieldCheck, color: "bg-emerald-500" },
              { title: "Process Invoices", count: 8, href: "/invoices", icon: DollarSign, color: "bg-amber-500" },
              { title: "Vendor Onboarding", count: stats?.vendor_count || 0, href: "/vendors", icon: Users, color: "bg-blue-500" },
            ]).map((action, i) => (
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
              {loading ? (
                <div className="text-sm text-muted-foreground animate-pulse">Loading activity...</div>
              ) : activities.length > 0 ? (
                activities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.entity_type);
                  const colors = getActivityColor(activity.entity_type);
                  return (
                    <div key={activity.id} className="flex relative">
                      {index !== activities.length - 1 && (
                        <div className="absolute top-10 left-5 bottom-0 w-px bg-border -ml-px" />
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${colors.bg} ${colors.text}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="ml-4 pb-2">
                        <h4 className="text-sm font-bold text-foreground capitalize">{activity.action_type.replace('_', ' ')}</h4>
                        <p className="text-xs text-muted-foreground mt-1 mb-1">{activity.description}</p>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">No recent activity.</div>
              )}
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
