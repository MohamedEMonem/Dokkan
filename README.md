# DoKKan - Full Stack E-Commerce Platform

Welcome to Dokkan! This is a **full-stack e-commerce platform** built with modern technologies. This guide will help you get started quickly.

---

## 📖 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [First Time Setup](#first-time-setup)
- [Running the Application](#running-the-application)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Team Workflow](#team-workflow)

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- **Node.js** v20+ ([Download](https://nodejs.org))
- **Docker & Docker Compose** ([Download](https://www.docker.com))
- **Git** ([Download](https://git-scm.com))

### Setup
```bash
# 1. Clone and enter project
git clone <repo-url>
cd Dokkan

# 2. Install dependencies
npm install

# 3. Setup environment
cp env.example .env

# 4. Start infrastructure (Database, Redis, etc.)
npm run infra:up

# 5. Setup database
npm run db:migrate

# 6. Start all services (API + Frontend)
npm start
```

**Done!** Open:
- 🌐 Frontend: http://localhost:4200
- 🔌 Backend API: http://localhost:3000
- 📊 API Docs: http://localhost:3000/api/docs

---

## 📂 Project Structure

```
Dokkan/
├── api/                      # NestJS Backend (Port 3000)
│   ├── src/
│   │   ├── app/             # Main app module
│   │   ├── users/           # User management
│   │   └── ...
│   └── Dockerfile           # Docker config for API
│
├── web/                      # React Frontend (Port 4200)
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.tsx      # Main App component
│   │   │   └── ...
│   │   ├── main.tsx         # Entry point
│   │   └── styles.css
│   └── Dockerfile           # Docker config for Frontend
│
├── libs/                     # Shared libraries
│   └── shared/
│       ├── data-access/     # Shared services
│       └── ui/              # Shared UI components
│
├── prisma/                   # Database schema
│   ├── schema.prisma        # Data models
│   └── migrations/          # Database migrations
│
├── package.json             # Root npm scripts
├── docker-compose.yml       # Infrastructure setup
└── .github/workflows/       # CI/CD pipeline
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript | User interface |
| **Styling** | Tailwind CSS | Modern styling |
| **Frontend Build** | Vite | Lightning-fast dev server |
| **Backend** | NestJS | REST API server |
| **Language** | TypeScript | Type-safe code |
| **Database** | PostgreSQL | Main database |
| **ORM** | Prisma | Database management |
| **Cache** | Redis | Session & caching |
| **Search** | Meilisearch | Fast product search |
| **Storage** | MinIO (S3) | File uploads |
| **Testing** | Jest | Unit tests |
| **Linting** | ESLint + Prettier | Code quality |
| **Monorepo** | Nx | Project management |
| **CI/CD** | GitHub Actions | Automated testing |
| **Containers** | Docker | Production deployment |

---

## 📋 First Time Setup (Detailed)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Dokkan
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
```bash
cp env.example .env
```

Edit `.env` with your settings:
```env
# Database
POSTGRES_USER=admin
POSTGRES_PASSWORD=root
POSTGRES_DB=dokkan_db

# API
API_PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000
```

### Step 4: Start Infrastructure
```bash
npm run infra:up
```

This starts:
- 🐘 PostgreSQL (Database)
- 🔴 Redis (Cache)
- 🔍 Meilisearch (Search)
- 📦 MinIO (File Storage)

### Step 5: Setup Database
```bash
npm run db:migrate
```

### Step 6: (Optional) Seed Sample Data
```bash
npm run db:seed
```

---

## ▶️ Running the Application

### Start Everything
```bash
npm start                    # Start API + Frontend together
```

### Start Specific Service
```bash
npm run start:api            # Backend only (http://localhost:3000)
npm run start:web            # Frontend only (http://localhost:4200)
```

### View Logs
```bash
npm run infra:logs           # View Docker service logs
```

### Stop Everything
```bash
npm run infra:down           # Stop Docker services
```

---

## 📝 Common Tasks

### Development

**For Frontend Developers:**
```bash
npm run start:web            # Start React dev server
npm run test:web             # Test React components
npm run test:web:watch       # Auto-rerun tests on changes
npm run lint:web:fix         # Fix code issues
```

**For Backend Developers:**
```bash
npm run start:api            # Start NestJS API
npm run test:api             # Test API endpoints
npm run test:api:watch       # Auto-rerun tests on changes
npm run lint:api:fix         # Fix code issues
```

### Testing

```bash
npm run test                 # Run all tests
npm run test:api             # Test API only
npm run test:web             # Test frontend only
npm run test:coverage        # Generate coverage report
npm run test:watch           # Watch mode for all tests
```

### Building for Production

```bash
npm run build                # Build API & frontend
npm run build:api            # Build API only
npm run build:web            # Build frontend only
```

### Code Quality

```bash
npm run lint                 # Check all code
npm run lint:fix             # Auto-fix code issues
npm run format               # Format with Prettier
```

### Database

```bash
npm run db:migrate           # Run migrations
npm run db:studio            # Open database GUI (Prisma Studio)
npm run db:seed              # Populate sample data
```

### Utility

```bash
npm run nx:graph             # Visualize project dependencies
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

```bash
# Kill process on port (example: 3000)
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### Issue: Dependencies Not Installing

```bash
# Clean reinstall
rm -r node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: Database Connection Error

```bash
# Reset everything
npm run infra:clean          # Stop and remove volumes
npm run infra:up             # Restart services
npm run db:migrate           # Re-apply migrations
```

### Issue: React App Won't Start

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run start:web
```

### Issue: Docker Services Won't Start

```bash
# Check logs
npm run infra:logs

# Rebuild containers
docker compose down -v
docker compose up -d
```

### Issue: Prisma Client Out of Sync

```bash
npx prisma generate         # Regenerate Prisma client
npm run db:migrate          # Run migrations
```

---

## 👥 Team Workflow

### For Everyone
```bash
# Before starting work
git pull origin dev

# After making changes
npm run lint:fix             # Fix linting issues
npm run test                 # Run tests
npm run format               # Format code

# Commit with meaningful message
git add .
git commit -m "feat: add user authentication"
git push origin your-branch
```

### Frontend Developer Workflow
```bash
# 1. Start
npm run start:web

# 2. Develop & Test
npm run test:web:watch      # Auto-rerun tests as you code

# 3. Before commit
npm run lint:web:fix
npm run test:web
npm run format
```

### Backend Developer Workflow
```bash
# 1. Start
npm run start:api

# 2. Develop & Test
npm run test:api:watch      # Auto-rerun tests as you code

# 3. Before commit
npm run lint:api:fix
npm run test:api
npm run format
```

### Full Stack / DevOps Workflow
```bash
# 1. Start everything
npm start                    # API + Frontend

# 2. Verify all components
npm run test                 # Run all tests
npm run build                # Build all

# 3. Deploy to Docker
docker compose up -d         # Run with Docker
```

---

## 📚 Documentation

- **Setup & Development:** See [DEVELOPMENT.md](DEVELOPMENT.md)
- **Contributing:** See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Database Schema:** See [prisma/schema.prisma](prisma/schema.prisma)

---

## 🔗 Service URLs (When Running)

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:4200 | React app |
| **Backend API** | http://localhost:3000 | REST API |
| **API Docs** | http://localhost:3000/api/docs | Swagger docs |
| **Prisma Studio** | *after running `npm run db:studio`* | Database GUI |
| **Meilisearch** | http://localhost:7700 | Search engine |
| **MinIO Console** | http://localhost:9001 | File storage |
| **PostgreSQL** | localhost:5432 | Database |
| **Redis** | localhost:6379 | Cache |

---

## ❓ Help & Support

**Something not working?**

1. Check [Troubleshooting](#troubleshooting) section
2. Check [DEVELOPMENT.md](DEVELOPMENT.md)
3. Check GitHub issues
4. Ask your team lead

**New to the project?**

1. Read this README (you're doing great!)
2. Follow the [Quick Start](#quick-start)
3. Pick a small task to get familiar
4. Ask questions! 🙂

---

## 🎯 Next Steps

1. ✅ Complete [Quick Start](#quick-start)
2. 📖 Read [DEVELOPMENT.md](DEVELOPMENT.md) for detailed info
3. 👨‍💻 Pick an issue and start coding
4. 🧪 Write tests for your code
5. 📤 Submit a pull request

Happy coding! 🚀

