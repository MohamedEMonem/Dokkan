# ⚡ Quick Reference Card

Print this or keep it open while developing!

---

## 🚀 Start Here

```bash
# First time setup (run once)
npm install
npm run infra:up
npm run db:migrate
npm start

# Then open:
# Frontend: http://localhost:4200
# API: http://localhost:3000
# API Docs: http://localhost:3000/api/docs
```

---

## 📋 Daily Commands

### Start Development
```bash
npm start              # Start API + Frontend
npm run start:api      # Start API only
npm run start:web      # Start Frontend only
```

### Testing
```bash
npm run test           # Run all tests
npm run test:api       # Test backend only
npm run test:web       # Test frontend only
npm run test:watch     # Auto-rerun tests
```

### Code Quality
```bash
npm run lint           # Check code
npm run lint:fix       # Auto-fix issues
npm run format         # Format code
```

### Database
```bash
npm run db:migrate     # Run migrations
npm run db:studio      # Open database GUI
npm run db:seed        # Add sample data
```

### Infrastructure
```bash
npm run infra:up       # Start Docker services
npm run infra:down     # Stop services
npm run infra:logs     # View logs
npm run infra:clean    # Reset everything
```

---

## 🎯 By Role

### Frontend Developer
```bash
npm run start:web              # Start React
npm run test:web:watch         # Test mode
npm run lint:web:fix           # Fix issues
npm run build:web              # Build
```

### Backend Developer
```bash
npm run start:api              # Start API
npm run test:api:watch         # Test mode
npm run lint:api:fix           # Fix issues
npm run build:api              # Build
```

### Full Stack / DevOps
```bash
npm start                      # Everything
npm run build                  # Build all
npm run test:coverage          # Coverage report
docker compose up -d           # Docker deploy
```

---

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API | http://localhost:3000 |
| API Docs | http://localhost:3000/api/docs |
| Meilisearch | http://localhost:7700 |
| MinIO | http://localhost:9001 |
| DB GUI | `npm run db:studio` |

---

## 🆘 Troubleshooting

### Port in use?
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Can't connect to DB?
```bash
npm run infra:logs
npm run infra:down
npm run infra:up
npm run db:migrate
```

### Frontend won't load?
```bash
rm -rf node_modules/.vite
npm run start:web
```

### Tests failing?
```bash
npx jest --clearCache
npm run test
```

### Missing dependencies?
```bash
npm install --legacy-peer-deps
```

---

## 📚 Documentation

| Document | For |
|----------|-----|
| README.md | Project overview |
| SETUP_GUIDE.md | First-time setup |
| DEVELOPMENT.md | Detailed workflows |
| api/README.md | Backend specifics |
| web/README.md | Frontend specifics |

---

## 💾 Useful Files

```
.env                    # Environment variables
docker-compose.yml      # Docker services
prisma/schema.prisma    # Database schema
package.json            # NPM scripts
```

---

## 🚨 Emergency Commands

```bash
# Reset database (⚠️ deletes data)
npm run infra:clean
npm run infra:up
npm run db:migrate

# Reset everything
rm -rf node_modules package-lock.json .nx
npm install
npm run infra:up
npm run db:migrate

# View what changed
npm run nx:graph
```

---

## 📞 Need Help?

1. Check relevant README file
2. Check DEVELOPMENT.md
3. Check SETUP_GUIDE.md
4. Check GitHub issues
5. Ask your team lead

---

**Tip:** Bookmark this file and the main README.md!
