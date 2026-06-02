import express from "express";
import {
  createStore,
  getOwnerStore,
  updateOwnerStore,
  deleteOwnerStore,
  listStores,
} from "../controllers/StoreController.js";
import { createStoreSchema, updatestoreSchema } from "../DTO/store.dto.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { auth, authStoreOwner } from "../middleware/auth.js";
import { getStoreAnalytics } from "../controllers/analytics.controller.js";
const router = express.Router();

router.post(
  "/",
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
             required: ["data"],
             properties: {
                data: {
                  type: "object",
                  required: ["name", "subdomain", "logoUrl"],
                  properties: {
                    name: { type: "string", example: "My Store" },
                    subdomain: { type: "string", example: "my-store" },
                    logoUrl: { type: "string", example: "https://cdn.example.com/logo.png" },
                    description: { type: "string", example: "A store selling gadgets" },
                    coverBannerUrl: { type: "string", example: "https://cdn.example.com/banner.png" },
                    businessAddress: { type: "string", example: "123 Main St, Cairo" },
                    vatNumber: { type: "string", example: "VAT-123456" },
                    supportEmail: { type: "string", format: "email", example: "support@example.com" },
                    phoneNumber: { type: "string", example: "+201234567890" }
                  }
                }
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
  "/me",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Get the authenticated owner\'s store'
     #swagger.description = 'Returns details for the authenticated user\'s store.'
     #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = { description: 'Store retrieved successfully' }
      #swagger.responses[401] = { description: 'Unauthorized' }
      #swagger.responses[404] = { description: 'Store not found' }
  */
  getOwnerStore,
);

router.get(
  "/",
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Browse active stores with pagination'
     #swagger.description = 'List stores with optional pagination, status filter, and sorting.'
     #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, example: 1 }
     #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, example: 20 }
     #swagger.parameters['status'] = { in: 'query', type: 'string', required: false, example: 'Active' }
     #swagger.parameters['sortBy'] = { in: 'query', type: 'string', required: false, example: 'createdAt' }
     #swagger.parameters['sortDir'] = { in: 'query', type: 'string', required: false, example: 'desc' }
     #swagger.responses[200] = { description: 'Stores retrieved successfully' }
  */
  listStores,
);

router.get(
  "/analytics",
  auth,
  authStoreOwner,
  getStoreAnalytics
);


router.put(
  "/me",
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
             required: ["data"],
             properties: {
               data: {
                 type: "object",
                 properties: {
                   name: { type: "string" },
                   subdomain: { type: "string" },
                   logoUrl: { type: "string" },
                   description: { type: "string" },
                   coverBannerUrl: { type: "string" },
                   businessAddress: { type: "string" },
                   vatNumber: { type: "string" },
                   supportEmail: { type: "string", format: "email" },
                   phoneNumber: { type: "string" }
                 }
               }
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
  updateOwnerStore,
);

router.delete(
  "/me",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Soft-delete the authenticated user\'s store'
     #swagger.security = [{ "bearerAuth": [] }] 
     #swagger.responses[200] = { description: 'Store deleted successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  deleteOwnerStore,
);


export default router;
