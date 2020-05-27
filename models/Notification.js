const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
    activity_date: { type: Date, default: Date.now },
    unread: { type: Boolean, default: true },
    recipient: String,
    type: Number,
    relatedPost: String,
    relatedUser: String
});

module.exports = mongoose.model("Notification", NotificationSchema);