"use client";

import { useState, useEffect } from "react";
import VendorTable from "@/components/vendors/VendorTable";
import VendorForm from "@/components/vendors/VendorForm";
import api from "@/lib/api";
import { Vendor } from "@/types";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      // In a real app this would use the real API: await api.get("/vendors");
      // But until the backend is fully wired, we will use some mock data if API fails
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendors</h1>
          <p className="text-gray-500">Manage supplier profiles and registrations.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Vendor"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <VendorForm onSuccess={() => {
            setShowForm(false);
            fetchVendors();
          }} />
        </div>
      )}

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <VendorTable vendors={vendors} onRefresh={fetchVendors} />
      )}
    </div>
  );
}
