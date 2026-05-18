import express from "express";
import { createStore, getUserStore,updateUser, deleteStore } from "../controllers/StoreController.js";
import { createStoreSchema ,updatestoreSchema} from "../DTO/store.dto.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { auth, authStoreOwner } from "../middleware/auth.js";
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
  "/mystore",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Get store details'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  getUserStore,
);

router.put(
  "/update",
  auth,
  authStoreOwner,
  validateBody(updatestoreSchema),
  updateUser
)

router.delete(
  "/delete",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Soft-delete the authenticated user\'s store'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  deleteStore,
);

export default router;
