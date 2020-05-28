const mongoose = require("mongoose");

/*
Notification type numbers:
0: welcome. Appears when first sign up.
Client accepts posts:
1: a client has responded to your post(offer/request)
2: You (as a client) have accepted a post. Please wait for response from host.
Host accepts:
3: You (as a host) have accepted a client. The post is fulfilled.
4: You (as a client) have been accepted. 
5. The client did not select you(rejected). The post is fulfilled.
*/
const NotificationSchema = mongoose.Schema({
    activity_date: { type: Date, default: Date.now },
    unread: { type: Boolean, default: true },
    recipient: String,
    type: Number,
    message: String,
    relatedPost: String,
    relatedUser: String
});

module.exports = mongoose.model("Notification", NotificationSchema);