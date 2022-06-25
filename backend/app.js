const cors = require('cors');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const cards = require('./routes/cards');
const users = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://0.0.0.0:27017/aroundb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = express();
    app.disable('etag');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(helmet());

    app.use(cors());

    app.use(requestLogger);

    app.post(
      '/signin',
      celebrate({
        body: Joi.object().keys({
          email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net'] },
          }),
          password: Joi.string().required().min(2),
        }),
      }),
      login,
    );
    app.post(
      '/signup',
      celebrate({
        body: Joi.object().keys({
          email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net'] },
          }),
          password: Joi.string().required().min(2),
        }),
      }),
      createUser,
    );

    app.use('/users', auth, users);
    app.use('/cards', auth, cards);

    app.get('*', (req, res) => {
      res.status(404).send({ message: 'Requested resource not found' });
    });
    app.post('*', (req, res) => {
      res.status(404).send({ message: 'Requested resource not found' });
    });

    // error handlers
    app.use(errors()); // celebrate error handler

    app.use((err, req, res, next) => {
      res.status(err.statusCode).send({ message: err.message });
    });

    app.listen(PORT, () => {
      console.warn(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
