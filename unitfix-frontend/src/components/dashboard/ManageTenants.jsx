import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import '../../styles/ManageTenants.css';

const ManageTenants = () => {
  const [units, setUnits] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(false);

  const getAccessToken = async () => {
    try {
      const session = await Auth.currentSession();
      return session.getIdToken().getJwtToken();
    } catch (err) {
      console.error("Failed to get access token:", err);
      return null;
    }
  };

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token found");

      const res = await fetch('https://01obuwkezf.execute-api.us-east-1.amazonaws.com/units', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const unitsData = await res.json();

      if (!Array.isArray(unitsData)) {
        console.error("Expected array but got:", unitsData);
        setUnits([]);
        return;
      }

      const unitsWithNames = await Promise.all(
        unitsData.map(async (unit) => {
          const enrichedEmails = await Promise.all(
            unit.tenant_emails.map(async (email) => {
              try {
                const nameRes = await fetch(`https://01obuwkezf.execute-api.us-east-1.amazonaws.com/tenant-records?email=${email}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                const data = await nameRes.json();
                return {
                  email,
                  name: data.name || "Unknown"
                };
              } catch {
                return { email, name: "Unknown" };
              }
            })
          );
          return { ...unit, tenants: enrichedEmails };
        })
      );

      setUnits(unitsWithNames);
    } catch (err) {
      console.error("Error fetching tenants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className="manage-tenants-container">
      <h2 className="section-title">👥 Manage Tenants</h2>
      {loading ? <p>Loading...</p> : (
        <>
          {units.slice(0, visibleCount).map((unit, idx) => (
            <div key={`${unit.apartment_id}-${unit.unit_id}-${idx}`} className="unit-block">
              <h3>🏠 Apartment {unit.apartment_id} - Unit {unit.unit_id}</h3>
              <ul>
                {unit.tenants.map((tenant, i) => (
                  <li key={i}>{tenant.name} ({tenant.email})</li>
                ))}
              </ul>
            </div>
          ))}
          {visibleCount < units.length && (
            <button onClick={handleLoadMore} className="load-more-btn">Load More</button>
          )}
        </>
      )}
    </div>
  );
};

export default ManageTenants;
