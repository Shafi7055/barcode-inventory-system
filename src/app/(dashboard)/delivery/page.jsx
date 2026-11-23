import WorkspacePage from "@/components/common/WorkspacePage";

export default function DeliveryPage() {
  return (
    <WorkspacePage
      title="Deliver stock"
      description="Scan the product unit barcode after it has been received with all required components."
      sectionTitle="Deliver item"
      submitEndpoint="/deliveries"
      idempotent
      listTitle="Products delivered by you"
      listEndpoint="/activity/delivered-products"
      paginatedList
      columns={[
        { key: "barcode", label: "Product unit barcode" },
        { key: "productName", label: "Product" },
        { key: "deliveryPoint", label: "Delivery point" },
        { key: "deliveredAt", label: "Delivered at" },
        { key: "status", label: "Current status" },
      ]}
      fields={[
        {
          name: "barcode",
          label: "Product unit barcode",
          placeholder: "FRG-00000120",
          minLength: 12,
          maxLength: 12,
          pattern: "[A-Z]{3}-[0-9]{8}",
          title: "Enter a product unit barcode such as FRG-00000120. Component barcodes are not accepted here.",
        },
        {
          name: "pointId",
          label: "Delivery point",
          optionsEndpoint: "/stock-points",
          optionsParams: { type: "DELIVERY" },
          valueKey: "id",
          required: true,
        },
      ]}
    />
  );
}
