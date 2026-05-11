const User = require("../models/user");
const Workout = require("../models/workout");
const { isValidId, handleServerError } = require("../utils/errorHelpers");

async function getAllWorkouts(req, res) {
  try {
    const workouts = await Workout.find()
      .populate("userId", "-password")
      .sort({ date: -1 });

    res.json(workouts);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function getWorkoutsForUser(req, res) {
  try {
    if (!isValidId(req.params.userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userExists = await User.findById(req.params.userId);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const workouts = await Workout.find({
      userId: req.params.userId
    }).sort({ date: -1 });

    res.json(workouts);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function createWorkout(req, res) {
  try {
    const { userId, name, date, exercises } = req.body;

    if (!userId || !name || !date || !exercises || exercises.length === 0) {
      return res.status(400).json({
        message: "User ID, workout name, date, and exercises are required"
      });
    }

    if (!isValidId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedExercises = exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      sets: Number(exercise.sets),
      reps: Number(exercise.reps),
      weight: Number(exercise.weight)
    }));

    const newWorkout = new Workout({
      userId,
      name,
      date,
      exercises: formattedExercises
    });

    const savedWorkout = await newWorkout.save();

    res.status(201).json(savedWorkout);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function updateWorkout(req, res) {
  try {
    const { name, date, exercises } = req.body;

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid workout ID" });
    }

    if (!name || !date || !exercises || exercises.length === 0) {
      return res.status(400).json({
        message: "Workout name, date, and exercises are required"
      });
    }

    const formattedExercises = exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      sets: Number(exercise.sets),
      reps: Number(exercise.reps),
      weight: Number(exercise.weight)
    }));

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        name,
        date,
        exercises: formattedExercises
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(updatedWorkout);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function deleteWorkout(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid workout ID" });
    }

    const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);

    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
}

module.exports = {
  getAllWorkouts,
  getWorkoutsForUser,
  createWorkout,
  updateWorkout,
  deleteWorkout
};