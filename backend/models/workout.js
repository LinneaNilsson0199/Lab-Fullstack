const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: Date,
  notes: String,
  exercises: [
    {
      exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise"
      },
      sets: Number,
      repetitions: Number,
      weight: Number
    }
  ]
});

module.exports = mongoose.model("Workout", workoutSchema);