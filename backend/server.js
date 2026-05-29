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
// GET USERS
// ======================================

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

      return res.json([]);
    }

    res.json(result);
  });
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

      return res.json({
        success: false,
        message: "Database error",
      });
    }

    if (result.length > 0) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const sql = "INSERT INTO users(name,email,password) VALUES(?,?,?)";

    db.query(sql, [name, email, password], (err, result) => {
      if (err) {
        console.log(err);

        return res.json({
          success: false,
          message: "Registration failed",
        });
      }

      res.json({
        success: true,
        message: "Registration successful",

        data: {
          name,
          email,
        },
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

      return res.json({
        success: false,
        message: "Database error",
      });
    }

    if (result.length > 0) {
      res.json({
        success: true,
        message: "Login successful",
        data: result[0],
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  });
});

// ======================================
// GET PHARMACIES
// ======================================

app.get("/pharmacies", (req, res) => {
  const sql = `
    SELECT
      pharmacies.id,
      pharmacies.name,
      medicines.id AS medicineId,
      medicines.name AS medicineName,
      medicines.price,
      medicines.quantity

    FROM pharmacies

    LEFT JOIN medicines
    ON pharmacies.id = medicines.pharmacyId
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("PHARMACY FETCH ERROR:", err);

      return res.json([]);
    }

    const pharmaciesMap = {};

    result.forEach((row) => {
      if (!pharmaciesMap[row.id]) {
        pharmaciesMap[row.id] = {
          id: row.id,
          name: row.name,
          medicines: [],
        };
      }

      if (row.medicineId) {
        pharmaciesMap[row.id].medicines.push({
          id: row.medicineId,
          name: row.medicineName,
          price: row.price,
          quantity: row.quantity,
        });
      }
    });

    res.json(Object.values(pharmaciesMap));
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

      return res.json({
        success: false,
        message: "Error adding pharmacy",
      });
    }

    res.json({
      success: true,
      message: "Pharmacy added successfully",
    });
  });
});

// ======================================
// ADD MEDICINE
// ======================================

app.post("/addMedicine", (req, res) => {
  const { pharmacyId, name, price, quantity } = req.body;

  const sql = `
    INSERT INTO medicines
    (pharmacyId,name,price,quantity)
    VALUES(?,?,?,?)
  `;

  db.query(sql, [pharmacyId, name, price, quantity], (err, result) => {
    if (err) {
      console.log(err);

      return res.json({
        success: false,
        message: "Error adding medicine",
      });
    }

    res.json({
      success: true,
      message: "Medicine added successfully",
    });
  });
});

// ======================================
// GET MEDICINES
// ======================================

app.get("/medicines", (req, res) => {
  const sql = `
    SELECT medicines.*,
           pharmacies.name AS pharmacyName

    FROM medicines

    JOIN pharmacies
    ON medicines.pharmacyId = pharmacies.id
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
// PLACE ORDER
// ======================================

app.post("/placeOrder", (req, res) => {
  const { medicineName, quantity, userEmail } = req.body;

  const price = 100;

  const totalPrice = Number(quantity) * price;

  const sql = `
    INSERT INTO orders
    (userId, email, medicineName, quantity, price, totalPrice, status)

    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    1,
    userEmail,
    medicineName,
    Number(quantity),
    price,
    totalPrice,
    "Pending",
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("ORDER ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Order Failed",
      });
    }

    res.json({
      success: true,
      message: "Order placed successfully",
    });
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

      return res.status(500).json({
        success: false,
        message: "Users query failed",
      });
    }

    db.query(medicinesSql, (err2, medicinesResult) => {
      if (err2) {
        console.log(err2);

        return res.status(500).json({
          success: false,
          message: "Medicines query failed",
        });
      }

      db.query(pharmaciesSql, (err3, pharmaciesResult) => {
        if (err3) {
          console.log(err3);

          return res.status(500).json({
            success: false,
            message: "Pharmacies query failed",
          });
        }

        db.query(ordersSql, (err4, ordersResult) => {
          if (err4) {
            console.log(err4);

            return res.status(500).json({
              success: false,
              message: "Orders query failed",
            });
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
// DELIVERY ROUTE
// ======================================

app.get("/nearestPharmacy", (req, res) => {
  res.json({
    success: true,

    pharmacy: {
      name: "Apollo Pharmacy",
    },
  });
});

// ======================================
// START SERVER
// ======================================

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});
