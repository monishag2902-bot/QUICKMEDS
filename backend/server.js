const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let medicines = [];

// ADD
app.post("/addMedicine", (req, res) => {
  const { name, price } = req.body;

  console.log("DATA RECEIVED:", req.body); // 👈 DEBUG

  if (!name || !price) {
    return res.status(400).send("Missing data");
  }

  medicines.push({
    name,
    price: Number(price),
  });

  res.send("Medicine Added");
});

// GET
app.get("/medicines", (req, res) => {
  res.json(medicines);
});

// SEARCH
app.get("/search/:name", (req, res) => {
  const names = medicines.map((m) => m.name);

  if (names.includes(req.params.name)) {
    res.send("Medicine Found");
  } else {
    res.send("Not Found");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
