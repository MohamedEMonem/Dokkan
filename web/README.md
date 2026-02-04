# 🌐 Web - React Frontend

Modern React frontend for Dokkan e-commerce platform built with Vite.

---

## 📖 Quick Reference

### Start Development Server
```bash
npm run start:web
```
Frontend runs on **http://localhost:4200**

### Run Tests
```bash
npm run test:web              # Run once
npm run test:web:watch        # Auto-rerun on changes
npm run test:web:coverage     # With coverage report
```

### Check Code Quality
```bash
npm run lint:web              # Check for issues
npm run lint:web:fix          # Auto-fix issues
```

### Build for Production
```bash
npm run build:web
```

---

## 📁 Project Structure

```
web/
├── src/
│   ├── main.tsx              # Entry point
│   ├── app/
│   │   ├── app.tsx           # Root component with routing
│   │   ├── app.module.css    # App styles
│   │   ├── nx-welcome.tsx    # Welcome component
│   │   └── app.spec.tsx      # Tests
│   ├── assets/               # Images, icons, etc.
│   └── styles.css            # Global styles
├── public/                   # Static files
├── index.html                # HTML template
├── jest.config.ts            # Test configuration
├── vite.config.mts           # Vite configuration
├── tsconfig.app.json         # TypeScript config
└── Dockerfile                # Docker container setup
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- API running on http://localhost:3000 (via `npm run start:api`)

### First Time Setup
```bash
# 1. From project root, ensure dependencies are installed
npm install

# 2. Ensure API is running in another terminal
npm run start:api

# 3. Start the frontend
npm run start:web
```

### Verify It Works
```bash
# Open browser to:
# http://localhost:4200
```

You should see the React welcome page!

---

## 🛠️ Common Commands

### Development
```bash
npm run start:web             # Start dev server (port 4200)
npm run start:web --          # With additional Nx args
```

### Testing
```bash
npm run test:web              # Run all tests
npm run test:web:watch        # Watch mode (auto-rerun)
npm run test:web:coverage     # Generate coverage report
```

### Code Quality
```bash
npm run lint:web              # Check code
npm run lint:web:fix          # Auto-fix issues
npm run format                # Format with Prettier
```

### Building
```bash
npm run build:web             # Production build
```

---

## 🏗️ Architecture

### Technology Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling (configured)
- **Jest** - Testing
- **ESLint** - Code quality
- **Prettier** - Code formatting

### Component Structure
```
src/
├── app/
│   ├── app.tsx              # Root with routing
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom hooks
│   ├── services/            # API calls
│   └── types/               # TypeScript types
```

---

## 🌐 Connecting to API

### API Configuration
```typescript
// Environment variable in .env
VITE_API_URL=http://localhost:3000
```

### Example API Call
```typescript
// src/app/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function getUsers() {
  const response = await fetch(`${API_URL}/api/users`);
  return response.json();
}
```

### Using in Component
```typescript
import { useEffect, useState } from 'react';
import { getUsers } from './services/api';

export function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

## 🧪 Testing

### Run Tests
```bash
npm run test:web              # Run all tests
npm run test:web:watch        # Watch mode
npm run test:web:coverage     # With coverage
```

### Test File Examples
```
web/src/**/*.spec.tsx
```

### Writing Tests
```typescript
import { render, screen } from '@testing-library/react';
import { App } from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });
});
```

---

## 🎨 Styling

### Tailwind CSS (Configured)
```html
<div className="flex items-center justify-center p-4 bg-blue-500">
  <h1 className="text-white text-2xl font-bold">Welcome</h1>
</div>
```

### CSS Modules
```typescript
// app.module.css
import styles from './app.module.css';

export function App() {
  return <div className={styles.container}>...</div>;
}
```

### Global Styles
Edit `src/styles.css` for global styling.

---

## 🔄 React Router

### Setup Routes
```typescript
// src/app/app.tsx
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { About } from './pages/about';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
```

### Link Navigation
```typescript
import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
```

---

## 🐛 Troubleshooting

### Port 4200 Already in Use
```bash
# Find process using port 4200
netstat -ano | findstr :4200

# Kill process (example PID: 1234)
taskkill /PID 1234 /F
```

### Hot Reload Not Working
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run start:web
```

### API Connection Errors
```bash
# Make sure API is running
npm run start:api

# Check .env file
# VITE_API_URL=http://localhost:3000
```

### Tests Failing
```bash
# Clear jest cache
npx jest --clearCache

# Run tests again
npm run test:web
```

### Dependencies Installation Issues
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 👥 Development Tips

### Format Code Automatically
```bash
npm run format
```

### Check Code Quality Issues
```bash
npm run lint:web
```

### Auto-fix Linting Issues
```bash
npm run lint:web:fix
```

### Use React DevTools Extension
Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/) for better debugging.

### Create New Component
```typescript
// src/app/components/button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

---

## 🚀 Deploying

### Build for Production
```bash
npm run build:web
```

Output: `dist/web/`

### Run in Docker
```bash
# Build and run with Docker
docker compose up web
```

### Environment Variables for Production
```env
VITE_API_URL=https://api.production.com
```

---

## 🔐 Environment Variables

Create `.env` file in root:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Dokkan
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 📦 Package Dependencies

- **react** - UI framework
- **react-dom** - React DOM rendering
- **react-router-dom** - Routing library
- **@vitejs/plugin-react** - React plugin for Vite
- **tailwindcss** - CSS framework (optional)
- **@testing-library/react** - Testing utilities
- **jest** - Test runner
- **typescript** - Type checking

---

## ❓ Need Help?

- Check this file first
- Ask in team chat
- Check [main README](../README.md)
- Check [DEVELOPMENT.md](../DEVELOPMENT.md)
- Check [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)
