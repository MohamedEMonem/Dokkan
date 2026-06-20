# Category API Documentation

Navigation

- [Docs index](README.md)
- [TOC](TOC.md)
- [Ultimate guide](ultimate-backend-guide.md)

## Routes (store-scoped)
Category routes are registered under `/api/stores/:storeSlug/categories` and are scope-aware via `resolveTenant`.

### Endpoints
- `GET /api/stores/:storeSlug/categories` — List categories
- `GET /api/stores/:storeSlug/categories?parentCategoryId=<uuid>` — List subcategories for one parent category
- `GET /api/stores/:storeSlug/categories/:id` — Get category by id
- `POST /api/stores/:storeSlug/categories` — Create category or subcategory
- `PUT /api/stores/:storeSlug/categories/:id` — Update category or move it under another parent
- `DELETE /api/stores/:storeSlug/categories/:id` — Delete category (requires no children / no products)

## Controller notes
- Implementation is in `src/controllers/CategoryController.ts`.
- Validation uses `zod` schemas defined at the top of the controller.
- Parent category relations are validated to prevent cycles and moving a category under its descendant.
- Category reads and writes are store-scoped when tenant context is available.

## Payload examples
- Create subcategory: `{"name":"Mobile Phones","parentCategoryId":"<parent-category-id>"}`
- Move a category: `{"parentCategoryId":"<new-parent-category-id>"}`

## Error handling
- Expected client errors (validation, missing parent, conflict when children/products exist) return 4xx responses using the shared response helpers.
- Unexpected errors are forwarded to the global handler.

Back to index: [Docs index](README.md)