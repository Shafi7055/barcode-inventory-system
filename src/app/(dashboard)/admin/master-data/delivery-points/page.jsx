import WorkspacePage from "@/components/common/WorkspacePage";

export default function DeliveryPointsPage() {
  return (
    <WorkspacePage
      title="Delivery points"
      description="Manage locations where stock can be delivered."
      sectionTitle="Add delivery point"
      submitEndpoint="/stock-points"
      listEndpoint="/stock-points"
      listParams={{ type: "DELIVERY" }}
      columns={[
        { key: "name", label: "Delivery point" },
        { key: "type", label: "Type" },
        { key: "isActive", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Delivery point name" },
        { name: "type", label: "Type", options: ["DELIVERY"], required: true },
      ]}
      eyebrow="Master data"
    />
  );
}
