const router = require('express').Router();
const moviesController = require('../controllers/movies');

const { validationCreateMovie, validationMovieId } = require('../middlewares/validation');

router.get('/', moviesController.getYourMovies);
router.post('/', validationCreateMovie, moviesController.createMovie);
router.delete('/:movieId', validationMovieId, moviesController.deleteMovie);

module.exports = router;
