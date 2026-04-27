# Dokkan Backend

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Frontend Team One-Shot Setup

Use this path if you want the full backend stack (API + PostgreSQL + Redis + Meilisearch + MinIO) in one command.

### 1. Install dependencies

```bash
npm install
```

### 2. Start full stack

```bash
npm run backend:up
```

### 3. Check API health

```bash
http://localhost:3000/api/health
```

### 4. View logs / stop / reset data

```bash
npm run backend:logs
npm run backend:down
npm run backend:reset
```

Notes:
- Database schema is synced automatically during startup.
- Seed data is inserted automatically by default (`AUTO_SEED=true`).
- This flow is isolated in `docker-compose.backend.yml` and does not change the backend team compose workflow.

## Backend Team Existing Local Workflow

This is the current local development pattern (infrastructure in Docker, API on host):

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

```bash
cp env.example .env
```

### 3. Start infrastructure

```bash
npm run infra:up
```

### 4. Apply database migrations

```bash
npm run db:migrate
```

### 5. Start the dev server

```bash
npm run dev
```

## Useful Commands

| Command | Description |
|---|---|
| `npm run backend:up` | Start isolated frontend backend stack with Docker |
| `npm run backend:down` | Stop isolated frontend backend stack |
| `npm run backend:logs` | View logs for isolated frontend backend stack |
| `npm run backend:reset` | Stop isolated stack and delete its volumes |
| `npm run infra:up` | Start existing backend team infrastructure stack |
| `npm run infra:down` | Stop existing backend team infrastructure stack |
| `npm run infra:logs` | View existing backend team infrastructure logs |
| `npm run infra:clean` | Stop existing stack and delete all data |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:studio` | Open Prisma Studio |

## Troubleshooting (Windows)

If port 5432 is blocked by Hyper-V, run this in an admin terminal:

```bash
net stop winnat
npm run backend:up
net start winnat
```

If default ports are busy, override values in `.env` before running the command.

## API Documentation with Swagger
We use **Swagger UI** combined with **Swagger Autogen** to automatically generate and serve our API documentation. This keeps our code clean and our docs perfectly in sync with our actual endpoints.
### Viewing the Docs
1. Start the development server (`npm run dev` or `npm start`).
2. Open your browser and navigate to: **`http://localhost:3000/api/docs`** 

More details on how to document new routes can be found in [swagger.MD](./swagger.MD).