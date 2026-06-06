"use client";

import { motion } from "framer-motion";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, delay = 0 }: StatsCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-panel rounded-2xl p-6 border border-border group hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-2 tracking-wide uppercase">{title}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
        </div>
        <div className="p-3.5 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-5 flex items-center text-sm relative z-10 bg-secondary/50 p-2 rounded-lg inline-flex">
          <span className={`font-semibold flex items-center ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trendUp ? (
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trend}
          </span>
          <span className="text-muted-foreground ml-1.5 font-medium text-xs">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
