"use client";

import { useEffect, useState } from "react";
import WorkspacePage from "@/components/common/WorkspacePage";
import { apiRequest } from "@/lib/api";

export default function ProductsPage() {
  return (
    <>
      <WorkspacePage
        title="Products"
        description="Manage the products tracked in your inventory."
        sectionTitle="Add product"
        submitEndpoint="/products"
        listEndpoint="/products"
        columns={[
          { key: "name", label: "Product" },
          { key: "code", label: "Code" },
          { key: "requiredComponentCodes", label: "Required components" },
          { key: "description", label: "Description" },
          { key: "isActive", label: "Active" },
          { key: "createdAt", label: "Created" },
        ]}
        fields={[
          { name: "name", label: "Product name" },
          { name: "code", label: "Product code" },
          { name: "description", label: "Description", required: false },
        ]}
        eyebrow="Master data"
      />
      <ProductComponentRequirements />
    </>
  );
}

function ProductComponentRequirements() {
  const [products, setProducts] = useState([]);
  const [components, setComponents] = useState([]);
  const [productId, setProductId] = useState("");
  const [componentCodes, setComponentCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest("/products?pageSize=100"),
      apiRequest("/components?pageSize=100"),
    ])
      .then(([productResult, componentResult]) => {
        if (!active) return;
        const nextProducts = productResult.data;
        setProducts(nextProducts);
        setComponents(componentResult.data);
        const firstProduct = nextProducts[0];
        setProductId(firstProduct ? String(firstProduct.id) : "");
        setComponentCodes(firstProduct?.requiredComponentCodes || []);
        setError("");
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
  }, [reloadKey]);

  function chooseProduct(value) {
    const selected = products.find((product) => String(product.id) === value);
    setProductId(value);
    setComponentCodes(selected?.requiredComponentCodes || []);
    setError("");
    setSuccess("");
  }

  function toggleComponent(code) {
    setComponentCodes((current) => current.includes(code)
      ? current.filter((item) => item !== code)
      : [...current, code]);
  }

  async function saveRequirements(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await apiRequest(`/products/${productId}/required-components`, {
        method: "PUT",
        body: { componentCodes },
      });
      setProducts((current) => current.map((product) => (
        product.id === data.id ? { ...product, requiredComponentCodes: data.requiredComponentCodes } : product
      )));
      setSuccess(`Required components saved for ${data.name}.`);
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="panel data-panel">
      <div className="panel-heading">
        <h2>Required components by product</h2>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            setLoading(true);
            setReloadKey((current) => current + 1);
          }}
        >
          Refresh
        </button>
      </div>
      <p className="panel-copy">A unit must have every required component tracked before it can be received or delivered.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">{success}</p>}
      {loading ? <p className="empty-state">Loading products and components...</p> : (
        products.length && components.length ? (
          <form onSubmit={saveRequirements}>
            <div className="form-grid">
              <label className="field">
                Product
                <select className="input" value={productId} onChange={(event) => chooseProduct(event.target.value)} required>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name} ({product.code})</option>
                  ))}
                </select>
              </label>
            </div>
            <fieldset style={{ margin: "20px 16px 0", border: 0, padding: 0 }}>
              <legend className="field">Select every component required for this product</legend>
              <div className="form-grid">
                {components.map((component) => (
                  <label key={component.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={componentCodes.includes(component.code)}
                      onChange={() => toggleComponent(component.code)}
                    />
                    {component.name} ({component.code})
                  </label>
                ))}
              </div>
            </fieldset>
            <button className="button" type="submit" disabled={saving} style={{ margin: 18 }}>
              {saving ? "Saving..." : "Save required components"}
            </button>
          </form>
        ) : (
          <p className="empty-state">Add at least one product and one component before configuring requirements.</p>
        )
      )}
    </div>
  );
}
