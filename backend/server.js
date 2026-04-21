require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Exercise = require("./models/Exercise");
const Workout = require("./models/Workout");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  res.send("Gym Tracker API is running");
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Remove password before sending user back
    const { password: _, ...safeUser } = user._doc;

    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, weight } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      weight
    });

    const savedUser = await newUser.save();

    // Remove password before sending back
    const { password: _, ...safeUser } = savedUser._doc;

    res.status(201).json(safeUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER BY ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE USER
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    const safeUser = await User.findById(savedUser._id).select("-password");
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL EXERCISES
app.get("/exercises", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET EXERCISE BY ID
app.get("/exercises/:id", async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE EXERCISE
app.post("/exercises", async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL WORKOUTS
app.get("/workouts", async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate("userId", "-password")
      .populate("exercises.exerciseId");

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET WORKOUT BY ID
app.get("/workouts/:id", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate("userId", "-password")
      .populate("exercises.exerciseId");

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE WORKOUT
app.post("/workouts", async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});