# Ultimate Backend Guide (consolidated)

Navigation

- [Docs index](README.md)
- [TOC](TOC.md)
- [Ultimate guide](ultimate-backend-guide.md)

Purpose
-------
This single-file guide consolidates run instructions, architecture, conventions, and developer guidance for the Dokkan backend.

Quick start
-----------
1. Install dependencies: `npm install` in `Backend/`.
2. Configure environment: copy `env.example` → `.env` and fill required vars (DB, JWT_SECRET, REFRESH_TOKEN_SECRET, Redis, MinIO credentials, EMAIL settings).
3. Start dev server: `npm run dev` (uses tsx watch).

Health & runtime
----------------
- Health endpoint: `GET /api/health` (returns 200 JSON success).
- Swagger UI available at `/api/docs` (generated from route swagger comments).

Architecture
------------
- Express app in `src/server.ts` sets up global middleware, routes, 404 handler, and global error handler.
- Routes live in `src/routes/*.ts` and map to controllers under `src/controllers` and `src/modules`.
- Business logic lives in `src/services` and `src/modules` for feature modules.
- Prisma (ORM) configured via `prisma/schema.prisma` and used through `src/config/db.ts`.
- Redis used for OTP and refresh session management (`src/config/redis.ts`).
- Image storage via MinIO client (`utils/minioClient.js` and `imgStorageService.js`).

Conventions
-----------
- Controllers should NOT call `res` for error responses directly; instead create an `Error` (optionally attach `status`) and call `next(err)` so the global handler formats JSON responses.
- Use `sendSuccess`, `sendError`, `sendUnauthorized`, `sendServerError` helpers for consistent payload shapes when returning from controllers (success path). Error paths should forward to `next()`.
- DTOs live in `src/DTO` to describe/validate incoming shapes. Use Zod validation via `validate.middleware.ts`.

Error handling
--------------
- A 404 JSON handler is registered in `server.ts` for unmatched routes.
- A global error handler catches and formats errors. In production it hides stack traces; in development it includes `error.message` and `error.stack`.
- Middleware and controllers should forward errors via `next(err)` to be logged and returned consistently.

Auth
----
- See [archived auth documentation](archived/FEATURE_AUTH_DOCUMENTATION_FULL.md) for full details. Key points:
  - Access tokens (JWT) expire in 15m.
  - Refresh tokens are rotated and stored in Redis keyed by `refresh:<userId>:<sessionId>`.
  - Refresh cookies are HTTP-only and path-scoped to `/api/auth` by default.

Auth endpoint examples
----------------------

Register
- `POST /api/auth/register`
- Request:

```json
{
  "email": "user@example.com",
  "password": "Secret123!",
  "name": "John Doe",
  "role": "Customer"
}
```

- Success response:

```json
{
  "success": true,
  "message": "User created successfully, Please check your email for the verification code.",
  "data": {
    "user": {
      "id": "clx123...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "Customer",
      "contactNumber": null,
      "profilePhotoUrl": null,
      "isVerified": false,
      "createdAt": "2026-05-06T12:00:00.000Z"
    },
    "token": "eyJhbGciOi..."
  }
}
```

Login
- `POST /api/auth/login`
- Request:

```json
{
  "email": "user@example.com",
  "password": "Secret123!"
}
```

- Success response:

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "clx123...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "Customer",
      "contactNumber": null,
      "profilePhotoUrl": null,
      "isVerified": true,
      "createdAt": "2026-05-06T12:00:00.000Z"
    },
    "token": "eyJhbGciOi..."
  }
}
```

Refresh
- `POST /api/auth/refresh`
- Request: no JSON body; sends the refresh cookie automatically.
- Success response:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "id": "clx123...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "Customer",
      "contactNumber": null,
      "profilePhotoUrl": null,
      "isVerified": true,
      "createdAt": "2026-05-06T12:00:00.000Z"
    },
    "token": "eyJhbGciOi..."
  }
}
```

Profile
- `GET /api/auth/profile`
- Headers:

```http
Authorization: Bearer <access-token>
```

- Success response:

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "clx123...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "Customer",
      "contactNumber": null,
      "profilePhotoUrl": null,
      "isVerified": true,
      "createdAt": "2026-05-06T12:00:00.000Z"
    }
  }
}
```

Update profile
- `PATCH /api/auth/profile`
- Request:

```json
{
  "name": "Jane Doe",
  "contactNumber": "+1234567890",
  "profilePhotoUrl": "https://example.com/photo.jpg"
}
```

- Success response:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "clx123...",
      "email": "user@example.com",
      "name": "Jane Doe",
      "role": "Customer",
      "contactNumber": "+1234567890",
      "profilePhotoUrl": "https://example.com/photo.jpg",
      "isVerified": true,
      "createdAt": "2026-05-06T12:00:00.000Z"
    }
  }
}
```

Delete account
- `DELETE /api/auth/profile`
- Success response:

```json
{
  "success": true,
  "message": "Account deleted successfully",
  "data": null
}
```

Verify OTP
- `POST /api/auth/verify-otp`
- Request:

```json
{
  "otp": "123456"
}
```

- Success response:

```json
{
  "success": true,
  "message": "Email verified successfully!",
  "data": null
}
```

Resend OTP
- `POST /api/auth/resend-otp`
- Success response:

```json
{
  "success": true,
  "message": "A new verification code has been sent to your email.",
  "data": null
}
```

Logout
- `POST /api/auth/logout`
- Success response:

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

Tenant resolution
-----------------
- Requests targeting store-specific endpoints include a `:storeSlug` param. `tenant.middleware.ts` resolves the store and attaches it to `req.store` or forwards a 404 error.

Services & utilities
--------------------
- `email.service.ts` — centralized email sending (templates in `templates/`).
- `imgStorageService.js`, `minioClient.js` — object storage helpers for file uploads.
- `password.ts` — password hash/verify helpers.

Testing & verification
----------------------
- Manual curl checks used during development: health, 404 cases, and auth-protected endpoints to ensure handlers forward errors properly.

Docs & swagger
--------------
- Swagger comments live next to route declarations and are used to generate `swagger-output.json`.
- Keep swagger comments up-to-date when routes change.

Where to add new docs
---------------------
- Add feature-specific docs under [Backend/Docs/](README.md) and link them from [TOC.md](TOC.md).

Contact / next steps
---------------------
- If you want, I can:
  - Expand per-endpoint examples (request/response JSON)
  - Extract DTO field-level docs into [types.md](types.md)
  - Add CI linting step to ensure controllers call `next(err)` for errors
