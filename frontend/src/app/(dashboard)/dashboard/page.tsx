"use client";

import { StatsCard } from '@/components/dashboard/StatsCard';
import { Users, FileText, CheckSquare, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name || 'Procurement Officer'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here is what is happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Vendors" 
          value="24" 
          icon={Users} 
          trend="+2 new" 
          trendUp={true} 
        />
        <StatsCard 
          title="Active RFQs" 
          value="12" 
          icon={FileText} 
          trend="+3 this week" 
          trendUp={true} 
        />
        <StatsCard 
          title="Pending Approvals" 
          value="5" 
          icon={CheckSquare} 
          trend="-2 from yesterday" 
          trendUp={false} 
        />
        <StatsCard 
          title="Total PO Value" 
          value="$2.3L" 
          icon={DollarSign} 
          trend="+12%" 
          trendUp={true} 
        />
      </div>

      {/* Placeholders for charts/tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Recent Purchase Orders Placeholder</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Procurement Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
}
