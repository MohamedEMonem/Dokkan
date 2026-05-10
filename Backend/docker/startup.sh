#!/usr/bin/env sh
set -eu

POSTGRES_HOST="${POSTGRES_HOST:-}"
POSTGRES_PORT="${POSTGRES_PORT:-}"

if [ -z "$POSTGRES_HOST" ] || [ -z "$POSTGRES_PORT" ]; then
  if [ -n "${DATABASE_URL:-}" ]; then
    HOSTPORT=$(printf '%s' "$DATABASE_URL" | sed -E 's|^[^@]+@||' | sed -E 's|/.*$||')
    if [ -z "$POSTGRES_HOST" ]; then
      POSTGRES_HOST=$(printf '%s' "$HOSTPORT" | sed -E 's|:.*$||')
    fi
    if [ -z "$POSTGRES_PORT" ]; then
      PORT_PART=$(printf '%s' "$HOSTPORT" | sed -E 's|^[^:]+:?||')
      if [ -n "$PORT_PART" ] && [ "$PORT_PART" != "$HOSTPORT" ]; then
        POSTGRES_PORT="$PORT_PART"
      fi
    fi
  fi
fi

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
  printf '%s\n' "No committed Prisma SQL migrations found. Skipping migrate deploy."
fi

if [ "${AUTO_SEED:-true}" = "true" ]; then
  printf '%s\n' "Seeding database..."
  node prisma/seed.js
else
  printf '%s\n' "AUTO_SEED is false. Skipping seed step."
fi

printf '%s\n' "Starting backend server..."
exec npm run start
