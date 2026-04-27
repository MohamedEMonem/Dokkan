import express from "express";
import { createStore, getStore} from "../controllers/StoreController.js"
import {createStoreSchema} from "../DTO/store.dto.js"
import {validateBody} from "../middleware/validate.middleware.js"
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/create", auth, validateBody(createStoreSchema), createStore)
router.get("/store", auth , getStore)

export default router;