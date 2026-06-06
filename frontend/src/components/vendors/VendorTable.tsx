"use client";

import { Vendor } from "@/types";
import { useState } from "react";
import { MoreHorizontal, Edit, Trash, FileText, Search, Filter, Users } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface VendorTableProps {
  vendors: Vendor[];
  onRefresh?: () => void;
}

export default function VendorTable({ vendors, onRefresh }: VendorTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = 
      vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.gst_number || "").toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'inactive': return 'bg-muted text-muted-foreground border border-border';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'blocked': return 'bg-destructive/10 text-destructive border border-destructive/20';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search vendors or GST..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="h-4 w-4 text-muted-foreground mr-2" />
          {["all", "active", "pending", "blocked"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 text-sm rounded-full capitalize transition-all duration-200 whitespace-nowrap ${
                statusFilter === status 
                  ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact & Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card/50">
              <AnimatePresence>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor, index) => (
                    <motion.tr 
                      key={vendor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-sm">
                            {vendor.company_name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{vendor.company_name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">GST: {vendor.gst_number || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground font-medium">{vendor.contact_name || vendor.email}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{vendor.city}{vendor.city && vendor.country ? ', ' : ''}{vendor.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                          {vendor.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadgeClass(vendor.status)}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Link href={`/vendors/${vendor.id}`} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Details">
                            <FileText size={18} />
                          </Link>
                          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors" title="More actions">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Users className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-base font-medium">No vendors found matching your criteria.</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                      </div>
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
