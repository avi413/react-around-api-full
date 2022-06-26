const router = require('express').Router(); // creating a router
const { NotFoundError } = require('../middlewares/errors/errors');

const {
  getMe,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/me', getMe);
router.get('/', getUsers);
router.get('/:id', getUser);

router.get('*', (req, res) => {
  throw new NotFoundError('Requested resource not found' );
 });


router.patch('/me/:id', updateUser);
router.patch('/me/avatar/:id', updateAvatar);

router.patch('*', (req, res) => {
  throw new NotFoundError('Requested resource not found' );
 });

module.exports = router;
