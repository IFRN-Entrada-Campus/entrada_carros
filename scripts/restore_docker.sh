#!/bin/bash

# Diretório de backup
BACKUP_DIR="/backup/docker"

# Lista todos os arquivos de backup no diretório
BACKUP_FILES=$(ls $BACKUP_DIR/*.tar.gz)

# Iterar sobre cada arquivo de backup e realizar a restauração
for BACKUP_FILE in $BACKUP_FILES
do
    CONTAINER_NAME=$(basename $BACKUP_FILE | cut -d'-' -f1)
    NEW_CONTAINER_NAME="$CONTAINER_NAME-$(date +"%Y%m%d%H%M%S")"

    # Restaurar o contêiner a partir do arquivo de backup
    zcat $BACKUP_FILE | docker import - $NEW_CONTAINER_NAME

    echo "Restauração do contêiner $NEW_CONTAINER_NAME concluída a partir de $BACKUP_FILE"
done

echo "Restauração concluída em $(date +"%Y-%m-%d %H:%M:%S")"
