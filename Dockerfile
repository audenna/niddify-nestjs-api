# ===============================
# Build Stage
# ===============================
FROM node:24.1.0-slim AS builder

# Set working directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# Fix SSL issue with Yarn on Alpine / Debian slim
RUN apt-get update && apt-get install -y ca-certificates curl && update-ca-certificates
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


# ===============================
# Production Stage
# ===============================
FROM node:24.1.0-slim

# Install dependencies required by Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Set Puppeteer environment variable to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["node", "dist/main.js"]