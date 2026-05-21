FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache bash netcat-openbsd dos2unix

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY prisma.config.js ./
RUN npx prisma generate

COPY . .
RUN npm run build
RUN dos2unix docker/startup.sh && chmod +x docker/startup.sh

EXPOSE 3000

CMD ["bash", "docker/startup.sh"]