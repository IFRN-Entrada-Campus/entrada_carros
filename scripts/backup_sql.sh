#!/bin/bash

# Configurações do banco de dados
DB_USER="root"
DB_PASSWORD=""
DB_NAME="dbentrada"
DB_HOST="localhost"  # ou o endereço IP do container, dependendo do seu ambiente Docker

# Diretório de backup
BACKUP_DIR="/backup/sql"

# Nome do arquivo de backup
BACKUP_FILE="${BACKUP_DIR}/backup_$(date '+%Y%m%d%H%M%S').sql"

# Comando mysqldump para criar o backup
docker exec -i db mysqldump -u$DB_USER -p$DB_PASSWORD -h$DB_HOST $DB_NAME > $BACKUP_FILE

# Verificar se o backup foi criado com sucesso
if [ $? -eq 0 ]; then
    echo "Backup criado com sucesso em: $BACKUP_FILE"
else
    echo "Erro ao criar o backup"
fi