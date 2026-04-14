import express from "express";
const router = express.Router();

import * as CartController from "../controllers/CartController.js";
import { auth } from "../middleware/auth.js";

// All cart routes require authentication
router.use(auth);

// GET    /api/cart 
// POST   /api/cart/items  
// PATCH  /api/cart/items/:productId
// DELETE /api/cart/items/:productId
// DELETE /api/cart

router.get("/", CartController.getCart);
router.post("/items", CartController.addItem);
router.patch("/items/:productId", CartController.updateItem);
router.delete("/items/:productId", CartController.removeItem);
router.delete("/", CartController.clearCart);

export default router;
