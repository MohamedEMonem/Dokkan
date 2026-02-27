const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
    register,
    login,
    getProfile,
    patchProfile,
    deleteAccount
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (authentication required)
router.get("/profile", auth, getProfile);
router.patch("/profile", auth, patchProfile);
router.delete("/profile", auth, deleteAccount);

module.exports = router;
