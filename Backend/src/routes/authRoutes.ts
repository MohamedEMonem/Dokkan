import express from "express";
import { auth, authLimiter, refreshLimiter } from "../middleware/auth.js";
import {
  login,
  register,
  refresh,
  logout,
  verifyOtp,
  resendOtp,
} from "../modules/auth/auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Register a new user'
     #swagger.description = 'Creates a new user account. If the email belongs to a previously soft-deleted account, it restores the account. Role is optional and defaults to Customer.'
     #swagger.requestBody = {
        required: true,
        content: { 
          "application/json": { 
            schema: { 
              type: "object", 
              required: ["email", "password", "name"],
              properties: { 
                email: { type: "string", format: "email", example: "user@example.com" },
                password: { type: "string", format: "password", example: "Secret123!" }, 
                name: { type: "string", maxLength: 50, example: "John Doe" },
                role: { 
                  type: "string", 
                  enum: ["Customer", "StoreOwner"], 
                  example: "Customer",
                  description: "Optional. Defaults to Customer."
                }
              } 
            } 
          } 
        }
     }
     #swagger.responses[201] = { description: 'User created successfully' }
     #swagger.responses[200] = { description: 'Account restored and registered successfully' }
     #swagger.responses[400] = { description: 'Invalid request body or validation failed' }
     #swagger.responses[403] = { description: 'Cannot assign invalid role' }
     #swagger.responses[409] = { description: 'User already exists' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  register,
);

router.post(
  "/login",
  authLimiter,
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Login user'
     #swagger.description = 'Authenticates a user and returns a JWT token.'
     #swagger.requestBody = {
        required: true,
        content: { 
          "application/json": { 
            schema: { 
              type: "object",
              required: ["email", "password"],
              properties: { 
                email: { type: "string", format: "email", example: "user@example.com" },
                password: { type: "string", format: "password", example: "Secret123!" } 
              } 
            } 
          } 
        }
     }
     #swagger.responses[200] = { description: 'Logged in successfully' }
     #swagger.responses[400] = { description: 'Please provide email and password' }
     #swagger.responses[401] = { description: 'Invalid email/password or account is deleted' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  login,
);

router.post(
  "/refresh",
  refreshLimiter,
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Refresh access token'
     #swagger.description = 'Rotates the refresh token (from HTTP-only cookie) and returns a fresh access token.'
     #swagger.responses[200] = { description: 'Token refreshed successfully' }
     #swagger.responses[401] = { description: 'Missing, invalid, expired, or revoked refresh token' }
     #swagger.responses[429] = { description: 'Too many refresh attempts' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  refresh,
);

router.post(
  "/logout",
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Logout user'
     #swagger.description = 'Revokes current refresh token session (if present) and clears refresh cookie.'
     #swagger.responses[200] = { description: 'Logged out successfully' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  logout,
);

router.post(
  "/verify-otp",
  auth,
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Verify email with OTP'
     #swagger.description = 'Validates the 6-digit code stored in Redis against the user input. Updates account to verified status upon success.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        content: { 
          "application/json": { 
            schema: { 
              type: "object",
              required: ["otp"],
              properties: { 
                otp: { type: "string", minLength: 6, maxLength: 6, example: "123456" } 
              } 
            } 
          } 
        }
     }
     #swagger.responses[200] = { description: 'Email verified successfully!' }
     #swagger.responses[400] = { description: 'OTP required, invalid, or expired' }
     #swagger.responses[401] = { description: 'Access denied. Invalid or missing token.' }
     #swagger.responses[500] = { description: 'Internal server error during verification' }
  */
  verifyOtp,
);

router.post(
  "/resend-otp",
  auth,
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Resend verification OTP'
     #swagger.description = 'Generates a fresh OTP, refreshes the 15-minute timer in Redis, and sends a new email via the local mail service.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'A new verification code has been sent to your email.' }
     #swagger.responses[400] = { description: 'Account is already verified' }
     #swagger.responses[401] = { description: 'Access denied. Invalid or missing token.' }
     #swagger.responses[500] = { description: 'Internal server error or mail service failure' }
  */
  resendOtp,
);
export default router;
