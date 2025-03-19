FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV VITE_API_URL=http://localhost:8000/api

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev", "--", "--host"] 