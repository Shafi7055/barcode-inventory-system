import WorkspacePage from "@/components/common/WorkspacePage";

export default function ReceivePointsPage() {
  return (
    <WorkspacePage
      title="Receive points"
      description="Manage locations where stock can be received."
      sectionTitle="Add receive point"
      submitEndpoint="/stock-points"
      listEndpoint="/stock-points"
      listParams={{ type: "RECEIVE" }}
      columns={[
        { key: "name", label: "Receive point" },
        { key: "type", label: "Type" },
        { key: "isActive", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Receive point name" },
        { name: "type", label: "Type", options: ["RECEIVE"], required: true },
      ]}
      eyebrow="Master data"
    />
  );
}
