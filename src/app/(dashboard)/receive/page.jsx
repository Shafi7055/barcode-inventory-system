import WorkspacePage from "@/components/common/WorkspacePage";

export default function ReceivePage() {
  return (
    <WorkspacePage
      title="Receive stock"
      description="Record incoming inventory at a receive point."
      sectionTitle="Receive item"
      submitEndpoint="/receipts"
      idempotent
      fields={[
        { name: "barcode", label: "Barcode" },
        {
          name: "productId",
          label: "Product",
          optionsEndpoint: "/products",
          valueKey: "id",
          required: true,
        },
        {
          name: "pointId",
          label: "Receive point",
          optionsEndpoint: "/stock-points",
          optionsParams: { type: "RECEIVE" },
          valueKey: "id",
          required: true,
        },
      ]}
    />
  );
}
