import express from "express";
import { createStore, getStore } from "../controllers/StoreController.js";
import { createStoreSchema } from "../DTO/store.dto.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post(
  "/create",
  auth,
  validateBody(createStoreSchema),
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Create a new store'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  createStore,
);

router.get(
  "/store",
  auth,
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Get store details'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  getStore,
);

export default router;
