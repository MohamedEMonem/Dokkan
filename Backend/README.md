# Dokkan Backend

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

```bash
cp env.example .env
```

### 3. Start infrastructure (PostgreSQL, Redis, Meilisearch, MinIO, pgAdmin)

```bash
npm run infra:up
```

> **Windows users:** If port 5432 is blocked by Hyper-V, run in an **admin terminal**:
>
> ```
> net stop winnat
> npm run infra:up
> net start winnat
> ```

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
| `npm run infra:up` | Start all Docker services |
| `npm run infra:down` | Stop all Docker services |
| `npm run infra:logs` | View Docker service logs |
| `npm run infra:clean` | Stop services and **delete all data** |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:studio` | Open Prisma Studio (DB browser) |

## Services

| Service | URL |
|---|---|
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6379` |
| Meilisearch | `http://localhost:7700` |
| MinIO Console | `http://localhost:9001` |
| pgAdmin | `http://localhost:5050` |
| Prisma Studio | `http://localhost:5555` (after `npm run db:studio`) |
