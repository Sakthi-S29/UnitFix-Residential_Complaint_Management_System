// components/dashboard/AddTenant.jsx
import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import "../../styles/AddTenant.css";

const API_BASE = "https://01obuwkezf.execute-api.us-east-1.amazonaws.com";

const AddTenant = () => {
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("");
  const [units, setUnits] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        const res = await fetch(`${API_BASE}/units`, {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch units");
        const data = await res.json();
        setUnits(data);
      } catch (err) {
        console.error("Error fetching units:", err);
        setError("⚠️ Failed to load unit list.");
      }
    };

    fetchUnits();
  }, []);

  const handleAddTenant = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (!unit.trim()) {
      setError("Please select a unit.");
      setLoading(false);
      return;
    }

    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      const res = await fetch(`${API_BASE}/units/add-tenant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ email, unit_id: unit }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(result.message || "✅ Tenant added successfully!");
        setEmail("");
        setUnit("");
      } else {
        setError(result.message || "❌ Failed to add tenant.");
      }
    } catch (err) {
      console.error("Error adding tenant:", err);
      setError("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-tenant-container">
      <h2 className="section-title">🏢 Add Tenant</h2>
      <p className="section-subtitle">Assign a tenant to a specific unit in your apartment.</p>

      <form className="add-tenant-form" onSubmit={handleAddTenant}>
        <input
          type="email"
          placeholder="Tenant's Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select Unit</option>
          {units.map((u) => (
            <option key={u.unit_id} value={u.unit_id}>
              {u.unit_id}
            </option>
          ))}
        </select>

        <button type="submit" className="gradient-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Tenant"}
        </button>
      </form>

      {success && <p className="success-text">{success}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default AddTenant;
