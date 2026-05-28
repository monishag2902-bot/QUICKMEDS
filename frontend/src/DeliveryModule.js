import React, { useState } from "react";
import axios from "axios";

function DeliveryModule() {
  const [result, setResult] = useState("");

  const getPath = async () => {
    try {
      const res = await axios.get("http://localhost:5000/nearestPharmacy");

      if (res.data.success) {
        setResult(`Nearest Pharmacy: ${res.data.pharmacy.name}`);
      }
    } catch (err) {
      console.log(err);

      setResult("Error fetching route");
    }
  };

  return (
    <div className="card">
      <h2>🚚 Delivery Module</h2>

      <button onClick={getPath}>Find Shortest Path</button>

      <h3>{result}</h3>
    </div>
  );
}

export default DeliveryModule;
