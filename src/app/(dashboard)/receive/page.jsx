"use client";

import WorkspacePage from "@/components/common/WorkspacePage";

export default function ReceivePage() {
  return (
    <WorkspacePage
      title="Receive stock"
      description="Scan the product unit barcode and each associated component barcode to receive the complete unit."
      sectionTitle="Receive component"
      submitEndpoint="/receipts"
      idempotent
      preserveFields={["productBarcode", "pointId"]}
      successMessage={(data) => data.completed
        ? `${data.componentName} received. All required components are received; this product unit is ready for Delivery.`
        : `${data.componentName} received. Still missing: ${data.missingComponents.join(", ")}.`}
      listTitle="Products received by you"
      listEndpoint="/activity/received-products"
      paginatedList
      columns={[
        { key: "barcode", label: "Product unit barcode" },
        { key: "productName", label: "Product" },
        { key: "receivePoint", label: "Receive point" },
        { key: "receivedAt", label: "Received at" },
        { key: "status", label: "Current status" },
      ]}
      fields={[
        {
          name: "productBarcode",
          label: "Product unit barcode",
          placeholder: "FRG-00000120",
          minLength: 12,
          maxLength: 12,
          pattern: "[A-Z]{3}-[0-9]{8}",
          title: "Enter a product unit barcode such as FRG-00000120.",
        },
        {
          name: "componentBarcode",
          label: "Component barcode",
          placeholder: "FRG-CMP-00000120",
          minLength: 16,
          maxLength: 16,
          pattern: "[A-Z]{3}-[A-Z]{3}-[0-9]{8}",
          title: "Enter the component barcode associated with this product unit.",
        },
        {
          name: "pointId",
          label: "Receive point",
          optionsEndpoint: "/stock-points",
          optionsParams: { type: "RECEIVE" },
          valueKey: "id",
          required: true,
        },
      ]}
    />
  );
}
