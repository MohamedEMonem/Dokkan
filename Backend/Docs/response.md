# Response Utilities

Navigation

- [Docs index](README.md)
- [TOC](TOC.md)
- [Ultimate guide](ultimate-backend-guide.md)

Centralized helpers used to format API responses consistently.

Location: `src/utils/response.ts`

Available helpers
- `sendSuccess(res, data, message, statusCode = 200)` — successful responses.
- `sendError(res, message, statusCode = 400, error = null)` — client errors or general errors with customizable status.
- `sendValidationError(res, errors)` — 422 validation response (used by zod validators).
- `sendNotFound(res, message = 'Resource not found')` — 404 response.
- `sendUnauthorized(res, message = 'Unauthorized')` — 401 response.
- `sendForbidden(res, message = 'Access forbidden')` — 403 response.
- `sendRateLimitExceeded(res, message)` — 429 response.
- `sendServerError(res, message = 'Internal server error', error = null)` — 500 response with optional error logging. In production the error details are hidden.

Notes for middleware/controllers
- Do not call these helpers directly from middleware for unexpected errors — forward errors to the global handler using `next(err)` and let it call `sendError`/`sendServerError` centrally.
- For expected client responses (e.g., validation failure inside controller), you may still use these helpers, or convert to an `Error` with `err.status` and forward it to the handler if you prefer centralized formatting.

Response JSON shape
```
{
  "success": boolean,
  "data": object | null,
  "message": string | null,
  "error": unknown,
  "code": number
}
```

Back to docs index: [Docs index](README.md)
