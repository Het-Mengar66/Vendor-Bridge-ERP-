"use client";

import { useState, useEffect } from "react";
import { CheckSquare, CheckCircle, XCircle, Search, Clock, FileText, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock fetching pending approvals
    setTimeout(() => {
      setApprovals([
        {
          id: "app-1",
          type: "Quotation Award",
          reference: "RFQ-2026-001",
          vendor: "Tech Solutions Inc.",
          amount: 45000.00,
          currency: "USD",
          status: "pending",
          submitted_by: "john.procurement@vendorbridge.com",
          created_at: "2026-06-05T10:30:00",
        },
        {
          id: "app-2",
          type: "Purchase Order",
          reference: "PO-2026-042",
          vendor: "Office Electronics LLC",
          amount: 12500.00,
          currency: "USD",
          status: "pending",
          submitted_by: "sarah.admin@vendorbridge.com",
          created_at: "2026-06-06T08:15:00",
        },
        {
          id: "app-3",
          type: "Vendor Onboarding",
          reference: "VND-8492",
          vendor: "Global Logistics Partners",
          amount: null,
          currency: null,
          status: "pending",
          submitted_by: "system",
          created_at: "2026-06-06T09:00:00",
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    // Optimistic UI update
    setApprovals(approvals.filter(a => a.id !== id));
    // In a real app, make API call here
  };

  const filteredApprovals = approvals.filter(app => 
    app.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAmount = (amount: number | null, currency: string | null) => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-border shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl relative">
            <CheckSquare className="h-6 w-6 text-primary" />
            {approvals.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm border-2 border-card">
                {approvals.length}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Pending Approvals</h1>
            <p className="text-sm text-muted-foreground mt-1">Review and authorize pending procurement requests.</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-xl">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search by reference, vendor, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
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
                      <div className="mt-1 p-2 bg-secondary/50 rounded-lg text-muted-foreground">
                        {item.type === 'Quotation Award' ? <FileText size={20} /> : <CheckSquare size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {item.type}
                          </span>
                          <span className="text-sm font-mono text-muted-foreground">{item.reference}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{item.vendor}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date(item.created_at).toLocaleString()}</span>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="hidden sm:inline">Req by: <span className="text-foreground">{item.submitted_by.split('@')[0]}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <div className="text-center sm:text-right w-full sm:w-auto">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Total Value</p>
                        <p className="text-xl font-bold text-foreground">{formatAmount(item.amount, item.currency)}</p>
                      </div>
                      
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
                  <CheckSquare className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">All caught up!</h3>
                <p className="text-muted-foreground">There are no pending approvals requiring your attention.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
