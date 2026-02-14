const express = require("express");
const router = express.Router();
const { 
  auth, 
} = require("../middleware/auth");


const {
 register,
} = require("../controllers/authController");

router.use("/booking",auth, bookingRoutes);
router.use("/dashboard",auth, authAdmin, DashboardRoutes);

// Public routes (no authentication required)
router.post("/login", loginUser);
router.post("/signup", createUser);

// Invite-based routes (no authentication required for verification and signup)
router.post("/verify-invite", verifyInvite);
router.post("/signup-with-invite", signupWithInvite);

// Protected routes requiring authentication
// GET /users/me - Get current authenticated user info
router.get("/me", auth, getCurrentUser);

// User-specific routes with proper authorization
// GET /users/:id - Get a single user by ID (user can access own data, admin can access any)
router.get("/:id", auth, getUserById);

// PUT /users/:id - Update a user by ID (user can update own data, admin/owner can update any)
router.put("/:id", auth, updateUser);

// PATCH /users/:id - Partially update a user by ID (user can patch own data, admin/owner can patch any)
router.patch("/:id", auth, patchUser);

// DELETE /users/:id - Delete a user by ID (user can delete own account, admin/owner can delete any)
router.delete("/:id", auth, deleteUser);

// Token management routes
// POST /users/logout - Log out current user (blacklist current token)
router.post("/logout", auth, logoutUser);

// POST /users/logout-all - Log out from all devices (self or admin for others)
router.post("/logout-all", auth, logoutAllDevices);
router.post("/logout-all/:id", auth, authAdmin, logoutAllDevices);

// Admin-only routes
// GET /users - Get all users (admin only)
// router.get("/", auth, authAdmin, getAllUsers);//Moved to Dashboard.js

// GET /users/admin/stats - Get system statistics (admin only)

// GET /users/admin/token-stats - Get token blacklist statistics (admin only)
router.get("/admin/token-stats", auth, authAdmin, getTokenStats);

// POST /users/admin/cleanup-tokens - Clean up expired tokens (admin only)
// POST /users/admin/invite - Create admin invite (admin only)
router.post("/admin/invite", auth, authAdmin, adminInvite);

module.exports = router;
