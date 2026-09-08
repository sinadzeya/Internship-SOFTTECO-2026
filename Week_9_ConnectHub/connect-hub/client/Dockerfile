FROM node:20-alpine AS client-builder
WORKDIR /connect-hub/client
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=client-builder /connect-hub/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]