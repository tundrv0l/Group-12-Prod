FROM node:23-slim

WORKDIR /app

COPY frontend/package*.json .

RUN npm install

COPY frontend/ .

# Build production version
RUN npm run build

# Create the script to replace placeholders
RUN echo '#!/bin/sh \n\
sed -i "s|PLACEHOLDER_API_URL|${REACT_APP_API_URL:-http://localhost:5000}|g" /app/build/env-config.js \n\
sed -i "s|PLACEHOLDER_API_KEY|${API_KEY:-default-key}|g" /app/build/env-config.js \n\
exec serve -s build -l 3000' > /app/start.sh && \
chmod +x /app/start.sh

# Install serve to host the static files
RUN npm install -g serve

EXPOSE 3000

# Use serve to deliver the built app
CMD ["/app/start.sh"]

