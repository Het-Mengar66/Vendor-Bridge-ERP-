"use client";

import { useState, useEffect } from "react";
import { Activity, Search, Filter, ShieldCheck, ShoppingCart, Users, FileText, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

export default function ActivityLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get("/activity/logs");
        // Map backend to frontend schema
        const mapped = response.data.map((log: any) => ({
          id: log.id,
          user: log.user_id || "system", // We'd ideally join with user table to get email
          action: log.action,
          target: log.target || log.entity_id,
          timestamp: log.created_at,
          type: log.entity_type,
          icon: log.entity_type === 'approval' ? ShieldCheck : 
                log.entity_type === 'po' ? ShoppingCart : 
                log.entity_type === 'vendor' ? Users : FileText,
          color: log.entity_type === 'approval' ? "text-emerald-500" : 
                 log.entity_type === 'po' ? "text-blue-500" : 
                 log.entity_type === 'vendor' ? "text-amber-500" : "text-indigo-500",
          bg: log.entity_type === 'approval' ? "bg-emerald-500/10" : 
              log.entity_type === 'po' ? "bg-blue-500/10" : 
              log.entity_type === 'vendor' ? "bg-amber-500/10" : "bg-indigo-500/10",
        }));
        setActivities(mapped);
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredLogs = activities.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.target && log.target.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-border shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Activity Logs</h1>
            <p className="text-sm text-muted-foreground mt-1">Audit trail of all system actions and events.</p>
          </div>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors border border-border">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-border flex gap-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search logs by user, action, or target..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-background border border-border text-foreground text-sm font-medium rounded-lg hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </button>
      </div>

      {/* Timeline */}
      <div className="glass-panel p-8 rounded-2xl border border-border">
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          <AnimatePresence>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-card bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${log.color} relative z-10`}>
                    <log.icon className="w-4 h-4" />
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-5 rounded-xl border border-border hover:border-primary/30 transition-colors shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${log.bg} ${log.color}`}>
                        {log.type}
                      </span>
                      <time className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                        {new Date(log.timestamp).toLocaleString()}
                      </time>
                    </div>
                    <div className="mb-2">
                      <span className="font-bold text-foreground">{log.action}</span>
                      <span className="text-muted-foreground mx-1">→</span>
                      <span className="font-medium text-foreground">{log.target}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-border mr-1.5" />
                      Executed by: <span className="font-mono ml-1">{log.user}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground relative z-10 bg-card/80 backdrop-blur-sm rounded-xl">
                No activity logs found.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
