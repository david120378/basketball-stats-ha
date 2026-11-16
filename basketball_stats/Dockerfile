FROM node:20-alpine
WORKDIR /app
COPY server.js index.html favicon.svg apple-touch-icon.png ./
ENV PORT=8099 DATA_DIR=/data INGRESS_ONLY=1
CMD ["node", "server.js"]
