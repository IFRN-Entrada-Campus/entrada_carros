var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var dbConfig = require('./config/dbentrada')

var indexRouter = require('./routes/index');
var alunocarroRouter = require('./routes/alunocarro');
var loginRouter = require('./routes/login');
var placaRouter = require('./routes/placa');

var app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/alunocarro', alunocarroRouter);
app.use('/login', loginRouter);
app.use('/placa', placaRouter);
app.use((req, res, next) => {
  req.priority = req.method === 'POST' ? 1:0

  req.queue = [];
  req.queue.push(next);
});
const sequelize = new Sequelize(dbConfig);
module.exports = app, sequelize;
