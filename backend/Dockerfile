FROM node:18-alpine

# Install Chromium and dependencies for puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create directory for WhatsApp session data
RUN mkdir -p whatsapp-session && chown -R node:node whatsapp-session

# Switch to non-root user
USER node

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
