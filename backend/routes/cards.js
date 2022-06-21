const router = require('express').Router(); // creating a router
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
  cardExist,
} = require('../controllers/cards');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

router.get('/', getCards);
router.get('/:id', getCard);

router.post('/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
      owner: Joi.string().required().min(2),
    }),
  }),
  createCard
);

router.delete('/:id', cardExist, deleteCard);
router.put('/:id/likes', cardExist, likeCard);
router.delete('/:id/likes', cardExist, dislikeCard);

module.exports = router; // exporting the router
