# Product API Documentation

Navigation

- [Docs index](README.md)
- [TOC](TOC.md)
- [Ultimate guide](ultimate-backend-guide.md)

## Overview
This document describes the Product Controller and Product Routes for the Backend API.

## Routes (store-scoped)
Routes are registered under the store-scoped path: `/api/stores/:storeSlug/products`.

### Endpoints
- `GET /api/stores/:storeSlug/products` — List products (supports query filters)
- `GET /api/stores/:storeSlug/products/:id` — Retrieve product by id
- `POST /api/stores/:storeSlug/products` — Create product (multipart optional)
- `PUT /api/stores/:storeSlug/products/:id` — Update product
- `DELETE /api/stores/:storeSlug/products/:id` — Soft-delete product

## ProductController (implementation notes)
- Controllers are implemented in `src/controllers/ProductController.ts` and are typed for Express.
- Controllers now expect tenant context from `resolveTenant` middleware — read `req.store?.id` for `storeId`.

### Important behaviors
- Creation may upload an image to object storage; on DB error the uploaded image is cleaned up where possible.
- Price and stock validation are enforced in controller before DB operations.

## Error handling
- The controllers forward unexpected errors to the global error handler (via `next(err)`) rather than sending responses directly. The standardized response helpers in `src/utils/response.ts` are used by the global handler.

Reference: `src/controllers/ProductController.ts`

Back to index: [Docs index](README.md)
