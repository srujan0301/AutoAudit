# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Run as non-root user for security
RUN chown -R node:node /app
USER node

# Run development server
CMD ["npm", "start"]
