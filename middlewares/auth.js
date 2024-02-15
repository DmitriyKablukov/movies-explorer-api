/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  let payload;
  try {
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer ', '');
    if (!token) {
      return next(new AuthorizationError('Неправильный email или пароль'));
    }
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
