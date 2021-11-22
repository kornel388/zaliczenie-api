const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
    minLength: 5,
  },
  password: {
    type: String,
    required: true,
  },
  comment: { type: String, required: false },
  creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
