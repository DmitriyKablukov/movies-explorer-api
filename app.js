require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const process = require('process');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes');
const { DEFAULT_ERROR_CODE } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/limiter');

const { PORT, DB_ADDRESS } = process.env;

const options = {
  origin: [
    '[undefined](http://localhost:3000)',
    'https://movies-exp.nomoredomainsmonster.ru',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    console.log(`App connected ${DB_ADDRESS}`);
  })
  .catch((err) => console.log(`App error ${err}`));

const app = express();

app.use(cookieParser());

app.use(helmet());

app.use(express.json());

app.use(limiter);

app.use(cors(options));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR_CODE, message } = err;
  res.status(statusCode).send({
    message: statusCode === DEFAULT_ERROR_CODE
      ? 'На сервере произошла ошибка'
      : message,
  });
  next(err);
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
