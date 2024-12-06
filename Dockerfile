# Stage 1: Build the React Vite app
FROM node:16 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Remove the default nginx configuration
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add a custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
