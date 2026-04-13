import express from "express";
const router = express.Router();

import * as CategoryController from "../controllers/CategoryController.js";
import { auth, authAdmin } from "../middleware/auth.js";

router.get("/", CategoryController.getCategories);

router.use(auth);
router.use(authAdmin);

router.post("/", CategoryController.createCategory);
router.patch("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;