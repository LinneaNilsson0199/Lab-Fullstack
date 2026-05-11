const Exercise = require("../models/exercise");
const { isValidId, handleServerError } = require("../utils/errorHelpers");

async function getAllExercises(req, res) {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function getExerciseById(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid exercise ID"
      });
    }

    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        message: "Exercise not found"
      });
    }

    res.json(exercise);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function createExercise(req, res) {
  try {
    const { name, muscleGroup, equipment } = req.body;

    if (!name || !muscleGroup || !equipment) {
      return res.status(400).json({
        message: "Exercise name, muscle group, and equipment are required"
      });
    }

    const newExercise = new Exercise({
      name,
      muscleGroup,
      equipment
    });

    const savedExercise = await newExercise.save();

    res.status(201).json(savedExercise);
  } catch (error) {
    handleServerError(res, error);
  }
}

module.exports = {
  getAllExercises,
  getExerciseById,
  createExercise
};