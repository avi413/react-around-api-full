const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cards = require('./routes/cards');
const users = require('./routes/users');

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

    app.use((req, res, next) => {
      req.user = {
        _id: '628e9bdc6e008305115bb12f', // paste the _id of the test user created in the previous step
      };
      next();
    });

    app.use('/users', users);
    app.use('/cards', cards);

    app.get('*', (req, res) => {
      res.status(404).send({ message: 'Requested resource not found' });
    });

    app.listen(PORT, () => {
      console.warn(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
