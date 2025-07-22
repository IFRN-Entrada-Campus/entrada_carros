#!/bin/bash

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Serviço de backup iniciado" >> /backups/backup.log

service cron start

echo "Serviço de backup em execução. Backups programados para ocorrer diariamente à meia-noite."
echo "Execute o backup manualmente com: docker exec backup-service /app/scripts/backup.sh"

tail -f /dev/null