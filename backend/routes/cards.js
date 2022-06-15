const router = require('express').Router(); // creating a router
const {
  getCards,
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
  cardExist,
} = require('../controllers/cards');

router.get('/', getCards);
router.get('/:id', getCard);
router.post('/', createCard);
router.delete('/:id', cardExist, deleteCard);
router.put('/:id/likes', cardExist, likeCard);
router.delete('/:id/likes', cardExist, dislikeCard);

module.exports = router; // exporting the router
