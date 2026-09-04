# Frontend: build the prerendered (SSG) site, then serve it with nginx.
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
ARG VITE_SITE_URL
ARG VITE_API_URL
ENV VITE_SITE_URL=${VITE_SITE_URL}
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM nginx:alpine
# Limit envsubst to our own placeholders so nginx variables survive.
ENV NGINX_ENVSUBST_FILTER="ASSET_BASE_URL"
ENV ASSET_BASE_URL=""
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
