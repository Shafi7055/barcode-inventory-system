import WorkspacePage from "@/components/common/WorkspacePage";

export default function ProductsPage() {
  return (
    <WorkspacePage
      title="Products"
      description="Manage the products tracked in your inventory."
      sectionTitle="Add product"
      submitEndpoint="/products"
      listEndpoint="/products"
      columns={[
        { key: "name", label: "Product" },
        { key: "code", label: "Code" },
        { key: "description", label: "Description" },
        { key: "isActive", label: "Active" },
        { key: "createdAt", label: "Created" },
      ]}
      fields={[
        { name: "name", label: "Product name" },
        { name: "code", label: "Product code" },
        { name: "description", label: "Description", required: false },
      ]}
      eyebrow="Master data"
    />
  );
}
