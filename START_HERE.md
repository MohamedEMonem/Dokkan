# 👋 Start Here - Team Onboarding Guide

**Welcome to Dokkan!** This is your first stop. Follow this guide to get up and running.

---

## 🎯 What is This Project?

Dokkan is a **full-stack e-commerce platform** built with:
- **Frontend:** React + TypeScript + Vite
- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Infrastructure:** Docker (PostgreSQL, Redis, Meilisearch, MinIO)
- **Testing:** Jest
- **CI/CD:** GitHub Actions

Think of it as the **Shopify for multiple stores** - sellers can create their stores, list products, manage orders, and customers can shop across multiple stores.

---

## 📖 Choose Your Path

### Path 1: Just Got This Repository?
**Time: 30 minutes**

1. Read this file (you're here! ✅)
2. Follow [SETUP_GUIDE.md](SETUP_GUIDE.md) - Step-by-step setup
3. Run commands from [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
4. You're done! Start coding.

### Path 2: Assigned to Frontend Development?
**Time: 1 hour**

1. This file (you're here! ✅)
2. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Get everything running
3. [web/README.md](web/README.md) - Frontend specifics
4. [SCENARIOS.md](SCENARIOS.md) - "Building a New Feature (Frontend)"
5. Start on your first task!

### Path 3: Assigned to Backend Development?
**Time: 1 hour**

1. This file (you're here! ✅)
2. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Get everything running
3. [api/README.md](api/README.md) - Backend specifics
4. [SCENARIOS.md](SCENARIOS.md) - "Building a New API Endpoint"
5. Start on your first task!

### Path 4: Full Stack / DevOps / Project Lead?
**Time: 2 hours**

1. This file (you're here! ✅)
2. [README.md](README.md) - Full project overview
3. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup process
4. [DEVELOPMENT.md](DEVELOPMENT.md) - All development workflows
5. [SCENARIOS.md](SCENARIOS.md) - All real-world examples
6. [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - Architecture & workflows

---

## ⚡ Super Quick Start (5 Minutes)

```bash
# 1. Clone (if needed)
git clone https://github.com/MohamedEMonem/Dokkan.git
cd Dokkan

# 2. Install dependencies (one-time)
npm install

# 3. Setup environment
cp env.example .env

# 4. Start services (this window)
npm run infra:up

# 5. In a NEW terminal window:
npm run db:migrate
npm start

# 6. Open in browser:
# Frontend: http://localhost:4200
# API: http://localhost:3000
# API Docs: http://localhost:3000/api/docs
```

**Done!** You're running the full stack.

---

## 🤔 What Now?

### If It Worked ✅
Congratulations! Your development environment is ready.

**Next Steps:**
- Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Save this!
- Pick a task from your team
- Refer to [SCENARIOS.md](SCENARIOS.md) for examples
- Ask your team lead if unsure

### If It Didn't Work ❌
Don't worry, this is normal! Follow [SETUP_GUIDE.md](SETUP_GUIDE.md) step-by-step. It has detailed troubleshooting.

**Or quick fixes:**
```bash
npm install --legacy-peer-deps      # Dependency issue
npm run infra:down; npm run infra:up # Services issue
rm -rf node_modules; npm install     # Node issue
```

---

## 📚 Documentation Map

You have 9 comprehensive guides:

| Document | Purpose | Time |
|----------|---------|------|
| [README.md](README.md) | Project overview | 5 min |
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | **Step-by-step setup** | **10 min** |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | **Daily commands** | **2 min** |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Dev workflows | 15 min |
| [SCENARIOS.md](SCENARIOS.md) | Real-world examples | 20 min |
| [DOCS_INDEX.md](DOCS_INDEX.md) | Documentation index | 5 min |
| [VISUAL_GUIDE.md](VISUAL_GUIDE.md) | Diagrams & flows | 10 min |
| [api/README.md](api/README.md) | Backend details | 10 min |
| [web/README.md](web/README.md) | Frontend details | 10 min |

**Start with the bolded ones** → Then read others as needed.

---

## 💡 Pro Tips

### 1. Keep Multiple Terminals Open
```bash
Terminal 1: npm start           # Services
Terminal 2: npm run test:watch  # Tests auto-rerun
Terminal 3: Regular git/editing
```

### 2. Save These Commands
```bash
# Daily
npm start              # Start everything
npm run test:watch     # Test in watch mode
npm run lint:fix       # Fix code issues

# When stuck
npm run infra:logs     # See what's wrong
npm run db:studio      # View database
```

### 3. Use Browser DevTools
```
Right-click → Inspect → Console Tab
View API responses, errors, logs
```

### 4. Check API Documentation
Visit `http://localhost:3000/api/docs` - see all API endpoints with examples!

### 5. Ask Questions
- No question is silly
- Your team wants to help
- Others probably had same issue
- Document the answer for next person!

---

## 👥 Team Roles

### Frontend Developer
- Focus on [web/README.md](web/README.md)
- Main commands:
  ```bash
  npm run start:web              # Start frontend
  npm run test:web:watch         # Test mode
  npm run lint:web:fix           # Fix issues
  ```
- Example in [SCENARIOS.md](SCENARIOS.md) - "Building a New Feature (Frontend)"

### Backend Developer
- Focus on [api/README.md](api/README.md)
- Main commands:
  ```bash
  npm run start:api              # Start backend
  npm run test:api:watch         # Test mode
  npm run lint:api:fix           # Fix issues
  npm run db:studio              # View database
  ```
- Example in [SCENARIOS.md](SCENARIOS.md) - "Building a New API Endpoint"

### Full Stack / Lead
- Read [README.md](README.md) + [DEVELOPMENT.md](DEVELOPMENT.md)
- Understand full architecture
- Help team members
- Deploy to production

---

## 🚨 If You Get Stuck

### Problem: Can't install dependencies
```bash
npm install --legacy-peer-deps
```

### Problem: Services won't start
```bash
npm run infra:logs        # See the error
npm run infra:down        # Stop
npm run infra:up          # Restart
```

### Problem: Database issues
```bash
npm run infra:clean       # Remove everything
npm run infra:up          # Restart
npm run db:migrate        # Recreate tables
```

### Problem: Something else
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) - Issues section
2. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Troubleshooting
3. Google the error message
4. Ask your team
5. Check GitHub issues

---

## 📋 Verification Checklist

After setup, verify everything works:

- [ ] All dependencies installed (`npm install`)
- [ ] Docker containers running (`docker ps` shows 4 containers)
- [ ] Database initialized (`npm run db:studio` opens)
- [ ] Frontend loads (`http://localhost:4200` shows page)
- [ ] API responds (`http://localhost:3000` returns JSON)
- [ ] API docs work (`http://localhost:3000/api/docs` opens)
- [ ] Tests pass (`npm run test` succeeds)

If all checked ✅ → You're ready to code!

---

## 🎯 Your First Task

Once everything is set up:

1. **Ask your team lead** for a task
   - Should be labeled "Good First Issue" or "Help Wanted"
   - Small, focused, clearly described

2. **Create feature branch**
   ```bash
   git checkout -b feature/task-name
   ```

3. **Follow [SCENARIOS.md](SCENARIOS.md)** for step-by-step guidance

4. **Test your code**
   ```bash
   npm run test           # Your specific tests pass?
   npm run lint:fix       # Code issues fixed?
   npm run format         # Code formatted?
   ```

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: description of change"
   git push origin feature/task-name
   ```

6. **Create Pull Request** on GitHub
   - Describe what you did
   - Request review from team

7. **Address feedback** and merge!

---

## 🔗 Quick Links

**Need to start?**
→ [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Need commands?**
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Need examples?**
→ [SCENARIOS.md](SCENARIOS.md)

**Need architecture?**
→ [VISUAL_GUIDE.md](VISUAL_GUIDE.md)

**Need backend help?**
→ [api/README.md](api/README.md)

**Need frontend help?**
→ [web/README.md](web/README.md)

**All documentation?**
→ [DOCS_INDEX.md](DOCS_INDEX.md)

---

## 💬 Remember

- **Everyone started here** - You're not alone
- **Questions are good** - They help everyone learn
- **Mistakes are normal** - That's how we grow
- **Help your teammates** - Pay it forward
- **Have fun!** - Building things is awesome 🚀

---

## 🎉 Ready?

You have all the information you need. Pick your path above and follow the steps.

**You've got this!** 💪

---

### Next: Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for step-by-step instructions

Questions? Ask your team lead or check [DOCS_INDEX.md](DOCS_INDEX.md) for what to read.

*- Welcome to the team! 🎊*
