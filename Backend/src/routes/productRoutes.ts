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
     #swagger.description = 'Returns a paginated list of products with optional status and sort filters.'
     #swagger.responses[200] = { description: 'Products retrieved successfully' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  listProducts
);


router.get("/:id", 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Get product by ID'
     #swagger.responses[200] = { description: 'Product retrieved successfully' }
     #swagger.responses[404] = { description: 'Product not found' }
  */
  getProductById
);

router.post("/", auth, authStoreOwner, upload.single("image"), validateBody(productSchema), 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Create a product (Store Owner only)'
     #swagger.description = 'Creates a new product. Use multipart/form-data to upload an image file under field `image`.'
     #swagger.consumes = ['multipart/form-data']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['product'] = {
       in: 'formData',
       description: 'Product fields',
       required: true,
       schema: {
         type: 'object',
         properties: {
           name: { type: 'string', example: 'T-Shirt' },
           price: { type: 'number', example: 29.99 },
           stock: { type: 'integer', example: 100 },
           description: { type: 'string', example: 'Comfortable cotton t-shirt' },
           categoryId: { type: 'string', example: 'cat_123' }
         }
       }
     }
     #swagger.parameters['image'] = { in: 'formData', type: 'file', description: 'Product image file' }
     #swagger.responses[201] = { description: 'Product created successfully' }
     #swagger.responses[400] = { description: 'Invalid request' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  createProduct
);

router.patch("/:id", auth, authStoreOwner, validateBody(updateProductSchema), 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Update a product (Store Owner only)'
     #swagger.description = 'Updates product fields by ID. Store owner access required.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               name: { type: "string" },
               price: { type: "number" },
               stock: { type: "integer" },
               description: { type: "string" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: 'Product updated successfully' }
     #swagger.responses[400] = { description: 'Invalid request' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Product not found' }
  */
  updateProduct
);

router.delete("/:id", auth, authStoreOwner, 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Delete a product (Store Owner only)'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Product deleted successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Product not found' }
  */
  deleteProduct
);

export const productRoutes = router;
export default router;