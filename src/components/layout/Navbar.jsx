"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function Navbar({ user }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function logout() {
    setError("");
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      router.replace("/");
    } catch (cause) {
      setError(cause.message);
    }
  }

  return (
    <>
      <span className="topbar-title">Inventory workspace</span>
      <div className="topbar-account">
        {error && <span className="form-error" role="alert">{error}</span>}
        <span className="account-name">{user.name} <span>{user.role}</span></span>
        <button className="button button-secondary" type="button" onClick={logout}>Sign out</button>
      </div>
    </>
  );
}
