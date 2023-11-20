FROM node:20.9.0 as build
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM docker.io/nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build frontend/dist/crud-carros /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html/
EXPOSE 80