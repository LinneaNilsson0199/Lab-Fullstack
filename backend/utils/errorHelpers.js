const mongoose = require("mongoose");

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function handleServerError(res, error) {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: error.message
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value already exists"
    });
  }

  return res.status(500).json({
    message: error.message
  });
}

module.exports = {
  isValidId,
  handleServerError
};