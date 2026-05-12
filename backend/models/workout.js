const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      required: false
    },

    exercises: [
      {
        exerciseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise"
        },

        name: {
          type: String,
          required: true,
          trim: true
        },

        sets: {
          type: Number,
          required: true,
          min: 1,
          max: 100
        },

        reps: {
          type: Number,
          required: true,
          min: 1,
          max: 100
        },

        weight: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Workout", workoutSchema);