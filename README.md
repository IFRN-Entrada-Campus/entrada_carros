# Guia para instalação e execução do sistema.

O programa foi planejado para ser executado em contêineres através do uso do Docker se utilizando do Docker compose.
Veja [aqui](https://docs.docker.com/engine/install/) como instalar o Docker no seu sistema operacional e [aqui](https://docs.docker.com/compose/install/) como instalar o Docker Compose.

## Comandos para rodar a aplicação com contêineres:

~~~shell
docker compose up --build
~~~

No caso de querer apagar os contêineres:
~~~shell
docker compose down
~~~

Se for também necessário apagar o banco de dados e os outros volumes:
~~~shell
docker compose down --volumes
~~~

### As seguintes portas serão ocupadas uma vez que o sistema estiver rodando:

* 8080: Angular com Nginx (frontend)
* 3000: Express com Node.js (backend)
* 3306: MySQL
* 8081: PHPMyAdmin