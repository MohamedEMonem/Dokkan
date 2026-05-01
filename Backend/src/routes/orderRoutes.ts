import express from "express";
import { auth } from "../middleware/auth.js";
import { createOrder } from "../controllers/OrderController.js";

const router = express.Router();

router.post("/", auth, 
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Submit a new order'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  createOrder
);

export default router;