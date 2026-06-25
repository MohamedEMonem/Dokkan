import express from "express";
import { auth, authAdmin } from "../middleware/auth.js";
import * as CategoryController from "../controllers/CategoryController.js";

const router = express.Router({ mergeParams: true });

router.get("/", 
  /* #swagger.tags = ['Categories']
    #swagger.summary = 'List all categories'
    #swagger.description = 'Returns the categories available in the current store. Supports filtering by parent category to list subcategories.'
    #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, example: 1 }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, example: 20 }
    #swagger.parameters['parentCategoryId'] = { in: 'query', type: 'string', required: false, example: 'b7f4e7d5-0d4d-4e5d-9c9c-0f4b8d7c4d11' }
    #swagger.responses[200] = { description: 'Categories retrieved successfully' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  CategoryController.listCategories
);

router.get("/:id", 
  /* #swagger.tags = ['Categories']
    #swagger.summary = 'Get category by ID'
    #swagger.description = 'Retrieves a single category by its unique identifier.'
    #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: 'b7f4e7d5-0d4d-4e5d-9c9c-0f4b8d7c4d11' }
    #swagger.responses[200] = { description: 'Category retrieved successfully' }
    #swagger.responses[404] = { description: 'Category not found' }
  */
  CategoryController.getCategoryById
);

router.use(auth);
router.use(authAdmin);

router.post("/", 
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Create a category (Admin only)'
     #swagger.description = 'Creates a new product category or subcategory. Admin access required.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["name"],
             properties: {
               name: { type: "string", example: "Electronics" },
               parentCategoryId: { type: "string", format: "uuid", example: "b7f4e7d5-0d4d-4e5d-9c9c-0f4b8d7c4d11", nullable: true }
             }
           }
         }
       }
     }
     #swagger.responses[201] = { description: 'Category created successfully' }
     #swagger.responses[400] = { description: 'Invalid request' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  CategoryController.createCategory
);

router.patch("/:id", 
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Update a category (Admin only)'
     #swagger.description = 'Updates category fields by ID. Admin access required.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               name: { type: "string", example: "Updated Name" },
               parentCategoryId: { type: "string", format: "uuid", example: "b7f4e7d5-0d4d-4e5d-9c9c-0f4b8d7c4d11", nullable: true }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: 'Category updated successfully' }
     #swagger.responses[400] = { description: 'Invalid request' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Category not found' }
  */
  CategoryController.updateCategory
);

router.delete("/:id", 
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Delete a category (Admin only)'
     #swagger.description = 'Soft-deletes a category by ID. Admin access required.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Category deleted successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Category not found' }
  */
  CategoryController.deleteCategory
);

export default router;