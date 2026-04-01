let medicines = [];
let users = [];
let orders = [];
let orderCounter = 1;

/* ================= USER MODULE ================= */

// Register
app.post("/register", (req, res) => {
const { name, email } = req.body;
  users.push({ name, email });
  res.send("User Registered");
  
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email required" });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.json({ message: "User Registered", user: newUser });
});

// Login
app.post("/login", (req, res) => {
const { email } = req.body;
const user = users.find((u) => u.email === email);

  if (user) res.send("Login Success");
  else res.status(400).send("User Not Found");
  if (user) {
    res.json({ message: "Login Success", user });
  } else {
    res.status(400).json({ error: "User Not Found" });
  }
});

/* ================= PHARMACY MODULE ================= */
@@ -40,6 +55,7 @@ app.post("/addMedicine", (req, res) => {
}

medicines.push({
    id: medicines.length + 1,
name,
price,
quantity: 10,
@@ -54,6 +70,50 @@ app.get("/medicines", (req, res) => {
res.json(medicines);
});

/* ================= ORDERS MODULE ================= */

// Place Order
app.post("/placeOrder", (req, res) => {
  const { userId, medicineId, quantity, email } = req.body;

  if (!userId || !medicineId || !quantity || !email) {
    return res.status(400).json({ error: "Missing order details" });
  }

  const medicine = medicines.find((m) => m.id === medicineId);
  if (!medicine) {
    return res.status(400).json({ error: "Medicine not found" });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const newOrder = {
    orderId: orderCounter++,
    userId,
    email,
    medicineId,
    medicineName: medicine.name,
    price: medicine.price,
    quantity,
    totalPrice: medicine.price * quantity,
    status: "Pending",
    timestamp: new Date(),
  };

  orders.push(newOrder);
  res.json({ message: "Order Placed", order: newOrder });
});

// Get User's Orders
app.get("/myOrders/:email", (req, res) => {
  const { email } = req.params;
  const userOrders = orders.filter((o) => o.email === email);
  res.json(userOrders);
});

/* ================= ADMIN MODULE ================= */

// View all users
@@ -66,6 +126,20 @@ app.get("/orders", (req, res) => {
res.json(orders);
});

// Get Analytics
app.get("/analytics", (req, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalUsers = users.length;

  res.json({
    totalOrders,
    totalRevenue,
    totalUsers,
    recentOrders: orders.slice(-5),
  });
});

/* ================= DELIVERY MODULE ================= */

// Dummy shortest path (Dijkstra concept)