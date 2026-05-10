# Product API Documentation

## Overview
This document describes the Product Controller and Product Routes for the Backend API.

## ProductRoutes.js
Defines all HTTP endpoints for product-related operations.

### Endpoints
- `GET /products` - Retrieve all products
- `GET /products/:id` - Retrieve a specific product by ID
- `POST /products` - Create a new product
- `PUT /products/:id` - Update an existing product
- `DELETE /products/:id` - Delete a product

## ProductController.js
Handles business logic for product operations.

### Methods
- `getAllProducts()` - Fetches all products from the database
- `getProductById(id)` - Fetches a product by ID
- `createProduct(data)` - Creates a new product with validation
- `updateProduct(id, data)` - Updates product information
- `deleteProduct(id)` - Removes a product from the database

## Error Handling
All endpoints return appropriate HTTP status codes and error messages for validation failures and server errors.
