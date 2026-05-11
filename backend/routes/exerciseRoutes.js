const express = require("express");
const router = express.Router();

const {
  getAllExercises,
  getExerciseById,
  createExercise
} = require("../controllers/exerciseController");

router.get("/", getAllExercises);
router.get("/:id", getExerciseById);
router.post("/", createExercise);

module.exports = router;