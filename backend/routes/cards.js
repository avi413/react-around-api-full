const router = require('express').Router(); // creating a router
const { celebrate, Joi } = require('celebrate');
const { NotFoundError } = require('../middlewares/errors/errors');

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

router.get('*', (req, res) => {
  throw new NotFoundError('Requested resource not found' );
 });

router.post(
'/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
      owner: Joi.string().required().min(2),
    }),
  }),
  createCard,
);

router.post('*', (req, res) => {
  throw new NotFoundError('Requested resource not found' );
 });

router.delete('/:id', cardExist, deleteCard);
router.delete('/:id/likes', cardExist, dislikeCard);

router.delete('*', (req, res) => {
  throw new NotFoundError('Requested resource not found' );
 });

router.put('/:id/likes', cardExist, likeCard);

router.put('*', (req, res) => {
  throw new NotFoundError('Requested resource not found' );
 });

module.exports = router; // exporting the router
