import express from "express";
import { auth, authAdmin, authStoreOwner } from "../middleware/auth.js";
import {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  getOrdersByStoreId,
  updateOrderStatus,
} from "../controllers/OrderController.js";

const router = express.Router();

router.use(auth);

router.post(
  "/",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Checkout - place a new order from cart'
     #swagger.description = 'Creates an order from the authenticated user\'s Redis cart for the specified store.'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  createOrder,
);

router.get(
  "/",
  authAdmin,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get all orders (admin)'
     #swagger.description = 'Returns a paginated list of all orders. Admin access required.'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  getOrders,
);

router.get(
  "/me",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get my orders'
     #swagger.description = 'Returns the authenticated user\'s orders.'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  getMyOrders,
);

router.get(
  "/store/:storeId",
  authStoreOwner,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get orders for a store'
     #swagger.description = 'Returns orders belonging to a specific store. Store owner or admin access required.'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  getOrdersByStoreId,
);

router.get(
  "/:id",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get order by id'
     #swagger.description = 'Retrieves a single order by ID. Customers can access their own orders; admins can access all.'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  getOrderById,
);

router.put(
  "/:id",
  authStoreOwner,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Update order status'
     #swagger.description = 'Updates the status of an order. Store owner or admin access required.'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  updateOrderStatus,
);

export default router;