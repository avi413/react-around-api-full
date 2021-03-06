const cors = require('cors');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { NotFoundError } = require('./middlewares/errors/errors');
const { limiter  } = require('./middlewares/limiter');
const usersAouth = require('./routes/usersAouth');
const cards = require('./routes/cards');
const users = require('./routes/users');

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
    app.use(limiter);
    app.use(requestLogger);

    app.use('/', usersAouth);
    app.use('/users', auth, users);
    app.use('/cards', auth, cards);

    app.get('*', (req, res) => {
     throw new NotFoundError('Requested resource not found' );
    });

    app.post('*', (req, res) => {
      throw new NotFoundError('Requested resource not found' );
    });

    // error handlers
    app.use(errors()); // celebrate error handler

    app.use((err, req, res, next) => {
      const { statusCode = 500, message } = err;
      res.status(statusCode).send({
        // check the status and display a message based on it
        message: statusCode === 500 && !message
          ? 'An error occurred on the server'
          : message
      });
    });

    app.listen(PORT, () => {
      console.warn(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
