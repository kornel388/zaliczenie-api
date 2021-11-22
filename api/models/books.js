const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  title: {
    type: String,
    required: true,
    minLength: 5,
  },
  author: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  subject: { type: String, required: false },
});

module.exports = mongoose.model("Book", bookSchema);
