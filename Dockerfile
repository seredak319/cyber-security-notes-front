# Stage 1: Build frontend assets
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Set up NGINX with SSL
FROM nginx:1.25.3-alpine

# Copy SSL certificate and key to NGINX directory
COPY /server.crt /etc/nginx/server.crt
COPY /server.key /etc/nginx/server.key
# Copy NGINX configuration with SSL enabled
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend assets
COPY --from=builder /app/build /usr/share/nginx/html

# Expose HTTPS port
EXPOSE 443

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
