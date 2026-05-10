import express from "express";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/ProductController.js";
import { auth, authStoreOwner } from "../middleware/auth.js";
import {upload} from "../middleware/uploadValidator.js";
import { validateBody } from "../middleware/validate.middleware.js"
import {productSchema,updateProductSchema} from "../DTO/product.dto.js";


const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProductById);
router.post("/", auth, authStoreOwner,upload.single("image"),validateBody(productSchema), createProduct);
router.patch("/:id", auth,authStoreOwner ,validateBody(updateProductSchema),updateProduct);
router.delete("/:id",auth, authStoreOwner, deleteProduct);

export const productRoutes = router;
export default router;