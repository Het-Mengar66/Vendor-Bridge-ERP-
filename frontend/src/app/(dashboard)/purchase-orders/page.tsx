"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Filter, MoreHorizontal, ArrowRight, Download, Eye, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const response = await api.get("/purchase-orders/");
        // Map backend format to frontend if necessary
        const formatted = response.data.map((po: any) => ({
          ...po,
          po_number: po.po_number || `PO-${po.id.substring(0,6)}`,
          rfq_number: po.rfq_id || "Unknown RFQ", // assuming we might want to resolve RFQ number later
          vendor_name: po.vendor_id || "Unknown Vendor", // assuming vendor is UUID
          currency: "USD",
          status: po.status || "draft",
          issued_date: po.created_at,
          expected_delivery: po.delivery_date
        }));
        setPurchaseOrders(formatted);
      } catch (error) {
        console.error("Failed to fetch purchase orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPOs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'issued': return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      case 'fulfilled': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'draft': return 'bg-muted text-muted-foreground border border-border';
      case 'cancelled': return 'bg-destructive/10 text-destructive border border-destructive/20';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const filteredPOs = purchaseOrders.filter(po => 
    po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.rfq_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-border shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Purchase Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage POs, track fulfillment, and generate PDFs.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <div className="p-4 border-b border-border bg-secondary/30 flex justify-between items-center">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search PO number, vendor, or RFQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            />
          </div>
          <button className="hidden sm:flex items-center text-sm font-medium text-foreground hover:bg-secondary px-4 py-2 rounded-lg transition-colors border border-border">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">PO Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card/50">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary mx-auto mb-4"></div>
                      <p className="text-sm text-muted-foreground">Loading purchase orders...</p>
                    </td>
                  </tr>
                ) : filteredPOs.length > 0 ? (
                  filteredPOs.map((po, index) => (
                    <motion.tr 
                      key={po.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground flex items-center mb-1">
                          {po.po_number}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <FileText className="w-3 h-3 mr-1" /> {po.rfq_number}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-foreground">{po.vendor_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-foreground">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: po.currency }).format(po.total_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${getStatusBadge(po.status)}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-muted-foreground text-xs">
                          <span className="inline-block w-12">Issued:</span> 
                          <span className="font-medium text-foreground">{po.issued_date ? new Date(po.issued_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="text-muted-foreground text-xs mt-1">
                          <span className="inline-block w-12">Delivery:</span> 
                          <span className="font-medium text-foreground">{po.expected_delivery ? new Date(po.expected_delivery).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/purchase-orders/${po.id}/pdf`, '_blank')}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" 
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </button>
                          <Link href={`/purchase-orders/${po.id}`} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Details">
                            <Eye size={18} />
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No purchase orders found matching your criteria.
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
