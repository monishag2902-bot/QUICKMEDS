import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminModule() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      console.log("Fetching analytics...");

      const res = await axios.get("http://localhost:5000/analytics");

      console.log("Response:", res.data);

      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.log("ERROR:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2>📊 Analytics Dashboard</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📊 Analytics Dashboard</h2>

      <p>👤 Total Users: {data.totalUsers}</p>

      <p>🧾 Total Orders: {data.totalOrders}</p>

      <p>💊 Total Medicines: {data.totalMedicines}</p>

      <p>🏪 Total Pharmacies: {data.totalPharmacies}</p>
    </div>
  );
}

export default AdminModule;
