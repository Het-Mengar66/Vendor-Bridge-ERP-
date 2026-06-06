"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, Trophy, TrendingDown, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

export default function CompareQuotationsPage() {
  const { rfqId } = useParams();
  const router = useRouter();
  
  const [rfq, setRfq] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [awarding, setAwarding] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [rfqRes, quotesRes, vendorsRes] = await Promise.all([
          api.get(`/rfqs/${rfqId}`),
          api.get(`/quotations/compare/${rfqId}`),
          api.get(`/vendors/`)
        ]);
        
        setRfq(rfqRes.data);
        setQuotes(quotesRes.data);
        
        const vendorMap: any = {};
        vendorsRes.data.forEach((v: any) => {
          vendorMap[v.id] = v;
        });
        setVendors(vendorMap);
        
      } catch (err) {
        console.error("Failed to fetch compare data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [rfqId]);

  const handleAwardPO = async (quoteId: string) => {
    setAwarding(quoteId);
    try {
      // 1. Mark quote as selected/under_review
      await api.post(`/quotations/${quoteId}/select`);
      
      // 2. Create Approval Request
      const quote = quotes.find(q => q.id === quoteId);
      const vendor = vendors[quote.vendor_id];
      
      await api.post("/approvals", {
        request_type: "Quotation Award",
        reference_id: quoteId,
        entity_name: `Award PO to ${vendor?.company_name || 'Vendor'} for ${rfq.title}`,
        amount: quote.grand_total,
        status: "pending",
        priority: "medium",
        remarks: "Automatically generated from quotation comparison"
      });
      
      alert("Quotation Selected! An approval workflow has been initiated.");
      router.push("/approvals");
    } catch (err) {
      console.error("Failed to award PO:", err);
      alert("Failed to award PO.");
      setAwarding(null);
    }
  };

  if (loading) {
    return <div className="text-center py-20 flex flex-col items-center"><RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" /> Loading Comparison...</div>;
  }

  if (!rfq) {
    return <div className="text-center py-20 text-rose-500">RFQ not found.</div>;
  }

  if (quotes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <Link href="/rfqs" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to RFQs
        </Link>
        <div className="glass-panel p-12 text-center rounded-2xl">
          <h2 className="text-2xl font-bold mb-2">No Quotations Yet</h2>
          <p className="text-muted-foreground">Vendors have not submitted any quotes for this RFQ.</p>
        </div>
      </div>
    );
  }

  // Find lowest total quote
  const lowestQuote = [...quotes].sort((a, b) => a.grand_total - b.grand_total)[0];

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <Link href="/rfqs" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to RFQs
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Compare Quotations</h1>
        <p className="text-muted-foreground mt-2 text-lg">Evaluating responses for <strong>{rfq.title}</strong></p>
      </div>

      <div className="glass-panel rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-6 border-b border-border border-r bg-secondary/20 min-w-[200px]">
                <h3 className="font-semibold text-foreground">Evaluation Criteria</h3>
              </th>
              {quotes.map((quote) => {
                const vendor = vendors[quote.vendor_id];
                const isLowest = quote.id === lowestQuote.id;
                
                return (
                  <th key={quote.id} className="p-6 border-b border-border bg-card/50 text-center min-w-[250px] relative">
                    {isLowest && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                    )}
                    {isLowest && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                        <Trophy className="w-3 h-3 mr-1" /> RECOMMENDED
                      </div>
                    )}
                    <h3 className="font-bold text-lg text-foreground">{vendor?.company_name || 'Unknown Vendor'}</h3>
                    <div className="flex items-center justify-center mt-1 text-sm text-amber-500">
                      {'★'.repeat(Math.floor(vendor?.rating || 4))}
                      <span className="text-muted-foreground ml-1">({vendor?.rating || 4.0})</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Total Cost Row */}
            <tr>
              <td className="p-4 border-r border-border font-medium bg-secondary/10">Grand Total</td>
              {quotes.map(quote => {
                const isLowest = quote.id === lowestQuote.id;
                return (
                  <td key={quote.id} className="p-4 text-center">
                    <div className={`text-2xl font-bold ${isLowest ? 'text-emerald-600' : 'text-foreground'}`}>
                      ${quote.grand_total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    {isLowest && (
                      <div className="flex items-center justify-center text-xs text-emerald-600 font-medium mt-1">
                        <TrendingDown className="w-3 h-3 mr-1" /> Lowest Price
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Terms Row */}
            <tr>
              <td className="p-4 border-r border-border font-medium bg-secondary/10">Delivery Lead Time</td>
              {quotes.map(quote => (
                <td key={quote.id} className="p-4 text-center text-muted-foreground">
                  {quote.delivery_days} Days
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-r border-border font-medium bg-secondary/10">Terms</td>
              {quotes.map(quote => (
                <td key={quote.id} className="p-4 text-center text-muted-foreground">
                  {quote.delivery_terms || "Standard"}
                </td>
              ))}
            </tr>

            {/* Line Items Header */}
            <tr>
              <td colSpan={quotes.length + 1} className="p-3 bg-secondary/30 font-semibold text-sm uppercase tracking-wider border-y border-border text-center text-muted-foreground">
                Line Item Breakdown (Unit Prices)
              </td>
            </tr>

            {/* Line Items Rows */}
            {rfq.items.map((rfqItem: any) => {
              // Find the lowest unit price for this specific item across all quotes
              const lowestItemPrice = Math.min(
                ...quotes.map(q => {
                  const qItem = q.items.find((i: any) => i.rfq_item_id === rfqItem.id);
                  return qItem ? qItem.unit_price : Infinity;
                })
              );

              return (
                <tr key={rfqItem.id}>
                  <td className="p-4 border-r border-border bg-secondary/10">
                    <div className="font-medium text-foreground">{rfqItem.item_name}</div>
                    <div className="text-xs text-muted-foreground">Qty: {rfqItem.quantity}</div>
                  </td>
                  {quotes.map(quote => {
                    const qItem = quote.items.find((i: any) => i.rfq_item_id === rfqItem.id);
                    const unitPrice = qItem ? qItem.unit_price : 0;
                    const isLowest = unitPrice === lowestItemPrice && unitPrice > 0;
                    
                    return (
                      <td key={quote.id} className={`p-4 text-center ${isLowest ? 'font-medium text-emerald-600 bg-emerald-500/5' : 'text-muted-foreground'}`}>
                        ${unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Actions Row */}
            <tr>
              <td className="p-6 border-r border-border bg-secondary/10"></td>
              {quotes.map(quote => {
                const isLowest = quote.id === lowestQuote.id;
                const isAwarding = awarding === quote.id;
                
                return (
                  <td key={quote.id} className="p-6 text-center">
                    <button
                      disabled={!!awarding}
                      onClick={() => handleAwardPO(quote.id)}
                      className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center disabled:opacity-50 ${
                        isLowest
                          ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90'
                          : 'bg-secondary text-foreground border border-border hover:bg-secondary/80'
                      }`}
                    >
                      {isAwarding ? (
                        <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                      ) : (
                        <><ShieldCheck className="w-4 h-4 mr-2" /> Award PO</>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
