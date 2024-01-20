require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const process = require('process');
const { errors } = require('celebrate');
const userController = require('./controllers/users');
const auth = require('./middlewares/auth');
const router = require('./routes');
const { DEFAULT_ERROR_CODE } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const { validationSignIn, validationSignUp } = require('./middlewares/validation');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose
  .connect('mongodb://localhost:27017/bitfilmsdb')
  .then(() => {
    console.log(`App connected ${DB_URL}`);
  })
  .catch((err) => console.log(`App error ${err}`));

const app = express();

app.use(cookieParser());

app.use(helmet());

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validationSignIn, userController.login);
app.post('/signup', validationSignUp, userController.createUser);

app.use(auth);

app.post('/signout', userController.logout);

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
