FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json .
RUN npm install
COPY frontend .
RUN npm run build

FROM node:18 AS backend
WORKDIR /app/backend
COPY backend/package.json .
RUN npm install
COPY backend .

FROM node:18
WORKDIR /app
COPY --from=frontend /app/frontend/dist ./frontend/dist
COPY --from=backend app/backend .
EXPOSE 3000
CMD ["node", "app.js"]