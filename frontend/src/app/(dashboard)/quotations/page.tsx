"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileSpreadsheet, Search, Filter, MoreHorizontal, ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await api.get("/quotations/");
        // Map backend to frontend format
        const formatted = response.data.map((q: any) => ({
          ...q,
          rfq_title: q.rfq?.title || "Untitled RFQ",
          rfq_number: q.rfq?.rfq_number || "Unknown",
          vendor_name: q.vendor?.company_name || "Unknown Vendor",
          competitiveness: "medium" // mock calculation for now
        }));
        setQuotations(formatted);
      } catch (error) {
        console.error("Failed to fetch quotations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuotations();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'submitted': return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      case 'accepted': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border border-destructive/20';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getCompetitivenessIcon = (comp: string) => {
    switch(comp) {
      case 'high': return <TrendingDown className="w-4 h-4 text-emerald-500" title="Highly Competitive (Low Price)" />;
      case 'medium': return <Minus className="w-4 h-4 text-amber-500" title="Average Price" />;
      case 'low': return <TrendingUp className="w-4 h-4 text-destructive" title="Above Average Price" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-border shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quotations</h1>
            <p className="text-sm text-muted-foreground mt-1">Review and compare vendor price submissions.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <div className="p-4 border-b border-border bg-secondary/30 flex justify-between items-center">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search quotations..."
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            />
          </div>
          <Link href="/quotations/compare" className="hidden sm:flex items-center text-sm font-medium text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors border border-primary/20">
            Compare Quotations
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">RFQ / Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card/50">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary mx-auto mb-4"></div>
                      <p className="text-sm text-muted-foreground">Loading quotations...</p>
                    </td>
                  </tr>
                ) : quotations.length > 0 ? (
                  quotations.map((q, index) => (
                    <motion.tr 
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-foreground mb-1">{q.rfq_title}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="font-mono bg-secondary px-1.5 py-0.5 rounded mr-2">{q.rfq_number}</span>
                          {q.vendor_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: q.currency || 'USD' }).format(q.total_amount || 0)}
                          </span>
                          {getCompetitivenessIcon(q.competitiveness)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${getStatusBadge(q.status)}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(q.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/quotations/${q.id}`}
                          className="inline-flex items-center text-primary hover:text-primary/80 group-hover:translate-x-1 transition-all"
                        >
                          Review <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No quotations found.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
