import "./globals.css";

export const metadata = {
  title: "Barcode Inventory System",
  description: "Inventory management system for products and components.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
