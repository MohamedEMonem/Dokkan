import express from "express";
import {
  createStore,
  getOwnerStore,
  updateOwnerStore,
  deleteOwnerStore,
  listStores,
} from "../controllers/StoreController.js";
import { createStoreSchema, updatestoreSchema } from "../DTO/store.dto.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { auth, authStoreOwner } from "../middleware/auth.js";
const router = express.Router();

router.post(
  "/",
  auth,
  authStoreOwner,
  validateBody(createStoreSchema),
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Create a new store'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  createStore,
);

router.get(
  "/me",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Get the authenticated owner\'s store'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  getOwnerStore,
);

router.get(
  "/",
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Browse active stores with pagination'
  */
  listStores,
);

router.put(
  "/me",
  auth,
  authStoreOwner,
  validateBody(updatestoreSchema),
  updateOwnerStore,
);

router.patch(
  "/me",
  auth,
  authStoreOwner,
  validateBody(updatestoreSchema),
  updateOwnerStore,
);

router.delete(
  "/me",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Soft-delete the authenticated user\'s store'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  deleteOwnerStore,
);

export default router;
