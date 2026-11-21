"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { roleHome } from "@/config/navigation";
import { apiRequest } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const passwordChanged = searchParams.get("passwordChanged") === "1";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest("/auth/me")
      .then(({ data }) => {
        if (active) router.replace(roleHome[data.role] || "/");
      })
      .catch((cause) => {
        if (active && cause.status !== 401) setError(cause.message);
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { data } = await apiRequest("/auth/login", {
        method: "POST",
        body: { username, password },
      });
      router.replace(roleHome[data.role] || "/");
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Barcode Inventory</p>
        <h1>Sign in</h1>
        <p className="auth-description">Use your assigned account to access the inventory workspace.</p>
        {registered && <p className="form-success" role="status">Account created. You can now sign in.</p>}
        {passwordChanged && <p className="form-success" role="status">Password updated. Sign in with your new password.</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            Username
            <input
              className="input"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="field">
            Password
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="auth-footer">Need report access? <Link href="/register">Create a Report Viewer account</Link></p>
      </section>
    </main>
  );
}
