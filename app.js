const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
const evaluationRouter = require('./routes/evaluation');

const app = express();
console.log(path.join(__dirname, 'public'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/eval', evaluationRouter);

const server = app.listen(80, () => {
});

module.exports = app;