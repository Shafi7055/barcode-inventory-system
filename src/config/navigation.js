export const navigation = [
  {
    title: "Workspace",
    links: [{ label: "Dashboard", href: "/dashboard" }],
  },
  {
    title: "Inventory",
    links: [
      { label: "Component tracking", href: "/component-tracking" },
      { label: "Receive stock", href: "/receive" },
      { label: "Deliver stock", href: "/delivery" },
    ],
  },
  {
    title: "Administration",
    links: [
      { label: "Products", href: "/admin/master-data/products" },
      { label: "Components", href: "/admin/master-data/components" },
      { label: "Receive points", href: "/admin/master-data/receive-points" },
      { label: "Delivery points", href: "/admin/master-data/delivery-points" },
      { label: "Reversals", href: "/admin/reversals" },
      { label: "Audit logs", href: "/admin/audit-logs" },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "Stock details", href: "/reports/stock-details" },
      { label: "Summary", href: "/reports/summary" },
      { label: "Barcode history", href: "/reports/barcode-history" },
    ],
  },
];
