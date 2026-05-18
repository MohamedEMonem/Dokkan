import express from "express";
import {
  createStore,
  getUserStore,
  updateUser,
  deleteStore,
  listStores,
} from "../controllers/StoreController.js";
import { createStoreSchema, updatestoreSchema } from "../DTO/store.dto.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { auth, authStoreOwner } from "../middleware/auth.js";
const router = express.Router();

router.post(
  "/create",
  auth,

  validateBody(createStoreSchema),
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Create a new store'
     #swagger.description = 'Creates a new store for the authenticated user. Store owner role will be applied.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["name", "address"],
             properties: {
               name: { type: "string", example: "My Store" },
               description: { type: "string", example: "A store selling gadgets" },
               address: { type: "object", example: { street: "123 Main St", city: "Cairo" } }
             }
           }
         }
       }
     }
     #swagger.responses[201] = { description: 'Store created successfully' }
     #swagger.responses[400] = { description: 'Invalid request' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  createStore,
);

router.get(
  "/mystore",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Get store details'
     #swagger.description = 'Returns details for the authenticated user\'s store.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Store retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Store not found' }
  */
  getUserStore,
);

router.get(
  "/browse",
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Browse active stores with pagination'
     #swagger.description = 'List active stores with optional query params for page and limit.'
     #swagger.responses[200] = { description: 'Stores retrieved successfully' }
  */
  listStores,
);

router.put(
  "/update",
  auth,
  authStoreOwner,
  validateBody(updatestoreSchema),
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Update authenticated user\'s store'
     #swagger.description = 'Updates store fields for the authenticated store owner.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               name: { type: "string" },
               description: { type: "string" },
               address: { type: "object" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: 'Store updated successfully' }
     #swagger.responses[400] = { description: 'Invalid request' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Store not found' }
  */
  updateUser,
);

router.delete(
  "/delete",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Soft-delete the authenticated user\'s store'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  deleteStore,
);

export default router;
