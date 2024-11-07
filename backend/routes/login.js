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

// Rota para solicitar recuperação de senha
router.post('/solicitar-recuperacao', async (req, res) => {
    const { email } = req.body;

    try {
        const sql = 'SELECT * FROM login WHERE email = ?'; // Verifique se a coluna email existe
        con.query(sql, [email], function (erroComandoSQL, result) {
            if (erroComandoSQL) {
                return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const usuario = result[0];

            // Criar um token JWT válido por 1 hora
            const token = jwt.sign({ id: usuario.id }, process.env.JWT_SEGREDO, { expiresIn: '1h' });

            // Enviar o e-mail de recuperação de senha
            const mailOptions = {
                from: process.env.USER, // seu email
                to: email,
                subject: 'Recuperação de senha',
                text: `Use o link abaixo para redefinir sua senha: http://localhost:8080/redefinir-senha/${token}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erro ao enviar e-mail:', error);
                    return res.status(500).json({ message: 'Erro ao enviar o e-mail', error: error });
                }
                console.log('Mensagem enviada:', info);
                res.status(200).json({ message: 'E-mail enviado com sucesso' });
            });            
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Rota para redefinir a senha
router.post('/redefinir-senha/:token', async (req, res) => {
    const { token } = req.params;
    const { novaSenha } = req.body;

    try {
        // Verificar o token
        const decoded = jwt.verify(token, process.env.JWT_SEGREDO);

        // Buscar o usuário pelo ID
        const sql = 'SELECT * FROM login WHERE id = ?';
        con.query(sql, [decoded.id], function (erroComandoSQL, result) {
            if (erroComandoSQL || result.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const usuario = result[0];

            // Criptografar a nova senha
            bcrypt.hash(novaSenha, 10, function (erro, senhaHash) {
                if (erro) {
                    return res.status(500).json({ message: 'Erro ao gerar hash' });
                }

                // Atualizar a senha no banco de dados
                const sqlUpdate = 'UPDATE login SET senha = ? WHERE id = ?';
                con.query(sqlUpdate, [senhaHash, usuario.id], function (erro) {
                    if (erro) {
                        return res.status(500).json({ message: 'Erro ao atualizar a senha' });
                    }

                    res.status(200).json({ message: 'Senha redefinida com sucesso' });
                });
            });
        });
    } catch (error) {
        res.status(400).json({ message: 'Token inválido ou expirado' });
    }
});


module.exports = router;