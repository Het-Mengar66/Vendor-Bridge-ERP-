"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, FileSpreadsheet, Clock, User, MessageSquare } from "lucide-react";
import api from "@/lib/api";

export default function QuotationReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await api.get(`/quotations/${id}`);
        setQuotation(response.data);
      } catch (error) {
        console.error("Failed to fetch quotation details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchQuotation();
    }
  }, [id]);

  const handleSelect = async () => {
    setActionLoading(true);
    try {
      await api.post(`/quotations/${id}/select`);
      alert("Quotation selected successfully and sent for approval!");
      router.push("/quotations");
    } catch (error) {
      console.error("Failed to select quotation:", error);
      alert("Failed to select quotation.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Quotation not found.</p>
        <Link href="/quotations" className="text-primary hover:underline mt-4 inline-block">
          Return to Quotations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <Link href="/quotations" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Quotations
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Quotation Review</h1>
            <p className="text-muted-foreground mt-2">
              Review details for Quotation {quotation.quotation_number}
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full text-sm font-semibold capitalize bg-secondary border border-border">
            {quotation.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FileSpreadsheet className="w-5 h-5 mr-2 text-primary" /> Line Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border text-left text-sm text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-medium">Item</th>
                    <th className="pb-3 font-medium">Quantity</th>
                    <th className="pb-3 font-medium text-right">Unit Price</th>
                    <th className="pb-3 font-medium text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {quotation.items?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-4">
                        <div className="font-medium text-foreground">Item ID: {item.rfq_item_id}</div>
                        <div className="text-xs text-muted-foreground mt-1">{item.remarks}</div>
                      </td>
                      <td className="py-4">{item.quantity}</td>
                      <td className="py-4 text-right">${item.unit_price?.toFixed(2)}</td>
                      <td className="py-4 text-right font-medium">${item.total_price?.toFixed(2)}</td>
                    </tr>
                  ))}
                  {(!quotation.items || quotation.items.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No items found for this quotation.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" /> Notes & Terms
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <strong className="block text-foreground mb-1">Delivery Terms:</strong>
                <p className="text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border">
                  {quotation.delivery_terms || "Not specified"}
                </p>
              </div>
              <div>
                <strong className="block text-foreground mb-1">Additional Notes:</strong>
                <p className="text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border">
                  {quotation.notes || "None provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-bold text-lg mb-4 border-b border-border pb-3">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${quotation.total_amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${quotation.tax_amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-border mt-2">
                <span className="font-bold text-foreground">Grand Total</span>
                <span className="font-bold text-primary text-lg">${quotation.grand_total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-bold text-lg mb-4 border-b border-border pb-3">Details</h3>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground text-xs">Vendor ID</div>
                  <div className="font-medium truncate w-48" title={quotation.vendor_id}>{quotation.vendor_id}</div>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground text-xs">Delivery Time</div>
                  <div className="font-medium">{quotation.delivery_days ? `${quotation.delivery_days} Days` : "TBD"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleSelect}
              disabled={actionLoading || quotation.status === "selected" || quotation.status === "under_review"}
              className="w-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {actionLoading ? "Processing..." : "Select Quotation"}
            </button>
            <button 
              disabled={quotation.status === "rejected"}
              className="w-full py-3 rounded-xl font-bold text-destructive bg-destructive/10 hover:bg-destructive/20 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Reject Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
