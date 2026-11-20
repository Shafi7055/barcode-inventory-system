import WorkspacePage from "@/components/common/WorkspacePage";

export default function ComponentTrackingPage() {
  return (
    <WorkspacePage
      title="Component tracking"
      description="Attach component barcodes to a product."
      sectionTitle="Track components"
      submitEndpoint="/component-tracking"
      fields={[
        { name: "productBarcode", label: "Product barcode" },
        { name: "componentBarcode", label: "Component barcode" },
      ]}
    />
  );
}
