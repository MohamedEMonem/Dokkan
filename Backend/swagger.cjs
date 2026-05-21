const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    version: '1.0.0',
    title: 'Dokkan Backend API',
    description: 'Comprehensive API documentation for the Dokkan e-commerce platform.',
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
    { name: 'Orders',     description: 'Order Placement, Tracking, and Status Management' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
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