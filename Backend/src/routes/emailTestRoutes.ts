import express from "express";
import { auth } from "../middleware/auth.js";
import { sendOrderConfirmationTestEmail } from "../controllers/OrderController.js";

const router = express.Router();

router.post(
  "/order-confirmation",
  auth,
  /* #swagger.tags = ['Test Email']
     #swagger.summary = 'Send a test order confirmation email'
     #swagger.description = 'Sends a compiled Handlebars order confirmation email using provided order data.'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  sendOrderConfirmationTestEmail,
);

export default router;