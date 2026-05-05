# Archived: Feature/Auth — Summary (reconstructed)

Navigation

- [Docs index](../README.md)
- [TOC](../TOC.md)
- [Ultimate guide](../ultimate-backend-guide.md)

This summary highlights the main additions from the auth feature.

- JWT-auth with short-lived access tokens and refresh tokens in secure cookies.
- Refresh sessions stored in Redis for revocation and rotation.
- OTP email verification using Redis and `emailService`.
- Role-based authorization (`authAdmin`, `authStoreOwner`).
- Standardized response helpers and rate-limiting applied to auth endpoints.

Primary endpoints:
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `POST /api/auth/refresh` — rotate refresh token
- `POST /api/auth/logout` — revoke session
- `GET /api/auth/profile` — authenticated user profile

See `docs/archived/FEATURE_AUTH_DOCUMENTATION_FULL.md` for implementation details.

Back to docs index: [Docs index](../README.md)
