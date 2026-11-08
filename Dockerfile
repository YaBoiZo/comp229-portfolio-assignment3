FROM node:24-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY client/package*.json ./client/
RUN npm ci --prefix client
COPY . .
RUN npm --prefix client run build
ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
CMD ["node", "production.js"]
