# Build context is the repo root (see docker-compose.yml) so we can also
# copy the seed JSON that lives in the frontend's data dir.
FROM node:20-alpine
WORKDIR /app

COPY server/package.json ./package.json
RUN npm install --no-audit --no-fund

COPY server/tsconfig.json ./tsconfig.json
COPY server/src ./src
COPY src/data/work-projects.json /app/seed-data.json

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["npm", "run", "start"]
