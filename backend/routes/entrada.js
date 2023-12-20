const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var con = mysql.createPool({ //cria pool com o banco de dados
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
 *   name: Aluno/Servidor e Carros
 *   description: Operações relacionadas a dados de alunos, servidores e carros
 */

function verificarToken(req, res, next) { //verifica se o token é válido
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

function verificarAdmin(req, res, next) { // Verifica se o usuário é admin
    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({
            auth: false,
            message: 'Nenhum token de autenticação informado.'
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
                    const role = decoded.role;

                    if (role === 'admin') {
                        next();
                    } else {
                        res.status(403).json({
                            auth: false,
                            message: 'Acesso negado. Somente usuários com papel de admin podem realizar essa operação'
                        });
                    }
                }
            }
        });
    }
}

/**
 * @swagger
 * /api/entrada:
 *  get:
 *      summary: Retorna os dados de histórico de entrada de veículos
 *      description: Retorna todos os dados de histórico de entrada de veículos
 *      tags: [Aluno/Servidor e Carros]
 */
router.get('/', verificarToken, function (req, res) { //retorna todos os dados de entrada
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }

        con.query('SELECT * FROM historicoentrada', function (erroComandoSQL, result, fields) {
            conexao.release();
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            res.status(200).send(result);
        });
    });
});

/**
 * @swagger
 * /api/entrada:
 *  post:
 *      summary: Cadastro de historico de entrada
 *      description: Cadastro de historico de entrada de veículos no estacionamento
 *      tags: [Aluno/Servidor e Carros]
 */
router.post('/aluno', verificarAdmin, function (req, res) { // insere dados de entrada
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const placa = req.body.placa;
        const dataHora = req.body.dataHora;
        const img = req.body.img;
        const idCarroRel = req.body.idCarroRel;
        console.log(`POST historicoentrada: ${placa}`);

        const sql = `INSERT INTO historicoentrada (placa, dataHora, img, idCarroRel) VALUES (?, ?, ?, ?)`; //insere dados de entrada
        con.query(
            sql,
            [placa, dataHora, img, idCarroRel],
            function (erroComandoSQL, result, fields) {
                conexao.release();
                if (erroComandoSQL) {
                    throw erroComandoSQL;
                }

                if (result.affectedRows > 0) {
                    res.status(200).send({ message: 'Registro incluído com sucesso' });
                } else {
                    res.status(400).send({ message: 'Erro ao incluir registro' });
                }

            }
        );
    });
});

module.exports = router;