FROM docker.io/nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf
COPY crud-carros /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html/
EXPOSE 8080