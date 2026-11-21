export const roleHome = {
  Admin: "/dashboard",
  "Component Tracker": "/component-tracking",
  "Receive User": "/receive",
  "Delivery User": "/delivery",
  "Report Viewer": "/reports/stock-details",
};

export const navigation = [
  {
    title: "Workspace",
    links: [{ label: "Dashboard", href: "/dashboard", roles: ["Admin"] }],
  },
  {
    title: "Inventory",
    links: [
      { label: "Component tracking", href: "/component-tracking", roles: ["Admin", "Component Tracker"] },
      { label: "Receive stock", href: "/receive", roles: ["Admin", "Receive User"] },
      { label: "Deliver stock", href: "/delivery", roles: ["Admin", "Delivery User"] },
    ],
  },
  {
    title: "Administration",
    links: [
      { label: "Products", href: "/admin/master-data/products", roles: ["Admin"] },
      { label: "Components", href: "/admin/master-data/components", roles: ["Admin"] },
      { label: "Receive points", href: "/admin/master-data/receive-points", roles: ["Admin"] },
      { label: "Delivery points", href: "/admin/master-data/delivery-points", roles: ["Admin"] },
      { label: "Reversals", href: "/admin/reversals", roles: ["Admin"] },
      { label: "Audit logs", href: "/admin/audit-logs", roles: ["Admin"] },
      { label: "Users", href: "/admin/users", roles: ["Admin"] },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "Stock details", href: "/reports/stock-details", roles: ["Admin", "Report Viewer"] },
      { label: "Summary", href: "/reports/summary", roles: ["Admin", "Report Viewer"] },
      { label: "Barcode history", href: "/reports/barcode-history", roles: ["Admin", "Report Viewer"] },
    ],
  },
  { title: "Account", links: [{ label: "Change password", href: "/account/password" }] },
];

export function navigationForRole(role) {
  return navigation.map((group) => ({
    ...group,
    links: group.links.filter((link) => !link.roles || link.roles.includes(role)),
  })).filter((group) => group.links.length);
}

export function roleCanAccessPath(role, pathname) {
  return navigationForRole(role).some((group) => group.links.some(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`),
  ));
}
