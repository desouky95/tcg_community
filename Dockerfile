# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS base
WORKDIR /workspace
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV CI=true
RUN corepack enable
# Cache downloads independently of application source, as in infra/Dockerfile.backend.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm fetch

FROM base AS source
COPY . .

FROM base AS dev-dependencies
COPY --parents apps/*/package.json packages/*/package.json ./
RUN mkdir -p .agents/skills && pnpm install --offline --frozen-lockfile \
    --filter @tcg/medusa... --filter @tcg/public-web... --filter @tcg/api... --filter @tcg/strapi... --filter @tcg/web...

FROM dev-dependencies AS dev
COPY . .
ENV NODE_ENV=development

FROM source AS backend-build
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --offline --frozen-lockfile --filter @tcg/medusa...
ARG ADMIN_AUTH_TYPE=session
RUN pnpm --filter @tcg/medusa... --if-present run build
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm --filter @tcg/medusa --prod deploy --legacy /prod/backend

FROM node:24-bookworm-slim AS backend
ENV NODE_ENV=production

ENV COREPACK_HOME=/opt/corepack
RUN corepack enable \
    && corepack prepare pnpm@12.15.0 --activate \
    && chown -R node:node /opt/corepack
WORKDIR /app
COPY --from=backend-build --chown=node:node /prod/backend ./
COPY --from=backend-build --chown=node:node /workspace/apps/backend/.medusa ./.medusa
WORKDIR /app/.medusa/server
USER node
EXPOSE 9000
CMD ["/app/node_modules/.bin/medusa", "start"]

FROM source AS public-web-build
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --offline --frozen-lockfile --filter @tcg/public-web...
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STRAPI_API_URL
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_DEFAULT_REGION
ARG NEXT_PUBLIC_APP_URL
RUN pnpm --filter @tcg/public-web... --if-present run build

FROM node:24-bookworm-slim AS public-web
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=public-web-build --chown=node:node /workspace/apps/public-web/.next/standalone ./
COPY --from=public-web-build --chown=node:node /workspace/apps/public-web/.next/static ./apps/public-web/.next/static
COPY --from=public-web-build --chown=node:node /workspace/apps/public-web/public ./apps/public-web/public
USER node
EXPOSE 3000
CMD ["node", "apps/public-web/server.js"]

FROM source AS api-build
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --offline --frozen-lockfile --filter @tcg/api...
RUN pnpm --filter @tcg/api... --if-present run build
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm --filter @tcg/api --prod deploy --legacy /prod/api

FROM node:24-bookworm-slim AS api
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3333
WORKDIR /app
COPY --from=api-build --chown=node:node /prod/api/node_modules ./node_modules
COPY --from=api-build --chown=node:node /workspace/apps/api/build ./
USER node
EXPOSE 3333
CMD ["node", "bin/server.js"]

FROM source AS cms-build
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --offline --frozen-lockfile --filter @tcg/strapi...
RUN pnpm --filter @tcg/strapi... --if-present run build
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm --filter @tcg/strapi --prod deploy --legacy /prod/cms

FROM node:24-bookworm-slim AS cms
ENV NODE_ENV=production HOST=0.0.0.0 PORT=1337
ENV COREPACK_ENABLE_PROJECT_SPEC=0
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate
WORKDIR /app
COPY --from=cms-build --chown=node:node /prod/cms ./
COPY --from=cms-build --chown=node:node /workspace/apps/cms/dist ./dist
RUN mkdir -p public/uploads && chown -R node:node public/uploads
USER node
EXPOSE 1337
CMD ["./node_modules/.bin/strapi", "start"]

FROM source AS web-build
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --offline --frozen-lockfile --filter @tcg/web...
ARG VITE_API_URL
ARG VITE_PUBLIC_WEB_URL
RUN pnpm --filter @tcg/web... --if-present run build

FROM nginx:alpine AS web
COPY --from=web-build /workspace/apps/web/dist /usr/share/nginx/html
COPY infra/nginx.web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Shared process runtime has no application-specific working directory or command.
FROM node:24-bookworm-slim AS bundle-runtime
ENV NODE_ENV=production COREPACK_HOME=/opt/corepack COREPACK_ENABLE_PROJECT_SPEC=0
WORKDIR /srv
RUN corepack enable \
    && corepack prepare pnpm@12.15.0 --activate \
    && chown -R node:node /opt/corepack \
    && apt-get update \
    && apt-get install -y --no-install-recommends nginx gettext-base tini util-linux redis-server \
    && rm -rf /var/lib/apt/lists/*
COPY infra/start-app-platform.sh /usr/local/bin/start-app-platform
COPY infra/run-app.sh /usr/local/bin/run-app
COPY infra/bundle-readiness.mjs /usr/local/bin/bundle-readiness.mjs
COPY infra/nginx.app-platform.conf.template /etc/nginx/app-platform.conf.template
RUN chmod +x /usr/local/bin/start-app-platform /usr/local/bin/run-app
USER node
EXPOSE 8080
CMD ["/usr/bin/tini", "--", "/usr/local/bin/start-app-platform"]

# One distributable image; each application contributes only its runtime files.
FROM bundle-runtime AS all-apps
COPY --from=backend --chown=node:node /app /app
COPY --from=api --chown=node:node /app /srv/api
COPY --from=public-web --chown=node:node /app /srv/public-web
COPY --from=cms --chown=node:node /app /srv/cms
COPY --from=web-build /workspace/apps/web/dist /srv/web

# Single App Platform component; all application processes share one lifecycle.
FROM all-apps AS app-platform
CMD ["/usr/bin/tini", "--", "/usr/local/bin/start-app-platform"]
