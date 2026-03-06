# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine

# Use a wildcard to ensure we grab the right folder even if the project name varies slightly
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

# This is the critical part: Copying the NEW config we discussed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80