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
 *   name: Aluno/Servidor/Visita e Carros
 *   description: Operações relacionadas a dados de alunos, servidores, visitas e carros
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
 * /api/pessoaCarro:
 *  get:
 *      summary: Retorna os alunos/servidores/visitas e carros
 *      description: Retorna todos os dados organizados das tabelas pessoa e carro
 *      tags: [Aluno/Servidor/Visita e Carros]
 */
router.get('/', verificarToken, function (req, res) { //retorna todas as pessoas e carros
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }

        con.query('SELECT * FROM vwPessoaCarro', function (erroComandoSQL, result, fields) {
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
 * /api/pessoaCarro/idPessoa:
 *  get:
 *      summary: Retorna todas os ID
 *      description: Retorna todas as identificações de todos os alunos/servidores cadastrados
 *      tags: [Aluno/Servidor e Carros]
 */
router.get('/idPessoa', verificarToken, function (req, res) { //retorna todos as pessoa
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }

        con.query('SELECT idPessoa FROM pessoa', function (erroComandoSQL, result, fields) {
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
 * /api/pessoaCarro/carro/<idPessoa>:
 *  get:
 *      summary: Retorna carros pela identificação do condutor
 *      description: Retorna todos os carros relacionados a um ID
 *      tags: [Aluno/Servidor e Carros]
 */
router.get('/carro/:idPessoaRel', verificarToken, function (req, res) { // retorna carro pela identificação do responsavel
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const idPessoaRel = req.params.idPessoaRel;

        const sql = `SELECT idCarro FROM carro WHERE idPessoaRel = ?`
        con.query(sql, [idPessoaRel], function (erroComandoSQL, result, fields) {
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
 * /api/pessoaCarro/Pessoa:
 *  post:
 *      summary: Cadastro de aluno ou servidor
 *      description: Cadastro de nome e matricula do servidor ou aluno
 *      tags: [Aluno/Servidor e Carros]
 */
router.post('/pessoa', verificarAdmin, function (req, res) { // insere pessoa
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const nomePessoa = req.body.nomePessoa;
        const idPessoa = req.body.idPessoa;
        const tipoId = req.body.tipoId;
        const vinculo = req.body.vinculo;
        console.log(`POST pessoa: ${idPessoa}`);

        const sql = `INSERT INTO pessoa (nomePessoa, idPessoa, tipoId, vinculo) VALUES (?, ?, ?, ?)`;
        con.query(
            sql,
            [nomePessoa, idPessoa, tipoId, vinculo],
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
 * /api/pessoaCarro/carro:
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
        const idPessoaRel = req.body.idPessoaRel;
        const placaCarro = req.body.placaCarro;
        console.log(`POST carro de ${idPessoaRel}`);

        const sql = `INSERT INTO carro (marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validadeEtiqueta, validaCnh, idPessoaRel, placaCarro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        con.query(
            sql,
            [marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validadeEtiqueta, validaCnh, idPessoaRel, placaCarro],
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
 * /api/pessoaCarro/pessoa/<idPessoa>:
 *  put:
 *      summary: Edita aluno ou servidor pela matrícula
 *      description: Edita todos os dados do aluno o buscando pela matrícula
 *      tags: [Aluno/Servidor e Carros]
 */
router.put('/pessoa/:idPessoa', verificarAdmin, function (req, res) { // altera pessoa
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const nomePessoa = req.body.nomePessoa;
        const idPessoa = req.body.idPessoa;
        console.log(`PUT pessoa: ${idPessoa}`);

        const sql = `UPDATE pessoa SET nomePessoa = ?, idPessoa = ? WHERE idPessoa = ?`;
        con.query(
            sql,
            [nomePessoa, idPessoa, idPessoa],
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
 * /api/pessoaCarro/carro/<placa>:
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
        const idPessoaRel = req.body.idPessoaRel;
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
        idPessoaRel = ?,
        placaCarro = ?
        WHERE placaCarro = ?`;
        con.query(
            sql,
            [marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validadeEtiqueta, validaCnh, idPessoaRel, placaCarro, placaCarroAntiga],
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
 * /api/pessoaCarro/pessoa/<idPessoa>:
 *  delete:
 *      summary: Deleta aluno ou servidor pela matrícula
 *      description: Deleta todos os dados do aluno o buscando pela matrícula
 *      tags: [Aluno/Servidor e Carros]
 */
router.delete('/pessoa/:idPessoa', verificarAdmin, function (req, res) { // exclui pessoa
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const idPessoa = req.params.idPessoa;
        console.log(`DELETE pessoa: ${idPessoa}`);

        const sql = `DELETE FROM pessoa WHERE idPessoa = ?`;
        con.query(
            sql,
            [idPessoa],
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