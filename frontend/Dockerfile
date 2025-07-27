# Stage 1: Build the React.js application with Vite
FROM node:20-alpine AS builder

WORKDIR /app/frontend

# Pin npm to a known stable version
RUN npm install -g npm@10.8.2

# Set npm's network timeout settings to be more resilient against network issues
ENV NPM_CONFIG_NETWORK_TIMEOUT=600000
ENV NPM_CONFIG_FETCH_RETRY_MINTIMER=60000
ENV NPM_CONFIG_FETCH_RETRY_FACTOR=2
ENV NPM_CONFIG_FETCH_RETRIES=5

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json* ./

# Install dependencies (production + dev dependencies, as Vite itself is a dev dependency)
RUN npm install

# Copy the rest of your application code into the builder stage
COPY . .

# Build the Vite application for production (this generates the 'dist' folder)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build # This command must succeed to produce the 'dist' folder

# Stage 2: Serve the application (development mode via docker-compose command override)
FROM node:20-alpine AS runner

WORKDIR /app/frontend

# Install 'serve' globally for when this stage runs in production (default CMD)
RUN npm install -g serve

# --- CRITICAL CHANGE: Install project dependencies in runner stage ---
# Copy package.json and package-lock.json to the runner stage.
COPY package.json package-lock.json* ./
# Install all project dependencies (including devDeps like Vite itself)
# This is essential because 'npm run dev' (used by docker-compose) needs
# access to ALL project dependencies (including Vite) at runtime to process
# vite.config.js and serve the development build with HMR.
RUN npm install
# --- END CRITICAL CHANGE ---

# Copy the built 'dist' folder from the 'builder' stage to the 'runner' stage.
# This is for when the default CMD ["npx", "serve"] is actually used in production.
COPY --from=builder /app/frontend/dist ./dist

# Expose the port the app runs on (frontend web server).
EXPOSE 3000

# Set development environment for runtime
ENV NODE_ENV=development

# Default command for production serving (will be overridden by docker-compose for dev)
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]