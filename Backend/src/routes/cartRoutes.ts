import express from "express";
import * as CartController from "../controllers/CartController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.use(auth); // Applies auth to all routes below

router.get("/", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Get user cart'
     #swagger.description = 'Returns the authenticated user\'s shopping cart with line items and totals.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Cart retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  CartController.getCart
);

router.post("/items", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Add item to cart'
     #swagger.description = 'Adds a product to the authenticated user\'s cart or increases quantity if already present.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["productId", "quantity"],
             properties: {
               productId: { type: "string", example: "clth_12345" },
               quantity: { type: "integer", minimum: 1, example: 2 }
             }
           }
         }
       }
     }
     #swagger.responses[201] = { description: 'Item added to cart' }
     #swagger.responses[400] = { description: 'Invalid request body' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  CartController.addItem
);

router.patch("/items/:productId", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Update item quantity'
     #swagger.description = 'Updates the quantity of a product in the authenticated user\'s cart.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["quantity"],
             properties: {
               quantity: { type: "integer", minimum: 0, example: 3 }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: 'Item updated successfully' }
     #swagger.responses[400] = { description: 'Invalid quantity' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Product not found in cart' }
  */
  CartController.updateItem
);

router.delete("/items/:productId", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Remove item from cart'
     #swagger.description = 'Removes a specific product from the authenticated user\'s cart.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Item removed successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Product not found in cart' }
  */
  CartController.removeItem
);

router.delete("/", 
  /* #swagger.tags = ['Cart']
     #swagger.summary = 'Clear the entire cart'
     #swagger.description = 'Removes all items from the authenticated user\'s cart.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Cart cleared successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
  */
  CartController.clearCart
);

export default router;