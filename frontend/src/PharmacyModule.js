import React, { useEffect, useState } from "react";
import axios from "axios";

function PharmacyModule() {
  const [pharmacies, setPharmacies] = useState([]);

  const [pharmacyName, setPharmacyName] = useState("");

  const [medicineData, setMedicineData] = useState({
    pharmacyId: "",
    name: "",
    price: "",
    quantity: "",
  });

  const [message, setMessage] = useState("");

  // ======================================
  // FETCH PHARMACIES
  // ======================================

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/pharmacies");

      setPharmacies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ======================================
  // ADD PHARMACY
  // ======================================

  const addPharmacy = async () => {
    if (!pharmacyName) {
      alert("Enter pharmacy name");

      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/addPharmacy", {
        name: pharmacyName,
      });

      if (res.data.success) {
        setMessage("Pharmacy Added Successfully");

        setPharmacyName("");

        // REFRESH DATA
        fetchPharmacies();
      } else {
        setMessage("Error adding pharmacy");
      }
    } catch (err) {
      console.log(err);

      setMessage("Server Error");
    }
  };

  // ======================================
  // ADD MEDICINE
  // ======================================

  const addMedicine = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/addMedicine",
        medicineData,
      );

      if (res.data.success) {
        setMessage("Medicine Added Successfully");

        setMedicineData({
          pharmacyId: "",
          name: "",
          price: "",
          quantity: "",
        });

        // REFRESH
        fetchPharmacies();
      } else {
        setMessage("Error adding medicine");
      }
    } catch (err) {
      console.log(err);

      setMessage("Server Error");
    }
  };

  return (
    <div>
      {/* ADD PHARMACY */}

      <div className="card">
        <h2>🏥 Add Pharmacy</h2>

        <input
          type="text"
          placeholder="Pharmacy Name"
          value={pharmacyName}
          onChange={(e) => setPharmacyName(e.target.value)}
        />

        <button onClick={addPharmacy}>Add Pharmacy</button>
      </div>

      {/* ADD MEDICINE */}

      <div className="card">
        <h2>💊 Add Medicine</h2>

        <select
          value={medicineData.pharmacyId}
          onChange={(e) =>
            setMedicineData({
              ...medicineData,
              pharmacyId: e.target.value,
            })
          }
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
          value={medicineData.name}
          onChange={(e) =>
            setMedicineData({
              ...medicineData,
              name: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={medicineData.price}
          onChange={(e) =>
            setMedicineData({
              ...medicineData,
              price: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Quantity"
          value={medicineData.quantity}
          onChange={(e) =>
            setMedicineData({
              ...medicineData,
              quantity: e.target.value,
            })
          }
        />

        <button onClick={addMedicine}>Add Medicine</button>
      </div>

      {/* INVENTORY */}

      <div className="card">
        <h2>📋 Pharmacy Inventory</h2>

        {pharmacies.length === 0 ? (
          <p>No pharmacies added</p>
        ) : (
          pharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              style={{
                marginBottom: "20px",
              }}
            >
              <h3>{pharmacy.name}</h3>

              {pharmacy.medicines.length === 0 ? (
                <p>No medicines added</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Medicine</th>

                      <th>Price</th>

                      <th>Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pharmacy.medicines.map((med) => (
                      <tr key={med.id}>
                        <td>{med.name}</td>

                        <td>₹{med.price}</td>

                        <td>{med.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}

        {message && <h3>{message}</h3>}
      </div>
    </div>
  );
}

export default PharmacyModule;
