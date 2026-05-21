import express from "express";
import { auth, authAdmin, authStoreOwner } from "../middleware/auth.js";
import { createOrder, getMyOrders, getOrders, getOrderById, getOrdersByStoreId, updateOrderStatus } from "../controllers/OrderController.js";

const router = express.Router();

router.get("/", auth, authAdmin,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get all orders (admin)'
     #swagger.description = 'Returns a paginated list of all orders. Admin access required.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Orders retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  getOrders
);

router.get("/store/:storeId", auth, authStoreOwner,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get orders for a store (store owner or admin)'
     #swagger.description = 'Returns orders belonging to a specific store. Store owner or admin access required.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Store orders retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Store not found' }
  */
  getOrdersByStoreId
);

router.get("/me", auth,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get the authenticated customer\'s orders'
     #swagger.description = 'Returns a paginated list of orders placed by the signed-in user.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Orders retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  getMyOrders
);

router.get("/:id", auth,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get order by id (customer or admin)'
     #swagger.description = 'Retrieves a single order by ID. Customers can access their orders; admins can access all.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Order retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Order not found' }
  */
  getOrderById
);

router.put("/:id", auth, authStoreOwner,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Update order status (store owner or admin)'
     #swagger.description = 'Updates the status of an order (e.g., processing, shipped, delivered).'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["status"],
             properties: {
               status: { type: "string", example: "shipped" },
               trackingNumber: { type: "string", nullable: true, example: "TRK123456" }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: 'Order status updated' }
     #swagger.responses[400] = { description: 'Invalid request' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Order not found' }
  */
  updateOrderStatus
);

router.post("/", auth,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Submit a new order'
     #swagger.description = 'Creates a new order for the authenticated user.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["items", "shippingAddress"],
             properties: {
               items: { type: "array", items: { type: "object", properties: { productId: { type: "string" }, quantity: { type: "integer" } } }, example: [{ productId: "prd_1", quantity: 2 }] },
                shippingAddress: { type: "object", example: { street: "123 Main St", city: "Cairo", postalCode: "11511" } }
             }
           }
         }
       }
     }
     #swagger.responses[201] = { description: 'Order created successfully' }
     #swagger.responses[400] = { description: 'Invalid order data' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  createOrder
);

export default router;