import express from "express";
import { auth } from "../middleware/auth.js";
import {
  deleteAccount,
  getProfile,
  patchProfile,
} from "../modules/auth/auth.controller.js";

const router = express.Router();

router.get(
  "/profile",
  auth,
  /* #swagger.tags = ['User']
     #swagger.summary = 'Get current user profile'
     #swagger.description = 'Retrieves the public profile data of the authenticated user.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Profile retrieved successfully' }
     #swagger.responses[401] = { description: 'Access denied. Invalid or missing token.' }
     #swagger.responses[404] = { description: 'User not found' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  getProfile,
);

router.patch(
  "/profile",
  auth,
  /* #swagger.tags = ['User']
     #swagger.summary = 'Update user profile'
     #swagger.description = 'Updates specific fields on the authenticated user profile. Unrecognized fields will be rejected.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", maxLength: 50, example: "Jane Doe" },
                contactNumber: { type: "string", maxLength: 20, nullable: true, example: "+1234567890" },
                profilePhotoUrl: { type: "string", maxLength: 255, nullable: true, example: "https://example.com/photo.jpg" }
              }
            }
          }
        }
     }
     #swagger.responses[200] = { description: 'Profile updated successfully' }
     #swagger.responses[400] = { description: 'Validation error (e.g., invalid fields, string length exceeded, or no valid fields provided)' }
     #swagger.responses[401] = { description: 'Access denied. Invalid or missing token.' }
     #swagger.responses[404] = { description: 'Account not found or already deleted' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  patchProfile,
);

router.delete(
  "/profile",
  auth,
  /* #swagger.tags = ['User']
     #swagger.summary = 'Delete user account'
     #swagger.description = 'Performs a soft delete on the authenticated user account.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Account deleted successfully' }
     #swagger.responses[401] = { description: 'Access denied. Invalid or missing token.' }
     #swagger.responses[404] = { description: 'Account not found or already deleted' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  deleteAccount,
);

export default router;