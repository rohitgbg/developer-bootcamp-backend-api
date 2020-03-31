const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./async");
const User = require("../models/User");

// Protect Routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists

  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 400));
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRETE);

    req.user = await User.findById(decode.id);

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 400));
  }
});

exports.autorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not autorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
