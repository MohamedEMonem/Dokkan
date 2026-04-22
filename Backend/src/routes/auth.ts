import express from "express";
import { auth } from "../middleware/auth.js";
import { deleteAccount, getProfile, login, patchProfile, register } from "../modules/auth/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", auth, getProfile);
router.patch("/profile", auth, patchProfile);
router.delete("/profile", auth, deleteAccount);

export default router;