const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    default: 'http://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      // describe the validate feature
      validator(value) {
        // validator is a data validation feature. v is the age value
        const regex = /^(http|https?):\/\/+(www\.)?[.a-z0-9\s]{3,}\.[a-z]{2,3}(\/#?[.a-z0-9\s])?/;
        return regex.test(value);
      },
      message: 'Must be a Valid URL', // when the validator returns false, this message will be displayed
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // describe the validate feature
      validator(value) {
        // validator is a data validation feature. v is the age value
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: 'Must be a Valid email address', // when the validator returns false, this message will be displayed
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
