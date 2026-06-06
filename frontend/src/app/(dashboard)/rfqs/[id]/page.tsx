"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, DollarSign } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function RFQDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [rfq, setRfq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Quotation State (for vendors)
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [quoteItems, setQuoteItems] = useState<any>({});
  const [deliveryDays, setDeliveryDays] = useState<number>(7);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [rfqRes, vendorRes] = await Promise.all([
          api.get(`/rfqs/${id}`),
          user?.role === 'vendor' ? api.get('/vendors/me').catch(() => null) : Promise.resolve(null)
        ]);
        
        setRfq(rfqRes.data);
        if (vendorRes?.data) {
          setVendorId(vendorRes.data.id);
          
          // Initialize quote items state
          const initialQuoteItems: any = {};
          rfqRes.data.items?.forEach((item: any) => {
            initialQuoteItems[item.id] = {
              unit_price: 0,
              quantity: item.quantity,
              total_price: 0
            };
          });
          setQuoteItems(initialQuoteItems);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id, user]);

  const handlePriceChange = (itemId: string, price: string) => {
    const numPrice = parseFloat(price) || 0;
    setQuoteItems((prev: any) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        unit_price: numPrice,
        total_price: numPrice * prev[itemId].quantity
      }
    }));
  };

  const calculateTotal = () => {
    return Object.values(quoteItems).reduce((sum: number, item: any) => sum + item.total_price, 0);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) {
      alert("You need to complete your Vendor Profile first!");
      return;
    }
    
    setSubmitting(true);
    try {
      const total_amount = calculateTotal();
      const tax_amount = total_amount * 0.1; // 10% tax mock
      const grand_total = total_amount + tax_amount;

      const payload = {
        rfq_id: id,
        vendor_id: vendorId,
        total_amount,
        tax_amount,
        grand_total,
        delivery_days: deliveryDays,
        delivery_terms: "Standard",
        notes,
        items: rfq.items.map((item: any) => ({
          rfq_item_id: item.id,
          unit_price: quoteItems[item.id].unit_price,
          quantity: quoteItems[item.id].quantity,
          total_price: quoteItems[item.id].total_price
        }))
      };

      await api.post("/quotations/", payload);
      alert("Quotation submitted successfully!");
      router.push("/rfqs");
    } catch (error) {
      console.error("Failed to submit quotation:", error);
      alert("Failed to submit quotation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 animate-pulse">Loading RFQ Details...</div>;
  }

  if (!rfq) {
    return <div className="text-center py-20 text-rose-500">RFQ not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/rfqs" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to RFQs
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{rfq.title}</h1>
          <p className="text-muted-foreground font-mono mt-2 bg-secondary/50 inline-block px-2 py-0.5 rounded text-sm">
            {rfq.rfq_number}
          </p>
        </div>
        
        {user?.role !== 'vendor' && (
          <Link 
            href={`/quotations/compare/${rfq.id}`} 
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-md flex items-center"
          >
            <DollarSign className="w-5 h-5 mr-2" /> Compare Quotes
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: RFQ Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" /> Details
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Status</span>
                <span className="font-semibold capitalize px-2.5 py-1 bg-secondary rounded-full">{rfq.status}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Category</span>
                <span className="font-medium text-foreground">{rfq.category}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Deadline</span>
                <span className="font-medium text-rose-500">{new Date(rfq.deadline).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Description</span>
                <p className="text-foreground bg-card p-3 rounded-lg border border-border mt-1">
                  {rfq.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Line Items & Quotation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="font-bold text-lg mb-4">Requested Items</h3>
            
            <form onSubmit={handleSubmitQuote}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Item</th>
                      <th className="pb-3 font-medium text-center">Qty</th>
                      {user?.role === 'vendor' && (
                        <>
                          <th className="pb-3 font-medium text-right">Unit Price ($)</th>
                          <th className="pb-3 font-medium text-right">Total ($)</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rfq.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="py-4 pr-4">
                          <p className="font-semibold text-foreground">{item.item_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        </td>
                        <td className="py-4 text-center font-medium">
                          {item.quantity} <span className="text-muted-foreground text-xs">{item.unit}</span>
                        </td>
                        {user?.role === 'vendor' && quoteItems[item.id] && (
                          <>
                            <td className="py-4 text-right">
                              <input 
                                type="number" 
                                min="0" step="0.01" required
                                value={quoteItems[item.id].unit_price || ''}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                className="w-24 px-2 py-1.5 text-right bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                              />
                            </td>
                            <td className="py-4 text-right font-bold text-foreground">
                              ${quoteItems[item.id].total_price.toFixed(2)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {user?.role === 'vendor' && (
                <div className="mt-8 pt-6 border-t border-border space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Delivery (Days) *</label>
                      <input 
                        type="number" min="1" required
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Additional Notes</label>
                      <input 
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Price valid for 30 days"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-xl border border-border flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Subtotal: ${calculateTotal().toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Tax (10%): ${(calculateTotal() * 0.1).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Grand Total</p>
                      <p className="text-2xl font-bold text-emerald-600">${(calculateTotal() * 1.1).toFixed(2)}</p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors flex justify-center items-center disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : <><CheckCircle2 className="w-5 h-5 mr-2" /> Submit Quotation</>}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
