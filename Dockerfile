FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy application files
COPY . .

# Expose health check port
EXPOSE 3000

# Start the bot
CMD ["node", "index-railway.js"]
