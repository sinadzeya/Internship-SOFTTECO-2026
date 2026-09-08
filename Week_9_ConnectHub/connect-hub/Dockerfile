FROM node:20-alpine AS server-builder
WORKDIR /connect-hub/src
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build
FROM node:20-alpine
WORKDIR /connect-hub/src
COPY package*.json ./
RUN npm ci --only=production
COPY --from=server-builder /connect-hub/src/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]