const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // prevents duplicate emails
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 10,
    max: 100
  },
  weight: {
    type: Number,
    min: 30,
    max: 300
  }
}, {
  timestamps: true // adds createdAt & updatedAt
});

module.exports = mongoose.model("User", userSchema, "users");