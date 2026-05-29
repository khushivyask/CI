# ── Stage 1: Build Angular ──────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: Serve with Nginx ───────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY --from=builder /app/dist/ecommerce-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1