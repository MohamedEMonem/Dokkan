#!/usr/bin/env sh
set -eu

POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
RETRIES="${DB_WAIT_RETRIES:-60}"

printf '%s\n' "Waiting for Postgres at ${POSTGRES_HOST}:${POSTGRES_PORT} ..."
i=1
while [ "$i" -le "$RETRIES" ]; do
  if nc -z "$POSTGRES_HOST" "$POSTGRES_PORT" >/dev/null 2>&1; then
    printf '%s\n' "Postgres is reachable."
    break
  fi
  if [ "$i" -eq "$RETRIES" ]; then
    printf '%s\n' "Postgres did not become reachable in time."
    exit 1
  fi
  i=$((i + 1))
  sleep 2
done

if find prisma/migrations -type f -name '*.sql' | grep -q '.'; then
  printf '%s\n' "Applying committed Prisma migrations..."
  npx prisma migrate deploy
else
  printf '%s\n' "No committed Prisma SQL migrations found. Syncing schema with prisma db push..."
  DB_PUSH_ACCEPT_DATA_LOSS="${DB_PUSH_ACCEPT_DATA_LOSS:-false}"
  if [ "$DB_PUSH_ACCEPT_DATA_LOSS" = "true" ]; then
    printf '%s\n' "Running 'prisma db push --accept-data-loss' (DB_PUSH_ACCEPT_DATA_LOSS=true)."
    npx prisma db push --accept-data-loss
  else
    npx prisma db push
  fi
fi

if [ "${AUTO_SEED:-true}" = "true" ]; then
  printf '%s\n' "Seeding database..."
  node prisma/seed.js
else
  printf '%s\n' "AUTO_SEED is false. Skipping seed step."
fi

printf '%s\n' "Starting backend server..."
exec npm run dev
