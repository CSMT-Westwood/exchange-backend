const mongoose = require("mongoose");

//a model for user
const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    preferences: [String],
    info: {
        num_of_followers: { type: Number, default: 0 },
        last_login: { type: Date, default: Date.UTC(2000, 1, 1, 0, 0, 0, 0) },
        date_of_creation: { type: Date, default: Date.now },
    },
    posts: [String],
});

module.exports = mongoose.model("User", UserSchema);
