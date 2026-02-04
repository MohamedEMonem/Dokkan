# 📊 Visual Setup & Workflow Guide

Visual diagrams for understanding the project.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Dokkan PLATFORM                    │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐                    ┌──────────────────┐
│   FRONTEND       │                    │    BACKEND       │
│   React + Vite   │◄──────HTTP/REST───►│   NestJS API     │
│ Port: 4200       │                    │ Port: 3000       │
└──────────────────┘                    └──────────────────┘
        ▲                                        ▲
        │                                        │
        │                                        │
        └────────────────┬──────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
      ┌───▼─────┐              ┌───────▼──┐
      │PostgreSQL│              │  Redis   │
      │Database  │              │  Cache   │
      └──────────┘              └──────────┘
          │                          │
          └──────────────┬───────────┘
                         │
      ┌──────────────────┴──────────────────┐
      │                                      │
   ┌──▼────┐          ┌────────┐      ┌────▼───┐
   │MinIO  │          │Meilisearch    │pgAdmin│
   │Storage│          │Search Engine  │GUI    │
   └───────┘          └────────┘      └───────┘
```

---

## 📱 Development Environment

```
Your Computer
│
├─ Docker Containers (npm run infra:up)
│  ├─ PostgreSQL (Database)
│  ├─ Redis (Cache)
│  ├─ Meilisearch (Search)
│  ├─ MinIO (File Storage)
│  └─ NestJS API (Port 3000)
│
├─ Vite Dev Server (npm run start:web)
│  └─ React Frontend (Port 4200)
│
├─ Code Editor (VS Code)
│  └─ Edit files in web/ and api/
│
└─ Browser
   ├─ Frontend: http://localhost:4200
   ├─ API: http://localhost:3000
   └─ API Docs: http://localhost:3000/api/docs
```

---

## 🚀 Setup Flow

```
START HERE
    │
    ▼
┌─────────────────────┐
│ Clone Repository    │ git clone ...
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Install Dependencies│ npm install
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Setup .env          │ cp env.example .env
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Start Docker        │ npm run infra:up
│ Services            │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Setup Database      │ npm run db:migrate
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Start Dev Servers   │ npm start
└─────────────────────┘
    │
    ▼
🎉 READY TO CODE!
```

---

## 👨‍💻 Daily Workflow

```
Morning
   │
   ▼
┌─────────────────────┐
│ git pull origin dev │  Get latest code
└─────────────────────┘
   │
   ▼
┌─────────────────────┐
│ npm run infra:up    │  Ensure services running
└─────────────────────┘
   │
   ├─ Frontend Dev         Backend Dev       Full Stack
   │      │                    │                  │
   ▼      ▼                    ▼                  ▼
npm    npm                npm              npm start
start: start:api         start:web        
web    npm test:api:watch npm test:web:watch
npm    npm test:api:watch
test:  ...code...       ...code...       ...code...
web:   ...test...       ...test...       ...test...
watch  
       │                    │                  │
       │                    │                  │
       ▼ Lunch ▼            ▼ Lunch ▼         ▼ Lunch ▼

...coding continues...

End of Day
   │
   ▼
┌─────────────────────┐
│ npm run lint:fix    │  Fix code issues
└─────────────────────┘
   │
   ▼
┌─────────────────────┐
│ npm run format      │  Format code
└─────────────────────┘
   │
   ▼
┌─────────────────────┐
│ npm run test        │  Ensure tests pass
└─────────────────────┘
   │
   ▼
┌─────────────────────┐
│ git commit          │  Commit changes
│ git push            │  Push to GitHub
└─────────────────────┘
   │
   ▼
🌙 Good Night!
```

---

## 📂 Project Structure

```
Dokkan/
│
├─ 📄 README.md ──────────────► Project overview
├─ 📄 SETUP_GUIDE.md ─────────► First-time setup
├─ 📄 DEVELOPMENT.md ─────────► Dev workflows
├─ 📄 QUICK_REFERENCE.md ─────► Quick commands
├─ 📄 SCENARIOS.md ───────────► Real examples
├─ 📄 DOCS_INDEX.md ──────────► This file
│
├─ 📁 api/ (Backend)
│  ├─ 📄 README.md ──────────────► API docs
│  ├─ src/
│  │  ├─ app/ ────────────────────► App module
│  │  ├─ users/ ───────────────────► User routes
│  │  └─ ...
│  ├─ Dockerfile ───────────────────► Container setup
│  └─ jest.config.cjs ──────────────► Test config
│
├─ 📁 web/ (Frontend)
│  ├─ 📄 README.md ─────────────────► Web docs
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ app.tsx ─────────────────► Main component
│  │  │  ├─ pages/ ────────────────────► Page components
│  │  │  └─ ...
│  │  ├─ main.tsx ───────────────────► Entry point
│  │  └─ styles.css ─────────────────► Global styles
│  ├─ Dockerfile ───────────────────► Container setup
│  └─ vite.config.mts ──────────────► Build config
│
├─ 📁 libs/ (Shared)
│  └─ shared/
│     ├─ data-access/ ───────────────► Shared services
│     └─ ui/ ──────────────────────────► Shared components
│
├─ 📁 prisma/ (Database)
│  ├─ schema.prisma ────────────────► Database models
│  └─ migrations/ ──────────────────► Migration files
│
├─ 📁 packages/ (External)
│
├─ 📁 .github/ (CI/CD)
│  └─ workflows/
│     └─ ci.yml ────────────────────► Automated testing
│
├─ 📁 node_modules/ (Dependencies)
│
├─ package.json ───────────────────► NPM scripts
├─ docker-compose.yml ──────────────► Docker services
├─ tsconfig.base.json ──────────────► TypeScript config
├─ .env ───────────────────────────► Environment variables
└─ .gitignore ─────────────────────► Git ignore rules
```

---

## 🔄 Feature Development Cycle

```
Developer
   │
   ▼
┌──────────────────────────┐
│ Create Feature Branch    │
│ git checkout -b          │
│   feature/my-feature     │
└──────────────────────────┘
   │
   ▼
┌──────────────────────────┐
│ Write Code               │
│ npm run start:api/web    │
│ npm run test:X:watch     │
└──────────────────────────┘
   │
   ▼
┌──────────────────────────┐
│ Write Tests              │
│ npm run test:X           │
│ Tests pass? ✅           │
└──────────────────────────┘
   │
   ▼
┌──────────────────────────┐
│ Fix Code Issues          │
│ npm run lint:X:fix       │
│ npm run format           │
└──────────────────────────┘
   │
   ▼
┌──────────────────────────┐
│ Commit & Push            │
│ git add .                │
│ git commit -m "msg"      │
│ git push origin          │
└──────────────────────────┘
   │
   ▼
┌──────────────────────────┐
│ Create Pull Request      │
│ On GitHub                │
│ Request reviews          │
└──────────────────────────┘
   │
   ▼
┌──────────────────────────┐
│ Code Review              │
│ Team reviews             │
│ Request changes?         │─────┐
└──────────────────────────┘     │
   │                              │
   No                             │
   ▼                              │
┌──────────────────────────┐     │
│ Merge to dev             │◄────┘
│ (or rebase & fix)        │
└──────────────────────────┘
   │
   ▼
✅ FEATURE COMPLETE!
```

---

## 🧪 Testing Workflow

```
While Coding:
   │
   ▼
npm run test:X:watch
   │
   ├─ File changes
   │  │
   │  ▼
   │ Tests auto-run
   │  │
   │  ├─ ✅ PASS ───────► Continue coding
   │  │
   │  └─ ❌ FAIL ───────► Fix code
   │                      │
   │                      ▼
   │                   npm run test:X:watch
   │                   (tests auto-rerun)
   │
   └─ Repeat...

Before Commit:
   │
   ▼
npm run test:X     (final check)
   │
   ├─ ✅ All pass  ───► npm run lint:X:fix
   │                    │
   │                    ▼
   │                npm run format
   │                │
   │                ▼
   │            git commit
   │
   └─ ❌ Any fail ────► Fix & test again
                       │
                       ▼
                    npm run test:X
```

---

## 🐛 Debugging Workflow

```
Issue Found
   │
   ▼
npm run infra:logs      ◄─ Check service logs
npm run db:studio       ◄─ Check database state
curl localhost:3000     ◄─ Check API status
Browser Console         ◄─ Check frontend errors
   │
   ▼
Add Debug Logs:
   Backend: this.logger.debug(value)
   Frontend: console.log(value)
   │
   ▼
npm run test:X:watch    ◄─ Run tests to isolate
   │
   ▼
Reproduce Issue:
   Use API docs at /api/docs
   Use browser devtools
   Check database GUI
   │
   ▼
Fix Code
   │
   ▼
Tests Pass? ✅
   │
   ▼
❌ Resolved!
```

---

## 🚨 Emergency Response

```
SERVICE DOWN
   │
   ▼
┌──────────────────────┐
│ Check Status         │
│ npm run infra:logs   │
└──────────────────────┘
   │
   ▼
   ├─ Database issue?
   │  │
   │  ▼
   │  npm run infra:clean
   │  npm run infra:up
   │  npm run db:migrate
   │
   ├─ Frontend broken?
   │  │
   │  ▼
   │  rm -rf node_modules/.vite
   │  npm run start:web
   │
   ├─ API broken?
   │  │
   │  ▼
   │  npx jest --clearCache
   │  npm run start:api
   │
   └─ Everything broken?
      │
      ▼
      npm run infra:clean
      rm -rf node_modules
      npm install
      npm run infra:up
      npm run db:migrate
      npm start

   ▼
🚀 SERVICE RESTORED
```

---

## 📊 Command Quick Map

```
                    Frontend Dev        Backend Dev        Everyone
Start Services          │                   │                  │
                        ▼                   ▼                  ▼
                npm start:web         npm start:api        npm start

Code Quality            │                   │                  │
                        ▼                   ▼                  ▼
             npm lint:web:fix      npm lint:api:fix      npm lint:fix

Testing                 │                   │                  │
                        ▼                   ▼                  ▼
            npm test:web:watch    npm test:api:watch     npm test:watch

Format Code             │                   │                  │
                        ▼                   ▼                  ▼
                npm format          npm format           npm format

Build                   │                   │                  │
                        ▼                   ▼                  ▼
                npm build:web       npm build:api         npm build
```

---

## 🎯 Success Metrics

```
Setup Complete?
   ├─ ✅ Docker containers running
   ├─ ✅ Database accessible
   ├─ ✅ Frontend loads at :4200
   ├─ ✅ API responds at :3000
   └─ ✅ Tests pass
        │
        ▼
    🎉 READY!

Daily Development?
   ├─ ✅ Tests pass
   ├─ ✅ Linting clean
   ├─ ✅ Code formatted
   ├─ ✅ API docs work
   └─ ✅ No console errors
        │
        ▼
    ✅ READY TO COMMIT

Pre-Production?
   ├─ ✅ All tests pass
   ├─ ✅ Build succeeds
   ├─ ✅ Zero lint errors
   ├─ ✅ Code coverage ok
   └─ ✅ Docker builds
        │
        ▼
    🚀 READY TO DEPLOY
```

---

## 📞 Help Decision Tree

```
                    Need Help?
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    Quick Answer?   Need Details?   Full Example?
         │              │              │
         ▼              ▼              ▼
    QUICK_REFERENCE DEVELOPMENT.md   SCENARIOS.md
      .md               .md             .md
         │              │              │
         └──────────────┼──────────────┘
                        │
                   Still Stuck?
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    Frontend?      Backend?      DevOps?
         │              │              │
         ▼              ▼              ▼
    web/README     api/README     DEVELOPMENT
      .md            .md            .md
```

---

## 🎓 Learning Path

```
Week 1: Foundation
  Day 1: Setup (SETUP_GUIDE.md)
  Day 2: Overview (README.md)
  Day 3: Your Tech (web/ or api/README.md)
  Day 4: Commands (QUICK_REFERENCE.md)
  Day 5: Real Examples (SCENARIOS.md)

Week 2-4: Hands-On
  - Pick small issues
  - Follow SCENARIOS.md
  - Ask questions
  - Write tests
  - Code review

Ongoing: Mastery
  - Contribute features
  - Help team members
  - Optimize code
  - Document patterns
```

---

**Print this page or bookmark it!** Reference frequently. 🚀
