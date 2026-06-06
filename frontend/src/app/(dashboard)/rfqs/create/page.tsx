"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function CreateRFQPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableVendors, setAvailableVendors] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await api.get("/vendors/");
        setAvailableVendors(res.data);
      } catch (err) {
        console.error("Failed to fetch vendors", err);
      }
    }
    fetchVendors();
  }, []);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 1, unit: "pcs", specs: "" }]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const toggleVendor = (id: string) => {
    setSelectedVendors(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, unit: "pcs", specs: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        title,
        description,
        category: "General", // Default for now
        deadline: new Date(deadline).toISOString(),
        status: "published",
        items: items.map(item => ({
          item_name: item.name,
          description: item.specs || "",
          quantity: item.quantity,
          unit: item.unit,
          specifications: item.specs || ""
        }))
      };
      
      const rfqRes = await api.post("/rfqs/", payload);
      const rfqId = rfqRes.data.id;

      if (selectedVendors.length > 0) {
        await api.post(`/rfqs/${rfqId}/vendors`, selectedVendors.map(vid => ({ vendor_id: vid })));
      }
      
      router.push("/rfqs");
    } catch (error) {
      console.error("Failed to create RFQ:", error);
      alert("Failed to create RFQ. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Link href="/rfqs" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to RFQs
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New RFQ</h1>
        <p className="text-muted-foreground mt-2">Create a Request for Quotation to source items from vendors.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-500"
          style={{ width: step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '100%' }}
        ></div>
        
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              step >= i ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-card border-2 border-border text-muted-foreground'
            }`}
          >
            {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
          </div>
        ))}
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass-panel p-8 rounded-2xl border border-border shadow-sm"
      >
        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
          
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Basic Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">RFQ Title *</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Office Supplies Replenishment"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description / Instructions</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any overall instructions or context for the vendors..."
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Submission Deadline *</label>
                <input
                  required
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full md:w-1/2 px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Line Items */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" /> Line Items
                </h2>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center text-sm font-medium text-primary hover:text-primary/80 bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 bg-card/50 border border-border rounded-xl relative group"
                    key={index}
                  >
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="absolute -top-3 -right-3 p-1.5 bg-destructive text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-5">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Item Name *</label>
                        <input
                          required
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          placeholder="e.g. Dell Latitude 7420"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Quantity *</label>
                        <input
                          required
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Unit</label>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                        >
                          <option value="pcs">Pieces (pcs)</option>
                          <option value="kg">Kilograms (kg)</option>
                          <option value="liters">Liters (L)</option>
                          <option value="boxes">Boxes</option>
                        </select>
                      </div>
                      <div className="md:col-span-12">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Technical Specifications</label>
                        <input
                          type="text"
                          value={item.specs}
                          onChange={(e) => handleItemChange(index, "specs", e.target.value)}
                          placeholder="e.g. 16GB RAM, 512GB SSD, i7 11th Gen"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Assign Vendors */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Assign Vendors
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Select the vendors you want to invite to this RFQ.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {availableVendors.map(vendor => (
                  <div 
                    key={vendor.id} 
                    onClick={() => toggleVendor(vendor.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedVendors.includes(vendor.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-foreground">{vendor.company_name}</h4>
                        <p className="text-xs text-muted-foreground">{vendor.category || 'General'}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        selectedVendors.includes(vendor.id) ? 'bg-primary text-white' : 'border-2 border-muted'
                      }`}>
                        {selectedVendors.includes(vendor.id) && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Review & Publish
              </h2>
              
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground">{title || "Untitled RFQ"}</h3>
                <p className="text-sm text-muted-foreground mt-2">{description || "No description provided."}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-rose-500 bg-rose-500/10 px-3 py-1 rounded-md">
                  Deadline: {deadline ? new Date(deadline).toLocaleString() : "Not set"}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="bg-secondary/50 px-4 py-3 border-b border-border font-semibold text-sm">
                  Requested Items ({items.length})
                </div>
                <div className="divide-y divide-border">
                  {items.map((item, i) => (
                    <div key={i} className="px-4 py-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-foreground">{item.name || `Item ${i+1}`}</p>
                        {item.specs && <p className="text-xs text-muted-foreground mt-0.5">{item.specs}</p>}
                      </div>
                      <div className="font-bold text-foreground">
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-border flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 rounded-lg font-medium text-foreground bg-secondary hover:bg-secondary/80 transition-colors"
              >
                Back
              </button>
            ) : (
              <Link
                href="/rfqs"
                className="px-6 py-2.5 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </Link>
            )}

            {step < 4 ? (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors flex items-center"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 transition-colors flex items-center disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish RFQ"}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
