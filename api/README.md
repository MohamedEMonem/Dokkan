# 🔌 API - NestJS Backend

Backend API for Omni-Store e-commerce platform built with NestJS.

---

## 📖 Quick Reference

### Start Development Server
```bash
npm run start:api
```
Server runs on **http://localhost:3000**

### API Documentation
Open **http://localhost:3000/api/docs** (Swagger UI)

### Run Tests
```bash
npm run test:api              # Run once
npm run test:api:watch        # Auto-rerun on changes
npm run test:api:coverage     # With coverage report
```

### Check Code Quality
```bash
npm run lint:api              # Check for issues
npm run lint:api:fix          # Auto-fix issues
```

### Build for Production
```bash
npm run build:api
```

---

## 📁 Project Structure

```
api/
├── src/
│   ├── main.ts               # Entry point
│   ├── app/                  # App module & controller
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── app.module.ts
│   ├── users/                # User management
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── common/
│   │   └── filters/          # Exception handling
│   └── assets/               # Static files
├── jest.config.cjs           # Test configuration
├── tsconfig.app.json         # TypeScript config
└── Dockerfile                # Docker container setup
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL running (via `npm run infra:up`)
- Redis running (via `npm run infra:up`)

### First Time Setup
```bash
# 1. From project root, ensure dependencies are installed
npm install

# 2. Ensure database is running
npm run infra:up

# 3. Setup database
npm run db:migrate

# 4. Start the API
npm run start:api
```

### Verify It Works
```bash
# Test the API is running
curl http://localhost:3000/

# View API documentation
# Open browser to: http://localhost:3000/api/docs
```

---

## 🛠️ Common Commands

### Development
```bash
npm run start:api             # Start dev server (port 3000)
npm run start:api --          # With additional Nx args
```

### Testing
```bash
npm run test:api              # Run all tests
npm run test:api:watch        # Watch mode (auto-rerun)
npm run test:api:coverage     # Generate coverage report
```

### Code Quality
```bash
npm run lint:api              # Check code
npm run lint:api:fix          # Auto-fix issues
npm run format                # Format with Prettier
```

### Building
```bash
npm run build:api             # Production build
```

### Database
```bash
npm run db:migrate            # Apply migrations
npm run db:studio             # Open Prisma Studio
npm run db:seed               # Seed sample data
```

---

## 🏗️ Architecture

### Project Organization
- **Controllers** - Handle HTTP requests
- **Services** - Business logic
- **DTOs** - Data validation & transfer
- **Filters** - Exception handling
- **Modules** - Feature grouping

### Key Dependencies
- **NestJS** - Framework
- **Prisma** - Database ORM
- **TypeScript** - Type safety
- **Jest** - Testing
- **Swagger** - API documentation

---

## 🌐 API Endpoints

### Base URL
```
http://localhost:3000
```

### Example Endpoints

**Health Check**
```bash
GET /
# Response: { "message": "Hello api" }
```

**Users**
```bash
GET /api/users
POST /api/users
GET /api/users/:id
PATCH /api/users/:id
DELETE /api/users/:id
```

### Full Documentation
Visit **http://localhost:3000/api/docs** for complete API documentation with request/response examples.

---

## 💾 Database

### View Database
```bash
npm run db:studio            # Opens Prisma Studio (GUI)
```

### Run Migrations
```bash
npm run db:migrate           # Apply pending migrations
```

### Create Migration
```bash
npx prisma migrate dev --name add_users_table
```

### Reset Database (⚠️ Deletes all data!)
```bash
npm run infra:clean
npm run infra:up
npm run db:migrate
```

---

## 🧪 Testing

### Run Tests
```bash
npm run test:api             # Run all tests once
npm run test:api:watch       # Run in watch mode
npm run test:api:coverage    # Generate coverage
```

### Test File Examples
```
api/src/**/*.spec.ts
```

### Writing Tests
```typescript
describe('AppService', () => {
  it('should return "Hello api"', () => {
    const service = new AppService();
    expect(service.getData()).toBe({ message: 'Hello api' });
  });
});
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (example PID: 1234)
taskkill /PID 1234 /F
```

### Database Connection Failed
```bash
# Check if Docker services are running
npm run infra:logs

# Restart services
npm run infra:clean
npm run infra:up
npm run db:migrate
```

### Prisma Client Out of Sync
```bash
npx prisma generate
npm run db:migrate
```

### Tests Failing
```bash
# Clear jest cache
npx jest --clearCache

# Run tests again
npm run test:api
```

### Hot Reload Not Working
```bash
# Restart dev server
npm run start:api
```

---

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [REST API Best Practices](https://restfulapi.net/)

---

## 👥 Development Tips

### Format Code Automatically
```bash
npm run format
```

### Check Code Quality Issues
```bash
npm run lint:api
```

### Use Prisma Studio for Testing Queries
```bash
npm run db:studio
```

### Generate New Resource
```bash
# Using NestJS CLI (install if needed)
npx @nestjs/cli generate resource feature-name
```

---

## 🚀 Deploying

### Build for Production
```bash
npm run build:api
```

### Run in Docker
```bash
# Build and run with Docker
docker compose up web api postgres redis meilisearch minio
```

---

## ❓ Need Help?

- Check this file first
- Ask in team chat
- Check [main README](../README.md)
- Check [DEVELOPMENT.md](../DEVELOPMENT.md)
