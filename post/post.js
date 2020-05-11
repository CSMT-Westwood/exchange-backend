/*
API for posts related requests
*/
const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); //get model
const loginRequired = require("../verifyToken"); //verifyToken.js
const validation = require("./input_validations");

// FOR TESTING PURPOSES // FOR TESTING PURPOSES // FOR TESTING PURPOSES
// Get all posts
router.get("/", async(req, res) => {
    const allPosts = await Post.find();
    res.send(allPosts);
})
// Delete all posts
router.delete("/", async (req, res) => {
    try {
        await Post.deleteMany({});
        res.status(418).send("collection emptied");
    } catch (err) {
        res.json({ message: err });
    }
});

// Creating a new post
router.post("/new", loginRequired, async (req, res) => {
    // validate input
    req.body.type = req.body.type.toLowerCase();
    req.body.course = req.body.course.split(" ").join("").toLowerCase();
    const error = validation.NewPostSchema.validate(req.body).error;
    if (error) {
        return res.status(400).send(error.details[0].message); //send message if input is invalid
    }

    // create a new post
    const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type.toLowerCase(),
        tag: req.body.tag.toLowerCase(),
        course: req.body.course,
        author: req.user._id,
        publication_date: Date.now()
    });

    // save the new object
    try {
        const createdPost = await newPost.save();
        res.status(200).send("Post created");
    } catch (err) {
        res.json({ message: err });
    }
})

module.exports = router;
