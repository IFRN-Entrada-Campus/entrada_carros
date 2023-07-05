const express = require('express');
const router = express.Router();
const mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbentrada',
});

con.connect(function(erroConexao) {
    if (erroConexao) {
        throw erroConexao;
    }
});

router.get('/', function(req, res) {
    con.query('SELECT * FROM vwalunocarro', function(erroComandoSQL, result, fields) {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }
        res.status(200).send(result);
    });
});

router.get('/matricula', function(req, res) {
    con.query('SELECT Matricula FROM vwalunocarro', function(erroComandoSQL, result, fields) {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }
        res.status(200).send(result);
    });
});

router.get('/carro/:matriculaRel', function(req, res) {
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

router.post('/aluno', function(req, res) {
    const noAluno = req.body.noAluno;
    const matriculaAluno = req.body.matriculaAluno;

    const sql = `INSERT INTO aluno (noAluno, matriculaAluno) VALUES (?, ?)`;
    con.query(
        sql,
        [noAluno, matriculaAluno],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send('Registro incluído com sucesso');
            } else {
                res.status(400).send('Erro ao incluir registro');
            }
            
        }
    );
});

router.post('/carro', function(req, res) {
    const marcaCarro = req.body.marcaCarro;
    const modeloCarro = req.body.modeloCarro;
    const anoCarro = req.body.anoCarro;
    const codigoEtiqueta = req.body.codigoEtiqueta;
    const validaCnh = req.body.validaCnh;
    const matriculaRel = req.body.matriculaRel;

    const sql = `INSERT INTO carro (marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validaCnh, matriculaRel) VALUES (?, ?, ?, ?, ?, ?)`;
    con.query(
        sql,
        [marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validaCnh, matriculaRel],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send('Registro incluído com sucesso');
            } else {
                res.status(400).send('Erro ao incluir registro');
            }
        }
    );
});

router.put('/aluno/:matriculaAluno', function(req, res) {
    const noAluno = req.body.noAluno;
    const matriculaAluno = req.body.matriculaAluno;

    const sql = `UPDATE aluno SET noAluno = ?, matriculaAluno = ? WHERE matriculaAluno = ?`;
    con.query(
        sql,
        [noAluno, matriculaAluno, matriculaAluno],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send('Registro alterado com sucesso');
            } else {
                res.status(404).send('Registro não encontrado');
            }
        }
    );
});

router.put('/carro/:idCarro', function(req, res) {
    const idCarro = req.params.idCarro;
    const marcaCarro = req.body.marcaCarro;
    const modeloCarro = req.body.modeloCarro;
    const anoCarro = req.body.anoCarro;
    const codigoEtiqueta = req.body.codigoEtiqueta;
    const validaCnh = req.body.validaCnh;
    const matriculaRel = req.body.matriculaRel;

    const sql = `UPDATE carro 
    SET marcaCarro = ?,
    modeloCarro = ?,
    anoCarro = ?,
    codigoEtiqueta = ?,
    validaCnh = ?,
    matriculaRel = ?
    WHERE idCarro = ?`;
    con.query(
        sql,
        [marcaCarro, modeloCarro, anoCarro, codigoEtiqueta, validaCnh, matriculaRel, idCarro],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send('Registro alterado com sucesso');
            } else {
                res.status(404).send('Registro não encontrado');
            }
        }
    );
});

router.delete('/aluno/:matriculaAluno', function(req, res) {
    const matriculaAluno = req.params.matriculaAluno;

    const sql = `DELETE FROM aluno WHERE matriculaAluno = ?`;
    con.query(
        sql,
        [matriculaAluno],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send('Registro excluído com sucesso');
            } else {
                res.status(404).send('Não encontrado');
            }
        }
    );
});

router.delete('/carro/:idCarro', function(req, res) {
    const idCarro = req.params.idCarro;

    const sql = `DELETE FROM carro WHERE idCarro = ?`;
    con.query(
        sql,
        [idCarro],
        function(erroComandoSQL, result, fields) {
            if (erroComandoSQL) {
                throw erroComandoSQL;
            }

            if (result.affectedRows > 0) {
                res.status(200).send('Registro excluído com sucesso');
            } else {
                res.status(404).send('Não encontrado');
            }
        }
    );
});
module.exports = router;