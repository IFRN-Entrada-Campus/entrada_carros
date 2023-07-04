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

