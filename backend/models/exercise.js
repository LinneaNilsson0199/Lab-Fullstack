const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: String,
  muscleGroup: String
});

module.exports = mongoose.model("Exercise", exerciseSchema);