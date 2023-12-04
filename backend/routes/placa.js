const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

var con = mysql.createPool({
  host: 'db',
  user: 'root',
  password: '',
  database: 'dbentrada',
  connectionLimit: 50,
});

function verificarToken(req, res, next) { // verifica se o token é válido
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
        next();
      }
    });
  }
}

router.get('/:placa', verificarToken, function (req, res) { // busca os dados pela placa
  con.getConnection(function (erroConexao, conexao) {
    if (erroConexao) {
      throw erroConexao;
    }
    const placa = req.params.placa;

    const sql = 'SELECT * FROM vwalunocarro WHERE Placa = ?';
    con.query(sql, [placa], function (erroComandoSQL, result) {
      conexao.release();
      if (erroComandoSQL) {
        console.error('Erro ao executar consulta:', erroComandoSQL);
        res.status(500).json({ found: false, message: 'Erro no servidor' });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ found: false, message: 'Placa não encontrada' });
        return;
      }

      res.status(200).send(result);
    });
  });
});




module.exports = router;