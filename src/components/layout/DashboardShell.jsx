"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/config/navigation";
import Navbar from "@/components/layout/Navbar";

export default function DashboardShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard">
          Barcode Inventory
          <span>Management system</span>
        </Link>
        {navigation.map((group) => (
            <nav className="nav-group" key={group.title}>
              <p className="nav-label">{group.title}</p>
              {group.links.map((link) => (
                <Link
                  className={`nav-link${pathname === link.href ? " active" : ""}`}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
        ))}
      </aside>
      <div className="main-area">
        <header className="topbar">
          <Navbar />
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
