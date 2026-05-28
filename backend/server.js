const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ======================================
// MYSQL CONNECTION
// ======================================

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "monisha2902",
  database: "quickmeds",
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

// ======================================
// HOME
// ======================================

app.get("/", (req, res) => {
  res.send("QuickMeds Backend Running");
});

// ======================================
// REGISTER
// ======================================

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const checkSql = "SELECT * FROM users WHERE email=?";

  db.query(checkSql, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Database Error" });
    }

    if (result.length > 0) {
      return res.json({ success: false, message: "User already exists" });
    }

    const sql = "INSERT INTO users(name,email,password) VALUES(?,?,?)";

    db.query(sql, [name, email, password], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Registration Failed" });
      }

      res.json({
        success: true,
        message: "Registration Successful",
        data: { name, email },
      });
    });
  });
});

// ======================================
// LOGIN
// ======================================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Database Error" });
    }

    if (result.length > 0) {
      res.json({ success: true, message: "Login Successful", data: result[0] });
    } else {
      res.json({ success: false, message: "Invalid Email or Password" });
    }
  });
});

// ======================================
// ADD PHARMACY
// ======================================

app.post("/addPharmacy", (req, res) => {
  const { name } = req.body;

  const sql = "INSERT INTO pharmacies(name) VALUES(?)";

  db.query(sql, [name], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Error Adding Pharmacy" });
    }

    res.json({ success: true, message: "Pharmacy Added Successfully" });
  });
});

// ======================================
// ADD MEDICINE
// ======================================

app.post("/addMedicine", (req, res) => {
  const { pharmacyId, name, price, quantity } = req.body;

  const sql = `
    INSERT INTO medicines (pharmacyId, name, price, quantity)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [pharmacyId, name, price, quantity], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Error Adding Medicine" });
    }

    res.json({ success: true, message: "Medicine Added Successfully" });
  });
});

// ======================================
// GET MEDICINES
// ======================================

app.get("/medicines", (req, res) => {
  const sql = `
    SELECT medicines.*, pharmacies.name AS pharmacyName
    FROM medicines
    JOIN pharmacies ON medicines.pharmacyId = pharmacies.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });
});

// ======================================
// PLACE ORDER  ← FIXED
// ======================================

app.post("/placeOrder", (req, res) => {
  const { medicineName, quantity, userEmail } = req.body;

  // 1. CHECK MISSING DATA
  if (!medicineName || !quantity || !userEmail) {
    return res.json({ success: false, message: "Missing Order Data" });
  }

  const qty = Number(quantity);

  if (isNaN(qty) || qty <= 0) {
    return res.json({ success: false, message: "Invalid Quantity" });
  }

  // 2. GET USER ID FROM EMAIL
  const getUserSql = "SELECT id FROM users WHERE email = ?";

  db.query(getUserSql, [userEmail], (err, userResult) => {
    if (err) {
      console.log("USER LOOKUP ERROR:", err);
      return res.json({
        success: false,
        message: "Database Error: " + err.message,
      });
    }

    if (userResult.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const userId = userResult[0].id;

    // 3. GET MEDICINE PRICE & STOCK
    const getMedSql = "SELECT * FROM medicines WHERE name = ? LIMIT 1";

    db.query(getMedSql, [medicineName], (err, medResult) => {
      if (err) {
        console.log("MEDICINE LOOKUP ERROR:", err);
        return res.json({
          success: false,
          message: "Database Error: " + err.message,
        });
      }

      if (medResult.length === 0) {
        return res.json({ success: false, message: "Medicine not found" });
      }

      const medicine = medResult[0];

      // 4. CHECK STOCK
      if (medicine.quantity < qty) {
        return res.json({
          success: false,
          message: `Insufficient stock. Only ${medicine.quantity} units available.`,
        });
      }

      const price = medicine.price;
      const totalPrice = qty * price;

      // 5. INSERT ORDER
      const orderSql = `
        INSERT INTO orders
          (userId, email, medicineName, quantity, price, totalPrice, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userId,
        userEmail,
        medicineName,
        qty,
        price,
        totalPrice,
        "Pending",
      ];

      db.query(orderSql, values, (err, orderResult) => {
        if (err) {
          console.log("ORDER INSERT ERROR:", err);
          return res.json({
            success: false,
            message: "Order Failed: " + err.message,
          });
        }

        // 6. REDUCE MEDICINE STOCK
        const updateStockSql =
          "UPDATE medicines SET quantity = quantity - ? WHERE name = ?";

        db.query(updateStockSql, [qty, medicineName], (err) => {
          if (err) {
            console.log("STOCK UPDATE ERROR:", err);
          }

          res.json({ success: true, message: "Order Placed Successfully" });
        });
      });
    });
  });
});

// ======================================
// GET ORDERS (for user)
// ======================================

app.get("/myOrders", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.json({ success: false, message: "Email required" });
  }

  const sql = "SELECT * FROM orders WHERE email = ? ORDER BY id DESC";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Database Error" });
    }

    res.json({ success: true, data: result });
  });
});

// ======================================
// ANALYTICS
// ======================================

app.get("/analytics", (req, res) => {
  const usersSql = "SELECT COUNT(*) AS totalUsers FROM users";
  const medicinesSql = "SELECT COUNT(*) AS totalMedicines FROM medicines";
  const pharmaciesSql = "SELECT COUNT(*) AS totalPharmacies FROM pharmacies";
  const ordersSql = "SELECT COUNT(*) AS totalOrders FROM orders";

  db.query(usersSql, (err1, usersResult) => {
    if (err1) {
      console.log(err1);
      return res.json({ success: false });
    }

    db.query(medicinesSql, (err2, medicinesResult) => {
      if (err2) {
        console.log(err2);
        return res.json({ success: false });
      }

      db.query(pharmaciesSql, (err3, pharmaciesResult) => {
        if (err3) {
          console.log(err3);
          return res.json({ success: false });
        }

        db.query(ordersSql, (err4, ordersResult) => {
          if (err4) {
            console.log(err4);
            return res.json({ success: false });
          }

          res.json({
            success: true,
            totalUsers: usersResult[0].totalUsers,
            totalMedicines: medicinesResult[0].totalMedicines,
            totalPharmacies: pharmaciesResult[0].totalPharmacies,
            totalOrders: ordersResult[0].totalOrders,
          });
        });
      });
    });
  });
});

// ======================================
// DELIVERY MODULE
// ======================================

app.get("/nearestPharmacy", (req, res) => {
  res.json({ success: true, pharmacy: { name: "Apollo Pharmacy" } });
});

// ======================================
// START SERVER
// ======================================

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});
