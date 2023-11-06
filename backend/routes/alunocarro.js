const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const config = require('./config');

var con = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: '',
    database: 'dbentrada',
});

con.connect(function(erroConexao) {
    if (erroConexao) {
        throw erroConexao;
    }
});

function verificarToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      res.status(401).json({
        auth: false,
        message: 'Nenhum token de autenticação informado.',
      });
    } else {
      jwt.verify(token, config.jwtSegredo, function (err, decoded) {
        if (err) {
          res.status(500).json({ auth: false, message: 'Token inválido.' });
        } else {
          next();
        }
      });
    }
  }

router.get('/', verificarToken, function(req, res) {
    con.query('SELECT * FROM vwalunocarro', function(erroComandoSQL, result, fields) {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }
        res.status(200).send(result);
    });
});

router.get('/:Matricula', verificarToken, function(req, res) {
    const Matricula = req.params.Matricula
    con.query('SELECT * FROM vwalunocarro WHERE Matricula = ?', [Matricula], function(erroComandoSQL, result, fields) {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }
        res.status(200).send(result);
    });
});

router.get('/matricula', verificarToken, function(req, res) {
    con.query('SELECT Matricula FROM vwalunocarro', function(erroComandoSQL, result, fields) {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }
        res.status(200).send(result);
    });
});

router.get('/carro/:matriculaRel', verificarToken, function(req, res) {
    const matriculaRel = req.params.matriculaRel;

    const sql = `SELECT idCarro FROM carro WHERE matriculaRel = ?`
    con.query(sql, [matriculaRel], function(erroComandoSQL, result, fields) {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }
        const idCarro = result[0].idCarro;
        res.status(200).send({ id: idCarro });
    });
});

router.post('/aluno', verificarToken, function(req, res) {
    const noAluno = req.body.noAluno;
    const matriculaAluno = req.body.matriculaAluno;
    console.log(`POST aluno: ${matriculaAluno}`);

    const sql = `INSERT INTO aluno (noAluno, matriculaAluno) VALUES (?, ?)`;
    con.query(
        sql,
        [noAluno, matriculaAluno],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send({message: 'Registro incluído com sucesso'});
            } else {
                res.status(400).send({message: 'Erro ao incluir registro'});
            }
            
        }
    );
});

router.post('/carro', verificarToken, function(req, res) {
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
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send({message: 'Registro incluído com sucesso'});
            } else {
                res.status(400).send({message: 'Erro ao incluir registro'});
            }
        }
    );
});

router.put('/aluno/:matriculaAluno', verificarToken, function(req, res) {
    const noAluno = req.body.noAluno;
    const matriculaAluno = req.body.matriculaAluno;
    console.log(`PUT aluno: ${matriculaAluno}`);

    const sql = `UPDATE aluno SET noAluno = ?, matriculaAluno = ? WHERE matriculaAluno = ?`;
    con.query(
        sql,
        [noAluno, matriculaAluno, matriculaAluno],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send({message: 'Registro alterado com sucesso'});
            } else {
                res.status(404).send({message: 'Registro não encontrado'});
            }
        }
    );
});

router.put('/carro/:idCarro', verificarToken, function(req, res) {
    const idCarro = req.params.idCarro;
    const marcaCarro = req.body.marcaCarro;
    const modeloCarro = req.body.modeloCarro;
    const anoCarro = req.body.anoCarro;
    const codigoEtiqueta = req.body.codigoEtiqueta;
    const validadeEtiqueta = req.body.validadeEtiqueta;
    const validaCnh = req.body.validaCnh;
    const matriculaRel = req.body.matriculaRel;
    const placaCarro = req.body.placaCarro;
    console.log(`PUT carro: ${idCarro}`);

    const sql = `UPDATE carro 
    SET marcaCarro = ?,
    modeloCarro = ?,
    anoCarro = ?,
    codigoEtiqueta = ?,
    validadeEtiqueta = ?,
    validaCnh = ?,
    matriculaRel = ?,
    placaCarro = ?
    WHERE idCarro = ?`;
    con.query(
        sql,
        [marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validadeEtiqueta, validaCnh, matriculaRel, placaCarro, idCarro],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send({message: 'Registro alterado com sucesso'});
            } else {
                res.status(404).send({message: 'Registro não encontrado'});
            }
        }
    );
});

router.delete('/aluno/:matriculaAluno', verificarToken, function(req, res) {
    const matriculaAluno = req.params.matriculaAluno;
    console.log(`DELETE aluno: ${matriculaAluno}`);

    const sql = `DELETE FROM aluno WHERE matriculaAluno = ?`;
    con.query(
        sql,
        [matriculaAluno],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send({message: 'Registro excluído com sucesso'});
            } else {
                res.status(404).send({message: 'Não encontrado'});
            }
        }
    );
});

router.delete('/carro/:idCarro', verificarToken, function(req, res) {
    const idCarro = req.params.idCarro;
    console.log(`DELETE carro: ${idCarro}`);

    const sql = `DELETE FROM carro WHERE idCarro = ?`;
    con.query(
        sql,
        [idCarro],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send({message: 'Registro excluído com sucesso'});
            } else {
                res.status(404).send({message: 'Não encontrado'});
            }
        }
    );
});
module.exports = router;