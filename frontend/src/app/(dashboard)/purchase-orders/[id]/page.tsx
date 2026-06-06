"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, ShoppingCart, Calendar, MapPin, CheckCircle, Package } from "lucide-react";
import api from "@/lib/api";

export default function PurchaseOrderDetailsPage() {
  const { id } = useParams();
  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPO = async () => {
      try {
        const response = await api.get(`/purchase-orders/${id}`);
        setPo(response.data);
      } catch (error) {
        console.error("Failed to fetch PO details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPO();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Purchase Order not found.</p>
        <Link href="/purchase-orders" className="text-primary hover:underline mt-4 inline-block">
          Return to Purchase Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <Link href="/purchase-orders" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Purchase Orders
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
              <ShoppingCart className="w-8 h-8 mr-3 text-primary" />
              {po.po_number}
            </h1>
            <p className="text-muted-foreground mt-2">
              Purchase Order details and items.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-3 py-1.5 rounded-full text-sm font-semibold capitalize bg-secondary border border-border">
              {po.status}
            </div>
            <button 
              onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/purchase-orders/${po.id}/pdf`, '_blank')}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary" /> Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border text-left text-sm text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-medium">Item</th>
                    <th className="pb-3 font-medium text-center">Quantity</th>
                    <th className="pb-3 font-medium text-right">Unit Price</th>
                    <th className="pb-3 font-medium text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {po.items?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-4">
                        <div className="font-medium text-foreground">{item.item_name}</div>
                        {item.description && <div className="text-xs text-muted-foreground mt-1">{item.description}</div>}
                      </td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right">${item.unit_price?.toFixed(2)}</td>
                      <td className="py-4 text-right font-medium">${item.total_price?.toFixed(2)}</td>
                    </tr>
                  ))}
                  {(!po.items || po.items.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No items found in this purchase order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-bold text-lg mb-4 border-b border-border pb-3">Financials</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${po.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${po.tax_amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-border mt-2">
                <span className="font-bold text-foreground">Grand Total</span>
                <span className="font-bold text-primary text-lg">${po.grand_total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-bold text-lg mb-4 border-b border-border pb-3">Logistics</h3>
            <div className="space-y-4">
              <div className="flex items-start text-sm">
                <MapPin className="w-4 h-4 mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-muted-foreground text-xs">Ship To</div>
                  <div className="font-medium whitespace-pre-wrap">{po.ship_to || "Not specified"}</div>
                </div>
              </div>
              <div className="flex items-start text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-muted-foreground text-xs">Delivery Date</div>
                  <div className="font-medium">{po.delivery_date ? new Date(po.delivery_date).toLocaleDateString() : "Not specified"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
