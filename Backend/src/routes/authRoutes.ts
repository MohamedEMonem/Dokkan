import express from "express";
import { auth } from "../middleware/auth.js";
import { deleteAccount, getProfile, login, patchProfile, register } from "../modules/auth/auth.controller.js";

const router = express.Router();

router.post("/register", 
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Register a new user'
     #swagger.requestBody = {
       required: true,
       content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, password: { type: "string" } } } } }
     }
  */
  register
);

router.post("/login", 
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Login user'
  */
  login
);

// Authenticated profile endpoints
router.get("/profile", auth, 
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Get current user profile'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  getProfile
);

router.patch("/profile", auth, 
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Update user profile'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  patchProfile
);

router.delete("/profile", auth, 
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Delete user account'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  deleteAccount
);

export default router;