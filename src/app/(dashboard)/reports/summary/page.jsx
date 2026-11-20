import WorkspacePage from "@/components/common/WorkspacePage";

export default function SummaryPage() {
  return (
    <WorkspacePage
      title="Summary"
      description="Review inventory activity over a date range."
      sectionTitle="Report filters"
      fields={[
        { name: "from", label: "Start date", type: "date" },
        { name: "to", label: "End date", type: "date" },
      ]}
      submitEndpoint="/reports/summary"
      submitMethod="GET"
      columns={[
        { key: "from", label: "From" },
        { key: "to", label: "To" },
        { key: "received", label: "Received" },
        { key: "delivered", label: "Delivered" },
        { key: "reversed", label: "Reversed" },
      ]}
      eyebrow="Reports"
    />
  );
}
