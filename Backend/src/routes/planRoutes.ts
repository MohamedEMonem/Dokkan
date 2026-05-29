import express from "express";
import { auth, authStoreOwner } from "../middleware/auth.js";
import {
  getOwnerStorePlan,
  getPlanById,
  getPlans,
} from "../controllers/PlanController.js";

const router = express.Router();

router.get(
  "/",
  /* #swagger.tags = ['Plans']
     #swagger.summary = 'List all plans'
     #swagger.description = 'Returns the available subscription plans.'
  */
  getPlans,
);

router.get(
  "/me",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Plans']
     #swagger.summary = 'Get the authenticated store owner\'s current plan'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  getOwnerStorePlan,
);

router.get(
  "/:identifier",
  /* #swagger.tags = ['Plans']
     #swagger.summary = 'Get a plan by slug or id'
  */
  getPlanById,
);

export default router;
