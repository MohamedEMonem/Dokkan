# 🚀 Complete Setup Guide - Omni-Store

This guide walks you through setting up Omni-Store from scratch. Follow each step carefully.

---

## 📋 Prerequisites Check

Before starting, ensure you have installed:

### 1. Node.js v20+
```bash
node --version  # Should show v20.x or higher
npm --version   # Should show v10.x or higher
```
**If not installed:** [Download Node.js](https://nodejs.org) (includes npm)

### 2. Docker & Docker Compose
```bash
docker --version        # Should show Docker version
docker compose version  # Should show Compose version
```
**If not installed:** [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

### 3. Git
```bash
git --version  # Should show git version
```
**If not installed:** [Download Git](https://git-scm.com)

---

## 🔧 Step-by-Step Setup

### Step 1: Clone Repository

```bash
# Clone the project
git clone https://github.com/MohamedEMonem/Dokkan.git
cd Dokkan

# Or if using SSH:
git clone git@github.com:MohamedEMonem/Dokkan.git
cd Dokkan
```

**Verify:**
```bash
ls  # Should show folders: api, web, libs, prisma, etc.
```

---

### Step 2: Install Dependencies

```bash
npm install
```

This will:
- ✅ Download all packages
- ✅ Install development tools
- ✅ Prepare the workspace

**Time:** ~2-5 minutes depending on internet speed

**Troubleshooting:**
```bash
# If errors occur, try:
npm install --legacy-peer-deps

# If node_modules is corrupted:
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

### Step 3: Environment Configuration

Copy environment template:
```bash
cp env.example .env
```

**Edit `.env` file** with your preferred editor:

```env
# Database Configuration
POSTGRES_USER=admin
POSTGRES_PASSWORD=root
POSTGRES_DB=dokkan_db

# API Configuration
API_PORT=3000
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:3000

# Storage (MinIO)
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin

# Search Engine
MEILI_MASTER_KEY=masterKey
```

**Windows Note:** Use a text editor like VS Code, Notepad++, or Sublime Text. Avoid Notepad (adds BOM characters).

---

### Step 4: Start Docker Services

Start the infrastructure (Database, Cache, Search, Storage):

```bash
npm run infra:up
```

**This starts:**
- 🐘 PostgreSQL (Database on port 5432)
- 🔴 Redis (Cache on port 6379)
- 🔍 Meilisearch (Search on port 7700)
- 📦 MinIO (Storage on port 9000/9001)

**Verify services are running:**
```bash
docker ps  # Should show 4 containers running
```

**Troubleshooting:**
```bash
# View logs if services don't start
npm run infra:logs

# Stop all and try again
npm run infra:down
npm run infra:up

# If port conflicts, edit docker-compose.yml
```

---

### Step 5: Setup Database

Initialize the database schema:

```bash
npm run db:migrate
```

This:
- ✅ Creates database tables
- ✅ Applies migrations
- ✅ Prepares Prisma client

**Verify:**
```bash
npm run db:studio  # Opens database GUI
```

Close the browser tab when done (Ctrl+C in terminal).

---

### Step 6: (Optional) Seed Sample Data

Add test data to your database:

```bash
npm run db:seed
```

This creates:
- Sample users
- Test products
- Demo stores
- Example orders

**Skip if:** You prefer starting with a blank database.

---

### Step 7: Start Development Servers

#### Option A: Start Everything (Recommended)
```bash
npm start
```

This starts:
- ✅ NestJS API on http://localhost:3000
- ✅ React Frontend on http://localhost:4200

#### Option B: Start Individual Services

In separate terminal windows:

**Terminal 1 - Backend:**
```bash
npm run start:api
```

**Terminal 2 - Frontend:**
```bash
npm run start:web
```

---

### Step 8: Verify Installation

Open in your browser:

- 🌐 **Frontend:** http://localhost:4200
- 🔌 **API:** http://localhost:3000
- 📊 **API Docs:** http://localhost:3000/api/docs (Swagger)
- 🗄️ **Database:** Run `npm run db:studio`

**Success!** You should see:
- ✅ React welcome page at port 4200
- ✅ API responding at port 3000
- ✅ Interactive API docs in Swagger

---

## 📚 Next Steps

### For Frontend Developers
```bash
# Stop everything with Ctrl+C

# Start only frontend
npm run start:web

# In another terminal, watch tests
npm run test:web:watch

# Open http://localhost:4200
```

### For Backend Developers
```bash
# Stop everything with Ctrl+C

# Start only backend
npm run start:api

# In another terminal, watch tests
npm run test:api:watch

# Check API docs at http://localhost:3000/api/docs
```

### For Everyone
```bash
# Read the main documentation
# Read the README.md
# Read DEVELOPMENT.md
# Read api/README.md or web/README.md
```

---

## 🛑 Common Issues & Fixes

### Issue: "npm command not found"
**Solution:** Node.js/npm not installed. [Download Node.js](https://nodejs.org)

### Issue: "docker command not found"
**Solution:** Docker not installed. [Download Docker](https://www.docker.com)

### Issue: Port Already in Use
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: "Database connection failed"
```bash
# Check if services are running
npm run infra:logs

# If not, restart
npm run infra:down
npm run infra:up
npm run db:migrate
```

### Issue: "React app doesn't load"
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart frontend
npm run start:web
```

### Issue: "Permission denied" on macOS/Linux
```bash
# Make scripts executable
chmod +x node_modules/.bin/*
```

### Issue: "npm install fails"
```bash
# Try legacy peer deps
npm install --legacy-peer-deps

# Clear npm cache
npm cache clean --force
npm install
```

---

## 🎯 Verification Checklist

After setup, verify everything works:

- [ ] Docker containers running (`docker ps`)
- [ ] Database created (`npm run db:studio`)
- [ ] Frontend loads (http://localhost:4200)
- [ ] API responds (http://localhost:3000)
- [ ] API docs work (http://localhost:3000/api/docs)
- [ ] No errors in terminal
- [ ] Can run tests (`npm run test`)

---

## 💡 Tips & Tricks

### Keep Services Running
Don't close terminal running `npm start`. Open new terminal tabs for other commands.

### Check Project Status
```bash
npm run nx:graph  # Visualize project dependencies
```

### Reset Everything (Nuclear Option)
```bash
# Stop services
npm run infra:clean

# Clean node modules
rm -rf node_modules

# Reinstall
npm install

# Start over
npm run infra:up
npm run db:migrate
npm start
```

### View Database Visually
```bash
npm run db:studio
# Opens browser to database GUI
```

### Run Tests While Developing
```bash
# In separate terminal
npm run test:watch
# Auto-reruns tests when code changes
```

---

## 📖 Documentation Structure

- **README.md** - Project overview & quick start
- **SETUP_COMPLETE.md** - Indicates successful setup
- **DEVELOPMENT.md** - Development workflows
- **CONTRIBUTING.md** - Contribution guidelines
- **api/README.md** - Backend documentation
- **web/README.md** - Frontend documentation

---

## 🚨 When Things Go Wrong

### Get Logs
```bash
npm run infra:logs  # Docker service logs
docker logs <container-name>  # Specific container
```

### Debug Database
```bash
npm run db:studio  # Open database GUI
```

### Check Node Version
```bash
node --version  # Should be v20+
nvm list       # If using Node Version Manager
```

### Test API Manually
```bash
curl http://localhost:3000/
curl http://localhost:3000/api/users
```

---

## ✅ Success Indicators

You know setup is complete when:

1. ✅ `npm run infra:logs` shows no errors
2. ✅ Frontend loads at http://localhost:4200
3. ✅ API responds at http://localhost:3000
4. ✅ Database GUI opens with `npm run db:studio`
5. ✅ `npm run test` passes
6. ✅ Team can run `npm start` and work

---

## 🆘 Still Having Issues?

1. **Check this guide again** - You might have missed a step
2. **Check README.md** - General project info
3. **Check DEVELOPMENT.md** - Dev-specific help
4. **Check relevant README** - api/README.md or web/README.md
5. **Google the error** - Copy exact error message
6. **Ask your team** - Someone might have solved it
7. **Check GitHub issues** - Similar problems might be documented

---

## 🎉 Ready to Code!

Congratulations! Your development environment is ready.

**Next steps:**
1. Pick an issue to work on
2. Create a feature branch
3. Make changes
4. Write tests
5. Submit pull request

Happy coding! 🚀
