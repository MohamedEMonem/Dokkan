# 🚀 Development Guide - Dokkan

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

### Development - Start Services

**Start All Services** (API + React Web):
```bash
npm start              # Start both API and web app
npm run start:all      # Alternative: same as npm start
```

**Start Specific Service**:
```bash
npm run start:api      # Start only NestJS API (port 3000)
npm run start:web      # Start only React app (port 4200)
```

### Development - Build

**Build All Projects**:
```bash
npm run build          # Build API and web for production
```

**Build Specific Service**:
```bash
npm run build:api      # Build only NestJS API
npm run build:web      # Build only React web app
```

### Development - Testing

**Run All Tests**:
```bash
npm run test           # Run all unit tests
npm run test:coverage  # Run all tests with coverage
npm run test:watch     # Run all tests in watch mode
```

**Test Specific Service**:
```bash
npm run test:api       # Test only API
npm run test:web       # Test only React app
npm run test:api:watch     # Test API in watch mode
npm run test:web:watch     # Test React app in watch mode
npm run test:api:coverage  # Test API with coverage
npm run test:web:coverage  # Test React app with coverage
```

### Development - Code Quality

**Lint All Projects**:
```bash
npm run lint           # Lint all projects
npm run lint:fix       # Lint and auto-fix all projects
```

**Lint Specific Service**:
```bash
npm run lint:api       # Lint only API
npm run lint:web       # Lint only React app
npm run lint:api:fix   # Lint and fix API
npm run lint:web:fix   # Lint and fix React app
```

### Development - Format
```bash
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
├── web/              # React Frontend Application
├── libs/             # Shared libraries
├── prisma/           # Database schema & migrations
└── packages/         # External packages
```

---

## 🔗 Service URLs

When `npm start` is running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:4200 | React Web Application |
| Backend API | http://localhost:3000 | NestJS API Server |
| API Docs | http://localhost:3000/api/docs | Swagger Documentation |
| Meilisearch | http://localhost:7700 | Search Engine |
| MinIO Console | http://localhost:9001 | S3-like Storage |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache/Queue |

---

## 🧪 Testing Strategy

### Unit Tests
```bash
# Run tests for a specific project
npm run test:api       # Test API only
npm run test:web       # Test React web only

# Run all tests
npm run test           # Run all unit tests

# Watch mode (auto-rerun on changes)
npm run test:api:watch # Test API in watch mode
npm run test:web:watch # Test React app in watch mode
npm run test:watch     # Test all in watch mode
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
npm install --legacy-peer-deps
```

### Docker Issues
```bash
# View logs
npm run infra:logs

# Rebuild containers
docker compose down -v
docker compose up -d
```

### Vite Dev Server Issues
```bash
# If the React app won't start, try clearing cache
rm -rf node_modules/.vite
npm run dev web
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
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Nx Documentation](https://nx.dev/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file)

---

## ❓ Need Help?

- Check existing issues on GitHub
- Review Troubleshooting section above
- Ask in team chat/meeting
- Check project documentation in README.md

