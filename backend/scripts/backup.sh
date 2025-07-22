#!/bin/bash

BACKUP_DIR="/backups"
SOURCE_DIR="/imagens"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="backup_$DATE.tar.gz"
LOG_FILE="$BACKUP_DIR/backup.log"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-90} 

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Iniciando processo de backup..."

if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    log "Diretório de backup criado: $BACKUP_DIR"
fi

if [ ! -d "$SOURCE_DIR" ]; then
    log "ERRO: Diretório de origem $SOURCE_DIR não encontrado!"
    exit 1
fi

IMAGE_COUNT=$(find "$SOURCE_DIR" -type f -name "*.png" | wc -l)
if [ "$IMAGE_COUNT" -eq 0 ]; then
    log "Nenhuma imagem encontrada para backup. Processo finalizado."
    exit 0
fi

log "Encontradas $IMAGE_COUNT imagens para backup."

log "Criando arquivo de backup: $BACKUP_FILE"
tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C "$SOURCE_DIR" .

if [ $? -eq 0 ]; then
    log "Backup concluído com sucesso: $BACKUP_FILE ($(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1))"
    
    log "Backups disponíveis:"
    ls -lh "$BACKUP_DIR" | grep ".tar.gz" | awk '{print $9 " (" $5 ")"}' >> "$LOG_FILE"
    
    log "Removendo backups mais antigos que $RETENTION_DAYS dias..."
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    REMAINING_BACKUPS=$(find "$BACKUP_DIR" -name "backup_*.tar.gz" | wc -l)
    log "Restaram $REMAINING_BACKUPS arquivos de backup."
else
    log "ERRO: Falha ao criar arquivo de backup!"
fi

log "Processo de backup finalizado."
exit 0