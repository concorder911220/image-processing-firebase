# Start with the official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy the entire project source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Build TypeScript to JavaScript
RUN npm run build

# Run the application
CMD ["node", "dist/index.js"]
