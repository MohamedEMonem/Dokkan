# 🎯 Common Scenarios & Workflows

Real-world examples for everyday development tasks.

---

## 👨‍💼 Scenario 1: Starting Your Day

### Step 1: Pull Latest Changes
```bash
git pull origin dev
```

### Step 2: Ensure Services Are Running
```bash
npm run infra:up          # Start Docker if not running
npm run db:migrate        # Apply any new migrations
```

### Step 3: Start Developing
```bash
# If frontend dev:
npm run start:web
npm run test:web:watch

# If backend dev:
npm run start:api
npm run test:api:watch

# If full stack:
npm start
npm run test:watch
```

### Done!
- Open http://localhost:4200 (frontend) or http://localhost:3000 (API)
- Start coding!

---

## 🎨 Scenario 2: Building a New Feature (Frontend)

### Step 1: Create Feature Branch
```bash
git checkout -b feature/user-dashboard
```

### Step 2: Start Development
```bash
npm run start:web
```

### Step 3: Create Component
Create file: `web/src/app/pages/dashboard.tsx`

```typescript
export function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* Your code here */}
    </div>
  );
}
```

### Step 4: Add Route
Edit: `web/src/app/app.tsx`

```typescript
import { Dashboard } from './pages/dashboard';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
```

### Step 5: Write Tests
Create: `web/src/app/pages/dashboard.spec.tsx`

```typescript
import { render } from '@testing-library/react';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  it('should render', () => {
    const { container } = render(<Dashboard />);
    expect(container).toBeTruthy();
  });
});
```

### Step 6: Test Your Code
```bash
npm run test:web:watch
# Should show your test passing
```

### Step 7: Check Code Quality
```bash
npm run lint:web:fix
npm run format
```

### Step 8: Commit & Push
```bash
git add .
git commit -m "feat: add user dashboard"
git push origin feature/user-dashboard
```

### Step 9: Create Pull Request
Go to GitHub and create a PR.

---

## 🔌 Scenario 3: Building a New API Endpoint (Backend)

### Step 1: Create Feature Branch
```bash
git checkout -b feature/products-api
```

### Step 2: Start Development
```bash
npm run start:api
```

### Step 3: Create Endpoint
Create: `api/src/products/products.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  async getAllProducts() {
    return this.service.findAll();
  }
}
```

### Step 4: Create Service
Create: `api/src/products/products.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nestjs/prisma';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany();
  }
}
```

### Step 5: Write Tests
Create: `api/src/products/products.controller.spec.ts`

```typescript
import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
```

### Step 6: Test Your API
```bash
npm run test:api:watch
# Should show tests passing

# View API docs at:
# http://localhost:3000/api/docs
```

### Step 7: Check Code Quality
```bash
npm run lint:api:fix
npm run format
```

### Step 8: Commit & Push
```bash
git add .
git commit -m "feat: add products API endpoint"
git push origin feature/products-api
```

### Step 9: Create Pull Request
Go to GitHub and create a PR.

---

## 🗄️ Scenario 4: Creating a Database Migration

### Step 1: Modify Schema
Edit: `prisma/schema.prisma`

```prisma
model Product {
  id    Int     @id @default(autoincrement())
  name  String
  price Float
  stock Int     @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Step 2: Create Migration
```bash
npx prisma migrate dev --name add_products_table
```

This:
- ✅ Applies migration to DB
- ✅ Updates Prisma client
- ✅ Creates migration file

### Step 3: Verify in Database
```bash
npm run db:studio
# Opens GUI - you should see the new table
```

### Step 4: Use in Code
```typescript
// In your service
const product = await prisma.product.create({
  data: {
    name: 'Laptop',
    price: 999.99,
    stock: 10,
  },
});
```

### Step 5: Commit
```bash
git add prisma/
git commit -m "feat: add products table"
```

---

## 🧪 Scenario 5: Fixing a Bug

### Step 1: Create Bug Fix Branch
```bash
git checkout -b fix/user-login-issue
```

### Step 2: Understand the Bug
```bash
npm run start:api
npm run test:api:watch  # Look for failing tests
```

### Step 3: Find the Problem
```bash
# Reproduce the issue
# Check logs: npm run infra:logs
# Check database: npm run db:studio
# Check API docs: http://localhost:3000/api/docs
```

### Step 4: Write a Test for the Bug
```typescript
describe('Login', () => {
  it('should fail with invalid email', async () => {
    const result = await loginService.login('invalid-email', 'password');
    expect(result).toBeNull();
  });
});
```

### Step 5: Fix the Code
```typescript
// Now make the test pass
if (!isValidEmail(email)) {
  return null;
}
```

### Step 6: Verify Fix
```bash
npm run test:api:watch  # Test should pass
npm run lint:api:fix    # Fix linting
```

### Step 7: Commit
```bash
git add .
git commit -m "fix: resolve user login issue"
git push origin fix/user-login-issue
```

---

## 🚀 Scenario 6: Preparing for Production

### Step 1: Pull Latest
```bash
git pull origin master
```

### Step 2: Run Full Test Suite
```bash
npm run test:coverage
# All tests should pass
```

### Step 3: Build Everything
```bash
npm run build
```

### Step 4: Build Docker Images
```bash
docker compose build
```

### Step 5: Test in Docker
```bash
docker compose up -d
# Visit http://localhost:4200
# Visit http://localhost:3000/api/docs
```

### Step 6: Stop Docker
```bash
npm run infra:down
```

### Step 7: Tag Release
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 🔄 Scenario 7: Code Review & Merging

### Step 1: Get Latest
```bash
git checkout dev
git pull origin dev
```

### Step 2: Create Feature Branch
```bash
git checkout -b feature/my-feature
```

### Step 3: Make Changes & Tests Pass
```bash
npm run lint:fix
npm run test
npm run format
```

### Step 4: Push & Create PR
```bash
git push origin feature/my-feature
# Create PR on GitHub
```

### Step 5: Address Review Feedback
```bash
# Make requested changes
npm run test
npm run lint:fix
git add .
git commit -m "address review feedback"
git push origin feature/my-feature
```

### Step 6: After Approval
```bash
# GitHub handles merge or:
git checkout dev
git merge feature/my-feature
git push origin dev
```

---

## 🆘 Scenario 8: Debugging an Issue

### Step 1: Gather Information
```bash
# Check logs
npm run infra:logs

# Check database state
npm run db:studio

# Check API response
curl http://localhost:3000/api/endpoint

# Check browser console (for frontend)
# Right-click → Inspect → Console tab
```

### Step 2: Add Debug Logs
```typescript
// Frontend
console.log('Debug:', value);

// Backend
this.logger.debug('Debug message', value);
```

### Step 3: Run Tests
```bash
npm run test:watch
# Tests should reveal the issue
```

### Step 4: Use Debugger (VS Code)
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "program": "${workspaceFolder}/dist/api/main.js",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

### Step 5: Set Breakpoint & Debug
- Place breakpoint in code (click line number)
- Run debugger
- Inspect variables

---

## 📊 Scenario 9: Monitoring Health

### Daily Checks
```bash
# All tests pass?
npm run test

# Code quality ok?
npm run lint

# Services running?
npm run infra:logs

# Database ok?
npm run db:studio
```

### View Project Status
```bash
npm run nx:graph  # Visualize dependencies
```

---

## ⚠️ Scenario 10: Emergency Fixes

### Database Corrupted?
```bash
npm run infra:clean     # Delete everything
npm run infra:up        # Start fresh
npm run db:migrate      # Recreate tables
npm run db:seed         # Add sample data
```

### Can't Connect to API?
```bash
npm run infra:logs      # Check what failed
npm run start:api       # Try manually
curl http://localhost:3000  # Test connection
```

### Frontend Broken?
```bash
rm -rf node_modules/.vite   # Clear cache
npm run start:web           # Restart
```

### Everything Broken?
```bash
npm run infra:clean     # Stop everything
rm -rf node_modules
npm install --legacy-peer-deps
npm run infra:up
npm run db:migrate
npm start               # Start fresh
```

---

## 💡 Pro Tips

1. **Keep terminal organized** - Use VS Code terminal split or multiple windows
2. **Use git frequently** - Commit often, small changes easier to debug
3. **Write tests as you code** - Catch bugs early
4. **Check logs first** - Most issues revealed in logs
5. **Ask for help early** - Don't struggle alone
6. **Document your changes** - Future you will thank you

---

## 📞 When Stuck

1. Re-read relevant scenario above
2. Check QUICK_REFERENCE.md
3. Check DEVELOPMENT.md
4. Check README.md
5. Google the error
6. Check GitHub issues
7. Ask your team

Good luck! 🚀
