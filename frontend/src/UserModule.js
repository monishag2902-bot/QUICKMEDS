import React, { useState } from "react";
import axios from "axios";

function UserModule() {
  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/medicines");
      console.log(res.data); // DEBUG
      setMedicines(res.data);
    } catch (err) {
      alert("Error fetching medicines");
      console.log(err);
    }
  };

  return (
    <div>
      <h2>👤 User Module</h2>

      <button onClick={fetchMedicines}>🔍 Show Medicines</button>

      {medicines.length === 0 ? (
        <p>No medicines yet</p>
      ) : (
        <ul>
          {medicines.map((m, i) => (
            <li key={i}>
              {m.name} - ₹{m.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserModule;
