import WorkspacePage from "@/components/common/WorkspacePage";

export default function ComponentsPage() {
  return (
    <WorkspacePage
      title="Components"
      description="Manage component names used for product tracking."
      sectionTitle="Add component"
      submitEndpoint="/components"
      listEndpoint="/components"
      columns={[
        { key: "name", label: "Component" },
        { key: "code", label: "Code" },
        { key: "barcode", label: "Barcode" },
        { key: "isActive", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Component name" },
        { name: "code", label: "Component code" },
        { name: "barcode", label: "Component barcode" },
      ]}
      eyebrow="Master data"
    />
  );
}
