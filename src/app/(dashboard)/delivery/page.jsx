import WorkspacePage from "@/components/common/WorkspacePage";

export default function DeliveryPage() {
  return (
    <WorkspacePage
      title="Deliver stock"
      description="Record outgoing inventory at a delivery point."
      sectionTitle="Deliver item"
      submitEndpoint="/deliveries"
      idempotent
      fields={[
        { name: "barcode", label: "Barcode" },
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
