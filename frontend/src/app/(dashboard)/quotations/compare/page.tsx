"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, ShieldCheck, Trophy, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function CompareQuotationsPage() {
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  // Mock Data for Comparison
  const rfqTitle = "Provision of Office Laptops Q3 (RFQ-2026-001)";
  
  const items = [
    { name: "Dell Latitude 7420", qty: 50 },
    { name: "Wireless Mouse", qty: 50 },
    { name: "Laptop Bags", qty: 50 }
  ];

  const vendors = [
    {
      id: "v1",
      name: "Tech Solutions Inc.",
      rating: 4.8,
      prices: [1200, 25, 45],
      deliveryDays: 14,
      paymentTerms: "Net 30",
      warranty: "3 Years",
      total: 63500,
      bestPrice: false,
      bestOverall: true
    },
    {
      id: "v2",
      name: "Global IT Suppliers",
      rating: 4.2,
      prices: [1150, 30, 50],
      deliveryDays: 21,
      paymentTerms: "Net 15",
      warranty: "1 Year",
      total: 61500,
      bestPrice: true,
      bestOverall: false
    },
    {
      id: "v3",
      name: "Office Electronics LLC",
      rating: 3.9,
      prices: [1300, 20, 40],
      deliveryDays: 7,
      paymentTerms: "Net 60",
      warranty: "2 Years",
      total: 68000,
      bestPrice: false,
      bestOverall: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <Link href="/quotations" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Quotations
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Compare Quotations</h1>
        <p className="text-muted-foreground mt-2 text-lg">Evaluating responses for <strong>{rfqTitle}</strong></p>
      </div>

      <div className="glass-panel rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-6 border-b border-border border-r bg-secondary/20 min-w-[200px]">
                <h3 className="font-semibold text-foreground">Evaluation Criteria</h3>
              </th>
              {vendors.map((vendor, index) => (
                <th key={vendor.id} className="p-6 border-b border-border bg-card/50 text-center min-w-[250px] relative">
                  {vendor.bestOverall && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                  )}
                  {vendor.bestOverall && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                      <Trophy className="w-3 h-3 mr-1" /> RECOMMENDED
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-foreground">{vendor.name}</h3>
                  <div className="flex items-center justify-center mt-1 text-sm text-amber-500">
                    {'★'.repeat(Math.floor(vendor.rating))}
                    <span className="text-muted-foreground ml-1">({vendor.rating})</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Total Cost Row */}
            <tr>
              <td className="p-4 border-r border-border font-medium bg-secondary/10">Total Cost</td>
              {vendors.map(vendor => (
                <td key={vendor.id} className="p-4 text-center">
                  <div className={`text-2xl font-bold ${vendor.bestPrice ? 'text-emerald-600' : 'text-foreground'}`}>
                    ${vendor.total.toLocaleString()}
                  </div>
                  {vendor.bestPrice && (
                    <div className="flex items-center justify-center text-xs text-emerald-600 font-medium mt-1">
                      <TrendingDown className="w-3 h-3 mr-1" /> Lowest Price
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Terms Row */}
            <tr>
              <td className="p-4 border-r border-border font-medium bg-secondary/10">Delivery Lead Time</td>
              {vendors.map(vendor => (
                <td key={vendor.id} className="p-4 text-center text-muted-foreground">
                  {vendor.deliveryDays} Days
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-r border-border font-medium bg-secondary/10">Payment Terms</td>
              {vendors.map(vendor => (
                <td key={vendor.id} className="p-4 text-center text-muted-foreground">
                  {vendor.paymentTerms}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-r border-border font-medium bg-secondary/10">Warranty</td>
              {vendors.map(vendor => (
                <td key={vendor.id} className="p-4 text-center text-muted-foreground">
                  {vendor.warranty}
                </td>
              ))}
            </tr>

            {/* Line Items Header */}
            <tr>
              <td colSpan={vendors.length + 1} className="p-3 bg-secondary/30 font-semibold text-sm uppercase tracking-wider border-y border-border text-center text-muted-foreground">
                Line Item Breakdown (Unit Prices)
              </td>
            </tr>

            {/* Line Items Rows */}
            {items.map((item, itemIndex) => (
              <tr key={itemIndex}>
                <td className="p-4 border-r border-border bg-secondary/10">
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">Qty: {item.qty}</div>
                </td>
                {vendors.map(vendor => {
                  const isLowest = vendors.every(v => v.prices[itemIndex] >= vendor.prices[itemIndex]);
                  return (
                    <td key={vendor.id} className={`p-4 text-center ${isLowest ? 'font-medium text-emerald-600 bg-emerald-500/5' : 'text-muted-foreground'}`}>
                      ${vendor.prices[itemIndex].toLocaleString()}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Actions Row */}
            <tr>
              <td className="p-6 border-r border-border bg-secondary/10"></td>
              {vendors.map(vendor => (
                <td key={vendor.id} className="p-6 text-center">
                  <button
                    onClick={() => setSelectedQuote(vendor.id)}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center ${
                      selectedQuote === vendor.id
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : vendor.bestOverall
                          ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90'
                          : 'bg-secondary text-foreground border border-border hover:bg-secondary/80'
                    }`}
                  >
                    {selectedQuote === vendor.id ? (
                      <><Check className="w-4 h-4 mr-2" /> Awarded</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4 mr-2" /> Award PO</>
                    )}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
