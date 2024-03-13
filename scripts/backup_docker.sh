#!/bin/bash

# Diretório de backup
BACKUP_DIR="/backup/docker"

# Obter a lista de contêineres em execução
CONTAINERS=$(docker ps -q)

# Iterar sobre cada contêiner e realizar backup
for CONTAINER_ID in $CONTAINERS
do
    CONTAINER_NAME=$(docker inspect -f '{{.Name}}' $CONTAINER_ID | cut -c 2-)
    BACKUP_FILE="$BACKUP_DIR/$CONTAINER_NAME-$(date +"%Y%m%d%H%M%S").tar.gz"

    # Realizar o backup do contêiner
    docker export $CONTAINER_ID | gzip > $BACKUP_FILE

    echo "Backup do contêiner $CONTAINER_NAME concluído: $BACKUP_FILE"
done

echo "Backup concluído em $(date +"%Y-%m-%d %H:%M:%S")"
