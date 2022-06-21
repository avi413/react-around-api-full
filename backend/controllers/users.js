const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const isValid = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: err.message });
  }
  return res.status(500).send({ message: err.message });
};


module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
          return res.status(401).send({ message: 'Incorrect email or password' });

      }
      // user.password is the hash from the database
      return bcrypt.compare(password, user.password)
        .then((matched) => {

            if (!matched) {
              return res.status(401).send({ message: 'Incorrect email or password' });
            }
            // successful authentication
            const token = jwt.sign({ _id: user._id },NODE_ENV === 'production' ? JWT_SECRET : 'not-so-secret-string', {
              expiresIn: '7d',
            });
            res.send({ token });

         })
        .catch((err) => {
           res.status(401).send({ message: err.message });
         });
        })
      }

module.exports.getUsers = (req, res) => {
  User.find({})
    // return the found data to the user
    .then((users) => {
      if (!Object.keys(users).length) {
        res.status(404).send({ message: 'No result found' });
      }
      res.send({ data: users });
    })
    // if the record was not found, display an error message
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    return (
      User.findById(req.params.id)
        // return the found data to the user
        .then((user) => {
          if (!Object.keys(user).length) {
            res.status(404).send({ message: 'No result found' });
          }
          res.send({ data: user });
        })
        .catch((err) => res.status(500).send({ message: err.message }))
    );
  }
  return res.status(400).send({ message: 'Please provide correct id' });
};

module.exports.getMe = (req, res) => {
    return (
      User.findById(req.user._id)
        // return the found data to the user
        .then((user) => {
          if (!Object.keys(user).length) {
            res.status(404).send({ message: 'No result found' });
          }
          res.send({ data: user });
        })
        .catch((err) => res.status(500).send({ message: err.message }))
    );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
  .then(hash =>  User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send({ data: user }))
    .catch((err) => isValid(err, res));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => isValid(err, res));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => isValid(err, res));
};
