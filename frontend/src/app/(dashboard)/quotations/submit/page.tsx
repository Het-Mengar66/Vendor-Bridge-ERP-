"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileSpreadsheet, Upload, DollarSign, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SubmitQuotationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock RFQ Data for submission context
  const rfq = {
    id: "RFQ-2026-001",
    title: "Provision of Office Laptops Q3",
    items: [
      { name: "Dell Latitude 7420", quantity: 50, unit: "pcs" },
      { name: "Wireless Mouse", quantity: 50, unit: "pcs" },
      { name: "Laptop Bags", quantity: 50, unit: "pcs" },
    ]
  };

  // Form State
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const handlePriceChange = (index: number, value: string) => {
    setPrices({ ...prices, [index]: parseFloat(value) || 0 });
  };

  const calculateTotal = () => {
    return rfq.items.reduce((total, item, index) => {
      return total + (prices[index] || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API Submit
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-12 rounded-2xl flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Quotation Submitted!</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Your pricing for <strong>{rfq.id}</strong> has been successfully submitted to the procurement team.
          </p>
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-primary text-white rounded-xl font-medium shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Link href="/quotations" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
          <FileSpreadsheet className="w-8 h-8 mr-3 text-primary" /> Submit Quotation
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Provide your pricing for {rfq.title} ({rfq.id})</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl border border-border overflow-hidden"
          >
            <div className="bg-secondary/50 px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Line Items Pricing</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-background text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Item Details</th>
                    <th className="px-6 py-3 font-medium w-32">Qty</th>
                    <th className="px-6 py-3 font-medium w-48">Unit Price ($)</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rfq.items.map((item, index) => {
                    const price = prices[index] || 0;
                    const lineTotal = price * item.quantity;
                    return (
                      <tr key={index} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">{item.name}</p>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              onChange={(e) => handlePriceChange(index, e.target.value)}
                              className="block w-full pl-8 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-foreground">
                          ${lineTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-secondary/30 px-6 py-4 border-t border-border flex justify-between items-center">
              <span className="font-semibold text-muted-foreground">Total Quotation Value</span>
              <span className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl border border-border"
          >
            <h2 className="font-semibold text-foreground mb-4">Terms & Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Quotation Valid Until *</label>
                <input
                  required
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Attach Formal Quote (Optional)</label>
                <div className="border-2 border-dashed border-border rounded-lg px-4 py-2 flex items-center justify-center hover:bg-secondary/50 transition-colors cursor-pointer text-muted-foreground text-sm">
                  <Upload className="w-4 h-4 mr-2" /> Upload PDF
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Additional Notes / Terms</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment terms, delivery timeline, etc."
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl border border-border sticky top-24"
          >
            <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">Summary</h3>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax (0%)</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="font-semibold">Final Total</span>
                <span className="font-bold text-lg text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || calculateTotal() === 0 || !validUntil}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl flex items-center justify-center hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : (
                <><Send className="w-4 h-4 mr-2" /> Submit Quotation</>
              )}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By submitting, you agree to the VendorBridge terms of service and confirm the pricing provided.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
