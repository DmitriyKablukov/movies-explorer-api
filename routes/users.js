const router = require('express').Router();
const userController = require('../controllers/users');

const { validationUpdateUser } = require('../middlewares/validation');

router.get('/me', userController.getCurrentUser);
router.patch('/me', validationUpdateUser, userController.updateUser);

module.exports = router;
