"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("/auth/register", { method: "POST", body: values });
      router.replace("/?registered=1");
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
        <h1>Create report account</h1>
        <p className="auth-description">New accounts receive read-only Report Viewer access.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            Full name
            <input className="input" autoComplete="name" maxLength={200} required value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
          </label>
          <label className="field">
            Username
            <input className="input" autoComplete="username" minLength={3} maxLength={64} required value={values.username} onChange={(event) => setValues({ ...values, username: event.target.value })} />
          </label>
          <label className="field">
            Password (12 characters minimum)
            <input className="input" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="auth-footer"><Link href="/">Back to sign in</Link></p>
      </section>
    </main>
  );
}
