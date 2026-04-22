import express from "express";
import { auth, authAdmin } from "../middleware/auth.js";
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
router.post("/", auth, authAdmin, createCategory);
router.patch("/:id", auth, authAdmin, updateCategory);
router.delete("/:id", auth, authAdmin, deleteCategory);

export default router;