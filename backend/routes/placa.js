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

router.get('/:placa', verificarToken, function(req, res) {
    const placa = req.params.placa;

    const sql = 'SELECT * FROM vwalunocarro WHERE Placa = ?';
    con.query(sql, [placa], function(erroComandoSQL, result) {
        if (erroComandoSQL) {
            console.error('Erro ao executar consulta:', erroComandoSQL);
            res.status(500).json({found: false, message: 'Erro no servidor'});
            return;
        }

        if (result.length === 0) {
            res.status(404).json({found: false, message: 'Placa não encontrada'});
            return;
        }

        res.status(200).send(result);
    });
});




module.exports = router;