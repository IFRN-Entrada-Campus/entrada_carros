const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');

let ultimaMensagem = null;
/**
 * @swagger
 * tags:
 *   name: MQTT
 *   description: Operações relacionadas a mensagens do protocolo MQTT
 */

const client = mqtt.connect({
    protocol: 'mqtt',
    host: 'test.mosquitto.org',
    port: '1883',
});

client.on('connect', () => {
    console.log('Conectado ao broker');
    client.subscribe('carro/cam_vec_1');
});

client.on('error', (err) => {
    console.log('Erro ao conectar no broker:', err);
})

var con = mysql.createPool({ //cria pool com o banco de dados
    host: 'db',
    user: 'root',
    password: '',
    database: 'dbentrada',
    connectionLimit: 50,
    connectTimeout: 30000,
});

client.on('message', function (topic, message) {
    const payload = message.toString();
    console.log(`Mensagem recebida: ${payload}`);

    try {
        con.getConnection(function (erroConexao, conexao) {
            if (erroConexao) {
                throw erroConexao;
            }
            const dados = JSON.parse(payload);

            // Busca o idCarro
            const get_id = 'SELECT idCarro FROM carro WHERE placaCarro = ?';
            con.query(get_id, [dados.placa], function (erroComandoSQL, result, fields) {
                if (erroComandoSQL) {
                    conexao.release();
                    throw erroComandoSQL;
                }

                console.log(result);

                // Verifica se o resultado da consulta é válido
                if (result.length > 0 && result[0].idCarro !== null) {
                    const id = result[0].idCarro;

                    // Insere os dados no banco de dados
                    const query = 'INSERT INTO historicoentrada(placa, dataHora, img, idCarroRel) VALUES (?, ?, ?, ?)';
                    const dataHora = new Date();
                    const valores = [dados.placa, dataHora, dados.img, id];

                    con.query(query, valores, function (erroComandoSQL, result, fields) {
                        conexao.release();
                        if (erroComandoSQL) {
                            throw erroComandoSQL;
                        }
                        if (result.affectedRows > 0) {
                            console.log('Registro incluído com sucesso!');
                            ultimaMensagem = dados;
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

/**
 * @swagger
 * /api/entrada:
 *  get:
 *      summary: Retorna última mensagem
 *      description: Retorna última mensagem enviada ao tópico MQTT
 *      tags: [MQTT]
 */
router.get('/ult-msg', function (req, res) {
    if (ultimaMensagem) {
        res.status(200).send(ultimaMensagem);
    } else {
        res.status(404).send({ message: 'Nenhuma mensagem disponível' });
    }
});


module.exports = router, client;