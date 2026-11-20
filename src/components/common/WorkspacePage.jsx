"use client";

import { useEffect, useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { apiRequest, queryString } from "@/lib/api";

const EMPTY_PARAMS = {};

export default function WorkspacePage({
  title,
  description,
  fields = [],
  sectionTitle,
  eyebrow,
  listEndpoint,
  listParams = EMPTY_PARAMS,
  columns = [],
  submitEndpoint,
  submitMethod = "POST",
  idempotent = false,
}) {
  const [values, setValues] = useState({});
  const [options, setOptions] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(Boolean(listEndpoint));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const [success, setSuccess] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const fieldConfig = JSON.stringify(fields);
  const listParamsConfig = JSON.stringify(listParams);

  useEffect(() => {
    let active = true;
    const configuredFields = JSON.parse(fieldConfig);
    Promise.all(configuredFields.filter((field) => field.optionsEndpoint || field.options).map(async (field) => {
      if (!field.optionsEndpoint) return [field.name, field.options];
      const query = queryString(field.optionsParams);
      const result = await apiRequest(`${field.optionsEndpoint}${query}`);
      return [field.name, result.data];
    }))
      .then((entries) => {
        if (active) setOptions(Object.fromEntries(entries));
      })
      .catch((cause) => {
        if (active) {
          setError(cause.message);
          setErrorDetails(cause.details || []);
        }
      });
    return () => {
      active = false;
    };
  }, [fieldConfig]);

  useEffect(() => {
    if (!listEndpoint) return undefined;
    let active = true;
    apiRequest(`${listEndpoint}${queryString(JSON.parse(listParamsConfig))}`)
      .then((result) => {
        if (active) {
          setRows(result.data);
          setError("");
          setErrorDetails([]);
        }
      })
      .catch((cause) => {
        if (active) {
          setError(cause.message);
          setErrorDetails(cause.details || []);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [listEndpoint, listParamsConfig, reloadKey]);

  function displayValue(value, key) {
    if (value === null || value === undefined || value === "") return "—";
    if (key.toLowerCase().endsWith("at")) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return date.toLocaleString();
    }
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setErrorDetails([]);
    setSuccess("");
    try {
      if (submitMethod === "GET") {
        const result = await apiRequest(`${submitEndpoint}${queryString(values)}`);
        setRows(Array.isArray(result.data) ? result.data : [result.data]);
      } else {
        const endpoint = submitEndpoint.replace(/\{(\w+)\}/g, (_match, field) => encodeURIComponent(values[field]));
        const body = Object.fromEntries(
          Object.entries(values).filter(([name]) => !fields.find((field) => field.name === name)?.path),
        );
        await apiRequest(endpoint, {
          method: submitMethod,
          body,
          idempotent,
        });
        setValues({});
        if (listEndpoint) setReloadKey((key) => key + 1);
      }
      setSuccess(`${sectionTitle || "Request"} completed successfully.`);
    } catch (cause) {
      setError(cause.message);
      setErrorDetails(cause.details || []);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <PageHeading title={title} description={description} eyebrow={eyebrow} />
      <div className="panel">
        <h2>{sectionTitle || (fields.length ? "New entry" : "Results")}</h2>
        <p className="panel-copy">
          {fields.length
            ? "Enter the details below to continue."
            : "Information from the inventory service."}
        </p>
        {fields.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {fields.map((field) => (
                <label className="field" key={field.name}>
                  {field.label}
                  {field.optionsEndpoint || field.options ? (
                    <select
                      className="input"
                      required={field.required !== false}
                      value={values[field.name] || ""}
                      onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                    >
                      <option value="" disabled>
                        Select {field.label.toLowerCase()}
                      </option>
                      {(options[field.name] || field.options || []).map((option) => {
                        const value = typeof option === "string" ? option : option[field.valueKey || "id"];
                        const label = typeof option === "string" ? option : option[field.labelKey || "name"];
                        return <option key={value} value={value}>{label}</option>;
                      })}
                    </select>
                  ) : (
                    <input
                      className="input"
                      type={field.type || "text"}
                      name={field.name}
                      required={field.required !== false}
                      min={field.min}
                      minLength={field.minLength}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder || field.label}
                      value={values[field.name] || ""}
                      onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                    />
                  )}
                </label>
              ))}
            </div>
            <button className="button" type="submit" disabled={submitting} style={{ marginTop: 18 }}>
              {submitting ? "Working..." : (sectionTitle?.startsWith("Add") ? sectionTitle : "Submit")}
            </button>
          </form>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        {errorDetails.length > 0 && (
          <ul className="form-error-list">
            {errorDetails.map((detail, index) => (
              <li key={`${detail.field || "error"}-${index}`}>
                {detail.field ? `${detail.field}: ` : ""}{detail.message}
              </li>
            ))}
          </ul>
        )}
        {success && <p className="form-success" role="status">{success}</p>}
      </div>
      {(columns.length > 0 || !fields.length) && (
        <div className="panel data-panel">
          <div className="panel-heading">
            <h2>{fields.length ? "Records" : sectionTitle || "Results"}</h2>
            {listEndpoint && (
              <button className="button button-secondary" type="button" onClick={() => setReloadKey((key) => key + 1)}>
                Refresh
              </button>
            )}
          </div>
          {loading ? (
            <p className="empty-state">Loading records...</p>
          ) : rows.length && columns.length ? (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id || row.transactionId || row.unitId || `${index}`}>
                      {columns.map((column) => <td key={column.key}>{displayValue(row[column.key], column.key)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">{error ? "Records could not be loaded." : "No records to display."}</div>
          )}
        </div>
      )}
    </section>
  );
}
