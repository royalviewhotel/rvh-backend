const express = require("express");
const {
  createUser,
  loginUser,
  getUser,
  getAllUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  changePassword,
  resetPassword,
  loginAdmin,
} = require("../controller/authController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.put("/reset-password/:token", resetPassword);
router.put("/change-password", authMiddleware, changePassword);
router.get("/refresh-token", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.get("/", authMiddleware, isAdmin, getAllUser);
router.delete("/:id", deleteUser);
router.put("/update-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
