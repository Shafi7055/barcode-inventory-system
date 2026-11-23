"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { apiRequest, queryString } from "@/lib/api";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [activity, setActivity] = useState(null);
  const [activityPages, setActivityPages] = useState({ tracked: 1, received: 1, delivered: 1 });
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

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest(`/activity/tracked-products${queryString({ page: activityPages.tracked })}`),
      apiRequest(`/activity/received-products${queryString({ page: activityPages.received })}`),
      apiRequest(`/activity/delivered-products${queryString({ page: activityPages.delivered })}`),
    ])
      .then(([tracked, received, delivered]) => {
        if (active) {
          setActivity({ tracked, received, delivered });
        }
      })
      .catch((cause) => {
        if (active) setError(cause.message);
      });
    return () => {
      active = false;
    };
  }, [activityPages]);

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
                <th>Component</th>
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
                  <td>{movement.component || "—"}</td>
                  <td>{movement.point || "—"}</td>
                  <td>{movement.performedBy}</td>
                </tr>
              )) : (
                <tr><td className="table-empty" colSpan="6">{dashboard ? "No inventory movements yet." : "Loading dashboard..."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ActivityPanel
        title="Tracked products"
        result={activity?.tracked}
        onPageChange={(page) => setActivityPages((current) => ({ ...current, tracked: page }))}
        columns={[
          ["barcode", "Product unit barcode"],
          ["productName", "Product"],
          ["trackedComponents", "Components tracked"],
          ["lastTrackedAt", "Last tracked"],
          ["trackedBy", "Tracked by"],
        ]}
      />
      <ActivityPanel
        title="Received products"
        result={activity?.received}
        onPageChange={(page) => setActivityPages((current) => ({ ...current, received: page }))}
        columns={[
          ["barcode", "Product unit barcode"],
          ["productName", "Product"],
          ["receivePoint", "Receive point"],
          ["receivedAt", "Received at"],
          ["status", "Current status"],
          ["receivedBy", "Received by"],
        ]}
      />
      <ActivityPanel
        title="Delivered products"
        result={activity?.delivered}
        onPageChange={(page) => setActivityPages((current) => ({ ...current, delivered: page }))}
        columns={[
          ["barcode", "Product unit barcode"],
          ["productName", "Product"],
          ["deliveryPoint", "Delivery point"],
          ["deliveredAt", "Delivered at"],
          ["status", "Current status"],
          ["deliveredBy", "Delivered by"],
        ]}
      />
    </section>
  );
}

function ActivityPanel({ title, result, columns, onPageChange }) {
  const rows = result?.data || [];
  return (
    <div className="panel data-panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        <span className="panel-copy">
          {result ? `Latest activity · ${result.meta.totalItems} total` : "Loading activity..."}
        </span>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>{columns.map(([key, label]) => <th key={key}>{label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row) => (
              <tr key={row.id || row.unitId}>
                {columns.map(([key]) => (
                  <td key={key}>
                    {key.toLowerCase().endsWith("at") && row[key]
                      ? new Date(row[key]).toLocaleString()
                      : row[key] ?? "—"}
                  </td>
                ))}
              </tr>
            )) : (
              <tr><td className="table-empty" colSpan={columns.length}>
                {result ? "No products in this activity yet." : "Loading activity..."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      {result?.meta?.totalPages > 1 && (
        <div className="panel-heading">
          <span className="panel-copy">Page {result.meta.page} of {result.meta.totalPages}</span>
          <div>
            <button
              className="button button-secondary"
              type="button"
              disabled={result.meta.page <= 1}
              onClick={() => onPageChange(result.meta.page - 1)}
            >
              Previous
            </button>
            <button
              className="button button-secondary"
              type="button"
              disabled={result.meta.page >= result.meta.totalPages}
              onClick={() => onPageChange(result.meta.page + 1)}
              style={{ marginLeft: 8 }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
