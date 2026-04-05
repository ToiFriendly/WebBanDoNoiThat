# ============================================
# Dockerfile cho Backend (Node.js/Express)
# ============================================

# Stage 1: Build dependencies
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first (tận dụng Docker cache layer)
COPY package.json package-lock.json* ./

# Cài dependencies (production only)
RUN npm install --omit=dev

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Tạo non-root user cho bảo mật
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies từ builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Đổi quyền sở hữu
RUN chown -R appuser:appgroup /app

USER appuser

# Expose port
EXPOSE 5000

# Health check - install wget first
RUN apk add --no-cache wget

HEALTHCHECK --interval=15s --timeout=10s --start-period=90s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start server
CMD ["node", "server.js"]
