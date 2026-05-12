# Archived: Feature/Auth — Full Documentation (reconstructed)

Navigation

- [Docs index](../README.md)
- [TOC](../TOC.md)
- [Ultimate guide](../ultimate-backend-guide.md)

This file reconstructs the full feature/auth documentation from source code for archival purposes.

Overview
--------
Implements authentication and authorization for Dokkan backend including:

- JWT access tokens (short-lived)
- Refresh tokens stored in HTTP-only cookies with server-side session tracking (Redis)
- Role-based authorization (Customer, StoreOwner, Admin)
- OTP email verification flow using Redis and a local email service
- Standardized response format and rate limiting for auth endpoints

Files of interest
-----------------
- `src/modules/auth/auth.controller.ts` — main auth handlers (register, login, refresh, logout, profile, OTP)
- `src/middleware/auth.ts` — JWT validation and role-checking middleware (`auth`, `authAdmin`, `authStoreOwner`)
- `src/routes/authRoutes.ts` — route declarations and swagger annotations
- `src/utils/response.ts` — standardized response helpers used by auth controller
- `src/config/redis.ts` — Redis client used for OTP and refresh session storage

Key flows
---------

Register
- Validates email/password/name and optional role (Customer|StoreOwner).
- If soft-deleted user exists, restores account and issues tokens.
- Stores a 6-digit OTP in Redis keyed by `otp:<email>` with 15-minute TTL and sends an email via `emailService`.
- Returns `201` (created) or `200` (restored) with `token` and sets refresh cookie.

Login
- Validates email/password. Verifies password using `verifyPassword` (bcrypt wrapper).
- Issues JWT access token and refresh token; saves refresh session in Redis and sets cookie.

Refresh
- Reads refresh token from cookie, validates signature and server-side session in Redis.
- Rotates session on success, issues a new access token and refresh cookie.

Logout
- Revokes refresh session and clears refresh cookie.

OTP verify/resend
- `verifyOtp` compares provided code against Redis entry and marks user verified on success.
- `resendOtp` generates new OTP, updates Redis, and emails it.

Security & implementation notes
--------------------------------
- Access tokens expire quickly (15m) and refresh tokens have longer TTL (configurable via `REFRESH_TOKEN_EXPIRES_IN`).
- Refresh tokens are stored server-side in Redis, keyed by `refresh:<userId>:<sessionId>` to support rotation and revocation.
- All critical secrets come from env vars: `JWT_SECRET`, `REFRESH_TOKEN_SECRET`.
- Cookies are configured via `getRefreshCookieOptions()` with `httpOnly`, `secure`, `sameSite`, and configurable `path`/`domain`.

Rate limiting
-------------
- `authLimiter` — 5 attempts per 30 minutes for login/register endpoints.
- `refreshLimiter` — caps token refresh frequency.

Responses & errors
------------------
- Uses `sendSuccess`, `sendError`, `sendUnauthorized`, `sendServerError` for consistent JSON shapes.
- Controllers return 4xx for client errors and rely on the global handler for unexpected 5xx errors.

Testing
-------
- Manual test steps (examples):
  - Register user: POST `/api/auth/register` with JSON `{ email, password, name }` → 201
  - Login: POST `/api/auth/login` with JSON `{ email, password }` → 200 + access token + refresh cookie
  - Refresh: POST `/api/auth/refresh` (cookie present) → 200 + new token
  - Profile: GET `/api/auth/profile` with `Authorization: Bearer <token>` → 200

Notes
-----
- This archived reconstruction is based on the current source code (handlers, middleware, routes). For exact historical wording refer to the PR/commit that originally added the feature.

Back to docs index: [Docs index](../README.md)
