"use client";

import { useState, useEffect } from "react";
import { Receipt, Search, Filter, MoreHorizontal, ArrowRight, DollarSign, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import api from "@/lib/api";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get("/invoices/");
        const formatted = response.data.map((inv: any) => ({
          ...inv,
          invoice_number: inv.invoice_number || `INV-${inv.id.substring(0,6)}`,
          po_number: inv.po_id || "Unknown PO",
          vendor_name: inv.vendor_id || "Unknown Vendor",
          amount: inv.grand_total || 0,
          currency: "USD",
          status: inv.status || "pending",
          due_date: inv.due_date || new Date().toISOString(),
          issued_date: inv.invoice_date || new Date().toISOString(),
        }));
        setInvoices(formatted);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleSendReminder = async (invoiceId: string) => {
    try {
      await api.post(`/invoices/${invoiceId}/send-email`);
      alert("Reminder sent successfully!");
      // Optionally update status to "sent" in UI
      setInvoices(invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'sent' } : inv
      ));
    } catch (error) {
      console.error("Failed to send reminder:", error);
      alert("Failed to send reminder email.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'sent': return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      case 'overdue': return 'bg-destructive/10 text-destructive border border-destructive/20';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.po_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-border shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Invoices</h1>
            <p className="text-sm text-muted-foreground mt-1">Track payments, due dates, and send payment reminders.</p>
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
              placeholder="Search Invoice number, vendor, or PO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Invoice Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card/50">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary mx-auto mb-4"></div>
                      <p className="text-sm text-muted-foreground">Loading invoices...</p>
                    </td>
                  </tr>
                ) : filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv, index) => (
                    <motion.tr 
                      key={inv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground flex items-center mb-1">
                          {inv.invoice_number}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          PO: {inv.po_number}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-foreground">{inv.vendor_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-foreground flex items-center">
                          <DollarSign className="w-3.5 h-3.5 text-muted-foreground mr-0.5" />
                          {new Intl.NumberFormat('en-US').format(inv.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${getStatusBadge(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`font-medium ${inv.status === 'overdue' ? 'text-destructive' : 'text-foreground'}`}>
                          {new Date(inv.due_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          {inv.status !== 'paid' && (
                            <button 
                              onClick={() => handleSendReminder(inv.id)}
                              className="flex items-center px-3 py-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20" 
                              title="Send Email Reminder"
                            >
                              <Send size={14} className="mr-1.5" /> Reminder
                            </button>
                          )}
                          <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No invoices found matching your criteria.
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
