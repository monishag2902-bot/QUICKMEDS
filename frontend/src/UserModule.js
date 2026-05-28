import React, { useState, useEffect } from "react";
import axios from "axios";

function UserModule({ currentUser, onLogin }) {
  const [view, setView] = useState(currentUser ? "dashboard" : "auth");

  const [authMode, setAuthMode] = useState("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [medicines, setMedicines] = useState([]);

  const [cartItem, setCartItem] = useState(null);

  const [quantity, setQuantity] = useState(1);

  // =====================================
  // FETCH MEDICINES
  // =====================================

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/medicines");

      setMedicines(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // LOGIN / REGISTER
  // =====================================

  const handleAuth = async () => {
    try {
      const endpoint =
        authMode === "login"
          ? "http://localhost:5000/login"
          : "http://localhost:5000/register";

      const res = await axios.post(endpoint, formData);

      if (res.data.success) {
        // LOGIN

        if (authMode === "login") {
          onLogin(res.data.data);

          setView("dashboard");
        }

        // REGISTER
        else {
          alert("Registration Successful");

          setAuthMode("login");
        }
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);

      alert("Server Error");
    }
  };

  // =====================================
  // ADD TO CART
  // =====================================

  const handleAddToCart = (medicine) => {
    setCartItem(medicine);

    setQuantity(1);
  };

  // =====================================
  // PLACE ORDER
  // =====================================

  const handlePlaceOrder = async () => {
    try {
      if (!cartItem) {
        alert("No Medicine Selected");
        return;
      }

      const res = await axios.post("http://localhost:5000/placeOrder", {
        medicineName: cartItem.name,

        quantity: Number(quantity),

        userEmail:
          currentUser && currentUser.email
            ? currentUser.email
            : "demo@gmail.com",
      });

      if (res.data.success) {
        alert("Order Placed Successfully ✅");

        setCartItem(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);

      alert("Server Error");
    }
  };

  // =====================================
  // AUTH PAGE
  // =====================================

  if (view === "auth") {
    return (
      <div className="card">
        <h2>{authMode === "login" ? "Login" : "Register"}</h2>

        {/* NAME */}

        {authMode === "register" && (
          <div>
            <input
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />
          </div>
        )}

        {/* EMAIL */}

        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
        </div>

        {/* PASSWORD */}

        <div>
          <input
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />
        </div>

        {/* BUTTON */}

        <button onClick={handleAuth}>
          {authMode === "login" ? "Login" : "Register"}
        </button>

        <br />
        <br />

        {/* SWITCH BUTTON */}

        <button
          onClick={() =>
            setAuthMode(authMode === "login" ? "register" : "login")
          }
        >
          Switch To {authMode === "login" ? "Register" : "Login"}
        </button>
      </div>
    );
  }

  // =====================================
  // DASHBOARD
  // =====================================

  return (
    <div>
      {/* WELCOME */}

      <div className="card">
        <h2>Welcome {currentUser ? currentUser.name : "User"}</h2>
      </div>

      {/* MEDICINES */}

      <div className="card">
        <h3>💊 Medicines</h3>

        {medicines.length === 0 ? (
          <p>No Medicines Available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Pharmacy</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {medicines.map((med) => (
                <tr key={med.id}>
                  <td>{med.name}</td>

                  <td>₹{med.price}</td>

                  <td>{med.quantity}</td>

                  <td>{med.pharmacyName}</td>

                  <td>
                    <button onClick={() => handleAddToCart(med)}>Order</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ORDER BOX */}

      {cartItem && (
        <div className="card">
          <h3>Order {cartItem.name}</h3>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <br />
          <br />

          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
}

export default UserModule;
