# Dokkan — Frontend

The frontend client for the **Dokkan** multi-tenant web application.

## Tech Stack

| Category            | Technology                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| **Language**        | [TypeScript](https://www.typescriptlang.org/) ~5.9                        |
| **UI Library**      | [React](https://react.dev/) 19                                            |
| **Build Tool**      | [Vite](https://vite.dev/) 7                                               |
| **Styling**         | [Tailwind CSS](https://tailwindcss.com/) 4                                |
| **State Management**| [Redux Toolkit](https://redux-toolkit.js.org/) 2 + [React-Redux](https://react-redux.js.org/) 9 |
| **Routing**         | [React Router](https://reactrouter.com/) 7                                |
| **Linting**         | [ESLint](https://eslint.org/) 9 with typescript-eslint                    |

## Project Structure

```
src/
├── api/          # API client & request helpers
├── assets/       # Static assets (images, SVGs, etc.)
├── components/   # Reusable UI components
├── features/     # Feature-based modules
├── hooks/        # Custom React hooks
├── layout/       # Layout design (customer, store owner, etc.)
├── routes/       # Route definitions & page components
├── types/        # Shared TypeScript types & interfaces
├── App.tsx       # Root application component
├── main.tsx      # Entry point
└── index.css     # Global styles
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm / yarn / pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Path Aliases

The project uses `@/` as an alias for the `src/` directory, configured in [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json).

```tsx
import MyComponent from '@/components/MyComponent'
```
