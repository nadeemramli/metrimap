# Build from the REPO ROOT:  docker build -f mcp-server/Dockerfile -t metrimap-mcp .
# The server imports shared code from src/, so it needs the app's root deps.
FROM node:22-slim
WORKDIR /app

# App runtime deps (the tool registry pulls supabase-js / zod / dagre from here).
# --ignore-scripts: skip the root "prepare": "husky" hook — husky is a devDep that
# --omit=dev doesn't install, so the lifecycle script would fail with exit 127.
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund --ignore-scripts

# App source the server imports + the server itself.
COPY tsconfig*.json ./
COPY src ./src
COPY mcp-server ./mcp-server

WORKDIR /app/mcp-server
RUN npm install --no-audit --no-fund

ENV PORT=8787
EXPOSE 8787
CMD ["npm", "start"]
