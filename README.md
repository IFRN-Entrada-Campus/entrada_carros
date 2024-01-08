# Sistema de registro de carros

## Sobre
A aplicação é essencialmente um sistema de cadastro de carros associados a seus motorista com suporte a leitura e validação de QRcode e recebimento de mensagens via MQTT.
Feito utilizando Angular com Node.js(express) e implantado através de contêineres Docker.

## Guia para instalação e execução do sistema.

O programa foi planejado para ser executado em contêineres através do uso do Docker se utilizando do Docker compose. A maneira mais fácil é instalando o [Docker Desktop](https://www.docker.com/products/docker-desktop/) que na instalação já inclui ambos serviços.

Caso queira instalar os serviços individualmente, veja [aqui](https://docs.docker.com/engine/install/) como instalar o Docker no seu sistema operacional e [aqui](https://docs.docker.com/compose/install/) como instalar o Docker Compose.

### Comandos para rodar a aplicação com contêineres:

Para construir e subir os contêineres que rodam toda a aplicação:
~~~bash
docker compose up --build -d
~~~

No caso de querer apagar os contêineres:
~~~bash
docker compose down
~~~

Se for também necessário apagar o banco de dados e os outros volumes:
~~~bash
docker compose down --volumes
~~~

#### As seguintes portas serão ocupadas uma vez que o sistema estiver rodando:

* 80 e 443: Angular (frontend)
* 3000: Express com Node.js (backend)
* 3306: MySQL
* 8081: PHPMyAdmin
* 1884: MQTT broker

#### A configuração padrão do server nginx conta com dois endereços

* https://seu_endereço/ : Interface web de cadastro
* https://seu_endereço/api : Solicitações para a api
Substitua "seu_endereço" pelo IP da sua máquina ou nome do host.

### Swagger

Para acessar a documentação com os endpoints e suas funções entre em https://seu_endereço/api/docs/
