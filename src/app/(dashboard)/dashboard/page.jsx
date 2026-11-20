"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { apiRequest } from "@/lib/api";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/dashboard")
      .then(({ data }) => {
        if (active) setDashboard(data);
      })
      .catch((cause) => {
        if (active) setError(cause.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const metrics = [
    { label: "Items in stock", value: dashboard?.itemsInStock ?? "—" },
    { label: "Received today", value: dashboard?.receivedToday ?? "—" },
    { label: "Delivered today", value: dashboard?.deliveredToday ?? "—" },
  ];

  return (
    <section>
      <PageHeading
        title="Dashboard"
        description="Inventory overview"
      />
      <div className="card-grid">
        {metrics.map(({ label, value }) => (
          <article className="card" key={label}>
            <div className="card-label">{label}</div>
            <div className="card-value">{value}</div>
          </article>
        ))}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="panel">
        <div className="panel-heading">
          <h2>Recent movements</h2>
          <span className="panel-copy">Latest inventory activity</span>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Barcode</th>
                <th>Movement</th>
                <th>Location</th>
                <th>Performed by</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.recentMovements?.length ? dashboard.recentMovements.map((movement) => (
                <tr key={movement.transactionId}>
                  <td>{new Date(movement.transactionTime).toLocaleString()}</td>
                  <td>{movement.barcode}</td>
                  <td>{movement.eventType}</td>
                  <td>{movement.point || "—"}</td>
                  <td>{movement.performedBy}</td>
                </tr>
              )) : (
                <tr><td className="table-empty" colSpan="5">{dashboard ? "No inventory movements yet." : "Loading dashboard..."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
