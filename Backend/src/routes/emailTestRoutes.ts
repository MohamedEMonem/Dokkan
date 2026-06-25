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
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             required: ["customerName", "customerEmail", "orderNumber", "totalAmount", "items"],
             properties: {
               customerName: { type: "string", example: "John Doe" },
               customerEmail: { type: "string", format: "email", example: "john@example.com" },
               orderNumber: { type: "string", example: "ORD-1001" },
               totalAmount: { type: "string", example: "149.99" },
               orderDate: { type: "string", example: "2026-05-31" },
               storeName: { type: "string", example: "Dokkan Store" },
               items: {
                 type: "array",
                 items: {
                   type: "object",
                   properties: {
                     name: { type: "string", example: "Summer Tee" },
                     quantity: { type: "integer", example: 2 },
                     unitPrice: { type: "string", example: "29.99" },
                     lineTotal: { type: "string", example: "59.98" }
                   }
                 }
               }
             }
           }
         }
       }
     }
     #swagger.responses[200] = { description: 'Order confirmation email sent successfully' }
     #swagger.responses[400] = { description: 'Invalid email payload' }
     #swagger.responses[502] = { description: 'Email delivery failed' }
  */
  sendOrderConfirmationTestEmail,
);

export default router;