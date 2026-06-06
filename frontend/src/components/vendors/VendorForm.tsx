"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Building2, Mail, Phone, MapPin, Hash, Tag, X } from "lucide-react";

export default function VendorForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    gst_number: "",
    address: "",
    city: "",
    state: "",
    country: "",
    category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/vendors", formData);
      if (onSuccess) onSuccess();
      router.refresh(); 
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-xl overflow-hidden shadow-xl mb-6 relative border border-primary/20"
    >
      <div className="bg-gradient-primary h-2 w-full absolute top-0 left-0" />
      
      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Add New Vendor</h2>
            <p className="text-sm text-muted-foreground mt-1">Register a new supplier in the system.</p>
          </div>
          {onSuccess && (
            <button 
              type="button" 
              onClick={onSuccess}
              className="p-2 bg-secondary text-secondary-foreground rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium mb-1.5 text-foreground">
                <Building2 size={16} className="mr-2 text-muted-foreground" /> Company Name <span className="text-destructive ml-1">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                required
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Acme Corp"
              />
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium mb-1.5 text-foreground">
                <Building2 size={16} className="mr-2 text-muted-foreground" /> Contact Name
              </label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium mb-1.5 text-foreground">
                <Mail size={16} className="mr-2 text-muted-foreground" /> Email <span className="text-destructive ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="jane@acme.com"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium mb-1.5 text-foreground">
                <Phone size={16} className="mr-2 text-muted-foreground" /> Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium mb-1.5 text-foreground">
                <Hash size={16} className="mr-2 text-muted-foreground" /> GST Number
              </label>
              <input
                type="text"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Enter tax ID"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium mb-1.5 text-foreground">
                <Tag size={16} className="mr-2 text-muted-foreground" /> Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                >
                  <option value="">Select Category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium mb-1.5 text-foreground">
                <MapPin size={16} className="mr-2 text-muted-foreground" /> Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="123 Business Rd"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="USA"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3">
          {onSuccess && (
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              onClick={onSuccess}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-md shadow-primary/20 transition-all disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : "Add Vendor"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
