# Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy rest of the frontend
COPY . ./

RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm install --production

EXPOSE 4000

CMD ["npm", "start"]
