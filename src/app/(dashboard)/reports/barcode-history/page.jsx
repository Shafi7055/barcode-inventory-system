import WorkspacePage from "@/components/common/WorkspacePage";

export default function BarcodeHistoryPage() {
  return (
    <WorkspacePage
      title="Barcode history"
      description="Follow the movement history of a barcode."
      sectionTitle="Find barcode"
      submitEndpoint="/reports/barcode-history"
      submitMethod="GET"
      columns={[
        { key: "transactionTime", label: "Date" },
        { key: "eventType", label: "Movement" },
        { key: "point", label: "Location" },
        { key: "performedBy", label: "Performed by" },
        { key: "reason", label: "Reason" },
      ]}
      fields={[{ name: "barcode", label: "Barcode" }]}
      eyebrow="Reports"
    />
  );
}
