# Use an official lightweight Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Use the production start script
CMD ["npm", "start"]
