const mongoose = require("mongoose");

/*
Post model
title: the title of the post
description: the description of the post
type: "offer" / "request"
tag: "note" / "textbook" / "skill"
course: course related to
author: author's user ID
publication_date: publication date of the post
*/

const PostSchema = mongoose.Schema({
    typeOfPost: Number,
    typeOfItem: Number,
    course: String,
    itemName: String,
    condition: Number,
    description: String,
    link: String,
    fulfilled: { type: Number, default: 0 },
    author: String,
    publication_date: Date,
    clients: [String],
});

PostSchema.index({ course: "text", itemName: "text" });

module.exports = mongoose.model("Post", PostSchema);
