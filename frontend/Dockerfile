FROM node:23-slim

WORKDIR /app

COPY frontend/package*.json .

RUN npm install

COPY frontend/ .

# Build production version
RUN npm run build

# Install serve to host the static files
RUN npm install -g serve

EXPOSE 3000

# Use serve to deliver the built app
CMD ["serve", "-s", "build", "-l", "3000"]

