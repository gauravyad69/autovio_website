# Build stage - use Node.js Alpine image
FROM node:20.18.1-alpine AS build
WORKDIR /ecommerce

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and build
COPY . .
RUN npm run build --prod

# Final stage - use Caddy Alpine image
FROM caddy:2.6.0-alpine
COPY Caddyfile /etc/caddy/Caddyfile

# List directories during the build process
RUN ls -d /
RUN ls -d */
RUN ls -d /
RUN ls -d ecommerce/
RUN ls -d app/

# Copy built assets from build stage

COPY --from=build /app/dist/ecommerce/* /usr/share/caddy
# Expose the port and use default Caddy command
EXPOSE 9092

