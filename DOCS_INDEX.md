# 📚 Complete Documentation Index

Welcome! Here's where to find everything you need.

---

## 🚀 Getting Started (Pick One)

### Just Want to Start?
👉 **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** (2 min read)
- 5-minute setup commands
- Daily commands cheatsheet  
- Emergency fixes

### First Time Setup?
👉 **[SETUP_GUIDE.md](SETUP_GUIDE.md)** (10 min read)
- Step-by-step installation
- What each step does
- Troubleshooting common issues

### Want Project Overview?
👉 **[README.md](README.md)** (5 min read)
- Technology stack
- Project structure
- Service URLs
- Team workflows

---

## 💻 Development Documentation

### General Development
👉 **[DEVELOPMENT.md](DEVELOPMENT.md)** (15 min read)
- Development setup
- Common commands
- Project structure
- Testing strategies
- Debugging tips
- Best practices

### Real-World Scenarios
👉 **[SCENARIOS.md](SCENARIOS.md)** (20 min read)
- Step-by-step examples:
  - Starting your day
  - Building features (frontend & backend)
  - Creating database migrations
  - Fixing bugs
  - Code reviews
  - Debugging issues
  - Emergency fixes

---

## 🔨 Technology-Specific Guides

### Backend (NestJS + Prisma)
👉 **[api/README.md](api/README.md)**
- API server setup
- Project structure
- Testing the API
- Database operations
- Swagger documentation
- Common commands

### Frontend (React + Vite)
👉 **[web/README.md](web/README.md)**
- React setup
- Project structure
- Component examples
- Testing components
- API integration
- Routing setup
- Styling with Tailwind

---

## 👥 For Different Roles

### Frontend Developers
1. Read: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Initial setup
2. Read: [web/README.md](web/README.md) - Frontend details
3. Read: [SCENARIOS.md](SCENARIOS.md) - "Building a New Feature (Frontend)"
4. Use: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Daily reference

**Key Commands:**
```bash
npm run start:web              # Start dev server
npm run test:web:watch         # Auto-test while coding
npm run lint:web:fix           # Fix code issues
```

### Backend Developers
1. Read: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Initial setup
2. Read: [api/README.md](api/README.md) - Backend details
3. Read: [SCENARIOS.md](SCENARIOS.md) - "Building a New API Endpoint"
4. Use: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Daily reference

**Key Commands:**
```bash
npm run start:api              # Start dev server
npm run test:api:watch         # Auto-test while coding
npm run lint:api:fix           # Fix code issues
npm run db:studio              # View database
```

### Full Stack / DevOps
1. Read: [SETUP_GUIDE.md](SETUP_GUIDE.md) - Initial setup
2. Read: [README.md](README.md) - Project overview
3. Read: [DEVELOPMENT.md](DEVELOPMENT.md) - Full workflows
4. Read: [SCENARIOS.md](SCENARIOS.md) - All scenarios
5. Use: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Daily reference

**Key Commands:**
```bash
npm start                      # Start everything
npm run build                  # Build all projects
npm run test:coverage          # Full test coverage
docker compose up -d           # Deploy with Docker
```

### Project Managers / QA
1. Read: [README.md](README.md) - Overview
2. Reference: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Commands
3. Check: [Service URLs](#-service-urls)

---

## 🔗 Service URLs

When everything is running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:4200 | React application |
| **Backend API** | http://localhost:3000 | REST API |
| **API Documentation** | http://localhost:3000/api/docs | Swagger interactive docs |
| **Database GUI** | `npm run db:studio` | Prisma Studio |
| **Search Engine** | http://localhost:7700 | Meilisearch |
| **File Storage** | http://localhost:9001 | MinIO Console |

---

## 📋 File Structure

```
├── README.md                 # Main project documentation
├── SETUP_GUIDE.md           # Step-by-step setup
├── DEVELOPMENT.md           # Development workflows
├── QUICK_REFERENCE.md       # Quick command reference
├── SCENARIOS.md             # Real-world examples
├── CONTRIBUTING.md          # How to contribute
├── package.json             # NPM scripts
├── docker-compose.yml       # Docker services
│
├── api/                     # Backend code
│   └── README.md           # Backend documentation
│
├── web/                     # Frontend code
│   └── README.md           # Frontend documentation
│
├── libs/                    # Shared code
├── prisma/                  # Database
│   └── schema.prisma        # Database schema
│
└── .github/
    └── workflows/
        └── ci.yml           # CI/CD pipeline
```

---

## 🎯 Common Tasks Quick Links

### I want to...

**Get the project running**
→ [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Start developing right now**
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Understand how everything works**
→ [README.md](README.md)

**Build a new feature**
→ [SCENARIOS.md](SCENARIOS.md) - Feature section

**Fix a bug**
→ [SCENARIOS.md](SCENARIOS.md) - Bug fix section

**Write API endpoint**
→ [SCENARIOS.md](SCENARIOS.md) - API endpoint section

**Deploy to production**
→ [SCENARIOS.md](SCENARIOS.md) - Production section

**Find a specific command**
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Troubleshoot an issue**
→ [SETUP_GUIDE.md](SETUP_GUIDE.md) - Issues section

**Understand the codebase**
→ [DEVELOPMENT.md](DEVELOPMENT.md) - Project structure

**Learn React setup**
→ [web/README.md](web/README.md)

**Learn API setup**
→ [api/README.md](api/README.md)

---

## 📖 Reading Order by Experience Level

### Day 1 (Completely New)
1. [README.md](README.md) - 5 min
2. [SETUP_GUIDE.md](SETUP_GUIDE.md) - 10 min
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 2 min
4. Start coding!

### Week 1
- [web/README.md](web/README.md) or [api/README.md](api/README.md) - Your tech
- [DEVELOPMENT.md](DEVELOPMENT.md) - General workflows
- [SCENARIOS.md](SCENARIOS.md) - Real examples

### Ongoing
- Use [QUICK_REFERENCE.md](QUICK_REFERENCE.md) daily
- Refer to specific docs as needed
- Check [SCENARIOS.md](SCENARIOS.md) for new situations

---

## 🆘 Troubleshooting Guide

**Port in use?**
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Troubleshooting

**Can't connect to database?**
→ [SETUP_GUIDE.md](SETUP_GUIDE.md) - Common Issues

**Frontend won't load?**
→ [web/README.md](web/README.md) - Troubleshooting

**API errors?**
→ [api/README.md](api/README.md) - Troubleshooting

**Everything broken?**
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Emergency Commands

---

## 📞 Help Resources

### Documentation First
Check these in order:
1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick answers
2. Relevant tech README (api/ or web/)
3. [DEVELOPMENT.md](DEVELOPMENT.md) - Detailed info
4. [SCENARIOS.md](SCENARIOS.md) - Examples

### Then Ask
1. Search GitHub issues
2. Check team chat history
3. Ask a team member
4. Ask your team lead

### Remember
- No question is silly
- Others probably had same issue
- Document the solution for team

---

## ✨ Tips for Success

1. **Bookmark QUICK_REFERENCE.md** - You'll use it daily
2. **Keep README.md open** in first week
3. **Reference api/README.md or web/README.md** for your tech
4. **Use SCENARIOS.md** for step-by-step examples
5. **Ctrl+F in docs** to search quickly
6. **Ask questions** - We're all here to help!

---

## 📝 Document Updates

Last updated: January 14, 2026

Documents are kept up-to-date. If something is wrong:
1. Check if there's a newer section
2. Ask your team
3. Create an issue on GitHub
4. Update the docs yourself!

---

## 🎉 Ready?

**Just starting?** → Go to [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Ready to code?** → Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Need examples?** → See [SCENARIOS.md](SCENARIOS.md)

**Stuck?** → Search relevant docs or ask your team

---

Happy coding! 🚀

*- The Omni-Store Team*
