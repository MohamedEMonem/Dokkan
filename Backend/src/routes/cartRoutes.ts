import express from "express";
import * as CartController from "../controllers/CartController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", CartController.getCart);
router.post("/items", CartController.addItem);
router.patch("/items/:productId", CartController.updateItem);
router.delete("/items/:productId", CartController.removeItem);
router.delete("/", CartController.clearCart);

export default router;