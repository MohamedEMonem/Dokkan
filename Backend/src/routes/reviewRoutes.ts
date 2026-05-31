import express from "express";
import { auth, authStoreOwner } from "../middleware/auth.js";
import {
  createProductReview,
  getProductReviews,
  getProductReviewById,
  updateProductReview,
  deleteProductReview,
  replyToProductReview,
  createStoreReview,
  getStoreReviews,
  getStoreReviewById,
  updateStoreReview,
  deleteStoreReview,
  replyToStoreReview,
} from "../controllers/ReviewController.js";

const router = express.Router();

//  Product Reviews 

router.post(
  "/product",
  auth,
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Create a product review'
     #swagger.description = 'Creates a review for a product the user has purchased. Requires a delivered order containing the product.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["productId", "orderId", "rating"],
             properties: {
               productId: { type: "string", format: "uuid", example: "b7f4e7d5-0d4d-4e5d-9c9c-0f4b8d7c4d11" },
               orderId: { type: "string", format: "uuid", example: "c0e4d28d-7f4f-4d52-8b1f-7a7e0f1a9b2c" },
               rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
               reviewText: { type: "string", example: "Great quality and fast delivery." }
             }
           }
         }
       }
     }
  */
  createProductReview,
);

router.get(
  "/product/:productId",
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get reviews for a product'
     #swagger.description = 'Returns a paginated list of reviews for a specific product.'
     #swagger.parameters['productId'] = { in: 'path', type: 'string', required: true, example: 'b7f4e7d5-0d4d-4e5d-9c9c-0f4b8d7c4d11' }
     #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, example: 1 }
     #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, example: 20 }
     #swagger.parameters['sortBy'] = { in: 'query', type: 'string', required: false, example: 'createdAt' }
     #swagger.parameters['sortDir'] = { in: 'query', type: 'string', required: false, example: 'desc' }
  */
  getProductReviews,
);

router.get(
  "/product/detail/:id",
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get a single product review'
     #swagger.description = 'Returns a single product review by its ID.'
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: '1f3c8d3c-40d5-4b3d-a9c4-7e2d8f4f2d08' }
  */
  getProductReviewById,
);

router.put(
  "/product/:id",
  auth,
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Update a product review'
     #swagger.description = 'Updates the authenticated user\'s own product review.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: '1f3c8d3c-40d5-4b3d-a9c4-7e2d8f4f2d08' }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
               reviewText: { type: "string", example: "Updated review text." }
             }
           }
         }
       }
     }
  */
  updateProductReview,
);

router.delete(
  "/product/:id",
  auth,
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Delete a product review'
     #swagger.description = 'Deletes the authenticated user\'s own product review.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: '1f3c8d3c-40d5-4b3d-a9c4-7e2d8f4f2d08' }
  */
  deleteProductReview,
);

router.put(
  "/product/:id/reply",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Reply to a product review (Store Owner)'
     #swagger.description = 'Allows the store owner to reply to a product review on their store\'s product.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: '1f3c8d3c-40d5-4b3d-a9c4-7e2d8f4f2d08' }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["reply"],
             properties: {
               reply: { type: "string", example: "Thanks for the feedback." }
             }
           }
         }
       }
     }
  */
  replyToProductReview,
);

//  Store Reviews 

router.post(
  "/store",
  auth,
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Create a store review'
     #swagger.description = 'Creates a review for a store the user has purchased from. Requires a delivered order from the store.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["storeId", "orderId", "rating"],
             properties: {
               storeId: { type: "string", format: "uuid", example: "1b3b0de0-b3f7-4d17-9df1-c1b3d31a3fd0" },
               orderId: { type: "string", format: "uuid", example: "c0e4d28d-7f4f-4d52-8b1f-7a7e0f1a9b2c" },
               rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
               reviewText: { type: "string", example: "Smooth ordering and excellent support." }
             }
           }
         }
       }
     }
  */
  createStoreReview,
);

router.get(
  "/store/:storeId",
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get reviews for a store'
     #swagger.description = 'Returns a paginated list of reviews for a specific store.'
     #swagger.parameters['storeId'] = { in: 'path', type: 'string', required: true, example: '1b3b0de0-b3f7-4d17-9df1-c1b3d31a3fd0' }
     #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, example: 1 }
     #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, example: 20 }
     #swagger.parameters['sortBy'] = { in: 'query', type: 'string', required: false, example: 'createdAt' }
     #swagger.parameters['sortDir'] = { in: 'query', type: 'string', required: false, example: 'desc' }
  */
  getStoreReviews,
);

router.get(
  "/store/detail/:id",
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get a single store review'
     #swagger.description = 'Returns a single store review by its ID.'
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: '1f3c8d3c-40d5-4b3d-a9c4-7e2d8f4f2d08' }
  */
  getStoreReviewById,
);

router.put(
  "/store/:id",
  auth,
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Update a store review'
     #swagger.description = 'Updates the authenticated user\'s own store review.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: '1f3c8d3c-40d5-4b3d-a9c4-7e2d8f4f2d08' }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
               reviewText: { type: "string", example: "Updated store review." }
             }
           }
         }
       }
     }
  */
  updateStoreReview,
);

router.delete(
  "/store/:id",
  auth,
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Delete a store review'
     #swagger.description = 'Deletes the authenticated user\'s own store review.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: '1f3c8d3c-40d5-4b3d-a9c4-7e2d8f4f2d08' }
  */
  deleteStoreReview,
);

router.put(
  "/store/:id/reply",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Reply to a store review (Store Owner)'
     #swagger.description = 'Allows the store owner to reply to a review on their store.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, example: '1f3c8d3c-40d5-4b3d-a9c4-7e2d8f4f2d08' }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["reply"],
             properties: {
               reply: { type: "string", example: "We appreciate your feedback." }
             }
           }
         }
       }
     }
  */
  replyToStoreReview,
);

export default router;
