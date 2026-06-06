"use client";

import { useState, useEffect } from "react";
import VendorTable from "@/components/vendors/VendorTable";
import VendorForm from "@/components/vendors/VendorForm";
import api from "@/lib/api";
import { Vendor } from "@/types";
import { Plus, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/vendors").catch(() => {
        // Fallback mock data if API is not available
        return {
          data: [
            {
              id: "1",
              company_name: "Infra Supplies Pvt Ltd",
              contact_name: "John Doe",
              email: "john@infrasupplies.com",
              gst_number: "27AABCU9603R1ZM",
              city: "Mumbai",
              country: "India",
              category: "Hardware",
              status: "active",
              rating: 4.5,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "2",
              company_name: "Office Tech Co",
              contact_name: "Jane Smith",
              email: "jane@officetech.com",
              gst_number: "29BBBCU9603R1ZN",
              city: "Bangalore",
              country: "India",
              category: "IT Equipment",
              status: "pending",
              rating: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ]
        };
      });
      setVendors(res.data || []);
    } catch (err: any) {
      setError("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-border shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Vendor Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage supplier profiles, registrations, and status.</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-all ${
            showForm 
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" 
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
          }`}
        >
          {showForm ? "Cancel" : <><Plus className="w-5 h-5 mr-1.5" /> Add Vendor</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <VendorForm onSuccess={() => {
            setShowForm(false);
            fetchVendors();
          }} />
        )}
      </AnimatePresence>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-medium"
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-24 glass-panel rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary"></div>
            <p className="text-muted-foreground font-medium animate-pulse">Loading vendors...</p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <VendorTable vendors={vendors} onRefresh={fetchVendors} />
        </motion.div>
      )}
    </div>
  );
}
