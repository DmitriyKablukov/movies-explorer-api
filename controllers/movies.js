const Movie = require('../models/movie');
const STATUS_CODE = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/NoAccessError');

const getYourMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(STATUS_CODE.OK_CODE).send({ movies }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director,
    duration, year,
    description, image,
    trailerLink, thumbnail,
    movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(STATUS_CODE.CREATE_CODE).send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const removeMovie = () => {
    Movie.findByIdAndDelete(req.params.movieId)
      .then(() => res.status(STATUS_CODE.OK_CODE).send({ message: 'Фильм успешно удален' }))
      .catch(next);
  };
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) next(new NotFoundError('Передан несуществующий _id фильма'));
      if (req.user._id === movie.owner.toString()) {
        return removeMovie();
      }
      return next(new ForbiddenError('Вы не можете удалять фильмы других пользователей'));
    })
    .catch(next);
};

module.exports = {
  getYourMovies,
  createMovie,
  deleteMovie,
};
