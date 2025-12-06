# 🏪 Omni-Store: Team Repository & Workspace Guide

Welcome to the **Omni-Store** graduation project! This repository contains a full-stack e-commerce platform built with **NestJS** (Backend), **Angular** (Frontend), **Prisma** (Database), and **Nx** (Monorepo Management).

This guide ensures **all team members** understand the repository structure, development workflow, and **non-negotiable quality standards**.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Team Quality Assurance Manifesto](#team-quality-assurance-manifesto)
4. [Development Workflow](#development-workflow)
5. [Backend Standards (NestJS)](#backend-standards-nestjs)
6. [Frontend Standards (Angular)](#frontend-standards-angular)
7. [Database Standards (Prisma)](#database-standards-prisma)
8. [Common Tasks & Commands](#common-tasks--commands)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20.x or higher
- **Docker & Docker Compose**: For local infrastructure
- **Git**: Version control

### Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp env.example .env

# 3. Start infrastructure (PostgreSQL, Meilisearch, MinIO)
npm run infra:up

# 4. Run Prisma migrations
npx prisma migrate dev

# 5. Start all services (API + Frontend)
npm start

# 6. Open services
# Frontend: http://localhost:4200
# Backend API: http://localhost:3000
# Swagger Docs: http://localhost:3000/api/docs
```

### Environment Variables
Copy `env.example` to `.env` and configure:
```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydb
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydb

MEILI_MASTER_KEY=mySecureMasterKey
MINIO_ROOT_USER=minioUser
MINIO_ROOT_PASSWORD=minioSecurePassword

PORT=3000
```

---

## 📁 Project Structure

This is an **Nx Monorepo** with a modular architecture:

```
Omni-Store/
├── api/                          # Backend (NestJS)
│   ├── src/
│   │   ├── main.ts               # Entry point
│   │   ├── app/                  # App module
│   │   ├── common/               # Shared filters, decorators, exceptions
│   │   ├── modules/              # Feature modules (auth, users, products, etc.)
│   │   └── ...
│   ├── jest.config.cts           # Unit tests configuration
│   └── tsconfig.app.json
│
├── web/                          # Frontend (Angular)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app/
│   │   │   ├── app.routes.ts     # Application routing
│   │   │   ├── app.ts            # Main component
│   │   │   └── ...
│   │   ├── index.html
│   │   └── styles.css
│   └── tsconfig.app.json
│
├── web-e2e/                      # End-to-end tests (Playwright)
│   └── src/
│
├── api-e2e/                      # API integration tests
│   └── src/
│
├── libs/                         # Shared libraries
│   └── shared/
│       ├── data-access/          # Shared data services
│       └── ui/                   # Shared UI components
│
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── docker-compose.yml            # Local infrastructure
├── nx.json                        # Nx configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.base.json            # TypeScript base configuration
└── eslint.config.mjs             # ESLint configuration
```

---

## 🎯 Team Quality Assurance Manifesto

### The "Golden Rules" (Non-Negotiable)

#### 1️⃣ English Only
**All** code, comments, documentation, commits, and database names must be in **English**.

- ✅ Good: `const userEmail = "user@example.com";`
- ❌ Bad: `const emailUtilisateur = "user@example.com";`

**Why**: Ensures consistency and maintains code quality for future contributors and evaluators.

#### 2️⃣ Strict TypeScript (No `any`)
The `any` type is **strictly forbidden**. Use proper types instead.

- ✅ Good:
  ```typescript
  interface UserResponse {
    id: string;
    email: string;
    name: string;
  }
  const user: UserResponse = fetchUser();
  ```

- ❌ Bad:
  ```typescript
  const user: any = fetchUser(); // Runtime crash guaranteed!
  ```

**Why**: TypeScript's entire purpose is type safety. `any` defeats this and causes runtime crashes.

#### 3️⃣ One Feature = One Branch
**Never** commit directly to `dev` or `main`. Always use feature branches.

- Branch Naming: `feature/login-ui`, `fix/cart-bug`, `docs/api-guide`
- Workflow:
  1. Create branch from `dev`: `git checkout -b feature/your-feature`
  2. Implement feature
  3. Create Pull Request (PR) for review
  4. **Merge only after approval** (not self-merge)

**Why**: Prevents broken code from blocking the entire team.

#### 4️⃣ Swagger First (Contract-Driven Development)
**Backend**: Define API contracts (DTOs) and verify in Swagger **before** implementing logic.
**Frontend**: Build UI based on Swagger definitions, never guess the API response.

- Backend verification: Open `http://localhost:3000/api/docs` after starting the API
- Frontend usage: Inspect Swagger to understand request/response structures

**Why**: Prevents API contract mismatches ("I thought the API returned X, but it returned Y").

---

## 🔄 Development Workflow

### Step 1: Create a Feature Branch
```bash
# Update dev branch
git checkout dev
git pull origin dev

# Create feature branch (use descriptive names)
git checkout -b feature/add-product-filter
```

### Step 2: Make Your Changes
Follow the standards specific to backend/frontend (see sections below).

### Step 3: Commit with Conventional Commits
```bash
# Format: type(scope): description
git commit -m "feat(products): add filter by category"
git commit -m "fix(cart): resolve negative quantity bug"
git commit -m "style(ui): update primary button color"
git commit -m "docs(readme): update setup instructions"
```

**Types**: `feat`, `fix`, `style`, `docs`, `refactor`, `test`, `chore`

### Step 4: Push and Create Pull Request
```bash
git push origin feature/add-product-filter
```

Then create a PR on GitHub with:
- **Title**: Brief description of changes
- **Description**: What changed and why
- **Proof of Work**:
  - For UI: Screenshot/video
  - For Backend: Postman response snippet
  - For Database: Migration details

### Step 5: Code Review & Merge
- ✅ At least **1 approval** required
- ✅ **Automated checks** (Lint, Build, Tests) must pass
- ✅ **No self-merge** allowed
- After approval: Merge to `dev`

---

## 🖥️ Backend Standards (NestJS)

### Architecture: Modular Monolith

```
api/src/
├── main.ts                       # Entry point (bootstrapping)
├── app/
│   ├── app.controller.ts         # Main controller
│   ├── app.service.ts            # Main service
│   └── app.module.ts             # Main module
│
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts  # Global error handling
│   ├── decorators/               # Custom decorators
│   ├── interceptors/             # Response transformation
│   └── exceptions/               # Custom exceptions
│
└── modules/
    ├── auth/                     # Authentication & Authorization
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.module.ts
    │   └── dto/
    │       ├── login.dto.ts
    │       └── register.dto.ts
    │
    ├── users/                    # User management
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   ├── users.module.ts
    │   ├── dto/
    │   │   ├── create-user.dto.ts
    │   │   └── update-user.dto.ts
    │   └── entities/
    │       └── user.entity.ts
    │
    ├── products/                 # Product management
    └── orders/                   # Order management
```

### Separation of Concerns

#### Controllers (No Logic)
Controllers **only** handle HTTP requests and validation.

```typescript
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

#### Services (Business Logic Here)
Services contain **all** business logic and orchestrate dependencies.

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

// User interface containing only fields needed for token generation
interface User {
  id: string;
  email: string;
  roles?: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user || !await this.validatePassword(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.generateToken(user),
      user: { id: user.id, email: user.email },
    };
  }

  private generateToken(user: User): string {
    // Token generation logic using user.id, user.email, and user.roles
    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles: user.roles || [] 
    };
    return this.jwtService.sign(payload);
  }

  private async validatePassword(plain: string, hashed: string): Promise<boolean> {
    // Password validation logic
  }
}
```

### Standard Response Format

**All** endpoints must return responses wrapped in this envelope:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;        // Optional success/info message
  error: string | null;    // Null if success, error message if failed
  code: number;            // HTTP status code
}
```

Example Response:
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "message": "User created successfully",
  "error": null,
  "code": 201
}
```

Implement a Global Interceptor to standardize responses:

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: undefined,
        error: null,
        code: context.switchToHttp().getResponse().statusCode,
      })),
    );
  }
}
```

### Error Handling & Logging

#### Use NestJS Exceptions (Not `console.log`)
```typescript
import { Logger, Injectable, NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async findById(id: string) {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      
      if (!user) {
        this.logger.warn(`User not found: ${id}`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${id}`, error.stack);
      throw error;
    }
  }

  async createUser(email: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    
    if (existing) {
      this.logger.error(`Attempted to create duplicate user: ${email}`);
      throw new ConflictException('Email already registered');
    }
    
    return prisma.user.create({ data: { email } });
  }
}
```

#### Standard Exceptions
- `NotFoundException` (404): Resource does not exist
- `ConflictException` (409): Duplicate resource (e.g., email taken)
- `UnauthorizedException` (401): Authentication failed
- `ForbiddenException` (403): Permission denied (role mismatch)
- `BadRequestException` (400): Invalid input
- `InternalServerErrorException` (500): Unexpected server error

### DTOs & Validation

Always define DTOs (Data Transfer Objects) for request/response validation.

```typescript
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
```

---

## 🎨 Frontend Standards (Angular)

### UI Component Usage: PrimeNG

Use **PrimeNG** components for all standard UI elements. Do **not** build custom versions.

```html
<!-- ✅ Good: Using PrimeNG Table -->
<p-table [value]="products$ | async" [paginator]="true" [rows]="10">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
      <th>Price</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-product>
    <tr>
      <td>{{ product.name }}</td>
      <td>{{ product.price | currency }}</td>
    </tr>
  </ng-template>
</p-table>

<!-- ❌ Bad: Custom table implementation -->
<div class="custom-table">
  <div *ngFor="let product of products$ | async">
    {{ product.name }} - {{ product.price }}
  </div>
</div>
```

### Tailwind CSS for Layout & Styling

Use Tailwind utility classes for layout, spacing, and colors. Avoid custom CSS files.

```html
<!-- ✅ Good: Tailwind utilities -->
<div class="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg">
  <h2 class="text-2xl font-bold text-gray-900">Products</h2>
  <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Add Product
  </button>
</div>

<!-- ❌ Bad: Custom CSS -->
<div class="custom-container">
  <h2>Products</h2>
  <button>Add Product</button>
</div>
```

### State Management: Angular Signals

Prefer `signal()` and `computed()` over RxJS BehaviorSubject chains for local component state.

```typescript
import { Component, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products-list',
  template: `
    <div *ngFor="let product of filteredProducts()">
      {{ product.name }}
    </div>
  `,
})
export class ProductsListComponent {
  products = signal<Product[]>([]);
  filterText = signal('');

  filteredProducts = computed(() =>
    this.products().filter(p =>
      p.name.toLowerCase().includes(this.filterText().toLowerCase())
    )
  );

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts() {
    this.http.get<Product[]>('/api/products').subscribe(data => {
      this.products.set(data);
    });
  }
}
```

### Component Patterns

#### Smart (Page) Components
Connect to services, fetch data, handle routing.

```typescript
@Component({
  selector: 'app-products-page',
  template: `
    <app-products-list [products]="products$ | async">
    </app-products-list>
  `,
})
export class ProductsPageComponent {
  products$ = this.productService.getProducts();

  constructor(private productService: ProductService) {}
}
```

#### Dumb (UI) Components
Receive data via `@Input()`, emit events via `@Output()`. **Zero API logic**.

```typescript
@Component({
  selector: 'app-products-list',
  template: `
    <div *ngFor="let product of products">
      <button (click)="onSelectProduct(product)">
        {{ product.name }}
      </button>
    </div>
  `,
})
export class ProductsListComponent {
  @Input() products!: Product[];
  @Output() productSelected = new EventEmitter<Product>();

  onSelectProduct(product: Product) {
    this.productSelected.emit(product);
  }
}
```

### Performance: Lazy Loading

All feature modules must be lazy-loaded.

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'storefront',
    loadChildren: () => import('./modules/storefront/storefront.module').then(m => m.StorefrontModule),
  },
];
```

---

## 💾 Database Standards (Prisma)

### Schema File Location
`prisma/schema.prisma`

### Naming Conventions

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String
  isVerified        Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Soft delete for data integrity
  deletedAt         DateTime?
  
  // Relations (camelCase)
  orders            Order[]
  
  @@map("users")  // Database table: users (snake_case)
}

model Order {
  id                String    @id @default(cuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  status            OrderStatus
  totalAmount       Float
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?
  
  @@map("orders")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

**Naming Rules**:
- **Models**: PascalCase (`User`, `ProductImage`, `OrderHistory`)
- **Fields**: camelCase (`isVerified`, `shippingAddress`, `totalAmount`)
- **Database columns**: snake_case via `@map()` (Prisma handles conversion)
- **Enums**: UPPER_SNAKE_CASE

### Data Integrity: Soft Deletes

Do **not** physically delete critical data. Add a `deletedAt` field and filter queries.

```prisma
model User {
  id        String    @id
  email     String
  deletedAt DateTime?
}
```

Always filter soft-deleted records:

```typescript
// ✅ Good: Exclude deleted users
const activeUsers = await prisma.user.findMany({
  where: { deletedAt: null },
});

// ❌ Bad: Returns deleted users too
const allUsers = await prisma.user.findMany();
```

### Transactions for Data Consistency

Use `prisma.$transaction()` for operations affecting multiple tables.

```typescript
// ❌ Bad: Two separate operations (order might fail after stock decremented)
await prisma.stock.update({
  where: { productId },
  data: { quantity: { decrement: 1 } },
});

await prisma.order.create({
  data: { userId, productId, quantity: 1 },
});

// ✅ Good: Atomic transaction
await prisma.$transaction([
  prisma.stock.update({
    where: { productId },
    data: { quantity: { decrement: 1 } },
  }),
  prisma.order.create({
    data: { userId, productId, quantity: 1 },
  }),
]);
```

### Running Migrations

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name add_user_verification

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only!)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Open Prisma Studio to inspect data
npx prisma studio
```

---

## 🛠️ Common Tasks & Commands

### Starting Services

```bash
# Start all services (API + Frontend)
npm start

# Start only API
npx nx serve api

# Start only Frontend
npx nx serve web

# View infrastructure logs
npm run infra:logs
```

### Testing

```bash
# Run all tests
npx nx run-many -t test

# Run tests for specific project
npx nx test api
npx nx test web

# Run tests with coverage
npx nx run-many -t test --coverage

# Run e2e tests (Playwright)
npx nx e2e web-e2e
```

### Linting & Formatting

```bash
# Lint all projects
npx nx run-many -t lint

# Fix linting issues
npx nx run-many -t lint --fix

# Format code with Prettier
npx nx format:write
```

### Building

```bash
# Build all projects
npx nx run-many -t build

# Build specific project
npx nx build api
npx nx build web
```

### Database Management

```bash
# Run Prisma migrations
npx prisma migrate dev --name your_migration_name

# View database in Prisma Studio
npx prisma studio

# Generate Prisma Client (auto-runs after migrate)
npx prisma generate

# Seed database with test data
npx prisma db seed
```

### Git Workflow

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Stage and commit changes
git add .
git commit -m "feat(scope): description"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# (Link to this PR in your team's management tool)

# After approval, merge (maintainer will merge, not you)
git checkout dev
git pull origin dev
```

---

## 👶 The "Beginner" Member Protocol

To ensure learning without risking project stability:

### 1. Read-Only Access to Core Logic
Beginners do **not** modify critical services like `AuthService` or `PaymentService` initially.

### 2. Seed Master
Beginners own `prisma/seed.ts`. When the team needs mock data:
- "I need 100 orders to test pagination" → Beginner writes the seed script
- "Add 50 fake users" → Beginner updates `seed.ts`

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  // Create mock users
  for (let i = 0; i < 50; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `User ${i}`,
      },
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Run with: `npx prisma db seed`

### 3. Manual QA
Beginners act as the first line of QA:
- Manually test features (e.g., try to break the checkout flow)
- Log tickets for bugs found
- Test edge cases: empty carts, invalid inputs, network failures

---

## 📚 Documentation Standard

**Every significant function or module must have a JSDoc comment** explaining the "Why" and "How".

```typescript
/**
 * Calculates the final order total, including tax and shipping.
 * 
 * This method applies sales tax based on the shipping address and adds
 * a flat-rate shipping fee. It ensures the total is always positive
 * (throws if calculation results in negative total).
 * 
 * @param subtotal - The sum of all cart item prices (before tax/shipping)
 * @param shippingCost - Flat rate shipping fee in USD
 * @param taxRate - Sales tax rate as decimal (e.g., 0.08 for 8%)
 * @returns The final amount to charge the user, inclusive of tax and shipping
 * @throws BadRequestException if subtotal is negative
 * 
 * @example
 * const total = calculateTotal(100, 10, 0.08); // Returns 118.8
 */
calculateTotal(subtotal: number, shippingCost: number, taxRate: number): number {
  if (subtotal < 0) {
    throw new BadRequestException('Subtotal cannot be negative');
  }
  
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;
  
  return Math.round(total * 100) / 100; // Round to 2 decimal places
}
```

---

## 🐛 Troubleshooting

### Issue: Database connection fails
```bash
# Check Docker containers are running
docker ps

# Start infrastructure
npm run infra:up

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### Issue: Swagger docs not showing new endpoints
```bash
# Rebuild API with Swagger decorators
npx nx build api

# Restart the API
npx nx serve api
```

### Issue: Port 3000 or 4200 already in use
```bash
# Kill process on port 3000 (API)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 4200 (Frontend)
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Issue: TypeScript compilation errors with `any`
```bash
# The linter will catch `any` usage. Fix all instances:
npx nx run-many -t lint --fix

# If still failing, check the error:
npx nx lint api
```

### Issue: Tests failing
```bash
# Run tests in watch mode to debug
npx nx test api --watch

# Check test coverage
npx nx test api --coverage
```

---

## 📞 Team Communication

- **Questions about architecture?** Refer to Backend/Frontend Standards sections
- **Need to add a feature?** Create a branch and open a PR with proof of work
- **Found a bug?** Log an issue with reproduction steps
- **Need help?** Ask in team chat before starting random changes

---

## ✅ Pre-Submission Checklist (Before Creating PR)

- [ ] Code follows TypeScript strict mode (no `any`)
- [ ] All comments and commit messages are in English
- [ ] Backend: Swagger docs updated with new endpoints
- [ ] Frontend: No custom CSS (used Tailwind only)
- [ ] Database: Migrations created and tested
- [ ] Tests pass: `npx nx test api` / `npx nx test web`
- [ ] Linting passes: `npx nx lint`
- [ ] JSDoc comments added for all functions
- [ ] Proof of work included (screenshot/API response)
- [ ] No direct commits to `dev` or `main`

---

## 🎓 Graduation Project Excellence

By adhering to these standards, we ensure our codebase is:
- ✅ **Clean**: Easy to read and maintain
- ✅ **Scalable**: Modular architecture supports growth
- ✅ **Defensive**: Strong typing and error handling prevent runtime crashes
- ✅ **Professional**: Ready for evaluation and production-grade

**Let's build something amazing together!** 🚀

---

*Last Updated: December 6, 2024*  
*Maintained by: Team Lead*
