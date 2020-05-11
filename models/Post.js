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
    title: {type: String, default: ""},
    description: {type: String, default: ""},
    type: String,
    tag: String,
    course: {type: String, default: null },
    author: String,
    publication_date: Date,
});

module.exports = mongoose.model("Post", PostSchema);
