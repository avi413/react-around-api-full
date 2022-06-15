const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    // return the found data to the card
    .then((card) => {
      if (!Object.keys(card).length) {
        return res.status(404).send({ message: 'No result found' });
      }
      return res.send({ data: card });
    })
    // if the record was not found, display an error message
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getCard = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    Card.findById(req.params.id)
      .then((card) => {
        // if the record was not found, display an error message
        if (!card) return res.status(404).send({ message: 'No result found' });
        // return the found data to the card
        return res.send({ data: card });
      })
      .catch((err) => res.status(500).send({ message: err }));
  } else {
    // bad request
    res.status(400).send({ message: 'Please provide correct id' });
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

module.exports.deleteCard = (req, res) => Card.findByIdAndRemove(req.params.id)
  .then((card) => res.send({ data: card }))
  .catch((err) => res.status(500).send({ message: err.message }));

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch((err) => res.status(500).send({ message: err }));

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // remove _id from the array
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
          return res.status(404).send({ message: 'record not found' });
        }
        return next();
      })
      .catch((err) => res.status(500).send({ message: err }));
  } else {
    // bad request
    res.status(400).send({ message: 'Please provide correct id' });
  }
};
