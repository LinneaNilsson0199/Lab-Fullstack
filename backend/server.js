require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
      "http://localhost:5175",
      "http://127.0.0.1:5175"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HOME
app.get("/", (req, res) => {
  res.send("Gym Tracker API is running");
});

// ROUTES
app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/workouts", workoutRoutes);

// FALLBACK ROUTE
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});