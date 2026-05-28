const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "monisha2902",
  database: "quickmeds",
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Connected");
  }
});

module.exports = db;
