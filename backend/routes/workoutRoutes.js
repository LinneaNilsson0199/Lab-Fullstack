const express = require("express");
const router = express.Router();

const {
  getAllWorkouts,
  getWorkoutsForUser,
  createWorkout,
  updateWorkout,
  deleteWorkout
} = require("../controllers/workoutController");

router.get("/", getAllWorkouts);
router.get("/:userId", getWorkoutsForUser);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

module.exports = router;