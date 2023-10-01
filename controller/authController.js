const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
// const { sendEmail } = require("./emailCtrl");
const crypto = require("crypto");

// Register or Add User
const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    // Create new user
    const newUser = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      mobile: mobile,
      password: password,
    });
    res.json(newUser);
  } else {
    throw new Error("User is already exist!");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check if user exist
  const findUser = await User.findOne({ email: email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);

    await User.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check if user exist
  const findAdmin = await User.findOne({ email: email });
  if (findAdmin.roles !== "admin") throw new Error("Not Authorized");

  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);

    await User.findByIdAndUpdate(
      findAdmin?._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Handle Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token Found");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with your refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken: accessToken });
  });
});

// Logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.status(204);
  }

  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  res.sendStatus(204);
});

// Get All Users
const getAllUser = asyncHandler(async (req, res) => {
  const foundUser = await User.find().populate("wishlist");

  if (foundUser) {
    res.json(foundUser);
  } else {
    throw new Error("No Users Found");
  }
});

// Get Specific User
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const foundUser = await User.findById({ _id: id });

  if (foundUser) {
    res.json(foundUser);
  } else {
    throw new Error("No User Found");
  }
});

// Update Specific User
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.userDetails;

  const userUpdate = await User.findByIdAndUpdate(
    id,
    {
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      email: req?.body?.email,
      mobile: req?.body?.mobile,
    },
    {
      new: true,
    }
  );

  if (userUpdate) {
    res.json({ updatedUser: userUpdate });
  } else {
    throw new Error("No User Found");
  }
});

// Delete Specific User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleteUser = await User.findByIdAndDelete({ _id: id });

  if (deleteUser) {
    res.json({ deletedUser: deleteUser });
  } else {
    throw new Error("No User Found");
  }
});

// Block Specific User
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );

    res.json({
      message: "User Blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock Specific User
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );

    res.json({
      message: "User Unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { _id } = req.userDetails;
  const { password } = req.body;

  const findUser = await User.findById({ _id });

  if (password) {
    findUser.password = password;
    const updatePassword = await findUser.save();

    res.json(updatePassword);
  } else {
    res.json(findUser);
  }
});

// const forgotPasswordToken = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("User not found with this email");
//   try {
//     const token = await user.createPasswordResetToken();
//     await user.save();
//     const resetURL = `Hi, Please follow this link to reset Your Password. This link will expire 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
//     const data = {
//       to: email,
//       text: "Hey User",
//       subject: "Forgot Password Link",
//       htm: resetURL,
//     };
//     sendEmail(data);
//     res.json(token);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.json(user);
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  changePassword,
  resetPassword,
  loginAdmin,
};
