# 🚀 Development Guide - Omni-Store

This guide provides quick reference for common development tasks and workflows.

## Getting Started

### Prerequisites
- Node.js v20.x or higher
- Docker & Docker Compose
- Git

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp env.example .env

# 3. Start infrastructure
npm run infra:up

# 4. Setup database
npm run db:migrate

# 5. Start development servers
npm start
```

---

## 📝 Common Commands

### Development
```bash
npm start              # Start all dev servers (API + Web)
npm run build          # Build all projects
npm run test           # Run all tests
npm run test:coverage  # Run tests with coverage
npm run lint           # Lint all projects
npm run lint:fix       # Lint and auto-fix
npm run format         # Format code with Prettier
```

### Infrastructure
```bash
npm run infra:up       # Start Docker services
npm run infra:down     # Stop Docker services
npm run infra:clean    # Stop services and remove volumes
npm run infra:logs     # View Docker logs
```

### Database
```bash
npm run db:migrate     # Run Prisma migrations
npm run db:studio      # Open Prisma Studio (Database GUI)
npm run db:seed        # Seed database with initial data
```

### Testing & QA
```bash
npm run test           # Run unit tests
npm run test:coverage  # Generate coverage reports
npm run e2e            # Run end-to-end tests
npm run lint           # Check code quality
```

### Debugging
```bash
npm run nx:graph       # Visualize project dependencies
```

---

## 📂 Project Structure

```
├── api/              # NestJS Backend API
├── web/              # Angular Frontend Application
├── api-e2e/          # Backend E2E Tests (Playwright)
├── web-e2e/          # Frontend E2E Tests (Playwright)
├── libs/             # Shared libraries
├── prisma/           # Database schema & migrations
└── packages/         # External packages
```

---

## 🔗 Service URLs

When `npm start` is running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:4200 | Angular Web Application |
| Backend API | http://localhost:3000 | NestJS API Server |
| API Docs | http://localhost:3000/api/docs | Swagger Documentation |
| Meilisearch | http://localhost:7700 | Search Engine |
| MinIO Console | http://localhost:9001 | S3-like Storage |
| PgAdmin | http://localhost:5050 | PostgreSQL Management |

---

## 🧪 Testing Strategy

### Unit Tests
```bash
# Run tests for a specific project
nx test api
nx test web

# Watch mode
nx test api --watch
```

### E2E Tests
```bash
# Run all e2e tests
npm run e2e

# Run specific e2e tests
nx e2e api-e2e
nx e2e web-e2e
```

### Coverage Reports
```bash
npm run test:coverage
# Reports generated in: coverage/ directory
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port (example: 3000)
netstat -ano | findstr :3000

# Kill process by PID (example: 1234)
taskkill /PID 1234 /F
```

### Database Connection Issues
```bash
# Reset database (CAREFUL: Deletes all data!)
npm run infra:clean
npm run infra:up
npm run db:migrate
```

### Node Modules Issues
```bash
# Clean reinstall
rm -r node_modules
npm install
```

### Docker Issues
```bash
# View logs
npm run infra:logs

# Rebuild containers
docker compose down -v
docker compose up -d
```

---

## 💡 Best Practices

1. **Always pull latest before starting work**
   ```bash
   git pull origin dev
   ```

2. **Create feature branch from dev**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Run tests before committing**
   ```bash
   npm run lint:fix
   npm run test
   ```

4. **Use meaningful commit messages**
   ```bash
   git commit -m "feat: add user authentication"
   ```

5. **Keep environment variables secure**
   - Never commit `.env` file
   - Update `env.example` for new variables

6. **Database migrations**
   - Create migrations with descriptive names
   ```bash
   npx prisma migrate dev --name add_user_table
   ```

---

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Angular Documentation](https://angular.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Nx Documentation](https://nx.dev/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file)

---

## ❓ Need Help?

- Check existing issues on GitHub
- Review Troubleshooting section above
- Ask in team chat/meeting
- Check project documentation in README.md
