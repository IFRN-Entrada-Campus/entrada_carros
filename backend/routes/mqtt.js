const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

/**
 * @swagger
 * tags:
 *   name: MQTT
 *   description: Operações relacionadas a mensagens do protocolo MQTT
 */

const client = mqtt.connect({
    protocol: 'mqtt', 
    host: 'broker-mqtt',
    port: 1884,      
    rejectUnauthorized: false,
});

client.on('connect', () => {
    console.log('Conectado ao broker');
    client.subscribe('carro/cam_vec_1');
});

client.on('error', (err) => {
    console.log('Erro ao conectar no broker:', err);
})

var con = mysql.createPool({ 
    host: 'db',
    user: 'root',
    password: '',
    database: 'dbentrada',
    connectionLimit: 50,
    connectTimeout: 30000,
});

function verificarToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({
            auth: false,
            message: 'Nenhum token de autenticação informado.',
        });
    } else {
        jwt.verify(token, process.env.JWT_SEGREDO, function (err, decoded) {
            if (err) {
                res.status(500).json({ auth: false, message: 'Token inválido.' });
            } else {
                const agoraEmSegundos = Math.floor(Date.now() / 1000);
                if (decoded.exp < agoraEmSegundos) {
                    res.status(401).json({ auth: false, message: 'Token expirado.' });
                } else {
                    next();
                }
            }
        });
    }
}

client.on('message', function (topic, message) {
    const payload = message.toString();

    try {
        con.getConnection(function (erroConexao, conexao) {
            if (erroConexao) {
                throw erroConexao;
            }
            const dados = JSON.parse(payload);
            
            // Decodifica a imagem base64
            const imgBuffer = Buffer.from(dados.img, 'base64');
            
            // Cria diretório se não existir
            if (!fs.existsSync('/imagens')) {
                fs.mkdirSync('/imagens', { recursive: true });
            }

            // Cria subdiretórios por ano/mês para melhor organização
            const dataAtual = new Date();
            const ano = dataAtual.getFullYear();
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            
            const subDir = `/imagens/${ano}/${mes}`;
            
            if (!fs.existsSync(subDir)) {
                fs.mkdirSync(subDir, { recursive: true });
            }

            // Salva a imagem com timestamp
            const timestamp = Date.now();
            const nomeArquivo = `imagem_${dados.placa}_${timestamp}.png`;
            const caminhoCompleto = `${subDir}/${nomeArquivo}`;
            const caminhoRelativo = `${ano}/${mes}/${nomeArquivo}`;
            
            fs.writeFileSync(caminhoCompleto, imgBuffer);
            
            // Busca o idCarro
            const get_id = 'SELECT idCarro FROM carro WHERE placaCarro = ?';
            con.query(get_id, [dados.placa], function (erroComandoSQL, result, fields) {
                if (erroComandoSQL) {
                    conexao.release();
                    throw erroComandoSQL;
                }

                console.log(result);
                
                if (result.length > 0 && result[0].idCarro !== null) {
                    const id = result[0].idCarro;

                    // Insere os dados no banco de dados com o caminho relativo da imagem
                    const query = 'INSERT INTO historicoEntrada(placa, dataHora, img, idCarroRel) VALUES (?, ?, ?, ?)';
                    const dataHora = new Date();
                    const valores = [dados.placa, dataHora, caminhoRelativo, id];
                    console.log(valores);

                    con.query(query, valores, function (erroComandoSQL, result, fields) {
                        conexao.release();
                        if (erroComandoSQL) {
                            throw erroComandoSQL;
                        }
                        if (result.affectedRows > 0) {
                            console.log('Registro incluído com sucesso!');
                        } else {
                            console.log('Erro ao incluir registro.');
                        }
                    });
                } else {
                    conexao.release();
                    console.log('Carro não encontrado no banco de dados.');
                }
            });
        });
    } catch (err) {
        console.error('Erro ao processar mensagem:', err);
    }
});

router.get('/ult-msg', verificarToken, (req, res) => {
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            console.error('Erro ao conectar ao banco:', erroConexao);
            return res.status(500).send('Erro ao conectar ao banco.');
        }
        const query = 'SELECT * FROM vwHistoricoPessoa ORDER BY idHistoricoEntrada DESC LIMIT 1;';
        conexao.query(query, function (erroConsulta, resultados) {
            conexao.release();

            if (erroConsulta) {
                console.error('Erro ao executar a consulta:', erroConsulta);
                return res.status(500).send('Erro ao executar a consulta.');
            }

            if (resultados && resultados.length > 0) {
                ultimaMensagem = resultados[0]; 
                console.log('Última entrada encontrada com sucesso:', ultimaMensagem);
                return res.status(200).send(ultimaMensagem); 
            } else {
                console.log('Nenhuma entrada encontrada na tabela vwHistoricoPessoa');
                return res.status(404).send({ message: 'Nenhuma entrada encontrada.' });
            }
        });
    });
});

module.exports = router;