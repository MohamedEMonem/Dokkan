import express from "express";
import { auth, authAdmin } from "../middleware/auth.js";
import * as CategoryController from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/", CategoryController.listCategories);
router.get("/:id", CategoryController.getCategoryById);

router.use(auth);
router.use(authAdmin);

router.post("/", CategoryController.createCategory);
router.patch("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;