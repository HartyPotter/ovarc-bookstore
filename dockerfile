# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables (optional defaults)
ENV PORT=3000
ENV NODE_ENV=production

# Start the app
CMD ["node", "server.js"]
