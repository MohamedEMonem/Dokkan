import express from "express";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/ProductController.js";
import { auth, authStoreOwner, authOptional } from "../middleware/auth.js";
import {upload} from "../middleware/uploadValidator.js";
import { validateBody } from "../middleware/validate.middleware.js"
import {productSchema,updateProductSchema} from "../DTO/product.dto.js";

const router = express.Router({ mergeParams: true });

router.get("/", 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'List all products'
     #swagger.description = 'Returns a paginated list of products with optional status and sort filters.'
     #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, example: 1, description: 'Page number' }
     #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, example: 20, description: 'Items per page' }
     #swagger.parameters['status'] = { in: 'query', type: 'string', required: false, example: 'Active', description: 'Filter by product status' }
     #swagger.parameters['sortBy'] = { in: 'query', type: 'string', required: false, example: 'createdAt', description: 'Sort field' }
     #swagger.parameters['sortDir'] = { in: 'query', type: 'string', required: false, example: 'desc', description: 'Sort direction' }
     #swagger.responses[200] = { description: 'Products retrieved successfully' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authOptional,
  listProducts
);


router.get("/:id", 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Get product by ID'
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: 'b7f4e7d5-0d4d-4e5d-9c9c-0f4b8d7c4d11', description: 'Product UUID' }
     #swagger.responses[200] = { description: 'Product retrieved successfully' }
     #swagger.responses[404] = { description: 'Product not found' }
  */
  authOptional,
  getProductById
);

router.post("/", auth, authStoreOwner, upload.single("image"), validateBody(productSchema), 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Create a product (Store Owner only)'
     #swagger.description = 'Creates a new product. Use multipart/form-data to upload an image file under field `image`.'
     #swagger.consumes = ['multipart/form-data']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "multipart/form-data": {
           schema: {
             type: "object",
             required: ["storeId", "subCategoryId", "title", "price"],
             properties: {
               storeId: { type: "string", format: "uuid", example: "1b3b0de0-b3f7-4d17-9df1-c1b3d31a3fd0" },
               subCategoryId: { type: "string", format: "uuid", example: "2c4a1e18-38f5-4d17-b8a0-0a3d4c15cf66" },
               title: { type: "string", example: "Summer Tee" },
               description: { type: "string", example: "Comfortable cotton t-shirt" },
               price: { type: "number", example: 29.99 },
               stockQuantity: { type: "integer", example: 100 },
               status: { type: "string", enum: ["Active", "Inactive"], example: "Active" },
               image: { type: "string", format: "binary", description: 'Product image file' }
             }
           }
         }
       }
     }
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
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: 'b7f4e7d5-0d4d-4e5d-9c9c-0f4b8d7c4d11', description: 'Product UUID' }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               title: { type: "string" },
               description: { type: "string" },
               subCategoryId: { type: "string", format: "uuid" },
               price: { type: "number" },
               stockQuantity: { type: "integer" },
               status: { type: "string", enum: ["Active", "Inactive"] }
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
    #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: 'b7f4e7d5-0d4d-4e5d-9c9c-0f4b8d7c4d11', description: 'Product UUID' }
     #swagger.responses[200] = { description: 'Product deleted successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Product not found' }
  */
  deleteProduct
);

export const productRoutes = router;
export default router;