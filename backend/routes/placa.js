const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

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

router.post('/:placa', function(req, res) {
    const placa = req.body.placa;

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