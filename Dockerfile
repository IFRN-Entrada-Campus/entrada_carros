FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json .
RUN npm install
COPY frontend .
RUN npm install -g @angular/cli
EXPOSE 8080

FROM node:18 AS backend
WORKDIR /app/backend
COPY backend/package.json .
RUN npm install
COPY backend .
EXPOSE 3000