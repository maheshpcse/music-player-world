FROM node:24-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

# The backend lockfile includes a local file:.. dependency.
COPY package.json ./
COPY backend/package.json backend/package-lock.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev && npm cache clean --force

COPY backend/knexfile.js ./
COPY backend/src ./src
RUN mkdir -p uploads/songs uploads/audio

# Railway supplies PORT at runtime.
CMD ["node", "src/server.js"]
