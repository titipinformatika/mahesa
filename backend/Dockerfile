FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .

FROM oven/bun:1-slim AS runner
WORKDIR /app
# Gunakan non-root user untuk keamanan
RUN adduser --system --uid 1001 appuser
COPY --from=builder --chown=appuser:appuser /app .
USER appuser

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
