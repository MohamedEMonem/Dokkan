import express from "express";
import * as CartController from "../controllers/CartController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.use(auth); // Applies auth to all routes below

router.get("/", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Get user cart'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  CartController.getCart
);

router.post("/items", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Add item to cart'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  CartController.addItem
);

router.patch("/items/:productId", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Update item quantity'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  CartController.updateItem
);

router.delete("/items/:productId", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Remove item from cart'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  CartController.removeItem
);

router.delete("/", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Clear the entire cart'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  CartController.clearCart
);

export default router;