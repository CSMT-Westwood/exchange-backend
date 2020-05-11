const mongoose = require("mongoose");

/*
OfferRequest model
title: the title of the post
description: the description of the post
type: "offer" / "request"
tag: "note" / "textbook" / "skill"
course: course related to
author: author's user ID
date_published: publication date of the post
*/

const OfferRequestSchema = mongoose.Schema({
    title: {type: String, default: ""},
    description: {type: String, default: ""},
    type: String,
    tag: String,
    course: {type: String, default: null },
    author: String,
    date_published: Date,
});

module.exports = mongoose.model("OfferRequest", OfferRequestSchema);
