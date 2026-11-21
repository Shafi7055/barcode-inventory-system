"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { apiRequest } from "@/lib/api";

const EMPTY_FORM = { name: "", username: "", password: "", role: "" };

export default function UserManagement() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadUsers() {
    const [roleResult, userResult] = await Promise.all([
      apiRequest("/users/roles"),
      apiRequest("/users"),
    ]);
    setRoles(roleResult.data);
    setUsers(userResult.data);
  }

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/users/roles"), apiRequest("/users")])
      .then(([roleResult, userResult]) => {
        if (active) {
          setRoles(roleResult.data);
          setUsers(userResult.data);
        }
      })
      .catch((cause) => {
        if (active) setError(cause.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function createUser(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await apiRequest("/users", { method: "POST", body: form });
      setForm(EMPTY_FORM);
      await loadUsers();
      setSuccess("User created.");
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function updateUser(user, event) {
    const formData = new FormData(event.currentTarget);
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await apiRequest(`/users/${user.id}`, {
        method: "PATCH",
        body: {
          role: formData.get("role"),
          isActive: formData.get("isActive") === "on",
        },
      });
      await loadUsers();
      setSuccess(`Updated ${user.username}.`);
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <PageHeading title="User management" description="Create accounts and manage roles and access." />
      <div className="panel">
        <h2>Create user</h2>
        <form className="user-create-form" onSubmit={createUser}>
          <div className="form-grid">
            <label className="field">
              Full name
              <input className="input" required maxLength={200} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="field">
              Username
              <input className="input" required minLength={3} maxLength={64} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
            </label>
            <label className="field">
              Temporary password (12 characters minimum)
              <input className="input" type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </label>
            <label className="field">
              Role
              <select className="input" required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                <option value="" disabled>Select role</option>
                {roles.map((role) => <option key={role.name} value={role.name}>{role.name}</option>)}
              </select>
            </label>
          </div>
          <button className="button" type="submit" disabled={submitting} style={{ marginTop: 18 }}>
            {submitting ? "Saving..." : "Create user"}
          </button>
        </form>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">{success}</p>}
      <div className="panel data-panel">
        <div className="panel-heading"><h2>Accounts</h2></div>
        {loading ? <p className="empty-state">Loading users...</p> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Active</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td colSpan="3">
                      <form className="user-row-form" onSubmit={(event) => updateUser(user, event)}>
                        <select className="input" name="role" defaultValue={user.role} disabled={user.role === "Admin"}>
                          {user.role === "Admin"
                            ? <option value="Admin">Admin</option>
                            : roles.map((role) => <option key={role.name} value={role.name}>{role.name}</option>)}
                        </select>
                        <label className="user-active-field">
                          <input type="checkbox" name="isActive" defaultChecked={user.isActive} />
                          Active
                        </label>
                        <button className="button button-secondary" type="submit" disabled={submitting}>Save</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {!users.length && <tr><td className="table-empty" colSpan="5">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
