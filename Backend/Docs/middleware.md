# Middleware Reference

Navigation

- [Docs index](README.md)
- [TOC](TOC.md)
- [Ultimate guide](ultimate-backend-guide.md)

This document lists backend middleware, their responsibilities, and how they should surface errors (via `next(err)`).

Location: `src/middleware/`

Core middleware
- `tenant.middleware.ts` — resolves tenant/store from `:storeSlug` and attaches it to `req.store`. Must call `next(err)` for errors (404/400) and attach `req.store` on success.
- `auth.ts` — authentication and authorization middleware. Validates JWTs, attaches `req.user`, and exposes `auth`, `authAdmin`, `authStoreOwner`. Forward auth failures with `next(err)` (401/403).
- `validate.middleware.ts` — runtime validation using `zod`; should forward validation errors with `status = 422` and `details`.
- `uploadValidator.js` — multer upload config; multer will surface file errors via its callbacks — handlers should forward errors where appropriate.

Guidelines
- Middleware must not send formatted responses using response helpers directly; instead construct an `Error` object, set `err.status`, and call `next(err)` so the global error handler formats responses consistently.
- Rate-limiter handlers can keep sending immediate responses for UX reasons (they are not unexpected errors).
- Avoid performing heavy DB writes in middleware; prefer lightweight reads.

Example: forwarding an auth error

```ts
const err: any = new Error('Invalid token');
err.status = 401;
return next(err);
```

Reference implementations:
- `src/middleware/tenant.middleware.ts`
- `src/middleware/auth.ts`
- `src/middleware/validate.middleware.ts`

Back to docs index: [Docs index](README.md)
