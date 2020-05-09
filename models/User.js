const mongoose = require("mongoose");

//a model for user
const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  preferences: Array,
  info: {
    num_of_followers: Number,
    last_login: Date,
    date_of_creation: { type: Date, default: Date.now }
  }
});

module.exports = mongoose.model("User", UserSchema);
