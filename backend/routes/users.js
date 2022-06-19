const router = require('express').Router(); // creating a router
const {
  getMe,
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');


router.get('/me', getMe);
router.get('/', getUsers);
router.get('/:id', getUser);

router.patch('/me/:id', updateUser);
router.patch('/me/avatar/:id', updateAvatar);
module.exports = router;
