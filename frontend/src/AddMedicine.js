import React, { useState } from "react";
import axios from "axios";

function AddMedicine() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const add = async () => {
    await axios.post("http://localhost:5000/addMedicine", {
      name,
      price,
      quantity: 10,
      pharmacyId: 0,
    });
    alert("Medicine Added");
  };

  return (
    <div>
      <h2>Add Medicine</h2>
      <input onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      <button onClick={add}>Add</button>
    </div>
  );
}

export default AddMedicine;
