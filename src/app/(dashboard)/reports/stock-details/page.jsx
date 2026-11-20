import WorkspacePage from "@/components/common/WorkspacePage";

export default function StockDetailsPage() {
  return (
    <WorkspacePage
      title="Stock details"
      description="View current stock by item."
      sectionTitle="Current stock"
      eyebrow="Reports"
      listEndpoint="/reports/stock-details"
      columns={[
        { key: "barcode", label: "Barcode" },
        { key: "productName", label: "Product" },
        { key: "status", label: "Status" },
        { key: "receivePoint", label: "Receive point" },
        { key: "createdAt", label: "Created" },
      ]}
    />
  );
}
