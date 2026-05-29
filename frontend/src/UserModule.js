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

  const [userOrders, setUserOrders] = useState([]);

  const [cartItem, setCartItem] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

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
  // AUTH
  // =====================================

  const handleAuth = async () => {
    try {
      const endpoint =
        authMode === "login"
          ? "http://localhost:5000/login"
          : "http://localhost:5000/register";

      const res = await axios.post(endpoint, formData);

      // SUCCESS

      if (res.data.success) {
        setMessage(res.data.message || `${authMode} successful`);

        setMessageType("success");

        // LOGIN

        if (authMode === "login") {
          onLogin(res.data.data);

          setView("dashboard");
        } else {
          setAuthMode("login");
        }
      } else {
        setMessage(res.data.message || "Authentication Failed");

        setMessageType("error");
      }
    } catch (err) {
      console.log(err);

      setMessage("Server Error");

      setMessageType("error");
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
      // LOGIN CHECK

      if (!currentUser) {
        alert("Please Login First");

        return;
      }

      // CART CHECK

      if (!cartItem) {
        alert("No medicine selected");

        return;
      }

      // API CALL

      const res = await axios.post("http://localhost:5000/placeOrder", {
        medicineName: cartItem.name,

        quantity: Number(quantity),

        userEmail: currentUser?.email || "",
      });

      // SUCCESS

      if (res.data.success) {
        alert("Order Placed Successfully ✅");

        // SAVE ORDER

        setUserOrders([
          ...userOrders,
          {
            medicineName: cartItem.name,

            quantity: quantity,
          },
        ]);

        // CLEAR CART

        setCartItem(null);
      } else {
        alert(res.data.message || "Order Failed");
      }
    } catch (err) {
      console.log("ORDER ERROR:", err);

      alert("Server Error");
    }
  };

  // =====================================
  // AUTH VIEW
  // =====================================

  if (view === "auth") {
    return (
      <div className="card">
        <h2>
          {authMode === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* NAME */}

        {authMode === "register" && (
          <div className="form-group">
            <label>Name</label>

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

        <div className="form-group">
          <label>Email</label>

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

        <div className="form-group">
          <label>Password</label>

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

        {/* TOGGLE */}

        <p
          style={{
            marginTop: 15,
          }}
        >
          {authMode === "login"
            ? "Don't have account?"
            : "Already have account?"}

          <button
            className="toggle-btn"
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");

              setMessage("");
            }}
          >
            {authMode === "login" ? " Register" : " Login"}
          </button>
        </p>

        {/* MESSAGE */}

        {message && <div className={`alert ${messageType}`}>{message}</div>}
      </div>
    );
  }

  // =====================================
  // DASHBOARD
  // =====================================

  return (
    <div>
      <div className="card">
        <h2>Welcome {currentUser?.name}</h2>
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

      {/* CART */}

      {cartItem && (
        <div className="card">
          <h3>Order {cartItem.name}</h3>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}

      {/* USER ORDERS */}

      {userOrders.length > 0 && (
        <div className="card">
          <h3>🧾 Your Orders</h3>

          <ul>
            {userOrders.map((order, index) => (
              <li key={index}>
                {order.medicineName}
                {" - "}
                Quantity:
                {order.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserModule;
