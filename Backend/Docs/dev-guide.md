# Developer Guide (short)

Navigation

- [Docs index](README.md)
- [TOC](TOC.md)
- [Ultimate guide](ultimate-backend-guide.md)

Purpose: Quick onboarding and essential conventions for backend contributors.

Essentials
- Start the server: `cd Backend && npm install && npm run dev`
- DB migrations: `npm run db:migrate`
- Health endpoint: `GET /api/health`

Conventions
- Error handling: All unexpected errors must be forwarded to Express global error handler via `next(err)` with `err.status` when appropriate. See [error handling](error-handling.md) and [middleware reference](middleware.md).
- Tenant-aware routes: Use `resolveTenant` middleware for all routes under `/api/stores/:storeSlug` and rely on `req.store`.
- Response helpers: Use centralized helpers in `src/utils/response.ts` for consistent shapes; prefer the global handler for formatting.
- Type safety: Add/extend `src/types/express.d.ts` when attaching new properties to `req` (e.g., `req.store`, `req.user`).

Testing
- Use Postman collection at [Dokkan Auth collection](Dokkan_Auth.postman_collection.json) for auth flows.
- Manual checks: invalid slug → 404 JSON; invalid token → 401 JSON; unexpected throw → 500 JSON.

Pull Request checklist
- Include testing steps in the PR body
- Add/modify docs under `Backend/docs` when behavior or API changes
- Run linter/tests before requesting review

Back to docs index: [Docs index](README.md)
