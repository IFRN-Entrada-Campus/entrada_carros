const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

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

router.post('/', function(req, res) {
    const usuario = req.body.login;
    const senha = req.body.senha;
    
    const sql = 'SELECT * FROM login WHERE usuario = ?'
    con.query(sql, [usuario], function(erroComandoSQL, result) {
        if (erroComandoSQL) {
            console.error('Erro ao executar consulta:', erroComandoSQL);
            res.status(500).send('Erro do servidor');
            return;
        }

        if (result.length === 0) {
            res.status(401).send('Credenciais inválidas');
            return;
        }

        const user = result[0];

        bcrypt.compare(senha, user.senha, function(erro, result) {
            if (erro) {
                console.error('Erro ao verificar senha:', erro);
                res.status(500).send('Erro do servidor');
                return;
            }

            if (!result) {
                res.status(401).send('Credenciais inválidas');
                return;
            }

            res.status(200).send('Login bem-sucedido')
        });
    });
});