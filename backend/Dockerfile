FROM node:18 AS backend
WORKDIR /app/backend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000