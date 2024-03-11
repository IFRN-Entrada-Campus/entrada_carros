const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
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
 * /api/alunocarro:
 *  get:
 *      summary: Retorna os alunos/servidores e carros
 *      description: Retorna todos os dados organizados das tabelas aluno e carro
 *      tags: [Aluno/Servidor e Carros]
 */
router.get('/', verificarToken, function (req, res) { //retorna todos os alunos e carros
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }

        con.query('SELECT * FROM vwalunocarro', function (erroComandoSQL, result, fields) {
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
 * /api/alunocarro/matricula:
 *  get:
 *      summary: Retorna todas as matrículas
 *      description: Retorna todos as matrículas de todos os alunos/servidores cadastrados
 *      tags: [Aluno/Servidor e Carros]
 */
router.get('/matricula', verificarToken, function (req, res) { //retorna todos os alunos
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }

        con.query('SELECT matriculaAluno FROM aluno', function (erroComandoSQL, result, fields) {
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
 * /api/alunocarro/carro/<matricula>:
 *  get:
 *      summary: Retorna carros pela matrícula do condutor
 *      description: Retorna todos os carros relacionados a uma matrícula
 *      tags: [Aluno/Servidor e Carros]
 */
router.get('/carro/:matriculaRel', verificarToken, function (req, res) { // retorna carro pela matricula do responsavel
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const matriculaRel = req.params.matriculaRel;

        const sql = `SELECT idCarro FROM carro WHERE matriculaRel = ?`
        con.query(sql, [matriculaRel], function (erroComandoSQL, result, fields) {
            conexao.release();
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }
            const idCarro = result[0].idCarro;
            res.status(200).send({ id: idCarro });
        });
    });
});

/**
 * @swagger
 * /api/alunocarro/aluno:
 *  post:
 *      summary: Cadastro de aluno ou servidor
 *      description: Cadastro de nome e matricula do servidor ou aluno
 *      tags: [Aluno/Servidor e Carros]
 */
router.post('/aluno', verificarAdmin, function (req, res) { // insere aluno
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const noAluno = req.body.noAluno;
        const matriculaAluno = req.body.matriculaAluno;
        console.log(`POST aluno: ${matriculaAluno}`);

        const sql = `INSERT INTO aluno (noAluno, matriculaAluno) VALUES (?, ?)`;
        con.query(
            sql,
            [noAluno, matriculaAluno],
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

/**
 * @swagger
 * /api/alunocarro/carro:
 *  post:
 *      summary: Cadastra um novo carro e o relaciona a um condutor(aluno/servidor)
 *      description: Cadastra placa, modelo, marca e ano do carro junto com o código da etiqueta, validade da mesma e uma confirmação da validade da etiqueta.
 *      tags: [Aluno/Servidor e Carros]
 */
router.post('/carro', verificarAdmin, function (req, res) { // insere carro
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const marcaCarro = req.body.marcaCarro;
        const modeloCarro = req.body.modeloCarro;
        const anoCarro = req.body.anoCarro;
        const codigoEtiqueta = req.body.codigoEtiqueta;
        const validadeEtiqueta = req.body.validadeEtiqueta;
        const validaCnh = req.body.validaCnh;
        const matriculaRel = req.body.matriculaRel;
        const placaCarro = req.body.placaCarro;
        console.log(`POST carro de ${matriculaRel}`);

        const sql = `INSERT INTO carro (marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validadeEtiqueta, validaCnh, matriculaRel, placaCarro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        con.query(
            sql,
            [marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validadeEtiqueta, validaCnh, matriculaRel, placaCarro],
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

/**
 * @swagger
 * /api/alunocarro/aluno/<matricula>:
 *  put:
 *      summary: Edita aluno ou servidor pela matrícula
 *      description: Edita todos os dados do aluno o buscando pela matrícula
 *      tags: [Aluno/Servidor e Carros]
 */
router.put('/aluno/:matriculaAluno', verificarAdmin, function (req, res) { // altera aluno
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const noAluno = req.body.noAluno;
        const matriculaAluno = req.body.matriculaAluno;
        console.log(`PUT aluno: ${matriculaAluno}`);

        const sql = `UPDATE aluno SET noAluno = ?, matriculaAluno = ? WHERE matriculaAluno = ?`;
        con.query(
            sql,
            [noAluno, matriculaAluno, matriculaAluno],
            function (erroComandoSQL, result, fields) {
                conexao.release();
                if (erroComandoSQL) {
                    throw erroComandoSQL;
                }

                if (result.affectedRows > 0) {
                    res.status(200).send({ message: 'Registro alterado com sucesso' });
                } else {
                    res.status(404).send({ message: 'Registro não encontrado' });
                }
            }
        );
    });
});

/**
 * @swagger
 * /api/alunocarro/carro/<placa>:
 *  put:
 *      summary: Edita carro pela placa
 *      description: Edita todos os dados do carro buscando pela placa
 *      tags: [Aluno/Servidor e Carros]
 */
router.put('/carro/:placaCarro', verificarAdmin, function (req, res) { // altera carro
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const marcaCarro = req.body.marcaCarro;
        const modeloCarro = req.body.modeloCarro;
        const anoCarro = req.body.anoCarro;
        const codigoEtiqueta = req.body.codigoEtiqueta;
        const validadeEtiqueta = req.body.validadeEtiqueta;
        const validaCnh = req.body.validaCnh;
        const matriculaRel = req.body.matriculaRel;
        const placaCarroAntiga = req.params.placaCarro;
        const placaCarro = req.body.placaCarro;
        console.log(`PUT carro: ${placaCarro}`);

        const sql = `UPDATE carro 
    SET marcaCarro = ?,
    modeloCarro = ?,
    anoCarro = ?,
    codigoEtiqueta = ?,
    validadeEtiqueta = ?,
    validaCnh = ?,
    matriculaRel = ?,
    placaCarro = ?
    WHERE placaCarro = ?`;
        con.query(
            sql,
            [marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validadeEtiqueta, validaCnh, matriculaRel, placaCarro, placaCarroAntiga],
            function (erroComandoSQL, result, fields) {
                conexao.release();
                if (erroComandoSQL) {
                    throw erroComandoSQL;
                }

                if (result.affectedRows > 0) {
                    res.status(200).send({ message: 'Registro alterado com sucesso' });
                } else {
                    res.status(404).send({ message: 'Registro não encontrado' });
                }
            }
        );
    });
});

/**
 * @swagger
 * /api/alunocarro/aluno/<matricula>:
 *  delete:
 *      summary: Deleta aluno ou servidor pela matrícula
 *      description: Deleta todos os dados do aluno o buscando pela matrícula
 *      tags: [Aluno/Servidor e Carros]
 */
router.delete('/aluno/:matriculaAluno', verificarAdmin, function (req, res) { // exclui aluno
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const matriculaAluno = req.params.matriculaAluno;
        console.log(`DELETE aluno: ${matriculaAluno}`);

        const sql = `DELETE FROM aluno WHERE matriculaAluno = ?`;
        con.query(
            sql,
            [matriculaAluno],
            function (erroComandoSQL, result, fields) {
                conexao.release();
                if (erroComandoSQL) {
                    throw erroComandoSQL;
                }

                if (result.affectedRows > 0) {
                    res.status(200).send({ message: 'Registro excluído com sucesso' });
                } else {
                    res.status(404).send({ message: 'Não encontrado' });
                }
            }
        );
    });
});

/**
 * @swagger
 * /api/alunocarro/carro/<placa>:
 *  delete:
 *      summary: Deleta carro pela placa
 *      description: Deleta todos os dados do carro buscando pela placa
 *      tags: [Aluno/Servidor e Carros]
 */
router.delete('/carro/:placaCarro', verificarAdmin, function (req, res) { // exclui carro
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const placaCarro = req.params.placaCarro;
        console.log(`DELETE carro: ${placaCarro}`);

        const sql = `DELETE FROM carro WHERE placaCarro = ?`;
        con.query(
            sql,
            [placaCarro],
            function (erroComandoSQL, result, fields) {
                conexao.release();
                if (erroComandoSQL) {
                    throw erroComandoSQL;
                }

                if (result.affectedRows > 0) {
                    res.status(200).send({ message: 'Registro excluído com sucesso' });
                } else {
                    res.status(404).send({ message: 'Não encontrado' });
                }
            }
        );
    });
});
module.exports = router;