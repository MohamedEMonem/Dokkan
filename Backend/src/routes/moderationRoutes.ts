import express from "express";
import { auth, authAdmin } from "../middleware/auth.js";
import {
  createFlag,
  listFlags,
  getFlagById,
  updateFlagStatus,
  adminRemoveProduct,
  adminRemoveStore,
  adminRemoveProductReview,
  adminRemoveStoreReview,
  adminRestoreProduct,
  adminRestoreStore,
  adminRestoreProductReview,
  adminRestoreStoreReview,
  adminUpdateStoreStatus,
} from "../controllers/ModerationController.js";
import {
  adminListUsers,
  adminDeleteUser,
} from "../controllers/AdminUserController.js";

//  Customer-facing routes: /api/moderation 

export const moderationRoutes = express.Router();

moderationRoutes.post(
  "/flag",
  auth,
  /* #swagger.tags = ['Moderation']
     #swagger.summary = 'Flag content for moderation'
     #swagger.description = 'Allows an authenticated customer to report a product, store, or review with a reason.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["targetType", "targetId", "reason"],
             properties: {
               targetType: { type: "string", enum: ["PRODUCT", "STORE", "PRODUCT_REVIEW", "STORE_REVIEW"], example: "PRODUCT" },
               targetId: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
               reason: { type: "string", example: "This product listing contains misleading information" }
             }
           }
         }
       }
     }
     #swagger.responses[201] = { description: 'Content flagged successfully' }
     #swagger.responses[400] = { description: 'Invalid request' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Target not found' }
     #swagger.responses[409] = { description: 'Duplicate pending flag' }
  */
  createFlag,
);

//  Admin-facing routes: /api/admin 

export const adminRoutes = express.Router();

adminRoutes.get(
  "/flags",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Moderation']
     #swagger.summary = 'List all flagged items'
     #swagger.description = 'Retrieve a paginated list of all flagged items. Super Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, example: 1 }
     #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, example: 20 }
     #swagger.parameters['status'] = { in: 'query', type: 'string', required: false, enum: ['PENDING', 'RESOLVED', 'DISMISSED'], example: 'PENDING' }
     #swagger.parameters['targetType'] = { in: 'query', type: 'string', required: false, enum: ['PRODUCT', 'STORE', 'PRODUCT_REVIEW', 'STORE_REVIEW'] }
     #swagger.responses[200] = { description: 'Flags retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[403] = { description: 'Forbidden - Admin only' }
  */
  listFlags,
);

adminRoutes.get(
  "/flags/:flagId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Moderation']
     #swagger.summary = 'Get a single flag by ID'
     #swagger.description = 'Retrieve details of a specific flag. Super Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['flagId'] = { in: 'path', type: 'string', required: true, description: 'Flag UUID' }
     #swagger.responses[200] = { description: 'Flag retrieved successfully' }
     #swagger.responses[404] = { description: 'Flag not found' }
  */
  getFlagById,
);

adminRoutes.put(
  "/flags/:flagId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Moderation']
     #swagger.summary = 'Update flag status'
     #swagger.description = 'Update the status of a moderation flag (PENDING, RESOLVED, DISMISSED). Super Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['flagId'] = { in: 'path', type: 'string', required: true, description: 'Flag UUID' }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["status"],
             properties: {
               status: { type: "string", enum: ["PENDING", "RESOLVED", "DISMISSED"], example: "RESOLVED" },
               adminNote: { type: "string", example: "Violation confirmed, content removed." }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: 'Flag status updated successfully' }
     #swagger.responses[404] = { description: 'Flag not found' }
  */
  updateFlagStatus,
);

adminRoutes.delete(
  "/products/:productId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Moderation']
     #swagger.summary = 'Remove a product'
     #swagger.description = 'Soft-delete a product and auto-resolve all pending flags on it. Super Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['productId'] = { in: 'path', type: 'string', required: true, description: 'Product UUID' }
     #swagger.responses[200] = { description: 'Product removed successfully' }
     #swagger.responses[404] = { description: 'Product not found' }
  */
  adminRemoveProduct,
);

adminRoutes.delete(
  "/stores/:storeId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Moderation']
     #swagger.summary = 'Remove a store'
     #swagger.description = 'Suspend and soft-delete a store, auto-resolving all pending flags. Super Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['storeId'] = { in: 'path', type: 'string', required: true, description: 'Store UUID' }
     #swagger.responses[200] = { description: 'Store removed successfully' }
     #swagger.responses[404] = { description: 'Store not found' }
  */
  adminRemoveStore,
);

adminRoutes.delete(
  "/reviews/product/:reviewId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Moderation']
     #swagger.summary = 'Remove a product review'
     #swagger.description = 'Hard-delete a product review, recalculate ratings, and auto-resolve pending flags. Super Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['reviewId'] = { in: 'path', type: 'string', required: true, description: 'Product Review UUID' }
     #swagger.responses[200] = { description: 'Product review removed successfully' }
     #swagger.responses[404] = { description: 'Review not found' }
  */
  adminRemoveProductReview,
);

adminRoutes.delete(
  "/reviews/store/:reviewId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Moderation']
     #swagger.summary = 'Remove a store review'
     #swagger.description = 'Hard-delete a store review, recalculate ratings, and auto-resolve pending flags. Super Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['reviewId'] = { in: 'path', type: 'string', required: true, description: 'Store Review UUID' }
     #swagger.responses[200] = { description: 'Store review removed successfully' }
     #swagger.responses[404] = { description: 'Review not found' }
  */
  adminRemoveStoreReview,
);

adminRoutes.post(
  "/restore/product/:productId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Restore']
     #swagger.summary = 'Restore a product'
  */
  adminRestoreProduct,
);

adminRoutes.post(
  "/restore/store/:storeId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Restore']
     #swagger.summary = 'Restore a store'
  */
  adminRestoreStore,
);

adminRoutes.post(
  "/restore/review/product/:reviewId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Restore']
     #swagger.summary = 'Restore a product review'
  */
  adminRestoreProductReview,
);

adminRoutes.post(
  "/restore/review/store/:reviewId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Restore']
     #swagger.summary = 'Restore a store review'
  */
  adminRestoreStoreReview,
);

// ── Admin: User Management ───────────────────────────────────────────────── //

adminRoutes.get(
  "/users",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Users']
     #swagger.summary = 'List all platform users'
     #swagger.description = 'Retrieve a paginated list of all registered users. Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['page']   = { in: 'query', type: 'integer', example: 1 }
     #swagger.parameters['limit']  = { in: 'query', type: 'integer', example: 20 }
     #swagger.parameters['role']   = { in: 'query', type: 'string', enum: ['Customer', 'StoreOwner', 'Admin'] }
     #swagger.parameters['search'] = { in: 'query', type: 'string', description: 'Search by name or email' }
     #swagger.parameters['sortBy'] = { in: 'query', type: 'string', enum: ['createdAt', 'name', 'email'] }
     #swagger.parameters['sortDir']= { in: 'query', type: 'string', enum: ['asc', 'desc'] }
     #swagger.responses[200] = { description: 'Users retrieved successfully' }
     #swagger.responses[403] = { description: 'Admin only' }
  */
  adminListUsers,
);

adminRoutes.delete(
  "/users/:userId",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Users']
     #swagger.summary = 'Delete a user account'
     #swagger.description = 'Soft-delete a user account by ID. Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['userId'] = { in: 'path', type: 'string', required: true }
     #swagger.responses[200] = { description: 'User deleted successfully' }
     #swagger.responses[403] = { description: 'Admin only' }
     #swagger.responses[404] = { description: 'User not found' }
  */
  adminDeleteUser,
);

// ── Admin: Store Status Management ───────────────────────────────────────── //

adminRoutes.patch(
  "/stores/:storeId/status",
  auth,
  authAdmin,
  /* #swagger.tags = ['Admin - Stores']
     #swagger.summary = 'Update store status'
     #swagger.description = 'Update store status (Pending/Active/Suspended). Admin only.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['storeId'] = { in: 'path', type: 'string', required: true }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["status"],
             properties: {
               status: { type: "string", enum: ["Pending", "Active", "Suspended"], example: "Active" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: 'Store status updated successfully' }
     #swagger.responses[400] = { description: 'Invalid status' }
     #swagger.responses[403] = { description: 'Admin only' }
     #swagger.responses[404] = { description: 'Store not found' }
  */
  adminUpdateStoreStatus,
);
