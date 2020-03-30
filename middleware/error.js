const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = {
    ...err
  };

  error.message = err.message;

  console.log("ERRor", err);

  // if id not found
  if (err.name === "CastError") {
    error = new ErrorResponse(`Resource not found with id ${err.value}`, 404);
  }

  // duplicate field error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  //mongoose field validation error [required]
  if (err.name === "ValidatorError" || err.errors) {
    const message = Object.values(err.errors).map(val => val.message);
    console.log("error name", err.name);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
};

module.exports = errorHandler;
