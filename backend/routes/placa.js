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

/**
 * @swagger
 * /api/placa/<placa>:
 *  get:
 *      summary: Retorna os dados de alunos ou servidores e seu carro pela placa
 *      description: Retorna os dados de alunos ou servidores e de seu respectivo carro buscando pela placa
 *      tags: [Aluno/Servidor e Carros]
 */
router.get('/:placa', verificarToken, function (req, res) { // busca os dados pela placa
  con.getConnection(function (erroConexao, conexao) {
    if (erroConexao) {
      throw erroConexao;
    }
    const placa = req.params.placa;

    const sql = 'SELECT * FROM vwPessoaCarro WHERE Placa = ?';
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