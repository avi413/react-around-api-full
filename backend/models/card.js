const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      // describe the validate feature
      validator(value) {
        // validator is a data validation feature. v is the age value
        return /^(http|https?):\/\/+(www\.)?[a-z0-9\s]{3,}\.[a-z]{2,3}(\/#?[a-z0-9\s])?/.test(
          value,
        );
      },
      message: 'Must be a Valid URL', // when the validator returns false, this message will be displayed
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: {},
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
