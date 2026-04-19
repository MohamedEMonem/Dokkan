import express from "express";
import {
	createProduct,
	deleteProduct,
	getProductById,
	listProducts,
	updateProduct,
} from "../controllers/ProductController.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export const productRoutes = router;
export default router;
