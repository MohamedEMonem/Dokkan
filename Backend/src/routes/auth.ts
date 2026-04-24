import express from "express";
import { auth } from "../middleware/auth.js";
import { deleteAccount, getProfile, login, patchProfile, register } from "../modules/auth/auth.controller.js";
<<<<<<< HEAD

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

=======

const router = express.Router();

// Public auth endpoints
router.post("/register", register);
router.post("/login", login);

// Authenticated profile endpoints
>>>>>>> origin/dev
router.get("/profile", auth, getProfile);
router.patch("/profile", auth, patchProfile);
router.delete("/profile", auth, deleteAccount);

export default router;