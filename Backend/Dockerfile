FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash netcat-openbsd

COPY package*.json ./
RUN npm ci

COPY . .
ENV DATABASE_URL=postgres://dummy:dummy@localhost:5432/dummy
RUN npx prisma generate
RUN chmod +x docker/startup.sh

EXPOSE 3000

CMD ["sh", "docker/startup.sh"]
