const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    version: '1.0.0',
    title: 'Dokkan Backend API',
    description: 'High-coverage API documentation for the Dokkan e-commerce platform, including auth, stores, catalog, cart, orders, and reviews.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Auth', description: 'User Registration, Login, and Profile Management' },
    { name: 'User', description: 'Authenticated User Profile Management' },
    { name: 'Stores', description: 'Store Creation and Management' },
    { name: 'Categories', description: 'Product Categories' },
    { name: 'Products',   description: 'Product Catalog and Inventory' },
    { name: 'Cart',       description: 'Shopping Cart Operations' },
    { name: 'Orders',     description: 'Order Placement, Tracking, and Status Management' },
    { name: 'Reviews',    description: 'Product and Store Review Lifecycle' },
    { name: 'Plans',      description: 'Subscription Plans and Store Billing' },
    { name: 'Test Email', description: 'Manual Email Delivery Test Endpoints' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    },
    schemas: {
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          data: { type: 'null', example: null },
          message: { type: 'string', example: 'Validation failed' },
          error: { type: 'object' },
          code: { type: 'integer', example: 422 },
        }
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 42 },
          totalPages: { type: 'integer', example: 3 },
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
// CRITICAL: Pointing ONLY to server.ts ensures /api/ routes are not fragmented!
const endpointsFiles = ['./src/server.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});