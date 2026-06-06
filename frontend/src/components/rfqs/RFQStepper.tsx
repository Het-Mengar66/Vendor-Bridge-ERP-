"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Trash } from "lucide-react";
import api from "@/lib/api";

const steps = [
  { id: 1, name: "Details" },
  { id: 2, name: "Items" },
  { id: 3, name: "Review & Send" },
];

export default function RFQStepper() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [details, setDetails] = useState({
    title: "",
    category: "",
    priority: "medium",
    deadline: "",
    description: "",
  });

  const [items, setItems] = useState([
    { id: 1, item_name: "", quantity: 1, unit: "pcs", specifications: "" }
  ]);

  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  // Mock vendors for selection
  const availableVendors = [
    { id: "1", name: "Infra Supplies Pvt Ltd", category: "Hardware" },
    { id: "2", name: "Office Tech Co", category: "IT Equipment" }
  ];

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const addItem = () => {
    setItems([...items, { id: Date.now(), item_name: "", quantity: 1, unit: "pcs", specifications: "" }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    setError("");

    try {
      // 1. Create RFQ
      const rfqPayload = {
        title: details.title,
        category: details.category,
        deadline: new Date(details.deadline).toISOString(),
        description: details.description,
        items: items.map(({ id, ...rest }) => rest) // remove local id
      };
      
      const rfqRes = await api.post("/rfqs", rfqPayload);
      const rfqId = rfqRes.data.id;

      // 2. Assign Vendors
      if (selectedVendors.length > 0) {
        const vendorPayload = selectedVendors.map(vId => ({ vendor_id: vId }));
        await api.post(`/rfqs/${rfqId}/vendors`, vendorPayload);
      }

      // 3. Publish if needed
      // if (publish) {
      //   await api.post(`/rfqs/${rfqId}/publish`);
      // }

      router.push("/rfqs");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create RFQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6">
      {/* Stepper Header */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step.id < currentStep
                        ? "bg-blue-600 text-white"
                        : step.id === currentStep
                        ? "border-2 border-blue-600 text-blue-600 bg-white"
                        : "border-2 border-gray-300 text-gray-500 bg-white"
                    }`}
                  >
                    {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <span className={`ml-4 text-sm font-medium ${step.id === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {/* Step 1: Details */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">RFQ Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">RFQ Title *</label>
              <input
                type="text"
                required
                value={details.title}
                onChange={(e) => setDetails({ ...details, title: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="e.g. Office Furniture Procurement Q2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={details.category}
                onChange={(e) => setDetails({ ...details, category: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Category</option>
                <option value="Hardware">Hardware</option>
                <option value="Furniture">Furniture</option>
                <option value="IT Equipment">IT Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={details.priority}
                onChange={(e) => setDetails({ ...details, priority: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deadline Date *</label>
              <input
                type="datetime-local"
                required
                value={details.deadline}
                onChange={(e) => setDetails({ ...details, deadline: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description / Notes</label>
            <textarea
              rows={4}
              value={details.description}
              onChange={(e) => setDetails({ ...details, description: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Any general instructions for vendors..."
            />
          </div>
        </div>
      )}

      {/* Step 2: Items */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Line Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-2 text-sm font-medium text-gray-600 w-1/3">Item Name *</th>
                  <th className="p-2 text-sm font-medium text-gray-600">Qty *</th>
                  <th className="p-2 text-sm font-medium text-gray-600">Unit</th>
                  <th className="p-2 text-sm font-medium text-gray-600 w-1/3">Specifications</th>
                  <th className="p-2 text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) => handleItemChange(item.id, "item_name", e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 1)}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="pcs">pcs</option>
                        <option value="kg">kg</option>
                        <option value="litres">litres</option>
                        <option value="boxes">boxes</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.specifications}
                        onChange={(e) => handleItemChange(item.id, "specifications", e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Brand, model, etc."
                      />
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Another Item
          </button>
        </div>
      )}

      {/* Step 3: Review & Send */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Review & Assign Vendors</h2>
          
          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="font-semibold">{details.title}</h3>
            <p className="text-sm text-gray-500">Deadline: {new Date(details.deadline).toLocaleString()}</p>
            <div className="mt-2 text-sm">
              <span className="font-medium">Total Items:</span> {items.length}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Assign Vendors</h3>
            <div className="space-y-2 border rounded-md p-4 max-h-48 overflow-y-auto">
              {availableVendors.map((vendor) => (
                <label key={vendor.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVendors([...selectedVendors, vendor.id]);
                      } else {
                        setSelectedVendors(selectedVendors.filter(id => id !== vendor.id));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span>{vendor.name} <span className="text-xs text-gray-500">({vendor.category})</span></span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Attachments</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500">
              Drag & drop files or click to upload
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-5 border-t flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1 || loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        
        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!details.title || !details.deadline)) ||
              (currentStep === 2 && items.some(i => !i.item_name))
            }
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Next <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save as Draft"}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send to Vendors"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
