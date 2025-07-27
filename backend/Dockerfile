FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app/backend

# Copy package files
COPY package.json package-lock.json* ./

# -------- Development Stage --------
FROM base AS development

# Install ALL dependencies (including devDependencies like nodemon)
RUN npm ci

# Copy application source code
COPY . .

# Create a local data directory
RUN mkdir -p /app/backend/data && chown -R node:node /app/backend/data

# Use non-root user
USER node

# Expose application port
EXPOSE 8000

# Set environment to development
ENV NODE_ENV=development

# Default command for development (uses nodemon from package.json)
CMD ["npm", "run", "dev"]

# -------- Production Builder Stage --------
FROM base AS builder

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# -------- Production Runtime Stage --------
FROM node:20-alpine AS production

WORKDIR /app/backend

# Copy dependencies and source from builder
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/src ./src
COPY --from=builder /app/backend/package.json ./package.json

# Create a local data directory
RUN mkdir -p /app/backend/data && chown -R node:node /app/backend/data

# Use non-root user
USER node

# Expose application port
EXPOSE 8000

# Set environment to production
ENV NODE_ENV=production

# Default command for production
CMD ["npm", "start"]