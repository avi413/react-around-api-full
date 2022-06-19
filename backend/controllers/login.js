const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
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