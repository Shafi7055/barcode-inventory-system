import WorkspacePage from "@/components/common/WorkspacePage";

export default function ComponentTrackingPage() {
  return (
    <WorkspacePage
      title="Component tracking"
      description="Scan the product unit and its component barcodes before sending the unit to Receive."
      sectionTitle="Track components"
      successMessage="Component tracked. Scan another component for this unit, or continue to Receive when finished."
      submitEndpoint="/component-tracking"
      preserveFields={["productBarcode"]}
      listTitle="Products tracked by you"
      listEndpoint="/activity/tracked-products"
      paginatedList
      columns={[
        { key: "barcode", label: "Product unit barcode" },
        { key: "productName", label: "Product" },
        { key: "trackedComponents", label: "Components tracked" },
        { key: "lastTrackedAt", label: "Last tracked" },
      ]}
      fields={[
        {
          name: "productBarcode",
          label: "Product unit barcode",
          placeholder: "FRG-00000120",
        },
        {
          name: "componentBarcode",
          label: "Component barcode",
          placeholder: "FRG-CMP-00000120",
        },
      ]}
    />
  );
}
