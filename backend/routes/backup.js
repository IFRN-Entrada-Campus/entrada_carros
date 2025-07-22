const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const mysql = require('mysql2');

const BACKUP_DIR = '/backups';
const IMAGES_DIR = '/imagens';

var con = mysql.createPool({
    host: 'db',
    user: 'root',
    password: '',
    database: 'dbentrada',
    connectionLimit: 50,
    connectTimeout: 30000,
});

/**
 * @swagger
 * tags:
 *   name: Backup
 *   description: Operações relacionadas a backup e restauração de imagens
 */

function verificarToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'Nenhum token de autenticação informado.',
        });
    }
    
    jwt.verify(token, process.env.JWT_SEGREDO, function (err, decoded) {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Token inválido.' });
        }
        
        const agoraEmSegundos = Math.floor(Date.now() / 1000);
        if (decoded.exp < agoraEmSegundos) {
            return res.status(401).json({ auth: false, message: 'Token expirado.' });
        }
        
        next();
    });
}

function verificarAdmin(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'Nenhum token de autenticação informado.'
        });
    }
    
    jwt.verify(token, process.env.JWT_SEGREDO, function (err, decoded) {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Token inválido.' });
        }
        
        const agoraEmSegundos = Math.floor(Date.now() / 1000);
        if (decoded.exp < agoraEmSegundos) {
            return res.status(401).json({ auth: false, message: 'Token expirado.' });
        }
        
        const role = decoded.role;
        if (role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                auth: false,
                message: 'Acesso negado. Somente usuários com papel de admin podem realizar essa operação'
            });
        }
    });
}

/**
 * @swagger
 * /api/backup/list:
 *  get:
 *      summary: Lista todos os backups disponíveis
 *      description: Retorna uma lista de todos os arquivos de backup com informações detalhadas
 *      tags: [Backup]
 */
router.get('/list', verificarToken, function(req, res) {    
    if (!fs.existsSync(BACKUP_DIR)) {
        return res.status(200).json({ 
            total: 0,
            backups: [],
            message: 'Nenhum backup encontrado. O diretório de backups ainda não foi criado.'
        });
    }
    
    try {        
        const files = fs.readdirSync(BACKUP_DIR);
                
        const backupFiles = files.filter(file => file.startsWith('backup_') && file.endsWith('.tar.gz'));
            
        const backups = backupFiles.map(file => {
            const filePath = path.join(BACKUP_DIR, file);
            const stats = fs.statSync(filePath);
            
            return {
                filename: file,
                created: stats.mtime,
                size: stats.size,
                sizeFormatted: formatBytes(stats.size)
            };
        });
                
        backups.sort((a, b) => b.created - a.created);
        
        res.status(200).json({ 
            total: backups.length,
            backups 
        });
    } catch (error) {
        console.error('Erro ao listar backups:', error);
        res.status(500).json({ message: 'Erro ao listar backups', error: error.message });
    }
});

/**
 * @swagger
 * /api/backup/create:
 *  post:
 *      summary: Cria um novo backup manualmente
 *      description: Inicia o processo de backup das imagens manualmente
 *      tags: [Backup]
 */
router.post('/create', verificarAdmin, function(req, res) {    
    exec('docker exec backup-service /app/scripts/backup.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar backup: ${error.message}`);
            return res.status(500).json({ 
                success: false,
                message: 'Erro ao executar backup', 
                error: error.message 
            });
        }
        
        if (stderr) {
            console.error(`Erro no script de backup: ${stderr}`);
            return res.status(500).json({ 
                success: false,
                message: 'Erro no script de backup', 
                error: stderr 
            });
        }
        
        console.log(`Backup executado com sucesso: ${stdout}`);
        res.status(200).json({ 
            success: true,
            message: 'Backup criado com sucesso',
            details: stdout
        });
    });
});

/**
 * @swagger
 * /api/backup/restore/{filename}:
 *  post:
 *      summary: Restaura imagens de um backup
 *      description: Restaura as imagens a partir de um arquivo de backup específico
 *      tags: [Backup]
 */
router.post('/restore/:filename', verificarAdmin, function(req, res) {
    const filename = req.params.filename;
        
    exec(`docker exec backup-service ls -la ${BACKUP_DIR}/${filename}`, (error) => {
        if (error) {
            return res.status(404).json({ message: 'Arquivo de backup não encontrado' });
        }
                
        const restoreCommand = `docker exec backup-service bash -c "
            # Fazer backup das imagens atuais primeiro
            TIMESTAMP=\$(date +%Y-%m-%d_%H-%M-%S)
            tar -czf ${BACKUP_DIR}/pre_restore_\${TIMESTAMP}.tar.gz -C ${IMAGES_DIR} . || exit 1
            
            # Limpar o diretório de imagens
            rm -rf ${IMAGES_DIR}/* || exit 1
            
            # Extrair o backup
            tar -xzf ${BACKUP_DIR}/${filename} -C ${IMAGES_DIR} || exit 1
            
            echo 'Backup restaurado com sucesso'
        "`;
        
        exec(restoreCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao restaurar backup: ${error.message}`);
                return res.status(500).json({ 
                    success: false,
                    message: 'Erro ao restaurar backup', 
                    error: error.message 
                });
            }
            
            if (stderr) {
                console.error(`Erro no processo de restauração: ${stderr}`);
                return res.status(500).json({ 
                    success: false,
                    message: 'Erro no processo de restauração', 
                    error: stderr 
                });
            }
                        
            atualizarBancoDados((err) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false,
                        message: 'Erro ao atualizar banco de dados', 
                        error: err 
                    });
                }
                
                res.status(200).json({ 
                    success: true,
                    message: 'Backup restaurado com sucesso',
                    backupUtilizado: filename
                });
            });
        });
    });
});

/**
 * @swagger
 * /api/backup/delete/{filename}:
 *  delete:
 *      summary: Remove um arquivo de backup
 *      description: Exclui um arquivo de backup específico
 *      tags: [Backup]
 */
router.delete('/delete/:filename', verificarAdmin, function(req, res) {
    const filename = req.params.filename;
        
    exec(`docker exec backup-service ls -la ${BACKUP_DIR}/${filename}`, (error) => {
        if (error) {
            return res.status(404).json({ message: 'Arquivo de backup não encontrado' });
        }
                
        exec(`docker exec backup-service rm -f ${BACKUP_DIR}/${filename}`, (error) => {
            if (error) {
                console.error('Erro ao remover backup:', error);
                return res.status(500).json({ message: 'Erro ao remover backup', error: error.message });
            }
            
            res.status(200).json({ 
                success: true,
                message: 'Arquivo de backup removido com sucesso',
                filename
            });
        });
    });
});

/**
 * @swagger
 * /api/backup/status:
 *  get:
 *      summary: Verifica o status do sistema de backup
 *      description: Retorna informações sobre o sistema de backup, como espaço utilizado e número de backups
 *      tags: [Backup]
 */
router.get('/status', verificarToken, function(req, res) {    
    exec(`docker exec backup-service bash -c "
        # Verificar se os diretórios existem
        BACKUP_DIR_EXISTS=0
        IMAGE_DIR_EXISTS=0
        
        if [ -d '${BACKUP_DIR}' ]; then
            BACKUP_DIR_EXISTS=1
        fi
        
        if [ -d '${IMAGES_DIR}' ]; then
            IMAGE_DIR_EXISTS=1
        fi
        
        # Contar arquivos de backup
        BACKUP_COUNT=0
        if [ \$BACKUP_DIR_EXISTS -eq 1 ]; then
            BACKUP_COUNT=\$(find ${BACKUP_DIR} -name 'backup_*.tar.gz' | wc -l)
        fi
        
        # Contar imagens
        IMAGE_COUNT=0
        if [ \$IMAGE_DIR_EXISTS -eq 1 ]; then
            IMAGE_COUNT=\$(find ${IMAGES_DIR} -type f \\( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' \\) | wc -l)
        fi
        
        # Obter informações sobre o último backup
        LAST_BACKUP=''
        LAST_BACKUP_SIZE=''
        LAST_BACKUP_DATE=''
        
        if [ \$BACKUP_COUNT -gt 0 ]; then
            LAST_BACKUP=\$(find ${BACKUP_DIR} -name 'backup_*.tar.gz' -type f -printf '%T@ %p\\n' | sort -nr | head -1 | cut -d' ' -f2)
            LAST_BACKUP_SIZE=\$(du -h \"\$LAST_BACKUP\" | cut -f1)
            LAST_BACKUP_DATE=\$(stat -c %y \"\$LAST_BACKUP\")
        fi
        
        # Calcular tamanho total dos backups
        TOTAL_BACKUP_SIZE=0
        if [ \$BACKUP_DIR_EXISTS -eq 1 ]; then
            TOTAL_BACKUP_SIZE=\$(du -sb ${BACKUP_DIR} | cut -f1)
        fi
        
        # Imprimir resultado em formato JSON
        echo '{\"backup_dir_exists\":\$BACKUP_DIR_EXISTS,\"image_dir_exists\":\$IMAGE_DIR_EXISTS,\"backup_count\":\$BACKUP_COUNT,\"image_count\":\$IMAGE_COUNT,\"last_backup\":\"\$LAST_BACKUP\",\"last_backup_size\":\"\$LAST_BACKUP_SIZE\",\"last_backup_date\":\"\$LAST_BACKUP_DATE\",\"total_backup_size\":\$TOTAL_BACKUP_SIZE}'
    "`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao verificar status do backup: ${error.message}`);
            return res.status(500).json({ 
                status: 'error',
                message: 'Erro ao verificar status do backup', 
                error: error.message 
            });
        }
        
        try {            
            const statusData = JSON.parse(stdout.trim());
                        
            const totalBackupSizeFormatted = formatBytes(parseInt(statusData.total_backup_size, 10));
            
            res.status(200).json({
                status: 'ok',
                backupDirExists: statusData.backup_dir_exists === 1,
                imageDirExists: statusData.image_dir_exists === 1,
                backupCount: statusData.backup_count,
                imageCount: statusData.image_count,
                lastBackup: statusData.last_backup !== '' ? {
                    filename: path.basename(statusData.last_backup),
                    size: statusData.last_backup_size,
                    created: statusData.last_backup_date
                } : null,
                totalBackupSize: parseInt(statusData.total_backup_size, 10),
                totalBackupSizeFormatted
            });
        } catch (parseError) {
            console.error(`Erro ao analisar saída do status: ${parseError.message}`);
            console.error(`Saída recebida: ${stdout}`);
            
            res.status(500).json({ 
                status: 'error',
                message: 'Erro ao analisar status do backup', 
                error: parseError.message,
                rawOutput: stdout
            });
        }
    });
});

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function atualizarBancoDados(callback) {
    // Verifica todas as entradas na tabela historicoEntrada
    con.getConnection((erroConexao, conexao) => {
        if (erroConexao) {
            console.error('Erro ao conectar ao banco:', erroConexao);
            return callback(erroConexao.message);
        }
                
        const query = 'SELECT idHistoricoEntrada, img FROM historicoEntrada';
        conexao.query(query, (erro, resultados) => {
            if (erro) {
                conexao.release();
                console.error('Erro ao consultar historicoEntrada:', erro);
                return callback(erro.message);
            }
            
            const imagensAusentes = [];
                        
            for (const entrada of resultados) {
                const imagemPath = path.join(IMAGES_DIR, entrada.img);
                                
                try {
                    if (!fs.existsSync(imagemPath)) {
                        imagensAusentes.push(entrada.idHistoricoEntrada);
                    }
                } catch (e) {
                    console.error(`Erro ao verificar arquivo ${imagemPath}:`, e);
                    imagensAusentes.push(entrada.idHistoricoEntrada);
                }
            }
                        
            if (imagensAusentes.length > 0) {
                const updateQuery = 'UPDATE historicoEntrada SET img = "imagem_nao_disponivel.png" WHERE idHistoricoEntrada IN (?)';
                conexao.query(updateQuery, [imagensAusentes], (erroUpdate) => {
                    conexao.release();
                    
                    if (erroUpdate) {
                        console.error('Erro ao atualizar registros:', erroUpdate);
                        return callback(erroUpdate.message);
                    }
                    
                    console.log(`${imagensAusentes.length} registros atualizados com 'imagem_nao_disponivel.png'`);
                    callback(null);
                });
            } else {
                conexao.release();
                callback(null);
            }
        });
    });
}

module.exports = router;