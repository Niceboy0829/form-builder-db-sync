# Use the official Node.js image as a base
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (default for Express is usually 3030)
EXPOSE 3030

# Command to run your app
CMD ["npm", "run", "api"]
