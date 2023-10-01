const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userDetails = await User.findById(decoded?.id);
        req.userDetails = userDetails;
        next();
      } else {
      }
    } catch (error) {
      throw new Error("Not Authorized: Token Expired, Please Login Again");
    }
  } else {
    throw new Error("No Token Found");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.userDetails;

  const adminUser = await User.findOne({ email: email });

  if (adminUser.roles !== "admin") {
    throw new Error("Only Admin can do this request!");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
