"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, PieChart, Download, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const spendData = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 52 },
    { month: "Mar", value: 48 },
    { month: "Apr", value: 61 },
    { month: "May", value: 59 },
    { month: "Jun", value: 75 },
  ];

  const categoryData = [
    { name: "Hardware", percentage: 45, color: "bg-blue-500" },
    { name: "Software", percentage: 25, color: "bg-indigo-500" },
    { name: "Services", percentage: 20, color: "bg-emerald-500" },
    { name: "Office", percentage: 10, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-border shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Visualize procurement spend and vendor performance.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-background border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
            <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button 
            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/reports/export`, '_blank')}
            className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Procurement Spend", value: "$340,500", trend: "+12.5%", isPositive: true },
          { title: "Average Savings vs Budget", value: "8.2%", trend: "+1.2%", isPositive: true },
          { title: "Average Vendor Rating", value: "4.6 / 5", trend: "-0.1", isPositive: false },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-2xl border border-border"
          >
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{kpi.title}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
              <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-md ${kpi.isPositive ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10'}`}>
                {kpi.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {kpi.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spend Trend Chart (CSS Grid Bar Chart) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-border flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" /> Spend Trend
            </h2>
            <span className="text-sm font-medium text-muted-foreground">in Thousands (USD)</span>
          </div>
          
          <div className="flex-1 flex items-end gap-2 sm:gap-6 pt-10 h-64 border-b border-l border-border pb-2 pl-2">
            {spendData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs font-bold px-2 py-1 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap">
                  ${d.value}K
                </div>
                {/* Bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / 80) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                  className="w-full bg-primary/20 group-hover:bg-primary transition-colors rounded-t-md relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-primary/30" />
                </motion.div>
                {/* Label */}
                <span className="text-xs font-medium text-muted-foreground mt-3">{d.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-border"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-primary" /> Spend by Category
          </h2>
          
          <div className="space-y-6">
            {categoryData.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-foreground">{cat.name}</span>
                  <span className="font-bold text-muted-foreground">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                    className={`h-2.5 rounded-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-4 bg-primary/5 border border-primary/10 rounded-xl">
            <h3 className="text-sm font-bold text-primary mb-2">Insight</h3>
            <p className="text-sm text-muted-foreground">Hardware procurement has increased by 15% this quarter, driven by the Q3 Office Laptops initiative.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
