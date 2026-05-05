import express from "express";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/ProductController.js";
import { auth, authStoreOwner } from "../middleware/auth.js";
import {upload} from "../middleware/uploadValidator.js";
import { validateBody } from "../middleware/validate.middleware.js"
import {productSchema,updateProductSchema} from "../DTO/product.dto.js";

const router = express.Router({ mergeParams: true });

router.get("/", 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'List all products'
  */
  listProducts
);

router.get("/:id", 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Get product by ID'
  */
  getProductById
);

router.post("/", auth, authStoreOwner, upload.single("image"), validateBody(productSchema), 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Create a product (Store Owner only)'
     #swagger.consumes = ['multipart/form-data']
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  createProduct
);

router.patch("/:id", auth, authStoreOwner, validateBody(updateProductSchema), 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Update a product (Store Owner only)'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  updateProduct
);

router.delete("/:id", auth, authStoreOwner, 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Delete a product (Store Owner only)'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  deleteProduct
);

export const productRoutes = router;
export default router;