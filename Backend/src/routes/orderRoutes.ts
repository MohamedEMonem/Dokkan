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
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["username", "phoneNumber", "email", "shippingAddress"],
             properties: {
               username: { type: "string", example: "John Doe" },
               phoneNumber: { type: "string", example: "+201234567890" },
               email: { type: "string", format: "email", example: "john@example.com" },
               shippingAddress: {
                 type: "object",
                 required: ["line1", "city", "country"],
                 properties: {
                   line1: { type: "string", example: "123 Main St" },
                   line2: { type: "string", example: "Apartment 4B" },
                   city: { type: "string", example: "Cairo" },
                   country: { type: "string", example: "Egypt" },
                   postalCode: { type: "string", example: "11511" }
                 }
               }
             }
           }
         }
       }
     }
     #swagger.responses[201] = {
       description: 'Order(s) placed successfully',
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               success: { type: "boolean", example: true },
               data: {
                 type: "object",
                 properties: {
                   orders: { type: "array", items: { type: "object" } }
                 }
               },
               message: { type: "string", example: 'Order(s) placed successfully' },
               error: { type: "null", example: null },
               code: { type: "integer", example: 201 }
             }
           }
         }
       }
     }
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
     #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, example: 1, description: 'Page number' }
     #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, example: 20, description: 'Items per page' }
     #swagger.parameters['status'] = { in: 'query', type: 'string', required: false, example: 'Pending', description: 'Filter by order status' }
     #swagger.parameters['sortBy'] = { in: 'query', type: 'string', required: false, example: 'createdAt', description: 'Sort field' }
     #swagger.parameters['sortDir'] = { in: 'query', type: 'string', required: false, example: 'desc', description: 'Sort direction' }
     #swagger.responses[200] = {
       description: 'Orders retrieved successfully',
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               success: { type: "boolean", example: true },
               data: {
                 type: "object",
                 properties: {
                   orders: { type: "array", items: { type: "object" } },
                   meta: { $ref: '#/components/schemas/PaginationMeta' }
                 }
               }
             }
           }
         }
       }
     }
  */
  getOrders,
);

router.get(
  "/me",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get my orders'
     #swagger.description = 'Returns the authenticated user\'s orders.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, example: 1 }
     #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, example: 20 }
     #swagger.parameters['status'] = { in: 'query', type: 'string', required: false, example: 'Delivered' }
     #swagger.parameters['sortBy'] = { in: 'query', type: 'string', required: false, example: 'createdAt' }
     #swagger.parameters['sortDir'] = { in: 'query', type: 'string', required: false, example: 'desc' }
     #swagger.responses[200] = {
       description: 'Orders retrieved successfully',
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               success: { type: "boolean", example: true },
               data: {
                 type: "object",
                 properties: {
                   orders: { type: "array", items: { type: "object" } },
                   meta: { $ref: '#/components/schemas/PaginationMeta' }
                 }
               }
             }
           }
         }
       }
     }
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
     #swagger.parameters['storeId'] = { in: 'path', type: 'string', required: true, description: 'Store UUID', example: '1b3b0de0-b3f7-4d17-9df1-c1b3d31a3fd0' }
     #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, example: 1 }
     #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, example: 20 }
     #swagger.parameters['status'] = { in: 'query', type: 'string', required: false, example: 'Pending' }
     #swagger.parameters['sortBy'] = { in: 'query', type: 'string', required: false, example: 'createdAt' }
     #swagger.parameters['sortDir'] = { in: 'query', type: 'string', required: false, example: 'desc' }
  */
  getOrdersByStoreId,
);

router.get(
  "/:id",
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get order by id'
     #swagger.description = 'Retrieves a single order by ID. Customers can access their own orders; admins can access all.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, description: 'Order UUID', example: '7b0a1e15-4e3e-4f1f-a1e7-6b5cfbf5d7cd' }
     #swagger.responses[200] = {
       description: 'Order retrieved successfully',
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               success: { type: "boolean", example: true },
               data: { type: "object", properties: { order: { type: "object" } } }
             }
           }
         }
       }
     }
     #swagger.responses[404] = { description: 'Order not found' }
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
     #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, description: 'Order UUID', example: '7b0a1e15-4e3e-4f1f-a1e7-6b5cfbf5d7cd' }
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["status"],
             properties: {
               status: { type: "string", enum: ["Pending", "Shipped", "Delivered", "Cancelled"], example: "Shipped" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = {
       description: 'Order status updated successfully',
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               success: { type: "boolean", example: true },
               data: { type: "object", properties: { order: { type: "object" } } }
             }
           }
         }
       }
     }
  */
  updateOrderStatus,
);

export default router;