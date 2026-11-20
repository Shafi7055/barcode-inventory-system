import WorkspacePage from "@/components/common/WorkspacePage";

export default function AuditLogsPage() {
  return (
    <WorkspacePage
      title="Audit logs"
      description="Review changes made to users and master data."
      sectionTitle="Change history"
      eyebrow="Administration"
      listEndpoint="/audit-logs"
      columns={[
        { key: "createdAt", label: "Date" },
        { key: "userName", label: "User" },
        { key: "action", label: "Action" },
        { key: "tableName", label: "Resource" },
        { key: "oldValue", label: "Previous value" },
        { key: "newValue", label: "New value" },
      ]}
    />
  );
}
