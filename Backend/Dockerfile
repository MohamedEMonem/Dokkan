FROM node:20-alpine AS build

WORKDIR /app

RUN apk add --no-cache bash netcat-openbsd dos2unix

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.js ./
RUN npx prisma generate

COPY . .
RUN npm run build
RUN dos2unix docker/startup.sh && chmod +x docker/startup.sh

FROM node:20-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache bash netcat-openbsd dos2unix

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.js ./prisma.config.js
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/prisma ./node_modules/prisma
COPY --from=build /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=build /app/docker ./docker

RUN dos2unix docker/startup.sh && chmod +x docker/startup.sh

EXPOSE 3000

CMD ["bash", "docker/startup.sh"]