import RFQStepper from "@/components/rfqs/RFQStepper";

export const metadata = {
  title: "Create RFQ | VendorBridge",
  description: "Create a new Request for Quotation",
};

export default function CreateRFQPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Request for Quotation</h1>
        <p className="text-gray-500">Fill in the details below to initiate a new procurement request.</p>
      </div>
      
      <RFQStepper />
    </div>
  );
}
