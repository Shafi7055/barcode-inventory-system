"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navigationForRole, roleCanAccessPath, roleHome } from "@/config/navigation";
import Navbar from "@/components/layout/Navbar";
import { apiRequest } from "@/lib/api";

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/auth/me")
      .then(({ data }) => {
        if (active) setUser(data);
      })
      .catch((cause) => {
        if (active && cause.status === 401) router.replace("/");
        else if (active) {
          setError(cause.message);
          setLoading(false);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (user && !roleCanAccessPath(user.role, pathname)) {
      router.replace(roleHome[user.role] || "/");
    }
  }, [pathname, router, user]);

  if (loading || !user || !roleCanAccessPath(user.role, pathname)) {
    return (
      <main className="auth-loading">
        {error ? <p className="form-error" role="alert">{error}</p> : "Checking access..."}
      </main>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link className="brand" href={roleHome[user.role]}>
          Barcode Inventory
          <span>Management system</span>
        </Link>
        {navigationForRole(user.role).map((group) => (
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
          <Navbar user={user} />
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
