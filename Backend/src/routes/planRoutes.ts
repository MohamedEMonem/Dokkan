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
     #swagger.summary = 'List all subscription plans'
     #swagger.description = 'Returns the full catalog of subscription plans available in Dokkan, including each plan slug, pricing, and feature set.'
     #swagger.responses[200] = { description: 'Plans retrieved successfully' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  getPlans,
);

router.get(
  "/me",
  auth,
  authStoreOwner,
  /* #swagger.tags = ['Plans']
     #swagger.summary = 'Get the authenticated store owner\'s current subscription'
     #swagger.description = 'Returns the current store, active subscription, and associated plan for the authenticated store owner.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Store subscription retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'Store not found' }
  */
  getOwnerStorePlan,
);

router.get(
  "/:identifier",
  /* #swagger.tags = ['Plans']
     #swagger.summary = 'Get a plan by slug or UUID'
     #swagger.description = 'Looks up a plan using either its stable slug (for example, basic, plus, pro) or its UUID identifier.'
     #swagger.parameters['identifier'] = {
       in: 'path',
       description: 'Plan slug or UUID',
       required: true,
       type: 'string',
       example: 'plus'
     }
     #swagger.responses[200] = { description: 'Plan retrieved successfully' }
     #swagger.responses[404] = { description: 'Plan not found' }
  */
  getPlanById,
);

export default router;
