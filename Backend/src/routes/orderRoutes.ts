import express from "express";
import { auth, authAdmin, authStoreOwner } from "../middleware/auth.js";
import { createOrder, getOrders, getOrderById, getOrdersByStoreId, updateOrderStatus } from "../controllers/OrderController.js";

const router = express.Router();

router.get("/", auth, authAdmin,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get all orders (admin)'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  getOrders
);

router.get("/store/:storeId", auth, authStoreOwner,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get orders for a store (store owner or admin)'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  getOrdersByStoreId
);

router.get("/:id", auth,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Get order by id (customer or admin)'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  getOrderById
);

router.put("/:id", auth, authStoreOwner,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Update order status (store owner or admin)'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  updateOrderStatus
);

router.post("/", auth,
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Submit a new order'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  createOrder
);

export default router;