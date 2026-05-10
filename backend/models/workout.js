const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  exercises: [
    {
      name: {
        type: String,
        required: true
      },
      sets: {
        type: Number,
        required: true,
        min: 1,
        max: 10
      },
      reps: {
        type: Number,
        required: true,
        min: 1,
        max: 100
      }
    }
  ]
});

module.exports = mongoose.model("Workout", workoutSchema);