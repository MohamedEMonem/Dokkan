import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import {
    register,
    login,
    getProfile,
    patchProfile,
    deleteAccount
} from "../controllers/authController.js";

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (authentication required)
router.get("/profile", auth, getProfile);
router.patch("/profile", auth, patchProfile);
router.delete("/profile", auth, deleteAccount);

export default router;
