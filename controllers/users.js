const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const STATUS_CODE = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');

const createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, email, password: hash,
    });
    res.status(STATUS_CODE.CREATE_CODE).send({
      email: newUser.email,
      name: newUser.name,
      _id: newUser._id,
    });
  } catch (err) {
    if (err.code === STATUS_CODE.MONGO_DUPLICATE_ERROR_CODE) {
      next(new ConflictError('Такой пользователь уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userAuth = await User.findOne({ email })
      .select('+password')
      .orFail(new AuthorizationError('Пользователь не найден'));
    const matched = await bcrypt.compare(password, userAuth.password);
    if (!matched) {
      throw new AuthorizationError('Неправильный email или пароль');
    }
    const { NODE_ENV, JWT_SECRET } = process.env;
    const token = jwt.sign(
      { _id: userAuth._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, {
      maxAge: '604800',
      httpOnly: true,
    }).status(STATUS_CODE.OK_CODE)
      .send({ token, message: 'Авторизация успешна' });
  } catch (err) {
    return next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход из системы' });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User
    .findById(_id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(STATUS_CODE.OK_CODE).send({ user });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  if (userId) {
    User.findByIdAndUpdate(userId, { name, email }, {
      runValidators: true,
      new: true,
    })
      .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
      .then((user) => res.status(STATUS_CODE.OK_CODE).send({ user }))
      .catch((err) => {
        if (err.code === STATUS_CODE.MONGO_DUPLICATE_ERROR_CODE) {
          return next(new ConflictError('Пользователь с указанным email уже существует'));
        } if (err.name === 'CastError') {
          return next(new BadRequestError('Некорректный _id пользователя'));
        } if (err.name === 'ValidationError') {
          const errorMessage = Object.values(err.errors).map((error) => error.message).join('. ');
          return next(new BadRequestError(`Переданы некорректные данные при обновлении. ${errorMessage}`));
        }
        return next(err);
      });
  }
};

module.exports = {
  createUser,
  updateUser,
  login,
  logout,
  getCurrentUser,
};
