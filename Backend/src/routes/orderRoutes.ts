import express from "express";
import { auth, authAdmin, authStoreOwner } from "../middleware/auth.js";
import * as OrderController from "../controllers/OrderController.js";

const router = express.Router();

// All order routes require authentication
router.use(auth);

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Any authenticated user can check out their cart
router.post(
  "/",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Checkout – place a new order from cart'
     #swagger.description = 'Creates an order from the authenticated user\'s Redis cart for the specified store. Validates stock, creates Order + OrderItems, decrements product stock, and clears the cart – all in a single atomic transaction.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["storeId", "shippingAddress"],
             properties: {
               storeId: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
               shippingAddress: {
                 type: "object",
                 required: ["line1", "city", "country"],
                 properties: {
                   line1:      { type: "string", example: "123 Elm Street" },
                   line2:      { type: "string", example: "Apt 4B" },
                   city:       { type: "string", example: "Cairo" },
                   country:    { type: "string", example: "EG" },
                   postalCode: { type: "string", example: "11511" }
                 }
               }
             }
           }
         }
       }
     }
     #swagger.responses[201] = { description: "Order placed successfully" }
     #swagger.responses[400] = { description: "Cart is empty / no items from this store" }
     #swagger.responses[404] = { description: "Store not found or unavailable" }
     #swagger.responses[409] = { description: "Insufficient stock for one or more items" }
     #swagger.responses[500] = { description: "Internal server error" }
  */
  OrderController.createOrder
);

// ─── GET /api/orders ──────────────────────────────────────────────────────────
// Admin only – paginated list with optional filters
router.get(
  "/",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get all orders (Admin only)'
     #swagger.description = 'Returns a paginated list of all orders. Supports optional filtering by status, storeId, and customerId.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['page']       = { in: 'query', description: 'Page number (default 1)', schema: { type: 'integer' } }
     #swagger.parameters['limit']      = { in: 'query', description: 'Items per page (default 20, max 100)', schema: { type: 'integer' } }
     #swagger.parameters['status']     = { in: 'query', description: 'Filter by status', schema: { type: 'string', enum: ['Pending','Shipped','Delivered','Cancelled'] } }
     #swagger.parameters['storeId']    = { in: 'query', description: 'Filter by store UUID', schema: { type: 'string', format: 'uuid' } }
     #swagger.parameters['customerId'] = { in: 'query', description: 'Filter by customer UUID', schema: { type: 'string', format: 'uuid' } }
     #swagger.responses[200] = { description: "Orders retrieved successfully" }
     #swagger.responses[403] = { description: "Admin privileges required" }
  */
  authAdmin,
  OrderController.getOrders
);

// ─── GET /api/orders/store/:storeId ───────────────────────────────────────────
// Store owner sees their store's orders; Admin sees any store
// IMPORTANT: this specific route must be declared BEFORE /:id to avoid
//            Express interpreting "store" as an order id.
router.get(
  "/store/:storeId",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get orders by store (Store Owner or Admin)'
     #swagger.description = 'Returns paginated orders for the given store. Store owners can only access their own store; admins can access any store.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['storeId'] = { in: 'path', required: true, description: 'Store UUID', schema: { type: 'string', format: 'uuid' } }
     #swagger.parameters['page']    = { in: 'query', description: 'Page number (default 1)', schema: { type: 'integer' } }
     #swagger.parameters['limit']   = { in: 'query', description: 'Items per page (default 20, max 100)', schema: { type: 'integer' } }
     #swagger.parameters['status']  = { in: 'query', description: 'Filter by status', schema: { type: 'string', enum: ['Pending','Shipped','Delivered','Cancelled'] } }
     #swagger.responses[200] = { description: "Store orders retrieved successfully" }
     #swagger.responses[403] = { description: "Store not found or access denied" }
  */
  authStoreOwner,
  OrderController.getOrdersByStoreId
);

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
// All authenticated users – service layer enforces per-role access
router.get(
  "/:id",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get order by ID'
     #swagger.description = 'Customers can only view their own orders. Store owners can view orders placed in their store. Admins can view any order.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, description: 'Order UUID', schema: { type: 'string', format: 'uuid' } }
     #swagger.responses[200] = { description: "Order retrieved successfully" }
     #swagger.responses[404] = { description: "Order not found" }
  */
  OrderController.getOrderById
);

// ─── PUT /api/orders/:id ──────────────────────────────────────────────────────
// Store owner (for their store's orders) or Admin
router.put(
  "/:id",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Update order status (Store Owner or Admin)'
     #swagger.description = 'Valid transitions: Pending → Shipped | Cancelled, Shipped → Delivered | Cancelled. Cancelling a Pending order automatically restores product stock. Delivered and Cancelled orders are immutable.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, description: 'Order UUID', schema: { type: 'string', format: 'uuid' } }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["status"],
             properties: {
               status: {
                 type: "string",
                 enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
                 example: "Shipped"
               }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: "Order status updated successfully" }
     #swagger.responses[404] = { description: "Order not found or access denied" }
     #swagger.responses[409] = { description: "Invalid status transition or order is immutable" }
  */
  authStoreOwner,
  OrderController.updateOrderStatus
);

export default router;
