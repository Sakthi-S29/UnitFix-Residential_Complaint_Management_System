import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import "../../styles/ManageUnits.css";

const API_BASE = "https://01obuwkezf.execute-api.us-east-1.amazonaws.com";

const ManageUnits = () => {
  const [units, setUnits] = useState([]);
  const [unitId, setUnitId] = useState("");
  const [status, setStatus] = useState("Vacant");
  const [tenants, setTenants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        const res = await fetch(`${API_BASE}/units`, {
          headers: {
            Authorization: token
          }
        });

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }

        const data = await res.json();
        setUnits(data);
      } catch (err) {
        console.error("Error fetching units:", err);
        setError("Failed to fetch units.");
        setUnits([]); // fallback to allow rendering
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!unitId.trim()) return;

    const payload = {
      unit_id: unitId.trim(),
      status,
      tenants: parseInt(tenants)
    };

    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      const res = await fetch(`${API_BASE}/units`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setUnits([...units, payload]);
        setUnitId("");
        setStatus("Vacant");
        setTenants(0);
      } else {
        console.error("Failed to add unit");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };


  const handleRemoveUnit = async (unit_id) => {
    const confirmed = window.confirm("Are you sure you want to remove this unit?");
    if (!confirmed) return;

    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      const res = await fetch(`${API_BASE}/units/${unit_id}`, {
        method: "DELETE",
        headers: {
          Authorization: token
        }
      });

      if (res.ok) {
        setUnits(units.filter((unit) => unit.unit_id !== unit_id));
      } else {
        console.error("Failed to delete unit");
      }
    } catch (err) {
      console.error("Error:", err);
    }
    
  };

  return (
    <div className="manage-units-container">
      <h2 className="section-title">🏢 Manage Units</h2>
      <p className="section-subtitle">Track and manage the apartment's units with ease.</p>

      <form className="add-unit-form" onSubmit={handleAddUnit}>
        <input
          type="text"
          placeholder="Enter unit name (e.g. A101)"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
          className="form-input"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input">
          <option value="Occupied">Occupied</option>
          <option value="Vacant">Vacant</option>
        </select>
        <input
          type="number"
          placeholder="Number of tenants"
          value={tenants}
          onChange={(e) => setTenants(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="gradient-btn">Add Unit</button>
      </form>

      <div className="unit-list">
        {loading ? (
          <p>Loading units...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : units.length === 0 ? (
          <p>No units added yet.</p>
        ) : (
          <table className="unit-table">
            <thead>
              <tr>
                <th>Unit Name</th>
                <th>Status</th>
                <th>Tenants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.unit_id}>
                  <td>{unit.unit_id}</td>
                  <td>{unit.status}</td>
                  <td>{unit.tenants}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleRemoveUnit(unit.unit_id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUnits;
