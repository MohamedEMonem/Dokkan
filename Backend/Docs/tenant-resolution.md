# Commit 5d03b635 — Tenant resolution middleware & store route changes

- **Commit:** `5d03b6354a488ca239d144dd9272a965de538e27`
- **Author:** MohamedEMonem
- **Date:** Wed May 6 01:10:44 2026 +0300
- **Message:** feat: add tenant resolution middleware and update route handling for stores

Purpose
-------
This document explains the tenant-resolution feature introduced by the commit above, what changed, why it was added, and how backend developers should work with it going forward.

High-level summary
------------------
- Adds a `resolveTenant` middleware that resolves a store context from the `:storeSlug` path parameter and attaches it to the request object (e.g., `req.store` or `req.tenant`).
- Updates route registration and store-scoped endpoints to use `resolveTenant` so all store-scoped controllers run with an identified tenant.

Why this matters
-----------------
- Centralizes logic for looking up store metadata (db id, config, bucket name, etc.) from a user-facing `storeSlug`.
- Avoids repeated slug->id lookups in controllers.
- Makes it easier to guard and audit store-scoped actions (authorization, tenant-specific features).

Files changed (where to look)
----------------------------
- `src/middleware/tenant.middleware.ts` — primary middleware implementation. Look for how it reads `req.params.storeSlug`, fetches the store (via Prisma), and sets `req.store`.
- `src/routes/storeRoutes.ts` — route declarations updated to accept `:storeSlug` and apply `resolveTenant` where appropriate.
- `src/server.ts` — registrations like `app.use('/api/stores/:storeSlug/products', resolveTenant, productRoutes)` were added/updated.
- Store-related controllers — adjustments to expect `req.store` or rely on tenant context (search for usages of `req.store`, `req.tenant`, or `resolveTenant`).

Developer notes / usage
----------------------
- When adding new store-scoped routes, ensure `resolveTenant` is inserted before the route handlers. Example in `server.ts`:

  ```ts
  app.use('/api/stores/:storeSlug/products', resolveTenant, productRoutes);
  ```

- In controllers, access the resolved tenant as attached to the request. The middleware typically sets `req.store` or `req.tenant` — confirm the property name in `tenant.middleware.ts`.

- If `resolveTenant` determines the store is missing or inactive, it should forward an error using `next(err)` (preferably with `err.status = 404`) so the global error handler formats the response consistently.

Example: forwarding tenant-not-found

```ts
// inside tenant.middleware.ts
if (!store) {
  const err: any = new Error(`Store ${storeSlug} not found`);
  err.status = 404;
  return next(err);
}
```

Resolved tenant shape
---------------------
For clarity, the middleware attaches the resolved tenant as `req.store` (confirm name in `src/middleware/tenant.middleware.ts`). Minimum expected fields:

- `id: string` — database id (UUID)
- `slug: string` — store slug used in URL
- `status: 'Active' | 'Inactive' | string` — store state
- `bucketName?: string` — (optional) minio/s3 bucket identifier

If you need additional fields, add them to the tenant resolution and update the TypeScript types below.

TypeScript typing & Express Request augmentation
-----------------------------------------------
Add a typed tenant interface and augment Express `Request` for safety. Example additions:

```ts
// src/types/tenant.ts
export interface Tenant {
  id: string;
  slug: string;
  status: string;
  bucketName?: string;
}

// src/types/express.d.ts
import { Tenant } from './tenant';
declare module 'express-serve-static-core' {
  interface Request {
    store?: Tenant;
  }
}
```

Canonical middleware example
----------------------------
Use this pattern in `tenant.middleware.ts` so errors are forwarded and the handler sets `req.store`:

```ts
import type { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export async function resolveTenant(req: Request, _res: Response, next: NextFunction) {
  try {
    const storeSlug = String(req.params.storeSlug || '');
    const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
    if (!store) {
      const err: any = new Error(`Store ${storeSlug} not found`);
      err.status = 404;
      return next(err);
    }
    req.store = {
      id: store.id,
      slug: store.slug,
      status: store.status,
      bucketName: store.bucketName,
    };
    return next();
  } catch (err) {
    return next(err);
  }
}
```

Controller example
------------------
Controller handlers should read `req.store` and forward unexpected errors using `next(err)`. Example:

```ts
export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = req.store?.id;
    if (!storeId) {
      const err: any = new Error('Tenant not resolved');
      err.status = 400;
      return next(err);
    }
    const products = await prisma.product.findMany({ where: { storeId, deletedAt: null } });
    return sendSuccess(res, products);
  } catch (err) {
    return next(err);
  }
};
```

Reviewer checklist (for PRs)
---------------------------
- [ ] All `:storeSlug` routes include `resolveTenant` before route handlers.
- [ ] Controllers access `req.store` (or `req.tenant`) and do not duplicate slug->id lookups.
- [ ] Controllers and middleware forward errors with `next(err)` instead of calling `res.*` in catch blocks.
- [ ] Type augmentation added/updated in `src/types/express.d.ts` if new tenant fields were introduced.
- [ ] Tests or manual verification steps are documented in the PR description.

Test matrix (explicit expectations)
----------------------------------
- Valid slug → 200 (or route-specific success) with expected JSON payload.
  - curl: `curl -i http://localhost:3000/api/stores/<valid-slug>/products`
  - Expect: `200` and JSON body with `success: true`.
- Invalid slug → 404 JSON.
  - curl: `curl -i http://localhost:3000/api/stores/invalid-slug/products`
  - Expect: `404` and JSON `{ success: false, message: 'Store invalid-slug not found', code: 404 }` (message may vary based on middleware wording).

PR description template snippet
-----------------------------
Include this short paragraph in PRs that change tenant resolution:

```
Summary: Adds/changes tenant resolution middleware. Key changes: [list files].
How to test: start backend and call a store-scoped route with a valid and invalid slug (see docs/tenant-resolution.md).
Notes for reviewers: ensure `resolveTenant` is applied to all `:storeSlug` routes and controllers forward errors with `next(err)`.
```

Testing / verification
----------------------
1. Start backend as usual:

```bash
cd Backend
npm install
npm run dev
```

2. Hit a store-scoped route with a valid `storeSlug` to confirm the middleware resolves the tenant and the controller runs as expected:

```bash
curl -i http://localhost:3000/api/stores/my-store-slug/products
```

3. Hit the same route with an invalid `storeSlug` to confirm a 404 JSON response (the global handler will format this):

```bash
curl -i http://localhost:3000/api/stores/invalid-slug/products
```

Expected: 404 JSON with a helpful message.

Review & integration notes
--------------------------
- If you modify the tenant shape (e.g., rename `req.store` to `req.tenant`), update all controllers and routes accordingly.
- Consider creating a typed `Tenant` interface in `src/types/` and extending the Express `Request` type (e.g., in `src/types/express.d.ts`) for better TypeScript safety.
- Be conservative about doing DB writes in the middleware; prefer to fetch only the minimal tenant metadata required for routing/authorization.

Related links
-------------
- GitHub commit: https://github.com/MohamedEMonem/Dokkan/commit/5d03b6354a488ca239d144dd9272a965de538e27
- See `src/middleware/tenant.middleware.ts` for the implementation details.

Rollback
--------
To revert the change, revert the commit `5d03b6354a488ca239d144dd9272a965de538e27` in git. Verify dependent routes are restored to previous behavior.

Contact
-------
For questions about the tenant model or unexpected behavior, contact the commit author or file an issue describing the failing endpoint and paste server logs.
