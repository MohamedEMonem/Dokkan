# 📖 Contributing Guide - Omni-Store

Thank you for contributing to the Omni-Store project! Please follow these guidelines to ensure smooth collaboration.

## Workflow

### 1. Setup Your Local Environment
```bash
git clone <repository-url>
cd Omni-Store
npm install
cp env.example .env
npm run infra:up
npm run db:migrate
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Adding tests

### 3. Make Your Changes

#### Code Standards
- Write clean, readable code
- Follow existing code style
- Add JSDoc comments for complex functions
- Keep functions small and focused

#### Commit Messages
Use clear, descriptive commit messages:
```
feat: add user registration endpoint
fix: resolve login validation issue
docs: update API documentation
refactor: simplify authentication logic
test: add unit tests for user service
```

### 4. Before Submitting

#### Run Quality Checks
```bash
# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm run test

# Check coverage
npm run test:coverage
```

#### Test Your Changes
```bash
# For backend changes
nx test api
nx test api-e2e

# For frontend changes
nx test web
nx test web-e2e

# Run all tests
npm run test
```

### 5. Submit Pull Request

#### PR Requirements
- ✅ All tests passing
- ✅ Code linted and formatted
- ✅ No coverage regression
- ✅ Clear description of changes
- ✅ Links to related issues
- ✅ Updated documentation if needed

#### PR Template
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Testing
How was this tested?

## Checklist
- [ ] Tests added/updated
- [ ] Code linted
- [ ] Documentation updated
- [ ] No breaking changes
```

---

## Architecture Guidelines

### Backend (NestJS/API)

#### File Structure
```
api/src/
├── main.ts                 # Entry point
├── app/                    # App module
├── common/                 # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
├── modules/                # Feature modules
│   ├── auth/
│   ├── users/
│   ├── products/
│   └── [feature]/
└── config/                 # Configuration
```

#### Module Structure
Each feature should have:
```
feature/
├── feature.controller.ts
├── feature.service.ts
├── feature.module.ts
├── dto/
│   ├── create-feature.dto.ts
│   └── update-feature.dto.ts
├── entities/
│   └── feature.entity.ts
└── feature.service.spec.ts
```

#### Best Practices
- Use DTOs for input validation
- Implement proper error handling
- Add middleware for logging
- Use guards for authorization
- Document endpoints with Swagger decorators

### Frontend (Angular)

#### File Structure
```
web/src/
├── main.ts                 # Entry point
├── app/
│   ├── app.routes.ts       # Routing
│   ├── app.ts              # Root component
│   ├── components/         # Shared components
│   ├── services/           # Services
│   ├── pages/              # Page components
│   └── models/             # TypeScript interfaces
└── assets/                 # Static assets
```

#### Component Structure
```
feature/
├── feature.component.ts
├── feature.component.html
├── feature.component.css
├── feature.component.spec.ts
└── feature.service.ts
```

#### Best Practices
- Use standalone components (Angular 14+)
- Implement proper type safety
- Use reactive forms
- Add unit tests for components
- Use signals for state management

### Database (Prisma)

#### Model Guidelines
```prisma
model Feature {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Migration Workflow
```bash
# Make schema changes in prisma/schema.prisma
# Create and apply migration
npm run db:migrate

# Review migration in prisma/migrations/
# Test thoroughly before pushing
```

---

## Code Review Checklist

When reviewing PRs, ensure:

- [ ] Code follows project conventions
- [ ] Tests are comprehensive
- [ ] No console.log statements in production code
- [ ] Error handling is proper
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact assessed
- [ ] Backwards compatibility maintained

---

## Testing Guidelines

### Unit Tests
```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    // Setup
  });

  it('should create a user', async () => {
    // Arrange
    const data = { name: 'John' };
    
    // Act
    const result = await service.create(data);
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

### Minimum Coverage
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

### E2E Tests
```typescript
test('should display login form', async ({ page }) => {
  await page.goto('http://localhost:4200/login');
  await expect(page.locator('form')).toBeVisible();
});
```

---

## Commit Workflow

### Before Commit
```bash
# Stage changes
git add .

# Review staged changes
git diff --cached

# Commit with message
git commit -m "feat: your feature"
```

### Push to Remote
```bash
# Push your branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

---

## Common Issues

### Tests Failing
1. Clear node_modules: `rm -r node_modules && npm install`
2. Reset database: `npm run infra:clean && npm run infra:up && npm run db:migrate`
3. Check for environment variables

### Linting Errors
```bash
npm run lint:fix  # Auto-fix most issues
```

### Build Failures
```bash
npm run build
# Check output for errors and address them
```

---

## Questions?

- 📖 Read [DEVELOPMENT.md](DEVELOPMENT.md)
- 📚 Check existing code examples
- 💬 Ask in team communications
- 📋 Review open issues and PRs

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Happy coding! 🎉
