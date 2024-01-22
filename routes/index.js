const express = require('express');
const router = require('express').Router();
const userController = require('../controllers/users');
const { validationSignIn, validationSignUp } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validationSignIn, userController.login);
router.post('/signup', validationSignUp, userController.createUser);

router.use(auth);

router.post('/signout', userController.logout);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Ошибка в написании пути'));
});
router.use(express.json());

module.exports = router;
