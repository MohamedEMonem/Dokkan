import express from "express";
import { authAdmin } from "../middleware/auth.js";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/", listCategories);
router.get("/:id", getCategoryById);
router.post("/", authAdmin, createCategory);
router.patch("/:id", authAdmin, updateCategory);
router.delete("/:id", authAdmin, deleteCategory);

export default router;