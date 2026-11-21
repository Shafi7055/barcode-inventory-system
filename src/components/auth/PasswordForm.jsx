"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeading from "@/components/common/PageHeading";
import { apiRequest } from "@/lib/api";

export default function PasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("/auth/password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      setCurrentPassword("");
      setNewPassword("");
      router.replace("/?passwordChanged=1");
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <PageHeading title="Change password" description="Update your account password." />
      <div className="panel auth-settings-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            Current password
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </label>
          <label className="field">
            New password (12 characters minimum)
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </section>
  );
}
