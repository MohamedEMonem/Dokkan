# Independent Package Management Guide

## Overview

Your project now supports independent package management for both frontend and backend. Each folder (web/ and api/) has its own `package.json` file, allowing you to install/uninstall packages without affecting the entire project.

## Structure

```
Dokkan/
├── package.json                 # Root workspace dependencies
├── web/
│   └── package.json            # React frontend dependencies (INDEPENDENT)
└── api/
    └── package.json            # NestJS backend dependencies (INDEPENDENT)
```

## Using Independent Package Management

### Frontend Only (React)

**Install package in frontend:**
```bash
cd web
npm install axios
```

**Uninstall package from frontend:**
```bash
cd web
npm uninstall axios
```

**Install dev dependency in frontend:**
```bash
cd web
npm install --save-dev @types/react-router-dom
```

### Backend Only (NestJS)

**Install package in backend:**
```bash
cd api
npm install @nestjs/jwt
```

**Uninstall package from backend:**
```bash
cd api
npm uninstall @nestjs/jwt
```

**Install dev dependency in backend:**
```bash
cd api
npm install --save-dev @types/express
```

## Full Project Installation

**Install all dependencies (root + web + api):**
```bash
npm install --legacy-peer-deps
cd web && npm install
cd ../api && npm install
```

Or use the shortcut script (add to root package.json scripts):
```bash
npm run install:all
```

## Best Practices

1. **Frontend developers**: Work in `web/` folder
   - Use `cd web && npm install package-name`
   - Keep React-specific packages here
   
2. **Backend developers**: Work in `api/` folder
   - Use `cd api && npm install package-name`
   - Keep NestJS-specific packages here

3. **Shared/Workspace dependencies**: Install from root
   - Nx, Prisma, shared tools
   - Keep in root `package.json`

## Running Commands from Anywhere

You can run development servers from any folder:

**From root:**
```bash
npm run start:web    # Runs React dev server
npm run start:api    # Runs NestJS dev server
```

**From web folder:**
```bash
cd web
npm start            # Same as `vite` command
```

**From api folder:**
```bash
cd api
npm start            # Runs NestJS dev server
```

## Dependency Types

### Root package.json
- Nx build tools
- Prisma ORM
- ESLint/Prettier (shared)
- TypeScript (shared)

### web/package.json
- React & React Router
- React Testing Library
- Vite & plugins
- Frontend utilities (axios, etc.)

### api/package.json
- NestJS core & modules
- Prisma client
- API validators (class-validator, class-transformer)
- NestJS testing

## Checking Installed Packages

**Root dependencies:**
```bash
npm list
```

**Frontend dependencies:**
```bash
cd web && npm list
```

**Backend dependencies:**
```bash
cd api && npm list
```

## Advantages

✅ **Faster installs** - Each team member installs only what they need
✅ **Cleaner dependencies** - No unused packages in dependency trees
✅ **Independent workflows** - Frontend and backend teams don't interfere
✅ **Easier debugging** - Know exactly where each package comes from
✅ **Version flexibility** - Different versions for frontend/backend if needed

## Common Workflows

### Adding a React component library
```bash
cd web
npm install react-icons
# or
npm install --save-dev @storybook/react
```

### Adding NestJS authentication
```bash
cd api
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install --save-dev @types/passport-jwt
```

### Adding shared type definitions
```bash
# Put in packages/ folder and reference from both
# or keep in root and import from both
```

## Troubleshooting

**Package not found error:**
- Make sure you're in the correct folder (web/ or api/)
- Check that npm install was run in that folder

**Module resolution error:**
- Some packages might be needed at root level
- Add to root package.json if both projects need it

**Lock file conflicts:**
- Each folder has its own `package-lock.json`
- Don't commit these to git (usually in .gitignore)

## Next Steps

1. **Frontend developers**: Use `cd web && npm install` for frontend packages
2. **Backend developers**: Use `cd api && npm install` for backend packages
3. **Keep root clean**: Only workspace/shared tools in root
