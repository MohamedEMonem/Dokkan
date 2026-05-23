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
  */
  createProductReview,
);

router.get(
  "/product/:productId",
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get reviews for a product'
     #swagger.description = 'Returns a paginated list of reviews for a specific product.'
  */
  getProductReviews,
);

router.get(
  "/product/detail/:id",
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get a single product review'
     #swagger.description = 'Returns a single product review by its ID.'
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
  */
  createStoreReview,
);

router.get(
  "/store/:storeId",
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get reviews for a store'
     #swagger.description = 'Returns a paginated list of reviews for a specific store.'
  */
  getStoreReviews,
);

router.get(
  "/store/detail/:id",
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Get a single store review'
     #swagger.description = 'Returns a single store review by its ID.'
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
  */
  replyToStoreReview,
);

export default router;
