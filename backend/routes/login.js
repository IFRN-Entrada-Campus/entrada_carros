const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Desativa a verificação de certificado TLS para conexões seguras autoassinadas (apenas para desenvolvimento)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



var con = mysql.createPool({
    host: 'db',
    user: 'root',
    password: '',
    database: 'dbentrada',
    connectionLimit: 50,
    connectTimeout: 30000,
});


// Configura o transporte de e-mail (Nodemailer) usando variáveis do dotenv
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    secure: false,
    auth:{
        user: process.env.USER,
        pass: process.env.PASS,
    },
    tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
    },
});


/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Operações relacionadas a login de usuários
 */

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
 * /api/login:
 *  post:
 *      summary: Autenticação do usuário
 *      description: Autentica o usuário e devolve um token de acesso
 *      tags: [Login]
 */
router.post('/', function (req, res) { // autentica o usuário
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const usuario = req.body.usuario;
        const senha = req.body.senha;

        const sql = 'SELECT * FROM login WHERE usuario = ?';
        con.query(sql, [usuario], function (erroComandoSQL, result) {
            conexao.release();
            if (erroComandoSQL) {
                console.error('Erro ao executar consulta:', erroComandoSQL);
                res.status(500).json({ auth: false, message: 'Erro do servidor' });
                return;
            }

            if (result.length === 0) {
                res.status(401).json({ auth: false, message: 'Credenciais inválidas' });
                return;
            }

            const user = result[0];

            bcrypt.compare(senha, user.senha, function (erro, result) {
                if (erro) {
                    console.error('Erro ao verificar senha:', erro);
                    res.status(500).json({ auth: false, message: 'Erro do servidor' });
                    return;
                }

                if (!result) {
                    res.status(401).json({ auth: false, message: 'Credenciais inválidas' });
                    return;
                }

                const token = jwt.sign({ usuario: user.usuario, role: user.role }, process.env.JWT_SEGREDO, { expiresIn: '1d' });
                const decodedToken = jwt.decode(token);
                const expiraEm = decodedToken.exp;

                res.status(200).json({ auth: true, message: 'Login bem-sucedido', token: token, role: user.role, expiraEm: expiraEm });
            });
        });
    });
});

/**
 * @swagger
 * /api/login/novo:
 *  post:
 *      summary: Cadastra novo usuário
 *      description: Cadastra um novo usuário
 *      tags: [Login]
 */
router.post('/novo', verificarAdmin, function (req, res) { // cria um novo usuário
    con.getConnection(function (erroConexao, conexao) {
        if (erroConexao) {
            throw erroConexao;
        }
        const usuario = req.body.usuario;
        const senha = req.body.senha;
        const email = req.body.email;
        const role = req.body.role;

        const sqlselect = 'SELECT * FROM login WHERE usuario = ?';
        con.query(sqlselect, [usuario], function (erroComandoSQL, result) {
            conexao.release();
            if (erroComandoSQL) {
                console.error('Erro ao executar consulta:', erroComandoSQL);
                res.status(500).send({message: 'Erro do servidor'});
                return;
            }

            if (result.length > 0) {
                res.status(409).send({message: 'Login existente'});
                return;
            }

            bcrypt.hash(senha, 10, function (erro, hash) {
                if (erro) {
                    console.error('Erro ao gerar hash:', erro);
                    res.status(500).send({message: 'Erro do servidor'});
                    return;
                }

                const sqlinsert = 'INSERT INTO login(usuario, senha, email, role) VALUES (?, ?, ?, ?)';
                con.query(sqlinsert, [usuario, hash, email, role], function (erro) {
                    if (erro) {
                        console.error('Erro ao inserir novo login:', erro);
                        res.status(500).send({message:'Erro do servidor'});
                        return;
                    }

                    res.status(200).send({message: 'Login criado com sucesso'});
                });
            });
        });
    });
});

// Gerar um código de recuperação numérico de 6 dígitos
function gerarCodigoRecuperacao() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Rota para solicitar recuperação de senha (envio de código)
router.post('/solicitar-recuperacao', (req, res) => {
    const { email } = req.body;
    const codigoRecuperacao = gerarCodigoRecuperacao();

    const sql = 'UPDATE login SET codigo_recuperacao = ? WHERE email = ?';
    con.query(sql, [codigoRecuperacao, email], (erroComandoSQL, result) => {
        if (erroComandoSQL || result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Envia o código por email
        // Envia o código por e-mail com um design melhorado
const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Aqui está o seu código de recuperação de senha',
    html: `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        background-color: #ffffff;
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .email-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .email-header h1 {
                        color: #4CAF50;
                    }
                    .email-content {
                        font-size: 16px;
                        line-height: 1.5;
                        margin-bottom: 20px;
                    }
                    .code {
                        font-size: 24px;
                        font-weight: bold;
                        color: #4CAF50;
                        display: block;
                        text-align: center;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <h1>Recuperação de Senha</h1>
                    </div>
                    <div class="email-content">
                        <p>Olá,</p>
                        <p>Você solicitou um código de recuperação de senha. Use o código abaixo para redefinir sua senha:</p>
                        <span class="code">${codigoRecuperacao}</span>
                        <p>Este código expirará em 15 minutos.</p>
                    </div>
                    <div class="footer">
                        <p>Se você não solicitou esta recuperação de senha, por favor ignore este e-mail.</p>
                        <p>Atenciosamente, Equipe de Suporte.</p>
                    </div>
                </div>
            </body>
        </html>
    `
};


        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(500).json({ message: 'Erro ao enviar o e-mail' });
            }
            res.status(200).json({ message: 'Código de recuperação enviado para o e-mail' });
        });
    });
});

// Rota para redefinir senha com o código
router.post('/redefinir-senha', (req, res) => {
    const { email, codigoRecuperacao, novaSenha } = req.body;

    // Consulta o usuário pelo email e código de recuperação
    const sql = 'SELECT * FROM login WHERE email = ? AND codigo_recuperacao = ?';
    con.query(sql, [email, codigoRecuperacao], (erroComandoSQL, result) => {
        if (erroComandoSQL || result.length === 0) {
            return res.status(400).json({ message: 'Código inválido ou expirado' });
        }

        // Criptografa a nova senha e redefine-a no banco
        bcrypt.hash(novaSenha, 10, (erro, senhaHash) => {
            if (erro) {
                return res.status(500).json({ message: 'Erro ao gerar hash da senha' });
            }

            const sqlUpdate = 'UPDATE login SET senha = ?, codigo_recuperacao = NULL WHERE email = ?';
            con.query(sqlUpdate, [senhaHash, email], (erroUpdate) => {
                if (erroUpdate) {
                    return res.status(500).json({ message: 'Erro ao atualizar a senha' });
                }
                res.status(200).json({ message: 'Senha redefinida com sucesso' });
            });
        });
    });
});

module.exports = router;