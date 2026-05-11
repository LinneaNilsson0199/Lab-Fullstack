const bcrypt = require("bcrypt");
const User = require("../models/user");
const { isValidId, handleServerError } = require("../utils/errorHelpers");

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function getUserById(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function updateUser(req, res) {
  try {
    const { age, weight } = req.body;

    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    if (age === undefined || weight === undefined) {
      return res.status(400).json({
        message: "Age and weight are required"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        age: Number(age),
        weight: Number(weight)
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(updatedUser);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, age, weight } = req.body;

    if (!name || !email || !password || !age || !weight) {
      return res.status(400).json({
        message: "Name, email, password, age, and weight are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age: Number(age),
      weight: Number(weight)
    });

    const savedUser = await newUser.save();

    const safeUser = await User.findById(savedUser._id).select("-password");

    res.status(201).json(safeUser);
  } catch (error) {
    handleServerError(res, error);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  createUser
};