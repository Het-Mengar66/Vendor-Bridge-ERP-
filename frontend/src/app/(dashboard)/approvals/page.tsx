"use client";

import { useState, useEffect } from "react";
import { CheckSquare, CheckCircle, XCircle, Search, Clock, FileText, ArrowRight, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const res = await api.get("/approvals");
      setApprovals(res.data);
    } catch (err) {
      console.error("Failed to fetch approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.post(`/approvals/${id}/${action}`, {
        remarks: `Action taken from dashboard`,
        status: action === 'approve' ? 'approved' : 'rejected'
      });
      // Refresh list
      fetchApprovals();
    } catch (err) {
      console.error(`Failed to ${action} approval:`, err);
      alert(`Failed to ${action} approval.`);
    }
  };

  const filteredApprovals = approvals.filter(app => {
    const matchesSearch = 
      (app.reference_id && app.reference_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.entity_name && app.entity_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.request_type && app.request_type.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesTab = activeTab === 'pending' ? app.status === 'pending' : app.status !== 'pending';
    
    return matchesSearch && matchesTab;
  });

  const formatAmount = (amount: number | null, currency: string | null = 'USD') => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-border shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl relative">
            <CheckSquare className="h-6 w-6 text-primary" />
            {approvals.filter(a => a.status === 'pending').length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm border-2 border-card">
                {approvals.filter(a => a.status === 'pending').length}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Approvals</h1>
            <p className="text-sm text-muted-foreground mt-1">Review and authorize pending procurement requests.</p>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass-panel p-4 rounded-xl">
        <div className="flex p-1 bg-secondary rounded-lg">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'pending' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all flex items-center ${
              activeTab === 'history' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4 mr-1.5" /> History
          </button>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search by reference, name, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
          />
        </div>
      </div>

      {/* Approvals List */}
      {loading ? (
        <div className="flex justify-center items-center p-24 glass-panel rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary"></div>
            <p className="text-muted-foreground font-medium animate-pulse">Loading approvals...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredApprovals.length > 0 ? (
              filteredApprovals.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel rounded-xl overflow-hidden border border-border group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* Info Section */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`mt-1 p-2 rounded-lg ${
                        item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        item.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-secondary/50 text-muted-foreground'
                      }`}>
                        {item.status === 'approved' ? <CheckCircle size={20} /> :
                         item.status === 'rejected' ? <XCircle size={20} /> :
                         <FileText size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {item.request_type}
                          </span>
                          <span className="text-sm font-mono text-muted-foreground" title={item.reference_id}>
                            {item.reference_id?.split('-')[0]}...
                          </span>
                          {activeTab === 'history' && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase ${
                              item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                            }`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{item.entity_name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date(item.created_at).toLocaleString()}</span>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="hidden sm:inline">Priority: <span className="text-foreground capitalize">{item.priority}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <div className="text-center sm:text-right w-full sm:w-auto">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Total Value</p>
                        <p className="text-xl font-bold text-foreground">{formatAmount(item.amount)}</p>
                      </div>
                      
                      {activeTab === 'pending' && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => handleAction(item.id, 'reject')}
                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-destructive bg-destructive/10 hover:bg-destructive hover:text-white rounded-lg transition-colors border border-destructive/20"
                          >
                            <XCircle className="w-4 h-4 mr-1.5" /> Reject
                          </button>
                          <button 
                            onClick={() => handleAction(item.id, 'approve')}
                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20"
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-16 text-center glass-panel rounded-2xl"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'pending' ? <CheckSquare className="h-8 w-8 text-emerald-500" /> : <History className="h-8 w-8 text-emerald-500" />}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {activeTab === 'pending' ? 'All caught up!' : 'No History'}
                </h3>
                <p className="text-muted-foreground">
                  {activeTab === 'pending' 
                    ? 'There are no pending approvals requiring your attention.' 
                    : 'You have not processed any approvals yet.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
