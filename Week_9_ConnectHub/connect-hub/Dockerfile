FROM node:20-alpine AS client-builder
WORKDIR /connect-hub/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS server-builder
WORKDIR /connect-hub
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /connect-hub

COPY package*.json ./
RUN npm ci --only=production

COPY --from=server-builder /connect-hub/dist ./dist
COPY --from=client-builder /connect-hub/client/dist ./client/dist

EXPOSE 3000

CMD ["node", "dist/main.js"]