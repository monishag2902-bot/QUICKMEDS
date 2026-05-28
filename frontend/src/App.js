import React, { useState } from "react";

import "./AppNew.css";
import "./LandingPage.css";

import LandingPage from "./LandingPage";
import AdminModule from "./AdminModule";
import UserModule from "./UserModule";
import PharmacyModule from "./PharmacyModule";
import DeliveryModule from "./DeliveryModule";

function App() {
  // ================= STATES =================
  const [showApp, setShowApp] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // ================= LOGOUT =================
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setActiveTab(null);
  };

  // ================= LOGIN =================
  const handleUserLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setActiveTab("user");
  };

  // ================= LANDING PAGE =================
  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  // ================= MAIN APP =================
  return (
    <div className="app">
      {/* HEADER */}
      <div className="header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>💊 QuickMeds</h1>
            <p>Online Medicine Management & Delivery System</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <button
              onClick={() => setShowApp(false)}
              style={{
                padding: "8px 16px",
                fontSize: "0.9rem",
                backgroundColor: "rgba(255,255,255,0.25)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "8px",
                display: "block",
                width: "100%",
              }}
            >
              ← Back To Home
            </button>

            {currentUser && (
              <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem" }}>
                Welcome, <strong>{currentUser.name}</strong>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "4px 12px",
                    fontSize: "0.85rem",
                    backgroundColor: "rgba(255,255,255,0.25)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Logout
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CONTAINER */}
      <div className="container">
        {/* DASHBOARD */}
        {activeTab === null && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "50px",
              marginTop: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "2.2rem",
                color: "#2d4a5f",
                marginBottom: "12px",
              }}
            >
              Welcome To QuickMeds Dashboard
            </h2>

            <p
              style={{
                fontSize: "1.05rem",
                color: "#6b7684",
                marginBottom: "40px",
              }}
            >
              Manage medicines, orders, deliveries and analytics easily in one
              place.
            </p>
          </div>
        )}

        {/* MODULE CARDS */}
        {activeTab === null && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              marginBottom: "50px",
            }}
          >
            <div
              className="card"
              onClick={() => setActiveTab("pharmacy")}
              style={{ cursor: "pointer" }}
            >
              <h3>🏪 Pharmacy Management</h3>
              <p>Manage medicine inventory and stock.</p>
              <button>Open</button>
            </div>

            <div
              className="card"
              onClick={() => setActiveTab("user")}
              style={{ cursor: "pointer" }}
            >
              <h3>👤 Medicine Store</h3>
              <p>Browse medicines and place orders.</p>
              <button>Open</button>
            </div>

            <div
              className="card"
              onClick={() => setActiveTab("admin")}
              style={{ cursor: "pointer" }}
            >
              <h3>📊 Analytics</h3>
              <p>View reports, users and orders.</p>
              <button>Open</button>
            </div>

            <div
              className="card"
              onClick={() => setActiveTab("delivery")}
              style={{ cursor: "pointer" }}
            >
              <h3>🚚 Delivery Routes</h3>
              <p>Find optimized delivery paths.</p>
              <button>Open</button>
            </div>
          </div>
        )}

        {/* BACK BUTTON */}
        {activeTab !== null && (
          <button
            onClick={() => setActiveTab(null)}
            style={{
              marginBottom: "24px",
              background: "transparent",
              color: "#5fb3d5",
              border: "2px solid #5fb3d5",
              padding: "8px 16px",
            }}
          >
            ← Back To Dashboard
          </button>
        )}

        {/* MODULE RENDERING */}
        {activeTab === "pharmacy" && <PharmacyModule />}

        {activeTab === "user" && (
          <UserModule currentUser={currentUser} onLogin={handleUserLogin} />
        )}

        {activeTab === "admin" && <AdminModule />}

        {activeTab === "delivery" && <DeliveryModule />}
      </div>
    </div>
  );
}

export default App;
