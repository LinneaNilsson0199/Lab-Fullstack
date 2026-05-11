const bcrypt = require("bcrypt");
const User = require("../models/user");
const { handleServerError } = require("../utils/errorHelpers");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const { password: _, ...safeUser } = user._doc;

    res.json(safeUser);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function register(req, res) {
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

    const { password: _, ...safeUser } = savedUser._doc;

    res.status(201).json(safeUser);
  } catch (error) {
    handleServerError(res, error);
  }
}

module.exports = {
  login,
  register
};