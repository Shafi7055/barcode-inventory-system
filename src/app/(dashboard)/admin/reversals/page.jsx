import WorkspacePage from "@/components/common/WorkspacePage";

export default function ReversalsPage() {
  return (
    <WorkspacePage
      title="Reversals"
      description="Correct an inventory transaction and record a reason."
      sectionTitle="New reversal"
      submitEndpoint="/transactions/{transactionId}/reversals"
      idempotent
      fields={[
        { name: "transactionId", label: "Transaction ID", type: "number", min: 1, path: true },
        { name: "reason", label: "Reason" },
      ]}
      eyebrow="Administration"
    />
  );
}
