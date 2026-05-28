import React, { useEffect, useState } from "react";
import axios from "axios";

function PharmacyModule() {
  const [pharmacyName, setPharmacyName] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState("");

  const [pharmacies, setPharmacies] = useState([]);
  const [message, setMessage] = useState("");

  // =====================================
  // FETCH PHARMACIES
  // =====================================

  const fetchPharmacies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/pharmacies");

      setPharmacies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  // =====================================
  // ADD PHARMACY
  // =====================================

  const addPharmacy = async () => {
    if (!pharmacyName) {
      setMessage("Enter pharmacy name");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/addPharmacy", {
        name: pharmacyName,
      });

      if (res.data.success) {
        setMessage(res.data.message);

        setPharmacyName("");

        fetchPharmacies();
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.log(err);

      setMessage("Error adding pharmacy");
    }
  };

  // =====================================
  // ADD MEDICINE
  // =====================================

  const addMedicine = async () => {
    if (!selectedPharmacy || !medicineName || !price || !quantity) {
      setMessage("Fill all medicine fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/addMedicine", {
        pharmacyId: selectedPharmacy,
        name: medicineName,
        price: price,
        quantity: quantity,
      });

      if (res.data.success) {
        setMessage(res.data.message);

        setMedicineName("");
        setPrice("");
        setQuantity("");

        fetchPharmacies();
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.log(err);

      setMessage("Error adding medicine");
    }
  };

  return (
    <div>
      <h2>🏥 Add Pharmacy</h2>

      <input
        type="text"
        placeholder="Pharmacy Name"
        value={pharmacyName}
        onChange={(e) => setPharmacyName(e.target.value)}
      />

      <button onClick={addPharmacy}>Add Pharmacy</button>

      <h2>💊 Add Medicine</h2>

      <select
        value={selectedPharmacy}
        onChange={(e) => setSelectedPharmacy(e.target.value)}
      >
        <option value="">Select Pharmacy</option>

        {pharmacies.map((pharmacy) => (
          <option key={pharmacy.id} value={pharmacy.id}>
            {pharmacy.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Medicine Name"
        value={medicineName}
        onChange={(e) => setMedicineName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button onClick={addMedicine}>Add Medicine</button>

      <h2>📋 Pharmacy Inventory</h2>

      {pharmacies.length === 0 ? (
        <p>No pharmacies added</p>
      ) : (
        pharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>🏪 {pharmacy.name}</h3>

            {pharmacy.medicines && pharmacy.medicines.length > 0 ? (
              pharmacy.medicines.map((medicine) => (
                <div key={medicine.id}>
                  <p>💊 {medicine.name}</p>

                  <p>Price: ₹{medicine.price}</p>

                  <p>Quantity: {medicine.quantity}</p>

                  <hr />
                </div>
              ))
            ) : (
              <p>No medicines added</p>
            )}
          </div>
        ))
      )}

      <h3>{message}</h3>
    </div>
  );
}

export default PharmacyModule;
