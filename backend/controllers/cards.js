const mongoose = require('mongoose');
const Card = require('../models/card');
const error = require('../middlewares/errors/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    // return the found data to the card
    .then((card) => {
      if (!Object.keys(card).length) {
        throw new error.NotFoundError('No result found');
      }
      return res.send({ data: card });
    })
    // if the record was not found, display an error message
    .catch(next);
};

module.exports.getCard = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    Card.findById(req.params.id)
      .then((card) => {
        // if the record was not found, display an error message
        if (!card) throw new error.NotFoundError('No result found');
        return res.send({ data: card });
      })
      .catch(next);
  } else {
    // bad request
    throw new error.BadRequest('Please provide correct id');
  }
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
module.exports.deleteCard = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    Card.findById(req.params.id)
      .then((card) => {
        const ownerId = card.owner.toString();
        if (req.user._id === ownerId) {
          Card.findByIdAndRemove(req.params.id)
            .then((data) => res.send({ data }))
            .catch((err) => res.status(500).send({ message: err.message }));
        } else {
          throw new error.ForbiddenError('Can\'t delete other users cards');
        }
      })
      .catch(next);
  } else {
    // bad request
    throw new error.BadRequest('Please provide correct id');
  }
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));

module.exports.cardExist = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    Card.findById(req.params.id)
      .then((card) => {
        // if the record was not found, display an error message
        if (!card) {
          throw new error.NotFoundError('record not found');
        }
        return next();
      })
      .catch(next);
  } else {
    // bad request
    throw new error.BadRequest('Please provide correct id');
  }
};
